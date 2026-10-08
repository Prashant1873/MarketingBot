---
phase: 6
slug: local-render-poster-baking-social-delivery
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-10-08
validated_at: 2026-10-08
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js native test runner (`node --test`) |
| **Config file** | `package.json` test script |
| **Quick run command** | `node --test tests/render.test.js` |
| **Full suite command** | `npm test && npm run build` |
| **Estimated runtime** | ~7 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/render.test.js`
- **After every plan wave:** Run `npm test && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 7 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | EXP-01, EXP-02, EXP-03 | — | Render service, FFmpeg frame-0 baking filter, peak poster math | unit | `node --test tests/render.test.js` | ✅ | ✅ green |
| 06-01-02 | 01 | 1 | EXP-01, EXP-05 | — | POST /api/render, GET /api/render/:jobId/status, download routes | integration | `npm test` | ✅ | ✅ green |
| 06-02-01 | 02 | 2 | EXP-04 | — | Multi-platform social copy generator (X, LinkedIn, Discord) | unit/build | `npm run build` | ✅ | ✅ green |
| 06-02-02 | 02 | 2 | EXP-04, EXP-05 | — | ExportModal progress UI, MP4 playback, poster and copy delivery | e2e/build | `npm test && npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/render.test.js` — test suite for render job registry, aspect ratio dimensions, peak frame calculations, and FFmpeg command generation

---

## Validation Sign-Off

- [x] All tasks have automated verify commands
- [x] Sampling continuity: tests run on each task
- [x] Zero watch-mode flags
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated 2026-10-08
