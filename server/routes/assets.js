import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const musicDir = path.join(process.cwd(), "assets", "music");
const sfxDir = path.join(process.cwd(), "assets", "sfx");

router.get("/audio", (_req, res) => {
  const music = [];
  const sfx = [];

  if (fs.existsSync(musicDir)) {
    const files = fs.readdirSync(musicDir);
    for (const file of files) {
      if (/\.(mp3|wav|ogg|m4a)$/i.test(file)) {
        const name = path.parse(file).name.replace(/[-_]/g, " ");
        music.push({
          id: path.parse(file).name,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          filename: file,
          url: `/assets/music/${file}`,
        });
      }
    }
  }

  if (fs.existsSync(sfxDir)) {
    const scanSfx = (dir, category = "general") => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          scanSfx(path.join(dir, item.name), item.name);
        } else if (/\.(mp3|wav|ogg)$/i.test(item.name)) {
          const relativePath = path
            .relative(sfxDir, path.join(dir, item.name))
            .replace(/\\/g, "/");
          const name = path.parse(item.name).name.replace(/[-_]/g, " ");
          sfx.push({
            id: path.parse(item.name).name,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            filename: item.name,
            category,
            url: `/assets/sfx/${relativePath}`,
          });
        }
      }
    };
    scanSfx(sfxDir);
  }

  res.json({
    success: true,
    music,
    sfx,
  });
});

export default router;
