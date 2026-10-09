import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  VISUAL_THEME_PALETTES,
  getVisualThemePalette,
} from "../server/services/paletteExtractor.js";

describe("Visual Themes Engine Suite", () => {
  test("all 5 visual themes have valid token structures", () => {
    const requiredThemes = [
      "default-dark",
      "apple-clean",
      "neo-brutalist",
      "cyberpunk-scanlines",
      "aurora-glass",
    ];

    for (const themeId of requiredThemes) {
      const palette = VISUAL_THEME_PALETTES[themeId];
      assert.ok(palette, `Theme ${themeId} must exist in VISUAL_THEME_PALETTES`);
      assert.ok(palette.primary.startsWith("#"), `${themeId} primary must be hex color`);
      assert.ok(palette.secondary.startsWith("#"), `${themeId} secondary must be hex color`);
      assert.ok(palette.accent.startsWith("#"), `${themeId} accent must be hex color`);
      assert.ok(palette.background.startsWith("#"), `${themeId} background must be hex color`);
      assert.ok(palette.surface.startsWith("#"), `${themeId} surface must be hex color`);
      assert.ok(palette.text.startsWith("#"), `${themeId} text must be hex color`);
      assert.strictEqual(typeof palette.isDark, "boolean", `${themeId} must declare isDark boolean`);
      assert.strictEqual(palette.visualTheme, themeId, `${themeId} must reference its own visualTheme ID`);
    }
  });

  test("light themes declare isDark: false with dark typography", () => {
    const apple = getVisualThemePalette("apple-clean");
    assert.strictEqual(apple.isDark, false);
    assert.strictEqual(apple.background, "#fbfbfd");
    assert.strictEqual(apple.text, "#1d1d1f");

    const brutalist = getVisualThemePalette("neo-brutalist");
    assert.strictEqual(brutalist.isDark, false);
    assert.strictEqual(brutalist.text, "#000000");
  });

  test("dark themes declare isDark: true with light typography", () => {
    const defaultDark = getVisualThemePalette("default-dark");
    assert.strictEqual(defaultDark.isDark, true);
    assert.strictEqual(defaultDark.text, "#ffffff");

    const cyberpunk = getVisualThemePalette("cyberpunk-scanlines");
    assert.strictEqual(cyberpunk.isDark, true);
    assert.strictEqual(cyberpunk.primary, "#00f0ff");

    const aurora = getVisualThemePalette("aurora-glass");
    assert.strictEqual(aurora.isDark, true);
  });

  test("getVisualThemePalette falls back to default-dark for unknown theme IDs", () => {
    const fallback = getVisualThemePalette("non-existent-theme");
    assert.strictEqual(fallback.visualTheme, "default-dark");
    assert.strictEqual(fallback.isDark, true);
  });
});
