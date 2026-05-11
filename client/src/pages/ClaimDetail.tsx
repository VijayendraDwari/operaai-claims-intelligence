/**
 * ClaimDetail — Deep-dive view for a single claim
 *
 * Features:
 * - Collapsible data sections (Claimant, Policy, Medical, Financial)
 * - AI Copilot panel with keyword-triggered responses
 * - Advance to Next Stage button with audit log
 * - Full audit trail display
 */

import { useState, useRef, useEffect } from "react";
import ClaimsLayout, { QUEUES } from "@/components/ClaimsLayout";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";
import type { QueueStage } from "../../../server/db";

// ── Collapsible Section ────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors text-left"
      >
        <span className="text-white/70 text-sm font-medium">{title}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-white/30" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white/30" />
        )}
      </button>
      {open && <div className="px-4 py-4 bg-white/3">{children}</div>}
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="mb-3">
      <div className="text-white/30 text-xs mb-0.5">{label}</div>
      <div className={cn("text-white/80 text-sm", mono && "font-mono text-blue-300/80")}>
        {value ?? <span className="text-white/20 italic">Not set</span>}
      </div>
    </div>
  );
}

// ── AI Copilot ─────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

function AiCopilot({ claimNumber, queue }: { claimNumber: string; queue: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `**OperaAI Claims Copilot**\n\nI'm ready to assist with claim **${claimNumber}**. Ask me about eligibility, documents, MOH benchmarks, decisioning rules, or compliance.`,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const copilotMutation = trpc.aiCopilot.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    },
    onError: (err) => {
      toast.error(`Copilot error: ${err.message}`);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || copilotMutation.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    copilotMutation.mutate({ claimNumber, message: msg, queue });
  };

  // Render markdown-like bold text
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="text-white/90 font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <Bot className="w-4 h-4 text-blue-400" />
        <span className="text-white/70 text-sm font-medium">AI Copilot</span>
        <span className="ml-auto text-xs text-white/20">Human-in-the-Loop</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                msg.role === "user" ? "bg-blue-600/40" : "bg-white/10"
              )}
            >
              {msg.role === "user" ? (
                <User className="w-3 h-3 text-blue-300" />
              ) : (
                <Bot className="w-3 h-3 text-white/60" />
              )}
            </div>
            <div
              className={cn(
                "rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%]",
                msg.role === "user"
                  ? "bg-blue-600/20 text-blue-100"
                  : "bg-white/5 text-white/70"
              )}
            >
              {msg.content.split("\n").map((line, j) => (
                <div key={j}>{renderContent(line)}</div>
              ))}
            </div>
          </div>
        ))}
        {copilotMutation.isPending && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-white/60" />
            </div>
            <div className="bg-white/5 rounded-xl px-3 py-2 text-xs text-white/40 animate-pulse">
              Analysing claim...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about eligibility, MOH benchmark..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-blue-500/40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || copilotMutation.isPending}
            className="p-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ClaimDetail() {
  const params = useParams<{ queue: string; claimNumber: string }>();
  const queueKey = params.queue as QueueStage;
  const claimNumber = params.claimNumber;

  const utils = trpc.useUtils();

  const { data: claim, isLoading } = trpc.getClaimByNumber.useQuery({ claimNumber });
  const { data: auditLogs } = trpc.getAuditLog.useQuery({ claimNumber });

  const queueMeta = QUEUES.find((q) => q.key === queueKey);
  const currentQueueIndex = QUEUES.findIndex((q) => q.key === queueKey);
  const nextQueue = currentQueueIndex < QUEUES.length - 1 ? QUEUES[currentQueueIndex + 1] : null;

  const advanceMutation = trpc.advanceClaim.useMutation({
    onSuccess: (data) => {
      toast.success(`Claim advanced to ${data.newQueueLabel}`);
      utils.getClaimByNumber.invalidate({ claimNumber });
      utils.getAuditLog.invalidate({ claimNumber });
      utils.getQueueCounts.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to advance: ${err.message}`);
    },
  });

  if (isLoading) {
    return (
      <ClaimsLayout>
        <div className="p-8 space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      </ClaimsLayout>
    );
  }

  if (!claim) {
    return (
      <ClaimsLayout>
        <div className="p-8 text-white/50">Claim {claimNumber} not found.</div>
      </ClaimsLayout>
    );
  }

  return (
    <ClaimsLayout>
      <div className="flex h-full">
        {/* ── Left: Claim data ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-6">
            <Link href="/">
              <a className="hover:text-white/60 transition-colors">Dashboard</a>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/queue/${queueKey}`}>
              <a className="hover:text-white/60 transition-colors">{queueMeta?.label}</a>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-300/70 font-mono">{claimNumber}</span>
          </div>

          {/* Claim header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{claim.claimant_name}</h1>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <span className="font-mono text-blue-300/70">{claim.claim_number}</span>
                <span>·</span>
                <span>{claim.claim_type}</span>
                <span>·</span>
                <span
                  className={cn(
                    "font-medium",
                    claim.priority === "P1" ? "text-red-400" : claim.priority === "P2" ? "text-amber-400" : "text-green-400"
                  )}
                >
                  {claim.priority}
                </span>
              </div>
            </div>
            {/* Advance button */}
            {nextQueue && (
              <button
                onClick={() => advanceMutation.mutate({ claimNumber })}
                disabled={advanceMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {advanceMutation.isPending ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Advance to {nextQueue.label}
              </button>
            )}
            {!nextQueue && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Final Stage
              </div>
            )}
          </div>

          {/* Workflow progress */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
            {QUEUES.map((q, idx) => {
              const isCurrent = q.key === claim.current_queue;
              const isPast = QUEUES.findIndex((x) => x.key === claim.current_queue) > idx;
              return (
                <div key={q.key} className="flex items-center gap-1 flex-shrink-0">
                  <div
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      isCurrent ? "bg-blue-600/40 text-blue-300 border border-blue-500/40" :
                      isPast ? "bg-green-500/20 text-green-400" :
                      "bg-white/5 text-white/20"
                    )}
                  >
                    {q.label}
                  </div>
                  {idx < QUEUES.length - 1 && (
                    <ChevronRight className={cn("w-3 h-3 flex-shrink-0", isPast ? "text-green-400/50" : "text-white/10")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Data sections */}
          <Section title="Claimant Information" defaultOpen>
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Full Name" value={claim.claimant_name} />
              <Field label="NRIC" value={claim.claimant_nric} mono />
              <Field label="Date of Birth" value={claim.claimant_dob} />
              <Field label="Phone" value={claim.claimant_phone} />
              <Field label="Email" value={claim.claimant_email} />
              <Field
                label="Singpass Verified"
                value={
                  <span className={claim.singpass_verified ? "text-green-400" : "text-amber-400"}>
                    {claim.singpass_verified ? "✓ Verified" : "⚠ Pending"}
                  </span>
                }
              />
            </div>
          </Section>

          <Section title="Policy & Coverage" defaultOpen>
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Policy Number" value={claim.policy_number} mono />
              <Field label="Policy Type" value={claim.policy_type} />
              <Field label="Claim Type" value={claim.claim_type} />
              <Field label="CPF Account Status" value={claim.cpf_account_status} />
              <Field label="Medisave Balance" value={`SGD ${claim.medisave_balance.toLocaleString()}`} />
              <Field
                label="MediShield Life"
                value={
                  <span className={claim.medishield_eligible ? "text-green-400" : "text-red-400"}>
                    {claim.medishield_eligible ? "Eligible" : "Not Eligible"}
                  </span>
                }
              />
            </div>
          </Section>

          <Section title="Medical Information">
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Diagnosis Code" value={claim.diagnosis_code} mono />
              <Field label="Diagnosis" value={claim.diagnosis_description} />
              <Field label="Treatment" value={claim.treatment_type} />
              <Field label="Hospital" value={claim.hospital_name} />
              <Field label="Admission Date" value={claim.admission_date} />
              <Field label="Discharge Date" value={claim.discharge_date} />
            </div>
          </Section>

          <Section title="Financial Summary">
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Claimed Amount" value={`SGD ${claim.claim_amount.toLocaleString()}`} />
              <Field label="MOH Benchmark" value={claim.moh_benchmark_amount ? `SGD ${claim.moh_benchmark_amount.toLocaleString()}` : null} />
              <Field label="Approved Amount" value={claim.approved_amount ? `SGD ${claim.approved_amount.toLocaleString()}` : null} />
              <Field label="Payout Amount" value={claim.payout_amount ? `SGD ${claim.payout_amount.toLocaleString()}` : null} />
              <Field label="Adjudication Decision" value={claim.adjudication_decision} />
              <Field label="Incident Date" value={claim.incident_date} />
            </div>
          </Section>

          {/* Audit trail */}
          <Section title={`Audit Trail (${auditLogs?.length ?? 0} entries)`}>
            {!auditLogs?.length ? (
              <p className="text-white/30 text-xs">No audit entries yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <FileText className="w-3 h-3 text-white/20 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white/60 font-medium">{log.action}</span>
                      <span className="text-white/30 mx-1">·</span>
                      <span className="text-white/40">{log.performer}</span>
                      <span className="text-white/20 mx-1">·</span>
                      <span className="text-white/20">{log.timestamp}</span>
                      {log.details && (
                        <div className="text-white/30 mt-0.5">{log.details}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {claim.notes && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 text-xs font-medium">Case Notes</span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{claim.notes}</p>
            </div>
          )}
        </div>

        {/* ── Right: AI Copilot ──────────────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 border-l border-white/10 flex flex-col bg-[#0d1b2a]">
          <AiCopilot claimNumber={claimNumber} queue={queueKey} />
        </div>
      </div>
    </ClaimsLayout>
  );
}
