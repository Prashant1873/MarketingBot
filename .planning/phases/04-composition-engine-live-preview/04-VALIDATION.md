---
phase: 4
slug: composition-engine-live-preview
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-10-08
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js native test runner (`node --test`) |
| **Config file** | `package.json` test script |
| **Quick run command** | `node --test tests/composition.test.js` |
| **Full suite command** | `npm test && npm run build` |
| **Estimated runtime** | ~6 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/composition.test.js`
- **After every plan wave:** Run `npm test && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 6 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | COMP-01 | — | Remotion types, aspect ratios, and animation math | unit | `node --test tests/composition.test.js` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | COMP-02, COMP-03 | — | HookScene, ProductRevealScene, and MarcutieComposition | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | COMP-04, COMP-05 | — | HighlightScene, OutroScene, and scenes index | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | COMP-01, COMP-05 | — | MarcutieComposition integration & full storyboard tests | unit | `npm test` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 3 | GUI-06 | — | VideoPlayerPreview component with @remotion/player | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 3 | GUI-05, GUI-06 | — | App.tsx integration, live scrubbing, and reactive edits | build | `npm test && npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/composition.test.js` — test suite for Remotion frame math, aspect ratio resolutions, and sequence timing

---

## Validation Sign-Off

- [x] All tasks have automated verify commands
- [x] Sampling continuity: tests run on each task
- [x] Zero watch-mode flags
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-10-08
