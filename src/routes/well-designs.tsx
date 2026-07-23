import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { Wrench, Play, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/well-designs")({
  head: () => ({
    meta: [
      { title: "Automated Well Designs — WDPGS" },
      { name: "description", content: "Automated well design generation from templates and EDM inputs." },
    ],
  }),
  component: WellDesignsPage,
});

const seedDesigns = [
  { id: "AWD-001", well: "NK-224", template: "Development Wells v3.2", generated: "2026-07-16", status: "Ready", checks: "pass" },
  { id: "AWD-002", well: "MB-118", template: "Multi-Well Pad v2.1", generated: "2026-07-14", status: "Draft", checks: "warn" },
  { id: "AWD-003", well: "WWI-X10-3", template: "Injector Template v1.4", generated: "2026-07-10", status: "Ready", checks: "pass" },
  { id: "AWD-004", well: "EXPL-27-2", template: "Exploration Template v1.0", generated: "2026-07-08", status: "Review", checks: "fail" },
];

function WellDesignsPage() {
  const [designs] = useState(seedDesigns);
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Automated Well Designs"
        subtitle="Generate trajectory and casing designs from templates and offset data. Advisory only — Engineering approval remains off-platform."
        actions={
          <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" /> New Auto-Design
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { l: "Auto-designs generated", v: 18, t: "blue" },
          { l: "Ready for review", v: 6, t: "green" },
          { l: "Warnings", v: 3, t: "orange" },
          { l: "Failed engineering checks", v: 1, t: "red" },
        ].map(k => (
          <Panel key={k.l} className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{k.v}</span>
              <StatusTag tone={k.t as any}>live</StatusTag>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="text-sm font-semibold">Generated Well Designs</div>
          <button className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5">
            <Play className="h-3.5 w-3.5" /> Run Engineering Checks
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
            <tr>{["ID","Well","Template","Generated","Engineering Checks","Status",""].map(h => (
              <th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {designs.map(d => (
              <tr key={d.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-primary">{d.id}</td>
                <td className="px-4 py-3 font-medium">{d.well}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.template}</td>
                <td className="px-4 py-3">{d.generated}</td>
                <td className="px-4 py-3">
                  {d.checks === "pass" ? (
                    <StatusTag tone="green"><CheckCircle2 className="h-3 w-3" /> Pass</StatusTag>
                  ) : d.checks === "warn" ? (
                    <StatusTag tone="orange"><AlertTriangle className="h-3 w-3" /> Warn</StatusTag>
                  ) : (
                    <StatusTag tone="red"><AlertTriangle className="h-3 w-3" /> Fail</StatusTag>
                  )}
                </td>
                <td className="px-4 py-3"><StatusTag tone={d.status === "Ready" ? "green" : d.status === "Review" ? "yellow" : "grey"}>{d.status}</StatusTag></td>
                <td className="px-4 py-3 text-right"><button className="text-primary hover:underline">Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <p className="mt-3 text-[10px] text-muted-foreground italic">
        Automated designs are advisory drafts based on template rules and offset data — final approval rests with Engineering and Gate Keeper authorities.
      </p>
    </div>
  );
}