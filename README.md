OperaAI Claims Intelligence
Agentic Workflow Demo for Regulated Insurance Operations

    By Vijayendra Dwari

    This repository contains the reference implementation of an agentic workflow system designed specifically for the complex, highly regulated environment of Singapore's health insurance industry.

The Problem: Why Standard AI Fails in Insurance

Most enterprise AI deployments fail in insurance claims processing because they treat AI as a "tool" (like a chatbot) rather than an "agent" that owns a workflow. Insurance claims are not simple Q&A tasks; they are complex state machines governed by strict regulatory frameworks.

For example In Singapore, a health insurance claim must navigate:

    MAS Notice 120: Strict SLAs and audit trail requirements for every decision.
    MOH Schedule of Fees: Complex proration rules when hospital charges exceed benchmarks.
    CPF Medisave & MediShield Life: Integration with national health financing schemes.
    PDPA: Strict data minimisation and consent tracking.

A generic LLM cannot process a claim. An Agentic Workflow System can.
The Solution: OperaAI Claims Intelligence

This demo application showcases a production-grade architecture for agentic claims processing. It demonstrates how to combine multi-persona routing, deterministic rules, and an AI Copilot to safely automate regulated workflows.
Key Architectural Patterns Demonstrated:

    Multi-Persona Queue Routing: The workflow is divided into six distinct stages (Lodgement, Assessment, Medical, Decisioning, QC, Payment). The system understands the different roles, authorities, and conditions required to transition a claim between these states.
    The AI Copilot Pattern: Instead of autonomous (and risky) decision-making, the AI acts as an expert advisor to the human operator. It surfaces relevant regulatory context, calculates MOH proration, and suggests actions, while the human retains final authority.
    Immutable Audit Trails: Every action, whether taken by a human or suggested by the AI, is logged immutably to satisfy MAS Notice 120 compliance requirements.
    Deterministic + Probabilistic Hybrid: The system uses deterministic code for calculations (e.g., 10% co-insurance) and probabilistic AI for unstructured data extraction and clinical assessment.

The Six-Stage Agentic Workflow

The demo includes 7 seed claims, each placed in a different stage of the workflow to demonstrate specific agentic capabilities:
Stage 	Agentic Capability Demonstrated 	Regulatory Context
1. Claim Lodgement 	Automated minimum requirements validation 	Singpass digital identity verification
2. Claim Assessment 	Concurrent processing workspace 	CPF Medisave & MediShield Life validation
3. Medical & Requirements 	Automated fee benchmark comparison 	MOH Schedule of Fees proration
4. Claim Decisioning 	Rules-driven payout calculation 	MAS Notice 120 decision rationale
5. QC & Decision Comms 	Automated SLA tracking & escalation 	PDPA compliance & MAS audit trail
6. Payment & Closure 	Rules-driven payment processing 	FAST transfer & Medisave routing
Technical Stack

This is a lightweight, demo-optimized stack designed to run entirely in memory for easy presentation and resetting.

    Frontend: React 19 + TailwindCSS 4
    Backend: Express 4 + tRPC 11
    Database: SQLite (via sql.js running in-memory)
    Language: TypeScript
    UI Pattern:Dark Navy Sidebar (optimized for enterprise data density)

Note: The use of in-memory SQLite allows the demo to be instantly reset to its original state
Getting Started
Prerequisites

    Node.js 22+
    pnpm

Installation

# Clone the repository
git clone https://github.com/VijayendraDwari/operaai-claims-demo.git
cd operaai-claims-demo

# Install dependencies
pnpm install

# Start the development server
pnpm run dev

The application will be available at http://localhost:5173.
Running a Demo

    Open the application and navigate to the Claim Lodgement queue.
    Open claim CLM-2026-001.
    Use the AI Copilot panel on the right to ask: "Check minimum requirements".
    Observe the AI's response regarding Singpass verification.
    Click Advance to Next Stage to move the claim.
    To reset the entire database back to the original 7 seed claims, click the Reset Demo button in the bottom left of the sidebar.

About the Author

Vijayendra Dwari is the architect of enterprise agentic systems. He specializes in building AI systems for highly regulated industries (insurance, healthcare, financial services) that require strict compliance, auditability, and human-in-the-loop governance.

LinkedIn | GitHub

© 2026 Vijayendra Dwari. Open-sourced under the MIT License.
