import test from "node:test";
import assert from "node:assert/strict";
import { classifyDeviceFrame } from "../server/services/deviceClassifier.js";

test("classifyDeviceFrame returns override when explicitly specified", () => {
  assert.equal(classifyDeviceFrame({ override: "mobile", prompt: "A desktop SaaS dashboard" }), "mobile");
  assert.equal(classifyDeviceFrame({ override: "macos", prompt: "An iOS mobile app on iPhone" }), "macos");
});

test("classifyDeviceFrame classifies portrait image as mobile", () => {
  // Portrait phone screenshot (e.g. 1170x2532 on iPhone)
  const result = classifyDeviceFrame({
    prompt: "An amazing modern software tool",
    imageDimensions: { width: 1170, height: 2532 },
  });
  assert.equal(result, "mobile");
});

test("classifyDeviceFrame classifies landscape image as macos", () => {
  // Landscape laptop screenshot (e.g. 2880x1800 on MacBook)
  const result = classifyDeviceFrame({
    prompt: "An amazing modern software tool",
    imageDimensions: { width: 2880, height: 1800 },
  });
  assert.equal(result, "macos");
});

test("classifyDeviceFrame classifies mobile keywords in prompt without image", () => {
  const prompts = [
    "Introducing our new iOS habit tracker for iPhone with lock screen widgets",
    "A sleek Android mobile app that lets you order coffee in seconds",
    "Download on the App Store today — swipe, tap and get things done in your pocket",
  ];

  for (const p of prompts) {
    assert.equal(classifyDeviceFrame({ prompt: p }), "mobile", `Failed for prompt: ${p}`);
  }
});

test("classifyDeviceFrame classifies desktop/SaaS keywords in prompt without image", () => {
  const prompts = [
    "The all-in-one SaaS dashboard for modern engineering analytics",
    "A desktop Chrome extension and web app to automate your browser workflows",
    "Admin portal and B2B cloud console for managing enterprise infrastructure",
  ];

  for (const p of prompts) {
    assert.equal(classifyDeviceFrame({ prompt: p }), "macos", `Failed for prompt: ${p}`);
  }
});

test("classifyDeviceFrame defaults to macos when ambiguous or neutral", () => {
  assert.equal(classifyDeviceFrame({ prompt: "A revolutionary product that saves time." }), "macos");
  assert.equal(classifyDeviceFrame(), "macos");
});
