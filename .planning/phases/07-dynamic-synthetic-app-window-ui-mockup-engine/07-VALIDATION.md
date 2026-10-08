# Phase 7 Validation & Acceptance Checkpoints

## Core Criteria
1. **Adaptive Device Framing Detection**:
   - Prompts with mobile terminology ("iOS", "iPhone", "Android", "mobile app", "App Store") classify as `"mobile"`.
   - Prompts with SaaS/desktop terminology ("SaaS", "dashboard", "Chrome", "web app", "desktop", "analytics") classify as `"macos"`.
   - Uploaded photos with portrait aspect ratio (< 0.95) classify as `"mobile"`.
   - Uploaded photos with landscape aspect ratio (> 1.05) classify as `"macos"`.
   - User can manually toggle between `"macos"` and `"mobile"` in the Storyboard Inspector.

2. **Visual Fidelity & Device Shells**:
   - macOS Chrome frame includes traffic lights (🔴🟡🟢), URL pill, dark window chrome, and drop shadow.
   - Mobile Phone frame includes curved titanium chassis, status bar (9:41, wifi, battery), Dynamic Island notch, and bottom gesture pill.
   - 3D gyro tilt and camera push-in zoom animations operate smoothly on the device frame.

3. **Prompt-Only Synthetic Mockups**:
   - In macOS mode without an uploaded image: renders a simulated SaaS dashboard with sidebar, search header, 3 KPI cards with sparklines, polyline area chart, and recent activity list.
   - In mobile mode without an uploaded image: renders a simulated mobile app screen with header, hero metric, quick actions, feed cards, and bottom tab bar.

4. **Uploaded Image Fitting**:
   - Uploaded phone screenshots sit naturally inside the phone frame without distortion.
   - Uploaded desktop screenshots sit naturally inside the macOS browser frame without distortion.

## Verification Commands
```bash
node --test tests/deviceClassifier.test.js
node --test tests/deviceFrame.test.js
npm test
npm run build
```
