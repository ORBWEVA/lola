/**
 * Split-Screen Demo View — Two parallel Gemini Live API sessions
 * showing visibly different coaching for the same learner error.
 *
 * Same mic input -> two profiles -> two coaches respond differently.
 * Click a panel to switch which coach you hear.
 */

import "./audio-visualizer.js";
import "./expression-carousel.js";
import "./live-transcript.js";
import {
  GeminiLiveAPI,
  MultimodalLiveResponseType,
} from "../lib/gemini-live/geminilive.js";
import { AudioPlayer } from "../lib/gemini-live/mediaUtils.js";
import { ExpressionCarousel } from "./expression-carousel.js";

// Distinct voices so judges can hear the personality difference
const VOICE_LEFT = "Kore"; // The Analyst — calm, measured
const VOICE_RIGHT = "Aoede"; // The Explorer — warm, expressive

class SplitScreen extends HTMLElement {
  constructor() {
    super();
    this.left = { client: null, audioPlayer: null, outputBuffer: "" };
    this.right = { client: null, audioPlayer: null, outputBuffer: "" };
    // Shared mic state
    this._micCtx = null;
    this._micWorklet = null;
    this._micStream = null;
    this._micSource = null;
    this._micActive = false;
    // Camera
    this._camStream = null;
    this._camInterval = null;
    this.cameraActive = false;
    this.sessionActive = false;
    this.listeningTo = "left";
    this._profiles = null;
  }

  connectedCallback() {
    this.loadProfiles();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  async loadProfiles() {
    this.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;opacity:0.5;">Loading profiles...</div>`;
    try {
      const res = await fetch("/api/demo-profiles");
      this._profiles = await res.json();
      this.renderUI();
    } catch (e) {
      this.innerHTML = `<div style="color:var(--color-danger);text-align:center;padding:40px;">Failed to load profiles: ${e.message}</div>`;
    }
  }

  renderUI() {
    const lp = this._profiles.profile_a;
    const rp = this._profiles.profile_b;

    this.innerHTML = `
      <style>
        .ss-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 10px;
          gap: 10px;
          overflow: hidden;
        }
        .ss-header {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .ss-title {
          font-size: 1.1rem;
          font-weight: 800;
          background: var(--lola-gradient, linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ss-status {
          margin-left: auto;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-sub);
        }
        .ss-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          flex: 1;
          min-height: 0;
        }
        .ss-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: var(--color-surface);
          backdrop-filter: var(--backdrop-blur);
          border: 2px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-lg);
          padding: 10px;
          cursor: pointer;
          transition: border-color 0.3s;
          position: relative;
          min-height: 0;
          overflow: hidden;
        }
        .ss-panel.listening {
          border-color: var(--lola-indigo, #4361ee);
        }
        .ss-listen-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 0.55rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          background: var(--lola-indigo, #4361ee);
          color: white;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 2;
        }
        .ss-panel.listening .ss-listen-badge { opacity: 1; }
        .ss-profile-name {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .ss-profile-desc {
          font-size: 0.65rem;
          color: var(--color-text-sub);
          opacity: 0.7;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ss-carousel-wrap {
          width: 100%;
          flex-shrink: 0;
        }
        .ss-carousel-wrap expression-carousel {
          display: block;
          width: 100%;
        }
        .ss-wf-row {
          height: 32px;
          flex-shrink: 0;
          background: rgba(0,0,0,0.15);
          border-radius: var(--radius-sm);
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ss-wf-label {
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: var(--font-mono, 'Space Mono', monospace);
          color: var(--lola-rose, #ff4d6d);
          flex-shrink: 0;
        }
        .ss-wf-row audio-visualizer {
          flex: 1;
          height: 100%;
        }
        .ss-transcript-wrap {
          flex: 1;
          min-height: 60px;
          position: relative;
          overflow: hidden;
        }
        .ss-transcript-wrap live-transcript {
          position: absolute;
          inset: 0;
        }
        .ss-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .ss-user-wf {
          width: 100%;
          max-width: 480px;
          height: 36px;
          background: var(--color-surface);
          border: var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ss-user-wf-label {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: var(--font-mono, 'Space Mono', monospace);
          color: var(--lola-sky, #4cc9f0);
          flex-shrink: 0;
        }
        .ss-user-wf audio-visualizer {
          flex: 1;
          height: 100%;
        }
        .ss-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .ss-btn {
          padding: 10px 24px;
          border-radius: var(--radius-full);
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.85rem;
        }
        .ss-btn-primary { background: var(--lola-indigo, #4361ee); color: white; }
        .ss-btn-primary.active { background: var(--lola-error, #ef476f); }
        .ss-btn-secondary {
          background: var(--color-surface);
          color: var(--color-text-main);
          border: 1px solid var(--glass-border);
        }
        .ss-btn-secondary.active { background: var(--lola-sky, #4cc9f0); color: white; border-color: var(--lola-sky, #4cc9f0); }
        .ss-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .ss-back-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          opacity: 0.7;
          color: var(--color-text-main);
        }
        .ss-back-btn:hover { opacity: 1; }
        .ss-hint {
          font-size: 0.65rem;
          color: var(--color-text-sub);
          opacity: 0.5;
        }
        .ss-camera-pip {
          position: fixed;
          bottom: 12px;
          right: 12px;
          width: 120px;
          height: 90px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.25);
          z-index: 50;
          display: none;
        }
        .ss-camera-pip video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
      </style>

      <div class="ss-root">
        <div class="ss-header">
          <button class="ss-back-btn" id="ss-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <span class="ss-title">Split-Screen Demo</span>
          <span class="ss-status" id="ss-status">Ready</span>
        </div>

        <div class="ss-panels">
          <!-- LEFT PANEL — The Analyst -->
          <div class="ss-panel listening" id="panel-left">
            <span class="ss-listen-badge">Listening</span>
            <span class="ss-profile-name" style="color:var(--lola-indigo, #4361ee);">${lp.label}</span>
            <div class="ss-profile-desc">${lp.description}</div>
            <div class="ss-carousel-wrap">
              <expression-carousel id="carousel-left"></expression-carousel>
            </div>
            <div class="ss-wf-row">
              <span class="ss-wf-label">Coach</span>
              <audio-visualizer id="viz-left" color="#4361ee"></audio-visualizer>
            </div>
            <div class="ss-transcript-wrap">
              <live-transcript id="transcript-left"></live-transcript>
            </div>
          </div>

          <!-- RIGHT PANEL — The Explorer -->
          <div class="ss-panel" id="panel-right">
            <span class="ss-listen-badge">Listening</span>
            <span class="ss-profile-name" style="color:var(--lola-rose, #ff4d6d);">${rp.label}</span>
            <div class="ss-profile-desc">${rp.description}</div>
            <div class="ss-carousel-wrap">
              <expression-carousel id="carousel-right"></expression-carousel>
            </div>
            <div class="ss-wf-row">
              <span class="ss-wf-label">Coach</span>
              <audio-visualizer id="viz-right" color="#4361ee"></audio-visualizer>
            </div>
            <div class="ss-transcript-wrap">
              <live-transcript id="transcript-right"></live-transcript>
            </div>
          </div>
        </div>

        <div class="ss-bottom">
          <div class="ss-user-wf">
            <span class="ss-user-wf-label">You</span>
            <audio-visualizer id="viz-user" color="#4cc9f0"></audio-visualizer>
          </div>
          <div class="ss-controls">
            <button class="ss-btn ss-btn-primary" id="ss-start">Start Both</button>
            <button class="ss-btn ss-btn-secondary" id="ss-camera">Camera</button>
          </div>
          <span class="ss-hint">Click a panel to switch which coach you hear</span>
        </div>

        <div class="ss-camera-pip" id="ss-cam-pip"></div>
      </div>
    `;

    // Set up carousels
    this.querySelector("#carousel-left").setProfile("profile-a");
    this.querySelector("#carousel-right").setProfile("profile-b");

    // Events
    this.querySelector("#ss-back").addEventListener("click", () => {
      this.cleanup();
      this.dispatchEvent(
        new CustomEvent("navigate", {
          bubbles: true,
          detail: { view: "lola" },
        })
      );
    });
    this.querySelector("#ss-start").addEventListener("click", () =>
      this.toggleSession()
    );
    this.querySelector("#ss-camera").addEventListener("click", () =>
      this.toggleCamera()
    );
    this.querySelector("#panel-left").addEventListener("click", () =>
      this.switchListening("left")
    );
    this.querySelector("#panel-right").addEventListener("click", () =>
      this.switchListening("right")
    );
  }

  // ── Listening Toggle ──────────────────────────────────────────────

  switchListening(side) {
    if (this.listeningTo === side) return;
    this.listeningTo = side;

    this.querySelector("#panel-left").classList.toggle(
      "listening",
      side === "left"
    );
    this.querySelector("#panel-right").classList.toggle(
      "listening",
      side === "right"
    );

    // Mute/unmute audio output
    if (this.left.audioPlayer) {
      this.left.audioPlayer.setVolume(side === "left" ? 1.0 : 0.0);
    }
    if (this.right.audioPlayer) {
      this.right.audioPlayer.setVolume(side === "right" ? 1.0 : 0.0);
    }
  }

  // ── Session Control ───────────────────────────────────────────────

  async toggleSession() {
    const btn = this.querySelector("#ss-start");
    const status = this.querySelector("#ss-status");

    if (this.sessionActive) {
      this.cleanup();
      btn.textContent = "Start Both";
      btn.classList.remove("active");
      status.textContent = "Sessions ended";
      status.style.color = "";
      return;
    }

    btn.textContent = "End Sessions";
    btn.classList.add("active");
    status.textContent = "Connecting...";

    try {
      const leftProfile = this._profiles.profile_a;
      const rightProfile = this._profiles.profile_b;

      // Create two Gemini clients with different profiles + voices
      this.left.client = this.createClient(
        leftProfile.system_instruction,
        VOICE_LEFT,
        "left"
      );
      this.right.client = this.createClient(
        rightProfile.system_instruction,
        VOICE_RIGHT,
        "right"
      );

      // Auth tokens (parallel)
      let tokenLeft = null;
      let tokenRight = null;
      try {
        [tokenLeft, tokenRight] = await Promise.all([
          this.getRecaptchaToken(),
          this.getRecaptchaToken(),
        ]);
      } catch (e) {
        console.warn("reCAPTCHA unavailable:", e);
      }

      // Connect both sessions in parallel
      await Promise.all([
        this.left.client.connect(tokenLeft),
        this.right.client.connect(tokenRight),
      ]);

      // Create audio players
      this.left.audioPlayer = new AudioPlayer();
      this.right.audioPlayer = new AudioPlayer();
      await Promise.all([
        this.left.audioPlayer.init(),
        this.right.audioPlayer.init(),
      ]);

      // Right starts muted
      this.right.audioPlayer.setVolume(0.0);

      // Connect waveform visualizers to workletNode (pre-gain)
      // so waveform shows activity even when panel is muted
      const vizLeft = this.querySelector("#viz-left");
      if (vizLeft && this.left.audioPlayer.workletNode) {
        vizLeft.connect(
          this.left.audioPlayer.audioContext,
          this.left.audioPlayer.workletNode
        );
      }
      const vizRight = this.querySelector("#viz-right");
      if (vizRight && this.right.audioPlayer.workletNode) {
        vizRight.connect(
          this.right.audioPlayer.audioContext,
          this.right.audioPlayer.workletNode
        );
      }

      // Start shared mic sending to both
      await this.startDualMic();

      this.sessionActive = true;
      status.textContent = "Connected \u2014 speak to both coaches";
      status.style.color = "#4CAF50";
    } catch (e) {
      console.error("Split-screen session failed:", e);
      status.textContent = "Failed: " + e.message;
      status.style.color = "var(--color-danger, #e74c3c)";
      btn.textContent = "Start Both";
      btn.classList.remove("active");
    }
  }

  createClient(systemInstruction, voice, side) {
    const client = new GeminiLiveAPI();
    client.setSystemInstructions(systemInstruction);
    client.setInputAudioTranscription(true);
    client.setOutputAudioTranscription(true);
    client.setVoice(voice);

    client.onReceiveResponse = (response) => {
      const state = this[side];

      if (response.type === MultimodalLiveResponseType.AUDIO) {
        if (state.audioPlayer) state.audioPlayer.play(response.data);
      } else if (
        response.type === MultimodalLiveResponseType.TURN_COMPLETE
      ) {
        const carousel = this.querySelector(`#carousel-${side}`);
        if (carousel) carousel.setExpression("neutral");
        state.outputBuffer = "";
        const transcript = this.querySelector(`#transcript-${side}`);
        if (transcript) transcript.finalizeAll();
      } else if (response.type === MultimodalLiveResponseType.INTERRUPTED) {
        const carousel = this.querySelector(`#carousel-${side}`);
        if (carousel) carousel.setExpression("neutral");
        state.outputBuffer = "";
        if (state.audioPlayer) state.audioPlayer.interrupt();
      } else if (
        response.type === MultimodalLiveResponseType.INPUT_TRANSCRIPTION
      ) {
        const transcript = this.querySelector(`#transcript-${side}`);
        if (transcript)
          transcript.addInputTranscript(
            response.data.text,
            response.data.finished
          );
      } else if (
        response.type === MultimodalLiveResponseType.OUTPUT_TRANSCRIPTION
      ) {
        const transcript = this.querySelector(`#transcript-${side}`);
        if (transcript)
          transcript.addOutputTranscript(
            response.data.text,
            response.data.finished
          );
        this.detectExpression(side, response.data.text);
      }
    };

    client.onError = (e) => console.error(`Gemini error (${side}):`, e);
    client.onClose = () => console.log(`${side} session closed`);

    return client;
  }

  detectExpression(side, text) {
    const state = this[side];
    state.outputBuffer += " " + text;
    if (state.outputBuffer.length > 200) {
      state.outputBuffer = state.outputBuffer.slice(-200);
    }
    const detected = ExpressionCarousel.detectFromText(state.outputBuffer);
    if (detected) {
      const carousel = this.querySelector(`#carousel-${side}`);
      if (carousel) carousel.setExpression(detected);
      state.outputBuffer = "";
    }
  }

  // ── Shared Microphone ─────────────────────────────────────────────

  async startDualMic() {
    const sampleRate = 16000;
    this._micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this._micCtx = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate,
    });
    await this._micCtx.audioWorklet.addModule(
      "/audio-processors/capture.worklet.js"
    );

    this._micWorklet = new AudioWorkletNode(
      this._micCtx,
      "audio-capture-processor"
    );

    this._micWorklet.port.onmessage = (event) => {
      if (!this._micActive) return;
      if (event.data.type === "audio") {
        const pcm = this.convertToPCM16(event.data.data);
        if (this.left.client?.connected)
          this.left.client.sendAudioMessage(pcm);
        if (this.right.client?.connected)
          this.right.client.sendAudioMessage(pcm);
      }
    };

    this._micSource = this._micCtx.createMediaStreamSource(this._micStream);
    this._micSource.connect(this._micWorklet);

    // User waveform
    const vizUser = this.querySelector("#viz-user");
    if (vizUser) vizUser.connect(this._micCtx, this._micSource);

    this._micActive = true;
  }

  convertToPCM16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = sample * 0x7fff;
    }
    return int16Array.buffer;
  }

  // ── Camera ────────────────────────────────────────────────────────

  async toggleCamera() {
    const btn = this.querySelector("#ss-camera");
    const pip = this.querySelector("#ss-cam-pip");

    if (this.cameraActive) {
      if (this._camInterval) {
        clearInterval(this._camInterval);
        this._camInterval = null;
      }
      if (this._camStream) {
        this._camStream.getTracks().forEach((t) => t.stop());
        this._camStream = null;
      }
      this.cameraActive = false;
      btn.classList.remove("active");
      btn.textContent = "Camera";
      if (pip) {
        pip.style.display = "none";
        pip.innerHTML = "";
      }
      return;
    }

    if (!this.left.client?.connected || !this.right.client?.connected) {
      console.warn("Start sessions first");
      return;
    }

    try {
      this._camStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      const video = document.createElement("video");
      video.srcObject = this._camStream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      await new Promise((r) => {
        video.onloadedmetadata = r;
      });
      video.play();

      if (pip) {
        pip.style.display = "block";
        pip.innerHTML = "";
        pip.appendChild(video);
      }

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");

      // Capture 1 FPS and send to both sessions
      this._camInterval = setInterval(() => {
        ctx.drawImage(video, 0, 0, 640, 480);
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result.split(",")[1];
              if (this.left.client?.connected)
                this.left.client.sendImageMessage(base64, "image/jpeg");
              if (this.right.client?.connected)
                this.right.client.sendImageMessage(base64, "image/jpeg");
            };
            reader.readAsDataURL(blob);
          },
          "image/jpeg",
          0.7
        );
      }, 1000);

      this.cameraActive = true;
      btn.classList.add("active");
      btn.textContent = "Camera ON";
    } catch (e) {
      console.error("Camera failed:", e);
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  cleanup() {
    this._micActive = false;
    this.sessionActive = false;

    // Mic
    if (this._micWorklet) {
      this._micWorklet.disconnect();
      this._micWorklet.port.close();
      this._micWorklet = null;
    }
    if (this._micCtx) {
      this._micCtx.close();
      this._micCtx = null;
    }
    if (this._micStream) {
      this._micStream.getTracks().forEach((t) => t.stop());
      this._micStream = null;
    }
    this._micSource = null;

    // Camera
    if (this._camInterval) {
      clearInterval(this._camInterval);
      this._camInterval = null;
    }
    if (this._camStream) {
      this._camStream.getTracks().forEach((t) => t.stop());
      this._camStream = null;
    }
    this.cameraActive = false;

    // Both sides
    for (const side of [this.left, this.right]) {
      if (side.client) {
        side.client.disconnect();
        side.client = null;
      }
      if (side.audioPlayer) {
        side.audioPlayer.interrupt();
        side.audioPlayer = null;
      }
      side.outputBuffer = "";
    }

    // Visualizers
    for (const id of ["#viz-left", "#viz-right", "#viz-user"]) {
      const viz = this.querySelector(id);
      if (viz?.disconnect) viz.disconnect();
    }
  }

  async getRecaptchaToken() {
    if (typeof grecaptcha === "undefined") return null;
    return new Promise((resolve) => {
      try {
        grecaptcha.enterprise.ready(async () => {
          try {
            const t = await grecaptcha.enterprise.execute(
              "6LeSYx8sAAAAAGdRAp8VQ2K9I-KYGWBykzayvQ8n",
              { action: "LOGIN" }
            );
            resolve(t);
          } catch (e) {
            resolve(null);
          }
        });
      } catch (e) {
        resolve(null);
      }
    });
  }
}

customElements.define("split-screen", SplitScreen);
