/**
 * Session Summary — post-session screen with stats and feedback.
 */
import { t } from '../lib/i18n.js'

class ViewSessionSummary extends HTMLElement {
  constructor() {
    super()
    this._data = null
  }

  set sessionData(value) {
    this._data = value
    if (this.isConnected) this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const d = this._data || {}
    const duration = d.duration || 0
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    const messageCount = d.transcriptCount || 0
    const profileLabel = d.profileLabel || 'LoLA'

    this.innerHTML = `
      <style>
        .summary-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lola-bg, #0a0a1a);
          padding: 24px;
          z-index: 100;
        }
        .summary-card {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
        }
        .summary-check {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee, #4cc9f0));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
          margin: 0;
        }
        .summary-subtitle {
          font-size: 0.9rem;
          color: var(--lola-text-secondary, #9595b0);
          margin: -12px 0 0 0;
        }
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }
        .summary-stat {
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          backdrop-filter: blur(12px);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-lg, 16px);
          padding: 12px;
        }
        .summary-stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--lola-text, #f0f0f8);
          font-family: var(--font-mono, 'Space Mono', monospace);
        }
        .summary-stat-label {
          font-size: 0.7rem;
          color: var(--lola-text-muted, #555575);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        /* Feedback */
        .feedback-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .feedback-prompt {
          font-size: 0.85rem;
          color: var(--lola-text-secondary, #9595b0);
        }
        .feedback-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .feedback-btn {
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          backdrop-filter: blur(12px);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-md, 12px);
          padding: 10px;
          color: var(--lola-text, #f0f0f8);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .feedback-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .feedback-btn.selected {
          border-color: var(--lola-indigo, #4361ee);
          background: rgba(67, 97, 238, 0.15);
        }
        .feedback-textarea {
          width: 100%;
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius-md, 12px);
          padding: 12px 16px;
          color: var(--lola-text, #f0f0f8);
          font-family: var(--font-body);
          font-size: 0.85rem;
          resize: none;
          outline: none;
        }
        .feedback-textarea::placeholder {
          color: var(--lola-text-muted, #555575);
        }
        .feedback-textarea:focus {
          border-color: var(--lola-indigo, #4361ee);
        }
        .feedback-submit {
          width: 100%;
          padding: 12px;
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee, #4cc9f0));
          color: white;
          border: none;
          border-radius: var(--radius-sm, 8px);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .feedback-submit:hover { filter: brightness(1.1); }
        .feedback-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .feedback-thanks {
          font-size: 0.85rem;
          color: var(--lola-text-secondary, #9595b0);
        }

        /* Nav */
        .summary-nav {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 8px;
        }
        .nav-btn {
          width: 100%;
          padding: 14px;
          border-radius: var(--radius-sm, 8px);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          border: none;
        }
        .nav-primary {
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee, #4cc9f0));
          color: white;
        }
        .nav-primary:hover { filter: brightness(1.1); }
        .nav-secondary {
          background: var(--lola-glass, rgba(18, 18, 42, 0.65));
          color: var(--lola-text, #f0f0f8);
          border: 1px solid var(--lola-glass-border, rgba(255, 255, 255, 0.08));
        }
        .nav-secondary:hover { background: rgba(255, 255, 255, 0.08); }
      </style>

      <div class="summary-root">
        <div class="summary-card">
          <div class="summary-check">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h2 class="summary-title">Session Complete</h2>
          <p class="summary-subtitle">with ${profileLabel}</p>

          <div class="summary-stats">
            <div class="summary-stat">
              <div class="summary-stat-value">${minutes}:${String(seconds).padStart(2, '0')}</div>
              <div class="summary-stat-label">${t('duration')}</div>
            </div>
            <div class="summary-stat">
              <div class="summary-stat-value">${messageCount}</div>
              <div class="summary-stat-label">${t('messages')}</div>
            </div>
            <div class="summary-stat">
              <div class="summary-stat-value">${d.frustrationCount || 0}</div>
              <div class="summary-stat-label">${t('assists')}</div>
            </div>
          </div>

          <div class="feedback-section" id="feedback-section">
            <p class="feedback-prompt">${t('howWasSession')}</p>
            <div class="feedback-options" id="feedback-options">
              <button class="feedback-btn" data-rating="1">${t('notGreat')}</button>
              <button class="feedback-btn" data-rating="3">${t('okay')}</button>
              <button class="feedback-btn" data-rating="5">${t('lovedIt')}</button>
            </div>
            <div id="feedback-extra" style="display:none; width:100%; display:flex; flex-direction:column; gap:10px;"></div>
          </div>

          <div class="summary-nav">
            <button class="nav-btn nav-primary" id="nav-again">${t('talkAgain')}</button>
            <button class="nav-btn nav-secondary" id="nav-home">${t('backToHome')}</button>
          </div>
        </div>
      </div>
    `

    this._selectedRating = null
    this._feedbackSent = false

    // Feedback rating
    const extraEl = this.querySelector('#feedback-extra')
    extraEl.style.display = 'none'

    this.querySelectorAll('.feedback-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._selectedRating = parseInt(btn.dataset.rating)
        this.querySelectorAll('.feedback-btn').forEach(b => b.classList.remove('selected'))
        btn.classList.add('selected')

        if (!this._feedbackSent) {
          extraEl.style.display = 'flex'
          extraEl.innerHTML = `
            <textarea class="feedback-textarea" id="feedback-text" rows="3" placeholder="${t('tellUsMore')}"></textarea>
            <button class="feedback-submit" id="feedback-submit">${t('sendFeedback')}</button>
          `
          this.querySelector('#feedback-submit').addEventListener('click', () => this._submitFeedback())
        }
      })
    })

    // Navigation
    this.querySelector('#nav-again').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }))
    })

    this.querySelector('#nav-home').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'landing' }
      }))
    })
  }

  async _submitFeedback() {
    if (this._feedbackSent || !this._selectedRating) return
    const text = this.querySelector('#feedback-text')?.value?.trim() || ''
    const submitBtn = this.querySelector('#feedback-submit')
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...' }

    try {
      await fetch('/api/sessions/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this._data?.session_id,
          rating: this._selectedRating,
          text: text || undefined,
        }),
      })
    } catch {
      // Non-critical
    }

    this._feedbackSent = true
    const section = this.querySelector('#feedback-section')
    if (section) {
      section.innerHTML = `<p class="feedback-thanks">${t('thanks')}</p>`
    }
  }
}

customElements.define('view-session-summary', ViewSessionSummary)
