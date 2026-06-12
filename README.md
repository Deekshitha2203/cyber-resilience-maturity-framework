# Cyber Resilience Maturity Framework (CRMF)

A web-based cyber resilience assessment tool built as part of a Duke MEng Cybersecurity 
capstone project in collaboration with CrowdStrike.

## What This Is

Most existing cyber resilience frameworks — NIST SP 800-160, MITRE CREF, C2M2 — are 
designed for security experts. They are not readable by Boards, not actionable for CISOs, 
and not specific enough for technical teams. This tool bridges that gap.

CRMF is a dynamic maturity assessment that evaluates an organisation's cyber resilience 
across five pillars, produces a scored Global Resilience Index, and generates 
audience-specific recommendations powered by AI.

---

## Five Pillars

| Pillar | What It Measures |
|--------|-----------------|
| Governance and Command | Leadership accountability, policies, regulatory compliance |
| Risk Management | Risk identification, vendor risk, threat intelligence |
| Operational Continuity | Business continuity, incident response, operational resilience |
| Trusted Recovery | Backup integrity, recovery testing, restoration capability |
| Evolution and Adaptation | Lessons learned, continuous improvement, emerging threat response |

---

## How Scoring Works

Every applicable question is scored across five sub-dimensions:

| Sub-dimension | Weight | What It Captures |
|--------------|--------|-----------------|
| Implementation | 35% | How mature the control is (Missing → Optimised) |
| Test Type | 25% | How rigorously it has been tested |
| Coverage Scope | 20% | What percentage of the environment it covers |
| Last Reviewed | 15% | How recently it was validated |
| Stress Tested | 5% | Whether it has been tested under failure conditions |

An UNTESTED penalty of 0.4x is applied to any control that has never been exercised —
regardless of how well implemented it is on paper.

**Maturity Tiers:**
- Iron Fortress: 85–100%
- Resilient: 70–84%
- Developing: 55–69%
- Vulnerable: 40–54%
- Critical Risk: 0–39%

---

## Key Features

**Dynamic Organisation Profiling**
- 5 organisation types, 3 size tiers, 3 funding levels
- 8 technology flags (Cloud, OT, AI, Agentic AI, Payments, Sensitive Data, Third Party, Software Dev)
- 12 regulatory frameworks (HIPAA, DORA, SEC, NERC CIP, ISO 27001, PCI DSS and more)
- Questions filtered dynamically based on profile — no irrelevant questions shown

**Cascade Logic**
- If a parent control is missing, dependent child controls automatically score zero
- Reflects real-world dependency — you cannot test what does not exist

**Three Audience Views**
- Board: Traffic light pillar summary + AI-generated executive summary + 3 strategic investment actions
- CISO: Pillar breakdown + radar chart + 8 programme-level remediation actions
- Technical: Pillar scores + radar chart + 12 specific implementation tasks

**AI-Powered Recommendations (DukeGPT)**
- Top 5 lowest-scoring high-weight gaps per pillar sent to AI with full sub-dimension context
- AI generates audience-specific actions based on actual failure modes — not generic advice
- Separate API call per audience, cached after first load

---

## AI Validation Methodology

To validate the scoring engine, an AI-powered test runner (`ai_test_runner.html`) was built 
to simulate realistic assessor responses across 7 real-world organisational profiles.

**Test Cases:**
| ID | Organisation | Profile |
|----|-------------|---------|
| TC01 | Large US Investment Bank | Large, Well Funded, Financial Services |
| TC02 | Small Rural Hospital | Small, Limited, Healthcare |
| TC03 | Mid-size Regional Bank | Medium, Moderate, Financial Services |
| TC04 | Large Power Grid Operator | Large, Well Funded, Energy and Utilities |
| TC05 | Small Manufacturing Plant | Small, Limited, Manufacturing and OT |
| TC06 | Large Teaching Hospital | Large, Well Funded, Healthcare |
| TC07 | Mid-size Fintech Startup | Medium, Moderate, Financial Services |

**Validation Process (3 phases per case):**
1. DukeGPT answers all applicable questions in batches with consistent org context
2. Scoring engine calculates Global Resilience Index from AI answers
3. DukeGPT independently predicts a score based on its answer distribution
4. Engine score and AI score compared — deviation measured and classified

**Results:**
- 2 Validated (≤10% delta, exact or adjacent tier)
- 4 Acceptable (≤20% delta, adjacent tier)
- 1 Needs Review
- Extreme cases (TC02, TC05) showed tightest alignment — 2–8% delta
- Larger complex organisations showed expected AI drift due to stateless batch constraints

---

## Project Structure

CyberResilienceTool/

├── index.html              — Landing page

├── ai_test_runner.html     — AI validation test runner

├── css/
│   └── style.css           — Full styling

└── js/
│   └── questions.js        — Complete question bank, scoring engine, applicability logic
    └── app.js              — Assessment flow, results, AI recommendations

---

## Setup

1. Clone the repository
2. In `js/app.js` replace `YOUR_DUKE_API_TOKEN` with your DukeGPT API token
3. In `ai_test_runner.html` replace `YOUR_DUKE_API_TOKEN` with your DukeGPT API token
4. Open `index.html` in a browser — no build step required

**Note:** AI features require a valid Duke University DukeGPT API token 
(GPT 4.1 Mini via Duke OIT LiteLLM). The assessment tool works fully without 
the token — only the AI recommendation and validation features require it.
