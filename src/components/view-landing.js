import { SubtitleSync } from '../lib/subtitle-sync.js'
import { Waveform } from '../lib/waveform.js'

const HERO_VIDEO = '/hero-combined.mp4'
const HERO_SUBTITLES = '/hero-combined-subtitles.json'

const avatars = [
  { name: 'Emma', segmentName: 'emma-lindgren',
    translations: {
      en: "I'm Emma. Strategy, growth, straight talk — in whatever language you think in. Let's go.",
      ja: 'エマです。戦略、成長、率直な対話 — 考える言語で。始めましょう。',
      ko: '엠마입니다. 전략, 성장, 솔직한 대화 — 생각하는 언어로. 시작해요.',
      es: 'Soy Emma. Estrategia, crecimiento, hablar claro — en el idioma en que piensas. Vamos.',
      de: 'Ich bin Emma. Strategie, Wachstum, Klartext — in der Sprache, in der du denkst. Los.',
      fr: "Je suis Emma. Stratégie, croissance, franchise — dans la langue dans laquelle vous pensez. Allons-y.",
      zh: '我是艾玛。战略、增长、直言不讳——用你思考的语言。开始吧。',
      pt: 'Sou a Emma. Estratégia, crescimento, conversa direta — no idioma em que você pensa. Vamos.',
    },
  },
  { name: 'Sakura', segmentName: 'sakura-sensei',
    translations: {
      en: "I'm Sakura. Whether it's Japanese or any language, I'll meet you where you are. Let's begin.",
      ja: 'さくらです。日本語でも何語でも、あなたに合わせます。始めましょう。',
      ko: '사쿠라입니다. 일본어든 어떤 언어든, 맞춰드릴게요. 시작해요.',
      es: 'Soy Sakura. Ya sea japonés o cualquier idioma, me adapto a ti. Comencemos.',
      de: 'Ich bin Sakura. Ob Japanisch oder jede andere Sprache — ich passe mich an. Fangen wir an.',
      fr: "Je suis Sakura. Que ce soit le japonais ou toute autre langue, je m'adapte. Commençons.",
      zh: '我是樱花。无论是日语还是其他语言，我都会配合你。开始吧。',
      pt: 'Sou a Sakura. Seja japonês ou qualquer idioma, me adapto a você. Vamos começar.',
    },
  },
  { name: 'Marcus', segmentName: 'coach-marcus',
    translations: {
      en: "I'm Marcus. Your goals, your pace, your language. Let's get to work.",
      ja: 'マーカスです。目標もペースも言語も自分次第。さあ始めよう。',
      ko: '마커스입니다. 목표도 속도도 언어도 자유롭게. 시작하죠.',
      es: 'Soy Marcus. Tus metas, tu ritmo, tu idioma. Manos a la obra.',
      de: "Ich bin Marcus. Deine Ziele, dein Tempo, deine Sprache. Los geht's.",
      fr: 'Je suis Marcus. Vos objectifs, votre rythme, votre langue. Au travail.',
      zh: '我是马库斯。你的目标、你的节奏、你的语言。开始吧。',
      pt: 'Sou o Marcus. Seus objetivos, seu ritmo, seu idioma. Vamos trabalhar.',
    },
  },
  { name: 'Alex', segmentName: 'alex-rivera',
    translations: {
      en: "I'm Alex. I help you find exactly what you need, in any language. Let's figure it out.",
      ja: 'アレックスです。必要なものを見つけるお手伝いをします。どの言語でも。一緒に考えましょう。',
      ko: '알렉스입니다. 필요한 걸 정확히 찾아드릴게요, 어떤 언어로든. 함께 알아봐요.',
      es: 'Soy Alex. Te ayudo a encontrar exactamente lo que necesitas, en cualquier idioma. Vamos a resolverlo.',
      de: 'Ich bin Alex. Ich helfe dir, genau das zu finden, was du brauchst — in jeder Sprache. Lass uns das klären.',
      fr: "Je suis Alex. Je vous aide à trouver exactement ce qu'il vous faut, dans n'importe quelle langue. On s'y met.",
      zh: '我是亚历克斯。帮你找到你需要的，用任何语言。一起来吧。',
      pt: 'Sou o Alex. Ajudo você a encontrar exatamente o que precisa, em qualquer idioma. Vamos resolver.',
    },
  },
  { name: 'Sara', segmentName: 'sara',
    translations: {
      en: "I'm Sara. Pick a language, any language — I'll keep up. Let's talk.",
      ja: 'サラです。どの言語でもどうぞ — ついていきます。話しましょう。',
      ko: '사라입니다. 아무 언어나 골라보세요 — 따라갈게요. 이야기해요.',
      es: 'Soy Sara. Elige un idioma, cualquier idioma — te sigo el ritmo. Hablemos.',
      de: 'Ich bin Sara. Wähl eine Sprache, irgendeine — ich halte mit. Lass uns reden.',
      fr: "Je suis Sara. Choisis une langue, n'importe laquelle — je suivrai. Parlons.",
      zh: '我是萨拉。选一种语言，任何语言——我都跟得上。聊聊吧。',
      pt: 'Sou a Sara. Escolha um idioma, qualquer um — eu acompanho. Vamos conversar.',
    },
  },
]

function makeEvenWords(text, duration) {
  const words = text.split(/\s+/)
  const speakEnd = duration * 0.6
  const interval = speakEnd / words.length
  return words.map((word, i) => ({
    word,
    start: i * interval,
    end: (i + 1) * interval,
  }))
}

class ViewLanding extends HTMLElement {
  connectedCallback() {
    this._activeIndex = 0
    this._browserLang = (navigator.language || 'en').split('-')[0]
    this._sync = null
    this._waveform = null

    this.innerHTML = `
      <style>
        .landing-root {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background: var(--lola-bg);
        }

        .landing-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }

        .landing-gradient-bottom {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.9) 100%);
        }

        .landing-gradient-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 8rem;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
          z-index: 10;
        }

        .landing-gradient-bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 16rem;
          pointer-events: none;
          background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4) 50%, transparent);
          z-index: 10;
        }

        .landing-logo {
          position: absolute;
          top: 0; left: 0;
          z-index: 50;
          padding: 1rem 1.5rem;
        }

        .landing-logo span {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
          background: var(--lola-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .landing-subtitles {
          position: absolute;
          z-index: 20;
          left: 0; right: 0;
          top: 52%;
          display: flex;
          justify-content: center;
          padding: 0 1.5rem;
        }

        .landing-subtitles-inner {
          text-align: center;
          transition: opacity 0.5s ease-out;
        }

        .landing-subtitles-inner p {
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          font-weight: 300;
          letter-spacing: 0.2px;
          margin: 0;
        }

        .subtitle-word {
          display: inline-block;
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        .landing-waveform-wrap {
          position: absolute;
          z-index: 20;
          left: 0; right: 0;
          top: 66%;
          display: flex;
          justify-content: center;
        }

        .landing-waveform-inner {
          width: 60%;
          max-width: 400px;
          height: 4rem;
        }

        @media (min-width: 640px) {
          .landing-waveform-inner { width: 50%; max-width: 500px; }
        }
        @media (min-width: 1024px) {
          .landing-waveform-inner { width: 40%; max-width: 600px; }
        }

        .landing-waveform-canvas {
          width: 100%;
          height: 100%;
        }

        .landing-dots {
          position: absolute;
          z-index: 30;
          left: 50%;
          transform: translateX(-50%);
          top: 74%;
          display: flex;
          gap: 0.5rem;
        }

        .landing-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.5s;
        }

        .landing-dot.active {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.25);
        }

        .landing-dot:hover:not(.active) {
          background: rgba(255, 255, 255, 0.6);
        }

        .landing-cta {
          position: absolute;
          z-index: 30;
          bottom: 0;
          left: 0; right: 0;
          padding: 0 1.5rem;
          padding-bottom: env(safe-area-inset-bottom, 16px);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .landing-cta { margin-bottom: 3rem; }
        }

        .landing-cta-tagline {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 300;
        }

        .landing-cta-btn {
          padding: 0.875rem 2.5rem;
          border-radius: 9999px;
          background: var(--lola-gradient);
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          letter-spacing: 0.03em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(67, 97, 238, 0.3);
          animation: pulseGlow 3s ease-in-out infinite;
        }

        .landing-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(67, 97, 238, 0.5);
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(67, 97, 238, 0.3); }
          50% { box-shadow: 0 0 30px rgba(67, 97, 238, 0.5), 0 0 60px rgba(76, 201, 240, 0.15); }
        }

        .landing-cta-secondary {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          font-family: var(--font-body);
        }

        .landing-cta-secondary:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        .landing-menu-btn {
          position: absolute;
          top: 0; right: 0;
          z-index: 50;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: color 0.2s;
        }

        .landing-menu-btn:hover {
          color: white;
        }
      </style>

      <div class="landing-root">
        <video class="landing-video" autoplay muted loop playsinline preload="auto">
          <source src="${HERO_VIDEO}" type="video/mp4" />
        </video>

        <div class="landing-gradient-bottom"></div>
        <div class="landing-gradient-top"></div>
        <div class="landing-gradient-bottom-fade"></div>

        <div class="landing-logo">
          <span>LoLA</span>
        </div>

        <button class="landing-menu-btn" id="landing-menu-btn" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="landing-subtitles">
          <div class="landing-subtitles-inner" id="subtitles-container">
            <p id="subtitles-text"></p>
          </div>
        </div>

        <div class="landing-waveform-wrap">
          <div class="landing-waveform-inner">
            <canvas class="landing-waveform-canvas" id="waveform-canvas"></canvas>
          </div>
        </div>

        <div class="landing-dots" id="avatar-dots"></div>

        <div class="landing-cta">
          <p class="landing-cta-tagline">AI avatars that coach, teach & adapt</p>
          <button class="landing-cta-btn" id="cta-start">Start Coaching</button>
          <button class="landing-cta-secondary" id="cta-demo">See how it adapts</button>
          <button class="landing-cta-secondary" id="cta-creator">Create your own avatar</button>
        </div>
      </div>
    `

    this._video = this.querySelector('.landing-video')
    this._subtitlesContainer = this.querySelector('#subtitles-container')
    this._subtitlesText = this.querySelector('#subtitles-text')
    this._dotsContainer = this.querySelector('#avatar-dots')
    this._ctaCreator = this.querySelector('#cta-creator')

    this._buildDots()
    this._initSync()
    this._bindEvents()
  }

  _buildDots() {
    avatars.forEach((a, i) => {
      const btn = document.createElement('button')
      btn.className = `landing-dot${i === 0 ? ' active' : ''}`
      btn.setAttribute('aria-label', `Show ${a.name}`)
      btn.addEventListener('click', () => this._seekToSegment(i))
      this._dotsContainer.appendChild(btn)
    })
  }

  async _initSync() {
    this._sync = new SubtitleSync(this._video)
    await this._sync.load(HERO_SUBTITLES)

    const canvas = this.querySelector('#waveform-canvas')
    this._waveform = new Waveform(canvas)
    this._waveform.start()

    let lastSegment = -1
    this._sync.onChange(({ visibleCount, energy, activeSegmentIndex }) => {
      this._waveform.setEnergy(energy)

      // Update active segment
      if (activeSegmentIndex !== lastSegment) {
        lastSegment = activeSegmentIndex
        this._activeIndex = activeSegmentIndex
        this._updateDots()
        // Active avatar changed
      }

      // Render subtitles
      this._renderSubtitles(visibleCount)
    })

    this._sync.start()
  }

  _renderSubtitles(visibleCount) {
    const words = this._getDisplayWords()
    if (!words || words.length === 0) return

    const allHidden = visibleCount === 0
    this._subtitlesContainer.style.opacity = allHidden ? '0' : '1'

    // Only rebuild DOM if word count changed (avoid thrashing)
    if (this._lastWordCount !== words.length) {
      this._lastWordCount = words.length
      this._subtitlesText.innerHTML = words.map((w, i) =>
        `<span class="subtitle-word" data-i="${i}">${w.word}</span>${i < words.length - 1 ? ' ' : ''}`
      ).join('')
    }

    // Update visibility per word
    const spans = this._subtitlesText.querySelectorAll('.subtitle-word')
    spans.forEach((span, i) => {
      const visible = i < visibleCount
      span.style.opacity = visible ? '1' : '0'
      span.style.transform = visible ? 'translateY(0)' : 'translateY(8px)'
    })
  }

  _getDisplayWords() {
    if (!this._sync?.data) return []

    const isTranslatedLoop = this._sync.loopCount % 2 === 0 && this._browserLang !== 'en'
    if (isTranslatedLoop) {
      const avatar = avatars[this._activeIndex]
      if (!avatar) return []
      const text = avatar.translations[this._browserLang] || avatar.translations.en
      const seg = this._sync.data.segments?.[this._activeIndex]
      const duration = seg ? (seg.end - seg.start) : (this._sync.data.duration ?? 5)
      return makeEvenWords(text, duration)
    }

    return this._sync.currentWords
  }

  _seekToSegment(index) {
    const seg = this._sync?.data?.segments?.[index]
    if (seg && this._video) {
      this._video.currentTime = seg.start
    }
  }

  _updateDots() {
    const dots = this._dotsContainer.querySelectorAll('.landing-dot')
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this._activeIndex)
    })
  }

  _bindEvents() {
    this.querySelector('#cta-start').addEventListener('click', () => {
      this._cleanup()
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }))
    })

    this.querySelector('#cta-demo').addEventListener('click', () => {
      this._cleanup()
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'demo' }
      }))
    })

    this.querySelector('#landing-menu-btn').addEventListener('click', () => {
      this._cleanup()
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'lola' }
      }))
    })

    this.querySelector('#cta-creator').addEventListener('click', () => {
      this._cleanup()
      this.dispatchEvent(new CustomEvent('navigate', {
        bubbles: true,
        detail: { view: 'creator' }
      }))
    })
  }

  _cleanup() {
    this._sync?.stop()
    this._waveform?.stop()
    this._video?.pause()
  }

  disconnectedCallback() {
    this._cleanup()
  }
}

customElements.define('view-landing', ViewLanding)
