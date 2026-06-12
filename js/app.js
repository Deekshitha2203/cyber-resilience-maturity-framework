// ============================================================
// CYBER RESILIENCE MATURITY FRAMEWORK — APP LOGIC
// ============================================================

// ----------------------------------------------------------
// STATE
// ----------------------------------------------------------

const STATE = {
  profile: {
    orgType: null,
    orgSize: null,
    fundingLevel: null,
    usesCloud: false,
    usesOT: false,
    usesAI: false,
    usesAgenticAI: false,
    processesPayments: false,
    sensitiveData: false,
    thirdPartyVendors: false,
    softwareDev: false,
    regulations: []
  },
  answers: {},
  currentStep: 0,
  audience: "technical"
};

// Steps:
// 0 = org type
// 1 = size inputs
// 2 = funding inputs
// 3 = tech environment
// 4 = regulations
// 5 = governance
// 6 = risk
// 7 = operational
// 8 = recovery
// 9 = evolution

const TOTAL_STEPS = 10;

const PILLAR_STEPS = {
  5: "governance",
  6: "risk",
  7: "operational",
  8: "recovery",
  9: "evolution"
};

const STEP_LABELS = {
  0: { section: "Basic Questions", title: "Organisation Type" },
  1: { section: "Basic Questions", title: "Size Profile" },
  2: { section: "Basic Questions", title: "Funding Profile" },
  3: { section: "Basic Questions", title: "Technology Environment" },
  4: { section: "Basic Questions", title: "Regulatory Environment" },
  5: { section: "Pillar 1 of 5",   title: "Governance & Command" },
  6: { section: "Pillar 2 of 5",   title: "Risk Management" },
  7: { section: "Pillar 3 of 5",   title: "Operational Continuity" },
  8: { section: "Pillar 4 of 5",   title: "Trusted Recovery" },
  9: { section: "Pillar 5 of 5",   title: "Evolution & Adaptation" }
};

// Temp storage for basic question raw answers
let sizeAnswers    = {};
let fundingAnswers = {};

// ----------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------

function startAssessment() {
  showPage("assessment");
  STATE.currentStep = 0;
  renderStep();
}

function goBack() {
  if (STATE.currentStep === 0) {
    showPage("landing");
  } else {
    STATE.currentStep--;
    renderStep();
  }
}

function nextStep() {
  // Validate current step before advancing
  if (!validateStep()) return;

  // Save current step data
  saveStep();

  STATE.currentStep++;

  if (STATE.currentStep >= TOTAL_STEPS) {
    showResults();
  } else {
    renderStep();
  }
}

function prevStep() {
  if (STATE.currentStep > 0) {
    STATE.currentStep--;
    renderStep();
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ----------------------------------------------------------
// RENDER STEP
// ----------------------------------------------------------

function renderStep() {
  const label = STEP_LABELS[STATE.currentStep];
  document.getElementById("assessment-section-label").textContent = label.section;
  document.getElementById("assessment-title").textContent = label.title;

  const progress = ((STATE.currentStep + 1) / TOTAL_STEPS) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
  document.getElementById("progress-text").textContent =
    `Step ${STATE.currentStep + 1} of ${TOTAL_STEPS}`;

  document.getElementById("prev-btn").style.display =
    STATE.currentStep > 0 ? "inline-flex" : "none";

  const nextBtn = document.getElementById("next-btn");
  nextBtn.textContent = STATE.currentStep === TOTAL_STEPS - 1 ? "View Results →" : "Next →";

  const container = document.getElementById("question-container");
  container.innerHTML = "";

  switch (STATE.currentStep) {
    case 0: renderOrgType(container);    break;
    case 1: renderSizeInputs(container); break;
    case 2: renderFundingInputs(container); break;
    case 3: renderTechEnvironment(container); break;
    case 4: renderRegulations(container); break;
    default:
      renderPillar(container, PILLAR_STEPS[STATE.currentStep]);
  }
}

// ----------------------------------------------------------
// BASIC QUESTION RENDERERS
// ----------------------------------------------------------

function renderOrgType(container) {
  const bq = FRAMEWORK.basicQuestions;
  container.innerHTML = `
    <div class="basic-section-title">What type of organisation is this?</div>
    <div class="basic-section-sub">This determines which sector-specific questions will be included in your assessment.</div>
    <div class="options-grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px;">
      ${bq.orgType.options.map(opt => `
        <button
          class="option-btn ${STATE.profile.orgType === opt ? "selected" : ""}"
          style="padding: 20px; text-align: center; font-size: 15px; font-weight: 600;"
          onclick="selectOrgType('${opt}')"
        >${opt}</button>
      `).join("")}
    </div>
  `;
}

function selectOrgType(opt) {
  STATE.profile.orgType = opt;
  renderOrgType(document.getElementById("question-container"));
}

function renderSizeInputs(container) {
  const inputs = FRAMEWORK.basicQuestions.sizeInputs;
  container.innerHTML = `
    <div class="basic-section-title">Size Profile</div>
    <div class="basic-section-sub">These answers determine your organisation size tier (Small / Medium / Large) which affects which questions apply.</div>
    ${inputs.map(input => `
      <div class="basic-question">
        <label>${input.question}</label>
        <div class="options-grid">
          ${input.options.map((opt, i) => `
            <button
              class="option-btn ${sizeAnswers[input.key]?.option === opt ? "selected" : ""}"
              onclick="selectSizeAnswer('${input.key}', '${opt}', ${input.scores[i]})"
            >${opt}</button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="mt-16" style="background: var(--bg-elevated); border-radius: 12px; padding: 16px 20px;">
      <span style="font-size: 13px; color: var(--text-muted);">Current size score: </span>
      <strong id="size-score-display" style="color: var(--accent-light);">${calcCurrentSizeScore()} / 12</strong>
      <span style="margin-left: 12px; font-size: 13px; color: var(--text-muted);">→ </span>
      <strong id="size-tier-display" style="color: var(--accent-light);">${calcOrgSize(calcCurrentSizeScore())}</strong>
    </div>
  `;
}

function selectSizeAnswer(key, opt, score) {
  sizeAnswers[key] = { option: opt, score };
  renderSizeInputs(document.getElementById("question-container"));
}

function calcCurrentSizeScore() {
  return Object.values(sizeAnswers).reduce((sum, v) => sum + (v.score || 0), 0);
}

function renderFundingInputs(container) {
  const inputs = FRAMEWORK.basicQuestions.fundingInputs;
  container.innerHTML = `
    <div class="basic-section-title">Funding Profile</div>
    <div class="basic-section-sub">These answers determine your funding tier (Limited / Moderate / Well Funded) which affects which questions apply.</div>
    ${inputs.map(input => `
      <div class="basic-question">
        <label>${input.question}</label>
        <div class="options-grid">
          ${input.options.map((opt, i) => `
            <button
              class="option-btn ${fundingAnswers[input.key]?.option === opt ? "selected" : ""}"
              onclick="selectFundingAnswer('${input.key}', '${opt}', ${input.scores[i]})"
            >${opt}</button>
          `).join("")}
        </div>
      </div>
    `).join("")}
    <div class="mt-16" style="background: var(--bg-elevated); border-radius: 12px; padding: 16px 20px;">
      <span style="font-size: 13px; color: var(--text-muted);">Current funding score: </span>
      <strong id="fund-score-display" style="color: var(--accent-light);">${calcCurrentFundingScore()} / 10</strong>
      <span style="margin-left: 12px; font-size: 13px; color: var(--text-muted);">→ </span>
      <strong id="fund-tier-display" style="color: var(--accent-light);">${calcFundingLevel(calcCurrentFundingScore())}</strong>
    </div>
  `;
}

function selectFundingAnswer(key, opt, score) {
  fundingAnswers[key] = { option: opt, score };
  renderFundingInputs(document.getElementById("question-container"));
}

function calcCurrentFundingScore() {
  return Object.values(fundingAnswers).reduce((sum, v) => sum + (v.score || 0), 0);
}

function renderTechEnvironment(container) {
  const inputs = FRAMEWORK.basicQuestions.techInputs;
  container.innerHTML = `
    <div class="basic-section-title">Technology Environment</div>
    <div class="basic-section-sub">Select all that apply to your organisation. These control which technology-specific questions appear.</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
      ${inputs.map(input => `
        <button
          class="option-btn ${STATE.profile[input.key] ? "selected" : ""}"
          style="padding: 16px 20px; display: flex; align-items: center; gap: 12px;"
          onclick="toggleTech('${input.key}')"
        >
          <span style="font-size: 18px;">${getTechIcon(input.key)}</span>
          <span style="font-size: 13px; font-weight: 600; line-height: 1.4;">${input.question}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function getTechIcon(key) {
  const icons = {
    usesCloud: "☁️",
    usesOT: "⚙️",
    usesAI: "🤖",
    usesAgenticAI: "🧠",
    processesPayments: "💳",
    sensitiveData: "🔒",
    thirdPartyVendors: "🔗",
    softwareDev: "💻"
  };
  return icons[key] || "•";
}

function toggleTech(key) {
  STATE.profile[key] = !STATE.profile[key];
  renderTechEnvironment(document.getElementById("question-container"));
}

function renderRegulations(container) {
  const regs = FRAMEWORK.basicQuestions.regulations;
  container.innerHTML = `
    <div class="basic-section-title">Regulatory Environment</div>
    <div class="basic-section-sub">Select all regulations that apply to your organisation. You can select multiple.</div>
    <div class="options-grid" style="grid-template-columns: repeat(4, 1fr); margin-top: 8px;">
      ${regs.options.map(opt => `
        <button
          class="option-btn ${STATE.profile.regulations.includes(opt) ? "multi-selected" : ""}"
          onclick="toggleRegulation('${opt}')"
          style="text-align: center; padding: 14px;"
        >${opt}</button>
      `).join("")}
    </div>
  `;
}

function toggleRegulation(opt) {
  if (opt === "None") {
    STATE.profile.regulations = ["None"];
  } else {
    STATE.profile.regulations = STATE.profile.regulations.filter(r => r !== "None");
    const idx = STATE.profile.regulations.indexOf(opt);
    if (idx === -1) {
      STATE.profile.regulations.push(opt);
    } else {
      STATE.profile.regulations.splice(idx, 1);
    }
  }
  renderRegulations(document.getElementById("question-container"));
}

// ----------------------------------------------------------
// PILLAR RENDERER
// ----------------------------------------------------------

function renderPillar(container, pillarKey) {
  const pillar = FRAMEWORK.pillars[pillarKey];
  const cascadeZeros = getCascadeZeroIds(STATE.answers);
  const questions = pillar.questions.filter(q => isApplicable(q, STATE.profile));

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="pillar-intro">
        <h2>${pillar.name}</h2>
        <p>No questions apply to your organisation profile for this pillar.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="pillar-intro">
      <h2>${pillar.name}</h2>
      <p>${questions.length} questions applicable to your organisation profile</p>
    </div>
    ${questions.map(q => renderQuestionCard(q, cascadeZeros)).join("")}
  `;
}

function renderQuestionCard(q, cascadeZeros) {
  const isCascadeZero = cascadeZeros.has(q.id);
  const answer = STATE.answers[q.id] || {};
  const st = FRAMEWORK.scoringTables;

  if (isCascadeZero) {
    return `
      <div class="question-card cascade-zeroed" id="card-${q.id}">
        <div class="question-header">
          <span class="question-id">${q.id}</span>
          <span class="question-text">${q.q}</span>
        </div>
        <div class="cascade-zero-overlay">
          ⚠️ Auto-scored zero — parent control is not implemented
        </div>
      </div>
    `;
  }

  const hasParent = q.cascadeParent;
  const cascadeNote = hasParent ? `
    <div class="cascade-note">
      ⚠️ This control depends on <strong>${q.cascadeParent}</strong>.
      If that parent control is missing, this will automatically score zero.
    </div>
  ` : "";

  const isMissing = answer.implementation === "MISSING: Does not exist";

  return `
    <div class="question-card" id="card-${q.id}">
      <div class="question-header">
        <span class="question-id">${q.id}</span>
        <span class="question-weight">Weight ${q.w}</span>
        <span class="question-text">${q.q}</span>
      </div>
      ${cascadeNote}
      <div class="subdim-grid">
        <div class="subdim-field">
          <label>Implementation</label>
          <select onchange="saveAnswer('${q.id}', 'implementation', this.value)">
            <option value="">— Select —</option>
            ${Object.keys(st.implementation).map(opt => `
              <option value="${opt}" ${answer.implementation === opt ? "selected" : ""}>${opt}</option>
            `).join("")}
          </select>
        </div>
        <div class="subdim-field ${isMissing ? "subdim-disabled" : ""}">
          <label>Test Type</label>
          <select onchange="saveAnswer('${q.id}', 'testType', this.value)" ${isMissing ? "disabled" : ""}>
            <option value="">${isMissing ? "N/A — Not Implemented" : "— Select —"}</option>
            ${!isMissing ? Object.keys(st.testType).map(opt => `
              <option value="${opt}" ${answer.testType === opt ? "selected" : ""}>${opt}</option>
            `).join("") : ""}
          </select>
        </div>
        <div class="subdim-field ${isMissing ? "subdim-disabled" : ""}">
          <label>Coverage Scope</label>
          <select onchange="saveAnswer('${q.id}', 'coverageScope', this.value)" ${isMissing ? "disabled" : ""}>
            <option value="">${isMissing ? "N/A — Not Implemented" : "— Select —"}</option>
            ${!isMissing ? Object.keys(st.coverageScope).map(opt => `
              <option value="${opt}" ${answer.coverageScope === opt ? "selected" : ""}>${opt}</option>
            `).join("") : ""}
          </select>
        </div>
        <div class="subdim-field ${isMissing ? "subdim-disabled" : ""}">
          <label>Last Reviewed</label>
          <select onchange="saveAnswer('${q.id}', 'lastReviewed', this.value)" ${isMissing ? "disabled" : ""}>
            <option value="">${isMissing ? "N/A — Not Implemented" : "— Select —"}</option>
            ${!isMissing ? Object.keys(st.lastReviewed).map(opt => `
              <option value="${opt}" ${answer.lastReviewed === opt ? "selected" : ""}>${opt}</option>
            `).join("") : ""}
          </select>
        </div>
        <div class="subdim-field ${isMissing ? "subdim-disabled" : ""}">
          <label>Stress Tested</label>
          <select onchange="saveAnswer('${q.id}', 'stressTested', this.value)" ${isMissing ? "disabled" : ""}>
            <option value="">${isMissing ? "N/A — Not Implemented" : "— Select —"}</option>
            ${!isMissing ? Object.keys(st.stressTested).map(opt => `
              <option value="${opt}" ${answer.stressTested === opt ? "selected" : ""}>${opt}</option>
            `).join("") : ""}
          </select>
        </div>
      </div>
    </div>
  `;
}

function saveAnswer(qId, field, value) {
  if (!STATE.answers[qId]) STATE.answers[qId] = {};
  STATE.answers[qId][field] = value;

  // If implementation is MISSING, auto-clear all other sub-dimensions
  if (field === "implementation" && value === "MISSING: Does not exist") {
    STATE.answers[qId].testType = "";
    STATE.answers[qId].coverageScope = "";
    STATE.answers[qId].lastReviewed = "";
    STATE.answers[qId].stressTested = "";
  }

  // Re-render the card to reflect disabled state
  const pillarKey = PILLAR_STEPS[STATE.currentStep];
  const pillar = FRAMEWORK.pillars[pillarKey];
  const cascadeZeros = getCascadeZeroIds(STATE.answers);
  const question = pillar.questions.find(q => q.id === qId);

  if (question) {
    const cardEl = document.getElementById(`card-${qId}`);
    if (cardEl) {
      const newCard = document.createElement("div");
      newCard.innerHTML = renderQuestionCard(question, cascadeZeros);
      cardEl.replaceWith(newCard.firstElementChild);
    }

    // Also update cascade children
    if (question.cascadeChildren.length > 0) {
      question.cascadeChildren.forEach(childId => {
        const childCard = document.getElementById(`card-${childId}`);
        if (childCard) {
          const childQ = pillar.questions.find(q => q.id === childId);
          if (childQ) {
            const newChild = document.createElement("div");
            newChild.innerHTML = renderQuestionCard(childQ, getCascadeZeroIds(STATE.answers));
            childCard.replaceWith(newChild.firstElementChild);
          }
        }
      });
    }
  }
}

// ----------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------

function validateStep() {
  switch (STATE.currentStep) {
    case 0:
      if (!STATE.profile.orgType) {
        alert("Please select an organisation type to continue.");
        return false;
      }
      break;
    case 1:
      const sizeKeys = FRAMEWORK.basicQuestions.sizeInputs.map(i => i.key);
      const missedSize = sizeKeys.filter(k => !sizeAnswers[k]);
      if (missedSize.length > 0) {
        alert("Please answer all size questions to continue.");
        return false;
      }
      break;
    case 2:
      const fundKeys = FRAMEWORK.basicQuestions.fundingInputs.map(i => i.key);
      const missedFund = fundKeys.filter(k => !fundingAnswers[k]);
      if (missedFund.length > 0) {
        alert("Please answer all funding questions to continue.");
        return false;
      }
      break;
    case 4:
      if (STATE.profile.regulations.length === 0) {
        alert("Please select at least one regulation (or None) to continue.");
        return false;
      }
      break;
  }
  return true;
}

// ----------------------------------------------------------
// SAVE STEP
// ----------------------------------------------------------

function saveStep() {
  if (STATE.currentStep === 1) {
    const score = calcCurrentSizeScore();
    STATE.profile.orgSize = calcOrgSize(score);
  }
  if (STATE.currentStep === 2) {
    const score = calcCurrentFundingScore();
    STATE.profile.fundingLevel = calcFundingLevel(score);
  }
}

// ----------------------------------------------------------
// RESULTS
// ----------------------------------------------------------

function showResults() {
// Clear AI cache for new assessment
Object.keys(AI_CACHE).forEach(k => delete AI_CACHE[k]);
  showPage("results");
  const { pillarScores, globalIndex } = scoreGlobalIndex(STATE.profile, STATE.answers);
  const tier = getMaturityTier(globalIndex);
  const gaps = getTopGaps(STATE.profile, STATE.answers, 15);

  renderResults(globalIndex, tier, pillarScores, gaps);
  loadAIInsights(globalIndex, tier, pillarScores);
}

function renderResults(globalIndex, tier, pillarScores, gaps) {
  const scoreColor = getScoreColorClass(globalIndex);
  const pillarKeys = Object.keys(FRAMEWORK.pillars);

  const content = `
    <div class="results-header">
      <div>
        <h1>Resilience Assessment Results</h1>
        <div class="results-meta">
          ${STATE.profile.orgType} · ${STATE.profile.orgSize} · ${STATE.profile.fundingLevel}
        </div>
      </div>
      <div class="audience-toggle">
        <button class="audience-btn ${STATE.audience === "board" ? "active" : ""}"
          onclick="switchAudience('board')">Board</button>
        <button class="audience-btn ${STATE.audience === "ciso" ? "active" : ""}"
          onclick="switchAudience('ciso')">CISO</button>
        <button class="audience-btn ${STATE.audience === "technical" ? "active" : ""}"
          onclick="switchAudience('technical')">Technical</button>
      </div>
    </div>

    <div class="results-body">

      <!-- GLOBAL INDEX -->
      <div class="global-index-section">
        <div class="score-circle ${scoreColor}">
          <span class="score-number">${Math.round(globalIndex)}</span>
          <span class="score-pct">/ 100</span>
        </div>
        <div class="index-details">
          <h2>Global Resilience Index</h2>
          <div class="maturity-tier" style="background:${tier.color}22; color:${tier.color}; border: 1px solid ${tier.color}44;">
            ${tier.tier}
          </div>
          <p class="tier-description">${tier.description}</p>
          <div class="results-actions">
            <button class="btn-primary" onclick="window.print()">Export Report</button>
            <button class="btn-secondary" onclick="startAssessment()">Retake Assessment</button>
          </div>
        </div>
      </div>

      <!-- AUDIENCE VIEWS -->
        <div id="view-board" class="audience-view ${STATE.audience === "board" ? "active" : ""}">
        ${renderBoardView(globalIndex, tier, pillarScores, gaps)}
      </div>

      <div id="view-ciso" class="audience-view ${STATE.audience === "ciso" ? "active" : ""}">
        ${renderCISOView(globalIndex, pillarScores, gaps)}
      </div>

      <div id="view-technical" class="audience-view ${STATE.audience === "technical" ? "active" : ""}">
        ${renderTechnicalView(pillarScores, gaps)}
      </div> 

      <!-- AI INSIGHTS -->
      <div class="ai-section">
        <h2>
          AI-Powered Recommendations
          <span class="ai-badge">DukeGPT</span>
        </h2>
        <div class="ai-sub">Personalised recommendations generated for your organisation profile and audience.</div>
        <div class="ai-output" id="ai-output">
          <div class="ai-loading">
            <div class="ai-spinner"></div>
            Generating insights for ${STATE.audience} view...
          </div>
        </div>
      </div>

    </div>
  `;

  document.getElementById("results-content").innerHTML = content;
  renderRadarChart(pillarScores);
}

// ----------------------------------------------------------
// AUDIENCE VIEWS
// ----------------------------------------------------------

function renderBoardView(globalIndex, tier, pillarScores, gaps) {
  const pillarKeys = Object.keys(FRAMEWORK.pillars);

  return `
    <div class="board-summary">
      <div class="score-context">
        <strong>${Math.round(globalIndex)}%</strong> — ${tier.tier}
      </div>
      <div class="risk-traffic-lights">
        ${pillarKeys.map(key => {
          const score = pillarScores[key];
          const color = getScoreHexColor(score);
          return `
            <div class="traffic-light">
              <div class="tl-dot" style="background:${color}"></div>
              <div class="tl-name">${FRAMEWORK.pillars[key].name.split(" ")[0]}</div>
              <div class="tl-score" style="color:${color}">${Math.round(score)}%</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderCISOView(globalIndex, pillarScores, gaps) {
  const pillarKeys = Object.keys(FRAMEWORK.pillars);

  return `
    <div class="pillars-section">
      <h2>Pillar Breakdown</h2>
      ${pillarKeys.map(key => {
        const score = pillarScores[key];
        const colorClass = getScoreColorClass(score);
        const barClass = getBarColorClass(score);
        return `
          <div class="pillar-score-card">
            <div class="pillar-score-name">${FRAMEWORK.pillars[key].name}</div>
            <div class="pillar-score-bar-outer">
              <div class="pillar-score-bar-inner ${barClass}" style="width:${score}%"></div>
            </div>
            <div class="pillar-score-pct ${colorClass}">${Math.round(score)}%</div>
          </div>
        `;
      }).join("")}
    </div>

    <div class="radar-section">
      <h2>Resilience Radar</h2>
      <canvas id="radarChartTechnical" width="500" height="500"></canvas>
    </div>

  `;
}

function renderTechnicalView(pillarScores, gaps) {
  const pillarKeys = Object.keys(FRAMEWORK.pillars);

  return `
    <div class="pillars-section">
      <h2>Pillar Scores</h2>
      ${pillarKeys.map(key => {
        const score = pillarScores[key];
        const colorClass = getScoreColorClass(score);
        const barClass = getBarColorClass(score);
        return `
          <div class="pillar-score-card">
            <div class="pillar-score-name">${FRAMEWORK.pillars[key].name}</div>
            <div class="pillar-score-bar-outer">
              <div class="pillar-score-bar-inner ${barClass}" style="width:${score}%"></div>
            </div>
            <div class="pillar-score-pct ${colorClass}">${Math.round(score)}%</div>
          </div>
        `;
      }).join("")}
    </div>

    <div class="radar-section">
      <h2>Resilience Radar</h2>
      <canvas id="radarChart" width="500" height="500"></canvas>
    </div>

  `;
}

function switchAudience(audience) {
  STATE.audience = audience;

  // Update toggle buttons
  document.querySelectorAll(".audience-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".audience-btn").forEach(btn => {
    if (btn.textContent.toLowerCase() === audience) btn.classList.add("active");
  });

  // Show correct view
  document.querySelectorAll(".audience-view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${audience}`)?.classList.add("active");

  // Re-render radar in the newly visible view
  const { pillarScores } = scoreGlobalIndex(STATE.profile, STATE.answers);
  setTimeout(() => renderRadarChart(pillarScores), 50);

  // Reload AI insights for new audience
  const { globalIndex } = scoreGlobalIndex(STATE.profile, STATE.answers);
  const tier = getMaturityTier(globalIndex);
  const gaps = getTopGaps(STATE.profile, STATE.answers, 15);
  loadAIInsights(globalIndex, tier, pillarScores);
}

// ----------------------------------------------------------
// RADAR CHART
// ----------------------------------------------------------

function drawRadar(canvas, pillarScores) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 60;

  ctx.clearRect(0, 0, W, H);

  const pillarKeys = Object.keys(FRAMEWORK.pillars);
  const n = pillarKeys.length;
  const scores = pillarKeys.map(k => (pillarScores[k] || 0) / 100);
  const labels = pillarKeys.map(k => FRAMEWORK.pillars[k].name.split(" ")[0]);
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  // Draw grid
  for (let ring = 1; ring <= 5; ring++) {
    const r = (ring / 5) * R;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(99,102,241,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(139,139,160,0.6)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${ring * 20}`, cx, cy - r + 4);
  }

  // Draw axes
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = "rgba(99,102,241,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw data polygon
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = scores[i] * R;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(99,102,241,0.2)";
  ctx.fill();
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw data points
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = scores[i] * R;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#818cf8";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draw labels
  ctx.fillStyle = "#a5b4fc";
  ctx.font = "bold 12px sans-serif";
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const labelR = R + 30;
    const x = cx + labelR * Math.cos(angle);
    const y = cy + labelR * Math.sin(angle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labels[i], x, y);
    ctx.fillStyle = "rgba(165,180,252,0.6)";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${Math.round((pillarScores[pillarKeys[i]] || 0))}%`, x, y + 14);
    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 12px sans-serif";
  }
}

function renderRadarChart(pillarScores) {
  ["radarChart", "radarChartTechnical"].forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) drawRadar(canvas, pillarScores);
  });
}
// ----------------------------------------------------------
// AI INSIGHTS — DukeGPT
// ----------------------------------------------------------

// Cache so switching back doesn't re-call
const AI_CACHE = {};

async function loadAIInsights(globalIndex, tier, pillarScores) {
  const outputEl = document.getElementById("ai-output");
  if (!outputEl) return;

  // Return cached result if already generated for this audience
  if (AI_CACHE[STATE.audience]) {
    outputEl.innerHTML = AI_CACHE[STATE.audience];
    return;
  }

  outputEl.innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      Generating ${STATE.audience} actions...
    </div>
  `;

  // Build gap context — top 5 per pillar, sorted worst first
  const cascadeZeros = getCascadeZeroIds(STATE.answers);
  let gapContext = "";

  for (const pillarKey of Object.keys(FRAMEWORK.pillars)) {
    const pillar = FRAMEWORK.pillars[pillarKey];
    const pillarGaps = [];

    for (const q of pillar.questions) {
      if (!isApplicable(q, STATE.profile)) continue;
      if (q.w < 2) continue;

      const ans = STATE.answers[q.id] || {};
      const isMissing = !ans.implementation || ans.implementation === "MISSING: Does not exist";
      const isCascadeZero = cascadeZeros.has(q.id);

      // Calculate per-question score percentage
      let qScorePct = 0;
      if (!isMissing && !isCascadeZero && ans.implementation) {
        const st = FRAMEWORK.scoringTables, sw = FRAMEWORK.subWeights;
        const inner = (st.implementation[ans.implementation]??0)*sw.implementation
                    + (st.testType[ans.testType]??0)*sw.testType
                    + (st.coverageScope[ans.coverageScope]??0)*sw.coverageScope
                    + (st.lastReviewed[ans.lastReviewed]??0)*sw.lastReviewed
                    + (st.stressTested[ans.stressTested]??0)*sw.stressTested;
        const penalty = ans.testType === "UNTESTED: Never exercised" ? 0.4 : 1;
        qScorePct = Math.round(inner * penalty * 100);
      }

      if (qScorePct <= 40) {
        pillarGaps.push({
          question: q.q,
          weight: q.w,
          scorePct: qScorePct,
          implementation: ans.implementation || "MISSING: Does not exist",
          testType: ans.testType || "—",
          coverageScope: ans.coverageScope || "—",
          lastReviewed: ans.lastReviewed || "—",
          stressTested: ans.stressTested || "—"
        });
      }
    }

    // Sort: weight DESC then score ASC (worst high-priority first)
    pillarGaps.sort((a, b) => b.weight - a.weight || a.scorePct - b.scorePct);

    // Take top 5 per pillar
    const top5 = pillarGaps.slice(0, 5);
    if (top5.length === 0) continue;

    gapContext += `\nPILLAR: ${pillar.name}\n`;
    top5.forEach((g, i) => {
      gapContext += `
  ${i+1}. ${g.question}
     Weight: ${g.weight} | Score: ${g.scorePct}%
     Implementation: ${g.implementation}
     Testing: ${g.testType}
     Coverage: ${g.coverageScope}
     Last Reviewed: ${g.lastReviewed}
     Stress Tested: ${g.stressTested}
`;
    });
  }

  const pillarSummary = Object.keys(FRAMEWORK.pillars)
    .map(k => `${FRAMEWORK.pillars[k].name}: ${Math.round(pillarScores[k])}%`)
    .join(", ");

  const orgContext = `Organisation: ${STATE.profile.orgType}, ${STATE.profile.orgSize}, ${STATE.profile.fundingLevel}
Regulations: ${STATE.profile.regulations.join(", ")}
Global Score: ${Math.round(globalIndex)}% — ${tier.tier}
Pillar scores: ${pillarSummary}`;

  const audienceConfig = {
    board: {
  count: 3,
  systemPrompt: "You are a senior cyber resilience advisor briefing a Board of Directors. You speak in plain business language — no technical jargon. You focus on governance accountability, regulatory exposure, financial risk, and investment decisions.",
  userPrompt: `${orgContext}

Below are the highest-priority control gaps across all 5 pillars of the Cyber Resilience Maturity Framework. Each gap includes its current sub-dimension state.

${gapContext}

Provide two things:

PART 1 — EXECUTIVE SUMMARY
Write 2-3 sentences summarising this organisation's cyber resilience posture for a Board audience. Reference the actual score, the maturity tier, the most critical pillar weaknesses, and the specific regulatory and business risk this creates. Plain language, no technical jargon.

PART 2 — BOARD ACTIONS
Generate exactly 3 board-level strategic actions. Each action must:
- Be one clear sentence in plain business language
- Start with a strong verb (Mandate, Appoint, Invest, Commission, Establish)
- Focus on governance accountability, regulatory risk, or investment decision
- Reference why it matters to the business

Format exactly as:
SUMMARY: [2-3 sentence executive summary]
ACTION 1: [sentence]
ACTION 2: [sentence]
ACTION 3: [sentence]`
},

    ciso: {
      count: 8,
      systemPrompt: "You are a senior cyber resilience advisor briefing a CISO. You speak in GRC and security programme language. You focus on programme gaps, remediation priorities, testing failures, and coverage weaknesses.",
      userPrompt: `${orgContext}

Below are the highest-priority control gaps across all 5 pillars. Each gap includes its current sub-dimension state showing exactly what is failing.

${gapContext}

Generate exactly 8 programme-level actions for the CISO. Each action must:
- Identify the specific failure mode (missing, untested, limited coverage, never reviewed)
- State what programme change or remediation is needed
- Be specific to the pillar and control area
- Use appropriate GRC and security programme language

Format exactly as:
ACTION 1: [action]
ACTION 2: [action]
...
ACTION 8: [action]`
    },

    technical: {
      count: 12,
      systemPrompt: "You are a senior cyber resilience advisor briefing a technical security team. You give specific, implementable technical tasks. You reference exact failure modes and concrete steps.",
      userPrompt: `${orgContext}

Below are the highest-priority control gaps across all 5 pillars with exact sub-dimension states showing what is failing and how severely.

${gapContext}

Generate exactly 12 technical implementation actions. Each action must:
- Reference the specific control and its exact failure mode from the sub-dimension data
- Give a concrete technical task (what to build, configure, test, document, or run)
- Be specific enough that a security engineer knows exactly what to do
- Prioritise weight-3 controls first

Format exactly as:
ACTION 1: [action]
ACTION 2: [action]
...
ACTION 12: [action]`
    }
  };

  const config = audienceConfig[STATE.audience];

  try {
    const response = await fetch("https://litellm.oit.duke.edu/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_DUKE_API_TOKEN"// Replace with your actual API token
      },
      body: JSON.stringify({
        model: "GPT 4.1 Mini",
        max_tokens: 1200,
        temperature: 0.3,
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user",   content: config.userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      outputEl.innerHTML = `<div class="ai-error">API error ${response.status}: ${errText}</div>`;
      return;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    if (!text) {
      outputEl.innerHTML = `<div class="ai-error">No response received.</div>`;
      return;
    }

    // Parse SUMMARY and ACTION N: format
const lines = text.split("\n").filter(l => l.trim());
const actions = [];
let summary = "";

lines.forEach(line => {
  const summaryMatch = line.match(/^SUMMARY:\s*(.+)/i);
  const actionMatch  = line.match(/^ACTION\s*\d+:\s*(.+)/i);
  if (summaryMatch) summary = summaryMatch[1].trim();
  if (actionMatch)  actions.push(actionMatch[1].trim());
});

// Fallback if parsing fails
if (actions.length === 0 && !summary) {
  outputEl.innerHTML = `<div class="ai-text">${text.replace(/\n/g, "<br/>")}</div>`;
  AI_CACHE[STATE.audience] = outputEl.innerHTML;
  return;
}

// Build summary block for board view
const summaryHTML = (STATE.audience === "board" && summary) ? `
  <div class="ai-summary-block">
    <h4>Executive Summary</h4>
    <p>${summary}</p>
  </div>
` : "";

const html = summaryHTML + actions.map((action, i) => `
  <div class="action-card">
    <div class="action-number">${i + 1}</div>
    <div class="action-text">${action}</div>
  </div>
`).join("");

    outputEl.innerHTML = html;
    AI_CACHE[STATE.audience] = html; // cache it

  } catch (err) {
    outputEl.innerHTML = `<div class="ai-error">Connection error: ${err.message}</div>`;
  }
}

// ----------------------------------------------------------
// HELPERS
// ----------------------------------------------------------

function getScoreColorClass(score) {
  if (score >= 70) return "score-green";
  if (score >= 55) return "score-yellow";
  if (score >= 40) return "score-orange";
  return "score-red";
}

function getBarColorClass(score) {
  if (score >= 70) return "bar-green";
  if (score >= 55) return "bar-yellow";
  if (score >= 40) return "bar-orange";
  return "bar-red";
}

function getScoreHexColor(score) {
  if (score >= 70) return "#22c55e";
  if (score >= 55) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function getBusinessRiskNarrative(score, orgType) {
  const narratives = {
    "Financial Services": {
      high:   "Your financial systems demonstrate strong cyber resilience, reducing the risk of regulatory sanctions and reputational damage from cyber incidents.",
      medium: "Key gaps in your cyber resilience posture expose the organisation to potential regulatory action under DORA, SEC, and FCA frameworks, and increase the risk of material financial loss from cyber incidents.",
      low:    "Critical weaknesses in your cyber resilience posture represent a significant and immediate risk of regulatory intervention, financial penalties, and severe reputational damage."
    },
    "Healthcare": {
      high:   "Your clinical systems show strong cyber resilience, protecting patient safety and reducing HIPAA breach risk.",
      medium: "Gaps in cyber resilience create patient safety risks and potential HIPAA violations that could result in significant financial penalties and harm to patients.",
      low:    "Critical cyber resilience failures pose an immediate risk to patient safety and represent severe HIPAA exposure requiring urgent Board action."
    },
    "Energy and Utilities": {
      high:   "Your OT and critical infrastructure demonstrate strong resilience, reducing risk of service disruption and NERC CIP violations.",
      medium: "Resilience gaps create material risk of operational disruption to critical infrastructure and potential regulatory violations.",
      low:    "Critical weaknesses expose critical infrastructure to severe disruption risk with potential cascading safety and regulatory consequences."
    },
    "Manufacturing and OT": {
      high:   "Your operational technology environment shows strong cyber resilience, protecting production continuity.",
      medium: "Resilience gaps in OT environments create significant production disruption risk and supply chain exposure.",
      low:    "Critical OT resilience failures represent immediate risk of production shutdown and supply chain disruption."
    }
  };

  const level = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  return narratives[orgType]?.[level] ||
    (score >= 70
      ? "Your organisation demonstrates solid cyber resilience across key domains."
      : score >= 40
        ? "Key resilience gaps require prioritised investment and leadership attention."
        : "Critical resilience failures require immediate intervention across multiple domains."
    );
}

function getActionableGaps(profile, answers, threshold = 40) {
  const cascadeZeros = getCascadeZeroIds(answers);
  const gaps = [];

  for (const pillarKey of Object.keys(FRAMEWORK.pillars)) {
    const pillar = FRAMEWORK.pillars[pillarKey];
    for (const q of pillar.questions) {
      if (!isApplicable(q, profile)) continue;
      if (q.w < 2) continue;

      const ans = answers[q.id] || {};
      const isMissing = !ans.implementation || ans.implementation === "MISSING: Does not exist";
      const isCascadeZero = cascadeZeros.has(q.id);

      let qScore = 0;
      if (!isMissing && !isCascadeZero) {
        const st = FRAMEWORK.scoringTables, sw = FRAMEWORK.subWeights;
        const inner = (st.implementation[ans.implementation]??0)*sw.implementation
                    + (st.testType[ans.testType]??0)*sw.testType
                    + (st.coverageScope[ans.coverageScope]??0)*sw.coverageScope
                    + (st.lastReviewed[ans.lastReviewed]??0)*sw.lastReviewed
                    + (st.stressTested[ans.stressTested]??0)*sw.stressTested;
        const penalty = ans.testType === "UNTESTED: Never exercised" ? 0.4 : 1;
        qScore = inner * penalty * 100;
      }

      if (qScore <= threshold) {
        gaps.push({
          id: q.id,
          question: q.q,
          pillar: pillar.name,
          weight: q.w,
          scorePct: Math.round(qScore),
          implementation: ans.implementation || "MISSING: Does not exist",
          testType: ans.testType || "",
          coverageScope: ans.coverageScope || "",
          lastReviewed: ans.lastReviewed || "",
          stressTested: ans.stressTested || ""
        });
      }
    }
  }

  return gaps.sort((a, b) => b.weight - a.weight || a.scorePct - b.scorePct);
}