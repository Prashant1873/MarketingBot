import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateSlamEntrance, calculateCardSlideUp } from "../animations";

export function HookScene({ scene, aspectRatio, themePalette }: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active theme tokens
  const palette = scene.themePalette || themePalette;
  const isDark = palette?.isDark !== false;
  const bg = palette?.background || "#070a13";
  const primary = palette?.primary || "#6366f1";
  const accent = palette?.accent || "#a855f7";
  const textColor = palette?.text || (isDark ? "#ffffff" : "#0f172a");
  const subtextColor = isDark ? "#94a3b8" : "#475569";
  const textShadowStyle = isDark
    ? `0 10px 40px rgba(0, 0, 0, 0.8), 0 0 35px ${primary}40`
    : `0 2px 16px rgba(0, 0, 0, 0.08)`;

  // Entrance animations
  const badgeAnim = calculateSlamEntrance(frame, fps, 0);
  const titleAnim = calculateSlamEntrance(frame, fps, 3);
  const subtextAnim = calculateCardSlideUp(frame, fps, 12);

  // Background subtle breathing pulse
  const bgPulse = 1 + Math.sin(frame / 8) * 0.05;

  // Responsive font sizes based on aspect ratio
  const titleFontSize = aspectRatio === "9:16" ? "56px" : aspectRatio === "1:1" ? "54px" : "76px";
  const subtextFontSize = aspectRatio === "9:16" ? "26px" : aspectRatio === "1:1" ? "24px" : "32px";
  const paddingX = aspectRatio === "9:16" ? "60px" : "120px";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Ambient radial glow background tailored to brand colors */}
      <div
        style={{
          position: "absolute",
          width: "1200px",
          height: "1200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}40 0%, ${accent}18 45%, rgba(0, 0, 0, 0) 70%)`,
          transform: `scale(${bgPulse})`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Main Content Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "1400px",
          padding: `0 ${paddingX}`,
          zIndex: 10,
        }}
      >
        {/* Hook Badge */}
        <div
          style={{
            transform: `scale(${badgeAnim.scale})`,
            opacity: badgeAnim.opacity,
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 24px",
              borderRadius: "999px",
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
              boxShadow: `0 0 24px ${accent}33`,
              color: isDark ? accent : primary,
              fontSize: "16px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            <span>⚡</span>
            <span>{scene.visualEmphasis || "ATTENTION"}</span>
          </div>
        </div>

        {/* Headline Slam */}
        <h1
          style={{
            margin: "0 0 24px 0",
            fontSize: titleFontSize,
            fontWeight: "900",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: textColor,
            textShadow: textShadowStyle,
            transform: `scale(${titleAnim.scale})`,
            opacity: titleAnim.opacity,
          }}
        >
          {scene.headline}
        </h1>

        {/* Subtext Fade */}
        {scene.subtext && (
          <p
            style={{
              margin: 0,
              fontSize: subtextFontSize,
              fontWeight: "500",
              lineHeight: 1.4,
              color: subtextColor,
              maxWidth: "1000px",
              transform: `translateY(${subtextAnim.translateY}px)`,
              opacity: subtextAnim.opacity,
            }}
          >
            {scene.subtext}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
}
