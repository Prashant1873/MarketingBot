import React from "react";
import { useCurrentFrame } from "remotion";
import { VisualTheme, ThemePalette } from "../../types";

export interface VisualThemeOverlayProps {
  theme?: VisualTheme;
  themePalette?: ThemePalette;
}

export const VisualThemeOverlay: React.FC<VisualThemeOverlayProps> = ({
  theme = "default-dark",
  themePalette,
}) => {
  const frame = useCurrentFrame();

  if (!theme || theme === "default-dark") {
    return null;
  }

  const primary = themePalette?.primary || "#6366f1";
  const accent = themePalette?.accent || "#38bdf8";

  // 1. Cyberpunk Scanlines & CRT Shader Overlay
  if (theme === "cyberpunk-scanlines") {
    // Subtle chromatic flicker using sine wave
    const flickerOpacity = 0.18 + 0.04 * Math.sin(frame * 0.8);

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 60,
          overflow: "hidden",
        }}
      >
        {/* Horizontal Scanlines Raster */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.45) 0px,
              rgba(0, 0, 0, 0.45) 1.5px,
              transparent 1.5px,
              transparent 4px
            )`,
            opacity: 0.7,
          }}
        />

        {/* CRT Phosphor Screen Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(
              circle at center,
              transparent 55%,
              rgba(0, 0, 0, 0.7) 85%,
              rgba(0, 0, 0, 0.95) 100%
            )`,
          }}
        />

        {/* Cyber Neon Top & Bottom HUD Grids */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "24px",
            right: "24px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            fontFamily: "monospace",
            color: `${accent}aa`,
            letterSpacing: "1px",
            opacity: 0.8,
            textShadow: `0 0 6px ${accent}`,
          }}
        >
          <span>SYS_STATUS: OPTIMAL // 60FPS</span>
          <span>REC [●] LIVE CANV</span>
        </div>

        {/* Subtle chromatic aberration border glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 40px ${primary}33, inset 0 0 80px ${accent}22`,
            opacity: flickerOpacity,
          }}
        />
      </div>
    );
  }

  // 2. Neo-Brutalist Dot Grid & Sharp Framing
  if (theme === "neo-brutalist") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 45,
          overflow: "hidden",
        }}
      >
        {/* Architectural Dot Matrix Background Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#000000 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
            opacity: 0.1,
            mixBlendMode: "multiply",
          }}
        />

        {/* Stark Outer Perimeter Framing Line */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "4px solid #000000",
            boxShadow: "6px 6px 0px #000000",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  // 3. Aurora Glassmorphism Ethereal Gradient Mesh
  if (theme === "aurora-glass") {
    // Smooth oscillating positions for the aurora blobs
    const shiftX1 = 30 + 15 * Math.sin(frame / 60);
    const shiftY1 = 25 + 10 * Math.cos(frame / 50);

    const shiftX2 = 70 + 15 * Math.cos(frame / 55);
    const shiftY2 = 65 + 12 * Math.sin(frame / 45);

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 15,
          overflow: "hidden",
        }}
      >
        {/* Aurora Blob 1 (Violet / Primary) */}
        <div
          style={{
            position: "absolute",
            top: `${shiftY1}%`,
            left: `${shiftX1}%`,
            width: "600px",
            height: "600px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${primary}55 0%, transparent 70%)`,
            filter: "blur(70px)",
            mixBlendMode: "screen",
          }}
        />

        {/* Aurora Blob 2 (Cyan / Secondary) */}
        <div
          style={{
            position: "absolute",
            top: `${shiftY2}%`,
            left: `${shiftX2}%`,
            width: "550px",
            height: "550px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}44 0%, transparent 70%)`,
            filter: "blur(65px)",
            mixBlendMode: "screen",
          }}
        />

        {/* Glass Specular Sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)",
          }}
        />
      </div>
    );
  }

  // 4. Apple Clean Light Keynote Canvas
  if (theme === "apple-clean") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 8,
          overflow: "hidden",
        }}
      >
        {/* Subtle Central Spotlight */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            width: "900px",
            height: "700px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(245,245,247,0.3) 55%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />

        {/* Crisp subtle keynote border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.03)",
          }}
        />
      </div>
    );
  }

  return null;
};
