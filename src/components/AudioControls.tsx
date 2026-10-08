import { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Play, Pause, Sparkles, Sliders } from "lucide-react";
import { AudioConfig, MusicTrack, Tone } from "../types";

interface AudioControlsProps {
  audioConfig: AudioConfig;
  onAudioConfigChange: (config: AudioConfig) => void;
  storyboardTone?: Tone;
}

export function AudioControls({
  audioConfig,
  onAudioConfigChange,
  storyboardTone = "default",
}: AudioControlsProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio catalog from server
  useEffect(() => {
    fetch(`/api/assets/audio?tone=${storyboardTone}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.music)) {
          setTracks(data.music);
          // If no track is currently selected or default, set to recommended track
          if (!audioConfig.selectedMusicTrack && data.recommendedTrack) {
            onAudioConfigChange({
              ...audioConfig,
              selectedMusicTrack: data.recommendedTrack.id,
            });
          }
        }
      })
      .catch((err) => {
        console.warn("[AudioControls] Failed to fetch audio catalog:", err);
      });
  }, [storyboardTone]);

  // Handle live audition playback in browser
  const toggleAudition = (track: MusicTrack) => {
    if (previewingTrackId === track.id) {
      // Pause current
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPreviewingTrackId(null);
    } else {
      // Play new
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      const audio = new Audio(track.url);
      audio.volume = audioConfig.isMuted ? 0 : audioConfig.musicVolume;
      audio.play().catch(() => {});
      audio.onended = () => setPreviewingTrackId(null);
      audioPreviewRef.current = audio;
      setPreviewingTrackId(track.id);
    }
  };

  // Stop audition when unmounted
  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      className="glass-panel"
      style={{
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(168, 85, 247, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-secondary)",
            }}
          >
            <Music size={15} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Soundtrack & Sound Design</h4>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Curated CC0 tracks with motion-synchronized SFX hits
            </div>
          </div>
        </div>

        {/* Quick Mute Toggle */}
        <button
          onClick={() =>
            onAudioConfigChange({ ...audioConfig, isMuted: !audioConfig.isMuted })
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: "600",
            border: "1px solid var(--border-color)",
            cursor: "pointer",
            background: audioConfig.isMuted ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.05)",
            color: audioConfig.isMuted ? "#fca5a5" : "var(--text-primary)",
          }}
        >
          {audioConfig.isMuted ? (
            <>
              <VolumeX size={13} color="#ef4444" /> Muted
            </>
          ) : (
            <>
              <Volume2 size={13} color="var(--accent-primary)" /> Audio On
            </>
          )}
        </button>
      </div>

      {/* Music Track Selector Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
        {tracks.map((track) => {
          const isSelected = audioConfig.selectedMusicTrack === track.id;
          const isRecommended = track.tones?.includes(storyboardTone);
          const isAuditioning = previewingTrackId === track.id;

          return (
            <div
              key={track.id}
              onClick={() =>
                onAudioConfigChange({ ...audioConfig, selectedMusicTrack: track.id })
              }
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                background: isSelected ? "rgba(99, 102, 241, 0.15)" : "rgba(0, 0, 0, 0.3)",
                border: `1px solid ${isSelected ? "var(--accent-primary)" : "var(--border-color)"}`,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? "#ffffff" : "var(--text-primary)" }}>
                    {track.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {track.bpm} BPM • {track.mood}
                  </div>
                </div>

                {/* Audition Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudition(track);
                  }}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isAuditioning ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title={isAuditioning ? "Pause audition" : "Audition soundtrack"}
                >
                  {isAuditioning ? <Pause size={12} fill="#fff" /> : <Play size={12} fill="#fff" />}
                </button>
              </div>

              {/* Badges footer */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                {isRecommended && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <Sparkles size={10} /> Tone Match
                  </span>
                )}
                {isSelected && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(99, 102, 241, 0.25)",
                      color: "var(--accent-primary)",
                      marginLeft: "auto",
                    }}
                  >
                    Active Track
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Volume Sliders */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          padding: "14px 18px",
          borderRadius: "10px",
          background: "rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Background Music Volume */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Music size={12} /> Music Volume
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)" }}>
              {Math.round(audioConfig.musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioConfig.musicVolume}
            onChange={(e) =>
              onAudioConfigChange({
                ...audioConfig,
                musicVolume: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
          />
        </div>

        {/* SFX Volume */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Sliders size={12} /> SFX Impact Volume
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)" }}>
              {Math.round(audioConfig.sfxVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioConfig.sfxVolume}
            onChange={(e) =>
              onAudioConfigChange({
                ...audioConfig,
                sfxVolume: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%", accentColor: "var(--accent-secondary)", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
