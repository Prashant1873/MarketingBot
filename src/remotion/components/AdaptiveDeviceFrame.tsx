import React from "react";
import { AspectRatio, DeviceFrame } from "../../types";

interface AdaptiveDeviceFrameProps {
  deviceFrame?: DeviceFrame;
  aspectRatio?: AspectRatio;
  children: React.ReactNode;
  productTitle?: string;
}

export const AdaptiveDeviceFrame: React.FC<AdaptiveDeviceFrameProps> = ({
  deviceFrame = "macos",
  aspectRatio = "16:9",
  children,
  productTitle = "Marcutie",
}) => {
  const isMobile = deviceFrame === "mobile";

  // Dimension scaling based on video aspect ratio and frame type
  const getFrameDimensions = () => {
    if (isMobile) {
      switch (aspectRatio) {
        case "9:16":
          // Vertical canvas (1080x1920) -> Heroic large phone
          return { width: 540, height: 1080, borderRadius: "52px", bezelWidth: "12px" };
        case "1:1":
          // Square canvas (1080x1080) -> Centered tall phone
          return { width: 400, height: 800, borderRadius: "46px", bezelWidth: "10px" };
        case "16:9":
        default:
          // Landscape canvas (1920x1080) -> Proportional floating phone
          return { width: 370, height: 740, borderRadius: "44px", bezelWidth: "10px" };
      }
    } else {
      switch (aspectRatio) {
        case "9:16":
          // Vertical canvas -> scaled desktop window
          return { width: 920, height: 560, borderRadius: "16px", bezelWidth: "0px" };
        case "1:1":
          // Square canvas -> compact desktop window
          return { width: 880, height: 530, borderRadius: "18px", bezelWidth: "0px" };
        case "16:9":
        default:
          // Landscape canvas -> expansive SaaS browser
          return { width: 1120, height: 650, borderRadius: "20px", bezelWidth: "0px" };
      }
    }
  };

  const dims = getFrameDimensions();
  const domainSlug = productTitle
    ? productTitle.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "marcutie";

  if (isMobile) {
    // Sleek Titanium Smartphone Frame with Dynamic Island & Status Bar
    return (
      <div
        style={{
          width: dims.width,
          height: dims.height,
          borderRadius: dims.borderRadius,
          background: "#070a12",
          border: `${dims.bezelWidth} solid #1b202e`,
          boxShadow:
            "0 40px 100px rgba(0, 0, 0, 0.85), 0 0 0 2px rgba(255, 255, 255, 0.18), 0 0 70px rgba(99, 102, 241, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* Mobile Top Status Bar & Dynamic Island */}
        <div
          style={{
            height: "44px",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(7, 10, 18, 0.95)",
            zIndex: 30,
            position: "relative",
          }}
        >
          {/* Status Bar Clock */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "-0.2px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            9:41
          </span>

          {/* Dynamic Island Notch */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "9px",
              transform: "translateX(-50%)",
              width: "92px",
              height: "26px",
              borderRadius: "13px",
              background: "#000000",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Front Camera Lens specular dot */}
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#0f172a",
                border: "1px solid rgba(99, 102, 241, 0.4)",
              }}
            />
            {/* Sensor indicator */}
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.6)",
              }}
            />
          </div>

          {/* Status Bar Cellular / WiFi / Battery */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Cellular Bars */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="#ffffff" />
              <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="#ffffff" />
              <rect x="7" y="3" width="2.5" height="7" rx="0.5" fill="#ffffff" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="#ffffff" />
            </svg>
            {/* WiFi */}
            <svg width="13" height="10" viewBox="0 0 13 10" fill="#ffffff">
              <path d="M6.5 8C7.05 8 7.5 8.45 7.5 9S7.05 10 6.5 10 5.5 9.55 5.5 9 5.95 8 6.5 8zm-2.83-2.12c1.56-1.56 4.1-1.56 5.66 0l-1.06 1.06c-.98-.98-2.56-.98-3.54 0L3.67 5.88zm-2.47-2.47c2.93-2.93 7.68-2.93 10.61 0l-1.06 1.06c-2.34-2.34-6.14-2.34-8.49 0L1.2 3.41z" />
            </svg>
            {/* Battery */}
            <div
              style={{
                width: "18px",
                height: "9px",
                borderRadius: "2.5px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                padding: "1px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "85%",
                  height: "100%",
                  background: "#10b981",
                  borderRadius: "1px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Screen Body */}
        <div
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div
          style={{
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(7, 10, 18, 0.95)",
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: "110px",
              height: "4px",
              borderRadius: "2px",
              background: "rgba(255, 255, 255, 0.65)",
            }}
          />
        </div>
      </div>
    );
  }

  // macOS Chrome Landscape Browser Frame
  return (
    <div
      style={{
        width: dims.width,
        height: dims.height,
        borderRadius: dims.borderRadius,
        background: "rgba(11, 16, 29, 0.85)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow:
          "0 35px 90px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 60px rgba(99, 102, 241, 0.3)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* macOS Window Header & Traffic Lights */}
      <div
        style={{
          height: "40px",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 30,
        }}
      >
        {/* Traffic Light Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "80px" }}>
          {/* Close */}
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ff5f56",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.2)",
            }}
          />
          {/* Minimize */}
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ffbd2e",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.2)",
            }}
          />
          {/* Expand */}
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#27c93f",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>

        {/* Browser URL Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "999px",
            padding: "4px 18px",
            fontSize: "12px",
            color: "#94a3b8",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.1px",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Lock Icon */}
          <svg width="10" height="12" viewBox="0 0 12 14" fill="#10b981">
            <path d="M6 0C4.34 0 3 1.34 3 3v2H2C.9 5 0 5.9 0 7v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H9V3c0-1.66-1.34-3-3-3zm1 2c.55 0 1 .45 1 1v2H4V3c0-.55.45-1 1-1h2z" />
          </svg>
          <span>
            https://app.{domainSlug}.com
          </span>
        </div>

        {/* Subtle Right-side Window Controls Placeholder */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "80px", justifyContent: "flex-end" }}>
          <div
            style={{
              width: "16px",
              height: "12px",
              borderRadius: "2px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          />
        </div>
      </div>

      {/* Browser Viewport */}
      <div
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {children}
      </div>
    </div>
  );
};
