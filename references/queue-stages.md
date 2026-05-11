# SME Future State Queue Definitions

## Table of Contents
1. [Queue overview](#queue-overview)
2. [Stage 1: Claim Lodgement](#stage-1-claim-lodgement)
3. [Stage 2: Claim Assessment](#stage-2-claim-assessment)
4. [Stage 3: Medical & Requirements](#stage-3-medical--requirements)
5. [Stage 4: Claim Decisioning](#stage-4-claim-decisioning)
6. [Stage 5: QC & Decision Comms](#stage-5-qc--decision-comms)
7. [Stage 6: Payment & Closure](#stage-6-payment--closure)
8. [Queue labels and descriptions in code](#queue-labels-and-descriptions-in-code)

---

## Queue overview

| Internal key | Display label | SME Future State row |
|---|---|---|
| `intake_triage` | Claim Lodgement | Row 1 |
| `idv_eligibility` | Claim Assessment | Row 2 |
| `medical_assessment` | Medical & Requirements | Row 3 |
| `adjudication` | Claim Decisioning | Row 4 |
| `quality_check` | QC & Decision Comms | Row 5 |
| `payment_closure` | Payment & Closure | Row 6 |

---

## Stage 1: Claim Lodgement

**Internal key:** `intake_triage`

**Sub-steps (sidebar label):** Claim Lodgement → Minimum Requirements → Case Set-up & Allocation

**Future State capabilities:**
- Omni-channel intake (portal, email, agent, walk-in)
- Automated minimum requirements validation against digitalized checklist
- Intelligent Intake Agent for document indexing and extraction
- Automatic case set-up and queue allocation upon minimum requirements met
- Singpass digital identity verification trigger

**Demo claim at this stage:** CLM-2026-001 (Tan Wei Ming — appendectomy), CLM-2026-002 (Priya Ramasamy — critical illness)

**Key Singapore regulatory context:** MAS Notice 120 SLA timer starts at lodgement; Singpass verification is a mandatory pre-condition for case allocation.

---

## Stage 2: Claim Assessment

**Internal key:** `idv_eligibility`

**Sub-steps (sidebar label):** Workspace (Concurrent Processing) → Initial Assessment (Digitalized Templates) → Strategy Management → Requirements Management → Referral Management

**Future State capabilities:**
- Concurrent processing workspace — all sub-tasks run in parallel (no sequential bottlenecks)
- Digitalized assessment templates auto-populated from Singpass MyInfo
- CPF Board API integration for real-time Medisave balance and account status
- MediShield Life coverage validation via MOH API
- Structured requirements tracking — outstanding items auto-notified to claimant
- Referral Management module — specialist referral tasks auto-created

**Demo claim at this stage:** CLM-2026-003 (Muhammad Hafiz — disability income)

**Key Singapore regulatory context:** CPF Medisave withdrawal authorisation, MediShield Life annual benefit limit check, PDPA consent for data sharing with CPF Board and MOH.

---

## Stage 3: Medical & Requirements

**Internal key:** `medical_assessment`

**Sub-steps (sidebar label):** Clinical review, MOH fee benchmark validation, specialist referral, structured requirements tracking

**Future State capabilities:**
- Automated MOH Schedule of Fees benchmark comparison (eliminates manual spreadsheet)
- ICD-10 diagnosis code validation and clinical appropriateness check
- Specialist referral task management with SLA tracking
- Structured clinical assessment template (digitalized, auto-populated)
- Pre-authorisation confirmation tracking

**Demo claim at this stage:** CLM-2026-004 (Chen Li Hua — CABG heart surgery, high-value SGD 87,500)

**Key Singapore regulatory context:** MOH fee benchmarks apply to all MediShield Life claims; proration required when hospital charges exceed benchmark; B2 ward equivalent used as reference class.

---

## Stage 4: Claim Decisioning

**Internal key:** `adjudication`

**Sub-steps (sidebar label):** Auto-Decisioning (Configurable workflow rules) → Review & Decision (Rules-driven, structured) → Assessment & Decision Communications

**Future State capabilities:**
- Auto-Decisioning engine with configurable workflow rules
- Rules-driven payout calculation (deductible + co-insurance + MOH proration)
- Structured decision record for MAS audit trail
- Assessment & Decision Communication letter auto-generated
- Fraud indicator check (automated)
- PDPA compliance verification at decision point

**Demo claim at this stage:** CLM-2026-005 (Lim Siew Bee — cataract day surgery, approved SGD 7,400)

**Key Singapore regulatory context:** MAS Notice 120 requires documented decision rationale; PDPA requires data minimisation in decision communications; co-insurance is 10% of approved amount above deductible.

---

## Stage 5: QC & Decision Comms

**Internal key:** `quality_check`

**Sub-steps (sidebar label):** SLA Management (Automated SLA tracking, Audit trail) → MAS compliance review → Automated claimant comms

**Future State capabilities:**
- Automated SLA tracking with real-time dashboard
- Automated escalation if SLA at risk
- Full MAS audit trail — every queue transition logged with timestamp, performer, rationale
- PDPA compliance review — consent, data minimisation, retention
- Automated settlement letter generation (personalised)
- SMS notification to claimant
- Agent portal notification
- MAS regulatory reporting module update

**Demo claim at this stage:** CLM-2026-006 (Rajesh Kumar — radius fracture, approved SGD 3,200, payout SGD 2,880)

**Key Singapore regulatory context:** MAS Notice 120 specifies maximum processing timelines; PDPA requires explicit consent for each data sharing event; settlement letter must include breakdown of deductible, co-insurance, and Medisave withdrawal.

---

## Stage 6: Payment & Closure

**Internal key:** `payment_closure`

**Sub-steps (sidebar label):** Interim Payment Process → Payment Calculation (Rules-driven calc engine) → Payment Authorization → Payment Processing (Auto disbursement/Recon) → Expense Management → Claim Closure

**Future State capabilities:**
- Rules-driven payment calculation engine (no manual spreadsheet)
- Delegated authority rules for auto-authorisation below threshold
- FAST transfer to claimant's registered bank account
- Medisave withdrawal routed directly to hospital
- Automated reconciliation — payment matched to claim record
- Expense management — hospital invoice auto-captured
- Standardised claim closure with automated comms to all stakeholders
- MediShield Life reconciliation submitted to MOH
- Reinsurance & Recoveries referral trigger (if applicable)
- Claim outcome data fed to analytics dashboard

**Demo claim at this stage:** CLM-2026-007 (Wong Mei Lin — emergency C-section, payout SGD 18,450)

**Key Singapore regulatory context:** CPF Board Medisave withdrawal must be confirmed before cash payout; FAST transfer SLA is 1–2 business days; MAS requires claim closure notification to claimant within prescribed timeline.

---

## Queue labels and descriptions in code

```typescript
const QUEUE_LABELS: Record<QueueStage, string> = {
  intake_triage:      "Claim Lodgement",
  idv_eligibility:    "Claim Assessment",
  medical_assessment: "Medical & Requirements",
  adjudication:       "Claim Decisioning",
  quality_check:      "QC & Decision Comms",
  payment_closure:    "Payment & Closure",
};

const QUEUE_DESCRIPTIONS: Record<QueueStage, string> = {
  intake_triage:      "Claim Lodgement → Minimum Requirements → Case Set-up & Allocation",
  idv_eligibility:    "Workspace (Concurrent Processing) → Initial Assessment (Digitalized Templates) → Strategy Management → Requirements Management → Referral Management",
  medical_assessment: "Clinical review, MOH fee benchmark validation, specialist referral, structured requirements tracking",
  adjudication:       "Auto-Decisioning (Configurable workflow rules) → Review & Decision (Rules-driven, structured) → Assessment & Decision Communications",
  quality_check:      "SLA Management (Automated SLA tracking, Audit trail) → MAS compliance review → Automated claimant comms",
  payment_closure:    "Interim Payment Process → Payment Calculation (Rules-driven calc engine) → Payment Authorization → Payment Processing (Auto disbursement/Recon) → Expense Management → Claim Closure",
};
```
