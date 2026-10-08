# Phase 3: BYOK Multimodal AI Storyboard Engine — Research

## Objectives & Scope
Phase 3 builds the intelligence layer of Marcutie:
- Multi-provider AI adapters supporting Google Gemini (Flash/Pro), Anthropic Claude (3.5 Sonnet), and OpenAI (GPT-4o).
- Multimodal prompt & image ingestion: converts local uploaded product images into base64 payloads alongside user marketing prompts.
- Strict storyboard JSON generation schema.
- Marketing Video Laws validation & deterministic auto-fix pipeline:
  - Hook law: Opening scene duration strictly between 2.0s and 3.0s.
  - Duration constraint: Total scene durations strictly sum to target duration (15s, 20s, 25s).
  - Reading-time floor: Fast entrance with minimum hold time (>=0.8s for labels, >=0.3s/word for headlines).
  - Multi-platform social share copy generator.
- Offline/Mock fallback generator for test suites and offline local development.

## AI Prompts & System Engineering
System prompt instructs the LLM:
1. Deconstruct the product into:
   - Punchy opening Hook that creates immediate curiosity.
   - Core value proposition and product reveal (using uploaded image).
   - 2–3 crisp, concrete feature highlights.
   - Outro punchline and memorable call-to-action.
2. Adapt tone according to the 7 Brag presets (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`).
3. Output strictly valid JSON matching the schema, with zero markdown wrapping.

## Validation Strategy
- Automated test suite in `tests/storyboard.test.js` validating:
  - Storyboard JSON schema validation.
  - Marketing laws validator enforcing hook bounds (2–3s), total duration sum (15–25s), and reading-time floors.
  - Provider routing and mock fallback generation.
  - Integration with `POST /api/generate-storyboard`.
