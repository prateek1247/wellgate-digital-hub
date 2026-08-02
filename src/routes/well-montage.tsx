import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { projects } from "@/lib/mock";
import { Plus, Download, GripVertical } from "lucide-react";

export const Route = createFileRoute("/well-montage")({
  head: () => ({
    meta: [
      { title: "Well Montage — WDPGS" },
      { name: "description", content: "Compose a well montage combining schematic, trajectory, logs and completion panels." },
      { property: "og:title", content: "Well Montage — WDPGS" },
      { property: "og:description", content: "Compose a well montage combining schematic, trajectory, logs and completion panels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WellMontage,
});

const availablePanels = [
  "Well Schematic",
  "Trajectory — Section View",
  "Trajectory — Top View",
  "Formation Tops",
  "Petrophysical Log",
  "Casing & Cement Summary",
  "Completion Detail",
  "Perforation Intervals",
  "Production Profile",
  "Anticollision Summary",
];

function WellMontage() {
  const [project, setProject] = useState(projects[0].code);
  const [well, setWell] = useState("NK-224");
  const [panels, setPanels] = useState<string[]>(["Well Schematic", "Trajectory — Section View", "Formation Tops", "Completion Detail"]);

  const toggle = (p: string) => setPanels(panels.includes(p) ? panels.filter(x => x !== p) : [...panels, p]);

  return (
    <div className="p-6 xl:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Well Montage"
        subtitle="Combine schematic, trajectory, log and completion panels into a single montage sheet for the DSP or gate pack."
        actions={<button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><Download className="h-3.5 w-3.5" />Export montage</button>}
      />

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <select value={project} onChange={e => setProject(e.target.value)} className="h-9 px-2 rounded-md border border-border bg-input/60">
          {projects.map(p => <option key={p.code} value={p.code}>{p.code} — {p.name}</option>)}
        </select>
        <select value={well} onChange={e => setWell(e.target.value)} className="h-9 px-2 rounded-md border border-border bg-input/60">
          {["NK-224", "NK-225", "MB-118", "UG-071"].map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <StatusTag tone="blue">{panels.length} panels</StatusTag>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 lg:col-span-3 p-4">
          <div className="text-sm font-semibold mb-2">Available panels</div>
          <div className="space-y-1">
            {availablePanels.map(p => (
              <label key={p} className="flex items-center gap-2 text-[11px] px-2 py-1.5 rounded border border-border hover:bg-secondary/40 cursor-pointer">
                <input type="checkbox" checked={panels.includes(p)} onChange={() => toggle(p)} className="accent-[color:var(--accent-blue)]" />
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{p}</span>
              </label>
            ))}
          </div>
          <button onClick={() => setPanels([...panels, `Custom panel ${panels.length + 1}`])} className="mt-3 h-8 w-full rounded-md border border-border text-xs flex items-center justify-center gap-1.5 hover:bg-secondary">
            <Plus className="h-3.5 w-3.5" />Add custom panel
          </button>
        </Panel>

        <Panel className="col-span-12 lg:col-span-9 p-4">
          <div className="text-sm font-semibold mb-3">Montage layout — {well}</div>
          {panels.length === 0 ? (
            <div className="text-xs text-muted-foreground italic border border-dashed border-border rounded p-10 text-center">Select panels to compose the montage.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {panels.map(p => (
                <div key={p} className="rounded border border-border overflow-hidden">
                  <div className="px-2 py-1 text-[10px] bg-secondary/40 text-muted-foreground border-b border-border flex items-center justify-between">
                    <span>{p}</span>
                    <button onClick={() => setPanels(panels.filter(x => x !== p))} className="text-[10px] text-muted-foreground hover:text-foreground">remove</button>
                  </div>
                  <div className="h-36 grid place-items-center bg-secondary/10">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                      <g stroke="var(--border)" strokeWidth="0.3">
                        {Array.from({ length: 5 }).map((_, i) => <line key={i} x1="0" x2="200" y1={i * 20} y2={i * 20} />)}
                      </g>
                      <path d="M20,90 C 60,80 90,40 180,20" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
