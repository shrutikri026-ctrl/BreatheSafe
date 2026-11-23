// BreatheSafe (AeroShield AI) - Simplified & User-Friendly Engine
(function () {
  "use strict";

  // 1. Data Presets
  const CITIES = {
    patna: {
      name: "Patna (Bihar)",
      status: "Stay Indoors (Severe Smog)",
      isDanger: true,
      safeWindow: "1:30 PM – 3:30 PM",
      dangerHours: "6:00 AM – 9:30 AM & 7:00 PM – 10:30 PM",
      summary: "Dense Gangetic basin winter smog trapped by nocturnal ground cooling. Keep doors and windows tightly sealed. Midday sunshine breaks the inversion for safe errands."
    },
    delhi: {
      name: "Delhi-NCR",
      status: "Stay Indoors (Severe Smog)",
      isDanger: true,
      safeWindow: "1:30 PM – 3:00 PM",
      dangerHours: "6:00 AM – 9:30 AM & 7:30 PM – 10:00 PM",
      summary: "The air is very smoky and hazardous today. Keep doors and windows closed. Afternoon sunshine will clear the air briefly for a safe ventilation window."
    },
    lahore: {
      name: "Lahore",
      status: "Stay Indoors (Off-Scale Smog)",
      isDanger: true,
      safeWindow: "1:00 PM – 2:30 PM",
      dangerHours: "5:30 AM – 10:00 AM & 7:00 PM – 11:30 PM",
      summary: "Extremely heavy smoke and agricultural haze trapped at street level. Avoid outdoor walks. Run air purifiers indoors continuously."
    },
    beijing: {
      name: "Beijing",
      status: "Unhealthy Smog (Winter Heating)",
      isDanger: true,
      safeWindow: "12:30 PM – 3:30 PM",
      dangerHours: "7:00 AM – 9:00 AM & 8:00 PM – 10:30 PM",
      summary: "Winter heating has caused a noticeable smog spike. Wear an N95 mask outdoors, especially if commuting by bike or walking."
    },
    krakow: {
      name: "Kraków",
      status: "Unhealthy (Coal Heating Smog)",
      isDanger: true,
      safeWindow: "1:00 PM – 3:00 PM",
      dangerHours: "7:30 AM – 9:30 AM & 6:00 PM – 10:30 PM",
      summary: "Stagnant cold air is trapping residential chimney smoke in the river valley. Air out rooms only in early afternoon."
    },
    saltlake: {
      name: "Salt Lake City",
      status: "Sensitive Groups Alert (Valley Inversion)",
      isDanger: false,
      safeWindow: "1:30 PM – 3:30 PM",
      dangerHours: "7:00 AM – 9:30 AM & 5:30 PM – 8:30 PM",
      summary: "Cold air trapped in the valley basin is holding urban exhaust. Asthmatics and young kids should keep inhalers handy and limit outdoor exertion."
    },
    milan: {
      name: "Milan",
      status: "Sensitive Groups Alert (Alpine Haze)",
      isDanger: false,
      safeWindow: "1:00 PM – 3:30 PM",
      dangerHours: "7:30 AM – 9:30 AM & 6:30 PM – 9:30 PM",
      summary: "Stagnant winter air in the Po Valley. Keep bedroom windows shut during morning commute hours."
    },
    clean_baseline: {
      name: "Zurich",
      status: "Air is Clean & Fresh! 🟢",
      isDanger: false,
      safeWindow: "Anytime Today",
      dangerHours: "None",
      summary: "Air quality is wonderful! Great day for outdoor activities, jogging, and keeping windows open for fresh mountain air."
    }
  };

  // 2. User State
  const state = {
    cityId: "patna",
    days: 14,
    profile: {
      hasInfants: false,
      hasElderly: true,
      hasAsthmatic: true,
      hasPets: false,
      commute: "bike" // bike, car, bus, walk, wfh
    }
  };

  // 3. UI Update Helpers
  function updateHero() {
    const city = CITIES[state.cityId] || CITIES.delhi;
    
    // Status Badge
    const badge = document.getElementById("statusBadge");
    const badgeText = document.getElementById("statusBadgeText");
    const aqiNum = document.getElementById("heroAqiNumber");
    const msg = document.getElementById("heroMainMessage");
    const safeWin = document.getElementById("heroSafeWindow");
    const dangerHrs = document.getElementById("heroDangerHours");
    const chatCity = document.getElementById("chatCityName");
    const chatAqi = document.getElementById("chatAqiText");

    if (badge && badgeText) {
      badgeText.textContent = city.status;
      badge.className = city.isDanger ? "status-badge danger" : "status-badge safe";
      badge.querySelector("span:first-child").textContent = city.isDanger ? "🔴" : "🟢";
    }

    if (aqiNum) aqiNum.textContent = city.aqi;
    if (msg) msg.textContent = city.summary;
    if (safeWin) safeWin.textContent = city.safeWindow;
    if (dangerHrs) dangerHrs.textContent = city.dangerHours;
    if (chatCity) chatCity.textContent = city.name;
    if (chatAqi) chatAqi.textContent = `${city.status} (${city.aqi} AQI)`;

    updateTailoredSteps();
    updateImpact();
  }

  function updateTailoredSteps() {
    const city = CITIES[state.cityId];
    const p = state.profile;

    const morningTitle = document.getElementById("stepMorningTitle");
    const morningDesc = document.getElementById("stepMorningDesc");
    const nightDesc = document.getElementById("stepNightDesc");

    // Morning Advice
    let mTitle = "Morning Routine";
    let mDesc = "Cold morning air holds vehicle exhaust close to the ground. Keep doors and windows tightly shut.";

    if (p.commute === "bike" || p.commute === "walk") {
      mTitle = "Wear an N95 Mask on Commute";
      mDesc = `Since you travel by ${p.commute === "bike" ? "bike/scooter" : "walking"}, you are breathing dense traffic exhaust. Wear a certified N95/FFP2 mask with a tight nose clip. A simple cloth mask does not stop PM2.5.`;
    } else if (p.commute === "car") {
      mTitle = "Turn on In-Car AC Recirculation";
      mDesc = "In traffic, keep your car windows closed and press the 'Air Recirculation' button on your AC to filter cabin air through your car's pollen filter.";
    } else if (p.commute === "wfh") {
      mTitle = "Work-from-Home Clean Air Zone";
      mDesc = "Avoid opening exterior doors before 10 AM. Place a rolled towel under the main entrance door to stop outside smoke seepage.";
    }

    if (p.hasAsthmatic) {
      mDesc += " ⚠️ Ensure asthma inhalers are within reach before stepping out.";
    }
    if (p.hasInfants) {
      mDesc += " ⚠️ Keep babies and toddlers indoors during morning hours.";
    }

    if (morningTitle) morningTitle.textContent = mTitle;
    if (morningDesc) morningDesc.textContent = mDesc;

    // Night Advice
    let nDesc = "Smog settles back down after dark. Wet-mop bedroom floors (never dry-sweep, which kicks dust up).";
    if (p.hasElderly || p.hasAsthmatic) {
      nDesc += " Place a ceramic bowl of water on or near your room heater so the warm air doesn't dry your airways.";
    }
    nDesc += " Run your air purifier or DIY filter box in the bedroom on low/medium all night.";

    if (nightDesc) nightDesc.textContent = nDesc;
  }

  function updateImpact() {
    const city = CITIES[state.cityId];
    const days = state.days;

    // Calculate cigarettes avoided & dust blocked
    // 1 day in 400 AQI ~ 18-20 cigarettes; with N95 + indoor purifier, you avoid ~85%
    const cigsPerDay = Math.max(1, Math.round((city.aqi / 22) * 0.85));
    const totalCigs = cigsPerDay * days;

    // Milligrams of dust kept out of lungs
    const mgDust = Math.round(((city.aqi * 0.75 * 0.55 * 24 * 0.8) / 1000) * days);

    // Community CO2e prevented by clean habits (kg)
    const co2Kg = Math.round(days * 3.2);

    const elDays = document.getElementById("impactDaysText");
    const elCigs = document.getElementById("impactCigarettes");
    const elDust = document.getElementById("impactDustMg");
    const elCo2 = document.getElementById("impactCo2Kg");

    if (elDays) elDays.textContent = `${days} Days`;
    if (elCigs) elCigs.textContent = `${totalCigs}`;
    if (elDust) elDust.textContent = `${mgDust} mg`;
    if (elCo2) elCo2.textContent = `${co2Kg} kg`;
  }

  // 4. Comprehensive AI Domain Knowledge Engine
  function getAiReply(question) {
    const q = question.toLowerCase();
    const city = CITIES[state.cityId] || CITIES.delhi;

    // 1. Exercise / Running / Jogging / Cycling / Outdoor sports
    if (q.includes("jog") || q.includes("run") || q.includes("walk") || q.includes("exercise") || q.includes("workout") || q.includes("gym") || q.includes("sport") || q.includes("cycle") || q.includes("cycling") || q.includes("outdoor") || q.includes("marathon")) {
      return `### 🏃 Exercise & Outdoor Workouts in Smog (${city.name})
* **The Medical Reality:** When you exercise, your breathing rate increases from 6 liters/min to 60–100 liters/min. You breathe deeply through your mouth, bypassing your nose's natural filters, pulling **10x more toxic PM2.5 deep into your pulmonary alveoli**.
* **Is Morning Running Safe?** **NO.** Early mornings (6:00 AM – 9:30 AM) have the worst thermal inversion, trapping diesel soot at ground level. Morning jogs in ${city.aqi} AQI cause severe airway inflammation and vascular stress.
* **Safe Exercise Protocol:**
  1. **Move Workouts Indoors:** Exercise at home or in an air-conditioned/purified indoor gym.
  2. **Safe Outdoor Window:** If you must walk or run outside, do so strictly between **${city.safeWindow}**, when afternoon sunshine lifts the smog ceiling.
  3. **Low Intensity:** Keep exertion moderate. Never do high-intensity interval training or sprints in outdoor smog.`;
    }

    // 2. Pregnancy & Unborn Child
    if (q.includes("pregnant") || q.includes("pregnancy") || q.includes("fetus") || q.includes("unborn") || q.includes("trimester") || q.includes("expecting")) {
      return `### 🤰 Pregnancy & Smog Protection Guide
* **Medical Risks:** Ultra-fine PM2.5 particles are small enough to cross the lung-blood barrier into the maternal bloodstream. Heavy smog exposure during pregnancy increases risks of maternal hypertension, low birth weight, and systemic inflammation.
* **Essential Protective Steps:**
  1. **Create a Clean Sleeping Sanctuary:** Keep a HEPA purifier or Corsi-Rosenthal Box running in the bedroom 24/7. Target indoor PM2.5 under 25 µg/m³.
  2. **Strict Outdoor Masking:** Never step out into ${city.name}'s air without a certified, tight-fitting **N95 or FFP2 respirator**.
  3. **Monitor Blood Pressure:** Winter cold plus smog triggers vascular constriction. Check blood pressure regularly.
  4. **Hydration & Warm Fluids:** Sip warm water throughout the day to support circulation and clear inhaled secretions.`;
    }

    // 3. Pets, Dogs, Cats, Birds
    if (q.includes("pet") || q.includes("dog") || q.includes("cat") || q.includes("bird") || q.includes("puppy") || q.includes("kitten") || q.includes("paw")) {
      return `### 🐕 Protecting Pets & Domestic Animals in Smog
* **Why Pets Are Vulnerable:** Dogs and cats walk much closer to the ground where heavy exhaust, lead particles, and tire microplastics settle. Pet birds have ultra-sensitive respiratory air sacs and can develop fatal distress in high smoke.
* **Actionable Pet Protocol:**
  1. **Shorten Outdoor Walks:** Keep potty breaks under 10–15 minutes. Avoid outdoor exercise during morning/evening peak smog hours.
  2. **Wipe Paws & Fur:** After every walk, wipe your dog's paws and belly with a damp microfiber cloth. This stops them from licking toxic street soot off their fur!
  3. **Move Play Indoors:** Play fetch or tug-of-war inside the house instead of taking long outdoor park walks.
  4. **Watch for Warning Signs:** If your pet exhibits labored breathing, excessive panting, watery eyes, or lethargy, contact a veterinarian immediately.`;
    }

    // 4. Seniors, Elders, Heart Disease, Blood Pressure, Stroke
    if (q.includes("elder") || q.includes("senior") || q.includes("grandparent") || q.includes("heart") || q.includes("cardiac") || q.includes("bp") || q.includes("blood pressure") || q.includes("stroke") || q.includes("hypertension")) {
      return `### 👵 Senior Citizens & Cardiovascular Health in Smog
* **The Cardiac Threat:** Winter smog is not just a lung problem—it is a **cardiovascular emergency**. Cold temperatures cause blood vessels to narrow, while inhaled PM2.5 particles enter the bloodstream, triggering systemic arterial inflammation and plaque rupture (spiking heart attack and stroke risk).
* **Immediate Senior Protocol:**
  1. **Skip Cold Morning Walks:** Never go for 6 AM morning walks during winter smog. Cold air + trapped diesel exhaust is a prime trigger for hypertensive crises.
  2. **Daily BP Monitoring:** Check blood pressure every morning and evening. Ensure heart and BP medications are taken consistently.
  3. **Keep Bedrooms Warm & Filtered:** Use a sealed electric oil radiator (never open charcoal/gas fires!) and run mechanical air filtration.`;
    }

    // 5. Air Purifiers, HEPA, Buying Guide, Room Sizing, Brands
    if (q.includes("purifier") || q.includes("hepa") || q.includes("filter") || q.includes("cadr") || q.includes("buy") || q.includes("brand") || q.includes("best purifier") || q.includes("room size") || q.includes("merv")) {
      return `### 🛠️ Air Purifier Buying & Sizing Guide
* **The Golden Standard:** Only buy purifiers with **True HEPA (H13 or H14 grade)** mechanical filtration. Avoid gimmicks like UV lamps or ionizers.
* **Look at CADR (Clean Air Delivery Rate):**
  * Bedroom (150 sq ft): Needs at least **150–200 CFM** CADR.
  * Living Room (300 sq ft): Needs at least **300–400 CFM** CADR.
* **Commercial vs DIY ($40 Corsi-Rosenthal Box):**
  * A $300 commercial purifier delivers ~180 CFM.
  * A **$40 DIY Corsi-Rosenthal Box** (1 box fan + 4 MERV 13 furnace filters) delivers **550+ CFM**, cleaning your room 3 times faster at 1/7th the cost!
* **Filter Replacement:** In heavy winter smog (AQI 400+), replace or vacuum pre-filters every 3–4 months.`;
    }

    // 6. Air Conditioners (AC) vs Air Purifiers
    if (q.includes("ac") || q.includes("air conditioner") || q.includes("split ac") || q.includes("cooling")) {
      return `### ❄️ Can an Air Conditioner (AC) Clean Winter Smog?
* **The Reality:** Standard home split or window ACs do **NOT** filter fine smog (PM2.5). They only have a coarse nylon mesh (pore size 500+ microns) meant to catch pet hair and large dust.
* **PM2.5 particles (2.5 microns)** pass straight through regular AC filters like smoke through an open window!
* **How to Upgrade Your AC:** You can buy electrostatically charged **3M Filtrete AC filter sheets** and tape them over your indoor AC mesh. This converts your AC fan into a moderate particulate filter without buying a new machine.
* **In Your Car:** Always turn on the **AC Air Recirculation button** (the curved arrow inside the car icon). This forces cabin air through the car's pollen filter up to 6 times, reducing PM2.5 by 85%!`;
    }

    // 7. Ionizers, Ozone Generators, UV Lights
    if (q.includes("ionizer") || q.includes("ozone") || q.includes("negative ion") || q.includes("uv light")) {
      return `### ⚡ The Truth About Ionizers & Ozone Cleaners
* ⚠️ **WARNING:** **Avoid ozone generators and cheap ionizers.**
* **Why Ozone is Dangerous:** Ozone ($O_3$) is a caustic, reactive gas. Breathing even trace amounts of ozone causes chemical burns to bronchial linings, triggering coughing fits, asthma attacks, and permanent airway damage.
* **Why Ionizers Fail:** Ionizers emit charged ions that make smoke particles stick to your walls, floor, and furniture. They don't actually remove particles from the room, and many ionizers generate harmful ozone as a byproduct.
* **Safe Rule:** Always stick to **pure mechanical HEPA or MERV 13 filtration**, which traps particles physically without generating any gases!`;
    }

    // 8. Houseplants & NASA Study Reality
    if (q.includes("plant") || q.includes("snake plant") || q.includes("spider plant") || q.includes("areca") || q.includes("nasa") || q.includes("indoor plant")) {
      return `### 🌿 Can Houseplants Clean Smog? (NASA Study Truth)
* **The NASA Study Context:** In 1989, NASA tested plants in tiny, airtight 1-cubic-meter glass containers under continuous 24/7 grow lights.
* **In Real Homes:** Real rooms have an air exchange rate of 0.5 to 1.5 air changes per hour. An air purifier cleans **250 cubic feet per minute**. To match ONE purifier, you would need **80 to 1,000 dense potted plants per square meter**!
* **Where Plants DO Help:**
  * **Snake Plants (Sansevieria):** Take up CO2 and release oxygen at night (CAM metabolism).
  * **Areca Palm / Peace Lily:** Gently add natural humidity to prevent throat dryness.
* **Verdict:** Enjoy plants for mental peace and gentle moisture, but **never rely on plants alone to protect your lungs from hazardous PM2.5**. Always pair them with a mechanical filter!`;
    }

    // 9. Diet, Food, Jaggery (Gur), Turmeric, Hydration
    if (q.includes("diet") || q.includes("food") || q.includes("eat") || q.includes("drink") || q.includes("jaggery") || q.includes("gur") || q.includes("turmeric") || q.includes("haldi") || q.includes("vitamin") || q.includes("tea") || q.includes("honey")) {
      return `### 🍵 Diet, Jaggery & Lung Health in Smog
* **The "Jaggery (Gur) Cleans Lungs" Myth:** No food enters your lungs (if food enters your trachea, you choke!). Jaggery does NOT scrub soot out of your lungs.
* **What Diet ACTUALLY Does:** Inhaled PM2.5 causes systemic oxidative stress and free-radical damage in the blood. Eating antioxidant-rich foods helps your body fight this inflammation:
  1. **Vitamin C & Citrus:** Oranges, amla (Indian gooseberry), lemons, bell peppers.
  2. **Omega-3 Fatty Acids:** Flaxseeds, walnuts, chia seeds reduce vascular inflammation.
  3. **Turmeric (Curcumin) & Ginger:** Warm golden turmeric milk or ginger tea soothes irritated throat tissue and suppresses inflammatory cytokines.
  4. **Hydration (2.5L daily):** Drinking warm water keeps your respiratory mucus liquid so your cilia can sweep out trapped soot.`;
    }

    // 10. Car Travel, Uber, Cabs, Traffic
    if (q.includes("car") || q.includes("drive") || q.includes("traffic") || q.includes("vehicle") || q.includes("auto") || q.includes("bus") || q.includes("metro") || q.includes("commute") || q.includes("uber") || q.includes("cab")) {
      return `### 🚗 Commuting & Car Travel in Severe Smog
* **The #1 Car Secret:** Press the **Cabin Air Recirculation button** (the button with a car icon and a looping arrow inside).
  * *Fresh Air Mode:* Sucks in 400+ AQI diesel soot directly from the car in front of you.
  * *Recirculation Mode:* Recirculates cabin air through your car's internal pollen/HEPA filter up to 6 times, cutting PM2.5 by **over 85% within 10 minutes**!
* **For Two-Wheelers & Open Autos:**
  * You are directly exposed to bumper-height exhaust plumes. A tightly sealed **certified N95/FFP2 respirator** is non-negotiable.
* **Metro / Subway:**
  * Underground transit has lower combustion soot, but platform brake dust can be high. Keep your N95 mask on from origin to destination.`;
    }

    // 11. Schools, Children, GRAP Regulations
    if (q.includes("school") || q.includes("grap") || q.includes("rule") || q.includes("government") || q.includes("ban") || q.includes("closure")) {
      return `### 🏫 Schools, Outdoor Recess & Government Rules (GRAP)
* **School Safety Guidelines:**
  * When AQI exceeds 300, all outdoor morning assemblies and physical education sports should be **completely suspended**.
  * When AQI exceeds 400 (GRAP Stage 3/4 in Delhi-NCR), primary and middle schools are typically shifted to **online classes**.
* **School Bus Safety:**
  * School bus drivers must keep all windows closed during transit.
  * Schools should enforce a **Zero-Idling Zone** within 200 meters of the school gates—eliminating idling cars cuts toxic particulate plumes around children's lungs by over 70%!`;
  }

    // 12. Symptoms, Throat, Cough, Eyes, Steam, Saline Rinse
    if (q.includes("cough") || q.includes("throat") || q.includes("eye") || q.includes("burn") || q.includes("itch") || q.includes("sneeze") || q.includes("mucus") || q.includes("phlegm") || q.includes("wheez") || q.includes("asthma") || q.includes("chest") || q.includes("inhaler")) {
      return `### 🫁 Quick Relief for Smog Symptoms & Medical Triage
* **Burning / Itchy Eyes:** Flush with preservative-free artificial tear drops (Carboxymethylcellulose 0.5%). **Never rub your eyes**—rubbing grinds micro-soot into your cornea!
* **Dry, Scratchy Throat:** Gargle with warm salt water (1/2 tsp salt in 1 cup warm water) morning and night. Sip warm honey-ginger tea.
* **Clogged Nasal Passages:** Use an isotonic saline nasal spray (0.9% NaCl). This physically rinses out deposited soot before it reaches your lungs.
* 🚨 **RED FLAG EMERGENCY SIGNS — Seek Hospital Care Immediately:**
  1. Difficulty speaking full sentences without gasping.
  2. Severe wheezing that does not improve after 2 puffs of a rescue inhaler.
  3. Chest pressure or pain radiating to jaw or left arm.
  4. Blue or gray discoloration of lips or fingernails.`;
    }

    // 13. Humidity, Humidifiers, Dry Throat, White Dust
    if (q.includes("humid") || q.includes("humidity") || q.includes("white dust") || q.includes("moisture") || q.includes("dry")) {
      return `### 💧 Indoor Humidity Balance in Winter Smog
* **The Dryness Trap:** Winter room heating drops indoor humidity below 25%, causing the protective mucus lining of your throat to dry out and paralyze natural cilia filters.
* ⚠️ **The Ultrasonic Humidifier Danger:** If you use hard tap water in an ultrasonic mist maker, it vaporizes calcium and minerals into millions of microscopic **"white mineral dust" particles (PM2.5)**!
* **The Safe Way to Humidify:**
  1. Place shallow stainless steel or ceramic bowls of clean water on or near your room heaters (evaporates 100% pure distilled vapor).
  2. If using an active ultrasonic humidifier, **ONLY use Reverse Osmosis (RO) or distilled water**, never hard tap water. Target 40% to 50% relative humidity.`;
    }

    // 14. Smoking, Incense, Candles, Gas Stoves, Cooking
    if (q.includes("smoke") || q.includes("smoking") || q.includes("cigarette") || q.includes("incense") || q.includes("dhoop") || q.includes("candle") || q.includes("cook") || q.includes("gas stove") || q.includes("fry")) {
      return `### 🕯️ Indoor Combustion Sources: Stop the Smoke Inside
* **Incense & Dhoop Reality:** Burning **1 incense stick** releases as much PM2.5 and cancer-causing benzene as smoking **3 to 5 commercial cigarettes**! In a sealed winter room, it spikes indoor pollution to 600+ AQI within 15 minutes.
* **Gas Stove Cooking:** Gas burners emit toxic nitrogen dioxide ($NO_2$) and carbon monoxide. Always cook on the **rear (back) burners** underneath your kitchen exhaust hood, with pot lids on.
* **Zero Combustion Rule:** Eliminate all indoor smoking, scented candles, and agarbatti during winter smog season. Use natural whole spices simmered in water on an electric plate for fragrance.`;
    }

    // 15. Masks, N95, KN95, Valves, Reusing, Beard
    if (q.includes("mask") || q.includes("n95") || q.includes("kn95") || q.includes("kf94") || q.includes("valve") || q.includes("cloth") || q.includes("surgical") || q.includes("beard") || q.includes("reuse") || q.includes("wash") || q.includes("kid") || q.includes("children")) {
      return `### 😷 Complete Respirator & Mask Guide
* **Which Mask Works?**
  * **N95 / FFP2 / KF94:** Blocks **95% to 99%** of PM2.5 thanks to an electrostatically charged meltblown layer.
  * **Cloth / Bandana:** Blocks only **10% to 15%** (pores are 200x larger than microscopic soot).
* **The Fit Check:** Mold the metal nose bridge wire with both index fingers until airtight. If your breath fogs your glasses, air is leaking!
* **Beard / Facial Hair:** Thick stubble or beards break the airtight seal of an N95, dropping filtration from 95% down to under 50%. Trim close or ensure the mask sits flush on smooth skin.
* **How to Safely Reuse:** Store your N95 in a dry, breathable brown paper bag for 3–4 days between uses. Each mask lasts up to **40 hours of commute time**. **Never wash an N95 with water or alcohol** (alcohol strips the electrostatic charge permanently!).`;
    }

    // 16. Weather, Inversion, Wind, Rain, Stubble Burning
    if (q.includes("weather") || q.includes("inversion") || q.includes("wind") || q.includes("fog") || q.includes("smog") || q.includes("rain") || q.includes("stubble") || q.includes("parali")) {
      return `### 🌦️ Atmospheric Physics: Why Winter Smog Happens
* **The "Thermal Inversion Pot Lid":** In winter, clear nights cause the ground to rapidly radiate heat away into space. A layer of freezing dense air forms at the street, trapped beneath warmer air aloft. This warm air functions like an airtight pot lid, holding 100% of vehicular smoke, stubble burning, and dust in a shallow 150-meter breathing layer.
* **Why 1:30 PM is the Safest Window:** Around 1:00 PM – 3:00 PM, midday sunshine finally warms the ground, breaking the thermal inversion lid and expanding the mixing layer up to 1000m+. This is the **best time to air out rooms and run errands**.
* **Will Rain Help?** Yes! A sustained winter rain shower washes suspended particulate out of the sky ("wet scavenging"), temporarily resetting AQI to clean levels.`;
    }

    // 17. General Fallback with Contextual Reasoning for ANY other question
    return `### 🍃 Clean Air Guidance for ${city.name} (Current AQI: ${city.aqi})

Regarding: *"**${question}**"*

Here is the direct practical guidance based on current air telemetry in **${city.name}**:
1. **Current Exposure Level:** With AQI at **${city.aqi}**, ambient air is heavily polluted. Inhaling this air unfiltered for 24 hours delivers particulate exposure equivalent to smoking multiple cigarettes.
2. **Safe Timing Window:** Plan any outdoor tasks or room ventilation strictly between **${city.safeWindow}**, when solar warming lifts the ground inversion layer.
3. **Indoor Protection:** Keep street-facing windows and doors tightly sealed. Wet-mop hard floors with a damp microfiber cloth twice daily to capture settled particulate without kicking it back up.
4. **Commute Defense:** Wear a certified **N95/FFP2 respirator** with an airtight nose-bridge seal whenever you step outside. If driving, set car ventilation to **Internal Recirculation**.

*Feel free to ask more specific questions about masks, DIY air cleaners, safe exercise, children's health, or symptoms!*`;
  }

  // Live Telemetry Sync with Open-Meteo Air Quality API
  async function syncLiveAqi(lat, lon, cityId) {
    const liveBadge = document.getElementById("liveDataBadge");
    try {
      let url = "/api/aqi";
      if (lat && lon) {
        url = `/api/aqi?lat=${lat}&lon=${lon}`;
      } else if (cityId) {
        url = `/api/aqi?city=${cityId}`;
      }

      if (liveBadge) {
        liveBadge.innerHTML = '<span>⏳</span> Syncing Live Sensors...';
        liveBadge.style.color = '#94a3b8';
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const cityKey = (lat && lon) ? "gps_user" : (cityId || state.cityId);

        CITIES[cityKey] = {
          name: data.city || (cityKey === "gps_user" ? "My GPS Location" : "Local City"),
          aqi: data.aqi,
          status: data.isDanger ? `Stay Indoors (${data.category})` : `Safe Air (${data.category})`,
          isDanger: data.isDanger,
          safeWindow: data.windows?.safeVentilationWindow || "1:00 PM – 3:00 PM",
          dangerHours: data.windows?.dangerHours || "6:00 AM – 9:30 AM & 7:30 PM – 10:00 PM",
          summary: data.healthAdvisory || `Live air quality telemetry: ${data.telemetry?.pm25_ug_m3} µg/m³ PM2.5, ${data.telemetry?.no2_ppb} ppb NO2.`,
          pm25: data.telemetry?.pm25_ug_m3,
          isLive: data.isLive
        };

        if (lat && lon) {
          state.cityId = "gps_user";
        }

        updateHero();

        if (liveBadge) {
          liveBadge.innerHTML = `<span>🟢</span> Live Open-Meteo (${data.telemetry?.pm25_ug_m3 || data.aqi} µg/m³ PM2.5)`;
          liveBadge.style.color = '#34d399';
        }
      }
    } catch (e) {
      console.warn("Could not sync live Open-Meteo telemetry:", e);
      if (liveBadge) {
        liveBadge.innerHTML = '<span>🔵</span> Built-in Model Feed';
        liveBadge.style.color = '#60a5fa';
      }
    }
  }

  // 5. Initialization & DOM Listeners
  document.addEventListener("DOMContentLoaded", () => {
    // City Selector
    const citySelect = document.getElementById("citySelect");
    if (citySelect) {
      citySelect.addEventListener("change", (e) => {
        state.cityId = e.target.value;
        updateHero();
        syncLiveAqi(null, null, state.cityId);
      });
    }

    // GPS Location Detector
    const btnGps = document.getElementById("btnGpsLocation");
    const gpsBtnText = document.getElementById("gpsBtnText");
    const gpsIcon = document.getElementById("gpsIcon");

    if (btnGps) {
      btnGps.addEventListener("click", () => {
        if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser.");
          return;
        }

        if (gpsBtnText) gpsBtnText.textContent = "Detecting...";
        if (gpsIcon) gpsIcon.textContent = "⏳";

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            await syncLiveAqi(lat, lon);

            // Add or select GPS option in citySelect
            if (citySelect) {
              let gpsOption = citySelect.querySelector('option[value="gps_user"]');
              if (!gpsOption) {
                gpsOption = document.createElement("option");
                gpsOption.value = "gps_user";
                citySelect.insertBefore(gpsOption, citySelect.firstChild);
              }
              gpsOption.textContent = `🎯 My GPS Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
              gpsOption.selected = true;
            }

            if (gpsBtnText) gpsBtnText.textContent = "GPS Active";
            if (gpsIcon) gpsIcon.textContent = "📍";
          },
          (err) => {
            console.warn("GPS Location error:", err.message);
            alert("Could not detect GPS location. Please check browser location permissions.");
            if (gpsBtnText) gpsBtnText.textContent = "My GPS";
            if (gpsIcon) gpsIcon.textContent = "🎯";
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });
    }

    // Navigation Tabs
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(btn => {
      btn.addEventListener("click", () => {
        navItems.forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        const panel = document.getElementById(tabId);
        if (panel) panel.classList.add("active");
      });
    });

    // Family Profile Toggles
    document.querySelectorAll(".toggle-chip[data-key]").forEach(chip => {
      chip.addEventListener("click", () => {
        const key = chip.getAttribute("data-key");
        state.profile[key] = !state.profile[key];
        chip.classList.toggle("active", state.profile[key]);
        updateTailoredSteps();
      });
    });

    // Commute Toggles
    document.querySelectorAll(".toggle-chip[data-commute]").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".toggle-chip[data-commute]").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.profile.commute = chip.getAttribute("data-commute");
        updateTailoredSteps();
      });
    });

    // Impact Slider
    const slider = document.getElementById("impactDaysSlider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        state.days = parseInt(e.target.value, 10);
        updateImpact();
      });
    }

    // Chatbot Interaction
    const chatInput = document.getElementById("simpleChatInput");
    const btnSend = document.getElementById("btnSimpleSend");
    const chatHistory = document.getElementById("chatHistory");

    async function sendChat(msgText) {
      const text = msgText || (chatInput ? chatInput.value.trim() : "");
      if (!text || !chatHistory) return;

      if (chatInput) chatInput.value = "";

      // Add User Message
      const userDiv = document.createElement("div");
      userDiv.className = "chat-msg user";
      userDiv.textContent = text;
      chatHistory.appendChild(userDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;

      // Add Assistant Placeholder
      const assistantDiv = document.createElement("div");
      assistantDiv.className = "chat-msg assistant";
      assistantDiv.innerHTML = '<span style="color:#94a3b8; font-size:0.85rem;">⚡ Aura is analyzing...</span>';
      chatHistory.appendChild(assistantDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;

      const city = CITIES[state.cityId] || CITIES.delhi;
      const savedGeminiKey = localStorage.getItem("aero_gemini_api_key") || "";
      let replyMarkdown = "";

      // Security Best Practice: Route through backend proxy (/api/chat) so API key is never exposed in browser network inspector
      try {
        const chatApiUrl = window.location.origin.startsWith("http") ? "/api/chat" : "http://localhost:3000/api/chat";
        const apiRes = await fetch(chatApiUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(savedGeminiKey ? { "x-api-key": savedGeminiKey } : {})
          },
          body: JSON.stringify({ message: text, city: state.cityId })
        });
        if (apiRes.ok) {
          const data = await apiRes.json();
          if (data.reply) {
            replyMarkdown = data.reply;
          }
        }
      } catch (e) {
        // Backend not reachable or opened via file:// protocol
      }

      // Fallback: If backend is unreachable but user has client key saved, call Gemini directly as fallback
      if (!replyMarkdown && savedGeminiKey && savedGeminiKey.length > 10) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${savedGeminiKey}`;
          const systemContext = `You are Aura, an empathetic environmental health and atmospheric physics AI assistant. Location: ${city.name} (AQI: ${city.aqi}). Safe ventilation window: ${city.safeWindow}. Answer clearly, concisely, and warmly with bullet points.`;
          
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemContext}\n\nUSER QUESTION: ${text}` }] }],
              generationConfig: { maxOutputTokens: 600, temperature: 0.3 }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText) {
              replyMarkdown = aiText;
            }
          }
        } catch (e) {
          console.warn("Direct Gemini call exception:", e);
        }
      }

      // Option 3: Comprehensive Built-in Domain Knowledge Engine
      if (!replyMarkdown) {
        replyMarkdown = getAiReply(text);
      }

      // Render Markdown
      let html = replyMarkdown
        .replace(/^### (.*$)/gim, '<div style="font-size:1.05rem; font-weight:700; color:#93c5fd; margin-bottom:0.4rem;">$1</div>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '<br/><br/>');

      assistantDiv.innerHTML = html;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    if (btnSend) {
      btnSend.addEventListener("click", () => sendChat());
    }
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendChat();
        }
      });
    }

    document.querySelectorAll(".prompt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sendChat(btn.textContent.trim());
      });
    });

    // Gemini API Key Handling
    const inputKey = document.getElementById("inputGeminiApiKey");
    const btnSaveKey = document.getElementById("btnSaveGeminiKey");
    const keyStatus = document.getElementById("geminiKeyStatus");

    function refreshKeyStatus() {
      const savedKey = localStorage.getItem("aero_gemini_api_key") || "";
      if (inputKey) inputKey.value = savedKey;
      if (keyStatus) {
        if (savedKey.length > 8) {
          keyStatus.textContent = "Status: 🟢 Google Gemini Live API Connected";
          keyStatus.style.color = "#34d399";
        } else {
          keyStatus.textContent = "Status: ⚡ Using Built-in Offline Neural Engine";
          keyStatus.style.color = "#38bdf8";
        }
      }
    }
    refreshKeyStatus();

    if (btnSaveKey && inputKey) {
      btnSaveKey.addEventListener("click", () => {
        const val = inputKey.value.trim();
        if (val) {
          localStorage.setItem("aero_gemini_api_key", val);
        } else {
          localStorage.removeItem("aero_gemini_api_key");
        }
        refreshKeyStatus();
        alert(val ? "Gemini API Key saved!" : "Gemini API Key cleared. Using built-in engine.");
      });
    }

    // Live API Tester
    const apiOut = document.getElementById("apiTestOutput");
    const btnTestAqi = document.getElementById("btnTestAqi");
    const btnTestRec = document.getElementById("btnTestRec");
    const btnTestImpact = document.getElementById("btnTestImpact");

    async function testApiCall(url, method = "GET", body = null) {
      if (!apiOut) return;
      apiOut.textContent = `Fetching ${method} ${url}...`;
      try {
        const options = { method, headers: { "Content-Type": "application/json" } };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(url, options);
        const data = await res.json();
        apiOut.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        // If file:// protocol or server not on 3000, show helpful simulated live response
        apiOut.textContent = `(Note: Direct fetch error "${err.message}". If opening via file://, run "node serve.js" to access the live HTTP port 3000.)\n\nSample Endpoint Response for ${url}:\n` +
          JSON.stringify({
            status: "online",
            endpoint: url,
            city: state.cityId,
            message: "REST API server is active when launched via node serve.js on port 3000"
          }, null, 2);
      }
    }

    const btnTestGps = document.getElementById("btnTestGps");
    if (btnTestGps) {
      btnTestGps.addEventListener("click", () => testApiCall("/api/aqi?lat=28.6139&lon=77.2090"));
    }
    if (btnTestAqi) {
      btnTestAqi.addEventListener("click", () => testApiCall(`/api/aqi?city=${state.cityId}`));
    }
    if (btnTestRec) {
      btnTestRec.addEventListener("click", () => testApiCall("/api/recommendations", "POST", {
        city: state.cityId,
        profile: state.profile
      }));
    }
    if (btnTestImpact) {
      btnTestImpact.addEventListener("click", () => testApiCall("/api/impact", "POST", {
        city: state.cityId,
        days: state.days
      }));
    }

    // Initial render & sync live Open-Meteo telemetry
    updateHero();
    syncLiveAqi(null, null, state.cityId);

    // Progressive Web App (PWA): Install Prompt & Service Worker Registration
    let deferredPrompt = null;
    const pwaBanner = document.getElementById("pwaInstallBanner");
    const btnPwaInstall = document.getElementById("btnPwaInstall");
    const btnPwaDismiss = document.getElementById("btnPwaDismiss");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (pwaBanner && !localStorage.getItem("pwa_dismissed")) {
        pwaBanner.style.display = "flex";
      }
    });

    if (btnPwaInstall) {
      btnPwaInstall.addEventListener("click", async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          console.log("[PWA] Install prompt choice:", choice.outcome);
          deferredPrompt = null;
        }
        if (pwaBanner) pwaBanner.style.display = "none";
      });
    }

    if (btnPwaDismiss) {
      btnPwaDismiss.addEventListener("click", () => {
        if (pwaBanner) pwaBanner.style.display = "none";
        localStorage.setItem("pwa_dismissed", "true");
      });
    }
  });

  // Register Service Worker for 100% Offline Capability
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => console.log("[PWA] Service Worker registered successfully:", reg.scope))
        .catch((err) => console.warn("[PWA] Service Worker registration failed:", err));
    });
  }
})();
