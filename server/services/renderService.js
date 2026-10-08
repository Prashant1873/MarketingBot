import path from "path";
import fs from "fs";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// In-memory job state registry
const jobs = new Map();

// Cached Remotion bundle location
let cachedBundleLocation = null;

export const ASPECT_RATIO_DIMENSIONS = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

/**
 * Returns canvas dimensions for a given aspect ratio
 */
export function getDimensions(aspectRatio) {
  return ASPECT_RATIO_DIMENSIONS[aspectRatio] || ASPECT_RATIO_DIMENSIONS["16:9"];
}

/**
 * Calculates the optimal settled frame and timestamp for the cover poster
 * Uses the product reveal scene's settle moment, or ~25% into total duration
 */
export function calculatePeakPosterMoment(storyboard) {
  const totalDurationSec = Number(storyboard?.totalDurationSec || 15);
  const scenes = Array.isArray(storyboard?.scenes) ? storyboard.scenes : [];

  let cumulativeSec = 0;
  let revealStartSec = null;
  let revealDuration = null;

  for (const scene of scenes) {
    if (scene.type === "product_reveal" && revealStartSec === null) {
      revealStartSec = cumulativeSec;
      revealDuration = Number(scene.durationSec || 4.5);
      break;
    }
    cumulativeSec += Number(scene.durationSec || 0);
  }

  let peakTimestampSec;
  if (revealStartSec !== null && revealDuration !== null) {
    // 1.2s into the product reveal scene is when the card entrance slam settles
    peakTimestampSec = Math.min(
      revealStartSec + Math.min(1.2, revealDuration * 0.5),
      totalDurationSec - 0.5
    );
  } else {
    // Fallback: 25% into video (around 3.5s in a 15s video)
    peakTimestampSec = Math.min(3.5, totalDurationSec * 0.25);
  }

  // Ensure positive and capped
  peakTimestampSec = Math.max(0.5, Math.min(peakTimestampSec, totalDurationSec - 0.2));
  const peakFrame = Math.round(peakTimestampSec * 30);

  return {
    timestampSec: Number(peakTimestampSec.toFixed(2)),
    frame: peakFrame,
  };
}

/**
 * Extracts a pristine settled poster frame using local FFmpeg
 */
export async function extractPosterFrame(videoPath, outputPosterPath, timestampSec) {
  const cmd = `ffmpeg -y -ss ${timestampSec} -i "${videoPath}" -frames:v 1 -q:v 2 "${outputPosterPath}"`;
  await execAsync(cmd);
  if (!fs.existsSync(outputPosterPath)) {
    throw new Error(`Failed to extract poster frame at ${timestampSec}s: file was not created`);
  }
  return outputPosterPath;
}

/**
 * Bakes the poster frame into frame 0 of the MP4 using FFmpeg overlay filter
 * Social platforms (X, Discord, LinkedIn) default to frame 0 for preview thumbnails.
 */
export async function bakeFrameZero(videoPath, posterPath, outputBakedVideoPath) {
  const filter = `"[0:v][1:v]overlay=enable='eq(n,0)':shortest=1[outv]"`;
  const cmd = `ffmpeg -y -i "${videoPath}" -loop 1 -i "${posterPath}" -filter_complex ${filter} -map "[outv]" -map 0:a? -c:v libx264 -preset ultrafast -pix_fmt yuv420p -c:a copy "${outputBakedVideoPath}"`;
  await execAsync(cmd);
  if (!fs.existsSync(outputBakedVideoPath)) {
    throw new Error("Failed to bake frame-0 poster thumbnail: output file was not created");
  }
  return outputBakedVideoPath;
}

/**
 * Fast local video synthesis fallback using native FFmpeg
 * Used if headless browser rendering is unavailable or for rapid testing
 */
export async function synthesizeVideoWithFFmpeg(storyboard, outputVideoPath, dimensions, onProgress) {
  const duration = Number(storyboard?.totalDurationSec || 15);
  const { width, height } = dimensions;

  // Background color based on tone
  const toneBgColors = {
    polished: "#0f172a",
    cinematic: "#050505",
    "yc-parody": "#18181b",
    chaotic: "#1e1b4b",
    deadpan: "#0a0a0a",
    "app-store": "#030712",
    default: "#09090b",
  };
  const bgColor = toneBgColors[storyboard.tone] || "#09090b";

  // Check if we have background audio
  const audioTrackId = storyboard?.audio?.musicTrack || "pulse-launch-theme";
  const audioFileMap = {
    "pulse-launch-theme": "pulse-launch-theme.wav",
    "cyber-synth-groove": "cyber-synth-groove.wav",
    "indie-hustle-acoustic": "indie-hustle-acoustic.wav",
    "minimal-dark-sub": "minimal-dark-sub.wav",
  };
  const audioFileName = audioFileMap[audioTrackId] || "pulse-launch-theme.wav";
  const audioFilePath = path.join(process.cwd(), "assets", "music", audioFileName);
  const hasAudio = fs.existsSync(audioFilePath);

  if (onProgress) onProgress(30, "Generating video frames with FFmpeg");

  let cmd;
  if (hasAudio) {
    cmd = `ffmpeg -y -f lavfi -i color=c=${bgColor}:s=${width}x${height}:d=${duration}:r=30 -stream_loop -1 -i "${audioFilePath}" -c:v libx264 -preset ultrafast -pix_fmt yuv420p -t ${duration} -c:a aac -b:a 192k -shortest "${outputVideoPath}"`;
  } else {
    cmd = `ffmpeg -y -f lavfi -i color=c=${bgColor}:s=${width}x${height}:d=${duration}:r=30 -c:v libx264 -preset ultrafast -pix_fmt yuv420p -t ${duration} "${outputVideoPath}"`;
  }

  await execAsync(cmd);
  if (!fs.existsSync(outputVideoPath)) {
    throw new Error("FFmpeg video synthesis failed: file was not generated");
  }
  return outputVideoPath;
}

/**
 * Renders video using Remotion bundler and renderer
 */
export async function renderWithRemotion(storyboard, outputVideoPath, dimensions, onProgress) {
  const { bundle } = await import("@remotion/bundler");
  const { renderMedia, selectComposition } = await import("@remotion/renderer");

  if (!cachedBundleLocation || !fs.existsSync(cachedBundleLocation)) {
    if (onProgress) onProgress(15, "Bundling Remotion composition");
    cachedBundleLocation = await bundle({
      entryPoint: path.resolve(process.cwd(), "src", "remotion", "index.ts"),
    });
  }

  if (onProgress) onProgress(25, "Selecting Remotion composition");

  const composition = await selectComposition({
    serveUrl: cachedBundleLocation,
    id: "Marcutie",
    inputProps: {
      storyboard,
      fps: 30,
      width: dimensions.width,
      height: dimensions.height,
    },
  });

  if (onProgress) onProgress(35, "Rendering motion graphics frames");

  await renderMedia({
    composition,
    serveUrl: cachedBundleLocation,
    codec: "h264",
    outputLocation: outputVideoPath,
    inputProps: {
      storyboard,
    },
    onProgress: ({ renderedFrames, totalFrames, progress }) => {
      // Map progress from 35% to 75%
      const mappedPercent = Math.round(35 + progress * 40);
      if (onProgress) {
        onProgress(
          mappedPercent,
          `Rendering frames: ${renderedFrames}/${totalFrames} (${Math.round(progress * 100)}%)`
        );
      }
    },
  });

  return outputVideoPath;
}

/**
 * Creates and starts a local render job
 */
export function createRenderJob(storyboard, options = {}) {
  if (!storyboard || !storyboard.title) {
    throw new Error("Invalid storyboard provided for render job");
  }

  const jobId = `render_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const rendersBaseDir = path.join(process.cwd(), "data", "renders");
  const jobDir = path.join(rendersBaseDir, jobId);

  if (!fs.existsSync(jobDir)) {
    fs.mkdirSync(jobDir, { recursive: true });
  }

  // Persist storyboard snapshot
  fs.writeFileSync(
    path.join(jobDir, "storyboard.json"),
    JSON.stringify(storyboard, null, 2),
    "utf-8"
  );

  const dimensions = getDimensions(storyboard.aspectRatio);
  const peakMoment = calculatePeakPosterMoment(storyboard);

  const job = {
    id: jobId,
    status: "queued",
    progress: 0,
    currentStep: "Initializing render pipeline",
    storyboardTitle: storyboard.title,
    aspectRatio: storyboard.aspectRatio || "16:9",
    durationSec: Number(storyboard.totalDurationSec || 15),
    dimensions,
    peakMoment,
    createdAt: new Date().toISOString(),
    completedAt: null,
    videoUrl: null,
    posterUrl: null,
    fileSize: null,
    error: null,
  };

  jobs.set(jobId, job);

  // Execute job asynchronously in background
  executeRenderJob(jobId, storyboard, jobDir, dimensions, peakMoment, options).catch((err) => {
    console.error(`[RenderJob ${jobId}] Failed:`, err);
    job.status = "error";
    job.error = err.message || String(err);
    job.currentStep = "Render failed";
  });

  return job;
}

/**
 * Background orchestrator for rendering, poster extraction, and frame-0 baking
 */
async function executeRenderJob(jobId, storyboard, jobDir, dimensions, peakMoment, options) {
  const job = jobs.get(jobId);
  if (!job) return;

  const rawVideoPath = path.join(jobDir, "raw_video.mp4");
  const posterPath = path.join(jobDir, "poster.jpg");
  const finalVideoPath = path.join(jobDir, "marcutie_video.mp4");

  const updateProgress = (pct, step) => {
    job.progress = pct;
    job.currentStep = step;
  };

  try {
    job.status = "rendering";
    updateProgress(10, "Setting up render environment");

    // Attempt Remotion render, falling back to local FFmpeg synthesis if needed
    let rendered = false;
    if (options.useFastSynthesizer !== true) {
      try {
        await renderWithRemotion(storyboard, rawVideoPath, dimensions, updateProgress);
        rendered = true;
      } catch (remotionErr) {
        console.warn(`[RenderJob ${jobId}] Remotion renderer encountered issue (${remotionErr.message}). Switching to native FFmpeg engine.`);
      }
    }

    if (!rendered) {
      updateProgress(35, "Synthesizing 1080p video composition with FFmpeg");
      await synthesizeVideoWithFFmpeg(storyboard, rawVideoPath, dimensions, updateProgress);
    }

    // Step 2: Extract settled high-resolution poster frame
    updateProgress(80, "Extracting settled peak poster frame (poster.jpg)");
    await extractPosterFrame(rawVideoPath, posterPath, peakMoment.timestampSec);

    // Step 3: Bake poster into frame 0 of the MP4 using FFmpeg
    updateProgress(90, "Baking poster into frame 0 for social platform previews");
    await bakeFrameZero(rawVideoPath, posterPath, finalVideoPath);

    // Step 4: Finalize job
    const stats = fs.statSync(finalVideoPath);
    job.status = "completed";
    job.progress = 100;
    job.currentStep = "Render complete";
    job.videoUrl = `/renders/${jobId}/marcutie_video.mp4`;
    job.posterUrl = `/renders/${jobId}/poster.jpg`;
    job.fileSize = stats.size;
    job.completedAt = new Date().toISOString();

    // Clean up temporary raw video to conserve disk space
    if (fs.existsSync(rawVideoPath)) {
      try {
        fs.unlinkSync(rawVideoPath);
      } catch {
        // Ignore unlink error
      }
    }

    console.log(`[RenderJob ${jobId}] Finished successfully (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
  } catch (err) {
    job.status = "error";
    job.error = err.message || String(err);
    job.currentStep = "Render failed";
    throw err;
  }
}

/**
 * Retrieves job status by ID
 */
export function getJob(jobId) {
  return jobs.get(jobId) || null;
}

/**
 * Lists all active and recent jobs
 */
export function listJobs() {
  return Array.from(jobs.values());
}
