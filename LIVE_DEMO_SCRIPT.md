# OperaAI Claims Intelligence — Live Demo Script

**Version:** 1.0  
**Author:** Vijayendra Dwari  
**Repository:** [github.com/VijayendraDwari/operaai-claims-intelligence](https://github.com/VijayendraDwari/operaai-claims-intelligence)  
**Estimated Demo Duration:** 12–18 minutes (full walkthrough) | 6–8 minutes (executive summary)  
**Audience:** Engineering leaders, insurance executives, consulting clients, recruiters, conference audiences

---

## Setup Checklist

Complete these steps before the demo starts.

```bash
git clone https://github.com/VijayendraDwari/operaai-claims-intelligence.git
cd operaai-claims-intelligence
pnpm install
pnpm dev
```

Open `http://localhost:5173` in your browser. Confirm the Dashboard loads with 4 stat cards and 6 queue cards. If any queue shows 0 claims, click **Reset Demo** in the sidebar.

**Browser settings:** Use a clean profile or incognito window. Set zoom to 90% for better screen real estate. If presenting on a projector, increase font size in browser to 110%.

---

## The Demo Narrative — The One-Sentence Pitch

> "Most enterprise AI projects fail not because the AI is wrong, but because the workflow around it is broken. OperaAI is a reference architecture that shows how to build AI that actually works inside a regulated, human-accountable process."

This is the thread you return to throughout the demo. Every feature you show is evidence for this claim.

---

## Act 1 — Opening (2 minutes)

### Scene 1.1 — The Problem Statement

**What to say:**

"Let me start with a question. How many of you have seen an AI pilot that worked beautifully in a sandbox, but never made it to production? [Pause for reaction.] This is what I call the Pilot Trap — and it is the defining failure mode of enterprise AI today.

The reason is almost never the model. The reason is that the AI was designed as a standalone tool, not as a participant in a workflow. It had no concept of who was responsible for a decision, no audit trail, no regulatory boundary, and no graceful handoff to a human when confidence was low.

OperaAI Claims Intelligence is a reference implementation that solves this problem. It is built on three principles: every AI action has a human checkpoint, every decision has a traceable audit trail, and the system knows its own regulatory boundaries."

**What to show:** The Dashboard page. Do not click anything yet. Let the audience absorb the layout.

**Key talking points:**
- The dark sidebar is the **workflow map** — six stages, left to right, representing the full lifecycle of a Singapore health insurance claim
- The stat cards show the live state of the system — 7 claims distributed across all stages
- This is not a mockup. The database is live and in-memory. Every interaction you see is real

---

### Scene 1.2 — The Architecture in 30 Seconds

**What to say:**

"Before we walk through a claim, let me orient you to the architecture in thirty seconds. The system has six workflow stages — Claim Lodgement, Claim Assessment, Medical and Requirements, Claim Decisioning, QC and Decision Communications, and Payment and Closure. Each stage is a queue. Claims move through queues one at a time, and a human must explicitly advance each claim. The AI Copilot assists at every stage but never acts autonomously. This is Human-in-the-Loop design, not AI-takes-the-wheel design."

**What to show:** Point to the sidebar queue list. Read the stage names aloud slowly.

---

## Act 2 — The P1 Critical Claim (8 minutes)

This is the heart of the demo. You will follow **Priya Ramasamy's claim** — a P1 Critical Illness claim — through the entire workflow. This claim was chosen because it touches every interesting feature: Singpass verification, MOH benchmark proration, auto-decisioning, and MAS compliance.

---

### Scene 2.1 — Claim Lodgement Queue

**Click:** Sidebar → **Claim Lodgement**

**What to say:**

"We are now in the Claim Lodgement queue — the first stage. You can see two claims here. Notice the priority badges. The red P1 badge on Priya Ramasamy's claim means this is a Critical Illness case — it has a shorter SLA and requires a senior adjudicator. The amber P2 badge on Tan Wei Ming's claim is a standard hospitalisation case."

**Click:** Priya Ramasamy's claim card (CLM-2026-002)

**What to say:**

"Let's open the P1 claim. This is the claim detail view. On the left, we have all the structured data — claimant identity, policy coverage, medical information, and financials. On the right is the AI Copilot. Notice the workflow progress bar at the top — it shows exactly where this claim sits in the six-stage pipeline."

---

### Scene 2.2 — AI Copilot: Eligibility Check

**Click:** AI Copilot input field on the right panel

**Type exactly:** `check eligibility requirements`

**Wait for response (~1 second)**

**What to say:**

"Watch what the Copilot does. It does not give a generic answer. It reads the actual claim data — Priya's policy number, her Singpass verification status, her incident date — and produces a structured eligibility assessment. Notice it flags that Singpass verification is pending. In a real system, this would trigger an automated SMS to the claimant. The Copilot is not a chatbot. It is a context-aware decision support tool."

**Key insight to highlight:** The Copilot knows the claim's current state. It is not answering in the abstract — it is answering about *this specific claim, right now*.

---

### Scene 2.3 — AI Copilot: Document Checklist

**Type exactly:** `what documents are missing`

**Wait for response**

**What to say:**

"Now I ask about missing documents. The Copilot produces a checklist specific to this claim type — Critical Illness — and flags exactly what is outstanding. It calculates a document completeness percentage. In the future state architecture, this triggers an automated document request to the claimant with a 7-day follow-up reminder. No human needs to manually track this."

---

### Scene 2.4 — Advancing the Claim

**Click:** The blue **"Advance to Claim Assessment"** button (top right of the claim detail)

**What to say:**

"This is the Human-in-the-Loop moment. The AI has done its analysis. The human — in this case, the claims officer — reviews the Copilot's output and makes the decision to advance. One click. The claim moves to the next stage, the audit trail is updated, and the queue counts in the sidebar update in real time."

**Point to:** The sidebar badge count on Claim Lodgement decreasing by 1, and Claim Assessment increasing by 1.

**What to say:**

"Notice that the audit trail at the bottom of the page has a new entry — 'STAGE_ADVANCE — Claims Officer — Claim advanced from Claim Lodgement → Claim Assessment.' Every action is logged, attributed to a named performer, and timestamped. This is your MAS Notice 120 audit trail, built in from day one."

---

### Scene 2.5 — Claim Assessment: CPF & MediShield Validation

**Click:** Sidebar → **Claim Assessment**

**Click:** Priya Ramasamy's claim (now in this queue)

**Type in Copilot:** `validate CPF medisave and medishield`

**Wait for response**

**What to say:**

"In the Claim Assessment stage, the Copilot validates CPF Medisave balance and MediShield Life eligibility. In the future state architecture, this is a real-time API call to the CPF Board. In this demo, it reads from the seed data. The key insight is that the *logic* is identical — the agent knows what to check, in what order, and what the pass/fail criteria are. Swapping the mock data for a live API call is a configuration change, not an architectural change."

**Advance the claim** to Medical & Requirements.

---

### Scene 2.6 — Medical & Requirements: MOH Benchmark

**Click:** Sidebar → **Medical & Requirements**

**Click:** Priya Ramasamy's claim

**Type in Copilot:** `run MOH fee benchmark analysis`

**Wait for response**

**What to say:**

"This is where it gets interesting for anyone in the insurance or healthcare space. The MOH — Ministry of Health — publishes a Schedule of Fees that acts as the benchmark for what insurers will pay. If a hospital charges above benchmark, the insurer prorates the payout. The Copilot calculates this automatically — claimed amount, benchmark amount, excess, proration percentage, and the approved amount. This is the calculation that takes a junior claims officer 20 minutes to do manually. The agent does it in under a second."

**Pause here.** Let the audience absorb the numbers on screen.

**What to say:**

"And critically — the Copilot does not approve anything. It presents the calculation. The human adjudicator reviews it and decides to advance. That is the design principle: AI for speed and accuracy, human for accountability."

**Advance the claim** to Claim Decisioning.

---

### Scene 2.7 — Claim Decisioning: Auto-Decisioning Engine

**Click:** Sidebar → **Claim Decisioning**

**Click:** Priya Ramasamy's claim

**Type in Copilot:** `run auto-decisioning and calculate payout`

**Wait for response**

**What to say:**

"The Claim Decisioning stage is where the six-rule auto-decisioning engine runs. Watch the output — it evaluates each rule in sequence: policy active, claim within coverage period, MOH benchmark compliance, no fraud indicators, no duplicate claim, co-insurance calculation. Every rule passes. The decision is APPROVED. Net payout is calculated after the 10% co-insurance deduction.

This is deterministic logic, not probabilistic AI. The rules are auditable, explainable, and defensible to a regulator. The AI Copilot wraps the rules engine with a natural language interface, but the underlying logic is rules-based. This is the right architecture for regulated industries — use AI where it adds speed and insight, use rules where you need accountability."

**Advance the claim** to QC & Decision Communications.

---

### Scene 2.8 — QC & Decision Comms: MAS Compliance

**Click:** Sidebar → **QC & Decision Comms**

**Click:** Priya Ramasamy's claim

**Type in Copilot:** `run MAS Notice 120 SLA compliance check`

**Wait for response**

**What to say:**

"Before we pay anything, we run a compliance check. MAS Notice 120 requires insurers to make a decision within 10 business days of receiving a complete claim. The Copilot checks the submission date, calculates the elapsed business days, and confirms SLA status. It also checks PDPA compliance — that the settlement letter contains only the minimum necessary personal data.

This is the kind of check that typically requires a compliance officer to manually review a spreadsheet. Here it is automated, logged, and auditable."

**Type in Copilot:** `draft the settlement letter and notification`

**What to say:**

"And here is the settlement letter — pre-drafted, personalised with Priya's name and claim number, with the exact payout amount. Ready for one-click dispatch via SMS and email. The Copilot has done the drafting; the human approves and sends."

**Advance the claim** to Payment & Closure.

---

### Scene 2.9 — Payment & Closure: Final Stage

**Click:** Sidebar → **Payment & Closure**

**Click:** Priya Ramasamy's claim

**Type in Copilot:** `process payment and close claim`

**Wait for response**

**What to say:**

"The final stage. The Copilot calculates the payment routing — how much goes to the CPF Medisave account, how much goes via FAST bank transfer. It initiates the transfer, creates the reconciliation record, and submits the MAS regulatory reporting entry. The claim is closed.

From Claim Lodgement to Payment and Closure, Priya's claim has moved through six stages, been validated against CPF, MOH, MAS, and PDPA requirements, had a payout calculated and approved, and been paid — all with a complete, immutable audit trail."

---

## Act 3 — The Reset Demo Feature (1 minute)

**Click:** **Reset Demo** button at the bottom of the sidebar

**What to say:**

"One of the most important features for a demo system — and for a development team — is the ability to reset to a known state instantly. One click. All 7 seed claims are restored to their original queue positions. The database is wiped and re-seeded in memory. No migration scripts, no database restore, no waiting. This is the in-memory sql.js architecture in action.

For a development team, this means every developer gets a clean, reproducible environment. For a demo, it means you can run this presentation back-to-back without any setup time between sessions."

**Verify:** Dashboard shows all 6 queues with claims again.

---

## Act 4 — The Architecture Significance (2 minutes)

### Scene 4.1 — What This Demonstrates

**What to say:**

"Let me step back and explain why this architecture matters beyond insurance.

The three patterns demonstrated here are universal to any regulated industry — banking, healthcare, legal, government. First: **queue-based workflow routing** — work items move through defined stages with explicit human checkpoints, creating accountability at every step. Second: **context-aware AI assistance** — the AI Copilot reads the live state of each work item and provides stage-specific guidance, not generic answers. Third: **deterministic compliance boundaries** — rules-based logic handles regulatory requirements, while probabilistic AI handles speed and insight. The two are never confused.

This is not a research prototype. It is a production-grade reference implementation. The stack is TypeScript, React, tRPC, and sql.js — technologies that any engineering team can pick up and extend."

---

### Scene 4.2 — The Upgrade Path (for technical audiences)

**What to say:**

"For engineering teams evaluating this architecture, the upgrade path is straightforward. Replace sql.js with PostgreSQL for persistence — the schema is already defined. Replace the mock AI Copilot responses with calls to OpenAI, Anthropic, or a self-hosted Ollama instance — the interface is already abstracted. Add authentication via OAuth2 — the scaffold is already in place. Connect to real CPF and MAS APIs — the agent logic already knows what to call and in what order.

The architecture is the IP. The mock implementations are placeholders."

---

## Act 5 — Closing (1 minute)

**What to say:**

"What you have seen today is a complete, working, open-source implementation of an agentic workflow system for regulated insurance operations. It is available right now at github.com/VijayendraDwari/operaai-claims-intelligence. Clone it, run it, extend it.

The broader OperaAI framework — which includes a commercial group enrollment system, a sanctions compliance RAG agent, and a multi-agent medical QA system — represents a coherent body of work on the question of how to build AI that actually works in the real world.

I am Vijayendra Dwari. I build agentic systems for regulated industries. If you are working on a problem in this space — insurance, healthcare, financial services, compliance — I would like to talk."

---

## Quick Reference — AI Copilot Prompts by Stage

This table is your cheat sheet during the live demo. Any of these prompts will produce a rich, structured response.

| Stage | Prompt | What It Demonstrates |
|---|---|---|
| **Claim Lodgement** | `check eligibility requirements` | Singpass verification, minimum requirements |
| **Claim Lodgement** | `what documents are missing` | Document completeness tracking |
| **Claim Lodgement** | `assess priority and allocate` | P1/P2/P3 triage logic |
| **Claim Assessment** | `validate CPF medisave and medishield` | Real-time CPF integration pattern |
| **Claim Assessment** | `check policy coverage strategy` | Coverage analysis and deductible logic |
| **Medical & Requirements** | `run MOH fee benchmark analysis` | Proration calculation, approved amount |
| **Medical & Requirements** | `assess clinical necessity` | ICD-10 validation, treatment appropriateness |
| **Claim Decisioning** | `run auto-decisioning and calculate payout` | 6-rule engine, net payout calculation |
| **QC & Decision Comms** | `run MAS Notice 120 SLA compliance check` | Regulatory SLA, PDPA compliance |
| **QC & Decision Comms** | `draft the settlement letter and notification` | Automated claimant communication |
| **Payment & Closure** | `process payment and close claim` | FAST transfer routing, Medisave disbursement |
| **Payment & Closure** | `run closure and reconciliation` | MAS reporting, 7-year archiving |

---

## Handling Audience Questions

**"Is the AI making the decisions?"**

> "No. The AI Copilot provides analysis and recommendations. Every stage advancement is a deliberate human action. The system is designed so that a regulator can always point to a named human who made each decision."

**"What happens when the AI is wrong?"**

> "The human reviewer catches it before the claim advances. The audit trail records both the AI recommendation and the human decision. If they diverge, that divergence is visible and reviewable."

**"Can this connect to real CPF and MAS APIs?"**

> "Yes. The agent logic already knows what to call and in what order. The mock responses are placeholders that can be replaced with live API calls without changing the workflow architecture."

**"How long would it take to deploy this in production?"**

> "The reference implementation is production-ready in terms of architecture. A team of three engineers could have a production deployment in 8–12 weeks, including integration with real data sources, authentication, and regulatory testing."

**"Is this open source? Can we use it?"**

> "Yes. It is MIT licensed. You can clone it, extend it, and build on it. I am also available for consulting engagements if you need help adapting it to your specific context."

---

## Executive Summary Version (6–8 minutes)

For time-constrained presentations, run this condensed path:

1. **Dashboard** — 60 seconds — explain the 6-stage workflow and the Human-in-the-Loop principle
2. **Claim Lodgement → Priya's claim** — 60 seconds — show the claim detail view and explain the data structure
3. **AI Copilot: eligibility check** — 60 seconds — type `check eligibility requirements`, explain context-awareness
4. **Advance to Claim Assessment** — 30 seconds — show the audit trail entry, explain accountability
5. **Medical & Requirements: MOH benchmark** — 90 seconds — type `run MOH fee benchmark analysis`, explain proration
6. **Claim Decisioning: auto-decisioning** — 60 seconds — type `run auto-decisioning and calculate payout`, explain rules vs AI
7. **Reset Demo** — 30 seconds — demonstrate instant reset, explain in-memory architecture
8. **Closing pitch** — 60 seconds — architecture significance, GitHub link, call to action

---

*This demo script is part of the OperaAI Claims Intelligence open-source release.*  
*Repository: [github.com/VijayendraDwari/operaai-claims-intelligence](https://github.com/VijayendraDwari/operaai-claims-intelligence)*
