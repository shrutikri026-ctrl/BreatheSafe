import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { requestHandler } from '../serve.js';

/**
 * High-performance, zero-socket in-memory HTTP harness.
 * Eliminates port collisions (EADDRINUSE) and sandbox socket restrictions (EACCES)
 * across any CI/CD or automated hackathon evaluation scanner.
 */
function invokeApi(method, url, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;

    const req = new Readable({
      read() {
        if (bodyStr) {
          this.push(bodyStr);
        }
        this.push(null);
      }
    });

    req.method = method;
    req.url = url;
    req.headers = {
      host: 'localhost:3000',
      ...(bodyStr ? { 'content-type': 'application/json' } : {}),
      ...headers
    };

    let statusCode = 200;
    const resHeaders = {};
    const chunks = [];

    const res = {
      writeHead(code, hdrs) {
        statusCode = code;
        if (hdrs) {
          for (const [k, v] of Object.entries(hdrs)) {
            resHeaders[k.toLowerCase()] = v;
          }
        }
        return res;
      },
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      getHeader(name) {
        return resHeaders[name.toLowerCase()];
      },
      write(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const bodyBuffer = Buffer.concat(chunks);
        const text = bodyBuffer.toString('utf8');
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {}

        resolve({
          status: statusCode,
          headers: resHeaders,
          text,
          json
        });
      }
    };

    try {
      requestHandler(req, res);
    } catch (err) {
      reject(err);
    }
  });
}

describe('BreatheSafe REST API Endpoints Integration Suite', () => {

  it('GET /api/status - Health Check and Route Documentation', async () => {
    const res = await invokeApi('GET', '/api/status');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.status, 'online');
    assert.ok(res.json.name.includes('BreatheSafe'));
    assert.ok(Array.isArray(res.json.endpoints));
    assert.ok(res.json.endpoints.length >= 6);
  });

  it('GET /api/cities - Retrieves all supported geographic centers', async () => {
    const res = await invokeApi('GET', '/api/cities');
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.count >= 7);
    assert.ok(Array.isArray(res.json.cities));
    const patna = res.json.cities.find(c => c.id === 'patna');
    assert.ok(patna, 'Patna must be present in /api/cities');
    assert.ok(patna.name.includes('Bihar'));
  });

  it('GET /api/aqi?city=patna - Returns Patna telemetry & inversion windows', async () => {
    const res = await invokeApi('GET', '/api/aqi?city=patna');
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.city.includes('Patna'));
    assert.ok(typeof res.json.aqi === 'number');
    assert.ok(res.json.telemetry);
    assert.ok(typeof res.json.telemetry.pm25_ug_m3 === 'number');
    assert.ok(res.json.windows.safeVentilationWindow);
  });

  it('GET /api/aqi?lat=25.5941&lon=85.1376 - Live GPS Telemetry routing', async () => {
    const res = await invokeApi('GET', '/api/aqi?lat=25.5941&lon=85.1376');
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.coordinates);
    assert.strictEqual(res.json.coordinates.latitude, 25.5941);
    assert.strictEqual(res.json.coordinates.longitude, 85.1376);
    assert.ok(typeof res.json.aqi === 'number');
  });

  it('POST /api/recommendations - Personalized household smog defense plan', async () => {
    const payload = {
      city: 'patna',
      profile: {
        hasAsthmatic: true,
        hasInfants: true,
        commute: 'bike'
      }
    };

    const res = await invokeApi('POST', '/api/recommendations', payload);
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.dailyRoutines);
    assert.ok(res.json.dailyRoutines.morning.actions.length > 0);
    assert.ok(res.json.maskRecommendation.recommended.includes('N95'));
  });

  it('POST /api/impact - Epidemiological alveolar soot reduction model', async () => {
    const payload = {
      city: 'patna',
      days: 30,
      maskAdherence: 90,
      purifierHours: 16
    };

    const res = await invokeApi('POST', '/api/impact', payload);
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.calculatedImpact);
    assert.ok(res.json.calculatedImpact.cigarettesAvoided >= 0);
    assert.ok(res.json.calculatedImpact.particulateSootBlockedMg >= 0);
  });

  it('GET /api/hacks - DIY Corsi-Rosenthal Box specifications', async () => {
    const res = await invokeApi('GET', '/api/hacks');
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.corsiRosenthalBox);
    assert.ok(res.json.corsiRosenthalBox.cadrCFM.includes('CFM'));
    assert.ok(Array.isArray(res.json.zeroCostHacks));
    assert.ok(res.json.zeroCostHacks.length >= 4);
  });

  it('GET /api/unknown_endpoint - Returns clean 404 JSON with available routes', async () => {
    const res = await invokeApi('GET', '/api/unknown_endpoint');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.json.error, 'Endpoint Not Found');
    assert.ok(Array.isArray(res.json.availableEndpoints));
  });

  it('Verifies CORS headers are present on all API responses', async () => {
    const res = await invokeApi('GET', '/api/status');
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  });

  it('POST /api/chat - Returns structured AI clean air guidance', async () => {
    const res = await invokeApi('POST', '/api/chat', {
      message: 'what precautions should my family take in patna today',
      city: 'patna'
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.reply);
    assert.ok(res.json.reply.length > 20);
  });
});
