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

### Milestone 3: Dynamic HTML/CSS Engine, Brand Theming & Voiceover Audio Pipeline

### Phase 9: Dynamic Brand Theming & Ambient Video Scene Styling
**Goal**: Overhaul the video background and ambient lighting to eliminate hardcoded navy blue (`#070a13`), dynamically derive brand-tinted mesh gradients from extracted company palettes, propagate brand tokens across all scenes (Hook, ProductReveal, Highlight, Outro), and add interactive Brand Palette color pickers in the UI.
**Depends on**: Phase 8  
**Requirements**: STYLE-02  
**Success Criteria**:
  1. Palette extractor derives deep brand-tinted background colors (`#...`) rather than static `#080c16` navy blue.
  2. All 4 Remotion scenes (Hook, Product Reveal, Highlight cards, Outro CTA) dynamically inherit and use the company's brand palette (primary, secondary, accent, surface, bg) for ambient glow, badges, cards, and CTA buttons.
  3. Interactive Brand Color Palette controls in the Web GUI (Storyboard Inspector & Input Studio) allow instant inspection and manual color picking.
**Plans**: 1 plan
- [x] 09-01: Implement dynamic brand background/ambient mesh generator, propagate tokens to all Remotion scenes, and build Web GUI brand palette editor.

### Phase 10: HTML/CSS Synthesis Engine & Direct Screenshot Switch
**Goal**: Implement a dual-mode Screen Switch between 'Synthesized HTML/CSS' and 'Direct Screenshot' (defaulting to Synthesized HTML/CSS even when images are uploaded), generate clean HTML/CSS feature screens themed to the brand, and provide an interactive HTML/CSS code viewer in the Web GUI.
**Depends on**: Phase 9  
**Requirements**: HTML-01  
**Success Criteria**:
  1. Prominent Screen Render Mode switch in Input Studio and Storyboard Inspector: 'Synthesized HTML/CSS' vs 'Direct Screenshot'.
  2. Defaults to 'Synthesized HTML/CSS' with extracted brand styling, falling back to 'Direct Screenshot' only when toggled.
  3. FeatureScreenSynthesizer generates clean HTML & CSS markup with customizable CSS custom properties (`:root`), renderable inside the Remotion device frame.
  4. Interactive HTML/CSS Code tab in Storyboard Inspector letting users view and tweak the synthesized screen code live.
**Plans**: 1 plan
- [x] 10-01: Build screen mode switch, HTML/CSS markup generator & renderer, and interactive code inspector tab.

### Phase 11: Kokoro TTS Voiceover Pipeline & Upbeat Music Overhaul
**Goal**: Implement local Kokoro-82M TTS voiceover narration (`npx hyperframes tts`), overhaul the background music library with curated upbeat Ende.app tracks, wire real voiceover playback and ducking into Remotion Audio Mixer, and provide script generation & editing controls in the Web GUI.
**Depends on**: Phase 10  
**Requirements**: VOICE-01, MUSIC-02  
**Success Criteria**:
  1. Curated high-energy upbeat music tracks (Ende.app Happy Beats Vol 1, 9, 10, 11, 12) set as default upbeat options with instant audio playback.
  2. Local Kokoro-82M TTS voiceover generation endpoint (`POST /api/generate-voiceover`) with support for Kokoro voices (`af_heart`, `af_nova`, `am_adam`, etc.) and graceful OpenAI TTS fallback.
  3. Remotion Audio Mixer (`MarcutieAudioMixer`) plays the voiceover track and ducks background music during narration.
  4. Web GUI Audio Controls provide voiceover toggle, voice selector, editable narration script, and preview playback.
- [x] 11-01: Implement Kokoro TTS backend route, upbeat music catalog revamp, Remotion audio mixer voiceover & ducking integration, and Web GUI voiceover controls.

### Phase 12: Pre-Prompt Customization Studio
**Goal**: Build an interactive Tabbed Studio Panel alongside the prompt input providing deep pre-flight controls for Brand Colors & Theming, Voiceover Studio, Music & Audio, and Creative Direction before prompt generation.
**Depends on**: Phase 11  
**Requirements**: STUDIO-01  
**Success Criteria**:
  1. Interactive Tabbed Studio Panel alongside Prompt Input with clean tabs: 'Creative & Tone', 'Brand Colors & Theme', 'Voiceover Studio', and 'Music & Audio'.
  2. Brand Colors tab features preset palette cards (Cyber Neon, Sunset Glow, Deep Violet, Emerald Matrix, Slate Minimal, Midnight Blue), custom hex pickers (Primary, Secondary, Accent, Background, Surface), and Screen Render Mode toggle ('Synthesized HTML/CSS' vs 'Direct Screenshot').
  3. Voiceover Studio tab features Voiceover toggle (On/Off), Voice dropdown ('AI Auto-Pick [Tone-Matched]' + 7 Kokoro voices + OpenAI voices), and Speaking Rate slider.
  4. Music & Audio tab features Track selector ('AI Smart Select [Prompt-Matched]' + Ende.app Happy Beats Vol 1, 9, 10, 11, 12), Volume sliders, and Ducking depth.
**Plans**: 1 plan
- [x] 12-01: Build PreFlightStudioPanel component with tab navigation, color pickers, voiceover selector, and music selector, wiring state to App shell.

### Phase 13: Integrated Storyboard, Smart Audio Decision & Automated TTS Pipeline
**Goal**: Build the automated decision engine that analyzes the prompt, dynamically chooses the tone-matched voice model and upbeat music track post-prompt, generates the narration script, synthesizes Kokoro-82M TTS upfront, and auto-syncs scene hold durations to speech timing before rendering.
**Depends on**: Phase 12  
**Requirements**: AUTO-01  
**Success Criteria**:
  1. Post-prompt audio heuristic automatically maps tone and prompt keywords to the ideal upbeat Happy Beats track and Kokoro voice character when set to Auto.
  2. Storyboard generation orchestrator automatically triggers Kokoro-82M TTS synthesis (`POST /api/generate-voiceover`) as an integrated step.
  3. Precise WAV duration analyzer auto-adjusts scene reading hold times and video total frames to ensure narration is never truncated or rushed.
  4. Attaches voiceover audio asset URL, dynamic ducking intervals, and chosen music track directly into the storyboard audio contract.
**Plans**: 1 plan
- [x] 13-01: Implement smart audio decision rules, upfront Kokoro TTS synthesis pipeline, duration auto-synchronizer, and integration tests.

### Phase 14: One-Click Finished Product Pipeline & Final Video Delivery Hero
**Goal**: Implement the single-click full pipeline and finished product delivery hero view that executes storyboard generation, voiceover synthesis, headless Remotion MP4 render, and frame-0 poster baking, immediately presenting a finished, playable, downloadable video.
**Depends on**: Phase 13  
**Requirements**: ONECLICK-01  
**Success Criteria**:
  1. Single primary button "Generate Finished Launch Video" executes the entire end-to-end chain with a real-time multi-stage visual progress stepper.
  2. Headless local MP4 render triggers automatically upon voiceover & storyboard readiness without manual export modal interaction.
  3. Extracts settled poster (`poster.jpg`), bakes frame 0 with FFmpeg, and generates platform-specific share captions.
  4. Finished Video Delivery Hero view displays playable MP4 with synced voiceover and ducked upbeat music, one-click MP4 download, poster download, copyable captions, and option to reveal Studio Inspector for post-render tweaking.
**Plans**: 1 plan
- [x] 14-01: Build One-Click execution controller, animated progress pipeline stepper, FinishedVideoHero delivery view, and end-to-end verification.

---

### Milestone 5: Kinetic Animated Subtitles & Caption Burn-in

### Phase 15: Subtitle Timing Engine & Kinetic Caption Remotion Renderer
**Goal**: Build the word-level timestamp interpolation engine and spring-animated `KineticCaptions` Remotion overlay component supporting 4 distinct visual aesthetics (`karaoke-bounce`, `clean-pill`, `cyber-glow`, `minimal`) with aspect ratio safe zones.
**Depends on**: Phase 14  
**Requirements**: CAPTION-01, CAPTION-02  
**Success Criteria**:
  1. Timing engine calculates word-level start & end frames for each scene's narration script, distributing words proportionally based on syllables / word length and pause markers (`.`, `,`, `!`).
  2. `KineticCaptions` Remotion component tracks `frame` and renders the active phrase with the current word emphasized using spring dynamics (`@remotion/core` spring physics).
  3. 4 visual styles supported:
     - `karaoke-bounce`: Active word scales 1.25x with snappy spring overshoot, glowing brand accent color, bold heavy typography with drop-shadow.
     - `clean-pill`: Frosted dark glass container (`rgba(0,0,0,0.65)`, backdrop blur) with smooth active word highlight.
     - `cyber-glow`: Neon stroke outline with vibrant pulse effect matching brand accent.
     - `minimal`: High-contrast, clean typography with subtle underline or weight shift.
  4. Safe-zone layout container adapts to 16:9 (lower third), 9:16 (elevated above TikTok bottom UI bar), and 1:1.
  5. Unit tests validating word timestamp generation, duration bounds, and edge cases.
**Plans**: 1 plan
- [x] 15-01: Implement word timing alignment engine, spring-animated `KineticCaptions` Remotion component, safe-area layout containers, and unit tests.

### Phase 16: Pre-Flight Controls & Studio Pipeline Integration
**Goal**: Integrate subtitle customization into `PreFlightStudioPanel`, `StoryboardInspector`, `VideoPlayerPreview`, and the headless Remotion MP4 render pipeline.
**Depends on**: Phase 15  
**Requirements**: CAPTION-03  
**Success Criteria**:
  1. `PreFlightStudioPanel` provides a Subtitles switch (Enabled by default when voiceover is on), Style selector (`karaoke-bounce`, `clean-pill`, `cyber-glow`, `minimal`), and Position selector (`bottom`, `middle`).
  2. `Storyboard` schema and `StoryboardScene` contracts include `subtitlesConfig` (`{ enabled: boolean, style: SubtitleStyle, position: SubtitlePosition }`).
  3. Real-time Remotion Player (`VideoPlayerPreview`) renders live kinetic subtitles with instant response to style switching and timeline scrubbing.
  4. `StoryboardInspector` provides scene-level subtitle inspection and manual override per scene.
  5. Headless MP4 rendering burns kinetic subtitles cleanly into the final MP4 video output.
**Plans**: 1 plan
- [x] 16-01: Wire subtitle configuration into PreFlightStudioPanel, VideoPlayerPreview, StoryboardInspector, and verify headless MP4 render burn-in.

---

### Milestone 6: Expanded Visual Themes & Animated GIF Export

### Phase 17: Visual Themes Engine (Apple Light, Neo-Brutalist, Cyberpunk CRT, Aurora Glass)
**Goal**: Build a multi-aesthetic visual theme engine supporting 4 design modes (`apple-clean`, `neo-brutalist`, `cyberpunk-scanlines`, `aurora-glass`), dynamically adapting background meshes, typography, card borders, device frames, and procedural overlays across all Remotion scenes.
**Depends on**: Phase 16  
**Requirements**: THEME-02  
**Success Criteria**:
  1. Visual theme token structure (`apple-clean`, `neo-brutalist`, `cyberpunk-scanlines`, `aurora-glass`) integrated into `ThemePalette` and `Storyboard` schema.
  2. Procedural styling overlays: retro CRT scanlines and chromatic aberration for cyberpunk, high-contrast black borders and solid drop-shadows for neo-brutalist, glowing aurora borealis mesh for aurora glass, and bright clean alabaster light mode for apple clean.
  3. All 4 Remotion scenes (Hook, Product Reveal, Highlight cards, Outro) dynamically adapt their visual styling based on the active theme.
  4. Web GUI controls in PreFlightStudioPanel and StoryboardInspector allow instant selection and live Remotion player preview.
**Plans**: 1 plan
- [x] 17-01: Build visual theme presets, procedural styling overlays, scene component adaptations, and UI selectors.

### Phase 18: High-Quality Animated GIF Export Engine
**Goal**: Implement local two-pass FFmpeg animated GIF generation (`palettegen` + `paletteuse`) from rendered MP4 videos, providing instant lightweight GIF loops for READMEs, Product Hunt, and marketing emails.
**Depends on**: Phase 17  
**Requirements**: EXPORT-GIF  
**Success Criteria**:
  1. Two-pass FFmpeg GIF generator (`generateGifFromVideo`) producing crisp, 15fps, 720px wide animated GIF loops with zero cloud costs.
  2. Server endpoints: `POST /api/render/:jobId/gif` (triggers conversion) and `GET /api/render/:jobId/gif/download` (downloads `.gif`).
  3. `FinishedVideoHero` and `ExportModal` provide a one-click "Download Animated GIF" button with progress feedback.
  4. Unit and integration tests verify GIF generation, file validation, and error fallbacks.
**Plans**: 1 plan
- [x] 18-01: Implement two-pass FFmpeg GIF service, API routes, FinishedVideoHero/ExportModal download controls, and integration tests.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18

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
| 9. Dynamic Brand Theming & Ambient Video Scene Styling | 1/1 | Complete | 2026-10-08 |
| 10. HTML/CSS Synthesis Engine & Direct Screenshot Switch | 1/1 | Complete | 2026-10-08 |
| 11. Kokoro TTS Voiceover Pipeline & Upbeat Music Overhaul | 1/1 | Complete | 2026-10-08 |
| 12. Pre-Prompt Customization Studio | 1/1 | Complete | 2026-10-08 |
| 13. Integrated Storyboard, Smart Audio & TTS Pipeline | 1/1 | Complete | 2026-10-08 |
| 14. One-Click Finished Product Pipeline & Delivery Hero | 1/1 | Complete | 2026-10-08 |
| 15. Subtitle Timing Engine & Kinetic Caption Renderer | 1/1 | Complete | 2026-10-08 |
| 16. Pre-Flight Controls & Studio Pipeline Integration | 1/1 | Complete | 2026-10-08 |
| 17. Visual Themes Engine (Apple, Brutalist, Cyber, Aurora) | 1/1 | Complete | 2026-10-08 |
| 18. High-Quality Animated GIF Export Engine | 1/1 | Complete | 2026-10-08 |

---
*Roadmap updated: 2026-10-08 for Milestone 6 Completion*
