export type StageStatus = "completed" | "in-progress" | "overdue" | "not-started";

export type Project = {
  code: string;
  name: string;
  asset: string;
  directorate: string;
  currentStage: string;
  currentDsp: string;
  responsible: string;
  planning: string;
  cpaOwner: string;
  gateKeeper: string;
  targetDate: string;
  status: "On Track" | "At Risk" | "Delayed" | "Draft";
  progress: number;
  nextMilestone: string;
  daysRemaining: number;
  sg1: StageStatus;
  sg2: StageStatus;
  sg31: StageStatus;
  sg32: StageStatus;
  type: string;
  wells: number;
  stageGate: "SG1" | "SG2" | "SG3.1" | "SG3.2";
  startDate: string;
  endDate: string;
};

export const projects: Project[] = [
  {
    code: "NKDP",
    name: "North Kuwait Drilling Package",
    asset: "North Kuwait / Raudhatain",
    directorate: "Drilling & Technology",
    currentStage: "SG3.1 Define",
    currentDsp: "DSP 3.1",
    responsible: "Drilling Team",
    planning: "Planning Directorate",
    cpaOwner: "A. Al-Sabah",
    gateKeeper: "M. Al-Otaibi",
    targetDate: "2026-09-14",
    status: "On Track",
    progress: 62,
    nextMilestone: "Design Audit Review",
    daysRemaining: 18,
    sg1: "completed",
    sg2: "completed",
    sg31: "in-progress",
    sg32: "not-started",
    type: "Development Wells",
    wells: 24,
    stageGate: "SG3.1",
    startDate: "2025-11-01",
    endDate: "2027-04-30",
  },
  {
    code: "MBP2",
    name: "Mabrouk Development Phase 2",
    asset: "West Kuwait / Mabrouk",
    directorate: "Field Development",
    currentStage: "SG2.0 Concept Selection",
    currentDsp: "DSP 2.0",
    responsible: "FD Team",
    planning: "Planning Directorate",
    cpaOwner: "H. Al-Rashed",
    gateKeeper: "S. Al-Fahad",
    targetDate: "2026-08-02",
    status: "At Risk",
    progress: 41,
    nextMilestone: "Concept Options Ranking",
    daysRemaining: 9,
    sg1: "completed",
    sg2: "in-progress",
    sg31: "not-started",
    sg32: "not-started",
    type: "Multi-well Pad",
    wells: 12,
    stageGate: "SG2",
    startDate: "2026-01-15",
    endDate: "2027-07-01",
  },
  {
    code: "WWI-X10",
    name: "West Kuwait Water Injector",
    asset: "West Kuwait / Umm Gudair",
    directorate: "Reservoir Management",
    currentStage: "SG3.2 Validation",
    currentDsp: "DSP 3.2",
    responsible: "RST",
    planning: "Planning Directorate",
    cpaOwner: "K. Al-Mutairi",
    gateKeeper: "F. Al-Enezi",
    targetDate: "2026-07-20",
    status: "Delayed",
    progress: 78,
    nextMilestone: "Procurement Readiness",
    daysRemaining: -3,
    sg1: "completed",
    sg2: "completed",
    sg31: "completed",
    sg32: "overdue",
    type: "High Priority Well Release",
    wells: 3,
    stageGate: "SG3.1",
    startDate: "2025-08-01",
    endDate: "2026-12-15",
  },
  {
    code: "SKG UOR",
    name: "South Kuwait Gas Lift Optimization",
    asset: "South Kuwait / Burgan",
    directorate: "Production Operations",
    currentStage: "SG1.0 Identification",
    currentDsp: "DSP 1.0",
    responsible: "IE Team",
    planning: "Planning Directorate",
    cpaOwner: "N. Al-Ajmi",
    gateKeeper: "T. Al-Shammari",
    targetDate: "2027-01-30",
    status: "On Track",
    progress: 22,
    nextMilestone: "Anti-Collision Assessment",
    daysRemaining: 42,
    sg1: "in-progress",
    sg2: "not-started",
    sg31: "not-started",
    sg32: "not-started",
    type: "Development Wells",
    wells: 8,
    stageGate: "SG1",
    startDate: "2026-03-01",
    endDate: "2027-08-01",
  },
  {
    code: "EXPL-2027",
    name: "Exploration Wells 2027/28",
    asset: "Multi-Asset / Exploration",
    directorate: "Exploration",
    currentStage: "SG2.0 Concept Selection",
    currentDsp: "DSP 2.0 (Exploration)",
    responsible: "Exploration Team",
    planning: "Planning Directorate",
    cpaOwner: "R. Al-Kandari",
    gateKeeper: "Y. Al-Duwaisan",
    targetDate: "2026-11-05",
    status: "On Track",
    progress: 35,
    nextMilestone: "Prospect Technical Review",
    daysRemaining: 27,
    sg1: "completed",
    sg2: "in-progress",
    sg31: "not-started",
    sg32: "not-started",
    type: "Exploration Wells",
    wells: 6,
    stageGate: "SG2",
    startDate: "2026-02-01",
    endDate: "2027-11-30",
  },
];

export const kpis = [
  { label: "Assigned Projects", value: 12, tone: "blue" },
  { label: "Active WDPGS Projects", value: 8, tone: "blue" },
  { label: "DSPs Pending My Action", value: 5, tone: "orange" },
  { label: "CPA Comments Open", value: 17, tone: "yellow" },
  { label: "Overdue Activities", value: 4, tone: "red" },
];

export type Activity = {
  id: string;
  name: string;
  project: string;
  stage: string;
  responsible: string;
  accountable: string;
  due: string;
  comments: number;
  type: "Activity" | "DSP Input" | "CPA Comment" | "Closure Remark";
  column: "Not Started" | "In Progress" | "Pending Response" | "Completed";
};

export const activities: Activity[] = [
  { id: "A-1041", name: "Anti-Collision Assessment", project: "SKG UOR", stage: "SG1.0 / DSP 1.0", responsible: "Drilling Team", accountable: "IE Team", due: "2026-07-28", comments: 3, type: "Activity", column: "In Progress" },
  { id: "A-1042", name: "Preliminary SS X,Y coordinates", project: "SKG UOR", stage: "SG1.0 / DSP 1.0", responsible: "Surface Team", accountable: "IE Team", due: "2026-07-22", comments: 1, type: "Activity", column: "Not Started" },
  { id: "C-2201", name: "Clarify pore pressure interval", project: "NKDP", stage: "SG3.1 / DSP 3.1", responsible: "RST", accountable: "FD Team", due: "2026-07-30", comments: 5, type: "CPA Comment", column: "Pending Response" },
  { id: "D-3301", name: "Upload HSE compliance sign-off", project: "MBP2", stage: "SG2.0 / DSP 2.0", responsible: "HSE Team", accountable: "FD Team", due: "2026-07-25", comments: 2, type: "DSP Input", column: "In Progress" },
  { id: "A-1043", name: "Design Audit Report finalization", project: "NKDP", stage: "SG3.1 / DSP 3.1", responsible: "Drilling Team", accountable: "Planning", due: "2026-08-04", comments: 0, type: "Activity", column: "In Progress" },
  { id: "R-4401", name: "Closure remark - SG1 memo carryover", project: "EXPL-2027", stage: "SG2.0", responsible: "Planning", accountable: "CPA", due: "2026-07-31", comments: 4, type: "Closure Remark", column: "Pending Response" },
  { id: "A-1044", name: "PAD Allocations approval note", project: "SKG UOR", stage: "SG1.0", responsible: "Surface Team", accountable: "IE Team", due: "2026-07-19", comments: 1, type: "Activity", column: "Completed" },
  { id: "D-3302", name: "Long lead items procurement list", project: "WWI-X10", stage: "SG3.2", responsible: "Contracts", accountable: "Procurement", due: "2026-07-15", comments: 6, type: "DSP Input", column: "Pending Response" },
  { id: "C-2202", name: "Risk register - carry over from SG2", project: "NKDP", stage: "SG3.1", responsible: "Planning", accountable: "CPA", due: "2026-08-10", comments: 2, type: "CPA Comment", column: "In Progress" },
  { id: "A-1045", name: "Site visit report", project: "MBP2", stage: "SG2.0", responsible: "FD Team", accountable: "IE Team", due: "2026-07-12", comments: 0, type: "Activity", column: "Completed" },
];

export const teams = [
  "CPA Team",
  "Drilling Team",
  "IE Team",
  "FD Team",
  "HSE Team",
  "Engineering Team A",
  "Engineering Team B",
];

export const exploratoryTeams = ["PE 1", "PE 2", "PE 3", "Asset Planning", "CPA"];

export const allTeams = [...teams, ...exploratoryTeams];

// Workload activity tracker: activities grouped by stage gate, sourced from KOC screenshot.
export type WorkActivity = {
  id: string;
  title: string;
  description?: string;
  team?: string;
  target?: string;
  status: "completed" | "in-progress" | "not-started" | "overdue";
  reminder?: boolean;
  subs?: string[];
};

export const workActivitiesByStage: Record<"SG1" | "SG2" | "SG3.1" | "SG3.2", WorkActivity[]> = {
  SG1: [
    { id: "1.1", title: "Well Profile Identification", description: "Generated by IE based on FY drilling plan and reviewed/updated by RST & FD aligning with approved AAP.", team: "IE Team", target: "2026-06-20", status: "completed" },
    { id: "1.2", title: "Preliminary SS X,Y", description: "Proposed by RST aligned with FD to IE by June.", team: "IE Team", target: "2026-06-30", status: "in-progress" },
    { id: "1.3", title: "Surface X,Y", description: "Proposed by RST based on PAD allocation / single well surface coordinates.", team: "Drilling Team", target: "2026-07-05", status: "in-progress" },
    { id: "1.4", title: "PAD Allocations", description: "As per available MWP projects.", team: "FD Team", target: "2026-07-10", status: "not-started" },
    { id: "1.5", title: "Site Visits", description: "By IE for single wells and new PADs.", team: "IE Team", target: "2026-07-15", status: "not-started" },
    { id: "1.6", title: "Surface Initial Confirmation", description: "IE to confirm surface location and highlight main constraints as input to SG2.0.", team: "IE Team", target: "2026-07-20", status: "not-started" },
    { id: "1.7", title: "Side-tracks RS", description: "RS to propose preliminary candidates aligning with FD future business plan. ST feasibility/integrity issues by IE and FD.", team: "IE Team", target: "2026-07-25", status: "not-started" },
    { id: "1.8", title: "Anti-Collision Assessment", description: "Directional company to assess anti-collision for all well trajectories located on PADs.", team: "Drilling Team", target: "2026-07-30", status: "overdue" },
  ],
  SG2: [
    { id: "2.1", title: "Confirmation of Well Profiles and subsurface X,Y", description: "By RST, aligned with FD by Sept, aligned with AAP.", team: "IE Team", target: "2026-09-15", status: "not-started" },
    { id: "2.2", title: "Options Ranking (DEG)", description: "Align material availability with confirmed profiles, ranking and budget.", team: "Engineering Team A", target: "2026-09-30", status: "not-started" },
    { id: "2.3", title: "Surface X,Y", description: "Updates due to finalization of SS targets or surface constraints removal timeline.", team: "Drilling Team", target: "2026-10-05", status: "not-started" },
    { id: "2.4", title: "Surface Initial Reservation", description: "By IMP Team in coordination with IE.", team: "IE Team", target: "2026-10-15", status: "not-started" },
    { id: "2.5", title: "Side-tracks — donor wells", description: "Finalize donor wells via MEMO from RS/FD to IE.", team: "FD Team", target: "2026-10-25", status: "not-started", subs: ["RS to confirm target", "FD-PE confirmation on Well Integrity/Production", "FL conduction check by OTS"] },
    { id: "2.6", title: "Tie-in points, FL routing", description: "By OTS/IMP. IE ensures schedule alignment for MWP, GC/water injection and utilities.", team: "Engineering Team B", target: "2026-11-01", status: "not-started" },
    { id: "2.7", title: "PM to provide FL length and cost", team: "Engineering Team B", target: "2026-11-10", status: "not-started" },
    { id: "2.8", title: "Well Surveillance to provide AL inputs", team: "IE Team", target: "2026-11-15", status: "not-started" },
    { id: "2.9", title: "Preliminary Rig assignment for IAP & WIDE", description: "IE / D&WO Engineering.", team: "Drilling Team", target: "2026-11-20", status: "not-started" },
  ],
  "SG3.1": [
    { id: "3.1", title: "Define / Detailed Design", team: "Engineering Team A", target: "2026-12-15", status: "not-started" },
    { id: "3.2", title: "Finalize well profiles", description: "Align with budget and material.", team: "IE Team", target: "2026-12-20", status: "not-started" },
    { id: "3.3", title: "Infrastructure Management Plan (IMP)", description: "GC/Manifold capacity and power allocations.", team: "Engineering Team B", target: "2026-12-30", status: "not-started" },
    { id: "3.4", title: "Long lead items confirmed", team: "FD Team", target: "2027-01-10", status: "not-started" },
    { id: "3.5", title: "Identify Contracts and Procurements", team: "FD Team", target: "2027-01-20", status: "not-started" },
    { id: "3.6", title: "Optimize CAPEX / OPEX", team: "FD Team", target: "2027-01-25", status: "not-started" },
    { id: "3.7", title: "Submittal of BP", team: "FD Team", target: "2027-01-30", status: "not-started" },
    { id: "3.8", title: "Directional company allocation", description: "For all newly proposed wells including anti-collision checks.", team: "Drilling Team", target: "2027-02-05", status: "not-started" },
    { id: "3.9", title: "Drive IAP stability — RST well release", description: "For high urgency/priority wells for following fiscal year IAP by May.", team: "IE Team", target: "2027-02-15", status: "not-started" },
    { id: "3.10", title: "Risk Register", description: "IE to provide all issues (constraints, material & allowable) related to the project scope, costs and schedule.", team: "IE Team", target: "2027-02-20", status: "not-started" },
  ],
  "SG3.2": [
    { id: "3.2.1", title: "Validation of Design Deliverables", team: "Engineering Team A", target: "2027-03-10", status: "not-started" },
    { id: "3.2.2", title: "Procurement Progress Summary", team: "FD Team", target: "2027-03-20", status: "not-started" },
    { id: "3.2.3", title: "Long Lead Items Status", team: "FD Team", target: "2027-03-25", status: "not-started" },
    { id: "3.2.4", title: "HSE Readiness Validation", team: "HSE Team", target: "2027-04-01", status: "not-started" },
    { id: "3.2.5", title: "Assurance Findings Closure", team: "CPA Team", target: "2027-04-10", status: "not-started" },
  ],
};

export const stageVersions: Record<string, string[]> = {
  SG1: ["v1.0", "v0.3", "v0.2", "v0.1"],
  SG2: ["v0.4", "v0.3", "v0.2", "v0.1"],
  "SG3.1": ["v0.2", "v0.1"],
  "SG3.2": ["v0.1"],
};

export const gateWorkflowSteps = [
  "Prepare DSP",
  "Submit DSP",
  "Conduct Assurance Review",
  "Request Stage Gate Review",
  "Stage Gate Meeting Review",
] as const;

export type GateStepStatus = "green" | "amber" | "grey";
export const gateStepStatuses: Record<"SG1"|"SG2"|"SG3.1"|"SG3.2", GateStepStatus[]> = {
  SG1: ["green","green","green","green","green"],
  SG2: ["green","amber","amber","grey","grey"],
  "SG3.1": ["green","amber","grey","grey","grey"],
  "SG3.2": ["grey","grey","grey","grey","grey"],
};

export const validationRules = [
  { id: "V-01", title: "All required DSP sections completed", severity: "error", state: "fail" as "pass"|"warn"|"fail" },
  { id: "V-02", title: "HSE sign-off attached", severity: "error", state: "warn" as "pass"|"warn"|"fail" },
  { id: "V-03", title: "Risk Register updated within 30 days", severity: "warn", state: "pass" as "pass"|"warn"|"fail" },
  { id: "V-04", title: "Previous stage comments closed", severity: "warn", state: "warn" as "pass"|"warn"|"fail" },
  { id: "V-05", title: "CPA comments responded", severity: "warn", state: "pass" as "pass"|"warn"|"fail" },
  { id: "V-06", title: "Budget aligned with deliverables", severity: "error", state: "fail" as "pass"|"warn"|"fail" },
];

export const dspSections: Record<string, { title: string; sections: string[] }> = {
  "1.0": {
    title: "DSP 1.0 — Identification",
    sections: [
      "Executive Summary",
      "Summary of Project Scope and Cost Estimate",
      "Established Project Charter",
      "Business Opportunity Statement",
      "WD Project Description",
      "Capital Program Selection per ECAP Requirements",
      "AAP Alignment",
      "Objectives and Project Target",
      "Scope: wells, trajectory, type, field, targets",
      "Inter-dependent Projects / Program",
      "Rationale: Drivers, Needs, Benefits, Strategic Fit",
      "Field Development Plan Addendum",
      "Summary of Development Requirements",
      "Field Description",
      "Seismic Dataset Processing & Interpretation",
      "Field Geology from Basin Modelling",
      "Petrophysical Analysis and Reservoir Characterization",
      "Validity of Static and Dynamic Models",
      "Field Development Scheme",
      "Production and Injection Profiles",
      "Dependent Production Facilities",
      "Asset Infrastructure Management Plan",
      "Alternative Concept Options",
      "High-Level View of Options",
      "Additional Requirements (Manpower, Resources)",
      "Financial Analysis and Schedule",
      "Total Capital Cost Estimate",
      "Operating Cost Estimate",
      "PEEP Run / Economic Evaluation",
      "Project Milestone Schedule",
      "Stakeholder Management",
      "Risk Management Plan",
      "Lessons Learned Register",
      "HSSE Compliance",
      "Minutes of Reviews",
      "Plan and Requirements for Stage 2.0",
    ],
  },
  "2.0": {
    title: "DSP 2.0 — Concept Selection (Development)",
    sections: [
      "Executive Summary",
      "Brief DSP 2.0 Description",
      "Status of Action Items from Previous Stage Gate",
      "Finalize Project Charter",
      "Project Summary",
      "Field Development Plan Addendum",
      "Feasibility Study",
      "Options List",
      "Selection / Ranking Criteria and Exclusion Rationale",
      "Study Report — Recommended Single Option",
      "Statement of Requirements for Selected Option",
      "Subsurface Characteristics",
      "Site Characteristics",
      "Unique FD Well Identifier",
      "Preliminary Subsurface and Surface Coordinates",
      "High-Level Well and Completion Requirements",
      "Data Acquisition Requirements",
      "Special Contract Requirements",
      "Long Lead Items",
      "Flowline Requirements and Location",
      "Artificial Lift Accessories Requirements",
      "Utilities Requirements",
      "Operations and Maintenance Philosophy",
      "Abandonment Plan",
      "Value Improvement Opportunities",
      "Financial Analysis and Schedule",
      "Preliminary Contracts and Procurement Strategy",
      "Stakeholder Management",
      "Risk Register",
      "Lessons Learned",
      "HSSE Compliance",
      "Minutes of Meetings / Workshops",
      "Plan and Requirements for Stage 3.1",
    ],
  },
  "3.1": {
    title: "DSP 3.1 — Define / Design",
    sections: [
      "Executive Summary",
      "Project Summary",
      "Design Package",
      "WD Project Execution Plan",
      "Financial Analysis and Schedule",
      "Final Contract & Procurement Plan",
      "Stakeholder Management",
      "WD Project Risk Management Plan",
      "WD Project Lessons Learned Register",
      "Minutes of Reviews Held During the Stage",
      "Plan & Requirements for Process Stage 3.2",
    ],
  },
  "3.2": {
    title: "DSP 3.2 — Validation / Procurement",
    sections: [
      "Validation of Design Deliverables",
      "Procurement Progress Summary",
      "Long Lead Items Status",
      "Contract Awards Status",
      "HSE Readiness Validation",
      "Facility Readiness Validation",
      "Risk Register Update",
      "Schedule Confirmation",
      "Cost Confirmation vs. Approved Budget",
      "Assurance Findings Closure",
      "Plan & Requirements for Stage 4.0 Execution",
    ],
  },
};

export const dsp31Design = [
  "Assumptions, Basis and Rationale for Final Design",
  "Number of Wells Derived from Well Concept",
  "Subsurface Characteristics",
  "Offset Wells",
  "Pressure and Temperature Data",
  "Pore Pressure / Fracture Gradient / Rock Strength / In-situ Stress",
  "Production Fluid Properties",
  "Subsurface Hazards",
  "Site Characteristics",
  "Shallow Hazards",
  "Surface Conditions",
  "Unique FD Well Identifier",
  "Subsurface and Surface Coordinates",
  "Drilling Requirements",
  "Detailed Well Diagrams",
  "Data Acquisition Requirements",
  "Special Contract Requirements",
  "Long Lead Items",
  "Flowline Requirements",
  "Artificial Lift Accessories",
  "Utilities",
  "Operations and Maintenance Philosophy",
  "Abandonment Plan",
  "Value Improvement Opportunities",
  "Design Audit Report",
];

export const activityLibrary = [
  { name: "Well Profile Identification", stage: "SG1.0", responsible: "IE Team", accountable: "Drilling Team", timeline: "10 d" },
  { name: "Preliminary SS X,Y", stage: "SG1.0", responsible: "Surface Team", accountable: "IE Team", timeline: "5 d" },
  { name: "Surface X,Y", stage: "SG1.0", responsible: "Surface Team", accountable: "IE Team", timeline: "5 d" },
  { name: "PAD Allocations", stage: "SG1.0", responsible: "Surface Team", accountable: "FD Team", timeline: "7 d" },
  { name: "Site Visits", stage: "SG1.0", responsible: "FD Team", accountable: "IE Team", timeline: "3 d" },
  { name: "Surface Initial Confirmation", stage: "SG1.0", responsible: "Surface Team", accountable: "FD Team", timeline: "4 d" },
  { name: "Side-tracks", stage: "SG1.0", responsible: "Drilling Team", accountable: "RST", timeline: "6 d" },
  { name: "Anti-Collision Assessment", stage: "SG1.0", responsible: "Drilling Team", accountable: "IE Team", timeline: "8 d" },
  { name: "Feasibility Study", stage: "SG2.0", responsible: "FD Team", accountable: "Planning", timeline: "20 d" },
  { name: "Concept Options Ranking", stage: "SG2.0", responsible: "FD Team", accountable: "CPA", timeline: "15 d" },
  { name: "Design Audit Report", stage: "SG3.1", responsible: "Drilling Team", accountable: "CPA", timeline: "12 d" },
  { name: "Procurement Readiness", stage: "SG3.2", responsible: "Contracts", accountable: "Procurement", timeline: "10 d" },
];

export const changeLog = [
  { when: "2026-07-15 09:22", who: "A. Al-Sabah (CPA)", what: "Risk register updated", from: "8 open risks", to: "6 open risks", section: "DSP 3.1 / Risk Management", scope: "No impact", reason: "Post-workshop closure" },
  { when: "2026-07-14 16:41", who: "M. Al-Otaibi (Drilling)", what: "Detailed Well Diagram revised", from: "Rev B", to: "Rev C", section: "DSP 3.1 / Design Package", scope: "Schedule +2d", reason: "Casing shoe adjustment" },
  { when: "2026-07-12 11:05", who: "H. Al-Rashed (FD)", what: "Concept option excluded", from: "5 options", to: "4 options", section: "DSP 2.0 / Options List", scope: "Cost -0.4%", reason: "Reservoir simulation result" },
  { when: "2026-07-10 08:14", who: "S. Al-Fahad (Planning)", what: "Milestone date moved", from: "2026-08-01", to: "2026-08-14", section: "DSP 2.0 / Milestones", scope: "Schedule +13d", reason: "HSE audit dependency" },
];
