#!/usr/bin/env node
/**
 * capture-demo.js — Playwright screen recordings + screenshots for LoLA demo video
 *
 * Prerequisites:
 *   npx playwright install chromium
 *
 * Usage:
 *   node scripts/capture-demo.js              # full run (captures + screenshots)
 *   node scripts/capture-demo.js --screenshots # screenshots only
 *   node scripts/capture-demo.js --captures    # captures only
 *
 * Requires dev server running on localhost:5173 (./scripts/dev.sh)
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE_URL = process.env.DEMO_URL || "http://localhost:5173";
const CAPTURES_DIR = path.resolve(__dirname, "../video/public/captures");
const SCREENSHOTS_DIR = path.resolve(__dirname, "../screenshots");
const VIEWPORT = { width: 1920, height: 1080 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureDirs() {
  fs.mkdirSync(CAPTURES_DIR, { recursive: true });
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Screenshots
// ---------------------------------------------------------------------------

async function captureScreenshots(page) {
  console.log("\n--- Screenshots ---\n");

  // 1. Landing page
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(2000);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "landing.png"),
    fullPage: false,
  });
  console.log("  [x] landing.png");

  // 2. Click "Try LoLA Free" to start onboarding
  const tryBtn = page.getByRole("button", { name: /try lola/i }).or(
    page.locator('button:has-text("Try LoLA"), a:has-text("Try LoLA"), [data-action="start"]')
  );
  if (await tryBtn.count()) {
    await tryBtn.first().click();
    await sleep(2000);
  } else {
    // Try clicking any prominent CTA
    const cta = page.locator(".cta-button, .hero-cta, .start-btn").first();
    if (await cta.count()) await cta.click();
    await sleep(2000);
  }
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "onboarding.png"),
    fullPage: false,
  });
  console.log("  [x] onboarding.png");

  // 3. Navigate to session view via demo profile
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(1500);

  // Try selecting a demo profile (The Analyst = profile A)
  const profileBtn = page.locator('[data-profile="A"], .profile-card').first();
  if (await profileBtn.count()) {
    await profileBtn.click();
    await sleep(3000);
  }
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "session.png"),
    fullPage: false,
  });
  console.log("  [x] session.png");

  // 4. Split-screen view
  const splitBtn = page.locator('[data-view="split"], .split-screen-btn, button:has-text("Split")').first();
  if (await splitBtn.count()) {
    await splitBtn.click();
    await sleep(3000);
  }
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "split-screen.png"),
    fullPage: false,
  });
  console.log("  [x] split-screen.png");

  // 5. Dashboard
  const dashBtn = page.locator('a[href*="dashboard"], button:has-text("Dashboard"), [data-view="dashboard"]').first();
  if (await dashBtn.count()) {
    await dashBtn.click();
    await sleep(2000);
  } else {
    await page.goto(BASE_URL + "/#dashboard", { waitUntil: "networkidle" });
    await sleep(2000);
  }
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "dashboard.png"),
    fullPage: false,
  });
  console.log("  [x] dashboard.png");

  // 6. Report detail
  const reportCard = page.locator('.report-card, [data-action="view-report"], button:has-text("Report")').first();
  if (await reportCard.count()) {
    await reportCard.click();
    await sleep(2000);
  }
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "report-detail.png"),
    fullPage: false,
  });
  console.log("  [x] report-detail.png");
}

// ---------------------------------------------------------------------------
// Video Captures
// ---------------------------------------------------------------------------

async function captureOnboarding(browser) {
  console.log("\n--- Capture 1: Onboarding (~25s) ---\n");

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: CAPTURES_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(2000);

  // Click "Try LoLA Free"
  const tryBtn = page.getByRole("button", { name: /try lola/i }).or(
    page.locator('button:has-text("Try LoLA"), a:has-text("Try LoLA"), [data-action="start"]')
  );
  if (await tryBtn.count()) {
    await tryBtn.first().click();
    await sleep(2000);
  }

  // Select Japanese L1
  const jaBtn = page.locator('[data-l1="ja"], button:has-text("Japanese"), button:has-text("日本語")').first();
  if (await jaBtn.count()) {
    await jaBtn.click();
    await sleep(1500);
  }

  // Click through 5 onboarding questions
  for (let q = 0; q < 5; q++) {
    await sleep(1500);
    // Click first answer option for each question
    const option = page.locator('.onboarding-option, .quiz-option, [data-answer]').first();
    if (await option.count()) {
      await option.click();
    } else {
      // Try generic button/radio approach
      const btn = page.locator('.option-btn, .answer-btn, input[type="radio"]').first();
      if (await btn.count()) await btn.click();
    }
    await sleep(1000);
    // Click next/continue if present
    const next = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
    if (await next.count()) await next.click();
  }

  await sleep(3000); // Show generated profile
  await page.close();
  await context.close();

  // Rename the recorded video
  const videos = fs.readdirSync(CAPTURES_DIR).filter((f) => f.endsWith(".webm"));
  if (videos.length) {
    const latest = videos.sort().pop();
    const src = path.join(CAPTURES_DIR, latest);
    const dest = path.join(CAPTURES_DIR, "onboarding.webm");
    fs.renameSync(src, dest);
    console.log(`  [x] onboarding.webm (will convert to mp4)`);
  }
}

async function captureSplitScreen(browser) {
  console.log("\n--- Capture 2: Session + Split-Screen (~70s) ---\n");

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: CAPTURES_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(2000);

  // Select demo profile "The Analyst"
  const profileBtn = page.locator('[data-profile="A"], .profile-card:first-child').first();
  if (await profileBtn.count()) {
    await profileBtn.click();
    await sleep(5000);
  }

  // Show the session view for a while
  await sleep(10000);

  // Navigate to split-screen
  const splitBtn = page.locator('[data-view="split"], .split-screen-btn, button:has-text("Split")').first();
  if (await splitBtn.count()) {
    await splitBtn.click();
    await sleep(15000);
  }

  // Let it run for the remainder
  await sleep(10000);

  await page.close();
  await context.close();

  const videos = fs.readdirSync(CAPTURES_DIR).filter((f) => f.endsWith(".webm") && f !== "onboarding.webm");
  if (videos.length) {
    const latest = videos.sort().pop();
    fs.renameSync(path.join(CAPTURES_DIR, latest), path.join(CAPTURES_DIR, "split-screen.webm"));
    console.log(`  [x] split-screen.webm (will convert to mp4)`);
  }
}

async function captureDashboard(browser) {
  console.log("\n--- Capture 3: Dashboard + Reports (~30s) ---\n");

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: CAPTURES_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(2000);

  // Navigate to dashboard
  const dashBtn = page.locator('a[href*="dashboard"], button:has-text("Dashboard"), [data-view="dashboard"]').first();
  if (await dashBtn.count()) {
    await dashBtn.click();
    await sleep(3000);
  } else {
    await page.goto(BASE_URL + "/#dashboard", { waitUntil: "networkidle" });
    await sleep(3000);
  }

  // Show credits bar, session history
  await sleep(5000);

  // Click coaching reports
  const reportsBtn = page.locator('button:has-text("Report"), [data-tab="reports"], .reports-tab').first();
  if (await reportsBtn.count()) {
    await reportsBtn.click();
    await sleep(3000);
  }

  // Click a completed report
  const reportCard = page.locator('.report-card, [data-action="view-report"]').first();
  if (await reportCard.count()) {
    await reportCard.click();
    await sleep(5000);
  }

  await sleep(3000);
  await page.close();
  await context.close();

  const videos = fs
    .readdirSync(CAPTURES_DIR)
    .filter((f) => f.endsWith(".webm") && f !== "onboarding.webm" && f !== "split-screen.webm");
  if (videos.length) {
    const latest = videos.sort().pop();
    fs.renameSync(path.join(CAPTURES_DIR, latest), path.join(CAPTURES_DIR, "vision.webm"));
    console.log(`  [x] vision.webm (will convert to mp4)`);
  }
}

async function convertWebmToMp4() {
  console.log("\n--- Converting .webm → .mp4 ---\n");
  const { execSync } = require("child_process");

  const webms = ["onboarding.webm", "split-screen.webm", "vision.webm"];
  for (const webm of webms) {
    const src = path.join(CAPTURES_DIR, webm);
    const dest = path.join(CAPTURES_DIR, webm.replace(".webm", ".mp4"));
    if (fs.existsSync(src)) {
      try {
        execSync(`ffmpeg -y -i "${src}" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p "${dest}"`, {
          stdio: "pipe",
        });
        console.log(`  [x] ${webm} → ${webm.replace(".webm", ".mp4")}`);
        fs.unlinkSync(src); // Clean up .webm
      } catch (e) {
        console.warn(`  [!] ffmpeg conversion failed for ${webm}: ${e.message}`);
        console.warn("      Install ffmpeg or convert manually.");
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const doScreenshots = args.length === 0 || args.includes("--screenshots");
  const doCaptures = args.length === 0 || args.includes("--captures");

  await ensureDirs();

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox"],
  });

  try {
    if (doScreenshots) {
      const page = await browser.newPage({ viewport: VIEWPORT });
      await captureScreenshots(page);
      await page.close();
    }

    if (doCaptures) {
      await captureOnboarding(browser);
      await captureSplitScreen(browser);
      await captureDashboard(browser);
      await convertWebmToMp4();
    }
  } finally {
    await browser.close();
  }

  console.log("\nDone! Check:");
  if (doCaptures) console.log(`  Captures: ${CAPTURES_DIR}`);
  if (doScreenshots) console.log(`  Screenshots: ${SCREENSHOTS_DIR}`);
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
