import { useState, useEffect } from "react";
import { Sparkles, Server, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [serverInfo, setServerInfo] = useState<{ app?: string; version?: string }>({});

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        setServerStatus("online");
        setServerInfo(data);
      })
      .catch(() => {
        setServerStatus("offline");
      });
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
            }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>Marcutie</h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Local Marketing & Launch Video Generator</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "999px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            fontSize: "13px",
          }}
        >
          <Server size={14} color="var(--text-secondary)" />
          <span>Local Server:</span>
          {serverStatus === "checking" && <span style={{ color: "var(--text-muted)" }}>Checking...</span>}
          {serverStatus === "online" && (
            <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={14} /> Online ({serverInfo.version || "1.0"})
            </span>
          )}
          {serverStatus === "offline" && (
            <span style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "4px" }}>
              <AlertCircle size={14} /> Offline (:3001)
            </span>
          )}
        </div>
      </header>

      <main>
        <div
          style={{
            background: "var(--bg-card)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 32px",
            textAlign: "center",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "var(--accent-primary)",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Phase 1: Local Scaffold Active
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "16px", lineHeight: "1.2" }}>
            Turn prompts & images into viral marketing videos
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
            Local-first video composition powered by Remotion, BYOK multimodal AI, and 100% client-side rendering with zero server GPU costs.
          </p>
        </div>
      </main>
    </div>
  );
}
