---
phase: 05-audio-sound-fx-pipeline
plan: 02
subsystem: audio-mixer-timeline
requirements:
  - AUD-03
status: completed
completed_at: 2026-10-08
---

# Plan 05-02 Summary: Remotion Audio Timeline Mixer with SFX Synchronization & Ducking

## Overview
Built the Remotion audio timeline mixer (`MarcutieAudioMixer`), orchestrating background music playback with dynamic volume curves (smooth fade-in across frames 0–15, ducking during title slams, and fade-out over the final 30 frames) alongside motion-synchronized SFX event hits across all 4 marketing video scenes. Integrated the audio controls into `VideoPlayerPreview` and `App.tsx` for real-time live preview playback.

## Delivered Artifacts
- `src/remotion/audio/MarcutieAudioMixer.tsx`: Remotion audio component managing `<Audio>` music playback and sequenced `<Sequence>` SFX cues:
  - Opening Hook: `heavy_slam` entrance impact at frame 3.
  - Product Reveal: `whoosh` camera push at frame 0 and `pop` element reveal at frame 4.
  - Highlight Beats: Sequential `pop` hits on each feature card arrival (`8 + idx * 8`).
  - Punchline Outro: `heavy_slam` payoff slam and `click` CTA button arrival.
- `src/remotion/MarcutieComposition.tsx`: Embedded `MarcutieAudioMixer` into the root Remotion composition with dynamic music track resolution and volume parameters.
- `src/components/VideoPlayerPreview.tsx`: Added expandable `AudioControls` drawer and connected audio props to the live `@remotion/player`.
- `src/App.tsx`: Maintained global `audioConfig` state with automatic track selection based on storyboard tone recommendations.

## Verification
- `node --test tests/audio.test.js`: 3/3 passing audio tests.
- `npm test`: 19/19 passing tests across server, storyboard, composition, and audio suites.
- `npm run build`: Zero errors; Vite production bundle built cleanly.
