import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHeader, Panel, StatusDot, StatusTag } from "@/components/shell";
import { projects, kpis, activities } from "@/lib/mock";
import { ArrowRight, Plus, MessageSquare, Calendar } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const toneMap: Record<string, "blue"|"orange"|"yellow"|"red"|"green"> = {
    blue: "blue", orange: "orange", yellow: "yellow", red: "red", green: "green",
  };
  const columns = ["Not Started", "In Progress", "Pending Response", "Completed"] as const;
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Good morning, Prateek"
        subtitle="Here's what needs your attention across Well Delivery Stage Gates."
        actions={
          <>
            <button className="h-9 px-3 rounded-md border border-border bg-secondary/40 text-xs hover:bg-secondary">View My Actions</button>
            <button className="h-9 px-3 rounded-md border border-border bg-secondary/40 text-xs hover:bg-secondary">View Full Board</button>
            <Link to="/projects" className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Create New Project
            </Link>
          </>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {kpis.map((k) => (
          <Panel key={k.label} className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">{k.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-semibold tabular-nums">{k.value}</div>
              <StatusTag tone={toneMap[k.tone] ?? "blue"}>{k.tone === "red" ? "attention" : "live"}</StatusTag>
            </div>
          </Panel>
        ))}
      </div>

      {/* Project cards */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Projects</h2>
        <Link to="/projects" className="text-xs text-primary hover:underline flex items-center gap-1">See all <ArrowRight className="h-3 w-3" /></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {projects.map((p) => {
          const statusTone = p.status === "On Track" ? "green" : p.status === "At Risk" ? "orange" : p.status === "Delayed" ? "red" : "grey";
          const today = new Date();
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          const totalMs = end.getTime() - start.getTime();
          const rawPct = ((today.getTime() - start.getTime()) / totalMs) * 100;
          const todayPct = Math.max(0, Math.min(100, rawPct));
          const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", yyyy: "numeric" } as any);
          return (
            <Link
              key={p.code}
              to="/workload"
              search={{ project: p.code, stage: p.stageGate } as any}
              className="block"
            >
            <Panel className="p-5 hover:border-primary/40 transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-mono text-primary tracking-wider">{p.code}</div>
                  <div className="text-base font-semibold mt-0.5">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.asset}</div>
                </div>
                <StatusTag tone={statusTone as any}>{p.status}</StatusTag>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div><div className="text-muted-foreground">Current</div><div className="font-medium">{p.currentDsp} · {p.currentStage}</div></div>
                <div><div className="text-muted-foreground">Responsible</div><div className="font-medium">{p.responsible}</div></div>
                <div><div className="text-muted-foreground">Target</div><div className="font-medium">{p.targetDate}</div></div>
                <div><div className="text-muted-foreground">Next</div><div className="font-medium truncate">{p.nextMilestone}</div></div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Timeline</span><span className="tabular-nums">{p.progress}%</span>
                </div>
                <div className="relative h-2 rounded-full bg-secondary overflow-visible">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${p.progress}%` }} />
                  <div
                    className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-[color:var(--status-red)]"
                    style={{ left: `${todayPct}%` }}
                    title={`Today · ${fmt(today)}`}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground tabular-nums">
                  <span>Start · {fmt(start)}</span>
                  <span className="text-[color:var(--status-red)]">Today · {fmt(today)}</span>
                  <span>End · {fmt(end)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg1} /> SG1</span>
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg2} /> SG2</span>
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg31} /> SG3.1</span>
                  <span className="flex items-center gap-1.5"><StatusDot status={p.sg32} /> SG3.2</span>
                </div>
                <span className={`text-[11px] font-medium ${p.daysRemaining < 0 ? "text-[color:var(--status-red)]" : "text-muted-foreground"}`}>
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {p.daysRemaining < 0 ? `${Math.abs(p.daysRemaining)}d overdue` : `${p.daysRemaining}d left`}
                </span>
              </div>
            </Panel>
            </Link>
          );
        })}
      </div>

      {/* Activity board */}
      <Panel className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">Activity Board</h2>
            <p className="text-xs text-muted-foreground">Advisory workspace — items tracked here support review, not automated approvals.</p>
          </div>
          <div className="flex gap-1 text-xs">
            {["Activities","DSP Inputs","CPA Comments","Closure Remarks","Change Log","Assurance"].map((t,i) => (
              <button key={t} className={`px-3 py-1.5 rounded-md border ${i===0?"bg-primary/15 border-primary/30 text-primary":"border-border text-muted-foreground hover:bg-secondary"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {columns.map((col) => (
            <div key={col} className="bg-secondary/30 border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col}</div>
                <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-background text-muted-foreground">{activities.filter(a=>a.column===col).length}</div>
              </div>
              <div className="space-y-2">
                {activities.filter(a=>a.column===col).map((a) => {
                  const typeTone = a.type === "CPA Comment" ? "yellow" : a.type === "DSP Input" ? "blue" : a.type === "Closure Remark" ? "orange" : "grey";
                  return (
                    <div key={a.id} className="bg-card border border-border rounded-md p-3 hover:border-primary/30 transition">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-medium leading-snug">{a.name}</div>
                        <StatusTag tone={typeTone as any}>{a.type}</StatusTag>
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">{a.project} · {a.stage}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>R: {a.responsible}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{a.comments}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">Due {a.due}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
