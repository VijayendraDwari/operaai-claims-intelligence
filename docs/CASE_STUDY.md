# Case Study: Architecting Agentic Workflows for Regulated Insurance

**Project**: OperaAI Claims Intelligence  
**Architect**: Vijayendra Dwari  
**Domain**: Health Insurance (Singapore)  

---

## 1. The Challenge: The "Pilot Trap" in Enterprise AI

In 2024 and 2025, the insurance industry saw a massive influx of AI pilots. Most of these pilots involved wrapping a Large Language Model (LLM) around a document repository to create a "claims assistant." 

Almost all of them failed to reach production.

The reason was not a lack of AI capability, but a fundamental mismatch between the architecture of a chatbot and the reality of insurance operations. In Singapore, health insurance claims are governed by strict regulatory frameworks:
- **MAS Notice 120** dictates strict Service Level Agreements (SLAs) and requires an immutable audit trail for every decision.
- **Ministry of Health (MOH)** publishes fee benchmarks; claims exceeding these benchmarks require complex proration calculations.
- **CPF Board** manages Medisave withdrawals, requiring specific authorization flows.
- **PDPA** mandates strict data minimisation in claimant communications.

A generic LLM cannot be trusted to autonomously navigate this web of regulations. When insurers realized this, the pilots were shelved.

**The objective of the OperaAI project was to design an architecture that could safely deploy AI into this highly regulated environment.**

---

## 2. The Architectural Solution: Agentic Workflows

The solution was to shift from an "AI-centric" architecture to a "Workflow-centric" architecture augmented by AI. I designed a system based on three core pillars:

### Pillar 1: Multi-Persona State Machines
Instead of treating a claim as a single task, the system models the claim lifecycle as a strict state machine with six distinct queues:
1. Claim Lodgement
2. Claim Assessment
3. Medical & Requirements
4. Claim Decisioning
5. QC & Decision Comms
6. Payment & Closure

The AI does not control the state machine. The state machine controls the AI. The system knows exactly which stage a claim is in, which human persona has the authority to advance it, and what regulatory checks must be passed before transition.

### Pillar 2: The Human-in-the-Loop (HITL) Copilot Pattern
To solve the trust and compliance problem, I implemented the AI Copilot pattern. The AI acts as an expert advisor to the human operator. 

For example, in the **Medical & Requirements** stage, the human operator asks the Copilot to run a benchmark analysis. The AI:
1. Extracts the ICD-10 code and hospital charges from the claim documents.
2. Queries the MOH Schedule of Fees database.
3. Calculates the required proration.
4. Presents the calculation to the human operator.

The human operator reviews the calculation and clicks "Approve." The human retains accountability, satisfying MAS requirements, while the AI eliminates the manual spreadsheet work.

### Pillar 3: Deterministic Boundaries
LLMs are probabilistic; regulations are deterministic. The OperaAI architecture strictly separates the two. 
- **Probabilistic tasks** (extracting data from medical reports, drafting settlement letters) are handled by the AI.
- **Deterministic tasks** (calculating 10% co-insurance, verifying Medisave balances, logging audit trails) are handled by traditional code.

---

## 3. Implementation Details

To demonstrate this architecture to stakeholders, I built a fully functional reference implementation.

### The Data Model
I designed a schema that captures not just the claim data, but the regulatory metadata required in Singapore:
- `singpass_verified` (Boolean)
- `medisave_balance` (Numeric)
- `moh_benchmark_amount` (Numeric)
- `mas_audit_trail` (Relational table tracking every state change, performer, and timestamp)

### The UI/UX Design
Enterprise users suffer from "dashboard fatigue." I implemented the **Toscana Dark Navy** design pattern. This high-contrast, dark-mode interface reduces eye strain for operators processing claims for 8 hours a day. The collapsible sidebar allows operators to focus entirely on the complex data density of a medical claim without distraction.

### The "Reset Demo" Innovation
A major challenge in enterprise software sales and stakeholder alignment is demo data degradation. As presenters click through a demo, the data gets messy. I engineered the system using an in-memory SQLite database (`sql.js`) with a dedicated `resetDemo` mutation. With one click, the database drops all tables, rebuilds the schema, and re-inserts the 7 perfectly crafted seed claims. This guarantees a flawless presentation every time.

---

## 4. Business Impact & Strategic Value

The OperaAI architecture demonstrates how to move past the "pilot trap." By constraining the AI within a strict, regulation-aware state machine, enterprises can achieve the productivity gains of LLMs without violating compliance requirements.

**Key Outcomes Demonstrated:**
- **Zero-Touch Intake**: Automating the validation of Singpass and minimum requirements before human allocation.
- **Automated Proration**: Eliminating manual MOH benchmark spreadsheet lookups.
- **Audit-Ready by Default**: Generating MAS-compliant audit trails automatically as a byproduct of the workflow.

This architecture is not limited to insurance. The same pattern—Multi-Persona State Machines + HITL Copilot + Deterministic Boundaries—is the blueprint for deploying AI in banking, healthcare, and legal operations.

---
*For technical implementation details, see the repository README or contact Vijayendra Dwari.*
