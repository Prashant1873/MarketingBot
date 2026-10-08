import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getDefaultThemePalette,
  extractPaletteFromBuffer,
  classifyFeatureArchetype,
  createDefaultFeatureMockup,
} from "../server/services/paletteExtractor.js";
import { autoFixStoryboard } from "../server/ai/validator.js";

describe("Style Transfer & Feature Synthesizer Suite", () => {
  test("getDefaultThemePalette returns tailored palette tokens for known tones", () => {
    const polished = getDefaultThemePalette("polished");
    assert.equal(polished.primary, "#6366f1");
    assert.equal(polished.isDark, true);

    const cinematic = getDefaultThemePalette("cinematic");
    assert.equal(cinematic.primary, "#e11d48");

    const fallback = getDefaultThemePalette("unknown_tone");
    assert.ok(fallback.primary);
    assert.ok(fallback.secondary);
    assert.ok(fallback.accent);
  });

  test("extractPaletteFromBuffer falls back gracefully for invalid or empty buffers", () => {
    const nullResult = extractPaletteFromBuffer(null, "polished");
    assert.equal(nullResult.primary, "#6366f1");

    const smallBuffer = Buffer.from([1, 2, 3]);
    const smallResult = extractPaletteFromBuffer(smallBuffer, "cinematic");
    assert.equal(smallResult.primary, "#e11d48");
  });

  test("extractPaletteFromBuffer quantizes and samples dominant colors from synthetic image buffer", () => {
    // Construct a synthetic 1000-byte buffer filled with vibrant purple (#9620b0) bytes
    const buf = Buffer.alloc(1200);
    for (let i = 0; i < buf.length - 2; i += 3) {
      buf[i] = 160;     // R
      buf[i + 1] = 40;  // G
      buf[i + 2] = 200; // B
    }

    const palette = extractPaletteFromBuffer(buf, "default");
    assert.ok(palette.primary.startsWith("#"));
    assert.ok(palette.secondary.startsWith("#"));
    assert.ok(palette.accent.startsWith("#"));
    assert.equal(palette.isDark, true);
  });

  test("classifyFeatureArchetype identifies kanban, chat, checkout, and analytics from prompt keywords", () => {
    assert.equal(
      classifyFeatureArchetype("Manage your team backlog with our interactive kanban board"),
      "kanban"
    );
    assert.equal(
      classifyFeatureArchetype("Ask any question to our intelligent AI chatbot and copilot"),
      "chat"
    );
    assert.equal(
      classifyFeatureArchetype("Seamless 1-click stripe checkout and billing invoicing for ecommerce"),
      "checkout"
    );
    assert.equal(
      classifyFeatureArchetype("Follow member activity feed, stream posts, and community discussions"),
      "feed"
    );
    assert.equal(
      classifyFeatureArchetype("Configure API keys, encryption settings and security profile"),
      "settings"
    );
    assert.equal(
      classifyFeatureArchetype("High throughput analytics telemetry with latency charts and KPI tracking"),
      "analytics"
    );
    assert.equal(
      classifyFeatureArchetype("A standard minimalist developer tool"),
      "analytics"
    );
  });

  test("createDefaultFeatureMockup returns structured mockup descriptor with items", () => {
    const kanban = createDefaultFeatureMockup("kanban", "Supabase Sprint");
    assert.equal(kanban.featureType, "kanban");
    assert.equal(kanban.title, "Supabase Sprint Board");
    assert.ok(Array.isArray(kanban.items));
    assert.ok(kanban.items.length >= 3);

    const chat = createDefaultFeatureMockup("chat", "Claude");
    assert.equal(chat.featureType, "chat");
    assert.ok(chat.items.some((i) => i.label === "Assistant"));
  });

  test("autoFixStoryboard attaches themePalette and featureMockup to storyboard and scenes", () => {
    const rawStoryboard = {
      title: "TaskFlow",
      tagline: "Agile kanban boards for fast engineers",
      tone: "polished",
      aspectRatio: "16:9",
      targetDuration: 15,
      scenes: [
        {
          id: "scene_1",
          type: "hook",
          duration: 3,
          headline: "Stop wrestling Jira",
        },
        {
          id: "scene_2",
          type: "product_reveal",
          duration: 4.5,
          headline: "Meet TaskFlow",
        },
      ],
      audioDirection: {
        musicMood: "energetic",
        trackRecommendation: "track-01.mp3",
        sfxCues: [],
      },
      shareCopy: {
        twitter: "Check it out",
        linkedin: "Check it out",
        discord: "Check it out",
      },
    };

    const fixed = autoFixStoryboard(rawStoryboard);
    assert.ok(fixed.themePalette);
    assert.ok(fixed.themePalette.primary);
    assert.ok(fixed.featureMockup);
    assert.equal(fixed.featureMockup.featureType, "kanban");

    // Product reveal scene should inherit themePalette and featureMockup
    const productReveal = fixed.scenes.find((s) => s.type === "product_reveal");
    assert.ok(productReveal);
    assert.ok(productReveal.themePalette);
    assert.ok(productReveal.featureMockup);
    assert.equal(productReveal.featureMockup.featureType, "kanban");
  });
});
