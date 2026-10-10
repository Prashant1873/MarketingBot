import React, { useState } from "react";
import {
  Sparkles,
  Palette,
  Mic,
  Music2,
  Compass,
  Monitor,
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
import { FluidSegmentedControl } from "./FluidSegmentedControl";

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

type StudioTab = "creative" | "tone" | "theme" | "voiceover" | "audio";

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
  neon: { name: "Cyber Neon", desc: "Synthwave midnight, laser cyan & electric purple" },
  slate: { name: "Slate Minimal", desc: "Cool gunmetal with ocean blue precision" },
  midnight: { name: "Midnight Glow", desc: "Deep black with pastel lavender & sky blue" },
};

const KOKORO_VOICE_OPTIONS = [
  { id: "auto", name: "AI Auto-Pick (Tone-Matched)", desc: "Dynamically selects the ideal voice based on marketing tone" },
  { id: "af_heart", name: "Heart (Warm & Engaging)", desc: "Empathetic, clear, conversational American female" },
  { id: "af_nova", name: "Nova (High Energy & Upbeat)", desc: "Punchy, fast-paced American female ideal for hype videos" },
  { id: "af_sky", name: "Sky (Crisp & Articulate)", desc: "Sharp, confident, professional American female" },
  { id: "am_adam", name: "Adam (Confident Founder)", desc: "Authoritative, grounded, modern American male" },
  { id: "am_michael", name: "Michael (Deep & Cinematic)", desc: "Resonant, dramatic American male for cinematic reveals" },
  { id: "bf_emma", name: "Emma (Polished British)", desc: "Sophisticated, elegant British female tone" },
  { id: "bm_george", name: "George (Distinguished Storyteller)", desc: "Deep, refined British male narrative voice" },
];

const MUSIC_TRACK_OPTIONS = [
  { id: "auto", name: "AI Smart Select (Prompt-Matched)", bpm: "Dynamic", desc: "Auto-selects optimal beat based on marketing pace" },
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
    desc: "Active word spring pop with vibrant accent glow",
    badge: "Viral #1",
  },
  {
    id: "clean-pill",
    label: "Clean Frosted Pill",
    desc: "Frosted capsule with subtle backdrop blur",
    badge: "Polished",
  },
  {
    id: "cyber-glow",
    label: "Cyber Glow",
    desc: "Neon outline with pulsed cybernetic lighting",
    badge: "Punchy",
  },
  {
    id: "minimal",
    label: "Minimal Crisp",
    desc: "High-contrast clean typography with subtle accent",
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
      className="studio-panel"
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-surface-1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Studio Rack Navigation Tabs with Stretch-and-Squish Indicator */}
      <FluidSegmentedControl<StudioTab>
        value={activeTab}
        onChange={setActiveTab}
        variant="default"
        fill
        role="tablist"
        ariaLabel="Studio Configuration Tabs"
        idPrefix="tab"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          padding: "6px",
          gap: "6px",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        }}
        buttonStyle={{
          padding: "10px 14px",
          fontSize: "13px",
          minHeight: "42px",
          whiteSpace: "nowrap",
        }}
        options={[
          {
            id: "creative",
            icon: <Compass size={15} color={activeTab === "creative" ? "var(--accent-primary)" : "currentColor"} />,
            label: "Creative",
          },
          {
            id: "tone",
            icon: <Sparkles size={15} color={activeTab === "tone" ? "var(--accent-secondary)" : "currentColor"} />,
            label: "Tone",
          },
          {
            id: "theme",
            icon: <Palette size={15} color={activeTab === "theme" ? "var(--accent-primary)" : "currentColor"} />,
            label: "Brand & Visuals",
          },
          {
            id: "voiceover",
            icon: <Mic size={15} color={activeTab === "voiceover" ? "var(--success)" : "currentColor"} />,
            label: "Voiceover",
            badge: voiceConfig.enabled ? (
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--success)",
                  boxShadow: "0 0 6px var(--success)",
                  display: "inline-block",
                }}
                title="Voiceover Active"
              />
            ) : undefined,
          },
          {
            id: "audio",
            icon: <Music2 size={15} color={activeTab === "audio" ? "var(--accent-secondary)" : "currentColor"} />,
            label: "Music & Audio",
          },
        ]}
      />

      {/* Tab 1: Creative (Format, Framing & Engine) */}
      {activeTab === "creative" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Video Format & Target Duration with Fluid Stretch Rails */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                Aspect Ratio
              </label>
              <FluidSegmentedControl<AspectRatio>
                value={aspectRatio}
                onChange={onAspectRatioChange}
                variant="primary"
                fill
                idPrefix="aspect-btn"
                buttonStyle={{ minHeight: "44px", padding: "8px 6px" }}
                options={[
                  { id: "16:9", label: "16:9", sub: "Landscape" },
                  { id: "9:16", label: "9:16", sub: "Vertical" },
                  { id: "1:1", label: "1:1", sub: "Square" },
                ]}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                Target Duration
              </label>
              <FluidSegmentedControl<Duration>
                value={duration}
                onChange={onDurationChange}
                variant="cyan"
                fill
                idPrefix="duration-btn"
                buttonStyle={{ minHeight: "44px", padding: "8px 6px" }}
                options={[
                  { id: 15, label: "15s", sub: "Snappy" },
                  { id: 20, label: "20s", sub: "Standard" },
                  { id: 25, label: "25s", sub: "Deep Dive" },
                ]}
              />
            </div>
          </div>

          {/* Screen Render Mode Switch & Device Frame with Fluid Stretch Rails */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                Screen Render Mode
              </label>
              <FluidSegmentedControl<ScreenMode>
                value={screenMode}
                onChange={onScreenModeChange}
                variant="primary"
                fill
                idPrefix="screen-mode"
                buttonStyle={{ minHeight: "44px", padding: "8px 10px", justifyContent: "flex-start" }}
                options={[
                  {
                    id: "mockup",
                    icon: <FileCode size={16} color={screenMode === "mockup" ? "#ffffff" : "var(--accent-primary)"} />,
                    label: (
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700" }}>Synthesized UI</div>
                        <div style={{ fontSize: "10px", opacity: 0.8 }}>Dynamic code mockup</div>
                      </div>
                    ),
                  },
                  {
                    id: "screenshot",
                    icon: <Monitor size={16} color={screenMode === "screenshot" ? "#08090d" : "var(--accent-secondary)"} />,
                    label: (
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700" }}>Direct Screenshot</div>
                        <div style={{ fontSize: "10px", opacity: 0.8 }}>Raw uploaded visual</div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {onDeviceFrameChange && (
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                  Device Frame
                </label>
                <FluidSegmentedControl<DeviceFrame | undefined>
                  value={deviceFrame}
                  onChange={onDeviceFrameChange}
                  variant="cyan"
                  fill
                  idPrefix="device-frame"
                  buttonStyle={{ minHeight: "44px", padding: "8px 10px" }}
                  options={[
                    { id: undefined, label: "Auto" },
                    { id: "macos", label: "Mac" },
                    { id: "mobile", label: "Phone" },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Marketing Tone & Energy */}
      {activeTab === "tone" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
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
                      border: isSelected ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--bg-surface-3)" : "var(--bg-surface-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: isSelected ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none",
                      minHeight: "80px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                      <span style={{ color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)" }}>{t.icon}</span>
                      {t.badge && (
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "1px 6px",
                            borderRadius: "var(--radius-xs)",
                            background: "rgba(99, 102, 241, 0.25)",
                            color: "var(--accent-primary)",
                            fontWeight: "700",
                          }}
                        >
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
                className="studio-input"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: customTone ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                  background: "var(--bg-surface-2)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Brand & Visuals */}
      {activeTab === "theme" && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Visual Theme Aesthetics Engine */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                Visual Aesthetic & Shader Engine
              </label>
              <span style={{ fontSize: "11px", color: "var(--accent-primary)" }}>Overlays, scanlines, brutalist framing & lighting</span>
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
                      border: isSelected ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--bg-surface-3)" : "var(--bg-surface-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      boxShadow: isSelected ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none",
                      minHeight: "75px",
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
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                Curated Brand Theme Presets
              </label>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Applies to video background, glows & badges</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {Object.entries(PRESET_THEME_PALETTES).map(([key, pal]) => {
                const info = PRESET_PALETTE_LABELS[key] || { name: key, desc: "Brand theme" };
                const isSelected =
                  themePalette.primary.toLowerCase() === pal.primary.toLowerCase() &&
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
                      border: isSelected ? `1px solid ${pal.primary}` : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--bg-surface-3)" : "var(--bg-surface-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      minHeight: "75px",
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
          <div style={{ paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "10px" }}>
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
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-subtle)",
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
                      aria-label={`${label} color picker`}
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
                        fontFamily: "var(--font-mono)",
                      }}
                      aria-label={`${label} hex value`}
                    />
                  </div>
                </div>
              ))}
            </div>
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
              background: voiceConfig.enabled ? "var(--success-bg)" : "var(--bg-surface-2)",
              border: voiceConfig.enabled ? "1px solid var(--success-border)" : "1px solid var(--border-subtle)",
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
                    borderRadius: "var(--radius-xs)",
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
              role="switch"
              aria-checked={voiceConfig.enabled}
              aria-label="Toggle AI Voiceover Narration"
              onClick={() => onVoiceConfigChange({ ...voiceConfig, enabled: !voiceConfig.enabled })}
              className={`studio-switch ${voiceConfig.enabled ? "active" : ""}`}
            >
              <span className="studio-switch-thumb" />
            </button>
          </div>

          {/* Voice Model Selection */}
          <div style={{ opacity: voiceConfig.enabled ? 1 : 0.5, pointerEvents: voiceConfig.enabled ? "auto" : "none" }}>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
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
                      border: isSelected ? "1px solid var(--success)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--bg-surface-3)" : "var(--bg-surface-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      minHeight: "64px",
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
                aria-label="Voice speaking speed"
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
                className="studio-input"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-2)",
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
              background: effectiveSubtitles.enabled ? "rgba(6, 182, 212, 0.06)" : "var(--bg-surface-2)",
              border: effectiveSubtitles.enabled ? "1px solid rgba(6, 182, 212, 0.25)" : "1px solid var(--border-subtle)",
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
                        borderRadius: "var(--radius-xs)",
                        background: effectiveSubtitles.enabled ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.08)",
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
                  role="switch"
                  aria-checked={effectiveSubtitles.enabled}
                  aria-label="Toggle Kinetic Animated Captions"
                  onClick={() =>
                    onSubtitlesConfigChange({
                      ...effectiveSubtitles,
                      enabled: !effectiveSubtitles.enabled,
                    })
                  }
                  className={`studio-switch ${effectiveSubtitles.enabled ? "active-cyan" : ""}`}
                >
                  <span className="studio-switch-thumb" />
                </button>
              )}
            </div>

            {/* Subtitle Style Cards */}
            {effectiveSubtitles.enabled && onSubtitlesConfigChange && (
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
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
                          border: isSelected ? "1px solid var(--accent-secondary)" : "1px solid var(--border-subtle)",
                          background: isSelected ? "var(--bg-surface-3)" : "var(--bg-surface-2)",
                          cursor: "pointer",
                          textAlign: "left",
                          minHeight: "64px",
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
                              background: isSelected ? "rgba(6, 182, 212, 0.3)" : "rgba(255, 255, 255, 0.06)",
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

                {/* Position Selector with Fluid Indicator */}
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Screen Placement:
                  </span>
                  <FluidSegmentedControl<SubtitlePosition>
                    value={effectiveSubtitles.position || "bottom"}
                    onChange={(pos) => onSubtitlesConfigChange({ ...effectiveSubtitles, position: pos })}
                    variant="cyan"
                    idPrefix="captions-pos"
                    buttonStyle={{ fontSize: "11px", minHeight: "34px", padding: "6px 14px" }}
                    options={[
                      { id: "bottom", label: "Lower Third (Safe Zone)" },
                      { id: "middle", label: "Center Impact" },
                    ]}
                  />
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
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                Curated Upbeat Music Beats
              </label>
              <span style={{ fontSize: "11px", color: "var(--accent-secondary)" }}>High-energy commercial royalty-free tracks</span>
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
                      border: isSelected ? "1px solid var(--accent-secondary)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--bg-surface-3)" : "var(--bg-surface-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      minHeight: "64px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: isSelected ? "#ffffff" : "var(--text-primary)" }}>
                        {m.name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 6px",
                          borderRadius: "var(--radius-xs)",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "var(--accent-secondary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
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
                style={{ width: "100%", accentColor: "var(--accent-primary)" }}
                aria-label="Music volume slider"
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
                aria-label="SFX volume slider"
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
                aria-label="Voiceover ducking depth slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
