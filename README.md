# Cyber Resilience Maturity Framework (CRMF)

A dynamic web-based cyber resilience assessment tool built as a Duke MEng Cybersecurity capstone project.

---

## What This Is

Most cyber resilience frameworks — NIST SP 800-160, MITRE CREF, C2M2 — are comprehensive but produce outputs that require security expertise to interpret. A board member cannot extract investment decisions from a technical controls assessment. A security engineer cannot act on board-level language.

CRMF solves this by taking one assessment and automatically generating three completely different outputs — for the Board, the CISO, and the Technical team — each in the right language, each grounded in the actual failure modes identified. It also addresses the checklist compliance problem by penalising controls that exist on paper but have never been tested.

---

## The Two Core Problems This Solves

**Problem 1 — Compliance as a checklist**
Existing frameworks reward documentation. A control written in a policy scores the same as one actively tested and proven to work. CRMF penalises untested controls with a 0.4x UNTESTED penalty — a perfectly documented control that has never been exercised scores a maximum of 40%.

**Problem 2 — Prevention focus over operational readiness**
Most frameworks ask whether you have the right controls in place. CRMF asks whether you can survive and recover from a breach that has already happened — through dedicated Operational Continuity and Trusted Recovery pillars carrying 50% of the total weight.

---

## Five Pillars

| Pillar | Weight | What It Measures |
|--------|--------|-----------------|
| Governance and Command | 18% | Leadership accountability, incident authority, crisis management structures |
| Risk Management | 17% | Risk identification, vendor risk, threat intelligence, business impact analysis |
| Operational Continuity | 30% | Business continuity, incident response, redundancy, operational resilience |
| Trusted Recovery | 20% | Backup integrity, recovery testing, restoration capability, dual authorisation |
| Evolution and Adaptation | 15% | Lessons learned, continuous improvement, threat intelligence sharing |

---

## Scoring Methodology

Every applicable question is scored across five sub-dimensions:

| Sub-dimension | Weight | What It Captures |
|--------------|--------|-----------------|
| Implementation | 35% | Maturity level: MISSING → INITIAL → DEVELOPING → DEFINED → OPTIMISED |
| Test Type | 25% | How rigorously tested: UNTESTED → SELF-REPORT → THEORETICAL → TABLETOP → FUNCTIONAL → FULL |
| Coverage Scope | 20% | Environment coverage: NO COVERAGE → LIMITED → PARTIAL → CRITICAL SYSTEMS → FULL SCOPE |
| Last Reviewed | 15% | Recency: NEVER → OVER 2 YEARS → 180-365 DAYS → 90-180 DAYS → WITHIN 90 DAYS |
| Stress Tested | 5% | Failure testing: NO → PARTIAL → MULTIPLE |

**UNTESTED Penalty:** If Test Type is UNTESTED, the entire question score is multiplied by 0.4. A perfectly documented, fully defined control that has never been tested scores a maximum of 40% of its potential. This mathematically enforces the difference between documentation and readiness.

**Cascade Logic:** If a parent control is MISSING, all dependent child controls automatically score zero. You cannot test what does not exist.

**Shifting Denominator:** Scores are calculated against the maximum possible for applicable questions only — not the full question bank. A 72% score always means 72% of what that specific organisation should have.

---

## Maturity Tiers

| Score | Tier | Description |
|-------|------|-------------|
| 85 – 100% | Iron Fortress | Exceptional resilience, industry leading posture |
| 70 – 84% | Resilient | Strong resilience with minor gaps to address |
| 55 – 69% | Developing | Moderate resilience, significant improvements needed |
| 40 – 54% | Vulnerable | Notable gaps exist, priority action required |
| 0 – 39% | Critical Risk | Immediate intervention needed across multiple domains |

---

## Key Features

### Dynamic Organisation Profiling
Before any resilience question is asked, the tool builds a complete org profile:
- 5 organisation types: Financial Services, Healthcare, Energy and Utilities, Manufacturing and OT, General
- Size scoring: 5 inputs mapped to Small / Medium / Large
- Funding scoring: 5 inputs mapped to Limited / Moderate / Well Funded
- 8 technology flags: Cloud, OT, AI, Agentic AI, Payments, Sensitive Data, Third Party Vendors, Software Development
- 12 regulatory frameworks: HIPAA, DORA, SEC, NERC CIP, ISO 27001, PCI DSS, SOC2, GDPR and more

### Question Applicability Engine
Every question has applicability conditions. Questions only appear when the org profile matches. A hospital does not see OT questions. A small org without cloud does not see cloud-specific controls. The scoring denominator shifts accordingly.

### Cascade Logic
Parent-child question relationships. If a parent control is MISSING, all dependent child controls automatically score zero. This prevents inflation from answering child questions positively when the foundational control is absent.

### Three Audience Views
The same assessment produces three completely different outputs:

**Board** — AI-written executive summary (2-3 sentences naming the score, tier, key pillar weaknesses, and specific regulatory exposure) plus 3 strategic actions starting with strong verbs (Mandate, Appoint, Invest, Commission, Establish). Plain language, no technical jargon.

**CISO** — 8 programme-level actions identifying specific failure modes (missing, untested, limited coverage, never reviewed) and what programme change is needed. GRC and security programme language.

**Technical** — 12 specific implementation actions. Every action names a specific tool or platform (AWS IAM, Azure AD PIM, ServiceNow GRC, Splunk, MISP, Veeam, PagerDuty), starts with a technical verb (Configure, Deploy, Implement, Harden, Audit, Automate), and translates governance gaps into engineering tasks.

### AI Recommendation Architecture
- Top 5 worst-scoring high-weight gaps per pillar sent to AI with full sub-dimension failure states
- Maximum 25 gaps total (5 pillars x 5 questions)
- 3 separate API calls — one per audience, fired lazily when tab is clicked
- Results cached after first load so switching back does not re-call
- Cache cleared on new assessment

### Demo Mode
Two one-click demo profiles on the landing page using real AI-generated answer data from completed test runs:
- Large Investment Bank: Financial Services, Large, Well Funded — 58% Developing
- Small Rural Hospital: Healthcare, Small, Limited — 4% Critical Risk

---

## Project Structure

```
CyberResilienceTool/
├── index.html              — Landing page, assessment flow, results page
├── ai_test_runner.html     — AI validation test runner
├── css/
│   └── style.css           — Full dark theme styling
└── js/
    ├── questions.js        — Question bank, scoring engine, applicability
    │                         logic, cascade relationships, scoring tables,
    │                         pillar weights
    └── app.js              — Assessment state machine, dynamic filtering,
                              weighted scoring, radar chart, audience views,
                              AI recommendations, demo profiles
```

---

## AI Validation Methodology

To validate that the scoring engine produces consistent and defensible results across diverse real-world profiles, a separate AI test runner (`ai_test_runner.html`) uses GPT-4.1 Mini as an independent assessor across seven real-world organisational profiles.

### Seven Test Cases

| ID | Organisation | Sector | Size | Funding |
|----|-------------|--------|------|---------|
| TC01 | Large US Investment Bank | Financial Services | Large | Well Funded |
| TC02 | Small Rural Hospital | Healthcare | Small | Limited |
| TC03 | Mid-size Regional Bank | Financial Services | Medium | Moderate |
| TC04 | Large Power Grid Operator | Energy and Utilities | Large | Well Funded |
| TC05 | Small Manufacturing Plant | Manufacturing and OT | Small | Limited |
| TC06 | Large Teaching Hospital | Healthcare | Large | Well Funded |
| TC07 | Mid-size Fintech Startup | Financial Services | Medium | Moderate |

### Three-Phase Validation Process

**Phase 1 — AI Assessment**
The AI answers all applicable questions in batches of 15 with full org context. A cumulative running assessment summary is generated after each batch and prepended to the next batch prompt, maintaining calibration consistency across all batches. Rate limit handling with 65 second retry on 429 errors and 4 second sleep between successful batches.

**Phase 2 — Independent Scoring**
After all questions are answered, the AI independently predicts the score, maturity tier, rationale, strongest pillar, and weakest pillar — without seeing the engine result.

**Phase 3 — Reflection**
The engine score and pillar breakdown are revealed. The AI reflects on the difference, identifies what its prediction missed, and states the most critical gaps to prioritise.

### Validation Results

| Case | Engine | AI | Delta | Status |
|------|--------|-----|-------|--------|
| TC01 Large Investment Bank | 58% | 72% | 14% | Acceptable |
| TC02 Small Rural Hospital | 4% | 12% | 8% | Validated |
| TC03 Mid-size Regional Bank | 27% | 42% | 15% | Acceptable |
| TC04 Large Power Grid | 58% | 78% | 20% | Acceptable |
| TC05 Small Manufacturing | 3% | 5% | 2% | Validated |
| TC06 Large Teaching Hospital | 34% | 55% | 21% | Needs Review |
| TC07 Mid-size Fintech | 34% | 45% | 11% | Acceptable |

**2 Validated, 4 Acceptable, 1 Needs Review**

### Key Finding
The framework correctly differentiates across all org types, sizes, and sectors. Extreme cases show the tightest alignment — Small Rural Hospital 8% delta Validated, Small Manufacturing Plant 2% delta Validated. The framework is most reliable where it matters most — identifying critically vulnerable organisations.

### Methodology Limitations

**Stateless batch architecture:** Each batch of 15 questions is an independent API call with no shared conversation history. Even with a cumulative running summary passed between batches, the AI cannot maintain perfect calibration across 22+ independent calls for large complex organisations. This produces calibration drift analogous to assessor fatigue in real-world evaluations — the AI may establish a strong baseline early but lose consistency in later batches.

**Token constraints:** Duke OIT's 20,000 TPM limit makes it impossible to answer all questions in a single API call for large organisations with 300+ applicable questions. This is the root cause of the stateless batch architecture and its associated drift.

**Static question bank:** The AI assessor is evaluated against a fixed set of questions. Emerging threats and novel attack patterns not covered by the current question bank are not assessed.

**AI subjectivity:** Despite structured prompts and a running summary, the AI brings inherent subjectivity to its answers. Two runs of the same test case may produce different answer distributions and therefore different scores — unlike the deterministic scoring engine which always produces identical outputs for identical inputs.

**These limitations are themselves a finding:** The deterministic scoring engine outperforms the AI assessor in consistency and reproducibility, particularly for large complex organisations. This validates the core premise of the framework — that a structured weighted scoring engine is more reliable than purely subjective expert assessment at scale.

---

## Setup

1. Clone the repository
2. In `js/app.js` replace `YOUR_DUKE_API_TOKEN` with your API token
3. In `ai_test_runner.html` replace `YOUR_DUKE_API_TOKEN` with your API token
4. Open `index.html` in a browser — no build step required

**Note:** AI features require a valid API token (GPT-4.1 Mini via an OpenAI-compatible endpoint). The assessment and scoring engine work fully without the token — only the AI recommendation and validation features require it.

---

## Frameworks Referenced

- NIST SP 800-160 Volume 2 — Cyber Resiliency Engineering Framework
- MITRE Cyber Resiliency Engineering Framework (CREF)
- Cybersecurity Capability Maturity Model (C2M2)
- CERT Resilience Management Model
- NIST CSF 2.0
- ISO 27001

---

## Academic Context

**Course:** GRC — Governance, Risk and Compliance  
**Institution:** Duke University MEng Cybersecurity  
**Timeline:** January 2026 – July 2026

