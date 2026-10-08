---
phase: 1
slug: local-server-project-scaffold
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-10-08
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js native test runner (`node --test`) |
| **Config file** | `package.json` test script |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | SRV-01 | — | Scaffold boots clean package.json | unit | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | SRV-01 | — | Server responds to health check | integration | `npm test` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | SRV-02 | — | Upload rejects non-images & saves files | integration | `npm test` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | SRV-03 | — | Audio asset endpoint returns media list | integration | `npm test` | ❌ W0 | ⬜ pending |
| 01-02-04 | 02 | 1 | SRV-04 | — | Config endpoint safely stores local BYOK keys | integration | `npm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/server.test.js` — test suite for health check, upload, assets, and config persistence
- [ ] `package.json` test script defined (`"test": "node --test tests/server.test.js"`)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Frontend dev proxy | SRV-01 | Browser dev server visual test | Open browser to `http://localhost:5173`, verify proxy communicates with `http://localhost:3001/api/health` |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 2s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-10-08
