---
phase: 2
slug: web-gui-input-studio
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-10-08
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Vite build check |
| **Config file** | `tsconfig.json` & `vite.config.ts` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm test`
- **Before `/gsd-verify-work`:** Full build and server tests must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | GUI-01 | — | Modern header, shell, and styling | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | GUI-04, SRV-04 | — | Settings modal persists BYOK keys | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | GUI-02 | — | Prompt input and image upload dropzone | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | GUI-03, GUI-04 | — | Tone chips, aspect ratio, duration selector | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Image drag-and-drop | GUI-02 | Browser drag event interaction | Drag image onto dropzone, verify instant thumbnail and upload response |
| BYOK key visibility | GUI-01 | Security UX | Toggle eye icon in settings modal to show/hide API keys |

---

## Validation Sign-Off

- [x] All tasks have automated build verification
- [x] Sampling continuity: builds verified on every task
- [x] Zero watch-mode flags
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-10-08
