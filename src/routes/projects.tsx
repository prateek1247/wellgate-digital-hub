import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/shell";
import {
  LayoutGrid,
  List,
  Rows3,
  History,
  Plus,
  Search,
  ChevronDown,
  Star,
  User,
  X,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — WDPGS" }, { name: "description", content: "Manage KOC well delivery projects with lifecycle timelines." }] }),
  component: ProjectsPage,
});

type TLStatus = "Initiating" | "Active" | "Planned" | "On Hold" | "Completed" | "Cancelled" | "Archived";
type TLProject = {
  name: string;
  status: TLStatus;
  start: string; // dd.mm.yyyy
  end: string;
  stageGate: "SG1" | "SG2" | "SG3.1";
  favourite?: boolean;
  mine?: boolean;
};

const timelineProjects: TLProject[] = [
  { name: "Viking Exploration well", status: "Initiating", start: "22.01.2026", end: "01.04.2027", stageGate: "SG1", favourite: true, mine: true },
  { name: "King development well 1", status: "Initiating", start: "01.07.2026", end: "28.09.2027", stageGate: "SG1", favourite: true },
  { name: "Exploration Well Alpha", status: "Initiating", start: "01.10.2026", end: "29.12.2027", stageGate: "SG2", favourite: true, mine: true },
  { name: "Exploration Well Beta", status: "Initiating", start: "02.10.2026", end: "29.01.2028", stageGate: "SG2", favourite: true },
  { name: "Exploration Well Zulu", status: "Initiating", start: "01.12.2026", end: "28.02.2028", stageGate: "SG1" },
  { name: "Permian - 20 Well PAD", status: "Initiating", start: "12.05.2026", end: "06.10.2026", stageGate: "SG3.1", mine: true },
  { name: "Rockies - Multi PAD Wells", status: "Initiating", start: "24.02.2026", end: "19.01.2027", stageGate: "SG2" },
  { name: "Rig plan", status: "Initiating", start: "01.01.2026", end: "13.02.2026", stageGate: "SG3.1" },
  { name: "SC Demo", status: "Initiating", start: "16.12.2025", end: "30.09.2026", stageGate: "SG2", favourite: true },
  { name: "Test1", status: "Initiating", start: "01.01.2026", end: "31.03.2027", stageGate: "SG1" },
  { name: "Burgan Infill Program", status: "Active", start: "10.03.2026", end: "18.11.2027", stageGate: "SG3.1" },
  { name: "Raudhatain Deep Gas", status: "Active", start: "05.04.2026", end: "22.02.2028", stageGate: "SG2" },
  { name: "Sabriyah Water Injector", status: "Planned", start: "01.09.2026", end: "10.06.2027", stageGate: "SG1" },
  { name: "Umm Gudair Cluster A", status: "Active", start: "18.02.2026", end: "30.07.2027", stageGate: "SG3.1" },
  { name: "Minagish Sour Gas Pilot", status: "Planned", start: "12.11.2026", end: "05.09.2027", stageGate: "SG2" },
  { name: "Ratqa Heavy Oil Phase 2", status: "Active", start: "20.05.2026", end: "01.12.2027", stageGate: "SG3.1" },
  { name: "North Kuwait Gas Lift", status: "Initiating", start: "01.02.2026", end: "15.09.2026", stageGate: "SG1" },
  { name: "Bahra Development Wells", status: "Initiating", start: "10.06.2026", end: "22.04.2027", stageGate: "SG1", mine: true },
  { name: "Wafra Joint Wells", status: "Initiating", start: "05.08.2026", end: "18.10.2027", stageGate: "SG2" },
  { name: "Ahmadi Workover Batch", status: "Initiating", start: "14.03.2026", end: "30.08.2026", stageGate: "SG3.1" },
  { name: "Jurassic Deep Test 4", status: "Initiating", start: "22.09.2026", end: "12.05.2027", stageGate: "SG1" },
  { name: "Sabriyah Multi-Pad B", status: "Initiating", start: "01.11.2026", end: "20.12.2027", stageGate: "SG1" },
  { name: "Rawdhatain HP Well Release", status: "Initiating", start: "08.04.2026", end: "16.10.2026", stageGate: "SG2" },
  { name: "Marat Deep Exploration", status: "Initiating", start: "18.07.2026", end: "05.03.2028", stageGate: "SG1" },
  { name: "West Kuwait Slim Hole", status: "Initiating", start: "26.01.2026", end: "14.11.2026", stageGate: "SG3.1" },
  { name: "Umm Niqa Appraisal", status: "Initiating", start: "03.10.2026", end: "22.09.2027", stageGate: "SG2" },
  { name: "Kra Al-Maru Step-out", status: "Initiating", start: "15.05.2026", end: "10.02.2027", stageGate: "SG2" },
  { name: "Greater Burgan Pad-27", status: "Initiating", start: "01.03.2026", end: "01.09.2027", stageGate: "SG3.1" },
];

const QUARTERS: { label: string; year: number; q: number }[] = (() => {
  const seq: [number, number][] = [
    [2025, 4], [2026, 1], [2026, 2], [2026, 3], [2026, 4],
    [2027, 1], [2027, 2], [2027, 3], [2027, 4], [2028, 1],
  ];
  return seq.map(([year, q]) => ({ label: `Q${q} ${year}`, year, q }));
})();

function toQIndex(d: string): number {
  const [dd, mm, yyyy] = d.split(".").map(Number);
  const q = Math.floor((mm - 1) / 3) + 1;
  const monthIntoQ = ((mm - 1) % 3) + (dd - 1) / 30;
  const frac = monthIntoQ / 3;
  const idx = QUARTERS.findIndex((x) => x.year === yyyy && x.q === q);
  if (idx < 0) return 0;
  return idx + frac;
}

function todayQIndex(): number {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return toQIndex(`${dd}.${mm}.${yyyy}`);
}

function stageTone(s: "SG1"|"SG2"|"SG3.1") {
  if (s === "SG1") return "border-primary/40 text-primary bg-primary/10";
  if (s === "SG2") return "border-[color:var(--status-orange)]/40 text-[color:var(--status-orange)] bg-[color:var(--status-orange)]/10";
  return "border-[color:var(--status-green)]/40 text-[color:var(--status-green)] bg-[color:var(--status-green)]/10";
}

function statusTone(s: TLStatus) {
  switch (s) {
    case "Active": return "text-[color:var(--status-green)] bg-[color:var(--status-green)]/10 border-[color:var(--status-green)]/25";
    case "Planned": return "text-primary bg-primary/10 border-primary/25";
    case "On Hold": return "text-[color:var(--status-orange)] bg-[color:var(--status-orange)]/10 border-[color:var(--status-orange)]/25";
    case "Completed": return "text-muted-foreground bg-secondary/60 border-border";
    case "Cancelled": return "text-[color:var(--status-red)] bg-[color:var(--status-red)]/10 border-[color:var(--status-red)]/25";
    case "Archived": return "text-muted-foreground bg-secondary/60 border-border";
    default: return "text-muted-foreground bg-secondary/60 border-border";
  }
}

function barColor(s: TLStatus) {
  switch (s) {
    case "Active": return "bg-[color:var(--status-green)]/40 border-[color:var(--status-green)]/60";
    case "Planned": return "bg-primary/40 border-primary/60";
    case "On Hold": return "bg-[color:var(--status-orange)]/40 border-[color:var(--status-orange)]/60";
    case "Completed": return "bg-muted-foreground/30 border-muted-foreground/50";
    case "Cancelled": return "bg-[color:var(--status-red)]/40 border-[color:var(--status-red)]/60";
    default: return "bg-secondary/80 border-border";
  }
}

function ProjectsPage() {
  const [view, setView] = useState<"grid"|"list"|"timeline">("timeline");
  const [wizard, setWizard] = useState(false);
  const [zoom, setZoom] = useState(120);
  const [filter, setFilter] = useState<"total"|"favourites"|"mine"|"active"|"planned"|"onhold"|"completed"|"cancelled"|"archived">("total");

  const filtered = timelineProjects.filter((p) => {
    if (filter === "favourites") return p.favourite;
    if (filter === "mine") return p.mine;
    if (filter === "active") return p.status === "Active";
    if (filter === "planned") return p.status === "Planned";
    if (filter === "onhold") return p.status === "On Hold";
    if (filter === "completed") return p.status === "Completed";
    if (filter === "cancelled") return p.status === "Cancelled";
    if (filter === "archived") return p.status === "Archived";
    return true;
  });

  const counts = {
    favourites: timelineProjects.filter(p=>p.favourite).length,
    mine: timelineProjects.filter(p=>p.mine).length,
    total: timelineProjects.length,
    active: timelineProjects.filter(p=>p.status==="Active").length,
    planned: timelineProjects.filter(p=>p.status==="Planned").length,
    onhold: timelineProjects.filter(p=>p.status==="On Hold").length,
    completed: timelineProjects.filter(p=>p.status==="Completed").length,
    cancelled: timelineProjects.filter(p=>p.status==="Cancelled").length,
    archived: timelineProjects.filter(p=>p.status==="Archived").length,
  };

  const gridWidth = QUARTERS.length * zoom;
  const todayLeft = todayQIndex() * zoom;

  return (
    <div className="p-6 xl:p-8 max-w-[1800px] mx-auto">
      <PageHeader
        title="Projects"
        subtitle="All KOC well delivery projects with lifecycle timelines across SG1.0 → SG3.2."
        actions={
          <>
            <div className="flex rounded-md border border-border overflow-hidden">
              <button onClick={()=>setView("list")} title="Table" className={`h-9 w-9 grid place-items-center ${view==="list"?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-secondary"}`}><List className="h-4 w-4"/></button>
              <button onClick={()=>setView("timeline")} title="Timeline" className={`h-9 w-9 grid place-items-center border-l border-border ${view==="timeline"?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-secondary"}`}><Rows3 className="h-4 w-4"/></button>
              <button onClick={()=>setView("grid")} title="Cards" className={`h-9 w-9 grid place-items-center border-l border-border ${view==="grid"?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-secondary"}`}><LayoutGrid className="h-4 w-4"/></button>
            </div>
            <button title="History" className="h-9 w-9 grid place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"><History className="h-4 w-4"/></button>
            <button onClick={()=>setWizard(true)} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/> New Project</button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input placeholder="Search by name, type, or location…" className="w-full h-9 pl-8 pr-2 rounded-md bg-input/60 border border-border text-xs"/>
        </div>
        {["Status","Type","Area","Field","Template"].map(f=>(
          <button key={f} className="h-9 px-3 rounded-md bg-input/60 border border-border text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
            {f} <ChevronDown className="h-3 w-3"/>
          </button>
        ))}
        <div className="flex rounded-md border border-border overflow-hidden">
          <button onClick={()=>setZoom(z=>Math.max(60,z-20))} className="h-9 w-8 grid place-items-center text-muted-foreground hover:bg-secondary">−</button>
          <button onClick={()=>setZoom(z=>Math.min(240,z+20))} className="h-9 w-8 grid place-items-center border-l border-border text-muted-foreground hover:bg-secondary">+</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <Chip active={filter==="favourites"} onClick={()=>setFilter("favourites")} icon={<Star className="h-3 w-3"/>} label="Favourites" count={counts.favourites}/>
        <Chip active={filter==="mine"} onClick={()=>setFilter("mine")} icon={<User className="h-3 w-3"/>} label="My Projects" count={counts.mine}/>
        <Chip active={filter==="total"} onClick={()=>setFilter("total")} dot="primary" label="Total" count={counts.total}/>
        <Chip active={filter==="active"} onClick={()=>setFilter("active")} dot="green" label="Active" count={counts.active}/>
        <Chip active={filter==="planned"} onClick={()=>setFilter("planned")} dot="blue" label="Planned" count={counts.planned}/>
        <Chip active={filter==="onhold"} onClick={()=>setFilter("onhold")} dot="orange" label="On Hold" count={counts.onhold}/>
        <Chip active={filter==="completed"} onClick={()=>setFilter("completed")} dot="grey" label="Completed" count={counts.completed}/>
        <Chip active={filter==="cancelled"} onClick={()=>setFilter("cancelled")} dot="red" label="Cancelled" count={counts.cancelled}/>
        <Chip active={filter==="archived"} onClick={()=>setFilter("archived")} dot="purple" label="Archived" count={counts.archived}/>
      </div>

      {view === "timeline" && (
        <Panel className="overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-260px)]">
            <div style={{ minWidth: 570 + gridWidth }}>
              <div className="flex sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <div className="w-[240px] shrink-0 px-4 py-3 font-medium">Project Name</div>
                <div className="w-[90px] shrink-0 px-3 py-3 font-medium">Stage Gate</div>
                <div className="w-[110px] shrink-0 px-3 py-3 font-medium">Status</div>
                <div className="w-[110px] shrink-0 px-3 py-3 font-medium">Start Date</div>
                <div className="w-[110px] shrink-0 px-3 py-3 font-medium border-r border-border">End Date</div>
                <div className="flex" style={{ width: gridWidth }}>
                  {QUARTERS.map((q,i)=>(
                    <div key={i} style={{ width: zoom }} className="px-3 py-3 font-medium border-r border-border/60">{q.label}</div>
                  ))}
                </div>
              </div>
              {filtered.map((p, idx) => {
                const s = toQIndex(p.start);
                const e = toQIndex(p.end);
                const barLeft = s * zoom;
                const barWidth = Math.max(24, (e - s) * zoom);
                return (
                  <div key={idx} className="flex items-stretch border-b border-border/60 hover:bg-secondary/20">
                    <div className="w-[240px] shrink-0 px-4 py-3 flex items-center gap-2 min-w-0">
                      <Star className={`h-3.5 w-3.5 shrink-0 ${p.favourite ? "fill-[color:var(--accent-blue)] text-[color:var(--accent-blue)]" : "text-muted-foreground/40"}`}/>
                      <span className="truncate text-sm font-medium">{p.name}</span>
                    </div>
                    <div className="w-[90px] shrink-0 px-3 py-3">
                      <span className={`inline-flex items-center h-6 px-2 rounded border text-[11px] font-medium ${stageTone(p.stageGate)}`}>{p.stageGate}</span>
                    </div>
                    <div className="w-[110px] shrink-0 px-3 py-3">
                      <span className={`inline-flex items-center h-6 px-2 rounded border text-[11px] ${statusTone(p.status)}`}>{p.status}</span>
                    </div>
                    <div className="w-[110px] shrink-0 px-3 py-3 text-xs text-muted-foreground tabular-nums">{p.start}</div>
                    <div className="w-[110px] shrink-0 px-3 py-3 text-xs text-muted-foreground tabular-nums border-r border-border">{p.end}</div>
                    <div className="relative" style={{ width: gridWidth }}>
                      <div className="absolute inset-0 flex pointer-events-none">
                        {QUARTERS.map((_,i)=>(<div key={i} style={{ width: zoom }} className="border-r border-border/40"/>))}
                      </div>
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-7 rounded border ${barColor(p.status)} flex items-center px-2 text-[11px] text-foreground/90 overflow-hidden whitespace-nowrap shadow-sm`}
                        style={{ left: barLeft, width: barWidth }}
                        title={`${p.name} · ${p.start} → ${p.end}`}
                      >
                        <span className="truncate">{p.name}</span>
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-[color:var(--status-red)] pointer-events-none z-20"
                        style={{ left: todayLeft }}
                        title="Today"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      )}

      {view === "list" && (
        <Panel className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                {["","Project Name","Status","Start Date","End Date","Duration"].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p,i)=>(
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 w-8"><Star className={`h-3.5 w-3.5 ${p.favourite?"fill-[color:var(--accent-blue)] text-[color:var(--accent-blue)]":"text-muted-foreground/40"}`}/></td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center h-6 px-2 rounded border text-[11px] ${statusTone(p.status)}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{p.start}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{p.end}</td>
                  <td className="px-4 py-3 text-muted-foreground">{Math.max(1, Math.round((toQIndex(p.end)-toQIndex(p.start))*3))} months</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <Panel key={i} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-base font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 tabular-nums">{p.start} → {p.end}</div>
                </div>
                <span className={`inline-flex items-center h-6 px-2 rounded border text-[11px] shrink-0 ${statusTone(p.status)}`}>{p.status}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full ${barColor(p.status)}`} style={{ width: "60%" }}/>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {wizard && <Wizard onClose={()=>setWizard(false)} />}
    </div>
  );
}

function Chip({ active, onClick, icon, dot, label, count }: { active: boolean; onClick: ()=>void; icon?: React.ReactNode; dot?: "primary"|"green"|"blue"|"orange"|"grey"|"red"|"purple"; label: string; count: number }) {
  const dotColor: Record<string,string> = {
    primary: "bg-primary",
    green: "bg-[color:var(--status-green)]",
    blue: "bg-primary",
    orange: "bg-[color:var(--status-orange)]",
    grey: "bg-muted-foreground",
    red: "bg-[color:var(--status-red)]",
    purple: "bg-[#a78bfa]",
  };
  return (
    <button onClick={onClick} className={`h-8 px-3 rounded-md border flex items-center gap-2 ${active ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-input/40 text-muted-foreground hover:text-foreground"}`}>
      {icon ?? <span className={`h-1.5 w-1.5 rounded-full ${dot?dotColor[dot]:"bg-muted-foreground"}`}/>}
      <span>{label}:</span>
      <span className="font-semibold text-foreground tabular-nums">{count}</span>
    </button>
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
