import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { Check, X, AlertTriangle, FileDown, Send } from "lucide-react";

export const Route = createFileRoute("/cpa")({
  head: () => ({ meta: [{ title: "CPA Governance — WDPGS" }, { name: "description", content: "CPA assurance control tower for stage gate reviews." }] }),
  component: Cpa,
});

const queue = [
  { id:"DSP-2001", project:"NKDP", stage:"SG3.1", submitted:"2026-07-08", cpa:"A. Al-Sabah", days:8, due:"2026-07-22", status:"In Review", gaps:3 },
  { id:"DSP-2002", project:"MBP2", stage:"SG2.0", submitted:"2026-07-10", cpa:"H. Al-Rashed", days:6, due:"2026-07-24", status:"Clarification", gaps:5 },
  { id:"DSP-2003", project:"WWI-X10", stage:"SG3.2", submitted:"2026-07-01", cpa:"K. Al-Mutairi", days:15, due:"2026-07-18", status:"Ready for Gate", gaps:0 },
  { id:"DSP-2004", project:"EXPL-2027", stage:"SG2.0", submitted:"2026-07-11", cpa:"R. Al-Kandari", days:5, due:"2026-07-25", status:"In Review", gaps:2 },
  { id:"DSP-2005", project:"SKG UOR", stage:"SG1.0", submitted:"2026-07-14", cpa:"N. Al-Ajmi", days:2, due:"2026-07-28", status:"Received", gaps:1 },
];

function Cpa(){
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="CPA Governance Dashboard"
        subtitle="Assurance control tower — supports review readiness and traceability. Gate Keeper decisions remain a formal, off-platform authority."
        actions={<>
          <button className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><FileDown className="h-3.5 w-3.5"/>Generate Assurance Report</button>
          <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs">Generate Gate Review Pack</button>
        </>}
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
        {[
          {l:"DSPs Received", v:12, t:"blue"},
          {l:"Assigned Senior CPA", v:9, t:"blue"},
          {l:"Review Due ≤ 5 days", v:4, t:"orange"},
          {l:"Assurance Reports Ready", v:3, t:"green"},
          {l:"Open Clarifications", v:17, t:"yellow"},
          {l:"Upcoming Gate Reviews", v:2, t:"blue"},
        ].map(k=>(
          <Panel key={k.l} className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{k.v}</span>
              <StatusTag tone={k.t as any}>live</StatusTag>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="mb-5 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="text-sm font-semibold">CPA Work Queue</div>
          <div className="text-xs text-muted-foreground">Sorted by review due date</div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
            <tr>{["DSP ID","Project","Stage","Submitted","Senior CPA","Days","Due","Gaps","Status",""].map(h=>(<th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>))}</tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {queue.map(q=>(
              <tr key={q.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-primary">{q.id}</td>
                <td className="px-4 py-3 font-medium">{q.project}</td>
                <td className="px-4 py-3">{q.stage}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.submitted}</td>
                <td className="px-4 py-3">{q.cpa}</td>
                <td className="px-4 py-3 tabular-nums">{q.days}</td>
                <td className="px-4 py-3">{q.due}</td>
                <td className="px-4 py-3"><StatusTag tone={q.gaps===0?"green":q.gaps>3?"red":"orange"}>{q.gaps} gaps</StatusTag></td>
                <td className="px-4 py-3"><StatusTag tone={q.status==="Ready for Gate"?"green":q.status==="Clarification"?"yellow":"blue"}>{q.status}</StatusTag></td>
                <td className="px-4 py-3 text-right"><button className="text-primary hover:underline">Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Mandatory Validation Checklist</div>
          <ul className="space-y-2 text-xs">
            {[
              ["Mandatory deliverables submitted", true],
              ["HSE documents signed", true],
              ["Facility readiness validation", false],
              ["SG3.1 budget proposal alignment", true],
              ["Risk register completeness", false],
              ["Project charter completeness", true],
            ].map(([label,ok])=>(
              <li key={label as string} className="flex items-center justify-between border border-border rounded px-3 py-2">
                <span>{label as string}</span>
                {ok ? <span className="flex items-center gap-1 text-[color:var(--status-green)] text-[11px]"><Check className="h-3.5 w-3.5"/>OK</span>
                   : <span className="flex items-center gap-1 text-[color:var(--status-red)] text-[11px]"><X className="h-3.5 w-3.5"/>Gap</span>}
              </li>
            ))}
          </ul>
          <div className="mt-3 p-3 rounded-md border border-yellow-500/25 bg-[color:var(--status-yellow)]/5 text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-[color:var(--status-yellow)]"/> Validation exceptions detected. Advisory only — Gate Keeper decides.
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Clarification Tracker</div>
          <table className="w-full text-xs">
            <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
              <tr>{["ID","DSP Section","Type","Owner","Due","Status"].map(h=>(<th key={h} className="text-left py-1.5">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["CL-901","Risk Register","Data gap","FD Team","07-25","Awaiting"],
                ["CL-902","Options List","Rationale","FD Team","07-26","Responded"],
                ["CL-903","Budget","Alignment","Planning","07-28","Awaiting"],
                ["CL-904","HSE Compliance","Signature","HSE","07-24","Accepted"],
              ].map(r=>(
                <tr key={r[0]}>
                  <td className="py-2 font-mono text-primary">{r[0]}</td>
                  <td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td>
                  <td><StatusTag tone={r[5]==="Accepted"?"green":r[5]==="Responded"?"blue":"orange"}>{r[5]}</StatusTag></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-2">
            <button className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Send className="h-3.5 w-3.5"/>Send Clarification</button>
            <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs">Mark Ready for Gate Review</button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
