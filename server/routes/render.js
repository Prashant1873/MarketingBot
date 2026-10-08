import express from "express";
import path from "path";
import fs from "fs";
import { createRenderJob, getJob, listJobs } from "../services/renderService.js";

const router = express.Router();

/**
 * POST /api/render
 * Initiates a new local rendering job
 */
router.post("/", (req, res) => {
  try {
    const { storyboard, options } = req.body || {};

    if (!storyboard || !storyboard.title) {
      return res.status(400).json({
        success: false,
        error: "A valid storyboard with a title and scenes is required to render",
      });
    }

    const job = createRenderJob(storyboard, options || {});

    res.status(202).json({
      success: true,
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      message: "Render job successfully queued",
    });
  } catch (err) {
    console.error("[RenderRoute] Failed to create job:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to start render job",
    });
  }
});

/**
 * GET /api/render/:jobId/status
 * Returns current status, progress percentage, and output URLs
 */
router.get("/:jobId/status", (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Render job '${jobId}' not found`,
    });
  }

  res.json({
    success: true,
    job,
  });
});

/**
 * GET /api/render/:jobId/download
 * Triggers direct download of the final baked MP4 video
 */
router.get("/:jobId/download", (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);

  const videoPath = path.join(process.cwd(), "data", "renders", jobId, "marcutie_video.mp4");

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({
      success: false,
      error: "Rendered video file is not available for download",
    });
  }

  const cleanTitle = (job?.storyboardTitle || "video")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 30);

  const filename = `marcutie_${cleanTitle}.mp4`;
  res.download(videoPath, filename);
});

/**
 * GET /api/render/:jobId/poster
 * Triggers direct download of the high-res settled poster.jpg
 */
router.get("/:jobId/poster", (req, res) => {
  const { jobId } = req.params;
  const posterPath = path.join(process.cwd(), "data", "renders", jobId, "poster.jpg");

  if (!fs.existsSync(posterPath)) {
    return res.status(404).json({
      success: false,
      error: "Poster frame is not available for download",
    });
  }

  res.download(posterPath, "marcutie_poster.jpg");
});

/**
 * GET /api/render/jobs
 * Lists all active and recent render jobs
 */
router.get("/jobs", (_req, res) => {
  res.json({
    success: true,
    jobs: listJobs(),
  });
});

export default router;
