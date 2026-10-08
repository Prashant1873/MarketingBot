import React from "react";
import { DeviceFrame } from "../../types";

interface SyntheticAppWindowProps {
  deviceFrame?: DeviceFrame;
  title?: string;
  headline?: string;
  subtext?: string;
}

export const SyntheticAppWindow: React.FC<SyntheticAppWindowProps> = ({
  deviceFrame = "macos",
  title = "Marcutie App",
  headline = "Next Generation Platform",
  subtext = "High performance real-time engine",
}) => {
  const isMobile = deviceFrame === "mobile";

  if (isMobile) {
    // Simulated Mobile App Interface
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #0b1120 0%, #080d18 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          padding: "16px 18px",
          gap: "14px",
          boxSizing: "border-box",
        }}
      >
        {/* Mobile Header Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "16px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", lineHeight: 1.2 }}>
                {title}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Online & Synced</div>
            </div>
          </div>
          {/* Bell Icon */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            🔔
          </div>
        </div>

        {/* Hero Card */}
        <div
          style={{
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(56, 189, 248, 0.12) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            padding: "16px 18px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Performance Metrics
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "6px 0 2px" }}>
            <span style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px" }}>
              99.8%
            </span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#10b981" }}>
              +24.6% ↑
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            {headline}
          </div>
        </div>

        {/* Quick Action Chips */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["🚀 Fast Run", "📊 Analytics", "✨ AI Mode"].map((chip, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                padding: "8px 0",
                textAlign: "center",
                borderRadius: "10px",
                background: idx === 0 ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.05)",
                border: idx === 0 ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "11px",
                fontWeight: "600",
                color: idx === 0 ? "#818cf8" : "#cbd5e1",
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Activity Feed Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflow: "hidden" }}>
          {[
            { icon: "✨", title: "Automated Workflow", sub: "Triggered instantly", badge: "Active", color: "#10b981" },
            { icon: "⚡", title: "Real-time Sync", sub: "12ms round-trip", badge: "Verified", color: "#38bdf8" },
            { icon: "🔒", title: "Encrypted Storage", sub: "Local storage secured", badge: "Done", color: "#a855f7" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>{item.title}</div>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>{item.sub}</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: `${item.color}22`,
                  color: item.color,
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Tab Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "8px 0 2px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {["🏠", "📈", "⚙️", "👤"].map((tab, idx) => (
            <div
              key={idx}
              style={{
                fontSize: "16px",
                opacity: idx === 0 ? 1 : 0.4,
                cursor: "pointer",
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Simulated macOS SaaS Dashboard Interface
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#080c16",
        color: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          width: "210px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRight: "1px solid rgba(255, 255, 255, 0.07)",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "15px",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.2px" }}>
              {title}
            </div>
            <div style={{ fontSize: "10px", color: "#94a3b8" }}>Enterprise Cloud</div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            { icon: "📊", label: "Dashboard", active: true },
            { icon: "⚡", label: "Automations", active: false },
            { icon: "📈", label: "Analytics", active: false },
            { icon: "👥", label: "Team & Access", active: false },
            { icon: "⚙️", label: "Settings", active: false },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: item.active ? "700" : "500",
                background: item.active ? "rgba(99, 102, 241, 0.2)" : "transparent",
                color: item.active ? "#818cf8" : "#94a3b8",
                border: item.active ? "1px solid rgba(99, 102, 241, 0.35)" : "1px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Badge */}
        <div
          style={{
            marginTop: "auto",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            fontSize: "11px",
            color: "#10b981",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
          Cluster Online
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Top Action Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 2px 0", letterSpacing: "-0.3px" }}>
              {headline}
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{subtext}</p>
          </div>
          {/* Action Button */}
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              fontSize: "12px",
              fontWeight: "700",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
            }}
          >
            + New Pipeline
          </div>
        </div>

        {/* Metric Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[
            { label: "Total Throughput", val: "148,290 req/s", growth: "+28.4%", color: "#6366f1" },
            { label: "Avg Latency", val: "12.4 ms", growth: "-38.2%", color: "#10b981" },
            { label: "Availability", val: "99.99%", growth: "Optimal", color: "#38bdf8" },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{card.label}</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px" }}>
                {card.val}
              </div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: card.color }}>
                {card.growth} vs previous period
              </div>
            </div>
          ))}
        </div>

        {/* Hero Area Chart */}
        <div
          style={{
            flex: 1,
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#cbd5e1" }}>
              Real-Time Execution Bandwidth
            </span>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>
              Live Telemetry ●
            </span>
          </div>

          {/* SVG Area Sparkline Chart */}
          <div style={{ flex: 1, width: "100%", position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 600 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <polygon
                points="0,120 40,110 80,115 120,95 160,85 200,90 240,65 280,70 320,50 360,55 400,35 440,40 480,25 520,30 560,15 600,10 600,140 0,140"
                fill="url(#chartGradient)"
              />
              {/* Curve Stroke */}
              <polyline
                points="0,120 40,110 80,115 120,95 160,85 200,90 240,65 280,70 320,50 360,55 400,35 440,40 480,25 520,30 560,15 600,10"
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
