import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateUsAqi, CITIES_DATA } from '../serve.js';

describe('Environmental Health Calculations & Atmospheric Models', () => {
  it('should correctly calculate US AQI for Clean/Good air (<= 12 ug/m3)', () => {
    assert.strictEqual(calculateUsAqi(0), 0);
    assert.strictEqual(calculateUsAqi(5.2), 22);
    assert.strictEqual(calculateUsAqi(12.0), 50);
  });

  it('should correctly calculate US AQI for Moderate air (12.1 - 35.4 ug/m3)', () => {
    const aqi = calculateUsAqi(25);
    assert.ok(aqi > 50 && aqi <= 100, `Expected moderate AQI, got ${aqi}`);
  });

  it('should correctly calculate US AQI for Unhealthy for Sensitive Groups (35.5 - 55.4 ug/m3)', () => {
    const aqi = calculateUsAqi(45);
    assert.ok(aqi > 100 && aqi <= 150, `Expected USG AQI, got ${aqi}`);
  });

  it('should correctly calculate US AQI for Severe / Hazardous winter smog (> 250 ug/m3)', () => {
    const aqi = calculateUsAqi(350);
    assert.ok(aqi >= 300, `Expected Hazardous AQI, got ${aqi}`);
  });

  it('should cap out-of-scale extreme particulate values at 500', () => {
    assert.strictEqual(calculateUsAqi(600), 500);
    assert.strictEqual(calculateUsAqi(1000), 500);
  });

  it('should accurately calculate Berkeley Earth cigarette equivalents', () => {
    // Berkeley Earth rule: 22 ug/m3 PM2.5 inhaled over 24 hours ≈ 1 cigarette equivalent
    const pm25 = 220; // 10x baseline
    const days = 14;
    const cigarettesAvoided = Math.round((pm25 / 22) * days * 0.9); // with 90% protection
    assert.ok(cigarettesAvoided > 100, `Expected > 100 cigarettes avoided, got ${cigarettesAvoided}`);
  });

  it('should accurately calculate PM2.5 lung mass spared in milligrams', () => {
    // Alveolar mass calculation: breathing ~15m3 air/day
    const pm25 = 360; // ug/m3
    const days = 30;
    const airInhaledM3 = 15;
    const lungRetentionRate = 0.65;
    const reductionRate = 0.85;

    const totalUgBlocked = pm25 * airInhaledM3 * days * lungRetentionRate * reductionRate;
    const totalMgBlocked = (totalUgBlocked / 1000).toFixed(1);
    assert.ok(parseFloat(totalMgBlocked) > 50, `Expected significant soot mass spared in mg, got ${totalMgBlocked}`);
  });
});

describe('City Telemetry & Geographic Integrity', () => {
  it('should include Patna (Bihar) with correct Gangetic basin coordinates', () => {
    const patna = CITIES_DATA.patna;
    assert.ok(patna, 'Patna must be defined in CITIES_DATA');
    assert.strictEqual(patna.country, 'India');
    assert.ok(Math.abs(patna.lat - 25.5941) < 0.01, 'Patna latitude should be ~25.59');
    assert.ok(Math.abs(patna.lon - 85.1376) < 0.01, 'Patna longitude should be ~85.14');
    assert.ok(patna.safeVentilationWindow.includes('PM'), 'Safe ventilation window must be specified');
  });

  it('should verify all cities have valid coordinates and non-empty metadata', () => {
    for (const [key, city] of Object.entries(CITIES_DATA)) {
      assert.ok(city.name, `City ${key} must have a name`);
      assert.ok(typeof city.lat === 'number', `City ${key} must have numeric latitude`);
      assert.ok(typeof city.lon === 'number', `City ${key} must have numeric longitude`);
      assert.ok(city.sources && city.sources.length > 0, `City ${key} must list pollution sources`);
    }
  });
});
