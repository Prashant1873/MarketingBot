# Phase 1: Local Server & Project Scaffold — Research

## Objectives & Scope
Phase 1 establishes the local development foundation for Marcutie:
- Single root ESM package architecture with Node.js (`v22.x`) and npm.
- Express local server running on `localhost:3001` with Vite frontend proxying.
- File upload pipeline for product images (validation, local disk persistence in `data/uploads/`).
- Local asset serving for bundled CC0 music and SFX in `assets/`.
- Local config store (`data/config.json`) for BYOK API keys and app preferences.
- Automated testing via Node.js native test runner (`node --test`).

## Technology Stack Choices

### 1. Server & Runtime Architecture
- **Runtime**: Node.js 22.x (ESM: `"type": "module"`).
- **Server Framework**: Express 4 / 5.
- **File Uploads**: `multer` with disk storage and strict MIME filtering (`image/jpeg`, `image/png`, `image/webp`).
- **Config Storage**: Secure local JSON file (`data/config.json`) kept on local machine and excluded via `.gitignore`.
- **Port Strategy**: Default server port 3001, Vite dev port 5173 with proxy configuration for `/api` and `/uploads` and `/assets`.

### 2. Frontend Scaffold
- **Bundler**: Vite 5/6 + React + TypeScript.
- **Clean separation**: `src/` for React frontend, `server/` for local backend, `assets/` for static media library.

## Validation Architecture

### Automated Verification
- Framework: Node.js native test runner (`node --test`) with standard assertions (`node:assert/strict`).
- Test suite: `tests/server.test.js` covering:
  1. `GET /api/health` returns HTTP 200 `{ status: "ok" }`.
  2. `POST /api/upload` handles valid image uploads and rejects invalid file types.
  3. `GET /api/assets/audio` returns indexed audio files.
  4. `GET /api/config` and `POST /api/config` persists and retrieves BYOK settings.
- Fast execution: < 1.5 seconds.
