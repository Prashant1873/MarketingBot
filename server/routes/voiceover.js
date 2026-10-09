import express from "express";
import path from "path";
import fs from "fs";
import {
  KOKORO_VOICES,
  generateKokoroVoiceover,
  generateOpenAIVoiceover,
} from "../services/voiceoverService.js";

const router = express.Router();
const configFile = path.join(process.cwd(), "data", "config.json");

function readConfig() {
  if (fs.existsSync(configFile)) {
    try {
      return JSON.parse(fs.readFileSync(configFile, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

// GET /api/voiceover/voices — List available voices
router.get("/voices", (req, res) => {
  res.json({
    success: true,
    voices: KOKORO_VOICES,
  });
});

// POST /api/generate-voiceover — Generate audio from narration script
router.post("/", async (req, res) => {
  const { script, voice = "af_heart" } = req.body || {};

  if (!script || typeof script !== "string" || !script.trim()) {
    return res.status(400).json({
      success: false,
      error: "Narration script is required for voiceover generation.",
    });
  }

  const config = readConfig();
  const apiKeys = config.apiKeys || {};

  try {
    // 1. Primary: 100% offline Kokoro-82M TTS
    const result = await generateKokoroVoiceover(script, voice);
    return res.json({
      success: true,
      voiceoverUrl: result.url,
      durationSec: result.durationSec,
      voice: result.voice,
      provider: "kokoro-local",
    });
  } catch (kokoroErr) {
    console.warn("[Voiceover] Local Kokoro TTS failed:", kokoroErr.message);

    // 2. Fallback: OpenAI TTS if key available
    if (apiKeys.openai) {
      try {
        const result = await generateOpenAIVoiceover(script, apiKeys.openai, "alloy");
        return res.json({
          success: true,
          voiceoverUrl: result.url,
          durationSec: result.durationSec,
          voice: result.voice,
          provider: "openai-cloud",
        });
      } catch (cloudErr) {
        console.warn("[Voiceover] OpenAI cloud fallback failed:", cloudErr.message);
      }
    }

    return res.status(500).json({
      success: false,
      error: `Voiceover generation failed: ${kokoroErr.message}`,
    });
  }
});

export default router;
