// AeroShield AI - Main Application Logic & Reactive Engine
import { CITY_PRESETS, DIURNAL_CYCLE_MODEL, IAQ_HACKS, MYTH_BUSTERS, SUSTAINABLE_SWAPS, IMPACT_COEFFICIENTS } from "./data.js";
import { SmogAIAssistant } from "./aiEngine.js";

// Application State
const state = {
  currentCityId: "delhi",
  currentHour: new Date().getHours(),
  activeTab: "dashboard",
  userProfile: {
    hasInfants: false,
    hasElderly: true,
    hasAsthmatic: true,
    hasPregnant: false,
    hasPets: false,
    dwellingType: "Apartment (Moderate Draft)",
    heatingType: "Electric Radiant Heater",
    cookingType: "LPG Cooktop with Exhaust Hood",
    commuteMode: "Two-wheeler / Motorcycle (Daily)",
    budgetTier: "Moderate ($15 - $50)"
  },
  impact: {
    daysNavigated: 14,
    maskAdherence: 90, // %
    purifierHours: 16, // hrs/day
    commuteShift: true,
    heatingCleanSwap: true
  },
  crBox: {
    roomLength: 14, // ft
    roomWidth: 12,  // ft
    roomHeight: 9,  // ft
    currentStep: 4  // 1: Filters, 2: Fan, 3: Tape, 4: Shroud Completed
  }
};

// Initialize AI Assistant
const aiAssistant = new SmogAIAssistant();

// DOM Elements & Canvas Initialization
document.addEventListener("DOMContentLoaded", () => {
  initParticleCanvas();
  initEventListeners();
  loadSavedProfile();
  renderCityData();
  renderDiurnalTimeline();
  renderHacks();
  renderMythBusters();
  renderSustainableSwaps();
  updateImpactCalculator();
  updateCRBoxCalculator();
  initChat();
  renderFamilyPlanPreview();
});

// Canvas Particle Simulator
let canvas, ctx, particles = [];
function initParticleCanvas() {
  canvas = document.getElementById("smogCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Initialize particles based on current city PM2.5
  updateParticleCount();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const city = CITY_PRESETS[state.currentCityId];
    
    // Inversion Layer Ceiling line
    const ceilingY = Math.min(canvas.height * 0.45, Math.max(50, (city.inversionHeight / 1000) * canvas.height * 0.4));
    
    // Draw subtle thermal inversion haze lid
    const grad = ctx.createLinearGradient(0, 0, 0, ceilingY);
    grad.addColorStop(0, "rgba(220, 38, 38, 0.08)");
    grad.addColorStop(1, "rgba(245, 158, 11, 0.02)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, ceilingY);

    // Render individual particulate aerosols
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Keep trapped mostly under inversion ceiling
      if (p.y < ceilingY && Math.random() > 0.05) {
        p.vy = Math.abs(p.vy) * 0.9;
      }
      
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

function updateParticleCount() {
  const city = CITY_PRESETS[state.currentCityId];
  const targetCount = Math.min(260, Math.max(25, Math.round(city.pm25 * 0.6)));
  particles = [];
  
  const particleColors = [
    "rgba(156, 163, 175, 0.4)", // Gray soot
    "rgba(245, 158, 11, 0.35)", // Amber haze
    "rgba(239, 68, 68, 0.3)"    // Combustion red
  ];

  for (let i = 0; i < targetCount; i++) {
    particles.push({
      x: Math.random() * (canvas ? canvas.width : 1000),
      y: Math.random() * (canvas ? canvas.height : 800),
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * (city.windSpeed * 0.25 + 0.3),
      vy: (Math.random() - 0.5) * 0.6 + 0.1,
      color: particleColors[Math.floor(Math.random() * particleColors.length)]
    });
  }
}

// Event Listeners Setup
function initEventListeners() {
  // City Selector
  const citySelect = document.getElementById("citySelect");
  if (citySelect) {
    citySelect.addEventListener("change", (e) => {
      state.currentCityId = e.target.value;
      updateParticleCount();
      renderCityData();
      renderDiurnalTimeline();
      updateImpactCalculator();
      renderFamilyPlanPreview();
      updateAmbientGlow();
    });
  }

  // Navigation Tabs
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      state.activeTab = tabId;
      const targetPanel = document.getElementById(tabId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // Lifestyle Vulnerability Toggles
  document.querySelectorAll(".profile-pill[data-vuln]").forEach(pill => {
    pill.addEventListener("click", () => {
      const key = pill.getAttribute("data-vuln");
      state.userProfile[key] = !state.userProfile[key];
      pill.classList.toggle("active", state.userProfile[key]);
      saveProfile();
      updateImpactCalculator();
      renderFamilyPlanPreview();
    });
  });

  // Lifestyle Dropdown Selects
  ["dwellingType", "heatingType", "cookingType", "commuteMode", "budgetTier"].forEach(key => {
    const el = document.getElementById(`sel_${key}`);
    if (el) {
      el.addEventListener("change", (e) => {
        state.userProfile[key] = e.target.value;
        saveProfile();
        updateImpactCalculator();
        renderFamilyPlanPreview();
      });
    }
  });

  // Impact Sliders
  setupSlider("slider_days", "val_days", (val) => {
    state.impact.daysNavigated = parseInt(val, 10);
    updateImpactCalculator();
  });
  setupSlider("slider_mask", "val_mask", (val) => {
    state.impact.maskAdherence = parseInt(val, 10);
    updateImpactCalculator();
  });
  setupSlider("slider_purifier", "val_purifier", (val) => {
    state.impact.purifierHours = parseInt(val, 10);
    updateImpactCalculator();
  });

  // Impact Checkbox Swaps
  const chkCommute = document.getElementById("chk_commute_shift");
  if (chkCommute) {
    chkCommute.addEventListener("change", (e) => {
      state.impact.commuteShift = e.target.checked;
      updateImpactCalculator();
    });
  }
  const chkHeating = document.getElementById("chk_heating_swap");
  if (chkHeating) {
    chkHeating.addEventListener("change", (e) => {
      state.impact.heatingCleanSwap = e.target.checked;
      updateImpactCalculator();
    });
  }

  // Corsi-Rosenthal Room Inputs
  ["cr_len", "cr_wid", "cr_hgt"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        state.crBox.roomLength = parseFloat(document.getElementById("cr_len").value) || 12;
        state.crBox.roomWidth = parseFloat(document.getElementById("cr_wid").value) || 12;
        state.crBox.roomHeight = parseFloat(document.getElementById("cr_hgt").value) || 9;
        updateCRBoxCalculator();
      });
    }
  });

  // C-R Step Selector
  document.querySelectorAll(".cr-step-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cr-step-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.crBox.currentStep = parseInt(btn.getAttribute("data-step"), 10);
      renderCRBoxVisual();
    });
  });

  // API Key Settings Modal
  const btnApiKey = document.getElementById("btnApiKey");
  const modalApiKey = document.getElementById("modalApiKey");
  const btnCloseModal = document.getElementById("btnCloseApiKeyModal");
  const btnSaveKey = document.getElementById("btnSaveApiKey");
  const inputApiKey = document.getElementById("inputApiKey");

  if (btnApiKey && modalApiKey) {
    btnApiKey.addEventListener("click", () => {
      inputApiKey.value = aiAssistant.getApiKey();
      modalApiKey.classList.add("active");
    });
  }
  if (btnCloseModal && modalApiKey) {
    btnCloseModal.addEventListener("click", () => modalApiKey.classList.remove("active"));
  }
  if (btnSaveKey && modalApiKey) {
    btnSaveKey.addEventListener("click", () => {
      aiAssistant.setApiKey(inputApiKey.value);
      updateApiKeyStatusBadge();
      modalApiKey.classList.remove("active");
    });
  }

  // Print Family Plan
  const btnPrintPlan = document.getElementById("btnPrintPlan");
  if (btnPrintPlan) {
    btnPrintPlan.addEventListener("click", () => window.print());
  }

  // Quick WhatsApp Complaint Copy
  const btnCopyComplaint = document.getElementById("btnCopyComplaint");
  if (btnCopyComplaint) {
    btnCopyComplaint.addEventListener("click", copyComplaintTemplate);
  }
}

function setupSlider(sliderId, valueId, onUpdate) {
  const slider = document.getElementById(sliderId);
  const valEl = document.getElementById(valueId);
  if (!slider) return;
  slider.addEventListener("input", (e) => {
    if (valEl) valEl.textContent = e.target.value;
    onUpdate(e.target.value);
  });
}

function updateAmbientGlow() {
  const city = CITY_PRESETS[state.currentCityId];
  document.documentElement.style.setProperty("--ambient-color", city.categoryColor + "33");
}

// Render Current City AQI Telemetry
function renderCityData() {
  const city = CITY_PRESETS[state.currentCityId];
  if (!city) return;

  const aqiNumEl = document.getElementById("aqiMainNum");
  const aqiPillEl = document.getElementById("aqiStatusPill");
  const healthWarningEl = document.getElementById("aqiHealthWarning");
  const safeWindowEl = document.getElementById("telemetrySafeWindow");
  const worstWindowEl = document.getElementById("telemetryWorstWindow");

  if (aqiNumEl) {
    aqiNumEl.textContent = city.aqi;
    aqiNumEl.style.color = city.categoryColor;
  }
  if (aqiPillEl) {
    aqiPillEl.textContent = `${city.statusBadge} (${city.category})`;
    aqiPillEl.style.backgroundColor = city.categoryColor + "28";
    aqiPillEl.style.color = city.categoryColor === "#7f1d1d" ? "#fca5a5" : "#fed7aa";
    aqiPillEl.style.border = `1px solid ${city.categoryColor}88`;
  }
  if (healthWarningEl) healthWarningEl.textContent = city.healthWarning;
  if (safeWindowEl) safeWindowEl.textContent = city.ventilationSafeWindow;
  if (worstWindowEl) worstWindowEl.textContent = city.worstWindow;

  // Telemetry items
  const pm25El = document.getElementById("val_pm25");
  const pm10El = document.getElementById("val_pm10");
  const no2El = document.getElementById("val_no2");
  const coEl = document.getElementById("val_co");
  const tempEl = document.getElementById("val_temp");
  const windEl = document.getElementById("val_wind");
  const inversionEl = document.getElementById("val_inversion");
  const inversionBarEl = document.getElementById("inversionBarFill");

  if (pm25El) pm25El.textContent = `${city.pm25} µg/m³`;
  if (pm10El) pm10El.textContent = `${city.pm10} µg/m³`;
  if (no2El) no2El.textContent = `${city.no2} ppb`;
  if (coEl) coEl.textContent = `${city.co} ppm`;
  if (tempEl) tempEl.textContent = `${city.temp}°C (${city.humidity}% RH)`;
  if (windEl) windEl.textContent = `${city.windSpeed} km/h`;
  if (inversionEl) inversionEl.textContent = `${city.inversionHeight} meters`;

  if (inversionBarEl) {
    // Normal mixing height is ~1200m; lower is worse
    const pct = Math.min(100, Math.max(10, Math.round((city.inversionHeight / 1200) * 100)));
    inversionBarEl.style.width = `${pct}%`;
  }

  // Primary sources list
  const sourcesEl = document.getElementById("primarySourcesList");
  if (sourcesEl) {
    sourcesEl.innerHTML = city.primarySources
      .map(s => `<span class="badge-sub" style="color:#94a3b8; border-color:rgba(148,163,184,0.3); background:rgba(30,41,59,0.5);">${s}</span>`)
      .join(" ");
  }

  updateApiKeyStatusBadge();
}

function updateApiKeyStatusBadge() {
  const badge = document.getElementById("apiKeyStatusBadge");
  if (!badge) return;
  if (aiAssistant.hasApiKey()) {
    badge.textContent = "Gemini Live API Connected";
    badge.className = "card-header-badge text-emerald";
    badge.style.background = "rgba(16, 185, 129, 0.15)";
  } else {
    badge.textContent = "Built-in Neural Engine Active";
    badge.className = "card-header-badge text-cyan";
    badge.style.background = "rgba(6, 182, 212, 0.15)";
  }
}

// Render 24-Hour Diurnal Timeline
function renderDiurnalTimeline() {
  const container = document.getElementById("diurnalTimelineRow");
  if (!container) return;
  const baseCity = CITY_PRESETS[state.currentCityId];

  container.innerHTML = DIURNAL_CYCLE_MODEL.map((node) => {
    const nodeAqi = Math.round(baseCity.aqi * node.aqiMultiplier);
    const isSafe = node.danger === "Lowest" || node.danger === "Low";
    const isExtreme = node.danger === "Extreme" || node.danger === "Severe";
    const isCurrent = node.hour === state.currentHour || (state.currentHour >= node.hour && state.currentHour < node.hour + 2);

    let tagColor = "#6b7280";
    let tagBg = "rgba(107,114,128,0.2)";
    if (isSafe) {
      tagColor = "#10b981";
      tagBg = "rgba(16,185,129,0.2)";
    } else if (isExtreme) {
      tagColor = "#ef4444";
      tagBg = "rgba(239,68,68,0.2)";
    }

    return `
      <div class="diurnal-node ${isSafe ? 'safe-window' : ''} ${isExtreme ? 'danger-window' : ''} ${isCurrent ? 'selected' : ''}" 
           data-hour="${node.hour}" title="${node.desc}">
        <div class="diurnal-time">${node.label} ${isCurrent ? '• NOW' : ''}</div>
        <div class="diurnal-danger-tag" style="color:${tagColor}; background:${tagBg};">${node.danger}</div>
        <div class="diurnal-aqi-est" style="color:${nodeAqi > 300 ? '#f87171' : nodeAqi > 150 ? '#fb923c' : '#34d399'}">${nodeAqi}</div>
        <div class="text-muted" style="font-size:0.65rem;">Lid: ${Math.round(baseCity.inversionHeight * (1 / node.aqiMultiplier))}m</div>
      </div>
    `;
  }).join("");

  // Add click to inspect hour details
  container.querySelectorAll(".diurnal-node").forEach(nodeEl => {
    nodeEl.addEventListener("click", () => {
      container.querySelectorAll(".diurnal-node").forEach(n => n.classList.remove("selected"));
      nodeEl.classList.add("selected");
      const hr = parseInt(nodeEl.getAttribute("data-hour"), 10);
      const model = DIURNAL_CYCLE_MODEL.find(m => m.hour === hr);
      const detailEl = document.getElementById("diurnalDetailBox");
      if (detailEl && model) {
        detailEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong style="color:#93c5fd; font-size:1rem;">Selected Time: ${model.label} (${model.danger} Hazard Window)</strong>
            <span class="card-header-badge" style="background:rgba(255,255,255,0.1);">${model.inversionStrength} Inversion Lid</span>
          </div>
          <p style="font-size:0.88rem; color:#cbd5e1;">${model.desc}</p>
          <div style="margin-top:0.5rem; font-size:0.82rem; color:${model.danger === 'Lowest' ? '#34d399' : '#fca5a5'};">
            ${model.danger === 'Lowest' 
              ? '✅ RECOMMENDED ACTION: Open windows for 15-20 min cross-ventilation to flush indoor CO2 without loading toxic PM2.5.' 
              : '⚠️ RECOMMENDED ACTION: Avoid opening exterior doors/windows. Keep cabin filter / indoor purifiers on active recirculation.'}
          </div>
        `;
      }
    });
  });
}

// Render IAQ Hacks
function renderHacks() {
  const container = document.getElementById("iaqHacksGrid");
  if (!container) return;

  container.innerHTML = IAQ_HACKS.map(hack => `
    <div class="hack-card">
      <div>
        <div class="hack-header">
          <h4>${hack.title}</h4>
          <span class="hack-badge">${hack.badge}</span>
        </div>
        <div class="hack-meta-row">
          <span class="hack-meta-item">💰 Cost: <strong>${hack.cost}</strong></span>
          <span class="hack-meta-item">⚡ CADR / Effect: <strong>${hack.effectiveness}</strong></span>
          <span class="hack-meta-item">⏱️ Setup: <strong>${hack.buildTime}</strong></span>
        </div>
        <p style="font-size:0.86rem; color:#e2e8f0; margin-bottom:0.6rem;">${hack.summary}</p>
        <div class="hack-why">
          <strong>🔬 The Science Behind It:</strong> ${hack.whyItWorks}
        </div>
        <div class="mt-2" style="font-size:0.8rem; font-weight:700; color:#94a3b8; text-transform:uppercase;">Step-by-Step Action:</div>
        <ol class="hack-steps-list">
          ${hack.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
      </div>
      <div style="font-size:0.75rem; color:#9ca3af; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;">
        📦 <strong>Materials:</strong> ${hack.materials.join(", ")}
      </div>
    </div>
  `).join("");
}

// Render Myth Busters
function renderMythBusters() {
  const container = document.getElementById("mythBustersGrid");
  if (!container) return;

  container.innerHTML = MYTH_BUSTERS.map(m => `
    <div class="myth-card">
      <div class="myth-title">
        <span>❌ MYTH:</span> "${m.myth}"
      </div>
      <span class="myth-verdict" style="background:${m.verdictColor}33; color:${m.verdictColor}; border:1px solid ${m.verdictColor}66;">
        ${m.verdict}
      </span>
      <p class="myth-body">
        <strong>🧪 Scientific Mechanism:</strong> ${m.scientificReality}
      </p>
      <div class="myth-alt">
        <strong>✅ Evidence-Based Safe Alternative:</strong> ${m.saferAlternative}
      </div>
    </div>
  `).join("");
}

// Render Sustainable Swaps
function renderSustainableSwaps() {
  const container = document.getElementById("swapsContainer");
  if (!container) return;

  container.innerHTML = SUSTAINABLE_SWAPS.map(swap => `
    <div class="hack-card" style="margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
        <span class="badge-sub" style="font-size:0.8rem;">${swap.category}</span>
        <span class="text-muted" style="font-size:0.78rem;">High Impact Transition</span>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:0.75rem;">
        <div style="background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.3); border-radius:0.75rem; padding:0.85rem;">
          <div style="font-size:0.72rem; color:#f87171; font-weight:700; text-transform:uppercase;">🚫 Current High-Emission Practice</div>
          <div style="font-size:0.92rem; font-weight:600; color:#fca5a5; margin-top:0.25rem;">${swap.currentPractice}</div>
        </div>
        <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:0.75rem; padding:0.85rem;">
          <div style="font-size:0.72rem; color:#34d399; font-weight:700; text-transform:uppercase;">🌱 Sustainable Clean Swap</div>
          <div style="font-size:0.92rem; font-weight:600; color:#6ee7b7; margin-top:0.25rem;">${swap.cleanSwap}</div>
        </div>
      </div>
      <div class="hack-why" style="border-left-color:#10b981;">
        <strong>🌍 Direct Health & Community Impact:</strong> ${swap.directImpact}
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:#94a3b8; margin-top:0.5rem;">
        <span>💡 <strong>Household Value:</strong> ${swap.payback}</span>
        <span>🏘️ <strong>Community Benefit:</strong> ${swap.communityBenefit}</span>
      </div>
    </div>
  `).join("");
}

// Interactive Impact Simulator Logic
function updateImpactCalculator() {
  const city = CITY_PRESETS[state.currentCityId];
  const { daysNavigated, maskAdherence, purifierHours, commuteShift, heatingCleanSwap } = state.impact;

  // Hourly exposure breakdown
  // Average outdoor commute hours ~ 2 hrs, indoor hours ~ 22 hrs
  const outdoorHoursPerDay = 2.0;
  const indoorHoursPerDay = 22.0;

  // Unfiltered baseline daily PM2.5 inhalation mass (micrograms):
  // Outdoor inhalation: outdoorHours * breathingRateCommute * city.pm25
  // Indoor unpurified inhalation: indoorHours * breathingRateRest * (city.pm25 * 0.75 baseline infiltration)
  const baselineOutdoorIntake = outdoorHoursPerDay * IMPACT_COEFFICIENTS.breathingRateCommute * city.pm25;
  const baselineIndoorIntake = indoorHoursPerDay * IMPACT_COEFFICIENTS.breathingRateRest * (city.pm25 * 0.75);
  const baselineDailyIntakeUg = baselineOutdoorIntake + baselineIndoorIntake;

  // Mitigated daily inhalation:
  // Mask protection: outdoorHours * breathingRateCommute * city.pm25 * (1 - (maskAdherence / 100) * IMPACT_COEFFICIENTS.n95FiltrationEfficiency)
  const maskProtectionFraction = (maskAdherence / 100) * IMPACT_COEFFICIENTS.n95FiltrationEfficiency;
  const mitigatedOutdoorIntake = outdoorHoursPerDay * IMPACT_COEFFICIENTS.breathingRateCommute * city.pm25 * (1 - maskProtectionFraction);

  // Indoor protection with air purifier running for X hours
  // During purifier hours, indoor PM2.5 drops by 85%
  const purifiedIndoorRatio = Math.min(1.0, purifierHours / 24.0);
  const effectiveIndoorConcentration = (city.pm25 * 0.75) * (1 - purifiedIndoorRatio * IMPACT_COEFFICIENTS.hepaReductionFactor);
  const mitigatedIndoorIntake = indoorHoursPerDay * IMPACT_COEFFICIENTS.breathingRateRest * effectiveIndoorConcentration;

  const mitigatedDailyIntakeUg = mitigatedOutdoorIntake + mitigatedIndoorIntake;
  const dailyIntakeReductionUg = Math.max(0, baselineDailyIntakeUg - mitigatedDailyIntakeUg);

  // Total for N days in milligrams (1 mg = 1000 µg)
  const totalReductionMg = (dailyIntakeReductionUg * daysNavigated) / 1000;
  
  // Berkeley Earth cigarettes avoided calculation:
  // 1 cigarette ≈ 330 µg inhaled PM2.5
  const totalCigarettesAvoided = Math.round((dailyIntakeReductionUg * daysNavigated) / IMPACT_COEFFICIENTS.pm25PerCigaretteMicrograms);

  // CO2e and emissions prevented from sustainable swaps:
  let totalCO2eSavedKg = 0;
  let totalNOxSavedGrams = 0;

  if (commuteShift) {
    totalCO2eSavedKg += daysNavigated * IMPACT_COEFFICIENTS.carSoloAvoidedCO2Kg;
    totalNOxSavedGrams += daysNavigated * IMPACT_COEFFICIENTS.carSoloAvoidedNOxGrams;
  }
  if (heatingCleanSwap) {
    // Avoiding 2.5 kg wood/coal burning per day saves ~4.2 kg CO2 and 75g PM2.5
    totalCO2eSavedKg += daysNavigated * 4.2;
  }

  // Update DOM Elements
  const elMg = document.getElementById("stat_lung_pm25");
  const elCig = document.getElementById("stat_cigarettes");
  const elCO2 = document.getElementById("stat_co2_saved");

  if (elMg) elMg.textContent = `${totalReductionMg.toFixed(1)} mg`;
  if (elCig) elCig.textContent = `${totalCigarettesAvoided}`;
  if (elCO2) elCO2.textContent = `${totalCO2eSavedKg.toFixed(1)} kg`;

  // Update Dynamic Explanation
  const expEl = document.getElementById("impactDynamicExplainer");
  if (expEl) {
    expEl.innerHTML = `
      <strong>How this is calculated:</strong> Over <strong>${daysNavigated} days</strong> in ${city.name}, your adherence to an N95 respirator (${maskAdherence}% of transit) and running mechanical air cleaning for <strong>${purifierHours} hours/day</strong> directly prevented <strong>${totalReductionMg.toFixed(1)} milligrams of toxic fine particulate matter</strong> from entering pulmonary alveoli. 
      According to the Berkeley Earth respiratory equivalent model, this spares your lungs the vascular damage equivalent to smoking <strong>${totalCigarettesAvoided} commercial cigarettes</strong>.
    `;
  }
}

// Corsi-Rosenthal Box CADR Calculator
function updateCRBoxCalculator() {
  const { roomLength, roomWidth, roomHeight } = state.crBox;
  const roomVolumeCuFt = roomLength * roomWidth * roomHeight;
  
  // C-R Box average Clean Air Delivery Rate (CADR) in CFM ~ 550 CFM
  const crBoxCadr = 550;
  // Typical commercial unit CADR ~ 180 CFM
  const commercialCadr = 180;

  // Air Changes Per Hour (ACH) = (CADR * 60) / Room Volume
  const crBoxAch = roomVolumeCuFt > 0 ? ((crBoxCadr * 60) / roomVolumeCuFt).toFixed(1) : 0;
  const commercialAch = roomVolumeCuFt > 0 ? ((commercialCadr * 60) / roomVolumeCuFt).toFixed(1) : 0;

  const elRoomVol = document.getElementById("cr_calc_vol");
  const elCrAch = document.getElementById("cr_calc_ach");
  const elCommAch = document.getElementById("cr_calc_comm_ach");

  if (elRoomVol) elRoomVol.textContent = `${roomVolumeCuFt.toLocaleString()} cu ft`;
  if (elCrAch) elCrAch.textContent = `${crBoxAch} ACH`;
  if (elCommAch) elCommAch.textContent = `${commercialAch} ACH`;

  renderCRBoxVisual();
}

// 3D-styled Canvas Visualizer for Corsi-Rosenthal Box
function renderCRBoxVisual() {
  const wrap = document.getElementById("crCanvasContainer");
  if (!wrap) return;

  const step = state.crBox.currentStep;
  const stepTitles = [
    "Step 1: Four MERV 13 Filters Form the Open Cube",
    "Step 2: 20-inch Box Fan Placed on Top (Upward Airflow)",
    "Step 3: Bottom Cardboard Floor & All Seams Taped Sealed",
    "Step 4: Cardboard Circular Shroud Attached (Completed Unit!)"
  ];

  const svgDiagram = `
    <svg width="100%" height="100%" viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
        <linearGradient id="filterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#374151" />
          <stop offset="50%" stop-color="#4b5563" />
          <stop offset="100%" stop-color="#1f2937" />
        </linearGradient>
        <pattern id="pleatPattern" width="10" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="5" y2="20" stroke="#9ca3af" stroke-width="1.2" />
          <line x1="5" y1="20" x2="10" y2="0" stroke="#9ca3af" stroke-width="1.2" />
        </pattern>
      </defs>

      <!-- Background Floor shadow -->
      <ellipse cx="250" cy="225" rx="140" ry="25" fill="rgba(0,0,0,0.5)" />

      <!-- Step 1: Filter Cube Base -->
      <polygon points="150,110 350,110 390,140 190,140" fill="#1f2937" stroke="#3b82f6" stroke-width="1.5" />
      <!-- Left Filter Face -->
      <polygon points="150,110 190,140 190,215 150,185" fill="url(#pleatPattern)" stroke="#60a5fa" stroke-width="1" />
      <!-- Front Filter Face -->
      <polygon points="190,140 390,140 390,215 190,215" fill="url(#pleatPattern)" stroke="#60a5fa" stroke-width="1.5" />
      
      <!-- Inward Air Flow Arrows -->
      <g stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.8">
        <path d="M 120 150 L 160 150 M 150 145 L 160 150 L 150 155" />
        <path d="M 290 245 L 290 220 M 285 230 L 290 220 L 295 230" />
        <path d="M 420 170 L 380 170 M 390 165 L 380 170 L 390 175" />
      </g>
      <text x="110" y="140" fill="#38bdf8" font-size="10" font-family="sans-serif">Air Intake</text>
      <text x="390" y="160" fill="#38bdf8" font-size="10" font-family="sans-serif">Air Intake</text>

      ${step >= 2 ? `
        <!-- Step 2: 20-inch Box Fan on top -->
        <polygon points="140,85 340,85 395,115 195,115" fill="#111827" stroke="#93c5fd" stroke-width="2" />
        <ellipse cx="265" cy="100" rx="95" ry="18" fill="url(#fanGrad)" opacity="0.9" />
        <!-- Fan Blades -->
        <path d="M 265 100 Q 240 85 220 95 Q 245 105 265 100 Z" fill="#ffffff" opacity="0.8" />
        <path d="M 265 100 Q 290 115 310 105 Q 285 95 265 100 Z" fill="#ffffff" opacity="0.8" />
        
        <!-- Clean Air Exhaust Arrows -->
        <g stroke="#10b981" stroke-width="2.5" fill="none">
          <path d="M 265 80 L 265 40 M 260 50 L 265 40 L 270 50" />
          <path d="M 230 85 L 210 50 M 205 60 L 210 50 L 220 58" />
          <path d="M 300 85 L 320 50 M 310 58 L 320 50 L 325 60" />
        </g>
        <text x="215" y="30" fill="#34d399" font-size="12" font-weight="bold" font-family="sans-serif">Clean Exhaust (550+ CFM)</text>
      ` : ''}

      ${step >= 3 ? `
        <!-- Step 3: Duct Tape Sealing seams -->
        <line x1="190" y1="140" x2="190" y2="215" stroke="#f59e0b" stroke-width="6" opacity="0.85" />
        <line x1="390" y1="140" x2="390" y2="215" stroke="#f59e0b" stroke-width="6" opacity="0.85" />
        <line x1="190" y1="215" x2="390" y2="215" stroke="#f59e0b" stroke-width="6" opacity="0.85" />
        <text x="230" y="235" fill="#f59e0b" font-size="10" font-family="sans-serif">Taped Airtight Seams</text>
      ` : ''}

      ${step >= 4 ? `
        <!-- Step 4: Cardboard Circular Shroud -->
        <polygon points="135,80 345,80 400,112 190,112" fill="#78350f" opacity="0.8" stroke="#d97706" stroke-width="2" />
        <ellipse cx="265" cy="96" rx="60" ry="12" fill="#111827" stroke="#34d399" stroke-width="2" />
        <text x="320" y="75" fill="#fbbf24" font-size="11" font-weight="bold" font-family="sans-serif">+20% CADR Shroud</text>
      ` : ''}
    </svg>
  `;

  wrap.innerHTML = `
    <div style="position:absolute; top:12px; left:16px; font-size:0.85rem; font-weight:700; color:#93c5fd;">
      ${stepTitles[step - 1]}
    </div>
    ${svgDiagram}
  `;
}

// Chat Copilot Implementation
function initChat() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("btnSendMessage");
  const messagesBox = document.getElementById("chatMessages");
  const quickPills = document.querySelectorAll(".quick-prompt-chip");

  if (!input || !sendBtn || !messagesBox) return;

  async function handleSend(text) {
    const query = text || input.value.trim();
    if (!query) return;

    input.value = "";

    // Append User Message
    appendMessage("user", query);

    // Create Assistant Placeholder Message Bubble
    const assistantBubble = document.createElement("div");
    assistantBubble.className = "message-bubble assistant";
    assistantBubble.innerHTML = `
      <div class="message-avatar">⚡</div>
      <div class="message-content">
        <span class="text-muted" style="font-size:0.85rem;">AeroShield AI analyzing atmospheric telemetry and lifestyle profile...</span>
      </div>
    `;
    messagesBox.appendChild(assistantBubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    const contentDiv = assistantBubble.querySelector(".message-content");
    let accumulatedText = "";

    const city = CITY_PRESETS[state.currentCityId];
    try {
      const stream = aiAssistant.streamResponse(query, state.userProfile, city, state.currentHour);
      contentDiv.innerHTML = "";
      
      for await (const chunk of stream) {
        accumulatedText += chunk;
        contentDiv.innerHTML = renderMarkdown(accumulatedText);
        messagesBox.scrollTop = messagesBox.scrollHeight;
      }
    } catch (err) {
      contentDiv.innerHTML = `<span class="text-rose">Error generating response: ${err.message}</span>`;
    }
  }

  sendBtn.addEventListener("click", () => handleSend());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  quickPills.forEach(pill => {
    pill.addEventListener("click", () => {
      handleSend(pill.textContent.trim());
    });
  });
}

function appendMessage(role, text) {
  const messagesBox = document.getElementById("chatMessages");
  if (!messagesBox) return;
  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${role}`;
  bubble.innerHTML = `
    <div class="message-avatar">${role === 'user' ? '👤' : '⚡'}</div>
    <div class="message-content">${role === 'user' ? escapeHtml(text) : renderMarkdown(text)}</div>
  `;
  messagesBox.appendChild(bubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Simple Clean Markdown Renderer
function renderMarkdown(md) {
  let html = md;
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Bullet lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  // Tables
  html = html.replace(/\| (.*) \|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim() !== '');
    if (match.includes('---')) return '';
    return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
  });
  if (html.includes('<tr>')) {
    html = html.replace(/(<tr>.*?<\/tr>)+/s, '<table>$&</table>');
  }
  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  return html;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// Family Plan Preview Rendering
function renderFamilyPlanPreview() {
  const preview = document.getElementById("familyPlanCard");
  const printArea = document.getElementById("printablePlanSection");
  if (!preview) return;

  const city = CITY_PRESETS[state.currentCityId];
  const p = state.userProfile;

  const content = `
    <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 0.75rem; margin-bottom: 1rem;">
      <h3 style="font-size:1.3rem; color:#93c5fd;">🏠 Family Winter Smog Defense Plan</h3>
      <p style="font-size:0.85rem; color:#9ca3af;">Location: <strong>${city.name}</strong> • Current Base AQI: <strong>${city.aqi}</strong> • Generated: ${new Date().toLocaleDateString()}</p>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1rem; font-size:0.85rem;">
      <div style="background:rgba(31,41,55,0.6); padding:0.85rem; border-radius:0.75rem;">
        <strong style="color:#60a5fa;">👨‍👩‍👧 Household Vulnerability Flags:</strong>
        <ul style="padding-left:1.2rem; margin-top:0.35rem; color:#cbd5e1;">
          ${p.hasAsthmatic ? "<li><strong>Asthma / COPD Alert:</strong> Inhalers must be carried during all transit.</li>" : ""}
          ${p.hasInfants ? "<li><strong>Pediatric (<5 yrs):</strong> Zero outdoor exposure during inversion hours (06:00-09:30).</li>" : ""}
          ${p.hasElderly ? "<li><strong>Elderly (65+):</strong> Avoid cold outdoor walks; blood pressure checks daily.</li>" : ""}
          ${!p.hasAsthmatic && !p.hasInfants && !p.hasElderly ? "<li>Healthy adults: Wear N95 during active outdoor transit.</li>" : ""}
        </ul>
      </div>

      <div style="background:rgba(31,41,55,0.6); padding:0.85rem; border-radius:0.75rem;">
        <strong style="color:#34d399;">⏰ Critical Daily Windows:</strong>
        <div style="margin-top:0.4rem; color:#cbd5e1;">
          <div>🔴 <strong>Danger Lockout:</strong> ${city.worstWindow}</div>
          <div style="margin-top:0.25rem;">🟢 <strong>Safe Ventilation:</strong> ${city.ventilationSafeWindow}</div>
        </div>
      </div>
    </div>

    <div style="background:rgba(31,41,55,0.4); padding:0.85rem; border-radius:0.75rem; margin-bottom:1rem; font-size:0.85rem;">
      <strong style="color:#fbbf24;">📋 Three Rules for Tonight:</strong>
      <ol style="padding-left:1.2rem; margin-top:0.35rem; color:#e2e8f0;">
        <li>Place rolled towels along exterior door cracks and drafty balcony sliders.</li>
        <li>Cook exclusively on rear burners with exhaust fan active; wipe floors with damp microfiber cloth.</li>
        <li>Keep bedroom C-R Box / Purifier running on Medium with a shallow water basin for mucosal moisture.</li>
      </ol>
    </div>
  `;

  preview.innerHTML = content;
  if (printArea) {
    printArea.innerHTML = `
      <div style="font-family:sans-serif; padding:1.5rem; border:2px solid #1e293b; border-radius:8px;">
        <h1 style="font-size:1.6rem; margin-bottom:0.25rem;">AeroShield AI • Family Smog Defense Plan</h1>
        <p style="color:#64748b; font-size:0.9rem; margin-bottom:1rem;">Post this sheet on your refrigerator or near the main entryway.</p>
        ${content}
      </div>
    `;
  }
}

// Copy Citizen Burning Complaint Script
function copyComplaintTemplate() {
  const city = CITY_PRESETS[state.currentCityId];
  const template = `🚨 CITIZEN AIR POLLUTION REPORT
Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}
City/Zone: ${city.name} (Current Local AQI: ${city.aqi})
Incident: Active Open Burning of Biomass / Waste / Leaves
Immediate Threat: Severe respiratory danger for local children, elderly, and asthmatic residents under current low thermal inversion conditions (${city.inversionHeight}m mixing height).
Request: Immediate municipal enforcement, fire suppression, and penalties under Clean Air regulations.`;

  navigator.clipboard.writeText(template).then(() => {
    const btn = document.getElementById("btnCopyComplaint");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = "✅ Copied to Clipboard!";
      setTimeout(() => btn.innerHTML = orig, 2500);
    }
  });
}

// Storage helpers
function saveProfile() {
  localStorage.setItem("aero_user_profile", JSON.stringify(state.userProfile));
}

function loadSavedProfile() {
  try {
    const saved = localStorage.getItem("aero_user_profile");
    if (saved) {
      state.userProfile = { ...state.userProfile, ...JSON.parse(saved) };
      // Sync UI elements
      Object.entries(state.userProfile).forEach(([k, v]) => {
        const pill = document.querySelector(`.profile-pill[data-vuln="${k}"]`);
        if (pill) pill.classList.toggle("active", Boolean(v));
        const sel = document.getElementById(`sel_${k}`);
        if (sel) sel.value = v;
      });
    }
  } catch (e) {
    console.warn("Could not load saved profile", e);
  }
}
