import { FeatureMockup, ThemePalette } from "../types";

export interface GeneratedHtmlCss {
  html: string;
  css: string;
  fullDocument: string;
}

export function generateHtmlCssForFeature(
  mockup: FeatureMockup,
  palette: ThemePalette,
  title: string = "Marcutie"
): GeneratedHtmlCss {
  const type = mockup.featureType || "analytics";
  const primary = palette.primary || "#6366f1";
  const secondary = palette.secondary || "#38bdf8";
  const accent = palette.accent || "#10b981";
  const background = palette.background || "#090818";
  const surface = palette.surface || "#14122b";
  const text = palette.text || "#f8fafc";

  const css = `:root {
  --brand-primary: ${primary};
  --brand-secondary: ${secondary};
  --brand-accent: ${accent};
  --brand-bg: ${background};
  --brand-surface: ${surface};
  --brand-text: ${text};
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--brand-bg);
  color: var(--brand-text);
  overflow: hidden;
}

.feature-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--brand-bg);
  box-sizing: border-box;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}

.feature-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0 0 4px 0;
}

.feature-subtitle {
  font-size: 13px;
  opacity: 0.7;
  margin: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid var(--brand-primary);
  color: var(--brand-primary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.feature-card {
  background: var(--brand-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-label {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 24px;
  font-weight: 800;
  margin: 8px 0;
  color: #ffffff;
}

.card-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-accent);
}
`;

  let htmlContent = "";

  if (type === "kanban") {
    htmlContent = `<div class="feature-container">
  <div class="feature-header">
    <div>
      <h2 class="feature-title">${mockup.title || title + " Sprint Board"}</h2>
      <p class="feature-subtitle">${mockup.subtitle || "Real-time task synchronization"}</p>
    </div>
    <span class="badge">Live Kanban</span>
  </div>
  <div class="card-grid">
    <div class="feature-card">
      <div class="card-label">To Do</div>
      <div class="card-value">3 Tasks</div>
      <div class="card-badge">Design system audit</div>
    </div>
    <div class="feature-card" style="border-color: var(--brand-primary);">
      <div class="card-label">In Progress</div>
      <div class="card-value">2 Active</div>
      <div class="card-badge">Core Engine Pipeline</div>
    </div>
    <div class="feature-card">
      <div class="card-label">Done</div>
      <div class="card-value">8 Deployed</div>
      <div class="card-badge">Production Launch v1.0</div>
    </div>
  </div>
</div>`;
  } else if (type === "chat") {
    htmlContent = `<div class="feature-container">
  <div class="feature-header">
    <div>
      <h2 class="feature-title">${mockup.title || title + " AI Assistant"}</h2>
      <p class="feature-subtitle">${mockup.subtitle || "Conversational intelligence flow"}</p>
    </div>
    <span class="badge">Online</span>
  </div>
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div class="feature-card" style="align-self: flex-start; max-width: 80%;">
      <div class="card-label">AI Copilot</div>
      <div style="font-size: 14px; margin-top: 4px;">How can I accelerate your launch today?</div>
    </div>
    <div class="feature-card" style="align-self: flex-end; max-width: 80%; background: var(--brand-primary); color: #fff;">
      <div class="card-label" style="color: rgba(255,255,255,0.8);">You</div>
      <div style="font-size: 14px; margin-top: 4px;">Generate high-converting marketing campaign.</div>
    </div>
  </div>
</div>`;
  } else {
    // Analytics & general default
    const items = mockup.items && mockup.items.length > 0 ? mockup.items : [
      { label: "Active Velocity", value: "98.4%", badge: "+14.2% ↑" },
      { label: "Render Latency", value: "1.2s", badge: "-42.8% ↓" },
      { label: "Total Reach", value: "2.4M", badge: "Trending" },
    ];

    htmlContent = `<div class="feature-container">
  <div class="feature-header">
    <div>
      <h2 class="feature-title">${mockup.title || title + " Dashboard"}</h2>
      <p class="feature-subtitle">${mockup.subtitle || "Real-time metrics and analytics"}</p>
    </div>
    <span class="badge">Verified</span>
  </div>
  <div class="card-grid">
${items
  .map(
    (item) => `    <div class="feature-card">
      <div class="card-label">${item.label}</div>
      <div class="card-value">${item.value}</div>
      <div class="card-badge">${item.badge}</div>
    </div>`
  )
  .join("\n")}
  </div>
</div>`;
  }

  const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mockup.title || title}</title>
  <style>
${css}
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  return {
    html: htmlContent,
    css,
    fullDocument,
  };
}
