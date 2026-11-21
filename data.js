// AeroShield AI - Comprehensive Smog & Air Quality Knowledge Base

export const CITY_PRESETS = {
  delhi: {
    id: "delhi",
    name: "Delhi-NCR",
    country: "India",
    region: "Indo-Gangetic Plain",
    aqi: 438,
    category: "Severe / Hazardous",
    categoryColor: "#7f1d1d",
    statusBadge: "Critical Emergency",
    pm25: 395,
    pm10: 512,
    no2: 88,
    co: 3.4,
    so2: 24,
    o3: 32,
    temp: 14,
    humidity: 78,
    windSpeed: 3.5, // km/h
    inversionHeight: 180, // meters (very low lid)
    primarySources: ["Stubble Burning / Biomass", "Heavy Vehicular Exhaust", "Industrial Emissions", "Thermal Inversion"],
    healthWarning: "Emergency alert: Healthy individuals experience respiratory symptoms; vulnerable individuals face severe cardiovascular and pulmonary exacerbations. Limit all non-essential outdoor exposure.",
    ventilationSafeWindow: "13:30 - 15:00",
    worstWindow: "06:00 - 09:30 & 19:30 - 23:00"
  },
  lahore: {
    id: "lahore",
    name: "Lahore",
    country: "Pakistan",
    region: "Punjab Basin",
    aqi: 472,
    category: "Hazardous / Off-Scale",
    categoryColor: "#581c87",
    statusBadge: "Off-Scale Toxic",
    pm25: 435,
    pm10: 580,
    no2: 95,
    co: 3.9,
    so2: 32,
    o3: 28,
    temp: 13,
    humidity: 82,
    windSpeed: 2.8,
    inversionHeight: 140,
    primarySources: ["Transboundary Crop Residue Burning", "Low-Grade Diesel Fleets", "Brick Kilns", "Winter Cold Trapping"],
    healthWarning: "Extreme toxic smog plume. Eye stinging, throat burning, acute coughing prevalent. Stay indoors with high-efficiency air cleaning.",
    ventilationSafeWindow: "13:00 - 14:30",
    worstWindow: "05:30 - 10:00 & 19:00 - 00:00"
  },
  beijing: {
    id: "beijing",
    name: "Beijing",
    country: "China",
    region: "Northern China Plain",
    aqi: 184,
    category: "Unhealthy",
    categoryColor: "#dc2626",
    statusBadge: "Winter Heating Spike",
    pm25: 122,
    pm10: 178,
    no2: 52,
    co: 1.8,
    so2: 18,
    o3: 42,
    temp: 2,
    humidity: 45,
    windSpeed: 8.5,
    inversionHeight: 450,
    primarySources: ["District Heating Coal/Gas", "Regional Industrial Haze", "Stagnant High Pressure Ridge"],
    healthWarning: "Active outdoor activities should be avoided by children, elderly, and those with heart/lung disease. Wear tight-fitting N95/KN95 outdoors.",
    ventilationSafeWindow: "12:00 - 15:30",
    worstWindow: "07:00 - 09:00 & 20:00 - 23:00"
  },
  krakow: {
    id: "krakow",
    name: "Kraków",
    country: "Poland",
    region: "Vistula River Basin",
    aqi: 168,
    category: "Unhealthy",
    categoryColor: "#dc2626",
    statusBadge: "Residential Solid Fuel Smog",
    pm25: 89,
    pm10: 134,
    no2: 44,
    co: 1.5,
    so2: 28,
    o3: 35,
    temp: -1,
    humidity: 88,
    windSpeed: 4.2,
    inversionHeight: 310,
    primarySources: ["Domestic Coal/Wood Boilers ('Smokers')", "Basin Topography Trapping", "Traffic Influx"],
    healthWarning: "High levels of carcinogenic Benzo[a]pyrene and PM2.5. Seal windows facing streets; run particle filtration.",
    ventilationSafeWindow: "13:00 - 15:00",
    worstWindow: "07:30 - 09:30 & 18:00 - 22:30"
  },
  saltlake: {
    id: "saltlake",
    name: "Salt Lake City",
    country: "USA",
    region: "Great Salt Lake Basin",
    aqi: 148,
    category: "Unhealthy for Sensitive Groups",
    categoryColor: "#ea580c",
    statusBadge: "Cold Pool Inversion",
    pm25: 58,
    pm10: 84,
    no2: 38,
    co: 1.1,
    so2: 6,
    o3: 40,
    temp: -3,
    humidity: 72,
    windSpeed: 3.1,
    inversionHeight: 380,
    primarySources: ["Valley Inversion Layer", "Urban Commuter Idling", "Wood Burning Stoves"],
    healthWarning: "Cold stagnant air mass trapping emissions under high-pressure cap. Asthmatics should keep rescue inhalers accessible.",
    ventilationSafeWindow: "13:30 - 15:30",
    worstWindow: "07:00 - 09:30 & 17:30 - 21:00"
  },
  milan: {
    id: "milan",
    name: "Milan (Po Valley)",
    country: "Italy",
    region: "Po River Plain",
    aqi: 142,
    category: "Unhealthy for Sensitive Groups",
    categoryColor: "#ea580c",
    statusBadge: "Stagnant Alpine Haze",
    pm25: 54,
    pm10: 76,
    no2: 48,
    co: 1.2,
    so2: 8,
    o3: 38,
    temp: 4,
    humidity: 86,
    windSpeed: 2.1,
    inversionHeight: 320,
    primarySources: ["Alpine Wind Block", "Diesel Transport", "Agricultural Ammonia", "Biomass Heating"],
    healthWarning: "Atmospheric stagnation prevents pollutant dispersion. Vulnerable individuals should reduce prolonged outdoor exertion.",
    ventilationSafeWindow: "13:00 - 15:30",
    worstWindow: "07:30 - 09:30 & 18:30 - 22:00"
  },
  clean_baseline: {
    id: "clean_baseline",
    name: "Clean Air Haven (Zurich Baseline)",
    country: "Switzerland",
    region: "Alpine Foothills",
    aqi: 22,
    category: "Good",
    categoryColor: "#059669",
    statusBadge: "Clean Benchmark",
    pm25: 5.2,
    pm10: 9.8,
    no2: 12,
    co: 0.3,
    so2: 2,
    o3: 48,
    temp: 5,
    humidity: 60,
    windSpeed: 14.5,
    inversionHeight: 1800,
    primarySources: ["Minimal Background Aerosols"],
    healthWarning: "Air quality is ideal for all outdoor activities, deep breathing, and natural ventilation.",
    ventilationSafeWindow: "Anytime",
    worstWindow: "None"
  }
};

// 24-Hour Diurnal Thermal Inversion Profile Model
// Explains why PM2.5 spikes early morning and late night, and dips mid-afternoon
export const DIURNAL_CYCLE_MODEL = [
  { hour: 0, label: "12 AM", inversionStrength: "High", aqiMultiplier: 1.15, danger: "High", desc: "Radiational cooling strengthens inversion cap. Nocturnal truck traffic peaks." },
  { hour: 2, label: "2 AM", inversionStrength: "High", aqiMultiplier: 1.18, danger: "High", desc: "Surface temperatures drop to daily minimum. Smoke trapped near floor level." },
  { hour: 4, label: "4 AM", inversionStrength: "Severe", aqiMultiplier: 1.25, danger: "Severe", desc: "Lowest boundary layer of the day (~120m). Peak stagnant concentration." },
  { hour: 6, label: "6 AM", inversionStrength: "Extreme", aqiMultiplier: 1.35, danger: "Extreme", desc: "Morning rush begins. Cold dense air traps unburned diesel particulates at ground." },
  { hour: 7, label: "7 AM", inversionStrength: "Extreme", aqiMultiplier: 1.40, danger: "Extreme", desc: "PEAK DANGER WINDOW. School commutes and heavy diesel idling trapped under thermal ceiling." },
  { hour: 8, label: "8 AM", inversionStrength: "Extreme", aqiMultiplier: 1.38, danger: "Extreme", desc: "Sun begins to illuminate upper layer without yet warming ground. Trap persists." },
  { hour: 9, label: "9 AM", inversionStrength: "High", aqiMultiplier: 1.25, danger: "High", desc: "Ground slowly warms. Inversion layer begins slight expansion." },
  { hour: 10, label: "10 AM", inversionStrength: "Moderate", aqiMultiplier: 1.05, danger: "Moderate", desc: "Thermal currents start breaking boundary lid. Commute traffic subsides." },
  { hour: 11, label: "11 AM", inversionStrength: "Low", aqiMultiplier: 0.88, danger: "Moderate", desc: "Convective mixing dilutes particulate volume vertically." },
  { hour: 12, label: "12 PM", inversionStrength: "Very Low", aqiMultiplier: 0.72, danger: "Low", desc: "Solar angle increases. Mixing height reaches 800m+." },
  { hour: 13, label: "1 PM", inversionStrength: "Minimum", aqiMultiplier: 0.60, danger: "Lowest", desc: "SAFEST WINDOW OPENS. Maximum vertical dispersion and wind turbulence." },
  { hour: 14, label: "2 PM", inversionStrength: "Minimum", aqiMultiplier: 0.55, danger: "Lowest", desc: "OPTIMAL VENTILATION & ERRAND WINDOW. Lowest daily PM2.5 concentration." },
  { hour: 15, label: "3 PM", inversionStrength: "Minimum", aqiMultiplier: 0.62, danger: "Lowest", desc: "Solar heating begins to wane. Complete outdoor errands now." },
  { hour: 16, label: "4 PM", inversionStrength: "Low", aqiMultiplier: 0.78, danger: "Moderate", desc: "Ground starts radiating heat away into cold sky. Inversion begins forming." },
  { hour: 17, label: "5 PM", inversionStrength: "Moderate", aqiMultiplier: 0.95, danger: "Moderate", desc: "Sunset trigger. Evening rush hour emissions start getting trapped." },
  { hour: 18, label: "6 PM", inversionStrength: "High", aqiMultiplier: 1.12, danger: "High", desc: "Rapid temperature inversion sets in. Surface cools quickly." },
  { hour: 19, label: "7 PM", inversionStrength: "Severe", aqiMultiplier: 1.28, danger: "Severe", desc: "EVENING SPIKE. Cooking, residential heating, and traffic emissions sealed under lid." },
  { hour: 20, label: "8 PM", inversionStrength: "Severe", aqiMultiplier: 1.34, danger: "Severe", desc: "Dangerous outdoor air. Seal all doors/windows; run indoor purification." },
  { hour: 21, label: "9 PM", inversionStrength: "Severe", aqiMultiplier: 1.30, danger: "Severe", desc: "Severe pollutant stagnation. High indoor infiltration in leaky buildings." },
  { hour: 22, label: "10 PM", inversionStrength: "High", aqiMultiplier: 1.22, danger: "High", desc: "Nighttime heavy vehicle entry into urban centers spikes NO2 and ultrafines." },
  { hour: 23, label: "11 PM", inversionStrength: "High", aqiMultiplier: 1.18, danger: "High", desc: "Stable nocturnal boundary layer persists until dawn." }
];

// Indoor Air Quality (IAQ) Hacks and DIY Solutions
export const IAQ_HACKS = [
  {
    id: "corsi_rosenthal",
    title: "The Corsi-Rosenthal (C-R) Box Purifier",
    category: "DIY Filtration",
    cost: "$35 - $50 (vs $300 commercial)",
    effectiveness: "90% - 95% PM2.5 Reduction",
    cadr: "550 - 650 CFM",
    buildTime: "15 minutes",
    badge: "Gold Standard DIY",
    summary: "An open-source, scientifically validated air cleaner constructed from a 20-inch box fan, 4 or 5 MERV 13 furnace filters, and duct tape.",
    whyItWorks: "Large surface area of 4 pleated MERV 13 filters creates ultra-low static pressure drop. The box fan moves massive volume of air (500+ CFM) with low resistance, delivering higher Clean Air Delivery Rate (CADR) than $400 commercial HEPA units with tiny cylindrical filters.",
    steps: [
      "Arrange 4 MERV 13 filters (20x20x1 or 20x20x2 inch) into an open square cube with air-flow arrows pointing inward.",
      "Tape bottom edges together and seal the bottom with a 20x20 inch square cardboard floor piece.",
      "Place the 20-inch box fan on top, blowing UPWARD into the room (arrows pointing up).",
      "Tape all edges with heavy-duty duct tape so no unfiltered air leaks through corners.",
      "Add a cardboard shroud: cut a 15-inch circular hole in a 20x20 cardboard piece and tape to fan face to eliminate blade vortex backflow (boosts efficiency by 20%!)."
    ],
    materials: ["1x 20-inch Box Fan ($20)", "4x MERV 13 Filters 20x20x1 ($25)", "Duct tape / Gorilla tape ($5)", "Cardboard box scraps ($0)"]
  },
  {
    id: "wet_mopping",
    title: "Wet-Mopping & Microfiber Protocol (No Dry Brooming)",
    category: "Surface Mitigation",
    cost: "$0 (Zero Cost)",
    effectiveness: "80% reduction in resuspension",
    cadr: "Mechanical trapping",
    buildTime: "Immediate",
    badge: "Zero-Cost Essential",
    summary: "Never dry sweep, feather dust, or use standard vacuums without certified HEPA exhaust during smog episodes.",
    whyItWorks: "Standard brooms and bagless non-HEPA vacuums act like aerosol cannons: they resuspend heavy toxic heavy-metal particles and PM2.5 that have settled overnight, keeping them at nose-height for hours. Damp microfiber cloths bind particles through surface tension and capillary action, removing them permanently.",
    steps: [
      "Fill a bucket with warm water and a few drops of mild soap (surfactant breaks surface tension).",
      "Wipe window sills, door frames, desk surfaces with a damp microfiber cloth.",
      "Wet-mop all hard floors twice daily (morning and before sleep).",
      "Rinse mop head in separate bucket to prevent spreading mud particulate."
    ],
    materials: ["Microfiber mop or cotton rags", "Water with mild dishwashing soap", "Bucket"]
  },
  {
    id: "thermal_curtain_weatherproofing",
    title: "Bubble Wrap & Towel Snake Weatherization",
    category: "Infiltration Sealing",
    cost: "$3 - $8",
    effectiveness: "65% reduction in outdoor smoke leaks",
    cadr: "Passive Barrier",
    buildTime: "10 minutes",
    badge: "High ROI Hack",
    summary: "Seals drafty windows and door gaps that allow winter smog to penetrate while reducing room heat loss.",
    whyItWorks: "Winter smog is driven into homes by stack effect: warm indoor air rises and escapes through ceiling gaps, sucking cold, toxic outdoor smog through unsealed floor-level doors and window jambs. Sealing perimeter drafts stops the pressure siphon.",
    steps: [
      "Spray window glass with fine mist of water; press bubble wrap bubble-side onto the wet glass (it sticks without adhesive and adds R-2 insulation!).",
      "Roll a dry bathroom towel into a tight snake and place at the base of exterior doors and balcony sliders.",
      "Apply removable blue painter's tape or foam weather-stripping to window sash seams.",
      "Hang thick thermal curtains or blankets over windows at night to create a secondary thermal airlock."
    ],
    materials: ["Bubble wrap roll", "Spray bottle with water", "Rolled towels or pool noodles", "Painter's / weather tape"]
  },
  {
    id: "passive_humidity_balance",
    title: "Radiator Water Basin (Passive Airway Humidification)",
    category: "Respiratory Defense",
    cost: "$0",
    effectiveness: "Maintains optimal 40-50% RH",
    cadr: "Mucosal Defense",
    buildTime: "2 minutes",
    badge: "Health Protection",
    summary: "Keeps respiratory mucus membranes hydrated without creating ultrasonic humidifier 'white mineral dust'.",
    whyItWorks: "Dry winter heating air drops indoor Relative Humidity below 25%, causing nasal cilia (the lungs' natural conveyor belt for ejecting dust) to freeze and become paralyzed. However, ultrasonic humidifiers running on tap water vaporize dissolved calcium and magnesium into high counts of PM2.5 'white dust'! Passive evaporation from ceramic/metal bowls on radiators delivers pure distilled water vapor without aerosolizing minerals.",
    steps: [
      "Place shallow stainless steel or ceramic bowls of water directly on top of electric oil radiators or near heating vents.",
      "Hang damp clean towels near the bedside to evaporate naturally overnight.",
      "If using an active humidifier, ONLY use reverse-osmosis (RO) or distilled water, NEVER hard tap water.",
      "Target indoor humidity between 40% and 50% (measured with a cheap hygrometer)."
    ],
    materials: ["Stainless steel / ceramic shallow bowls", "Water", "Hygrometer (optional, $5)"]
  },
  {
    id: "cooking_ventilation_protocol",
    title: "Back-Burner & Lidded Induction Protocol",
    category: "Indoor Emission Control",
    cost: "$0",
    effectiveness: "75% drop in kitchen ultrafines",
    cadr: "Source Reduction",
    buildTime: "Immediate",
    badge: "Essential Habit",
    summary: "Optimizes cooktop physics to eliminate indoor nitrogen dioxide and frying oil aerosol spikes.",
    whyItWorks: "Cooking—especially deep frying, searing, or open LPG gas flames—can spike indoor PM2.5 to over 800 µg/m³ within 10 minutes, generating toxic acrolein and NO2. Range hoods capture up to 75% of emissions from the REAR burners, but only 25-35% from FRONT burners due to forward plume escape.",
    steps: [
      "Always cook on the BACK burners directly underneath the exhaust hood suction path.",
      "Turn on the exhaust fan 2 minutes BEFORE igniting the stove to establish draft velocity.",
      "Keep lids on pans to condense greasy vapor back into the liquid phase.",
      "If you lack an exhaust hood, open a window in the kitchen SLIGHTLY, close all kitchen interior doors leading to bedrooms, and point a fan facing OUT the window."
    ],
    materials: ["Kitchen range hood or window box fan", "Cooking pot lids"]
  },
  {
    id: "airlock_entryway",
    title: "3-Step Decontamination Entry Airlock",
    category: "Infiltration Sealing",
    cost: "$0",
    effectiveness: "Stops 60% of outdoor dust tracking",
    cadr: "Boundary Defense",
    buildTime: "Immediate",
    badge: "Habit Protocol",
    summary: "Prevents toxic street soot, diesel brake dust, and tire microplastics from being ground into indoor carpets.",
    whyItWorks: "Over 60% of lead, polycyclic aromatic hydrocarbons (PAHs), and coarse road dust inside homes is tracked in on shoe soles and wool coats. Establishing a strict 3-foot transition zone stops mechanical propagation.",
    steps: [
      "Place a coarse scraper mat outside the door, and a dense absorbent washable mat directly inside.",
      "Institute a strict 'No Outdoor Shoes Past the Mat' rule; transition immediately to indoor slippers.",
      "Take off outer jackets/coats immediately at the door and hang in an enclosed entryway closet rather than carrying to bedrooms.",
      "Gently wipe pet paws with a damp microfiber cloth after walks before they enter living areas."
    ],
    materials: ["Entryway door mats", "Shoe rack", "Coat rack / hooks", "Pet damp cloth"]
  }
];

// Scientific Myth Busters
export const MYTH_BUSTERS = [
  {
    id: "incense_myth",
    myth: "Burning incense (agarbatti/dhoop) or sage purifies polluted indoor air.",
    verdict: "DANGEROUSLY FALSE",
    verdictColor: "#dc2626",
    scientificReality: "Burning 1 incense stick emits as much PM2.5 and volatile organic compounds (benzene, toluene, polycyclic aromatic hydrocarbons) as smoking 3 to 5 commercial cigarettes. In an enclosed winter room, it spikes indoor PM2.5 to 600+ µg/m³ within 15 minutes, directly irritating inflamed bronchioles and increasing asthma attack risk.",
    saferAlternative: "Use natural whole spices (cinnamon stick, cloves, orange peel) simmered gently in a covered pot of water on an electric stove for fragrance without combustion."
  },
  {
    id: "houseplant_myth",
    myth: "Filling your home with snake plants and spider plants eliminates the need for an air purifier.",
    verdict: "MISLEADING / EXAGGERATED",
    verdictColor: "#ea580c",
    scientificReality: "The famous 1989 NASA Clean Air study was conducted in tiny, airtight 1-cubic-meter plexiglass chambers under intense artificial light. In a real home with natural air exchange (0.5 to 1.5 ACH), plants process air millions of times slower than an air purifier. You would need roughly 100 to 1,000 dense plants per square meter to match a single 150 CFM HEPA filter! However, plants DO provide modest psychological benefits, slight humidity moderation, and nighttime CO2 uptake (CAM metabolism in Snake Plants).",
    saferAlternative: "Enjoy houseplants for aesthetics and humidity, but rely on mechanical HEPA / MERV 13 filtration for particulate removal."
  },
  {
    id: "cloth_mask_myth",
    myth: "A cotton bandana, surgical mask, or dupatta scarf provides adequate protection against winter smog.",
    verdict: "FALSE & INEFFECTIVE",
    verdictColor: "#dc2626",
    scientificReality: "Winter smog lethality comes from PM2.5 (<2.5 µm) and ultrafines (<0.1 µm). Standard cloth fibers have pore sizes between 50 to 500 microns—hundreds of times larger than PM2.5. Loose-fitting surgical masks and scarves allow unfiltered toxic air to leak around the nose bridge and cheeks (filtration efficiency: only 10% - 20%). Only tightly sealed N95, KN95, KF94, or FFP2 respirators equipped with meltblown electrostatic media filter >95% of fine particulate.",
    saferAlternative: "Always wear a well-fitted N95 / FFP2 respirator with an adjustable metal nose clip. Ensure a tight seal with no air puffing into eyes when exhaling."
  },
  {
    id: "boiling_camphor_myth",
    myth: "Boiling eucalyptus oil, camphor, or menthol in the room 'opens and cleans' the lungs in severe smog.",
    verdict: "HARMFUL PRACTICE",
    verdictColor: "#dc2626",
    scientificReality: "Inhaling vaporized camphor or concentrated essential oils in an already irritated airway triggers neurogenic inflammation and reflex bronchoconstriction. In children and asthmatics, camphor inhalation can induce chemical pneumonitis and acute wheezing.",
    saferAlternative: "Simple sterile isotonic saline nasal sprays (0.9% NaCl) and warm plain water steam (without essential oils) safely rinse particulate from nasal mucosa."
  },
  {
    id: "salt_lamp_myth",
    myth: "Himalayan Pink Salt Lamps emit negative ions that cancel out smog particles.",
    verdict: "PURE PSEUDOSCIENCE",
    verdictColor: "#dc2626",
    scientificReality: "Peer-reviewed aerosol physics tests repeatedly show that heated salt lamps emit zero measurable negative air ions and have exactly 0.00% effect on PM2.5 or gas concentrations. They are decorative mood lights only.",
    saferAlternative: "Invest the $20 in a replacement MERV 13 furnace filter or door weatherstripping."
  }
];

// Sustainable Clean Swaps & Community Alternatives
export const SUSTAINABLE_SWAPS = [
  {
    id: "heating_swap",
    category: "Home Heating",
    currentPractice: "Open Biomass / Coal 'Angithi' / Wood Fire Brazier",
    cleanSwap: "Sealed Radiant Quartz / Mica Heater or Closed Oil-Filled Radiator",
    directImpact: "Eliminates lethal Carbon Monoxide (CO) poisoning risk and 99.8% of indoor particulate emissions. Prevents night hypoxia.",
    payback: "Safety immediate; saves fuel cost over wood/charcoal bundles.",
    communityBenefit: "Reduces neighborhood ground-level smoke plume that settles into neighboring apartments."
  },
  {
    id: "waste_swap",
    category: "Leaf & Garden Waste",
    currentPractice: "Raking and burning dry winter leaves & street trash",
    cleanSwap: "Trench Composting, Leaf Mulch Blanketing, or Municipal Bio-Waste",
    directImpact: "Stops release of toxic Dioxins, Furans, and dense black carbon. 1 ton of burned leaves emits ~30 kg of concentrated PM2.5 into ambient street air.",
    payback: "Enriches garden soil moisture and organic nitrogen for spring.",
    communityBenefit: "Protects neighborhood kids and elderly who walk along curbs."
  },
  {
    id: "cooking_swap",
    category: "Cooktop & Boiling",
    currentPractice: "Simmering heavy winter broths / stews on unvented LPG gas flame",
    cleanSwap: "Plug-in Portable Induction Plate (with lid)",
    directImpact: "Reduces indoor NO2 from ~120 ppb to <10 ppb. Cuts indoor thermal waste by 50% (induction is 85% efficient vs 40% for gas).",
    payback: "Cooks 35% faster; lowers LPG cylinder consumption.",
    communityBenefit: "Reduces peak fossil fuel extraction demand and kitchen ventilation load."
  },
  {
    id: "commute_swap",
    category: "Commuting",
    currentPractice: "Solo commute on 2-stroke motorcycle / open motorized rickshaw at 8 AM",
    cleanSwap: "Carpool in car with HEPA cabin filter, Shift departure to 10 AM, or Metro/Subway with N95",
    directImpact: "Reduces direct alveolar particulate intake by 88%. Avoids breathing diesel exhaust containing diesel particulate matter (IARC Group 1 Carcinogen).",
    payback: "Fuel cost shared 4-way; eliminates 70% of commute stress.",
    communityBenefit: "Lowers morning peak vehicle density during the worst inversion hour."
  },
  {
    id: "bed_warming_swap",
    category: "Personal Warmth",
    currentPractice: "Running 2000W high-draft fan heaters all night in drafty room",
    cleanSwap: "Hot Water Bottle / Heated Mattress Pad + Down Duvet",
    directImpact: "Heats the body directly instead of uninsulated room air. Cuts electricity consumption from 2000W to 60W (97% power reduction).",
    payback: "Saves massive utility bill; prevents dry throat and skin dehydration.",
    communityBenefit: "Reduces load on local coal-fired electrical peaker plants during winter grid peaks."
  }
];

// Interactive Impact Simulator Scientific Factors
export const IMPACT_COEFFICIENTS = {
  // Adult resting breathing rate ~ 0.5 - 0.6 m3/hr, walking/commute ~ 1.2 m3/hr
  breathingRateRest: 0.55, // m3 per hour
  breathingRateCommute: 1.15, // m3 per hour
  
  // Berkeley Earth empirical rule: Inhaling 22 µg/m3 of PM2.5 for 24 hours ≈ smoking 1 cigarette
  // 1 cigarette equivalent = 22 µg/m3 * (average 24h breathing volume ~ 15 m3) = 330 µg of PM2.5 inhaled
  pm25PerCigaretteMicrograms: 330,
  
  // N95 filtration factor
  n95FiltrationEfficiency: 0.95,
  clothFiltrationEfficiency: 0.20,
  
  // Air Purifier indoor removal efficiency
  hepaReductionFactor: 0.85, // 85% average indoor reduction in sealed room
  crBoxReductionFactor: 0.92,
  
  // Emissions avoided by not burning 10kg garden leaves
  leafBurnAvoidedPM25Grams: 300, // grams
  leafBurnAvoidedCO2Kg: 15.5,
  
  // Avoided car solo trip (15 km round trip)
  carSoloAvoidedCO2Kg: 3.2,
  carSoloAvoidedNOxGrams: 14.5
};
