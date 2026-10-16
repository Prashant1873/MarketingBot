import os
import sys
import time
import logging
from pathlib import Path
from playwright.sync_api import sync_playwright

# Configure logging as required
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("CaptureLightMode")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCREENSHOTS_DIR = PROJECT_ROOT / "screenshots"
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

APP_URL = "http://localhost:5173"

def capture_screenshots():
    logger.info("Initializing Playwright with Microsoft Edge...")
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(channel="msedge", headless=True)
            logger.info("Microsoft Edge launched successfully in headless mode.")
        except Exception as e:
            logger.warning(f"Failed to launch Edge: {e}. Trying Google Chrome...")
            browser = p.chromium.launch(channel="chrome", headless=True)
            logger.info("Google Chrome launched successfully in headless mode.")

        context = browser.new_context(
            viewport={"width": 1600, "height": 1000},
            device_scale_factor=2,  # Retina / high-DPI crisp capture
            color_scheme="light"
        )
        page = context.new_page()

        logger.info(f"Navigating to {APP_URL}...")
        page.goto(APP_URL, wait_until="networkidle", timeout=30000)
        time.sleep(1)

        # Ensure light mode is active
        theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        logger.info(f"Initial theme: '{theme}'")
        if theme != "light":
            logger.info("Switching to Light Mode via header button...")
            toggle_btn = page.locator("#header-theme-toggle-btn")
            if toggle_btn.count() > 0:
                toggle_btn.click()
            else:
                page.evaluate("() => { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('marcutie_theme', 'light'); }")
            time.sleep(0.5)

        current_theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        logger.info(f"Verified active theme: '{current_theme}'")

        # 1. Capture Full Studio Overview in Light Mode
        logger.info("Capturing 01_light_mode_studio_overview.png...")
        page.screenshot(
            path=str(SCREENSHOTS_DIR / "01_light_mode_studio_overview.png"),
            full_page=False
        )

        # 2. Scroll & Focus on Pre-Flight Studio and Tone Selector
        logger.info("Focusing on Pre-Flight Studio panel...")
        # Select 'yc-parody' tone to show accent contrast
        tone_btn = page.locator("button:has-text('YC Parody')").first
        if tone_btn.count() > 0:
            tone_btn.click()
            time.sleep(0.3)

        logger.info("Capturing 02_light_mode_tone_and_format.png...")
        page.screenshot(
            path=str(SCREENSHOTS_DIR / "02_light_mode_tone_and_format.png"),
            full_page=False
        )

        # 3. Switch to Brand & Visuals Tab
        logger.info("Switching Pre-Flight tab to 'Brand & Visuals'...")
        brand_tab = page.locator("button:has-text('Brand & Visuals')").first
        if brand_tab.count() > 0:
            brand_tab.click()
            time.sleep(0.5)

        logger.info("Capturing 03_light_mode_brand_and_visuals.png...")
        page.screenshot(
            path=str(SCREENSHOTS_DIR / "03_light_mode_brand_and_visuals.png"),
            full_page=False
        )

        # 4. Switch to Voiceover Tab
        logger.info("Switching Pre-Flight tab to 'Voiceover'...")
        vo_tab = page.locator("button:has-text('Voiceover')").first
        if vo_tab.count() > 0:
            vo_tab.click()
            time.sleep(0.5)

        logger.info("Capturing 04_light_mode_voiceover_settings.png...")
        page.screenshot(
            path=str(SCREENSHOTS_DIR / "04_light_mode_voiceover_settings.png"),
            full_page=False
        )

        # 5. Open Settings Modal
        logger.info("Opening Settings Modal in Light Mode...")
        settings_btn = page.locator("#header-settings-btn, button:has-text('Settings')").first
        if settings_btn.count() > 0:
            settings_btn.click()
            time.sleep(1.0)
            logger.info("Capturing 05_light_mode_settings_modal.png...")
            page.screenshot(
                path=str(SCREENSHOTS_DIR / "05_light_mode_settings_modal.png"),
                full_page=False
            )
            # Close modal by pressing Escape
            page.keyboard.press("Escape")
            time.sleep(0.6)

        # 6. Capture High-Contrast Header Close-up
        logger.info("Capturing close-up of header and controls...")
        header_el = page.locator("header").first
        if header_el.count() > 0:
            header_el.screenshot(path=str(SCREENSHOTS_DIR / "06_light_mode_header_contrast.png"))

        # 7. Capture Docked Command Strip and Primary Action Buttons
        logger.info("Capturing docked command strip and primary buttons...")
        docked_strip = page.locator(".studio-docked-strip, div:has(button:has-text('Generate'))").last
        if docked_strip.count() > 0:
            docked_strip.screenshot(path=str(SCREENSHOTS_DIR / "07_light_mode_primary_buttons.png"))

        browser.close()
        logger.info(f"Successfully captured all screenshots to: {SCREENSHOTS_DIR}")

if __name__ == "__main__":
    capture_screenshots()
