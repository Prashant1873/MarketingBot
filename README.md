# MarketingBot (Marcutie) 🎬✨

> **Local-first, AI-driven marketing and product launch video studio.**  
> Transform screenshots, URLs, or product prompts into high-converting, motion-designed product videos in seconds.

---

## 🌟 Highlights

- ⚡ **One-Click Launch Video Generation**: Produces a fully rendered product launch video (MP4), a settled 4K poster image, and ready-to-post social media copy in one shot.
- 🌓 **Obsidian & Alabaster Dual-Theme Design**: Certified WCAG 2.2 AA / AAA contrast across both Dark and Light modes. Hand-calibrated OKLCH color palettes, Apple-standard spring dynamics, and fluid stretch-and-squish segmented controls.
- 🎥 **Remotion-Powered Engine**: Live frame-accurate scrubbing preview player in the browser, backed by deterministic headless FFmpeg video rendering.
- 🎙️ **Local Voiceover & Smart Ducking**: Integrated Kokoro-82M TTS engine for natural, studio-quality narration, with automatic background music ducking during speech beats.
- 🎵 **Curated Audio & SFX Catalog**: Built-in library of royalty-free background music tracks and cinematic sound effects.
- 📱 **Adaptive Device Framing**: Automatically wraps captures and synthetic UI mockups into realistic macOS Chrome windows or iPhone smartphone bezels based on aspect ratio and content semantics.
- 💬 **Kinetic Captions**: Real-time syllable-interpolated subtitle overlays with multiple visual styles (Karaoke Bounce, Frosted Pill, Cyber Glow, Minimal).
- 🖼️ **Two-Pass Animated GIF Export**: High-fidelity palette-optimized GIF generation for instant embedding in GitHub READMEs, Product Hunt launches, and newsletters.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **FFmpeg**: (Optional: Remotion bundles required binaries automatically on most platforms)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prashant1873/MarketingBot.git
   cd MarketingBot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the studio:**
   ```bash
   npm start
   ```
   *This starts both the backend API server (`http://localhost:3001`) and the Vite frontend application (`http://localhost:5173`).*

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🔑 AI Configuration (BYOK)

MarketingBot operates with **Bring-Your-Own-Key (BYOK)** privacy. Your API keys are stored locally and never leave your machine:

1. Click the **Gear Icon (Settings)** in the top-right header of the web studio.
2. Enter your API key for any of the supported providers:
   - **Google Gemini** *(Recommended: supports Gemini 3.8 Flash, 3.5 Flash, 2.5 Flash)*
   - **OpenAI** *(GPT-4o, GPT-4o-mini)*
   - **Anthropic Claude** *(Claude 3.5 Sonnet)*
3. Alternatively, create a `.env` file in the root directory:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
*(Note: If no API key is provided, the platform automatically switches to a built-in Mock Provider so you can test and explore offline.)*

---

## 🎛️ Studio Capabilities

### 1. Pre-Flight Creative Controls
- **Marketing Tones**: Choose between *Default*, *Polished*, *YC Parody*, *Chaotic*, *Deadpan*, *Cinematic*, and *App Store*.
- **Aspect Ratios**: Native *16:9* (Landscape YouTube/LinkedIn), *9:16* (TikTok/Reels/Shorts), and *1:1* (Square Feed).
- **Target Durations**: Optimized pacing for *15s* (hyper-fast hook), *20s* (sweet spot), or *25s* (full feature pitch).
- **Visual Themes**: Dynamic styling shaders including *Apple Clean*, *Neo-Brutalist*, *Cyberpunk Scanlines*, and *Aurora Glass*.

### 2. Audio & Voiceover Engineering
- **Voice Presets**: Distinct voiceover personas powered by local Kokoro-82M TTS and edge TTS fallback.
- **Auto Audio Pipeline**: Dynamic volume ducking lowers background music to 15% during voiceover speech segments and recovers smoothly.
- **Audio Catalog**: 10+ categorized production tracks (Lo-fi, Ambient, Tech Synth, Cinematic Hype) with built-in audition controls.

### 3. Finished Video Hero Deck
- **Instant MP4 Download**: Rendered at full 1080p 30 FPS.
- **Settled Poster Extraction**: Download the peak settled frame for video thumbnails and OpenGraph cards.
- **One-Click Share Copy**: Copy ready-to-post promotional text tailored for **X (Twitter)**, **LinkedIn**, and **Discord**.

---

## 🧪 Testing & Verification

MarketingBot includes a comprehensive automated test suite covering the entire backend pipeline, AI providers, storyboard validation, Remotion composition contracts, and audio mixing:

```bash
# Run the test suite
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Architecture

```
MarketingBot/
├── server/                    # Node.js backend & AI proxy
│   ├── ai/                    # Multimodal AI providers (Gemini, Claude, OpenAI)
│   ├── routes/                # Express API endpoints
│   └── services/              # Storyboard, render, audio, & voiceover services
├── src/                       # React 18 + Vite frontend
│   ├── components/            # Studio panels, modals, player, & controls
│   ├── remotion/              # Remotion video compositions & shaders
│   └── types/                 # TypeScript type definitions
├── assets/                    # Bundled royalty-free music & SFX catalog
├── tests/                     # Node test runner regression suite (68 tests)
└── scripts/                   # Development orchestrator & build tooling
```

---

## 📄 License

MIT © [Prashant1873](https://github.com/Prashant1873)
