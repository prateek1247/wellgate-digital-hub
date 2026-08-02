import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusDot, StatusTag } from "@/components/shell";
import { dspSections, dsp31Design, projects, workActivitiesByStage } from "@/lib/mock";

const stages = [
  { id: "1.0", name: "SG1.0 Identification" },
  { id: "2.0", name: "SG2.0 Concept Selection" },
  { id: "3.1", name: "SG3.1 Define / Design" },
  { id: "3.2", name: "SG3.2 Validation / Procurement" },
] as const;

export const Route = createFileRoute("/stage-gates")({
  head: () => ({ meta: [{ title: "Stage Gate Tracker — WDPGS" }, { name: "description", content: "Track SG1.0 through SG3.2 stage gate readiness." }] }),
  component: StageGates,
});

function StageGates() {
  const [stage, setStage] = useState<"1.0"|"2.0"|"3.1"|"3.2">("1.0");
  const meta = dspSections[stage];
  const project = projects[0];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Stage Gate Tracker"
        subtitle="Review readiness content, activities, comments and carry-forward items for each stage gate."
        actions={
          <>
            <button className="h-9 px-3 rounded-md border border-border text-xs">View as report</button>
          </>
        }
      />

      {/* Stage tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {stages.map(s=>(
          <button key={s.id} onClick={()=>setStage(s.id)}
            className={`px-3 py-2 rounded-md border text-xs ${stage===s.id?"bg-primary/15 border-primary/30 text-primary":"border-border hover:bg-secondary text-muted-foreground"}`}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Stage summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Summary label="Stage" value={meta.title} tone="blue"/>
        <Summary label="Responsible" value="Planning Directorate" tone="grey"/>
        <Summary label="Accountable" value="Gate Keeper (advisory)" tone="grey"/>
        <Summary label="Planned Due" value={project.targetDate} tone="orange"/>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* DSP content sections */}
        <Panel className="col-span-8 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Required DSP Sections</div>
            <StatusTag tone="blue">{meta.sections.length} sections</StatusTag>
          </div>
          <SectionProgress total={meta.sections.length} />
          <div className="grid grid-cols-2 gap-2">
            {meta.sections.map((s,i)=>(
              <Link
                key={s}
                to="/workload"
                title="Open in Workload"
                className="flex items-center gap-2 text-xs px-3 py-2 rounded border border-border bg-secondary/20 hover:border-primary/40 hover:bg-primary/5 transition"
              >
                <StatusDot status={i%4===0?"completed":i%4===1?"in-progress":i%4===2?"not-started":"overdue"}/>
                <span className="truncate">{s}</span>
              </Link>
            ))}
          </div>

          {stage==="3.1" && (
            <div className="mt-6">
              <div className="text-sm font-semibold mb-3">Design Package (SG3.1)</div>
              <div className="grid grid-cols-2 gap-2">
                {dsp31Design.map((s,i)=>(
                  <div key={s} className="flex items-center gap-2 text-xs px-3 py-2 rounded border border-border">
                    <StatusDot status={i%3===0?"completed":i%3===1?"in-progress":"not-started"}/>{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage==="2.0" && (
            <div className="mt-6 p-3 rounded-md border border-primary/25 bg-primary/10 text-xs">
              Exploration variant available: SG2.0 Exploration DSP replaces development-specific sections with prospect description, exploration wells, technical review study report, drilling/testing/flowline schedule, data acquisition (mud logging, gas analysis, coring, wireline), long-term testing and well intervention plans.
            </div>
          )}
        </Panel>

        {/* Activities & comments column */}
        <div className="col-span-4 space-y-4">
          <Panel className="p-4">
            <div className="text-sm font-semibold mb-3">Stage Activities</div>
            <div className="space-y-2 text-xs">
              {(stage==="1.0"
                ? ["Well Profile Identification","Preliminary SS X,Y","Surface X,Y","PAD Allocations","Site Visits","Surface Initial Confirmation","Side-tracks","Anti-Collision Assessment"]
                : stage==="2.0"
                ? ["Feasibility Study","Concept Options Ranking","Reservoir Simulation Review","Long Lead Items Identification"]
                : stage==="3.1"
                ? ["Design Audit Report","Execution Plan Development","ITB Documentation","PEEP Run"]
                : ["Procurement Readiness","HSE Readiness Validation","Facility Readiness","Assurance Findings Closure"]
              ).map((a,i)=>(
                <div key={a} className="flex items-center justify-between border border-border rounded-md px-3 py-2">
                  <div className="flex items-center gap-2"><StatusDot status={i%3===0?"completed":i%3===1?"in-progress":"not-started"}/>{a}</div>
                  <span className="text-[10px] text-muted-foreground">2026-08-{10+i}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="text-sm font-semibold mb-2">Carry-forward Items</div>
            <div className="text-xs text-muted-foreground mb-3">Items carried from the previous stage.</div>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-start gap-2"><StatusDot status="in-progress"/>Risk register updates from previous stage still open</li>
              <li className="flex items-start gap-2"><StatusDot status="overdue"/>HSE approval memo pending countersignature</li>
              <li className="flex items-start gap-2"><StatusDot status="completed"/>Milestone dates alignment with AAP</li>
            </ul>
          </Panel>

          <Panel className="p-4">
            <div className="text-sm font-semibold mb-2">Next Stage Preparation</div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>· Confirm accountable teams for next stage</li>
              <li>· Draft template selection</li>
              <li>· Schedule gate review workshop</li>
              <li>· Prepare CPA assurance handover pack</li>
            </ul>
          </Panel>
        </div>
      </div>

      <ActivityGantt stage={stage}/>

      {/* Stage history */}
      <Panel className="p-5 mt-4">
        <div className="text-sm font-semibold mb-3">Stage History Timeline</div>
        <div className="grid grid-cols-4 gap-3 text-xs">
          {stages.map((s,i)=>(
            <div key={s.id} className={`p-3 rounded-md border ${stage===s.id?"border-primary/40 bg-primary/5":"border-border"}`}>
              <div className="flex items-center gap-2 font-medium">
                <StatusDot status={i<2?"completed":i===2?"in-progress":"not-started"}/>{s.name}
              </div>
              <div className="mt-1 text-muted-foreground">
                {i<2?"Closed":"Ongoing"} · {i<2?"Assurance report accepted":"Assurance in progress"}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Summary({label,value,tone}:{label:string;value:string;tone:"blue"|"orange"|"grey"}){
  return (
    <Panel className="p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
      <div className="mt-2"><StatusTag tone={tone}>tracked</StatusTag></div>
    </Panel>
  );
}

function SectionProgress({ total }: { total: number }) {
  const completed = Math.round(total * 0.45);
  const inProgress = Math.round(total * 0.2);
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
        <span>{completed} completed · {inProgress} in progress · {total - completed - inProgress} not started</span>
        <span className="text-foreground font-medium">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden flex">
        <div className="h-full bg-[color:var(--status-green)]" style={{ width: `${pct}%` }} />
        <div className="h-full bg-[color:var(--status-orange)]" style={{ width: `${Math.round((inProgress/total)*100)}%` }} />
      </div>
    </div>
  );
}

function ActivityGantt({ stage }: { stage: "1.0"|"2.0"|"3.1"|"3.2" }) {
  const key = stage === "1.0" ? "SG1" : stage === "2.0" ? "SG2" : stage === "3.1" ? "SG3.1" : "SG3.2";
  const acts = workActivitiesByStage[key as "SG1"|"SG2"|"SG3.1"|"SG3.2"];
  const [onlyDelayed, setOnlyDelayed] = useState(false);
  const today = new Date();
  const parsed = acts.map((a, i) => {
    const end = a.target ? new Date(a.target) : new Date();
    const start = new Date(end.getTime() - (10 + (i % 4) * 6) * 86400000);
    const delayed = end < today && a.status !== "completed";
    return { ...a, start, end, delayed };
  });
  const rows = onlyDelayed ? parsed.filter(a => a.delayed) : parsed;
  const min = Math.min(...parsed.map(a => a.start.getTime()));
  const max = Math.max(...parsed.map(a => a.end.getTime()));
  const span = Math.max(max - min, 1);
  const pos = (t: number) => ((t - min) / span) * 100;
  const delayedCount = parsed.filter(a => a.delayed).length;

  return (
    <Panel className="p-5 mt-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-sm font-semibold">Activity Gantt — target dates</div>
          <div className="text-[11px] text-muted-foreground">Bars are drawn from planned start to target date. Red bars are past their target.</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusTag tone={delayedCount ? "red" : "green"}>{delayedCount} delayed</StatusTag>
          <button onClick={() => setOnlyDelayed(!onlyDelayed)} className={`h-8 px-3 rounded-md border text-xs ${onlyDelayed ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>
            {onlyDelayed ? "Showing delayed only" : "Filter: delayed only"}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        {rows.map(a => (
          <div key={a.id} className="grid grid-cols-12 items-center gap-2 text-[11px]">
            <div className="col-span-4 truncate flex items-center gap-1.5">
              <StatusDot status={a.delayed ? "overdue" : a.status}/>{a.id} · {a.title}
            </div>
            <div className="col-span-7 relative h-4 rounded bg-secondary/40 overflow-hidden">
              <div
                className={`absolute top-0 h-full rounded ${a.delayed ? "bg-[color:var(--status-red)]/70" : a.status === "completed" ? "bg-[color:var(--status-green)]/70" : "bg-primary/60"}`}
                style={{ left: `${pos(a.start.getTime())}%`, width: `${Math.max(pos(a.end.getTime()) - pos(a.start.getTime()), 2)}%` }}
              />
              <div className="absolute top-0 h-full w-px bg-[color:var(--status-red)]" style={{ left: `${Math.min(Math.max(pos(today.getTime()), 0), 100)}%` }} />
            </div>
            <div className="col-span-1 text-right text-muted-foreground">{a.target ?? "—"}</div>
          </div>
        ))}
        {rows.length === 0 && <div className="text-[11px] text-muted-foreground italic py-4 text-center">No delayed activities for this stage.</div>}
      </div>
    </Panel>
  );
}
