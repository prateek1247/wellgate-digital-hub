import { createFileRoute } from "@tanstack/react-router";
import { WDPGS_MANUAL, DSP_HISTORY } from "@/lib/assistant-knowledge";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: Msg[]; mode?: string };
        const messages = (body.messages ?? []).filter(m => typeof m.content === "string").slice(-30);
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI is not configured.", { status: 500 });

        const instructions =
          body.mode === "history"
            ? `You are the WDPGS Assistant. Summarise previous DSP information for KOC projects using ONLY this data (JSON):\n${JSON.stringify(DSP_HISTORY)}\nReport number of versions, CPA questions raised and final closure comments when asked. Be concise, use markdown lists/tables. If data is missing say so.`
            : `You are the WDPGS Assistant. Answer questions using ONLY the WDPGS manual below. Be concise and practical, use markdown steps. If the manual does not cover it, say so. Never imply Gate Keeper decisions are automated.\n\n${WDPGS_MANUAL}`;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          signal: request.signal,
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-6-astra",
            instructions,
            input: messages.map(m => ({ role: m.role, content: m.content })),
            stream: true,
            store: false,
            reasoning: { effort: "low", summary: "auto" },
            include: ["reasoning.encrypted_content"],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          const msg =
            upstream.status === 429 ? "Too many requests — please wait a moment and try again."
            : upstream.status === 402 ? "AI credits are exhausted for this workspace."
            : `Assistant error (${upstream.status}). ${text.slice(0, 200)}`;
          return new Response(msg, { status: upstream.status || 500 });
        }

        const reader = upstream.body.getReader();
        const dec = new TextDecoder();
        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            let buf = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += dec.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  if (!line.startsWith("data:")) continue;
                  const data = line.slice(5).trim();
                  if (!data || data === "[DONE]") continue;
                  try {
                    const ev = JSON.parse(data);
                    if (ev.type === "response.output_text.delta" && ev.delta) controller.enqueue(enc.encode(ev.delta));
                    if (ev.type === "response.failed" || ev.type === "error") controller.enqueue(enc.encode("\n\n_The assistant could not complete this answer._"));
                  } catch { /* ignore partial */ }
                }
              }
            } finally {
              controller.close();
            }
          },
        });
        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
