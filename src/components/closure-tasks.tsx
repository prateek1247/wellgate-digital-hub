import { useState } from "react";
import { Plus, Trash2, ArrowRightCircle } from "lucide-react";
import { Panel, StatusTag } from "@/components/shell";

type Stage = "SG1" | "SG2" | "SG3.1" | "SG3.2";
const STAGES: Stage[] = ["SG1", "SG2", "SG3.1", "SG3.2"];
type TaskStatus = "Open" | "In Progress" | "Closed";
export type ClosureTask = { id: string; comment: string; raisedAt: Stage; targetStage: Stage; owner: string; due: string; status: TaskStatus };

export const initialClosureTasks: ClosureTask[] = [
  { id: "ct1", comment: "Refine reserve basis (P50) with updated seismic interpretation.", raisedAt: "SG1", targetStage: "SG2", owner: "PE1", due: "2025-06-30", status: "Closed" },
  { id: "ct2", comment: "Complete H2S mitigation plan with named owners.", raisedAt: "SG2", targetStage: "SG3.1", owner: "HSE Team", due: "2026-10-15", status: "In Progress" },
  { id: "ct3", comment: "Finalise LLI procurement strategy (wellhead, 7\" liner hanger).", raisedAt: "SG2", targetStage: "SG3.1", owner: "Drilling Team", due: "2026-09-20", status: "Open" },
];

const next = (s: Stage): Stage => STAGES[Math.min(STAGES.indexOf(s) + 1, STAGES.length - 1)];
const tone = { Open: "orange", "In Progress": "blue", Closed: "green" } as const;

export function ClosureTasksPanel({ stage, tasks, setTasks, owners }: { stage: Stage; tasks: ClosureTask[]; setTasks: (f: (t: ClosureTask[]) => ClosureTask[]) => void; owners: string[] }) {
  const [draft, setDraft] = useState({ comment: "", owner: owners[0] ?? "", due: "", targetStage: next(stage) });
  const carried = tasks.filter(t => t.targetStage === stage);
  const raised = tasks.filter(t => t.raisedAt === stage);
  const update = (id: string, patch: Partial<ClosureTask>) => setTasks(ts => ts.map(t => (t.id === id ? { ...t, ...patch } : t)));
  const today = new Date().toISOString().slice(0, 10);

  const Row = ({ t, carry }: { t: ClosureTask; carry?: boolean }) => (
    <tr className="border-t border-border">
      <td className="py-2 pr-3">
        <div>{t.comment}</div>
        {carry && <div className="text-[10px] text-muted-foreground mt-0.5">Raised at {t.raisedAt} closure</div>}
      </td>
      <td className="pr-3">
        <select value={t.owner} onChange={e => update(t.id, { owner: e.target.value })} className="h-7 px-1.5 rounded border border-border bg-input/60 text-[11px]">
          {[t.owner, ...owners.filter(o => o !== t.owner)].map(o => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td className="pr-3">
        <input type="date" value={t.due} onChange={e => update(t.id, { due: e.target.value })} className="h-7 px-1.5 rounded border border-border bg-input/60 text-[11px]" />
        {t.status !== "Closed" && t.due && t.due < today && <div className="text-[10px] text-[color:var(--status-red)]">Overdue</div>}
      </td>
      <td className="pr-3">{carry ? <span className="text-muted-foreground">{t.targetStage}</span> : (
        <select value={t.targetStage} onChange={e => update(t.id, { targetStage: e.target.value as Stage })} className="h-7 px-1.5 rounded border border-border bg-input/60 text-[11px]">
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
      )}</td>
      <td className="pr-3">
        <div className="flex items-center gap-1.5">
          <StatusTag tone={tone[t.status]}>{t.status}</StatusTag>
          <select value={t.status} onChange={e => update(t.id, { status: e.target.value as TaskStatus })} className="h-7 px-1 rounded border border-border bg-input/60 text-[11px]">
            <option>Open</option><option>In Progress</option><option>Closed</option>
          </select>
        </div>
      </td>
      <td><button onClick={() => setTasks(ts => ts.filter(x => x.id !== t.id))} className="text-muted-foreground hover:text-[color:var(--status-red)]"><Trash2 className="h-3.5 w-3.5" /></button></td>
    </tr>
  );

  const Table = ({ rows, carry }: { rows: ClosureTask[]; carry?: boolean }) => (
    <table className="w-full text-xs">
      <thead><tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
        <th className="pb-2">Closure comment / task</th><th>Owner</th><th>Due</th><th>{carry ? "Tracked in" : "Track in stage"}</th><th>Status</th><th />
      </tr></thead>
      <tbody>{rows.length ? rows.map(t => <Row key={t.id} t={t} carry={carry} />) : <tr><td colSpan={6} className="py-3 text-muted-foreground">None.</td></tr>}</tbody>
    </table>
  );

  return (
    <div className="space-y-4">
      <Panel className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRightCircle className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Carried forward into {stage}</h3>
          <span className="text-[11px] text-muted-foreground">{carried.filter(t => t.status !== "Closed").length} open of {carried.length}</span>
        </div>
        <Table rows={carried} carry />
      </Panel>

      <Panel className="p-4">
        <h3 className="text-sm font-semibold mb-1">{stage} closure comments → tasks</h3>
        <p className="text-[11px] text-muted-foreground mb-3">Record closure comments as trackable tasks. They will appear under "Carried forward" in the selected stage.</p>
        <div className="grid grid-cols-12 gap-2 mb-4">
          <textarea value={draft.comment} onChange={e => setDraft({ ...draft, comment: e.target.value })} placeholder="Closure comment / action to track…" rows={2} className="col-span-12 lg:col-span-5 px-2 py-1.5 rounded-md border border-border bg-input/60 text-xs" />
          <select value={draft.owner} onChange={e => setDraft({ ...draft, owner: e.target.value })} className="col-span-4 lg:col-span-2 h-9 px-2 rounded-md border border-border bg-input/60 text-xs">
            {owners.map(o => <option key={o}>{o}</option>)}
          </select>
          <input type="date" value={draft.due} onChange={e => setDraft({ ...draft, due: e.target.value })} className="col-span-4 lg:col-span-2 h-9 px-2 rounded-md border border-border bg-input/60 text-xs" />
          <select value={draft.targetStage} onChange={e => setDraft({ ...draft, targetStage: e.target.value as Stage })} className="col-span-4 lg:col-span-1 h-9 px-2 rounded-md border border-border bg-input/60 text-xs">
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button
            disabled={!draft.comment.trim()}
            onClick={() => { setTasks(ts => [...ts, { id: `ct${Date.now()}`, comment: draft.comment.trim(), raisedAt: stage, targetStage: draft.targetStage, owner: draft.owner, due: draft.due, status: "Open" }]); setDraft({ ...draft, comment: "", due: "" }); }}
            className="col-span-12 lg:col-span-2 h-9 rounded-md bg-primary text-primary-foreground text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          ><Plus className="h-3.5 w-3.5" /> Add task</button>
        </div>
        <Table rows={raised} />
      </Panel>
    </div>
  );
}
