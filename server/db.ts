/**
 * OperaAI Claims Intelligence — Database Layer
 *
 * Uses sql.js (SQLite compiled to WebAssembly) running entirely in-memory.
 * This means:
 *  - No external database required
 *  - Instant reset via resetAllDemoClaims()
 *  - Perfect for demos and open-source exploration
 *
 * To upgrade to a persistent database, replace the sql.js calls with
 * your preferred ORM (Drizzle, Prisma, etc.) and a real database connection.
 */

import initSqlJs, { Database } from "sql.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export type QueueStage =
  | "intake_triage"
  | "idv_eligibility"
  | "medical_assessment"
  | "adjudication"
  | "quality_check"
  | "payment_closure";

export interface Claim {
  claim_number: string;
  current_queue: QueueStage;
  priority: "P1" | "P2" | "P3";
  claimant_name: string;
  claimant_nric: string;
  claimant_dob: string;
  claimant_phone: string;
  claimant_email: string;
  singpass_verified: number; // 0 | 1
  policy_number: string;
  policy_type: string;
  claim_type: string;
  incident_date: string;
  submission_date: string;
  claim_amount: number;
  approved_amount: number | null;
  payout_amount: number | null;
  adjudication_decision: string | null;
  medisave_balance: number;
  medishield_eligible: number; // 0 | 1
  cpf_account_status: string;
  moh_benchmark_amount: number | null;
  diagnosis_code: string;
  diagnosis_description: string;
  treatment_type: string;
  hospital_name: string;
  admission_date: string;
  discharge_date: string | null;
  status: string;
  notes: string;
}

export interface AuditLog {
  id: number;
  claim_number: string;
  action: string;
  performer: string;
  timestamp: string;
  details: string;
}

// ─── Singleton DB instance ────────────────────────────────────────────────────

let db: Database | null = null;

function rowToObj<T>(columns: string[], values: (string | number | null)[][]): T[] {
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj as T;
  });
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_CLAIMS: Omit<Claim, never>[] = [
  {
    claim_number: "CLM-2026-001", current_queue: "intake_triage", priority: "P2",
    claimant_name: "Tan Wei Ming", claimant_nric: "S8812345A", claimant_dob: "1988-05-12",
    claimant_phone: "+65 9123 4567", claimant_email: "tanweiming@email.sg",
    singpass_verified: 0, policy_number: "OPR-POL-2021-08834", policy_type: "OperaShield Preferred",
    claim_type: "Hospitalisation & Surgical", incident_date: "2026-03-18", submission_date: "2026-03-22",
    claim_amount: 12500, approved_amount: null, payout_amount: null, adjudication_decision: null,
    medisave_balance: 18450, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: 10800, diagnosis_code: "K35.8", diagnosis_description: "Acute appendicitis with complications",
    treatment_type: "Emergency appendectomy", hospital_name: "Tan Tock Seng Hospital",
    admission_date: "2026-03-18", discharge_date: "2026-03-21",
    status: "open", notes: "Singpass verification pending. Automated intake checklist complete."
  },
  {
    claim_number: "CLM-2026-002", current_queue: "intake_triage", priority: "P1",
    claimant_name: "Priya Ramasamy", claimant_nric: "T7923456B", claimant_dob: "1979-11-03",
    claimant_phone: "+65 8234 5678", claimant_email: "priya.ramasamy@email.sg",
    singpass_verified: 1, policy_number: "OPR-POL-2019-04421", policy_type: "OperaShield Enhanced",
    claim_type: "Critical Illness", incident_date: "2026-02-28", submission_date: "2026-03-10",
    claim_amount: 50000, approved_amount: null, payout_amount: null, adjudication_decision: null,
    medisave_balance: 42300, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: null, diagnosis_code: "C50.9", diagnosis_description: "Breast cancer, unspecified",
    treatment_type: "Mastectomy and chemotherapy", hospital_name: "Singapore General Hospital",
    admission_date: "2026-02-28", discharge_date: null,
    status: "open", notes: "P1 critical illness claim. Oncology specialist report required."
  },
  {
    claim_number: "CLM-2026-003", current_queue: "idv_eligibility", priority: "P2",
    claimant_name: "Muhammad Hafiz bin Roslan", claimant_nric: "S9034567C", claimant_dob: "1990-07-22",
    claimant_phone: "+65 9345 6789", claimant_email: "mhafiz.roslan@email.sg",
    singpass_verified: 1, policy_number: "OPR-POL-2022-11203", policy_type: "OperaShield Standard",
    claim_type: "Disability Income", incident_date: "2026-01-15", submission_date: "2026-02-01",
    claim_amount: 36000, approved_amount: null, payout_amount: null, adjudication_decision: null,
    medisave_balance: 9800, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: null, diagnosis_code: "M54.5", diagnosis_description: "Low back pain with nerve compression",
    treatment_type: "Spinal surgery and rehabilitation", hospital_name: "KK Women's and Children's Hospital",
    admission_date: "2026-01-15", discharge_date: "2026-01-22",
    status: "open", notes: "Disability income claim. 12-month benefit period. Employer income verification required."
  },
  {
    claim_number: "CLM-2026-004", current_queue: "medical_assessment", priority: "P2",
    claimant_name: "Chen Li Hua", claimant_nric: "S7745678D", claimant_dob: "1977-03-08",
    claimant_phone: "+65 9456 7890", claimant_email: "chenlihua@email.sg",
    singpass_verified: 1, policy_number: "OPR-POL-2018-07765", policy_type: "OperaShield Preferred Plus",
    claim_type: "Hospitalisation & Surgical", incident_date: "2026-03-01", submission_date: "2026-03-08",
    claim_amount: 87500, approved_amount: null, payout_amount: null, adjudication_decision: null,
    medisave_balance: 55200, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: 72000, diagnosis_code: "I25.1", diagnosis_description: "Coronary artery disease with angina",
    treatment_type: "Coronary artery bypass graft (CABG)", hospital_name: "National Heart Centre Singapore",
    admission_date: "2026-03-01", discharge_date: "2026-03-10",
    status: "open", notes: "High-value claim. MOH benchmark proration required. Cardiology specialist assessment needed."
  },
  {
    claim_number: "CLM-2026-005", current_queue: "adjudication", priority: "P3",
    claimant_name: "Lim Siew Bee", claimant_nric: "S8556789E", claimant_dob: "1985-09-14",
    claimant_phone: "+65 9567 8901", claimant_email: "limsiewbee@email.sg",
    singpass_verified: 1, policy_number: "OPR-POL-2020-09988", policy_type: "OperaShield Standard",
    claim_type: "Day Surgery", incident_date: "2026-03-12", submission_date: "2026-03-14",
    claim_amount: 8200, approved_amount: 7400, payout_amount: null, adjudication_decision: null,
    medisave_balance: 22100, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: 7400, diagnosis_code: "H26.9", diagnosis_description: "Cataract, unspecified",
    treatment_type: "Phacoemulsification cataract surgery", hospital_name: "Singapore National Eye Centre",
    admission_date: "2026-03-12", discharge_date: "2026-03-12",
    status: "open", notes: "Day surgery claim. Medical assessment approved SGD 7,400 after MOH proration."
  },
  {
    claim_number: "CLM-2026-006", current_queue: "quality_check", priority: "P3",
    claimant_name: "Rajesh Kumar s/o Venkataraman", claimant_nric: "S8267890F", claimant_dob: "1982-12-25",
    claimant_phone: "+65 9678 9012", claimant_email: "rajesh.kumar@email.sg",
    singpass_verified: 1, policy_number: "OPR-POL-2021-05543", policy_type: "OperaShield Preferred",
    claim_type: "Accident & Emergency", incident_date: "2026-03-20", submission_date: "2026-03-21",
    claim_amount: 3400, approved_amount: 3200, payout_amount: 2880, adjudication_decision: "Approved",
    medisave_balance: 31500, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: 3200, diagnosis_code: "S52.5", diagnosis_description: "Fracture of lower end of radius",
    treatment_type: "Closed reduction and cast immobilisation", hospital_name: "Changi General Hospital",
    admission_date: "2026-03-20", discharge_date: "2026-03-20",
    status: "open", notes: "A&E claim. Adjudication approved SGD 3,200. Co-insurance 10% applied. Payout SGD 2,880. Ready for QC."
  },
  {
    claim_number: "CLM-2026-007", current_queue: "payment_closure", priority: "P2",
    claimant_name: "Wong Mei Lin", claimant_nric: "S9178901G", claimant_dob: "1991-06-30",
    claimant_phone: "+65 9789 0123", claimant_email: "wongmeilin@email.sg",
    singpass_verified: 1, policy_number: "OPR-POL-2023-14456", policy_type: "OperaShield Enhanced",
    claim_type: "Maternity Complications", incident_date: "2026-03-05", submission_date: "2026-03-15",
    claim_amount: 22000, approved_amount: 20500, payout_amount: 18450, adjudication_decision: "Approved",
    medisave_balance: 14200, medishield_eligible: 1, cpf_account_status: "Active",
    moh_benchmark_amount: 20500, diagnosis_code: "O34.2", diagnosis_description: "Maternal care for uterine scar from previous surgery",
    treatment_type: "Emergency caesarean section", hospital_name: "KK Women's and Children's Hospital",
    admission_date: "2026-03-05", discharge_date: "2026-03-09",
    status: "open", notes: "Maternity complication claim. QC passed. Ready for payment processing and closure."
  },
];

// ─── Schema & Seed ────────────────────────────────────────────────────────────

function initSchema(database: Database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS claims (
      claim_number TEXT PRIMARY KEY,
      current_queue TEXT NOT NULL,
      priority TEXT NOT NULL,
      claimant_name TEXT NOT NULL,
      claimant_nric TEXT NOT NULL,
      claimant_dob TEXT NOT NULL,
      claimant_phone TEXT NOT NULL,
      claimant_email TEXT NOT NULL,
      singpass_verified INTEGER NOT NULL DEFAULT 0,
      policy_number TEXT NOT NULL,
      policy_type TEXT NOT NULL,
      claim_type TEXT NOT NULL,
      incident_date TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      claim_amount REAL NOT NULL,
      approved_amount REAL,
      payout_amount REAL,
      adjudication_decision TEXT,
      medisave_balance REAL NOT NULL,
      medishield_eligible INTEGER NOT NULL DEFAULT 0,
      cpf_account_status TEXT NOT NULL,
      moh_benchmark_amount REAL,
      diagnosis_code TEXT NOT NULL,
      diagnosis_description TEXT NOT NULL,
      treatment_type TEXT NOT NULL,
      hospital_name TEXT NOT NULL,
      admission_date TEXT NOT NULL,
      discharge_date TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      notes TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      claim_number TEXT NOT NULL,
      action TEXT NOT NULL,
      performer TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      details TEXT NOT NULL DEFAULT ''
    );
  `);
}

function seedData(database: Database) {
  for (const claim of SEED_CLAIMS) {
    database.run(
      `INSERT OR REPLACE INTO claims VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        claim.claim_number, claim.current_queue, claim.priority,
        claim.claimant_name, claim.claimant_nric, claim.claimant_dob,
        claim.claimant_phone, claim.claimant_email, claim.singpass_verified,
        claim.policy_number, claim.policy_type, claim.claim_type,
        claim.incident_date, claim.submission_date, claim.claim_amount,
        claim.approved_amount, claim.payout_amount, claim.adjudication_decision,
        claim.medisave_balance, claim.medishield_eligible, claim.cpf_account_status,
        claim.moh_benchmark_amount, claim.diagnosis_code, claim.diagnosis_description,
        claim.treatment_type, claim.hospital_name, claim.admission_date,
        claim.discharge_date, claim.status, claim.notes,
      ]
    );
  }
}

// ─── DB Initializer ───────────────────────────────────────────────────────────

export async function getDb(): Promise<Database> {
  if (db) return db;
  const SQL = await initSqlJs();
  db = new SQL.Database();
  initSchema(db);
  seedData(db);
  return db;
}

// ─── Query Helpers ────────────────────────────────────────────────────────────

export async function getClaimsByQueue(queue: string): Promise<Claim[]> {
  const database = await getDb();
  const query = queue === "all"
    ? database.exec("SELECT * FROM claims ORDER BY priority ASC, submission_date ASC")
    : database.exec("SELECT * FROM claims WHERE current_queue = ? ORDER BY priority ASC, submission_date ASC", [queue]);
  if (!query.length) return [];
  return rowToObj<Claim>(query[0].columns, query[0].values as (string | number | null)[][]);
}

export async function getClaimByNumber(claimNumber: string): Promise<Claim | null> {
  const database = await getDb();
  const result = database.exec("SELECT * FROM claims WHERE claim_number = ?", [claimNumber]);
  if (!result.length || !result[0].values.length) return null;
  return rowToObj<Claim>(result[0].columns, result[0].values as (string | number | null)[][])[0];
}

export async function getAuditLogsByClaimNumber(claimNumber: string): Promise<AuditLog[]> {
  const database = await getDb();
  const result = database.exec(
    "SELECT * FROM audit_logs WHERE claim_number = ? ORDER BY timestamp ASC",
    [claimNumber]
  );
  if (!result.length) return [];
  return rowToObj<AuditLog>(result[0].columns, result[0].values as (string | number | null)[][]);
}

export async function updateClaimQueue(claimNumber: string, newQueue: QueueStage): Promise<void> {
  const database = await getDb();
  database.run("UPDATE claims SET current_queue = ? WHERE claim_number = ?", [newQueue, claimNumber]);
}

export async function addAuditLog(
  claimNumber: string,
  action: string,
  performer: string,
  details: string
): Promise<void> {
  const database = await getDb();
  database.run(
    "INSERT INTO audit_logs (claim_number, action, performer, details) VALUES (?, ?, ?, ?)",
    [claimNumber, action, performer, details]
  );
}

export async function resetAllDemoClaims(): Promise<void> {
  const database = await getDb();
  database.run("DELETE FROM audit_logs");
  database.run("DELETE FROM claims");
  seedData(database);
}

export async function getQueueCounts(): Promise<Record<string, number>> {
  const database = await getDb();
  const result = database.exec(
    "SELECT current_queue, COUNT(*) as count FROM claims GROUP BY current_queue"
  );
  const counts: Record<string, number> = {};
  if (result.length) {
    for (const row of result[0].values) {
      counts[row[0] as string] = row[1] as number;
    }
  }
  return counts;
}
