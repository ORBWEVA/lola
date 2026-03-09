/**
 * LoLA Session View — Adaptive coaching with expression carousel + waveform.
 *
 * Entry flow:
 *   Landing → "Create Your Profile" (onboarding) or "Demo Profiles" (picker)
 *   Onboarding: L1 selection → 5 questions (in learner's L1) → summary → session
 *   Demo: 4 pre-built profile cards → session
 */

import "./audio-visualizer.js";
import "./expression-carousel.js";
import "./live-transcript.js";
import {
  GeminiLiveAPI,
  MultimodalLiveResponseType,
} from "../lib/gemini-live/geminilive.js";
import {
  AudioStreamer,
  AudioPlayer,
  VideoStreamer,
} from "../lib/gemini-live/mediaUtils.js";
import { ExpressionCarousel } from "./expression-carousel.js";

// ─── Onboarding Question Data ────────────────────────────────────────

const L1_OPTIONS = [
  { key: "ja", label: "\u65E5\u672C\u8A9E", sub: "Japanese", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
  { key: "ko", label: "\uD55C\uAD6D\uC5B4", sub: "Korean", flag: "\uD83C\uDDF0\uD83C\uDDF7" },
  { key: "en", label: "English", sub: "Learning Japanese", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
];

const QUESTIONS = [
  {
    id: "q1",
    text: {
      en: "When you make a mistake in Japanese, what\u2019s your first reaction?",
      ja: "\u82F1\u8A9E\u3092\u9593\u9055\u3048\u305F\u6642\u3001\u6700\u521D\u306B\u3069\u3046\u611F\u3058\u307E\u3059\u304B\uFF1F",
      ko: "\uC601\uC5B4\uB97C \uD2C0\uB838\uC744 \uB54C, \uCCAB \uBC88\uC9F8 \uBC18\uC751\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?",
    },
    options: [
      {
        key: "a",
        en: "I want to understand WHY I made it",
        ja: "\u306A\u305C\u9593\u9055\u3048\u305F\u306E\u304B\u7406\u89E3\u3057\u305F\u3044",
        ko: "\uC65C \uD2C0\uB838\uB294\uC9C0 \uC774\uD574\uD558\uACE0 \uC2F6\uB2E4",
      },
      {
        key: "b",
        en: "I feel embarrassed and want to move on",
        ja: "\u6065\u305A\u304B\u3057\u304F\u3066\u65E9\u304F\u5148\u306B\u9032\u307F\u305F\u3044",
        ko: "\uBD80\uB044\uB7FD\uACE0 \uBE68\uB9AC \uB118\uC5B4\uAC00\uACE0 \uC2F6\uB2E4",
      },
      {
        key: "c",
        en: "I laugh it off and try again",
        ja: "\u7B11\u3063\u3066\u3001\u3082\u3046\u4E00\u56DE\u3084\u3063\u3066\u307F\u308B",
        ko: "\uC6C3\uACE0 \uB2E4\uC2DC \uC2DC\uB3C4\uD55C\uB2E4",
      },
    ],
  },
  {
    id: "q2",
    text: {
      en: "How do you prefer to learn new things?",
      ja: "\u65B0\u3057\u3044\u3053\u3068\u3092\u5B66\u3076\u3068\u304D\u3001\u3069\u306E\u65B9\u6CD5\u304C\u597D\u304D\u3067\u3059\u304B\uFF1F",
      ko: "\uC0C8\uB85C\uC6B4 \uAC83\uC744 \uBC30\uC6B8 \uB54C \uC5B4\uB5A4 \uBC29\uBC95\uC744 \uC120\uD638\uD558\uB098\uC694?",
    },
    options: [
      {
        key: "a",
        en: "Show me the rules and patterns",
        ja: "\u30EB\u30FC\u30EB\u3068\u30D1\u30BF\u30FC\u30F3\u3092\u898B\u305B\u3066\u307B\u3057\u3044",
        ko: "\uADDC\uCE59\uACFC \uD328\uD134\uC744 \uBCF4\uC5EC\uC8FC\uC138\uC694",
      },
      {
        key: "b",
        en: "Let me try and figure it out",
        ja: "\u307E\u305A\u3084\u3063\u3066\u307F\u3066\u81EA\u5206\u3067\u7406\u89E3\u3057\u305F\u3044",
        ko: "\uBA3C\uC800 \uD574\uBCF4\uACE0 \uC2A4\uC2A4\uB85C \uC774\uD574\uD558\uACE0 \uC2F6\uB2E4",
      },
      {
        key: "c",
        en: "Show me real examples of people using it",
        ja: "\u5B9F\u969B\u306B\u4F7F\u3063\u3066\u3044\u308B\u4F8B\u3092\u898B\u305B\u3066\u307B\u3057\u3044",
        ko: "\uC2E4\uC81C\uB85C \uC0AC\uC6A9\uD558\uB294 \uC608\uB97C \uBCF4\uC5EC\uC8FC\uC138\uC694",
      },
    ],
  },
  {
    id: "q3",
    text: {
      en: "What motivates you most?",
      ja: "\u4E00\u756A\u3084\u308B\u6C17\u304C\u51FA\u308B\u306E\u306F\uFF1F",
      ko: "\uAC00\uC7A5 \uB3D9\uAE30\uBD80\uC5EC\uAC00 \uB418\uB294 \uAC83\uC740?",
    },
    options: [
      {
        key: "a",
        en: "Seeing measurable progress",
        ja: "\u6570\u5B57\u3067\u9032\u6B69\u304C\u898B\u3048\u308B\u3053\u3068",
        ko: "\uC218\uCE58\uB85C \uBC1C\uC804\uC744 \uD655\uC778\uD558\uB294 \uAC83",
      },
      {
        key: "b",
        en: "Feeling more confident",
        ja: "\u81EA\u4FE1\u304C\u3064\u3044\u305F\u3068\u611F\u3058\u308B\u3053\u3068",
        ko: "\uC790\uC2E0\uAC10\uC774 \uC0DD\uAE30\uB294 \uAC83",
      },
      {
        key: "c",
        en: "Being able to use it in real situations",
        ja: "\u5B9F\u969B\u306E\u5834\u9762\u3067\u4F7F\u3048\u308B\u3088\u3046\u306B\u306A\u308B\u3053\u3068",
        ko: "\uC2E4\uC81C \uC0C1\uD669\uC5D0\uC11C \uC0AC\uC6A9\uD560 \uC218 \uC788\uAC8C \uB418\uB294 \uAC83",
      },
    ],
  },
  {
    id: "q4",
    text: {
      en: "When practicing Japanese, I prefer:",
      ja: "\u82F1\u8A9E\u3092\u7DF4\u7FD2\u3059\u308B\u3068\u304D\uFF1A",
      ko: "\uC601\uC5B4\uB97C \uC5F0\uC2B5\uD560 \uB54C:",
    },
    options: [
      {
        key: "a",
        en: "Taking my time to think before speaking",
        ja: "\u8A71\u3059\u524D\u306B\u3058\u3063\u304F\u308A\u8003\u3048\u305F\u3044",
        ko: "\uB9D0\uD558\uAE30 \uC804\uC5D0 \uCDA9\uBD84\uD788 \uC0DD\uAC01\uD558\uACE0 \uC2F6\uB2E4",
      },
      {
        key: "b",
        en: "Jumping right in, even if imperfect",
        ja: "\u5B8C\u74A7\u3058\u3083\u306A\u304F\u3066\u3082\u3059\u3050\u8A71\u3057\u305F\u3044",
        ko: "\uC644\uBCBD\uD558\uC9C0 \uC54A\uC544\uB3C4 \uBC14\uB85C \uB9D0\uD558\uACE0 \uC2F6\uB2E4",
      },
    ],
  },
  {
    id: "q5",
    text: {
      en: "I learn best when the teacher:",
      ja: "\u5148\u751F\u304C\u6B21\u306E\u3088\u3046\u306B\u3057\u3066\u304F\u308C\u308B\u3068\u4E00\u756A\u5B66\u3073\u3084\u3059\u3044\uFF1A",
      ko: "\uC120\uC0DD\uB2D8\uC774 \uC774\uB807\uAC8C \uD574\uC8FC\uBA74 \uAC00\uC7A5 \uC798 \uBC30\uC6B4\uB2E4:",
    },
    options: [
      {
        key: "a",
        en: "Explains things thoroughly",
        ja: "\u4E01\u5BE7\u306B\u8A73\u3057\u304F\u8AAC\u660E\u3057\u3066\u304F\u308C\u308B",
        ko: "\uC790\uC138\uD558\uACE0 \uAF3C\uAF3C\uD558\uAC8C \uC124\uBA85\uD574\uC900\uB2E4",
      },
      {
        key: "b",
        en: "Keeps things moving and fun",
        ja: "\u30C6\u30F3\u30DD\u3088\u304F\u697D\u3057\u304F\u9032\u3081\u3066\u304F\u308C\u308B",
        ko: "\uBE60\uB974\uACE0 \uC7AC\uBBF8\uC788\uAC8C \uC9C4\uD589\uD574\uC900\uB2E4",
      },
      {
        key: "c",
        en: "Connects to things I already know",
        ja: "\u3059\u3067\u306B\u77E5\u3063\u3066\u3044\u308B\u3053\u3068\u3068\u7D50\u3073\u3064\u3051\u3066\u304F\u308C\u308B",
        ko: "\uC774\uBBF8 \uC54C\uACE0 \uC788\uB294 \uAC83\uACFC \uC5F0\uACB0\uD574\uC900\uB2E4",
      },
    ],
  },
];

// Maps profile to the closest demo profile key (for avatar images)
function closestProfileKey(profile) {
  const isAnalytical =
    profile.error_response === "analytical" ||
    profile.learning_preference === "structure_first";
  if (profile.l1 === "en") return isAnalytical ? "profile-c" : "profile-d";
  return isAnalytical ? "profile-a" : "profile-b";
}

// Human-readable coaching focus from profile dimensions
function coachFocus(profile, l1) {
  const t = (en, ja, ko) => (l1 === "ja" ? ja : l1 === "ko" ? ko : en);
  const items = [];
  const map = {
    error_response: {
      analytical: t("structured explanations", "\u69CB\u9020\u7684\u306A\u8AAC\u660E", "\uAD6C\uC870\uC801 \uC124\uBA85"),
      emotional_safety: t("emotional support", "\u5FC3\u7406\u7684\u30B5\u30DD\u30FC\u30C8", "\uC815\uC11C\uC801 \uC9C0\uC6D0"),
      challenge_forward: t("dynamic challenges", "\u30C0\u30A4\u30CA\u30DF\u30C3\u30AF\u306A\u30C1\u30E3\u30EC\u30F3\u30B8", "\uB3C4\uC804\uC801 \uACFC\uC81C"),
    },
    learning_preference: {
      structure_first: t("pattern recognition", "\u30D1\u30BF\u30FC\u30F3\u8A8D\u8B58", "\uD328\uD134 \uC778\uC2DD"),
      experience_first: t("hands-on practice", "\u5B9F\u8DF5\u7684\u306A\u7DF4\u7FD2", "\uC2E4\uC804 \uC5F0\uC2B5"),
      social_contextual: t("real-world scenarios", "\u5B9F\u4E16\u754C\u306E\u30B7\u30CA\u30EA\u30AA", "\uC2E4\uC81C \uC0C1\uD669 \uC5F0\uC2B5"),
    },
    motivation_driver: {
      metrics: t("measurable progress", "\u6570\u5024\u3067\u898B\u3048\u308B\u9032\u6B69", "\uCE21\uC815 \uAC00\uB2A5\uD55C \uBC1C\uC804"),
      emotion: t("confidence building", "\u81EA\u4FE1\u69CB\u7BC9", "\uC790\uC2E0\uAC10 \uD5A5\uC0C1"),
      application: t("practical application", "\u5B9F\u7528\u7684\u306A\u5FDC\u7528", "\uC2E4\uC6A9\uC801 \uD65C\uC6A9"),
    },
  };
  for (const [dim, values] of Object.entries(map)) {
    const val = profile[dim];
    if (val && values[val]) items.push(values[val]);
  }
  return items.slice(0, 3);
}

// ─── Shared Styles ───────────────────────────────────────────────────

const SHARED_STYLES = `
  .ob-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    gap: 24px;
  }
  .ob-title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    background: var(--lola-gradient, linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .ob-subtitle {
    font-size: 1.1rem;
    opacity: 0.7;
    text-align: center;
    max-width: 500px;
    line-height: 1.5;
  }
  .ob-card {
    background: var(--color-surface);
    backdrop-filter: var(--backdrop-blur);
    border: var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 32px;
    width: 100%;
    max-width: 480px;
    animation: ob-fadeIn 0.35s ease-out;
  }
  @keyframes ob-fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .ob-progress {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 480px;
  }
  .ob-progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
  }
  .ob-progress-fill {
    height: 100%;
    background: var(--lola-gradient, linear-gradient(135deg, #4361ee, #4cc9f0));
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  .ob-progress-text {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-text-sub);
    white-space: nowrap;
  }
  .ob-question {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text-main);
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .ob-option {
    display: block;
    width: 100%;
    text-align: left;
    padding: 16px 20px;
    margin-bottom: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-md);
    color: var(--color-text-main);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1.4;
  }
  .ob-option:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--lola-indigo, #4361ee);
    transform: translateX(4px);
  }
  .ob-option:active {
    transform: translateX(4px) scale(0.98);
  }
  .ob-back-link {
    background: transparent;
    border: none;
    color: var(--color-text-sub);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 16px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .ob-back-link:hover { opacity: 1; }
  .ob-l1-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ob-l1-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 28px 36px;
    background: var(--color-surface);
    border: 2px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.25s ease;
    min-width: 140px;
  }
  .ob-l1-btn:hover {
    border-color: var(--lola-indigo, #4361ee);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  .ob-l1-flag { font-size: 2.5rem; }
  .ob-l1-label {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-text-main);
  }
  .ob-l1-sub {
    font-size: 0.8rem;
    color: var(--color-text-sub);
    opacity: 0.7;
  }
  .ob-summary-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ob-summary-item:last-child { border-bottom: none; }
  .ob-summary-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--lola-indigo, #4361ee);
    margin-top: 7px;
    flex-shrink: 0;
  }
  .ob-summary-text {
    font-size: 1rem;
    color: var(--color-text-main);
    line-height: 1.4;
  }
  .ob-start-btn {
    padding: 16px 48px;
    background: var(--lola-rose, #ff4d6d);
    color: white;
    border: none;
    border-radius: var(--radius-sm, 8px);
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .ob-start-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

// ─── Component ───────────────────────────────────────────────────────

class ViewLola extends HTMLElement {
  constructor() {
    super();
    this._profile = null;
    this._profileKey = null;
    this._systemInstruction = null;
    this._profileLabel = null;
    this.videoStreamer = null;
    this.cameraActive = false;
    this._outputBuffer = "";
    this._inputBuffer = "";
    this._frustrationCooldown = 0;
    this._frustrationCount = 0;
    this._frustrationTimer = null;
    this._transcriptLog = [];
    this._sessionId = null;
    // Onboarding state
    this._l1 = null;
    this._answers = {};
  }

  connectedCallback() {
    this._initDevice();
    this.showLanding();
  }

  async _initDevice() {
    try {
      const existing = localStorage.getItem("lola_device_id");
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: existing || undefined }),
      });
      const data = await res.json();
      localStorage.setItem("lola_device_id", data.device_id);
      this._deviceCredits = data.credits;
    } catch (e) {
      console.warn("Device init failed:", e);
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }

  // ─── Landing ─────────────────────────────────────────────────────

  showLanding() {
    this.innerHTML = `
      <style>
        ${SHARED_STYLES}

        /* ─── Hero Layout ─────────────────────────────────────── */
        .hero {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 64px;
          min-height: 100vh;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
        }
        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 420px;
          z-index: 10;
        }

        /* ─── Typography ──────────────────────────────────────── */
        .landing-title {
          font-family: var(--font-display, 'Exo 2', system-ui, sans-serif);
          font-weight: 700;
          font-size: clamp(2.5rem, 8vw, 4rem);
          letter-spacing: -0.5px;
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }
        .landing-byline {
          font-family: var(--font-display, 'Exo 2', system-ui, sans-serif);
          font-weight: 300;
          font-size: 0.9rem;
          color: var(--lola-text-secondary, #9595b0);
          letter-spacing: 0.5px;
        }
        .landing-tagline {
          font-family: var(--font-body, 'Exo 2', system-ui, sans-serif);
          font-weight: 300;
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: var(--lola-text-secondary, #9595b0);
          line-height: 1.6;
          margin-top: 4px;
        }
        .landing-powered {
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.5;
          color: var(--lola-text-secondary, #9595b0);
          line-height: 1.8;
          margin-top: 8px;
        }
        .landing-powered a {
          color: var(--lola-indigo, #4361ee);
          text-decoration: none;
          font-weight: 700;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }
        .landing-powered a:hover {
          border-bottom-color: var(--lola-indigo, #4361ee);
        }

        /* ─── Buttons ─────────────────────────────────────────── */
        .landing-btns {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: stretch;
          margin-top: 24px;
          width: 280px;
        }
        .landing-cta {
          position: relative;
          background: var(--lola-rose, #ff4d6d);
          color: #ffffff;
          padding: 16px 48px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        .landing-cta:hover {
          transform: translateY(-2px);
          background: var(--lola-rose-hover, #ff6680);
          box-shadow: var(--shadow-md);
        }
        .landing-cta::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 200%; height: 100%;
          background: linear-gradient(115deg, transparent 0%, transparent 45%, rgba(255,255,255,0.2) 50%, transparent 55%, transparent 100%);
          transform: translateX(-150%) skewX(-15deg);
          transition: transform 0.6s;
        }
        .landing-cta:hover::after {
          transform: translateX(150%) skewX(-15deg);
        }
        .landing-secondary {
          background: transparent;
          border: 1px solid var(--lola-surface-3, #22224a);
          color: var(--lola-text-secondary, #9595b0);
          padding: 14px 36px;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .landing-secondary:hover {
          border-color: var(--lola-indigo, #4361ee);
          color: var(--lola-text, #f0f0f8);
          transform: translateY(-2px);
        }
        .landing-split {
          background: var(--lola-indigo, #4361ee);
          color: white;
          padding: 12px 32px;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }
        .landing-split:hover {
          transform: translateY(-2px);
          background: var(--lola-indigo-hover, #5271ff);
          box-shadow: var(--shadow-md);
        }

        /* ─── Phone Mockup ────────────────────────────────────── */
        .hero-phone-area {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .phone {
          position: relative;
          width: 220px;
          height: 476px;
          border-radius: 42px;
          background: #0c0c1e;
          overflow: hidden;
          transform: rotate(-1.5deg);
          box-shadow:
            0 0 0 2px #1a1a2e,
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 80px rgba(67, 97, 238, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(255, 255, 255, 0.03);
          animation: phone-float 4s ease-in-out infinite;
        }
        .phone-screen {
          position: absolute;
          inset: 0;
          border-radius: 42px;
          overflow: hidden;
        }
        .phone-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .phone-avatar-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #12122a 0%, #1a1a3a 50%, #0c0c1e 100%);
        }
        .phone-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 26, 0.5) 0%,
            transparent 20%,
            transparent 55%,
            rgba(10, 10, 26, 0.75) 100%
          );
          pointer-events: none;
          border-radius: 42px;
        }

        /* Dynamic Island */
        .phone-notch {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 24px;
          background: #000;
          border-radius: 12px;
          z-index: 3;
        }
        .phone-notch::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1a1a3e;
          box-shadow: inset 0 0 2px rgba(76, 201, 240, 0.3);
        }

        /* Home indicator */
        .phone-home {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
          z-index: 3;
        }

        /* Speech bubble */
        .phone-bubble {
          position: absolute;
          bottom: 36px;
          left: 12px;
          right: 12px;
          z-index: 4;
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: 14px;
          padding: 12px 14px;
        }
        .phone-bubble-label {
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--lola-sky, #4cc9f0);
          margin-bottom: 4px;
        }
        .phone-bubble-text {
          font-family: var(--font-body, 'Exo 2', system-ui, sans-serif);
          font-size: 0.7rem;
          color: var(--lola-text, #f0f0f8);
          line-height: 1.5;
          font-weight: 400;
        }

        /* ─── Ambient Glow ────────────────────────────────────── */
        .hero-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(67, 97, 238, 0.2) 0%,
            rgba(76, 201, 240, 0.08) 50%,
            transparent 70%
          );
          filter: blur(40px);
          z-index: 1;
          pointer-events: none;
          animation: glow-breathe 4s ease-in-out infinite;
        }

        /* ─── Waveform ────────────────────────────────────────── */
        .hero-waveform {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          height: 28px;
        }
        .hero-waveform-bar {
          width: 3px;
          border-radius: 2px;
          background: linear-gradient(180deg, var(--lola-indigo, #4361ee) 0%, var(--lola-sky, #4cc9f0) 100%);
          animation: waveform-ripple 1.4s ease-in-out infinite;
          opacity: 0.6;
        }

        /* ─── Animations ──────────────────────────────────────── */
        @keyframes phone-float {
          0%, 100% { transform: rotate(-1.5deg) translateY(0); }
          50% { transform: rotate(-1.5deg) translateY(-12px); }
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes waveform-ripple {
          0%, 100% { height: 6px; }
          50% { height: var(--bar-h, 20px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .phone { animation: none; transform: rotate(-1.5deg); }
          .hero-glow { animation: none; opacity: 0.7; }
          .hero-waveform-bar { animation: none; }
        }

        /* ─── Mobile ──────────────────────────────────────────── */
        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            gap: 32px;
            padding: 60px 20px 40px;
          }
          .hero-phone-area { order: 1; }
          .hero-text {
            order: 2;
            align-items: center;
            text-align: center;
          }
          .landing-btns { align-items: stretch; width: 100%; max-width: 320px; }
          .phone {
            width: 260px;
            height: 563px;
            border-radius: 40px;
          }
          .phone-screen { border-radius: 40px; }
          .phone-overlay { border-radius: 40px; }
          .phone-notch {
            width: 76px;
            height: 22px;
            top: 11px;
          }
          .phone-bubble {
            bottom: 32px;
            left: 12px;
            right: 12px;
          }
          .hero-glow {
            width: 280px;
            height: 280px;
          }
        }
      </style>

      <div class="hero">
        <!-- Ambient glow behind phone -->
        <div class="hero-glow" style="top: 50%; right: 18%; transform: translate(50%, -50%);"></div>

        <!-- Text column -->
        <div class="hero-text">
          <h1 class="landing-title">LoLA</h1>
          <p class="landing-byline">by LokaLingo</p>
          <p class="landing-tagline">
            Every learner deserves a coach who understands how they think.
          </p>
          <div class="landing-powered">
            Powered by<br>
            <a href="https://ai.google.dev/gemini-api/docs/live" target="_blank">Gemini Live API</a>
          </div>
          <div class="landing-btns">
            <button id="ob-create" class="landing-cta">Create Your Profile</button>
            <button id="ob-demo" class="landing-secondary">Demo Profiles</button>
            <button id="ob-split" class="landing-split">Split-Screen Demo</button>
          </div>
          <a id="ob-educator" href="#" style="
            font-size: 0.8rem;
            color: var(--lola-text-muted, #555575);
            text-decoration: none;
            margin-top: 8px;
            transition: color 0.2s ease;
          ">Educator Preview &rarr;</a>
        </div>

        <!-- Phone mockup -->
        <div class="hero-phone-area">
          <div class="phone">
            <div class="phone-notch"></div>
            <div class="phone-screen" id="phone-screen">
              <div class="phone-avatar-fallback"></div>
            </div>
            <div class="phone-overlay"></div>
            <div class="phone-bubble">
              <div class="phone-bubble-label">Sakura</div>
              <div class="phone-bubble-text">Let\u2019s work on your pronunciation. Try saying \u201Cthree\u201D \u2014 focus on the \u201Cth\u201D sound.</div>
            </div>
            <div class="phone-home"></div>
          </div>
          <div class="hero-waveform" id="hero-waveform"></div>
        </div>
      </div>
    `;

    // Insert avatar image with fallback
    const screen = this.querySelector("#phone-screen");
    const img = document.createElement("img");
    img.className = "phone-avatar";
    img.src = "/avatars/profile-a/smiling.png";
    img.alt = "LoLA coaching avatar";
    img.loading = "eager";
    img.onerror = () => {
      img.remove(); // fallback div already in place
    };
    img.onload = () => {
      const fallback = screen.querySelector(".phone-avatar-fallback");
      if (fallback) fallback.remove();
      screen.prepend(img);
    };
    // Trigger load — prepend only on success
    const tempImg = new Image();
    tempImg.onload = () => {
      const fallback = screen.querySelector(".phone-avatar-fallback");
      if (fallback) fallback.remove();
      screen.prepend(img);
    };
    tempImg.onerror = () => {}; // keep fallback
    tempImg.src = img.src;

    // Generate waveform bars
    const waveform = this.querySelector("#hero-waveform");
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement("div");
      bar.className = "hero-waveform-bar";
      const h = 8 + Math.sin(i * 0.6) * 12 + Math.random() * 6;
      bar.style.setProperty("--bar-h", `${h}px`);
      bar.style.animationDelay = `${i * 0.07}s`;
      waveform.appendChild(bar);
    }

    this.querySelector("#ob-create").addEventListener("click", () =>
      this.showL1Selection()
    );
    this.querySelector("#ob-demo").addEventListener("click", () =>
      this.showProfilePicker()
    );
    this.querySelector("#ob-split").addEventListener("click", () =>
      this.dispatchEvent(
        new CustomEvent("navigate", { bubbles: true, detail: { view: "split" } })
      )
    );
    this.querySelector("#ob-educator").addEventListener("click", (e) => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("navigate", { bubbles: true, detail: { view: "educator" } })
      );
    });
  }

  // ─── L1 Selection ────────────────────────────────────────────────

  showL1Selection() {
    this.innerHTML = `
      <style>${SHARED_STYLES}</style>
      <div class="ob-container">
        <h2 class="ob-title" style="font-size: 1.5rem;">
          What\u2019s your native language?
        </h2>
        <p class="ob-subtitle" style="font-size: 0.95rem;">
          \u3042\u306A\u305F\u306E\u6BCD\u8A9E\u306F\uFF1F \u00B7 \uBAA8\uAD6D\uC5B4\uAC00 \uBB34\uC5C7\uC778\uAC00\uC694?
        </p>
        <div class="ob-l1-grid" id="l1-grid"></div>
        <button id="l1-back" class="ob-back-link">Back</button>
      </div>
    `;

    const grid = this.querySelector("#l1-grid");
    for (const opt of L1_OPTIONS) {
      const btn = document.createElement("button");
      btn.className = "ob-l1-btn";
      btn.innerHTML = `
        <span class="ob-l1-flag">${opt.flag}</span>
        <span class="ob-l1-label">${opt.label}</span>
        <span class="ob-l1-sub">${opt.sub}</span>
      `;
      btn.addEventListener("click", () => {
        this._l1 = opt.key;
        this._answers = {};
        this.showQuestion(0);
      });
      grid.appendChild(btn);
    }

    this.querySelector("#l1-back").addEventListener("click", () =>
      this.showLanding()
    );
  }

  // ─── Question Cards ──────────────────────────────────────────────

  showQuestion(index) {
    const q = QUESTIONS[index];
    const total = QUESTIONS.length;
    const pct = ((index + 1) / total) * 100;
    const text = q.text[this._l1] || q.text.en;

    this.innerHTML = `
      <style>${SHARED_STYLES}</style>
      <div class="ob-container">
        <div class="ob-progress">
          <div class="ob-progress-bar">
            <div class="ob-progress-fill" style="width: ${pct}%"></div>
          </div>
          <span class="ob-progress-text">${index + 1} / ${total}</span>
        </div>
        <div class="ob-card">
          <div class="ob-question">${text}</div>
          <div id="ob-options"></div>
        </div>
        <button id="q-back" class="ob-back-link">
          ${index === 0 ? "Back" : "\u2190 Previous"}
        </button>
      </div>
    `;

    const optionsEl = this.querySelector("#ob-options");
    for (const opt of q.options) {
      const btn = document.createElement("button");
      btn.className = "ob-option";
      btn.textContent = opt[this._l1] || opt.en;
      btn.addEventListener("click", () => {
        this._answers[q.id] = opt.key;
        if (index < total - 1) {
          this.showQuestion(index + 1);
        } else {
          this.submitOnboarding();
        }
      });
      optionsEl.appendChild(btn);
    }

    this.querySelector("#q-back").addEventListener("click", () => {
      if (index === 0) {
        this.showL1Selection();
      } else {
        this.showQuestion(index - 1);
      }
    });
  }

  // ─── Submit & Summary ────────────────────────────────────────────

  async submitOnboarding() {
    this.innerHTML = `
      <style>${SHARED_STYLES}</style>
      <div class="ob-container">
        <div style="font-size: 0.9rem; opacity: 0.6;">Generating your coaching profile...</div>
      </div>
    `;

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ l1: this._l1, answers: this._answers }),
      });
      const data = await res.json();
      this._profile = data.profile;
      this._systemInstruction = data.system_instruction;
      this._profileKey = closestProfileKey(data.profile);

      const target = this._l1 === "en" ? "Japanese" : "English";
      this._profileLabel = `Custom (${this._l1.toUpperCase()}\u2192${target})`;
      this._activeProfile = { key: this._profileKey, label: this._profileLabel };

      this.showProfileSummary();
    } catch (e) {
      this.innerHTML = `
        <style>${SHARED_STYLES}</style>
        <div class="ob-container">
          <div style="color: var(--color-danger);">Failed to generate profile: ${e.message}</div>
          <button id="retry" class="ob-back-link">Try Again</button>
        </div>
      `;
      this.querySelector("#retry").addEventListener("click", () =>
        this.showL1Selection()
      );
    }
  }

  showProfileSummary() {
    const focuses = coachFocus(this._profile, this._l1);
    const t = (en, ja, ko) =>
      this._l1 === "ja" ? ja : this._l1 === "ko" ? ko : en;

    const heading = t(
      "Your Coach Will Focus On:",
      "\u30B3\u30FC\u30C1\u306E\u91CD\u70B9\uFF1A",
      "\uCF54\uCE58\uC758 \uC911\uC810:"
    );
    const startLabel = t(
      "Start Session",
      "\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u59CB\u3081\u308B",
      "\uC138\uC158 \uC2DC\uC791"
    );

    this.innerHTML = `
      <style>${SHARED_STYLES}</style>
      <div class="ob-container">
        <h2 class="ob-title" style="font-size: 1.5rem;">${heading}</h2>
        <div class="ob-card">
          ${focuses.map((f) => `<div class="ob-summary-item"><div class="ob-summary-dot"></div><div class="ob-summary-text">${f}</div></div>`).join("")}
        </div>
        <button id="sum-start" class="ob-start-btn">${startLabel}</button>
        <button id="sum-redo" class="ob-back-link">
          ${t("Retake Quiz", "\u3084\u308A\u76F4\u3059", "\uB2E4\uC2DC \uD558\uAE30")}
        </button>
      </div>
    `;

    this.querySelector("#sum-start").addEventListener("click", () =>
      this.showSession()
    );
    this.querySelector("#sum-redo").addEventListener("click", () =>
      this.showL1Selection()
    );
  }

  // ─── Profile Picker (Demo) ───────────────────────────────────────

  async showProfilePicker() {
    this.innerHTML = `
      <style>${SHARED_STYLES}</style>
      <div class="ob-container">
        <h1 class="ob-title" style="font-size: 1.5rem;">Demo Profiles</h1>
        <p class="ob-subtitle" style="font-size: 0.95rem;">
          Choose a pre-built learner profile to experience adaptive coaching.
        </p>
        <div id="profiles-loading" style="font-size: 0.9rem; opacity: 0.5;">Loading profiles...</div>
        <div id="profiles-container" style="display: none; gap: 16px; flex-wrap: wrap; justify-content: center;"></div>
        <button id="back-btn" class="ob-back-link">Back</button>
      </div>
    `;

    this.querySelector("#back-btn").addEventListener("click", () =>
      this.showLanding()
    );

    try {
      const res = await fetch("/api/demo-profiles");
      const data = await res.json();
      this.renderProfileCards(data);
    } catch (e) {
      this.querySelector("#profiles-loading").textContent =
        "Failed to load profiles: " + e.message;
    }
  }

  renderProfileCards(data) {
    this.querySelector("#profiles-loading").style.display = "none";
    const container = this.querySelector("#profiles-container");
    container.style.display = "flex";

    const profiles = [
      { key: "profile_a", ...data.profile_a, color: "#4361ee" },
      { key: "profile_b", ...data.profile_b, color: "#ff4d6d" },
      { key: "profile_c", ...data.profile_c, color: "#4cc9f0" },
      { key: "profile_d", ...data.profile_d, color: "#06d6a0" },
    ];

    profiles.forEach((p) => {
      const l1 =
        p.profile?.l1 === "en"
          ? "English"
          : p.profile?.l1 === "ko"
            ? "Korean"
            : "Japanese";
      const target = p.profile?.l1 === "en" ? "Japanese" : "English";
      const card = document.createElement("button");
      const imgKey = p.key.replace("_", "-");
      card.style.cssText = `
        background: var(--color-surface); border: 2px solid ${p.color}33;
        border-radius: var(--radius-lg); padding: 24px 28px; cursor: pointer;
        min-width: 240px; max-width: 280px; text-align: left;
        transition: all 0.3s ease; box-shadow: var(--shadow-sm);
      `;
      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <img src="/avatars/${imgKey}/smiling.png" alt="${p.label}"
            style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; object-position: center 20%; border: 2px solid ${p.color}44; flex-shrink: 0;"
            onerror="this.style.display='none'">
          <div style="font-size: 0.7rem; font-weight: 800; color: ${p.color}; text-transform: uppercase; letter-spacing: 0.1em;">${p.label}</div>
        </div>
        <div style="font-size: 0.85rem; color: var(--color-text-sub); line-height: 1.4;">${p.description}</div>
        <div style="margin-top: 10px; font-size: 0.75rem; color: var(--color-text-sub); opacity: 0.7;">${l1} \u2192 ${target}</div>
      `;
      card.addEventListener("mouseenter", () => {
        card.style.borderColor = p.color;
        card.style.transform = "translateY(-3px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.borderColor = p.color + "33";
        card.style.transform = "translateY(0)";
      });
      card.addEventListener("click", () => {
        this._profile = p.profile;
        this._profileKey = p.key.replace("_", "-");
        this._systemInstruction = p.system_instruction;
        this._profileLabel = p.label;
        this._activeProfile = { key: this._profileKey, label: this._profileLabel };
        this.showSession();
      });
      container.appendChild(card);
    });
  }

  // ─── Session View ────────────────────────────────────────────────

  async showSession() {
    this._sessionStartTime = null;
    this._timerInterval = null;
    this._burgerOpen = false;

    this.innerHTML = `
      <style>
        /* ─── Session Root: full-screen immersive ─── */
        .session-root {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: var(--lola-bg, #0a0a1a);
          overflow: hidden;
        }

        /* ─── Avatar layer (fills viewport) ─── */
        .session-avatar {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .session-avatar expression-carousel {
          width: 100%;
          height: 100%;
        }

        /* Gradient overlay for readability */
        .session-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 40%, rgba(10,10,26,0.85) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* ─── Top bar (glass) ─── */
        .session-topbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          padding-top: calc(12px + env(safe-area-inset-top));
          background: rgba(10,10,26,0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .topbar-left, .topbar-center, .topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .topbar-left { flex: 0 0 auto; }
        .topbar-center { flex: 1; justify-content: center; }
        .topbar-right { flex: 0 0 auto; }

        .burger-btn {
          background: none;
          border: none;
          color: var(--color-text-main, #fff);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .burger-btn:hover { background: rgba(255,255,255,0.1); }

        .profile-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full, 99px);
          background: rgba(255,255,255,0.1);
          color: var(--color-text-main, #fff);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .timer-pill {
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-mono, 'Space Mono', monospace);
          padding: 4px 12px;
          border-radius: var(--radius-full, 99px);
          background: rgba(255,255,255,0.1);
          color: var(--color-text-main, #fff);
          letter-spacing: 0.05em;
        }

        /* ─── Burger menu dropdown ─── */
        .burger-menu {
          position: absolute;
          top: 100%;
          left: 16px;
          background: rgba(20,20,40,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md, 12px);
          padding: 8px 0;
          min-width: 200px;
          box-shadow: var(--shadow-lg);
          display: none;
          z-index: 20;
        }
        .burger-menu.open { display: block; }
        .burger-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--color-text-main, #fff);
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }
        .burger-menu-item:hover { background: rgba(255,255,255,0.08); }
        .burger-menu-item.danger { color: var(--lola-error, #ef476f); }
        .burger-menu-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          color: var(--color-text-sub, #9595b0);
          font-size: 0.8rem;
        }

        /* ─── Speech bubble (mobile) ─── */
        .session-speech {
          position: absolute;
          bottom: 80px;
          left: 16px;
          right: 16px;
          z-index: 5;
          background: rgba(20,20,40,0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg, 16px);
          padding: 14px 18px;
          max-height: 160px;
          overflow-y: auto;
        }
        .speech-coach-name {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--lola-indigo, #4361ee);
          margin-bottom: 6px;
        }
        .speech-text {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--color-text-main, #fff);
        }
        .speech-text:empty::after {
          content: 'Listening...';
          color: var(--color-text-sub, #9595b0);
          font-style: italic;
        }

        /* ─── Waveform bar (bottom) ─── */
        .session-waveform-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          padding-bottom: calc(10px + env(safe-area-inset-bottom));
          background: rgba(10,10,26,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .wf-bar-track {
          flex: 1;
          height: 32px;
          display: flex;
          align-items: center;
        }
        .wf-bar-track audio-visualizer {
          width: 100%;
          height: 100%;
        }
        .mic-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--lola-sky, #4cc9f0);
          flex-shrink: 0;
          animation: mic-pulse 1.5s ease-in-out infinite;
        }
        .mic-dot.inactive { background: var(--color-text-sub, #9595b0); animation: none; }
        @keyframes mic-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .session-status {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-text-sub, #9595b0);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ─── Camera PIP ─── */
        .session-camera-pip {
          position: absolute;
          bottom: 90px;
          right: 16px;
          width: 100px;
          height: 75px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.2);
          z-index: 6;
          display: none;
          box-shadow: var(--shadow-md);
        }
        .session-camera-pip video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }

        /* ─── Hint overlay ─── */
        .session-hint {
          position: absolute;
          inset: 0;
          z-index: 8;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          transition: opacity 0.8s ease-out;
        }
        .session-hint.hidden { opacity: 0; }
        .session-hint-inner {
          text-align: center;
          animation: hint-breathe 3s ease-in-out infinite;
        }
        .session-hint-text {
          font-size: 1.25rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.05em;
        }
        .session-hint-sub {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 8px;
        }
        @keyframes hint-breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        /* ─── Live dot ─── */
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--lola-success, #06d6a0);
          animation: live-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ─── Mic mute toggle ─── */
        .mic-mute-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .mic-mute-btn:hover { background: rgba(255,255,255,0.1); }
        .mic-mute-btn.muted {
          background: var(--lola-error, #ef476f);
          border-color: var(--lola-error, #ef476f);
          color: white;
        }

        /* ─── Error screen ─── */
        .session-error {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: var(--lola-bg, #0a0a1a);
          padding: 24px;
          text-align: center;
        }
        .error-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .error-icon.warn { background: rgba(255, 209, 102, 0.15); color: var(--lola-warning, #ffd166); }
        .error-icon.fail { background: rgba(239, 71, 111, 0.15); color: var(--lola-error, #ef476f); }
        .error-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
        }
        .error-desc {
          font-size: 0.9rem;
          color: var(--lola-text-secondary, #9595b0);
          max-width: 320px;
          line-height: 1.5;
        }
        .error-btn {
          padding: 12px 32px;
          border-radius: var(--radius-sm, 8px);
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 8px;
          transition: all 0.2s;
        }
        .error-btn-primary {
          background: var(--lola-indigo, #4361ee);
          color: white;
        }
        .error-btn-primary:hover { filter: brightness(1.1); }
        .error-btn-secondary {
          background: transparent;
          color: var(--lola-text-secondary, #9595b0);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .error-btn-secondary:hover { border-color: rgba(255,255,255,0.3); }

        /* ─── Frustration glow ─── */
        .frustration-active .session-avatar {
          box-shadow: inset 0 0 60px rgba(245, 158, 11, 0.3);
        }

        /* ═══ Desktop: Side-by-Side (768px+) ═══ */
        @media (min-width: 768px) {
          .session-root {
            display: grid;
            grid-template-columns: 3fr 2fr;
          }

          /* Left column: avatar + waveform */
          .session-left {
            position: relative;
            overflow: hidden;
          }
          .session-avatar { position: absolute; inset: 0; }
          .session-gradient {
            background: linear-gradient(transparent 50%, rgba(10,10,26,0.6) 100%);
          }

          /* Right column: header + transcript + controls */
          .session-right {
            position: relative;
            display: flex;
            flex-direction: column;
            background: var(--lola-bg, #0a0a1a);
            border-left: 1px solid rgba(255,255,255,0.08);
          }
          .session-right-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .session-right-transcript {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
          }
          .session-right-transcript live-transcript {
            position: relative;
            height: 100%;
          }
          .session-right-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            border-top: 1px solid rgba(255,255,255,0.06);
          }
          .desktop-btn {
            padding: 10px 20px;
            border-radius: var(--radius-full, 99px);
            border: none;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
          }
          .desktop-btn:hover { filter: brightness(1.1); }
          .desktop-end-btn {
            background: var(--lola-error, #ef476f);
            color: white;
          }
          .desktop-cam-btn {
            background: transparent;
            color: var(--color-text-sub, #9595b0);
            border: 1px solid rgba(255,255,255,0.12);
          }
          .desktop-cam-btn.active {
            background: var(--lola-sky, #4cc9f0);
            color: white;
            border-color: var(--lola-sky, #4cc9f0);
          }

          /* Hide mobile-only elements on desktop */
          .session-topbar { display: none; }
          .session-speech { display: none; }
          .session-waveform-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 5;
            background: rgba(10,10,26,0.5);
          }

          /* Desktop waveform on the left panel */
          .session-camera-pip {
            bottom: 60px;
            right: 16px;
          }
        }

        /* Hide desktop-only elements on mobile */
        @media (max-width: 767px) {
          .session-right { display: none; }
        }
      </style>

      <div class="session-root" id="session-root">
        <!-- Left / Full-screen: Avatar -->
        <div class="session-left">
          <div class="session-avatar">
            <expression-carousel id="lola-carousel" fullbleed></expression-carousel>
          </div>
          <div class="session-gradient"></div>

          <!-- Hint overlay -->
          <div class="session-hint" id="session-hint">
            <div class="session-hint-inner">
              <p class="session-hint-text">Just start talking</p>
              <p class="session-hint-sub">LoLA is listening</p>
            </div>
          </div>

          <!-- Mobile: Top bar -->
          <div class="session-topbar">
            <div class="topbar-left">
              <button class="burger-btn" id="burger-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div class="burger-menu" id="burger-menu">
                <button class="burger-menu-item danger" id="menu-end-session">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                  End Session
                </button>
                <button class="burger-menu-item" id="menu-camera-toggle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  <span id="menu-camera-label">Camera On</span>
                </button>
                <div class="burger-menu-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
                  ${this._profileLabel}
                </div>
              </div>
            </div>
            <div class="topbar-center">
              <div class="live-dot"></div>
              <span class="profile-badge">LoLA</span>
            </div>
            <div class="topbar-right">
              <span class="timer-pill" id="session-timer">0:00</span>
            </div>
          </div>

          <!-- Mobile: Speech bubble -->
          <div class="session-speech" id="session-speech">
            <div class="speech-coach-name">LoLA</div>
            <div class="speech-text" id="speech-text"></div>
          </div>

          <!-- Waveform bar (bottom of left/avatar area) -->
          <div class="session-waveform-bar">
            <button class="mic-mute-btn" id="mic-mute-btn" aria-label="Mute microphone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button class="mic-mute-btn" id="camera-toggle-btn" aria-label="Toggle camera">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            </button>
            <div class="wf-bar-track">
              <audio-visualizer id="avatar-viz" color="#4361ee"></audio-visualizer>
            </div>
            <div class="mic-dot" id="mic-dot"></div>
            <span class="session-status" id="session-status">Connecting...</span>
          </div>

          <!-- Camera PIP -->
          <div class="session-camera-pip" id="lola-camera-preview"></div>
        </div>

        <!-- Right: Desktop transcript panel -->
        <div class="session-right">
          <div class="session-right-header">
            <button class="burger-btn" id="desktop-back" title="End session">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <div class="live-dot"></div>
            <span class="profile-badge">LoLA — ${this._profileLabel}</span>
            <span style="flex:1"></span>
            <span class="timer-pill" id="desktop-timer">0:00</span>
          </div>
          <div class="session-right-transcript">
            <live-transcript id="desktop-transcript"></live-transcript>
          </div>
          <div class="session-right-controls">
            <button class="desktop-btn desktop-end-btn" id="desktop-end">End Session</button>
            <button class="desktop-btn desktop-cam-btn" id="desktop-camera">Camera</button>
            <span style="flex:1"></span>
            <audio-visualizer id="user-viz" color="#4cc9f0" style="width: 120px; height: 28px;"></audio-visualizer>
          </div>
        </div>
      </div>
    `;

    // --- Event listeners ---
    const endSession = async () => {
      const duration = this._sessionStartTime
        ? Math.floor((Date.now() - this._sessionStartTime) / 1000)
        : 0;
      const frustrationCount = this._frustrationCount;
      const transcriptLog = [...this._transcriptLog];
      const sessionId = this._sessionId;

      this.cleanup();
      this._stopTimer();

      // Report session end
      let sessionData = null;
      try {
        if (sessionId) {
          const res = await fetch("/api/sessions/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionId,
              duration_seconds: duration,
              frustration_count: frustrationCount,
              transcript: transcriptLog,
            }),
          });
          sessionData = await res.json();
        }
      } catch (e) {
        console.warn("Session end report failed:", e);
      }

      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: {
          view: 'session-summary',
          sessionData: {
            ...(sessionData || {}),
            duration,
            profileLabel: this._profileLabel,
            profileKey: this._profileKey,
            transcriptCount: transcriptLog.length,
            frustrationCount,
          },
        }
      }));
    };

    // Burger menu
    this.querySelector("#burger-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      this._burgerOpen = !this._burgerOpen;
      this.querySelector("#burger-menu").classList.toggle("open", this._burgerOpen);
    });
    document.addEventListener("click", this._closeBurger = () => {
      if (this._burgerOpen) {
        this._burgerOpen = false;
        const m = this.querySelector("#burger-menu");
        if (m) m.classList.remove("open");
      }
    });
    this.querySelector("#menu-end-session").addEventListener("click", endSession);
    this.querySelector("#menu-camera-toggle").addEventListener("click", () => this.toggleCamera());

    // Mic mute toggle
    this._micMuted = false;
    this.querySelector("#mic-mute-btn").addEventListener("click", () => {
      this._micMuted = !this._micMuted;
      const btn = this.querySelector("#mic-mute-btn");
      btn.classList.toggle("muted", this._micMuted);
      if (this.audioStreamer) {
        const track = this.audioStreamer.stream?.getAudioTracks()[0];
        if (track) track.enabled = !this._micMuted;
      }
      btn.innerHTML = this._micMuted
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    });

    // Camera toggle (visible button in waveform bar)
    this.querySelector("#camera-toggle-btn").addEventListener("click", () => this.toggleCamera());

    // Desktop controls
    this.querySelector("#desktop-back").addEventListener("click", endSession);
    this.querySelector("#desktop-end").addEventListener("click", endSession);
    this.querySelector("#desktop-camera").addEventListener("click", () => this.toggleCamera());

    // Load avatar
    const carousel = this.querySelector("#lola-carousel");
    carousel.setProfile(this._profileKey);

    // Auto-start session
    await this.toggleSession();
  }

  // ─── Session Control ─────────────────────────────────────────────

  _setStatus(text) {
    const s = this.querySelector("#session-status");
    if (s) s.textContent = text;
  }

  _startTimer() {
    this._sessionStartTime = Date.now();
    const update = () => {
      const elapsed = Math.floor((Date.now() - this._sessionStartTime) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = String(elapsed % 60).padStart(2, "0");
      const display = `${m}:${s}`;
      const t1 = this.querySelector("#session-timer");
      const t2 = this.querySelector("#desktop-timer");
      if (t1) t1.textContent = display;
      if (t2) t2.textContent = display;
    };
    update();
    this._timerInterval = setInterval(update, 1000);
  }

  _stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }

  _updateSpeechBubble(text, finished) {
    const el = this.querySelector("#speech-text");
    if (!el) return;
    if (finished) {
      el.textContent = text;
    } else {
      el.textContent = (el.textContent || "") + text;
    }
    // Auto-scroll
    const bubble = this.querySelector("#session-speech");
    if (bubble) bubble.scrollTop = bubble.scrollHeight;
  }

  async toggleSession() {
    if (this.sessionActive) {
      this.cleanup();
      this._stopTimer();
      this._setStatus("Session ended");
      return;
    }

    this._setStatus("Connecting...");

    try {
      this.client = new GeminiLiveAPI();
      // Use avatar config if launched from creator wizard
      if (this.avatarConfig) {
        const ac = this.avatarConfig;
        const traits = (ac.personality || []).join(', ');
        const avatarInstruction = `You are ${ac.name}, an AI ${ac.domain.replace(/_/g, ' ')} coach. Your personality traits: ${traits}. ${ac.tagline || ''} Adapt to the learner's needs.`;
        this.client.setSystemInstructions(this._systemInstruction || avatarInstruction);
        this.client.setVoice(ac.voice || "Kore");
      } else {
        this.client.setSystemInstructions(this._systemInstruction);
        const voice = this._l1 === "en" ? "Puck" : "Kore";
        this.client.setVoice(voice);
      }
      this.client.setInputAudioTranscription(true);
      this.client.setOutputAudioTranscription(true);

      this.client.onReceiveResponse = (response) => {
        if (response.type === MultimodalLiveResponseType.AUDIO) {
          this.handleAudio(response.data);
        } else if (
          response.type === MultimodalLiveResponseType.TURN_COMPLETE
        ) {
          const carousel = this.querySelector("#lola-carousel");
          if (carousel) carousel.setExpression("neutral");
          this._outputBuffer = "";
          // Desktop transcript
          const transcript = this.querySelector("#desktop-transcript") || this.querySelector("live-transcript");
          if (transcript) transcript.finalizeAll();
        } else if (
          response.type === MultimodalLiveResponseType.INTERRUPTED
        ) {
          const carousel = this.querySelector("#lola-carousel");
          if (carousel) carousel.setExpression("neutral");
          this._outputBuffer = "";
          if (this.audioPlayer) this.audioPlayer.interrupt();
        } else if (
          response.type === MultimodalLiveResponseType.INPUT_TRANSCRIPTION
        ) {
          // Dismiss hint on first speech
          const hint = this.querySelector("#session-hint");
          if (hint && !hint.classList.contains("hidden")) hint.classList.add("hidden");

          const transcript = this.querySelector("#desktop-transcript") || this.querySelector("live-transcript");
          if (transcript)
            transcript.addInputTranscript(
              response.data.text,
              response.data.finished
            );
          this.detectFrustration(response.data.text);
          // Accumulate transcript for persistence
          if (response.data.finished && response.data.text?.trim()) {
            this._transcriptLog.push({ role: "user", content: response.data.text.trim() });
          }
        } else if (
          response.type === MultimodalLiveResponseType.OUTPUT_TRANSCRIPTION
        ) {
          const transcript = this.querySelector("#desktop-transcript") || this.querySelector("live-transcript");
          if (transcript)
            transcript.addOutputTranscript(
              response.data.text,
              response.data.finished
            );
          // Update mobile speech bubble
          this._updateSpeechBubble(response.data.text, response.data.finished);
          this.detectExpression(response.data.text);
          this.detectSuccess(response.data.text);
          // Accumulate transcript for persistence
          if (response.data.finished && response.data.text?.trim()) {
            this._transcriptLog.push({ role: "model", content: response.data.text.trim() });
          }
        }
      };

      this.client.onError = (e) => {
        console.error("Gemini error:", e);
      };
      this.client.onClose = () => {
        if (this.sessionActive) {
          this.cleanup();
          this._stopTimer();
          this._showError('connection_lost');
        } else {
          this._setStatus("Disconnected");
          const dot = this.querySelector("#mic-dot");
          if (dot) dot.classList.add("inactive");
        }
      };

      let token = null;
      try {
        token = await this.getRecaptchaToken();
      } catch (e) {
        console.warn("reCAPTCHA unavailable:", e);
      }

      await this.client.connect(token);

      // Report session start to backend
      this._transcriptLog = [];
      try {
        const deviceId = localStorage.getItem("lola_device_id");
        if (deviceId) {
          const voice = this._l1 === "en" ? "Puck" : "Kore";
          const startRes = await fetch("/api/sessions/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              device_id: deviceId,
              profile_key: this._profileKey || "unknown",
              profile_label: this._profileLabel || "Unknown",
              profile_data: this._profile || {},
              voice,
            }),
          });
          const startData = await startRes.json();
          this._sessionId = startData.session_id;
        }
      } catch (e) {
        console.warn("Session start report failed:", e);
      }

      this.audioStreamer = new AudioStreamer(this.client);
      await this.audioStreamer.start();

      const userViz = this.querySelector("#user-viz");
      if (
        userViz &&
        this.audioStreamer.audioContext &&
        this.audioStreamer.source
      ) {
        userViz.connect(
          this.audioStreamer.audioContext,
          this.audioStreamer.source
        );
      }

      this.audioPlayer = new AudioPlayer();
      await this.audioPlayer.init();

      const avatarViz = this.querySelector("#avatar-viz");
      if (avatarViz && this.audioPlayer.gainNode) {
        avatarViz.connect(
          this.audioPlayer.audioContext,
          this.audioPlayer.gainNode
        );
      }

      this.sessionActive = true;
      this._setStatus("Speak to LoLA");
      this._startTimer();
    } catch (e) {
      console.error("Session start failed:", e);
      this.cleanup();
      this._stopTimer();
      const msg = (e.message || '').toLowerCase();
      if (msg.includes('permission') || msg.includes('not allowed') || msg.includes('denied')) {
        this._showError('mic_denied');
      } else {
        this._showError('session_failed');
      }
    }
  }

  handleAudio(data) {
    if (this.audioPlayer) this.audioPlayer.play(data);
  }

  // ─── Expression Detection ────────────────────────────────────────

  detectExpression(text) {
    this._outputBuffer += " " + text;
    if (this._outputBuffer.length > 200) {
      this._outputBuffer = this._outputBuffer.slice(-200);
    }
    const detected = ExpressionCarousel.detectFromText(this._outputBuffer);
    if (detected) {
      const carousel = this.querySelector("#lola-carousel");
      if (carousel) carousel.setExpression(detected);
      this._outputBuffer = "";
    }
  }

  // ─── Frustration Detection ──────────────────────────────────────

  detectFrustration(text) {
    this._inputBuffer += " " + text;
    if (this._inputBuffer.length > 300) {
      this._inputBuffer = this._inputBuffer.slice(-300);
    }
    const lower = this._inputBuffer.toLowerCase();

    const frustrationPhrases = [
      "i don't understand", "i dont understand", "this is hard",
      "i give up", "i can't", "i cant", "confused", "ugh", "argh",
      "too difficult", "makes no sense", "what does that mean",
    ];
    const jaFrustration = ["わからない", "難しい", "むずかしい", "もう一回", "できない"];

    const hasExplicit = frustrationPhrases.some((p) => lower.includes(p));
    const hasJa = jaFrustration.some((p) => this._inputBuffer.includes(p));

    // Hesitation: 3+ "um"/"uh" in buffer
    const hesitationCount = (lower.match(/\b(um|uh|erm|えーと|えー)\b/g) || []).length;
    const hasHesitation = hesitationCount >= 3;

    if (!(hasExplicit || hasJa || hasHesitation)) return;

    const now = Date.now();
    if (now - this._frustrationCooldown < 30000) return;
    this._frustrationCooldown = now;
    this._frustrationCount++;

    const carousel = this.querySelector("#lola-carousel");
    if (carousel) carousel.setExpression("concerned");

    let details = "";
    if (this._frustrationCount >= 3) {
      details = "Learner is persistently struggling. Consider simplifying significantly or switching approach.";
    }

    if (this.client) {
      this.client.sendContextUpdate("frustration", details);
    }

    this.showFrustrationIndicator();
    this._inputBuffer = "";
  }

  detectSuccess(text) {
    const lower = (text || "").toLowerCase();
    const successPhrases = [
      "correct", "great job", "well done", "perfect", "excellent",
      "that's right", "thats right", "nice work", "good job",
    ];
    const jaSuccess = ["すごい", "上手", "正解", "よくできました"];

    const has = successPhrases.some((p) => lower.includes(p))
      || jaSuccess.some((p) => text.includes(p));
    if (!has) return;

    this._frustrationCount = 0;
    if (this.client) {
      this.client.sendContextUpdate("success");
    }
    const carousel = this.querySelector("#lola-carousel");
    if (carousel) carousel.setExpression("happy");
  }

  showFrustrationIndicator() {
    const root = this.querySelector("#session-root");
    if (!root) return;
    root.classList.add("frustration-active");
    if (this._frustrationTimer) clearTimeout(this._frustrationTimer);
    this._frustrationTimer = setTimeout(() => {
      root.classList.remove("frustration-active");
    }, 10000);
  }

  // ─── Camera ──────────────────────────────────────────────────────

  async toggleCamera() {
    const previewContainer = this.querySelector("#lola-camera-preview");
    const menuLabel = this.querySelector("#menu-camera-label");
    const desktopBtn = this.querySelector("#desktop-camera");
    const toggleBtn = this.querySelector("#camera-toggle-btn");

    if (this.cameraActive) {
      if (this.videoStreamer) this.videoStreamer.stop();
      this.videoStreamer = null;
      this.cameraActive = false;
      if (menuLabel) menuLabel.textContent = "Camera On";
      if (desktopBtn) { desktopBtn.classList.remove("active"); desktopBtn.textContent = "Camera"; }
      if (toggleBtn) toggleBtn.classList.remove("muted"); // reuse .muted style as "active" indicator (inverted)
      if (previewContainer) {
        previewContainer.style.display = "none";
        previewContainer.innerHTML = "";
      }
      return;
    }

    if (!this.client || !this.client.connected) {
      console.warn("Start session first before enabling camera");
      return;
    }

    try {
      this.videoStreamer = new VideoStreamer(this.client);
      const videoEl = await this.videoStreamer.start({
        fps: 1,
        width: 640,
        height: 480,
        quality: 0.7,
      });
      if (previewContainer && videoEl) {
        previewContainer.style.display = "block";
        previewContainer.innerHTML = "";
        previewContainer.appendChild(videoEl);
      }
      this.cameraActive = true;
      if (menuLabel) menuLabel.textContent = "Camera Off";
      if (desktopBtn) { desktopBtn.classList.add("active"); desktopBtn.textContent = "Camera ON"; }

      // Style the toggle button as active (sky blue)
      if (toggleBtn) {
        toggleBtn.style.background = "var(--lola-sky, #4cc9f0)";
        toggleBtn.style.borderColor = "var(--lola-sky, #4cc9f0)";
        toggleBtn.style.color = "white";
      }

      // Notify Gemini that vision input is now active
      if (this.client) {
        this.client.sendContextUpdate("vision", "Camera is now active. The learner may show you objects, text, menus, or signs. Describe what you see and incorporate it into coaching naturally.");
      }
    } catch (e) {
      console.error("Camera failed:", e);
      // Reset toggle button style on failure
      if (toggleBtn) {
        toggleBtn.style.background = "";
        toggleBtn.style.borderColor = "";
        toggleBtn.style.color = "";
      }
    }
  }

  // ─── Error Screens ──────────────────────────────────────────────

  _showError(type) {
    const errors = {
      mic_denied: {
        icon: 'warn',
        title: 'Microphone Access Needed',
        desc: 'LoLA needs your microphone to have a conversation. Please allow microphone access in your browser settings and try again.',
        primary: 'Try Again',
        primaryAction: () => this.showSession(),
      },
      connection_lost: {
        icon: 'fail',
        title: 'Connection Lost',
        desc: 'The connection to LoLA was interrupted. This can happen with unstable networks.',
        primary: 'Reconnect',
        primaryAction: () => this.showSession(),
      },
      session_failed: {
        icon: 'fail',
        title: 'Session Failed',
        desc: 'Something went wrong starting your session. Please try again.',
        primary: 'Try Again',
        primaryAction: () => this.showSession(),
      },
    };

    const err = errors[type] || errors.session_failed;
    const errorEl = document.createElement('div');
    errorEl.className = 'session-error';
    errorEl.innerHTML = `
      <div class="error-icon ${err.icon}">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${err.icon === 'warn'
            ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
        </svg>
      </div>
      <h2 class="error-title">${err.title}</h2>
      <p class="error-desc">${err.desc}</p>
      <button class="error-btn error-btn-primary" id="error-primary">${err.primary}</button>
      <button class="error-btn error-btn-secondary" id="error-back">Back to Home</button>
    `;

    this.innerHTML = '';
    this.appendChild(errorEl);

    this.querySelector('#error-primary').addEventListener('click', () => err.primaryAction());
    this.querySelector('#error-back').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'landing' }
      }));
    });
  }

  // ─── Cleanup ─────────────────────────────────────────────────────

  cleanup() {
    if (this.audioStreamer) {
      this.audioStreamer.stop();
      this.audioStreamer = null;
    }
    if (this.videoStreamer) {
      this.videoStreamer.stop();
      this.videoStreamer = null;
    }
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
    if (this.audioPlayer) {
      this.audioPlayer.interrupt();
      this.audioPlayer = null;
    }
    const userViz = this.querySelector("#user-viz");
    if (userViz?.disconnect) userViz.disconnect();
    const avatarViz = this.querySelector("#avatar-viz");
    if (avatarViz?.disconnect) avatarViz.disconnect();
    this._outputBuffer = "";
    this._inputBuffer = "";
    this._frustrationCooldown = 0;
    this._frustrationCount = 0;
    if (this._frustrationTimer) clearTimeout(this._frustrationTimer);
    this._stopTimer();
    if (this._closeBurger) {
      document.removeEventListener("click", this._closeBurger);
      this._closeBurger = null;
    }
    this.sessionActive = false;
    this.cameraActive = false;
  }

  async getRecaptchaToken() {
    if (typeof grecaptcha === "undefined") return null;
    return new Promise((resolve) => {
      try {
        grecaptcha.enterprise.ready(async () => {
          try {
            const t = await grecaptcha.enterprise.execute(
              "6LeSYx8sAAAAAGdRAp8VQ2K9I-KYGWBykzayvQ8n",
              { action: "LOGIN" }
            );
            resolve(t);
          } catch (e) {
            resolve(null);
          }
        });
      } catch (e) {
        resolve(null);
      }
    });
  }
}

customElements.define("view-lola", ViewLola);
