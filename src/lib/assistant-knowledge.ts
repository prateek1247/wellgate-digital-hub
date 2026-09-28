// Knowledge used by the WDPGS Assistant. Kept in a browser-safe module.
export const WDPGS_MANUAL = `
# WDPGS User Manual (v1.0 prototype)

## 1. Purpose
The Well Delivery Project Gate System (WDPGS) is an advisory & enablement platform for KOC well delivery projects. It supports preparation of Decision Support Packages (DSP), activity tracking, CPA assurance and stage gate reviews. Gate Keeper authority is NOT automated — all gate decisions are made by the Gate Keeper off-platform.

## 2. Stage gates
- SG1 (1.0 Identification): opportunity framing, preliminary well concept, cost class 5 estimate.
- SG2 (2.0 Concept Selection): alternative concepts, selection rationale, risk register, class 4 estimate.
- SG3.1 (Design): detailed well design, trajectory, casing design, long lead items, class 3 estimate.
- SG3.2 (Validation): design validation, execution readiness, final DSP for Gate Keeper.

## 3. Gate workflow
Each stage runs through: Prepare DSP → Submit DSP → Conduct Assurance Review → Request Stage Gate Review → Stage Gate Meeting Review. Pills are green (done), amber (in progress) or grey (not started).
Workload status values: Not Started, In Progress, Submitted to Planning, CPA Review, Clarifications, Pending Gate Keeper Review, Completed. A stage can only be set to Completed when every meeting has both Comments and Summary filled in.

## 4. Pages
- Dashboard: KPIs and active project tiles. Clicking a tile opens that project's Workload. Progress bars show start, today and end dates.
- Projects: Gantt timeline of all projects with stage gate column and a red "today" line. Use "New Project" to launch the creation wizard.
- Workload: the main working area per project. Tabs: Activity Tracker, DSP, Meetings, Closure Tasks. Choose stage gate (SG1–SG3.2) and version at the top.
- Automated Well Designs, Create Well Schematics, Well Montage: engineering tools for design checks, schematic drawing and composite sheets.
- Templates and Rules: project templates (per-stage DSP, activity, validation, RACI, reports, assurance report, review pack), DSP builder, report builder, components (tables, Project Charter, Long Lead Items), auto text tags, validation rules.
- Activity Library, Stage Gate Tracker (DSP progress, activity Gantt with delayed filter), User Access, Approvals, CPA Governance (work queue, clarification tracker, project tracker with closure remarks), Reports and KPIs.

## 5. Working in the DSP
- Add sections/subsections from the left tree. Each section can be assigned to a user, given a target date, a reminder and a status (Not started / In progress / Completed). Overdue sections show a red marker. The badge shows the number of comments.
- "Copy from previous stage gate" copies content of the same section from the earlier gate.
- Content supports free text, tables, images, and EDM imports (Company > Project > Site > Well > Wellbore > Design) for trajectory and casing design. Use "Re-run validation" after changing imported data.
- Attachments can be added per section with a Show/Hide in Final DSP toggle.
- Tag Values: set project values for auto text tags like {{Project_Name}} or {{Total_Cost}} so they fill into reports.
- "View Final DSP" shows the compiled package; "View & Edit Presentation" builds the gate presentation.

## 6. Comments
- Working Comments: informal team discussion. Use "View all" for the full list.
- CPA Comments: raised by CPA during assurance. Each can be assigned to an activity, DSP section or team, given a target date and set to Open / In-progress / Completed. Clicking the DSP section opens it directly.

## 7. Meetings
Add Meeting 1, 2, 3… per stage. Comments and Summary are mandatory to close the stage gate.

## 8. Closure tasks
In the Workload "Closure Tasks" tab, record closure comments as tasks with owner, target stage and due date. Open tasks carry forward and appear in the next stage gate so they can be tracked until closed.

## 9. Validation rules
Validation rules are advisory checks (pass / warn / fail). Use "Run Validation" to refresh. Admins can create and delete manual rules in Templates and Rules.

## 10. Roles
IE (Integrated Engineering), Drilling, FD, HSE, Engineering A/B, CPA, PE1–PE3, Asset Planning. Role shown at the top right.
`;

export const DSP_HISTORY = [
  {
    project: "KOC-NK-24-017 (North Kuwait Jurassic Gas)",
    stages: [
      { stage: "SG1", versions: ["v0.1", "v0.2", "v1.0"], cpaQuestions: [
        "Basis for P50 reserves estimate not referenced.",
        "Class 5 cost range missing contingency split.",
      ], closure: "SG1 approved by Gate Keeper on 12-Feb-2025. Carry forward: refine reserve basis at SG2." },
      { stage: "SG2", versions: ["v0.1", "v0.3", "v1.0", "v1.1"], cpaQuestions: [
        "Concept B rejection rationale is qualitative only.",
        "HSE risk register lacks H2S mitigation owners.",
        "Long lead items list incomplete (wellhead, 7\" liner hanger).",
      ], closure: "SG2 approved with conditions on 20-Aug-2025: complete H2S mitigation plan and LLI procurement strategy before SG3.1." },
      { stage: "SG3.1", versions: ["v0.1", "v0.2"], cpaQuestions: [
        "Casing burst SF below 1.1 in 9-5/8\" section at 11,200 ft.",
        "Anticollision separation factor < 1.5 with offset well NK-112.",
      ], closure: "In progress — not yet closed." },
    ],
  },
  {
    project: "KOC-WK-25-004 (West Kuwait Heavy Oil)",
    stages: [
      { stage: "SG1", versions: ["v0.1", "v1.0"], cpaQuestions: ["Market assumptions outdated."], closure: "SG1 approved 03-Apr-2025. No carry-forward items." },
      { stage: "SG2", versions: ["v0.1", "v0.2"], cpaQuestions: ["Thermal completion concept needs vendor input.", "Water sourcing not addressed."], closure: "In progress — clarifications open." },
    ],
  },
];
