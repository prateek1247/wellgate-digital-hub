import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { allTeams, projects } from "@/lib/mock";
import { FilePlus, Edit3, Check, Plus, X, Eye } from "lucide-react";

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
  const [tab, setTab] = useState<"projects"|"dsp"|"activities"|"rules"|"reports">("projects");
  const [editProject, setEditProject] = useState<string | null>(null);
  const [dspBuilder, setDspBuilder] = useState<string | null>(null);
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
          ["reports","Reports"],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k as any)} className={`px-3 py-2 rounded-md border ${tab===k?"bg-primary/15 border-primary/30 text-primary":"border-border text-muted-foreground hover:bg-secondary"}`}>{l}</button>
        ))}
      </div>

      {tab==="projects" && (
        <>
          <Panel className="mb-4 p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="text-sm font-semibold">Project Template Assignments</div>
              <span className="text-[11px] text-muted-foreground">Edit which DSP template, Activity template, Validation rule set and RACI apply per project.</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
                <tr>{["Project","DSP Template","Activity Template","Validation Ruleset","RACI",""].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}</tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {projects.map(p=>(
                  <tr key={p.code} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{p.code} — {p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">DSP {p.currentDsp} v3.6</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.type} Activities v2.1</td>
                    <td className="px-4 py-3 text-muted-foreground">Standard Ruleset v1.4</td>
                    <td className="px-4 py-3 text-muted-foreground">Well Delivery RACI v2.0</td>
                    <td className="px-4 py-3 text-right"><button onClick={()=>setEditProject(p.code)} className="text-primary text-xs flex items-center gap-1 ml-auto"><Edit3 className="h-3 w-3"/>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
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
        </>
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
                  <td className="px-4 py-3 text-right"><button onClick={()=>setDspBuilder(d.name)} className="text-primary text-xs">Open builder</button></td>
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

      {tab==="reports" && <ReportsTab />}

      {editProject && <EditProjectTemplatesModal code={editProject} onClose={()=>setEditProject(null)} />}
      {dspBuilder && <DspBuilderModal name={dspBuilder} onClose={()=>setDspBuilder(null)} />}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-sm font-semibold">{title}</div>
          <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded hover:bg-secondary"><X className="h-4 w-4"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function EditProjectTemplatesModal({ code, onClose }: { code: string; onClose: () => void }) {
  const p = projects.find(x=>x.code===code)!;
  const dspOptions = ["DSP 1.0 v4.1","DSP 2.0 Development v3.6","DSP 2.0 Exploration v2.4","DSP 3.1 v5.0","DSP 3.2 v2.2"];
  const activityOptions = ["Development Wells Activities v2.1","Exploration Activities v1.8","Multi-Well Pad Activities v1.4"];
  const ruleOptions = ["Standard Ruleset v1.4","Strict Ruleset v2.0","Exploratory Ruleset v1.1"];
  const raciOptions = ["Well Delivery RACI v2.0","Exploration RACI v1.6"];
  return (
    <Modal title={`Edit templates — ${p.code} ${p.name}`} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["DSP Template", dspOptions],
          ["Activity Template", activityOptions],
          ["Validation Rule Set", ruleOptions],
          ["RACI", raciOptions],
        ].map(([label, opts]) => (
          <label key={label as string} className="text-xs">
            <div className="text-muted-foreground mb-1">{label as string}</div>
            <select className="h-9 w-full rounded border border-border bg-input/60 text-xs px-2">
              {(opts as string[]).map(o=><option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded border border-border text-xs">Cancel</button>
        <button onClick={onClose} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save</button>
      </div>
    </Modal>
  );
}

type BuilderSection = { id: string; title: string; team?: string; visibility: "all" | string; children?: BuilderSection[] };

function DspBuilderModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [sections, setSections] = useState<BuilderSection[]>([
    { id: "b1", title: "Executive Summary", visibility: "all" },
    { id: "b2", title: "Field Development Plan Addendum", visibility: "all", children: [
      { id: "b2a", title: "Options Ranking", visibility: "FD Team" },
    ]},
    { id: "b3", title: "Risk Register", team: "IE Team", visibility: "all" },
  ]);
  const [reports, setReports] = useState(["Gate Review Pack (PPT)","Assurance Summary (PDF)","Options Ranking Report (DOCX)"]);
  const [presentation, setPresentation] = useState("Gate Review Master Deck v3.2");

  const addSection = () => setSections([...sections, { id: `n${sections.length+1}`, title: "New section", visibility: "all" }]);
  const addSub = (id: string) => setSections(sections.map(s => s.id===id ? { ...s, children: [...(s.children??[]), { id: `${id}-c${(s.children?.length??0)+1}`, title: "New subsection", visibility: "all" }] } : s));
  const updateSection = (id: string, patch: Partial<BuilderSection>) => {
    const walk = (arr: BuilderSection[]): BuilderSection[] => arr.map(s => s.id===id ? { ...s, ...patch } : { ...s, children: s.children ? walk(s.children) : undefined });
    setSections(walk(sections));
  };

  const renderRow = (s: BuilderSection, depth=0) => (
    <div key={s.id}>
      <div className="flex items-center gap-2 py-1.5 border-b border-border/60" style={{ paddingLeft: 4 + depth*16 }}>
        <input value={s.title} onChange={e=>updateSection(s.id, { title: e.target.value })} className="flex-1 h-7 bg-transparent text-xs border-none outline-none"/>
        <select value={s.team ?? ""} onChange={e=>updateSection(s.id, { team: e.target.value || undefined })} className="h-7 w-40 rounded border border-border bg-input/60 text-[11px] px-1">
          <option value="">Team…</option>
          {allTeams.map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={s.visibility} onChange={e=>updateSection(s.id, { visibility: e.target.value })} className="h-7 w-36 rounded border border-border bg-input/60 text-[11px] px-1">
          <option value="all">Visible to all</option>
          {allTeams.map(t=><option key={t} value={t}>Only {t}</option>)}
        </select>
        <button onClick={()=>addSub(s.id)} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1"><Plus className="h-3 w-3"/>Sub</button>
        <Eye className="h-3 w-3 text-muted-foreground" />
      </div>
      {s.children?.map(c=>renderRow(c, depth+1))}
    </div>
  );

  return (
    <Modal title={`DSP Builder — ${name}`} onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections & Subsections</div>
            <button onClick={addSection} className="h-7 px-2 rounded bg-primary text-primary-foreground text-[11px] flex items-center gap-1"><Plus className="h-3 w-3"/>Add Section</button>
          </div>
          <div className="border border-border rounded-md">
            {sections.map(s=>renderRow(s))}
          </div>
        </div>
        <div className="space-y-4">
          <Panel className="p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Report Templates</div>
            <ul className="space-y-1.5 text-xs">
              {reports.map((r,i)=>(
                <li key={r} className="flex items-center gap-2">
                  <input value={r} onChange={e=>setReports(reports.map((x,j)=>j===i?e.target.value:x))} className="flex-1 h-7 rounded border border-border bg-input/60 px-2"/>
                  <button onClick={()=>setReports(reports.filter((_,j)=>j!==i))} className="text-muted-foreground text-[10px]">×</button>
                </li>
              ))}
            </ul>
            <button onClick={()=>setReports([...reports, "New report template"])} className="mt-2 h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1"><Plus className="h-3 w-3"/>Add report template</button>
          </Panel>
          <Panel className="p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Presentation Template</div>
            <input value={presentation} onChange={e=>setPresentation(e.target.value)} className="w-full h-8 rounded border border-border bg-input/60 text-xs px-2"/>
            <button className="mt-2 h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1"><Plus className="h-3 w-3"/>New Presentation Template</button>
          </Panel>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded border border-border text-xs">Close</button>
        <button onClick={onClose} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save Builder</button>
      </div>
    </Modal>
  );
}

function ReportsTab() {
  const [reports, setReports] = useState([
    { name: "Gate Review Pack", fmt: "PPT", scope: "All stages", owner: "Planning" },
    { name: "Assurance Summary", fmt: "PDF", scope: "SG3.1 / SG3.2", owner: "CPA" },
    { name: "Portfolio KPI Digest", fmt: "XLSX", scope: "All projects", owner: "Planning" },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  return (
    <Panel className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="text-sm font-semibold">Report Templates</div>
        <button onClick={()=>setReports([...reports, { name: "New report", fmt: "PDF", scope: "—", owner: "Planning" }])} className="h-8 px-3 rounded bg-primary text-primary-foreground text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>Add Report</button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
          <tr>{["Report","Format","Scope","Owner",""].map(h=><th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border text-xs">
          {reports.map((r,i)=>{
            const isEdit = editing===i;
            return (
              <tr key={i}>
                <td className="px-4 py-3">{isEdit ? <input value={r.name} onChange={e=>setReports(reports.map((x,j)=>j===i?{...x,name:e.target.value}:x))} className="h-7 px-2 rounded border border-border bg-input/60 w-full"/> : <span className="font-medium">{r.name}</span>}</td>
                <td className="px-4 py-3">{isEdit ? <select value={r.fmt} onChange={e=>setReports(reports.map((x,j)=>j===i?{...x,fmt:e.target.value}:x))} className="h-7 px-1 rounded border border-border bg-input/60">{["PPT","PDF","DOCX","XLSX"].map(f=><option key={f}>{f}</option>)}</select> : r.fmt}</td>
                <td className="px-4 py-3">{isEdit ? <input value={r.scope} onChange={e=>setReports(reports.map((x,j)=>j===i?{...x,scope:e.target.value}:x))} className="h-7 px-2 rounded border border-border bg-input/60 w-full"/> : r.scope}</td>
                <td className="px-4 py-3">{isEdit ? <input value={r.owner} onChange={e=>setReports(reports.map((x,j)=>j===i?{...x,owner:e.target.value}:x))} className="h-7 px-2 rounded border border-border bg-input/60 w-full"/> : r.owner}</td>
                <td className="px-4 py-3 text-right"><button onClick={()=>setEditing(isEdit?null:i)} className="text-primary text-xs flex items-center gap-1 ml-auto">{isEdit ? <Check className="h-3 w-3"/> : <Edit3 className="h-3 w-3"/>}{isEdit ? "Save" : "Edit"}</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
