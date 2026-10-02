# Manak Setu AI (Manak Setu Procurement Edition)

[![CI Build](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/)
[![SIH Problem Statement](https://img.shields.io/badge/SIH_2026-PS_26108-blue)](https://www.sih.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-Consumer_Affairs_/_BIS_&_GeM-orange)](https://consumeraffairs.nic.in/)

## 1. Project Information

- **Project Title:** Manak Setu AI (Manak Setu Procurement Edition) – AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications
- **Problem Statement ID:** SIH26108
- **Ministry / Department:** Ministry of Consumer Affairs, Food & Public Distribution / Bureau of Indian Standards (BIS) & Government e-Marketplace (GeM)
- **Theme:** Smart Automation / Public Procurement Compliance
- **Target Users:** Public Procurement Officers, GeM Buyers, Central/State PSUs, Tender Drafting Committees, Quality Assurance Engineers, and Bidders.

---

## 2. Problem Statement (SIH 26108)

Public procurement in India via the Government e-Marketplace (GeM), Central Public Procurement Portal (CPPP), PSUs, and state utilities accounts for nearly 20% of GDP. However, tender drafting committees and procurement officials face critical hurdles:

1. **Missing or Inaccurate Indian Standard Citations** – Tenders frequently cite outdated, voluntary, or non-applicable standards, leading to poor quality deliveries.
2. **Obsolete / Superseded Standards** – Tenders continue to cite withdrawn standards (e.g., _IS 800:1984_, _IS 456:1978_, _IS 1786:1985_, _IS 4984:1995_) that fail statutory Quality Control Order (QCO) compliance and seismic/safety codes.
3. **Discriminatory & Restrictive Clauses Violating GFR Rule 144(i)** – Tender specifications often include proprietary brand names (e.g., _"ABB only"_, _"SAIL only"_, _"KraussMaffei only"_) or tailor-made criteria that stifle open competition and violate General Financial Rules (GFR 2017 Rule 144(i)).
4. **Mandatory QCO Non-Compliance** – Failure to identify mandatory Gazette Quality Control Orders issued under Section 16 & 17 of the BIS Act 2016, risking illegal procurement.
5. **Absence of Standardized Pre-Dispatch Inspection (PDI) Schedules** – Lack of objective lot inspection criteria, sampling plans (IS 2500 Level II), and routine vs. acceptance test protocols.

---

## 3. Proposed Solution

**Manak Setu AI** is a state-of-the-art AI-powered decision-support and compliance automation engine built specifically for Indian public procurement. Grounded in the core principle:

> **"Retrieve First → Reason Second → Cite Authoritative Standards"**

The engine accepts tender documents (PDF/DOCX/TXT) or pasted BOQ lines, extracts engineering parameters, and executes a 4-tier automated compliance pipeline:

1. **Semantic Standard Matching:** Recommends primary Indian Standards (IS), mandatory QCO Gazette notifications, and normative reference standards.
2. **Superseded Standards Resolution:** Automatically detects obsolete/withdrawn standards and supplies active replacement standards with technical revision summaries.
3. **GFR Rule 144(i) Anti-Bias Audit:** Scans for brand names, restrictive dimensions, or tailor-made conditions, providing compliant, copy-pasteable neutral replacement clauses.
4. **Pre-Dispatch Inspection (PDI) Generator:** Compiles lot sampling plans (IS 2500 Level II), routine/type test matrices, and Third-Party Inspection Agency (TPIA) protocols.
5. **GeM Compliance Dossier Export:** Generates printable/PDF compliance dossiers and copy-pasteable GeM tender specification clauses.

---

## 4. Key Modules & Features

| Module                         | Route           | Purpose & Capabilities                                                                                                   |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Tender & BOQ Analyzer**      | `/procure`      | Upload/paste tender specifications; AI extracts engineering parameters and matches primary Indian Standards.             |
| **GFR 144(i) Anti-Bias Audit** | `/compliance`   | Automated audit for restrictive brand bias or proprietary makes; produces neutral standard-compliant substitute clauses. |
| **Standards & QCO Directory**  | `/standards`    | Full BIS catalogue with active vs. superseded standard resolver and Gazette QCO legal mandate badges.                    |
| **PDI & Testing Schedules**    | `/testing`      | Pre-Dispatch lot inspection criteria, IS 2500 sampling tables, and acceptance test parameters.                           |
| **Recognized Laboratories**    | `/laboratories` | Directory of 500+ NABL accredited (ISO/IEC 17025) and BIS recognized testing laboratories.                               |
| **3-Panel AI Workspace**       | `/chat`         | Grounded AI conversation with synchronized citation drawer, clause excerpts, and procurement tool calling.               |
| **GeM Compliance Dossiers**    | `/reports`      | One-click export of comprehensive procurement compliance dossiers and GeM tender clauses.                                |

---

## 5. Technology Stack

| Layer                        | Technologies                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Monorepo**                 | Turborepo, pnpm workspaces, TypeScript 5.5                                                                                                 |
| **Frontend (`apps/web`)**    | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, TanStack Query, Lucide Icons, Recharts                                         |
| **Backend API (`apps/api`)** | NestJS, TypeScript, REST API, Passport JWT, class-validator, Swagger/OpenAPI                                                               |
| **Database & Vectors**       | PostgreSQL 16 with `pgvector` extension, Prisma ORM                                                                                        |
| **AI Orchestration**         | LangGraph StateGraph agent loop, multi-tool calling, Indic language tokenizer with token protection                                        |
| **Multilingual Engine**      | 22 Eighth-Schedule Indian languages + English + Hinglish with preserved technical entities (`IS 10500`, `Clause 4.2`, `QCO`, `GFR 144(i)`) |
| **Testing**                  | Jest, ts-jest, Supertest, Playwright E2E                                                                                                   |

---

## 6. Architecture Diagram

```text
Procurement Officer / GeM Buyer / QA Engineer
                     │
                     ▼
  apps/web (Next.js 14 App Router + Tailwind CSS)
                     │  REST API / SSE Streams
                     ▼
  apps/api (NestJS API Gateway & Swagger OpenAPI)
                     │
     ┌───────────────┼──────────────────────────────┐
     ▼               ▼                              ▼
Auth & RBAC   Procurement & GFR Engine       Hybrid RAG Engine (packages/ai)
                     │                              │
                     ├─ BOQ Line Extractor          ├─ Indic Translation & Token Guard
                     ├─ GFR 144(i) Anti-Bias        ├─ pgvector Dense + BM25 Search
                     ├─ Superseded Detector         ├─ Cross-Encoder Reranker
                     ├─ QCO Gazette Validator       ├─ Zero-Hallucination Grounding
                     └─ PDI Schedule Matrix         └─ Citation Drawer Generator
```

---

## 7. Getting Started Locally

### Prerequisites

- Node.js >= 18.18.0
- pnpm >= 9.0.0
- PostgreSQL 16 with `pgvector` (or Docker)

### Installation & Execution

```bash
# 1. Clone repository
git clone https://github.com/your-username/sih-26108.git
cd sih-26108

# 2. Install monorepo dependencies
pnpm install

# 3. Setup environment
cp .env.example .env

# 4. Run database migrations & seed procurement data
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Launch development servers (Web on :3000, API on :4000)
pnpm dev
```

---

## 8. Verification & Test Benchmark

Run automated test suites and RAG retrieval benchmarks:

```bash
# Run unit & integration tests
pnpm test

# Run build across all workspaces
pnpm build
```

---

## 9. License & Governance

Built for **Smart India Hackathon 2026 (Problem Statement 26108)** under the auspices of the **Ministry of Consumer Affairs, Food & Public Distribution / Bureau of Indian Standards (BIS) & GeM**.
