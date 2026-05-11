/**
 * QueuePage — List view for a specific workflow stage
 *
 * Shows all claims in the selected queue with priority badges,
 * claimant info, claim type, and amount.
 */

import ClaimsLayout, { QUEUES } from "@/components/ClaimsLayout";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { cn } from "@/lib/utils";
import { ArrowRight, AlertTriangle, Clock, Minus } from "lucide-react";
import type { QueueStage } from "../../../server/db";

const PRIORITY_CONFIG = {
  P1: { label: "P1 Critical", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
  P2: { label: "P2 Standard", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Clock },
  P3: { label: "P3 Routine", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: Minus },
};

export default function QueuePage() {
  const params = useParams<{ queue: string }>();
  const queueKey = params.queue as QueueStage;

  const queueMeta = QUEUES.find((q) => q.key === queueKey);
  const { data: claims, isLoading } = trpc.getClaimsByQueue.useQuery({ queue: queueKey });

  if (!queueMeta) {
    return (
      <ClaimsLayout>
        <div className="p-8 text-white/50">Queue not found.</div>
      </ClaimsLayout>
    );
  }

  const Icon = queueMeta.icon;

  return (
    <ClaimsLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{queueMeta.label}</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {queueMeta.description} · Internal key:{" "}
              <code className="text-blue-300/70 text-xs">{queueKey}</code>
            </p>
          </div>
          {claims && (
            <span className="ml-auto text-sm font-medium px-3 py-1 rounded-full bg-white/10 text-white/60">
              {claims.length} claim{claims.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Claims list */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && claims?.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-white/30 text-sm">No claims in this queue.</p>
            <p className="text-white/20 text-xs mt-1">
              Claims will appear here as they are advanced through the workflow.
            </p>
          </div>
        )}

        {!isLoading && claims && claims.length > 0 && (
          <div className="space-y-3">
            {claims.map((claim) => {
              const priority = PRIORITY_CONFIG[claim.priority as keyof typeof PRIORITY_CONFIG];
              const PriorityIcon = priority?.icon ?? Minus;

              return (
                <Link key={claim.claim_number} href={`/queue/${queueKey}/${claim.claim_number}`}>
                  <a className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/20 transition-all p-4 group">
                    {/* Priority badge */}
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium flex-shrink-0", priority?.bg)}>
                      <PriorityIcon className={cn("w-3 h-3", priority?.color)} />
                      <span className={priority?.color}>{claim.priority}</span>
                    </div>

                    {/* Claim info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">{claim.claimant_name}</span>
                        <span className="text-white/30 text-xs">·</span>
                        <span className="text-blue-300/70 text-xs font-mono">{claim.claim_number}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{claim.claim_type}</span>
                        <span>·</span>
                        <span>{claim.hospital_name}</span>
                        <span>·</span>
                        <span>{claim.diagnosis_code}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-white font-semibold text-sm">
                        SGD {claim.claim_amount.toLocaleString()}
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">
                        Submitted {claim.submission_date}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </a>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ClaimsLayout>
  );
}
