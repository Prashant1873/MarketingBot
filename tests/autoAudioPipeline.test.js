import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import app from "../server/index.js";
import {
  decideOptimalMusicTrack,
  decideOptimalVoiceModel,
  compileNarrationScript,
  synthesizeAndSyncVoiceover,
} from "../server/services/smartAudioPipeline.js";

test("Smart Audio & Voice Decision Engine Suite", async (t) => {
  await t.test("decideOptimalMusicTrack assigns tone-matched upbeat Ende.app tracks", () => {
    assert.equal(
      decideOptimalMusicTrack("viral speedrun", "chaotic", "auto"),
      "happy-beats-vol-10"
    );
    assert.equal(
      decideOptimalMusicTrack("startup launch pitch", "yc-parody", "auto"),
      "happy-beats-vol-9"
    );
    assert.equal(
      decideOptimalMusicTrack("dramatic cinematic reveal", "cinematic", "auto"),
      "happy-beats-vol-12"
    );
    assert.equal(
      decideOptimalMusicTrack("enterprise precision platform", "polished", "auto"),
      "happy-beats-vol-11"
    );
    assert.equal(
      decideOptimalMusicTrack("cool new product", "default", "auto"),
      "happy-beats-vol-1"
    );
    // Explicit user override
    assert.equal(
      decideOptimalMusicTrack("anything", "chaotic", "happy-beats-vol-11"),
      "happy-beats-vol-11"
    );
  });

  await t.test("decideOptimalVoiceModel assigns character-matched Kokoro voices", () => {
    assert.equal(decideOptimalVoiceModel("pitch", "yc-parody", "auto"), "am_adam");
    assert.equal(decideOptimalVoiceModel("chaos", "chaotic", "auto"), "af_nova");
    assert.equal(decideOptimalVoiceModel("clean", "polished", "auto"), "af_heart");
    assert.equal(decideOptimalVoiceModel("film", "cinematic", "auto"), "am_michael");
    assert.equal(decideOptimalVoiceModel("dry", "deadpan", "auto"), "bm_george");
    assert.equal(decideOptimalVoiceModel("store", "app-store", "auto"), "af_sky");
    // Explicit user override
    assert.equal(decideOptimalVoiceModel("test", "default", "bf_emma"), "bf_emma");
  });

  await t.test("compileNarrationScript concatenates scene copy into continuous speech", () => {
    const mockScenes = [
      { headline: "Stop wasting hours manually editing videos.", subtext: "Meet Marcutie." },
      { headline: "AI Synthesizes Your Complete Feature UI.", subtext: "Zero code needed." },
      { headline: "Export Ready-to-Post Launch MP4s.", cta: "Try it free." },
    ];
    const script = compileNarrationScript(mockScenes);
    assert.ok(script.includes("Stop wasting hours manually editing videos. Meet Marcutie."));
    assert.ok(script.includes("AI Synthesizes Your Complete Feature UI. Zero code needed."));
    assert.ok(script.includes("Try it free."));
  });

  await t.test("synthesizeAndSyncVoiceover skips synthesis if voiceConfig.enabled is false", async () => {
    const storyboard = {
      title: "Test",
      tone: "default",
      scenes: [{ headline: "Hello World", duration: 3 }],
    };
    const result = await synthesizeAndSyncVoiceover(storyboard, { enabled: false }, 20);
    assert.equal(result.voiceoverUrl, undefined);
  });

  await t.test("POST /api/generate-storyboard assigns auto upbeat track and voice settings", async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://localhost:${port}/api/generate-storyboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "The ultimate hyper-growth startup analytics dashboard for seed stage founders",
          tone: "yc-parody",
          aspectRatio: "16:9",
          duration: 20,
          audioConfig: {
            selectedMusicTrack: "auto",
            musicVolume: 0.85,
          },
          voiceConfig: {
            enabled: false, // keep false in mock test to avoid requiring hyperframes binary execution in quick test
          },
        }),
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.success);
      assert.ok(data.storyboard);
      assert.equal(data.storyboard.audio.musicTrack, "happy-beats-vol-9");
      assert.equal(data.storyboard.audioDirection.trackRecommendation, "happy-beats-vol-9");
    } finally {
      server.close();
    }
  });
});
