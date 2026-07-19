import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { FilePlus, Edit3, Check } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates & Rules — WDPGS" }, { name: "description", content: "Manage DSP templates, activity templates and validation rules." }] }),
  component: Templates,
});

const projectTemplates = [
  { name:"Development Wells Template", v:"3.2", status:"Active" },
  { name:"Exploration Wells Template", v:"2.1", status:"Active" },
  { name:"SG1 + SG2 Merge Template", v:"1.4", status:"Active" },
  { name:"Multi-Well Pad Template", v:"2.0", status:"Active" },
  { name:"High Priority Well Release Template", v:"1.1", status:"Draft" },
];

const dspTemplates = [
  { name:"DSP 1.0 Identification", sections:36, v:"4.1" },
  { name:"DSP 2.0 Concept — Development", sections:33, v:"3.6" },
  { name:"DSP 2.0 Concept — Exploration", sections:29, v:"2.4" },
  { name:"DSP 3.1 Define / Design", sections:11, v:"5.0" },
  { name:"DSP 3.2 Validation / Procurement", sections:11, v:"2.2" },
];

function Templates(){
  const [tab, setTab] = useState<"projects"|"dsp"|"activities"|"rules">("projects");
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Templates & Rules"
        subtitle="Manage reusable project, DSP and activity templates plus validation rules. Version-controlled for governance traceability."
        actions={<button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><FilePlus className="h-3.5 w-3.5"/>New Template</button>}
      />

      <div className="flex gap-1 mb-4 text-xs">
        {[
          ["projects","Project Templates"],
          ["dsp","DSP Template Builder"],
          ["activities","Activity Templates"],
          ["rules","Validation Rules"],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k as any)} className={`px-3 py-2 rounded-md border ${tab===k?"bg-primary/15 border-primary/30 text-primary":"border-border text-muted-foreground hover:bg-secondary"}`}>{l}</button>
        ))}
      </div>

      {tab==="projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projectTemplates.map(t=>(
            <Panel key={t.name} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Version {t.v} · Last modified 2026-07-05</div>
                </div>
                <StatusTag tone={t.status==="Active"?"green":"grey"}>{t.status}</StatusTag>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Edit3 className="h-3.5 w-3.5"/>Edit</button>
                <button className="h-8 px-3 rounded-md border border-border text-xs">Duplicate</button>
                <button className="h-8 px-3 rounded-md border border-border text-xs">Versions</button>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {tab==="dsp" && (
        <Panel className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>{["Template","Sections","Version","Created by","Last modified","Status",""].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dspTemplates.map(d=>(
                <tr key={d.name} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.sections}</td>
                  <td className="px-4 py-3 font-mono text-xs">v{d.v}</td>
                  <td className="px-4 py-3 text-muted-foreground">Planning Directorate</td>
                  <td className="px-4 py-3 text-muted-foreground">2026-06-30</td>
                  <td className="px-4 py-3"><StatusTag tone="green">Active</StatusTag></td>
                  <td className="px-4 py-3 text-right"><button className="text-primary text-xs">Open builder</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {tab==="activities" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {(["SG1.0","SG2.0","SG3.1","SG3.2"]).map(sg=>(
            <Panel key={sg} className="p-4">
              <div className="text-sm font-semibold mb-2">{sg} Standard Activities</div>
              <ul className="space-y-1.5 text-xs">
                {(sg==="SG1.0"?["Well Profile Identification","Preliminary SS X,Y","Surface X,Y","PAD Allocations","Site Visits","Anti-Collision Assessment"]
                : sg==="SG2.0"?["Feasibility Study","Options Ranking","Long Lead ID","Reservoir Simulation"]
                : sg==="SG3.1"?["Design Audit","Execution Plan","ITB Documentation","PEEP Run","RAROC Analysis"]
                : ["Procurement Readiness","HSE Validation","Facility Readiness","Assurance Closure"]).map(a=>(
                  <li key={a} className="px-2.5 py-1.5 rounded border border-border">{a}</li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}

      {tab==="rules" && (
        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Validation Rules Setup</div>
          <div className="space-y-2 text-sm">
            {[
              "Required fields completed on all DSP sections",
              "Required attachments uploaded",
              "HSE approval uploaded and countersigned",
              "Facility readiness validated by Facilities Team",
              "SG3.1 draft budget aligned with deliverables",
              "Previous stage comments closed",
              "CPA comments responded",
              "Risk register updated within 30 days",
            ].map(r=>(
              <div key={r} className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--status-green)]"/>{r}</span>
                <label className="text-xs flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[color:var(--accent-blue)]"/>Enforce</label>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-md border border-primary/25 bg-primary/10 text-xs">
            Validation rules provide readiness signals only. They do not authorize a stage gate decision.
          </div>
        </Panel>
      )}
    </div>
  );
}
