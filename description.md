# Fluid Stretch-and-Squish Segmented Control Specification

## Overview
This specification details the architecture, physical mechanics, and implementation of a physical stretch-and-squish animation pattern for multi-option segmented controls and tab bars. Instead of traditional sliding pills or instant state toggles, the active indicator behaves like an elastic band: stretching across the departing and target options mid-transit, compressing in perpendicular volume, and snapping into its new resting state.

## Core Problem
Standard segmented controls and tab bars exhibit one of two UX failure modes:
1. Instantaneous switching: Changes happen immediately without spatial continuity, making it hard for users to perceive where their focus moved.
2. Rigid sliding pills: The indicator translates across the rail with fixed dimensions, looking mechanical rather than organic and tactile.

## Physical Motion Model
The stretch-and-squish pattern simulates a viscoelastic body under tension:
1. Anchorage and Extension: When a new option is selected, the leading edge of the indicator immediately travels to the target boundary, while the trailing edge remains anchored to the departing option.
2. Peak Elongation (Bridging): At approximately 35% to 40% of the transition duration, the indicator bridges both options simultaneously. Its width expands to cover the entire distance from the departure start to the arrival end.
3. Poisson Volume Preservation: When an elastic material stretches along one axis, it contracts along the perpendicular axis. As horizontal width expands, vertical scale compresses (scaleY 0.80 to 0.84) to preserve perceived visual mass.
4. Release and Contraction: Between 40% and 75% of transit, the trailing edge releases and accelerates toward the destination boundary.
5. Critically Damped Settle: The indicator reaches the destination bounds with an Apple-standard critically damped curve (cubic-bezier 0.16, 1, 0.3, 1), rebounds slightly (scaleY 1.04), and settles at rest (scaleY 1.0).

## Mathematical Formulation

Let:
- departureRect = { left: L0, right: R0, width: W0, height: H0 }
- arrivalRect = { left: L1, right: R1, width: W1, height: H1 }

### Forward Travel (Moving Left to Right, L1 > L0)
- 0% (Departure):
  left = L0
  width = W0
  transform = scaleY(1.0)
- 38% (Peak Bridge & Squish):
  left = L0
  width = R1 - L0
  transform = scaleY(0.82)
- 78% (Contraction & Rebound):
  left = L1
  width = W1
  transform = scaleY(1.04)
- 100% (Settled):
  left = L1
  width = W1
  transform = scaleY(1.0)

### Backward Travel (Moving Right to Left, L1 < L0)
- 0% (Departure):
  left = L0
  width = W0
  transform = scaleY(1.0)
- 38% (Peak Bridge & Squish):
  left = L1
  width = R0 - L1
  transform = scaleY(0.82)
- 78% (Contraction & Rebound):
  left = L1
  width = W1
  transform = scaleY(1.04)
- 100% (Settled):
  left = L1
  width = W1
  transform = scaleY(1.0)

## Layering and DOM Hierarchy
A functional implementation requires a strict 3-tier DOM stack:
1. Container Rail:
   - position: relative
   - display: inline-flex or flex
   - overflow: hidden or isolation: isolate
2. Floating Indicator Layer:
   - position: absolute
   - z-index: 1
   - pointer-events: none
   - will-change: left, width, transform
   - Elevated background (gradients, borders, soft shadow)
3. Interactive Option Buttons:
   - position: relative
   - z-index: 2
   - background: transparent !important
   - border: transparent
   - Labels and icons remain legible above the indicator

## Technical Engine Architecture

### Why Native Web Animations API (WAAPI)
Relying solely on CSS transitions on left/right edges introduces race conditions:
- Pre-change computed style: If an idle indicator has transition: none, modifying coordinates and transition classes in the same frame causes browsers to skip the transition entirely.
- ResizeObserver collisions: Layout observers firing immediately on attachment can clear transition attributes before paint.
- Interruptions: Rapid successive clicks require smooth cancellation and re-targeting from current mid-flight coordinates.
WAAPI (element.animate) executes directly on the browser compositor thread, accepts exact measured pixel keyframes, and cleanly supports animation.cancel().

### Event and Lifecycle Pipeline
1. Immediate Pointer Down / Click:
   - Measure active button rect and clicked button rect relative to container.
   - Cancel any running animation.
   - Invoke element.animate() with computed trajectory.
   - Set resting style properties immediately so layout settles if animation completes or interrupts.
   - Dispatch value change to state store / parent component.
2. External State Changes:
   - When the controlled value updates programmatically (keyboard shortcuts, form resets, presets), run the same trajectory calculation from the current active element to the new target element.
3. Responsive Window Resizes:
   - Attach a ResizeObserver to the container.
   - On resize, update indicator resting coordinates directly without invoking the stretch-and-squish keyframes.

## Accessibility and Semantics
- Semantic Roles: Use role="tablist" with role="tab" for navigation views, or role="radiogroup" with role="radio" for form inputs.
- State Reflection: Bind aria-selected="true|false" or aria-checked="true|false".
- Keyboard Traversal: ArrowLeft, ArrowRight, Home, and End keys navigate between options and trigger the stretch animation toward the newly focused option.
- Reduced Motion: Check window.matchMedia('(prefers-reduced-motion: reduce)'). If active, bypass the bridging keyframes and update coordinates directly.
