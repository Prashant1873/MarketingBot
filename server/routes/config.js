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
  // Return masked keys or status to avoid exposing raw keys in plain logs
  const maskedKeys = {
    gemini: current.apiKeys.gemini ? "configured" : "",
    anthropic: current.apiKeys.anthropic ? "configured" : "",
    openai: current.apiKeys.openai ? "configured" : "",
  };

  res.json({
    success: true,
    config: {
      apiKeys: maskedKeys,
      preferences: current.preferences,
      hasKey: {
        gemini: Boolean(current.apiKeys.gemini),
        anthropic: Boolean(current.apiKeys.anthropic),
        openai: Boolean(current.apiKeys.openai),
      },
    },
  });
});

router.post("/", (req, res) => {
  const { apiKeys, preferences } = req.body || {};
  const current = readConfig();

  if (apiKeys) {
    if (typeof apiKeys.gemini === "string") current.apiKeys.gemini = apiKeys.gemini.trim();
    if (typeof apiKeys.anthropic === "string") current.apiKeys.anthropic = apiKeys.anthropic.trim();
    if (typeof apiKeys.openai === "string") current.apiKeys.openai = apiKeys.openai.trim();
  }

  if (preferences) {
    current.preferences = {
      ...current.preferences,
      ...preferences,
    };
  }

  writeConfig(current);

  res.json({
    success: true,
    message: "Settings saved successfully",
    hasKey: {
      gemini: Boolean(current.apiKeys.gemini),
      anthropic: Boolean(current.apiKeys.anthropic),
      openai: Boolean(current.apiKeys.openai),
    },
    preferences: current.preferences,
  });
});

export default router;
