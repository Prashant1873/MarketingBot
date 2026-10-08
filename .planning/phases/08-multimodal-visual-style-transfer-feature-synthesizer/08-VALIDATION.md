# Phase 8 Validation & Acceptance Checkpoints

## Core Criteria
1. **Palette Extraction & Style Transfer (`STYLE-01`)**:
   - Palette extractor produces `{ primary, secondary, accent, background, surface, text, isDark }` from uploaded images or curated tone defaults.
   - Multimodal AI prompt directs vision models (Gemini/Claude/OpenAI) to extract brand colors from product images.
   - Storyboards store `themePalette` and make it accessible in both previews and renders.

2. **Prompt-Described Feature Screen Synthesizer (`FEATURE-01`)**:
   - Feature classifier identifies feature archetype from prompt (e.g. `'kanban'`, `'chat'`, `'analytics'`, `'checkout'`, `'feed'`, `'settings'`).
   - `FeatureScreenSynthesizer.tsx` renders custom UI screens for the specific feature described in the prompt.
   - The synthesized feature screen inherits the brand's extracted color tokens (`themePalette.primary`, `accent`, etc.) so it feels like an authentic page of the product.
   - Renders cleanly inside both macOS Chrome (landscape) and Mobile Phone (portrait) device frames.

3. **GUI Controls & Inspection**:
   - Storyboard Inspector displays the extracted brand palette swatches and detected feature type badge.
   - Allows changing colors or inspecting feature mockup details.

## Verification Commands
```bash
node --test tests/styleTransfer.test.js
npm test
npm run build
```
