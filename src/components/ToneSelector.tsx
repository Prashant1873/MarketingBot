import React from "react";
import { Sliders, Zap, Award, Rocket, Flame, MinusCircle, Film, Smartphone, LucideIcon } from "lucide-react";
import { Tone } from "../types";

interface ToneSelectorProps {
  selectedTone: Tone;
  customTone: string;
  onToneChange: (tone: Tone) => void;
  onCustomToneChange: (custom: string) => void;
}

const TONES: Array<{
  id: Tone;
  label: string;
  tagline: string;
  icon: LucideIcon;
  accentColor: string;
}> = [
  {
    id: "default",
    label: "Default",
    tagline: "Playful, clean, postable",
    icon: Zap,
    accentColor: "#6366f1",
  },
  {
    id: "polished",
    label: "Polished",
    tagline: "Serious, elegant product film",
    icon: Award,
    accentColor: "#10b981",
  },
  {
    id: "yc-parody",
    label: "YC Parody",
    tagline: "Deadpan startup launch energy",
    icon: Rocket,
    accentColor: "#f59e0b",
  },
  {
    id: "chaotic",
    label: "Chaotic",
    tagline: "Fast, loud, wildly unhinged",
    icon: Flame,
    accentColor: "#ef4444",
  },
  {
    id: "deadpan",
    label: "Deadpan",
    tagline: "Calm, dry, big quiet holds",
    icon: MinusCircle,
    accentColor: "#94a3b8",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    tagline: "Dramatic, trailer-scale motion",
    icon: Film,
    accentColor: "#a855f7",
  },
  {
    id: "app-store",
    label: "App Store",
    tagline: "Smooth, feature-card clean",
    icon: Smartphone,
    accentColor: "#06b6d4",
  },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  customTone,
  onToneChange,
  onCustomToneChange,
}) => {
  return (
    <div className="glass-panel" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <Sliders size={18} color="var(--accent-primary)" />
        <h2 style={{ fontSize: "15px", fontWeight: "700" }}>Creative Tone & Energy</h2>
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
        Select the rhythm and personality of your marketing video. Influences scene pace, typography, transition physics, and music selection.
      </p>

      {/* Tone Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {TONES.map((item) => {
          const isSelected = selectedTone === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToneChange(item.id)}
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                background: isSelected ? "var(--bg-surface-2)" : "var(--bg-surface-1)",
                border: isSelected
                  ? `1.5px solid ${item.accentColor}`
                  : "1px solid var(--border-color)",
                boxShadow: isSelected ? `0 0 16px ${item.accentColor}33` : "none",
                textAlign: "left",
                cursor: "pointer",
                transition: "all var(--duration-fast) var(--ease-spring)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: `${item.accentColor}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} color={item.accentColor} />
                </div>
                {isSelected && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: item.accentColor,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: "1.3",
                  marginTop: "2px",
                }}
              >
                {item.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Creative Direction */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--text-secondary)",
            marginBottom: "6px",
          }}
        >
          Custom Direction (Optional override):
        </label>
        <input
          type="text"
          value={customTone}
          onChange={(e) => onCustomToneChange(e.target.value)}
          placeholder='e.g., "80s infomercial with synthwave", "luxury perfume commercial"'
          className="glass-input"
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "13px",
          }}
        />
      </div>
    </div>
  );
};
