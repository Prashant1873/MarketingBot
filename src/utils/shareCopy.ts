import { Storyboard, Tone } from "../types";

export interface TwitterCopyResult {
  text: string;
  charCount: number;
  isUnderLimit: boolean;
}

export interface FormattedShareCopy {
  twitter: TwitterCopyResult;
  linkedin: string;
  discord: string;
}

const TONE_HASHTAGS: Record<string, string[]> = {
  polished: ["#buildinpublic", "#launch", "#saas", "#indiehackers"],
  "yc-parody": ["#founders", "#startups", "#venturecapital", "#growth"],
  cinematic: ["#productdesign", "#motiongraphics", "#launchday"],
  chaotic: ["#shipit", "#buildinpublic", "#indiedev"],
  deadpan: ["#tech", "#software", "#minimalism"],
  "app-store": ["#applaunch", "#mobile", "#ios", "#android"],
  default: ["#buildinpublic", "#launch", "#indiehackers"],
};

/**
 * Generates punchy, character-aware Twitter / X launch copy
 */
export function formatTwitterCopy(storyboard: Storyboard, tone?: Tone): TwitterCopyResult {
  const effectiveTone = tone || storyboard.tone || "default";
  const tags = TONE_HASHTAGS[effectiveTone] || TONE_HASHTAGS.default;

  // Use AI-generated twitter copy as base if present
  let baseCopy = storyboard.shareCopy?.twitter?.trim() || "";

  if (!baseCopy) {
    const hook = storyboard.scenes?.find((s) => s.type === "hook")?.headline || storyboard.title;
    baseCopy = `🚀 ${hook}

${storyboard.tagline || "Built for speed and simplicity."}

Check out the full launch video below 👇`;
  }

  // Ensure CTA and tags
  const ctaPart = "🔗 Try it out: https://yourlink.com";
  const tagPart = tags.slice(0, 3).join(" ");

  const fullText = `${baseCopy}\n\n${ctaPart}\n${tagPart}`.trim();
  const charCount = fullText.length;

  return {
    text: fullText,
    charCount,
    isUnderLimit: charCount <= 280,
  };
}

/**
 * Generates story-driven, algorithm-friendly LinkedIn launch post
 */
export function formatLinkedInCopy(storyboard: Storyboard, _tone?: Tone): string {
  if (storyboard.shareCopy?.linkedin?.trim()) {
    return storyboard.shareCopy.linkedin.trim();
  }

  const hook = storyboard.scenes?.find((s) => s.type === "hook")?.headline || storyboard.title;
  const reveal = storyboard.scenes?.find((s) => s.type === "product_reveal");
  const highlights = storyboard.scenes?.find((s) => s.type === "highlight_beats");

  const featureBullets = (highlights?.beats || [
    "100% local rendering — zero cloud fees",
    "Pristine 1080p 60fps export quality",
    "Bakes custom cover poster into frame 0",
  ])
    .map((b) => `• ${b}`)
    .join("\n");

  return `We spent the last few weeks rethinking how product launches should feel.

Introducing ${storyboard.title}: ${storyboard.tagline}

${hook}

${reveal?.subtext || "Designed from the ground up for modern creators."}

Key Highlights:
${featureBullets}

Check out the launch teaser video below. What feature would you like to see next?

Drop your thoughts in the comments! 👇

#buildinpublic #startups #productlaunch #saas #innovation`;
}

/**
 * Generates Discord / community markdown launch announcement
 */
export function formatDiscordCopy(storyboard: Storyboard, _tone?: Tone): string {
  if (storyboard.shareCopy?.discord?.trim()) {
    return storyboard.shareCopy.discord.trim();
  }

  const hook = storyboard.scenes?.find((s) => s.type === "hook")?.headline || storyboard.title;
  const highlights = storyboard.scenes?.find((s) => s.type === "highlight_beats");

  const bullets = (highlights?.beats || [
    "Instant video generation from prompts & screenshots",
    "Frame-0 poster thumbnail baking",
    "Local-first rendering with zero cloud GPU fees",
  ])
    .map((b) => `> • **${b}**`)
    .join("\n");

  return `🎉 **${storyboard.title} is officially live!** 🎉
*${storyboard.tagline}*

**What it does:**
${hook}

**Features:**
${bullets}

📹 *Watch the launch video above!*
Feedback and bug reports are welcome in this channel 🙌`;
}

/**
 * Returns formatted copy across all 3 platforms
 */
export function getAllShareCopy(storyboard: Storyboard, tone?: Tone): FormattedShareCopy {
  return {
    twitter: formatTwitterCopy(storyboard, tone),
    linkedin: formatLinkedInCopy(storyboard, tone),
    discord: formatDiscordCopy(storyboard, tone),
  };
}
