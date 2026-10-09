import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateCardSlideUp, calculateSlamEntrance } from "../animations";

export function OutroScene({ scene, aspectRatio, themePalette }: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active theme tokens
  // Active theme tokens
  const palette = scene.themePalette || themePalette;
  const isDark = palette?.isDark !== false;
  const bg = palette?.background || "#070a13";
  const primary = palette?.primary || "#10b981";
  const accent = palette?.accent || "#059669";
  const textColor = palette?.text || (isDark ? "#ffffff" : "#0f172a");
  const subtextColor = isDark ? "#94a3b8" : "#475569";
  const titleTextShadow = isDark
    ? `0 8px 40px rgba(0, 0, 0, 0.8), 0 0 35px ${primary}40`
    : `0 2px 14px rgba(0, 0, 0, 0.08)`;
  const watermarkColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)";

  const titleAnim = calculateSlamEntrance(frame, fps, 0);
  const ctaAnim = calculateSlamEntrance(frame, fps, 8);
  const subtextAnim = calculateCardSlideUp(frame, fps, 14);

  // Subtle breathing pulse for CTA button
  const ctaPulse = 1 + Math.sin(frame / 6) * 0.04;

  const isVertical = aspectRatio === "9:16";
  const titleSize = isVertical ? "54px" : aspectRatio === "1:1" ? "52px" : "72px";
  const ctaFontSize = isVertical ? "26px" : "28px";
  const paddingX = isVertical ? "60px" : "120px";

  const ctaText = scene.cta || "Get Started Today";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        padding: `0 ${paddingX}`,
      }}
    >
      {/* Background ambient glow tailored to brand colors */}
      <div
        style={{
          position: "absolute",
          width: "1300px",
          height: "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}38 0%, ${accent}18 45%, rgba(0, 0, 0, 0) 70%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "1300px",
          zIndex: 10,
        }}
      >
        {/* Outro Badge */}
        <div
          style={{
            transform: `scale(${titleAnim.scale})`,
            opacity: titleAnim.opacity,
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 22px",
              borderRadius: "999px",
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
              boxShadow: `0 0 24px ${accent}33`,
              color: isDark ? accent : primary,
              fontSize: "15px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            <span>🚀</span>
            <span>{scene.visualEmphasis || "THE LAUNCH"}</span>
          </div>
        </div>

        {/* Punchline Headline */}
        <h2
          style={{
            margin: "0 0 28px 0",
            fontSize: titleSize,
            fontWeight: "900",
            color: textColor,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            textShadow: titleTextShadow,
            transform: `scale(${titleAnim.scale})`,
            opacity: titleAnim.opacity,
          }}
        >
          {scene.headline}
        </h2>

        {/* Supporting Line */}
        {scene.subtext && (
          <p
            style={{
              margin: "0 0 36px 0",
              fontSize: isVertical ? "24px" : "28px",
              color: subtextColor,
              maxWidth: "900px",
              lineHeight: 1.4,
              transform: `translateY(${subtextAnim.translateY}px)`,
              opacity: subtextAnim.opacity,
            }}
          >
            {scene.subtext}
          </p>
        )}

        {/* Pulsing CTA Action Button */}
        <div
          style={{
            transform: `scale(${ctaAnim.scale * ctaPulse})`,
            opacity: ctaAnim.opacity,
            marginTop: "8px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: isVertical ? "20px 48px" : "22px 64px",
              borderRadius: "999px",
              background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
              boxShadow: `0 12px 35px ${primary}55, 0 0 25px ${accent}40`,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#ffffff",
              fontSize: ctaFontSize,
              fontWeight: "900",
              letterSpacing: "-0.5px",
              cursor: "pointer",
            }}
          >
            <span>{ctaText}</span>
            <span style={{ fontSize: "28px" }}>→</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? "60px" : "40px",
          fontSize: "14px",
          fontWeight: "600",
          color: watermarkColor,
          letterSpacing: "0.5px",
        }}
      >
        ✨ Built with Marcutie • Local-First Launch Generator
      </div>
    </AbsoluteFill>
  );
}
