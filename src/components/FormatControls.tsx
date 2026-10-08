import React from "react";
import { Monitor, Smartphone, Square, Clock } from "lucide-react";
import { AspectRatio, Duration } from "../types";

interface FormatControlsProps {
  aspectRatio: AspectRatio;
  duration: Duration;
  onAspectRatioChange: (format: AspectRatio) => void;
  onDurationChange: (duration: Duration) => void;
}

export const FormatControls: React.FC<FormatControlsProps> = ({
  aspectRatio,
  duration,
  onAspectRatioChange,
  onDurationChange,
}) => {
  return (
    <div className="glass-panel" style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Aspect Ratio Selector */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "10px",
            }}
          >
            Video Format & Aspect Ratio
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[
              { id: "16:9", label: "16:9", sub: "Landscape", icon: Monitor },
              { id: "9:16", label: "9:16", sub: "Vertical", icon: Smartphone },
              { id: "1:1", label: "1:1", sub: "Square", icon: Square },
            ].map((fmt) => {
              const isSelected = aspectRatio === fmt.id;
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onAspectRatioChange(fmt.id as AspectRatio)}
                  style={{
                    flexDirection: "column",
                    padding: "10px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: isSelected ? "rgba(99, 102, 241, 0.2)" : "rgba(13, 19, 34, 0.4)",
                    border: isSelected
                      ? "1px solid var(--accent-primary)"
                      : "1px solid var(--border-color)",
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <Icon size={18} color={isSelected ? "var(--accent-primary)" : "var(--text-secondary)"} />
                  <span style={{ fontSize: "12px", fontWeight: "700", marginTop: "4px" }}>
                    {fmt.label}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{fmt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Duration Selector */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <Clock size={15} color="var(--accent-secondary)" />
            <label
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--text-primary)",
              }}
            >
              Target Video Length
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[
              { sec: 15, tag: "15s", label: "Hyper-fast" },
              { sec: 20, tag: "20s", label: "Sweet Spot" },
              { sec: 25, tag: "25s", label: "Full Pitch" },
            ].map((dur) => {
              const isSelected = duration === dur.sec;
              return (
                <button
                  key={dur.sec}
                  type="button"
                  onClick={() => onDurationChange(dur.sec as Duration)}
                  style={{
                    flexDirection: "column",
                    padding: "10px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: isSelected ? "rgba(168, 85, 247, 0.2)" : "rgba(13, 19, 34, 0.4)",
                    border: isSelected
                      ? "1px solid var(--accent-secondary)"
                      : "1px solid var(--border-color)",
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "800",
                      fontFamily: "var(--font-mono)",
                      color: isSelected ? "var(--accent-secondary)" : "var(--text-primary)",
                    }}
                  >
                    {dur.tag}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {dur.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
