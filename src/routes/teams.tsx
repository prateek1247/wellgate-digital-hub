import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { teams, activityLibrary } from "@/lib/mock";
import { Download, Bell } from "lucide-react";

export const Route = createFileRoute("/teams")({
  head: () => ({ meta: [{ title: "Teams & RACI — WDPGS" }, { name: "description", content: "Manage RACI matrix across activities and DSP sections." }] }),
  component: TeamsPage,
});

const roles = ["R","A","C","I"] as const;
function assign(actIdx:number, teamIdx:number): (typeof roles)[number] | "" {
  const h = (actIdx*7 + teamIdx*3) % 13;
  if (h===0) return "A";
  if (h<3) return "R";
  if (h<6) return "C";
  if (h<9) return "I";
  return "";
}

function TeamsPage(){
  const activities = activityLibrary.slice(0,10);
  return (
    <div className="p-8 max-w-[1700px] mx-auto">
      <PageHeader
        title="Teams & RACI"
        subtitle="Manage RACI matrix by project, activity and DSP section. Assign focal points and send reminders."
        actions={<>
          <button className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Bell className="h-3.5 w-3.5"/>Remind Accountable</button>
          <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><Download className="h-3.5 w-3.5"/>Export RACI</button>
        </>}
      />

      <Panel className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="text-left px-3 py-2.5 sticky left-0 bg-secondary/40 min-w-[220px]">Activity / DSP Section</th>
              {teams.map(t=>(<th key={t} className="px-2 py-2.5 text-center font-medium whitespace-nowrap">{t}</th>))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map((a,i)=>(
              <tr key={a.name} className="hover:bg-secondary/30">
                <td className="px-3 py-2 sticky left-0 bg-card font-medium">{a.name}<div className="text-[10px] text-muted-foreground">{a.stage}</div></td>
                {teams.map((_,j)=>{
                  const r = assign(i,j);
                  const tone = r==="A"?"blue":r==="R"?"green":r==="C"?"orange":r==="I"?"grey":undefined;
                  return <td key={j} className="px-2 py-2 text-center">{r && <StatusTag tone={tone as any}>{r}</StatusTag>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid grid-cols-4 gap-3 mt-4 text-xs">
        <div className="flex items-center gap-2"><StatusTag tone="green">R</StatusTag> Responsible</div>
        <div className="flex items-center gap-2"><StatusTag tone="blue">A</StatusTag> Accountable</div>
        <div className="flex items-center gap-2"><StatusTag tone="orange">C</StatusTag> Consulted</div>
        <div className="flex items-center gap-2"><StatusTag tone="grey">I</StatusTag> Informed</div>
      </div>

      <Panel className="p-5 mt-4">
        <div className="text-sm font-semibold mb-3">Focal Points</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {teams.slice(0,8).map(t=>(
            <div key={t} className="border border-border rounded-md p-3">
              <div className="text-xs font-medium">{t}</div>
              <div className="text-[11px] text-muted-foreground mt-1">Focal: {t.split(" ")[0]} Lead</div>
              <button className="mt-2 text-[11px] text-primary hover:underline">Change focal</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
