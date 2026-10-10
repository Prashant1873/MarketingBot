import React from "react";
import { FileText, Sparkles, X, Wand2 } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SAMPLE_PROMPTS = [
  {
    category: "Devtool",
    label: "Postgres Migrations",
    prompt:
      "Automated zero-downtime database migrations for Postgres. Runs in CI/CD, tests rollbacks automatically on ephemeral replicas, and guarantees zero lock contention on production tables. Built for engineering teams that ship 20 times a day without fear.",
  },
  {
    category: "Hardware",
    label: "Monolith Clock",
    prompt:
      "Monolith 01: A titanium desk clock with no numbers, no apps, and no notifications. Just a mechanical bar that gently fills as the sun crosses your horizon. Reclaim your focus with pure analog tranquility.",
  },
  {
    category: "AI Agent",
    label: "Figma-to-React",
    prompt:
      "DeepLens: An AI agent that watches your Figma designs and writes production-ready React components with pixel-perfect CSS tokens, responsive flexbox layout, and full WCAG AAA accessibility. Ship frontends at the speed of thought.",
  },
  {
    category: "Startup",
    label: "Taxi for Taxis",
    prompt:
      "Taxi for Taxis: The world's first on-demand flatbed ride-hailing app for ride-hailing vehicles. Every day, taxis carry passengers across 12 metros. But when a taxi gets tired, who carries the taxi? We do. Available now in Series A beta.",
  },
];

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  // Professional launch video narration pace: roughly 2.3 words/sec
  const estimatedPacingSec = wordCount > 0 ? Math.round(wordCount / 2.3) : 0;

  return (
    <section className="studio-panel" style={{ padding: "24px" }} aria-labelledby="prompt-input-heading">
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={18} color="var(--accent-primary)" />
          <h2 id="prompt-input-heading" style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" }}>
            Marketing Script & Product Pitch
          </h2>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="btn-ghost"
            style={{
              fontSize: "12px",
              minHeight: "36px",
              padding: "6px 12px",
              color: "var(--text-muted)",
            }}
            aria-label="Clear prompt text"
          >
            <X size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.5" }}>
        Enter your core product value proposition, landing page hero copy, or launch announcement. The multimodal pipeline synthesizes high-impact scenes and motion graphics.
      </p>

      {/* Textarea container */}
      <div style={{ position: "relative" }}>
        <textarea
          id="marketing-prompt-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or write your product copy, value hook, and target customer highlights..."
          className="studio-input"
          style={{
            width: "100%",
            minHeight: "140px",
            padding: "14px 16px",
            fontSize: "14px",
            lineHeight: "1.6",
            resize: "vertical",
            display: "block",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
          aria-label="Product Concept & Marketing Pitch"
        />

        {/* Dynamic telemetry stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>{wordCount} words</span>
            <span>•</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>{charCount} chars</span>
          </div>

          {wordCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <span>Narration pacing:</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: "600",
                  color: estimatedPacingSec > 25 ? "var(--warning)" : "var(--accent-secondary)",
                }}
              >
                ~{estimatedPacingSec}s audio runtime
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Launch Inspiration Chips */}
      <div
        style={{
          marginTop: "18px",
          paddingTop: "14px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <Sparkles size={13} color="var(--accent-secondary)" />
          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>
            Quick Launch Inspiration:
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => onChange(sample.prompt)}
              className="btn-secondary"
              style={{
                fontSize: "12px",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-subtle)",
                minHeight: "36px",
              }}
              title={sample.prompt}
            >
              <Wand2 size={12} color="var(--accent-secondary)" />
              <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{sample.label}</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>({sample.category})</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
