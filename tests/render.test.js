import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import http from "http";
import app from "../server/index.js";
import {
  getDimensions,
  calculatePeakPosterMoment,
  createRenderJob,
  getJob,
  synthesizeVideoWithFFmpeg,
  extractPosterFrame,
  bakeFrameZero,
} from "../server/services/renderService.js";

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

const sampleStoryboard = {
  title: "Marcutie Speed Launch",
  tagline: "Instant Video Generator",
  tone: "polished",
  aspectRatio: "16:9",
  totalDurationSec: 15,
  totalDurationFrames: 450,
  scenes: [
    {
      id: "scene-1",
      type: "hook",
      durationSec: 2.5,
      headline: "Stop Wasting Time on Launch Videos",
      subheadline: "Generate them locally in seconds.",
    },
    {
      id: "scene-2",
      type: "product_reveal",
      durationSec: 4.5,
      headline: "Meet Marcutie",
      subheadline: "Your new viral marketing generator",
    },
    {
      id: "scene-3",
      type: "highlight_beat",
      durationSec: 4.5,
      headline: "Everything Built In",
      features: ["Local Render", "Frame-0 Baking", "Social Copy"],
    },
    {
      id: "scene-4",
      type: "punchline_outro",
      durationSec: 3.5,
      headline: "Launch Today",
      ctaText: "Start Now",
    },
  ],
  shareCopy: {
    twitter: "Check out Marcutie!",
    linkedin: "Proud to share Marcutie.",
    discord: "Hey guys, test out Marcutie!",
  },
};

test("getDimensions returns correct canvas dimensions for aspect ratios", () => {
  assert.deepEqual(getDimensions("16:9"), { width: 1920, height: 1080 });
  assert.deepEqual(getDimensions("9:16"), { width: 1080, height: 1920 });
  assert.deepEqual(getDimensions("1:1"), { width: 1080, height: 1080 });
  // Fallback defaults to 16:9
  assert.deepEqual(getDimensions("unknown"), { width: 1920, height: 1080 });
});

test("calculatePeakPosterMoment calculates settled frame during product reveal", () => {
  const peak = calculatePeakPosterMoment(sampleStoryboard);
  assert.ok(peak.timestampSec > 2.5, "Peak timestamp should be after hook scene");
  assert.ok(peak.timestampSec <= 4.0, "Peak timestamp should be around product reveal settle");
  assert.equal(peak.frame, Math.round(peak.timestampSec * 30));
});

test("calculatePeakPosterMoment falls back gracefully without product reveal scene", () => {
  const noRevealStoryboard = {
    title: "Simple Promo",
    totalDurationSec: 20,
    scenes: [
      { id: "1", type: "hook", durationSec: 3 },
      { id: "2", type: "highlight_beat", durationSec: 17 },
    ],
  };
  const peak = calculatePeakPosterMoment(noRevealStoryboard);
  assert.ok(peak.timestampSec > 0);
  assert.ok(peak.frame > 0);
});

test("createRenderJob rejects invalid storyboard", () => {
  assert.throws(() => {
    createRenderJob(null);
  }, /Invalid storyboard/);

  assert.throws(() => {
    createRenderJob({});
  }, /Invalid storyboard/);
});

test("createRenderJob creates registered job and executes local FFmpeg pipeline", async () => {
  const testJob = createRenderJob(
    {
      ...sampleStoryboard,
      totalDurationSec: 2, // 2-second short test render
    },
    { useFastSynthesizer: true }
  );

  assert.ok(testJob.id.startsWith("render_"));
  assert.ok(["queued", "rendering"].includes(testJob.status));
  assert.equal(getJob(testJob.id).id, testJob.id);

  // Poll until job finishes or timeout (max 30s)
  const startTime = Date.now();
  while (Date.now() - startTime < 30000) {
    const current = getJob(testJob.id);
    if (current.status === "completed" || current.status === "error") {
      break;
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  const finishedJob = getJob(testJob.id);
  assert.equal(finishedJob.status, "completed", `Job failed with error: ${finishedJob.error}`);
  assert.equal(finishedJob.progress, 100);
  assert.ok(finishedJob.videoUrl.includes(testJob.id));
  assert.ok(finishedJob.posterUrl.includes(testJob.id));
  assert.ok(finishedJob.fileSize > 1000, "Rendered video file should have non-zero size");

  // Verify files exist on disk
  const jobDir = path.join(process.cwd(), "data", "renders", testJob.id);
  const finalVideo = path.join(jobDir, "marcutie_video.mp4");
  const posterFile = path.join(jobDir, "poster.jpg");

  assert.ok(fs.existsSync(finalVideo), "Final video should exist on disk");
  assert.ok(fs.existsSync(posterFile), "Settled poster should exist on disk");
});

test("POST /api/render starts job and returns 202", async () => {
  const res = await fetch(`${baseUrl}/api/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storyboard: { ...sampleStoryboard, totalDurationSec: 1 },
      options: { useFastSynthesizer: true },
    }),
  });

  assert.equal(res.status, 202);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.jobId.startsWith("render_"));

  // Check GET /api/render/:jobId/status
  const statusRes = await fetch(`${baseUrl}/api/render/${data.jobId}/status`);
  assert.equal(statusRes.status, 200);
  const statusData = await statusRes.json();
  assert.equal(statusData.success, true);
  assert.equal(statusData.job.id, data.jobId);
});

test("GET /api/render/:jobId/status returns 404 for nonexistent job", async () => {
  const res = await fetch(`${baseUrl}/api/render/fake_job_123/status`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.success, false);
});

