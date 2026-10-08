# Pitfalls Research: Marcutie

## Critical Pitfalls & Mitigations

### 1. Browser/Node Video Rendering Performance & Memory
- **Pitfall**: Client-side video encoding or headless rendering can exhaust memory if handling high-resolution source images (e.g. 8K phone screenshots) or uncompressed frame buffers.
- **Mitigation**:
  - Automatically downscale uploaded user images to 1080p / 1440p upon ingestion.
  - Render strictly at 1080p (1920x1080 landscape or 1080x1920 vertical) at 30fps.
  - Utilize hardware-accelerated encoding in Remotion / Chromium where available.

### 2. Flashing Text & Unreadable Motion
- **Pitfall**: AI-generated animations often change scenes too rapidly or fail to leave enough reading time for viewers before transitioning.
- **Mitigation**:
  - Enforce strict reading-time floor algorithm: Short labels >= 0.8s hold; headlines >= 0.3s per word (min 1.2s).
  - Adopt the "Fast-in, Long-hold" principle: snappy entrances (0.3–0.5s) followed by a calm settled state before exiting.

### 3. API Key Exposure & Security Boundary
- **Pitfall**: User API keys saved in insecure locations or leaked via network requests.
- **Mitigation**:
  - Keys remain local-only in the user's browser storage or local `.env` file.
  - Server runs purely on `localhost` (not exposed to public network interfaces).
  - Outgoing AI requests go directly to provider endpoints (Google, Anthropic, OpenAI).

### 4. Poor Social Media Previews (Black/Faded Thumbnail)
- **Pitfall**: Platforms like Twitter/X, Discord, and Slack grab frame 0 of an MP4 as the thumbnail preview. If frame 0 is a black fade-in, the preview looks broken.
- **Mitigation**:
  - Adopt Brag's proven Frame 0 Poster Baking technique: extract the strongest settled visual frame (`poster.jpg`) and overlay it specifically on frame 0 using FFmpeg (`eq(n,0)`). The poster displays for 1/30s (imperceptible to human eyes during playback) but serves as the preview thumbnail everywhere.

### 5. Multi-Aspect Ratio Layout Breakages
- **Pitfall**: Scenes designed for 16:9 Landscape clip text or crop images awkwardly when exported in 9:16 Vertical (Reels/TikTok/Shorts).
- **Mitigation**:
  - Design fluid responsive compositions using percentage-based positioning and flex/grid containers.
  - Distinct composition layouts optimized for vertical vs landscape formats.
