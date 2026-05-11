/**
 * ClaimsLayout — Toscana Dark Navy Sidebar Layout
 *
 * The master layout for the OperaAI Claims Intelligence application.
 * Features:
 * - Dark navy sidebar with queue navigation and claim counts
 * - Collapsible sidebar for focus mode
 * - Reset Demo button
 * - OperaAI branding
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  FileText,
  ClipboardCheck,
  Stethoscope,
  Scale,
  ShieldCheck,
  CreditCard,
  LayoutDashboard,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

// ── Queue configuration ────────────────────────────────────────────────────────

export const QUEUES = [
  {
    key: "intake_triage",
    label: "Claim Lodgement",
    icon: FileText,
    row: "Row 1",
    description: "Intake validation & triage",
  },
  {
    key: "idv_eligibility",
    label: "Claim Assessment",
    icon: ClipboardCheck,
    row: "Row 2",
    description: "IDV, CPF & policy validation",
  },
  {
    key: "medical_assessment",
    label: "Medical & Requirements",
    icon: Stethoscope,
    row: "Row 3",
    description: "MOH benchmarks & clinical review",
  },
  {
    key: "adjudication",
    label: "Claim Decisioning",
    icon: Scale,
    row: "Row 4",
    description: "Auto-decisioning & payout calc",
  },
  {
    key: "quality_check",
    label: "QC & Decision Comms",
    icon: ShieldCheck,
    row: "Row 5",
    description: "MAS compliance & notifications",
  },
  {
    key: "payment_closure",
    label: "Payment & Closure",
    icon: CreditCard,
    row: "Row 6",
    description: "Disbursement & claim closure",
  },
] as const;

export type QueueKey = (typeof QUEUES)[number]["key"];

// ── Component ─────────────────────────────────────────────────────────────────

interface ClaimsLayoutProps {
  children: React.ReactNode;
}

export default function ClaimsLayout({ children }: ClaimsLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const { data: counts, refetch: refetchCounts } = trpc.getQueueCounts.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  const resetMutation = trpc.resetDemo.useMutation({
    onSuccess: () => {
      toast.success("Demo reset to original 7 seed claims.");
      refetchCounts();
    },
    onError: (err) => {
      toast.error(`Reset failed: ${err.message}`);
    },
  });

  const activeQueue = location.startsWith("/queue/")
    ? location.replace("/queue/", "").split("/")[0]
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1623]">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col flex-shrink-0 transition-all duration-300 border-r border-white/10",
          "bg-gradient-to-b from-[#0d1b2a] to-[#0a1628]",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold text-sm leading-tight">OperaAI</div>
                <div className="text-blue-300/70 text-xs">Claims Intelligence</div>
              </div>
            </div>
          )}
          {collapsed && <Activity className="w-5 h-5 text-blue-400 mx-auto" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white/80 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Dashboard link */}
        <div className="px-2 pt-3">
          <Link href="/">
            <a
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                location === "/"
                  ? "bg-blue-600/30 text-blue-300"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </a>
          </Link>
        </div>

        {/* Queue navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 py-1 text-xs font-medium text-white/30 uppercase tracking-wider mb-2">
              Workflow Queues
            </div>
          )}
          {QUEUES.map((queue) => {
            const Icon = queue.icon;
            const count = counts?.[queue.key] ?? 0;
            const isActive = activeQueue === queue.key;

            return (
              <Link key={queue.key} href={`/queue/${queue.key}`}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm group",
                    isActive
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                      : "text-white/60 hover:text-white/90 hover:bg-white/5"
                  )}
                  title={collapsed ? queue.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{queue.label}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            "text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0",
                            isActive
                              ? "bg-blue-500/40 text-blue-200"
                              : "bg-white/10 text-white/50"
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && count > 0 && (
                    <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-blue-400" />
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Reset Demo button */}
        <div className="px-2 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
              "text-red-400/70 hover:text-red-300 hover:bg-red-500/10",
              resetMutation.isPending && "opacity-50 cursor-not-allowed"
            )}
            title={collapsed ? "Reset Demo" : undefined}
          >
            <RefreshCw
              className={cn("w-4 h-4 flex-shrink-0", resetMutation.isPending && "animate-spin")}
            />
            {!collapsed && (
              <span>{resetMutation.isPending ? "Resetting..." : "Reset Demo"}</span>
            )}
          </button>
          {!collapsed && (
            <p className="text-white/20 text-xs px-3 mt-1">Restores all 7 seed claims</p>
          )}
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
