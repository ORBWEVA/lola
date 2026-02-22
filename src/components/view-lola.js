/**
 * LoLA Session View — Adaptive coaching session with TalkingHead avatar.
 * Phase 1: Profile A/B selection → Gemini Live session with avatar + camera + transcript.
 */

import "./audio-visualizer.js";
import "./live-transcript.js";
import {
  GeminiLiveAPI,
  MultimodalLiveResponseType,
} from "../lib/gemini-live/geminilive.js";
import { AudioStreamer, AudioPlayer, VideoStreamer } from "../lib/gemini-live/mediaUtils.js";
import { TalkingHead } from "@met4citizen/talkinghead";


class ViewLola extends HTMLElement {
  constructor() {
    super();
    this._profile = null;
    this._systemInstruction = null;
    this.head = null;
    this.videoStreamer = null;
    this.cameraActive = false;
  }

  connectedCallback() {
    this.showProfilePicker();
  }

  disconnectedCallback() {
    if (this.audioStreamer) this.audioStreamer.stop();
    if (this.videoStreamer) this.videoStreamer.stop();
    if (this.client) this.client.disconnect();
    if (this.head) this.head.isSpeaking = false;
  }

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
      this.querySelector("#profiles-loading").textContent = "Failed to load profiles: " + e.message;
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
      const l1 = p.profile?.l1 === "en" ? "English" : p.profile?.l1 === "ko" ? "Korean" : "Japanese";
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
      card.addEventListener("mouseenter", () => { card.style.borderColor = p.color; card.style.transform = "translateY(-3px)"; });
      card.addEventListener("mouseleave", () => { card.style.borderColor = p.color + "33"; card.style.transform = "translateY(0)"; });
      card.addEventListener("click", () => {
        this._profile = p.profile;
        this._systemInstruction = p.system_instruction;
        this._profileLabel = p.label;
        this.showSession();
      });
      container.appendChild(card);
    });
  }

  async showSession() {
    this.innerHTML = `
      <style>
        .lola-session { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 16px; gap: 12px; }
        .lola-avatar-container { width: 100%; max-width: 480px; height: 360px; border-radius: var(--radius-lg); overflow: hidden; background: #1a1a2e; position: relative; }
        .lola-controls { display: flex; gap: 12px; align-items: center; }
        .lola-btn { padding: 14px 32px; border-radius: var(--radius-full); border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 1rem; }
        .lola-btn-primary { background: var(--color-accent-primary); color: white; }
        .lola-btn-primary.active { background: var(--color-danger, #e74c3c); }
        .lola-btn-secondary { background: var(--color-surface); color: var(--color-text-main); border: 1px solid var(--glass-border); }
        .lola-btn-secondary.active { background: #2196F3; color: white; border-color: #2196F3; }
        .lola-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .lola-status { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; height: 1.2em; }
        .lola-camera-preview { position: absolute; bottom: 8px; right: 8px; width: 120px; height: 90px; border-radius: 8px; overflow: hidden; border: 2px solid rgba(255,255,255,0.3); z-index: 5; }
        .lola-camera-preview video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .lola-profile-badge { font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full); background: var(--color-surface); border: 1px solid var(--glass-border); }
      </style>

      <div class="lola-session">
        <div style="display: flex; align-items: center; gap: 12px; width: 100%; max-width: 600px;">
          <button id="lola-back" style="background: transparent; border: none; cursor: pointer; padding: 8px; opacity: 0.7; color: var(--color-text-main);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <span class="lola-profile-badge">${this._profileLabel}</span>
          <span class="lola-status" id="lola-status"></span>
        </div>

        <div class="lola-avatar-container" id="lola-avatar">
          <div id="lola-camera-preview" class="lola-camera-preview" style="display:none;"></div>
        </div>

        <div style="width: 100%; max-width: 600px; height: 80px; display: flex; align-items: center; justify-content: center;">
          <audio-visualizer id="user-viz"></audio-visualizer>
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

    this.querySelector("#lola-start").addEventListener("click", () => this.toggleSession());
    this.querySelector("#lola-camera").addEventListener("click", () => this.toggleCamera());

    // Initialize TalkingHead avatar
    await this.initAvatar();
  }

  async initAvatar() {
    const container = this.querySelector("#lola-avatar");
    if (!container) return;

    try {
      this.head = new TalkingHead(container, {
        lipsyncModules: ["en"],
        cameraView: "head",
        cameraDistance: 0.1,
        cameraY: 0,
        lightAmbientIntensity: 2.5,
        lightDirectIntensity: 15,
        lightDirectPhi: 0.5,
        lightDirectTheta: 2,
        modelPixelRatio: window.devicePixelRatio || 1,
        modelFPS: 30,
        avatarIdleEyeContact: 0.6,
        avatarSpeakingEyeContact: 0.7,
        avatarSpeakingHeadMove: 0.4,
      });

      const avatarUrl = "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes&quality=high&textureAtlas=1024";
      await this.head.showAvatar(
        { url: avatarUrl, body: "F", avatarMood: "happy", lipsyncLang: "en" },
        (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            const status = this.querySelector("#lola-status");
            if (status) status.textContent = `Loading avatar ${pct}%`;
          }
        }
      );

      const status = this.querySelector("#lola-status");
      if (status) status.textContent = "Avatar ready";
    } catch (e) {
      console.error("Avatar init failed:", e);
      const status = this.querySelector("#lola-status");
      if (status) status.textContent = "Avatar failed — audio-only mode";
    }
  }

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
        } else if (response.type === MultimodalLiveResponseType.TURN_COMPLETE) {
          if (this.head) this.head.isSpeaking = false;
          const transcript = this.querySelector("live-transcript");
          if (transcript) transcript.finalizeAll();
        } else if (response.type === MultimodalLiveResponseType.INTERRUPTED) {
          if (this.head) this.head.isSpeaking = false;
          if (this.audioPlayer) this.audioPlayer.interrupt();
        } else if (response.type === MultimodalLiveResponseType.INPUT_TRANSCRIPTION) {
          const transcript = this.querySelector("live-transcript");
          if (transcript) transcript.addInputTranscript(response.data.text, response.data.finished);
        } else if (response.type === MultimodalLiveResponseType.OUTPUT_TRANSCRIPTION) {
          const transcript = this.querySelector("live-transcript");
          if (transcript) transcript.addOutputTranscript(response.data.text, response.data.finished);
        }
      };

      this.client.onError = (e) => console.error("Gemini error:", e);
      this.client.onClose = () => {
        status.textContent = "Disconnected";
        this.sessionActive = false;
      };

      // Get auth token (simple mode sends null)
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

      // Connect user visualizer
      const userViz = this.querySelector("#user-viz");
      if (userViz && this.audioStreamer.audioContext && this.audioStreamer.source) {
        userViz.connect(this.audioStreamer.audioContext, this.audioStreamer.source);
      }

      // Audio playback via AudioPlayer (reliable).
      this.audioPlayer = new AudioPlayer();
      await this.audioPlayer.init();

      // Tap into audio output with AnalyserNode for real-time lip sync
      this.analyser = this.audioPlayer.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.4;
      this._analyserData = new Uint8Array(this.analyser.frequencyBinCount);
      // Reroute: worklet → gain → analyser → destination
      this.audioPlayer.gainNode.disconnect();
      this.audioPlayer.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioPlayer.audioContext.destination);

      // Start lip sync loop — reads actual playback volume via AnalyserNode
      this.startLipSyncLoop();

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

  startLipSyncLoop() {
    if (this._lipSyncRunning) return;
    this._lipSyncRunning = true;

    const animate = () => {
      if (!this._lipSyncRunning) return;

      // Read actual playback volume from AnalyserNode
      let vol = 0;
      if (this.analyser && this._analyserData) {
        this.analyser.getByteFrequencyData(this._analyserData);
        // Average low-mid frequencies (voice range ~80-3000Hz)
        let sum = 0;
        const bins = Math.min(32, this._analyserData.length);
        for (let i = 1; i < bins; i++) sum += this._analyserData[i];
        vol = sum / (bins - 1) / 255; // Normalize to 0-1
      }

      const mt = this.head?.mtAvatar;
      if (mt && vol > 0.02) {
        this.head.isSpeaking = true;
        // Map volume to viseme morph targets with needsUpdate flag
        if (mt["viseme_aa"]) { mt["viseme_aa"].newvalue = vol * 0.8; mt["viseme_aa"].needsUpdate = true; }
        if (mt["viseme_O"]) { mt["viseme_O"].newvalue = vol * 0.4; mt["viseme_O"].needsUpdate = true; }
        if (mt["viseme_I"]) { mt["viseme_I"].newvalue = vol * 0.2; mt["viseme_I"].needsUpdate = true; }
        if (mt["jawOpen"]) { mt["jawOpen"].newvalue = vol * 0.6; mt["jawOpen"].needsUpdate = true; }
      } else if (mt) {
        // Silence — close mouth
        if (mt["viseme_aa"]) { mt["viseme_aa"].newvalue = 0; mt["viseme_aa"].needsUpdate = true; }
        if (mt["viseme_O"]) { mt["viseme_O"].newvalue = 0; mt["viseme_O"].needsUpdate = true; }
        if (mt["viseme_I"]) { mt["viseme_I"].newvalue = 0; mt["viseme_I"].needsUpdate = true; }
        if (mt["jawOpen"]) { mt["jawOpen"].newvalue = 0; mt["jawOpen"].needsUpdate = true; }
      }

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  stopLipSyncLoop() {
    this._lipSyncRunning = false;
    this.analyser = null;
    this._analyserData = null;
  }

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
      const videoEl = await this.videoStreamer.start({ fps: 1, width: 640, height: 480, quality: 0.7 });

      // Show preview
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
    this.stopLipSyncLoop();
    if (this.head) {
      this.head.isSpeaking = false;
    }
    if (this.audioPlayer) {
      this.audioPlayer.interrupt();
      this.audioPlayer = null;
    }

    const userViz = this.querySelector("#user-viz");
    if (userViz?.disconnect) userViz.disconnect();

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
