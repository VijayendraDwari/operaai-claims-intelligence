/**
 * OperaAI Claims Intelligence — AI Copilot
 *
 * This module implements the mock AI Copilot using deterministic keyword routing.
 * Each queue stage has 2–3 keyword-triggered responses plus a default.
 *
 * WHY MOCK?
 * - Demo reliability: no API quota issues or latency spikes during live presentations
 * - Narrative control: responses always use exact regulatory terminology
 * - Speed: returns in ~800ms simulated latency
 *
 * TO UPGRADE TO A LIVE LLM:
 * Replace the mockAiCopilot function body with a call to your preferred LLM provider
 * (OpenAI, Anthropic, Ollama, etc.), using the mock responses as the system prompt context.
 * The claimContext JSON string is already prepared for you.
 */

import type { Claim } from "./db.js";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function mockAiCopilot(
  queue: string,
  message: string,
  claim: Claim
): Promise<string> {
  // Simulate realistic LLM latency
  await delay(600 + Math.random() * 400);

  const msg = message.toLowerCase();

  // ── Stage 1: Claim Lodgement ─────────────────────────────────────────────
  if (queue === "intake_triage") {
    if (msg.includes("eligible") || msg.includes("minimum") || msg.includes("requirement")) {
      return `**Claim Lodgement — Minimum Requirements Check**

**Future State: Agentic Intake & Validation Agent**

✓ Claim form received and parsed
✓ Policy number ${claim.policy_number} validated against OperaShield registry
${claim.singpass_verified ? "✓ Singpass digital identity verified" : "⚠ Singpass verification PENDING — claimant action required"}
✓ Incident date ${claim.incident_date} within policy coverage window
✓ Submission within 30-day SLA window

**Minimum Requirements Status:**
- Policy Type: ${claim.policy_type}
- Claim Type: ${claim.claim_type}
- Hospital: ${claim.hospital_name}
- Diagnosis: ${claim.diagnosis_code} — ${claim.diagnosis_description}

**Recommended Action:** ${claim.singpass_verified ? "All minimum requirements met. Advance to Claim Assessment." : "Trigger Singpass verification SMS to claimant before advancing."}`;
    }

    if (msg.includes("document") || msg.includes("missing") || msg.includes("checklist")) {
      return `**Claim Lodgement — Document Checklist**

**Future State: Intelligent Document Assembly Agent**

✓ Completed claim form (Form OperaAI-CL-01)
✓ Hospital discharge summary
✓ Itemised bill from ${claim.hospital_name}
${claim.singpass_verified ? "✓ Singpass-verified identity" : "⚠ Singpass verification — PENDING"}
⚠ Specialist medical report — PENDING (required for ${claim.claim_type})
⚠ Employer income statement — ${claim.claim_type === "Disability Income" ? "REQUIRED" : "Not applicable"}

**Document Completeness: ${claim.singpass_verified ? "85%" : "70%"}**

**Recommended Action:** Send automated document request to claimant for outstanding items. Set 7-day follow-up reminder.`;
    }

    if (msg.includes("priority") || msg.includes("triage") || msg.includes("allocat")) {
      return `**Claim Lodgement — Case Set-up & Allocation**

**Future State: Auto-Triage & Allocation Engine**

**Priority Classification: ${claim.priority}**
- Claim Amount: SGD ${claim.claim_amount.toLocaleString()}
- Claim Type: ${claim.claim_type}
- ${claim.priority === "P1" ? "⚠ P1 — Critical Illness / High-value claim. Escalate to Senior Adjudicator." : claim.priority === "P2" ? "Standard processing. Assign to Adjudicator Pool B." : "Routine claim. Assign to Adjudicator Pool A."}

**SLA Clock Started:** ${claim.submission_date}
**Target Assessment Completion:** ${claim.priority === "P1" ? "3 business days" : claim.priority === "P2" ? "5 business days" : "7 business days"}

**Recommended Action:** Assign to ${claim.priority === "P1" ? "Senior Adjudicator (Team Lead approval required)" : "Standard Adjudicator"}.`;
    }

    return `**Claim Lodgement Summary — ${claim.claim_number}**

**Future State: Agentic Intake Agent applied**

✓ Automated intake validation complete
✓ Policy ${claim.policy_number} (${claim.policy_type}) confirmed active
✓ Claimant: ${claim.claimant_name} | NRIC: ${claim.claimant_nric}
${claim.singpass_verified ? "✓ Singpass verified" : "⚠ Singpass verification pending"}
✓ Priority: ${claim.priority} | Claim Amount: SGD ${claim.claim_amount.toLocaleString()}

Ask me about: eligibility requirements, document checklist, or priority allocation.`;
  }

  // ── Stage 2: Claim Assessment ─────────────────────────────────────────────
  if (queue === "idv_eligibility") {
    if (msg.includes("medisave") || msg.includes("cpf") || msg.includes("medishield")) {
      return `**Claim Assessment — CPF & MediShield Life Validation**

**Future State: Real-Time CPF Integration Agent**

**CPF Medisave Account:**
✓ Account Status: ${claim.cpf_account_status}
✓ Available Balance: SGD ${claim.medisave_balance.toLocaleString()}
✓ Withdrawal eligibility confirmed for ${claim.claim_type}

**MediShield Life:**
✓ MediShield Life Eligible: ${claim.medishield_eligible ? "YES" : "NO"}
✓ Policy covers ${claim.hospital_name} (Class B1 and above)

**Recommended Action:** Medisave withdrawal of SGD ${Math.min(claim.medisave_balance, claim.claim_amount * 0.15).toFixed(0)} pre-authorised. Proceed to medical assessment.`;
    }

    if (msg.includes("policy") || msg.includes("coverage") || msg.includes("strategy")) {
      return `**Claim Assessment — Strategy Management & Policy Validation**

**Future State: Policy Intelligence Engine**

**Policy: ${claim.policy_number}**
- Type: ${claim.policy_type}
- Claim Type: ${claim.claim_type}
- Claimed Amount: SGD ${claim.claim_amount.toLocaleString()}

**Coverage Analysis:**
✓ Hospitalisation benefit: Applicable
✓ Surgical benefit: Applicable for ${claim.treatment_type}
✓ Deductible: SGD 3,500 (annual, already met this policy year)
✓ Co-insurance: 10% of approved amount applies

**Recommended Action:** All coverage conditions met. Advance to Medical & Requirements for MOH benchmark assessment.`;
    }

    return `**Claim Assessment Complete — ${claim.claim_number}**

**Future State: Concurrent Assessment Workspace applied**

✓ Singpass identity: ${claim.singpass_verified ? "Verified" : "Pending"}
✓ CPF Medisave balance: SGD ${claim.medisave_balance.toLocaleString()} (${claim.cpf_account_status})
✓ MediShield Life: ${claim.medishield_eligible ? "Eligible" : "Not eligible"}
✓ Policy coverage: Confirmed for ${claim.claim_type}

Ask me about: CPF/Medisave validation, policy coverage strategy, or referral management.`;
  }

  // ── Stage 3: Medical & Requirements ──────────────────────────────────────
  if (queue === "medical_assessment") {
    if (msg.includes("moh") || msg.includes("benchmark") || msg.includes("fee") || msg.includes("proration")) {
      const benchmark = claim.moh_benchmark_amount ?? claim.claim_amount;
      const excess = Math.max(0, claim.claim_amount - benchmark);
      const prorationPct = benchmark > 0 ? ((benchmark / claim.claim_amount) * 100).toFixed(1) : "100.0";
      return `**Medical & Requirements — MOH Fee Benchmark Analysis**

**Future State: Automated Proration Calculation Engine**

**Claimed Amount:** SGD ${claim.claim_amount.toLocaleString()}
**MOH Schedule of Fees Benchmark:** SGD ${benchmark.toLocaleString()}
**Excess Above Benchmark:** SGD ${excess.toLocaleString()}
**Proration Applied:** ${prorationPct}%

**Diagnosis:** ${claim.diagnosis_code} — ${claim.diagnosis_description}
**Treatment:** ${claim.treatment_type}
**Hospital:** ${claim.hospital_name}

${excess > 0 ? `⚠ Claim exceeds MOH benchmark by SGD ${excess.toLocaleString()}. Approved amount capped at SGD ${benchmark.toLocaleString()} per MAS Notice 120 guidelines.` : "✓ Claim within MOH benchmark. Full amount eligible for approval."}

**Recommended Action:** Set approved_amount = SGD ${benchmark.toLocaleString()}. Advance to Claim Decisioning.`;
    }

    if (msg.includes("diagnosis") || msg.includes("clinical") || msg.includes("medical necessity")) {
      return `**Medical & Requirements — Clinical Assessment**

**Future State: Clinical Intelligence Agent**

**Diagnosis:** ${claim.diagnosis_code} — ${claim.diagnosis_description}
**Treatment:** ${claim.treatment_type}
**Admission:** ${claim.admission_date} → ${claim.discharge_date ?? "Ongoing"}

✓ ICD-10 code ${claim.diagnosis_code} validated against OperaAI clinical database
✓ Treatment ${claim.treatment_type} is clinically appropriate for diagnosis
✓ Length of stay within expected range for procedure
✓ No pre-existing condition exclusion flags detected

**Recommended Action:** Clinical assessment APPROVED. Proceed to MOH fee benchmark analysis.`;
    }

    return `**Medical & Requirements Review Complete — ${claim.claim_number}**

**Future State: Medical Assessment Agent applied**

✓ ICD-10 diagnosis: ${claim.diagnosis_code} validated
✓ Treatment appropriateness: Confirmed
✓ MOH benchmark: SGD ${(claim.moh_benchmark_amount ?? claim.claim_amount).toLocaleString()}
✓ Hospital: ${claim.hospital_name} — accredited facility

Ask me about: MOH fee benchmark analysis, clinical assessment, or specialist referrals.`;
  }

  // ── Stage 4: Claim Decisioning ────────────────────────────────────────────
  if (queue === "adjudication") {
    if (msg.includes("approve") || msg.includes("decision") || msg.includes("auto") || msg.includes("payout")) {
      const approved = claim.approved_amount ?? claim.moh_benchmark_amount ?? claim.claim_amount;
      const coInsurance = approved * 0.10;
      const payout = approved - coInsurance;
      return `**Claim Decisioning — Auto-Decisioning Engine**

**Future State: Rules-Driven Auto-Decisioning Engine**

**6-Rule Evaluation:**
✓ Rule 1: Policy active and premium paid — PASS
✓ Rule 2: Claim within coverage period — PASS
✓ Rule 3: MOH benchmark compliance — PASS (SGD ${approved.toLocaleString()})
✓ Rule 4: No fraud indicators detected — PASS
✓ Rule 5: Duplicate claim check — PASS (no prior claim for this incident)
✓ Rule 6: Co-insurance calculation — SGD ${coInsurance.toFixed(0)} (10%)

**DECISION: APPROVED**
- Approved Amount: SGD ${approved.toLocaleString()}
- Co-insurance (10%): SGD ${coInsurance.toFixed(0)}
- **Net Payout: SGD ${payout.toFixed(0)}**

**Recommended Action:** Record decision. Advance to QC & Decision Comms.`;
    }

    return `**Claim Decisioning Summary — ${claim.claim_number}**

**Future State: Structured Decision Record applied**

✓ All 6 decisioning rules evaluated
✓ Approved Amount: SGD ${(claim.approved_amount ?? claim.moh_benchmark_amount ?? claim.claim_amount).toLocaleString()}
✓ Decision rationale documented for MAS audit trail

Ask me about: auto-decisioning rules, payout calculation, or structured review.`;
  }

  // ── Stage 5: QC & Decision Comms ─────────────────────────────────────────
  if (queue === "quality_check") {
    if (msg.includes("compliance") || msg.includes("audit") || msg.includes("mas") || msg.includes("sla")) {
      return `**QC & Decision Comms — SLA Management & MAS Compliance**

**Future State: Agentic Compliance Validation Engine**

**MAS Notice 120 SLA Check:**
✓ Submission date: ${claim.submission_date}
✓ Decision date: Today (within 10 business day SLA)
✓ SLA Status: ON TRACK

**MAS Audit Trail:**
✓ Intake validation logged
✓ CPF/MediShield verification logged
✓ MOH benchmark calculation logged
✓ Decisioning rationale logged
✓ All actions attributed to named performers

**PDPA Compliance:**
✓ Claimant data minimised in settlement letter
✓ Consent for SMS notification confirmed

**Recommended Action:** QC PASSED. Advance to Payment & Closure.`;
    }

    if (msg.includes("communication") || msg.includes("letter") || msg.includes("notify") || msg.includes("claimant")) {
      return `**QC & Decision Comms — Automated Claimant Communication**

**Future State: Automated Communication & Notification Agent**

**Settlement Letter Draft:**
> Dear ${claim.claimant_name},
> 
> We are pleased to inform you that your claim ${claim.claim_number} has been APPROVED.
> Approved Amount: SGD ${(claim.approved_amount ?? 0).toLocaleString()}
> Net Payout (after 10% co-insurance): SGD ${(claim.payout_amount ?? 0).toLocaleString()}
> 
> Payment will be processed within 3 business days via FAST transfer.

✓ SMS notification queued to ${claim.claimant_phone}
✓ Email notification queued to ${claim.claimant_email}
✓ Agent notification sent

**Recommended Action:** Approve communication. Advance to Payment & Closure.`;
    }

    return `**QC & Decision Comms Summary — ${claim.claim_number}**

✓ MAS Notice 120 SLA: Compliant
✓ Audit trail: Complete
✓ PDPA: Compliant
✓ Settlement letter: Ready for dispatch

Ask me about: MAS compliance check, SLA status, or claimant communication.`;
  }

  // ── Stage 6: Payment & Closure ────────────────────────────────────────────
  if (queue === "payment_closure") {
    if (msg.includes("payment") || msg.includes("payout") || msg.includes("transfer") || msg.includes("disburs")) {
      return `**Payment & Closure — Rules-Driven Payment Processing**

**Future State: Automated Payment Disbursement Agent**

**Payment Breakdown:**
- Net Payout: SGD ${(claim.payout_amount ?? 0).toLocaleString()}
- Medisave Routing: SGD ${Math.min(claim.medisave_balance * 0.3, (claim.payout_amount ?? 0) * 0.4).toFixed(0)} → CPF Medisave account
- Cash FAST Transfer: SGD ${((claim.payout_amount ?? 0) - Math.min(claim.medisave_balance * 0.3, (claim.payout_amount ?? 0) * 0.4)).toFixed(0)} → Claimant bank account

✓ FAST transfer initiated (T+1 business day)
✓ CPF Medisave routing confirmed
✓ Payment reconciliation record created
✓ MAS reporting entry generated

**Recommended Action:** Confirm payment dispatch. Close claim.`;
    }

    if (msg.includes("closure") || msg.includes("close") || msg.includes("recon")) {
      return `**Payment & Closure — Claim Closure & Ongoing Management**

**Future State: Automated Closure & Reconciliation Agent**

**Closure Checklist:**
✓ Payment disbursed: SGD ${(claim.payout_amount ?? 0).toLocaleString()}
✓ Claimant confirmation received
✓ MAS regulatory reporting entry submitted
✓ Audit trail finalised and archived
✓ Claim status updated to CLOSED

**Post-Closure:**
- Claim archived for 7 years (MAS requirement)
- PDPA data retention schedule set
- Analytics data point recorded for actuarial review

**CLAIM ${claim.claim_number}: SETTLED & CLOSED**`;
    }

    return `**Payment & Closure Summary — ${claim.claim_number}**

✓ Payout: SGD ${(claim.payout_amount ?? 0).toLocaleString()}
✓ FAST transfer: Initiated
✓ Medisave routing: Confirmed
✓ MAS reporting: Submitted

Ask me about: payment processing, FAST transfer routing, or claim closure.`;
  }

  // ── Global Fallback ───────────────────────────────────────────────────────
  return `**OperaAI Claims Copilot — ${claim.claim_number}**

I can assist with this claim across all workflow stages:

**Claim Lodgement:** Minimum requirements, Singpass verification, document checklist, priority triage
**Claim Assessment:** CPF Medisave validation, MediShield Life eligibility, policy coverage strategy
**Medical & Requirements:** MOH fee benchmark analysis, clinical assessment, specialist referrals
**Claim Decisioning:** Auto-decisioning rules, payout calculation, structured decision record
**QC & Decision Comms:** MAS Notice 120 SLA, PDPA compliance, automated claimant communication
**Payment & Closure:** FAST transfer routing, Medisave disbursement, claim closure & archiving

Please ask a specific question about this claim.`;
}
