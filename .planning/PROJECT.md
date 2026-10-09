# Marcutie

## What This Is

Marcutie is a self-hosted local marketing video generator inspired by Brag. It transforms long text prompts and uploaded product images into punchy, high-energy launch and marketing videos (15–25s) without requiring access to source code or GitHub repositories. It features a modern web GUI served by a lightweight local backend and executes video rendering locally in the browser/client to eliminate server GPU rendering costs.

## Core Value

Turn raw product ideas, marketing prompts, and product images into professional, shareable launch videos locally with zero server infrastructure overhead.

## Requirements

### Validated

- ✓ **SRV-01**: Node.js local server serves frontend on localhost — Phase 1
- ✓ **SRV-02**: Image upload endpoint stores files locally with MIME validation — Phase 1
- ✓ **SRV-03**: Audio asset endpoint serves bundled music & SFX — Phase 1
- ✓ **SRV-04**: Local config store securely saves BYOK keys — Phase 1
- ✓ **GUI-01**: Sleek dark-mode Web GUI with prompt input, image dropzone, tone/duration selectors, and API key management — Phase 2
- ✓ **AI-01**: BYOK multimodal AI engine supporting Gemini, Claude, and OpenAI to parse prompts and analyze product images — Phase 3
- ✓ **STORY-01**: Creative script and storyboard generator enforcing viral marketing video laws — Phase 3
- ✓ **SHARE-01**: Automatic social share copy generation matching video tone for Twitter/X, LinkedIn, and Discord — Phase 3
- ✓ **RENDER-01**: Client-side motion graphics & video rendering engine (Remotion) supporting instant live playback preview — Phase 4

- ✓ **AUDIO-01**: Built-in audio direction, royalty-free background music tracks, and motion-matched sound effect triggers — Phase 5
- ✓ **EXPORT-01**: Full video delivery pipeline: MP4 rendering, settled poster frame extraction (`poster.jpg`), and frame 0 poster baking — Phase 6
- ✓ **MOCKUP-01**: Dynamic Synthetic App Window Generator with Adaptive Device Framing (macOS Chrome landscape vs. Mobile Phone portrait) — Phase 7
- ✓ **STYLE-01**: Image-to-Theme Style Transfer — extract color palette and design tokens from uploaded screenshots to theme the entire video — Phase 8
- ✓ **FEATURE-01**: Prompt-Described Page Feature Synthesizer — generate custom UI page components for whatever feature was described in the prompt while inheriting the uploaded brand's design system — Phase 8

- ✓ **HTML-01**: Dual-mode Screen Switch ('Synthesized HTML/CSS' vs 'Direct Screenshot') with live HTML/CSS code viewer — Phase 10
- ✓ **THEME-01**: Dynamic Brand Theming & Ambient Video Scene Styling across all 4 Remotion scenes — Phase 9
- ✓ **VOICE-01**: Local Kokoro-82M AI voiceover synthesis with automatic Remotion BGM ducking — Phase 11
- ✓ **MUSIC-02**: Curated upbeat Ende.app music library replacement — Phase 11
- ✓ **STUDIO-01**: Pre-prompt tabbed customization panel for brand theming, voiceover, and music selection — Phase 12
- ✓ **AUTO-01**: Automated post-prompt audio & voiceover decision pipeline with upfront TTS synchronization — Phase 13
- ✓ **ONECLICK-01**: Single-click full pipeline to finished product delivery (rendered MP4, poster, share copy) — Phase 14
- ✓ **CAPTION-01**: Subtitle timing engine & word-by-word timestamp interpolation — Phase 15
- ✓ **CAPTION-02**: Multi-style animated kinetic caption Remotion renderer (karaoke bounce, clean pill, cyber glow, minimal) — Phase 15
- ✓ **CAPTION-03**: Pre-flight studio controls, live player preview, and headless MP4 burn-in integration — Phase 16
- [ ] **THEME-02**: Multi-aesthetic visual theme engine (Apple Clean Light, Neo-Brutalist, Cyberpunk Scanlines, Aurora Glassmorphism) — Phase 17
- [ ] **EXPORT-GIF**: High-quality two-pass FFmpeg animated GIF export engine with one-click download — Phase 18

### Out of Scope

- Cloud server GPU rendering / hosted SaaS backend — rejected to avoid recurring cloud compute and GPU cluster costs.
- Git repository / source code parsing — replaced entirely by direct prompt and image inputs.
- Continuous multi-minute video generation — focused strictly on high-impact 15–25s promotional/launch videos.

## Context

- Inspired by the `/brag` workflow from Hyperframes, which turns GitHub codebases into viral launch videos.
- Users want to create launch and promo videos for products, ideas, physical items, or services without having a website codebase or repository.
- BYOK (Bring Your Own Key) keeps AI processing scalable without SaaS subscription middleman fees.
- Local rendering via browser WebCodecs / Canvas / Remotion offloads all rendering to the user's hardware.
- Milestone 4 delivers maximum pre-flight customization with a single primary button producing a finished, rendered video with voiceover and upbeat music directly.

## Constraints

- **Execution Environment**: Runs locally on user's machine (Windows/Mac/Linux) with a lightweight local server.
- **Rendering Cost**: Zero server-side GPU costs; 100% video rendering runs locally in user client.
- **API Model**: BYOK (client/local config stores API keys locally, never uploaded to third-party servers).
- **Video Timing**: Strict 15–25 second format designed for modern social feeds and maximum engagement.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Local Server + Web GUI | Provides seamless local file management, asset serving, and cross-platform browser GUI | Validated |
| BYOK Cloud APIs (Gemini/Claude/OpenAI) | Leverages state-of-the-art vision and multimodal models without hosting heavy local vision models | Validated |
| Browser Motion Graphics / WebCodecs / Remotion | Enables instant interactive preview and zero-cost client-side export to MP4 | Validated |
| 15–25s Video Format & Hook Laws | Proven viral structure: 2-3s hook, settled text holds, sharp feature beats, frame-0 poster | Validated |
| Dual-mode HTML/CSS Screen Switch | Gives realistic brand-themed synthesized UI screens while retaining raw screenshot toggle | Validated |
| Local Kokoro-82M TTS + Ende.app Upbeat Audio | Zero-cost local studio narration with dynamic Remotion ducking mixer | Validated |
| One-Click End-to-End Pipeline | Single primary action generates storyboard, synthesizes voiceover, renders MP4, and bakes poster | Planned |

---
*Last updated: 2026-10-08 for Milestone 4 Planning*
