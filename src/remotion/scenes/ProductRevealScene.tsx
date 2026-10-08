import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateCardSlideUp, calculateGyroTilt, calculateSlamEntrance } from "../animations";

export function ProductRevealScene({ scene, aspectRatio, imageUrl }: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const headerAnim = calculateCardSlideUp(frame, fps, 0);
  const cardAnim = calculateSlamEntrance(frame, fps, 4);
  const gyro = calculateGyroTilt(frame, fps);

  // Slow camera push-in zoom over scene duration
  const pushZoom = 1 + (frame / (fps * 6)) * 0.08;

  const isVertical = aspectRatio === "9:16";
  const titleSize = isVertical ? "48px" : aspectRatio === "1:1" ? "46px" : "58px";
  const cardWidth = isVertical ? "780px" : aspectRatio === "1:1" ? "740px" : "820px";
  const cardHeight = isVertical ? "920px" : aspectRatio === "1:1" ? "680px" : "560px";

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
      }}
    >
      {/* Background ambient light */}
      <div
        style={{
          position: "absolute",
          width: "1400px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(13, 19, 34, 0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Headline & Subtitle */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "1200px",
          padding: "0 40px",
          marginBottom: isVertical ? "40px" : "32px",
          zIndex: 10,
          transform: `translateY(${headerAnim.translateY}px)`,
          opacity: headerAnim.opacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#818cf8",
            marginBottom: "10px",
          }}
        >
          {scene.visualEmphasis || "INTRODUCING"}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: titleSize,
            fontWeight: "900",
            color: "#ffffff",
            letterSpacing: "-1px",
            lineHeight: 1.15,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          {scene.headline}
        </h2>
      </div>

      {/* 3D Floating Product Card Container */}
      <div
        style={{
          transform: `scale(${cardAnim.scale * pushZoom})`,
          opacity: cardAnim.opacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: "24px",
            background: "rgba(13, 19, 34, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(99, 102, 241, 0.35)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: gyro.transform,
            transition: "transform 0.1s ease-out",
          }}
        >
          {imageUrl ? (
            <Img
              src={imageUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "24px",
              }}
            />
          ) : (
            /* Sleek Mockup Device Frame if prompt-only mode */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.5)",
                }}
              >
                ✨
              </div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>
                {scene.headline}
              </div>
              {scene.subtext && (
                <div style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "480px" }}>
                  {scene.subtext}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}
