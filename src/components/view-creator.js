/**
 * Creator Wizard — 5-step avatar creation flow.
 * Proves LoLA is a platform, not a single-purpose app.
 */

const DOMAIN_ICONS = {
  language_coaching: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  fitness: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  sales: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  mentoring: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  support: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  custom: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
}

const DOMAINS = [
  { id: 'language_coaching', label: 'Language Coach', desc: 'Teach any language with adaptive coaching' },
  { id: 'fitness', label: 'Fitness & Wellness', desc: 'Motivate workouts and healthy habits' },
  { id: 'sales', label: 'Sales & Advisory', desc: 'Guide customers to the right product' },
  { id: 'mentoring', label: 'Business Mentor', desc: 'Strategic advice and accountability' },
  { id: 'support', label: 'Customer Support', desc: 'Empathetic, efficient problem solving' },
  { id: 'custom', label: 'Custom', desc: 'Build something entirely your own' },
]

const DOMAIN_PERSONALITIES = {
  language_coaching: ['warm and patient', 'energetic and playful', 'precise and methodical', 'casual and friendly', 'encouraging', 'humorous', 'culturally aware', 'adaptive'],
  fitness: ['high-energy motivator', 'calm and mindful', 'tough love coach', 'science-focused', 'empathetic listener', 'disciplined', 'holistic wellness', 'competitive'],
  sales: ['consultative advisor', 'enthusiastic recommender', 'no-pressure guide', 'expert curator', 'persuasive', 'analytical', 'relationship-builder', 'solution-oriented'],
  mentoring: ['Socratic questioner', 'straight-talking advisor', 'empathetic strategist', 'data-driven analyst', 'visionary thinker', 'accountability partner', 'calm under pressure', 'inspirational'],
  support: ['warm and empathetic', 'quick and efficient', 'thorough explainer', 'proactive problem-solver', 'patient', 'reassuring', 'detail-oriented', 'solution-focused'],
  custom: ['friendly', 'professional', 'witty', 'knowledgeable', 'empathetic', 'creative', 'direct', 'thoughtful'],
}

const GEMINI_VOICES = [
  { id: 'Kore', label: 'Kore', desc: 'Warm, female', sample: 'Warm and approachable' },
  { id: 'Puck', label: 'Puck', desc: 'Friendly, male', sample: 'Friendly and conversational' },
  { id: 'Charon', label: 'Charon', desc: 'Deep, authoritative', sample: 'Deep and commanding' },
  { id: 'Fenrir', label: 'Fenrir', desc: 'Energetic, dynamic', sample: 'Energetic and lively' },
  { id: 'Aoede', label: 'Aoede', desc: 'Calm, melodic', sample: 'Calm and soothing' },
  { id: 'Leda', label: 'Leda', desc: 'Clear, professional', sample: 'Clear and precise' },
]

const TALKINGHEAD_MODELS = [
  { id: 'default', label: 'Default', desc: 'Standard avatar' },
  { id: 'casual', label: 'Casual', desc: 'Relaxed look' },
  { id: 'professional', label: 'Professional', desc: 'Business attire' },
  { id: 'creative', label: 'Creative', desc: 'Artistic style' },
]

class ViewCreator extends HTMLElement {
  connectedCallback() {
    this._step = 1
    this._data = {
      name: '',
      domain: null,
      personalities: [],
      tagline: '',
      appearance: 'default',
      voice: 'Kore',
    }
    this.render()
  }

  render() {
    this.innerHTML = `
      <style>
        .creator-root {
          min-height: 100vh;
          background: var(--lola-bg, #0a0a1a);
          padding: 24px;
          padding-top: calc(24px + env(safe-area-inset-top));
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .creator-header {
          width: 100%;
          max-width: 520px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .creator-back {
          background: none;
          border: none;
          color: var(--lola-text-secondary, #9595b0);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
        }
        .creator-back:hover { background: rgba(255,255,255,0.08); }
        .creator-step-label {
          font-size: 0.8rem;
          color: var(--lola-text-muted, #555575);
          font-weight: 600;
        }

        .creator-progress {
          width: 100%;
          max-width: 520px;
          display: flex;
          gap: 6px;
          margin-bottom: 32px;
        }
        .creator-progress-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .creator-progress-bar.filled {
          background: var(--lola-indigo, #4361ee);
        }
        .creator-progress-bar.active {
          background: linear-gradient(90deg, var(--lola-indigo, #4361ee) 50%, rgba(255,255,255,0.08) 50%);
        }

        .creator-content {
          width: 100%;
          max-width: 520px;
          animation: creator-fadeIn 0.3s ease-out;
        }
        @keyframes creator-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .creator-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
          margin-bottom: 8px;
        }
        .creator-desc {
          font-size: 0.9rem;
          color: var(--lola-text-secondary, #9595b0);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        /* Input */
        .creator-input {
          width: 100%;
          padding: 14px 18px;
          background: var(--lola-surface, #12122a);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-md, 12px);
          color: var(--lola-text, #f0f0f8);
          font-family: var(--font-body);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .creator-input:focus { border-color: var(--lola-indigo, #4361ee); }
        .creator-input::placeholder { color: var(--lola-text-muted, #555575); }

        /* Domain grid */
        .domain-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }
        @media (max-width: 400px) { .domain-grid { grid-template-columns: 1fr; } }
        .domain-card {
          background: var(--lola-surface, #12122a);
          border: 2px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-lg, 16px);
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .domain-card:hover {
          border-color: var(--lola-indigo, #4361ee);
          transform: translateY(-2px);
        }
        .domain-card.selected {
          border-color: var(--lola-indigo, #4361ee);
          background: rgba(67, 97, 238, 0.1);
        }
        .domain-icon { margin-bottom: 8px; color: var(--lola-text-secondary, #9595b0); }
        .domain-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
        }
        .domain-desc {
          font-size: 0.75rem;
          color: var(--lola-text-muted, #555575);
          margin-top: 4px;
        }

        /* Personality chips */
        .chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }
        .chip {
          padding: 8px 16px;
          border-radius: var(--radius-full, 99px);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          background: var(--lola-surface, #12122a);
          color: var(--lola-text-secondary, #9595b0);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover { border-color: var(--lola-indigo, #4361ee); color: var(--lola-text, #f0f0f8); }
        .chip.selected {
          background: rgba(67, 97, 238, 0.15);
          border-color: var(--lola-indigo, #4361ee);
          color: var(--lola-text, #f0f0f8);
        }
        .chip-count {
          font-size: 0.75rem;
          color: var(--lola-text-muted, #555575);
          margin-top: 8px;
        }

        /* Tagline */
        .tagline-preview {
          margin-top: 16px;
          padding: 14px 18px;
          background: var(--lola-surface, #12122a);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-md, 12px);
          font-size: 0.9rem;
          color: var(--lola-text, #f0f0f8);
          font-style: italic;
          line-height: 1.5;
        }

        /* Voice / Appearance grid */
        .option-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 16px;
        }
        @media (min-width: 480px) { .option-grid.voices { grid-template-columns: repeat(3, 1fr); } }
        .option-card {
          background: var(--lola-surface, #12122a);
          border: 2px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-md, 12px);
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .option-card:hover { border-color: var(--lola-indigo, #4361ee); }
        .option-card.selected {
          border-color: var(--lola-indigo, #4361ee);
          background: rgba(67, 97, 238, 0.1);
        }
        .option-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
        }
        .option-desc {
          font-size: 0.7rem;
          color: var(--lola-text-muted, #555575);
          margin-top: 4px;
        }

        /* Review */
        .review-card {
          background: var(--lola-surface, #12122a);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-lg, 16px);
          padding: 24px;
          margin-top: 16px;
        }
        .review-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .review-row:last-child { border-bottom: none; }
        .review-label {
          font-size: 0.8rem;
          color: var(--lola-text-muted, #555575);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .review-value {
          font-size: 0.9rem;
          color: var(--lola-text, #f0f0f8);
          font-weight: 600;
          text-align: right;
        }

        /* Buttons */
        .creator-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          width: 100%;
        }
        .creator-btn {
          flex: 1;
          padding: 14px;
          border-radius: var(--radius-sm, 8px);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-align: center;
        }
        .creator-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .creator-btn-next {
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee, #4cc9f0));
          color: white;
        }
        .creator-btn-next:hover:not(:disabled) { filter: brightness(1.1); }
        .creator-btn-prev {
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          color: var(--lola-text, #f0f0f8);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
        }
        .creator-btn-prev:hover { background: rgba(255,255,255,0.08); }
      </style>

      <div class="creator-root">
        <div class="creator-header">
          <button class="creator-back" id="creator-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <span class="creator-step-label">Step ${this._step} of 5</span>
        </div>

        <div class="creator-progress">
          ${[1,2,3,4,5].map(i => `<div class="creator-progress-bar${i < this._step ? ' filled' : i === this._step ? ' active' : ''}"></div>`).join('')}
        </div>

        <div class="creator-content" id="creator-content"></div>
      </div>
    `

    this._renderStep()

    this.querySelector('#creator-back').addEventListener('click', () => {
      if (this._step > 1) {
        this._step--
        this.render()
      } else {
        this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, detail: { view: 'landing' } }))
      }
    })
  }

  _renderStep() {
    const container = this.querySelector('#creator-content')
    switch (this._step) {
      case 1: return this._renderStep1(container)
      case 2: return this._renderStep2(container)
      case 3: return this._renderStep3(container)
      case 4: return this._renderStep4(container)
      case 5: return this._renderStep5(container)
    }
  }

  _renderStep1(el) {
    el.innerHTML = `
      <h2 class="creator-title">Name your avatar</h2>
      <p class="creator-desc">Choose a name and what domain they'll operate in.</p>
      <input class="creator-input" id="avatar-name" placeholder="e.g. Luna, Coach Mike, Aria..." value="${this._data.name}" maxlength="30" />
      <div class="domain-grid">
        ${DOMAINS.map(d => `
          <div class="domain-card${this._data.domain === d.id ? ' selected' : ''}" data-domain="${d.id}">
            <div class="domain-icon">${DOMAIN_ICONS[d.id]}</div>
            <div class="domain-label">${d.label}</div>
            <div class="domain-desc">${d.desc}</div>
          </div>
        `).join('')}
      </div>
      <div class="creator-actions">
        <button class="creator-btn creator-btn-next" id="step-next" ${!this._data.name || !this._data.domain ? 'disabled' : ''}>Next</button>
      </div>
    `

    const nameInput = el.querySelector('#avatar-name')
    nameInput.addEventListener('input', () => {
      this._data.name = nameInput.value.trim()
      this._updateNextBtn(el)
    })
    nameInput.focus()

    el.querySelectorAll('.domain-card').forEach(card => {
      card.addEventListener('click', () => {
        this._data.domain = card.dataset.domain
        el.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'))
        card.classList.add('selected')
        this._updateNextBtn(el)
      })
    })

    el.querySelector('#step-next').addEventListener('click', () => { this._step = 2; this.render() })
  }

  _updateNextBtn(el) {
    const btn = el.querySelector('#step-next')
    if (!btn) return
    if (this._step === 1) btn.disabled = !this._data.name || !this._data.domain
    else if (this._step === 2) btn.disabled = this._data.personalities.length === 0
  }

  _renderStep2(el) {
    const chips = DOMAIN_PERSONALITIES[this._data.domain] || DOMAIN_PERSONALITIES.custom
    el.innerHTML = `
      <h2 class="creator-title">Define personality</h2>
      <p class="creator-desc">Pick up to 3 traits for ${this._data.name || 'your avatar'}.</p>
      <div class="chip-grid">
        ${chips.map(c => `<button class="chip${this._data.personalities.includes(c) ? ' selected' : ''}" data-chip="${c}">${c}</button>`).join('')}
      </div>
      <div class="chip-count">${this._data.personalities.length}/3 selected</div>
      ${this._data.personalities.length > 0 ? `
        <div class="tagline-preview">"${this._generateTagline()}"</div>
      ` : ''}
      <div class="creator-actions">
        <button class="creator-btn creator-btn-prev" id="step-prev">Back</button>
        <button class="creator-btn creator-btn-next" id="step-next" ${this._data.personalities.length === 0 ? 'disabled' : ''}>Next</button>
      </div>
    `

    el.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.dataset.chip
        if (this._data.personalities.includes(val)) {
          this._data.personalities = this._data.personalities.filter(p => p !== val)
        } else if (this._data.personalities.length < 3) {
          this._data.personalities.push(val)
        }
        this._renderStep2(el)
      })
    })

    el.querySelector('#step-prev').addEventListener('click', () => { this._step = 1; this.render() })
    el.querySelector('#step-next').addEventListener('click', () => {
      this._data.tagline = this._generateTagline()
      this._step = 3
      this.render()
    })
  }

  _generateTagline() {
    const name = this._data.name || 'Your avatar'
    const traits = this._data.personalities.join(', ')
    const domain = DOMAINS.find(d => d.id === this._data.domain)
    return `${name} — your ${traits} ${domain?.label?.toLowerCase() || 'coach'}.`
  }

  _renderStep3(el) {
    el.innerHTML = `
      <h2 class="creator-title">Choose appearance</h2>
      <p class="creator-desc">Select a TalkingHead 3D model for ${this._data.name}.</p>
      <div class="option-grid">
        ${TALKINGHEAD_MODELS.map(m => `
          <div class="option-card${this._data.appearance === m.id ? ' selected' : ''}" data-model="${m.id}">
            <div class="option-label">${m.label}</div>
            <div class="option-desc">${m.desc}</div>
          </div>
        `).join('')}
      </div>
      <div class="creator-actions">
        <button class="creator-btn creator-btn-prev" id="step-prev">Back</button>
        <button class="creator-btn creator-btn-next" id="step-next">Next</button>
      </div>
    `

    el.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        this._data.appearance = card.dataset.model
        el.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'))
        card.classList.add('selected')
      })
    })

    el.querySelector('#step-prev').addEventListener('click', () => { this._step = 2; this.render() })
    el.querySelector('#step-next').addEventListener('click', () => { this._step = 4; this.render() })
  }

  _renderStep4(el) {
    el.innerHTML = `
      <h2 class="creator-title">Pick a voice</h2>
      <p class="creator-desc">Choose a Gemini voice for ${this._data.name}.</p>
      <div class="option-grid voices">
        ${GEMINI_VOICES.map(v => `
          <div class="option-card${this._data.voice === v.id ? ' selected' : ''}" data-voice="${v.id}">
            <div class="option-label">${v.label}</div>
            <div class="option-desc">${v.desc}</div>
          </div>
        `).join('')}
      </div>
      <div class="creator-actions">
        <button class="creator-btn creator-btn-prev" id="step-prev">Back</button>
        <button class="creator-btn creator-btn-next" id="step-next">Next</button>
      </div>
    `

    el.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        this._data.voice = card.dataset.voice
        el.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'))
        card.classList.add('selected')
      })
    })

    el.querySelector('#step-prev').addEventListener('click', () => { this._step = 3; this.render() })
    el.querySelector('#step-next').addEventListener('click', () => { this._step = 5; this.render() })
  }

  _renderStep5(el) {
    const domain = DOMAINS.find(d => d.id === this._data.domain)
    const voice = GEMINI_VOICES.find(v => v.id === this._data.voice)
    const model = TALKINGHEAD_MODELS.find(m => m.id === this._data.appearance)

    el.innerHTML = `
      <h2 class="creator-title">Review & Launch</h2>
      <p class="creator-desc">${this._data.tagline}</p>
      <div class="review-card">
        <div class="review-row">
          <span class="review-label">Name</span>
          <span class="review-value">${this._data.name}</span>
        </div>
        <div class="review-row">
          <span class="review-label">Domain</span>
          <span class="review-value">${domain?.label || 'Custom'}</span>
        </div>
        <div class="review-row">
          <span class="review-label">Personality</span>
          <span class="review-value">${this._data.personalities.join(', ')}</span>
        </div>
        <div class="review-row">
          <span class="review-label">Appearance</span>
          <span class="review-value">${model?.label || 'Default'}</span>
        </div>
        <div class="review-row">
          <span class="review-label">Voice</span>
          <span class="review-value">${voice?.label || 'Kore'} — ${voice?.desc || ''}</span>
        </div>
      </div>
      <div class="creator-actions">
        <button class="creator-btn creator-btn-prev" id="step-prev">Back</button>
        <button class="creator-btn creator-btn-next" id="step-launch">Start Session</button>
      </div>
    `

    el.querySelector('#step-prev').addEventListener('click', () => { this._step = 4; this.render() })
    el.querySelector('#step-launch').addEventListener('click', () => this._launch())
  }

  async _launch() {
    const btn = this.querySelector('#step-launch')
    if (btn) { btn.disabled = true; btn.textContent = 'Creating...' }

    try {
      const res = await fetch('/api/avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this._data),
      })
      const result = await res.json()

      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: {
          view: 'lola',
          avatarConfig: { ...this._data, id: result.id },
        }
      }))
    } catch (e) {
      console.error('Avatar creation failed:', e)
      if (btn) { btn.disabled = false; btn.textContent = 'Start Session' }
    }
  }
}

customElements.define('view-creator', ViewCreator)
