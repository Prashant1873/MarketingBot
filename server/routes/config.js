import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const dataDir = path.join(process.cwd(), "data");
const configFile = path.join(dataDir, "config.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultSettings = {
  apiKeys: {
    gemini: "",
    anthropic: "",
    openai: "",
  },
  preferences: {
    defaultTone: "default",
    defaultFormat: "16:9",
    defaultDuration: 20,
    preferredProvider: "gemini",
  },
};

function readConfig() {
  if (fs.existsSync(configFile)) {
    try {
      const raw = fs.readFileSync(configFile, "utf-8");
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

function writeConfig(data) {
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/", (_req, res) => {
  const current = readConfig();
  const envGemini = process.env.GEMINI_API_KEY || "";
  const envAnthropic = process.env.ANTHROPIC_API_KEY || "";
  const envOpenai = process.env.OPENAI_API_KEY || "";

  const effectiveGemini = current.apiKeys.gemini || envGemini;
  const effectiveAnthropic = current.apiKeys.anthropic || envAnthropic;
  const effectiveOpenai = current.apiKeys.openai || envOpenai;

  const maskedKeys = {
    gemini: effectiveGemini ? "configured" : "",
    anthropic: effectiveAnthropic ? "configured" : "",
    openai: effectiveOpenai ? "configured" : "",
  };

  res.json({
    success: true,
    config: {
      apiKeys: maskedKeys,
      preferences: current.preferences,
      hasKey: {
        gemini: Boolean(effectiveGemini),
        anthropic: Boolean(effectiveAnthropic),
        openai: Boolean(effectiveOpenai),
      },
    },
  });
});

router.post("/", (req, res) => {
  const { apiKeys, preferences } = req.body || {};
  const current = readConfig();

  if (apiKeys) {
    const isRealKey = (val) =>
      typeof val === "string" &&
      val.trim().length > 0 &&
      val.trim() !== "configured" &&
      !val.trim().startsWith("•");

    if (isRealKey(apiKeys.gemini)) {
      current.apiKeys.gemini = apiKeys.gemini.trim();
    }
    if (isRealKey(apiKeys.anthropic)) {
      current.apiKeys.anthropic = apiKeys.anthropic.trim();
    }
    if (isRealKey(apiKeys.openai)) {
      current.apiKeys.openai = apiKeys.openai.trim();
    }
  }

  if (preferences) {
    current.preferences = {
      ...current.preferences,
      ...preferences,
    };
  }

  writeConfig(current);

  const envGemini = process.env.GEMINI_API_KEY || "";
  const envAnthropic = process.env.ANTHROPIC_API_KEY || "";
  const envOpenai = process.env.OPENAI_API_KEY || "";

  const hasGemini = Boolean(current.apiKeys.gemini || envGemini);
  const hasAnthropic = Boolean(current.apiKeys.anthropic || envAnthropic);
  const hasOpenai = Boolean(current.apiKeys.openai || envOpenai);

  res.json({
    success: true,
    message: "Settings saved successfully",
    hasKey: {
      gemini: hasGemini,
      anthropic: hasAnthropic,
      openai: hasOpenai,
    },
    preferences: current.preferences,
  });
});

export default router;
