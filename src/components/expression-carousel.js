/**
 * Expression Carousel — Swaps pre-rendered avatar expression images
 * based on conversation context from Gemini responses.
 *
 * Usage:
 *   <expression-carousel></expression-carousel>
 *   carousel.setProfile('profile-a');
 *   carousel.setExpression('thinking');
 */

const EXPRESSIONS = [
  "neutral",
  "thinking",
  "smiling",
  "concerned",
  "encouraging",
  "laughing",
  "explaining",
  "impressed",
];

// Keyword → expression mapping for auto-detection from transcription text
const EXPRESSION_KEYWORDS = [
  {
    expr: "impressed",
    keywords: [
      "wow",
      "amazing",
      "perfect",
      "exactly right",
      "brilliant",
      "nailed",
      "outstanding",
    ],
  },
  {
    expr: "laughing",
    keywords: ["haha", "ha ha", "funny", "heh"],
  },
  {
    expr: "encouraging",
    keywords: [
      "you can do",
      "try again",
      "almost",
      "keep going",
      "getting there",
      "don't worry",
      "good try",
      "nice try",
    ],
  },
  {
    expr: "smiling",
    keywords: [
      "great",
      "nice job",
      "wonderful",
      "excellent",
      "good job",
      "well done",
      "fantastic",
      "that's right",
      "correct",
    ],
  },
  {
    expr: "concerned",
    keywords: [
      "careful",
      "tricky",
      "common mistake",
      "struggle",
      "difficult",
      "watch out",
      "be careful",
    ],
  },
  {
    expr: "explaining",
    keywords: [
      "because",
      "the reason",
      "this means",
      "for example",
      "the rule",
      "in english",
      "in japanese",
      "grammar",
      "pattern is",
      "notice how",
    ],
  },
  {
    expr: "thinking",
    keywords: [
      "hmm",
      "let me think",
      "interesting",
      "let me see",
      "let's see",
      "consider",
    ],
  },
];

class ExpressionCarousel extends HTMLElement {
  constructor() {
    super();
    this._profileId = null;
    this._current = "neutral";
    this._lastChangeTime = 0;
    this._holdMs = 3000; // minimum ms between expression changes
    this._imageStatus = {}; // track which images loaded
  }

  connectedCallback() {
    const fullbleed = this.hasAttribute('fullbleed');
    this.innerHTML = `
      <style>
        :host { display: block; width: 100%; ${fullbleed ? 'height: 100%;' : ''} }
        .ec-wrap {
          position: relative;
          width: 100%;
          ${fullbleed ? 'height: 100%;' : 'aspect-ratio: 4 / 5;'}
          ${fullbleed ? '' : 'border-radius: var(--radius-lg);'}
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        .ec-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .ec-img.active { opacity: 1; }
        .ec-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--color-text-sub);
          font-size: 0.9rem;
          opacity: 0.6;
          transition: opacity 0.4s ease;
        }
        .ec-placeholder.hidden { opacity: 0; pointer-events: none; }
        .ec-placeholder-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .ec-expression-label {
          position: absolute;
          bottom: 8px;
          left: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.3);
          padding: 2px 8px;
          border-radius: 4px;
          pointer-events: none;
          transition: opacity 0.3s;
          ${fullbleed ? 'display: none;' : ''}
        }
      </style>
      <div class="ec-wrap">
        <div class="ec-placeholder" id="ec-ph">
          <div class="ec-placeholder-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <span id="ec-ph-text">Select a profile</span>
        </div>
        <span class="ec-expression-label" id="ec-label" style="opacity:0"></span>
      </div>
    `;
  }

  setProfile(profileId) {
    this._profileId = profileId;
    this._imageStatus = {};
    this._current = "neutral";
    this._loadImages();
  }

  _loadImages() {
    const wrap = this.querySelector(".ec-wrap");
    const ph = this.querySelector("#ec-ph");
    const phText = this.querySelector("#ec-ph-text");

    // Remove any existing images
    wrap.querySelectorAll(".ec-img").forEach((el) => el.remove());

    let loaded = 0;
    const total = EXPRESSIONS.length;
    phText.textContent = "Loading avatar...";

    for (const expr of EXPRESSIONS) {
      const img = document.createElement("img");
      img.className = "ec-img";
      img.dataset.expr = expr;
      img.draggable = false;
      img.alt = expr;
      img.src = `/avatars/${this._profileId}/${expr}.png`;

      img.onload = () => {
        loaded++;
        this._imageStatus[expr] = true;
        phText.textContent = `Loading (${loaded}/${total})...`;
        // Show neutral as soon as it loads
        if (expr === this._current) {
          img.classList.add("active");
          ph.classList.add("hidden");
          this._showLabel(expr);
        }
      };

      img.onerror = () => {
        loaded++;
        this._imageStatus[expr] = false;
        phText.textContent =
          loaded < total
            ? `Loading (${loaded}/${total})...`
            : "Avatar images not yet generated";
      };

      // Insert before the label
      const label = this.querySelector("#ec-label");
      wrap.insertBefore(img, label);
    }
  }

  setExpression(name) {
    if (!EXPRESSIONS.includes(name)) return;
    if (name === this._current) return;

    // Enforce hold time to prevent flickering
    const now = Date.now();
    if (now - this._lastChangeTime < this._holdMs && this._current !== "neutral") return;

    this._current = name;
    this._lastChangeTime = now;

    const imgs = this.querySelectorAll(".ec-img");
    imgs.forEach((img) => {
      if (img.dataset.expr === name && this._imageStatus[name]) {
        img.classList.add("active");
      } else {
        img.classList.remove("active");
      }
    });

    this._showLabel(name);
  }

  _showLabel(name) {
    const label = this.querySelector("#ec-label");
    if (label) {
      label.textContent = name;
      label.style.opacity = "1";
    }
  }

  /** Detect expression from output transcription text. Returns expression name or null. */
  static detectFromText(text) {
    const lower = text.toLowerCase();
    for (const { expr, keywords } of EXPRESSION_KEYWORDS) {
      for (const kw of keywords) {
        if (lower.includes(kw)) return expr;
      }
    }
    return null;
  }

  get currentExpression() {
    return this._current;
  }
}

customElements.define("expression-carousel", ExpressionCarousel);

export { ExpressionCarousel };
