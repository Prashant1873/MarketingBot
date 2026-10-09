import express from "express";
import path from "path";
import fs from "fs";

import { generateWithGemini } from "../ai/providers/gemini.js";
import { generateWithAnthropic } from "../ai/providers/anthropic.js";
import { generateWithOpenAI } from "../ai/providers/openai.js";
import { generateMockStoryboard } from "../ai/providers/mock.js";
import { autoFixStoryboard } from "../ai/validator.js";
import { extractPaletteFromBuffer } from "../services/paletteExtractor.js";
import {
  decideOptimalMusicTrack,
  synthesizeAndSyncVoiceover,
} from "../services/smartAudioPipeline.js";

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

router.post("/", async (req, res) => {
  const {
    prompt,
    imageUrl,
    imageDimensions,
    screenMode,
    deviceFrame,
    themePalette,
    featureMockup,
    voiceConfig,
    audioConfig,
    subtitlesConfig,
    visualTheme,
    tone = "default",
    customTone = "",
    aspectRatio = "16:9",
    duration = 20,
    provider: requestedProvider,
  } = req.body || {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ success: false, error: "Prompt is required." });
  }

  const config = readConfig();
  const apiKeys = {
    gemini: req.body?.apiKeys?.gemini || config.apiKeys?.gemini || process.env.GEMINI_API_KEY || "",
    anthropic: req.body?.apiKeys?.anthropic || config.apiKeys?.anthropic || process.env.ANTHROPIC_API_KEY || "",
    openai: req.body?.apiKeys?.openai || config.apiKeys?.openai || process.env.OPENAI_API_KEY || "",
  };
  const provider =
    requestedProvider || config.preferences?.preferredProvider || "gemini";

  // Check if image is provided, load base64 buffer from disk and extract palette
  let imageBase64 = null;
  let imageMimeType = "image/png";
  let extractedPalette = null;

  if (imageUrl) {
    const filename = path.basename(imageUrl);
    const localImagePath = path.join(process.cwd(), "data", "uploads", filename);

    if (fs.existsSync(localImagePath)) {
      try {
        const fileBuffer = fs.readFileSync(localImagePath);
        imageBase64 = fileBuffer.toString("base64");
        const ext = path.extname(filename).toLowerCase();
        if (ext === ".jpg" || ext === ".jpeg") imageMimeType = "image/jpeg";
        else if (ext === ".webp") imageMimeType = "image/webp";
        else if (ext === ".gif") imageMimeType = "image/gif";

        extractedPalette = extractPaletteFromBuffer(fileBuffer, tone);
      } catch (err) {
        console.warn("[Storyboard] Could not read uploaded image:", err);
      }
    }
  }

  const resolvedThemePalette = themePalette || extractedPalette || null;

  const genParams = {
    prompt: prompt.trim(),
    tone,
    customTone: customTone.trim(),
    aspectRatio,
    targetDuration: Number(duration) || 20,
    imageBase64,
    imageMimeType,
    hasImage: Boolean(imageBase64),
    imageDimensions: imageDimensions || null,
    deviceFrame: deviceFrame || null,
    themePalette: resolvedThemePalette,
    featureMockup: featureMockup || null,
  };

  let rawStoryboard = null;
  let providerUsed = provider;
  let isMock = false;

  try {
    if (provider === "gemini" && apiKeys.gemini) {
      rawStoryboard = await generateWithGemini(genParams, apiKeys.gemini);
    } else if (provider === "anthropic" && apiKeys.anthropic) {
      rawStoryboard = await generateWithAnthropic(genParams, apiKeys.anthropic);
    } else if (provider === "openai" && apiKeys.openai) {
      rawStoryboard = await generateWithOpenAI(genParams, apiKeys.openai);
    } else {
      // Fallback to mock generator if no key configured
      isMock = true;
      providerUsed = "mock";
      rawStoryboard = await generateMockStoryboard(genParams);
    }
  } catch (err) {
    console.warn(`[Storyboard] ${provider} call failed (${err.message}). Falling back to mock generator.`);
    isMock = true;
    providerUsed = "mock_fallback";
    rawStoryboard = await generateMockStoryboard(genParams);
  }

  // Pass through marketing laws validator and auto-fixer
  try {
    const validatedStoryboard = autoFixStoryboard(rawStoryboard, Number(duration) || 20);
    // Ensure project-level properties carry over
    validatedStoryboard.aspectRatio = aspectRatio;
    validatedStoryboard.targetDuration = Number(duration) || 20;
    validatedStoryboard.screenMode = screenMode || "mockup";
    if (imageUrl) validatedStoryboard.imageUrl = imageUrl;
    if (imageDimensions) validatedStoryboard.imageDimensions = imageDimensions;
    if (deviceFrame) validatedStoryboard.deviceFrame = deviceFrame;
    if (resolvedThemePalette && !validatedStoryboard.themePalette) {
      validatedStoryboard.themePalette = resolvedThemePalette;
    }
    if (visualTheme) {
      validatedStoryboard.visualTheme = visualTheme;
      if (validatedStoryboard.themePalette) {
        validatedStoryboard.themePalette.visualTheme = visualTheme;
      }
    }
    if (featureMockup && !validatedStoryboard.featureMockup) {
      validatedStoryboard.featureMockup = featureMockup;
    }

    validatedStoryboard.scenes = (validatedStoryboard.scenes || []).map((s) =>
      s.type === "product_reveal"
        ? { ...s, screenMode: screenMode || "mockup" }
        : s
    );

    // Auto-decide optimal upbeat music track
    const chosenMusicTrack = decideOptimalMusicTrack(
      prompt,
      tone,
      audioConfig?.selectedMusicTrack || "auto"
    );

    if (!validatedStoryboard.audioDirection) {
      validatedStoryboard.audioDirection = {
        musicMood: "Upbeat Energy",
        trackRecommendation: chosenMusicTrack,
        sfxCues: [],
      };
    } else {
      validatedStoryboard.audioDirection.trackRecommendation = chosenMusicTrack;
    }

    if (!validatedStoryboard.audio) {
      validatedStoryboard.audio = {
        musicTrack: chosenMusicTrack,
        volume: typeof audioConfig?.musicVolume === "number" ? audioConfig.musicVolume : 0.8,
        duckingMoments: [],
      };
    } else {
      validatedStoryboard.audio.musicTrack = chosenMusicTrack;
    }

    // Upfront Voiceover Synthesis & Scene Duration Auto-Sync
    const finalStoryboard = await synthesizeAndSyncVoiceover(
      validatedStoryboard,
      voiceConfig || { enabled: true, voiceId: "auto" },
      Number(duration) || 20
    );

    finalStoryboard.subtitlesConfig = subtitlesConfig || {
      enabled: true,
      style: "karaoke-bounce",
      position: "bottom",
    };

    res.json({
      success: true,
      storyboard: finalStoryboard,
      providerUsed,
      isMock,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Validation error: ${err.message}`,
    });
  }
});

export default router;
