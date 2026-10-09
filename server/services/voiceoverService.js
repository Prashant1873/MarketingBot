import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const KOKORO_VOICES = [
  { id: "af_heart", name: "Heart (Warm & Conversational)", gender: "female", accent: "American" },
  { id: "af_nova", name: "Nova (High Energy & Upbeat)", gender: "female", accent: "American" },
  { id: "af_sky", name: "Sky (Crisp & Articulate)", gender: "female", accent: "American" },
  { id: "am_adam", name: "Adam (Confident Founder)", gender: "male", accent: "American" },
  { id: "am_michael", name: "Michael (Deep & Cinematic)", gender: "male", accent: "American" },
  { id: "bf_emma", name: "Emma (Polished British)", gender: "female", accent: "British" },
  { id: "bm_george", name: "George (Sophisticated Storyteller)", gender: "male", accent: "British" },
];

/**
 * Calculates audio duration in seconds from standard 16-bit WAV header or file size
 */
export function estimateWavDuration(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(44);
    fs.readSync(fd, buffer, 0, 44, 0);
    fs.closeSync(fd);

    const sampleRate = buffer.readUInt32LE(24) || 24000;
    const channels = buffer.readUInt16LE(22) || 1;
    const bitsPerSample = buffer.readUInt16LE(34) || 16;
    const byteRate = (sampleRate * channels * bitsPerSample) / 8;

    const dataSize = stats.size - 44;
    return Number((dataSize / byteRate).toFixed(2));
  } catch {
    return 5.0;
  }
}

/**
 * Generates speech audio using local Kokoro-82M TTS via hyperframes CLI
 * @param {string} text
 * @param {string} voice
 * @returns {Promise<{ filename: string, url: string, durationSec: number, voice: string }>}
 */
export async function generateKokoroVoiceover(text, voice = "af_heart") {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Narration text is required for voiceover generation.");
  }

  const cleanText = text.trim().replace(/["\r\n]+/g, " ");
  const cleanVoice = voice || "af_heart";

  const voiceoverDir = path.join(process.cwd(), "data", "uploads", "voiceovers");
  if (!fs.existsSync(voiceoverDir)) {
    fs.mkdirSync(voiceoverDir, { recursive: true });
  }

  const filename = `vo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.wav`;
  const outputPath = path.join(voiceoverDir, filename);

  // Execute Kokoro via hyperframes tts CLI
  const command = `npx --yes hyperframes tts "${cleanText.replace(/"/g, '\\"')}" --voice ${cleanVoice} --output "${outputPath}"`;

  try {
    await execAsync(command);
  } catch (err) {
    console.warn("[Voiceover] Local Kokoro CLI run failed:", err.message);
    throw new Error(`Kokoro TTS generation failed: ${err.message}`);
  }

  if (!fs.existsSync(outputPath)) {
    throw new Error("Kokoro TTS audio file was not generated.");
  }

  const durationSec = estimateWavDuration(outputPath);
  const url = `/uploads/voiceovers/${filename}`;

  return {
    filename,
    url,
    durationSec,
    voice: cleanVoice,
  };
}

/**
 * Cloud fallback: Generates speech audio using OpenAI TTS API if key provided
 */
export async function generateOpenAIVoiceover(text, apiKey, voice = "alloy") {
  if (!apiKey) throw new Error("OpenAI API key missing.");

  const voiceoverDir = path.join(process.cwd(), "data", "uploads", "voiceovers");
  if (!fs.existsSync(voiceoverDir)) {
    fs.mkdirSync(voiceoverDir, { recursive: true });
  }

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text.trim(),
      voice: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"].includes(voice) ? voice : "alloy",
      response_format: "wav",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI TTS error (${res.status}): ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const filename = `vo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.wav`;
  const outputPath = path.join(voiceoverDir, filename);

  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
  const durationSec = estimateWavDuration(outputPath);
  const url = `/uploads/voiceovers/${filename}`;

  return {
    filename,
    url,
    durationSec,
    voice,
  };
}
