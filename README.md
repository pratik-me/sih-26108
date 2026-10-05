# Manak Setu AI — SIH 2026

Manak Setu AI is an **AI-powered recommendation engine for identifying applicable Indian Standards for public procurement specifications**. It is developed for **Smart India Hackathon 2026, Problem Statement SIH26108**.

## 1. Project Information

* **Project Title:** Manak Setu AI
* **PS ID:** SIH26108
* **PS Title:** AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications
* **Category:** Software
* **Theme:** Smart Automation
* **Ministry / Department:** Ministry of Consumer Affairs, Food & Public Distribution / Bureau of Indian Standards (BIS) & Government e-Marketplace (GeM)
* **Target Users:** Public Procurement Officers, GeM Buyers, Central/State PSUs, Tender Drafting Committees, Quality Assurance Engineers, and Bidders

## 2. Problem Statement

Public procurement teams often need to determine which Indian Standards, testing requirements, certifications, and related normative references should be included in a tender or procurement specification.

However, identifying the correct standards can be difficult because relevant information is distributed across large technical documents and standards repositories. Procurement specifications may also contain outdated or superseded standards, incomplete technical requirements, or restrictive clauses that can affect procurement quality and competition.

Manak Setu AI addresses this challenge by providing an AI-powered system that analyzes procurement requirements and recommends relevant Indian Standards with supporting evidence.

## 3. Proposed Solution

Manak Setu AI accepts procurement requirements in the form of tender documents, technical specifications, BOQ lines, or natural-language descriptions.

The system extracts important technical and procurement requirements and uses a hybrid AI retrieval pipeline to identify applicable Indian Standards.

The core workflow is:

```text
Procurement Requirement
        |
        v
Requirement & Specification Extraction
        |
        v
Hybrid Standards Retrieval
(Vector Search + BM25)
        |
        v
Cross-Encoder Reranking
        |
        v
Applicable Indian Standards
        |
        +----> Normative & Allied Standards
        |
        +----> Version / Amendment Check
        |
        +----> Testing & Certification Mapping
        |
        v
Grounding & Evidence Validation
        |
        v
Procurement-Ready Recommendation
```

The platform follows the principle:

> **Retrieve First → Reason Second → Cite Authoritative Standards**

This approach is intended to make standards recommendations more relevant, explainable, and traceable.

## 4. Key Features

* **Tender & BOQ Analyzer**

  * Upload or enter tender specifications, BOQ lines, or procurement requirements.
  * Extract relevant technical and product requirements.

* **Indian Standards Recommendation**

  * Identify applicable Indian Standards using semantic and keyword-based retrieval.
  * Rank candidate standards according to their relevance to the procurement requirement.

* **Normative & Allied Standards Discovery**

  * Identify related standards referenced by or associated with the recommended standard.
  * Help procurement teams discover supporting test methods, terminology, safety, and related technical standards.

* **Superseded / Revision Detection**

  * Identify potentially obsolete or superseded standard references.
  * Surface relevant replacement or revised standards where available in the underlying knowledge base.

* **QCO & Certification Mapping**

  * Identify relevant Quality Control Order and certification-related requirements where applicable.
  * Connect procurement requirements with relevant conformity and certification information.

* **GFR 144(i) Anti-Bias Audit**

  * Identify potentially restrictive or proprietary procurement clauses.
  * Assist in converting such requirements into more objective, standard-based specifications.

* **Testing & PDI Support**

  * Assist in identifying relevant testing requirements and inspection criteria.
  * Support generation of procurement-oriented testing and inspection information.

* **Evidence-Backed AI**

  * Provide supporting standard references and citations with recommendations.
  * Use retrieval-grounded responses instead of relying solely on generative model output.

* **Multilingual Procurement Assistance**

  * Support natural-language interaction across Indian languages while preserving technical entities such as standard numbers, clauses, QCO references, and procurement terminology.

* **Procurement Compliance Dossiers**

  * Generate structured procurement recommendations and tender-ready information for further review.

## 5. Technology Stack

* **Monorepo:** Turborepo, pnpm Workspaces, TypeScript 5.5
* **Frontend:** Next.js 14 App Router, React 18, Tailwind CSS, shadcn/ui, TanStack Query, Lucide Icons, Recharts
* **Backend:** NestJS, TypeScript, REST API, Passport JWT, class-validator, Swagger/OpenAPI
* **Database:** PostgreSQL 16
* **Vector Search:** pgvector
* **ORM:** Prisma
* **AI Orchestration:** LangGraph StateGraph, multi-tool calling
* **Retrieval:** Dense vector search, BM25 keyword retrieval, Cross-Encoder reranking
* **Multilingual Engine:** 22 Eighth-Schedule Indian languages + English + Hinglish
* **Testing:** Jest, ts-jest, Supertest, Playwright E2E
* **Deployment:** Docker / Cloud-ready architecture

## 6. Architecture

The system follows a retrieval-augmented architecture in which procurement requirements are analyzed, relevant standards are retrieved and ranked, and the final recommendation is grounded in retrieved evidence.

```text
Procurement Officer / GeM Buyer / QA Engineer
                    |
                    v
        Frontend — Next.js / React
                    |
                    | REST API / SSE
                    v
          Backend — NestJS API
                    |
        +-----------+------------+
        |                        |
        v                        v
 Procurement & GFR Engine    Hybrid RAG Engine
        |                        |
        |                    +---+------------------+
        |                    |                      |
        |                    v                      v
        |              Dense Vector Search       BM25
        |                    |                      |
        |                    +----------+-----------+
        |                               |
        |                               v
        |                     Cross-Encoder Reranker
        |                               |
        +-------------------------------+
        |
        +--> Requirement Extraction
        +--> Standards Recommendation
        +--> Normative Reference Analysis
        +--> Superseded Standard Detection
        +--> QCO Validation
        +--> GFR 144(i) Audit
        +--> Testing / PDI Mapping
        |
        v
Grounding & Evidence Validation
        |
        v
Procurement-Ready Recommendation
```

## 7. Repository Structure

```text
MANAK-SETU-AI/
├── README.md
├── SUBMISSION_GUIDE.md
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── ai/
├── docs/
│   └── architecture.md
├── assets/
│   └── screenshots/
│       └── README.md
├── prisma/
├── tests/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
└── LICENSE
```

### What goes where?

| Item                                   | Location              |
| -------------------------------------- | --------------------- |
| Frontend source code                   | `apps/web/`           |
| Backend API                            | `apps/api/`           |
| AI / RAG components                    | `packages/ai/`        |
| Database schema and migrations         | `prisma/`             |
| Architecture / technical documentation | `docs/`               |
| Project screenshots / prototype images | `assets/screenshots/` |
| Final PPT / presentation information   | `submission/`         |
| Demo video link                        | `submission/DEMO.md`  |
| Project overview                       | `README.md`           |

## 8. Final Presentation

The final Smart India Hackathon presentation should be maintained in the repository whenever the file size permits.

See [submission/PRESENTATION.md](submission/PRESENTATION.md) for the presentation information and accessible file/link.

If the PPT is too large for GitHub, use Google Drive, OneDrive, or another accessible file-hosting service and place the viewer link in `submission/PRESENTATION.md`.

## 9. Demo Video

A demo video is optional but recommended.

[submission/DEMO.md](submission/DEMO.md)

## 10. Screenshots / Prototype Photos

Add important application screenshots and prototype images to:

[Screenshots](assets/screenshots)

Recommended screenshots include:

* Procurement requirement input
* Tender / BOQ analyzer
* Standards recommendation results
* Evidence and citation panel
* Standards / QCO information
* GFR 144(i) audit
* Testing / PDI recommendations
* Final procurement report

## 11. Installation

### Prerequisites

* Node.js >= 18.18.0
* pnpm >= 9.0.0
* PostgreSQL 16 with `pgvector`
* Docker (optional)

### Clone the Repository

```bash
git clone https://github.com/pratik-me/sih-26108
cd https://github.com/pratik-me/sih-26108
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

```bash
cp .env.example .env
```

### Setup Database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

## 12. Run

Start the development environment:

```bash
pnpm dev
```

The application uses the configured frontend and backend development servers.

Run the test suite:

```bash
pnpm test
```

Run the production build:

```bash
pnpm build
```

## 13. Future Scope

Potential future extensions include:

* Integration with additional BIS standards and regulatory data sources.
* Direct integration with GeM and other public procurement workflows where appropriate APIs are available.
* More advanced tender-specification gap analysis.
* Improved normative-reference graphs connecting standards and their dependencies.
* Continuous monitoring of standard revisions, withdrawals, and amendments.
* Advanced procurement specification generation.
* Expanded multilingual support.
* Analytics for frequently requested standards and procurement requirements.
* Improved explainability and confidence scoring for standards recommendations.

## Important

Before submission, make sure the repository is accessible to reviewers. Do not upload passwords, API keys, access tokens, .env files containing secrets, or other confidential credentials.
