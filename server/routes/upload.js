import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { extractPaletteFromBuffer } from "../services/paletteExtractor.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "data", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.");
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
});

function getImageDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (!buffer || buffer.length < 24) return null;

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, aspectRatio: Number((width / height).toFixed(3)) };
    }

    // GIF: GIF87a / GIF89a
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height, aspectRatio: Number((width / height).toFixed(3)) };
    }

    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height, aspectRatio: Number((width / height).toFixed(3)) };
        }
        if (marker === 0xd9 || marker === 0xda) break;
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }

    // WEBP: RIFF ... WEBP
    if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
      const type = buffer.toString("ascii", 12, 16);
      if (type === "VP8 ") {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        return { width, height, aspectRatio: Number((width / height).toFixed(3)) };
      } else if (type === "VP8L") {
        const b1 = buffer[21];
        const b2 = buffer[22];
        const b3 = buffer[23];
        const b4 = buffer[24];
        const width = 1 + (((b2 & 0x3f) << 8) | b1);
        const height = 1 + (((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
        return { width, height, aspectRatio: Number((width / height).toFixed(3)) };
      } else if (type === "VP8X") {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height, aspectRatio: Number((width / height).toFixed(3)) };
      }
    }
  } catch {
    // Graceful fallback if dimension parsing fails
  }
  return null;
}

router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided." });
    }

    const dimensions = getImageDimensions(req.file.path);
    let palette = null;
    try {
      const buffer = fs.readFileSync(req.file.path);
      palette = extractPaletteFromBuffer(buffer);
    } catch {
      // Graceful fallback
    }

    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      dimensions,
      palette,
    });
  });
});

export default router;
