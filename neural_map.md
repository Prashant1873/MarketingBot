# Neural Map: Subsystem Architecture & Logic Flows

## Subsystem Architecture

```
[ User Input (Prompt + Image) ] 
               │
               ▼
┌───────────────────────────────┐
│     Web GUI (React/Vite)      │  ◄── User adjusts tone, duration, aspect ratio, BYOK keys
└──────────────┬────────────────┘
               │ (POST /api/generate-storyboard)
               ▼
┌───────────────────────────────┐
│    Local Backend (Node.js)    │
│  - Multimodal AI Proxy        │  ──► [ Gemini / Claude / OpenAI API ] (BYOK)
│  - Asset Server & Uploads     │
└──────────────┬────────────────┘
               │ (Structured Storyboard JSON)
               ▼
┌───────────────────────────────┐
│ Storyboard & Marketing Engine │  ◄── Validates hook (2-3s), reading floors (>=0.8s), 15-25s duration
└──────────────┬────────────────┘
               │
       ┌───────┴───────────────────────┐
       ▼                               ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ Remotion Interactive Preview  │ │ Local Video Render Pipeline   │
│ - Live scrubbing player       │ │ - Remotion headless render    │
│ - Scene tweaking & text edits │ │ - Best-frame poster extract   │
│ - Sound & music sync          │ │ - Frame 0 FFmpeg bake         │
└───────────────────────────────┘ │ - Share copy generator        │
                                  └──────────────┬────────────────┘
                                                 ▼
                                  [ marcutie.mp4 + poster.jpg + share-copy.txt ]
```

## State Machine: Video Generation Lifecycle

```
[ IDLE / INPUT ]
       │
       ▼ (User submits prompt/image)
[ PARSING_INPUT ] ──► (Uploading image to local server)
       │
       ▼
[ AI_GENERATING_STORYBOARD ] ──► (Multimodal AI call via BYOK)
       │
       ▼
[ VALIDATING_MARKETING_RULES ] ──► (Verify hook duration, reading time floors)
       │
       ▼
[ STORYBOARD_READY ] ◄──► [ EDITING_SCENES ] (User inspects & tweaks scenes/audio)
       │
       ▼ (User clicks "Render Video")
[ RENDERING_LOCALLY ] ──► (Remotion local render to MP4)
       │
       ▼
[ EXTRACTING_POSTER ] ──► (Extract peak settled frame to poster.jpg)
       │
       ▼
[ BAKING_FRAME_ZERO ] ──► (FFmpeg overlay poster onto frame 0)
       │
       ▼
[ COMPLETED / READY_FOR_SHARE ] (Download MP4, view poster, copy social captions)
```

## Data Schema: Storyboard JSON Contract

```typescript
type DeviceFrame = "macos" | "mobile";

interface Storyboard {
  title: string;
  tone: "default" | "polished" | "yc-parody" | "chaotic" | "deadpan" | "cinematic" | "app-store";
  aspectRatio: "16:9" | "9:16" | "1:1";
  totalDurationFrames: number;
  fps: number; // default 30
  deviceFrame?: DeviceFrame; // "macos" (landscape Chrome) | "mobile" (portrait smartphone)
  imageDimensions?: { width: number; height: number; aspectRatio: number };
  audio: {
    musicTrack: string;
    volume: number;
    duckingMoments: Array<{ fromSec: number; toSec: number; volume: number }>;
  };
  scenes: Array<
    | HookScene
    | ProductRevealScene
    | HighlightBeatScene
    | PunchlineOutroScene
  >;
  shareCopy: {
    twitter: string;
    linkedin: string;
    discord: string;
  };
}
```

## Adaptive Device Classifier Logic Flow

```
[ User Input (Prompt + Uploaded Image) ]
               │
               ├─────────────────────────────────────────────┐
               ▼                                             ▼
     [ Has Uploaded Image? ]                       [ Prompt Keyword Scan ]
     ├── Yes: Compute Aspect Ratio                 ├── Mobile keywords (iOS, Android, iPhone, App Store, tap, swipe)
     │   ├── Ratio < 0.95 (Portrait/Phone)         └── Desktop keywords (SaaS, dashboard, Chrome, web app, admin)
     │   │   └── Result: "mobile"
     │   └── Ratio > 1.05 (Landscape/Laptop)
     │       └── Result: "macos"
     └── No / Square (~1.0):
         └── Evaluate Prompt Keyword Score (mobile > desktop ? "mobile" : "macos")
               │
               ▼
   [ Final Device Framing ] ──► "macos" (Chrome window) OR "mobile" (iPhone bezel)
```

## Brand Style Transfer & Feature Synthesizer Logic Flow

```
[ Uploaded Screenshot / Photo ]
              │
              ▼
    [ Palette Extractor ] (Buffer sampling & hue quantization)
              │
              ▼
   { primary, secondary, accent, surface, text }
              │
              ├────────────────────────────────────────┐
              ▼                                        ▼
   [ Prompt Feature Classifier ]             [ FeatureScreenSynthesizer ]
   (Detects kanban, chat, checkout,          (Renders themed UI mockup into
    analytics, feed, settings)                AdaptiveDeviceFrame inside
              │                               ProductRevealScene)
              ▼                                        │
   [ FeatureMockup Contract ]                          ▼
   (title, subtitle, items, badges) ──────────► [ Live Video Scene ]
```

## HTML/CSS Synthesis vs Direct Screenshot Pipeline

```
[ User Input (Screenshot / Prompt) ]
              │
              ▼
    [ Screen Mode Switch ] ──► ("mockup" [Synthesized HTML/CSS] vs "screenshot" [Raw Capture])
              │
              ├── "mockup" (Synthesized HTML/CSS):
              │    ├── Extract Palette & Design Tokens
              │    ├── Generate HTML/CSS Feature Markup & CSS Variables
              │    ├── Interactive Code Inspector (Live Preview & Edit)
              │    └── Mount in Adaptive Device Frame
              │
              └── "screenshot" (Direct Capture):
                   └── Mount Raw Upload Image in Adaptive Device Frame
```

## Kokoro Local Voiceover & Audio Ducking Engine

```
[ Storyboard Script / User Edit ]
              │
              ▼
   [ POST /api/generate-voiceover ]
              │
              ▼
   [ Local Kokoro-82M TTS CLI ] (`npx hyperframes tts --voice <id> -o voiceover.wav`)
              │ (fallback to OpenAI TTS if local fails)
              ▼
   [ Audio Asset Registry ] (/uploads/voiceovers/vo_<id>.wav)
              │
              ▼
   [ Remotion Audio Mixer ] ──► Voiceover Narration Track
              │                 ├── Duck BGM to 0.15 during narration
              │                 └── Restore BGM on completion
              ▼
   [ Synchronized Video Render ]
```

## One-Click Finished Launch Video Flow

```
[ User Input (Prompt + Pre-Flight Studio Settings) ]
              │
              ▼ (Single Click: "Generate Finished Launch Video")
┌──────────────────────────────────────────────────────────┐
│ Step 1: Multimodal Storyboard + Script Generation         │
│         - Theme palette & HTML/CSS feature generation    │
│         - Auto voice/music selection                     │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ Step 2: Upfront Kokoro TTS Synthesis & Timing Sync       │
│         - Generate voiceover WAV                         │
│         - Auto-sync scene hold durations to speech timing│
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ Step 3: Headless Remotion Video Render (Local MP4)        │
│         - Mix upbeat track, voiceover, ducking & SFX     │
│         - Extract settled poster.jpg & bake frame 0      │
│         - Generate platform social copy                  │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ Finished Product Hero View                               │
│ - Playable rendered MP4 with full synced audio           │
│ - Instant One-Click MP4 Download                         │
│ - Settled Poster Download                                │
│ - One-Click Social Copy Tabs (X / LinkedIn / Discord)    │
│ - Option to open Storyboard Inspector for deep tweaking  │
└──────────────────────────────────────────────────────────┘
```

## Kinetic Subtitle & Caption Timing Flow

```
[ Narration Script / Scene Copy ]
              │
              ▼
[ Word Timing Interpolation Engine ]
   ├── Break script into word & phrase tokens
   ├── Allocate frame spans proportional to syllables & word length
   └── Account for punctuation hold pauses (. , ! ?)
              │
              ▼ { word, startFrame, endFrame }[]
[ Remotion KineticCaptions Overlay Layer ]
   ├── Reads composition active frame
   ├── Selects current phrase window
   ├── Applies Spring Dynamics to active word (@remotion/core spring)
   └── Renders selected aesthetic:
         ├── karaoke-bounce: 1.25x scale pop + glowing accent color
         ├── clean-pill: Frosted glass badge with smooth highlight
         ├── cyber-glow: Neon stroke pulse + brand glow
         └── minimal: High-contrast crisp typography
              │
              ▼
[ Burned cleanly into Live Preview & Final Export MP4 ]
```

## Visual Theme Engine Pipeline

```
[ Active Theme Selection: apple-clean | neo-brutalist | cyberpunk-scanlines | aurora-glass ]
              │
              ├── apple-clean: Pure white/alabaster (#fbfbfd), dark text, subtle 1px gray borders
              ├── neo-brutalist: 6px solid black drop shadow, 3px solid borders, vibrant flat fills
              ├── cyberpunk-scanlines: Procedural CRT scanline shader, chromatic flicker, green/cyan glow
              └── aurora-glass: Multi-radial gradient mesh, frosted backdrop blur, specular rims
              │
              ▼
[ Injected into Remotion Scenes & Adaptive Overlays ]
              │
              ▼
[ Rendered consistently in Live Scrubbing Player & Headless Video ]
```

## Two-Pass Animated GIF Export Flow

```
[ Finished MP4 Video (data/renders/:jobId/marcutie_video.mp4) ]
              │
              ▼ (POST /api/render/:jobId/gif)
[ Pass 1: FFmpeg Palette Generation ]
   └── ffmpeg -i video.mp4 -vf "fps=15,scale=720:-1:flags=lanczos,palettegen=max_colors=128" palette.png
              │
              ▼
[ Pass 2: Palette Mapping & Dithered Synthesis ]
   └── ffmpeg -i video.mp4 -i palette.png -lavfi "fps=15,scale=720:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer" marcutie_preview.gif
              │
              ▼
[ Cached at data/renders/:jobId/marcutie_preview.gif ]
              │
              ▼
## Frontend Architecture: Obsidian Studio Design System

```
[ Obsidian Studio UI System (src/index.css) ]
              │
              ├── Surfaces: Base (#08090d), Surface 1 (#0e1118), Surface 2 (#141822), Surface 3 (#1a202d)
              ├── Accents: Electric Indigo (#6366f1) + Laser Cyan (#06b6d4) + Emerald (#10b981) + Solar Amber (#f59e0b)
              ├── Fluid Springs: Apple critically damped settle (cubic-bezier(0.16, 1, 0.3, 1))
              ├── Ergonomics: Zero layout thrash, direct manipulation active states, WCAG 2.2 AA focus rings & 44px touch targets
              └── Split Workspace: Director Input Deck (Left) & Studio Synthesis Rack (Right) + Docked Command Strip
```
