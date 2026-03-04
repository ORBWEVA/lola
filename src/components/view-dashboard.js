/**
 * User Dashboard (Screen 03) — post-session home base.
 * Credits, profile, session history, coaching reports.
 */

class ViewDashboard extends HTMLElement {
  connectedCallback() {
    const profile = this.profileData || {};
    const session = this.sessionData || {};
    const name = profile.label || 'Learner';
    const key = profile.key || 'profile-a';
    const avatarSrc = `/avatars/${key}/neutral.png`;

    // Initial values — will be updated by fetch
    this._credits = session.credits_remaining ?? 15;
    this._sessions = [];
    this._deviceId = localStorage.getItem('lola_device_id');

    this.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          overflow-y: auto;
        }

        .dash-container {
          max-width: 720px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-md);
          padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        /* ─── Header ─── */
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
        }

        .dash-greeting h1 {
          font-size: clamp(1.3rem, 4vw, 1.8rem);
          font-weight: 800;
          color: var(--lola-text);
          margin: 0;
        }

        .dash-greeting p {
          font-size: 0.85rem;
          color: var(--lola-text-muted);
          margin: 4px 0 0;
        }

        .dash-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--lola-glass-border);
          background: var(--lola-surface-3);
        }

        /* ─── Credits Bar ─── */
        .dash-credits {
          background: var(--lola-glass);
          backdrop-filter: blur(var(--lola-glass-blur));
          -webkit-backdrop-filter: blur(var(--lola-glass-blur));
          border: 1px solid var(--lola-glass-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dash-credits-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dash-credits-label {
          font-size: 0.8rem;
          color: var(--lola-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .dash-credits-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .dash-credits-value {
          font-size: 2rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--lola-text);
        }

        .dash-credits-unit {
          font-size: 0.85rem;
          color: var(--lola-text-secondary);
        }

        .dash-topup {
          padding: 8px 20px;
          border-radius: var(--radius-full);
          border: none;
          background: linear-gradient(135deg, var(--lola-indigo), var(--lola-sky));
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dash-topup:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(67, 97, 238, 0.3);
        }

        /* ─── Section Title ─── */
        .dash-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--lola-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: var(--spacing-sm) 0 0;
        }

        /* ─── Cards ─── */
        .dash-cards {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .dash-card {
          background: var(--lola-glass);
          backdrop-filter: blur(var(--lola-glass-blur));
          -webkit-backdrop-filter: blur(var(--lola-glass-blur));
          border: 1px solid var(--lola-glass-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .dash-card:hover {
          transform: translateY(-2px);
          border-color: var(--lola-indigo);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .dash-card.dimmed {
          opacity: 0.5;
          cursor: default;
        }

        .dash-card.dimmed:hover {
          transform: none;
          border-color: var(--lola-glass-border);
          box-shadow: none;
        }

        .dash-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .dash-card-body {
          flex: 1;
          min-width: 0;
        }

        .dash-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--lola-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dash-card-sub {
          font-size: 0.8rem;
          color: var(--lola-text-muted);
          margin-top: 2px;
        }

        .dash-card-arrow {
          color: var(--lola-text-muted);
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .dash-badge-soon {
          display: inline-block;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(67, 97, 238, 0.15);
          border: 1px solid rgba(67, 97, 238, 0.25);
          color: var(--lola-sky);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ─── Bottom Actions ─── */
        .dash-actions {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          padding-bottom: calc(var(--spacing-md) + env(safe-area-inset-bottom, 0px));
          background: linear-gradient(to top, var(--lola-bg) 60%, transparent);
          justify-content: center;
          z-index: 10;
        }

        .dash-btn-primary {
          flex: 1;
          max-width: 320px;
          padding: 14px 24px;
          border-radius: var(--radius-full);
          border: none;
          background: var(--lola-gradient);
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dash-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(67, 97, 238, 0.35);
        }

        .dash-btn-secondary {
          padding: 14px 24px;
          border-radius: var(--radius-full);
          border: 1px solid var(--lola-surface-3);
          background: transparent;
          color: var(--lola-text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dash-btn-secondary:hover {
          border-color: var(--lola-indigo);
          color: var(--lola-text);
        }

        /* ─── Toast ─── */
        .dash-toast {
          position: fixed;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: var(--lola-surface-3);
          color: var(--lola-text);
          padding: 10px 20px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 500;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 20;
        }

        .dash-toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* ─── Overlay ─── */
        .dash-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: dash-fade-in 0.2s ease;
        }

        @keyframes dash-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .dash-overlay-content {
          background: var(--lola-surface-2, #13132b);
          border: 1px solid var(--lola-glass-border);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 560px;
          max-height: 80vh;
          overflow-y: auto;
          padding: var(--spacing-lg);
        }

        .dash-overlay-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .dash-overlay-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--lola-text);
        }

        .dash-overlay-close {
          background: transparent;
          border: none;
          color: var(--lola-text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
        }

        .dash-overlay-close:hover {
          color: var(--lola-text);
        }

        /* Session list in overlay */
        .dash-session-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: background 0.15s;
          padding-left: 8px;
          padding-right: 8px;
          border-radius: var(--radius-sm, 8px);
        }

        .dash-session-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .dash-session-item:last-child {
          border-bottom: none;
        }

        .dash-session-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--lola-text);
        }

        .dash-session-meta {
          font-size: 0.75rem;
          color: var(--lola-text-muted);
          margin-top: 2px;
        }

        .dash-session-arrow {
          color: var(--lola-text-muted);
          font-size: 1rem;
        }

        /* Transcript entries */
        .dash-transcript-entry {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .dash-transcript-role {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .dash-transcript-role.user { color: var(--lola-sky, #4cc9f0); }
        .dash-transcript-role.model { color: var(--lola-rose, #ff4d6d); }

        .dash-transcript-text {
          font-size: 0.85rem;
          color: var(--lola-text);
          line-height: 1.5;
        }

        .dash-empty {
          text-align: center;
          color: var(--lola-text-muted);
          padding: 40px 20px;
          font-size: 0.9rem;
        }

        .dash-back-btn {
          background: transparent;
          border: 1px solid var(--lola-surface-3);
          color: var(--lola-text-secondary);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dash-back-btn:hover {
          border-color: var(--lola-indigo);
          color: var(--lola-text);
        }
      </style>

      <div class="dash-container">
        <!-- Header -->
        <div class="dash-header">
          <div class="dash-greeting">
            <h1>Welcome back</h1>
            <p id="dash-stats-text">Loading...</p>
          </div>
          <img class="dash-avatar" src="${avatarSrc}" alt="Profile" onerror="this.style.display='none'" />
        </div>

        <!-- Credits -->
        <div class="dash-credits">
          <div class="dash-credits-left">
            <div class="dash-credits-label">Credits remaining</div>
            <div class="dash-credits-row">
              <span class="dash-credits-value" id="dash-credits-num">${this._credits}</span>
              <span class="dash-credits-unit">minutes</span>
            </div>
          </div>
          <button class="dash-topup" id="dash-topup">Top Up</button>
        </div>

        <!-- Your Space -->
        <div class="dash-section-title">Your Space</div>
        <div class="dash-cards">
          <div class="dash-card" id="card-profile">
            <div class="dash-card-icon" style="background: rgba(67, 97, 238, 0.15);">&#x1F464;</div>
            <div class="dash-card-body">
              <div class="dash-card-title">Profile Settings</div>
              <div class="dash-card-sub">${name}</div>
            </div>
            <div class="dash-card-arrow">&rsaquo;</div>
          </div>

          <div class="dash-card" id="card-transcripts">
            <div class="dash-card-icon" style="background: rgba(76, 201, 240, 0.15);">&#x1F4DD;</div>
            <div class="dash-card-body">
              <div class="dash-card-title">Transcripts</div>
              <div class="dash-card-sub" id="transcripts-sub">Review your conversations</div>
            </div>
            <div class="dash-card-arrow">&rsaquo;</div>
          </div>

          <div class="dash-card" id="card-recordings">
            <div class="dash-card-icon" style="background: rgba(255, 77, 109, 0.15);">&#x1F399;</div>
            <div class="dash-card-body">
              <div class="dash-card-title">Session Recordings <span class="dash-badge-soon">Soon</span></div>
              <div class="dash-card-sub">Audio playback</div>
            </div>
            <div class="dash-card-arrow">&rsaquo;</div>
          </div>

          <div class="dash-card" id="card-reports">
            <div class="dash-card-icon" style="background: rgba(6, 214, 160, 0.15);">&#x1F4CA;</div>
            <div class="dash-card-body">
              <div class="dash-card-title">Coaching Reports <span class="dash-badge-soon">Soon</span></div>
              <div class="dash-card-sub">Progress & insights</div>
            </div>
            <div class="dash-card-arrow">&rsaquo;</div>
          </div>
        </div>

        <!-- Coming Soon -->
        <div class="dash-section-title">Coming Soon</div>
        <div class="dash-cards">
          <div class="dash-card dimmed">
            <div class="dash-card-icon" style="background: rgba(255, 255, 255, 0.05);">&#x1F4DA;</div>
            <div class="dash-card-body">
              <div class="dash-card-title">
                Learning Documents
                <span class="dash-badge-soon">Soon</span>
              </div>
              <div class="dash-card-sub">Upload materials for contextual coaching</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="dash-actions">
        <button class="dash-btn-secondary" id="dash-back">Back</button>
        <button class="dash-btn-primary" id="dash-new-session">Start New Session</button>
      </div>

      <!-- Toast -->
      <div class="dash-toast" id="dash-toast"></div>
    `;

    // --- Helpers ---
    const toast = (msg) => {
      const el = this.querySelector('#dash-toast');
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 2000);
    };

    const comingSoon = () => toast('Coming soon');

    // --- Event Listeners ---
    this.querySelector('#dash-topup').addEventListener('click', comingSoon);
    this.querySelector('#card-recordings').addEventListener('click', comingSoon);
    this.querySelector('#card-reports').addEventListener('click', comingSoon);

    this.querySelector('#card-transcripts').addEventListener('click', () => {
      this._showTranscriptsOverlay();
    });

    this.querySelector('#card-profile').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }));
    });

    this.querySelector('#dash-new-session').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }));
    });

    this.querySelector('#dash-back').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }));
    });

    // --- Fetch real data ---
    this._fetchSessionHistory();
  }

  async _fetchSessionHistory() {
    if (!this._deviceId) {
      this._updateStats(0, 0);
      return;
    }

    try {
      // Fetch device info for credits
      const deviceRes = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: this._deviceId }),
      });
      const deviceData = await deviceRes.json();
      this._credits = deviceData.credits;
      const creditsEl = this.querySelector('#dash-credits-num');
      if (creditsEl) creditsEl.textContent = this._credits;

      // Fetch sessions
      const sessionsRes = await fetch(`/api/sessions/${this._deviceId}`);
      const sessionsData = await sessionsRes.json();
      this._sessions = sessionsData.sessions || [];

      const count = this._sessions.length;
      const totalMin = Math.round(
        this._sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
      );
      this._updateStats(count, totalMin);

      const subEl = this.querySelector('#transcripts-sub');
      if (subEl) subEl.textContent = count > 0 ? `${count} session${count !== 1 ? 's' : ''}` : 'No sessions yet';
    } catch (e) {
      console.warn('Failed to fetch session history:', e);
      this._updateStats(0, 0);
    }
  }

  _updateStats(count, totalMin) {
    const el = this.querySelector('#dash-stats-text');
    if (!el) return;
    if (count === 0) {
      el.textContent = 'No sessions yet';
    } else {
      el.textContent = `${count} session${count !== 1 ? 's' : ''} \u00B7 ${totalMin} min total`;
    }
  }

  _showTranscriptsOverlay() {
    // Remove existing overlay
    const existing = this.querySelector('.dash-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'dash-overlay';

    if (!this._sessions.length) {
      overlay.innerHTML = `
        <div class="dash-overlay-content">
          <div class="dash-overlay-header">
            <span class="dash-overlay-title">Transcripts</span>
            <button class="dash-overlay-close">&times;</button>
          </div>
          <div class="dash-empty">No sessions yet. Start a session to see your transcripts here.</div>
        </div>
      `;
      this.appendChild(overlay);
      overlay.querySelector('.dash-overlay-close').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
      return;
    }

    let html = `
      <div class="dash-overlay-content">
        <div class="dash-overlay-header">
          <span class="dash-overlay-title">Transcripts</span>
          <button class="dash-overlay-close">&times;</button>
        </div>
    `;

    for (const s of this._sessions) {
      const date = new Date(s.started_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const dur = s.duration_seconds ? `${Math.round(s.duration_seconds / 60)} min` : '< 1 min';
      html += `
        <div class="dash-session-item" data-session-id="${s.id}">
          <div>
            <div class="dash-session-label">${s.profile_label || 'Session'}</div>
            <div class="dash-session-meta">${date} &middot; ${dur}</div>
          </div>
          <div class="dash-session-arrow">&rsaquo;</div>
        </div>
      `;
    }

    html += '</div>';
    overlay.innerHTML = html;
    this.appendChild(overlay);

    overlay.querySelector('.dash-overlay-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelectorAll('.dash-session-item').forEach(item => {
      item.addEventListener('click', () => {
        this._showTranscriptDetail(item.dataset.sessionId, overlay);
      });
    });
  }

  async _showTranscriptDetail(sessionId, parentOverlay) {
    const content = parentOverlay.querySelector('.dash-overlay-content');
    content.innerHTML = `
      <div class="dash-overlay-header">
        <button class="dash-back-btn" id="transcript-back">&larr; Back</button>
        <button class="dash-overlay-close">&times;</button>
      </div>
      <div class="dash-empty">Loading transcript...</div>
    `;

    parentOverlay.querySelector('.dash-overlay-close').addEventListener('click', () => parentOverlay.remove());
    parentOverlay.querySelector('#transcript-back').addEventListener('click', () => {
      parentOverlay.remove();
      this._showTranscriptsOverlay();
    });

    try {
      const res = await fetch(`/api/transcripts/${sessionId}`);
      const data = await res.json();
      const entries = data.entries || [];

      if (!entries.length) {
        content.querySelector('.dash-empty').textContent = 'No transcript recorded for this session.';
        return;
      }

      let html = `
        <div class="dash-overlay-header">
          <button class="dash-back-btn" id="transcript-back-2">&larr; Back</button>
          <button class="dash-overlay-close">&times;</button>
        </div>
      `;

      for (const entry of entries) {
        const roleLabel = entry.role === 'user' ? 'You' : 'LoLA';
        html += `
          <div class="dash-transcript-entry">
            <div class="dash-transcript-role ${entry.role}">${roleLabel}</div>
            <div class="dash-transcript-text">${this._escapeHtml(entry.content)}</div>
          </div>
        `;
      }

      content.innerHTML = html;
      content.querySelector('.dash-overlay-close').addEventListener('click', () => parentOverlay.remove());
      content.querySelector('#transcript-back-2').addEventListener('click', () => {
        parentOverlay.remove();
        this._showTranscriptsOverlay();
      });
    } catch (e) {
      content.querySelector('.dash-empty').textContent = 'Failed to load transcript.';
    }
  }

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define('view-dashboard', ViewDashboard);
