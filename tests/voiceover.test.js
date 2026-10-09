import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import http from "http";

import app from "../server/index.js";
import { KOKORO_VOICES, estimateWavDuration } from "../server/services/voiceoverService.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test("Voiceover Suite", async (t) => {
  await t.test("KOKORO_VOICES includes distinct character presets", () => {
    assert.ok(Array.isArray(KOKORO_VOICES));
    assert.ok(KOKORO_VOICES.length >= 5);

    const heart = KOKORO_VOICES.find((v) => v.id === "af_heart");
    assert.ok(heart, "af_heart must exist");
    assert.equal(heart.gender, "female");

    const nova = KOKORO_VOICES.find((v) => v.id === "af_nova");
    assert.ok(nova, "af_nova must exist");

    const adam = KOKORO_VOICES.find((v) => v.id === "am_adam");
    assert.ok(adam, "am_adam must exist");
  });

  await t.test("GET /api/voiceover/voices returns 200 and list of voices", async () => {
    const res = await fetch(`${baseUrl}/api/voiceover/voices`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.voices));
    assert.ok(body.voices.length >= 5);
  });

  await t.test("POST /api/generate-voiceover rejects empty script with 400", async () => {
    const res = await fetch(`${baseUrl}/api/generate-voiceover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script: "" }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /required/i);
  });

  await t.test("estimateWavDuration calculates positive duration", () => {
    const sampleWav = path.join(process.cwd(), "assets", "sfx", "interface", "whoosh.wav");
    if (fs.existsSync(sampleWav)) {
      const dur = estimateWavDuration(sampleWav);
      assert.ok(dur > 0, "Duration must be positive");
    }
  });
});
