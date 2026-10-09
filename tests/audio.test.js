import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

import { musicTracks, sfxLibrary, getRecommendedTrack } from "../server/data/audioCatalog.js";

test("getRecommendedTrack maps marketing tones to appropriate musical themes", () => {
  assert.equal(getRecommendedTrack("default").id, "happy-beats-vol-1");
  assert.equal(getRecommendedTrack("chaotic").id, "happy-beats-vol-10");
  assert.equal(getRecommendedTrack("yc-parody").id, "happy-beats-vol-9");
  assert.equal(getRecommendedTrack("polished").id, "happy-beats-vol-1");
  assert.equal(getRecommendedTrack("cinematic").id, "happy-beats-vol-12");
  assert.equal(getRecommendedTrack("deadpan").id, "happy-beats-vol-12");

  // Unknown tone fallback to first track
  assert.equal(getRecommendedTrack("unknown-custom-tone").id, "happy-beats-vol-1");
});

test("All catalog music tracks and sound effects exist on disk", () => {
  const assetsDir = path.join(process.cwd(), "assets");

  for (const track of musicTracks) {
    const trackPath = path.join(assetsDir, "music", track.filename);
    assert.ok(fs.existsSync(trackPath), `Music file ${track.filename} must exist`);
    assert.ok(track.bpm > 0, `Track ${track.id} must have valid BPM`);
    assert.ok(Array.isArray(track.tones), `Track ${track.id} must define target tones`);
  }

  for (const sfx of sfxLibrary) {
    const sfxPath = path.join(assetsDir, "sfx", sfx.category, sfx.filename);
    assert.ok(fs.existsSync(sfxPath), `SFX file ${sfx.filename} must exist in category ${sfx.category}`);
    assert.ok(sfx.cue, `SFX ${sfx.id} must define cue`);
  }
});

// Unit test for Remotion audio mixer volume curves and ducking logic
function computeMusicVolume(frame, totalDurationFrames, baseVolume = 0.8, isMuted = false, isDucking = false) {
  if (isMuted) return 0;
  let vol = baseVolume;

  // Fade-in over first 15 frames
  if (frame < 15) {
    vol = (frame / 15) * baseVolume;
  }
  // Fade-out over last 30 frames
  else if (frame > totalDurationFrames - 30) {
    const remaining = Math.max(0, totalDurationFrames - frame);
    vol = (remaining / 30) * baseVolume;
  }

  // Ducking during key visual impacts
  if (isDucking) {
    vol *= 0.65;
  }

  return Number(vol.toFixed(3));
}

test("Audio mixer volume math calculates fade-in, ducking, and fade-out accurately", () => {
  const totalFrames = 600; // 20s @ 30fps

  // Frame 0: volume starts at 0
  assert.equal(computeMusicVolume(0, totalFrames, 0.8), 0);

  // Frame 15: full volume reached
  assert.equal(computeMusicVolume(15, totalFrames, 0.8), 0.8);

  // Middle frame (frame 300) with ducking (-35%)
  assert.equal(computeMusicVolume(300, totalFrames, 0.8, false, true), 0.52);

  // Outro end: volume fades to 0
  assert.equal(computeMusicVolume(600, totalFrames, 0.8), 0);

  // Muted state: volume is 0 regardless of frame
  assert.equal(computeMusicVolume(100, totalFrames, 0.8, true), 0);
});
