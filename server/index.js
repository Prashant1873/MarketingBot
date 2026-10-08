import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import uploadRouter from "./routes/upload.js";
import assetsRouter from "./routes/assets.js";
import configRouter from "./routes/config.js";
import storyboardRouter from "./routes/storyboard.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure directories exist
const uploadDir = path.join(process.cwd(), "data", "uploads");
const outputDir = path.join(process.cwd(), "data", "outputs");
const assetsDir = path.join(process.cwd(), "assets");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static asset delivery
app.use("/uploads", express.static(uploadDir));
app.use("/assets", express.static(assetsDir));

// System health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Marcutie",
    version: "1.0.0",
    time: new Date().toISOString(),
  });
});

// Feature routes
app.use("/api/upload", uploadRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/config", configRouter);
app.use("/api/generate-storyboard", storyboardRouter);

import { fileURLToPath } from "url";

// Start server only if executed directly
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  app.listen(PORT, () => {
    console.log(`[Marcutie] Server running on http://localhost:${PORT}`);
  });
}

export default app;
