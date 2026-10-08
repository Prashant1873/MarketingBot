# Roadmap: Marcutie

## Overview

Marcutie is built in 6 phases, moving from the local server scaffold and modern Web GUI to the BYOK multimodal AI engine, Remotion motion graphics composition, audio design layer, and finally local video rendering with frame-0 poster baking and social copy delivery.

## Phases

- [x] **Phase 1: Local Server & Project Scaffold** - Node.js local server, Vite integration, local uploads directory, asset endpoints, and local config.
- [x] **Phase 2: Web GUI & Input Studio** - Premium dark-mode interface, prompt & image inputs, tone/aspect selectors, and BYOK settings modal.
- [x] **Phase 3: BYOK Multimodal AI Storyboard Engine** - Gemini/Claude/OpenAI integrations, prompt & image analysis, structured storyboard JSON generation, and marketing laws validation.
- [x] **Phase 4: Composition Engine & Live Preview** - Remotion animated scene components (Hook, Reveal, Highlights, Outro) and embedded live scrubbing player.
- [x] **Phase 5: Audio & Sound FX Pipeline** - Bundled CC0 music library, motion-matched sound effect triggers, and audio ducking.
- [x] **Phase 6: Local Render, Poster Baking & Social Delivery** - Local MP4 rendering, settled poster frame extraction, frame-0 poster baking, and one-click share copy generation.

## Phase Details

### Phase 1: Local Server & Project Scaffold
**Goal**: Establish the local development environment, Node.js/Express server, local asset directories, and config endpoints.  
**Depends on**: Nothing  
**Requirements**: SRV-01, SRV-02, SRV-03, SRV-04  
**Success Criteria**:
  1. Local server boots cleanly on `localhost` with health check and serves frontend shell.
  2. Image upload endpoint accepts user images, validates format/size, and saves them locally.
  3. Asset endpoint serves bundled royalty-free audio and SFX tracks without external dependencies.
  4. Local config store securely saves BYOK API keys to local disk/storage.
**Plans**: 2 plans

Plans:
- [x] 01-01: Initialize project dependencies (Node, Express, Vite, React, Remotion) and folder architecture.
- [x] 01-02: Implement local server endpoints for static assets, image uploads, and local settings storage.

### Phase 2: Web GUI & Input Studio
**Goal**: Build a high-aesthetic, responsive dark-mode Web GUI for entering marketing prompts, uploading product images, and choosing video parameters.  
**Depends on**: Phase 1  
**Requirements**: GUI-01, GUI-02, GUI-03, GUI-04  
**Success Criteria**:
  1. User can paste long marketing prompts and drag-and-drop product images with instant visual preview.
  2. User can select tone presets (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`) or enter custom creative direction.
  3. User can toggle aspect ratio (16:9, 9:16, 1:1) and target duration (15s, 20s, 25s).
  4. User can enter and test API keys in a clean settings drawer.
**Plans**: 2 plans

Plans:
- [x] 02-01: Build design system tokens, layout shell, header, and BYOK settings panel.
- [x] 02-02: Build prompt input studio, image uploader with preview, and video configuration controls.

### Phase 3: BYOK Multimodal AI Storyboard Engine
**Goal**: Build the multimodal AI parser that takes prompts and images and generates a structured marketing storyboard adhering to viral video laws.  
**Depends on**: Phase 2  
**Requirements**: AI-01, AI-02, AI-03, AI-04  
**Success Criteria**:
  1. Multimodal AI parses prompt text and inspects uploaded product images across Gemini, Claude, or OpenAI.
  2. Output strictly conforms to storyboard JSON schema with scene types, text, duration, and visual cues.
  3. Marketing video laws validator verifies 2–3s hook, settled reading time floors (>=0.8s hold), and 15–25s total duration.
**Plans**: 2 plans

Plans:
- [x] 03-01: Implement multimodal AI provider adapters (Gemini, Claude, OpenAI) with prompt & vision prompts.
- [x] 03-02: Implement storyboard JSON schema generator and marketing laws validation & auto-fix pipeline.

### Phase 4: Composition Engine & Live Preview
**Goal**: Implement Remotion motion graphics scene components and embed real-time timeline player in the Web GUI.  
**Depends on**: Phase 3  
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, GUI-05, GUI-06  
**Success Criteria**:
  1. Remotion composition renders Hook, Reveal, Highlight, and Outro scenes with smooth animations and kinetic typography.
  2. Product image animates dynamically with camera pan, scale, or 3D tilt.
  3. User can preview video in real-time in the Web GUI with play/pause, seek scrub, and timecode.
  4. User can edit scene copy and duration directly in the Storyboard Editor and see instant live updates.
**Plans**: 3 plans

Plans:
- [x] 04-01: Build core Remotion composition architecture and responsive layout containers (16:9, 9:16, 1:1).
- [x] 04-02: Build animated scene templates (Hook, Image Reveal, Highlight Beats, Punchline Outro).
- [x] 04-03: Integrate `@remotion/player` into Web GUI with interactive scene inspector and live scrubbing.

### Phase 5: Audio & Sound FX Pipeline
**Goal**: Integrate royalty-free background music and motion-synchronized sound effects.  
**Depends on**: Phase 4  
**Requirements**: AUD-01, AUD-02, AUD-03  
**Success Criteria**:
  1. Bundled CC0 music tracks can be previewed, selected, and mapped to compositions.
  2. SFX cues trigger on visual entrance events (card reveals, keypresses, impacts).
  3. Background audio ducks appropriately under key visual payoff moments and fades smoothly at outro.
**Plans**: 2 plans

Plans:
- [x] 05-01: Bundle and index curated CC0 music and SFX libraries with category metadata.
- [x] 05-02: Implement Remotion audio timeline mixer syncing music beds and SFX hits to scene keyframes.

### Phase 6: Local Render, Poster Baking & Social Delivery
**Goal**: Implement local MP4 video rendering, frame-0 poster baking, share copy generation, and export UI.  
**Depends on**: Phase 5  
**Requirements**: EXP-01, EXP-02, EXP-03, EXP-04, EXP-05  
**Success Criteria**:
  1. User can trigger local MP4 render and track progress via GUI progress bar.
  2. System extracts high-resolution settled poster frame (`poster.jpg`).
  3. FFmpeg bakes the poster into frame 0 of the MP4 so social platforms display it as the thumbnail.
  4. UI presents rendered video player, download button, and one-click copyable social captions for X, LinkedIn, and Discord.
**Plans**: 2 plans

Plans:
- [x] 06-01: Implement local rendering pipeline with Remotion renderer and FFmpeg frame-0 poster baking.
- [x] 06-02: Implement social share copy generator and final delivery/export panel in Web GUI.

---

### Milestone 2: Synthetic Mockups & Visual Style Transfer

### Phase 7: Dynamic Synthetic App Window & Adaptive Device Engine
**Goal**: Build a procedural UI mockup engine in Remotion with adaptive device framing: intelligently decide whether to render a macOS Chrome window (landscape) or a Mobile Phone frame (portrait) based on prompt context and uploaded photo dimensions, complete with window controls, mobile bezel, and procedural widgets when no image is uploaded.  
**Depends on**: Phase 6  
**Requirements**: MOCKUP-01  
**Success Criteria**:
  1. Adaptive device classifier decides between macOS Chrome (landscape) and Mobile Phone (portrait) based on prompt keyword analysis ("iOS/mobile/iPhone" vs "SaaS/dashboard/desktop") and uploaded image aspect ratio.
  2. Realistic macOS Chrome window component with traffic light controls (🔴🟡🟢), URL pill, desktop sidebar, and procedural SaaS KPI widgets.
  3. Realistic Mobile Phone bezel component with dynamic island / notch, top status bar (9:41), bottom gesture pill, and procedural mobile app UI.
  4. Both uploaded visuals and prompt-only synthetic mockups adapt to the detected device framing inside ProductRevealScene.
  5. Storyboard Inspector allows manual inspection and switching between macOS Chrome and Mobile Phone framing.
**Plans**: 2 plans

Plans:
- [x] 07-01: Build adaptive device classifier, image aspect ratio detector, and storyboard deviceFrame schema integration.
- [x] 07-02: Build Remotion AdaptiveDeviceFrame, SyntheticAppWindow procedural mockup engine, and ProductRevealScene integration.

### Phase 8: Multimodal Visual Style Transfer & Feature Screen Synthesizer
**Goal**: Inspect uploaded screenshots/logos with AI vision to extract palette and design tokens, and dynamically synthesize page screens for whatever feature the prompt describes while inheriting the product's brand design system.  
**Depends on**: Phase 7  
**Requirements**: STYLE-01, FEATURE-01  
**Success Criteria**:
  1. Multimodal AI extracts color palette (primary, secondary, background, dark/light mode) from uploaded images.
  2. Storyboard generator creates a structured `featureMockup` spec for the specific page/feature described in the prompt.
  3. ProductRevealScene dynamically themes the synthesized feature screen using the extracted palette so it appears as an authentic part of the user's product.
**Plans**: 1 plan

Plans:
- [x] 08-01: Implement palette extraction adapter and prompt-driven feature screen synthesizer.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Local Server & Project Scaffold | 2/2 | Complete | 2026-10-08 |
| 2. Web GUI & Input Studio | 2/2 | Complete | 2026-10-08 |
| 3. BYOK Multimodal AI Storyboard Engine | 2/2 | Complete | 2026-10-08 |
| 4. Composition Engine & Live Preview | 3/3 | Complete | 2026-10-08 |
| 5. Audio & Sound FX Pipeline | 2/2 | Complete | 2026-10-08 |
| 6. Local Render, Poster Baking & Social Delivery | 2/2 | Complete | 2026-10-08 |
| 7. Dynamic Synthetic App Window & Adaptive Device Engine | 2/2 | Complete | 2026-10-08 |
| 8. Multimodal Visual Style Transfer & Feature Screen | 1/1 | Complete | 2026-10-08 |

---
*Roadmap updated: 2026-10-08 for Milestone 2 Completion*
