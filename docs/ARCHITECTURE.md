# Architecture: OperaAI Claims Intelligence

This document outlines the technical architecture of the OperaAI Claims Intelligence reference implementation.

## 1. System Overview

The application is built on a modern, type-safe TypeScript stack designed for rapid iteration and flawless demonstration capabilities.

**Core Stack:**
- **Frontend**: React 19, TailwindCSS 4, Vite
- **Backend**: Express 4, Node.js 22
- **API Layer**: tRPC 11 (End-to-end type safety)
- **Database**: SQLite (via `sql.js` running in-memory)

## 2. The In-Memory Database Pattern

The most unique architectural decision in this demo is the use of `sql.js` (SQLite compiled to WebAssembly/JavaScript) running entirely in-memory on the Node.js server, bypassing traditional ORMs like Drizzle or Prisma.

### Why In-Memory SQLite?
Enterprise demos often suffer from "data degradation" — as multiple presenters use the system, the data state becomes messy, requiring complex teardown/rebuild scripts. 

By using an in-memory database:
1. **Instant Reset**: The `resetDemo` tRPC mutation simply drops the tables and re-runs the seed script. It takes <50ms.
2. **Zero Infrastructure**: No Docker containers, no connection strings, no database provisioning required to run the demo.
3. **Fresh State**: Every time the server restarts, the database is perfectly clean.

### Schema Design
The schema is deliberately denormalized for performance and simplicity, consisting of two primary tables:

```sql
CREATE TABLE claims (
    claim_number TEXT PRIMARY KEY,
    queue_stage TEXT NOT NULL,
    priority TEXT NOT NULL,
    claimant_name TEXT NOT NULL,
    nric TEXT NOT NULL,
    -- ... 20+ other domain-specific fields
);

CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_number TEXT NOT NULL,
    action TEXT NOT NULL,
    performer TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);
```

## 3. The tRPC API Layer

tRPC provides end-to-end type safety without code generation. The API is structured around the core domain entities.

### Core Procedures (`server/routers.ts`)

| Procedure | Type | Purpose |
|-----------|------|---------|
| `claims.getByQueue` | Query | Fetches the list view for the sidebar navigation |
| `claims.getByClaimNumber` | Query | Fetches the deep-dive detail view |
| `claims.getAuditLog` | Query | Fetches the MAS-compliant audit trail |
| `claims.advance` | Mutation | State machine transition (moves claim to next queue) |
| `claims.aiCopilot` | Mutation | Triggers the AI Copilot response |
| `claims.resetDemo` | Mutation | Triggers the in-memory database reset |

## 4. The AI Copilot Implementation

In this reference implementation, the AI Copilot is **mocked** using a deterministic routing function rather than a live LLM call. 

### Why Mock the LLM?
1. **Demo Reliability**: Live LLMs have latency spikes and occasional API failures. A demo must work 100% of the time.
2. **Narrative Control**: The mock ensures the AI always uses the exact regulatory terminology (e.g., "MAS Notice 120", "MOH Schedule of Fees") required for the presentation narrative.
3. **Speed**: Mock responses return in ~800ms (simulated latency), keeping the presentation flowing smoothly.

### Upgrading to a Live LLM
The architecture is designed to easily swap the mock for a live LLM (like OpenAI or Anthropic). The `aiCopilot` tRPC mutation already extracts the full `claimContext` as a JSON string. 

To upgrade:
1. Replace the `mockAiCopilot` function call with an LLM invocation.
2. Pass the `claimContext` as the system prompt.
3. Pass the user's `message` as the user prompt.

## 5. Frontend Architecture

### The Layout
The UI implements A collapsible sidebar layout optimized for enterprise applications with high data density.

- **Background**: `#0f1623` (Reduces eye strain)
- **Sidebar**: `linear-gradient(180deg, #0d1b2a 0%, #0a1628 100%)`
- **Active States**: `bg-blue-600/30`

### Component Structure
- `ClaimsLayout.tsx`: The master wrapper handling sidebar state and routing.
- `ClaimQueue.tsx`: The list view for a specific workflow stage.
- `ClaimDetail.tsx`: The complex detail view featuring collapsible data sections and the AI Copilot panel.

### State Management
State is managed almost entirely by `@tanstack/react-query` (via tRPC). When a mutation occurs (e.g., advancing a claim), the relevant queries are invalidated, triggering an automatic UI refresh without complex Redux/Zustand boilerplate.
