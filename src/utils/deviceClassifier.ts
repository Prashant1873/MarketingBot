import { DeviceFrame } from "../types";

export const MOBILE_KEYWORDS = [
  /\b(ios|iphone|ipad|android|mobile app|mobile apps|phone app|phone apps|app store|play store|pocket|on your phone|swipe|tap to|push notification|push notifications|mobile-first|handheld|smartphone|apk)\b/gi,
  /\b(mobile|phone|tablet)\b/gi,
];

export const DESKTOP_KEYWORDS = [
  /\b(saas|dashboard|dashboards|web app|web apps|website|chrome|browser|desktop|laptop|macos|mac|windows|portal|admin panel|cloud console|analytics dashboard|crm|b2b|platform|workstation)\b/gi,
  /\b(desktop app|web platform|browser extension|landing page)\b/gi,
];

export interface ClassifyDeviceOptions {
  prompt?: string;
  imageDimensions?: { width: number; height: number; aspectRatio?: number } | null;
  override?: DeviceFrame | null;
}

/**
 * Client-side adaptive device classifier
 */
export function classifyDeviceFrame({
  prompt = "",
  imageDimensions = null,
  override = null,
}: ClassifyDeviceOptions = {}): DeviceFrame {
  if (override === "macos" || override === "mobile") {
    return override;
  }

  if (imageDimensions && typeof imageDimensions.width === "number" && typeof imageDimensions.height === "number") {
    const { width, height } = imageDimensions;
    if (width > 0 && height > 0) {
      const ratio = width / height;
      if (ratio < 0.95) {
        return "mobile";
      }
      if (ratio > 1.05) {
        return "macos";
      }
    }
  }

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

  return "macos";
}
