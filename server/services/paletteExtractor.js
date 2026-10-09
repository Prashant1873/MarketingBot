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
      background: "#080718",
      surface: "#121128",
      text: "#f8fafc",
      isDark: true,
    },
    cinematic: {
      primary: "#e11d48", // Crimson rose
      secondary: "#fb7185",
      accent: "#f43f5e",
      background: "#120509",
      surface: "#200912",
      text: "#ffffff",
      isDark: true,
    },
    "yc-parody": {
      primary: "#ea580c", // Hacker Orange
      secondary: "#f97316",
      accent: "#fb923c",
      background: "#140804",
      surface: "#22110a",
      text: "#fbfbfe",
      isDark: true,
    },
    chaotic: {
      primary: "#a855f7", // Electric Neon
      secondary: "#ec4899",
      accent: "#f43f5e",
      background: "#130524",
      surface: "#240a3e",
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
      background: "#020f1c",
      surface: "#061a30",
      text: "#ffffff",
      isDark: true,
    },
    default: {
      primary: "#6366f1", // Indigo core
      secondary: "#8b5cf6",
      accent: "#ec4899",
      background: "#090818",
      surface: "#14122b",
      text: "#f8fafc",
      isDark: true,
    },
  };

  return palettes[tone] || palettes.default;
}

export const VISUAL_THEME_PALETTES = {
  "default-dark": {
    primary: "#6366f1",
    secondary: "#38bdf8",
    accent: "#a855f7",
    background: "#070a13",
    surface: "#101628",
    text: "#ffffff",
    isDark: true,
    visualTheme: "default-dark",
  },
  "apple-clean": {
    primary: "#0071e3",
    secondary: "#1d1d1f",
    accent: "#34c759",
    background: "#fbfbfd",
    surface: "#f5f5f7",
    text: "#1d1d1f",
    isDark: false,
    visualTheme: "apple-clean",
  },
  "neo-brutalist": {
    primary: "#ffe600",
    secondary: "#00f0ff",
    accent: "#ff0055",
    background: "#fffdf9",
    surface: "#ffffff",
    text: "#000000",
    isDark: false,
    visualTheme: "neo-brutalist",
  },
  "cyberpunk-scanlines": {
    primary: "#00f0ff",
    secondary: "#ff0055",
    accent: "#00ff66",
    background: "#080014",
    surface: "#12002b",
    text: "#ffffff",
    isDark: true,
    visualTheme: "cyberpunk-scanlines",
  },
  "aurora-glass": {
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    accent: "#10b981",
    background: "#060918",
    surface: "#0e1530",
    text: "#f8fafc",
    isDark: true,
    visualTheme: "aurora-glass",
  },
};

export function getVisualThemePalette(theme = "default-dark") {
  return VISUAL_THEME_PALETTES[theme] || VISUAL_THEME_PALETTES["default-dark"];
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
      const background = deriveBrandDarkBackground(primary);
      const surface = deriveBrandDarkSurface(primary);

      return {
        primary,
        secondary,
        accent,
        background,
        surface,
        text: fallback.text || "#f8fafc",
        isDark: true,
      };
    }
  } catch {
    // Graceful fallback to tone palette
  }

  return fallback;
}

export function hexToHsl(hex) {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split("").map((c) => c + c).join("") : cleanHex, 16);
  if (isNaN(num)) return [0, 0, 10];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function deriveBrandDarkBackground(primaryHex) {
  if (!primaryHex || typeof primaryHex !== "string" || !primaryHex.startsWith("#")) return "#0a0a0e";
  const [h] = hexToHsl(primaryHex);
  return hslToHex(h, 32, 5);
}

export function deriveBrandDarkSurface(primaryHex) {
  if (!primaryHex || typeof primaryHex !== "string" || !primaryHex.startsWith("#")) return "#14141e";
  const [h] = hexToHsl(primaryHex);
  return hslToHex(h, 28, 11);
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
