import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, History, X, Send, Loader2, HardHat } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "manual" | "history";

const suggestions: Record<Mode, string[]> = {
  manual: ["How do I close a stage gate?", "How do I import a trajectory from EDM?", "What do the gate status colours mean?"],
  history: ["Summarise previous DSPs for North Kuwait Jurassic Gas", "How many versions were issued at SG2?", "List final closure comments for all stages"],
};

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("manual");
  const [chats, setChats] = useState<Record<Mode, Msg[]>>({ manual: [], history: [] });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const messages = chats[mode];

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages, open]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const m = mode;
    const next: Msg[] = [...chats[m], { role: "user", content: q }];
    setChats(c => ({ ...c, [m]: [...next, { role: "assistant", content: "" }] }));
    setInput("");
    setBusy(true);
    const setLast = (content: string) =>
      setChats(c => { const arr = [...c[m]]; arr[arr.length - 1] = { role: "assistant", content }; return { ...c, [m]: arr }; });
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, mode: m }) });
      if (!res.ok || !res.body) { setLast(`⚠️ ${await res.text()}`); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setLast(acc);
      }
      if (!acc) setLast("⚠️ No answer was returned.");
    } catch {
      setLast("⚠️ Could not reach the assistant.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 h-12 pl-3 pr-4 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center gap-2 text-sm font-medium">
          <HardHat className="h-5 w-5" /> Ask WDPGS
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[400px] h-[580px] max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col">
          <div className="flex items-center gap-2 px-4 h-12 border-b border-border">
            <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 grid place-items-center"><HardHat className="h-4 w-4 text-primary" /></div>
            <div className="text-sm font-semibold flex-1">WDPGS Assistant</div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex gap-1 p-2 border-b border-border text-xs">
            <button onClick={() => setMode("manual")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border ${mode === "manual" ? "bg-primary/15 border-primary/30 text-primary" : "border-transparent text-muted-foreground hover:bg-secondary"}`}><BookOpen className="h-3.5 w-3.5" /> User Manual</button>
            <button onClick={() => setMode("history")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border ${mode === "history" ? "bg-primary/15 border-primary/30 text-primary" : "border-transparent text-muted-foreground hover:bg-secondary"}`}><History className="h-3.5 w-3.5" /> DSP History</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{mode === "manual" ? "Ask anything about using WDPGS — answers come from the user manual." : "Summarise previous DSPs: versions, CPA questions raised and closure comments."}</p>
                {suggestions[mode].map(s => (
                  <button key={s} onClick={() => send(s)} className="block w-full text-left text-xs px-3 py-2 rounded-md border border-border hover:bg-secondary">{s}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => m.role === "user" ? (
              <div key={i} className="ml-auto max-w-[85%] w-fit px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs">{m.content}</div>
            ) : (
              <div key={i} className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed [&_table]:text-[11px] [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5">
                {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="p-2 border-t border-border flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "manual" ? "Ask about the manual…" : "Ask about previous DSPs…"} className="flex-1 h-9 px-3 rounded-md bg-input/60 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
            <button disabled={busy || !input.trim()} className="h-9 w-9 grid place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
