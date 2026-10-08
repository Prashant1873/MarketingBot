import fs from "fs";
import path from "path";

// Function to generate a valid PCM WAV buffer
function createWavBuffer(durationSec = 0.5, freq = 440, sampleRate = 44100) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = 2; // 16-bit mono = 2 bytes
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // PCM = 1
  buffer.writeUInt16LE(1, 22); // Mono = 1
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write sine wave samples with gentle envelope decay
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-t * 4); // exponential decay
    const sample = Math.sin(2 * Math.PI * freq * t) * decay * 0.5;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const assetsBase = path.join(process.cwd(), "assets");
const musicDir = path.join(assetsBase, "music");
const sfxUiDir = path.join(assetsBase, "sfx", "ui");
const sfxImpactDir = path.join(assetsBase, "sfx", "impact");
const sfxInterfaceDir = path.join(assetsBase, "sfx", "interface");

fs.mkdirSync(musicDir, { recursive: true });
fs.mkdirSync(sfxUiDir, { recursive: true });
fs.mkdirSync(sfxImpactDir, { recursive: true });
fs.mkdirSync(sfxInterfaceDir, { recursive: true });

// Generate sample music beds (longer gentle chords)
fs.writeFileSync(path.join(musicDir, "pulse-launch-theme.wav"), createWavBuffer(2.0, 220));
fs.writeFileSync(path.join(musicDir, "cyber-synth-groove.wav"), createWavBuffer(2.0, 330));

// Generate sample SFX (short clicks, impacts, pops)
fs.writeFileSync(path.join(sfxUiDir, "click.wav"), createWavBuffer(0.08, 1200));
fs.writeFileSync(path.join(sfxUiDir, "pop.wav"), createWavBuffer(0.12, 800));
fs.writeFileSync(path.join(sfxImpactDir, "heavy_slam.wav"), createWavBuffer(0.6, 110));
fs.writeFileSync(path.join(sfxInterfaceDir, "whoosh.wav"), createWavBuffer(0.3, 500));

console.log("[Sample Assets] Generated 2 music beds and 4 sound effects successfully.");
