import { test } from "node:test";
import assert from "node:assert/strict";
import { generateMockStoryboard } from "../server/ai/providers/mock.js";
import { validateStoryboard, autoFixStoryboard } from "../server/ai/validator.js";

test("Mock provider generates a valid storyboard structure", async () => {
  const storyboard = await generateMockStoryboard({
    prompt: "A high-performance Redis cache in Zig that handles 10M ops/sec with zero allocations.",
    tone: "polished",
    targetDuration: 20,
    hasImage: true,
  });

  assert.equal(storyboard.targetDuration, 20);
  assert.equal(storyboard.tone, "polished");
  assert.ok(Array.isArray(storyboard.scenes));
  assert.equal(storyboard.scenes[0].type, "hook");
  assert.equal(storyboard.scenes[0].duration, 2.5);

  const totalDur = storyboard.scenes.reduce((sum, s) => sum + s.duration, 0);
  assert.equal(Math.round(totalDur * 10) / 10, 20);
  assert.ok(storyboard.shareCopy.twitter.length > 10);
});

test("validateStoryboard accepts compliant storyboard", async () => {
  const validBoard = {
    title: "Test Product",
    scenes: [
      { id: "1", type: "hook", duration: 2.5, headline: "Stop everything." },
      { id: "2", type: "product_reveal", duration: 7.5, headline: "Meet the future." },
      { id: "3", type: "outro", duration: 5.0, headline: "Available now." },
    ],
  };

  const res = validateStoryboard(validBoard, 15);
  assert.equal(res.valid, true);
  assert.equal(res.errors.length, 0);
});

test("validateStoryboard catches non-compliant hook (< 2.0s or > 3.0s)", async () => {
  const invalidHookBoard = {
    title: "Test Product",
    scenes: [
      { id: "1", type: "hook", duration: 1.0, headline: "Too fast" },
      { id: "2", type: "product_reveal", duration: 9.0, headline: "Hello" },
      { id: "3", type: "outro", duration: 5.0, headline: "Bye" },
    ],
  };

  const res = validateStoryboard(invalidHookBoard, 15);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some((err) => err.includes("Hook scene duration")));
});

test("autoFixStoryboard fixes mismatched durations to exact target (15s, 20s, 25s)", async () => {
  const mismatchedBoard = {
    title: "Mismatched Pitch",
    scenes: [
      { id: "1", type: "hook", duration: 5.0, headline: "Too long hook" },
      { id: "2", type: "product_reveal", duration: 4.0, headline: "Middle" },
      { id: "3", type: "outro", duration: 3.0, headline: "End" },
    ],
  };

  // Target 20s
  const fixed20 = autoFixStoryboard(mismatchedBoard, 20);
  assert.ok(fixed20.scenes[0].duration >= 2.0 && fixed20.scenes[0].duration <= 3.0);
  const total20 = fixed20.scenes.reduce((sum, s) => sum + s.duration, 0);
  assert.equal(Math.round(total20 * 10) / 10, 20);

  // Target 15s
  const fixed15 = autoFixStoryboard(mismatchedBoard, 15);
  const total15 = fixed15.scenes.reduce((sum, s) => sum + s.duration, 0);
  assert.equal(Math.round(total15 * 10) / 10, 15);

  // Target 25s
  const fixed25 = autoFixStoryboard(mismatchedBoard, 25);
  const total25 = fixed25.scenes.reduce((sum, s) => sum + s.duration, 0);
  assert.equal(Math.round(total25 * 10) / 10, 25);
});
