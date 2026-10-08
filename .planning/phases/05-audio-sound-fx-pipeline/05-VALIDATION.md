---
phase: 5
slug: audio-sound-fx-pipeline
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-10-08
validated_at: 2026-10-08
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js native test runner (`node --test`) |
| **Config file** | `package.json` test script |
| **Quick run command** | `node --test tests/audio.test.js` |
| **Full suite command** | `npm test && npm run build` |
| **Estimated runtime** | ~6 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/audio.test.js`
- **After every plan wave:** Run `npm test && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 6 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | AUD-01, AUD-02 | — | Audio catalog, metadata index, and /api/assets/audio | unit | `node --test tests/audio.test.js` | ✅ | ✅ green |
| 05-01-02 | 01 | 1 | AUD-01 | — | AudioControls component for track auditioning & volume | build | `npm run build` | ✅ | ✅ green |
| 05-02-01 | 02 | 2 | AUD-03 | — | Remotion MarcutieAudioMixer with ducking & SFX cues | unit | `node --test tests/audio.test.js` | ✅ | ✅ green |
| 05-02-02 | 02 | 2 | AUD-01, AUD-03 | — | End-to-end audio mixer integration in player & App | build | `npm test && npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/audio.test.js` — test suite for audio catalog, tone recommendation mapping, volume curves, and SFX cue math

---

## Validation Sign-Off

- [x] All tasks have automated verify commands
- [x] Sampling continuity: tests run on each task
- [x] Zero watch-mode flags
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated 2026-10-08

