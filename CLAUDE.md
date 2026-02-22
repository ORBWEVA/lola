# LoLA (Loka Learning Avatar) — Claude Code Project Instructions

## Project Identity
- **Name**: LoLA (Loka Learning Avatar)
- **Local path**: `~/lola`
- **Remote**: TBD (will be public GitHub repo for hackathon submission)
- **Base**: Forked from Google's Immergo language learning demo (Apache 2.0)

## Hackathon Deadlines
- **Sabrina/Marcin Hackathon**: March 6-8, 2026
- **Gemini Live Agent Challenge**: March 16, 2026, 5:00 PM PT (submit by March 14 self-imposed)

## Tech Stack
- **Backend**: Python 3.10+ / FastAPI / `google-genai` SDK
- **Frontend**: Vanilla JS / Vite / Web Components / Web Audio API
- **LLM**: Gemini 2.5 Flash Native Audio (`gemini-2.5-flash-native-audio-preview-12-2025`)
- **Avatar**: TalkingHead v1.7 (`@met4citizen/talkinghead`) + ThreeJS
- **Deployment target**: Google Cloud Run

## Dev Environment

### Starting dev server
```bash
cd ~/lola
./scripts/dev.sh
```
This starts both:
- **Backend** (uvicorn): port 8000 (uses `venv/bin/python` if venv exists)
- **Frontend** (Vite): port 5173 (proxies `/api` and `/ws` to backend)

### Python venv
The virtualenv is at `venv/` (NOT `.venv/`). Activate with:
```bash
source venv/bin/activate
```

### Environment variables
Copy `.env.example` to `.env`. Key vars:
- `GEMINI_API_KEY` — Google AI Studio API key (required for local dev)
- `DEV_MODE=true` — skips reCAPTCHA + uses lenient rate limiting
- `SESSION_TIME_LIMIT=600` — session length in seconds (default 180 in prod)

### Build
```bash
npm run build    # Vite builds to dist/
```

## Architecture

### Backend (`server/`)
| File | Purpose |
|------|---------|
| `main.py` | FastAPI app — REST routes, WebSocket endpoint, auth, static serving |
| `gemini_live.py` | Gemini Live API session manager — proxies audio/video/text between client and Gemini |
| `config_utils.py` | API key vs Vertex AI mode detection, model name resolution |
| `profile_engine.py` | 5-question onboarding → coaching profile + 4 pre-built demo profiles (A/B/C/D) |
| `instruction_engine.py` | Profile + L1 patterns + 12 principles → weighted system instruction |
| `principles.py` | 12-principle coaching framework as structured weighted data |
| `l1_patterns/` | L1 interference patterns: `japanese.py`, `korean.py`, `english.py` |

### Frontend (`src/`)
| File | Purpose |
|------|---------|
| `components/view-lola.js` | Main LoLA session — avatar, voice chat, profile picker, lip sync |
| `components/app-root.js` | Root component / SPA router |
| `lib/gemini-live/geminilive.js` | Frontend Gemini Live API client (WebSocket, setup config) |
| `lib/gemini-live/mediaUtils.js` | AudioPlayer, AudioRecorder, camera utilities |

### Audio pipeline
```
Browser mic → capture.worklet.js → PCM → WebSocket → FastAPI → Gemini Live API
Gemini audio → WebSocket → playback.worklet.js → gainNode → AnalyserNode → speakers
                                                                    ↓
                                                              rAF lip sync loop
                                                                    ↓
                                                         TalkingHead morph targets
```

## Critical Implementation Details

### TalkingHead morph targets
Setting a morph target value requires BOTH properties:
```javascript
mt["viseme_aa"].newvalue = 0.5;
mt["viseme_aa"].needsUpdate = true;  // WITHOUT THIS, THE UPDATE IS SILENTLY SKIPPED
```
This is because `talkinghead.mjs` line 1591 has `if (!o.needsUpdate) continue;`. Five lip sync attempts failed before discovering this.

### Gemini Native Audio limitations
These features are **NOT supported** on native audio models:
- `enable_affective_dialog` — do NOT include in setup config
- `proactivity` — do NOT include in setup config

Including unsupported fields causes silent failures or inconsistent behavior.

### Temperature
Use `0.7` (not the default `1.0`). Higher temperatures cause the model to ignore system instructions inconsistently.

### Voice
Currently using `Kore` (female). Set in `view-lola.js`. The spec calls for distinct voices per coach avatar (not yet implemented).

### Both-direction language support
L1 pattern files include `target_language` and `target_native` fields. The instruction engine uses these to generate "You are LoLA, a {target_lang} coach for {l1_name} speakers." Adding a new language direction = new pattern file + new profile.

## Coding Conventions

### Frontend
- Vanilla JS with Web Components (Custom Elements) — no React/Vue/Angular
- camelCase for JS, CSS variables from `style.css`
- Mobile: use `env(safe-area-inset-*)` for fixed/absolute positioning
- UI style: glassmorphism (`backdrop-filter: blur(20px)`, `var(--glass-border)`)

### Backend
- snake_case for Python
- `async`/`await` for all I/O
- FastAPI patterns, standard logging via `logging.getLogger(__name__)`

### Commits
Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`

## Reference Documents
- `docs/LOLA_HACKATHON_SPEC.md` — build specification v2.2 (what to build, phases, submission checklist)
- `docs/LOLA_MASTER_v1.2.md` — canonical master reference (coaching philosophy, 12 principles, competitive context, actual built state)
- `GEMINI.md` — Immergo's original AI coding guide (base patterns)

## What NOT to Do
- Don't add React, Vue, or any UI framework — this is vanilla JS Web Components
- Don't use HeadAudio for lip sync — it doesn't work with our audio pipeline. Use AnalyserNode approach.
- Don't set `enable_affective_dialog` or `proactivity` in Gemini setup — not supported on native audio
- Don't use temperature > 0.7 — model ignores instructions at higher values
- Don't modify `.env` without asking
- Don't force-push to main
