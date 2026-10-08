export function validateStoryboard(storyboard, targetDuration = 20) {
  const errors = [];

  if (!storyboard || typeof storyboard !== "object") {
    return { valid: false, errors: ["Storyboard is not an object"] };
  }

  if (!Array.isArray(storyboard.scenes) || storyboard.scenes.length < 3) {
    errors.push("Storyboard must contain at least 3 scenes.");
  }

  const hookScene = storyboard.scenes?.[0];
  if (!hookScene || hookScene.type !== "hook") {
    errors.push("First scene must be of type 'hook'.");
  } else if (hookScene.duration < 2.0 || hookScene.duration > 3.0) {
    errors.push(`Hook scene duration (${hookScene.duration}s) must be between 2.0s and 3.0s.`);
  }

  const totalDur = (storyboard.scenes || []).reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  if (Math.abs(totalDur - targetDuration) > 0.2) {
    errors.push(`Total scene duration (${totalDur.toFixed(1)}s) does not match target (${targetDuration}s).`);
  }

  // Reading-time floor checks
  for (const scene of storyboard.scenes || []) {
    const text = `${scene.headline || ""} ${scene.subtext || ""}`.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    const minHold = wordCount <= 3 ? 0.8 : Math.max(1.2, wordCount * 0.3);
    if (scene.duration < minHold) {
      errors.push(
        `Scene '${scene.id}' duration (${scene.duration}s) violates reading floor (${minHold.toFixed(1)}s for ${wordCount} words).`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function autoFixStoryboard(storyboard, targetDuration = 20) {
  if (!storyboard || typeof storyboard !== "object") {
    throw new Error("Invalid storyboard object");
  }

  const fixed = JSON.parse(JSON.stringify(storyboard));

  if (!Array.isArray(fixed.scenes)) {
    fixed.scenes = [];
  }

  // 1. Ensure hook scene is first and duration is clamped to [2.0, 3.0]
  if (fixed.scenes.length === 0 || fixed.scenes[0].type !== "hook") {
    fixed.scenes.unshift({
      id: "scene-hook",
      type: "hook",
      duration: 2.5,
      headline: fixed.title ? `Introducing ${fixed.title}` : "Meet the next revolution.",
      subtext: "Pay close attention.",
      visualEmphasis: "kinetic_typography",
      transition: "slam",
    });
  } else {
    // Clamp hook duration
    const d = Number(fixed.scenes[0].duration) || 2.5;
    fixed.scenes[0].duration = Math.max(2.0, Math.min(3.0, d));
  }

  // 2. Enforce reading time floor: if text exceeds duration, condense words
  for (const scene of fixed.scenes) {
    const headline = String(scene.headline || "");
    const subtext = String(scene.subtext || "");
    const dur = Number(scene.duration) || 2.5;

    // Calculate maximum readable words for this duration (dur / 0.3)
    const maxWords = Math.max(4, Math.floor(dur / 0.3));
    const words = `${headline} ${subtext}`.trim().split(/\s+/);

    if (words.length > maxWords && headline.split(/\s+/).length > maxWords) {
      scene.headline = headline.split(/\s+/).slice(0, maxWords).join(" ") + "...";
    }
  }

  // 3. Mathematical timing adjustment: sum must exactly equal targetDuration
  let hookDur = fixed.scenes[0].duration;
  let otherScenes = fixed.scenes.slice(1);

  if (otherScenes.length === 0) {
    otherScenes.push({
      id: "scene-outro",
      type: "outro",
      duration: targetDuration - hookDur,
      headline: fixed.title || "Marcutie",
      subtext: "Live now.",
      visualEmphasis: "logo_glow",
      transition: "fade_out",
    });
    fixed.scenes.push(otherScenes[0]);
  }

  const currentOtherSum = otherScenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const targetOtherSum = targetDuration - hookDur;

  if (currentOtherSum > 0 && Math.abs(currentOtherSum - targetOtherSum) > 0.05) {
    const scale = targetOtherSum / currentOtherSum;
    let accumulated = hookDur;

    for (let i = 0; i < otherScenes.length; i++) {
      if (i === otherScenes.length - 1) {
        // Last scene takes the exact remainder
        otherScenes[i].duration = Math.max(1.5, Math.round((targetDuration - accumulated) * 10) / 10);
      } else {
        const scaled = Math.round((otherScenes[i].duration * scale) * 10) / 10;
        otherScenes[i].duration = Math.max(1.5, scaled);
        accumulated += otherScenes[i].duration;
      }
    }
  }

  // 4. Ensure audio direction defaults
  if (!fixed.audioDirection) fixed.audioDirection = {};
  if (!fixed.audioDirection.trackRecommendation) {
    fixed.audioDirection.trackRecommendation = "pulse-launch-theme.wav";
  }
  if (!fixed.audioDirection.sfxCues || !Array.isArray(fixed.audioDirection.sfxCues)) {
    fixed.audioDirection.sfxCues = ["click.wav", "whoosh.wav", "heavy_slam.wav"];
  }

  // 5. Ensure share copy defaults
  if (!fixed.shareCopy) fixed.shareCopy = {};
  const fallbackPitch = fixed.tagline || fixed.title || "Check this out";
  if (!fixed.shareCopy.twitter) {
    fixed.shareCopy.twitter = `Just launched ${fixed.title || "this"}! ${fallbackPitch} Link below.`;
  }
  if (!fixed.shareCopy.linkedin) {
    fixed.shareCopy.linkedin = `Excited to announce ${fixed.title || "our launch"}: ${fallbackPitch}. Built for fast-moving teams.`;
  }
  if (!fixed.shareCopy.discord) {
    fixed.shareCopy.discord = `🚀 Launched ${fixed.title || "project"}! ${fallbackPitch}`;
  }

  return fixed;
}
