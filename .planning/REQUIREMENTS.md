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

- [ ] **EXP-01**: Local MP4 rendering via Remotion renderer at 1080p 30fps.
- [ ] **EXP-02**: Automatic settled poster frame extraction (`poster.jpg`) at the peak visual moment.
- [ ] **EXP-03**: Frame 0 poster baking into the exported MP4 so social platforms display the poster as the idle thumbnail.
- [ ] **EXP-04**: Social share copy generator producing ready-to-post captions for Twitter/X, LinkedIn, and Discord.
- [ ] **EXP-05**: Download and export management panel in the GUI with render progress indicators.

## v2 Requirements (Deferred)

- **AI-VOX**: Automated local voiceover generation via Kokoro TTS or Web Speech API integration.
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
| SRV-01 | Phase 1 | Complete |
| SRV-02 | Phase 1 | Complete |
| SRV-03 | Phase 1 | Complete |
| SRV-04 | Phase 1 | Complete |
| GUI-01 | Phase 2 | Complete |
| GUI-02 | Phase 2 | Complete |
| GUI-03 | Phase 2 | Complete |
| GUI-04 | Phase 2 | Complete |
| AI-01 | Phase 3 | Pending |
| AI-02 | Phase 3 | Pending |
| AI-03 | Phase 3 | Pending |
| AI-04 | Phase 3 | Pending |
| COMP-01 | Phase 4 | Pending |
| COMP-02 | Phase 4 | Pending |
| COMP-03 | Phase 4 | Pending |
| COMP-04 | Phase 4 | Pending |
| COMP-05 | Phase 4 | Pending |
| GUI-05 | Phase 4 | Pending |
| GUI-06 | Phase 4 | Pending |
| AUD-01 | Phase 5 | Pending |
| AUD-02 | Phase 5 | Pending |
| AUD-03 | Phase 5 | Pending |
| EXP-01 | Phase 6 | Pending |
| EXP-02 | Phase 6 | Pending |
| EXP-03 | Phase 6 | Pending |
| EXP-04 | Phase 6 | Pending |
| EXP-05 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-10-08*
