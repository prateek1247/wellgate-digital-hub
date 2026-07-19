import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusTag } from "@/components/shell";
import { changeLog } from "@/lib/mock";
import { Shield, UserPlus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "User Access & Admin — WDPGS" }, { name: "description", content: "Role-based access, audit trail and change log." }] }),
  component: Admin,
});

const users = [
  { name:"Prateek Sharma", role:"IE", team:"IE Team", status:"Active" },
  { name:"A. Al-Sabah", role:"CPA", team:"CPA Team", status:"Active" },
  { name:"M. Al-Otaibi", role:"Gate Keeper", team:"Leadership", status:"Active" },
  { name:"H. Al-Rashed", role:"Planning", team:"Planning Directorate", status:"Active" },
  { name:"K. Al-Mutairi", role:"Drilling", team:"Drilling Team", status:"Suspended" },
];

function Admin(){
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="User Access & Admin"
        subtitle="Manage roles, permissions and platform-wide audit trail. Role assignments here do not grant governance authority."
        actions={<button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5"><UserPlus className="h-3.5 w-3.5"/>Invite User</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2 overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-sm font-semibold">Users</div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>{["Name","Role","Team","Status",""].map(h=>(<th key={h} className="text-left px-4 py-2.5 font-medium">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(u=>(
                <tr key={u.name} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3"><StatusTag tone="blue">{u.role}</StatusTag></td>
                  <td className="px-4 py-3 text-muted-foreground">{u.team}</td>
                  <td className="px-4 py-3"><StatusTag tone={u.status==="Active"?"green":"red"}>{u.status}</StatusTag></td>
                  <td className="px-4 py-3 text-right text-xs text-primary">Manage</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-primary"/><div className="text-sm font-semibold">Role Matrix</div></div>
          <div className="space-y-2 text-xs">
            {[
              ["IE","Author DSP, raise activities"],
              ["Drilling","Contribute technical inputs"],
              ["Planning","Coordinate stages, close comments"],
              ["CPA","Review, clarify, produce assurance"],
              ["Leadership","Read-only executive view"],
              ["Admin","Templates, rules, access"],
            ].map(([r,d])=>(
              <div key={r} className="border border-border rounded p-2.5">
                <div className="font-medium">{r}</div>
                <div className="text-muted-foreground mt-0.5">{d}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="text-sm font-semibold">History & Change Log</div>
          <div className="text-xs text-muted-foreground">Timestamped, memo-free traceability</div>
        </div>
        <div className="divide-y divide-border">
          {changeLog.map((c,i)=>(
            <div key={i} className="px-5 py-4 grid grid-cols-12 gap-3 text-xs hover:bg-secondary/30">
              <div className="col-span-2 text-muted-foreground">{c.when}</div>
              <div className="col-span-2">{c.who}</div>
              <div className="col-span-3">
                <div className="font-medium">{c.what}</div>
                <div className="text-muted-foreground mt-0.5">{c.section}</div>
              </div>
              <div className="col-span-2 text-muted-foreground"><span className="line-through">{c.from}</span> → <span className="text-foreground">{c.to}</span></div>
              <div className="col-span-2"><StatusTag tone={c.scope.includes("No")?"green":c.scope.includes("Cost")?"orange":"yellow"}>{c.scope}</StatusTag></div>
              <div className="col-span-1 text-right text-primary">View</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
