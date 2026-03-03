/**
 * LoLA Session View — Adaptive coaching session with expression carousel + waveform.
 * Replaces TalkingHead 3D avatar with pre-rendered expression images that swap
 * based on conversation context, plus dual audio waveform visualizers.
 */

import "./audio-visualizer.js";
import "./expression-carousel.js";
import "./live-transcript.js";
import {
  GeminiLiveAPI,
  MultimodalLiveResponseType,
} from "../lib/gemini-live/geminilive.js";
import {
  AudioStreamer,
  AudioPlayer,
  VideoStreamer,
} from "../lib/gemini-live/mediaUtils.js";
import { ExpressionCarousel } from "./expression-carousel.js";

class ViewLola extends HTMLElement {
  constructor() {
    super();
    this._profile = null;
    this._profileKey = null;
    this._systemInstruction = null;
    this.videoStreamer = null;
    this.cameraActive = false;
    this._outputBuffer = "";
  }

  connectedCallback() {
    this.showProfilePicker();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  // ─── Profile Picker ──────────────────────────────────────────────

  async showProfilePicker() {
    this.innerHTML = `
      <div class="container" style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 32px; padding: 40px 20px;">
        <h1 style="font-size: 2rem; font-weight: 800; text-align: center; background: linear-gradient(135deg, var(--color-text-main) 30%, var(--color-accent-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          LoLA Demo
        </h1>
        <p style="font-size: 1.1rem; opacity: 0.7; text-align: center; max-width: 500px;">
          Choose a learner profile to experience adaptive coaching.
          Say "I go to the restaurant yesterday" to test error correction.
        </p>
        <div id="profiles-loading" style="font-size: 0.9rem; opacity: 0.5;">Loading profiles...</div>
        <div id="profiles-container" style="display: none; gap: 24px; flex-wrap: wrap; justify-content: center;"></div>
        <button id="back-btn" style="margin-top: 16px; background: transparent; border: 1px solid var(--glass-border); color: var(--color-text-sub); padding: 10px 24px; border-radius: var(--radius-full); cursor: pointer; font-weight: 600;">Back</button>
      </div>
    `;

    this.querySelector("#back-btn").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("navigate", { bubbles: true, detail: { view: "splash" } })
      );
    });

    try {
      const res = await fetch("/api/demo-profiles");
      const data = await res.json();
      this.renderProfileCards(data);
    } catch (e) {
      this.querySelector("#profiles-loading").textContent =
        "Failed to load profiles: " + e.message;
    }
  }

  renderProfileCards(data) {
    this.querySelector("#profiles-loading").style.display = "none";
    const container = this.querySelector("#profiles-container");
    container.style.display = "flex";

    const profiles = [
      { key: "profile_a", ...data.profile_a, color: "#4A90D9" },
      { key: "profile_b", ...data.profile_b, color: "#D4A84B" },
      { key: "profile_c", ...data.profile_c, color: "#E85D75" },
      { key: "profile_d", ...data.profile_d, color: "#50C878" },
    ];

    profiles.forEach((p) => {
      const l1 =
        p.profile?.l1 === "en"
          ? "English"
          : p.profile?.l1 === "ko"
            ? "Korean"
            : "Japanese";
      const target = p.profile?.l1 === "en" ? "Japanese" : "English";
      const card = document.createElement("button");
      card.style.cssText = `
        background: var(--color-surface); border: 2px solid ${p.color}33;
        border-radius: var(--radius-lg); padding: 28px 32px; cursor: pointer;
        min-width: 260px; max-width: 320px; text-align: left;
        transition: all 0.3s ease; box-shadow: var(--shadow-sm);
      `;
      card.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 800; color: ${p.color}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${p.label}</div>
        <div style="font-size: 0.9rem; color: var(--color-text-sub); line-height: 1.4;">${p.description}</div>
        <div style="margin-top: 12px; font-size: 0.8rem; color: var(--color-text-sub); opacity: 0.7;">${l1} → ${target}</div>
      `;
      card.addEventListener("mouseenter", () => {
        card.style.borderColor = p.color;
        card.style.transform = "translateY(-3px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.borderColor = p.color + "33";
        card.style.transform = "translateY(0)";
      });
      card.addEventListener("click", () => {
        this._profile = p.profile;
        this._profileKey = p.key.replace("_", "-"); // profile_a → profile-a
        this._systemInstruction = p.system_instruction;
        this._profileLabel = p.label;
        this.showSession();
      });
      container.appendChild(card);
    });
  }

  // ─── Session View ────────────────────────────────────────────────

  async showSession() {
    this.innerHTML = `
      <style>
        .lola-session {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 16px;
          gap: 12px;
        }
        .lola-header {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 600px;
        }
        .lola-avatar-wrap {
          width: 100%;
          max-width: 420px;
          position: relative;
        }
        .lola-camera-preview {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 100px;
          height: 75px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.25);
          z-index: 5;
          display: none;
        }
        .lola-camera-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .lola-waveforms {
          display: flex;
          gap: 16px;
          width: 100%;
          max-width: 600px;
          height: 56px;
        }
        .wf-track {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-surface);
          border: var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 0 12px;
          overflow: hidden;
        }
        .wf-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .wf-label.lola { color: #d4a373; }
        .wf-label.you { color: #a3b18a; }
        .wf-track audio-visualizer {
          flex: 1;
          height: 100%;
        }
        .lola-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .lola-btn {
          padding: 14px 32px;
          border-radius: var(--radius-full);
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }
        .lola-btn-primary {
          background: var(--color-accent-primary);
          color: white;
        }
        .lola-btn-primary.active {
          background: var(--color-danger, #e74c3c);
        }
        .lola-btn-secondary {
          background: var(--color-surface);
          color: var(--color-text-main);
          border: 1px solid var(--glass-border);
        }
        .lola-btn-secondary.active {
          background: #2196F3;
          color: white;
          border-color: #2196F3;
        }
        .lola-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .lola-status {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          height: 1.2em;
        }
        .lola-profile-badge {
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: var(--color-surface);
          border: 1px solid var(--glass-border);
        }
      </style>

      <div class="lola-session">
        <div class="lola-header">
          <button id="lola-back" style="background: transparent; border: none; cursor: pointer; padding: 8px; opacity: 0.7; color: var(--color-text-main);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <span class="lola-profile-badge">${this._profileLabel}</span>
          <span class="lola-status" id="lola-status">Ready</span>
        </div>

        <div class="lola-avatar-wrap">
          <expression-carousel id="lola-carousel"></expression-carousel>
          <div id="lola-camera-preview" class="lola-camera-preview"></div>
        </div>

        <div class="lola-waveforms">
          <div class="wf-track">
            <span class="wf-label lola">LoLA</span>
            <audio-visualizer id="avatar-viz" color="#d4a373"></audio-visualizer>
          </div>
          <div class="wf-track">
            <span class="wf-label you">You</span>
            <audio-visualizer id="user-viz" color="#a3b18a"></audio-visualizer>
          </div>
        </div>

        <div style="width: 100%; max-width: 600px; height: 200px; position: relative;">
          <live-transcript></live-transcript>
        </div>

        <div class="lola-controls">
          <button id="lola-start" class="lola-btn lola-btn-primary">Start Session</button>
          <button id="lola-camera" class="lola-btn lola-btn-secondary">Camera</button>
        </div>
      </div>
    `;

    // Wire up buttons
    this.querySelector("#lola-back").addEventListener("click", () => {
      this.cleanup();
      this.showProfilePicker();
    });
    this.querySelector("#lola-start").addEventListener("click", () =>
      this.toggleSession()
    );
    this.querySelector("#lola-camera").addEventListener("click", () =>
      this.toggleCamera()
    );

    // Load expression images for selected profile
    const carousel = this.querySelector("#lola-carousel");
    carousel.setProfile(this._profileKey);
  }

  // ─── Session Control ─────────────────────────────────────────────

  async toggleSession() {
    const btn = this.querySelector("#lola-start");
    const status = this.querySelector("#lola-status");
    if (!btn) return;

    if (this.sessionActive) {
      this.cleanup();
      btn.textContent = "Start Session";
      btn.classList.remove("active");
      status.textContent = "Session ended";
      return;
    }

    btn.textContent = "End Session";
    btn.classList.add("active");
    status.textContent = "Connecting...";
    status.style.color = "var(--color-text-sub)";

    try {
      // Initialize Gemini client
      this.client = new GeminiLiveAPI();
      this.client.setSystemInstructions(this._systemInstruction);
      this.client.setInputAudioTranscription(true);
      this.client.setOutputAudioTranscription(true);
      this.client.setVoice("Kore");

      // Handle responses
      this.client.onReceiveResponse = (response) => {
        if (response.type === MultimodalLiveResponseType.AUDIO) {
          this.handleAudio(response.data);
        } else if (
          response.type === MultimodalLiveResponseType.TURN_COMPLETE
        ) {
          // Avatar done speaking — return to neutral
          const carousel = this.querySelector("#lola-carousel");
          if (carousel) carousel.setExpression("neutral");
          this._outputBuffer = "";
          const transcript = this.querySelector("live-transcript");
          if (transcript) transcript.finalizeAll();
        } else if (
          response.type === MultimodalLiveResponseType.INTERRUPTED
        ) {
          // Barge-in — return to neutral
          const carousel = this.querySelector("#lola-carousel");
          if (carousel) carousel.setExpression("neutral");
          this._outputBuffer = "";
          if (this.audioPlayer) this.audioPlayer.interrupt();
        } else if (
          response.type === MultimodalLiveResponseType.INPUT_TRANSCRIPTION
        ) {
          const transcript = this.querySelector("live-transcript");
          if (transcript)
            transcript.addInputTranscript(
              response.data.text,
              response.data.finished
            );
        } else if (
          response.type === MultimodalLiveResponseType.OUTPUT_TRANSCRIPTION
        ) {
          const transcript = this.querySelector("live-transcript");
          if (transcript)
            transcript.addOutputTranscript(
              response.data.text,
              response.data.finished
            );
          // Detect expression from output text
          this.detectExpression(response.data.text);
        }
      };

      this.client.onError = (e) => console.error("Gemini error:", e);
      this.client.onClose = () => {
        status.textContent = "Disconnected";
        this.sessionActive = false;
      };

      // Get auth token
      let token = null;
      try {
        token = await this.getRecaptchaToken();
      } catch (e) {
        console.warn("reCAPTCHA unavailable:", e);
      }

      await this.client.connect(token);

      // Start mic
      this.audioStreamer = new AudioStreamer(this.client);
      await this.audioStreamer.start();

      // Connect user waveform visualizer
      const userViz = this.querySelector("#user-viz");
      if (
        userViz &&
        this.audioStreamer.audioContext &&
        this.audioStreamer.source
      ) {
        userViz.connect(
          this.audioStreamer.audioContext,
          this.audioStreamer.source
        );
      }

      // Audio playback
      this.audioPlayer = new AudioPlayer();
      await this.audioPlayer.init();

      // Connect avatar waveform visualizer to the playback gain node
      const avatarViz = this.querySelector("#avatar-viz");
      if (avatarViz && this.audioPlayer.gainNode) {
        avatarViz.connect(
          this.audioPlayer.audioContext,
          this.audioPlayer.gainNode
        );
      }

      this.sessionActive = true;
      status.textContent = "Connected — speak to LoLA";
      status.style.color = "#4CAF50";
    } catch (e) {
      console.error("Session start failed:", e);
      status.textContent = "Connection failed: " + e.message;
      status.style.color = "var(--color-danger, #e74c3c)";
      btn.textContent = "Start Session";
      btn.classList.remove("active");
    }
  }

  handleAudio(data) {
    if (this.audioPlayer) {
      this.audioPlayer.play(data);
    }
  }

  // ─── Expression Detection ────────────────────────────────────────

  detectExpression(text) {
    this._outputBuffer += " " + text;
    // Keep buffer manageable — last ~200 chars
    if (this._outputBuffer.length > 200) {
      this._outputBuffer = this._outputBuffer.slice(-200);
    }

    const detected = ExpressionCarousel.detectFromText(this._outputBuffer);
    if (detected) {
      const carousel = this.querySelector("#lola-carousel");
      if (carousel) carousel.setExpression(detected);
      // Clear buffer after detection so same keywords don't re-trigger
      this._outputBuffer = "";
    }
  }

  // ─── Camera ──────────────────────────────────────────────────────

  async toggleCamera() {
    const btn = this.querySelector("#lola-camera");
    const previewContainer = this.querySelector("#lola-camera-preview");

    if (this.cameraActive) {
      if (this.videoStreamer) this.videoStreamer.stop();
      this.videoStreamer = null;
      this.cameraActive = false;
      btn.classList.remove("active");
      btn.textContent = "Camera";
      if (previewContainer) {
        previewContainer.style.display = "none";
        previewContainer.innerHTML = "";
      }
      return;
    }

    if (!this.client || !this.client.connected) {
      console.warn("Start session first before enabling camera");
      return;
    }

    try {
      this.videoStreamer = new VideoStreamer(this.client);
      const videoEl = await this.videoStreamer.start({
        fps: 1,
        width: 640,
        height: 480,
        quality: 0.7,
      });

      if (previewContainer && videoEl) {
        previewContainer.style.display = "block";
        previewContainer.innerHTML = "";
        previewContainer.appendChild(videoEl);
      }

      this.cameraActive = true;
      btn.classList.add("active");
      btn.textContent = "Camera ON";
    } catch (e) {
      console.error("Camera failed:", e);
    }
  }

  // ─── Cleanup ─────────────────────────────────────────────────────

  cleanup() {
    if (this.audioStreamer) {
      this.audioStreamer.stop();
      this.audioStreamer = null;
    }
    if (this.videoStreamer) {
      this.videoStreamer.stop();
      this.videoStreamer = null;
    }
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
    if (this.audioPlayer) {
      this.audioPlayer.interrupt();
      this.audioPlayer = null;
    }

    const userViz = this.querySelector("#user-viz");
    if (userViz?.disconnect) userViz.disconnect();
    const avatarViz = this.querySelector("#avatar-viz");
    if (avatarViz?.disconnect) avatarViz.disconnect();

    this._outputBuffer = "";
    this.sessionActive = false;
    this.cameraActive = false;
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

customElements.define("view-lola", ViewLola);
