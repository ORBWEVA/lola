/**
 * Subtitle sync engine — vanilla JS port of lola-platform's useVideoSubtitles hook.
 * Reads video.currentTime via rAF and emits word-by-word visibility, speaking state, and energy.
 */

export class SubtitleSync {
  constructor(videoEl) {
    this.video = videoEl
    this.data = null       // { duration, words, segments }
    this.visibleCount = 0
    this.speaking = false
    this.energy = 0
    this.loopCount = 0
    this.activeSegmentIndex = 0
    this._prevTime = 0
    this._animId = 0
    this._listeners = []
  }

  /** Subscribe to sync updates: fn({ visibleCount, speaking, energy, loopCount, activeSegmentIndex }) */
  onChange(fn) {
    this._listeners.push(fn)
    return () => { this._listeners = this._listeners.filter(l => l !== fn) }
  }

  _emit() {
    const payload = {
      visibleCount: this.visibleCount,
      speaking: this.speaking,
      energy: this.energy,
      loopCount: this.loopCount,
      activeSegmentIndex: this.activeSegmentIndex,
    }
    for (const fn of this._listeners) fn(payload)
  }

  async load(url) {
    try {
      const r = await fetch(url)
      this.data = await r.json()
    } catch {
      this.data = null
    }
  }

  start() {
    this._tick()
  }

  stop() {
    cancelAnimationFrame(this._animId)
  }

  /** Get the current segment's words (for display) */
  get currentWords() {
    if (!this.data?.segments) return this.data?.words ?? []
    return this.data.segments[this.activeSegmentIndex]?.words ?? []
  }

  _tick = () => {
    const video = this.video
    const data = this.data
    if (!video || !data) {
      this._animId = requestAnimationFrame(this._tick)
      return
    }

    const t = video.currentTime

    // Detect loop (time jumps backwards)
    if (t < this._prevTime - 0.5) {
      this.loopCount++
    }
    this._prevTime = t

    // Determine active segment
    if (data.segments) {
      for (let i = data.segments.length - 1; i >= 0; i--) {
        if (t >= data.segments[i].start) {
          this.activeSegmentIndex = i
          break
        }
      }
    }

    // Use segment-local words
    const words = this.currentWords
    let count = 0
    let isSpeaking = false
    let currentEnergy = 0

    for (let i = 0; i < words.length; i++) {
      const w = words[i]
      if (t >= w.start) count = i + 1
      if (t >= w.start && t <= w.end) {
        isSpeaking = true
        const wordMid = (w.start + w.end) / 2
        const wordHalf = (w.end - w.start) / 2
        const dist = Math.abs(t - wordMid) / (wordHalf || 0.01)
        currentEnergy = Math.max(currentEnergy, 1 - dist * 0.4)
      }
    }

    // Smooth gap energy
    if (!isSpeaking && count > 0 && count < words.length) {
      const prev = words[count - 1]
      const next = words[count]
      if (prev && next) {
        const gap = next.start - prev.end
        if (gap < 0.3) {
          const gapPos = (t - prev.end) / gap
          currentEnergy = 0.3 * (1 - Math.abs(gapPos - 0.5) * 2)
        }
      }
    }

    this.visibleCount = count
    this.speaking = isSpeaking
    this.energy = currentEnergy
    this._emit()

    this._animId = requestAnimationFrame(this._tick)
  }
}
