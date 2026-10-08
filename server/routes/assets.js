import express from "express";
import path from "path";
import fs from "fs";
import { musicTracks, sfxLibrary, getRecommendedTrack } from "../data/audioCatalog.js";

const router = express.Router();

const musicDir = path.join(process.cwd(), "assets", "music");
const sfxDir = path.join(process.cwd(), "assets", "sfx");

router.get("/audio", (req, res) => {
  const tone = req.query.tone || "default";

  // Merge catalog metadata with filesystem presence
  const music = musicTracks.map((track) => {
    const exists = fs.existsSync(path.join(musicDir, track.filename));
    return {
      ...track,
      available: exists,
    };
  });

  const sfx = sfxLibrary.map((item) => {
    const exists = fs.existsSync(path.join(sfxDir, item.category, item.filename));
    return {
      ...item,
      available: exists,
    };
  });

  const recommendedTrack = getRecommendedTrack(tone);

  res.json({
    success: true,
    music,
    sfx,
    recommendedTrack,
  });
});

export default router;
