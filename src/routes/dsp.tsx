import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatusDot, StatusTag } from "@/components/shell";
import { dspSections, projects } from "@/lib/mock";
import { ChevronRight, Save, Bell, FileText, Upload, MessageSquare, Send } from "lucide-react";

export const Route = createFileRoute("/dsp")({
  head: () => ({ meta: [{ title: "DSP Workspace — WDPGS" }, { name: "description", content: "Prepare and review DSP package content across stage gates." }] }),
  component: DspWorkspace,
});

function DspWorkspace() {
  const [dsp, setDsp] = useState<"1.0"|"2.0"|"3.1"|"3.2">("3.1");
  const meta = dspSections[dsp];
  const [selected, setSelected] = useState(0);
  const project = projects[0];

  const sectionStatuses = ["completed","in-progress","not-started","in-progress","overdue","completed","not-started"] as const;
  const status = (i:number) => sectionStatuses[i % sectionStatuses.length];

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      <PageHeader
        title="DSP Workspace"
        subtitle="Prepare, review and track Delivery Support Package content. Working comments are tracked as sub-activities."
      />

      {/* Breadcrumb + DSP selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-mono text-primary">{project.code}</span>
          <ChevronRight className="h-3 w-3"/>
          <span>{project.name}</span>
          <ChevronRight className="h-3 w-3"/>
          <span className="text-foreground font-medium">DSP {dsp}</span>
        </div>
        <div className="flex gap-1 text-xs">
          {(["1.0","2.0","3.1","3.2"] as const).map(v=>(
            <button key={v} onClick={()=>{setDsp(v); setSelected(0);}} className={`px-3 py-1.5 rounded-md border ${dsp===v?"bg-primary/15 border-primary/30 text-primary":"border-border text-muted-foreground hover:bg-secondary"}`}>DSP {v}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left panel */}
        <Panel className="col-span-3 p-3 max-h-[calc(100vh-220px)] overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-2">{meta.title}</div>
          <div className="space-y-0.5">
            {meta.sections.map((s,i)=>(
              <button key={s} onClick={()=>setSelected(i)} className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded text-xs ${selected===i?"bg-primary/15 text-primary":"hover:bg-secondary text-foreground/80"}`}>
                <StatusDot status={status(i)}/>
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Center */}
        <div className="col-span-6 space-y-4">
          <Panel className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Section {selected+1} of {meta.sections.length}</div>
                <h2 className="text-lg font-semibold mt-1">{meta.sections[selected]}</h2>
              </div>
              <StatusTag tone={status(selected)==="completed"?"green":status(selected)==="overdue"?"red":status(selected)==="not-started"?"grey":"orange"}>
                {status(selected).replace("-"," ")}
              </StatusTag>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4 text-xs">
              <Meta label="Responsible" value="FD Team"/>
              <Meta label="Accountable" value="Planning"/>
              <Meta label="Due" value="2026-08-04"/>
              <Meta label="Reviewer" value="CPA — A. Al-Sabah"/>
            </div>
            <div className="mt-5">
              <div className="text-xs text-muted-foreground mb-1">Description</div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                Provide a concise write-up covering the objectives, scope boundary, dependencies and the rationale for the design decisions captured in this section. Reference offset well data, subsurface hazards and any interface constraints with dependent facilities.
              </p>
            </div>
            <div className="mt-5">
              <div className="text-xs text-muted-foreground mb-2">Content / Inputs</div>
              <textarea className="w-full min-h-[140px] rounded-md bg-input/60 border border-border p-3 text-sm" defaultValue={`Draft content for "${meta.sections[selected]}" — captured in review; owner to confirm.`}/>
            </div>
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-2">Attachments</div>
              <div className="flex flex-wrap gap-2">
                {["FDP-Addendum-v3.pdf","Design-Audit-RevC.docx","Risk-Register.xlsx"].map(f=>(
                  <div key={f} className="flex items-center gap-2 text-xs px-2.5 py-1.5 bg-secondary/40 border border-border rounded"><FileText className="h-3.5 w-3.5 text-primary"/>{f}</div>
                ))}
                <button className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-dashed border-border rounded text-muted-foreground hover:text-foreground"><Upload className="h-3.5 w-3.5"/>Upload</button>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
              <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5"><Save className="h-3.5 w-3.5"/>Save</button>
              <button className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><Bell className="h-3.5 w-3.5"/>Send Reminder</button>
              <button className="h-9 px-3 rounded-md border border-border text-xs flex items-center gap-1.5"><FileText className="h-3.5 w-3.5"/>View Full Report</button>
              <button className="h-9 px-3 rounded-md border border-border text-xs ml-auto">Export DSP Package</button>
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Section History</div>
            <div className="space-y-2 text-xs">
              {["Content updated by FD Team · 2026-07-14","CPA clarification raised · 2026-07-12","Draft imported from template · 2026-07-05"].map((e,i)=>(
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                  <StatusDot status={i===0?"completed":i===1?"in-progress":"not-started"}/>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right panel */}
        <div className="col-span-3 space-y-4">
          <Panel className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Working Comments</div>
              <button className="text-[11px] text-primary">+ Add as sub-activity</button>
            </div>
            <div className="space-y-2">
              {[
                { title:"Confirm pore pressure gradient", owner:"RST", due:"2026-07-30", status:"in-progress" },
                { title:"Verify casing shoe depth", owner:"Drilling", due:"2026-07-28", status:"not-started" },
              ].map(c=>(
                <div key={c.title} className="border border-border rounded-md p-3 bg-secondary/20">
                  <div className="text-xs font-medium">{c.title}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Owner {c.owner} · Due {c.due}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusTag tone={c.status==="in-progress"?"orange":"grey"}>{c.status.replace("-"," ")}</StatusTag>
                    <div className="flex gap-1">
                      <button className="text-[10px] px-2 py-0.5 rounded border border-border">Remind</button>
                      <button className="text-[10px] px-2 py-0.5 rounded border border-border">Close</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPA Comments</div>
              <StatusTag tone="yellow">3 open</StatusTag>
            </div>
            <div className="space-y-2">
              {[
                { c:"Provide justification for excluded option 3", r:"A. Al-Sabah", owner:"FD Team", due:"2026-07-31" },
                { c:"Clarify data acquisition scope for offset well #4", r:"H. Al-Rashed", owner:"RST", due:"2026-08-02" },
              ].map(x=>(
                <div key={x.c} className="border border-yellow-500/20 bg-[color:var(--status-yellow)]/5 rounded-md p-3">
                  <div className="text-xs">{x.c}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">CPA {x.r} · Owner {x.owner} · Due {x.due}</div>
                  <div className="mt-2 flex gap-1">
                    <button className="text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground flex items-center gap-1"><Send className="h-2.5 w-2.5"/>Add response</button>
                    <button className="text-[10px] px-2 py-0.5 rounded border border-border flex items-center gap-1"><MessageSquare className="h-2.5 w-2.5"/>Thread</button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Meta({label,value}:{label:string;value:string}){
  return <div><div className="text-muted-foreground">{label}</div><div className="font-medium mt-0.5">{value}</div></div>;
}
