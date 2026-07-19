import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusDot, StatusTag } from "@/components/shell";
import { projects } from "@/lib/mock";
import { LayoutGrid, List, Plus, ChevronRight, X, Check } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — WDPGS" }, { name: "description", content: "Manage well delivery projects across stage gates." }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [view, setView] = useState<"grid"|"list">("grid");
  const [wizard, setWizard] = useState(false);
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Projects"
        subtitle="All well delivery projects across SG1.0 → SG3.2. Open a project to enter its workspace."
        actions={
          <>
            <div className="flex rounded-md border border-border overflow-hidden">
              <button onClick={()=>setView("grid")} className={`h-9 w-9 grid place-items-center ${view==="grid"?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-secondary"}`}><LayoutGrid className="h-4 w-4"/></button>
              <button onClick={()=>setView("list")} className={`h-9 w-9 grid place-items-center ${view==="list"?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-secondary"}`}><List className="h-4 w-4"/></button>
            </div>
            <button onClick={()=>setWizard(true)} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/> Create New Project</button>
          </>
        }
      />

      {/* Filters */}
      <Panel className="p-4 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-xs">
          {["Asset","Directorate","Stage Gate","Responsible","Status","Risk","CPA Review"].map(f => (
            <select key={f} className="h-9 px-2 rounded-md bg-input/60 border border-border">
              <option>{f}: All</option>
            </select>
          ))}
        </div>
      </Panel>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(p => (
            <Panel key={p.code} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-mono text-primary">{p.code}</div>
                  <div className="text-base font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.asset} · {p.wells} wells</div>
                </div>
                <StatusTag tone={p.status==="On Track"?"green":p.status==="At Risk"?"orange":"red"}>{p.status}</StatusTag>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{p.type} · {p.directorate}</div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{width:`${p.progress}%`}}/>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg1}/>SG1</span>
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg2}/>SG2</span>
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg31}/>SG3.1</span>
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg32}/>SG3.2</span>
                </div>
                <button className="text-primary hover:underline flex items-center gap-0.5">Open <ChevronRight className="h-3 w-3"/></button>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                {["Code","Project","Asset","Type","Current Stage","Responsible","Target","Status",""].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map(p=>(
                <tr key={p.code} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{p.code}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.asset}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3">{p.currentStage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.responsible}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.targetDate}</td>
                  <td className="px-4 py-3"><StatusTag tone={p.status==="On Track"?"green":p.status==="At Risk"?"orange":"red"}>{p.status}</StatusTag></td>
                  <td className="px-4 py-3 text-right"><ChevronRight className="h-4 w-4 text-muted-foreground inline"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {wizard && <Wizard onClose={()=>setWizard(false)} />}
    </div>
  );
}

function Wizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const steps = ["Project Type","Basic Details","Select Template","Assign Teams","Workspace Auto-Create"];
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-3xl bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-base font-semibold">Create New Project</div>
            <div className="text-xs text-muted-foreground">Step {step} of 5 — {steps[step-1]}</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary"><X className="h-4 w-4"/></button>
        </div>
        <div className="px-6 pt-4">
          <div className="flex gap-1">
            {steps.map((_,i)=>(<div key={i} className={`h-1 flex-1 rounded ${i<step?"bg-primary":"bg-secondary"}`}/>))}
          </div>
        </div>
        <div className="p-6 min-h-[320px] text-sm">
          {step===1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Development Wells","Exploration Wells","Multi-well Pad","High-Priority Well Release","SG1 + SG2 Merged Candidate"].map(t=>(
                <label key={t} className="p-4 border border-border rounded-lg cursor-pointer hover:border-primary/40">
                  <input type="radio" name="ptype" className="mr-2 accent-[color:var(--accent-blue)]"/>{t}
                </label>
              ))}
            </div>
          )}
          {step===2 && (
            <div className="grid grid-cols-2 gap-3">
              {["Project name","Asset / field","Directorate","Budget year","Number of wells","Well type","Reservoir / target","Project start date","Target SG1 date","Target SG2 date","Target SG3.1 date","Target SG3.2 date"].map(f=>(
                <div key={f}>
                  <div className="text-[11px] text-muted-foreground mb-1">{f}</div>
                  <input className="w-full h-9 rounded-md bg-input/60 border border-border px-2"/>
                </div>
              ))}
            </div>
          )}
          {step===3 && (
            <div className="space-y-2">
              {["SG1 Development Template","SG2 Development Template","SG2 Exploration Template","SG3.1 Development Template","SG3.2 Procurement / Validation Template"].map(t=>(
                <label key={t} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/40">
                  <input type="checkbox" className="accent-[color:var(--accent-blue)]"/>{t}
                </label>
              ))}
            </div>
          )}
          {step===4 && (
            <div className="grid grid-cols-2 gap-3">
              {["Responsible team","Accountable team","Planning focal point","CPA owner","Gate Keeper","Supporting teams"].map(t=>(
                <div key={t}>
                  <div className="text-[11px] text-muted-foreground mb-1">{t}</div>
                  <select className="w-full h-9 rounded-md bg-input/60 border border-border px-2"><option>Select…</option></select>
                </div>
              ))}
            </div>
          )}
          {step===5 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-3">The workspace will be auto-created with:</div>
              {["DSP structure","Activity list","RACI matrix","Stage timeline","Comment tracker","Document sections","Gate review readiness checklist"].map(t=>(
                <div key={t} className="flex items-center gap-3 p-2.5 border border-border rounded-md bg-secondary/30 text-xs"><Check className="h-4 w-4 text-[color:var(--status-green)]"/>{t}</div>
              ))}
              <div className="mt-3 p-3 rounded-md border border-primary/25 bg-primary/10 text-xs">
                Reminder: WDPGS is an advisory platform. Auto-created content supports Gate Keeper review — it does not replace formal governance approvals.
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-between">
          <button disabled={step===1} onClick={()=>setStep(s=>s-1)} className="h-9 px-3 rounded-md border border-border text-xs disabled:opacity-40">Back</button>
          {step<5
            ? <button onClick={()=>setStep(s=>s+1)} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs">Continue</button>
            : <button onClick={onClose} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs">Create Workspace</button>}
        </div>
      </div>
    </div>
  );
}
