/**
 * "Same Error, Different Coaching" — visual proof that LoLA adapts to the learner.
 * Shows the same grammar mistake coached two different ways based on profile.
 */

import { t } from '../lib/i18n.js'

const DEMO_SCENARIOS = [
  {
    title: 'Pronunciation Coaching',
    insightTitle: null,
    insightText: null,
    learnerSays: '先生、"right" と "light" は同じですか？ (Sensei, "right" to "light" wa onaji desu ka?)',
    profiles: [
      {
        label: 'Analytical Learner',
        sublabel: 'Wants rules & patterns',
        badge: 'Profile A',
        color: '#4361ee',
        responses: [
          { type: 'coach', text: 'いい質問ですね！(Great question!) R and L are distinct phonemes in English.' },
          { type: 'rule', text: '"R" の発音: tongue curls back, doesn\'t touch the roof. Air flows around it.' },
          { type: 'rule', text: '"L" の発音: tongue tip touches the ridge behind your top teeth.' },
          { type: 'coach', text: '日本語の「ら・り・る・れ・ろ」(ra-ri-ru-re-ro) sits between English R and L — that\'s a native-language interference pattern. Let\'s drill minimal pairs.' },
        ],
      },
      {
        label: 'Explorer Learner',
        sublabel: 'Learns by doing',
        badge: 'Profile B',
        color: '#4cc9f0',
        responses: [
          { type: 'coach', text: '似てるけど全然違う意味になるよ！(They sound similar but mean totally different things!) Let\'s play a game.' },
          { type: 'coach', text: 'R か L か当ててみて: "rice"... "lice"... "right"... "light"... (Tell me — R or L?)' },
          { type: 'coach', text: '完璧じゃなくて大丈夫 (Don\'t worry about being perfect) — the more you hear them, the more your ear will catch the difference.' },
          { type: 'coach', text: '"really long road" をゆっくり言ってみて。舌の動きの違い、感じる？(Say it slowly. Feel the difference?)' },
        ],
      },
    ],
  },
  {
    title: 'Grammar Correction',
    insightTitle: null,
    insightText: null,
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
    title: 'Cultural Adaptation',
    insightTitle: 'Same learner. Different culture. Different coaching.',
    insightText: 'Existing tools like Hofstede\'s Culture Compass and Erin Meyer\'s Culture Map tell you about cultural differences. LoLA adapts to them in real time — adjusting feedback directness, praise style, and emotional scaffolding based on 36 cultural norms across 6 languages, informed by research in cross-cultural communication (Hofstede, Trompenaars, Meyer).',
    learnerSays: '"I am very sorry... I don\'t speak English good. Please excuse my bad English."',
    profiles: [
      {
        label: 'Japanese Learner',
        sublabel: 'Face-saving, indirect feedback',
        badge: 'Cultural',
        color: '#e879a0',
        responses: [
          { type: 'coach', text: 'Your English is coming along really well — you expressed that perfectly clearly.' },
          { type: 'coach', text: 'A small refinement: "well" instead of "good" here — "I don\'t speak English well." You were very close.' },
          { type: 'rule', text: 'Hofstede: High power distance + collectivism. Meyer: Indirect negative feedback. LoLA responds with gentle, indirect correction and group normalization. Praise targets effort, not the person (謙遜 kenson — modesty norm).' },
          { type: 'coach', text: 'Many learners at your stage make this same adjustment. It\'s a sign you\'re progressing.' },
        ],
      },
      {
        label: 'Spanish Learner',
        sublabel: 'Warm, direct encouragement',
        badge: 'Cultural',
        color: '#f4a261',
        responses: [
          { type: 'coach', text: 'Hey, no need to apologize! You\'re communicating, and that\'s what matters.' },
          { type: 'coach', text: 'Quick fix though: "I don\'t speak English WELL" — "good" is for things, "well" is for actions. Easy swap!' },
          { type: 'coach', text: 'Think of it this way: "good food" but "speak well." Same idea as bueno vs. bien!' },
          { type: 'rule', text: 'Hofstede: Low uncertainty avoidance + high indulgence. Meyer: Direct negative feedback. LoLA responds with energy, humor, and a native-language bridge (bueno/bien) that builds confidence through familiarity.' },
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

        .demo-nav-pills {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 999px;
          padding: 3px;
          display: inline-flex;
          margin-left: auto;
          margin-right: auto;
        }
        .demo-nav-pills-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .demo-pill {
          padding: 6px 16px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: var(--lola-text-muted, #555575);
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease-out;
          white-space: nowrap;
        }
        .demo-pill:hover {
          color: var(--lola-text-secondary, #9595b0);
        }
        .demo-pill.active {
          background: var(--lola-indigo, #4361ee);
          color: white;
        }
      </style>

      <div class="demo-root">
        <div class="demo-header">
          <button class="demo-back" id="demo-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <span class="demo-title">${t('sameErrorTitle')}</span>
        </div>

        <div class="demo-nav-pills-wrap">
          <div class="demo-nav-pills" id="demo-pills">
            ${DEMO_SCENARIOS.map((s, i) => `<button class="demo-pill${i === this._scenarioIndex ? ' active' : ''}" data-i="${i}">${s.title}</button>`).join('')}
          </div>
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
          <div class="demo-insight-title">${scenario.insightTitle || t('sameError')}</div>
          <div class="demo-insight-text">${scenario.insightText || t('demoInsight')}</div>
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

    this.querySelectorAll('.demo-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this._scenarioIndex = parseInt(pill.dataset.i);
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
