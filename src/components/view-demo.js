/**
 * "Same Error, Different Coaching" — visual proof that LoLA adapts to the learner.
 * Shows the same grammar mistake coached two different ways based on profile.
 */

import { t } from '../lib/i18n.js'

const DEMO_SCENARIOS = [
  {
    title: 'Grammar Correction',
    learnerSays: 'I went to store yesterday and buyed many thing.',
    profiles: [
      {
        label: 'Analytical Learner',
        sublabel: 'Wants rules & patterns',
        badge: 'Profile A',
        color: '#4361ee',
        responses: [
          { type: 'coach', text: "Good attempt! Let's look at three patterns here." },
          { type: 'rule', text: '1. Articles: "the store" — English requires "the" before specific known places.' },
          { type: 'rule', text: '2. Irregular past: "buy" → "bought" (not "buyed"). This is an irregular verb — no -ed suffix.' },
          { type: 'rule', text: '3. Plurals: "many things" — countable nouns need the plural -s after "many".' },
          { type: 'coach', text: 'Try again with these three corrections applied?' },
        ],
      },
      {
        label: 'Explorer Learner',
        sublabel: 'Learns by doing',
        badge: 'Profile B',
        color: '#4cc9f0',
        responses: [
          { type: 'coach', text: "Nice! I totally understood you! Let's make it sound more natural though." },
          { type: 'coach', text: 'Try this: "I went to THE store yesterday and BOUGHT many THINGS."' },
          { type: 'coach', text: "Hear the difference? It flows better. The meaning was already clear — we're just polishing." },
          { type: 'coach', text: "\"Bought\" is one of those weird English verbs that doesn't follow rules. You'll get used to it!" },
        ],
      },
    ],
  },
  {
    title: 'Pronunciation Coaching',
    learnerSays: 'Sensei, "right" to "light" wa onaji desu ka?',
    profiles: [
      {
        label: 'Analytical Learner',
        sublabel: 'Wants rules & patterns',
        badge: 'Profile A',
        color: '#4361ee',
        responses: [
          { type: 'coach', text: 'Great question! R and L are distinct phonemes in English.' },
          { type: 'rule', text: 'For "R": tongue curls back, doesn\'t touch the roof. Air flows around it.' },
          { type: 'rule', text: 'For "L": tongue tip touches the ridge behind your top teeth.' },
          { type: 'coach', text: 'This maps to the L1 interference pattern — Japanese ら行 sits between English R and L. Let\'s drill minimal pairs.' },
        ],
      },
      {
        label: 'Explorer Learner',
        sublabel: 'Learns by doing',
        badge: 'Profile B',
        color: '#4cc9f0',
        responses: [
          { type: 'coach', text: "They sound similar but mean completely different things! Let's play a game." },
          { type: 'coach', text: 'I\'ll say a word, you tell me if it\'s R or L: "rice"... "lice"... "right"... "light"...' },
          { type: 'coach', text: "Don't worry about getting it perfect — the more you hear them, the more your ear will catch the difference." },
          { type: 'coach', text: 'Try saying "really long road" slowly. Feel how your tongue moves differently for each one?' },
        ],
      },
    ],
  },
];

class ViewDemo extends HTMLElement {
  connectedCallback() {
    this._scenarioIndex = 0;
    this._animating = false;
    this.render();
  }

  render() {
    const scenario = DEMO_SCENARIOS[this._scenarioIndex];

    this.innerHTML = `
      <style>
        .demo-root {
          min-height: 100vh;
          background: var(--lola-bg, #0a0a1a);
          padding: 24px;
          padding-top: calc(24px + env(safe-area-inset-top));
          padding-bottom: calc(24px + env(safe-area-inset-bottom));
          overflow-y: auto;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .demo-back {
          background: none;
          border: none;
          color: var(--lola-text-secondary, #9595b0);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
        }
        .demo-back:hover { background: rgba(255,255,255,0.08); color: var(--lola-text, #f0f0f8); }
        .demo-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
        }

        .demo-scenario-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--lola-text-muted, #555575);
          margin-bottom: 8px;
        }

        .demo-learner {
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-lg, 16px);
          padding: 16px 20px;
          margin-bottom: 24px;
        }
        .demo-learner-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--lola-rose, #ff4d6d);
          margin-bottom: 6px;
        }
        .demo-learner-text {
          font-size: 1rem;
          color: var(--lola-text, #f0f0f8);
          line-height: 1.5;
          font-style: italic;
        }

        .demo-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (max-width: 640px) {
          .demo-comparison {
            grid-template-columns: 1fr;
          }
        }

        .demo-profile {
          background: var(--lola-surface, #12122a);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-lg, 16px);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .demo-profile-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .demo-profile-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .demo-profile-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
        }
        .demo-profile-sub {
          font-size: 0.7rem;
          color: var(--lola-text-muted, #555575);
        }

        .demo-response {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
          padding: 10px 14px;
          border-radius: var(--radius-md, 12px);
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .demo-response.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .demo-response.coach {
          background: rgba(255,255,255,0.04);
          color: var(--lola-text, #f0f0f8);
        }
        .demo-response.rule {
          background: rgba(67, 97, 238, 0.08);
          border-left: 3px solid var(--lola-indigo, #4361ee);
          color: var(--lola-text, #f0f0f8);
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 0.8rem;
        }

        .demo-insight {
          background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(76, 201, 240, 0.1));
          border: 1px solid rgba(67, 97, 238, 0.2);
          border-radius: var(--radius-lg, 16px);
          padding: 20px;
          text-align: center;
          margin-bottom: 24px;
        }
        .demo-insight-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
          margin-bottom: 6px;
        }
        .demo-insight-text {
          font-size: 0.8rem;
          color: var(--lola-text-secondary, #9595b0);
          line-height: 1.5;
        }

        .demo-nav {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .demo-btn {
          padding: 12px 28px;
          border-radius: var(--radius-sm, 8px);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .demo-btn-primary {
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee, #4cc9f0));
          color: white;
        }
        .demo-btn-primary:hover { filter: brightness(1.1); }
        .demo-btn-secondary {
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          color: var(--lola-text, #f0f0f8);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
        }
        .demo-btn-secondary:hover { background: rgba(255,255,255,0.08); }

        .demo-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .demo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s;
        }
        .demo-dot.active {
          background: var(--lola-indigo, #4361ee);
          transform: scale(1.3);
        }
      </style>

      <div class="demo-root">
        <div class="demo-header">
          <button class="demo-back" id="demo-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <span class="demo-title">${t('sameErrorTitle')}</span>
        </div>

        <div class="demo-dots" id="demo-dots">
          ${DEMO_SCENARIOS.map((_, i) => `<button class="demo-dot${i === this._scenarioIndex ? ' active' : ''}" data-i="${i}"></button>`).join('')}
        </div>

        <div class="demo-scenario-label">${scenario.title}</div>

        <div class="demo-learner">
          <div class="demo-learner-label">${t('learnerSays')}</div>
          <div class="demo-learner-text">"${scenario.learnerSays}"</div>
        </div>

        <div class="demo-comparison" id="demo-comparison">
          ${scenario.profiles.map((p, pi) => `
            <div class="demo-profile">
              <div class="demo-profile-header">
                <div class="demo-profile-dot" style="background: ${p.color}"></div>
                <div>
                  <div class="demo-profile-name">${p.label}</div>
                  <div class="demo-profile-sub">${p.sublabel}</div>
                </div>
              </div>
              ${p.responses.map((r, ri) => `
                <div class="demo-response ${r.type}" data-profile="${pi}" data-index="${ri}">
                  ${r.text}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>

        <div class="demo-insight">
          <div class="demo-insight-title">${t('sameError')}</div>
          <div class="demo-insight-text">${t('demoInsight')}</div>
        </div>

        <div class="demo-nav">
          <button class="demo-btn demo-btn-primary" id="demo-try">${t('tryYourself')}</button>
          <button class="demo-btn demo-btn-secondary" id="demo-replay">${t('replay')}</button>
        </div>
      </div>
    `;

    // Animate responses in sequence
    this._animateResponses();

    // Event listeners
    this.querySelector('#demo-back').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'landing' }
      }));
    });

    this.querySelector('#demo-try').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }));
    });

    this.querySelector('#demo-replay').addEventListener('click', () => {
      this._animateResponses();
    });

    this.querySelectorAll('.demo-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        this._scenarioIndex = parseInt(dot.dataset.i);
        this.render();
      });
    });
  }

  _animateResponses() {
    const responses = this.querySelectorAll('.demo-response');
    responses.forEach(el => {
      el.classList.remove('visible');
    });

    let delay = 400;
    responses.forEach((el) => {
      setTimeout(() => el.classList.add('visible'), delay);
      delay += 350;
    });
  }
}

customElements.define('view-demo', ViewDemo);
