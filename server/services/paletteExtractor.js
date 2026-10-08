/**
 * Palette Extractor & Feature Classifier Service
 * Extracts 5-token brand color palettes from image buffers and
 * classifies feature archetypes from marketing prompts.
 */

/**
 * Returns a curated anti-slop color palette based on tone
 * @param {string} tone
 * @returns {Object}
 */
export function getDefaultThemePalette(tone = "default") {
  const palettes = {
    polished: {
      primary: "#6366f1", // Indigo
      secondary: "#38bdf8", // Sky blue
      accent: "#a855f7", // Purple
      background: "#080c16",
      surface: "#111827",
      text: "#f8fafc",
      isDark: true,
    },
    cinematic: {
      primary: "#e11d48", // Crimson rose
      secondary: "#fb7185",
      accent: "#f43f5e",
      background: "#050505",
      surface: "#18181b",
      text: "#ffffff",
      isDark: true,
    },
    "yc-parody": {
      primary: "#ea580c", // Hacker Orange
      secondary: "#f97316",
      accent: "#fb923c",
      background: "#0c0a09",
      surface: "#1c1917",
      text: "#fbfbfe",
      isDark: true,
    },
    chaotic: {
      primary: "#a855f7", // Electric Neon
      secondary: "#ec4899",
      accent: "#f43f5e",
      background: "#0f0728",
      surface: "#1f103d",
      text: "#ffffff",
      isDark: true,
    },
    deadpan: {
      primary: "#71717a", // Monochrome zinc
      secondary: "#a1a1aa",
      accent: "#ffffff",
      background: "#09090b",
      surface: "#18181b",
      text: "#f4f4f5",
      isDark: true,
    },
    "app-store": {
      primary: "#0284c7", // iOS Ocean
      secondary: "#38bdf8",
      accent: "#06b6d4",
      background: "#030712",
      surface: "#0f172a",
      text: "#ffffff",
      isDark: true,
    },
    default: {
      primary: "#6366f1", // Indigo core
      secondary: "#38bdf8",
      accent: "#10b981",
      background: "#090d16",
      surface: "#131b2e",
      text: "#f8fafc",
      isDark: true,
    },
  };

  return palettes[tone] || palettes.default;
}

/**
 * Extracts dominant color palette from image file buffer
 * @param {Buffer} buffer
 * @param {string} [tone="default"]
 * @returns {Object}
 */
export function extractPaletteFromBuffer(buffer, tone = "default") {
  const fallback = getDefaultThemePalette(tone);
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 100) {
    return fallback;
  }

  try {
    // Sample RGB-like bytes across the buffer payload
    // Step through the center 70% of the buffer to avoid compression headers
    const start = Math.floor(buffer.length * 0.15);
    const end = Math.floor(buffer.length * 0.85);
    const step = Math.max(1, Math.floor((end - start) / 400));

    const colorBins = new Map();

    for (let i = start; i < end - 3; i += step * 3) {
      const r = buffer[i];
      const g = buffer[i + 1];
      const b = buffer[i + 2];

      // Quantize to 32-step buckets to group similar hues
      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;

      // Discard extreme near-black (<25) and near-white (>235) to find vibrant brand colors
      const max = Math.max(qr, qg, qb);
      const min = Math.min(qr, qg, qb);
      const delta = max - min; // Saturation indicator

      if (max > 40 && min < 225 && delta > 20) {
        const hex = `#${qr.toString(16).padStart(2, "0")}${qg.toString(16).padStart(2, "0")}${qb.toString(16).padStart(2, "0")}`;
        colorBins.set(hex, (colorBins.get(hex) || 0) + 1);
      }
    }

    if (colorBins.size > 0) {
      // Sort colors by occurrence frequency
      const sorted = Array.from(colorBins.entries()).sort((a, b) => b[1] - a[1]);
      const primary = sorted[0]?.[0] || fallback.primary;
      const secondary = sorted[1]?.[0] || fallback.secondary;
      const accent = sorted[2]?.[0] || fallback.accent;

      return {
        primary,
        secondary,
        accent,
        background: fallback.background,
        surface: fallback.surface,
        text: fallback.text,
        isDark: true,
      };
    }
  } catch {
    // Graceful fallback to tone palette
  }

  return fallback;
}

/**
 * Classifies the specific feature archetype described in the prompt
 * @param {string} prompt
 * @returns {'analytics' | 'kanban' | 'chat' | 'feed' | 'checkout' | 'settings' | 'generic'}
 */
export function classifyFeatureArchetype(prompt = "") {
  if (!prompt || typeof prompt !== "string") return "analytics";
  const text = prompt.toLowerCase();

  if (/\b(kanban|board|trello|jira|backlog|sprint|tasks?|columns?|todo|in progress)\b/.test(text)) {
    return "kanban";
  }
  if (/\b(chat|assistant|copilot|llm|gpt|ai bot|messaging|conversation|dialogue|chatbox|prompts?)\b/.test(text)) {
    return "chat";
  }
  if (/\b(checkout|ecommerce|pricing|cart|payments?|stripe|billing|invoice|subscriptions?|shop)\b/.test(text)) {
    return "checkout";
  }
  if (/\b(feed|social|timeline|community|posts?|activity feed|comments?|stream)\b/.test(text)) {
    return "feed";
  }
  if (/\b(settings|profile|preferences|api keys?|authentication|security|configuration)\b/.test(text)) {
    return "settings";
  }
  if (/\b(analytics|metrics|dashboard|telemetry|kpi|charts?|graphs?|throughput|latency|monitoring)\b/.test(text)) {
    return "analytics";
  }

  return "analytics";
}

/**
 * Generates a default featureMockup descriptor for a given archetype
 * @param {string} archetype
 * @param {string} title
 * @returns {Object}
 */
export function createDefaultFeatureMockup(archetype, title = "Core Feature") {
  switch (archetype) {
    case "kanban":
      return {
        featureType: "kanban",
        title: `${title} Board`,
        subtitle: "Real-time task synchronization",
        items: [
          { label: "Design system audit", badge: "High Priority", status: "In Progress", color: "#f59e0b" },
          { label: "API endpoint caching", badge: "Backend", status: "Done", color: "#10b981" },
          { label: "Dark mode animations", badge: "UI / UX", status: "Review", color: "#6366f1" },
        ],
      };
    case "chat":
      return {
        featureType: "chat",
        title: `${title} AI Assistant`,
        subtitle: "Instant intelligent reasoning",
        items: [
          { label: "User", value: "How do I accelerate our launch workflow?" },
          { label: "Assistant", value: "Generate high-converting videos locally in 10 seconds with Marcutie." },
          { label: "User", value: "Show me the real-time analytics for today." },
        ],
      };
    case "checkout":
      return {
        featureType: "checkout",
        title: `${title} Checkout`,
        subtitle: "Instant 1-click conversion",
        items: [
          { label: "Pro Annual License", value: "$199/yr", badge: "Best Value" },
          { label: "Instant Cloud Sync", value: "Free", badge: "Included" },
          { label: "Priority Support 24/7", value: "Free", badge: "VIP" },
        ],
      };
    case "feed":
      return {
        featureType: "feed",
        title: `${title} Community`,
        subtitle: "Live activity & member engagement",
        items: [
          { label: "Sarah Founder", value: "Just launched our new product on Product Hunt! 🚀", badge: "2m ago" },
          { label: "Alex Engineer", value: "Performance improved by 40% with the latest update.", badge: "12m ago" },
          { label: "Elena Designer", value: "New motion graphics components are live in repo.", badge: "1h ago" },
        ],
      };
    case "settings":
      return {
        featureType: "settings",
        title: `${title} Preferences`,
        subtitle: "Manage keys and workspace settings",
        items: [
          { label: "Local GPU Acceleration", badge: "Enabled", status: "Active" },
          { label: "High-Res Poster Baking", badge: "Automated", status: "Active" },
          { label: "BYOK Encryption", badge: "AES-256", status: "Active" },
        ],
      };
    case "analytics":
    default:
      return {
        featureType: "analytics",
        title: `${title} Analytics`,
        subtitle: "Live execution metrics & telemetry",
        items: [
          { label: "Active Bandwidth", value: "148,290 req/s", badge: "+28.4% ↑" },
          { label: "Average Latency", value: "12.4 ms", badge: "-38.2% ↓" },
          { label: "System Uptime", value: "99.99%", badge: "Optimal" },
        ],
      };
  }
}
