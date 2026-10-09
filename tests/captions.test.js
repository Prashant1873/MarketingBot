import test, { describe } from "node:test";
import assert from "node:assert";
import {
  analyzeWord,
  groupIntoPhrases,
  computeSceneWordTimestamps,
  getActiveSubtitleAtFrame,
} from "../server/services/subtitleTiming.js";

describe("Kinetic Subtitle Timing Engine Suite", () => {
  test("analyzeWord extracts clean word and assigns extra weight to punctuation pauses", () => {
    const regular = analyzeWord("marketing");
    assert.strictEqual(regular.cleanWord, "marketing");
    assert.strictEqual(regular.isPunctuationBreak, false);
    assert.ok(regular.weight >= 9);

    const commaWord = analyzeWord("seconds,");
    assert.strictEqual(commaWord.cleanWord, "seconds");
    assert.strictEqual(commaWord.isPunctuationBreak, true);
    assert.ok(commaWord.weight > regular.weight, "Comma word should have higher weight due to pause");

    const periodWord = analyzeWord("now!");
    assert.strictEqual(periodWord.cleanWord, "now");
    assert.strictEqual(periodWord.isPunctuationBreak, true);
  });

  test("computeSceneWordTimestamps handles empty or whitespace-only scripts gracefully", () => {
    const empty = computeSceneWordTimestamps("", 3, 30);
    assert.strictEqual(empty.durationFrames, 90);
    assert.strictEqual(empty.words.length, 0);
    assert.strictEqual(empty.phrases.length, 0);

    const whitespace = computeSceneWordTimestamps("   ", 2.5, 30);
    assert.strictEqual(whitespace.durationFrames, 75);
    assert.strictEqual(whitespace.words.length, 0);
  });

  test("computeSceneWordTimestamps distributes frames across words sequentially without overlap", () => {
    const script = "Launch videos in seconds, not weeks.";
    const durationSec = 3.0;
    const fps = 30;
    const totalFrames = 90;

    const result = computeSceneWordTimestamps(script, durationSec, fps);

    assert.strictEqual(result.durationFrames, totalFrames);
    assert.strictEqual(result.words.length, 6);

    // Verify sequential non-overlapping frames
    for (let i = 0; i < result.words.length; i++) {
      const w = result.words[i];
      assert.ok(w.startFrame >= 0, "startFrame should be >= 0");
      assert.ok(w.endFrame <= totalFrames, "endFrame should not exceed totalFrames");
      assert.ok(w.endFrame > w.startFrame, "endFrame should be after startFrame");

      if (i > 0) {
        assert.strictEqual(
          w.startFrame,
          result.words[i - 1].endFrame,
          "Next word startFrame should match previous word endFrame"
        );
      }
    }
  });

  test("groupIntoPhrases breaks long word chains into readable chunks", () => {
    const script = "Stop wasting weeks manually editing video frames when AI can do it instantly with punchy captions.";
    const result = computeSceneWordTimestamps(script, 5.0, 30);

    assert.ok(result.phrases.length >= 3, "Should produce multiple phrases");
    for (const phrase of result.phrases) {
      assert.ok(phrase.words.length <= 6, "Each phrase should not exceed word limit");
      assert.ok(phrase.text.length > 0);
    }
  });

  test("getActiveSubtitleAtFrame finds active phrase and word accurately", () => {
    const script = "Ship faster. Sell more.";
    const result = computeSceneWordTimestamps(script, 3.0, 30);

    // Test frame 0 (before lead in or at start)
    const atStart = getActiveSubtitleAtFrame(result, 0);
    assert.ok(atStart.activePhrase !== null);
    assert.strictEqual(atStart.activeWordIndex, 0);

    // Test frame at second word
    const secondWord = result.words[1];
    const midFrame = Math.floor((secondWord.startFrame + secondWord.endFrame) / 2);
    const atSecond = getActiveSubtitleAtFrame(result, midFrame);
    assert.strictEqual(atSecond.activeWord?.cleanWord, "faster");

    // Test frame at end of scene
    const atEnd = getActiveSubtitleAtFrame(result, 89);
    assert.ok(atEnd.activeWord !== null);
  });
});
