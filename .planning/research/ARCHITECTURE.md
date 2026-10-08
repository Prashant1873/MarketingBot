# Architecture Research: Marcutie

## Architecture Overview

```
 ┌─────────────────────────────────────────────────────────┐
 │                   User Browser (GUI)                    │
 │                                                         │
 │  ┌───────────────┐ ┌────────────────┐ ┌──────────────┐  │
 │  │ Prompt/Image  │ │ Scene Editor & │ │ Live Preview │  │
 │  │ Input Panel   │ │ Storyboard     │ │ (Remotion)   │  │
 │  └───────┬───────┘ └───────▲────────┘ └──────▲───────┘  │
 └──────────┼─────────────────┼─────────────────┼──────────┘
            │                 │                 │
            ▼                 │                 │
 ┌─────────────────────────────────────────────────────────┐
 │               Local Server (Node.js/Express)            │
 │                                                         │
 │  ┌───────────────┐ ┌────────────────┐ ┌──────────────┐  │
 │  │ BYOK AI Proxy │ │ Asset Manager  │ │ Local Render │  │
 │  │ (Gemini/OpenAI│ │ (Images/Music/ │ │ Pipeline     │  │
 │  │  /Anthropic)  │ │  SFX library)  │ │ (Remotion)   │  │
 │  └───────────────┘ └────────────────┘ └──────┬───────┘  │
 └──────────────────────────────────────────────┼──────────┘
                                                ▼
                                   ┌───────────────────────┐
                                   │  Output Directory     │
                                   │  - video.mp4          │
                                   │  - poster.jpg         │
                                   │  - share-copy.txt     │
                                   └───────────────────────┘
```

## Component Boundaries

1. **Client UI Layer (`client/`)**:
   - Modern React SPA built with Vite.
   - Design tokens: Dark theme, glass panels, responsive controls.
   - State management: Local React state / Zustand for current project, storyboard scenes, asset selections, and rendering state.
   - Video Player: Embedded `@remotion/player` for live, real-time scrubbing and playback.

2. **Local Backend Layer (`server/`)**:
   - Lightweight Express server running on `localhost:3000` (or proxying Vite dev server).
   - Handles file uploads (`/uploads/`), serves bundled CC0 music and SFX libraries.
   - Proxies BYOK AI requests securely with user's key to Google Gemini / Anthropic / OpenAI.
   - Coordinates Remotion local rendering and FFmpeg poster processing.

3. **Storyboard Engine (`shared/storyboard.ts`)**:
   - Validates JSON schema for video scenes: hook, reveal, highlights, punchline.
   - Enforces marketing rules: duration constraints (15–25s), reading-time floors (minimum frame holds), typography hierarchy, and visual transitions.

4. **Composition & Animation Engine (`composition/`)**:
   - Remotion composition components:
     - `SceneHook`: Kinetic typography, attention-grabbing opening.
     - `SceneProductReveal`: Dynamic camera pan, 3D tilt, or scale on user's image.
     - `SceneFeatureBeats`: Sequential card arrivals, feature pills, stat count-ups.
     - `SceneOutro`: Punchline, brand logo/name, CTA, audio fade.
   - Audio tracks: Multi-track audio for background bed + motion-synced SFX.

5. **Export & Delivery Pipeline**:
   - Local rendering via `@remotion/renderer`.
   - Poster extraction using FFmpeg at the peak settled moment.
   - Frame 0 poster baking (`ffmpeg -filter_complex overlay ... eq(n,0)`).
   - Social copy generation (`share-copy.txt`).

## Suggested Build Order
1. **Phase 1: Project Scaffold & Local Server**: Node/Express + Vite setup, asset serving, local folders.
2. **Phase 2: GUI Foundation & Design System**: Responsive dark-mode interface, prompt/image input, settings modal.
3. **Phase 3: BYOK Multimodal AI Storyboard Engine**: Prompt + image parser using Gemini/OpenAI/Claude into structured JSON.
4. **Phase 4: Remotion Composition & Live Preview**: Animated scene templates, kinetic typography, image motion, and `@remotion/player`.
5. **Phase 5: Audio & Sound FX Pipeline**: Royalty-free music library, sound effects sync, audio ducking.
6. **Phase 6: Local Rendering, Poster Extraction & Social Export**: MP4 rendering, frame-0 poster baking, share copy generator, delivery UI.
