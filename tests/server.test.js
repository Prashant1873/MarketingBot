import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import fs from "fs";
import path from "path";
import app from "../server/index.js";

let server;
let baseUrl;
const configPath = path.join(process.cwd(), "data", "config.json");
let originalConfigBackup = null;

before(async () => {
  if (fs.existsSync(configPath)) {
    try {
      originalConfigBackup = fs.readFileSync(configPath, "utf-8");
    } catch {
      originalConfigBackup = null;
    }
  }

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
  if (originalConfigBackup !== null) {
    try {
      fs.writeFileSync(configPath, originalConfigBackup, "utf-8");
    } catch {
      // Ignore
    }
  }

  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test("GET /api/health returns 200 and status ok", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, "ok");
  assert.equal(data.app, "Marcutie");
  assert.equal(data.version, "1.0.0");
});

test("GET /api/assets/audio returns music and sfx catalog", async () => {
  const res = await fetch(`${baseUrl}/api/assets/audio`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.music));
  assert.ok(Array.isArray(data.sfx));
  assert.ok(data.music.length >= 1, "Expected at least 1 music track");
  assert.ok(data.sfx.length >= 1, "Expected at least 1 sfx file");

  // Verify URL structure
  assert.ok(data.music[0].url.startsWith("/assets/music/"));
  assert.ok(data.sfx[0].url.startsWith("/assets/sfx/"));
});

test("POST /api/upload accepts valid PNG image and returns file URL", async () => {
  // 1x1 valid PNG buffer
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  const formData = new FormData();
  const blob = new Blob([pngHeader], { type: "image/png" });
  formData.append("image", blob, "test-pixel.png");

  const res = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    body: formData,
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.url.startsWith("/uploads/"));
  assert.equal(data.mimetype, "image/png");

  // Verify file is accessible via static server
  const fileRes = await fetch(`${baseUrl}${data.url}`);
  assert.equal(fileRes.status, 200);
  assert.equal(fileRes.headers.get("content-type"), "image/png");
});

test("POST /api/upload rejects non-image files with 400", async () => {
  const formData = new FormData();
  const blob = new Blob(["not an image"], { type: "text/plain" });
  formData.append("image", blob, "malicious.txt");

  const res = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    body: formData,
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
});

test("POST /api/config saves settings and GET /api/config returns masked state", async () => {
  const payload = {
    apiKeys: {
      gemini: "AIzaSyTestKey123",
      anthropic: "sk-ant-test456",
    },
    preferences: {
      defaultTone: "yc-parody",
      defaultFormat: "9:16",
      defaultDuration: 15,
    },
  };

  const postRes = await fetch(`${baseUrl}/api/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(postRes.status, 200);
  const postData = await postRes.json();
  assert.equal(postData.success, true);
  assert.equal(postData.hasKey.gemini, true);
  assert.equal(postData.hasKey.anthropic, true);

  // Retrieve via GET
  const getRes = await fetch(`${baseUrl}/api/config`);
  assert.equal(getRes.status, 200);
  const getData = await getRes.json();
  assert.equal(getData.success, true);
  assert.equal(getData.config.preferences.defaultTone, "yc-parody");
  assert.equal(getData.config.preferences.defaultFormat, "9:16");
  assert.equal(getData.config.hasKey.gemini, true);
  // Verify key is masked in GET
  assert.equal(getData.config.apiKeys.gemini, "configured");
});

test("POST /api/generate-storyboard generates validated storyboard", async () => {
  const payload = {
    prompt: "A modern fast developer tool that runs everywhere.",
    tone: "default",
    aspectRatio: "16:9",
    duration: 20,
  };

  const res = await fetch(`${baseUrl}/api/generate-storyboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.storyboard);
  assert.ok(Array.isArray(data.storyboard.scenes));
  assert.equal(data.storyboard.scenes[0].type, "hook");
});

