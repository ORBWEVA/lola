# LoLA — Gemini Live Agent Challenge: Build Plan v1.0

> CLICKUP: Mirrored — parent task 86ewvxn5t (https://app.clickup.com/t/86ewvxn5t)

**Date**: 2026-03-09
**Deadline**: March 16, 2026 (self-imposed: March 14)
**Days remaining**: 5 working days
**DT Audit**: 14/25 → Target 22/25 (+8 points)
**ClickUp List**: LoLA > Gemini Live Agent Challenge (`901816480325`)

---

## Audit Scorecard (Baseline)

| Criteria | Score | Gap |
|----------|-------|-----|
| User Clarity | 3/5 | No landing page, no avatar profiles, unclear who it's for |
| Problem Definition | 3/5 | Coaching engine is strong but invisible to judges — no visual proof |
| Solution Fit | 4/5 | Adaptive coaching works, but UX doesn't showcase it |
| Validation | 2/5 | No feedback loop, no session summary, no post-session rating |
| Iteration | 2/5 | Raw functional state — no polish pass, no error handling |
| **Total** | **14/25** | **+8 needed** |

---

## Build Priority Map

### Step 0 — Mirror to ClickUp
Create parent task + subtasks before writing any code.

---

### Step 1 — Landing Page with Video Hero
**Audit impact**: User Clarity +1, Problem Definition +1
**Time estimate**: Day 1 (6-8h)
**Port from**: `lola-platform/app/landing-client.tsx`, `HeroVideo.tsx`, `HeroSubtitles.tsx`, `HeroWaveform.tsx`, `use-video-subtitles.ts`

Build a new `view-landing.js` Web Component that replaces `view-splash.js`:

| Feature | Source | Adaptation |
|---------|--------|------------|
| Full-viewport video loop | `HeroVideo.tsx` | Single `<video>` element, same object-cover + gradient overlays |
| Word-by-word subtitles | `HeroSubtitles.tsx` + `use-video-subtitles.ts` | Port rAF sync loop to vanilla JS. Same `subtitles.json` format |
| Browser language detection | `landing-client.tsx` lines 155-159 | `navigator.language.split('-')[0]` — alternate EN/translated every loop |
| Canvas waveform | `HeroWaveform.tsx` | Port 48-bar canvas draw to vanilla JS. Energy from subtitle timing |
| Avatar dot navigation | `landing-client.tsx` lines 230-246 | Click dot → seek video to segment start |
| CTA button | `landing-client.tsx` lines 249-266 | "Start Coaching" → navigates to session or onboarding |
| Glassmorphism styling | `globals.css` `.glass`, `.gradient-btn-lg`, `.pulse-glow` | Already have matching tokens in `style.css` |

**Assets needed**:
- Combined hero video (`hero-combined.mp4`) — stitch LoLA avatar clips or record new TalkingHead clips
- `hero-combined-subtitles.json` with segment timing
- Avatar translations (8 languages) — can reuse structure from `landing-client.tsx`

**Key difference from lola-platform**: Instead of 5 pre-recorded human videos, we show the TalkingHead 3D avatar in different poses/scenes — or record the TalkingHead output as video clips. This actually demonstrates the tech better for judges.

**Alternative (faster)**: Record 3-4 screen captures of the TalkingHead avatar speaking intro lines, stitch into `hero-combined.mp4`. Subtitles from the actual audio timing.

**Done when**: Landing page loads, video plays with synced subtitles in browser language, waveform animates, dot nav works, CTA leads to session.

---

### Step 2 — Session UI Polish
**Audit impact**: Validation +1, Iteration +1
**Time estimate**: Day 2 (6-8h)
**Port from**: `lola-platform/components/session/VoiceSession.tsx`, `SessionSummary.tsx`

Refactor `view-lola.js` session view:

| Feature | Current State | Target |
|---------|--------------|--------|
| Top bar | None | Avatar name + live dot + duration timer |
| Transcript | Inline below avatar | Slide-out panel from right, auto-opens on first message, closeable |
| Waveform | Basic bars | Compact bottom bar with gradient (port `HeroWaveform` pattern) |
| Error states | Alert boxes | Full-screen branded error screens: mic_denied, connection_lost, session_failed |
| Session end | Abrupt stop | Graceful wrap-up + transition to summary |
| Hint overlay | None | "Just start talking" with fade-out after first speech |

**Also add**:
- Session timer (MM:SS) in top bar
- Mic mute/unmute toggle
- Connection status indicator

**Done when**: Session has polished top bar, transcript panel, error screens, and hint overlay.

---

### Step 3 — Session Summary + Feedback
**Audit impact**: Validation +1
**Time estimate**: Day 2 (2-3h, after Step 2)
**Port from**: `lola-platform/components/session/SessionSummary.tsx`

Build `view-summary.js` Web Component:

- Duration / messages stats (already tracked in backend `sessions/end`)
- Quick rating: Not great / Okay / Loved it (3-button)
- Optional text feedback
- POST to new `/api/sessions/feedback` endpoint
- Navigation: "Talk Again" → session, "Try Different Profile" → profile picker, "Back to Home" → landing

**Backend addition**:
- `POST /api/sessions/feedback` — stores rating + text (can be in-memory dict for hackathon, no DB needed)
- Include feedback in the post-session report generation

**Done when**: After ending a session, user sees summary with stats and can rate the experience.

---

### Step 4 — "Same Error, Different Coaching" Demo Flow
**Audit impact**: Problem Definition +1, Solution Fit +1
**Time estimate**: Day 3 (4-5h)

This is the **killer demo moment** — visually proving that LoLA adapts coaching style to the learner, not just the error.

**Implementation**:
1. Add a "Demo Mode" button on landing page (visible but subtle)
2. Demo mode presents a split-screen or sequential A/B comparison:
   - **Profile A** (Analytical learner): Makes a grammar error → LoLA responds with rule explanation, pattern breakdown, written example
   - **Profile B** (Explorer learner): Same error → LoLA responds with encouragement, contextual correction, "try saying it this way"
3. Use pre-built demo profiles (already exist in `profile_engine.py`: profiles A-D)
4. Could be:
   - **Option A**: Live side-by-side (two simultaneous sessions — complex)
   - **Option B**: Recorded clips with annotations (simpler, more reliable for demo)
   - **Option C**: Sequential — "Watch how LoLA coaches an analytical learner... now watch the same error with an explorer" (recommended)

**Recommended approach (Option C)**:
- New `view-demo.js` component
- Plays two pre-recorded session clips (screen-captured from actual LoLA sessions)
- Overlay annotations highlighting the coaching differences
- "Try it yourself" CTA at the end

**Done when**: Judge can see the same error coached two different ways in under 60 seconds.

---

### Step 5 — Vision Input "Wow Moment"
**Audit impact**: Solution Fit +1, Iteration +1
**Time estimate**: Day 3-4 (4-5h)

Gemini Live API supports multimodal input (See/Hear/Speak). This is explicitly in the judging criteria.

**Implementation**:
1. Add camera toggle button in session UI (next to mic)
2. When enabled, capture frames from `getUserMedia({ video: true })` at ~1fps
3. Send frames to Gemini via the existing WebSocket (already supported in `gemini_live.py` — just not wired to UI)
4. Update system instruction to handle vision context: "The learner is showing you something. Describe what you see and coach accordingly."
5. Use `generate_context_update('vision', ...)` from `instruction_engine.py` (already exists)

**Demo scenarios** (pick 2 for the video):
- Hold up a restaurant menu in Japanese → LoLA reads it and teaches ordering phrases
- Show handwritten notes → LoLA corrects and explains
- Point camera at a street sign → LoLA teaches relevant vocabulary

**Done when**: Camera toggle works, Gemini receives and responds to visual input naturally, at least one demo scenario is recorded.

---

### Step 6 — Creator Wizard (Adapted)
**Audit impact**: User Clarity +1
**Time estimate**: Day 4 (5-6h)
**Port from**: `lola-platform/app/creator/avatars/new/page.tsx`, `lola-platform/lib/coaching/domains.ts`

5-step wizard as `view-creator.js` Web Component:

| Step | Content | Source |
|------|---------|--------|
| 1. Name + Domain | Text input + 6 domain cards (language, fitness, sales, mentoring, support, custom) | `domains.ts` presets |
| 2. Personality | Chip selector (max 3) + auto-tagline. Domain-specific suggestions | `domains.ts` suggestedPersonalities |
| 3. Appearance | Upload avatar photo OR choose from TalkingHead presets (built-in 3D models) | New — TalkingHead has multiple base models |
| 4. Voice | Pick from Gemini voices (Kore, Puck, Charon, etc.) + preview audio | New — plays sample clips |
| 5. Review + Launch | Summary card + "Start Session" button | Simplified from lola-platform step 7 |

**Backend additions**:
- `POST /api/avatars` — saves avatar config (in-memory dict for hackathon)
- `GET /api/avatars` — list created avatars
- `GET /api/avatars/:id` — load avatar config for session
- Feed avatar config into `instruction_engine.py` for system prompt generation

**Key insight**: The creator wizard proves LoLA is a **platform**, not a single-purpose app. This addresses the "Innovation" criterion (40% of score).

**Done when**: User can create a custom avatar in 5 steps and immediately start a session with it.

---

### Step 7 — Demo Video + Submission Polish
**Audit impact**: Iteration +1 (overall polish)
**Time estimate**: Day 5 (full day)

1. **Record demo video** (3-5 min max):
   - Landing page → avatar intro with subtitles
   - Quick onboarding (pick profile or create avatar)
   - Live coaching session showing: barge-in, L1 correction, personality adaptation
   - Vision input moment (camera → menu/sign reading)
   - "Same error, different coaching" comparison
   - Session summary + feedback

2. **Blog post / write-up**:
   - Architecture diagram (update existing `docs/lola-architecture.html`)
   - Coaching philosophy (12 principles)
   - Technical deep-dive on Gemini Live API integration
   - What makes it "Live" — real-time adaptation, not scripted

3. **README polish**:
   - Clear setup instructions
   - Screenshots/GIFs
   - Link to live demo (Cloud Run)

4. **Deploy**:
   - Verify Cloud Run deployment works with all new features
   - Test on mobile (safe-area-inset, touch targets)

**Done when**: Video uploaded, blog published, README polished, Cloud Run live and working.

---

## Daily Schedule

| Day | Date | Focus | Steps |
|-----|------|-------|-------|
| 1 | Mar 10 (Mon) | Landing page | Step 0 (ClickUp) + Step 1 |
| 2 | Mar 11 (Tue) | Session UX | Step 2 + Step 3 |
| 3 | Mar 12 (Wed) | Differentiation | Step 4 + Step 5 |
| 4 | Mar 13 (Thu) | Platform proof | Step 6 + bug fixes |
| 5 | Mar 14 (Fri) | Demo + submit | Step 7 (video, blog, deploy) |
| Buffer | Mar 15-16 | Emergency fixes only | — |

---

## Target Scorecard (Post-Build)

| Criteria | Before | After | Delta | How |
|----------|--------|-------|-------|-----|
| User Clarity | 3 | 5 | +2 | Landing page (Step 1) + Creator wizard (Step 6) |
| Problem Definition | 3 | 5 | +2 | A/B coaching demo (Step 4) + Vision wow (Step 5) |
| Solution Fit | 4 | 5 | +1 | Vision input (Step 5) proves See/Hear/Speak |
| Validation | 2 | 4 | +2 | Session summary + feedback (Step 3) + polished session (Step 2) |
| Iteration | 2 | 4 | +2 | Error states, hint overlay, transcript panel (Step 2) + demo video (Step 7) |
| **Total** | **14** | **23** | **+9** | |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| TalkingHead video recording quality | Landing page looks rough | Pre-record at high quality, multiple takes, pick best |
| Vision input latency | Demo feels slow | Buffer frames, show "thinking" indicator, pick well-lit scenarios |
| Creator wizard scope creep | Eats into demo video time | Hard stop at 5 steps, no social/publish features |
| Gemini API rate limits during demo | Live demo fails | Pre-record key moments, have fallback video ready |
| Mobile layout issues | Judge tests on phone | Test early (Day 2), use existing safe-area-inset patterns |

---

## Files to Create/Modify

### New files
- `src/components/view-landing.js` — Landing page Web Component
- `src/components/view-summary.js` — Session summary Web Component
- `src/components/view-demo.js` — A/B coaching demo Web Component
- `src/components/view-creator.js` — Creator wizard Web Component
- `src/lib/subtitle-sync.js` — Subtitle sync engine (port from `use-video-subtitles.ts`)
- `src/lib/waveform.js` — Canvas waveform renderer (port from `HeroWaveform.tsx`)
- `public/hero-combined.mp4` — Stitched avatar intro video
- `public/hero-combined-subtitles.json` — Subtitle data with segments

### Modified files
- `src/components/view-lola.js` — Session UI polish (top bar, transcript panel, error states, hint overlay, camera toggle)
- `src/components/app-root.js` — Route to new views (landing, summary, demo, creator)
- `src/style.css` — Additional classes for new components
- `server/main.py` — New endpoints: `/api/sessions/feedback`, `/api/avatars` CRUD
- `server/gemini_live.py` — Wire vision frames from frontend

---

## Judging Criteria Alignment

| Google Criteria | Weight | What Addresses It |
|----------------|--------|-------------------|
| **Innovation & Multimodal UX** | 40% | Vision input (Step 5), creator wizard (Step 6), adaptive coaching visualization (Step 4), browser-language subtitles (Step 1) |
| **Technical Implementation** | 30% | 12-principle engine, L1 patterns, profile-to-instruction pipeline, Gemini Live API bidirectional audio + vision, TalkingHead lip sync |
| **Demo & Presentation** | 30% | Polished landing (Step 1), demo video (Step 7), session summary (Step 3), error handling (Step 2) |

| Live Agent Criteria | What Addresses It |
|--------------------|-------------------|
| Natural barge-in | Already works — Gemini native audio handles interruption |
| Distinct persona/voice | Creator wizard voice picker (Step 6), per-avatar system instructions |
| "Live" and context-aware | Real-time profile adaptation, vision input, mid-session context updates |
| See/Hear/Speak seamless | Camera toggle (Step 5) + audio pipeline (existing) + TalkingHead visual feedback |
