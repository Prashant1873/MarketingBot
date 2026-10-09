import React, { useState } from "react";
import {
  Sparkles,
  Palette,
  Mic,
  Music2,
  Compass,
  Monitor,
  Smartphone,
  Check,
  Zap,
  FileCode,
  Flame,
  Laugh,
  Eye,
  Film,
  ShoppingBag,
  Type,
} from "lucide-react";
import {
  Tone,
  AspectRatio,
  Duration,
  ThemePalette,
  ScreenMode,
  DeviceFrame,
  PreFlightVoiceConfig,
  PreFlightAudioConfig,
  SubtitlesConfig,
  SubtitleStyle,
  SubtitlePosition,
  VisualTheme,
} from "../types";
import { PRESET_THEME_PALETTES, VISUAL_THEME_OPTIONS, VISUAL_THEME_PALETTES } from "../utils/featureMockups";

interface PreFlightStudioPanelProps {
  tone: Tone;
  customTone: string;
  onToneChange: (tone: Tone) => void;
  onCustomToneChange: (custom: string) => void;
  aspectRatio: AspectRatio;
  duration: Duration;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onDurationChange: (dur: Duration) => void;

  themePalette: ThemePalette;
  onThemePaletteChange: (palette: ThemePalette) => void;
  screenMode: ScreenMode;
  onScreenModeChange: (mode: ScreenMode) => void;
  deviceFrame?: DeviceFrame;
  onDeviceFrameChange?: (frame: DeviceFrame | undefined) => void;

  voiceConfig: PreFlightVoiceConfig;
  onVoiceConfigChange: (config: PreFlightVoiceConfig) => void;

  audioConfig: PreFlightAudioConfig;
  onAudioConfigChange: (config: PreFlightAudioConfig) => void;

  subtitlesConfig?: SubtitlesConfig;
  onSubtitlesConfigChange?: (config: SubtitlesConfig) => void;

  visualTheme?: VisualTheme;
  onVisualThemeChange?: (theme: VisualTheme) => void;
}

type StudioTab = "creative" | "theme" | "voiceover" | "audio";

const TONE_OPTIONS: Array<{
  id: Tone;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  badge?: string;
}> = [
  {
    id: "default",
    label: "Default Launch",
    tagline: "Punchy, modern, tech-forward",
    icon: <Sparkles size={16} />,
  },
  {
    id: "polished",
    label: "Polished SaaS",
    tagline: "Apple-tier craft & refined rhythm",
    icon: <Zap size={16} />,
    badge: "Popular",
  },
  {
    id: "yc-parody",
    label: "YC Parody",
    tagline: "Unapologetic Silicon Valley satire",
    icon: <Laugh size={16} />,
  },
  {
    id: "chaotic",
    label: "Chaotic Meme",
    tagline: "Gen-Z pacing, rapid slams & absurdity",
    icon: <Flame size={16} />,
  },
  {
    id: "deadpan",
    label: "Deadpan Humor",
    tagline: "Dry wit, understated claims",
    icon: <Eye size={16} />,
  },
  {
    id: "cinematic",
    label: "Cinematic Epic",
    tagline: "Deep pauses, heroic build-up",
    icon: <Film size={16} />,
  },
  {
    id: "app-store",
    label: "App Store Spotlight",
    tagline: "Feature showcase, crisp conversion",
    icon: <ShoppingBag size={16} />,
  },
];

const PRESET_PALETTE_LABELS: Record<string, { name: string; desc: string }> = {
  indigo: { name: "Indigo Modern", desc: "Default tech dark with electric indigo & cyan" },
  crimson: { name: "Crimson Surge", desc: "High-contrast charcoal & fiery ruby accents" },
  emerald: { name: "Emerald Matrix", desc: "Deep forest & mint green fintech aesthetic" },
  amber: { name: "Amber Spark", desc: "Warm obsidian & solar orange startup energy" },
  neon: { name: "Cyber Neon", desc: "Synthwave purple, hot pink & laser cyan" },
  slate: { name: "Slate Minimal", desc: "Cool gunmetal with ocean blue precision" },
  midnight: { name: "Midnight Glow", desc: "Deep black with pastel lavender & sky blue" },
};

const KOKORO_VOICE_OPTIONS = [
  { id: "auto", name: "⚡ AI Auto-Pick (Tone-Matched)", desc: "Dynamically selects the ideal voice based on marketing tone" },
  { id: "af_heart", name: "Heart (Warm & Engaging)", desc: "Empathetic, clear, conversational American female" },
  { id: "af_nova", name: "Nova (High Energy & Upbeat)", desc: "Punchy, fast-paced American female ideal for hype videos" },
  { id: "af_sky", name: "Sky (Crisp & Articulate)", desc: "Sharp, confident, professional American female" },
  { id: "am_adam", name: "Adam (Confident Founder)", desc: "Authoritative, grounded, modern American male" },
  { id: "am_michael", name: "Michael (Deep & Cinematic)", desc: "Resonant, dramatic American male for cinematic reveals" },
  { id: "bf_emma", name: "Emma (Polished British)", desc: "Sophisticated, elegant British female tone" },
  { id: "bm_george", name: "George (Distinguished Storyteller)", desc: "Deep, refined British male narrative voice" },
];

const MUSIC_TRACK_OPTIONS = [
  { id: "auto", name: "✨ AI Smart Select (Prompt-Matched)", bpm: "Dynamic", desc: "Auto-selects optimal beat based on marketing pace" },
  { id: "happy-beats-vol-1", name: "Happy Beats: Business Moves (Vol 1)", bpm: "125 BPM", desc: "Driving upbeat modern tech beat with punchy percussion" },
  { id: "happy-beats-vol-10", name: "Happy Beats: Compact Pulse (Vol 10)", bpm: "130 BPM", desc: "High-tempo rapid momentum for meme or chaotic energy" },
  { id: "happy-beats-vol-9", name: "Happy Beats: Founder Hustle (Vol 9)", bpm: "118 BPM", desc: "Playful optimistic groove perfect for startup pitches" },
  { id: "happy-beats-vol-11", name: "Happy Beats: Clean Corporate (Vol 11)", bpm: "112 BPM", desc: "Warm elegant instrumentation for polished SaaS showcase" },
  { id: "happy-beats-vol-12", name: "Happy Beats: Cinematic Focus (Vol 12)", bpm: "105 BPM", desc: "Steady understated presence for epic narratives" },
];

const SUBTITLE_STYLE_OPTIONS: Array<{
  id: SubtitleStyle;
  label: string;
  desc: string;
  badge: string;
}> = [
  {
    id: "karaoke-bounce",
    label: "Karaoke Bounce",
    desc: "Active word spring pop with vibrant accent glow (TikTok/Hormozi style)",
    badge: "Viral #1",
  },
  {
    id: "clean-pill",
    label: "Clean Frosted Pill",
    desc: "Frosted glass capsule with subtle backdrop blur (Apple/SaaS style)",
    badge: "Polished",
  },
  {
    id: "cyber-glow",
    label: "Cyber Glow",
    desc: "Neon glowing outline with pulsed cybernetic lighting",
    badge: "Punchy",
  },
  {
    id: "minimal",
    label: "Minimal Crisp",
    desc: "High-contrast clean typography with understated accent line",
    badge: "Subtle",
  },
];

export function PreFlightStudioPanel({
  tone,
  customTone,
  onToneChange,
  onCustomToneChange,
  aspectRatio,
  duration,
  onAspectRatioChange,
  onDurationChange,
  themePalette,
  onThemePaletteChange,
  screenMode,
  onScreenModeChange,
  deviceFrame,
  onDeviceFrameChange,
  voiceConfig,
  onVoiceConfigChange,
  audioConfig,
  onAudioConfigChange,
  subtitlesConfig,
  onSubtitlesConfigChange,
  visualTheme = "default-dark",
  onVisualThemeChange,
}: PreFlightStudioPanelProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>("creative");

  const effectiveSubtitles = subtitlesConfig || {
    enabled: true,
    style: "karaoke-bounce" as SubtitleStyle,
    position: "bottom" as SubtitlePosition,
  };

  const handleColorChange = (key: keyof ThemePalette, val: string) => {
    onThemePaletteChange({
      ...themePalette,
      [key]: val,
    });
  };

  const handleApplyPresetPalette = (presetKey: string) => {
    const preset = PRESET_THEME_PALETTES[presetKey];
    if (preset) {
      onThemePaletteChange(preset);
    }
  };

  return (
    <div
      id="preflight-studio-panel"
      className="glass-panel"
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)",
        background: "rgba(13, 19, 33, 0.7)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Studio Navigation Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-color)",
          background: "rgba(9, 13, 22, 0.6)",
          padding: "6px",
          gap: "4px",
          overflowX: "auto",
        }}
      >
        <button
          id="tab-creative"
          type="button"
          onClick={() => setActiveTab("creative")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: activeTab === "creative" ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
            background: activeTab === "creative" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1))" : "transparent",
            color: activeTab === "creative" ? "#ffffff" : "var(--text-muted)",
            fontSize: "13px",
            fontWeight: activeTab === "creative" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <Compass size={15} color={activeTab === "creative" ? "var(--accent-primary)" : "currentColor"} />
          <span>Creative & Tone</span>
        </button>

        <button
          id="tab-theme"
          type="button"
          onClick={() => setActiveTab("theme")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: activeTab === "theme" ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid transparent",
            background: activeTab === "theme" ? "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.1))" : "transparent",
            color: activeTab === "theme" ? "#ffffff" : "var(--text-muted)",
            fontSize: "13px",
            fontWeight: activeTab === "theme" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <Palette size={15} color={activeTab === "theme" ? "var(--accent-secondary)" : "currentColor"} />
          <span>Brand & Visuals</span>
        </button>

        <button
          id="tab-voiceover"
          type="button"
          onClick={() => setActiveTab("voiceover")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: activeTab === "voiceover" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
            background: activeTab === "voiceover" ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.1))" : "transparent",
            color: activeTab === "voiceover" ? "#ffffff" : "var(--text-muted)",
            fontSize: "13px",
            fontWeight: activeTab === "voiceover" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <Mic size={15} color={activeTab === "voiceover" ? "var(--success)" : "currentColor"} />
          <span>Voiceover</span>
          {voiceConfig.enabled && (
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--success)",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
          )}
        </button>

        <button
          id="tab-audio"
          type="button"
          onClick={() => setActiveTab("audio")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: activeTab === "audio" ? "1px solid rgba(234, 88, 12, 0.4)" : "1px solid transparent",
            background: activeTab === "audio" ? "linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(249, 115, 22, 0.1))" : "transparent",
            color: activeTab === "audio" ? "#ffffff" : "var(--text-muted)",
            fontSize: "13px",
            fontWeight: activeTab === "audio" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <Music2 size={15} color={activeTab === "audio" ? "#f97316" : "currentColor"} />
          <span>Music & Audio</span>
        </button>
      </div>

      {/* Tab 1: Creative & Tone */}
      {activeTab === "creative" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                Marketing Tone & Energy
              </label>
              <span style={{ fontSize: "11px", color: "var(--accent-primary)" }}>Shapes pacing, typography slams & copy</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "10px" }}>
              {TONE_OPTIONS.map((t) => {
                const isSelected = tone === t.id && !customTone;
                return (
                  <button
                    key={t.id}
                    id={`tone-preset-${t.id}`}
                    type="button"
                    onClick={() => {
                      onToneChange(t.id);
                      onCustomToneChange("");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.02)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                      <span style={{ color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)" }}>{t.icon}</span>
                      {t.badge && (
                        <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "999px", background: "rgba(99, 102, 241, 0.3)", color: "var(--accent-primary)", fontWeight: "600" }}>
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: isSelected ? "#ffffff" : "var(--text-primary)", marginBottom: "2px" }}>
                      {t.label}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.3 }}>
                      {t.tagline}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tone Input */}
            <div style={{ marginTop: "12px" }}>
              <input
                id="custom-tone-input"
                type="text"
                placeholder="Or specify custom creative direction (e.g. 'Sarcastic German engineer, brutalist aesthetic')..."
                value={customTone}
                onChange={(e) => onCustomToneChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  borderRadius: "var(--radius-md)",
                  border: customTone ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(0, 0, 0, 0.25)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          {/* Video Format & Target Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                Aspect Ratio
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {[
                  { id: "16:9", label: "16:9", sub: "YouTube / X" },
                  { id: "9:16", label: "9:16", sub: "Reels / TikTok" },
                  { id: "1:1", label: "1:1", sub: "Square" },
                ].map((f) => (
                  <button
                    key={f.id}
                    id={`aspect-btn-${f.id.replace(":", "-")}`}
                    type="button"
                    onClick={() => onAspectRatioChange(f.id as AspectRatio)}
                    style={{
                      padding: "8px 6px",
                      borderRadius: "var(--radius-md)",
                      border: aspectRatio === f.id ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: aspectRatio === f.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
                      color: aspectRatio === f.id ? "#ffffff" : "var(--text-muted)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700" }}>{f.label}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                Target Duration
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {[
                  { dur: 15, label: "15s", sub: "Snappy" },
                  { dur: 20, label: "20s", sub: "Standard" },
                  { dur: 25, label: "25s", sub: "Deep Dive" },
                ].map((d) => (
                  <button
                    key={d.dur}
                    id={`duration-btn-${d.dur}s`}
                    type="button"
                    onClick={() => onDurationChange(d.dur as Duration)}
                    style={{
                      padding: "8px 6px",
                      borderRadius: "var(--radius-md)",
                      border: duration === d.dur ? "1px solid var(--accent-secondary)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: duration === d.dur ? "rgba(56, 189, 248, 0.15)" : "transparent",
                      color: duration === d.dur ? "#ffffff" : "var(--text-muted)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700" }}>{d.label}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Brand & Visuals */}
      {activeTab === "theme" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Visual Theme Aesthetics Engine (Phase 17) */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                Visual Aesthetic & Shader Engine
              </label>
              <span style={{ fontSize: "11px", color: "var(--accent-primary)" }}>Overlays, CRT scanlines, brutalist framing & lighting</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {VISUAL_THEME_OPTIONS.map((opt) => {
                const isSelected = (visualTheme || "default-dark") === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`visual-theme-${opt.id}`}
                    type="button"
                    onClick={() => {
                      if (onVisualThemeChange) {
                        onVisualThemeChange(opt.id as VisualTheme);
                      }
                      if (VISUAL_THEME_PALETTES[opt.id]) {
                        onThemePaletteChange(VISUAL_THEME_PALETTES[opt.id]);
                      }
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(56, 189, 248, 0.1))" : "rgba(0, 0, 0, 0.25)",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>{opt.label}</span>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: isSelected ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)",
                          color: isSelected ? "#ffffff" : "var(--text-muted)",
                          fontWeight: "600",
                        }}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.3 }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Palettes */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                Curated Brand Theme Presets
              </label>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Applies to video background, glows & badges</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {Object.entries(PRESET_THEME_PALETTES).map(([key, pal]) => {
                const info = PRESET_PALETTE_LABELS[key] || { name: key, desc: "Brand theme" };
                const isSelected = themePalette.primary.toLowerCase() === pal.primary.toLowerCase() &&
                  themePalette.background.toLowerCase() === pal.background.toLowerCase();

                return (
                  <button
                    key={key}
                    id={`palette-preset-${key}`}
                    type="button"
                    onClick={() => handleApplyPresetPalette(key)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? `1px solid ${pal.primary}` : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>{info.name}</span>
                      {isSelected && <Check size={14} color={pal.primary} />}
                    </div>

                    <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: pal.primary, border: "1px solid rgba(255,255,255,0.2)" }} />
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: pal.secondary, border: "1px solid rgba(255,255,255,0.2)" }} />
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: pal.accent, border: "1px solid rgba(255,255,255,0.2)" }} />
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: pal.background, border: "1px solid rgba(255,255,255,0.2)" }} />
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: pal.surface, border: "1px solid rgba(255,255,255,0.2)" }} />
                    </div>

                    <span style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.2 }}>{info.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color Pickers */}
          <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "10px" }}>
              Custom Palette Fine-Tuning
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
              {[
                { key: "primary" as const, label: "Primary Brand" },
                { key: "secondary" as const, label: "Secondary Glow" },
                { key: "accent" as const, label: "Accent Highlight" },
                { key: "background" as const, label: "Video Background" },
                { key: "surface" as const, label: "Card Surface" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={themePalette[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{
                        width: "24px",
                        height: "24px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "none",
                      }}
                    />
                    <input
                      type="text"
                      value={themePalette[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{
                        width: "68px",
                        background: "transparent",
                        border: "none",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Screen Render Mode Switch & Device Frame */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                Screen Render Mode
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  id="screen-mode-mockup-btn"
                  type="button"
                  onClick={() => onScreenModeChange("mockup")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: screenMode === "mockup" ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: screenMode === "mockup" ? "rgba(99, 102, 241, 0.15)" : "transparent",
                    color: screenMode === "mockup" ? "#ffffff" : "var(--text-muted)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <FileCode size={16} color={screenMode === "mockup" ? "var(--accent-primary)" : "currentColor"} />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600" }}>Synthesized HTML/CSS</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Dynamic code mockup</div>
                  </div>
                </button>

                <button
                  id="screen-mode-screenshot-btn"
                  type="button"
                  onClick={() => onScreenModeChange("screenshot")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: screenMode === "screenshot" ? "1px solid var(--accent-secondary)" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: screenMode === "screenshot" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                    color: screenMode === "screenshot" ? "#ffffff" : "var(--text-muted)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Monitor size={16} color={screenMode === "screenshot" ? "var(--accent-secondary)" : "currentColor"} />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600" }}>Direct Screenshot</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Raw uploaded image</div>
                  </div>
                </button>
              </div>
            </div>

            {onDeviceFrameChange && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                  Device Frame
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => onDeviceFrameChange(deviceFrame === "macos" ? undefined : "macos")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px 8px",
                      borderRadius: "var(--radius-md)",
                      border: deviceFrame === "macos" ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: deviceFrame === "macos" ? "rgba(99, 102, 241, 0.15)" : "transparent",
                      color: deviceFrame === "macos" ? "#ffffff" : "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    <Monitor size={14} /> macOS
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeviceFrameChange(deviceFrame === "mobile" ? undefined : "mobile")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px 8px",
                      borderRadius: "var(--radius-md)",
                      border: deviceFrame === "mobile" ? "1px solid var(--accent-secondary)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: deviceFrame === "mobile" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                      color: deviceFrame === "mobile" ? "#ffffff" : "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    <Smartphone size={14} /> Phone
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Voiceover Studio */}
      {activeTab === "voiceover" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Voiceover Master Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              background: voiceConfig.enabled ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
              border: voiceConfig.enabled ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mic size={18} color={voiceConfig.enabled ? "var(--success)" : "var(--text-muted)"} />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>
                  AI Voiceover Narration (100% Local Kokoro-82M)
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: voiceConfig.enabled ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                    color: voiceConfig.enabled ? "var(--success)" : "var(--text-muted)",
                  }}
                >
                  {voiceConfig.enabled ? "Enabled (Zero API Cost)" : "Disabled"}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 26px" }}>
                Synthesizes synced studio narration directly into the video with automatic background music ducking.
              </p>
            </div>

            <button
              id="voiceover-master-toggle-btn"
              type="button"
              onClick={() => onVoiceConfigChange({ ...voiceConfig, enabled: !voiceConfig.enabled })}
              style={{
                padding: "8px 18px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: voiceConfig.enabled ? "var(--success)" : "rgba(255, 255, 255, 0.12)",
                color: voiceConfig.enabled ? "#064e3b" : "#ffffff",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {voiceConfig.enabled ? "Turn OFF" : "Turn ON"}
            </button>
          </div>

          {/* Voice Model Selection */}
          <div style={{ opacity: voiceConfig.enabled ? 1 : 0.5, pointerEvents: voiceConfig.enabled ? "auto" : "none" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
              Voice Character & Archetype
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
              {KOKORO_VOICE_OPTIONS.map((v) => {
                const isSelected = voiceConfig.voiceId === v.id;
                return (
                  <button
                    key={v.id}
                    id={`voice-preset-${v.id}`}
                    type="button"
                    onClick={() => onVoiceConfigChange({ ...voiceConfig, voiceId: v.id })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "1px solid var(--success)" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "rgba(16, 185, 129, 0.12)" : "rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: isSelected ? "#ffffff" : "var(--text-primary)" }}>
                        {v.name}
                      </span>
                      {isSelected && <Check size={14} color="var(--success)" />}
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.25 }}>
                      {v.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed & Custom Narration Notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", opacity: voiceConfig.enabled ? 1 : 0.5, pointerEvents: voiceConfig.enabled ? "auto" : "none" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  Speaking Speed: {voiceConfig.speed.toFixed(2)}x
                </label>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Optimal: 1.00x</span>
              </div>
              <input
                id="voice-speed-slider"
                type="range"
                min="0.85"
                max="1.30"
                step="0.05"
                value={voiceConfig.speed}
                onChange={(e) => onVoiceConfigChange({ ...voiceConfig, speed: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--success)" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                Narration Tone Guidance (Optional)
              </label>
              <input
                id="voice-notes-input"
                type="text"
                placeholder="e.g. 'Emphasize 10x faster and say SaaS smoothly'"
                value={voiceConfig.customNotes || ""}
                onChange={(e) => onVoiceConfigChange({ ...voiceConfig, customNotes: e.target.value })}
                style={{
                  width: "100%",
                  padding: "7px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(0, 0, 0, 0.25)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          {/* Subtitles & Kinetic Captions Burn-In Section */}
          <div
            style={{
              marginTop: "8px",
              padding: "16px 18px",
              borderRadius: "var(--radius-md)",
              background: effectiveSubtitles.enabled ? "rgba(56, 189, 248, 0.06)" : "rgba(255, 255, 255, 0.02)",
              border: effectiveSubtitles.enabled ? "1px solid rgba(56, 189, 248, 0.25)" : "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Type size={18} color={effectiveSubtitles.enabled ? "var(--accent-secondary)" : "var(--text-muted)"} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                    Kinetic Animated Captions & Burn-in
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: effectiveSubtitles.enabled ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.08)",
                        color: effectiveSubtitles.enabled ? "var(--accent-secondary)" : "var(--text-muted)",
                      }}
                    >
                      {effectiveSubtitles.enabled ? "Bake into MP4" : "Off"}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Dynamic word-by-word spring highlight burned directly into the output video.
                  </div>
                </div>
              </div>

              {onSubtitlesConfigChange && (
                <button
                  id="subtitles-master-toggle-btn"
                  type="button"
                  onClick={() =>
                    onSubtitlesConfigChange({
                      ...effectiveSubtitles,
                      enabled: !effectiveSubtitles.enabled,
                    })
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: effectiveSubtitles.enabled ? "var(--accent-secondary)" : "rgba(255, 255, 255, 0.12)",
                    color: effectiveSubtitles.enabled ? "#032b42" : "#ffffff",
                    fontWeight: "700",
                    fontSize: "11px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {effectiveSubtitles.enabled ? "Enabled" : "Disabled"}
                </button>
              )}
            </div>

            {/* Subtitle Style Cards */}
            {effectiveSubtitles.enabled && onSubtitlesConfigChange && (
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                  Caption Style & Animation Aesthetic
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "8px" }}>
                  {SUBTITLE_STYLE_OPTIONS.map((opt) => {
                    const isSelected = effectiveSubtitles.style === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          onSubtitlesConfigChange({
                            ...effectiveSubtitles,
                            style: opt.id,
                          })
                        }
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                          border: isSelected ? "1px solid var(--accent-secondary)" : "1px solid rgba(255, 255, 255, 0.08)",
                          background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.02)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: isSelected ? "#ffffff" : "var(--text-secondary)" }}>
                            {opt.label}
                          </span>
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: "700",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: isSelected ? "rgba(56, 189, 248, 0.3)" : "rgba(255, 255, 255, 0.06)",
                              color: isSelected ? "var(--accent-secondary)" : "var(--text-muted)",
                            }}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.3 }}>
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Position Selector */}
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Screen Placement:
                  </span>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => onSubtitlesConfigChange({ ...effectiveSubtitles, position: "bottom" })}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: effectiveSubtitles.position === "bottom" ? "1px solid var(--accent-secondary)" : "1px solid rgba(255, 255, 255, 0.08)",
                        background: effectiveSubtitles.position === "bottom" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                        color: effectiveSubtitles.position === "bottom" ? "#ffffff" : "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Lower Third (Safe Zone)
                    </button>
                    <button
                      type="button"
                      onClick={() => onSubtitlesConfigChange({ ...effectiveSubtitles, position: "middle" })}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: effectiveSubtitles.position === "middle" ? "1px solid var(--accent-secondary)" : "1px solid rgba(255, 255, 255, 0.08)",
                        background: effectiveSubtitles.position === "middle" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                        color: effectiveSubtitles.position === "middle" ? "#ffffff" : "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Center Impact
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Music & Audio */}
      {activeTab === "audio" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Music Track Selection */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                Curated Upbeat Music Beats (Ende.app)
              </label>
              <span style={{ fontSize: "11px", color: "#f97316" }}>High-energy commercial royalty-free tracks</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "10px" }}>
              {MUSIC_TRACK_OPTIONS.map((m) => {
                const isSelected = audioConfig.selectedMusicTrack === m.id;
                return (
                  <button
                    key={m.id}
                    id={`music-track-${m.id}`}
                    type="button"
                    onClick={() => onAudioConfigChange({ ...audioConfig, selectedMusicTrack: m.id })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "rgba(234, 88, 12, 0.15)" : "rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: isSelected ? "#ffffff" : "var(--text-primary)" }}>
                        {m.name}
                      </span>
                      <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)", color: "#f97316" }}>
                        {m.bpm}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.25 }}>
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume & Ducking Sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  Music: {Math.round(audioConfig.musicVolume * 100)}%
                </label>
              </div>
              <input
                id="music-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioConfig.musicVolume}
                onChange={(e) => onAudioConfigChange({ ...audioConfig, musicVolume: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "#f97316" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  SFX Hits: {Math.round(audioConfig.sfxVolume * 100)}%
                </label>
              </div>
              <input
                id="sfx-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioConfig.sfxVolume}
                onChange={(e) => onAudioConfigChange({ ...audioConfig, sfxVolume: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--accent-secondary)" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  Ducking: {Math.round((1 - audioConfig.duckingDepth) * 100)}% cut
                </label>
              </div>
              <input
                id="ducking-depth-slider"
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={audioConfig.duckingDepth}
                onChange={(e) => onAudioConfigChange({ ...audioConfig, duckingDepth: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--success)" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
