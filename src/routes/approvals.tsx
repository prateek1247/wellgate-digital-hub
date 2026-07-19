import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { Calendar, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [{ title: "Approvals & Gate Reviews — WDPGS" }, { name: "description", content: "Prepare and schedule Gate Review meetings. Advisory workspace." }] }),
  component: Approvals,
});

const reviews = [
  { project:"NKDP", stage:"SG3.1", date:"2026-08-14", chair:"Gate Keeper — M. Al-Otaibi", status:"Scheduled", readiness:82 },
  { project:"MBP2", stage:"SG2.0", date:"2026-08-02", chair:"Gate Keeper — S. Al-Fahad", status:"Prep in progress", readiness:64 },
  { project:"WWI-X10", stage:"SG3.2", date:"2026-07-25", chair:"Gate Keeper — F. Al-Enezi", status:"Prep in progress", readiness:88 },
];

function Approvals(){
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Approvals / Gate Reviews"
        subtitle="Prepare gate review packs, readiness checklists and attendee lists. Formal decisions remain with the Gate Keeper."
      />

      <div className="p-3 mb-4 rounded-md border border-primary/25 bg-primary/10 text-xs">
        WDPGS supports gate review preparation only. It does not approve, reject or record a Gate Keeper's formal decision.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {reviews.map(r=>(
          <Panel key={r.project} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-mono text-primary">{r.project}</div>
                <div className="text-base font-semibold">{r.stage} Gate Review</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Calendar className="h-3 w-3"/>{r.date}</div>
              </div>
              <StatusTag tone={r.status==="Scheduled"?"green":"orange"}>{r.status}</StatusTag>
            </div>
            <div className="mt-4 text-xs">
              <div className="text-muted-foreground">Chair</div>
              <div className="mt-0.5">{r.chair}</div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                <span>Readiness</span><span className="tabular-nums">{r.readiness}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{width:`${r.readiness}%`}}/>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><FileText className="h-3.5 w-3.5"/>Prep pack</button>
              <button className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Users className="h-3.5 w-3.5"/>Attendees</button>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-5">
        <div className="text-sm font-semibold mb-3">Readiness Checklist — NKDP SG3.1</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ["Design Package finalized",true],
            ["Execution Plan reviewed",true],
            ["Draft Budget aligned",true],
            ["ITB Documentation issued",false],
            ["HSE Plan endorsed",true],
            ["Risk Register signed off",false],
            ["Assurance Report accepted",false],
            ["Stakeholder briefing complete",true],
          ].map(([l,ok])=>(
            <div key={l as string} className="flex items-center justify-between px-3 py-2 rounded border border-border">
              <span>{l as string}</span>
              <StatusTag tone={ok?"green":"orange"}>{ok?"Ready":"Pending"}</StatusTag>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
