import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileStack,
  GitBranch,
  ShieldCheck,
  Layers,
  Library,
  Users,
  ClipboardCheck,
  BarChart3,
  UserCog,
  Search,
  Bell,
  HelpCircle,
  Globe,
  ChevronDown,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/dsp", label: "Workload", icon: FileStack },
  { to: "/templates", label: "Templates and Rules", icon: Layers },
  { to: "/activities", label: "Activity Library", icon: Library },
  { to: "/stage-gates", label: "Governance", icon: GitBranch },
  { to: "/admin", label: "User Access", icon: UserCog },
  { to: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { to: "/cpa", label: "CPA Governance", icon: ShieldCheck },
  { to: "/reports", label: "Reports and KPIs", icon: BarChart3 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="dark min-h-screen w-full flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
            <span className="text-primary font-bold text-sm tracking-tight">KOC</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-sidebar-foreground">WDPGS</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Digital Gate System</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {nav.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border text-[10px] text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>v1.0 · Prototype</span>
            <span className="text-primary/80">Advisory</span>
          </div>
          <div className="mt-1 opacity-70">Advisory & enablement platform.<br/>Gate Keeper authority not automated.</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center gap-4">
          <div className="text-sm font-semibold tracking-tight">
            WDPGS <span className="text-muted-foreground font-normal">Digital Command Center</span>
          </div>
          <div className="ml-6 flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full h-9 pl-9 pr-3 rounded-md bg-input/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search project, well, DSP, stage gate, team…"
            />
          </div>
          <button className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-secondary/40 text-xs text-foreground/90 hover:bg-secondary">
            Role: IE
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          <button className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary text-muted-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[color:var(--status-orange)]" />
          </button>
          <button className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
          </button>
          <button className="h-9 px-2.5 grid place-items-center rounded-md border border-border hover:bg-secondary text-muted-foreground text-xs gap-1 flex">
            <Globe className="h-4 w-4" /> EN
          </button>
          <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 grid place-items-center text-xs font-semibold text-primary">
            PS
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function StatusDot({ status }: { status: "completed" | "in-progress" | "overdue" | "not-started" }) {
  const map = {
    completed: "bg-[color:var(--status-green)]",
    "in-progress": "bg-[color:var(--status-orange)]",
    overdue: "bg-[color:var(--status-red)]",
    "not-started": "bg-[color:var(--status-grey)]",
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[status]}`} />;
}

export function StatusTag({ tone, children }: { tone: "green" | "orange" | "red" | "yellow" | "blue" | "grey"; children: ReactNode }) {
  const map: Record<string, string> = {
    green: "bg-[color:var(--status-green)]/15 text-[color:var(--status-green)] border-[color:var(--status-green)]/30",
    orange: "bg-[color:var(--status-orange)]/15 text-[color:var(--status-orange)] border-[color:var(--status-orange)]/30",
    red: "bg-[color:var(--status-red)]/15 text-[color:var(--status-red)] border-[color:var(--status-red)]/30",
    yellow: "bg-[color:var(--status-yellow)]/15 text-[color:var(--status-yellow)] border-[color:var(--status-yellow)]/30",
    blue: "bg-primary/15 text-primary border-primary/30",
    grey: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${map[tone]}`}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl ${className}`}>{children}</div>
  );
}
