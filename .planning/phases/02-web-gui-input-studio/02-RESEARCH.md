# Phase 2: Web GUI & Input Studio — Research

## Objectives & Scope
Phase 2 builds the core user interface for Marcutie:
- Dark-mode, glassmorphic layout adhering to `frontend-skill` high-aesthetic standards.
- Multi-input prompt panel supporting long text and markdown product descriptions.
- Image drag-and-drop dropzone with instant client preview and asynchronous `/api/upload` integration.
- Tone preset selector with the 7 Brag tones (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`) plus freeform direction.
- Aspect ratio (`16:9`, `9:16`, `1:1`) and duration (`15s`, `20s`, `25s`) selectors.
- Slide-out / Modal BYOK settings drawer for managing Gemini, Claude, and OpenAI keys with local persistence.

## UI/UX Design System
- **Palette**: Deep slate/obsidian (`#080c14`, `#0e1626`, `#162033`), subtle gradient glow, accent indigo (`#6366f1`), purple (`#a855f7`), and emerald (`#10b981`).
- **Typography**: `Plus Jakarta Sans` for UI headings/labels, `JetBrains Mono` for timecodes and technical settings.
- **Micro-interactions**: Hover lifts, smooth spring border glows, fluid drag-and-drop state transitions, visual badge indicators.

## Component Architecture
1. `src/components/Header.tsx`: Logo, app title, server status pill, Settings trigger.
2. `src/components/PromptInput.tsx`: Auto-expanding textarea, character counter, prompt templates.
3. `src/components/ImageDropzone.tsx`: Drag-and-drop area, file validation, upload progress, thumbnail preview, clear action.
4. `src/components/ToneSelector.tsx`: Interactive grid of 7 tone cards + custom creative direction input.
5. `src/components/FormatControls.tsx`: Aspect ratio toggle chips and duration segmented controls.
6. `src/components/SettingsModal.tsx`: BYOK keys input (Gemini, Claude, OpenAI), visibility toggles, save to `/api/config`.
7. `src/hooks/useConfig.ts`: Custom hook to load and mutate settings via `/api/config`.

## Validation Strategy
- Build check: `npm run build` verifies zero TypeScript or JSX bundling errors.
- Visual & functional verification: Interactive testing in browser dev mode (`http://localhost:5173`) confirming dropzone upload to `/api/upload` and settings save to `/api/config`.
