import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import http from "http";
import { exec } from "child_process";
import { promisify } from "util";
import app from "../server/index.js";
import { generateGifFromVideo } from "../server/services/renderService.js";

const execAsync = promisify(exec);

let server;
let baseUrl;

const testJobId = `test_gif_${Date.now()}`;
const testJobDir = path.join(process.cwd(), "data", "renders", testJobId);
const testVideoPath = path.join(testJobDir, "marcutie_video.mp4");
const testGifPath = path.join(testJobDir, "marcutie_preview.gif");

before(async () => {
  // Start in-memory test server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  // Create temporary render directory and a 1-second synthetic MP4 using FFmpeg
  fs.mkdirSync(testJobDir, { recursive: true });
  const makeVideoCmd = `ffmpeg -y -f lavfi -i testsrc=duration=1:size=640x360:rate=15 -pix_fmt yuv420p "${testVideoPath}"`;
  await execAsync(makeVideoCmd);
});

after(async () => {
  // Close server
  await new Promise((resolve) => {
    server.close(resolve);
  });

  // Cleanup test files
  if (fs.existsSync(testJobDir)) {
    try {
      fs.rmSync(testJobDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
});

test("generateGifFromVideo throws error if video does not exist", async () => {
  await assert.rejects(
    async () => {
      await generateGifFromVideo("non_existent_job_999");
    },
    /Video file not found/
  );
});

test("generateGifFromVideo creates valid two-pass animated GIF with palettegen", async () => {
  assert.ok(fs.existsSync(testVideoPath), "Test synthetic video should exist");

  const result = await generateGifFromVideo(testJobId, { fps: 15, width: 320 });

  assert.strictEqual(result.jobId, testJobId);
  assert.strictEqual(result.cached, false);
  assert.strictEqual(result.gifUrl, `/renders/${testJobId}/marcutie_preview.gif`);
  assert.ok(result.fileSize > 500, "GIF file should be non-empty");
  assert.ok(fs.existsSync(testGifPath), "marcutie_preview.gif must exist on disk");
});

test("generateGifFromVideo returns cached GIF on subsequent calls", async () => {
  const cachedResult = await generateGifFromVideo(testJobId);

  assert.strictEqual(cachedResult.cached, true);
  assert.strictEqual(cachedResult.gifUrl, `/renders/${testJobId}/marcutie_preview.gif`);
  assert.ok(cachedResult.fileSize > 500);
});

test("POST /api/render/:jobId/gif returns JSON metadata for generated GIF", async () => {
  const res = await fetch(`${baseUrl}/api/render/${testJobId}/gif`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.jobId, testJobId);
  assert.strictEqual(data.gifUrl, `/renders/${testJobId}/marcutie_preview.gif`);
  assert.ok(data.fileSize > 500);
});

test("GET /api/render/:jobId/gif/download streams GIF with image/gif content type", async () => {
  const res = await fetch(`${baseUrl}/api/render/${testJobId}/gif/download`);

  assert.strictEqual(res.status, 200);
  const contentType = res.headers.get("content-type");
  assert.ok(contentType?.includes("image/gif"), "Content-Type must be image/gif");

  const arrayBuffer = await res.arrayBuffer();
  assert.ok(arrayBuffer.byteLength > 500, "Downloaded GIF stream must be populated");
});

test("GET /api/render/:jobId/gif/download returns 500 for missing job video", async () => {
  const res = await fetch(`${baseUrl}/api/render/fake_ghost_job/gif/download`);
  assert.strictEqual(res.status, 500);
  const data = await res.json();
  assert.strictEqual(data.success, false);
});
