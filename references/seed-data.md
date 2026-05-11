# Singapore Demo Claims — Seed Data

## Table of Contents
1. [Design principles](#design-principles)
2. [The 7 demo claims](#the-7-demo-claims)
3. [Claim type coverage](#claim-type-coverage)
4. [Singapore-specific data patterns](#singapore-specific-data-patterns)

---

## Design principles

Each demo claim is placed in a **different queue stage** so the presenter can navigate to any stage and demonstrate that stage's AI Copilot responses and workflow actions. The 7 claims cover the most common Singapore health insurance claim types and regulatory scenarios.

**One claim per stage** (except Stage 1 which has 2 — one P1 critical illness for dramatic effect):

| Stage | Claim | Scenario |
|-------|-------|---------|
| Claim Lodgement | CLM-2026-001 | Routine appendectomy — Singpass pending |
| Claim Lodgement | CLM-2026-002 | P1 critical illness — breast cancer |
| Claim Assessment | CLM-2026-003 | Disability income — spinal surgery |
| Medical & Requirements | CLM-2026-004 | High-value CABG — MOH proration needed |
| Claim Decisioning | CLM-2026-005 | Day surgery cataract — approved SGD 7,400 |
| QC & Decision Comms | CLM-2026-006 | A&E fracture — payout SGD 2,880 |
| Payment & Closure | CLM-2026-007 | Emergency C-section — payout SGD 18,450 |

---

## The 7 demo claims

### CLM-2026-001 — Tan Wei Ming

```
Queue: intake_triage | Priority: P2
Claimant: Tan Wei Ming | NRIC: S8812345A | DOB: 1988-05-12
Phone: +65 9123 4567 | Email: tanweiming@email.sg
Singpass Verified: NO (0)
Policy: OPR-POL-2021-08834 | OperaShield Preferred
Claim Type: Hospitalisation & Surgical
Incident: 2026-03-18 | Submitted: 2026-03-22
Claim Amount: SGD 12,500
Medisave Balance: SGD 18,450 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: SGD 10,800
Diagnosis: K35.8 — Acute appendicitis with complications
Treatment: Emergency appendectomy
Hospital: Tan Tock Seng Hospital
Admission: 2026-03-18 | Discharge: 2026-03-21
Notes: Singpass verification pending.
```

### CLM-2026-002 — Priya Ramasamy

```
Queue: intake_triage | Priority: P1
Claimant: Priya Ramasamy | NRIC: T7923456B | DOB: 1979-11-03
Phone: +65 8234 5678 | Email: priya.ramasamy@email.sg
Singpass Verified: YES (1)
Policy: OPR-POL-2019-04421 | OperaShield Enhanced
Claim Type: Critical Illness
Incident: 2026-02-28 | Submitted: 2026-03-10
Claim Amount: SGD 50,000
Medisave Balance: SGD 42,300 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: null (CI lump sum, no benchmark)
Diagnosis: C50.9 — Breast cancer, unspecified
Treatment: Mastectomy and chemotherapy
Hospital: Singapore General Hospital
Admission: 2026-02-28 | Discharge: null (ongoing)
Notes: High priority critical illness claim. Oncology specialist report required.
```

### CLM-2026-003 — Muhammad Hafiz bin Roslan

```
Queue: idv_eligibility | Priority: P2
Claimant: Muhammad Hafiz bin Roslan | NRIC: S9034567C | DOB: 1990-07-22
Phone: +65 9345 6789 | Email: mhafiz.roslan@email.sg
Singpass Verified: YES (1)
Policy: OPR-POL-2022-11203 | OperaShield Standard
Claim Type: Disability Income
Incident: 2026-01-15 | Submitted: 2026-02-01
Claim Amount: SGD 36,000 (12-month benefit)
Medisave Balance: SGD 9,800 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: null (disability income, not hospitalisation)
Diagnosis: M54.5 — Low back pain with nerve compression
Treatment: Spinal surgery and rehabilitation
Hospital: KK Women's and Children's Hospital
Admission: 2026-01-15 | Discharge: 2026-01-22
Notes: Disability income claim. 12-month benefit period. Employer income verification required.
```

### CLM-2026-004 — Chen Li Hua

```
Queue: medical_assessment | Priority: P2
Claimant: Chen Li Hua | NRIC: S7745678D | DOB: 1977-03-08
Phone: +65 9456 7890 | Email: chenlihua@email.sg
Singpass Verified: YES (1)
Policy: OPR-POL-2018-07765 | OperaShield Preferred Plus
Claim Type: Hospitalisation & Surgical
Incident: 2026-03-01 | Submitted: 2026-03-08
Claim Amount: SGD 87,500 (high-value — triggers MOH proration demo)
Medisave Balance: SGD 55,200 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: SGD 72,000
Diagnosis: I25.1 — Coronary artery disease with angina
Treatment: Coronary artery bypass graft (CABG)
Hospital: National Heart Centre Singapore
Admission: 2026-03-01 | Discharge: 2026-03-10
Notes: High-value claim. MOH benchmark proration required. Cardiology specialist assessment needed.
```

### CLM-2026-005 — Lim Siew Bee

```
Queue: adjudication | Priority: P3
Claimant: Lim Siew Bee | NRIC: S8556789E | DOB: 1985-09-14
Phone: +65 9567 8901 | Email: limsiewbee@email.sg
Singpass Verified: YES (1)
Policy: OPR-POL-2020-09988 | OperaShield Standard
Claim Type: Day Surgery
Incident: 2026-03-12 | Submitted: 2026-03-14
Claim Amount: SGD 8,200
Approved Amount: SGD 7,400 (after MOH proration)
Medisave Balance: SGD 22,100 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: SGD 7,400
Diagnosis: H26.9 — Cataract, unspecified
Treatment: Phacoemulsification cataract surgery
Hospital: Singapore National Eye Centre
Admission: 2026-03-12 | Discharge: 2026-03-12 (day surgery)
Notes: Day surgery claim. Medical assessment approved SGD 7,400 after MOH proration.
```

### CLM-2026-006 — Rajesh Kumar s/o Venkataraman

```
Queue: quality_check | Priority: P3
Claimant: Rajesh Kumar s/o Venkataraman | NRIC: S8267890F | DOB: 1982-12-25
Phone: +65 9678 9012 | Email: rajesh.kumar@email.sg
Singpass Verified: YES (1)
Policy: OPR-POL-2021-05543 | OperaShield Preferred
Claim Type: Accident & Emergency
Incident: 2026-03-20 | Submitted: 2026-03-21
Claim Amount: SGD 3,400
Approved Amount: SGD 3,200 | Payout Amount: SGD 2,880
Adjudication Decision: Approved
Medisave Balance: SGD 31,500 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: SGD 3,200
Diagnosis: S52.5 — Fracture of lower end of radius
Treatment: Closed reduction and cast immobilisation
Hospital: Changi General Hospital
Admission: 2026-03-20 | Discharge: 2026-03-20 (A&E)
Notes: A&E claim. Adjudication approved SGD 3,200. Co-insurance 10% applied. Payout SGD 2,880. Ready for QC.
```

### CLM-2026-007 — Wong Mei Lin

```
Queue: payment_closure | Priority: P2
Claimant: Wong Mei Lin | NRIC: S9178901G | DOB: 1991-06-30
Phone: +65 9789 0123 | Email: wongmeilin@email.sg
Singpass Verified: YES (1)
Policy: OPR-POL-2023-14456 | OperaShield Enhanced
Claim Type: Maternity Complications
Incident: 2026-03-05 | Submitted: 2026-03-15
Claim Amount: SGD 22,000
Approved Amount: SGD 20,500 | Payout Amount: SGD 18,450
Adjudication Decision: Approved
Medisave Balance: SGD 14,200 | MediShield Eligible: YES
CPF Status: Active
MOH Benchmark: SGD 20,500
Diagnosis: O34.2 — Maternal care for uterine scar from previous surgery
Treatment: Emergency caesarean section
Hospital: KK Women's and Children's Hospital
Admission: 2026-03-05 | Discharge: 2026-03-09
Notes: Maternity complication claim. QC passed. Ready for payment processing and closure.
```

---

## Claim type coverage

| Claim type | Demo claim | Key demo point |
|---|---|---|
| Hospitalisation & Surgical | CLM-2026-001 | Routine — Singpass pending |
| Critical Illness | CLM-2026-002 | P1 — lump sum, no MOH benchmark |
| Disability Income | CLM-2026-003 | 12-month benefit, employer verification |
| High-value Surgical | CLM-2026-004 | CABG — MOH proration on SGD 87,500 |
| Day Surgery | CLM-2026-005 | Cataract — same-day admission/discharge |
| Accident & Emergency | CLM-2026-006 | A&E — co-insurance 10% demo |
| Maternity Complications | CLM-2026-007 | Emergency C-section — Medisave + cash split |

---

## Singapore-specific data patterns

**NRIC format:** `[S/T/F/G][7 digits][letter]` — use S prefix for Singapore citizens, T for PRs.

**Policy number format:** `OPR-POL-YYYY-NNNNN` — OperaAI internal reference.

**Claim number format:** `CLM-YYYY-NNN` — sequential within year.

**Phone format:** `+65 XXXX XXXX` — Singapore country code.

**Email domain:** Use `.sg` TLD for realism.

**Hospital names (MOH-approved facilities):**
- Tan Tock Seng Hospital (TTSH)
- Singapore General Hospital (SGH)
- KK Women's and Children's Hospital (KKH)
- National Heart Centre Singapore (NHCS)
- Singapore National Eye Centre (SNEC)
- Changi General Hospital (CGH)
- National University Hospital (NUH)

**ICD-10 codes used:**
- K35.8 — Acute appendicitis with complications
- C50.9 — Breast cancer, unspecified
- M54.5 — Low back pain with nerve compression
- I25.1 — Coronary artery disease with angina
- H26.9 — Cataract, unspecified
- S52.5 — Fracture of lower end of radius
- O34.2 — Maternal care for uterine scar from previous surgery
