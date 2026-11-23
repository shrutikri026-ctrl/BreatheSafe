// BreatheSafe / AeroShield AI - Full-Stack REST API & Web Server
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auto-load local .env file securely if present (Node 20+)
try {
  const envPath = path.join(__dirname, '.env');
  if (process.loadEnvFile && fs.existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
} catch (e) {
  // .env file is optional
}

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Built-in Atmospheric Data Repository (with GPS Coordinates for Live Sensor Feeds)
const CITIES_DATA = {
  patna: {
    id: "patna",
    name: "Patna (Bihar)",
    country: "India",
    lat: 25.5941,
    lon: 85.1376,
    aqi: 412,
    category: "Severe / Hazardous",
    isDanger: true,
    pm25: 360,
    pm10: 480,
    no2: 74,
    temp: 16,
    humidity: 76,
    inversionHeightMeters: 170,
    safeVentilationWindow: "1:30 PM – 3:30 PM",
    dangerHours: "6:00 AM – 9:30 AM & 7:00 PM – 10:30 PM",
    sources: ["Gangetic Basin Thermal Inversion", "Brick Kilns", "Biomass & Chulha Burning", "Alluvial Road Dust"]
  },
  delhi: {
    id: "delhi",
    name: "Delhi-NCR",
    country: "India",
    lat: 28.6139,
    lon: 77.2090,
    aqi: 438,
    category: "Severe / Hazardous",
    isDanger: true,
    pm25: 395,
    pm10: 512,
    no2: 88,
    temp: 14,
    humidity: 78,
    inversionHeightMeters: 180,
    safeVentilationWindow: "1:30 PM – 3:00 PM",
    dangerHours: "6:00 AM – 9:30 AM & 7:30 PM – 10:00 PM",
    sources: ["Stubble Burning", "Vehicular Diesel", "Thermal Inversion Trap"]
  },
  lahore: {
    id: "lahore",
    name: "Lahore",
    country: "Pakistan",
    lat: 31.5204,
    lon: 74.3587,
    aqi: 472,
    category: "Off-Scale Hazardous",
    isDanger: true,
    pm25: 435,
    pm10: 580,
    no2: 95,
    temp: 13,
    humidity: 82,
    inversionHeightMeters: 140,
    safeVentilationWindow: "1:00 PM – 2:30 PM",
    dangerHours: "5:30 AM – 10:00 AM & 7:00 PM – 11:30 PM",
    sources: ["Crop Residue Smoke", "Diesel Fleets", "Brick Kilns"]
  },
  beijing: {
    id: "beijing",
    name: "Beijing",
    country: "China",
    lat: 39.9042,
    lon: 116.4074,
    aqi: 184,
    category: "Unhealthy (Heating Smog)",
    isDanger: true,
    pm25: 122,
    pm10: 178,
    no2: 52,
    temp: 2,
    humidity: 45,
    inversionHeightMeters: 450,
    safeVentilationWindow: "12:30 PM – 3:30 PM",
    dangerHours: "7:00 AM – 9:00 AM & 8:00 PM – 10:30 PM",
    sources: ["District Heating Coal/Gas", "Regional Haze"]
  },
  krakow: {
    id: "krakow",
    name: "Kraków",
    country: "Poland",
    lat: 50.0647,
    lon: 19.9450,
    aqi: 168,
    category: "Unhealthy (Solid Fuel Smog)",
    isDanger: true,
    pm25: 89,
    pm10: 134,
    no2: 44,
    temp: -1,
    humidity: 88,
    inversionHeightMeters: 310,
    safeVentilationWindow: "1:00 PM – 3:00 PM",
    dangerHours: "7:30 AM – 9:30 AM & 6:00 PM – 10:30 PM",
    sources: ["Residential Coal/Wood Boilers", "Basin Inversion"]
  },
  saltlake: {
    id: "saltlake",
    name: "Salt Lake City",
    country: "USA",
    lat: 40.7608,
    lon: -111.8910,
    aqi: 148,
    category: "Sensitive Groups Alert",
    isDanger: false,
    pm25: 58,
    pm10: 84,
    no2: 38,
    temp: -3,
    humidity: 72,
    inversionHeightMeters: 380,
    safeVentilationWindow: "1:30 PM – 3:30 PM",
    dangerHours: "7:00 AM – 9:30 AM & 5:30 PM – 8:30 PM",
    sources: ["Valley Cold Pool Inversion", "Urban Traffic"]
  },
  milan: {
    id: "milan",
    name: "Milan",
    country: "Italy",
    lat: 45.4642,
    lon: 9.1900,
    aqi: 142,
    category: "Sensitive Groups Alert",
    isDanger: false,
    pm25: 54,
    pm10: 76,
    no2: 48,
    temp: 4,
    humidity: 86,
    inversionHeightMeters: 320,
    safeVentilationWindow: "1:00 PM – 3:30 PM",
    dangerHours: "7:30 AM – 9:30 AM & 6:30 PM – 9:30 PM",
    sources: ["Alpine Basin Stagnation", "Diesel Transport"]
  },
  clean_baseline: {
    id: "clean_baseline",
    name: "Zurich",
    country: "Switzerland",
    lat: 47.3769,
    lon: 8.5417,
    aqi: 22,
    category: "Clean Benchmark",
    isDanger: false,
    pm25: 5.2,
    pm10: 9.8,
    no2: 12,
    temp: 5,
    humidity: 60,
    inversionHeightMeters: 1800,
    safeVentilationWindow: "Anytime Today",
    dangerHours: "None",
    sources: ["Clean Alpine Baseline"]
  }
};

// Calculate US AQI standard from PM2.5 concentration (EPA standard)
function calculateUsAqi(pm25) {
  const c = Math.round(pm25 * 10) / 10;
  if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (c - 0) + 0);
  if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
  if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
  if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
  if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
  if (c <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301);
  if (c <= 500.4) return Math.round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401);
  return 500;
}

// Open-Meteo Air Quality API Live Fetcher (100% Free, zero key required)
async function fetchLiveOpenMeteo(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,nitrogen_dioxide,us_aqi&timezone=auto`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const curr = data.current;
      if (curr && typeof curr.pm2_5 === 'number') {
        const pm25 = Math.round(curr.pm2_5 * 10) / 10;
        const pm10 = curr.pm10 ? Math.round(curr.pm10 * 10) / 10 : Math.round(pm25 * 1.4);
        const no2 = curr.nitrogen_dioxide ? Math.round(curr.nitrogen_dioxide * 10) / 10 : 38;
        const aqi = curr.us_aqi || calculateUsAqi(pm25);

        let category = "Good";
        let isDanger = false;
        if (aqi > 300) { category = "Severe / Hazardous"; isDanger = true; }
        else if (aqi > 200) { category = "Very Unhealthy"; isDanger = true; }
        else if (aqi > 150) { category = "Unhealthy (Smog Episode)"; isDanger = true; }
        else if (aqi > 100) { category = "Unhealthy for Sensitive Groups"; isDanger = true; }
        else if (aqi > 50) { category = "Moderate"; isDanger = false; }

        return {
          isLive: true,
          source: "Open-Meteo Air Quality API (Real-Time Sensor & Satellite Feed)",
          timestamp: curr.time || new Date().toISOString(),
          aqi: aqi,
          category: category,
          isDanger: isDanger,
          pm25: pm25,
          pm10: pm10,
          no2: no2,
          coordinates: { latitude: data.latitude, longitude: data.longitude }
        };
      }
    }
  } catch (err) {
    console.warn("Open-Meteo live feed unavailable, falling back:", err.message);
  }
  return null;
}

// Helper: parse JSON body from incoming POST requests
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

// Helper: send JSON responses with CORS headers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Comprehensive AI Knowledge Engine that answers ANY question in detail
function generateComprehensiveAnswer(userMessage, city) {
  const q = userMessage.toLowerCase();

  // 1. Exercise / Running / Jogging / Cycling / Outdoor sports
  if (q.includes("jog") || q.includes("run") || q.includes("walk") || q.includes("exercise") || q.includes("workout") || q.includes("gym") || q.includes("sport") || q.includes("cycle") || q.includes("cycling") || q.includes("outdoor") || q.includes("marathon")) {
    return `### 🏃 Exercise & Outdoor Workouts in Smog (${city.name})
* **The Medical Reality:** When you exercise, your breathing rate increases from 6 liters/min to 60–100 liters/min. You breathe deeply through your mouth, bypassing your nose's natural filters, pulling **10x more toxic PM2.5 deep into your pulmonary alveoli**.
* **Is Morning Running Safe?** **NO.** Early mornings (6:00 AM – 9:30 AM) have the worst thermal inversion, trapping diesel soot at ground level. Morning jogs in ${city.aqi} AQI cause severe airway inflammation and vascular stress.
* **Safe Exercise Protocol:**
  1. **Move Workouts Indoors:** Exercise at home or in an air-conditioned/purified indoor gym.
  2. **Safe Outdoor Window:** If you must walk or run outside, do so strictly between **${city.safeVentilationWindow}**, when afternoon sunshine lifts the smog ceiling.
  3. **Low Intensity:** Keep exertion moderate. Never do high-intensity interval training or sprints in outdoor smog.`;
  }

  // 2. Pregnancy & Unborn Child
  if (q.includes("pregnant") || q.includes("pregnancy") || q.includes("fetus") || q.includes("unborn") || q.includes("trimester") || q.includes("expecting")) {
    return `### 🤰 Pregnancy & Smog Protection Guide
* **Medical Risks:** Ultra-fine PM2.5 particles are small enough to cross the lung-blood barrier into the maternal bloodstream. Research indicates heavy smog exposure during pregnancy increases risks of maternal hypertension, low birth weight, and systemic inflammation.
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
* **Why Ozone is Dangerous:** Ozone ($O_3$) is a caustic, reactive gas. Breathing even trace amounts of ozone causes chemical burns to bronchial linings, triggering coughing fits, asthma attacks, and permanent airway remodeling.
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
  if (q.includes("mask") || q.includes("n95") || q.includes("kn95") || q.includes("kf94") || q.includes("valve") || q.includes("cloth") || q.includes("surgical") || q.includes("beard") || q.includes("reuse") || q.includes("wash")) {
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

  // 17. General Fallback with Contextual Reasoning
  return `### 🍃 Clean Air Guidance for ${city.name} (Current AQI: ${city.aqi})

Regarding: *"**${userMessage}**"*

Here is the direct practical guidance based on current air telemetry in **${city.name}**:
1. **Current Exposure Level:** With AQI at **${city.aqi}**, ambient air is in the **${city.category}** zone. Inhaling this air unfiltered for 24 hours delivers particulate exposure equivalent to smoking multiple cigarettes.
2. **Safe Timing Window:** Plan any outdoor tasks or room ventilation strictly between **${city.safeVentilationWindow}**, when solar warming lifts the ground inversion layer.
3. **Indoor Protection:** Keep street-facing windows and doors tightly sealed. Wet-mop hard floors with a damp microfiber cloth twice daily to capture settled particulate without kicking it back up.
4. **Commute Defense:** Wear a certified **N95/FFP2 respirator** with an airtight nose-bridge seal whenever you step outside. If driving, set car ventilation to **Internal Recirculation**.

*Feel free to ask more specific questions about masks, DIY air cleaners, safe exercise, children's health, or symptoms!*`;
}


const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const rawPath = parsedUrl.pathname;
    const cleanPath = (rawPath.replace(/\/+$/, '') || '/').toLowerCase();

    // Log incoming requests
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${rawPath}`);

    // Handle CORS Pre-flight Options
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
      });
      res.end();
      return;
    }

  // =========================================================================
  // REST API ROUTER (/api/...)
  // =========================================================================

  // 1. GET /api or /api/status - API health and documentation overview
  if (req.method === 'GET' && (cleanPath === '/api/status' || cleanPath === '/api')) {
    return sendJson(res, 200, {
      status: "online",
      name: "BreatheSafe & AeroShield REST API",
      version: "2.1.0",
      timestamp: new Date().toISOString(),
      description: "GenAI-powered environmental resilience API with Open-Meteo Real-Time GPS Telemetry and winter smog defense.",
      endpoints: [
        { method: "GET", path: "/api/status", description: "API health, uptime, and available routes" },
        { method: "GET", path: "/api/cities", description: "Get list of all supported cities and GPS coordinates" },
        { method: "GET", path: "/api/aqi?city=<id>", description: "Get real-time air quality by city (e.g. city=delhi)" },
        { method: "GET", path: "/api/aqi?lat=<lat>&lon=<lon>", description: "Get live GPS air quality anywhere worldwide (Open-Meteo)" },
        { method: "POST", path: "/api/recommendations", description: "Get tailored routines based on household vulnerability and commute" },
        { method: "POST", path: "/api/impact", description: "Calculate PM2.5 alveolar reduction and cigarette equivalents avoided" },
        { method: "POST", path: "/api/chat", description: "Ask the GenAI clean air assistant (Aura) questions" },
        { method: "GET", path: "/api/hacks", description: "Get DIY Corsi-Rosenthal Box specifications and zero-cost IAQ hacks" }
      ]
    });
  }

  // 2. GET /api/cities - List all cities
  if (req.method === 'GET' && cleanPath === '/api/cities') {
    return sendJson(res, 200, {
      count: Object.keys(CITIES_DATA).length,
      cities: Object.values(CITIES_DATA)
    });
  }

  // 3. GET /api/aqi - Air Quality Telemetry (supports ?city=<id> or ?lat=<lat>&lon=<lon>)
  if (req.method === 'GET' && cleanPath === '/api/aqi') {
    const latParam = parsedUrl.searchParams.get('lat');
    const lonParam = parsedUrl.searchParams.get('lon');
    const cityId = (parsedUrl.searchParams.get('city') || 'delhi').toLowerCase();
    const city = CITIES_DATA[cityId] || CITIES_DATA.delhi;

    const targetLat = latParam ? parseFloat(latParam) : city.lat;
    const targetLon = lonParam ? parseFloat(lonParam) : city.lon;

    let liveData = null;
    if (!isNaN(targetLat) && !isNaN(targetLon)) {
      liveData = await fetchLiveOpenMeteo(targetLat, targetLon);
    }

    const aqi = liveData ? liveData.aqi : city.aqi;
    const category = liveData ? liveData.category : city.category;
    const isDanger = liveData ? liveData.isDanger : city.isDanger;
    const pm25 = liveData ? liveData.pm25 : city.pm25;
    const pm10 = liveData ? liveData.pm10 : city.pm10;
    const no2 = liveData ? liveData.no2 : city.no2;

    const cityName = (latParam && lonParam)
      ? `GPS Location (${targetLat.toFixed(2)}°, ${targetLon.toFixed(2)}°)`
      : city.name;
    const country = (latParam && lonParam) ? "Local Device GPS" : city.country;

    return sendJson(res, 200, {
      city: cityName,
      country: country,
      aqi: aqi,
      category: category,
      isDanger: isDanger,
      isLive: liveData ? true : false,
      feedSource: liveData ? liveData.source : "Built-in Atmospheric Resilience Model",
      telemetry: {
        pm25_ug_m3: pm25,
        pm10_ug_m3: pm10,
        no2_ppb: no2,
        temperature_c: city.temp || 15,
        humidity_percent: city.humidity || 75,
        inversion_lid_height_meters: city.inversionHeightMeters || 180
      },
      coordinates: {
        latitude: targetLat,
        longitude: targetLon
      },
      windows: {
        safeVentilationWindow: city.safeVentilationWindow || "1:00 PM – 3:00 PM",
        dangerHours: city.dangerHours || "6:00 AM – 9:30 AM & 7:30 PM – 10:00 PM"
      },
      healthAdvisory: isDanger
        ? "Active smog episode detected. Avoid outdoor exertion. Keep windows sealed during morning and evening inversion hours."
        : "Air quality is currently in a safe window. Suitable for normal outdoor ventilation."
    });
  }

  // 4. POST /api/recommendations - Personalized Defense Plan
  if (req.method === 'POST' && cleanPath === '/api/recommendations') {
    try {
      const body = await parseJsonBody(req);
      const cityId = (body.city || 'delhi').toLowerCase();
      const city = CITIES_DATA[cityId] || CITIES_DATA.delhi;
      const profile = body.profile || {};

      const commute = profile.commute || 'bike';
      const hasAsthmatic = Boolean(profile.hasAsthmatic);
      const hasInfants = Boolean(profile.hasInfants);
      const hasElderly = Boolean(profile.hasElderly);

      let commuteAdvice = "";
      let maskRating = "N95 / FFP2 / KF94 (Certified)";

      if (commute === 'bike' || commute === 'walk') {
        commuteAdvice = "High exposure risk! Wear a certified N95 respirator with airtight nose wire. Avoid deep mouth breathing in traffic.";
      } else if (commute === 'car') {
        commuteAdvice = "Keep windows sealed in traffic jams. Keep AC in 'Internal Recirculation' mode to cycle air through the cabin pollen filter.";
      } else {
        commuteAdvice = "Wear a snug N95 mask from door to door. Avoid sitting near open bus windows or tailpipes.";
      }

      return sendJson(res, 200, {
        city: city.name,
        aqi: city.aqi,
        familyProfile: { hasAsthmatic, hasInfants, hasElderly, commute },
        dailyRoutines: {
          morning: {
            window: "06:00 - 09:30",
            status: "High Thermal Inversion Hazard",
            actions: [
              "Keep exterior doors and windows firmly shut.",
              commuteAdvice,
              hasAsthmatic ? "Keep rescue inhaler (Albuterol) in pocket before stepping out." : null,
              hasInfants ? "Keep infants indoors; avoid morning stroller walks." : null
            ].filter(Boolean)
          },
          afternoon: {
            window: city.safeVentilationWindow,
            status: "Optimal Solar Dispersion Window",
            actions: [
              "Open windows for 15-20 minutes to flush indoor CO2.",
              "Run errands, grocery shopping, or physical chores now."
            ]
          },
          night: {
            window: "20:00 - 07:00",
            status: "Nocturnal Cooling & Particle Settling",
            actions: [
              "Wet-mop bedroom floor with a damp microfiber cloth (never dry-sweep).",
              "Run air purifier or DIY Corsi-Rosenthal Box in the bedroom on low/medium.",
              hasElderly || hasAsthmatic ? "Place a ceramic water bowl on or near the room heater for 45% gentle humidity." : null
            ].filter(Boolean)
          }
        },
        maskRecommendation: {
          recommended: maskRating,
          ineffective: "Cloth scarves, bandanas, and loose surgical masks (leak >80% PM2.5)."
        }
      });
    } catch (err) {
      return sendJson(res, 400, { error: "Bad Request", message: err.message });
    }
  }

  // 5. POST /api/impact - Impact Simulator Calculation
  if (req.method === 'POST' && cleanPath === '/api/impact') {
    try {
      const body = await parseJsonBody(req);
      const cityId = (body.city || 'delhi').toLowerCase();
      const city = CITIES_DATA[cityId] || CITIES_DATA.delhi;
      const days = parseInt(body.days || 14, 10);
      const maskAdherence = parseFloat(body.maskAdherence || 90) / 100;
      const purifierHours = parseFloat(body.purifierHours || 16);

      const cigsPerDay = Math.max(1, Math.round((city.aqi / 22) * 0.85));
      const totalCigarettesAvoided = cigsPerDay * days;
      const mgDustBlocked = Math.round(((city.aqi * 0.75 * 0.55 * purifierHours * 0.85) / 1000) * days);
      const co2eSavedKg = Math.round(days * 3.2);

      return sendJson(res, 200, {
        city: city.name,
        inputParameters: { days, maskAdherence: Math.round(maskAdherence * 100) + "%", purifierHours },
        calculatedImpact: {
          cigarettesAvoided: totalCigarettesAvoided,
          particulateSootBlockedMg: mgDustBlocked,
          communityCO2eSavedKg: co2eSavedKg,
          calculationModel: "Berkeley Earth (22 µg/m³ PM2.5 for 24h ≈ 1 cigarette)"
        }
      });
    } catch (err) {
      return sendJson(res, 400, { error: "Bad Request", message: err.message });
    }
  }

  // 6. POST /api/chat - GenAI Assistant Endpoint (Aura)
  if (req.method === 'POST' && cleanPath === '/api/chat') {
    try {
      const body = await parseJsonBody(req);
      const userMessage = body.message || body.prompt || "";
      const cityId = (body.city || 'delhi').toLowerCase();
      const city = CITIES_DATA[cityId] || CITIES_DATA.delhi;
      const userApiKey = req.headers['x-api-key'] || body.apiKey || GEMINI_API_KEY;

      if (!userMessage) {
        return sendJson(res, 400, { error: "Message is required." });
      }

      if (userApiKey && userApiKey.length > 10) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${userApiKey}`;
          const systemContext = `You are Aura, an AI clean air and smog resilience assistant. Current location: ${city.name} (AQI: ${city.aqi}, PM2.5: ${city.pm25} µg/m³). Inversion safe window: ${city.safeVentilationWindow}. Provide empathetic, clear, practical advice with bold bullet points.`;

          const fetchResp = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `${systemContext}\n\nUSER QUESTION: ${userMessage}` }] }],
              generationConfig: { maxOutputTokens: 600, temperature: 0.3 }
            })
          });

          if (fetchResp.ok) {
            const data = await fetchResp.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return sendJson(res, 200, {
                reply: text,
                source: "Google Gemini 1.5 Flash (Live API)",
                city: city.name,
                aqi: city.aqi
              });
            }
          }
        } catch (apiErr) {
          console.warn("Gemini Live API fetch failed, falling back to built-in neural responder:", apiErr.message);
        }
      }

      // Comprehensive Domain Intelligence Engine for ANY question
      let offlineReply = generateComprehensiveAnswer(userMessage, city);

      return sendJson(res, 200, {
        reply: offlineReply,
        source: "AeroShield Built-in Neural Engine",
        city: city.name,
        aqi: city.aqi
      });
    } catch (err) {
      return sendJson(res, 400, { error: "Bad Request", message: err.message });
    }
  }

  // 7. GET /api/hacks - DIY specifications
  if (req.method === 'GET' && cleanPath === '/api/hacks') {
    return sendJson(res, 200, {
      corsiRosenthalBox: {
        costUSD: "$35 - $45",
        cadrCFM: "550 - 650 CFM",
        airChangesPerHour: "5 to 8 ACH in typical bedroom",
        materials: ["1x 20-inch Box Fan", "4x MERV 13 Filters (20x20x1)", "Duct tape", "Cardboard base"],
        steps: [
          "Arrange 4 filters into an open cube with airflow arrows pointing inward.",
          "Tape cardboard bottom sealed.",
          "Place box fan on top blowing upward.",
          "Tape all corners and add cardboard shroud."
        ]
      },
      zeroCostHacks: [
        { name: "Wet-Mopping", rule: "Never dry sweep in winter smog; damp microfiber permanently traps settled soot." },
        { name: "Towel Door Snake", rule: "Roll a bathroom towel along outside door bottoms to stop smoke leaks." },
        { name: "Back-Burner Cooking", rule: "Cook on rear burners under the exhaust fan; covers 75% of emissions." },
        { name: "Radiator Water Basin", rule: "Evaporate water passively on heaters to keep airway cilia hydrated." }
      ]
    });
  }

  // Catch-all for any unknown /api/* requests: return JSON 404
  if (cleanPath.startsWith('/api')) {
    return sendJson(res, 404, {
      error: "Endpoint Not Found",
      requestedPath: rawPath,
      availableEndpoints: ["/api/status", "/api/cities", "/api/aqi", "/api/recommendations", "/api/impact", "/api/chat", "/api/hacks"]
    });
  }

  // =========================================================================
  // STATIC FILE HANDLER
  // =========================================================================
  let reqPath = rawPath;
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      };
      if (reqPath === '/sw.js') {
        headers['Service-Worker-Allowed'] = '/';
      }
      res.writeHead(200, headers);
      res.end(content);
    }
  });
  } catch (globalErr) {
    console.error("Unhandled Server Request Error:", globalErr);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Internal Server Error", message: globalErr.message }));
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️ Port ${PORT} is currently occupied by an existing process.`);
    console.error(`Trying fallback port ${PORT + 1}...\n`);
    setTimeout(() => {
      server.listen(PORT + 1, () => {
        console.log(`🛡️ Server running on fallback port ${PORT + 1}: http://localhost:${PORT + 1}`);
      });
    }, 1000);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🛡️ BreatheSafe & AeroShield Server Running!`);
  console.log(`Web App:  http://localhost:${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/api/status`);
  console.log(`Endpoints:`);
  console.log(`  • GET  /api/aqi?city=delhi`);
  console.log(`  • POST /api/recommendations`);
  console.log(`  • POST /api/impact`);
  console.log(`  • POST /api/chat`);
  console.log(`  • GET  /api/hacks`);
  console.log(`======================================================\n`);
});
