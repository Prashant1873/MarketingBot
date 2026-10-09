import { generateKokoroVoiceover } from "./voiceoverService.js";
import { autoFixStoryboard } from "../ai/validator.js";

/**
 * Decides optimal upbeat music track based on tone and prompt content when track is "auto"
 */
export function decideOptimalMusicTrack(prompt = "", tone = "default", requestedTrack = "auto") {
  if (requestedTrack && requestedTrack !== "auto") {
    return requestedTrack;
  }

  const cleanPrompt = (prompt || "").toLowerCase();
  const cleanTone = (tone || "").toLowerCase();

  // Explicit tone presets take precedence
  if (cleanTone === "chaotic") return "happy-beats-vol-10";
  if (cleanTone === "yc-parody") return "happy-beats-vol-9";
  if (cleanTone === "cinematic" || cleanTone === "deadpan") return "happy-beats-vol-12";
  if (cleanTone === "polished") return "happy-beats-vol-11";

  // Prompt keyword inference for default tone
  if (/\b(chaos|meme|viral|fast|insane|hype|rush)\b/i.test(cleanPrompt)) {
    return "happy-beats-vol-10";
  }
  if (/\b(startup|founder|pitch|parody|vc|silicon|angel)\b/i.test(cleanPrompt)) {
    return "happy-beats-vol-9";
  }
  if (/\b(epic|cinematic|film|trailer|deep|drama)\b/i.test(cleanPrompt)) {
    return "happy-beats-vol-12";
  }
  if (/\b(enterprise|b2b|luxury|executive|clean|minimal)\b/i.test(cleanPrompt)) {
    return "happy-beats-vol-11";
  }

  // Default launch beat (Vol 1)
  return "happy-beats-vol-1";
}

/**
 * Decides optimal Kokoro voice model based on tone when voice is "auto"
 */
export function decideOptimalVoiceModel(prompt = "", tone = "default", requestedVoice = "auto") {
  if (requestedVoice && requestedVoice !== "auto") {
    return requestedVoice;
  }

  const cleanTone = (tone || "").toLowerCase();

  switch (cleanTone) {
    case "polished":
      return "af_heart"; // Warm & engaging
    case "yc-parody":
      return "am_adam"; // Confident startup founder
    case "chaotic":
      return "af_nova"; // High energy & fast paced
    case "cinematic":
      return "am_michael"; // Deep, dramatic & cinematic
    case "deadpan":
      return "bm_george"; // Sophisticated British dry wit
    case "app-store":
      return "af_sky"; // Crisp, articulate & clear
    case "default":
    default:
      return "af_heart";
  }
}

/**
 * Compiles a natural narration script across storyboard scenes
 */
export function compileNarrationScript(scenes = []) {
  const parts = [];
  for (const scene of scenes) {
    if (scene.voiceoverScript && scene.voiceoverScript.trim()) {
      parts.push(scene.voiceoverScript.trim());
    } else {
      let sentence = (scene.headline || "").trim();
      if (scene.subtext && scene.subtext.trim()) {
        const sub = scene.subtext.trim();
        sentence = sentence.endsWith(".") ? `${sentence} ${sub}` : `${sentence}. ${sub}`;
      }
      if (scene.cta && scene.cta.trim()) {
        const cta = scene.cta.trim();
        sentence = sentence.endsWith(".") ? `${sentence} ${cta}` : `${sentence}. ${cta}`;
      }
      if (sentence) {
        parts.push(sentence);
      }
    }
  }
  return parts.join(" ");
}

/**
 * Synthesizes voiceover narration upfront and synchronizes scene durations to fit narration
 * @param {object} storyboard
 * @param {object} voiceConfig
 * @param {number} targetDuration
 * @returns {Promise<object>} updated storyboard with voiceover & ducking attached
 */
export async function synthesizeAndSyncVoiceover(storyboard, voiceConfig = {}, targetDuration = 20) {
  if (!storyboard || !storyboard.scenes) return storyboard;

  // If voiceover is explicitly disabled, skip synthesis
  if (voiceConfig && voiceConfig.enabled === false) {
    return storyboard;
  }

  const voice = decideOptimalVoiceModel(storyboard.title, storyboard.tone, voiceConfig.voiceId);
  const narrationScript = compileNarrationScript(storyboard.scenes);

  if (!narrationScript || !narrationScript.trim()) {
    return storyboard;
  }

  try {
    const voResult = await generateKokoroVoiceover(narrationScript, voice);

    if (voResult && voResult.url) {
      storyboard.voiceoverUrl = voResult.url;
      storyboard.voiceoverScript = narrationScript;
      storyboard.voiceoverVoice = voice;

      const speechDuration = Number(voResult.durationSec) || 5.0;

      // Ensure total video length is at least speechDuration + 1.2s padding for outro
      const minRequiredDuration = Math.ceil(speechDuration + 1.2);
      let adjustedDuration = Math.max(targetDuration, minRequiredDuration);

      // Clamp between 15s and 25s viral marketing video duration rules
      if (adjustedDuration < 15) adjustedDuration = 15;
      if (adjustedDuration > 25) adjustedDuration = 25;

      // Auto-rebalance scene durations with validator
      const rebalanced = autoFixStoryboard(storyboard, adjustedDuration);

      // Attach voiceover metadata & dynamic ducking intervals to audio spec
      if (!rebalanced.audio) {
        rebalanced.audio = {
          musicTrack: "happy-beats-vol-1",
          volume: 0.8,
          duckingMoments: [],
        };
      }

      rebalanced.voiceoverUrl = voResult.url;
      rebalanced.voiceoverScript = narrationScript;
      rebalanced.voiceoverVoice = voice;
      rebalanced.audio.duckingMoments = [
        {
          fromSec: 0.1,
          toSec: Number((speechDuration + 0.4).toFixed(2)),
          volume: 0.25,
        },
      ];

      return rebalanced;
    }
  } catch (err) {
    console.warn("[SmartAudio] Upfront voiceover synthesis skipped or failed:", err.message);
  }

  return storyboard;
}
