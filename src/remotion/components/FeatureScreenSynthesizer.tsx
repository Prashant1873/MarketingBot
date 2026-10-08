import React from "react";
import { FeatureMockup, ThemePalette, DeviceFrame } from "../../types";

interface FeatureScreenSynthesizerProps {
  featureMockup?: FeatureMockup;
  themePalette?: ThemePalette;
  deviceFrame?: DeviceFrame;
  title?: string;
}

export const FeatureScreenSynthesizer: React.FC<FeatureScreenSynthesizerProps> = ({
  featureMockup,
  themePalette,
  deviceFrame = "macos",
  title = "Marcutie",
}) => {
  const isMobile = deviceFrame === "mobile";

  // Safe defaults if palette is missing
  const palette: ThemePalette = themePalette || {
    primary: "#6366f1",
    secondary: "#38bdf8",
    accent: "#10b981",
    background: "#090d16",
    surface: "#131b2e",
    text: "#f8fafc",
    isDark: true,
  };

  const feature = featureMockup || {
    featureType: "analytics",
    title: `${title} Analytics`,
    subtitle: "Real-time metrics and telemetry",
    items: [
      { label: "Active Throughput", value: "148,290 req/s", badge: "+28.4% ↑" },
      { label: "Average Latency", value: "12.4 ms", badge: "-38.2% ↓" },
      { label: "System Uptime", value: "99.99%", badge: "Optimal" },
    ],
  };

  const type = feature.featureType;

  // --- 1. KANBAN BOARD TEMPLATE ---
  if (type === "kanban") {
    const columns = [
      { name: "To Do", count: 3, color: palette.secondary },
      { name: "In Progress", count: 2, color: palette.primary },
      { name: "Completed", count: 5, color: palette.accent },
    ];

    const cards = [
      { col: 0, title: "Design system audit", tag: "Design", priority: "High" },
      { col: 1, title: feature.title || "Real-time sync engine", tag: "Core", priority: "Urgent" },
      { col: 2, title: "Production deployment v1.0", tag: "Ops", priority: "Done" },
    ];

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: palette.background,
          color: palette.text,
          padding: isMobile ? "14px" : "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 2px 0", fontSize: isMobile ? "16px" : "18px", fontWeight: "800" }}>
              {feature.title}
            </h3>
            <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>
              {feature.subtitle || "Sprint workflow board"}
            </p>
          </div>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              background: `${palette.primary}22`,
              border: `1px solid ${palette.primary}44`,
              color: palette.primary,
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            Live Board
          </span>
        </div>

        {/* Kanban Columns */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "12px", flex: 1 }}>
          {columns.slice(0, isMobile ? 2 : 3).map((col, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: col.color }}>{col.name}</span>
                <span style={{ fontSize: "10px", opacity: 0.6, background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: "999px" }}>
                  {col.count}
                </span>
              </div>
              {cards
                .filter((c) => c.col === idx)
                .map((card, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      borderRadius: "8px",
                      background: palette.surface,
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      padding: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>{card.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: `${palette.primary}22`, color: palette.primary, fontWeight: "700" }}>
                        {card.tag}
                      </span>
                      <span style={{ fontSize: "10px", opacity: 0.7 }}>● {card.priority}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. AI CHAT COPILOT TEMPLATE ---
  if (type === "chat") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: palette.background,
          color: palette.text,
          padding: isMobile ? "14px" : "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
              ✨
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>{feature.title}</div>
              <div style={{ fontSize: "10px", color: palette.accent }}>● Reasoning Active</div>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
          <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`, padding: "10px 14px", borderRadius: "14px 14px 2px 14px", fontSize: "12px", color: "#ffffff", fontWeight: "500", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
            How do we streamline this entire workflow?
          </div>
          <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: palette.surface, border: "1px solid rgba(255, 255, 255, 0.09)", padding: "12px 16px", borderRadius: "14px 14px 14px 2px", fontSize: "12px", lineHeight: 1.4 }}>
            <div style={{ fontWeight: "700", marginBottom: "4px", color: palette.secondary }}>{title} AI:</div>
            {feature.subtitle || "Automated synthesis activated. Zero infrastructure needed."}
          </div>
        </div>

        {/* Prompt Input Mock */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "6px 14px" }}>
          <span style={{ fontSize: "12px", opacity: 0.5, flex: 1 }}>Ask {title} anything...</span>
          <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: palette.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff" }}>
            ↑
          </div>
        </div>
      </div>
    );
  }

  // --- 3. CHECKOUT & PRICING TEMPLATE ---
  if (type === "checkout") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: palette.background,
          color: palette.text,
          padding: isMobile ? "16px" : "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 2px 0", fontSize: isMobile ? "16px" : "18px", fontWeight: "800" }}>
            {feature.title}
          </h3>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>
            {feature.subtitle || "Instant high-converting checkout"}
          </p>
        </div>

        <div style={{ borderRadius: "14px", background: palette.surface, border: "1px solid rgba(255,255,255,0.08)", padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {(feature.items || []).map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: "700", color: palette.secondary }}>{item.value || "$49/mo"}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "800" }}>
            <span>Total</span>
            <span style={{ color: palette.accent }}>$199.00</span>
          </div>
        </div>

        <button
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "12px 0",
            borderRadius: "10px",
            border: "none",
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "13px",
            boxShadow: `0 8px 20px ${palette.primary}44`,
            cursor: "pointer",
          }}
        >
          Confirm & Launch Now →
        </button>
      </div>
    );
  }

  // --- 4. DEFAULT ANALYTICS TEMPLATE (Dynamic Palette Themed) ---
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: palette.background,
        color: palette.text,
        padding: isMobile ? "14px" : "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: "0 0 2px 0", fontSize: isMobile ? "16px" : "18px", fontWeight: "800" }}>
            {feature.title}
          </h3>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>
            {feature.subtitle || "Live performance indicators"}
          </p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: "700", color: palette.accent }}>
          ● Live Stream
        </span>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "10px" }}>
        {(feature.items || []).slice(0, isMobile ? 2 : 3).map((item, idx) => {
          const colors = [palette.primary, palette.secondary, palette.accent];
          const color = colors[idx % colors.length];
          return (
            <div
              key={idx}
              style={{
                borderRadius: "12px",
                background: palette.surface,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ fontSize: "11px", opacity: 0.7 }}>{item.label}</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff" }}>
                {item.value || "99.8%"}
              </div>
              <div style={{ fontSize: "10px", fontWeight: "700", color }}>
                {item.badge || "+24% growth"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Area Sparkline Graph */}
      <div
        style={{
          flex: 1,
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: "700", opacity: 0.7, marginBottom: "8px" }}>
          Throughput Velocity
        </div>
        <div style={{ flex: 1, width: "100%", position: "relative" }}>
          <svg width="100%" height="100%" viewBox="0 0 600 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="synthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.primary} stopOpacity="0.45" />
                <stop offset="100%" stopColor={palette.primary} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polygon
              points="0,100 50,90 100,95 150,75 200,65 250,70 300,45 350,50 400,30 450,35 500,20 550,25 600,10 600,120 0,120"
              fill="url(#synthGrad)"
            />
            <polyline
              points="0,100 50,90 100,95 150,75 200,65 250,70 300,45 350,50 400,30 450,35 500,20 550,25 600,10"
              fill="none"
              stroke={palette.secondary}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
