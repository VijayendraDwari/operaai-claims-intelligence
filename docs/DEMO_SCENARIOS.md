# OperaAI Claims Intelligence — Demo Scenarios

This guide provides focused demo paths for different audiences. Use it with `LIVE_DEMO_SCRIPT.md` for full presentations or as a quick reference during stakeholder walkthroughs.

---

## Scenario 1 — Executive Overview

**Audience:** Business leaders, insurance executives, consulting stakeholders, recruiters  
**Duration:** 6–8 minutes  
**Goal:** Show why agentic workflow design matters for regulated operations.

### Flow

1. Start on the dashboard.
2. Explain the six-stage claims lifecycle.
3. Open a claim in **Claim Lodgement**.
4. Ask the AI Copilot: `check eligibility requirements`.
5. Advance the claim and show the audit trail entry.
6. Jump to **Medical & Requirements** and show MOH benchmark analysis.
7. Jump to **Claim Decisioning** and show payout calculation.
8. Close with the reset demo button.

### Key message

OperaAI is not a chatbot. It is a workflow-native agentic system where AI assists, humans approve, rules govern, and every action is auditable.

---

## Scenario 2 — P1 Critical Illness Full Lifecycle

**Audience:** Insurance operations leaders, claims transformation teams, solution architects  
**Duration:** 12–18 minutes  
**Goal:** Demonstrate the full claims journey from lodgement to closure.

### Flow

1. Open the P1 Critical Illness claim.
2. Run eligibility and document checks in **Claim Lodgement**.
3. Advance to **Claim Assessment**.
4. Validate CPF Medisave and MediShield Life context.
5. Advance to **Medical & Requirements**.
6. Run MOH fee benchmark analysis.
7. Advance to **Claim Decisioning**.
8. Run auto-decisioning and payout calculation.
9. Advance to **QC & Decision Communications**.
10. Run MAS Notice 120 SLA compliance check.
11. Draft settlement communication.
12. Advance to **Payment & Closure**.
13. Process payment and close the claim.
14. Review the audit trail.

### Suggested Copilot prompts

```text
check eligibility requirements
what documents are missing
validate CPF medisave and medishield
run MOH fee benchmark analysis
run auto-decisioning and calculate payout
run MAS Notice 120 SLA compliance check
draft the settlement letter and notification
process payment and close claim
```

### Key message

The system demonstrates end-to-end claim orchestration with contextual AI assistance, deterministic calculation, and human-controlled transitions.

---

## Scenario 3 — Compliance and Auditability

**Audience:** Risk, compliance, audit, legal, governance stakeholders  
**Duration:** 5–7 minutes  
**Goal:** Show how the architecture supports governance and traceability.

### Flow

1. Open any claim detail page.
2. Ask the AI Copilot for a stage-specific compliance check.
3. Advance the claim to the next stage.
4. Scroll to the audit trail.
5. Show actor, action, timestamp, and transition history.
6. Explain why deterministic logic is used for regulated calculations.

### Suggested Copilot prompts

```text
run MAS Notice 120 SLA compliance check
explain the decision rationale
check PDPA compliance for communication
show audit trail requirements
```

### Key message

AI recommendations are not enough in regulated environments. The system must capture who did what, why, when, and under which rule boundary.

---

## Scenario 4 — Technical Architecture Walkthrough

**Audience:** Engineering leaders, architects, developers, platform teams  
**Duration:** 10–15 minutes  
**Goal:** Explain how the demo maps to a production-ready architecture.

### Flow

1. Show the README architecture diagram.
2. Open the application dashboard.
3. Explain frontend, API, workflow engine, rules layer, Copilot, audit trail, and database.
4. Show a claim transition.
5. Show how audit state changes after the transition.
6. Explain the production upgrade path.

### Key technical points

- React and Tailwind provide the operator workspace.
- Express and tRPC provide typed backend APIs.
- The workflow engine controls stage movement.
- Deterministic rules handle regulated decisions.
- The AI Copilot is stage-aware and context-aware.
- SQLite via `sql.js` is used for resettable demo state.
- PostgreSQL, RBAC, API integrations, and model gateways are natural production extensions.

### Key message

The demo is lightweight by design, but the architecture pattern is production-relevant.

---

## Scenario 5 — Recruiter / Portfolio Review

**Audience:** Recruiters, hiring managers, AI product leaders, consulting partners  
**Duration:** 3–5 minutes  
**Goal:** Position the project as evidence of enterprise AI and agentic platform architecture capability.

### Flow

1. Show the GitHub README.
2. Explain the problem framing: regulated claims are state machines, not Q&A tasks.
3. Show the architecture overview section.
4. Show the live app dashboard.
5. Open one claim and ask the Copilot an eligibility or decisioning prompt.
6. Show the audit trail.

### Key message

This project demonstrates the ability to translate enterprise AI concepts into a working, governed, workflow-native product architecture.

---

## Scenario 6 — Resettable Demo and Developer Experience

**Audience:** Internal engineering teams, demo teams, solution consultants  
**Duration:** 3–4 minutes  
**Goal:** Show why seeded in-memory state is useful for development and stakeholder demos.

### Flow

1. Move one claim to the next stage.
2. Show updated queue counts.
3. Click **Reset Demo**.
4. Show that all seven claims return to their original seeded state.

### Key message

A good demo system must be reliable, repeatable, and quick to restore. The in-memory SQLite setup enables this.

---

## Recommended Screenshot Checklist

Capture the following assets for the README and portfolio posts:

| Asset | Recommended filename | Purpose |
|---|---|---|
| Dashboard | `docs/assets/dashboard.png` | Shows the full workflow map |
| Claim detail | `docs/assets/claim-detail.png` | Shows operator workspace + Copilot |
| MOH benchmark | `docs/assets/moh-benchmark.png` | Shows deterministic fee calculation |
| Audit trail | `docs/assets/audit-trail.png` | Shows compliance traceability |
| Full walkthrough GIF | `docs/assets/demo-walkthrough.gif` | Makes the repository visually compelling |

---

## One-Line Pitch Options

Use one of these depending on the audience:

- **Executive:** OperaAI Claims Intelligence shows how regulated insurance workflows can combine AI speed with human accountability and audit-ready governance.
- **Technical:** A TypeScript reference implementation for workflow-native agentic AI using queue routing, deterministic rules, contextual Copilot assistance, and immutable audit trails.
- **Recruiter:** A working portfolio project demonstrating enterprise agentic platform architecture for regulated claims operations.
- **Compliance:** A human-governed AI workflow pattern where decisions remain traceable, reviewable, and bounded by deterministic controls.
