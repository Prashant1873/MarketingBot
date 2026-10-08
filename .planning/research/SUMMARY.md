# Research Summary: Marcutie

## Executive Synthesis

Marcutie is technically viable and architecturally sound as a lightweight, self-hosted local application. By combining BYOK cloud multimodal APIs with local Remotion rendering, it achieves zero recurring server/GPU costs while delivering viral, Brag-grade 15–25s marketing videos from only a user prompt and optional image.

## Key Technical Decisions
1. **Runtime**: Node.js + Express backend serving a React + Vite frontend on `localhost`.
2. **Video Engine**: Remotion (`@remotion/player` for live browser preview, `@remotion/renderer` for local MP4 generation).
3. **AI Pipeline**: Multimodal prompt + image parsing using BYOK API keys (Google Gemini, Claude, OpenAI) producing structured storyboard JSON.
4. **Viral Video Laws**: Enforce Brag's 2–3s hook, reading-time floor (>=0.8s hold), sound-matched animation, and frame-0 poster baking for social media feeds.

## Next Steps
Proceed to `.planning/REQUIREMENTS.md` and `.planning/ROADMAP.md` phase planning.
