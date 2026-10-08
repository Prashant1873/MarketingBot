import test from "node:test";
import assert from "node:assert/strict";
import { generateMockStoryboard } from "../server/ai/providers/mock.js";
import { classifyDeviceFrame } from "../server/services/deviceClassifier.js";

test("generateMockStoryboard produces mobile deviceFrame when mobile prompt is provided", async () => {
  const storyboard = await generateMockStoryboard({
    prompt: "A beautiful iOS mobile app for tracking daily workouts on your iPhone with widgets.",
    tone: "polished",
    aspectRatio: "9:16",
    targetDuration: 20,
  });

  assert.equal(storyboard.deviceFrame, "mobile");
  const revealScene = storyboard.scenes.find((s) => s.type === "product_reveal");
  assert.ok(revealScene, "Product reveal scene should exist");
  assert.equal(revealScene.deviceFrame, "mobile");
});

test("generateMockStoryboard produces macos deviceFrame when SaaS desktop prompt is provided", async () => {
  const storyboard = await generateMockStoryboard({
    prompt: "An enterprise SaaS analytics dashboard for monitoring cloud microservices in Chrome.",
    tone: "default",
    aspectRatio: "16:9",
    targetDuration: 20,
  });

  assert.equal(storyboard.deviceFrame, "macos");
  const revealScene = storyboard.scenes.find((s) => s.type === "product_reveal");
  assert.ok(revealScene, "Product reveal scene should exist");
  assert.equal(revealScene.deviceFrame, "macos");
});

test("generateMockStoryboard honors explicit deviceFrame override", async () => {
  const storyboard = await generateMockStoryboard({
    prompt: "An enterprise SaaS dashboard for databases.",
    deviceFrame: "mobile", // Explicitly requested mobile frame
    tone: "default",
    aspectRatio: "16:9",
    targetDuration: 20,
  });

  assert.equal(storyboard.deviceFrame, "mobile");
});

test("classifyDeviceFrame handles portrait mobile photos vs landscape laptop screenshots", () => {
  // iPhone screenshot (1179 x 2556)
  const phoneDims = { width: 1179, height: 2556 };
  assert.equal(classifyDeviceFrame({ prompt: "My product", imageDimensions: phoneDims }), "mobile");

  // MacBook screenshot (2560 x 1600)
  const laptopDims = { width: 2560, height: 1600 };
  assert.equal(classifyDeviceFrame({ prompt: "My product", imageDimensions: laptopDims }), "macos");
});
