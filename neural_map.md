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

