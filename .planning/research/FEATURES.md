# Features Research: Marcutie

## Feature Categories

### 1. Table Stakes (Must-Have for v1)
- **Prompt & Image Input**: Textarea supporting long markdown/marketing prompts + drag-and-drop image uploader (mockups, screenshots, product photos).
- **Tone & Format Presets**: 7 marketing tone presets (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`) + aspect ratio toggle (`16:9 Landscape`, `9:16 Vertical / Reels / TikTok`, `1:1 Square`).
- **BYOK Key Management**: Settings panel to save Gemini, Claude, or OpenAI API keys locally.
- **Multimodal Storyboard Generation**: AI decomposes the prompt + image into a structured 15–25s sequence:
  - 2–3s Hook scene
  - Product reveal / core value proposition
  - 2–3 feature/highlight beats
  - Memorable punchline & CTA outro
- **Interactive Live Preview**: Real-time video player with play, pause, scrub, timecode display, and scene markers.
- **Local Video Render & Export**: High-quality local export to MP4 without sending video frames over the internet.
- **Audio & Sound Tracks**: Integrated background music selection with volume control and sound effect sync.

### 2. Differentiators (High Value & Brag-Inspired)
- **Reading-Time Floor Enforcement**: Prevents text flashing by enforcing min hold duration (>=0.8s for short text, >=0.3s per word for headlines).
- **Settled Poster Frame Extraction**: Automatically identifies the strongest visual moment, extracts `poster.jpg`, and bakes it into frame 0 of the MP4 so social feeds show an attractive preview thumbnail by default.
- **Dynamic Image Cutouts & Product Motion**: Pans, zooms, tilts, and cutout zooms on the user-uploaded image rather than static image display.
- **One-Click Share Copy**: Automatically drafts tailored social captions for Twitter/X, LinkedIn, and Discord matching the video's tone.
- **Scene-Level Script & Timing Overrides**: User can tweak text, change timing, re-order scenes, or swap audio cues directly in the GUI before rendering.

### 3. Anti-Features (Deliberately Excluded)
- **Cloud Server Video Rendering**: Avoids expensive monthly GPU cluster and server infrastructure costs.
- **Repository / GitHub Scraping**: The app is strictly designed for prompt + image input without needing codebases.
- **Multi-Minute Long-Form Video Editing**: Complex NLE (Non-Linear Editor) capabilities (e.g., Premiere Pro clone) distract from the core value of fast, punchy 15–25s marketing videos.
- **Mandatory User Account / Auth System**: Local app runs without login, passwords, or cloud database lock-in.
