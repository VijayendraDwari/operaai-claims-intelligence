/**
 * OperaAI Claims Intelligence — tRPC Router
 *
 * All API procedures are defined here. The router is consumed by:
 * - server/index.ts (Express adapter)
 * - client/src/lib/trpc.ts (React Query client)
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import {
  addAuditLog,
  getAuditLogsByClaimNumber,
  getClaimByNumber,
  getClaimsByQueue,
  getQueueCounts,
  resetAllDemoClaims,
  updateClaimQueue,
  type QueueStage,
} from "./db.js";
import { mockAiCopilot } from "./copilot.js";

const t = initTRPC.create({ transformer: superjson });
export const router = t.router;
export const publicProcedure = t.procedure;

// Queue stage ordering for "advance" logic
const QUEUE_ORDER: QueueStage[] = [
  "intake_triage",
  "idv_eligibility",
  "medical_assessment",
  "adjudication",
  "quality_check",
  "payment_closure",
];

export const appRouter = router({
  // ── Get all claims for a specific queue ──────────────────────────────────
  getClaimsByQueue: publicProcedure
    .input(z.object({ queue: z.string() }))
    .query(async ({ input }) => {
      return getClaimsByQueue(input.queue);
    }),

  // ── Get a single claim by claim number ───────────────────────────────────
  getClaimByNumber: publicProcedure
    .input(z.object({ claimNumber: z.string() }))
    .query(async ({ input }) => {
      return getClaimByNumber(input.claimNumber);
    }),

  // ── Get queue counts for sidebar badges ─────────────────────────────────
  getQueueCounts: publicProcedure.query(async () => {
    return getQueueCounts();
  }),

  // ── Get audit log for a claim ────────────────────────────────────────────
  getAuditLog: publicProcedure
    .input(z.object({ claimNumber: z.string() }))
    .query(async ({ input }) => {
      return getAuditLogsByClaimNumber(input.claimNumber);
    }),

  // ── Advance a claim to the next queue stage ──────────────────────────────
  advanceClaim: publicProcedure
    .input(
      z.object({
        claimNumber: z.string(),
        performer: z.string().default("Claims Officer"),
      })
    )
    .mutation(async ({ input }) => {
      const claim = await getClaimByNumber(input.claimNumber);
      if (!claim) throw new Error(`Claim ${input.claimNumber} not found`);

      const currentIndex = QUEUE_ORDER.indexOf(claim.current_queue);
      if (currentIndex === -1) throw new Error("Invalid queue stage");
      if (currentIndex === QUEUE_ORDER.length - 1) {
        throw new Error("Claim is already in the final stage");
      }

      const nextQueue = QUEUE_ORDER[currentIndex + 1];
      const stageLabels: Record<QueueStage, string> = {
        intake_triage: "Claim Lodgement",
        idv_eligibility: "Claim Assessment",
        medical_assessment: "Medical & Requirements",
        adjudication: "Claim Decisioning",
        quality_check: "QC & Decision Comms",
        payment_closure: "Payment & Closure",
      };

      await updateClaimQueue(input.claimNumber, nextQueue);
      await addAuditLog(
        input.claimNumber,
        "STAGE_ADVANCE",
        input.performer,
        `Claim advanced from ${stageLabels[claim.current_queue]} → ${stageLabels[nextQueue]}`
      );

      return { success: true, newQueue: nextQueue, newQueueLabel: stageLabels[nextQueue] };
    }),

  // ── AI Copilot ────────────────────────────────────────────────────────────
  aiCopilot: publicProcedure
    .input(
      z.object({
        claimNumber: z.string(),
        message: z.string(),
        queue: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const claim = await getClaimByNumber(input.claimNumber);
      if (!claim) throw new Error(`Claim ${input.claimNumber} not found`);

      const response = await mockAiCopilot(input.queue, input.message, claim);

      await addAuditLog(
        input.claimNumber,
        "AI_COPILOT_QUERY",
        "AI Copilot",
        `Query: "${input.message.substring(0, 80)}"`
      );

      return { response };
    }),

  // ── Reset Demo ────────────────────────────────────────────────────────────
  resetDemo: publicProcedure.mutation(async () => {
    await resetAllDemoClaims();
    return { success: true, message: "Demo reset to original 7 seed claims." };
  }),
});

export type AppRouter = typeof appRouter;
