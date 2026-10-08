# Stack Research: Marcutie

## Recommended Stack

### 1. Local Server & API
- **Runtime**: Node.js (>= 18.0)
- **Framework**: Express / Vite middleware
- **Rationale**: Single runtime across frontend and backend; seamless integration with Remotion and local filesystem; cross-platform (Windows, macOS, Linux).
- **Alternatives considered**: Python/FastAPI (adds Python + virtualenv requirement on user machine; Node is already needed for modern React/Remotion frontend).

### 2. Frontend & User Interface
- **Framework**: React 18 / 19 with Vite
- **Styling**: Vanilla CSS Design System with CSS Custom Properties (modern dark mode, glassmorphism, smooth micro-interactions, responsive layout).
- **Icons**: Lucide React
- **Player**: `@remotion/player` for live frame-accurate timeline preview in the browser.

### 3. AI & Storyboard Generation (BYOK)
- **SDKs**: Direct fetch / official SDKs for:
  - `@google/genai` (Gemini 2.5/3.0 Flash & Pro with multimodal vision)
  - `@anthropic-ai/sdk` (Claude 3.5 Sonnet with vision)
  - `openai` (GPT-4o / GPT-4o-mini with vision)
- **Local Storage**: API keys stored in local `.env` or encrypted client `localStorage`, never transmitted externally.

### 4. Video Rendering & Composition Engine
- **Engine**: Remotion (`remotion`, `@remotion/player`, `@remotion/renderer`)
- **Composition**: React-based composition with Spring physics, text animation, image transform/motion graphics, and multi-track audio.
- **Render Output**: Native local rendering to H.264 MP4.
- **Poster Generation**: Canvas/FFmpeg poster frame extraction and frame 0 overlay baking.

### 5. Audio & SFX Layer
- **Music**: Curated bundled CC0 background tracks (ambient, tech-upbeat, cinematic, lofi).
- **SFX**: Curated CC0 sound effects library (whooshes, pops, typing clicks, heavy impacts).
- **TTS**: Browser SpeechSynthesis for zero-cost local preview + optional cloud TTS integration (OpenAI TTS / Kokoro).

## Confidence & Dependencies
- High confidence: Remotion Player + React provides frame-accurate preview and reliable local rendering without GPU server costs.
- Dependency hygiene: Strict standard library and official vendor SDKs; zero bloated third-party CSS frameworks.
