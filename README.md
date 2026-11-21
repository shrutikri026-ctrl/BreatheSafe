# 🛡️ BreatheSafe & AeroShield AI (वायु-कवच)
### *GenAI-Powered Winter Smog Resilience & Community Defense Assistant*

[![Air Quality](https://img.shields.io/badge/AQI-Critical%20Emergency%20(438)-red.svg)](#)
[![GenAI Powered](https://img.shields.io/badge/GenAI-Gemini%20Flash%20%2B%20Offline%20Neural-blue.svg)](#)
[![REST API](https://img.shields.io/badge/REST%20API-Port%203000-green.svg)](#)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero%20(100%25%20Offline%20First)-emerald.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)

---

## 📖 Overview

During winter months across the Indo-Gangetic Plain, Northern China, the Salt Lake Valley, and European river basins, meteorological **thermal inversions** trap toxic particulate matter ($\text{PM}_{2.5}$, $\text{PM}_{10}$), nitrogen dioxide ($\text{NO}_2$), and combustion smoke near street level. 

**BreatheSafe (AeroShield AI)** is an accessible, science-grounded GenAI application and **REST API platform** designed to help families and communities navigate severe winter smog and urban air pollution. 

---

## 🔌 Does it have its own API?

**Yes! BreatheSafe provides both:**
1. **Its own backend REST API server** (`http://localhost:3000/api/...`) for developers, mobile apps, WhatsApp bots, and smart home automation.
2. **Google Gemini GenAI API Integration** (`gemini-1.5-flash`), allowing live AI generative streaming using your Gemini API key (or our autonomous built-in neural fallback).

---

## 📡 REST API Reference

Run the server with `node serve.js` or `start.bat`. The following JSON endpoints become active on `http://localhost:3000`:

### 1. `GET /api/status`
Returns server health, active version, and endpoint registry.
```bash
curl http://localhost:3000/api/status
```

### 2. `GET /api/aqi?city=<city_id>`
Returns real-time air quality metrics, thermal inversion lid height, and diurnal safe/danger windows.
* **Query Parameters:** `city` (`delhi`, `lahore`, `beijing`, `krakow`, `saltlake`, `milan`, `clean_baseline`)
```bash
curl http://localhost:3000/api/aqi?city=delhi
```
**Sample Response:**
```json
{
  "city": "Delhi-NCR",
  "aqi": 438,
  "category": "Severe / Hazardous",
  "isDanger": true,
  "telemetry": {
    "pm25_ug_m3": 395,
    "pm10_ug_m3": 512,
    "no2_ppb": 88,
    "temperature_c": 14,
    "inversion_lid_height_meters": 180
  },
  "windows": {
    "safeVentilationWindow": "1:30 PM – 3:00 PM",
    "dangerHours": "6:00 AM – 9:30 AM & 7:30 PM – 10:00 PM"
  }
}
```

### 3. `POST /api/recommendations`
Generates personalized morning, afternoon, and night routines tailored to family vulnerability markers and commute modes.
```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "city": "delhi",
    "profile": {
      "hasAsthmatic": true,
      "hasInfants": false,
      "hasElderly": true,
      "commute": "bike"
    }
  }'
```

### 4. `POST /api/impact`
Calculates alveolar $\text{PM}_{2.5}$ mass prevented from entering pulmonary capillaries, Berkeley Earth cigarette equivalents avoided, and community $\text{CO}_2\text{e}$ saved.
```bash
curl -X POST http://localhost:3000/api/impact \
  -H "Content-Type: application/json" \
  -d '{
    "city": "delhi",
    "days": 14,
    "maskAdherence": 90,
    "purifierHours": 16
  }'
```

### 5. `POST /api/chat`
Ask the clean air assistant (Aura) any question programmatically. Connects to live Gemini 1.5 Flash if `x-api-key` header or body `apiKey` is provided, otherwise routes to the domain neural engine.
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_GEMINI_KEY" \
  -d '{
    "message": "Which mask is best for my 4-year-old on the school bus?",
    "city": "delhi"
  }'
```

### 6. `GET /api/hacks`
Returns specifications for building a $35 Corsi-Rosenthal Box (CADR: 550 CFM) and zero-cost household mitigation protocols.

---

## 🚀 How to Launch

### Option 1: Browser Direct Launch (Zero Setup)
Double-click [index.html](file:///c:/Users/Riya%20kumari/OneDrive/Desktop/New%20folder/index.html) or [start.bat](file:///c:/Users/Riya%20kumari/OneDrive/Desktop/New%20folder/start.bat) to open the web app in any browser.

### Option 2: Full-Stack Web App & REST API Server
```powershell
node serve.js
# Web UI:    http://localhost:3000
# REST API:  http://localhost:3000/api/status
```

---

## 🗂️ File Structure

```
├── index.html       # Clean single-page user interface (Tabs: Today, AI Helper, Hacks, Impact, REST API)
├── styles.css       # Clean, human-first minimalist styling (dark/modern mode)
├── bundle.js        # Unified reactive engine, Gemini API integration, and API tester
├── serve.js         # Zero-dependency Node.js REST API server & static host
├── start.bat        # Windows 1-click launcher
└── README.md        # Complete architecture & API documentation
```
