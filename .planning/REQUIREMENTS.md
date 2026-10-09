# Requirements: Marcutie

**Defined:** 2026-10-08  
**Core Value:** Turn raw product ideas, marketing prompts, and product images into professional, shareable launch videos locally with zero server infrastructure overhead.

## v1 Requirements

### Local Server & Infrastructure (SRV)

- [x] **SRV-01**: Node.js local server serves the web application on `localhost` with static asset routing.
- [x] **SRV-02**: File upload endpoint stores user-provided images in a local temporary/uploads directory with image validation.
- [x] **SRV-03**: Built-in asset endpoint serves curated royalty-free music and sound effect libraries.
- [x] **SRV-04**: Secure local BYOK configuration storage (keeps user API keys local on disk or browser storage).

### Web GUI & User Experience (GUI)

- [x] **GUI-01**: Modern, dark-mode Web GUI adhering to high aesthetic standards with responsive glassmorphism layout.
- [x] **GUI-02**: Multi-input prompt panel supporting long text prompts, product description markdown, and image drag-and-drop.
- [x] **GUI-03**: Tone preset selector (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`) and custom direction input.
- [x] **GUI-04**: Aspect ratio selector (16:9 Landscape, 9:16 Vertical, 1:1 Square) and duration picker (15s, 20s, 25s).
- [x] **GUI-05**: Interactive Storyboard Editor allowing inspection and fine-tuning of scene text, timings, and visual emphasis.
- [x] **GUI-06**: Live embedded video player preview with play/pause, scrub slider, and frame timecode display.

### AI Storyboard Engine (AI)

- [x] **AI-01**: Multimodal API integration supporting Google Gemini (Flash/Pro), Anthropic Claude, and OpenAI GPT-4o.
- [x] **AI-02**: Prompt & image analysis decomposes user inputs into visual hooks, claims, and product highlights.
- [x] **AI-03**: Strict JSON storyboard generator producing structured scenes with copy, duration, visual treatments, and transition cues.
- [x] **AI-04**: Marketing laws validator ensuring:
  - Opening hook duration between 2–3s
  - Text hold times satisfy legibility floor (>=0.8s for labels, >=0.3s/word for headlines)
  - Total video duration between 15–25s

### Composition & Motion Graphics Engine (COMP)

- [x] **COMP-01**: Remotion composition engine supporting 16:9, 9:16, and 1:1 aspect ratios.
- [x] **COMP-02**: Hook Scene component with dynamic kinetic typography, entrance slams, and high-contrast backdrops.
- [x] **COMP-03**: Product Reveal Scene component featuring uploaded image with smooth camera pan, 3D tilt, or scale animation.
- [x] **COMP-04**: Highlight Beat Scene component with sequential card arrivals, badge pops, and stat callouts.
- [x] **COMP-05**: Punchline & Outro Scene component with concluding hook, product title, and CTA payoff.

### Audio & Sound FX (AUD)

- [x] **AUD-01**: Curated bundled CC0 background music tracks matched to marketing tones.
- [x] **AUD-02**: Sound effect library integration (typing ticks, interface clicks, pops, whooshes, impacts).
- [x] **AUD-03**: Audio timeline mixer syncing background music fade-outs and triggering SFX on visual entrance events.

### Local Render & Delivery Pipeline (EXP)

- [x] **EXP-01**: Local MP4 rendering via Remotion renderer at 1080p 30fps.
- [x] **EXP-02**: Automatic settled poster frame extraction (`poster.jpg`) at the peak visual moment.
- [x] **EXP-03**: Frame 0 poster baking into the exported MP4 so social platforms display the poster as the idle thumbnail.
- [x] **EXP-04**: Social share copy generator producing ready-to-post captions for Twitter/X, LinkedIn, and Discord.
### Milestone 2: Synthetic Mockups & Visual Style Transfer

- [x] **MOCKUP-01**: Procedural synthetic app window generator with adaptive device framing: automatically detects whether to render a macOS Chrome window or Mobile Phone frame with manual override.
- [x] **STYLE-01**: Image-to-Theme style transfer extracting color palette (primary, secondary, background, dark/light) and visual tone from uploaded images to theme video elements.
- [x] **FEATURE-01**: Prompt-described page feature synthesizer dynamically creating custom UI screens for whatever specific page/feature was described in the prompt while inheriting the brand design system.

### Milestone 3: HTML/CSS Synthesis Switch, Brand Theming & Voiceover

- [x] **HTML-01**: Dual-mode Screen Switch ('Synthesized HTML/CSS' vs 'Direct Screenshot') with live HTML/CSS code viewer.
- [x] **THEME-01**: Dynamic Brand Theming & Ambient Video Scene Styling across all 4 Remotion scenes.
- [x] **VOICE-01**: Local Kokoro-82M AI voiceover synthesis with automatic Remotion BGM ducking.
- [x] **MUSIC-02**: Curated upbeat Ende.app music library replacement.

### Milestone 4: UI Studio Overhaul & One-Click Finished Launch Video

- [x] **STUDIO-01**: Pre-prompt tabbed customization panel alongside Prompt Input offering deep controls for Brand Theming, Voiceover Studio, Music & Audio, and Creative Direction before prompt generation.
- [x] **AUTO-01**: Automated post-prompt audio & voiceover decision engine selecting tone-matched voice model and upbeat track, generating narration, synthesizing Kokoro-82M TTS, and auto-syncing scene hold durations.
- [x] **ONECLICK-01**: Single-click full pipeline to finished product delivery: runs storyboard + voiceover + local MP4 render + frame-0 poster bake, presenting a finished delivery hero view with playable MP4, downloads, and social captions.

### Milestone 5: Kinetic Animated Subtitles & Caption Burn-in

- [x] **CAPTION-01**: Subtitle timing engine & word-by-word timestamp interpolation mapping spoken voiceover script to precise video frame windows.
- [x] **CAPTION-02**: Multi-style animated kinetic caption Remotion renderer supporting 4 visual aesthetics (`karaoke-bounce`, `clean-pill`, `cyber-glow`, `minimal`) with spring dynamics.
- [x] **CAPTION-03**: Pre-flight studio controls, live player preview, safe-area layout adaptation (16:9, 9:16, 1:1), and headless MP4 caption burn-in.

### Milestone 6: Expanded Visual Themes & Animated GIF Export

- [ ] **THEME-02**: Multi-aesthetic visual theme engine (`apple-clean`, `neo-brutalist`, `cyberpunk-scanlines`, `aurora-glass`) adapting shaders, typography, borders, and ambient background styling across all 4 Remotion scenes.
- [ ] **EXPORT-GIF**: Two-pass FFmpeg animated GIF generator (`palettegen` + `paletteuse`) creating lightweight, crisp 15fps GIF loops with download API and UI buttons.

## v2 Requirements (Deferred)

- **AUDIO-BEAT**: Real-time FFT audio-reactive motion graphics modulating visual elements to musical frequency bands.
- **TMPL-CUSTOM**: User-created custom scene template builder.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Hosted cloud server GPU rendering | Avoids massive recurring cloud compute costs; all processing runs locally. |
| GitHub repo / source code dependency | Replaced by prompt & image input for universal accessibility. |
| Complex multi-track NLE video editor | Focus is purely on automated, high-converting 15–25s launch videos. |
| Mandatory cloud user accounts & logins | Kept strictly local-first with zero telemetry or accounts. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SRV-01..04 | Phase 1 | Complete |
| GUI-01..04 | Phase 2 | Complete |
| AI-01..04 | Phase 3 | Complete |
| COMP-01..05 | Phase 4 | Complete |
| AUD-01..03 | Phase 5 | Complete |
| EXP-01..05 | Phase 6 | Complete |
| MOCKUP-01 | Phase 7 | Complete |
| STYLE-01, FEATURE-01 | Phase 8 | Complete |
| THEME-01 | Phase 9 | Complete |
| HTML-01 | Phase 10 | Complete |
| VOICE-01, MUSIC-02 | Phase 11 | Complete |
| STUDIO-01 | Phase 12 | Complete |
| AUTO-01 | Phase 13 | Complete |
| ONECLICK-01 | Phase 14 | Complete |
| CAPTION-01, CAPTION-02 | Phase 15 | Complete |
| CAPTION-03 | Phase 16 | Complete |
| THEME-02 | Phase 17 | Planned |
| EXPORT-GIF | Phase 18 | Planned |

**Coverage:**
- Total requirements: 41 total
- Completed: 39
- Milestone 6 planned: 2

---
*Requirements defined: 2026-10-08 | Milestone 6 Added*
