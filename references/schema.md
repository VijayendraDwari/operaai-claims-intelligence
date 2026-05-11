# Claims Database Schema (SQLite / sql.js)

## Table of Contents
1. [claims table](#claims-table)
2. [audit_logs table](#audit_logs-table)
3. [QueueStage type](#queuestage-type)
4. [TypeScript interfaces](#typescript-interfaces)
5. [Initialization pattern](#initialization-pattern)

---

## claims table

```sql
CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  claimNumber TEXT NOT NULL UNIQUE,
  currentQueue TEXT NOT NULL DEFAULT 'intake_triage',
  priority TEXT NOT NULL DEFAULT 'P2',
  claimantName TEXT NOT NULL,
  claimantNric TEXT NOT NULL,
  claimantDob TEXT NOT NULL,
  claimantPhone TEXT NOT NULL,
  claimantEmail TEXT NOT NULL,
  singpassVerified INTEGER NOT NULL DEFAULT 0,
  policyNumber TEXT NOT NULL,
  policyType TEXT NOT NULL,
  claimType TEXT NOT NULL,
  incidentDate TEXT NOT NULL,
  submissionDate TEXT NOT NULL,
  claimAmount REAL NOT NULL,
  approvedAmount REAL,
  payoutAmount REAL,
  adjudicationDecision TEXT,
  medisaveBalance REAL,
  medishieldEligible INTEGER NOT NULL DEFAULT 1,
  cpfAccountStatus TEXT,
  mohBenchmarkAmount REAL,
  diagnosisCode TEXT,
  diagnosisDescription TEXT,
  treatmentType TEXT,
  hospitalName TEXT,
  admissionDate TEXT,
  dischargeDate TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
)
```

**Singapore-specific fields:**

| Field | Purpose |
|-------|---------|
| `claimantNric` | Singapore NRIC/FIN (e.g. S8812345A) |
| `singpassVerified` | 0/1 — Singpass digital identity check |
| `medisaveBalance` | CPF Medisave account balance (SGD) |
| `medishieldEligible` | 0/1 — MediShield Life coverage active |
| `cpfAccountStatus` | "Active" / "Inactive" / null |
| `mohBenchmarkAmount` | MOH Schedule of Fees benchmark (SGD) |
| `diagnosisCode` | ICD-10 code (e.g. K35.8) |

---

## audit_logs table

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  claimNumber TEXT NOT NULL,
  action TEXT NOT NULL,
  fromQueue TEXT,
  toQueue TEXT,
  performedBy TEXT NOT NULL DEFAULT 'Vijayendra.dwari',
  notes TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
)
```

---

## QueueStage type

```typescript
export type QueueStage =
  | "intake_triage"
  | "idv_eligibility"
  | "medical_assessment"
  | "adjudication"
  | "quality_check"
  | "payment_closure";
```

Queue order for `advance` workflow:
```
intake_triage → idv_eligibility → medical_assessment → adjudication → quality_check → payment_closure
```

---

## TypeScript interfaces

```typescript
export interface Claim {
  id: number;
  claimNumber: string;
  currentQueue: QueueStage;
  priority: string;           // "P1" | "P2" | "P3"
  claimantName: string;
  claimantNric: string;
  claimantDob: string;        // "YYYY-MM-DD"
  claimantPhone: string;
  claimantEmail: string;
  singpassVerified: number;   // 0 | 1
  policyNumber: string;
  policyType: string;
  claimType: string;
  incidentDate: string;
  submissionDate: string;
  claimAmount: number;
  approvedAmount: number | null;
  payoutAmount: number | null;
  adjudicationDecision: string | null;
  medisaveBalance: number | null;
  medishieldEligible: number; // 0 | 1
  cpfAccountStatus: string | null;
  mohBenchmarkAmount: number | null;
  diagnosisCode: string | null;
  diagnosisDescription: string | null;
  treatmentType: string | null;
  hospitalName: string | null;
  admissionDate: string | null;
  dischargeDate: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  claimNumber: string;
  action: string;
  fromQueue: string | null;
  toQueue: string | null;
  performedBy: string;
  notes: string | null;
  createdAt: string;
}
```

---

## Initialization pattern

sql.js returns column arrays and value arrays — NOT objects. Use this helper:

```typescript
function rowToObj(
  columns: string[],
  values: (number | string | null | Uint8Array)[]
): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  columns.forEach((col, i) => { obj[col] = values[i]; });
  return obj;
}

// Usage:
const result = db.exec(`SELECT * FROM claims WHERE claimNumber = ?`, [claimNumber]);
if (!result.length || !result[0].values.length) return null;
return rowToObj(result[0].columns, result[0].values[0]) as unknown as Claim;
```

The full `db.ts` template is at `../templates/db-sqlite.ts`.
