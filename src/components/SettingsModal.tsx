import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, Eye, EyeOff, Check, Cpu } from "lucide-react";
import { Preferences } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasKey: { gemini: boolean; anthropic: boolean; openai: boolean };
  currentPreferences?: Preferences;
  onSave: (
    apiKeys: { gemini?: string; anthropic?: string; openai?: string },
    preferences?: Partial<Preferences>
  ) => Promise<boolean>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hasKey,
  currentPreferences,
  onSave,
}) => {
  const [geminiKey, setGeminiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [preferredProvider, setPreferredProvider] = useState<"gemini" | "anthropic" | "openai">("gemini");

  const [showGemini, setShowGemini] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentPreferences?.preferredProvider) {
      setPreferredProvider(currentPreferences.preferredProvider);
    }
  }, [currentPreferences]);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("marcutie_persistent_keys");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.gemini && !geminiKey) setGeminiKey(parsed.gemini);
          if (parsed.anthropic && !anthropicKey) setAnthropicKey(parsed.anthropic);
          if (parsed.openai && !openaiKey) setOpenaiKey(parsed.openai);
        }
      } catch {
        // Ignore
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const keysToSave: { gemini?: string; anthropic?: string; openai?: string } = {};
    if (geminiKey.trim()) keysToSave.gemini = geminiKey.trim();
    if (anthropicKey.trim()) keysToSave.anthropic = anthropicKey.trim();
    if (openaiKey.trim()) keysToSave.openai = openaiKey.trim();

    const ok = await onSave(keysToSave, { preferredProvider });
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-medium)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-primary)",
              }}
            >
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>BYOK API Configuration</h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Keys remain 100% on your local machine
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: "6px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Preferred Model Provider */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "var(--text-primary)",
                }}
              >
                Preferred Multimodal Provider
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  { id: "gemini", label: "Google Gemini", model: "Flash / Pro" },
                  { id: "anthropic", label: "Anthropic", model: "Claude 3.5 Sonnet" },
                  { id: "openai", label: "OpenAI", model: "GPT-4o" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferredProvider(item.id as "gemini" | "anthropic" | "openai")}
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: preferredProvider === item.id ? "1px solid var(--accent-primary)" : "1px solid var(--border-medium)",
                      background: preferredProvider === item.id ? "rgba(99, 102, 241, 0.15)" : "var(--bg-surface-2)",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700", color: preferredProvider === item.id ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{item.model}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Google Gemini Key */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                  Google Gemini API Key
                </label>
                {hasKey.gemini && (
                  <span style={{ fontSize: "11px", color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={13} /> Saved on Disk
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showGemini ? "text" : "password"}
                  placeholder={hasKey.gemini ? "••••••••••••••••••••••••••••••••" : "AIzaSy..."}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="glass-input"
                  style={{ width: "100%", padding: "10px 42px 10px 14px", fontSize: "13px", fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="btn-ghost"
                  style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", padding: "6px" }}
                >
                  {showGemini ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Anthropic Claude Key */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                  Anthropic Claude API Key
                </label>
                {hasKey.anthropic && (
                  <span style={{ fontSize: "11px", color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={13} /> Saved on Disk
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showAnthropic ? "text" : "password"}
                  placeholder={hasKey.anthropic ? "••••••••••••••••••••••••••••••••" : "sk-ant-..."}
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  className="glass-input"
                  style={{ width: "100%", padding: "10px 42px 10px 14px", fontSize: "13px", fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropic(!showAnthropic)}
                  className="btn-ghost"
                  style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", padding: "6px" }}
                >
                  {showAnthropic ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* OpenAI Key */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                  OpenAI API Key
                </label>
                {hasKey.openai && (
                  <span style={{ fontSize: "11px", color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={13} /> Saved on Disk
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showOpenai ? "text" : "password"}
                  placeholder={hasKey.openai ? "••••••••••••••••••••••••••••••••" : "sk-..."}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="glass-input"
                  style={{ width: "100%", padding: "10px 42px 10px 14px", fontSize: "13px", fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowOpenai(!showOpenai)}
                  className="btn-ghost"
                  style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", padding: "6px" }}
                >
                  {showOpenai ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Security note */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "flex",
                gap: "8px",
                lineHeight: "1.4",
              }}
            >
              <Cpu size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                Your API keys are stored in <code>data/config.json</code> on your machine and only used when calling the AI model for storyboard generation.
              </span>
            </div>
          </div>

          {/* Footer action buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-medium)",
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: "8px 16px" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
              style={{ padding: "8px 20px" }}
            >
              {saveSuccess ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : isSaving ? (
                "Saving..."
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
