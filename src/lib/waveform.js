/**
 * Canvas waveform renderer — vanilla JS port of lola-platform's HeroWaveform.
 * 48-bar animated waveform driven by energy value. LoLA brand gradient (indigo → sky).
 */

export class Waveform {
  constructor(canvas) {
    this.canvas = canvas
    this.energy = 0
    this._animId = 0
    this._ctx = canvas.getContext('2d')
    this._resize()
    this._resizeHandler = () => this._resize()
    window.addEventListener('resize', this._resizeHandler)
  }

  _resize() {
    this.canvas.width = this.canvas.offsetWidth * (window.devicePixelRatio || 1)
    this.canvas.height = this.canvas.offsetHeight * (window.devicePixelRatio || 1)
  }

  start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    this._draw()
  }

  stop() {
    cancelAnimationFrame(this._animId)
    window.removeEventListener('resize', this._resizeHandler)
  }

  setEnergy(e) {
    this.energy = e
  }

  _draw = () => {
    const ctx = this._ctx
    const { width, height } = this.canvas
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    const bars = 48
    const barWidth = width / bars - 2
    const centerY = height / 2
    const now = Date.now() / 800
    const e = this.energy

    for (let i = 0; i < bars; i++) {
      const idle = 0.05 + Math.sin(now + i * 0.35) * 0.03
      const centerDist = Math.abs(i - bars / 2) / (bars / 2)
      const speechShape = (1 - centerDist * 0.6) * e * 0.85
      const variation = Math.sin(now * 1.5 + i * 0.7) * 0.08 * e
      const value = idle + speechShape + variation
      const barHeight = Math.max(value * height, 2)

      const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2)
      const alpha = 0.3 + e * 0.55
      gradient.addColorStop(0, `rgba(67, 97, 238, ${alpha})`)
      gradient.addColorStop(1, `rgba(76, 201, 240, ${alpha})`)
      ctx.fillStyle = gradient
      const x = i * (barWidth + 2) + 1
      ctx.beginPath()
      ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 2)
      ctx.fill()
    }

    this._animId = requestAnimationFrame(this._draw)
  }
}
