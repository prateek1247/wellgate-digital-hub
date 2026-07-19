import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { activityLibrary } from "@/lib/mock";
import { Search, Plus } from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({ meta: [{ title: "Activity Library — WDPGS" }, { name: "description", content: "Reusable standard activity catalog across stage gates." }] }),
  component: ActivitiesLib,
});

function ActivitiesLib(){
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Activity Library"
        subtitle="Reusable standard activity catalog with inputs, outputs, RACI and escalation rules."
        actions={<button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/>New Activity</button>}
      />

      <Panel className="p-4 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <input className="w-full h-9 pl-9 rounded-md bg-input/60 border border-border text-sm" placeholder="Search activities…"/>
          </div>
          {["Stage","Responsible","Accountable"].map(f=>(<select key={f} className="h-9 px-3 rounded-md bg-input/60 border border-border text-xs"><option>{f}: All</option></select>))}
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
            <tr>{["Activity","Stage","Responsible","Accountable","Timeline","Inputs","Outputs","Linked DSP",""].map(h=>(<th key={h} className="text-left px-4 py-3 font-medium">{h}</th>))}</tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {activityLibrary.map(a=>(
              <tr key={a.name} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3"><StatusTag tone="blue">{a.stage}</StatusTag></td>
                <td className="px-4 py-3 text-muted-foreground">{a.responsible}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.accountable}</td>
                <td className="px-4 py-3 text-xs">{a.timeline}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">Reservoir + surface data</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">Signed activity report</td>
                <td className="px-4 py-3 text-xs">DSP {a.stage.replace("SG","")}</td>
                <td className="px-4 py-3 text-right"><button className="text-primary text-xs">Configure</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Panel className="p-4">
          <div className="text-sm font-semibold mb-2">Reminder Rules</div>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>· 7 days before due — reminder to Responsible</li>
            <li>· 2 days before due — reminder to Accountable</li>
            <li>· On overdue — daily reminder + flag on dashboard</li>
          </ul>
        </Panel>
        <Panel className="p-4">
          <div className="text-sm font-semibold mb-2">Escalation Rules</div>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>· Overdue 3 days — escalate to Planning focal</li>
            <li>· Overdue 7 days — escalate to Directorate</li>
            <li>· Overdue 14 days — CPA notified for readiness impact</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
