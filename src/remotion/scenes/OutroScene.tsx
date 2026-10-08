import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateCardSlideUp, calculateSlamEntrance } from "../animations";

export function OutroScene({ scene, aspectRatio }: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        backgroundColor: "#070a13",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        padding: `0 ${paddingX}`,
      }}
    >
      {/* Background emerald/indigo ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "1300px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(99, 102, 241, 0.12) 45%, rgba(7, 10, 19, 0) 70%)",
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
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              boxShadow: "0 0 24px rgba(16, 185, 129, 0.25)",
              color: "#34d399",
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
            color: "#ffffff",
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            textShadow: "0 8px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.3)",
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
              color: "#94a3b8",
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
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 12px 35px rgba(16, 185, 129, 0.5), 0 0 25px rgba(16, 185, 129, 0.3)",
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
          color: "rgba(255, 255, 255, 0.4)",
          letterSpacing: "0.5px",
        }}
      >
        ✨ Built with Marcutie • Local-First Launch Generator
      </div>
    </AbsoluteFill>
  );
}
