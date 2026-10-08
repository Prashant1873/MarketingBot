import test from "node:test";
import assert from "node:assert/strict";

// Direct testing of composition math and resolution constants
const AspectRatioDimensions = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

function secondsToFrames(seconds, fps = 30) {
  return Math.round(Number(seconds || 0) * fps);
}

function framesToSeconds(frames, fps = 30) {
  return (Number(frames || 0) / fps).toFixed(1);
}

test("secondsToFrames correctly maps marketing video durations at 30fps", () => {
  assert.equal(secondsToFrames(15, 30), 450);
  assert.equal(secondsToFrames(20, 30), 600);
  assert.equal(secondsToFrames(25, 30), 750);
  assert.equal(secondsToFrames(2.5, 30), 75);
});

test("framesToSeconds formats string timestamps accurately", () => {
  assert.equal(framesToSeconds(450, 30), "15.0");
  assert.equal(framesToSeconds(75, 30), "2.5");
});

test("AspectRatioDimensions defines standard 1080p canvas dimensions", () => {
  assert.deepEqual(AspectRatioDimensions["16:9"], { width: 1920, height: 1080 });
  assert.deepEqual(AspectRatioDimensions["9:16"], { width: 1080, height: 1920 });
  assert.deepEqual(AspectRatioDimensions["1:1"], { width: 1080, height: 1080 });
});

test("Scene sequence frame sum equals target duration frames", () => {
  const targetDuration = 20; // seconds
  const targetFrames = secondsToFrames(targetDuration, 30); // 600 frames

  const scenes = [
    { type: "hook", duration: 2.5 },
    { type: "product_reveal", duration: 5.5 },
    { type: "highlight_beats", duration: 7.0 },
    { type: "outro", duration: 5.0 },
  ];

  const totalFrames = scenes.reduce((sum, s) => sum + secondsToFrames(s.duration, 30), 0);
  assert.equal(totalFrames, targetFrames);
});
