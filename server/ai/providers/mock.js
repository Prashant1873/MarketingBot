import { classifyDeviceFrame } from "../../services/deviceClassifier.js";
import {
  getDefaultThemePalette,
  classifyFeatureArchetype,
  createDefaultFeatureMockup,
} from "../../services/paletteExtractor.js";

export async function generateMockStoryboard(params) {
  const {
    prompt,
    tone = "default",
    customTone = "",
    aspectRatio = "16:9",
    targetDuration = 20,
    hasImage = false,
    imageDimensions = null,
    deviceFrame: explicitDeviceFrame = null,
    themePalette: explicitThemePalette = null,
  } = params;

  const deviceFrame = classifyDeviceFrame({
    prompt,
    imageDimensions,
    override: explicitDeviceFrame,
  });

  const themePalette = explicitThemePalette || getDefaultThemePalette(tone);
  const archetype = classifyFeatureArchetype(prompt);

  // Extract rough title from prompt
  const firstSentence = prompt.split(/[.\n]/)[0].trim();
  const titleWords = firstSentence.split(/\s+/).slice(0, 4).join(" ");
  const productTitle = titleWords || "Marcutie Launch";
  const featureMockup = createDefaultFeatureMockup(archetype, productTitle);

  // Calculate durations according to marketing laws
  let hookDur = 2.5;
  let outroDur = 3.5;
  let remaining = targetDuration - (hookDur + outroDur); // e.g. 20 - 6 = 14
  let revealDur = Math.round((remaining * 0.4) * 10) / 10;
  let highlightDur = Math.round((remaining - revealDur) * 10) / 10;

  // Tone-specific hook templates
  const toneHooks = {
    "default": "Everything you knew about this is about to change.",
    "polished": "Engineered for pure performance and craft.",
    "yc-parody": "We spent $10M in seed funding to solve this completely obvious problem.",
    "chaotic": "STOP WHAT YOU ARE DOING RIGHT NOW.",
    "deadpan": "Here is a thing. It does what it says.",
    "cinematic": "The next chapter begins today.",
    "app-store": "Introducing the ultimate breakthrough.",
  };

  const hookHeadline = toneHooks[tone] || "Meet the next revolution.";

  const scenes = [
    {
      id: "scene-1",
      type: "hook",
      duration: hookDur,
      headline: hookHeadline,
      subtext: customTone || "Prepare for the new standard",
      visualEmphasis: "kinetic_typography",
      transition: tone === "chaotic" ? "slam" : "wipe",
    },
    {
      id: "scene-2",
      type: "product_reveal",
      duration: revealDur,
      headline: productTitle,
      subtext: firstSentence,
      deviceFrame,
      themePalette,
      featureMockup,
      visualEmphasis: hasImage ? "3d_tilt" : "gradient_glow",
      transition: "clean_cut",
    },
    {
      id: "scene-3",
      type: "highlight_beats",
      duration: highlightDur,
      headline: "Built without compromise.",
      subtext: "Three breakthrough capabilities",
      beats: [
        "100% Local processing with zero cloud fees",
        "Lightning fast execution and instant feedback",
        "Engineered for modern high-converting launches",
      ],
      visualEmphasis: "sequential_cards",
      transition: "slide",
    },
    {
      id: "scene-4",
      type: "outro",
      duration: outroDur,
      headline: productTitle,
      subtext: "Available now everywhere.",
      cta: "Try it today",
      visualEmphasis: "logo_glow",
      transition: "fade_out",
    },
  ];

  return {
    title: productTitle,
    tagline: firstSentence,
    tone,
    aspectRatio,
    targetDuration,
    deviceFrame,
    imageDimensions,
    themePalette,
    featureMockup,
    scenes,
    audioDirection: {
      musicMood: tone === "cinematic" ? "cinematic" : "upbeat",
      trackRecommendation: "pulse-launch-theme.wav",
      sfxCues: ["click.wav", "whoosh.wav", "heavy_slam.wav"],
    },
    shareCopy: {
      twitter: `Just launched ${productTitle}! ${firstSentence} Link in bio.`,
      linkedin: `Proud to unveil ${productTitle}: ${firstSentence} Built for engineers and founders who move fast.`,
      discord: `🚀 Hey everyone! Check out ${productTitle} — ${firstSentence}`,
    },
  };
}
