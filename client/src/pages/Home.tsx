import ClaimsLayout, { QUEUES } from "@/components/ClaimsLayout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Activity, ArrowRight, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data: counts, isLoading } = trpc.getQueueCounts.useQuery();
  const totalClaims = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  const stats = [
    { label: "Total Active Claims", value: isLoading ? "—" : totalClaims, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Pending Lodgement", value: isLoading ? "—" : (counts?.intake_triage ?? 0), icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "In Decisioning", value: isLoading ? "—" : (counts?.adjudication ?? 0), icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Ready for Payment", value: isLoading ? "—" : (counts?.payment_closure ?? 0), icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <ClaimsLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Claims Intelligence Dashboard</h1>
          <p className="text-white/50 text-sm">OperaAI · Agentic Workflow System · Singapore Health Insurance</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}><Icon className={`w-4 h-4 ${stat.color}`} /></div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            );
          })}
        </div>
        <div>
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">Workflow Queues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {QUEUES.map((queue, idx) => {
              const Icon = queue.icon;
              const count = counts?.[queue.key] ?? 0;
              return (
                <Link key={queue.key} href={`/queue/${queue.key}`}>
                  <a className="block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all p-5 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10"><Icon className="w-4 h-4 text-blue-400" /></div>
                        <div>
                          <div className="text-white text-sm font-medium">{queue.label}</div>
                          <div className="text-white/30 text-xs mt-0.5">Stage {idx + 1} · {queue.row}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-white/40 text-xs mb-4">{queue.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs">{count === 0 ? "No claims" : `${count} claim${count !== 1 ? "s" : ""}`}</span>
                      {count > 0 && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{count} pending</span>}
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-white/5 bg-white/3 p-5">
          <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">About This Demo</h3>
          <p className="text-white/40 text-sm leading-relaxed">
            Reference implementation of the <strong className="text-white/60">OperaAI Agentic Workflow Architecture</strong> for regulated insurance operations.
            Demonstrates multi-persona queue routing, Human-in-the-Loop AI Copilot, deterministic compliance boundaries, and Singapore regulatory context
            (MAS Notice 120, MOH benchmarks, CPF Medisave, MediShield Life). Database runs entirely in-memory — click <strong className="text-white/60">Reset Demo</strong> to restore all 7 seed claims.
          </p>
        </div>
      </div>
    </ClaimsLayout>
  );
}
