## Scope

Large multi-page overhaul of the WDPGS prototype (frontend only, mock data). Grouped by page below. All changes stay in presentation code — no backend/data model changes.

---

### 1. Dashboard (`src/routes/index.tsx`)

- Remove the "Upcoming Gate Reviews" and "Pending Change Requests" tiles.
- Show current role as a static label in the header (remove dropdown chevron/menu behavior).
- Active project tiles become `<Link>`s to `/workload?project=<slug>`.
- Each project tile's progress bar gets a 3-marker row underneath: **Start** · **Today** · **End** with dates, and a red "today" indicator inside the bar positioned by `(today-start)/(end-start)`.

### 2. Projects (`src/routes/projects.tsx`)

- Add a **Stage Gate** column (SG1 / SG2 / SG3.1) in table + timeline header rows; add `stageGate` field to the mock list.
- Overlay a vertical red "today" line across the Gantt grid (absolute-positioned inside the timeline body, spanning header + rows).

### 3. Workload — new route `src/routes/workload.tsx` (replaces old `dsp` entry)

Top of page:
- **Version dropdown per stage gate** (SG1 / SG2 / SG3.1 / SG3.2 tabs, each with its own version list e.g. v0.1, v0.2, v1.0).
- **Gate status strip**: Prepare DSP · Submit DSP · Conduct Assurance Review · Request Stage Gate Review · Stage Gate Meeting Review — each shown as a pill colored **green / amber / grey**.
- Action bar: **Download DSP**, **Send for Review**, **Run Validation**.

Two main sections (tabbed):

**a. Activity Tracker**
- Grouped by stage gate; activities pre-populated from the uploaded screenshot (1.0 Identification: 8 items, 2.0 Concept Selection: 9 items incl. sub-bullets, 3.1 Design: 10 items).
- Each activity row: assign-to-team, assign-to-myself, target date, reminder toggle (opens reminder editor), status dot, info (ℹ) popover for description.
- "Add Activity" button per stage.

**b. DSP**
- Left: section tree with **Add Section** / **Add Subsection** buttons.
- Middle: rich content area supporting text blocks, tables, and image placeholders (mock rich editor — textarea + "Insert table" / "Insert image" buttons rendering static blocks).
- Each section header: assign-to-team select, assign-to-myself, target date, reminder, ℹ description popover (replaces inline description).

Right rail (shared):
- **Working Comments** with "View all comments" link opening a full-list modal.
- **CPA Comments**: each comment has assign-to-Activity, assign-to-DSP-Section, assign-to-Team.
- **Section History** with "View detailed audit" link → modal listing all mock change events (who/what/when/field/old→new).
- **Validation Rules** panel: list of rule alerts (pass/warn/fail) + **Run Validation** button that flips a couple of alerts to demonstrate.

### 4. Templates & Rules (`src/routes/templates.tsx`)

- Per-project row: edit selectors for **DSP template**, **Activity template**, **Validation rule set**, **RACI**.
- Add **Edit Reports** action per report template.
- **DSP Builder**: add-section / add-subsection buttons, **Report Templates** subsection, per-section team-assignment dropdown, per-section **Visibility** control (All teams / choose teams multi-select), **Create Presentation Template** action.

### 5. Teams (`src/routes/teams.tsx`)

Update team list used across RACI + assignment dropdowns to:
CPA Team, Drilling Team, IE Team, FD Team, HSE Team, Engineering Team A, Engineering Team B, and (Exploratory) PE1, PE2, PE3, Asset Planning, CPA. Flag exploratory-only teams visually.

### 6. CPA Governance (`src/routes/cpa.tsx`)

- Add **Project Tracker** section: table of projects × stage gates with status + a **Closure Remarks** editable cell per stage gate.

### 7. Sidebar (`src/components/shell.tsx`)

- Rename "DSP Workspace" nav entry to **Workload** pointing to `/workload`. Keep other items unchanged.

---

### Technical notes

- All new interactivity uses local `useState`; no backend calls.
- Reminder editor, comments-all modal, and history-audit modal are simple portal-less overlays styled like the existing `Wizard` modal.
- "Today" is `new Date()` (client) — same helper used in Dashboard + Projects Gantt.
- Team list centralized in `src/lib/mock.ts` and imported by Workload, Templates, Teams, CPA.
- No new deps.
