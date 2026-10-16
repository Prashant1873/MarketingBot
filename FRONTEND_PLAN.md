# Frontend Implementation Plan: Marcutie Creative Director Suite

## Target Mode: Operate / Experience
## Design Read: "High-precision creative director suite for developers, founders, and growth marketers. Tactile obsidian and graphite surfaces, crisp laser typography, warm solar and emerald telemetry indicators, and fluid Apple spring physics that feel alive under the cursor."
## Active Dials: Variance: 8 | Motion: 7 | Density: 6

### Chunk 1: Recon & Strategy (ux-laws, taste-skill, pick-ui-library)
- [x] Task 1.1: Stack inspection & token audit (purged AI-slop violet gradients, established Obsidian Studio design tokens in `index.css`)
- [x] Task 1.2: UX laws friction scan (Hick's Law tabbed studio rack, Jakob's mental model for timeline & previews, Miller's law chunking)
- [x] Task 1.3: Curated aesthetic architecture & typography pairings (`Plus Jakarta Sans` + `JetBrains Mono` tabular metrics)

### Chunk 2: Direction & Scaffolding (prototype, distill)
- [x] Task 2.1: Stripped visual noise, generic border glows, and nested card clutter (`distill`)
- [x] Task 2.2: Established clean layout axes: Director Control Deck (Left) & Studio Synthesis Rack (Right) + Docked Command Strip
- [x] Task 2.3: Redesigned Header with tactile telemetry status, active engine version, and accessible key badge

### Chunk 3: Production Engineering (frontend-ui-engineering)
- [x] Task 3.1: Modernized `PromptInput` with quick-trigger inspiration chips, character telemetry, and clear ergonomics
- [x] Task 3.2: Rebuilt `ImageDropzone` with responsive mockup preview, drag-and-drop spring states, and high-contrast toggle
- [x] Task 3.3: Re-architected `PreFlightStudioPanel` into high-density ergonomic tabs (Creative Tone, Aesthetic Engine, Voiceover, Soundscape)
- [x] Task 3.4: Re-engineered `FinishedVideoHero` and `VideoPlayerPreview` with professional studio playback bar, download actions, and direct inspection triggers
- [x] Task 3.5: Modernized `OneClickProgressModal`, `SettingsModal`, and `ExportModal` with crisp dialog mechanics

### Chunk 4: Fluid Physics & Gestures (apple-design)
- [x] Task 4.1: Eliminated pointer lag with active `:active` states on pointer-down (`transform: scale(0.98)`)
- [x] Task 4.2: Replaced tacky bounce curves with Apple fluid spring physics (damping 1.0 settling `cubic-bezier(0.16, 1, 0.3, 1)`)
- [x] Task 4.3: Hardware-accelerated transitions via `transform` and `opacity` (eliminated `transition: width/height` layout thrashing)

### Chunk 5: Hardening & A11y (audit, harden)
- [x] Task 5.1: WCAG 2.2 AA keyboard focus rings (`focus-visible`) and semantic `<button>` / `<label>` bindings
- [x] Task 5.2: Minimum 44x44px touch targets across all chips, toggles, icon buttons, and slider thumbs
- [x] Task 5.3: Error states, empty states, and responsive breakpoint adaptation (grid down to single column on mobile)

### Chunk 6: Impeccable Polish (polish, craft-floor)
- [x] Task 6.1: Sub-pixel alignment, 4px/8px spatial rhythm, and optical baseline balancing
- [x] Task 6.2: Passed AST antipattern verification gate (`detect-antipatterns.mjs`) with 0 antipatterns
- [x] Task 6.3: Verification of build (`npm run build`) and regression tests (`npm test` passed 68/68)

### Chunk 7: Tactile Buttons & Physical Toggles Overhaul (reference/buttons.md)
- [x] Task 7.1: Implement physical Poisson volume compression (`scale(1.03, 0.94)`) and directional specular lighting for `.btn-primary`, `.btn-secondary`, `.btn-ghost`, and `.btn-destructive` in `src/index.css`
- [x] Task 7.2: Create unified `.studio-segmented` and `.studio-segmented-btn` with elevated active pills and spring feedback in `src/index.css`
- [x] Task 7.3: Create `.studio-switch` physical toggle switch with glowing active track, sliding spring thumb, and elastic press stretch in `src/index.css`
- [x] Task 7.4: Upgrade toggles & buttons in `PreFlightStudioPanel.tsx` (replace text buttons with `.studio-switch` for Voiceover & Subtitles, polish tab & mode buttons)
- [x] Task 7.5: Upgrade toggles in `DirectorViewportStage.tsx` (Aspect ratio, Device Frame, Duration segmented rails)
- [x] Task 7.6: Upgrade controls in `ImageDropzone.tsx`, `Header.tsx`, `App.tsx` (Docked footer actions & preset chips), and `VideoPlayerPreview.tsx`
- [x] Task 7.7: Run AST antipattern verification (`detect-antipatterns.mjs`) & production build (`npm run build`)

### Chunk 8: Perceptual Color & Hue-Tinted Atmosphere (reference/colorize.md)
- [x] Task 8.1: Eliminate flat un-tinted AI grays with hue-tinted twilight obsidian tokens (`--bg-primary`, `--bg-surface-1/2/3`, `--bg-elevated`) in `src/index.css`
- [x] Task 8.2: Calibrate hue-tinted borders (`--border-subtle`, `--border-medium`, `--border-strong`) and high-contrast typography (`--text-secondary: #9bb0cc`, `--text-muted: #627595`)
- [x] Task 8.3: Enhance atmospheric radial mesh illumination in `body` and `.studio-hero-banner`
- [x] Task 8.4: Harmonize telemetry status glows (`--success`, `--warning`, `--danger`, `--accent-glow`) with calibrated contrast ratios
- [x] Task 8.5: Run AST antipattern verification (`detect-antipatterns.mjs`) & production build (`npm run build`)

### Chunk 9: Editorial Typographic Hierarchy & Purge Pills/Eyebrows (reference/editorial.md, reference/distill.md)
- [x] Task 9.1: Redefine `.studio-badge` in `src/index.css` from `radius-full` capsule to crisp architectural tag (`radius-xs: 4px`), eliminating lozenge pills
- [x] Task 9.2: Strip floating pill badge & uppercase kicker from hero section in `src/App.tsx`; replace with asymmetric editorial headline & natural lead copy
- [x] Task 9.3: Remove uppercase eyebrow kickers and convert Blueprint summary pills in `src/App.tsx` into a high-density architectural telemetry readout
- [x] Task 9.4: Clean up `Header.tsx` (remove floating badge next to title, replace server status pill with precision instrument gauge) and `PromptInput.tsx` (tactile buttons instead of pills)
- [x] Task 9.5: Purge floating capsule pills and uppercase kickers from `DirectorViewportStage.tsx`, `FinishedVideoHero.tsx`, `ImageDropzone.tsx`, and `OneClickProgressModal.tsx`
- [x] Task 9.6: Remove uppercase eyebrow tracking and capsule radii from section headers in `PreFlightStudioPanel.tsx` and `StoryboardInspector.tsx`
- [x] Task 9.7: Run AST antipattern detector (`detect-antipatterns.mjs`) and production build (`npm run build`)

### Chunk 10: Fluid Stretch-and-Squish Segmented Rails (reference/buttons.md, reference/animate.md)
- [x] Task 10.1: Add `.studio-fluid-indicator` and `.studio-fluid-btn` CSS in `src/index.css` with Poisson volume compression and transparent button surfaces
- [x] Task 10.2: Rebuild `src/components/FluidSegmentedControl.tsx` with native Web Animations API (WAAPI) engine: keyframe-driven bridging stretch across departing and destination bounds at 38% transit with `scaleY(0.82)` squish, 78% critically-damped spring settle, and 0-latency pointer click dispatch
- [x] Task 10.3: Upgrade 3-option format selectors in `DirectorViewportStage.tsx` (Aspect Ratio: 16:9 / 9:16 / 1:1, Device Frame: Auto / Mac / Phone, Target Duration: 15s / 20s / 25s) with `FluidSegmentedControl`
- [x] Task 10.4: Upgrade Pre-Flight studio menu tab strip with 5 dedicated tabs (Creative, Tone, Brand & Visuals, Voiceover, Music & Audio), Aspect Ratio, Duration, Render Mode, and Device Frame in `PreFlightStudioPanel.tsx`
- [x] Task 10.5: Upgrade render mode in `ImageDropzone.tsx`, aspect ratio in `VideoPlayerPreview.tsx`, and social platform tabs in `FinishedVideoHero.tsx`
- [x] Task 10.6: Run AST antipattern detector and production build (`npm run build`)

### Chunk 11: Light Mode Architecture & Perceptual Contrast Token System (reference/colorize.md)
- [x] Task 11.1: Build complete `[data-theme="light"]` token architecture in `src/index.css` (hue-tinted porcelain canvas `#f8fafc`, elevated pure-white `#ffffff` and `#f1f5f9` surfaces, deep ink `#090d16` text with 18.5:1 contrast, `#334155` secondary text with 9.4:1 contrast, `#475569` muted text with 6.9:1 contrast)
- [x] Task 11.2: Calibrate light mode borders (`rgba(15, 23, 42, 0.12)` subtle, `rgba(15, 23, 42, 0.2)` medium, `rgba(15, 23, 42, 0.35)` strong) and atmospheric radial mesh lighting for light mode
- [x] Task 11.3: Calibrate telemetry status colors for light mode (`--success: #059669`, `--warning: #d97706`, `--danger: #e11d48`) with guaranteed $\ge 4.5:1$ contrast against light canvas
- [x] Task 11.4: Define smooth CSS color transitions for instant, flicker-free theme switching

### Chunk 12: Theme Switcher & System Integration (reference/craft-floor.md)
- [x] Task 12.1: Implement theme state hook with `localStorage` persistence and `prefers-color-scheme` initial detection in `App.tsx`
- [x] Task 12.2: Add tactile Theme Switcher button in `Header.tsx` with Sun/Moon icons, smooth rotational spring animation, and accessible ARIA attributes
- [x] Task 12.3: Ensure docked strip, modals, and tooltips automatically sync with active theme

### Chunk 13: Buttons & Toggles High-Contrast Overhaul (reference/buttons.md)
- [x] Task 13.1: Perfect contrast for `.btn-primary` in dark mode (`#ffffff` on `#6366f1` 6.29:1) and light mode (`#ffffff` on `#4f46e5` 6.29:1) with specular highlight
- [x] Task 13.2: Perfect contrast for `.btn-secondary` in dark mode (`#f8fafc` on `#101526` 8.2:1) and light mode (`#090d16` on `#ffffff` 18.5:1 with `#cbd5e1` tactile border)
- [x] Task 13.3: Perfect contrast for `.btn-ghost` and `.btn-destructive` across both dark and light modes
- [x] Task 13.4: Overhaul `.studio-switch` track and thumb contrast for both On and Off states in light and dark mode with tactile Poisson volume stretch
- [x] Task 13.5: Upgrade `FluidSegmentedControl` indicator variants and text color logic ensuring `variant-default` text uses `var(--text-primary)` in light mode instead of hardcoded white

### Chunk 14: Platform-Wide Hardcoded Color Purge & Modal Consistency
- [x] Task 14.1: Eliminate hardcoded `#ffffff` text in `PreFlightStudioPanel.tsx`, replacing with `var(--text-primary)`
- [x] Task 14.2: Eliminate hardcoded `#ffffff` text in `FinishedVideoHero.tsx`, `AudioControls.tsx`, and `StoryboardInspector.tsx`
- [x] Task 14.3: Modernize `ExportModal.tsx` to use semantic `.modal-backdrop`, `.modal-content`, and tokens instead of hardcoded dark classes
- [x] Task 14.4: Ensure dropdowns, color inputs, and textareas have high-contrast text and backgrounds in both modes

### Chunk 15: Apple Fluid Spring Motion & Animations (reference/animate.md)
- [x] Task 15.1: Add smooth section entrance choreography `studioFadeInUp` with Apple critically damped curve `cubic-bezier(0.16, 1, 0.3, 1)`
- [x] Task 15.2: Add live telemetry pulse keyframe animation for server status & voiceover active indicators
- [x] Task 15.3: Add interactive hover spring feedback and micro-interactions on cards, chips, and modals
- [x] Task 15.4: Implement strict `prefers-reduced-motion` overrides for accessibility

### Chunk 16: Verification & Final Polish
- [x] Task 16.1: Run `detect-antipatterns.mjs` mechanical AST detector on all modified files
- [x] Task 16.2: Verify production build (`npm run build`) and regression test suite (`npm test`)



