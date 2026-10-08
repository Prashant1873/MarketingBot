/**
 * Adaptive Device Classifier
 * Intelligently classifies whether a product should be framed in macOS Chrome (landscape desktop browser)
 * or a Mobile Phone (portrait smartphone) based on:
 * 1. Uploaded image aspect ratio (ground truth for phone vs desktop screenshot)
 * 2. Prompt keyword analysis (mobile keywords vs SaaS/desktop keywords)
 * 3. User override
 */

export const MOBILE_KEYWORDS = [
  /\b(ios|iphone|ipad|android|mobile app|mobile apps|phone app|phone apps|app store|play store|pocket|on your phone|swipe|tap to|push notification|push notifications|mobile-first|handheld|smartphone|apk)\b/gi,
  /\b(mobile|phone|tablet)\b/gi,
];

export const DESKTOP_KEYWORDS = [
  /\b(saas|dashboard|dashboards|web app|web apps|website|chrome|browser|desktop|laptop|macos|mac|windows|portal|admin panel|cloud console|analytics dashboard|crm|b2b|platform|workstation)\b/gi,
  /\b(desktop app|web platform|browser extension|landing page)\b/gi,
];

/**
 * Classifies device frame as 'macos' | 'mobile'
 * @param {Object} options
 * @param {string} [options.prompt] - User's marketing or product prompt
 * @param {Object} [options.imageDimensions] - { width: number, height: number, aspectRatio?: number }
 * @param {'macos' | 'mobile'} [options.override] - Explicit user choice
 * @returns {'macos' | 'mobile'}
 */
export function classifyDeviceFrame({ prompt = "", imageDimensions = null, override = null } = {}) {
  // 1. Explicit user override takes top priority
  if (override === "macos" || override === "mobile") {
    return override;
  }

  // 2. If uploaded image has empirical dimensions, aspect ratio is primary ground truth
  if (imageDimensions && typeof imageDimensions.width === "number" && typeof imageDimensions.height === "number") {
    const { width, height } = imageDimensions;
    if (width > 0 && height > 0) {
      const ratio = width / height;
      // Portrait screenshots (e.g. 9:16, 3:4, typical phone capture)
      if (ratio < 0.95) {
        return "mobile";
      }
      // Landscape screenshots (e.g. 16:9, 16:10, 4:3, typical laptop/desktop capture)
      if (ratio > 1.05) {
        return "macos";
      }
      // If square (~1.0), fall through to prompt keyword analysis
    }
  }

  // 3. Prompt keyword analysis
  if (prompt && typeof prompt === "string") {
    const text = prompt.toLowerCase();

    let mobileScore = 0;
    for (const regex of MOBILE_KEYWORDS) {
      const matches = text.match(regex);
      if (matches) mobileScore += matches.length;
    }

    let desktopScore = 0;
    for (const regex of DESKTOP_KEYWORDS) {
      const matches = text.match(regex);
      if (matches) desktopScore += matches.length;
    }

    if (mobileScore > desktopScore) {
      return "mobile";
    }
    if (desktopScore > mobileScore) {
      return "macos";
    }
  }

  // Default fallback for SaaS / launch tools is macOS Chrome
  return "macos";
}
