import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { projects } from "@/lib/mock";
import { Plus, Download, Save, Layers } from "lucide-react";

export const Route = createFileRoute("/well-schematics")({
  head: () => ({
    meta: [
      { title: "Create Well Schematics — WDPGS" },
      { name: "description", content: "Build and edit well schematics from casing, tubing and completion inputs." },
      { property: "og:title", content: "Create Well Schematics — WDPGS" },
      { property: "og:description", content: "Build and edit well schematics from casing, tubing and completion inputs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WellSchematics,
});

type Comp = { id: string; type: string; od: string; top: string; shoe: string; grade: string };

const initial: Comp[] = [
  { id: "c1", type: "Conductor", od: '30"', top: "0 m", shoe: "80 m", grade: "X-52" },
  { id: "c2", type: "Surface Casing", od: '20"', top: "0 m", shoe: "650 m", grade: "K-55" },
  { id: "c3", type: "Intermediate Casing", od: '13-3/8"', top: "0 m", shoe: "1850 m", grade: "N-80" },
  { id: "c4", type: "Production Casing", od: '9-5/8"', top: "0 m", shoe: "3120 m", grade: "P-110" },
  { id: "c5", type: "Production Tubing", od: '4-1/2"', top: "0 m", shoe: "3010 m", grade: "L-80" },
];

function WellSchematics() {
  const [project, setProject] = useState(projects[0].code);
  const [well, setWell] = useState("NK-224");
  const [rows, setRows] = useState<Comp[]>(initial);

  const update = (id: string, patch: Partial<Comp>) => setRows(rows.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const add = () => setRows([...rows, { id: `c${rows.length + 1}`, type: "New string", od: '7"', top: "0 m", shoe: "0 m", grade: "L-80" }]);

  return (
    <div className="p-6 xl:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Create Well Schematics"
        subtitle="Assemble a well schematic from casing, tubing and completion inputs. Schematics can be inserted into DSP sections."
        actions={
          <>
            <button className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Save className="h-3.5 w-3.5" />Save</button>
            <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><Download className="h-3.5 w-3.5" />Export</button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <select value={project} onChange={e => setProject(e.target.value)} className="h-9 px-2 rounded-md border border-border bg-input/60">
          {projects.map(p => <option key={p.code} value={p.code}>{p.code} — {p.name}</option>)}
        </select>
        <select value={well} onChange={e => setWell(e.target.value)} className="h-9 px-2 rounded-md border border-border bg-input/60">
          {["NK-224", "NK-225", "MB-118", "UG-071"].map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <StatusTag tone="blue">Draft schematic</StatusTag>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 lg:col-span-7 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" />Schematic inputs</div>
            <button onClick={add} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />Add string</button>
          </div>
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>{["Component", "OD", "Top", "Shoe", "Grade"].map(h => <th key={h} className="text-left px-2 py-2">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(r => (
                <tr key={r.id}>
                  {(["type", "od", "top", "shoe", "grade"] as const).map(k => (
                    <td key={k} className="px-2 py-1.5">
                      <input value={r[k]} onChange={e => update(r.id, { [k]: e.target.value })} className="h-7 w-full rounded border border-border bg-input/60 px-1.5 text-[11px]" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="col-span-12 lg:col-span-5 p-4">
          <div className="text-sm font-semibold mb-3">Preview — {well}</div>
          <SchematicSvg rows={rows} />
          <p className="mt-2 text-[10px] text-muted-foreground italic">Advisory rendering — verify against the approved engineering drawing.</p>
        </Panel>
      </div>
    </div>
  );
}

function SchematicSvg({ rows }: { rows: Comp[] }) {
  const depths = rows.map(r => parseFloat(r.shoe) || 0);
  const max = Math.max(...depths, 1);
  return (
    <svg viewBox="0 0 240 380" className="w-full h-[420px] rounded border border-border bg-secondary/20">
      <line x1="120" y1="20" x2="120" y2="360" stroke="var(--border)" strokeDasharray="3 3" />
      {rows.map((r, i) => {
        const d = (parseFloat(r.shoe) || 0) / max;
        const y = 20 + d * 320;
        const w = 70 - i * 10;
        return (
          <g key={r.id}>
            <rect x={120 - w / 2} y={20} width={w} height={y - 20} fill="none" stroke="var(--primary)" strokeWidth="1.2" opacity={0.8 - i * 0.1} />
            <line x1={120 - w / 2 - 6} y1={y} x2={120 + w / 2 + 6} y2={y} stroke="var(--status-orange)" strokeWidth="1.5" />
            <text x={120 + w / 2 + 10} y={y + 3} fontSize="7" fill="var(--muted-foreground)">{r.od} {r.type} · {r.shoe}</text>
          </g>
        );
      })}
      <text x="8" y="14" fontSize="8" fill="var(--muted-foreground)">Well schematic (not to scale)</text>
    </svg>
  );
}
