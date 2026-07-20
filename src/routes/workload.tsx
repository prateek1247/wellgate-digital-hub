import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import {
  projects,
  dspSections,
  workActivitiesByStage,
  stageVersions,
  gateWorkflowSteps,
  gateStepStatuses,
  validationRules,
  allTeams,
  changeLog,
  type WorkActivity,
} from "@/lib/mock";
import {
  Info,
  Bell,
  UserPlus,
  Plus,
  Download,
  Send,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  History,
  MessageSquare,
  X,
  ImageIcon,
  Table as TableIcon,
  FileText,
  Play,
  Edit3,
} from "lucide-react";

type Stage = "SG1" | "SG2" | "SG3.1" | "SG3.2";

export const Route = createFileRoute("/workload")({
  head: () => ({
    meta: [
      { title: "Workload — WDPGS" },
      { name: "description", content: "Activity tracker and DSP workspace across stage gates." },
    ],
  }),
  component: WorkloadPage,
});

const stageToDsp: Record<Stage, keyof typeof dspSections> = {
  SG1: "1.0", SG2: "2.0", "SG3.1": "3.1", "SG3.2": "3.2",
};

const CURRENT_USER = "Prateek S. (me)";

function WorkloadPage() {
  const [projectCode, setProjectCode] = useState(projects[0].code);
  const project = projects.find(p => p.code === projectCode) ?? projects[0];
  const [stage, setStage] = useState<Stage>("SG3.1");
  const [version, setVersion] = useState(stageVersions[stage][0]);
  const [tab, setTab] = useState<"activities" | "dsp">("activities");
  const [activities, setActivities] = useState<WorkActivity[]>(workActivitiesByStage[stage]);
  // reset activities when stage changes
  useMemo(() => setActivities(workActivitiesByStage[stage]), [stage]);

  const [reminderFor, setReminderFor] = useState<{ kind: "activity" | "section"; id: string; label: string } | null>(null);
  const [commentsModal, setCommentsModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  return (
    <div className="p-6 xl:p-8 max-w-[1800px] mx-auto">
      <PageHeader
        title="Workload"
        subtitle="Track activities and DSP preparation across stage gates. Advisory workspace — governance decisions remain off-platform."
        actions={
          <>
            <select
              value={projectCode}
              onChange={e => setProjectCode(e.target.value)}
              className="h-9 px-2 rounded-md border border-border bg-input/60 text-xs"
            >
              {projects.map(p => <option key={p.code} value={p.code}>{p.code} — {p.name}</option>)}
            </select>
            <button className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
              <Download className="h-3.5 w-3.5" /> Download DSP
            </button>
            <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5" /> Send for Review
            </button>
          </>
        }
      />

      {/* Stage gate tabs + version */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex gap-1 text-xs">
          {(["SG1", "SG2", "SG3.1", "SG3.2"] as Stage[]).map(s => (
            <button
              key={s}
              onClick={() => { setStage(s); setVersion(stageVersions[s][0]); }}
              className={`px-3 py-1.5 rounded-md border ${stage === s ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Version</span>
          <select
            value={version}
            onChange={e => setVersion(e.target.value)}
            className="h-8 px-2 rounded-md border border-border bg-input/60"
          >
            {stageVersions[stage].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="text-muted-foreground">for {stage}</span>
        </div>
      </div>

      {/* Gate workflow status strip */}
      <Panel className="p-3 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {gateWorkflowSteps.map((step, i) => {
            const status = gateStepStatuses[stage][i];
            const cls =
              status === "green" ? "bg-[color:var(--status-green)]/15 border-[color:var(--status-green)]/40 text-[color:var(--status-green)]"
              : status === "amber" ? "bg-[color:var(--status-orange)]/15 border-[color:var(--status-orange)]/40 text-[color:var(--status-orange)]"
              : "bg-secondary/40 border-border text-muted-foreground";
            return (
              <div key={step} className={`flex items-center gap-2 px-3 py-2 rounded-md border ${cls}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${status === "green" ? "bg-[color:var(--status-green)]" : status === "amber" ? "bg-[color:var(--status-orange)]" : "bg-muted-foreground"}`} />
                <div className="text-[11px] font-medium leading-tight">{step}</div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Section tabs */}
      <div className="flex gap-1 mb-4 text-xs">
        <button onClick={() => setTab("activities")} className={`px-3 py-2 rounded-md border ${tab === "activities" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>Activity Tracker</button>
        <button onClick={() => setTab("dsp")} className={`px-3 py-2 rounded-md border ${tab === "dsp" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>DSP</button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9 space-y-4">
          {tab === "activities" ? (
            <ActivityTracker
              stage={stage}
              activities={activities}
              setActivities={setActivities}
              openReminder={(a) => setReminderFor({ kind: "activity", id: a.id, label: a.title })}
            />
          ) : (
            <DspEditor
              stage={stage}
              openReminder={(id, label) => setReminderFor({ kind: "section", id, label })}
            />
          )}
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-4">
          <WorkingComments onViewAll={() => setCommentsModal(true)} />
          <CpaComments />
          <SectionHistory onViewAll={() => setHistoryModal(true)} />
          <ValidationRulesPanel />
        </div>
      </div>

      {reminderFor && <ReminderModal target={reminderFor} onClose={() => setReminderFor(null)} />}
      {commentsModal && <AllCommentsModal onClose={() => setCommentsModal(false)} />}
      {historyModal && <HistoryModal onClose={() => setHistoryModal(false)} />}

      <div className="mt-4 text-[10px] text-muted-foreground">
        Project: <span className="text-foreground/70">{project.code} — {project.name}</span>
      </div>
    </div>
  );
}

/* ------------------------------ Activity tracker ---------------------------- */

function ActivityTracker({
  stage, activities, setActivities, openReminder,
}: {
  stage: Stage;
  activities: WorkActivity[];
  setActivities: (a: WorkActivity[]) => void;
  openReminder: (a: WorkActivity) => void;
}) {
  const update = (id: string, patch: Partial<WorkActivity>) =>
    setActivities(activities.map(a => (a.id === id ? { ...a, ...patch } : a)));

  const addActivity = () => {
    const nextId = `${stage}-new-${activities.length + 1}`;
    setActivities([
      ...activities,
      { id: nextId, title: "New activity", description: "", team: undefined, target: "", status: "not-started" },
    ]);
  };

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">Activity Tracker · {stage}</div>
          <div className="text-[11px] text-muted-foreground">Assign teams, set target dates, trigger reminders.</div>
        </div>
        <button onClick={addActivity} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Activity
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="text-left px-2 py-2 w-10">Status</th>
              <th className="text-left px-2 py-2">Activity</th>
              <th className="text-left px-2 py-2 w-[160px]">Assign Team</th>
              <th className="text-left px-2 py-2 w-[130px]">Target Date</th>
              <th className="text-left px-2 py-2 w-[190px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map(a => {
              const tone = a.status === "completed" ? "green" : a.status === "in-progress" ? "orange" : a.status === "overdue" ? "red" : "grey";
              return (
                <tr key={a.id} className="hover:bg-secondary/20 align-top">
                  <td className="px-2 py-3">
                    <select
                      value={a.status}
                      onChange={e => update(a.id, { status: e.target.value as WorkActivity["status"] })}
                      className="h-7 rounded border border-border bg-input/60 text-[10px] px-1 w-24"
                    >
                      <option value="not-started">Not started</option>
                      <option value="in-progress">In progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <div className="mt-1"><StatusTag tone={tone as any}>{a.status.replace("-", " ")}</StatusTag></div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-start gap-1.5">
                      <span className="font-medium text-foreground/95">{a.id} · {a.title}</span>
                      {a.description && (
                        <span className="group relative">
                          <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-help" />
                          <span className="hidden group-hover:block absolute z-10 top-5 left-0 w-72 p-2 rounded-md border border-border bg-card text-[11px] shadow-lg">
                            {a.description}
                          </span>
                        </span>
                      )}
                    </div>
                    {a.subs && (
                      <ul className="mt-1 ml-3 list-disc text-[11px] text-muted-foreground space-y-0.5">
                        {a.subs.map(s => <li key={s}>{s}</li>)}
                      </ul>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <select
                      value={a.team ?? ""}
                      onChange={e => update(a.id, { team: e.target.value || undefined })}
                      className="h-7 w-full rounded border border-border bg-input/60 text-[11px] px-1"
                    >
                      <option value="">Unassigned</option>
                      {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button
                      onClick={() => update(a.id, { team: CURRENT_USER })}
                      className="mt-1 text-[10px] text-primary hover:underline flex items-center gap-1"
                    >
                      <UserPlus className="h-3 w-3" /> Assign to myself
                    </button>
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="date"
                      value={a.target ?? ""}
                      onChange={e => update(a.id, { target: e.target.value })}
                      className="h-7 rounded border border-border bg-input/60 text-[11px] px-1 w-full"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => { update(a.id, { reminder: true }); openReminder(a); }}
                        className={`h-7 px-2 rounded border text-[10px] flex items-center gap-1 ${a.reminder ? "border-[color:var(--status-orange)]/40 text-[color:var(--status-orange)]" : "border-border text-muted-foreground hover:bg-secondary"}`}
                      >
                        <Bell className="h-3 w-3" /> {a.reminder ? "Reminder set" : "Reminder"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ------------------------------ DSP editor ---------------------------------- */

type DspNode = { id: string; title: string; children?: DspNode[]; assignedTeam?: string };

function DspEditor({ stage, openReminder }: { stage: Stage; openReminder: (id: string, label: string) => void }) {
  const dspKey = stageToDsp[stage];
  const meta = dspSections[dspKey];

  const [sections, setSections] = useState<DspNode[]>(() =>
    meta.sections.map((s, i) => ({ id: `s-${i}`, title: s }))
  );
  const [selectedId, setSelectedId] = useState<string>("s-0");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [blocks, setBlocks] = useState<Record<string, { type: "text" | "table" | "image"; content: string }[]>>({});
  const [targets, setTargets] = useState<Record<string, string>>({});

  const selected = findNode(sections, selectedId);

  const addSection = () => {
    const id = `s-new-${sections.length}`;
    setSections([...sections, { id, title: "New section" }]);
    setSelectedId(id);
  };
  const addSubsection = (parentId: string) => {
    setSections(sections.map(s => addChild(s, parentId, `${parentId}-c-${Date.now()}`)));
    setExpanded({ ...expanded, [parentId]: true });
  };

  const updateNode = (id: string, patch: Partial<DspNode>) => {
    setSections(sections.map(s => mapNode(s, id, patch)));
  };

  const addBlock = (id: string, type: "text" | "table" | "image") => {
    const arr = blocks[id] ?? [];
    setBlocks({ ...blocks, [id]: [...arr, { type, content: type === "text" ? "" : "" }] });
  };
  const updateBlock = (id: string, i: number, content: string) => {
    const arr = [...(blocks[id] ?? [])];
    arr[i] = { ...arr[i], content };
    setBlocks({ ...blocks, [id]: arr });
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 md:col-span-4 p-3 max-h-[calc(100vh-380px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{meta.title}</div>
          </div>
          <div className="flex gap-1 mb-2 px-1">
            <button onClick={addSection} className="text-[10px] px-2 py-1 rounded border border-border hover:bg-secondary flex items-center gap-1"><Plus className="h-3 w-3" />Section</button>
            <button onClick={() => addSubsection(selectedId.split("-c-")[0])} className="text-[10px] px-2 py-1 rounded border border-border hover:bg-secondary flex items-center gap-1"><Plus className="h-3 w-3" />Subsection</button>
          </div>
          <TreeView
            nodes={sections}
            selectedId={selectedId}
            expanded={expanded}
            onSelect={setSelectedId}
            onToggle={id => setExpanded({ ...expanded, [id]: !expanded[id] })}
          />
        </Panel>

        <div className="col-span-12 md:col-span-8 space-y-3">
          {selected && (
            <Panel className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <input
                    className="text-lg font-semibold bg-transparent border-none outline-none w-full"
                    value={selected.title}
                    onChange={e => updateNode(selected.id, { title: e.target.value })}
                  />
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Section info</span>
                  </div>
                </div>
                <button
                  onClick={() => openReminder(selected.id, selected.title)}
                  className="h-8 px-3 rounded border border-border text-[11px] flex items-center gap-1.5 hover:bg-secondary"
                >
                  <Bell className="h-3.5 w-3.5" /> Reminder
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Assign Team</div>
                  <select
                    value={selected.assignedTeam ?? ""}
                    onChange={e => updateNode(selected.id, { assignedTeam: e.target.value || undefined })}
                    className="h-8 w-full rounded border border-border bg-input/60 text-[11px] px-2"
                  >
                    <option value="">Unassigned</option>
                    {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    onClick={() => updateNode(selected.id, { assignedTeam: CURRENT_USER })}
                    className="mt-1 text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="h-3 w-3" /> Assign to myself
                  </button>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Target Date</div>
                  <input
                    type="date"
                    value={targets[selected.id] ?? ""}
                    onChange={e => setTargets({ ...targets, [selected.id]: e.target.value })}
                    className="h-8 w-full rounded border border-border bg-input/60 text-[11px] px-2"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Assigned to</div>
                  <div className="h-8 flex items-center px-2 rounded border border-border bg-secondary/30 text-[11px]">
                    {selected.assignedTeam ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground">Content</div>
                  <div className="flex gap-1">
                    <button onClick={() => addBlock(selected.id, "text")} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><FileText className="h-3 w-3" />Text</button>
                    <button onClick={() => addBlock(selected.id, "table")} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><TableIcon className="h-3 w-3" />Table</button>
                    <button onClick={() => addBlock(selected.id, "image")} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><ImageIcon className="h-3 w-3" />Image</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {(blocks[selected.id] ?? []).length === 0 && (
                    <div className="text-[11px] text-muted-foreground italic border border-dashed border-border rounded p-4 text-center">
                      No content yet — add text, tables, or images.
                    </div>
                  )}
                  {(blocks[selected.id] ?? []).map((b, i) => (
                    <BlockEditor key={i} block={b} onChange={c => updateBlock(selected.id, i, c)} />
                  ))}
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function BlockEditor({ block, onChange }: { block: { type: "text" | "table" | "image"; content: string }; onChange: (c: string) => void }) {
  if (block.type === "text") {
    return (
      <textarea
        value={block.content}
        onChange={e => onChange(e.target.value)}
        placeholder="Write content…"
        className="w-full min-h-[100px] p-3 rounded border border-border bg-input/60 text-sm"
      />
    );
  }
  if (block.type === "table") {
    return (
      <div className="rounded border border-border overflow-hidden">
        <div className="text-[10px] px-2 py-1 bg-secondary/40 text-muted-foreground border-b border-border">Table (mock)</div>
        <table className="w-full text-xs">
          <thead className="bg-secondary/20"><tr>{["Col A","Col B","Col C"].map(h=><th key={h} className="text-left px-2 py-1.5 border-r border-border last:border-0">{h}</th>)}</tr></thead>
          <tbody>{[0,1,2].map(r=><tr key={r} className="border-t border-border">{[0,1,2].map(c=><td key={c} className="px-2 py-1.5 border-r border-border last:border-0"><input className="w-full bg-transparent outline-none" placeholder="…"/></td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="rounded border border-dashed border-border p-6 text-center bg-secondary/20">
      <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground" />
      <div className="text-[11px] text-muted-foreground mt-1">Drop or upload image (mock)</div>
    </div>
  );
}

function TreeView({
  nodes, selectedId, expanded, onSelect, onToggle, depth = 0,
}: {
  nodes: DspNode[]; selectedId: string; expanded: Record<string, boolean>;
  onSelect: (id: string) => void; onToggle: (id: string) => void; depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map(n => (
        <div key={n.id}>
          <div
            onClick={() => onSelect(n.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer ${selectedId === n.id ? "bg-primary/15 text-primary" : "hover:bg-secondary text-foreground/80"}`}
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            {n.children?.length ? (
              <button onClick={e => { e.stopPropagation(); onToggle(n.id); }} className="text-muted-foreground">
                {expanded[n.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            ) : <span className="w-3" />}
            <span className="truncate">{n.title}</span>
          </div>
          {n.children && expanded[n.id] && (
            <TreeView nodes={n.children} selectedId={selectedId} expanded={expanded} onSelect={onSelect} onToggle={onToggle} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

function findNode(nodes: DspNode[], id: string): DspNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const c = findNode(n.children, id);
      if (c) return c;
    }
  }
}
function mapNode(n: DspNode, id: string, patch: Partial<DspNode>): DspNode {
  if (n.id === id) return { ...n, ...patch };
  if (n.children) return { ...n, children: n.children.map(c => mapNode(c, id, patch)) };
  return n;
}
function addChild(n: DspNode, parentId: string, newId: string): DspNode {
  if (n.id === parentId) {
    return { ...n, children: [...(n.children ?? []), { id: newId, title: "New subsection" }] };
  }
  if (n.children) return { ...n, children: n.children.map(c => addChild(c, parentId, newId)) };
  return n;
}

/* ------------------------------ Right rail ---------------------------------- */

function WorkingComments({ onViewAll }: { onViewAll: () => void }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Working Comments</div>
        <button onClick={onViewAll} className="text-[11px] text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-2">
        {[
          { c: "Confirm pore pressure gradient", owner: "RST", due: "2026-07-30" },
          { c: "Verify casing shoe depth", owner: "Drilling Team", due: "2026-07-28" },
        ].map(x => (
          <div key={x.c} className="border border-border rounded-md p-2.5 bg-secondary/20">
            <div className="text-xs font-medium">{x.c}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Owner {x.owner} · Due {x.due}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CpaComments() {
  const [comments, setComments] = useState([
    { id: "c1", c: "Provide justification for excluded option 3", assignedActivity: "", assignedSection: "", team: "FD Team" },
    { id: "c2", c: "Clarify data acquisition scope for offset well #4", assignedActivity: "", assignedSection: "", team: "IE Team" },
  ]);
  const update = (id: string, patch: Partial<(typeof comments)[number]>) =>
    setComments(comments.map(c => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPA Comments</div>
        <StatusTag tone="yellow">{comments.length} open</StatusTag>
      </div>
      <div className="space-y-2">
        {comments.map(x => (
          <div key={x.id} className="border border-[color:var(--status-yellow)]/25 bg-[color:var(--status-yellow)]/5 rounded-md p-2.5 space-y-1.5">
            <div className="text-xs">{x.c}</div>
            <div className="grid grid-cols-1 gap-1">
              <label className="text-[10px] text-muted-foreground">Assign to Activity
                <input value={x.assignedActivity} onChange={e => update(x.id, { assignedActivity: e.target.value })}
                  placeholder="e.g. 1.2 Preliminary SS X,Y" className="mt-0.5 h-6 w-full text-[11px] px-1.5 rounded border border-border bg-input/60" />
              </label>
              <label className="text-[10px] text-muted-foreground">Assign to DSP Section
                <input value={x.assignedSection} onChange={e => update(x.id, { assignedSection: e.target.value })}
                  placeholder="e.g. Risk Register" className="mt-0.5 h-6 w-full text-[11px] px-1.5 rounded border border-border bg-input/60" />
              </label>
              <label className="text-[10px] text-muted-foreground">Assign to Team
                <select value={x.team} onChange={e => update(x.id, { team: e.target.value })}
                  className="mt-0.5 h-6 w-full text-[11px] px-1 rounded border border-border bg-input/60">
                  <option value="">Unassigned</option>
                  {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SectionHistory({ onViewAll }: { onViewAll: () => void }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section History</div>
        <button onClick={onViewAll} className="text-[11px] text-primary hover:underline flex items-center gap-1">
          <History className="h-3 w-3" /> Detailed audit
        </button>
      </div>
      <div className="space-y-1.5 text-[11px]">
        {["Content updated by FD Team · 2026-07-14", "CPA clarification raised · 2026-07-12", "Draft imported from template · 2026-07-05"].map(e => (
          <div key={e} className="py-1 border-b border-border last:border-0">{e}</div>
        ))}
      </div>
    </Panel>
  );
}

function ValidationRulesPanel() {
  const [rules, setRules] = useState(validationRules);
  const run = () => {
    // toggle a couple to demonstrate re-validation
    setRules(rules.map((r, i) => i === 0 ? { ...r, state: r.state === "fail" ? "warn" : "fail" } : r));
  };
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5" /> Validation Rules
        </div>
        <button onClick={run} className="text-[11px] px-2 py-1 rounded border border-border hover:bg-secondary flex items-center gap-1">
          <Play className="h-3 w-3" /> Run
        </button>
      </div>
      <div className="space-y-1.5">
        {rules.map(r => {
          const tone = r.state === "pass" ? "green" : r.state === "warn" ? "orange" : "red";
          return (
            <div key={r.id} className="flex items-center justify-between text-[11px] border border-border rounded px-2 py-1.5">
              <span>{r.title}</span>
              <StatusTag tone={tone as any}>{r.state}</StatusTag>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground italic">Advisory only — Gate Keeper decides.</p>
    </Panel>
  );
}

/* ------------------------------ Modals -------------------------------------- */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-3xl bg-card border border-border rounded-xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-sm font-semibold">{title}</div>
          <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function ReminderModal({ target, onClose }: { target: { kind: "activity" | "section"; id: string; label: string }; onClose: () => void }) {
  const [content, setContent] = useState(`Reminder: please action "${target.label}" ahead of the target date.`);
  const [when, setWhen] = useState("");
  const [reminders, setReminders] = useState<{ id: string; when: string; content: string; sent: boolean }[]>([
    { id: "r1", when: "2026-07-10", content: "Initial reminder sent.", sent: true },
  ]);
  const add = () => {
    setReminders([...reminders, { id: `r${reminders.length + 1}`, when: when || new Date().toISOString().slice(0, 10), content, sent: false }]);
  };
  return (
    <Modal title={`Reminder — ${target.kind === "activity" ? "Activity" : "DSP Section"}: ${target.label}`} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <label className="text-[11px] text-muted-foreground md:col-span-1">
          Trigger date
          <input type="date" value={when} onChange={e => setWhen(e.target.value)} className="mt-1 h-8 w-full px-2 rounded border border-border bg-input/60 text-xs" />
        </label>
        <label className="text-[11px] text-muted-foreground md:col-span-2">
          Reminder content
          <textarea value={content} onChange={e => setContent(e.target.value)} className="mt-1 min-h-[70px] w-full p-2 rounded border border-border bg-input/60 text-xs" />
        </label>
      </div>
      <button onClick={add} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs">Trigger reminder</button>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tracked reminders</div>
        <div className="space-y-2">
          {reminders.map(r => (
            <div key={r.id} className="border border-border rounded p-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{r.when}</span>
                <span className="flex items-center gap-2">
                  <StatusTag tone={r.sent ? "green" : "orange"}>{r.sent ? "Sent" : "Scheduled"}</StatusTag>
                  <button className="text-primary flex items-center gap-1"><Edit3 className="h-3 w-3" />Edit</button>
                </span>
              </div>
              <div className="mt-1 text-xs">{r.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function AllCommentsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="All Working Comments" onClose={onClose}>
      <div className="space-y-2">
        {[
          { c: "Confirm pore pressure gradient", owner: "RST", due: "2026-07-30", status: "open" },
          { c: "Verify casing shoe depth", owner: "Drilling Team", due: "2026-07-28", status: "open" },
          { c: "Reconcile PAD allocations vs MWP list", owner: "IE Team", due: "2026-07-22", status: "responded" },
          { c: "Add offset well #7 to petrophysical analysis", owner: "IE Team", due: "2026-07-15", status: "closed" },
          { c: "Attach directional company assessment", owner: "Drilling Team", due: "2026-07-19", status: "closed" },
          { c: "Update long-lead item lead times", owner: "FD Team", due: "2026-08-05", status: "open" },
        ].map(x => (
          <div key={x.c} className="border border-border rounded p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="font-medium">{x.c}</div>
              <StatusTag tone={x.status === "closed" ? "green" : x.status === "responded" ? "blue" : "orange"}>{x.status}</StatusTag>
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">Owner {x.owner} · Due {x.due}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function HistoryModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Detailed Change History (Audit)" onClose={onClose}>
      <table className="w-full text-xs">
        <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
          <tr>{["When","Who","Section","Field / What","From","To","Scope","Reason"].map(h=><th key={h} className="text-left py-1.5 pr-2">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {changeLog.map((c, i) => (
            <tr key={i}>
              <td className="py-2 pr-2 whitespace-nowrap text-muted-foreground">{c.when}</td>
              <td className="py-2 pr-2">{c.who}</td>
              <td className="py-2 pr-2">{c.section}</td>
              <td className="py-2 pr-2">{c.what}</td>
              <td className="py-2 pr-2 text-muted-foreground">{c.from}</td>
              <td className="py-2 pr-2">{c.to}</td>
              <td className="py-2 pr-2">{c.scope}</td>
              <td className="py-2 pr-2">{c.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
