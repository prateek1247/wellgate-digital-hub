import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { projects } from "@/lib/mock";
import { FileDown, Send, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/cpa")({
  head: () => ({ meta: [{ title: "CPA Governance — WDPGS" }, { name: "description", content: "CPA assurance control tower for stage gate reviews." }] }),
  component: Cpa,
});

const queue = [
  { id:"DSP-2001", project:"NKDP", asset:"North Kuwait",  stage:"SG3.1", submitted:"2026-07-08", cpa:"A. Al-Sabah",   days:8,  due:"2026-07-22", status:"In Review",     gaps:3 },
  { id:"DSP-2002", project:"MBP2", asset:"West Kuwait",   stage:"SG2.0", submitted:"2026-07-10", cpa:"H. Al-Rashed",  days:6,  due:"2026-07-24", status:"Clarification", gaps:5 },
  { id:"DSP-2003", project:"WWI-X10", asset:"South East", stage:"SG3.2", submitted:"2026-07-01", cpa:"K. Al-Mutairi", days:15, due:"2026-07-18", status:"Ready for Gate",gaps:0 },
  { id:"DSP-2004", project:"EXPL-2027", asset:"Exploration", stage:"SG2.0", submitted:"2026-07-11", cpa:"R. Al-Kandari", days:5, due:"2026-07-25", status:"In Review",  gaps:2 },
  { id:"DSP-2005", project:"SKG UOR", asset:"South Kuwait", stage:"SG1.0", submitted:"2026-07-14", cpa:"N. Al-Ajmi",   days:2,  due:"2026-07-28", status:"Received",     gaps:1 },
];

const clarifications = [
  { id:"CL-901", project:"NKDP",     linkType:"DSP",      linkTarget:"Risk Register",  type:"Data gap",   owner:"FD Team",  due:"2026-07-25", status:"Awaiting"  },
  { id:"CL-902", project:"MBP2",     linkType:"DSP",      linkTarget:"Options List",   type:"Rationale",  owner:"FD Team",  due:"2026-07-26", status:"Responded" },
  { id:"CL-903", project:"WWI-X10",  linkType:"Activity", linkTarget:"RAROC Analysis", type:"Alignment",  owner:"Planning", due:"2026-07-28", status:"Awaiting"  },
  { id:"CL-904", project:"EXPL-2027",linkType:"DSP",      linkTarget:"HSE Compliance", type:"Signature",  owner:"HSE",      due:"2026-07-24", status:"Accepted"  },
  { id:"CL-905", project:"NKDP",     linkType:"Activity", linkTarget:"Site Visits",    type:"Evidence",   owner:"Drilling", due:"2026-07-30", status:"Awaiting"  },
];

function Cpa(){
  const [qStage, setQStage] = useState("All");
  const [qAsset, setQAsset] = useState("All");
  const [qStatus, setQStatus] = useState("All");

  const filteredQueue = useMemo(() => queue.filter(q =>
    (qStage==="All" || q.stage===qStage) &&
    (qAsset==="All" || q.asset===qAsset) &&
    (qStatus==="All"|| q.status===qStatus)
  ), [qStage, qAsset, qStatus]);

  const stages = ["All", ...Array.from(new Set(queue.map(q=>q.stage)))];
  const assets = ["All", ...Array.from(new Set(queue.map(q=>q.asset)))];
  const statuses = ["All", ...Array.from(new Set(queue.map(q=>q.status)))];

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
        <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm font-semibold">CPA Work Queue</div>
          <div className="flex items-center gap-2 text-[11px]">
            <FilterSelect label="Stage Gate" value={qStage} onChange={setQStage} options={stages}/>
            <FilterSelect label="Asset" value={qAsset} onChange={setQAsset} options={assets}/>
            <FilterSelect label="Status" value={qStatus} onChange={setQStatus} options={statuses}/>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
            <tr>{["DSP ID","Project","Asset","Stage","Submitted","Senior CPA","Days","Due","Gaps","Status",""].map(h=>(<th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>))}</tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {filteredQueue.map(q=>(
              <tr key={q.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-primary">{q.id}</td>
                <td className="px-4 py-3 font-medium">
                  <Link to="/workload" search={{ project: q.project } as any} className="hover:underline text-foreground">{q.project}</Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{q.asset}</td>
                <td className="px-4 py-3">{q.stage}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.submitted}</td>
                <td className="px-4 py-3">{q.cpa}</td>
                <td className="px-4 py-3 tabular-nums">{q.days}</td>
                <td className="px-4 py-3">{q.due}</td>
                <td className="px-4 py-3"><StatusTag tone={q.gaps===0?"green":q.gaps>3?"red":"orange"}>{q.gaps} gaps</StatusTag></td>
                <td className="px-4 py-3"><StatusTag tone={q.status==="Ready for Gate"?"green":q.status==="Clarification"?"yellow":"blue"}>{q.status}</StatusTag></td>
                <td className="px-4 py-3 text-right">
                  <Link to="/workload" search={{ project: q.project } as any} className="text-primary hover:underline inline-flex items-center gap-1">
                    Open <ExternalLink className="h-3 w-3"/>
                  </Link>
                </td>
              </tr>
            ))}
            {filteredQueue.length===0 && (
              <tr><td colSpan={11} className="px-4 py-6 text-center text-xs text-muted-foreground">No items match the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>

      <ClarificationTracker />

      <ProjectTracker />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v:string)=>void; options: string[] }) {
  return (
    <label className="flex items-center gap-1 text-muted-foreground">
      <span>{label}:</span>
      <select value={value} onChange={e=>onChange(e.target.value)} className="h-7 rounded border border-border bg-input/60 px-1.5 text-xs text-foreground">
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function ClarificationTracker() {
  const [fProject, setFProject] = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [fDue, setFDue] = useState("All");

  const projectOpts = ["All", ...Array.from(new Set(clarifications.map(c=>c.project)))];
  const statusOpts = ["All", ...Array.from(new Set(clarifications.map(c=>c.status)))];
  const dueOpts = ["All","Overdue","Next 7 days","Later"];

  const today = new Date();
  const filtered = clarifications.filter(c => {
    if (fProject!=="All" && c.project!==fProject) return false;
    if (fStatus!=="All" && c.status!==fStatus) return false;
    if (fDue!=="All") {
      const diff = (new Date(c.due).getTime() - today.getTime())/(1000*60*60*24);
      if (fDue==="Overdue" && diff>=0) return false;
      if (fDue==="Next 7 days" && (diff<0 || diff>7)) return false;
      if (fDue==="Later" && diff<=7) return false;
    }
    return true;
  });

  return (
    <Panel className="p-5 mt-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="text-sm font-semibold">Clarification Tracker</div>
        <div className="flex items-center gap-2 text-[11px]">
          <FilterSelect label="Project" value={fProject} onChange={setFProject} options={projectOpts}/>
          <FilterSelect label="Due" value={fDue} onChange={setFDue} options={dueOpts}/>
          <FilterSelect label="Status" value={fStatus} onChange={setFStatus} options={statusOpts}/>
        </div>
      </div>
      <table className="w-full text-xs">
        <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
          <tr>{["ID","Project","Linked To","Type","Owner","Due","Status",""].map(h=>(<th key={h} className="text-left py-1.5">{h}</th>))}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map(c=>(
            <tr key={c.id} className="hover:bg-secondary/30">
              <td className="py-2 font-mono text-primary">{c.id}</td>
              <td>
                <Link to="/workload" search={{ project: c.project } as any} className="hover:underline">{c.project}</Link>
              </td>
              <td>
                <Link
                  to="/workload"
                  search={{ project: c.project, tab: c.linkType==="DSP"?"dsp":"activities", section: c.linkTarget } as any}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <StatusTag tone={c.linkType==="DSP"?"blue":"yellow"}>{c.linkType}</StatusTag>
                  <span>{c.linkTarget}</span>
                </Link>
              </td>
              <td>{c.type}</td>
              <td>{c.owner}</td>
              <td>{c.due}</td>
              <td><StatusTag tone={c.status==="Accepted"?"green":c.status==="Responded"?"blue":"orange"}>{c.status}</StatusTag></td>
              <td className="text-right">
                <Link to="/workload" search={{ project: c.project, tab: c.linkType==="DSP"?"dsp":"activities", section: c.linkTarget } as any} className="text-primary hover:underline inline-flex items-center gap-1">
                  Open <ExternalLink className="h-3 w-3"/>
                </Link>
              </td>
            </tr>
          ))}
          {filtered.length===0 && (
            <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">No clarifications match the selected filters.</td></tr>
          )}
        </tbody>
      </table>
      <div className="mt-3 flex gap-2">
        <button className="h-8 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Send className="h-3.5 w-3.5"/>Send Clarification</button>
        <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs">Mark Ready for Gate Review</button>
      </div>
    </Panel>
  );
}

function ProjectTracker() {
  const stages = ["SG1", "SG2", "SG3.1", "SG3.2"] as const;
  const [remarks, setRemarks] = useState<Record<string, Record<string, string>>>(() => {
    const seed: Record<string, Record<string, string>> = {};
    projects.forEach(p => {
      seed[p.code] = {
        SG1: p.stageGate !== "SG1" ? "Closed — deliverables accepted with 2 minor comments carried forward." : "",
        SG2: p.stageGate === "SG3.1" || p.stageGate === "SG3.2" ? "Closed — concept ranking endorsed. Refer to CPA memo 2026/04-11." : "",
        "SG3.1": p.stageGate === "SG3.2" ? "Closed — design deliverables verified." : "",
        "SG3.2": "",
      };
    });
    return seed;
  });
  const [openProject, setOpenProject] = useState<string>(projects[0].code);
  const update = (code: string, stage: string, val: string) =>
    setRemarks({ ...remarks, [code]: { ...remarks[code], [stage]: val } });

  return (
    <Panel className="mt-5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold">Project Tracker</div>
          <div className="text-xs text-muted-foreground">Per-project stage gate closure remarks captured by CPA for audit traceability.</div>
        </div>
        <select value={openProject} onChange={e => setOpenProject(e.target.value)} className="h-8 rounded border border-border bg-input/60 text-xs px-2">
          {projects.map(p => <option key={p.code} value={p.code}>{p.code} — {p.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {stages.map(s => {
          const current = projects.find(p => p.code === openProject)!;
          const isPast = stages.indexOf(s) < stages.indexOf(current.stageGate as any);
          const isCurrent = s === current.stageGate;
          const tone = isPast ? "green" : isCurrent ? "orange" : "grey";
          return (
            <div key={s} className="border border-border rounded-lg p-3 bg-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold">{s}</div>
                <StatusTag tone={tone as any}>{isPast ? "Closed" : isCurrent ? "In Progress" : "Upcoming"}</StatusTag>
              </div>
              <label className="text-[10px] text-muted-foreground">Closure Remark</label>
              <textarea
                value={remarks[openProject]?.[s] ?? ""}
                onChange={e => update(openProject, s, e.target.value)}
                placeholder={isPast ? "Add closure remark…" : "Awaiting stage completion"}
                className="mt-1 w-full min-h-[80px] p-2 rounded border border-border bg-input/60 text-xs"
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground italic">Closure remarks are CPA record-of-decision notes — they do not override Gate Keeper authority.</div>
    </Panel>
  );
}