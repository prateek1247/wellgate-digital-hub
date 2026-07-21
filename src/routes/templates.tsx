import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { allTeams, projects } from "@/lib/mock";
import { FilePlus, Edit3, Check, Plus, X, Copy, FileText, Image as ImageIcon, Table as TableIcon, Trash2, Filter } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates & Rules — WDPGS" }, { name: "description", content: "Manage DSP, activity, report and validation templates." }] }),
  component: Templates,
});

const STAGE_GATES = ["SG1", "SG2", "SG3.1"] as const;
type SG = typeof STAGE_GATES[number];

type ProjectTemplate = {
  id: string;
  name: string;
  v: string;
  status: "Active" | "Draft";
  dspBySG: Record<SG, string>;
  activityTemplate: string;
  validationRuleset: string;
  raci: string;
  reportsBySG: Record<SG, string[]>;
};

const initialProjectTemplates: ProjectTemplate[] = [
  {
    id:"pt-dev", name:"Development Wells Template", v:"3.2", status:"Active",
    dspBySG: { SG1:"DSP 1.0 v4.1", SG2:"DSP 2.0 Development v3.6", "SG3.1":"DSP 3.1 v5.0" },
    activityTemplate:"Development Wells Activities v2.1", validationRuleset:"Standard Ruleset v1.4", raci:"Well Delivery RACI v2.0",
    reportsBySG: { SG1:["SG1 Identification Report"], SG2:["Concept Options Report","Long Lead Item Report"], "SG3.1":["Design Pack","RAROC Summary"] },
  },
  {
    id:"pt-expl", name:"Exploration Wells Template", v:"2.1", status:"Active",
    dspBySG: { SG1:"DSP 1.0 v4.1", SG2:"DSP 2.0 Exploration v2.4", "SG3.1":"DSP 3.1 v5.0" },
    activityTemplate:"Exploration Activities v1.8", validationRuleset:"Exploratory Ruleset v1.1", raci:"Exploration RACI v1.6",
    reportsBySG: { SG1:["Exploration Prospect Note"], SG2:["Feasibility Report"], "SG3.1":["Design & PEEP Pack"] },
  },
  {
    id:"pt-multi", name:"Multi-Well Pad Template", v:"2.0", status:"Active",
    dspBySG: { SG1:"DSP 1.0 v4.1", SG2:"DSP 2.0 Development v3.6", "SG3.1":"DSP 3.1 v5.0" },
    activityTemplate:"Multi-Well Pad Activities v1.4", validationRuleset:"Standard Ruleset v1.4", raci:"Well Delivery RACI v2.0",
    reportsBySG: { SG1:["Pad Identification Report"], SG2:["Pad Concept Report"], "SG3.1":["Pad Design Pack"] },
  },
];

const dspTemplateOptions = ["DSP 1.0 v4.1","DSP 2.0 Development v3.6","DSP 2.0 Exploration v2.4","DSP 3.1 v5.0","DSP 3.2 v2.2"];
const activityTemplateOptions = ["Development Wells Activities v2.1","Exploration Activities v1.8","Multi-Well Pad Activities v1.4"];
const validationOptions = ["Standard Ruleset v1.4","Strict Ruleset v2.0","Exploratory Ruleset v1.1"];
const raciOptions = ["Well Delivery RACI v2.0","Exploration RACI v1.6"];

const initialDspTemplates = [
  { id:"dt-1", name:"DSP 1.0 Identification", sg:"SG1" as SG, sections:36, v:"4.1" },
  { id:"dt-2", name:"DSP 2.0 Concept — Development", sg:"SG2" as SG, sections:33, v:"3.6" },
  { id:"dt-3", name:"DSP 2.0 Concept — Exploration", sg:"SG2" as SG, sections:29, v:"2.4" },
  { id:"dt-4", name:"DSP 3.1 Define / Design", sg:"SG3.1" as SG, sections:11, v:"5.0" },
];

const initialReportTemplates = [
  { id:"r-1", name:"SG1 Identification Report",  sg:"SG1" as SG,   fmt:"PDF",  scope:"All", owner:"Planning" },
  { id:"r-2", name:"Concept Options Report",     sg:"SG2" as SG,   fmt:"PPT",  scope:"All", owner:"Planning" },
  { id:"r-3", name:"Long Lead Item Report",      sg:"SG2" as SG,   fmt:"XLSX", scope:"All", owner:"Procurement" },
  { id:"r-4", name:"Design Pack",                sg:"SG3.1" as SG, fmt:"PPT",  scope:"All", owner:"Engineering A" },
  { id:"r-5", name:"RAROC Summary",              sg:"SG3.1" as SG, fmt:"PDF",  scope:"All", owner:"Planning" },
];

type ActivityRow = { id: string; name: string; description: string; deliverables: string; inputs: string; responsible: string; accountable: string; consulted: string; informed: string; timeline: string };
type ActivityTemplate = { id: string; name: string; v: string; status: "Active"|"Draft"; activities: ActivityRow[] };

const initialActivityTemplates: ActivityTemplate[] = [
  { id:"at-1", name:"Development Wells Activities", v:"2.1", status:"Active", activities: [
    { id:"a1", name:"Well Profile Identification", description:"Establish target reservoir & profile.", deliverables:"Profile memo", inputs:"Field data", responsible:"IE", accountable:"IE Lead", consulted:"FD, RST", informed:"CPA", timeline:"2w" },
    { id:"a2", name:"Anti-Collision Assessment",   description:"Assess anti-collision risk vs existing wells.", deliverables:"AC Report", inputs:"Trajectory data", responsible:"Drilling", accountable:"D&W", consulted:"IE", informed:"CPA", timeline:"1w" },
  ]},
  { id:"at-2", name:"Exploration Activities", v:"1.8", status:"Active", activities: [
    { id:"a1", name:"Prospect Review", description:"Geological prospect review.", deliverables:"Prospect note", inputs:"Seismic", responsible:"PE1", accountable:"PE Lead", consulted:"PE2, PE3", informed:"CPA", timeline:"3w" },
  ]},
];

type ValidationRule = { id: string; text: string; severity: "info"|"warn"|"fail"; enforced: boolean };
type ValidationTemplate = { id: string; name: string; sg: SG; rules: ValidationRule[] };

const initialValidationTemplates: ValidationTemplate[] = [
  { id:"vt-1", name:"Standard Ruleset", sg:"SG2", rules:[
    { id:"vr1", text:"Required fields completed on all DSP sections", severity:"fail", enforced:true },
    { id:"vr2", text:"HSE approval uploaded and countersigned", severity:"fail", enforced:true },
    { id:"vr3", text:"Previous stage comments closed", severity:"warn", enforced:true },
  ]},
  { id:"vt-2", name:"Strict Ruleset", sg:"SG3.1", rules:[
    { id:"vr1", text:"SG3.1 draft budget aligned with deliverables", severity:"fail", enforced:true },
    { id:"vr2", text:"CPA comments responded", severity:"fail", enforced:true },
  ]},
];

function Templates(){
  const [tab, setTab] = useState<"assignments"|"projectTemplates"|"dsp"|"activities"|"rules"|"reports">("assignments");
  const [projectTemplates, setProjectTemplates] = useState<ProjectTemplate[]>(initialProjectTemplates);
  const [dspTemplates, setDspTemplates] = useState(initialDspTemplates);
  const [reportTemplates, setReportTemplates] = useState(initialReportTemplates);
  const [activityTemplates, setActivityTemplates] = useState<ActivityTemplate[]>(initialActivityTemplates);
  const [validationTemplates, setValidationTemplates] = useState<ValidationTemplate[]>(initialValidationTemplates);

  const [editAssignment, setEditAssignment] = useState<string | null>(null);
  const [editProjectTemplate, setEditProjectTemplate] = useState<string | null>(null);
  const [dspBuilder, setDspBuilder] = useState<string | null>(null);
  const [reportBuilder, setReportBuilder] = useState<string | null>(null);
  const [activityEditor, setActivityEditor] = useState<string | null>(null);
  const [validationEditor, setValidationEditor] = useState<string | null>(null);

  const duplicateProjectTpl = (id: string) => {
    const src = projectTemplates.find(t=>t.id===id)!;
    setProjectTemplates([...projectTemplates, { ...src, id:`${id}-copy-${Date.now()}`, name:`${src.name} (Copy)`, status:"Draft" }]);
  };
  const duplicateDsp = (id: string) => {
    const src = dspTemplates.find(t=>t.id===id)!;
    setDspTemplates([...dspTemplates, { ...src, id:`${id}-copy-${Date.now()}`, name:`${src.name} (Copy)`, v:"0.1" }]);
  };
  const duplicateActivity = (id: string) => {
    const src = activityTemplates.find(t=>t.id===id)!;
    setActivityTemplates([...activityTemplates, { ...src, id:`${id}-copy-${Date.now()}`, name:`${src.name} (Copy)`, v:"0.1", status:"Draft" }]);
  };
  const duplicateReport = (id: string) => {
    const src = reportTemplates.find(r=>r.id===id)!;
    setReportTemplates([...reportTemplates, { ...src, id:`${id}-copy-${Date.now()}`, name:`${src.name} (Copy)` }]);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Templates & Rules"
        subtitle="Manage reusable project, DSP, activity, report and validation templates. Version-controlled for governance traceability."
        actions={<button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><FilePlus className="h-3.5 w-3.5"/>New Template</button>}
      />

      <div className="flex gap-1 mb-4 text-xs flex-wrap">
        {[
          ["assignments","Project Template Assignments"],
          ["projectTemplates","Project Templates"],
          ["dsp","DSP Template Builder"],
          ["activities","Activity Templates"],
          ["rules","Validation Rules"],
          ["reports","Report Templates"],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k as any)} className={`px-3 py-2 rounded-md border ${tab===k?"bg-primary/15 border-primary/30 text-primary":"border-border text-muted-foreground hover:bg-secondary"}`}>{l}</button>
        ))}
      </div>

      {tab==="assignments" && (
        <Panel className="mb-4 p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="text-sm font-semibold">Project Template Assignments</div>
            <span className="text-[11px] text-muted-foreground">Assign the project template driving each project's DSP, Activity, Validation and RACI selections.</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>{["Project","Project Template","DSP Template (per SG)","Activity Template","Validation Ruleset","RACI",""].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {projects.map(p=>(
                <tr key={p.code} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{p.code} — {p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{projectTemplates[0].name}</td>
                  <td className="px-4 py-3 text-muted-foreground">SG1: DSP 1.0 · SG2: DSP 2.0 · SG3.1: DSP 3.1</td>
                  <td className="px-4 py-3 text-muted-foreground">{projectTemplates[0].activityTemplate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{projectTemplates[0].validationRuleset}</td>
                  <td className="px-4 py-3 text-muted-foreground">{projectTemplates[0].raci}</td>
                  <td className="px-4 py-3 text-right"><button onClick={()=>setEditAssignment(p.code)} className="text-primary text-xs flex items-center gap-1 ml-auto"><Edit3 className="h-3 w-3"/>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {tab==="projectTemplates" && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-muted-foreground">All project templates. Each defines a DSP template per SG1/SG2/SG3.1, an activity template, a validation ruleset, RACI, and one or more report templates per stage gate.</div>
            <button onClick={()=>setProjectTemplates([...projectTemplates, { id:`pt-new-${Date.now()}`, name:"New Project Template", v:"0.1", status:"Draft", dspBySG:{SG1:dspTemplateOptions[0],SG2:dspTemplateOptions[1],"SG3.1":dspTemplateOptions[3]}, activityTemplate:activityTemplateOptions[0], validationRuleset:validationOptions[0], raci:raciOptions[0], reportsBySG:{SG1:[],SG2:[],"SG3.1":[]}}])} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>Add Project Template</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projectTemplates.map(t=>(
              <Panel key={t.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-base font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">Version {t.v}</div>
                  </div>
                  <StatusTag tone={t.status==="Active"?"green":"grey"}>{t.status}</StatusTag>
                </div>
                <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                  {STAGE_GATES.map(sg=>(
                    <div key={sg}><span className="text-foreground font-medium">{sg}:</span> {t.dspBySG[sg]} · {t.reportsBySG[sg]?.length ?? 0} report{(t.reportsBySG[sg]?.length ?? 0)===1?"":"s"}</div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <button onClick={()=>setEditProjectTemplate(t.id)} className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Edit3 className="h-3.5 w-3.5"/>Edit</button>
                  <button onClick={()=>duplicateProjectTpl(t.id)} className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Copy className="h-3.5 w-3.5"/>Duplicate</button>
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}

      {tab==="dsp" && (
        <DspTemplatesTab
          items={dspTemplates}
          onOpen={setDspBuilder}
          onDuplicate={duplicateDsp}
          onAdd={()=>setDspTemplates([...dspTemplates, { id:`dt-${Date.now()}`, name:"New DSP Template", sg:"SG1", sections:0, v:"0.1" }])}
        />
      )}

      {tab==="activities" && (
        <ActivityTemplatesTab
          items={activityTemplates}
          onEdit={setActivityEditor}
          onDuplicate={duplicateActivity}
          onAdd={()=>setActivityTemplates([...activityTemplates, { id:`at-${Date.now()}`, name:"New Activity Template", v:"0.1", status:"Draft", activities:[] }])}
        />
      )}

      {tab==="rules" && (
        <ValidationRulesTab
          items={validationTemplates}
          setItems={setValidationTemplates}
          onOpen={setValidationEditor}
        />
      )}

      {tab==="reports" && (
        <ReportsTab
          reports={reportTemplates}
          setReports={setReportTemplates}
          onOpenBuilder={setReportBuilder}
          onDuplicate={duplicateReport}
          dspTemplates={dspTemplates}
        />
      )}

      {editAssignment && <EditAssignmentModal code={editAssignment} projectTemplates={projectTemplates} onClose={()=>setEditAssignment(null)} />}
      {editProjectTemplate && (
        <EditProjectTemplateModal
          template={projectTemplates.find(t=>t.id===editProjectTemplate)!}
          reportOptions={reportTemplates}
          onSave={(next)=>{ setProjectTemplates(projectTemplates.map(t=>t.id===next.id?next:t)); setEditProjectTemplate(null); }}
          onClose={()=>setEditProjectTemplate(null)}
        />
      )}
      {dspBuilder && <DspBuilderModal name={dspTemplates.find(d=>d.id===dspBuilder)?.name ?? dspBuilder} onClose={()=>setDspBuilder(null)} />}
      {reportBuilder && (
        <ReportBuilderModal
          report={reportTemplates.find(r=>r.id===reportBuilder)!}
          dspTemplates={dspTemplates}
          onClose={()=>setReportBuilder(null)}
        />
      )}
      {activityEditor && (
        <ActivityEditorModal
          template={activityTemplates.find(t=>t.id===activityEditor)!}
          onSave={(next)=>{ setActivityTemplates(activityTemplates.map(t=>t.id===next.id?next:t)); setActivityEditor(null); }}
          onClose={()=>setActivityEditor(null)}
        />
      )}
      {validationEditor && (
        <ValidationEditorModal
          template={validationTemplates.find(t=>t.id===validationEditor)!}
          onSave={(next)=>{ setValidationTemplates(validationTemplates.map(t=>t.id===next.id?next:t)); setValidationEditor(null); }}
          onClose={()=>setValidationEditor(null)}
        />
      )}
    </div>
  );
}

function Modal({ title, onClose, children, size="max-w-4xl" }: { title: string; onClose: () => void; children: ReactNode; size?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className={`w-full ${size} bg-card border border-border rounded-xl overflow-hidden max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-sm font-semibold">{title}</div>
          <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded hover:bg-secondary"><X className="h-4 w-4"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function SgFilter({ value, onChange }: { value: SG|"All"; onChange: (v: SG|"All")=>void }) {
  return (
    <div className="inline-flex items-center gap-1 text-[11px]">
      <Filter className="h-3 w-3 text-muted-foreground"/>
      <span className="text-muted-foreground">Stage Gate:</span>
      {(["All", ...STAGE_GATES] as const).map(o=>(
        <button key={o} onClick={()=>onChange(o)} className={`px-2 h-6 rounded border ${value===o?"bg-primary/15 border-primary/40 text-primary":"border-border text-muted-foreground hover:bg-secondary"}`}>{o}</button>
      ))}
    </div>
  );
}

function EditAssignmentModal({ code, projectTemplates, onClose }: { code: string; projectTemplates: ProjectTemplate[]; onClose: () => void }) {
  const p = projects.find(x=>x.code===code)!;
  const [projectTpl, setProjectTpl] = useState(projectTemplates[0].id);
  return (
    <Modal title={`Edit templates — ${p.code} ${p.name}`} onClose={onClose}>
      <label className="text-xs block mb-4">
        <div className="text-muted-foreground mb-1">Project Template</div>
        <select value={projectTpl} onChange={e=>setProjectTpl(e.target.value)} className="h-9 w-full rounded border border-border bg-input/60 text-xs px-2">
          {projectTemplates.map(t=><option key={t.id} value={t.id}>{t.name} · v{t.v}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["DSP Template (SG1)", dspTemplateOptions],
          ["DSP Template (SG2)", dspTemplateOptions],
          ["DSP Template (SG3.1)", dspTemplateOptions],
          ["Activity Template", activityTemplateOptions],
          ["Validation Rule Set", validationOptions],
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

function EditProjectTemplateModal({ template, reportOptions, onSave, onClose }: { template: ProjectTemplate; reportOptions: typeof initialReportTemplates; onSave: (t: ProjectTemplate)=>void; onClose: () => void }) {
  const [draft, setDraft] = useState<ProjectTemplate>(template);
  const updateSG = (sg: SG, dsp: string) => setDraft({ ...draft, dspBySG: { ...draft.dspBySG, [sg]: dsp }});
  const toggleReport = (sg: SG, r: string) => {
    const cur = draft.reportsBySG[sg] ?? [];
    const next = cur.includes(r) ? cur.filter(x=>x!==r) : [...cur, r];
    setDraft({ ...draft, reportsBySG: { ...draft.reportsBySG, [sg]: next }});
  };
  return (
    <Modal title={`Edit — ${draft.name}`} onClose={onClose} size="max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">Template Name</div>
          <input value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs"/>
        </label>
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">Version</div>
          <input value={draft.v} onChange={e=>setDraft({...draft, v:e.target.value})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs"/>
        </label>
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">Activity Template</div>
          <select value={draft.activityTemplate} onChange={e=>setDraft({...draft, activityTemplate:e.target.value})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs">
            {activityTemplateOptions.map(o=><option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">Validation Ruleset</div>
          <select value={draft.validationRuleset} onChange={e=>setDraft({...draft, validationRuleset:e.target.value})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs">
            {validationOptions.map(o=><option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">RACI</div>
          <select value={draft.raci} onChange={e=>setDraft({...draft, raci:e.target.value})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs">
            {raciOptions.map(o=><option key={o}>{o}</option>)}
          </select>
        </label>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">DSP Template & Reports by Stage Gate</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {STAGE_GATES.map(sg=>(
          <Panel key={sg} className="p-3">
            <div className="text-xs font-semibold mb-2">{sg}</div>
            <label className="text-[11px] block mb-3">
              <div className="text-muted-foreground mb-1">DSP Template</div>
              <select value={draft.dspBySG[sg]} onChange={e=>updateSG(sg, e.target.value)} className="h-8 w-full rounded border border-border bg-input/60 px-2 text-xs">
                {dspTemplateOptions.map(o=><option key={o}>{o}</option>)}
              </select>
            </label>
            <div className="text-[11px] text-muted-foreground mb-1">Reports (multiple)</div>
            <div className="space-y-1">
              {reportOptions.filter(r=>r.sg===sg).map(r=>(
                <label key={r.id} className="flex items-center gap-2 text-[11px]">
                  <input type="checkbox" checked={(draft.reportsBySG[sg] ?? []).includes(r.name)} onChange={()=>toggleReport(sg, r.name)} className="accent-[color:var(--accent-blue)]"/>
                  {r.name} <span className="text-muted-foreground">· {r.fmt}</span>
                </label>
              ))}
              {reportOptions.filter(r=>r.sg===sg).length===0 && <div className="text-[11px] text-muted-foreground italic">No report templates for {sg} yet.</div>}
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded border border-border text-xs">Cancel</button>
        <button onClick={()=>onSave(draft)} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save</button>
      </div>
    </Modal>
  );
}

function DspTemplatesTab({ items, onOpen, onDuplicate, onAdd }: { items: typeof initialDspTemplates; onOpen: (id:string)=>void; onDuplicate: (id:string)=>void; onAdd: ()=>void }) {
  const [sg, setSg] = useState<SG|"All">("All");
  const filtered = items.filter(d=>sg==="All" || d.sg===sg);
  return (
    <Panel className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm font-semibold">DSP Templates</div>
        <div className="flex items-center gap-3">
          <SgFilter value={sg} onChange={setSg}/>
          <button onClick={onAdd} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>Add DSP Template</button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
          <tr>{["Template","Stage Gate","Sections","Version","Status",""].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map(d=>(
            <tr key={d.id} className="hover:bg-secondary/30">
              <td className="px-4 py-3 font-medium">{d.name}</td>
              <td className="px-4 py-3"><StatusTag tone="blue">{d.sg}</StatusTag></td>
              <td className="px-4 py-3 text-muted-foreground">{d.sections}</td>
              <td className="px-4 py-3 font-mono text-xs">v{d.v}</td>
              <td className="px-4 py-3"><StatusTag tone="green">Active</StatusTag></td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={()=>onOpen(d.id)} className="text-primary text-xs">Open builder</button>
                <button onClick={()=>onDuplicate(d.id)} className="text-muted-foreground text-xs inline-flex items-center gap-1"><Copy className="h-3 w-3"/>Duplicate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

type BuilderBlock = { kind: "text"|"table"|"image"; content: string };
type BuilderSection = { id: string; title: string; team?: string; visibility: "all" | string; timeline?: string; writeup?: BuilderBlock[]; children?: BuilderSection[] };

function DspBuilderModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [sections, setSections] = useState<BuilderSection[]>([
    { id: "b1", title: "Executive Summary", visibility: "all", timeline:"1w", writeup:[{ kind:"text", content:"Default executive summary writeup…"}]},
    { id: "b2", title: "Field Development Plan Addendum", visibility: "all", timeline:"3w", writeup:[], children: [
      { id: "b2a", title: "Options Ranking", visibility: "FD Team", timeline:"2w", writeup:[]},
    ]},
    { id: "b3", title: "Risk Register", team: "IE Team", visibility: "all", timeline:"1w", writeup:[] },
  ]);
  const [sgFilter, setSgFilter] = useState<SG|"All">("All");
  const [editingWriteup, setEditingWriteup] = useState<string | null>(null);

  const addSection = () => setSections([...sections, { id: `n${sections.length+1}`, title: "New section", visibility: "all", writeup:[] }]);
  const addSub = (id: string) => walkUpdate(id, s => ({ ...s, children: [...(s.children??[]), { id: `${id}-c${(s.children?.length??0)+1}`, title: "New subsection", visibility: "all", writeup:[] }] }));
  const walkUpdate = (id: string, fn: (s: BuilderSection)=>BuilderSection) => {
    const walk = (arr: BuilderSection[]): BuilderSection[] => arr.map(s => s.id===id ? fn(s) : { ...s, children: s.children ? walk(s.children) : undefined });
    setSections(walk(sections));
  };
  const updateSection = (id: string, patch: Partial<BuilderSection>) => walkUpdate(id, s => ({ ...s, ...patch }));

  const findSection = (id: string, arr: BuilderSection[] = sections): BuilderSection | null => {
    for (const s of arr) { if (s.id===id) return s; if (s.children) { const f = findSection(id, s.children); if (f) return f; } }
    return null;
  };
  const editing = editingWriteup ? findSection(editingWriteup) : null;

  const renderRow = (s: BuilderSection, depth=0) => (
    <div key={s.id}>
      <div className="flex items-center gap-2 py-1.5 border-b border-border/60" style={{ paddingLeft: 4 + depth*16 }}>
        <input value={s.title} onChange={e=>updateSection(s.id, { title: e.target.value })} className="flex-1 h-7 bg-transparent text-xs border-none outline-none"/>
        <select value={s.team ?? ""} onChange={e=>updateSection(s.id, { team: e.target.value || undefined })} className="h-7 w-32 rounded border border-border bg-input/60 text-[11px] px-1">
          <option value="">Team…</option>
          {allTeams.map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={s.visibility} onChange={e=>updateSection(s.id, { visibility: e.target.value })} className="h-7 w-32 rounded border border-border bg-input/60 text-[11px] px-1">
          <option value="all">Visible to all</option>
          {allTeams.map(t=><option key={t} value={t}>Only {t}</option>)}
        </select>
        <input value={s.timeline ?? ""} onChange={e=>updateSection(s.id, { timeline: e.target.value })} placeholder="Timeline (e.g. 2w)" className="h-7 w-24 rounded border border-border bg-input/60 text-[11px] px-1"/>
        <button onClick={()=>setEditingWriteup(s.id)} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1"><FileText className="h-3 w-3"/>Writeup</button>
        <button onClick={()=>addSub(s.id)} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1"><Plus className="h-3 w-3"/>Sub</button>
      </div>
      {s.children?.map(c=>renderRow(c, depth+1))}
    </div>
  );

  return (
    <Modal title={`DSP Builder — ${name}`} onClose={onClose} size="max-w-6xl">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <SgFilter value={sgFilter} onChange={setSgFilter}/>
        <button onClick={addSection} className="h-7 px-2 rounded bg-primary text-primary-foreground text-[11px] flex items-center gap-1"><Plus className="h-3 w-3"/>Add Section</button>
      </div>
      <div className="border border-border rounded-md">
        {sections.map(s=>renderRow(s))}
      </div>
      <div className="mt-4 text-[10px] text-muted-foreground italic">Per-section timeline drives target dates when this template is applied to a project.</div>

      {editing && (
        <Modal title={`Writeup — ${editing.title}`} onClose={()=>setEditingWriteup(null)} size="max-w-3xl">
          <WriteupEditor
            blocks={editing.writeup ?? []}
            onChange={(blocks)=>updateSection(editing.id, { writeup: blocks })}
          />
          <div className="mt-4 flex justify-end">
            <button onClick={()=>setEditingWriteup(null)} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Done</button>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

function WriteupEditor({ blocks, onChange }: { blocks: BuilderBlock[]; onChange: (b: BuilderBlock[])=>void }) {
  const add = (kind: BuilderBlock["kind"]) => onChange([...blocks, { kind, content: kind==="text"?"Default paragraph text…":kind==="table"?"col1,col2\nA,B":"image.png" }]);
  const update = (i: number, content: string) => onChange(blocks.map((b,j)=>j===i?{...b, content}:b));
  const remove = (i: number) => onChange(blocks.filter((_,j)=>j!==i));
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={()=>add("text")} className="h-8 px-3 rounded border border-border text-xs flex items-center gap-1.5"><FileText className="h-3.5 w-3.5"/>Add text</button>
        <button onClick={()=>add("table")} className="h-8 px-3 rounded border border-border text-xs flex items-center gap-1.5"><TableIcon className="h-3.5 w-3.5"/>Add table</button>
        <button onClick={()=>add("image")} className="h-8 px-3 rounded border border-border text-xs flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5"/>Add image</button>
      </div>
      {blocks.length===0 && <div className="text-xs text-muted-foreground italic border border-dashed border-border rounded p-6 text-center">No default content yet. Add text, tables or image placeholders that this section will start with in every DSP built from this template.</div>}
      {blocks.map((b,i)=>(
        <div key={i} className="border border-border rounded p-3 relative">
          <div className="flex items-center justify-between mb-2">
            <StatusTag tone={b.kind==="text"?"blue":b.kind==="table"?"yellow":"green"}>{b.kind}</StatusTag>
            <button onClick={()=>remove(i)} className="text-muted-foreground hover:text-[color:var(--status-red)]"><Trash2 className="h-3.5 w-3.5"/></button>
          </div>
          <textarea value={b.content} onChange={e=>update(i, e.target.value)} className="w-full min-h-[80px] bg-input/60 border border-border rounded p-2 text-xs font-mono"/>
        </div>
      ))}
    </div>
  );
}

function ReportsTab({ reports, setReports, onOpenBuilder, onDuplicate, dspTemplates }: {
  reports: typeof initialReportTemplates; setReports: (r: typeof initialReportTemplates)=>void;
  onOpenBuilder: (id: string)=>void; onDuplicate: (id: string)=>void; dspTemplates: typeof initialDspTemplates;
}) {
  const [sg, setSg] = useState<SG|"All">("All");
  const [editing, setEditing] = useState<string | null>(null);
  const filtered = reports.filter(r=>sg==="All" || r.sg===sg);
  const addReport = () => setReports([...reports, { id:`r-${Date.now()}`, name:"New Report", sg: sg==="All"?"SG1":sg, fmt:"PDF", scope:"—", owner:"Planning" }]);

  return (
    <Panel className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm font-semibold">Report Templates</div>
        <div className="flex items-center gap-3">
          <SgFilter value={sg} onChange={setSg}/>
          <button onClick={addReport} className="h-8 px-3 rounded bg-primary text-primary-foreground text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>Add Report</button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
          <tr>{["Report","Stage Gate","Format","Scope","Owner",""].map(h=><th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border text-xs">
          {filtered.map(r=>{
            const isEdit = editing===r.id;
            const patch = (p: Partial<typeof r>) => setReports(reports.map(x=>x.id===r.id?{...x,...p}:x));
            return (
              <tr key={r.id}>
                <td className="px-4 py-3">{isEdit ? <input value={r.name} onChange={e=>patch({name:e.target.value})} className="h-7 px-2 rounded border border-border bg-input/60 w-full"/> : <span className="font-medium">{r.name}</span>}</td>
                <td className="px-4 py-3">{isEdit ? <select value={r.sg} onChange={e=>patch({sg:e.target.value as SG})} className="h-7 px-1 rounded border border-border bg-input/60">{STAGE_GATES.map(s=><option key={s}>{s}</option>)}</select> : <StatusTag tone="blue">{r.sg}</StatusTag>}</td>
                <td className="px-4 py-3">{isEdit ? <select value={r.fmt} onChange={e=>patch({fmt:e.target.value})} className="h-7 px-1 rounded border border-border bg-input/60">{["PPT","PDF","DOCX","XLSX"].map(f=><option key={f}>{f}</option>)}</select> : r.fmt}</td>
                <td className="px-4 py-3">{isEdit ? <input value={r.scope} onChange={e=>patch({scope:e.target.value})} className="h-7 px-2 rounded border border-border bg-input/60 w-full"/> : r.scope}</td>
                <td className="px-4 py-3">{isEdit ? <input value={r.owner} onChange={e=>patch({owner:e.target.value})} className="h-7 px-2 rounded border border-border bg-input/60 w-full"/> : r.owner}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={()=>onOpenBuilder(r.id)} className="text-primary text-xs">Open editor</button>
                  <button onClick={()=>setEditing(isEdit?null:r.id)} className="text-primary text-xs inline-flex items-center gap-1">{isEdit ? <Check className="h-3 w-3"/> : <Edit3 className="h-3 w-3"/>}{isEdit ? "Save" : "Edit"}</button>
                  <button onClick={()=>onDuplicate(r.id)} className="text-muted-foreground text-xs inline-flex items-center gap-1"><Copy className="h-3 w-3"/>Duplicate</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-5 py-3 border-t border-border text-[10px] text-muted-foreground">DSP templates available for report source sections: {dspTemplates.map(d=>d.name).join(" · ")}</div>
    </Panel>
  );
}

function ReportBuilderModal({ report, dspTemplates, onClose }: { report: typeof initialReportTemplates[number]; dspTemplates: typeof initialDspTemplates; onClose: () => void }) {
  const dspSections = useMemo(() => {
    // Mock sections & subsections from all DSP templates matching this report's SG.
    const match = dspTemplates.filter(d=>d.sg===report.sg);
    const base = match.length ? match : dspTemplates;
    return base.flatMap(d => [
      { dsp: d.name, section: "Executive Summary", sub: null as string|null },
      { dsp: d.name, section: "Field Development Plan Addendum", sub: "Options Ranking" },
      { dsp: d.name, section: "Risk Register", sub: null },
      { dsp: d.name, section: "HSE Compliance", sub: null },
      { dsp: d.name, section: "Budget Alignment", sub: "Long Lead Items" },
    ]);
  }, [report.sg, dspTemplates]);

  const [components, setComponents] = useState<{ id: string; label: string; team: string }[]>([
    { id:"c1", label:"Cover & Executive Summary", team:"Planning" },
  ]);
  const addComponent = (label: string) => setComponents([...components, { id:`c${Date.now()}`, label, team: allTeams[0] }]);
  const updateTeam = (id: string, team: string) => setComponents(components.map(c=>c.id===id?{...c, team}:c));
  const removeComponent = (id: string) => setComponents(components.filter(c=>c.id!==id));

  return (
    <Modal title={`Report Editor — ${report.name} (${report.sg})`} onClose={onClose} size="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Available DSP Sections & Subsections</div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
            {dspSections.map((s,i)=>(
              <div key={i} className="flex items-center justify-between py-1.5 text-[11px]">
                <div>
                  <span className="text-muted-foreground">{s.dsp} · </span>
                  <span>{s.section}{s.sub ? ` › ${s.sub}` : ""}</span>
                </div>
                <button onClick={()=>addComponent(`${s.section}${s.sub?` › ${s.sub}`:""}`)} className="h-6 px-2 rounded border border-border text-[10px] inline-flex items-center gap-1"><Plus className="h-3 w-3"/>Add</button>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Report Components (with responsible team)</div>
          <div className="space-y-2">
            {components.map(c=>(
              <div key={c.id} className="flex items-center gap-2 border border-border rounded p-2">
                <span className="flex-1 text-xs">{c.label}</span>
                <select value={c.team} onChange={e=>updateTeam(c.id, e.target.value)} className="h-7 rounded border border-border bg-input/60 text-[11px] px-1">
                  {allTeams.map(t=><option key={t}>{t}</option>)}
                </select>
                <button onClick={()=>removeComponent(c.id)} className="text-muted-foreground hover:text-[color:var(--status-red)]"><Trash2 className="h-3.5 w-3.5"/></button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded border border-border text-xs">Close</button>
        <button onClick={onClose} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save Report</button>
      </div>
    </Modal>
  );
}

function ActivityTemplatesTab({ items, onEdit, onDuplicate, onAdd }: { items: ActivityTemplate[]; onEdit: (id:string)=>void; onDuplicate: (id:string)=>void; onAdd: ()=>void }) {
  return (
    <Panel className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="text-sm font-semibold">Activity Templates</div>
        <button onClick={onAdd} className="h-8 px-3 rounded bg-primary text-primary-foreground text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>Add Activity Template</button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
          <tr>{["Template","Version","Activities","Status",""].map(h=>(<th key={h} className="text-left px-4 py-3">{h}</th>))}</tr>
        </thead>
        <tbody className="divide-y divide-border text-xs">
          {items.map(t=>(
            <tr key={t.id}>
              <td className="px-4 py-3 font-medium">{t.name}</td>
              <td className="px-4 py-3 font-mono">v{t.v}</td>
              <td className="px-4 py-3 text-muted-foreground">{t.activities.length}</td>
              <td className="px-4 py-3"><StatusTag tone={t.status==="Active"?"green":"grey"}>{t.status}</StatusTag></td>
              <td className="px-4 py-3 text-right space-x-3">
                <button onClick={()=>onEdit(t.id)} className="text-primary text-xs inline-flex items-center gap-1"><Edit3 className="h-3 w-3"/>Edit</button>
                <button onClick={()=>onDuplicate(t.id)} className="text-muted-foreground text-xs inline-flex items-center gap-1"><Copy className="h-3 w-3"/>Duplicate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function ActivityEditorModal({ template, onSave, onClose }: { template: ActivityTemplate; onSave: (t: ActivityTemplate)=>void; onClose: () => void }) {
  const [draft, setDraft] = useState<ActivityTemplate>(template);
  const patchActivity = (id: string, p: Partial<ActivityRow>) => setDraft({ ...draft, activities: draft.activities.map(a=>a.id===id?{...a,...p}:a) });
  const addActivity = () => setDraft({ ...draft, activities: [...draft.activities, { id:`a${Date.now()}`, name:"New activity", description:"", deliverables:"", inputs:"", responsible:"", accountable:"", consulted:"", informed:"", timeline:"" }] });
  const removeActivity = (id: string) => setDraft({ ...draft, activities: draft.activities.filter(a=>a.id!==id) });
  return (
    <Modal title={`Activity Template — ${draft.name}`} onClose={onClose} size="max-w-6xl">
      <label className="text-xs block mb-3">
        <div className="text-muted-foreground mb-1">Template Name</div>
        <input value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})} className="h-9 w-full max-w-md rounded border border-border bg-input/60 px-2 text-xs"/>
      </label>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activities</div>
        <button onClick={addActivity} className="h-7 px-2 rounded bg-primary text-primary-foreground text-[11px] flex items-center gap-1"><Plus className="h-3 w-3"/>Add Activity</button>
      </div>
      <div className="overflow-x-auto border border-border rounded">
        <table className="w-full text-[11px]">
          <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider">
            <tr>{["Activity","Description","Deliverables","Inputs","R","A","C","I","Timeline",""].map(h=><th key={h} className="text-left px-2 py-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {draft.activities.map(a=>(
              <tr key={a.id}>
                <td className="px-2 py-1"><input value={a.name} onChange={e=>patchActivity(a.id,{name:e.target.value})} className="h-7 w-full bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.description} onChange={e=>patchActivity(a.id,{description:e.target.value})} className="h-7 w-full bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.deliverables} onChange={e=>patchActivity(a.id,{deliverables:e.target.value})} className="h-7 w-full bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.inputs} onChange={e=>patchActivity(a.id,{inputs:e.target.value})} className="h-7 w-full bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.responsible} onChange={e=>patchActivity(a.id,{responsible:e.target.value})} className="h-7 w-16 bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.accountable} onChange={e=>patchActivity(a.id,{accountable:e.target.value})} className="h-7 w-20 bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.consulted} onChange={e=>patchActivity(a.id,{consulted:e.target.value})} className="h-7 w-24 bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.informed} onChange={e=>patchActivity(a.id,{informed:e.target.value})} className="h-7 w-20 bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><input value={a.timeline} onChange={e=>patchActivity(a.id,{timeline:e.target.value})} placeholder="e.g. 2w" className="h-7 w-16 bg-input/60 border border-border rounded px-1"/></td>
                <td className="px-2 py-1"><button onClick={()=>removeActivity(a.id)} className="text-muted-foreground hover:text-[color:var(--status-red)]"><Trash2 className="h-3.5 w-3.5"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded border border-border text-xs">Cancel</button>
        <button onClick={()=>onSave(draft)} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save</button>
      </div>
    </Modal>
  );
}

function ValidationRulesTab({ items, setItems, onOpen }: { items: ValidationTemplate[]; setItems: (v: ValidationTemplate[])=>void; onOpen: (id: string)=>void }) {
  const [sg, setSg] = useState<SG|"All">("All");
  const filtered = items.filter(v=>sg==="All" || v.sg===sg);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SgFilter value={sg} onChange={setSg}/>
        <button onClick={()=>setItems([...items, { id:`vt-${Date.now()}`, name:"New Validation Ruleset", sg: sg==="All"?"SG1":sg, rules:[] }])} className="h-8 px-3 rounded bg-primary text-primary-foreground text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>Create manual ruleset</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(v=>(
          <Panel key={v.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{v.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Stage {v.sg} · {v.rules.length} rules</div>
              </div>
              <button onClick={()=>onOpen(v.id)} className="h-7 px-2 rounded border border-border text-[11px] flex items-center gap-1"><Edit3 className="h-3 w-3"/>Manage rules</button>
            </div>
            <ul className="mt-3 space-y-1 text-[11px]">
              {v.rules.slice(0,3).map(r=><li key={r.id} className="text-muted-foreground">• {r.text}</li>)}
              {v.rules.length>3 && <li className="text-[10px] text-muted-foreground italic">+{v.rules.length-3} more…</li>}
            </ul>
          </Panel>
        ))}
      </div>
      <div className="p-3 rounded-md border border-primary/25 bg-primary/10 text-xs">System admins can author manual validation rules per template. Validation surfaces readiness signals only; it does not authorize a stage gate decision.</div>
    </div>
  );
}

function ValidationEditorModal({ template, onSave, onClose }: { template: ValidationTemplate; onSave: (t: ValidationTemplate)=>void; onClose: () => void }) {
  const [draft, setDraft] = useState<ValidationTemplate>(template);
  const patchRule = (id: string, p: Partial<ValidationRule>) => setDraft({ ...draft, rules: draft.rules.map(r=>r.id===id?{...r,...p}:r) });
  const addRule = () => setDraft({ ...draft, rules: [...draft.rules, { id:`vr${Date.now()}`, text:"New rule", severity:"warn", enforced:true }] });
  const removeRule = (id: string) => setDraft({ ...draft, rules: draft.rules.filter(r=>r.id!==id) });
  return (
    <Modal title={`Validation Rules — ${draft.name}`} onClose={onClose} size="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">Ruleset name</div>
          <input value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs"/>
        </label>
        <label className="text-xs">
          <div className="text-muted-foreground mb-1">Stage gate</div>
          <select value={draft.sg} onChange={e=>setDraft({...draft, sg:e.target.value as SG})} className="h-9 w-full rounded border border-border bg-input/60 px-2 text-xs">
            {STAGE_GATES.map(s=><option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rules</div>
        <button onClick={addRule} className="h-7 px-2 rounded bg-primary text-primary-foreground text-[11px] flex items-center gap-1"><Plus className="h-3 w-3"/>Add rule</button>
      </div>
      <div className="space-y-2">
        {draft.rules.map(r=>(
          <div key={r.id} className="flex items-center gap-2 border border-border rounded p-2">
            <input value={r.text} onChange={e=>patchRule(r.id, { text:e.target.value })} className="flex-1 h-8 bg-input/60 border border-border rounded px-2 text-xs"/>
            <select value={r.severity} onChange={e=>patchRule(r.id,{severity:e.target.value as any})} className="h-8 rounded border border-border bg-input/60 text-[11px] px-1">
              <option value="info">Info</option><option value="warn">Warn</option><option value="fail">Fail</option>
            </select>
            <label className="text-[11px] flex items-center gap-1"><input type="checkbox" checked={r.enforced} onChange={e=>patchRule(r.id,{enforced:e.target.checked})} className="accent-[color:var(--accent-blue)]"/>Enforce</label>
            <button onClick={()=>removeRule(r.id)} className="text-muted-foreground hover:text-[color:var(--status-red)]"><Trash2 className="h-3.5 w-3.5"/></button>
          </div>
        ))}
        {draft.rules.length===0 && <div className="text-xs text-muted-foreground italic border border-dashed border-border rounded p-4 text-center">No rules yet. Add manual rules for this template.</div>}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded border border-border text-xs">Cancel</button>
        <button onClick={()=>onSave(draft)} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save</button>
      </div>
    </Modal>
  );
}