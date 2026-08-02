import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
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
  appUsers,
  autoTextTags,
  changeLog,
  type WorkActivity,
} from "@/lib/mock";
import {
  Info,
  Bell,
  UserPlus,
  Plus,
  Send,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  History,
  X,
  ImageIcon,
  Table as TableIcon,
  FileText,
  Play,
  Edit3,
  Database,
  Wrench,
  RefreshCw,
  Folder,
  ChevronsRight,
  Eye,
  Presentation,
  Copy,
  Paperclip,
  MessageSquare,
  AlertTriangle,
  Tag,
  CalendarDays,
  Check,
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
  const [tab, setTab] = useState<"activities" | "dsp" | "meetings">("activities");
  const [activities, setActivities] = useState<WorkActivity[]>(workActivitiesByStage[stage]);
  useEffect(() => { setActivities(workActivitiesByStage[stage]); }, [stage]);

  const [reminderFor, setReminderFor] = useState<{ kind: "activity" | "section"; id: string; label: string } | null>(null);
  const [commentsModal, setCommentsModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [finalDspOpen, setFinalDspOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [tagValuesOpen, setTagValuesOpen] = useState(false);
  const [tagValues, setTagValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(autoTextTags.map(t => [t.tag, t.sample])));
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

  const WORKFLOW_STATUSES = ["Not Started","In Progress","Submitted to Planning","CPA Review","Clarifications","Pending Gate Keeper Review","Completed"] as const;
  type WFStatus = typeof WORKFLOW_STATUSES[number];
  const [workflowStatus, setWorkflowStatus] = useState<WFStatus>("In Progress");
  const statusTone: Record<WFStatus, "grey"|"orange"|"blue"|"yellow"|"green"> = {
    "Not Started":"grey","In Progress":"orange","Submitted to Planning":"blue",
    "CPA Review":"blue","Clarifications":"yellow","Pending Gate Keeper Review":"yellow","Completed":"green"
  };
  const meetingsComplete = meetings.length > 0 && meetings.every(m => m.summary.trim() !== "" && m.comments.trim() !== "");

  // Lifted DSP editor state so CPA comments can deep-link to a section.
  const dspKey = stageToDsp[stage];
  const dspMeta = dspSections[dspKey];
  const [dspNodes, setDspNodes] = useState<DspNode[]>(() => dspMeta.sections.map((s, i) => seedNode(`s-${i}`, s, i)));
  const [dspSelectedId, setDspSelectedId] = useState<string>("s-0");
  useEffect(() => {
    const next = dspMeta.sections.map((s, i) => seedNode(`s-${i}`, s, i));
    setDspNodes(next);
    setDspSelectedId(next[0]?.id ?? "");
  }, [dspMeta]);

  const openDspSection = (title: string) => {
    setTab("dsp");
    const match = findNodeByTitle(dspNodes, title);
    if (match) setDspSelectedId(match.id);
  };

  return (
    <div className="p-6 xl:p-8 max-w-[1800px] mx-auto">
      <PageHeader
        title={<span className="flex items-baseline gap-2 flex-wrap">Workload<span className="text-base font-normal text-muted-foreground">· {project.code} — {project.name}</span></span>}
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
            <button onClick={() => setFinalDspOpen(true)} className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
              <Eye className="h-3.5 w-3.5" /> View Final DSP
            </button>
            <button onClick={() => setPresentationOpen(true)} className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
              <Presentation className="h-3.5 w-3.5" /> View &amp; Edit Presentation
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
      <div className="flex items-center gap-3 mb-4 text-xs flex-wrap">
        <div className="flex gap-1">
          <button onClick={() => setTab("activities")} className={`px-3 py-2 rounded-md border ${tab === "activities" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>Activity Tracker</button>
          <button onClick={() => setTab("dsp")} className={`px-3 py-2 rounded-md border ${tab === "dsp" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>DSP</button>
          <button onClick={() => setTab("meetings")} className={`px-3 py-2 rounded-md border flex items-center gap-1.5 ${tab === "meetings" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>
            <CalendarDays className="h-3.5 w-3.5" /> Meetings
            <span className={`h-1.5 w-1.5 rounded-full ${meetingsComplete ? "bg-[color:var(--status-green)]" : "bg-[color:var(--status-orange)]"}`} />
          </button>
        </div>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <span className="text-muted-foreground text-[11px]">Status</span>
          <StatusTag tone={statusTone[workflowStatus]}>{workflowStatus}</StatusTag>
          <select
            value={workflowStatus}
            onChange={e => {
              const next = e.target.value as WFStatus;
              if (next === "Completed" && !meetingsComplete) { setTab("meetings"); return; }
              setWorkflowStatus(next);
            }}
            className="h-7 px-1.5 rounded border border-border bg-input/60 text-[11px]"
          >
            {WORKFLOW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {!meetingsComplete && (
            <span className="text-[10px] text-[color:var(--status-orange)] flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Meeting comments &amp; summary required to close the gate
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9 space-y-4">
          {tab === "activities" && (
            <ActivityTracker
              stage={stage}
              activities={activities}
              setActivities={setActivities}
              openReminder={(a) => setReminderFor({ kind: "activity", id: a.id, label: a.title })}
            />
          )}
          {tab === "dsp" && (
            <DspEditor
              stage={stage}
              sections={dspNodes}
              setSections={setDspNodes}
              selectedId={dspSelectedId}
              setSelectedId={setDspSelectedId}
              openReminder={(id, label) => setReminderFor({ kind: "section", id, label })}
              onOpenTagValues={() => setTagValuesOpen(true)}
              tagValues={tagValues}
            />
          )}
          {tab === "meetings" && <MeetingsPanel meetings={meetings} setMeetings={setMeetings} stage={stage} />}
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-4">
          <WorkingComments onViewAll={() => setCommentsModal(true)} />
          <CpaComments dspSectionTitles={dspNodes.map(n => n.title)} onOpenSection={openDspSection} />
          <SectionHistory onViewAll={() => setHistoryModal(true)} />
          <ValidationRulesPanel />
        </div>
      </div>

      {reminderFor && <ReminderModal target={reminderFor} onClose={() => setReminderFor(null)} />}
      {commentsModal && <AllCommentsModal onClose={() => setCommentsModal(false)} />}
      {historyModal && <HistoryModal onClose={() => setHistoryModal(false)} />}
      {finalDspOpen && <FinalDspModal stage={stage} version={version} project={`${project.code} — ${project.name}`} sections={dspNodes} tagValues={tagValues} onClose={() => setFinalDspOpen(false)} />}
      {presentationOpen && <PresentationModal stage={stage} sections={dspNodes} onClose={() => setPresentationOpen(false)} />}
      {tagValuesOpen && <TagValuesModal values={tagValues} setValues={setTagValues} project={project.name} onClose={() => setTagValuesOpen(false)} />}

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

type SectionStatus = "not-started" | "in-progress" | "completed";
type Attachment = { id: string; name: string; showInFinal: boolean };
type DspNode = {
  id: string;
  title: string;
  children?: DspNode[];
  assignedUser?: string;
  status?: SectionStatus;
  target?: string;
  comments?: number;
  attachments?: Attachment[];
};

function seedNode(id: string, title: string, i: number): DspNode {
  const statuses: SectionStatus[] = ["completed", "in-progress", "not-started"];
  const targets = ["2026-07-10", "2026-08-15", "2026-09-30", "2026-10-20"];
  return {
    id,
    title,
    status: statuses[i % 3],
    target: targets[i % 4],
    comments: i % 5 === 0 ? 3 : i % 3 === 0 ? 1 : 0,
    attachments: i % 4 === 0 ? [{ id: `${id}-a1`, name: "supporting-note.pdf", showInFinal: true }] : [],
  };
}

const TODAY = new Date().toISOString().slice(0, 10);
const isOverdue = (n: DspNode) => !!n.target && n.target < TODAY && n.status !== "completed";
const prevStage: Record<Stage, Stage | null> = { SG1: null, SG2: "SG1", "SG3.1": "SG2", "SG3.2": "SG3.1" };

function DspEditor({ stage, sections, setSections, selectedId, setSelectedId, openReminder, onOpenTagValues, tagValues }: {
  stage: Stage;
  sections: DspNode[];
  setSections: (s: DspNode[]) => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  openReminder: (id: string, label: string) => void;
  onOpenTagValues: () => void;
  tagValues: Record<string, string>;
}) {
  const dspKey = stageToDsp[stage];
  const meta = dspSections[dspKey];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [blocks, setBlocks] = useState<Record<string, ContentBlock[]>>({});
  const [edmOpen, setEdmOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [validationTick, setValidationTick] = useState(0);
  const [copiedFrom, setCopiedFrom] = useState<string | null>(null);

  const selected = findNode(sections, selectedId);

  const addSection = () => {
    const id = `s-new-${sections.length}`;
    setSections([...sections, { id, title: "New section", status: "not-started", comments: 0, attachments: [] }]);
    setSelectedId(id);
  };
  const addSubsection = (parentId: string) => {
    setSections(sections.map(s => addChild(s, parentId, `${parentId}-c-${Date.now()}`)));
    setExpanded({ ...expanded, [parentId]: true });
  };

  const updateNode = (id: string, patch: Partial<DspNode>) => {
    setSections(sections.map(s => mapNode(s, id, patch)));
  };

  const addBlock = (id: string, type: ContentBlock["type"], payload?: Partial<ContentBlock>) => {
    const arr = blocks[id] ?? [];
    setBlocks({ ...blocks, [id]: [...arr, { type, content: "", ...payload }] });
  };
  const updateBlock = (id: string, i: number, content: string) => {
    const arr = [...(blocks[id] ?? [])];
    arr[i] = { ...arr[i], content };
    setBlocks({ ...blocks, [id]: arr });
  };
  const importFromEdm = (payload: { trajectory: string; casing: string }) => {
    if (!selected) return;
    addBlock(selected.id, "trajectory", { content: payload.trajectory });
    addBlock(selected.id, "casing", { content: payload.casing });
    setEdmOpen(false);
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
            <button onClick={onOpenTagValues} className="text-[10px] px-2 py-1 rounded border border-primary/40 text-primary hover:bg-primary/10 flex items-center gap-1"><Tag className="h-3 w-3" />Tag Values</button>
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
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Section info</span>
                    <StatusTag tone={selected.status === "completed" ? "green" : selected.status === "in-progress" ? "orange" : "grey"}>
                      {(selected.status ?? "not-started").replace("-", " ")}
                    </StatusTag>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-[10px]">
                      <MessageSquare className="h-3 w-3" /> {selected.comments ?? 0} comments
                    </span>
                    {isOverdue(selected) && (
                      <StatusTag tone="red"><AlertTriangle className="h-3 w-3" /> Overdue</StatusTag>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={!prevStage[stage]}
                    onClick={() => { setCopiedFrom(prevStage[stage]); updateNode(selected.id, { status: "in-progress" }); }}
                    title={prevStage[stage] ? `Copy this section's content from ${prevStage[stage]}` : "No previous stage gate"}
                    className="h-8 px-3 rounded border border-border text-[11px] flex items-center gap-1.5 hover:bg-secondary disabled:opacity-40"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy from {prevStage[stage] ?? "—"}
                  </button>
                  <button
                    onClick={() => openReminder(selected.id, selected.title)}
                    className="h-8 px-3 rounded border border-border text-[11px] flex items-center gap-1.5 hover:bg-secondary"
                  >
                    <Bell className="h-3.5 w-3.5" /> Reminder
                  </button>
                </div>
              </div>
              {copiedFrom && (
                <div className="mt-2 text-[10px] text-[color:var(--status-green)] flex items-center gap-1">
                  <Check className="h-3 w-3" /> Content copied from {copiedFrom} — review and update before submission.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Assign User</div>
                  <select
                    value={selected.assignedUser ?? ""}
                    onChange={e => updateNode(selected.id, { assignedUser: e.target.value || undefined })}
                    className="h-8 w-full rounded border border-border bg-input/60 text-[11px] px-2"
                  >
                    <option value="">Unassigned</option>
                    {appUsers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    onClick={() => updateNode(selected.id, { assignedUser: CURRENT_USER })}
                    className="mt-1 text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="h-3 w-3" /> Assign to myself
                  </button>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Target Date</div>
                  <input
                    type="date"
                    value={selected.target ?? ""}
                    onChange={e => updateNode(selected.id, { target: e.target.value })}
                    className="h-8 w-full rounded border border-border bg-input/60 text-[11px] px-2"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Status</div>
                  <select
                    value={selected.status ?? "not-started"}
                    onChange={e => updateNode(selected.id, { status: e.target.value as SectionStatus })}
                    className="h-8 w-full rounded border border-border bg-input/60 text-[11px] px-2"
                  >
                    <option value="not-started">Not started</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <AttachmentsBlock node={selected} onChange={patch => updateNode(selected.id, patch)} />

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    Content
                    <button
                      title="Engineering check rules"
                      onClick={() => setRulesOpen(true)}
                      className="h-6 w-6 grid place-items-center rounded border border-border hover:bg-secondary text-primary"
                    >
                      <Wrench className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => addBlock(selected.id, "text")} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><FileText className="h-3 w-3" />Text</button>
                    <button onClick={() => addBlock(selected.id, "image")} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><ImageIcon className="h-3 w-3" />Image</button>
                    <button onClick={() => addBlock(selected.id, "table")} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><TableIcon className="h-3 w-3" />Table</button>
                    <button onClick={() => setEdmOpen(true)} className="h-7 px-2 rounded border border-primary/40 text-[10px] flex items-center gap-1 text-primary hover:bg-primary/10">
                      <Database className="h-3 w-3" />Import from EDM
                    </button>
                    <button onClick={() => setValidationTick(v => v + 1)} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary" title="Re-run validation on changes">
                      <RefreshCw className="h-3 w-3" />Re-run validation
                    </button>
                  </div>
                </div>
                {validationTick > 0 && (
                  <div className="mb-2 text-[10px] text-[color:var(--status-green)] flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Validation re-run #{validationTick} · trajectory & casing checks refreshed
                  </div>
                )}
                <div className="space-y-2">
                  {(blocks[selected.id] ?? []).length === 0 && (
                    <div className="text-[11px] text-muted-foreground italic border border-dashed border-border rounded p-4 text-center">
                      No content yet — add text, tables, images, or import from EDM.
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
      {edmOpen && <EdmImportModal onClose={() => setEdmOpen(false)} onImport={importFromEdm} />}
      {rulesOpen && <EngineeringRulesModal onClose={() => setRulesOpen(false)} />}
    </>
  );
}

type ContentBlock = { type: "text" | "table" | "image" | "trajectory" | "casing"; content: string };

function BlockEditor({ block, onChange }: { block: ContentBlock; onChange: (c: string) => void }) {
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
  if (block.type === "trajectory") {
    return (
      <div className="rounded border border-primary/30 bg-primary/5 overflow-hidden">
        <div className="text-[10px] px-2 py-1 bg-primary/10 text-primary border-b border-primary/30 flex items-center gap-1.5">
          <Database className="h-3 w-3" /> EDM · Trajectory — {block.content || "NK-224 Design R3"}
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <TrajectoryTopView />
          <TrajectorySectionView />
        </div>
      </div>
    );
  }
  if (block.type === "casing") {
    return (
      <div className="rounded border border-primary/30 bg-primary/5 overflow-hidden">
        <div className="text-[10px] px-2 py-1 bg-primary/10 text-primary border-b border-primary/30 flex items-center gap-1.5">
          <Database className="h-3 w-3" /> EDM · Casing Design — {block.content || "NK-224 Design R3"}
        </div>
        <div className="p-3 space-y-2">
          <CasingLoadTable />
          <CasingDesignLimitPlot />
        </div>
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

/* ------------------------------ EDM Import ---------------------------------- */

const edmTree = {
  Company: "Kuwait Oil Company",
  projects: [
    {
      name: "NKDP", sites: [
        { name: "North Kuwait Site 12", wells: [
          { name: "NK-224", wellbores: [
            { name: "NK-224 OH", designs: ["Design R1", "Design R2", "Design R3 (latest)"] },
            { name: "NK-224 ST1", designs: ["Sidetrack v1"] },
          ]},
          { name: "NK-225", wellbores: [{ name: "NK-225 OH", designs: ["Design R1"] }] },
        ]},
      ],
    },
    { name: "MBP2", sites: [{ name: "West Kuwait Pad A", wells: [{ name: "MB-118", wellbores: [{ name: "MB-118 OH", designs: ["Design v2"] }] }] }] },
  ],
};

function EdmImportModal({ onClose, onImport }: { onClose: () => void; onImport: (p: { trajectory: string; casing: string }) => void }) {
  const [selProj, setSelProj] = useState(edmTree.projects[0].name);
  const [selSite, setSelSite] = useState(edmTree.projects[0].sites[0].name);
  const [selWell, setSelWell] = useState(edmTree.projects[0].sites[0].wells[0].name);
  const [selWellbore, setSelWellbore] = useState(edmTree.projects[0].sites[0].wells[0].wellbores[0].name);
  const [selDesign, setSelDesign] = useState<string | null>(null);

  const project = edmTree.projects.find(p => p.name === selProj)!;
  const site = project.sites.find(s => s.name === selSite) ?? project.sites[0];
  const well = site.wells.find(w => w.name === selWell) ?? site.wells[0];
  const wellbore = well.wellbores.find(w => w.name === selWellbore) ?? well.wellbores[0];

  const [tab, setTab] = useState<"trajectory" | "casing">("trajectory");

  return (
    <Modal title="Import from EDM Database" onClose={onClose}>
      {/* Breadcrumb hierarchy */}
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-3 flex-wrap">
        <Folder className="h-3 w-3" />
        <span className="text-foreground/80">{edmTree.Company}</span>
        <ChevronsRight className="h-3 w-3" /> <span>{selProj}</span>
        <ChevronsRight className="h-3 w-3" /> <span>{selSite}</span>
        <ChevronsRight className="h-3 w-3" /> <span>{selWell}</span>
        <ChevronsRight className="h-3 w-3" /> <span>{selWellbore}</span>
        {selDesign && <><ChevronsRight className="h-3 w-3" /> <span className="text-primary">{selDesign}</span></>}
      </div>

      {/* Hierarchy selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <EdmSelect label="Project" value={selProj} options={edmTree.projects.map(p => p.name)} onChange={v => {
          const p = edmTree.projects.find(x => x.name === v)!;
          setSelProj(v); setSelSite(p.sites[0].name); setSelWell(p.sites[0].wells[0].name); setSelWellbore(p.sites[0].wells[0].wellbores[0].name); setSelDesign(null);
        }} />
        <EdmSelect label="Site" value={selSite} options={project.sites.map(s => s.name)} onChange={v => {
          const s = project.sites.find(x => x.name === v)!;
          setSelSite(v); setSelWell(s.wells[0].name); setSelWellbore(s.wells[0].wellbores[0].name); setSelDesign(null);
        }} />
        <EdmSelect label="Well" value={selWell} options={site.wells.map(w => w.name)} onChange={v => {
          const w = site.wells.find(x => x.name === v)!;
          setSelWell(v); setSelWellbore(w.wellbores[0].name); setSelDesign(null);
        }} />
        <EdmSelect label="Wellbore" value={selWellbore} options={well.wellbores.map(w => w.name)} onChange={v => { setSelWellbore(v); setSelDesign(null); }} />
      </div>

      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Designs</div>
        <div className="flex gap-1 flex-wrap">
          {wellbore.designs.map(d => (
            <button key={d} onClick={() => setSelDesign(d)} className={`text-[11px] px-2 py-1 rounded border ${selDesign === d ? "bg-primary/15 border-primary/40 text-primary" : "border-border hover:bg-secondary"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {selDesign ? (
        <>
          <div className="flex gap-1 mb-2 text-xs">
            <button onClick={() => setTab("trajectory")} className={`px-3 py-1.5 rounded border ${tab === "trajectory" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground"}`}>Trajectory</button>
            <button onClick={() => setTab("casing")} className={`px-3 py-1.5 rounded border ${tab === "casing" ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground"}`}>Casing Design</button>
          </div>

          {tab === "trajectory" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Top View</div>
                  <TrajectoryTopView />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">Section View</div>
                  <TrajectorySectionView />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Anticollision Results</div>
                <AnticollisionTable />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Casing Load Details</div>
                <CasingLoadTable />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Design Limit Plot</div>
                <CasingDesignLimitPlot />
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="h-8 px-3 rounded border border-border text-xs">Cancel</button>
            <button
              onClick={() => onImport({ trajectory: `${selWell} ${selDesign}`, casing: `${selWell} ${selDesign}` })}
              className="h-8 px-3 rounded bg-primary text-primary-foreground text-xs flex items-center gap-1.5"
            >
              <Database className="h-3.5 w-3.5" /> Import to DSP Content
            </button>
          </div>
        </>
      ) : (
        <div className="text-[11px] text-muted-foreground italic border border-dashed border-border rounded p-6 text-center">
          Select a design above to preview trajectory and casing data.
        </div>
      )}
    </Modal>
  );
}

function EdmSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="text-[10px] text-muted-foreground block">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-0.5 h-8 w-full text-[11px] px-2 rounded border border-border bg-input/60">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TrajectoryTopView() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-32 rounded border border-border bg-secondary/20">
      <g stroke="var(--border)" strokeWidth="0.3">
        {Array.from({length: 8}).map((_,i)=><line key={`h${i}`} x1="0" x2="200" y1={i*20} y2={i*20}/>)}
        {Array.from({length: 11}).map((_,i)=><line key={`v${i}`} y1="0" y2="140" x1={i*20} x2={i*20}/>)}
      </g>
      <circle cx="40" cy="70" r="3" fill="var(--primary)" />
      <path d="M40,70 C 80,70 120,60 170,40" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
      <circle cx="170" cy="40" r="2.5" fill="var(--status-orange)" />
      <text x="6" y="12" fontSize="7" fill="var(--muted-foreground)">Top view (N/E)</text>
    </svg>
  );
}
function TrajectorySectionView() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-32 rounded border border-border bg-secondary/20">
      <g stroke="var(--border)" strokeWidth="0.3">
        {Array.from({length: 8}).map((_,i)=><line key={`h${i}`} x1="0" x2="200" y1={i*20} y2={i*20}/>)}
      </g>
      <path d="M20,10 L20,60 C 20,90 60,110 180,120" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
      <text x="6" y="12" fontSize="7" fill="var(--muted-foreground)">Vertical section (TVD)</text>
    </svg>
  );
}
function AnticollisionTable() {
  const rows = [
    { offset: "NK-223", md: "1250 m", sf: 4.8, status: "pass" },
    { offset: "NK-225", md: "1820 m", sf: 2.1, status: "warn" },
    { offset: "NK-228 ST1", md: "2410 m", sf: 6.3, status: "pass" },
  ];
  return (
    <table className="w-full text-[11px] border border-border rounded">
      <thead className="bg-secondary/30 text-muted-foreground">
        <tr>{["Offset Well","Min MD","Separation Factor","Status"].map(h=><th key={h} className="text-left px-2 py-1">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r.offset} className="border-t border-border">
            <td className="px-2 py-1">{r.offset}</td>
            <td className="px-2 py-1">{r.md}</td>
            <td className="px-2 py-1 tabular-nums">{r.sf}</td>
            <td className="px-2 py-1"><StatusTag tone={r.status==="pass"?"green":"orange"}>{r.status.toUpperCase()}</StatusTag></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function CasingLoadTable() {
  const rows = [
    { section: "30\" Conductor",  od: "30\"",   grade: "X-52",  weight: "310 ppf", shoe: "80 m",   burst: 1450, collapse: 890 },
    { section: "20\" Surface",    od: "20\"",   grade: "K-55",  weight: "133 ppf", shoe: "650 m",  burst: 3060, collapse: 1500 },
    { section: "13-3/8\" Interm.", od: "13-3/8\"", grade: "N-80",  weight: "72 ppf",  shoe: "1850 m", burst: 5380, collapse: 2260 },
    { section: "9-5/8\" Prod.",   od: "9-5/8\"", grade: "P-110", weight: "53.5 ppf",shoe: "3120 m", burst: 10900,collapse: 7830 },
  ];
  return (
    <table className="w-full text-[11px] border border-border rounded">
      <thead className="bg-secondary/30 text-muted-foreground">
        <tr>{["Section","OD","Grade","Weight","Shoe","Burst (psi)","Collapse (psi)"].map(h=><th key={h} className="text-left px-2 py-1">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r.section} className="border-t border-border">
            <td className="px-2 py-1 font-medium">{r.section}</td>
            <td className="px-2 py-1">{r.od}</td>
            <td className="px-2 py-1">{r.grade}</td>
            <td className="px-2 py-1">{r.weight}</td>
            <td className="px-2 py-1">{r.shoe}</td>
            <td className="px-2 py-1 tabular-nums">{r.burst}</td>
            <td className="px-2 py-1 tabular-nums">{r.collapse}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function CasingDesignLimitPlot() {
  return (
    <svg viewBox="0 0 220 140" className="w-full h-40 rounded border border-border bg-secondary/20">
      <g stroke="var(--border)" strokeWidth="0.3">
        {Array.from({length: 8}).map((_,i)=><line key={`h${i}`} x1="20" x2="210" y1={20+i*15} y2={20+i*15}/>)}
        {Array.from({length: 8}).map((_,i)=><line key={`v${i}`} y1="20" y2="125" x1={20+i*27} x2={20+i*27}/>)}
      </g>
      <polygon points="20,20 210,20 210,125 20,125" fill="none" stroke="var(--status-green)" strokeDasharray="3 2" strokeWidth="1"/>
      <polygon points="40,40 190,40 190,110 40,110" fill="var(--primary)/10" stroke="var(--primary)" strokeWidth="1"/>
      <circle cx="80" cy="70" r="2.5" fill="var(--status-green)"/>
      <circle cx="120" cy="55" r="2.5" fill="var(--status-green)"/>
      <circle cx="160" cy="95" r="2.5" fill="var(--status-orange)"/>
      <text x="22" y="16" fontSize="7" fill="var(--muted-foreground)">Design envelope · burst vs collapse</text>
    </svg>
  );
}

/* ------------------------------ Engineering Rules --------------------------- */

function EngineeringRulesModal({ onClose }: { onClose: () => void }) {
  const rules = [
    { id:"ER-01", area:"Trajectory", rule:"DLS ≤ 4°/30m across production zones", state:"pass" },
    { id:"ER-02", area:"Trajectory", rule:"Anticollision SF ≥ 1.5 vs all offsets", state:"warn" },
    { id:"ER-03", area:"Casing",    rule:"Burst SF ≥ 1.1 (worst-case gas kick)", state:"pass" },
    { id:"ER-04", area:"Casing",    rule:"Collapse SF ≥ 1.0 (full evacuation)", state:"pass" },
    { id:"ER-05", area:"Casing",    rule:"Triaxial VME SF ≥ 1.25", state:"pass" },
    { id:"ER-06", area:"Cement",    rule:"TOC ≥ 500 ft above shoe of previous casing", state:"pass" },
    { id:"ER-07", area:"Wellhead",  rule:"Rated pressure ≥ formation shut-in pressure + margin", state:"pass" },
  ];
  return (
    <Modal title="Engineering Check Rules" onClose={onClose}>
      <p className="text-[11px] text-muted-foreground mb-3">
        Advisory engineering checks applied automatically to imported trajectory and casing designs. Failures are flagged for review — final acceptance rests with Engineering.
      </p>
      <table className="w-full text-xs">
        <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
          <tr>{["ID","Area","Rule","State"].map(h=><th key={h} className="text-left py-1.5 pr-2">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rules.map(r=>(
            <tr key={r.id}>
              <td className="py-2 pr-2 font-mono text-primary">{r.id}</td>
              <td className="py-2 pr-2">{r.area}</td>
              <td className="py-2 pr-2">{r.rule}</td>
              <td className="py-2 pr-2"><StatusTag tone={r.state==="pass"?"green":r.state==="warn"?"orange":"red"}>{r.state}</StatusTag></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
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
            <span className={`h-2 w-2 rounded-full shrink-0 ${n.status === "completed" ? "bg-[color:var(--status-green)]" : n.status === "in-progress" ? "bg-[color:var(--status-orange)]" : "bg-[color:var(--status-grey)]"}`} />
            <span className="truncate flex-1">{n.title}</span>
            {isOverdue(n) && <AlertTriangle className="h-3 w-3 text-[color:var(--status-red)] shrink-0" />}
            {!!n.comments && (
              <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] px-1 rounded-full border border-border text-muted-foreground">
                <MessageSquare className="h-2.5 w-2.5" />{n.comments}
              </span>
            )}
            {!!n.attachments?.length && <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />}
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
function findNodeByTitle(nodes: DspNode[], title: string): DspNode | undefined {
  for (const n of nodes) {
    if (n.title === title) return n;
    if (n.children) {
      const c = findNodeByTitle(n.children, title);
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

type CpaCommentStatus = "open" | "in-progress" | "completed";
type CpaComment = {
  id: string; c: string;
  assignedActivity: string; assignedSection: string; team: string;
  status: CpaCommentStatus; targetDate: string;
};

function CpaComments({ dspSectionTitles, onOpenSection }: { dspSectionTitles: string[]; onOpenSection: (title: string) => void }) {
  const [comments, setComments] = useState<CpaComment[]>([
    { id: "c1", c: "Provide justification for excluded option 3", assignedActivity: "", assignedSection: "", team: "FD Team", status: "open", targetDate: "" },
    { id: "c2", c: "Clarify data acquisition scope for offset well #4", assignedActivity: "", assignedSection: "", team: "IE Team", status: "in-progress", targetDate: "2026-07-28" },
    { id: "c3", c: "Update PAD allocations table with latest reservoir input", assignedActivity: "", assignedSection: "", team: "IE Team", status: "open", targetDate: "" },
    { id: "c4", c: "Confirm HSE compliance signatures for high-risk activities", assignedActivity: "", assignedSection: "", team: "HSE Team", status: "open", targetDate: "2026-07-30" },
    { id: "c5", c: "Attach directional company assessment", assignedActivity: "", assignedSection: "", team: "Drilling Team", status: "completed", targetDate: "2026-07-15" },
  ]);
  const [expanded, setExpanded] = useState(false);
  const update = (id: string, patch: Partial<CpaComment>) =>
    setComments(comments.map(c => (c.id === id ? { ...c, ...patch } : c)));

  const visible = expanded ? comments : comments.slice(0, 2);
  const openCount = comments.filter(c => c.status !== "completed").length;

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPA Comments</div>
        <div className="flex items-center gap-1.5">
          <StatusTag tone="blue">{comments.length} total</StatusTag>
          <StatusTag tone="yellow">{openCount} open</StatusTag>
        </div>
      </div>
      <div className="space-y-2">
        {visible.map(x => {
          const tone = x.status === "completed" ? "green" : x.status === "in-progress" ? "orange" : "yellow";
          return (
            <div key={x.id} className="border border-[color:var(--status-yellow)]/25 bg-[color:var(--status-yellow)]/5 rounded-md p-2.5 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs flex-1">{x.c}</div>
                <StatusTag tone={tone as any}>{x.status}</StatusTag>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <label className="text-[10px] text-muted-foreground">Status
                  <select value={x.status} onChange={e => update(x.id, { status: e.target.value as CpaCommentStatus })}
                    className="mt-0.5 h-6 w-full text-[11px] px-1 rounded border border-border bg-input/60">
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <label className="text-[10px] text-muted-foreground">Target Date
                  <input type="date" value={x.targetDate} onChange={e => update(x.id, { targetDate: e.target.value })}
                    className="mt-0.5 h-6 w-full text-[11px] px-1 rounded border border-border bg-input/60" />
                </label>
              </div>
              <label className="text-[10px] text-muted-foreground block">Assign to Activity
                <input value={x.assignedActivity} onChange={e => update(x.id, { assignedActivity: e.target.value })}
                  placeholder="e.g. 1.2 Preliminary SS X,Y" className="mt-0.5 h-6 w-full text-[11px] px-1.5 rounded border border-border bg-input/60" />
              </label>
              <div className="text-[10px] text-muted-foreground">
                <div>Assign to DSP Section</div>
                <div className="flex gap-1 mt-0.5">
                  <select value={x.assignedSection} onChange={e => update(x.id, { assignedSection: e.target.value })}
                    className="h-6 flex-1 text-[11px] px-1 rounded border border-border bg-input/60">
                    <option value="">— Select section —</option>
                    {dspSectionTitles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    disabled={!x.assignedSection}
                    onClick={() => onOpenSection(x.assignedSection)}
                    className="h-6 px-2 text-[10px] rounded border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Open in DSP"
                  >
                    Open
                  </button>
                </div>
              </div>
              <label className="text-[10px] text-muted-foreground block">Assign to Team
                <select value={x.team} onChange={e => update(x.id, { team: e.target.value })}
                  className="mt-0.5 h-6 w-full text-[11px] px-1 rounded border border-border bg-input/60">
                  <option value="">Unassigned</option>
                  {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
          );
        })}
      </div>
      {comments.length > 2 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-2 text-[11px] text-primary hover:underline">
          {expanded ? "Show less" : `View more (${comments.length - 2})`}
        </button>
      )}
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

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
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

/* ------------------------------ Attachments --------------------------------- */

function AttachmentsBlock({ node, onChange }: { node: DspNode; onChange: (patch: Partial<DspNode>) => void }) {
  const list = node.attachments ?? [];
  const add = () => onChange({ attachments: [...list, { id: `${node.id}-a${list.length + 1}`, name: `attachment-${list.length + 1}.pdf`, showInFinal: true }] });
  const update = (id: string, patch: Partial<Attachment>) => onChange({ attachments: list.map(a => a.id === id ? { ...a, ...patch } : a) });
  return (
    <div className="mt-4 rounded border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5" />Attachments</div>
        <button onClick={add} className="h-7 px-2 rounded border border-border text-[10px] flex items-center gap-1 hover:bg-secondary"><Plus className="h-3 w-3" />Add attachment</button>
      </div>
      {list.length === 0 ? (
        <div className="text-[11px] text-muted-foreground italic">No attachments. Uploaded files can be shown or hidden in the final DSP.</div>
      ) : (
        <div className="space-y-1.5">
          {list.map(a => (
            <div key={a.id} className="flex items-center gap-2 text-[11px] border border-border rounded px-2 py-1.5">
              <Paperclip className="h-3 w-3 text-muted-foreground" />
              <input value={a.name} onChange={e => update(a.id, { name: e.target.value })} className="flex-1 bg-transparent outline-none" />
              <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <input type="checkbox" checked={a.showInFinal} onChange={e => update(a.id, { showInFinal: e.target.checked })} className="accent-[color:var(--accent-blue)]" />
                Show in final DSP
              </label>
              <button onClick={() => onChange({ attachments: list.filter(x => x.id !== a.id) })} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Meetings ------------------------------------ */

type Meeting = { id: string; title: string; date: string; attendees: string; comments: string; summary: string };

const initialMeetings: Meeting[] = [
  { id: "m1", title: "Meeting 1 — Kickoff review", date: "2026-06-12", attendees: "IE, FD, Drilling, CPA", comments: "Profiles to be reconciled with AAP before next review.", summary: "Scope confirmed, 24 wells retained." },
  { id: "m2", title: "Meeting 2 — Assurance walkthrough", date: "2026-07-08", attendees: "CPA, Planning, Engineering A", comments: "", summary: "" },
  { id: "m3", title: "Meeting 3 — Pre-gate alignment", date: "2026-08-05", attendees: "Gate Keeper, Planning, IE", comments: "", summary: "" },
];

function MeetingsPanel({ meetings, setMeetings, stage }: { meetings: Meeting[]; setMeetings: (m: Meeting[]) => void; stage: Stage }) {
  const [openId, setOpenId] = useState(meetings[0]?.id ?? "");
  const update = (id: string, patch: Partial<Meeting>) => setMeetings(meetings.map(m => m.id === id ? { ...m, ...patch } : m));
  const add = () => {
    const id = `m${meetings.length + 1}-${Date.now()}`;
    setMeetings([...meetings, { id, title: `Meeting ${meetings.length + 1}`, date: "", attendees: "", comments: "", summary: "" }]);
    setOpenId(id);
  };
  const active = meetings.find(m => m.id === openId) ?? meetings[0];
  const incomplete = meetings.filter(m => !m.comments.trim() || !m.summary.trim()).length;

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <div className="text-sm font-semibold">Meeting Details · {stage}</div>
          <div className="text-[11px] text-muted-foreground">Meeting comments and summary are mandatory before the stage gate can be closed.</div>
        </div>
        <div className="flex items-center gap-2">
          {incomplete > 0
            ? <StatusTag tone="orange"><AlertTriangle className="h-3 w-3" />{incomplete} meeting{incomplete === 1 ? "" : "s"} incomplete</StatusTag>
            : <StatusTag tone="green"><Check className="h-3 w-3" />All meetings recorded</StatusTag>}
          <button onClick={add} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />Add Meeting</button>
        </div>
      </div>

      <div className="flex gap-1 mb-3 flex-wrap text-xs">
        {meetings.map(m => {
          const ok = m.comments.trim() && m.summary.trim();
          return (
            <button key={m.id} onClick={() => setOpenId(m.id)} className={`px-3 py-1.5 rounded-md border flex items-center gap-1.5 ${openId === m.id ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>
              <span className={`h-2 w-2 rounded-full ${ok ? "bg-[color:var(--status-green)]" : "bg-[color:var(--status-orange)]"}`} />
              {m.title}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <label className="text-[10px] text-muted-foreground">Title
              <input value={active.title} onChange={e => update(active.id, { title: e.target.value })} className="mt-1 h-8 w-full rounded border border-border bg-input/60 px-2 text-[11px]" />
            </label>
            <label className="text-[10px] text-muted-foreground">Date
              <input type="date" value={active.date} onChange={e => update(active.id, { date: e.target.value })} className="mt-1 h-8 w-full rounded border border-border bg-input/60 px-2 text-[11px]" />
            </label>
            <label className="text-[10px] text-muted-foreground">Attendees
              <input value={active.attendees} onChange={e => update(active.id, { attendees: e.target.value })} className="mt-1 h-8 w-full rounded border border-border bg-input/60 px-2 text-[11px]" />
            </label>
          </div>
          <label className="block text-[10px] text-muted-foreground">
            Meeting comments <span className="text-[color:var(--status-red)]">*</span>
            <textarea value={active.comments} onChange={e => update(active.id, { comments: e.target.value })}
              placeholder="Record comments raised during the meeting…"
              className={`mt-1 w-full min-h-[90px] p-2 rounded border bg-input/60 text-xs ${active.comments.trim() ? "border-border" : "border-[color:var(--status-orange)]/50"}`} />
          </label>
          <label className="block text-[10px] text-muted-foreground">
            Meeting summary <span className="text-[color:var(--status-red)]">*</span>
            <textarea value={active.summary} onChange={e => update(active.id, { summary: e.target.value })}
              placeholder="Summarise outcomes, decisions and actions…"
              className={`mt-1 w-full min-h-[90px] p-2 rounded border bg-input/60 text-xs ${active.summary.trim() ? "border-border" : "border-[color:var(--status-orange)]/50"}`} />
          </label>
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------ Tag values ---------------------------------- */

function TagValuesModal({ values, setValues, project, onClose }: { values: Record<string, string>; setValues: (v: Record<string, string>) => void; project: string; onClose: () => void }) {
  return (
    <Modal title={`Tag Values — ${project}`} onClose={onClose}>
      <p className="text-[11px] text-muted-foreground mb-3">
        Assign this project's values to the auto text tags. Tags resolve automatically in DSP content, components and reports.
      </p>
      <table className="w-full text-xs">
        <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>{["Tag", "Label", "Value for this project"].map(h => <th key={h} className="text-left py-1.5 pr-2">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {autoTextTags.map(t => (
            <tr key={t.tag}>
              <td className="py-2 pr-2 font-mono text-primary whitespace-nowrap">{t.tag}</td>
              <td className="py-2 pr-2 text-muted-foreground">{t.label}</td>
              <td className="py-2 pr-2">
                <input value={values[t.tag] ?? ""} onChange={e => setValues({ ...values, [t.tag]: e.target.value })}
                  className="h-7 w-full rounded border border-border bg-input/60 px-2 text-[11px]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="h-9 px-3 rounded bg-primary text-primary-foreground text-xs">Save values</button>
      </div>
    </Modal>
  );
}

/* ------------------------------ Final DSP & presentation -------------------- */

function FinalDspModal({ stage, version, project, sections, tagValues, onClose }: {
  stage: Stage; version: string; project: string; sections: DspNode[]; tagValues: Record<string, string>; onClose: () => void;
}) {
  const flat = flatten(sections);
  const done = flat.filter(s => s.status === "completed").length;
  return (
    <Modal title={`Final DSP — ${stage} ${version}`} onClose={onClose}>
      <div className="rounded-lg border border-border p-5 bg-secondary/10">
        <div className="text-center border-b border-border pb-3 mb-4">
          <div className="text-lg font-semibold">{tagValues["{{Project_Name}}"] || project}</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Delivery Support Package · {stage} · {version} · {tagValues["{{Number_Of_Wells}}"] || "—"} wells · Total {tagValues["{{Total_Cost}}"] || "—"} (000 KD)
          </div>
          <div className="mt-2"><StatusTag tone="blue">{done} of {flat.length} sections completed</StatusTag></div>
        </div>
        <div className="space-y-3">
          {flat.map((s, i) => (
            <div key={s.id} className="border-b border-border/60 pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{i + 1}. {s.title}</div>
                <div className="flex items-center gap-1.5">
                  {isOverdue(s) && <StatusTag tone="red">Overdue</StatusTag>}
                  <StatusTag tone={s.status === "completed" ? "green" : s.status === "in-progress" ? "orange" : "grey"}>{(s.status ?? "not-started").replace("-", " ")}</StatusTag>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Owner {s.assignedUser ?? "—"} · Target {s.target || "—"}
              </div>
              {(s.attachments ?? []).filter(a => a.showInFinal).length > 0 && (
                <div className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1 flex-wrap">
                  <Paperclip className="h-3 w-3" />
                  {(s.attachments ?? []).filter(a => a.showInFinal).map(a => a.name).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground italic">Read-only rendering of the compiled DSP. Hidden attachments are excluded.</p>
    </Modal>
  );
}

function PresentationModal({ stage, sections, onClose }: { stage: Stage; sections: DspNode[]; onClose: () => void }) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [slides, setSlides] = useState(() => [
    { id: "sl1", title: `${stage} Stage Gate Review`, body: "Project overview, scope and objectives." },
    { id: "sl2", title: "Scope & Well Profiles", body: flatten(sections).slice(0, 4).map(s => `• ${s.title}`).join("\n") },
    { id: "sl3", title: "Cost & Schedule", body: "• Total cost\n• Stage completion dates" },
    { id: "sl4", title: "Risks & Assurance", body: "• Open CPA comments\n• Validation summary" },
  ]);
  const update = (id: string, patch: Partial<{ title: string; body: string }>) => setSlides(slides.map(s => s.id === id ? { ...s, ...patch } : s));

  return (
    <Modal title={`Presentation — ${stage}`} onClose={onClose}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1 text-xs">
          {(["view", "edit"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded border capitalize ${mode === m ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground"}`}>{m}</button>
          ))}
        </div>
        {mode === "edit" && (
          <button onClick={() => setSlides([...slides, { id: `sl${slides.length + 1}`, title: "New slide", body: "" }])} className="h-8 px-3 rounded border border-border text-xs flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />Add slide</button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slides.map((s, i) => (
          <div key={s.id} className="rounded border border-border overflow-hidden">
            <div className="px-2 py-1 text-[10px] bg-secondary/40 text-muted-foreground border-b border-border">Slide {i + 1}</div>
            <div className="p-3 min-h-[130px] bg-secondary/10">
              {mode === "view" ? (
                <>
                  <div className="text-sm font-semibold mb-1.5">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground whitespace-pre-line">{s.body}</div>
                </>
              ) : (
                <>
                  <input value={s.title} onChange={e => update(s.id, { title: e.target.value })} className="h-7 w-full rounded border border-border bg-input/60 px-2 text-xs mb-1.5" />
                  <textarea value={s.body} onChange={e => update(s.id, { body: e.target.value })} className="w-full min-h-[80px] rounded border border-border bg-input/60 p-2 text-[11px]" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function flatten(nodes: DspNode[]): DspNode[] {
  return nodes.flatMap(n => [n, ...(n.children ? flatten(n.children) : [])]);
}
