# Mock AI Copilot Response Templates

## Table of Contents
1. [Pattern overview](#pattern-overview)
2. [Why mock instead of real LLM](#why-mock-instead-of-real-llm)
3. [Response structure](#response-structure)
4. [Keyword routing per stage](#keyword-routing-per-stage)
5. [Default fallback response](#default-fallback-response)
6. [Implementation pattern](#implementation-pattern)

---

## Pattern overview

The AI Copilot uses a **mock function** (`mockAiCopilot`) instead of a live LLM call. Each queue stage has 2–3 keyword-triggered responses plus a default. The function adds a simulated delay (600–1000ms) to feel realistic.

**Trigger:** `trpc.claims.aiCopilot.useMutation` — receives `{ claimNumber, message, queue }`.

---

## Why mock instead of real LLM

The Manus platform provides `BUILT_IN_FORGE_API_KEY` / `BUILT_IN_FORGE_API_URL` for LLM access via `invokeLLM()`. However, for a demo application:

1. **Consistency** — mock responses always demonstrate the exact Future State narrative, regardless of LLM output variability.
2. **Reliability** — no API quota issues or latency spikes during live demos.
3. **Specificity** — responses reference exact Singapore regulatory terms (MAS Notice 120, CPF Medisave, MediShield Life, MOH benchmarks) that a generic LLM might not know.
4. **Speed** — mock responses return in under 1 second; real LLM calls can take 3–10 seconds.

To upgrade to real LLM: replace `mockAiCopilot` with `invokeLLM()` from `server/_core/llm.ts`, using the mock responses as the system prompt context.

---

## Response structure

Every response follows this markdown format:

```
**[Stage Name] — [Sub-topic]**

**Future State: [Capability Name]**

[Status checklist with ✓ / ⚠ icons]

**[Section heading]:**
[Bullet points or narrative]

**[Recommended Action / Status]:** [CAPS STATUS]
```

---

## Keyword routing per stage

### Stage 1: Claim Lodgement (`intake_triage`)

| Keywords | Response topic |
|----------|---------------|
| `eligible`, `eligibility`, `minimum` | Minimum Requirements Check — Agentic Intake Agent assessment |
| `document`, `missing`, `checklist` | Document Checklist — received vs pending items |
| `priority`, `triage`, `allocat` | Case Set-up & Allocation — P1/P2/P3 classification logic |
| _(default)_ | Claim Lodgement Summary — Future State capabilities applied |

### Stage 2: Claim Assessment (`idv_eligibility`)

| Keywords | Response topic |
|----------|---------------|
| `medisave`, `cpf`, `medishield` | CPF & MediShield Life Validation — real-time API checks |
| `policy`, `coverage`, `strategy` | Strategy Management & Policy Validation — benefit limits, deductible, co-insurance |
| `referral`, `specialist` | Referral Management — auto-created referral task |
| _(default)_ | Claim Assessment Complete — all Future State capabilities applied |

### Stage 3: Medical & Requirements (`medical_assessment`)

| Keywords | Response topic |
|----------|---------------|
| `moh`, `benchmark`, `fee`, `proration` | MOH Fee Benchmark Analysis — automated proration calculation |
| `diagnosis`, `clinical`, `medical necessity` | Clinical Assessment — ICD-10 validation, length of stay, pre-existing conditions |
| _(default)_ | Medical & Requirements Review Complete — ready for Claim Decisioning |

### Stage 4: Claim Decisioning (`adjudication`)

| Keywords | Response topic |
|----------|---------------|
| `approve`, `decision`, `auto`, `payout` | Auto-Decisioning Engine — 6-rule evaluation, payout calculation |
| `review`, `rules`, `structured` | Review & Decision — structured decision record for MAS audit |
| _(default)_ | Claim Decisioning Summary — APPROVED, ready for QC |

### Stage 5: QC & Decision Comms (`quality_check`)

| Keywords | Response topic |
|----------|---------------|
| `compliance`, `audit`, `mas`, `sla` | SLA Management & MAS Compliance — audit trail, PDPA, benefit limits |
| `communication`, `letter`, `notify`, `claimant` | Automated Claimant Communication — settlement letter, SMS, agent notification |
| _(default)_ | QC & Decision Comms Summary — approved for Payment & Closure |

### Stage 6: Payment & Closure (`payment_closure`)

| Keywords | Response topic |
|----------|---------------|
| `payment`, `payout`, `transfer`, `disburs` | Rules-Driven Payment Processing — FAST transfer, Medisave routing, auto-recon |
| `closure`, `close`, `ongoing`, `recon` | Claim Closure & Ongoing Management — closure checklist, MAS reporting |
| _(default)_ | Payment & Closure Summary — CLAIM SETTLED & CLOSED |

---

## Default fallback response

When no queue matches (should not happen in normal flow):

```
I'm the OperaAI Claims Copilot — powered by the ProAct AI Future State claims processing framework for OperaAI Singapore.

I can help you with:

**Claim Lodgement:** Minimum requirements, case set-up, intake validation
**Claim Assessment:** Concurrent workspace, Singpass/CPF/MediShield checks, strategy management
**Medical & Requirements:** MOH fee benchmarks, clinical assessment, specialist referrals
**Claim Decisioning:** Auto-decisioning rules, structured review, decision communications
**QC & Decision Comms:** SLA compliance, MAS audit trail, PDPA, automated notifications
**Payment & Closure:** Payment calculation, auto disbursement, recon, claim closure

Please ask a specific question about this claim and I'll provide detailed Future State guidance.
```

---

## Implementation pattern

```typescript
async function mockAiCopilot(
  queue: string,
  message: string,
  _claimContext: string   // available but not used in mock; use for real LLM
): Promise<string> {
  // Simulate LLM latency
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
  const msg = message.toLowerCase();

  if (queue === "intake_triage") {
    if (msg.includes("eligible") || msg.includes("minimum")) {
      return `**Claim Lodgement — Minimum Requirements Check**\n\n...`;
    }
    // ... more keyword branches
    return `**Claim Lodgement Summary**\n\n...`;  // default for this stage
  }

  if (queue === "idv_eligibility") { /* ... */ }
  // ... remaining stages

  return `I'm the OperaAI Claims Copilot...`;  // global fallback
}
```

The tRPC procedure that calls this:

```typescript
aiCopilot: publicProcedure
  .input(z.object({
    claimNumber: z.string(),
    message: z.string(),
    queue: z.string(),
  }))
  .mutation(async ({ input }) => {
    const claim = await getClaimByNumber(input.claimNumber);
    const claimContext = claim ? JSON.stringify(claim) : "{}";
    const response = await mockAiCopilot(input.queue, input.message, claimContext);
    return { response };
  }),
```
