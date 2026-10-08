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

### Active
- [ ] **RENDER-01**: Client-side motion graphics & video rendering engine (Remotion) supporting instant live playback preview and local MP4 export — Phase 4 & Phase 6
- [ ] **AUDIO-01**: Built-in audio direction, royalty-free background music tracks, and motion-matched sound effect triggers — Phase 5
- [ ] **EXPORT-01**: Full video delivery pipeline: MP4 rendering, settled poster frame extraction (`poster.jpg`), and frame 0 poster baking — Phase 6

### Out of Scope

- Cloud server GPU rendering / hosted SaaS backend — rejected to avoid recurring cloud compute and GPU cluster costs.
- Git repository / source code parsing — replaced entirely by direct prompt and image inputs.
- Continuous multi-minute video generation — focused strictly on high-impact 15–25s promotional/launch videos.

## Context

- Inspired by the `/brag` workflow from Hyperframes, which turns GitHub codebases into viral launch videos.
- Users want to create launch and promo videos for products, ideas, physical items, or services without having a website codebase or repository.
- BYOK (Bring Your Own Key) keeps AI processing scalable without SaaS subscription middleman fees.
- Local rendering via browser WebCodecs / Canvas / Remotion offloads all rendering to the user's hardware.

## Constraints

- **Execution Environment**: Runs locally on user's machine (Windows/Mac/Linux) with a lightweight local server.
- **Rendering Cost**: Zero server-side GPU costs; 100% video rendering runs locally in user client.
- **API Model**: BYOK (client/local config stores API keys locally, never uploaded to third-party servers).
- **Video Timing**: Strict 15–25 second format designed for modern social feeds and maximum engagement.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Local Server + Web GUI | Provides seamless local file management, asset serving, and cross-platform browser GUI | — Pending |
| BYOK Cloud APIs (Gemini/Claude/OpenAI) | Leverages state-of-the-art vision and multimodal models without hosting heavy local vision models | — Pending |
| Browser Motion Graphics / WebCodecs / Remotion | Enables instant interactive preview and zero-cost client-side export to MP4 | — Pending |
| 15–25s Video Format & Hook Laws | Proven viral structure: 2-3s hook, settled text holds, sharp feature beats, frame-0 poster | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-08 after initialization*
