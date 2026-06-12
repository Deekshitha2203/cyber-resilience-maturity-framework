// ============================================================
// CYBER RESILIENCE MATURITY FRAMEWORK — COMPLETE QUESTION BANK
// Version: Final | All filters extracted from source sheet formulas
// ============================================================

const FRAMEWORK = {

  // ----------------------------------------------------------
  // SCORING LOOKUP TABLES
  // ----------------------------------------------------------

  scoringTables: {
  implementation: {
    "MISSING: Does not exist":                    0,
    "INITIAL: Ad hoc, undocumented":              0.25,
    "DEVELOPING: Partially implemented":          0.5,
    "DEFINED: Fully documented and implemented":  0.75,
    "OPTIMISED: Continuously improved":           1.0
  },
  testType: {
    "UNTESTED: Never exercised":                  0,
    "SELF-REPORT: Owner attestation only":        0.2,
    "THEORETICAL: Policy exists, never exercised":0.35,
    "TABLETOP: Discussion based exercise":        0.55,
    "FUNCTIONAL: Partial live test":              0.8,
    "FULL: Live end to end test":                 1.0
  },
  stressTested: {
    "NO: Never stress tested":                    0,
    "PARTIAL: Single failure scenario tested":    0.5,
    "MULTIPLE: Multiple simultaneous failures":   1.0
  },
  lastReviewed: {
    "NEVER: Never reviewed":                      0,
    "OVER 2 YEARS: More than 2 years ago":        0.2,
    "180 TO 365 DAYS: 6-12 months ago":           0.5,
    "90 TO 180 DAYS: 3-6 months ago":             0.75,
    "WITHIN 90 DAYS: Last 3 months":              1.0
  },
  coverageScope: {
    "NO COVERAGE: Not deployed":                  0,
    "LIMITED: Less than 25% of environment":      0.25,
    "PARTIAL: 25-50% of environment":             0.5,
    "CRITICAL SYSTEMS: Tier 1 systems only":      0.75,
    "FULL SCOPE: All systems across organisation":1.0
  }
},

  // ----------------------------------------------------------
  // SUB-DIMENSION WEIGHTS
  // ----------------------------------------------------------

  subWeights: {
    implementation: 0.35,
    testType: 0.25,
    coverageScope: 0.20,
    lastReviewed: 0.15,
    stressTested: 0.05
  },

  // ----------------------------------------------------------
  // BASIC QUESTIONS — ORG PROFILING
  // ----------------------------------------------------------

  basicQuestions: {

    // SECTION 1: Org Type
    orgType: {
      question: "What type of organisation is this?",
      options: [
        "Healthcare",
        "Financial Services",
        "Energy and Utilities",
        "Manufacturing and OT",
        "Other"
      ]
    },

    // SECTION 2: Size Inputs (total score → orgSize)
    // Total score: 0-4=Small, 5-8=Medium, 9+=Large
    sizeInputs: [
      {
        key: "employees",
        question: "How many employees does the organisation have?",
        options: ["Less than 50", "50 to 200", "201 to 1000", "More than 1000"],
        scores: [0, 1, 2, 3]
      },
      {
        key: "revenue",
        question: "What is the annual revenue or operating budget?",
        options: ["Less than 10M", "10M to 100M", "100M to 1B", "More than 1B"],
        scores: [0, 1, 2, 3]
      },
      {
        key: "locations",
        question: "How many physical locations does the organisation operate from?",
        options: ["1", "2 to 10", "11 to 50", "More than 50"],
        scores: [0, 1, 2, 3]
      },
      {
        key: "multiCountry",
        question: "Does the organisation operate across multiple countries?",
        options: ["No", "Yes"],
        scores: [0, 2]
      },
      {
        key: "criticalSystems",
        question: "How many critical systems does the organisation depend on for core operations?",
        options: ["Less than 5", "5 to 20", "21 to 50", "More than 50"],
        scores: [0, 1, 2, 3]
      }
    ],

    // SECTION 3: Funding Inputs (total score → fundingLevel)
    // Total score: 0-3=Limited, 4-6=Moderate, 7+=Well Funded
    fundingInputs: [
      {
        key: "cyberBudget",
        question: "Does the organisation have a dedicated cybersecurity budget separate from general IT?",
        options: ["No", "Yes"],
        scores: [0, 2]
      },
      {
        key: "budgetPercent",
        question: "What percentage of the IT budget is allocated to cybersecurity?",
        options: ["Less than 5%", "5 to 10%", "10 to 15%", "More than 15%"],
        scores: [0, 1, 2, 3]
      },
      {
        key: "securityStaff",
        question: "Does the organisation have dedicated in-house security staff?",
        options: ["None", "1 to 5 people", "6 to 20 people", "More than 20 people"],
        scores: [0, 1, 2, 3]
      },
      {
        key: "mssp",
        question: "Does the organisation use any managed security service providers?",
        options: ["No", "Yes"],
        scores: [0, 1]
      },
      {
        key: "cyberInsurance",
        question: "Has the organisation invested in cyber insurance?",
        options: ["No", "Yes"],
        scores: [0, 1]
      }
    ],

    // SECTION 4: Technology Environment (Yes/No flags)
    techInputs: [
      { key: "usesCloud",          question: "Does the organisation use cloud services?" },
      { key: "usesOT",             question: "Does the organisation use operational technology or industrial control systems?" },
      { key: "usesAI",             question: "Does the organisation use AI tools internally?" },
      { key: "usesAgenticAI",      question: "Does the organisation use agentic AI systems that take autonomous actions?" },
      { key: "processesPayments",  question: "Does the organisation process payments or handle financial transactions?" },
      { key: "sensitiveData",      question: "Does the organisation handle sensitive personal data such as health records or financial data?" },
      { key: "thirdPartyVendors",  question: "Does the organisation depend on third party vendors for critical operations?" },
      { key: "softwareDev",        question: "Does the organisation have a software development function?" }
    ],

    // SECTION 5: Regulatory Environment (multi-select)
    regulations: {
      question: "Which regulations apply to your organisation?",
      multiSelect: true,
      options: [
        "ISO 27001", "HIPAA", "SEC", "DORA", "PCI DSS",
        "GDPR", "NIST CSF", "SOC2", "NERC CIP", "SOX", "FCA", "None"
      ]
    }
  },

  // ----------------------------------------------------------
  // TIER CALCULATION HELPERS
  // ----------------------------------------------------------

  calcOrgSize(sizeScore) {
    if (sizeScore <= 4) return "Small";
    if (sizeScore <= 8) return "Medium";
    return "Large";
  },

  calcFundingLevel(fundingScore) {
    if (fundingScore <= 3) return "Limited";
    if (fundingScore <= 6) return "Moderate";
    return "Well Funded";
  },

  // ----------------------------------------------------------
  // PILLAR DEFINITIONS
  // ----------------------------------------------------------

  pillars: {

    // --------------------------------------------------------
    // PILLAR 1 — GOVERNANCE AND COMMAND
    // --------------------------------------------------------
    governance: {
      name: "Governance and Command",
      code: "G",
      questions: [

        // PEOPLE
        { id:"G_P1",  w:3, q:"Is there a named senior leader responsible for cyber resilience with formal written authority to make decisions during an incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["G_P3","G_P4","G_P22"] },
        { id:"G_P2",  w:3, q:"Is there a backup leader ready to immediately assume full cyber resilience authority if the primary is unavailable during a crisis?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P3",  w:3, q:"Does the CISO or equivalent have a direct reporting line to the Board of Directors independent of the CEO?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_P1", cascadeChildren:[] },
        { id:"G_P4",  w:3, q:"Is there a designated deputy CISO or backup security leader who can assume full authority if the primary is unavailable?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_P1", cascadeChildren:[] },
        { id:"G_P5",  w:3, q:"Does a formal succession plan exist for the CEO, CISO, CTO, and CRO roles specifically covering cyber incident scenarios?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P6",  w:3, q:"Is there a dedicated Crisis Management Team with named members from IT, Security, Legal, Finance, HR, Communications, and Operations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["G_P7","G_P8"] },
        { id:"G_P7",  w:3, q:"Has every Crisis Management Team member had their role and responsibilities formally documented and confirmed in writing?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_P6", cascadeChildren:[] },
        { id:"G_P8",  w:2, q:"Has the Crisis Management Team been reviewed and updated in the last 6 months to reflect any personnel or structural changes?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_P6", cascadeChildren:[] },
        { id:"G_P9",  w:3, q:"Is there a Technical Liaison whose formal job is to translate technical cyber incidents into plain business language for executive leadership?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P10", w:3, q:"Is there a designated Crisis Communications Spokesperson trained to handle media, regulator, and public communications during a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P11", w:3, q:"Does every department head know exactly who to call within the first 15 minutes of suspecting a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P12", w:3, q:"Is there a named individual responsible for owning regulatory compliance across every jurisdiction the organisation operates in?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P13", w:3, q:"Is there a named Vendor Risk Manager responsible for continuously overseeing the security posture of all third party relationships?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_P14", w:3, q:"Is there a named AI Risk Owner responsible for governing the use of AI tools and managing AI specific risks across the organisation?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_P15", w:3, q:"Is there a named owner responsible for governing agentic AI systems including risks of autonomous decision making and unintended actions?", f:{org:"all",size:"all",fund:"all",tech:"usesAgenticAI"}, cascadeChildren:[] },
        { id:"G_P16", w:3, q:"Is there a formal insider threat program with a named owner actively monitoring behavioral indicators across critical systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P17", w:3, q:"Have all privileged users including system administrators and database administrators received advanced security training in the last 12 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P18", w:3, q:"Has the Board of Directors received formal cybersecurity training tailored to the threats facing the organisation's sector in the last 12 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P19", w:3, q:"Has the Board of Directors participated in a cyber crisis simulation or tabletop exercise in the last 12 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P20", w:3, q:"Is there a cybersecurity expert serving as a permanent Board member or formal Board advisor with regular Board meeting access?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P21", w:2, q:"Are cyber resilience responsibilities formally embedded in the job descriptions and performance reviews of all senior leaders?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P22", w:3, q:"Is the CISO's performance formally measured against cyber resilience outcomes such as Mean Time to Detect and Mean Time to Recover?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_P1", cascadeChildren:[] },
        { id:"G_P23", w:3, q:"Is there a confirmed reserve roster of trained IT and security staff available for 24 hour 7 day emergency shift coverage during a major incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P24", w:2, q:"Are all employees trained on their individual cyber resilience responsibilities at least once a year?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P25", w:2, q:"Is there a genuinely blameless reporting culture where employees feel safe to report suspicious activity without fear of punishment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P26", w:2, q:"Are third party operational support staff and managed service providers formally included in cyber resilience training and drills?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_P27", w:3, q:"Is there a named individual responsible for tracking how adversaries are using AI to evolve attack techniques and translating findings into defensive improvements?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_P28", w:3, q:"Is there a named individual responsible for monitoring supply chain security developments and ensuring the organisation responds to emerging supply chain threats?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_P29", w:2, q:"Is there a named individual responsible for managing cyber resilience implications of any merger, acquisition, outsourcing, or major business change?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P30", w:2, q:"Is there a named individual responsible for developing the next generation of cyber resilience talent within the organisation?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"G_P31", w:3, q:"Are all staff with access to operational technology systems trained on the specific cyber risks associated with OT environments?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P32", w:3, q:"Do field engineers understand how to safely operate critical equipment during loss of digital control systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P33", w:3, q:"Are operators trained on manual procedures to maintain operations if critical OT systems become unavailable?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P34", w:3, q:"Is there a designated leader responsible for driving adoption and effective use of AI enabled security capabilities across OT environments?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","usesAI"]}, cascadeChildren:[] },
        { id:"G_P35", w:3, q:"Is there a named incident response leader for coordinating cyber incident response across IT, OT systems, AI systems, and third party supply chains?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P36", w:3, q:"Do leadership teams have clearly defined roles during incidents that directly impact critical infrastructure systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P37", w:2, q:"Are employees regularly trained to identify and respond to cyber threats affecting operational technology, AI platforms, and supply chain vulnerabilities?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P38", w:3, q:"Does the organisation regularly conduct tabletop exercises including external stakeholders such as supply chain vendors to test responses to crises involving AI systems and OT infrastructure?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_P39", w:3, q:"Is there a formal process to ensure third party vendors providing AI powered systems are held accountable for their security practices during an incident affecting critical infrastructure?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","usesAI","thirdPartyVendors"]}, cascadeChildren:[] },
        { id:"G_P40", w:3, q:"Is there a Board level individual or committee responsible for reviewing cyber resilience as a patient safety metric?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P41", w:3, q:"Does the CISO have the authority to isolate network segments during a crisis without requiring additional approvals?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_P1", cascadeChildren:[] },
        { id:"G_P42", w:3, q:"Are clinical department heads accountable for the security hygiene of their unit's medical devices and equipment?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P43", w:3, q:"Is there a designated AI Ethics and Security Officer responsible for the clinical safety and bias review of all automated clinical decision tools?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_P44", w:3, q:"Is there a designated individual responsible for reviewing the security of third party software updates before they are approved for clinical networks?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P45", w:3, q:"Are procurement teams trained to verify security by design claims made by medical equipment manufacturers?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P46", w:3, q:"Are staff trained to recognize and report AI hallucinations or errors in AI suggested clinical diagnoses through a no blame feedback system?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_P47", w:3, q:"Are board members trained to verify instructions using a secondary out of band channel to prevent deepfake executive impersonation?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_P48", w:2, q:"Is there a Security Champion or Security Point of Contact designated for each clinical department or district?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P49", w:3, q:"Are staff trained to identify deepfake audio calls designed to trick them into leaking patient credentials or clinical information?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_P50", w:3, q:"Is there a named CISO or equivalent with formal authority over cyber resilience decisions across all financial systems and operations?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P51", w:3, q:"Is there a named individual responsible for financial crime risk including cyber enabled fraud, payment fraud, and money laundering?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"G_P52", w:3, q:"Are all staff with access to critical financial systems trained on the specific cyber risks they face in their role?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P53", w:3, q:"Is there a designated crisis spokesperson trained specifically for financial sector media and regulatory scrutiny?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P54", w:3, q:"Has the Board attended a cyber drill specifically simulating financial sector attack scenarios such as core banking compromise or payment fraud?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_P55", w:3, q:"Is there a named individual responsible for coordinating with financial market infrastructure operators such as payment networks and clearing houses during a disruption?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },

        // PROCESS
        { id:"G_PR1",  w:3, q:"Does the organisation have a formally documented and Board approved cyber resilience strategy that is reviewed and updated at least annually?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["G_PR2","G_PR3"] },
        { id:"G_PR2",  w:3, q:"Is there a documented incident response plan tailored to the specific threats facing the organisation's sector and operating environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_PR1", cascadeChildren:[] },
        { id:"G_PR3",  w:3, q:"Has the incident response plan been reviewed and updated in the last 6 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_PR1", cascadeChildren:[] },
        { id:"G_PR4",  w:3, q:"Is there a clearly defined and documented escalation path that specifies who gets notified, how, and within what timeframe at every stage of a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["G_PR5"] },
        { id:"G_PR5",  w:3, q:"Does the escalation path include specific time thresholds for notifying each level of leadership for example notifying the CEO within 1 hour and the Board within 4 hours of a critical incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_PR4", cascadeChildren:[] },
        { id:"G_PR6",  w:3, q:"Is there a pre approved authority matrix that allows technical teams to take immediate containment actions without waiting for executive approval during an active incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR7",  w:3, q:"Is there a pre approved emergency budget that can be accessed immediately during an incident without a lengthy approval process?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR8",  w:3, q:"Is there a clear documented process for classifying a major incident versus a minor security event with specific criteria for each?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR9",  w:3, q:"Are crisis communication templates for staff, customers, regulators, and media pre written and legally reviewed and ready to use immediately during an incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR10", w:3, q:"Is there a regulatory notification roadmap mapping every applicable regulation to its required notification timeline and a named owner?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR11", w:3, q:"Is there a legal hold process ready to activate immediately to preserve all digital evidence before any recovery or remediation actions begin?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR12", w:3, q:"Are tabletop exercises simulating sector relevant attack scenarios conducted at least twice a year involving all Crisis Management Team members?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR13", w:3, q:"Has a full live simulation or red team exercise been conducted targeting the organisation's most critical systems in the last 12 months?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR14", w:3, q:"Are lessons learned from every incident and exercise formally tracked and verified as implemented within defined timeframes?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR15", w:3, q:"Is there a formal process governing how AI tools and agentic AI systems are evaluated, approved, monitored, and decommissioned across the organisation?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_PR16", w:3, q:"Is there a documented supply chain risk management process covering all software vendors, hardware suppliers, and managed service providers?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_PR17", w:3, q:"Is there a formal process for assessing cyber resilience risks before any new product, service, or technology goes live?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR18", w:2, q:"Are all cyber resilience policies formally documented, version controlled, approved by leadership, and reviewed at least annually?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR19", w:3, q:"Is there a documented process for coordinating incident response with sector specific regulators, national cybersecurity agencies, and law enforcement?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR20", w:2, q:"Is cyber insurance coverage reviewed at least annually to ensure it reflects the current risk profile and emerging threats?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR21", w:3, q:"Is there a formal process for conducting blameless post incident reviews after every significant security event with all findings tracked through to verified completion?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR22", w:2, q:"Is there a defined process for standing down from a crisis and formally returning to normal operations with sign off from all relevant teams?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR23", w:2, q:"Is there a formal process for managing cyber resilience during periods of significant staff turnover, organisational restructuring, or leadership change?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR24", w:2, q:"Are all third party vendor contracts and partner agreements reviewed at least annually for cyber resilience obligations?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_PR25", w:3, q:"Is there a formal process for managing cyber resilience risks introduced by mergers, acquisitions, or major outsourcing arrangements before they are completed?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR26", w:3, q:"Is there a formal process for managing cyber resilience risks specific to cloud environments including misconfiguration risk and data sovereignty?", f:{org:"all",size:"all",fund:"all",tech:"usesCloud"}, cascadeChildren:[] },
        { id:"G_PR27", w:3, q:"Is there a documented process for managing cyber resilience risks specific to OT environments including industrial control systems and SCADA systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_PR28", w:2, q:"Is there a documented process for maintaining cyber resilience governance continuity during a prolonged incident that extends beyond the initial crisis response phase?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR29", w:3, q:"Does the organisation have a documented process for complying with DORA requirements including ICT risk management, incident reporting, and third party oversight?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR30", w:3, q:"Is there a documented process for meeting SEC cybersecurity disclosure requirements including the 4 day material incident reporting rule?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR31", w:3, q:"Is there a documented incident response plan that specifically addresses financial sector scenarios such as payment fraud, core banking outages, and trading system failures?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR32", w:3, q:"Does the organisation conduct tabletop exercises simulating financial sector specific scenarios such as ransomware hitting core banking or SWIFT network compromise at least twice a year?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR33", w:3, q:"Is there a documented process for complying with HIPAA requirements including breach notification, risk analysis, and minimum necessary access standards?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR34", w:3, q:"Is there a formal policy defining the maximum allowable downtime for every critical clinical department and system?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR35", w:3, q:"Is there a formal policy defining which clinical tasks are allowed to use generative AI and under what conditions?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_PR36", w:3, q:"Is the security strategy audited at least annually by an external party against an established framework such as HITRUST or NIST CSF?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR37", w:3, q:"Is there a formal process for vetting the security of all new medical devices and software vendors before they are approved for the clinical network?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_PR38", w:3, q:"Does the hospital crisis plan include a specific response for AI driven disinformation attacks targeting the organisation's reputation or patient communications?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_PR39", w:3, q:"Is there a documented process for managing cyber resilience during incidents affecting OT systems including defined escalation paths for operational technology failures?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_PR40", w:3, q:"Is there a documented process for continuously updating the incident response strategy considering emerging AI risks, evolving supply chains, and regulatory changes such as NERC CIP and FERC?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_PR41", w:3, q:"Is there a formal process for assessing and managing risks introduced by AI tools used in critical OT and infrastructure operations?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","usesAI"]}, cascadeChildren:[] },
        { id:"G_PR42", w:3, q:"Is there a documented process for managing cyber resilience risks introduced by software development pipelines including CI/CD security and code integrity validation?", f:{org:"all",size:"all",fund:"all",tech:"softwareDev"}, cascadeChildren:[] },

        // TECHNOLOGY
        { id:"G_T1",  w:3, q:"Is there a SIEM actively deployed and monitored 24 hours a day 7 days a week across the entire environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T2",  w:3, q:"Is there a dedicated out of band communication system completely separate from primary email and messaging for use during a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["G_T3"] },
        { id:"G_T3",  w:3, q:"Has the out of band communication system been tested in the last 6 months to confirm it works when primary systems are compromised?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"G_T2", cascadeChildren:[] },
        { id:"G_T4",  w:2, q:"Is there a real time incident management dashboard giving both technical teams and executive leadership visibility into the status of an active cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T5",  w:3, q:"Are privileged access controls enforced so only authorised individuals can execute critical containment or system shutdown actions?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T6",  w:3, q:"Does the organisation have an IAM system capable of immediately revoking all access for a compromised account across every connected system simultaneously?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T7",  w:3, q:"Is there a secure digital vault storing all crisis response documentation including contact lists, playbooks, and authority matrices accessible even when primary systems are down?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T8",  w:2, q:"Is there a physical printed crisis binder stored securely at multiple locations containing all critical response procedures and contact details for use when all digital systems are unavailable?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T9",  w:3, q:"Are all governance actions and decisions taken during a cyber incident automatically logged and timestamped for regulatory and forensic purposes?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T10", w:2, q:"Is there a GRC platform actively used to manage governance, risk, and compliance activities in an integrated and real time manner?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T11", w:3, q:"Is there a technology tool that monitors regulatory changes across all jurisdictions and alerts the compliance team in real time when new obligations emerge?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T12", w:3, q:"Is there a digital forensics retainer in place with a specialist firm that can be activated within 2 hours of a major incident being declared?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T13", w:2, q:"Is there a staged dark site or emergency website pre configured and ready to deploy immediately if the primary public facing website is taken down?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T14", w:3, q:"Are deepfake detection tools deployed to identify AI generated audio or video impersonation attempts targeting executives or critical authorisation processes?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_T15", w:3, q:"Is there a technology solution providing real time visibility into the security posture of all critical third party vendors and supply chain partners?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_T16", w:3, q:"Is there a SOAR platform that automates initial containment actions for predefined incident scenarios to reduce response time?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"G_T17", w:2, q:"Are physical security controls for all data centers, server rooms, and critical operational facilities integrated into the cyber incident response plan?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T18", w:3, q:"Are agentic AI systems deployed in the organisation monitored for unauthorised actions, unexpected behaviors, and scope creep beyond their defined boundaries?", f:{org:"all",size:"all",fund:"all",tech:"usesAgenticAI"}, cascadeChildren:[] },
        { id:"G_T19", w:3, q:"Is there a tool that monitors the dark web and criminal forums for stolen credentials, sensitive data, and threat actor activity targeting the organisation or its sector?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T20", w:3, q:"Is there a technology solution that monitors OT networks and industrial control systems for cyber threats separately from standard IT network monitoring?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_T21", w:3, q:"Are logs from OT systems such as SCADA and industrial control systems integrated into centralised monitoring platforms?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_T22", w:3, q:"Is there a centralised incident management platform that tracks and coordinates incidents across both IT and OT systems in real time?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_T23", w:2, q:"Is there a monitoring dashboard that gives leadership immediate visibility into ongoing incidents impacting both critical infrastructure and supply chain operations?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"G_T24", w:3, q:"Is there a central dashboard showing the real time security health of all clinical, IT, and medical device systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T25", w:3, q:"Is there a 24 hour 7 day security operations center monitoring the network for patient data breaches and clinical system threats?", f:{org:"Healthcare",size:"all",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"G_T26", w:3, q:"Is there a central dashboard to monitor real time performance and accuracy of all clinical AI tools deployed across the organisation?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_T27", w:3, q:"Is there a tool that uses digital watermarking or signature verification to confirm the authenticity of official communications and prevent deepfake impersonation?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"G_T28", w:3, q:"Is virtual patching deployed to protect legacy medical devices that are no longer supported by their manufacturer?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"G_T29", w:3, q:"Is there a dedicated tool that tracks third party vendor vulnerabilities and their potential impact on the supply chain during a cyber incident?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"G_T30", w:2, q:"Is there an AI powered compliance monitoring tool that continuously identifies governance gaps and compliance failures across the organisation?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"usesAI"}, cascadeChildren:[] }
      ]
    },
    // --------------------------------------------------------
    // PILLAR 2 — RISK MANAGEMENT
    // --------------------------------------------------------
    risk: {
      name: "Risk Management",
      code: "R",
      questions: [

        // PEOPLE
        { id:"R_P1",  w:3, q:"Is there a named senior leader responsible for enterprise wide risk management including cyber risk with a direct reporting line to the Board?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["R_P2","R_P7","R_P11"] },
        { id:"R_P2",  w:3, q:"Is there a formal Risk Committee with members from IT, Security, Finance, Legal, Compliance, and Operations that meets regularly?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_P1", cascadeChildren:[] },
        { id:"R_P3",  w:3, q:"Is there a dedicated threat intelligence analyst either internal or outsourced monitoring the active threat landscape relevant to the organisation's sector?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P4",  w:3, q:"Is there a named Vendor Risk Manager responsible for continuously assessing the security posture of all third party relationships?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"R_P5",  w:3, q:"Have all privileged users received advanced security and insider threat training in the last 12 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P6",  w:3, q:"Is there a formal insider threat program with a named owner actively monitoring behavioral indicators across critical systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P7",  w:3, q:"Has leadership formally defined and documented the organisation's risk appetite covering acceptable levels of downtime, data loss, and financial impact?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_P1", cascadeChildren:[] },
        { id:"R_P8",  w:3, q:"Has leadership defined the risk appetite and risk tolerance specifically for critical operational infrastructure and assets?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_P9",  w:3, q:"Is there a named owner for AI specific risks covering both internal AI tool risks and AI powered attack risks from adversaries?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_P10", w:3, q:"Is there a named owner for risks introduced by agentic AI systems including risks of autonomous decision making and unintended actions?", f:{org:"all",size:"all",fund:"all",tech:"usesAgenticAI"}, cascadeChildren:[] },
        { id:"R_P11", w:2, q:"Do all Business Unit Leaders formally sign off on the cyber risk assessment for their area at least annually?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_P1", cascadeChildren:[] },
        { id:"R_P12", w:3, q:"Is there a named owner for concentration risk where the organisation depends heavily on a single vendor, cloud provider, or technology platform?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P13", w:2, q:"Are risk findings and threat intelligence communicated regularly to all relevant staff in a way they can understand?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P14", w:3, q:"Is there a named owner for risks introduced by automation and robotic process automation tools used in critical operations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P15", w:3, q:"Is there a named individual responsible for managing and tracking AI specific risks in clinical systems including risks of model bias, hallucination, and patient safety impact?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_P16", w:3, q:"Is there a named individual responsible for financial crime risk including cyber enabled fraud, payment fraud, and money laundering facilitated by cyber attacks?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"R_P17", w:2, q:"Are leadership team members and senior stakeholders actively involved in evaluating risks particularly those affecting infrastructure operations, AI systems, and supply chain vulnerabilities?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_P18", w:2, q:"Are employees aware of risks related to third party vendors supporting critical infrastructure systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_P19", w:2, q:"Do teams get regular training on risk identification, threat intelligence, and escalation procedures specific to their role and environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_P20", w:3, q:"Can staff identify phishing or social engineering attempts targeting sensitive data such as patient health records or financial information?", f:{org:["Healthcare","Financial Services"],size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },

        // PROCESS
        { id:"R_PR1",  w:3, q:"Does the organisation maintain a continuously updated risk register covering all critical systems, processes, and third party dependencies?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["R_PR2","R_PR22"] },
        { id:"R_PR2",  w:3, q:"Are all risks evaluated based on likelihood, business impact, and estimated financial loss?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_PR1", cascadeChildren:[] },
        { id:"R_PR3",  w:3, q:"Is there a formal Business Impact Analysis covering every critical process, its dependencies, and the financial impact of its disruption updated at least every 6 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["R_PR4","R_PR5"] },
        { id:"R_PR4",  w:3, q:"Is there a formally documented criticality tiering system classifying all systems and data by importance and recovery priority signed off by leadership?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_PR3", cascadeChildren:[] },
        { id:"R_PR5",  w:3, q:"Does the organisation know the exact financial impact per hour of downtime for each Tier 1 critical system?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_PR3", cascadeChildren:[] },
        { id:"R_PR6",  w:3, q:"Is there a formal data classification policy categorising all data by sensitivity and enforcing specific handling requirements for each category?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["R_PR7"] },
        { id:"R_PR7",  w:3, q:"Are crown jewel assets formally identified, documented, and subject to enhanced security controls above standard baselines?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_PR6", cascadeChildren:[] },
        { id:"R_PR8",  w:3, q:"Is there a formal third party risk assessment process for every vendor before onboarding based on their access to critical systems and data?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:["R_PR9","R_PR10"] },
        { id:"R_PR9",  w:3, q:"Are all active third party vendors periodically reassessed based on their risk tier?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeParent:"R_PR8", cascadeChildren:[] },
        { id:"R_PR10", w:3, q:"Does every vendor contract include a right to audit clause?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeParent:"R_PR8", cascadeChildren:[] },
        { id:"R_PR11", w:3, q:"Does the organisation maintain a Software Bill of Materials for all critical software documenting every component and dependency?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR12", w:3, q:"Are software updates verified for cryptographic integrity before being applied to critical systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR13", w:3, q:"Is there a shadow IT discovery process continuously identifying unauthorised applications, devices, and cloud services?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR14", w:3, q:"Is there a formal process for assessing and managing risks of AI tools used internally including data leakage, regulatory non compliance, and adversarial manipulation?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_PR15", w:3, q:"Are agentic AI systems formally assessed for risks including autonomous decision making, privilege escalation, and unintended actions before deployment?", f:{org:"all",size:"all",fund:"all",tech:"usesAgenticAI"}, cascadeChildren:[] },
        { id:"R_PR16", w:3, q:"Are AI models and training data formally classified as critical assets and included in the risk register?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_PR17", w:3, q:"Are adversarial AI risks including AI generated phishing, deepfakes, AI powered exploitation, and automated attacks formally included in the threat assessment?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_PR18", w:3, q:"Is there a formal process for managing concentration risk where too much dependency sits on one vendor, cloud provider, or platform?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR19", w:2, q:"Is there a documented sunset policy mandating review and decommissioning of hardware and software beyond a defined age or end of support lifecycle?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR20", w:3, q:"Is cyber risk formally integrated into the enterprise risk management framework and reported alongside financial and operational risks at Board level?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR21", w:2, q:"Is there a process for assessing quantum computing threats to current encryption standards used across critical systems?", f:{org:"all",size:"Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR22", w:3, q:"Are risk assessments reviewed and updated following every significant incident or major infrastructure change?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_PR1", cascadeChildren:[] },
        { id:"R_PR23", w:3, q:"Is there a formal process for assessing risks introduced by any emerging technology before it is adopted?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR24", w:3, q:"Is there a formal process for assessing and managing risks associated with cloud environments including misconfiguration and data sovereignty?", f:{org:"all",size:"all",fund:"all",tech:"usesCloud"}, cascadeChildren:[] },
        { id:"R_PR25", w:3, q:"Does the organisation follow a structured process to identify and assess risks across both IT and OT environments?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_PR26", w:3, q:"Are risks evaluated based on operational impact, safety implications, and likelihood of occurrence for critical infrastructure systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_PR27", w:3, q:"Are critical vulnerabilities in OT and infrastructure systems prioritized and remediated within defined service level agreements?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_PR28", w:3, q:"Is the risk management process adaptable to account for emerging technologies like AI and changes in the supply chain landscape for critical infrastructure operations?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_PR29", w:3, q:"Is a HIPAA risk analysis conducted annually for all systems containing electronic protected health information?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR30", w:3, q:"Is an AI specific risk assessment covering impact on patient safety required before any AI tool is deployed in a clinical environment?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_PR31", w:3, q:"Is there a policy for data privacy specifically covering patient data used to train or fine tune internal AI models?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_PR32", w:3, q:"Is there a formal security vetting process for all new medical devices and software vendors before they are approved for the clinical network?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR33", w:3, q:"Is an AI Bill of Materials required from all clinical AI vendors listing the models, training data sources, and versions they use?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_PR34", w:3, q:"Does the organisation have a documented process for complying with DORA risk management requirements including ICT risk assessment and third party oversight?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR35", w:3, q:"Is there a formal quantitative cyber risk model that expresses risks in financial terms to support Board level investment and prioritization decisions?", f:{org:"Financial Services",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_PR36", w:3, q:"Is there a formal process for assessing cyber risks associated with open banking APIs and third party data sharing arrangements?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },

        // TECHNOLOGY
        { id:"R_T1",  w:3, q:"Is there an automated asset inventory tool that continuously discovers and updates a complete inventory of all hardware, software, cloud assets, and connected devices?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T2",  w:3, q:"Is MFA enforced for 100% of all user logins across all systems including remote access and cloud services?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["R_T3"] },
        { id:"R_T3",  w:3, q:"Is phishing resistant MFA such as FIDO2 enforced specifically for all privileged and administrative accounts?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_T2", cascadeChildren:[] },
        { id:"R_T4",  w:3, q:"Is data at rest encryption enforced on all Tier 1 crown jewel databases and critical storage systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T5",  w:3, q:"Is data in transit encryption enforced across all internal and external connections carrying sensitive data?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T6",  w:3, q:"Is there an External Attack Surface Management tool continuously monitoring what is visible and exploitable from an attacker's perspective?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T7",  w:3, q:"Is there a vulnerability management program with continuous scanning, risk based prioritisation, and tracked remediation across the entire environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["R_T8"] },
        { id:"R_T8",  w:3, q:"Are critical patches applied to Tier 1 systems within a defined and enforced timeframe?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"R_T7", cascadeChildren:[] },
        { id:"R_T9",  w:3, q:"Is there a threat intelligence platform ingesting sector specific intelligence and distributing it to security tools in real time?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T10", w:3, q:"Is there an AI powered anomaly detection system identifying abnormal behavior across transactions, user activity, and network traffic?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_T11", w:3, q:"Is there a Data Loss Prevention tool monitoring sensitive data movement across all channels including email, web, cloud, and removable media?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T12", w:3, q:"Is there a Privileged Access Management solution enforcing least privilege, session recording, and just in time access across all critical systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T13", w:3, q:"Is there a Cloud Security Posture Management tool continuously monitoring all cloud environments for misconfigurations and security risks?", f:{org:"all",size:"all",fund:"all",tech:"usesCloud"}, cascadeChildren:[] },
        { id:"R_T14", w:3, q:"Is there a tool continuously monitoring the security posture of all critical third party vendors and alerting on deterioration?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"R_T15", w:3, q:"Is there an automated tool detecting vulnerable open source components across the software supply chain?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T16", w:3, q:"Is there a dark web monitoring tool watching for stolen credentials, sensitive data, and threat actor activity targeting the organisation or its sector?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T17", w:3, q:"Are AI models used in critical operations continuously monitored for drift, output anomalies, and signs of adversarial manipulation?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_T18", w:3, q:"Are agentic AI systems monitored for unauthorised actions, unexpected tool use, and behaviors outside their defined scope?", f:{org:"all",size:"all",fund:"all",tech:"usesAgenticAI"}, cascadeChildren:[] },
        { id:"R_T19", w:3, q:"Is there a network traffic analysis tool covering all network segments to detect lateral movement and command and control activity?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T20", w:3, q:"Is there a tool that continuously monitors and alerts on unauthorised changes to critical system configurations across all Tier 1 systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T21", w:3, q:"Are vulnerability assessments performed regularly on systems supporting critical infrastructure and OT operations?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_T22", w:3, q:"Are security and risk management tools integrated across AI systems and OT environments to ensure end to end visibility into critical infrastructure?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","usesAI"]}, cascadeChildren:[] },
        { id:"R_T23", w:3, q:"Can access control systems quickly restrict or isolate affected OT environments during a cyber incident to prevent further disruption?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"R_T24", w:3, q:"Is the network segmented to isolate life critical medical devices and IoMT from general IT and office systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T25", w:3, q:"Are automated tools used to instantly revoke access for staff who have left the organisation or had their credentials compromised?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"R_T26", w:3, q:"Are automated tools used to scan third party AI software updates for hidden backdoors or malicious code before deployment to clinical systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"R_T27", w:3, q:"Is there a fraud detection system using machine learning to identify anomalous transaction patterns indicative of cyber enabled financial fraud in real time?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"R_T28", w:3, q:"Is there a technology solution providing complete visibility into all API connections including open banking APIs, partner integrations, and internal microservice communications?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"R_T29", w:2, q:"Is there a post quantum cryptography roadmap in place and actively being implemented to protect sensitive data from future quantum computing threats?", f:{org:"all",size:"Large",fund:"Well Funded",tech:"all"}, cascadeChildren:[] }
      ]
    },

    // --------------------------------------------------------
    // PILLAR 3 — OPERATIONAL CONTINUITY
    // --------------------------------------------------------
    operational: {
      name: "Operational Continuity",
      code: "OC",
      questions: [

        // PEOPLE
        { id:"OC_P1",  w:3, q:"Is there a named Business Continuity Manager with formal authority to activate continuity plans during a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["OC_P2"] },
        { id:"OC_P2",  w:3, q:"Is there a deputy Business Continuity Manager ready to assume full authority if the primary is unavailable during a crisis?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"OC_P1", cascadeChildren:[] },
        { id:"OC_P3",  w:3, q:"Are business and IT teams formally aligned with clearly documented roles and responsibilities for maintaining operations during a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P4",  w:3, q:"Is there an executive with formal authority to order the shutdown of any critical system to contain a cyber threat without requiring additional approvals?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P5",  w:3, q:"Is there a critical personnel roster with backup staff identified for every critical role with confirmed 24 hour 7 day emergency coverage?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P6",  w:3, q:"Can at least two staff members in every department perform manual workarounds for critical tasks if primary systems go down?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P7",  w:3, q:"Have all IT and security first responders been specifically trained on network isolation, system containment, and critical system failover procedures?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P8",  w:3, q:"Are regular drills and simulations conducted at least twice a year testing operational continuity across all critical services simultaneously?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P9",  w:3, q:"Are staff trained on how to keep critical systems running in a reduced or degraded capacity during an incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P10", w:3, q:"Is there a formal training program ensuring all relevant staff know how to activate and operate every fallback and alternative system during a disruption?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P11", w:2, q:"Are employees across all levels trained to recognise and report early signs of a cyber attack affecting operational systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P12", w:2, q:"Is there a tested human communication cascade that can reach all staff within 30 minutes without relying on any digital systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P13", w:2, q:"Are third party vendors and managed service providers formally included in continuity drills with documented roles during an incident?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"OC_P14", w:3, q:"Is there a named liaison responsible for coordinating with external operators and market infrastructure partners during a disruption?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P15", w:3, q:"Do teams coordinate effectively across IT and OT operations during outages including incidents originating from supply chain partners or automated systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_P16", w:3, q:"Do field engineers understand how to safely operate substations and critical equipment during loss of digital control systems?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_P17", w:3, q:"Are operators aware of manual procedures to maintain operations if critical OT systems become unavailable?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_P18", w:3, q:"Are external contractors and vendors supporting critical infrastructure trained on continuity expectations and their specific roles during an incident?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_P19", w:3, q:"Do nurses and clinical staff know the location of paper charts and manual procedures in their units for use during a total system blackout?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P20", w:3, q:"Can clinical engineers manually override or reset connected medical equipment if the network fails?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P21", w:3, q:"Is there a designated Incident Coordinator in each clinical department to lead operations during a technology blackout?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P22", w:3, q:"Can admin staff perform patient admissions and pharmacy orders manually during a system failure?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_P23", w:3, q:"Is there a designated Human in the Loop required to approve any AI suggested high risk clinical decisions such as medication changes during a crisis?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"OC_P24", w:3, q:"Are staff trained on how to provide safe care if the primary clinical AI assistant becomes unavailable or starts producing unreliable outputs?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"OC_P25", w:3, q:"Is there a named liaison responsible for coordinating with financial market infrastructure operators such as payment networks and clearing houses during a disruption?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },

        // PROCESS
        { id:"OC_PR1",  w:3, q:"Does the organisation have a formally documented and Board approved Business Continuity Plan that specifically addresses cyber incident scenarios?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["OC_PR2"] },
        { id:"OC_PR2",  w:3, q:"Is the Business Continuity Plan reviewed, tested, and updated at least every 6 months and following every significant incident or major business change?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"OC_PR1", cascadeChildren:[] },
        { id:"OC_PR3",  w:3, q:"Is there a formally documented Business Impact Analysis covering every critical process, its dependencies, its RTO, and its RPO signed off by leadership?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["OC_PR4","OC_PR5"] },
        { id:"OC_PR4",  w:3, q:"Are Recovery Time Objectives formally defined and signed off by leadership for every critical system and process?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"OC_PR3", cascadeChildren:[] },
        { id:"OC_PR5",  w:3, q:"Are Recovery Point Objectives formally defined and signed off by leadership for every critical system and process?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"OC_PR3", cascadeChildren:[] },
        { id:"OC_PR6",  w:3, q:"Does a formally documented Minimum Viable Business list exist identifying the bare minimum systems, processes, and staff needed to keep the organisation operational during a major incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR7",  w:3, q:"Is there a formally documented network segmentation policy using VLANs, micro segmentation, or zero trust architecture to prevent lateral movement during an attack?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["OC_PR8"] },
        { id:"OC_PR8",  w:3, q:"Is there a documented and tested process for isolating any individual network segment within minutes without causing cascading failures across other critical services?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"OC_PR7", cascadeChildren:[] },
        { id:"OC_PR9",  w:3, q:"Are backup and recovery processes formally documented and tested at least quarterly to validate they meet defined RTOs and RPOs?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR10", w:2, q:"Are there documented paper based or offline standard operating procedures for every critical process stored in physical crisis binders at multiple secure locations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR11", w:3, q:"Is there a documented process for managing customer communications during an operational disruption including proactive notification of service impacts?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR12", w:3, q:"Is there a documented process for maintaining regulatory reporting obligations during a cyber incident when primary systems are unavailable?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR13", w:3, q:"Is there a documented concentration risk management process identifying and mitigating situations where the organisation depends on a single vendor or infrastructure component?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR14", w:3, q:"Is there a documented process for managing operational continuity during a supply chain compromise where a critical third party software or service is affected?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"OC_PR15", w:3, q:"Is there a documented process for maintaining operational continuity during a cloud provider outage or cloud service compromise?", f:{org:"all",size:"all",fund:"all",tech:"usesCloud"}, cascadeChildren:[] },
        { id:"OC_PR16", w:3, q:"Is there a documented process for operational continuity when AI powered systems used in critical processes fail, produce incorrect outputs, or are compromised?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"OC_PR17", w:3, q:"Is there a documented ransomware specific decision framework covering criteria for deciding whether to isolate systems versus maintain degraded operations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR18", w:3, q:"Are recovery processes aligned with safety requirements to ensure secure restart of industrial control systems after a disruption?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_PR19", w:3, q:"Are failover and redundancy strategies designed specifically for critical infrastructure systems such as substations, control centers, and generation units?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_PR20", w:3, q:"Does the organisation coordinate recovery processes with third party vendors managing critical OT or infrastructure components?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","thirdPartyVendors"]}, cascadeChildren:[] },
        { id:"OC_PR21", w:3, q:"Are procedures in place to ensure safe shutdown and restart of industrial control systems after a cyber disruption?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_PR22", w:3, q:"Does the Business Continuity Plan prioritize life saving clinical units such as ER and ICU over administrative functions during a cyber incident?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR23", w:3, q:"Does the Business Continuity Plan include a fallback to non AI workflows if the AI infrastructure is compromised or unavailable?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"OC_PR24", w:3, q:"Has the hospital established mutual aid agreements to divert patients to partner facilities if critical systems fail?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR25", w:3, q:"Is there a pre approved protocol for updating patients and families during a technology blackout using non digital communication methods?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_PR26", w:3, q:"Is there a manual override protocol for AI managed clinical systems such as automated pharmacies and HVAC if they become unavailable during an incident?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"OC_PR27", w:3, q:"Is there a documented and tested process for maintaining payment processing operations during a primary system outage?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"OC_PR28", w:3, q:"Is there a documented process for maintaining anti money laundering and fraud detection operations during a cyber incident where primary detection systems are unavailable?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },

        // TECHNOLOGY
        { id:"OC_T1",  w:3, q:"Can any individual network segment be isolated within minutes without causing unplanned disruption to other critical services?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T2",  w:3, q:"Is Endpoint Detection and Response deployed and actively monitored on 100% of all endpoints across the entire organisation?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T3",  w:3, q:"Is there a fully operational secondary data center or cloud environment that can assume all critical workloads within the defined RTO if the primary fails?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T4",  w:3, q:"Is there a secondary internet connection with automatic failover to a redundant ISP that activates without manual intervention?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T5",  w:3, q:"Are load balancers configured to automatically detect and redirect traffic away from compromised or degraded servers without manual intervention?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T6",  w:3, q:"Are all critical applications deployed with active active or active passive redundancy so operations continue without interruption if one instance fails?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T7",  w:3, q:"Is there an automated failover mechanism for all critical databases that activates within minutes without requiring manual intervention?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T8",  w:3, q:"Is there a Zero Trust network architecture implemented across critical systems that verifies every user and device regardless of network location?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T9",  w:3, q:"Are network access controls implemented to restrict lateral movement between systems during an active incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T10", w:3, q:"Is there a SOAR platform that automates containment and response actions for defined incident scenarios to reduce response time?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T11", w:3, q:"Are all critical systems monitored for performance degradation and availability issues in real time with automated alerting?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T12", w:3, q:"Is there an automated mechanism that detects unauthorised changes to critical system configurations and automatically alerts or reverts them?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T13", w:3, q:"Is there a dedicated out of band management network allowing IT teams to access and control critical systems even when the primary network is compromised?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T14", w:3, q:"Are critical systems protected by DDoS mitigation services capable of absorbing large scale volumetric attacks without service disruption?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T15", w:3, q:"Is there a Web Application Firewall protecting all customer facing applications from common web based attacks?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T16", w:3, q:"Are robotic process automation and intelligent automation tools monitored for anomalous behavior and protected against manipulation or hijacking?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T17", w:3, q:"Is there a real time monitoring tool providing visibility into the operational status of all critical third party services and external dependencies?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"OC_T18", w:3, q:"Is there real time synchronization or replication between primary and secondary control systems to ensure high availability for critical operations?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_T19", w:3, q:"Are edge devices and IoT components within critical infrastructure networks included in continuity and recovery planning?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_T20", w:3, q:"Is there redundancy built into control centers or energy management systems to ensure uninterrupted operations during a cyber incident?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"OC_T21", w:3, q:"Are monitoring tools capable of detecting failures or anomalies in AI driven control systems used in critical operations?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","usesAI"]}, cascadeChildren:[] },
        { id:"OC_T22", w:3, q:"Is the hospital network segmented to isolate life critical IoMT devices from general IT and office systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T23", w:3, q:"Is there a technical block preventing unauthorized use of public AI tools on clinical networks to protect patient data?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"OC_T24", w:3, q:"Are all clinical computers set to auto update so they receive critical security patches automatically during low census periods?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T25", w:3, q:"Is there a system to verify the digital signature of any vendor software patch before it is installed on clinical or medical device systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"OC_T26", w:3, q:"Is there an API gateway with security controls protecting all financial APIs including open banking connections from abuse and unauthorized access?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"OC_T27", w:3, q:"Is there a technology solution enabling the organisation to maintain settlement and reconciliation operations during a cyber incident affecting primary financial systems?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] }
      ]
    },
    // --------------------------------------------------------
    // PILLAR 4 — TRUSTED RECOVERY
    // --------------------------------------------------------
    recovery: {
      name: "Trusted Recovery",
      code: "TR",
      questions: [

        // PEOPLE
        { id:"TR_P1",  w:3, q:"Is there a named Recovery Manager with formal authority to lead all system and data recovery operations following a cyber incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["TR_P2","TR_P7","TR_P11"] },
        { id:"TR_P2",  w:3, q:"Is there a deputy Recovery Manager ready to assume full authority if the primary is unavailable during a recovery operation?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"TR_P1", cascadeChildren:[] },
        { id:"TR_P3",  w:3, q:"Is there a formally constituted Recovery Team with named individuals from IT, Security, Database Administration, Network Engineering, and Business Operations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["TR_P4"] },
        { id:"TR_P4",  w:3, q:"Is there a reserve roster of trained staff with confirmed availability for 24 hour 7 day recovery shift coverage during a major incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"TR_P3", cascadeChildren:[] },
        { id:"TR_P5",  w:3, q:"Has the recovery team performed a full bare metal recovery exercise rebuilding critical systems entirely from scratch within the last 12 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P6",  w:3, q:"Is a two person dual authorization rule enforced for any action that deletes, modifies, or overwrites backup data or recovery systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P7",  w:3, q:"Is there a designated Verification Officer responsible for independently checking that all restored data and systems are clean before returning to production?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"TR_P1", cascadeChildren:[] },
        { id:"TR_P8",  w:3, q:"Have all recovery team members received specialized training in ransomware recovery procedures including clean room restoration and malware eradication in the last 12 months?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P9",  w:3, q:"Have all recovery team members received training on recovering AI systems including validating model integrity and detecting signs of model poisoning?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_P10", w:3, q:"Is there a named individual responsible for coordinating with regulators, auditors, and legal counsel throughout the recovery process?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P11", w:3, q:"Is there a named individual responsible for communicating recovery progress and restoration timelines to executive leadership and the Board throughout a recovery operation?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"TR_P1", cascadeChildren:[] },
        { id:"TR_P12", w:3, q:"Does the legal team have pre vetted breach notification letters ready for all relevant regulatory jurisdictions that can be activated within hours of a confirmed incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P13", w:3, q:"Are all recovery team members trained on legal hold obligations to preserve digital evidence before any system is wiped or rebuilt during recovery?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P14", w:2, q:"Is there a named individual responsible for tracking and verifying completion of all post recovery validation checks before formally declaring recovery complete?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P15", w:3, q:"Are employees trained to validate the integrity of systems such as SCADA, ICS, and field devices before restoring normal operations after an incident?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_P16", w:3, q:"Are teams trained to verify configurations of PLCs, RTUs, and DCS systems before bringing them back online after a cyber incident?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_P17", w:2, q:"Are employees aware of the risks of restoring systems using outdated firmware or insecure configurations after an incident?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_P18", w:3, q:"Is there a team of clinicians such as doctors and pharmacists designated to verify that restored clinical data is accurate and safe before it is used for patient care?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P19", w:3, q:"Is the recovery team trained to verify that AI models have not been poisoned or tampered with during an attack before restoring them to clinical use?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_P20", w:3, q:"Does the Hospital Director understand the legal timelines for reporting a data breach to the relevant Ministry or Health Authority?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P21", w:2, q:"Is mental health and workflow support provided to clinical staff during the transition back to digital operations after a prolonged technology outage?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_P22", w:3, q:"Are legal teams prepared for the unique liability implications of AI driven clinical errors that occurred during the system recovery phase?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },

        // PROCESS
        { id:"TR_PR1",  w:3, q:"Is there a formally documented and Board approved recovery strategy covering all critical systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:["TR_PR2"] },
        { id:"TR_PR2",  w:3, q:"Is there a prioritized recovery list classifying all systems into formal tiers with defined RTOs signed off by business leadership?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeParent:"TR_PR1", cascadeChildren:[] },
        { id:"TR_PR3",  w:3, q:"Are recovery priorities formally validated with business unit leaders at least annually to ensure they reflect current business criticality?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR4",  w:3, q:"Is there a documented clean room restoration procedure defining the exact steps for rebuilding critical systems in a completely isolated environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR5",  w:3, q:"Is there a zero trust rule that prohibits any restored data or system from entering production without passing defined security validation checks?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR6",  w:3, q:"Is there a documented post incident forensic hold process defining which systems must be preserved and for how long before any recovery actions begin?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR7",  w:3, q:"Is there a documented process for threat hunting across the entire environment before declaring recovery complete to ensure no attacker persistence remains?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR8",  w:3, q:"Is there a documented process for verifying the integrity of the identity store including Active Directory before restoring any dependent systems?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR9",  w:3, q:"Is there a documented process for rebuilding the identity store from a known clean backup if it is found to be compromised?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR10", w:3, q:"Is there a documented process for resetting and reissuing all privileged credentials and certificates following a confirmed or suspected breach?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR11", w:3, q:"Is there a documented process for safely validating and reintegrating third party vendor systems before restoring their access after an incident?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"TR_PR12", w:3, q:"Is there a documented cloud exit strategy enabling the organisation to recover all critical workloads on premises or on an alternative platform if the primary cloud provider fails?", f:{org:"all",size:"all",fund:"all",tech:"usesCloud"}, cascadeChildren:[] },
        { id:"TR_PR13", w:3, q:"Is there a documented process for recovering AI models and training data including detection of poisoning or manipulation before returning them to production?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_PR14", w:3, q:"Is there a documented process for communicating with customers, regulators, and partners at defined intervals throughout the recovery process?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR15", w:3, q:"Is there a process for meeting all regulatory notification deadlines during recovery including DORA 4 hour initial notification and other applicable jurisdiction requirements?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR16", w:3, q:"Is there a documented process for conducting a comprehensive post recovery review that captures all lessons learned and translates them into specific improvements?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR17", w:3, q:"Are all recovery runbooks version controlled, stored in a location accessible without primary systems, and updated following every exercise or incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR18", w:3, q:"Is there a documented process for recovering from a supply chain compromise where a widely used software component is found to be infected across multiple systems?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"TR_PR19", w:3, q:"Is there a documented decision framework for ransomware incidents covering whether to pay or not pay ransom and the recovery implications of each path?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR20", w:3, q:"Is there a documented process for recovering from a destructive wiper malware attack where data and system configurations have been deliberately destroyed?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR21", w:3, q:"Are recovery processes tested against scenarios involving supply chain compromise or vendor originated incidents at least annually?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"TR_PR22", w:3, q:"Are recovery processes aligned with safety and operational risk requirements specific to OT and industrial control environments?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_PR23", w:3, q:"Is there a documented process for handling recovery of vendor managed or cloud connected OT platforms after a cyber incident?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:["usesOT","thirdPartyVendors"]}, cascadeChildren:[] },
        { id:"TR_PR24", w:3, q:"Is there a documented process to notify the relevant Health Authority or Ministry and the public if a breach affects patient data above a defined threshold?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_PR25", w:3, q:"Is there a validation process to ensure clean and unmanipulated data is used when retraining AI models after a breach or compromise?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_PR26", w:3, q:"Does the recovery plan include an audit of AI generated clinical notes for accuracy before they are published back into the permanent patient record post incident?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_PR27", w:3, q:"Is there a documented process for recovering core banking systems that includes transaction data reconciliation against external records before resuming customer operations?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"TR_PR28", w:3, q:"Is there a documented process for recovering payment systems that includes validation of in flight transactions and coordination with payment network operators?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },

        // TECHNOLOGY
        { id:"TR_T1",  w:3, q:"Are backups for all Tier 1 systems stored in an immutable write once read many format that prevents modification or deletion by any user including administrators?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T2",  w:3, q:"Is there a physical air gap or verified logical separation between all backup storage systems and the primary production network?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T3",  w:3, q:"Are backup copies maintained across at least three separate locations following a 3-2-1 or stronger backup strategy with at least one copy completely offline?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T4",  w:3, q:"Are encryption keys for all backup systems stored in a completely separate offline vault or dedicated hardware security module independent of the systems being backed up?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T5",  w:3, q:"Is there an automated tool that tests the restorability of all critical system backups at least weekly and immediately alerts the recovery team if any backup fails?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T6",  w:3, q:"Is there a pre configured clean room network environment completely isolated from production and ready for immediate use for safe system restoration?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T7",  w:3, q:"Is there a dedicated malware analysis sandbox where potentially compromised data and files can be safely examined before being used in recovery operations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T8",  w:3, q:"Is there a separate and secured DNS infrastructure available for use during clean room recovery operations independent of the primary DNS environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T9",  w:3, q:"Are all backup systems continuously monitored for unauthorized access attempts, anomalous access patterns, and changes to backup configurations?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T10", w:3, q:"Is there a PAM solution enforcing just in time access controls for all recovery system access with full session recording and audit logging?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T11", w:3, q:"Is there an automated tool that validates the cryptographic integrity of all backup data before it is used in any recovery operation?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T12", w:3, q:"Is there technology that can detect indicators of attacker persistence including backdoors, web shells, and modified binaries across the entire environment before recovery is declared complete?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T13", w:3, q:"Is there a technology solution enabling rapid rebuilding of critical system configurations from Infrastructure as Code templates stored in a secure version controlled repository?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T14", w:3, q:"Is there a technology solution providing complete visibility into all data flows and system interdependencies to enable accurate recovery sequencing during an incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T15", w:3, q:"Are AI model weights, training datasets, configuration files, and version histories backed up separately with the same immutability and air gap protections as Tier 1 systems?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_T16", w:3, q:"Is there a technology solution enabling real time monitoring of backup replication status with immediate alerting if replication falls behind or fails?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T17", w:3, q:"Is there a hardware security module used to protect all cryptographic keys used in transaction signing, encryption, and certificate management throughout recovery?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T18", w:3, q:"Is there a technology solution enabling the organisation to rapidly rebuild and reissue all digital certificates and cryptographic keys if certificate infrastructure is compromised?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T19", w:3, q:"Are all recovery tools, scripts, and automation frameworks stored in a secure version controlled location accessible even when primary systems are compromised?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T20", w:3, q:"Are backup systems protected from compromise using offline backups or immutable storage mechanisms specifically for OT and industrial control system data?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_T21", w:3, q:"Are recovery environments isolated from production during OT system restoration to prevent lateral movement or re-infection between IT and OT networks?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_T22", w:3, q:"Are cryptographic checks or hashing mechanisms used to validate the integrity of OT system backups before restoration?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"TR_T23", w:3, q:"Are backups stored on air gapped drives that are physically disconnected after every backup cycle to protect clinical data from ransomware?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T24", w:3, q:"Are tools used to compare restored clinical records against original paper records to ensure accuracy before data is returned to the live system?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"TR_T25", w:3, q:"Are AI model weights and clinical AI configurations included in the organisation's immutable backup strategy with the same protections as other critical systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_T26", w:3, q:"Are automated integrity tools used to ensure restored clinical AI algorithms have not been tampered with before they are returned to patient care use?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"TR_T27", w:3, q:"Is there a dedicated and tested technology solution for recovering SWIFT connectivity and interbank messaging capabilities within the defined RTO if primary SWIFT infrastructure is compromised?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] },
        { id:"TR_T28", w:3, q:"Is there a technology solution enabling the organisation to reconstruct a complete and auditable transaction history from distributed sources if primary transaction records are destroyed?", f:{org:"Financial Services",size:"all",fund:"all",tech:"processesPayments"}, cascadeChildren:[] }
      ]
    },

    // --------------------------------------------------------
    // PILLAR 5 — EVOLUTION AND ADAPTATION
    // --------------------------------------------------------
    evolution: {
      name: "Evolution and Adaptation",
      code: "EA",
      questions: [

        // PEOPLE
        { id:"EA_P1",  w:3, q:"Is there a named person responsible for driving continuous improvement of the organisation's cyber resilience based on incidents, exercises, and threat intelligence?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P2",  w:3, q:"Is there a cybersecurity expert serving as a permanent Board member or formal Board advisor actively challenging and guiding the organisation's resilience strategy?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P3",  w:3, q:"Is the CISO's performance and compensation formally tied to measurable resilience outcomes such as Mean Time to Detect, Mean Time to Respond, and Mean Time to Recover?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P4",  w:3, q:"Is there a dedicated threat intelligence team or named individual with protected time and budget for monitoring emerging threats relevant to the organisation's sector?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P5",  w:3, q:"Does the security team participate in at least one sector specific threat intelligence sharing community relevant to the organisation's industry?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P6",  w:3, q:"Is there a named person responsible for tracking regulatory changes across all applicable jurisdictions and translating them into specific updates to the organisation's controls?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P7",  w:3, q:"Is there a named person responsible for monitoring how adversaries are using AI to evolve attack techniques and translating findings into defensive improvements?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_P8",  w:3, q:"Is there a genuinely blameless post incident culture where staff at all levels are actively encouraged and rewarded for identifying and reporting security weaknesses?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P9",  w:2, q:"Does every security team member have formally protected time each week for researching emerging threats and new defensive technologies?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P10", w:2, q:"Is there a formal program for developing the next generation of cyber resilience talent through mentoring, certification support, and clear career pathways?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P11", w:3, q:"Do employees undergo adaptive security awareness training that evolves based on current threat intelligence and increases in difficulty as competency improves?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P12", w:3, q:"Are employees specifically trained to recognize and respond to AI generated social engineering attacks including deepfake audio and video impersonation and AI crafted spear phishing?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_P13", w:3, q:"Is there a formal red team function either internal or external with a mandate to continuously challenge the organisation's resilience using the latest adversary techniques?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P14", w:2, q:"Is there a formal Purple Team program where red team and blue team work collaboratively to improve detection and response capabilities?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P15", w:2, q:"Does the organisation share and receive threat intelligence with regulators, law enforcement, and national cybersecurity agencies in every jurisdiction it operates in?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P16", w:3, q:"Is there a designated leader responsible for driving adoption and effective use of AI enabled security capabilities across the organisation?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_P17", w:3, q:"Do teams critically evaluate and validate AI generated alerts and recommendations before taking action rather than blindly trusting automated outputs?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_P18", w:3, q:"Does leadership extend resilience oversight beyond internal operations to include critical suppliers and third party service providers?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"EA_P19", w:2, q:"Are teams aware of risks introduced by third party dependencies and their role in strengthening supply chain resilience?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"EA_P20", w:2, q:"Are Security Champions designated in each clinical department to bridge the gap between technical security protocols and frontline clinical workflows?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P21", w:3, q:"Are staff encouraged to report AI hallucinations and clinical AI errors through a no blame feedback system so the organisation can continuously improve its AI tools?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_P22", w:3, q:"Are clinical engineers required to hold specialized certifications in medical device cybersecurity to protect the IoMT ecosystem?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_P23", w:3, q:"Is there a continuous learning program for clinicians on the evolving landscape of AI based medical threats and adversarial attacks on clinical systems?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },

        // PROCESS
        { id:"EA_PR1",  w:3, q:"Is there a formal and mandatory blameless post incident review process after every significant security event with findings tracked to verified completion?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR2",  w:3, q:"Is there a formal feedback loop where findings from every incident, red team exercise, and threat intelligence report directly trigger updates to security controls and training?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR3",  w:3, q:"Does the organisation conduct red team or adversary emulation exercises against sector specific attack scenarios at least once per year?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR4",  w:3, q:"Is threat modeling formally required and conducted for every new product, service, technology deployment, and significant business change before it goes live?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR5",  w:3, q:"Is there a formal process for reviewing and updating all security controls, detection rules, and response playbooks based on lessons learned from every significant incident?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR6",  w:3, q:"Is there a formal process for incorporating the latest sector specific threat intelligence into security controls and recovery procedures on a continuous basis?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR7",  w:2, q:"Is there a formal sunset and technology refresh policy mandating the review, upgrade, or decommissioning of all hardware, software, and security tools beyond a defined age?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR8",  w:3, q:"Is the cyber resilience framework itself formally reviewed and updated at least annually to reflect changes in the threat landscape, regulatory environment, and business strategy?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR9",  w:3, q:"Are cyber resilience investments and budget allocations formally reviewed at least annually to ensure they are aligned to current and emerging threats?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR10", w:3, q:"Is there a formal process for translating cyber resilience maturity assessment findings into a prioritized multi year improvement roadmap with defined milestones and Board visibility?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR11", w:2, q:"Is there a formal process for benchmarking the organisation's cyber resilience maturity against sector peers, regulatory expectations, and leading practice frameworks at least annually?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR12", w:3, q:"Is there a formal process for actively helping the most critical suppliers improve their security rather than just monitoring their current posture?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"EA_PR13", w:2, q:"Is there a formal process for reviewing and updating cyber insurance coverage at least annually to ensure it remains aligned to the current risk profile and emerging threats?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR14", w:3, q:"Is there a formal process for assessing and integrating the cyber resilience implications of every emerging technology including AI, quantum computing, and open APIs before adoption?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR15", w:3, q:"Is there a formal AI governance and continuous improvement process that regularly reviews all AI tools used internally for new risks, performance degradation, and regulatory compliance?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_PR16", w:3, q:"Is there a formal process for monitoring and responding to supply chain security developments including newly disclosed vulnerabilities in critical software dependencies?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"EA_PR17", w:3, q:"Is there a formal process for conducting cyber resilience lessons learned reviews after major incidents affecting peer organizations even when the organisation itself was not directly impacted?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR18", w:2, q:"Is there a formal quantum computing threat readiness program that continuously tracks quantum computing developments and updates the organisation's cryptographic migration roadmap?", f:{org:"all",size:"Large",fund:"Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR19", w:3, q:"Does the organisation participate in sector wide cyber resilience exercises coordinated by regulators or industry bodies to benchmark resilience against sector standards?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR20", w:3, q:"Are policies and procedures updated regularly based on new threats, operational changes, and lessons learned from incidents and exercises?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR21", w:3, q:"Are findings from audits and assessments formally integrated into improvement plans with named owners and defined completion deadlines?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR22", w:2, q:"Are improvement processes adapted based on organisational scale and complexity from smaller operations to large critical infrastructure environments?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR23", w:3, q:"Does the organisation integrate lessons learned from third party and supply chain incidents into internal process enhancements even when not directly impacted?", f:{org:"all",size:"all",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"EA_PR24", w:3, q:"Is there a formal process for continuously updating the incident response strategy considering emerging AI risks, evolving supply chains, and new regulatory requirements?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"EA_PR25", w:3, q:"Does the hospital join threat sharing groups such as Health-ISAC for early warnings on attacks targeting clinical systems and medical devices?", f:{org:"Healthcare",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR26", w:3, q:"Is there a process for retiring and updating AI models as medical standards and patient demographics change to prevent model decay and clinical harm?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_PR27", w:3, q:"Does the hospital perform AI red teaming or simulated attacks to find vulnerabilities in its smart clinical systems and diagnostic AI tools?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_PR28", w:3, q:"Does the organisation participate in sector wide CBEST, TIBER-EU, or equivalent regulator coordinated resilience exercises?", f:{org:"Financial Services",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_PR29", w:3, q:"Is there a formal process for conducting cyber resilience due diligence on all potential merger and acquisition targets and integrating acquired entities into the framework within a defined timeframe?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },

        // TECHNOLOGY
        { id:"EA_T1",  w:3, q:"Is threat intelligence including sector specific Indicators of Compromise and adversary TTPs automatically ingested and operationalized across all security tools via API integration?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T2",  w:3, q:"Are all system logs, security events, and audit trails exported to an external immutable storage system completely separate from the production environment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T3",  w:3, q:"Is there an AI powered anomaly detection system that continuously learns normal behavior patterns and alerts on deviations that could indicate an emerging attack?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_T4",  w:3, q:"Is there an automated mechanism that validates whether all security controls remain effective and correctly configured following every system change or patch deployment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T5",  w:3, q:"Is Infrastructure as Code used for all critical system deployments with templates stored in a secure version controlled repository enabling rapid and consistent rebuilds?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T6",  w:3, q:"Is there a security control testing automation framework that continuously validates the effectiveness of all critical controls against known attack techniques mapped to MITRE ATT&CK?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T7",  w:3, q:"Is there a shadow IT discovery and management tool that continuously identifies all unauthorized applications, cloud services, and devices and immediately alerts the security team?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T8",  w:3, q:"Is AI powered threat hunting technology deployed that proactively searches for indicators of attacker presence without relying on known signatures or predefined rules?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_T9",  w:3, q:"Is there a technology solution that continuously monitors the security posture and resilience maturity of all critical third party vendors and automatically alerts on deterioration?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"thirdPartyVendors"}, cascadeChildren:[] },
        { id:"EA_T10", w:3, q:"Is there a technology solution that monitors all software components used across the organisation for newly disclosed vulnerabilities and automatically prioritizes remediation?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T11", w:3, q:"Is there a dark web and criminal intelligence monitoring solution watching for stolen data, compromised credentials, and threat actor activity targeting the organisation or its sector?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T12", w:2, q:"Is there a technology solution enabling the organisation to measure and track its cyber resilience maturity score across all pillars over time and report improvement trends to the Board?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T13", w:3, q:"Is there a technology solution for monitoring and detecting AI model drift, output anomalies, adversarial inputs, and signs of model poisoning across all AI systems used in critical processes?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_T14", w:2, q:"Is there a deception technology solution such as honeypots, honeytokens, and decoy accounts deployed to detect attacker presence early and gather intelligence on adversary techniques?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T15", w:3, q:"Is there a technology solution that automatically generates and maintains an up to date map of all system interdependencies, data flows, and third party connections?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T16", w:3, q:"Is there a technology solution enabling continuous automated penetration testing of all internet facing systems and APIs to identify exploitable vulnerabilities before attackers do?", f:{org:"all",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T17", w:2, q:"Is there a post quantum cryptography migration tracking solution managing the organisation's progress in replacing quantum vulnerable cryptographic algorithms?", f:{org:"all",size:"Large",fund:"Well Funded",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T18", w:3, q:"Is there a technology solution providing real time visibility into the organisation's overall cyber resilience posture across all five pillars enabling continuous rather than point in time assessment?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T19", w:2, q:"Are security tools and systems updated regularly and automatically to address evolving threats without requiring manual intervention?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T20", w:3, q:"Are detection systems continuously tuned based on attacker behavior observed in previous incidents rather than relying only on static rules?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T21", w:3, q:"Are automation tools used to dynamically adjust security controls based on real time threat intelligence without waiting for manual updates?", f:{org:"all",size:"all",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T22", w:3, q:"Are AI or behavioral analytics platforms used to detect anomalous behavior originating from vendor or partner connections that could indicate a supply chain compromise?", f:{org:"all",size:"all",fund:"all",tech:["usesAI","thirdPartyVendors"]}, cascadeChildren:[] },
        { id:"EA_T23", w:3, q:"Does the organisation use AI or behavioral analytics to automatically identify patterns from past incidents and recommend specific control improvements?", f:{org:"all",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_T24", w:3, q:"Is there an automated regulatory compliance monitoring tool that continuously identifies gaps and immediately alerts the compliance team when a control failure is detected?", f:{org:"all",size:"Medium|Large",fund:"all",tech:"all"}, cascadeChildren:[] },
        { id:"EA_T25", w:3, q:"Is there a tool that monitors OT networks and industrial control systems for emerging threats and automatically updates detection rules based on new intelligence?", f:{org:["Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"usesOT"}, cascadeChildren:[] },
        { id:"EA_T26", w:3, q:"Is there a Digital Twin of the hospital network or critical infrastructure used to safely test the security of new AI updates and patches before they go live?", f:{org:"Healthcare",size:"Medium|Large",fund:"Moderate|Well Funded",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_T27", w:3, q:"Does the hospital use AI to monitor and flag abnormal behavior in bedside medical devices and IoMT systems that could indicate a cyber attack or device tampering?", f:{org:"Healthcare",size:"all",fund:"all",tech:"usesAI"}, cascadeChildren:[] },
        { id:"EA_T28", w:3, q:"Is virtual patching deployed to protect legacy medical devices and OT systems that are no longer supported by their manufacturer and cannot receive security updates?", f:{org:["Healthcare","Energy and Utilities","Manufacturing and OT"],size:"all",fund:"all",tech:"all"}, cascadeChildren:[] }
      ]
    }

  } // end pillars

}; // end FRAMEWORK

// ============================================================
// APPLICABILITY ENGINE
// ============================================================

function isApplicable(question, profile) {
  const f = question.f;

  // Org type check
  if (f.org !== "all") {
    if (Array.isArray(f.org)) {
      if (!f.org.includes(profile.orgType)) return false;
    } else {
      if (f.org !== profile.orgType) return false;
    }
  }

  // Size check
  if (f.size !== "all") {
    if (f.size === "Medium|Large") {
      if (!["Medium","Large"].includes(profile.orgSize)) return false;
    } else if (f.size === "Large") {
      if (profile.orgSize !== "Large") return false;
    }
  }

  // Funding check
  if (f.fund !== "all") {
    if (f.fund === "Moderate|Well Funded") {
      if (!["Moderate","Well Funded"].includes(profile.fundingLevel)) return false;
    } else if (f.fund === "Well Funded") {
      if (profile.fundingLevel !== "Well Funded") return false;
    }
  }

  // Tech check
  if (f.tech !== "all") {
    if (Array.isArray(f.tech)) {
      for (const t of f.tech) {
        if (!profile[t]) return false;
      }
    } else {
      if (!profile[f.tech]) return false;
    }
  }

  return true;
}

// ============================================================
// CASCADE ENGINE
// ============================================================

function getCascadeZeroIds(answers) {
  const zeroIds = new Set();
  for (const pillarKey of Object.keys(FRAMEWORK.pillars)) {
    const pillar = FRAMEWORK.pillars[pillarKey];
    for (const q of pillar.questions) {
      if (!q.cascadeChildren || q.cascadeChildren.length === 0) continue;
      const answer = answers[q.id];
      if (answer && answer.implementation === "MISSING: Does not exist") {
        q.cascadeChildren.forEach(childId => zeroIds.add(childId));
      }
    }
  }
  return zeroIds;
}

// ============================================================
// SCORING ENGINE
// ============================================================

function scoreQuestion(question, answer, isCascadeZero) {
  if (isCascadeZero) return 0;
  if (!answer) return null;
  if (answer.implementation === "MISSING: Does not exist") return 0;

  const st = FRAMEWORK.scoringTables;
  const sw = FRAMEWORK.subWeights;

  const implScore   = st.implementation[answer.implementation] ?? 0;
  const testScore   = st.testType[answer.testType] ?? 0;
  const stressScore = st.stressTested[answer.stressTested] ?? 0;
  const lrScore     = st.lastReviewed[answer.lastReviewed] ?? 0;
  const covScore    = st.coverageScope[answer.coverageScope] ?? 0;

  const inner = (implScore   * sw.implementation)
              + (testScore   * sw.testType)
              + (covScore    * sw.coverageScope)
              + (lrScore     * sw.lastReviewed)
              + (stressScore * sw.stressTested);

  const penalty = answer.testType === "UNTESTED: Never exercised" ? 0.4 : 1;

  return question.w * inner * penalty;
}

function scorePillar(pillarKey, profile, answers) {
  const pillar = FRAMEWORK.pillars[pillarKey];
  const cascadeZeros = getCascadeZeroIds(answers);
  let earned = 0;
  let maxPossible = 0;

  for (const q of pillar.questions) {
    if (!isApplicable(q, profile)) continue;
    maxPossible += q.w;
    const score = scoreQuestion(q, answers[q.id], cascadeZeros.has(q.id));
    if (score !== null) earned += score;
  }

  return maxPossible === 0 ? 0 : (earned / maxPossible) * 100;
}

function scoreGlobalIndex(profile, answers) {
  const pillarScores = {};
  let total = 0;
  let count = 0;
  for (const key of Object.keys(FRAMEWORK.pillars)) {
    const score = scorePillar(key, profile, answers);
    pillarScores[key] = score;
    total += score;
    count++;
  }
  return {
    pillarScores,
    globalIndex: count === 0 ? 0 : total / count
  };
}

function getMaturityTier(score) {
  if (score >= 85) return { tier: "Iron Fortress",  color: "#00c853", description: "Exceptional resilience. Industry leading posture." };
  if (score >= 70) return { tier: "Resilient",       color: "#64dd17", description: "Strong resilience with minor gaps to address." };
  if (score >= 55) return { tier: "Developing",      color: "#ffd600", description: "Moderate resilience. Significant improvements needed." };
  if (score >= 40) return { tier: "Vulnerable",      color: "#ff6d00", description: "Notable gaps exist. Priority action required." };
  return             { tier: "Critical Risk",         color: "#d50000", description: "Severe gaps. Immediate intervention required." };
}

function getTopGaps(profile, answers, limit = 10) {
  const cascadeZeros = getCascadeZeroIds(answers);
  const gaps = [];
  for (const pillarKey of Object.keys(FRAMEWORK.pillars)) {
    const pillar = FRAMEWORK.pillars[pillarKey];
    for (const q of pillar.questions) {
      if (!isApplicable(q, profile)) continue;
      if (cascadeZeros.has(q.id)) continue;
      const answer = answers[q.id];
      const score = scoreQuestion(q, answer, false);
      if (score === 0 || score === null) {
        gaps.push({
          id: q.id,
          pillar: pillar.name,
          question: q.q,
          weight: q.w,
          score: score ?? 0
        });
      }
    }
  }
  gaps.sort((a, b) => b.weight - a.weight);
  return gaps.slice(0, limit);
}

function calcOrgSize(sizeScore) {
  if (sizeScore <= 4) return "Small";
  if (sizeScore <= 8) return "Medium";
  return "Large";
}

function calcFundingLevel(fundingScore) {
  if (fundingScore <= 3) return "Limited";
  if (fundingScore <= 6) return "Moderate";
  return "Well Funded";
}