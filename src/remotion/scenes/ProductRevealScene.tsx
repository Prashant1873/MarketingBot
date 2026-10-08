import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateCardSlideUp, calculateGyroTilt, calculateSlamEntrance } from "../animations";
import { AdaptiveDeviceFrame } from "../components/AdaptiveDeviceFrame";
import { FeatureScreenSynthesizer } from "../components/FeatureScreenSynthesizer";

export function ProductRevealScene({
  scene,
  aspectRatio,
  imageUrl,
  deviceFrame,
  themePalette,
  featureMockup,
}: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const headerAnim = calculateCardSlideUp(frame, fps, 0);
  const cardAnim = calculateSlamEntrance(frame, fps, 4);
  const gyro = calculateGyroTilt(frame, fps);

  // Slow camera push-in zoom over scene duration
  const pushZoom = 1 + (frame / (fps * 6)) * 0.08;

  const isVertical = aspectRatio === "9:16";
  const titleSize = isVertical ? "48px" : aspectRatio === "1:1" ? "46px" : "56px";
  const effectiveDeviceFrame = scene.deviceFrame || deviceFrame || "macos";

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
          marginBottom: isVertical ? "32px" : "24px",
          zIndex: 10,
          transform: `translateY(${headerAnim.translateY}px)`,
          opacity: headerAnim.opacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "13px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#818cf8",
            marginBottom: "8px",
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

      {/* 3D Floating Adaptive Product Card Container */}
      <div
        style={{
          transform: `scale(${cardAnim.scale * pushZoom})`,
          opacity: cardAnim.opacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: gyro.transform,
            transition: "transform 0.1s ease-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AdaptiveDeviceFrame
            deviceFrame={effectiveDeviceFrame}
            aspectRatio={aspectRatio}
            productTitle={scene.headline}
          >
            {imageUrl ? (
              <Img
                src={imageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#080b12",
                  padding: effectiveDeviceFrame === "mobile" ? "8px" : "16px",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <FeatureScreenSynthesizer
                featureMockup={scene.featureMockup || featureMockup}
                themePalette={scene.themePalette || themePalette}
                deviceFrame={effectiveDeviceFrame}
                title={scene.headline}
              />
            )}
          </AdaptiveDeviceFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
}
