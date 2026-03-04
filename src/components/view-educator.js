/**
 * Educator Creator Platform — static mock for hackathon demo.
 * Shows the vision beyond MVP: educators build, own, and monetize AI coaching avatars.
 */

class ViewEducator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          overflow-y: auto;
        }

        .edu-container {
          max-width: 720px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xl);
        }

        .edu-hero {
          text-align: center;
          padding: var(--spacing-xxl) 0 var(--spacing-lg);
        }

        .edu-hero h1 {
          font-size: clamp(1.6rem, 5vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: var(--lola-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--spacing-sm);
        }

        .edu-hero p {
          font-size: 1.05rem;
          color: var(--lola-text-secondary);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .edu-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-md);
          width: 100%;
        }

        @media (min-width: 540px) {
          .edu-cards {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .edu-card {
          background: var(--lola-glass);
          backdrop-filter: blur(var(--lola-glass-blur));
          -webkit-backdrop-filter: blur(var(--lola-glass-blur));
          border: 1px solid var(--lola-glass-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .edu-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          border-color: var(--lola-indigo);
        }

        .edu-card-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .edu-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--lola-text);
          margin: 0;
        }

        .edu-card p {
          font-size: 0.85rem;
          color: var(--lola-text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .edu-stats {
          display: flex;
          justify-content: center;
          gap: var(--spacing-xl);
          padding: var(--spacing-lg) var(--spacing-xl);
          background: var(--lola-glass);
          backdrop-filter: blur(var(--lola-glass-blur));
          -webkit-backdrop-filter: blur(var(--lola-glass-blur));
          border: 1px solid var(--lola-glass-border);
          border-radius: var(--radius-lg);
          width: 100%;
        }

        .edu-stat {
          text-align: center;
        }

        .edu-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--lola-text);
          font-family: var(--font-mono);
        }

        .edu-stat-label {
          font-size: 0.75rem;
          color: var(--lola-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        .edu-badge {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(67, 97, 238, 0.15), rgba(76, 201, 240, 0.15));
          border: 1px solid rgba(67, 97, 238, 0.3);
          color: var(--lola-sky);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .edu-back {
          background: transparent;
          border: 1px solid var(--lola-surface-3);
          color: var(--lola-text-secondary);
          padding: 10px 24px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edu-back:hover {
          border-color: var(--lola-indigo);
          color: var(--lola-text);
        }
      </style>

      <div class="edu-container">
        <div class="edu-hero">
          <h1>Educator Creator Platform</h1>
          <p>Build, own, and monetize your own AI coaching avatar. The 12-principle framework auto-adapts to every learner.</p>
        </div>

        <div class="edu-cards">
          <div class="edu-card">
            <div class="edu-card-icon">&#x1F3A8;</div>
            <h3>Build Your Avatar</h3>
            <p>Create an AI coaching persona with your voice, teaching style, and domain expertise.</p>
          </div>
          <div class="edu-card">
            <div class="edu-card-icon">&#x1F9E0;</div>
            <h3>12-Principle Auto-Apply</h3>
            <p>The neurolinguistic coaching framework adapts automatically to each learner's psychology.</p>
          </div>
          <div class="edu-card">
            <div class="edu-card-icon">&#x1F4B0;</div>
            <h3>Monetize 24/7</h3>
            <p>Your avatar coaches learners around the clock. Earn revenue from every session while you sleep.</p>
          </div>
        </div>

        <div class="edu-stats">
          <div class="edu-stat">
            <div class="edu-stat-value">0</div>
            <div class="edu-stat-label">Avatars</div>
          </div>
          <div class="edu-stat">
            <div class="edu-stat-value">0</div>
            <div class="edu-stat-label">Learners</div>
          </div>
          <div class="edu-stat">
            <div class="edu-stat-value">$0</div>
            <div class="edu-stat-label">Revenue</div>
          </div>
        </div>

        <div class="edu-badge">Launching Q2 2026</div>

        <button class="edu-back" id="edu-back-btn">Back to LoLA</button>
      </div>
    `;

    this.querySelector('#edu-back-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }));
    });
  }
}

customElements.define('view-educator', ViewEducator);
