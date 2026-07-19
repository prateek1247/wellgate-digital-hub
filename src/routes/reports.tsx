import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatusTag } from "@/components/shell";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports & KPIs — WDPGS" }, { name: "description", content: "Operational KPIs and reports across stage gates." }] }),
  component: Reports,
});

function Bar({ label, value, tone="blue" }: { label: string; value: number; tone?: "blue"|"orange"|"green"|"red" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-xs text-muted-foreground truncate">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${tone==="blue"?"bg-primary":tone==="orange"?"bg-[color:var(--status-orange)]":tone==="green"?"bg-[color:var(--status-green)]":"bg-[color:var(--status-red)]"}`} style={{width:`${value}%`}}/>
      </div>
      <div className="w-10 text-right text-xs tabular-nums">{value}%</div>
    </div>
  );
}

function Reports(){
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <PageHeader title="Reports & KPIs" subtitle="Operational and executive dashboards across the WDPGS portfolio."/>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Active Projects by Stage</div>
          <div className="space-y-2">
            <Bar label="SG1.0" value={20}/>
            <Bar label="SG2.0" value={45}/>
            <Bar label="SG3.1" value={60}/>
            <Bar label="SG3.2" value={30}/>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">DSP Readiness</div>
          <div className="space-y-2">
            <Bar label="DSP 1.0" value={78} tone="green"/>
            <Bar label="DSP 2.0" value={64} tone="orange"/>
            <Bar label="DSP 3.1" value={52} tone="orange"/>
            <Bar label="DSP 3.2" value={41} tone="red"/>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Overdue Activities by Discipline</div>
          <div className="space-y-2">
            {[["Drilling",22,"red"],["FD",14,"orange"],["RST",10,"orange"],["Surface",6,"green"],["HSE",4,"green"]].map(([l,v,t])=>(
              <Bar key={l as string} label={l as string} value={v as number} tone={t as any}/>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Cycle Times (avg)</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[["DSP prep","18 d"],["CPA review","9 d"],["Stage closure","46 d"],["Team response","3.2 d"]].map(([l,v])=>(
              <div key={l} className="p-3 border border-border rounded-md">
                <div className="text-muted-foreground">{l}</div>
                <div className="text-lg font-semibold mt-1">{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Projects at Risk</div>
          <ul className="space-y-2 text-xs">
            {[["MBP2","SG2.0","Concept selection delay"],["WWI-X10","SG3.2","Procurement lead time"],["EXPL-2027","SG2.0","Prospect data gaps"]].map(([p,s,r])=>(
              <li key={p} className="flex items-center justify-between border border-border rounded-md px-3 py-2">
                <div><span className="font-mono text-primary mr-2">{p}</span>{r}</div>
                <StatusTag tone="orange">{s}</StatusTag>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5">
          <div className="text-sm font-semibold mb-3">Compliance & Readiness</div>
          <div className="space-y-2">
            <Bar label="HSE compliance" value={91} tone="green"/>
            <Bar label="Facility readiness" value={73} tone="orange"/>
            <Bar label="CPA comments open" value={38} tone="orange"/>
            <Bar label="Closure remarks pending" value={22} tone="red"/>
          </div>
        </Panel>
      </div>
    </div>
  );
}
