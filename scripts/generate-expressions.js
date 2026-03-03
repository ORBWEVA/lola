#!/usr/bin/env node
/**
 * generate-expressions.js
 *
 * Interactive script to generate avatar expression images for LoLA demo profiles.
 * Two-stage pipeline with human approval gates:
 *
 *   Stage 1: Text-to-image anchor candidates (FLUX Schnell Free — $0)
 *   Stage 2: Image-to-image expression variants (FLUX Kontext Pro — $0.04/image)
 *
 * Usage: TOGETHER_API_KEY=xxx node scripts/generate-expressions.js
 */

import fs from "fs";
import path from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const AVATARS_DIR = path.join(ROOT, "public", "avatars");

const API_KEY = process.env.TOGETHER_API_KEY;
const API_URL = "https://api.together.xyz/v1/images/generations";
const SCHNELL_MODEL = "black-forest-labs/FLUX.1-schnell";
const KONTEXT_MODEL = "black-forest-labs/FLUX.1-kontext-pro";

if (!API_KEY) {
  console.error("Error: TOGETHER_API_KEY environment variable is required.");
  console.error("Get your key at https://api.together.xyz/");
  process.exit(1);
}

// ─── Profile Definitions ─────────────────────────────────────────────

const PROFILES = {
  "profile-a": {
    label: "The Analyst (JA>EN)",
    description:
      "A Japanese woman in her early 40s, thin-framed glasses, dark hair in a loose low bun, wearing a fitted charcoal turtleneck, sitting at a wooden desk in a bright office with indoor plants, resting her chin on her hand thoughtfully, warm window light from the side, 3/4 view, shallow depth of field, candid photo",
  },
  "profile-b": {
    label: "The Explorer (JA>EN)",
    description:
      "A Brazilian man in his late 20s, short curly dark hair, slight stubble, wearing a faded olive henley with sleeves pushed up, leaning against a railing on a sunny rooftop with city skyline behind him, golden hour lighting, relaxed grin, looking slightly off-camera, candid photo",
  },
  "profile-c": {
    label: "JP Beginner Analyst (EN>JA)",
    description:
      "A British man in his mid-30s, light brown hair neatly parted, clean-shaven, wearing a navy crew neck sweater, sitting in a cozy coffee shop holding a flat white, morning window light casting soft shadows, straight-on angle, slight knowing smile, bokeh background with warm cafe tones, candid photo",
  },
  "profile-d": {
    label: "JP Beginner Explorer (EN>JA)",
    description:
      "A Korean-American woman in her mid-20s, long dark hair worn loose, wearing a colorful oversized vintage jacket, walking through a park in dappled afternoon shade, mid-laugh with one hand brushing hair from her face, slight motion blur on background, natural light, candid photo",
  },
};

// ─── Expression Definitions ──────────────────────────────────────────

const EXPRESSIONS = {
  neutral: "neutral expression, looking at camera, calm",
  thinking: "thoughtful expression, slight head tilt, considering something",
  smiling: "warm genuine smile, friendly, approachable",
  concerned: "concerned expression, slight frown, empathetic",
  encouraging: "encouraging expression, slight nod, supportive",
  laughing: "laughing naturally, joyful expression, genuine",
  explaining: "focused expression, gesturing with one hand, teaching",
  impressed:
    "raised eyebrows, impressed expression, pleasantly surprised",
};

// ─── Utilities ───────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generateImage(model, prompt, imageUrl = null) {
  const body = {
    model,
    prompt,
    n: 1,
    response_format: "b64_json",
  };

  if (model === SCHNELL_MODEL) {
    body.width = 1024;
    body.height = 1024;
    body.steps = 4;
  }

  if (imageUrl) {
    body.image_url = imageUrl;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, "base64");
}

function saveImage(buffer, filePath) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, buffer);
}

function imageToDataUri(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1) || "png";
  return `data:image/${ext};base64,${buffer.toString("base64")}`;
}

function relPath(p) {
  return path.relative(ROOT, p);
}

// ─── Stage 1: Anchor Candidates ──────────────────────────────────────

async function generateAnchors() {
  console.log("");
  console.log("========================================");
  console.log("  STAGE 1: Anchor Candidate Generation");
  console.log("  Model: FLUX.1 Schnell Free ($0)");
  console.log("========================================");

  const approvedAnchors = {};

  for (const [profileId, profile] of Object.entries(PROFILES)) {
    console.log(`\n-- ${profile.label} (${profileId}) --`);

    const candidatesDir = path.join(AVATARS_DIR, profileId, "candidates");
    const promptsFile = path.join(candidatesDir, "prompts.json");
    ensureDir(candidatesDir);

    // Initialize prompts file
    const prompts = {};
    for (let i = 1; i <= 4; i++) {
      prompts[`candidate-${i}.png`] = profile.description;
    }
    fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));
    console.log(`  Prompts saved: ${relPath(promptsFile)}`);

    let approved = false;
    while (!approved) {
      // Re-read prompts (user may have edited)
      const currentPrompts = JSON.parse(fs.readFileSync(promptsFile, "utf-8"));

      console.log("\n  Generating 4 candidates...");
      for (const [filename, prompt] of Object.entries(currentPrompts)) {
        process.stdout.write(`    ${filename} ... `);
        try {
          const buffer = await generateImage(SCHNELL_MODEL, prompt);
          saveImage(buffer, path.join(candidatesDir, filename));
          console.log("done");
        } catch (e) {
          console.log(`FAILED: ${e.message}`);
        }
      }

      console.log(`\n  Review candidates in: ${relPath(candidatesDir)}/`);
      console.log(`  Prompts are in: ${relPath(promptsFile)}`);
      console.log(
        "  Edit any prompt in prompts.json and save before continuing.\n"
      );

      const choice = await ask(
        '  Pick anchor (1-4), "r" to regenerate, "e" to regenerate after prompt edit: '
      );

      if (choice.trim() === "r") {
        console.log("  Regenerating with same prompts...");
        continue;
      } else if (choice.trim() === "e") {
        console.log("  Re-reading prompts.json and regenerating...");
        continue;
      } else {
        const num = parseInt(choice.trim());
        if (num >= 1 && num <= 4) {
          const chosenFile = path.join(
            candidatesDir,
            `candidate-${num}.png`
          );
          if (!fs.existsSync(chosenFile)) {
            console.log(`  File not found: candidate-${num}.png. Try again.`);
            continue;
          }
          const anchorFile = path.join(AVATARS_DIR, profileId, "anchor.png");
          fs.copyFileSync(chosenFile, anchorFile);
          console.log(
            `  Anchor approved: candidate-${num}.png -> ${relPath(anchorFile)}`
          );
          approvedAnchors[profileId] = anchorFile;
          approved = true;
        } else {
          console.log('  Invalid input. Enter 1-4, "r", or "e".');
        }
      }
    }
  }

  console.log("\n  All 4 anchors approved.");
  return approvedAnchors;
}

// ─── Stage 2: Expression Variants ────────────────────────────────────

async function generateExpressions(approvedAnchors) {
  console.log("");
  console.log("========================================");
  console.log("  STAGE 2: Expression Variant Generation");
  console.log("  Model: FLUX.1 Kontext Pro ($0.04/img)");
  console.log("========================================");

  // Build expression prompts per profile
  const expressionPromptsFile = path.join(
    AVATARS_DIR,
    "expression-prompts.json"
  );
  const allPrompts = {};

  for (const [profileId, profile] of Object.entries(PROFILES)) {
    allPrompts[profileId] = {};
    for (const [expr, exprDesc] of Object.entries(EXPRESSIONS)) {
      allPrompts[profileId][
        expr
      ] = `Keep the person identical. ${profile.description}. ${expr}: ${exprDesc}`;
    }
  }

  fs.writeFileSync(expressionPromptsFile, JSON.stringify(allPrompts, null, 2));
  console.log(`\n  Expression prompts saved: ${relPath(expressionPromptsFile)}`);
  console.log("  Review and edit the file if needed.\n");

  let proceed = false;
  while (!proceed) {
    const choice = await ask(
      '  Enter "go" to proceed ($1.28 for 32 images), or "e" to reload after editing: '
    );
    if (choice.trim() === "go") {
      proceed = true;
    } else if (choice.trim() === "e") {
      console.log("  Re-reading expression-prompts.json...");
    } else {
      console.log('  Enter "go" or "e".');
    }
  }

  // Read potentially edited prompts
  const finalPrompts = JSON.parse(
    fs.readFileSync(expressionPromptsFile, "utf-8")
  );

  let totalGenerated = 0;
  let totalFailed = 0;

  for (const [profileId, expressions] of Object.entries(finalPrompts)) {
    const profile = PROFILES[profileId];
    const anchorPath = approvedAnchors[profileId];

    if (!anchorPath || !fs.existsSync(anchorPath)) {
      console.log(`\n  Skipping ${profileId}: no anchor found`);
      continue;
    }

    console.log(`\n-- ${profile.label} (${profileId}) --`);

    const anchorDataUri = imageToDataUri(anchorPath);

    for (const [expr, prompt] of Object.entries(expressions)) {
      process.stdout.write(`    ${expr}.png ... `);
      try {
        const buffer = await generateImage(KONTEXT_MODEL, prompt, anchorDataUri);
        const outPath = path.join(AVATARS_DIR, profileId, `${expr}.png`);
        saveImage(buffer, outPath);
        console.log("done");
        totalGenerated++;
      } catch (e) {
        console.log(`FAILED: ${e.message}`);
        totalFailed++;
      }
    }
  }

  console.log("");
  console.log("========================================");
  console.log(`  Complete: ${totalGenerated} generated, ${totalFailed} failed`);
  console.log(`  Cost: ~$${(totalGenerated * 0.04).toFixed(2)}`);
  console.log(`  Output: ${relPath(AVATARS_DIR)}/`);
  console.log("========================================");
  console.log("");
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("");
  console.log("LoLA Avatar Expression Generator");
  console.log("================================");
  console.log("");
  console.log("Generates expression images for 4 demo profiles.");
  console.log("Stage 1: Anchor candidates (free) with human approval gates");
  console.log("Stage 2: Expression variants ($0.04/image) from approved anchors");
  console.log(`Output dir: ${relPath(AVATARS_DIR)}/`);

  const approvedAnchors = await generateAnchors();
  await generateExpressions(approvedAnchors);

  rl.close();
}

main().catch((e) => {
  console.error("\nFatal error:", e);
  rl.close();
  process.exit(1);
});
