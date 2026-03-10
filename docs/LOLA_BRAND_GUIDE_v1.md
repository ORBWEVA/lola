# LoLA — Brand Guide (v1.0 — 2026-03-03)

**Status:** CANONICAL — the definitive visual identity reference for LoLA  
**Relationship:** LoLA is a sub-brand of LokaLingo. Shared DNA, different expression.  
**Author:** Ryan Ahamer / Claude.ai (Opus 4.6)

---

## Brand Relationship

LokaLingo is the parent brand — professional, educational, light, trustworthy. Designed for educators and school owners making purchasing decisions.

LoLA is the consumer-facing coaching experience — immersive, personal, dark, intimate. Designed for learners who want to feel like they're talking to someone, not using a platform.

The connection between them should be felt, not forced. Someone who knows LokaLingo should sense the family resemblance in LoLA's colors and typography without needing it explained.

---

## Design Philosophy

**"A conversation, not a classroom."**

Every design decision serves one question: does this make the learner feel like they're in a personal coaching session, or does it remind them they're using an app?

| Principle | What It Means |
|-----------|---------------|
| **Immersive over informational** | The session experience fills the screen. The avatar is the interface. Chrome dissolves. |
| **Dark as default** | Dark surfaces reduce interface awareness and foreground the avatar and content. Light is used for emphasis, not as a base. |
| **Warm technology** | Every element that could feel cold or technical (credit counters, loading states, error messages) is softened with rounded forms, gentle animations, and human language. |
| **Avatar-first** | The avatar character is the visual anchor of every screen. Layouts, colors, and spacing serve the avatar, not the other way around. |
| **Earned complexity** | New users see the minimum. Depth reveals itself over time — session history, reports, learning documents, credit analytics. |

---

## Color System

### Evolution from LokaLingo

| LokaLingo | → | LoLA | Logic |
|-----------|---|------|-------|
| Loka Navy `#0C1775` | → | LoLA Deep `#0a0a1a` | Navy becomes the darkness itself — deepened and desaturated as the primary background |
| Loka Red `#ED1E68` | → | LoLA Rose `#ff4d6d` | Red warms and brightens for dark surfaces — still energetic, but more approachable |
| Loka Blue `#32AFFF` | → | LoLA Sky `#4cc9f0` | Blue softens slightly — less corporate, more friendly, excellent readability on dark |
| — | → | LoLA Indigo `#4361ee` | New: bridges the Navy heritage into an active accent for interactive elements |

### Full Palette

#### Backgrounds (dark-first)

| Token | Hex | Usage |
|-------|-----|-------|
| `--lola-bg` | `#0a0a1a` | Primary background. Derived from Loka Navy, near-black with a subtle blue undertone. |
| `--lola-surface` | `#12122a` | Cards, panels, elevated surfaces. One step lighter than bg. |
| `--lola-surface-2` | `#1a1a3a` | Hover states, active cards, secondary elevation. |
| `--lola-surface-3` | `#22224a` | Tertiary surfaces, modal backgrounds, tooltips. |

#### Brand Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--lola-indigo` | `#4361ee` | 67, 97, 238 | Primary interactive: buttons, links, active states, focus rings. The "action" color. |
| `--lola-rose` | `#ff4d6d` | 255, 77, 109 | CTA accent: primary buttons, errors, warnings, credit alerts, corrections in transcripts. Evolved from Loka Red. |
| `--lola-sky` | `#4cc9f0` | 76, 201, 240 | Secondary accent: credits, progress, success states, waveform, links. Evolved from Loka Blue. |

#### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--lola-success` | `#06d6a0` | Correct answers, session complete, positive feedback, active mic |
| `--lola-warning` | `#ffd166` | Low credits, gentle prompts, attention-needed states |
| `--lola-error` | `#ef476f` | Errors, corrections in transcript, critical credit level |
| `--lola-info` | `#4cc9f0` | Informational, same as sky — neutral positive |

#### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--lola-text` | `#f0f0f8` | Primary text. Slightly warm white. |
| `--lola-text-secondary` | `#9595b0` | Secondary text, descriptions, metadata. |
| `--lola-text-muted` | `#555575` | Tertiary text, placeholders, disabled states. |
| `--lola-text-inverse` | `#0a0a1a` | Text on light backgrounds (rare — buttons, badges). |

#### Overlay and Glass

| Token | Value | Usage |
|-------|-------|-------|
| `--lola-overlay` | `rgba(10, 10, 26, 0.7)` | Session overlay, modal backdrops |
| `--lola-glass` | `rgba(18, 18, 42, 0.65)` | Glassmorphism panels (speech bubbles, credit pill, burger menu) |
| `--lola-glass-border` | `rgba(255, 255, 255, 0.08)` | Subtle border on glass elements |
| `--lola-glass-blur` | `12px` | Backdrop-filter blur amount |

### Color Usage Rules

1. **Indigo is the workhorse.** Buttons, links, active states, focus rings, selection highlights. It carries the interaction.
2. **Rose is the punctuation.** CTAs, corrections, credits running low, the moments that demand attention. Use sparingly — if everything is rose, nothing is.
3. **Sky is the reward.** Credit balance, correct answers, session complete, the waveform animation. It should feel positive when the user sees it.
4. **Success green** appears only for definitive positive states (correct answer, session saved). It should feel like a gift.
5. **Never use pure white (#FFFFFF) for backgrounds.** The warmest surface is `--lola-surface-3`. White is reserved for text.
6. **Gradient usage:** Subtle gradients are encouraged for depth (e.g., background → surface transitions). The primary brand gradient is `linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)` — Indigo to Sky. Use for hero elements, progress bars, and featured sections.

---

## Typography

### Font Stack

LoLA inherits Exo 2 from LokaLingo as the shared DNA link, but uses it differently — weighted toward lighter, more elegant settings on dark backgrounds.

| Role | Font | Weights | Fallback |
|------|------|---------|----------|
| **Display & Headings** | Exo 2 | 600, 700 | system-ui, sans-serif |
| **Body text** | Exo 2 | 300, 400 | system-ui, sans-serif |
| **Labels & Data** | Space Mono | 400, 700 | monospace |
| **Japanese text** | Noto Sans JP | 400, 500, 700 | Exo 2, sans-serif |

**Why Space Mono for labels:** The coaching product shows credits, session timers, data points, and code-like identifiers. A monospace font for these elements creates visual separation between "content" and "chrome" — the learner reads Exo 2, the system speaks in Space Mono.

### Type Scale

| Element | Font | Weight | Size (Desktop) | Size (Mobile) | Line Height | Letter Spacing |
|---------|------|--------|----------------|---------------|-------------|----------------|
| H1 (Hero) | Exo 2 | 700 | 48px / 3rem | 32px / 2rem | 1.1 | -0.5px |
| H2 (Section) | Exo 2 | 700 | 36px / 2.25rem | 24px / 1.5rem | 1.2 | -0.3px |
| H3 (Subsection) | Exo 2 | 600 | 24px / 1.5rem | 20px / 1.25rem | 1.3 | -0.2px |
| H4 (Card title) | Exo 2 | 600 | 18px / 1.125rem | 16px / 1rem | 1.4 | 0 |
| Body | Exo 2 | 400 | 16px / 1rem | 15px / 0.9375rem | 1.6 | 0 |
| Body Light | Exo 2 | 300 | 16px / 1rem | 15px / 0.9375rem | 1.6 | 0.2px |
| Small | Exo 2 | 400 | 14px / 0.875rem | 13px / 0.8125rem | 1.5 | 0 |
| Label | Space Mono | 400 | 11px / 0.6875rem | 10px / 0.625rem | 1.4 | 2px (uppercase) |
| Data | Space Mono | 700 | 22px / 1.375rem | 18px / 1.125rem | 1.2 | 0 |
| Caption | Exo 2 | 300 | 12px / 0.75rem | 11px / 0.6875rem | 1.5 | 0.5px |

### Typography Rules

1. **Headings are tight.** Negative letter-spacing on H1-H3 creates a premium feel on dark backgrounds.
2. **Body is light.** Weight 300-400, not 500+. Light text on dark backgrounds reads better at lighter weights.
3. **Labels are uppercase Space Mono.** Always uppercase, always tracked wide (2px+). This is how the system "speaks" — credits, session time, section labels.
4. **Data is bold Space Mono.** Credit counts, session minutes, scores. Large, bold, monospace. The user should be able to read these at a glance.
5. **Japanese text uses Noto Sans JP** with `word-break: keep-all` and `line-break: strict`. Falls back to Exo 2.
6. **Never bold body text** for emphasis on dark backgrounds — use color (rose or sky) instead. Bold on dark can feel heavy.

---

## Spacing System

8pt grid inherited from LokaLingo. All spacing derives from multiples of 8:

```
4px  / 8px  / 12px / 16px / 24px / 32px / 48px / 64px / 80px / 96px
0.5  / 1    / 1.5  / 2    / 3    / 4    / 6    / 8    / 10   / 12    (Tailwind units)
```

**LoLA-specific spacing philosophy:** Generous on mobile session screens (the avatar needs room to breathe). Tighter on dashboard and data screens (information density matters when reviewing sessions).

---

## Border Radius

| Element | Radius | Tailwind |
|---------|--------|----------|
| Buttons | 8px | `rounded-lg` |
| Cards | 16px | `rounded-2xl` |
| Pills / Badges | 99px (full) | `rounded-full` |
| Modals | 20px | `rounded-[20px]` |
| Input fields | 12px | `rounded-xl` |
| Avatar images | 50% (circle) | `rounded-full` |
| Phone frame (session) | 0 (full-screen) | `rounded-none` |

---

## Shadows and Elevation

Dark interfaces need subtle elevation cues — shadows don't work the same as on light backgrounds.

| Level | CSS | Usage |
|-------|-----|-------|
| Level 0 (flat) | none | Background elements, inline content |
| Level 1 (raised) | `0 1px 3px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05) inset` | Cards, buttons at rest |
| Level 2 (elevated) | `0 4px 12px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05) inset` | Dropdowns, hover cards |
| Level 3 (floating) | `0 8px 24px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.08) inset` | Modals, credit gate, phone frames |
| Glow (accent) | `0 0 20px rgba(67,97,238,0.25)` | Active buttons, focus states, featured elements |

**Key insight:** On dark backgrounds, the inner white border (`inset`) is more important than the outer shadow for creating perceived depth.

---

## Component Patterns

### Buttons

| Type | Background | Text | Border | Usage |
|------|-----------|------|--------|-------|
| Primary | `--lola-indigo` | White | None | Main actions: Start Session, Sign Up, Confirm |
| CTA | `--lola-rose` | White | None | High-emphasis: Top Up Credits, Talk to Sakura |
| Secondary | Transparent | `--lola-text-secondary` | `1px solid --lola-surface-3` | Secondary actions: View Transcript, Settings |
| Ghost | Transparent | `--lola-text-secondary` | None | Tertiary: Cancel, Skip, Maybe Later |

All buttons: `border-radius: 8px`, `padding: 10px 20px`, `font-weight: 500`, `font-size: 14px`. Hover: lighten background 8%. Active: darken 5%. Transition: `all 0.2s ease`.

### Cards

```css
.lola-card {
  background: var(--lola-surface);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  transition: border-color 0.2s ease;
}
.lola-card:hover {
  border-color: rgba(67, 97, 238, 0.3);
}
```

### Glass Panels (session overlay elements)

```css
.lola-glass {
  background: var(--lola-glass);
  backdrop-filter: blur(var(--lola-glass-blur));
  -webkit-backdrop-filter: blur(var(--lola-glass-blur));
  border: 1px solid var(--lola-glass-border);
  border-radius: 12px;
}
```

Used for: credit pill, burger menu panel, speech bubbles during session, any UI element overlaid on the avatar.

### Credit Pill

```css
.credit-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--lola-glass);
  backdrop-filter: blur(12px);
  padding: 6px 14px;
  border-radius: 99px;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--lola-text);
  border: 1px solid var(--lola-glass-border);
}
.credit-pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--lola-sky);
  box-shadow: 0 0 8px rgba(76, 201, 240, 0.4);
}
/* Warning state: < 5 credits */
.credit-pill.warning .dot {
  background: var(--lola-warning);
  box-shadow: 0 0 8px rgba(255, 209, 102, 0.4);
  animation: pulse 1.5s ease-in-out infinite;
}
/* Critical state: < 2 credits */
.credit-pill.critical {
  background: rgba(239, 71, 111, 0.2);
  border-color: rgba(239, 71, 111, 0.3);
}
.credit-pill.critical .dot {
  background: var(--lola-error);
  box-shadow: 0 0 8px rgba(239, 71, 111, 0.5);
}
```

### Audio Waveform

```css
.waveform-bar {
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(to top, var(--lola-indigo), var(--lola-sky));
  transition: height 0.1s ease;
}
/* Idle state (not speaking) */
.waveform-bar.idle {
  height: 4px;
  opacity: 0.3;
}
/* Active state (avatar speaking) */
.waveform-bar.active {
  animation: waveform 0.6s ease-in-out infinite alternate;
  opacity: 0.85;
}
```

The waveform gradient (Indigo → Sky) is a signature brand element. It should appear consistently wherever audio is visualized.

---

## Iconography

| Rule | Detail |
|------|--------|
| Icon library | Lucide React (inherited from LokaLingo) |
| Icon style | 1.5px stroke weight, rounded caps and joins |
| Icon size | 16px (inline), 20px (buttons), 24px (navigation), 32px (feature cards) |
| Icon color | `--lola-text-secondary` default, `--lola-indigo` for active/interactive |
| Emoji usage | Permitted in avatar speech bubbles and coaching content only. Never in UI chrome, navigation, or labels. |

---

## Motion and Animation

| Element | Property | Duration | Easing | Notes |
|---------|----------|----------|--------|-------|
| Page transitions | opacity, transform | 300ms | ease-out | Fade up (translateY: 12px → 0) |
| Card hover | border-color | 200ms | ease | Subtle indigo border glow |
| Button hover | background, box-shadow | 150ms | ease | Quick response |
| Avatar expression | opacity (crossfade) | 400ms | ease-in-out | Smooth carousel between expressions |
| Waveform bars | height, scaleY | 60-100ms | ease | Rapid response to audio amplitude |
| Credit pill state | background, border-color | 300ms | ease | Smooth transition between normal/warning/critical |
| Toast notifications | translateY, opacity | 250ms in / 200ms out | ease-out / ease-in | Slide up from bottom |
| Modal/Credit gate | opacity, scale | 250ms | ease-out | Scale from 0.95 → 1.0 with fade |
| Skeleton loading | opacity | 1.5s | ease-in-out, infinite | Pulse between 0.3 and 0.7 opacity |

**Animation philosophy:** Animations should feel like breathing, not bouncing. Prefer ease and ease-out over spring physics. The product should feel calm and focused, not playful.

---

## Session Screen Specifications

The session is the hero experience. Every design choice here serves immersion.

### Mobile Session Layout

```
┌────────────────────────────┐
│ ☰                 [12 ●]  │  ← Glass: burger + credit pill
│                            │
│                            │
│    [AVATAR PORTRAIT]       │  ← Full viewport, object-fit: cover
│    (crossfade carousel)    │
│                            │
│                            │
│  ┌──────────────────────┐  │
│  │ SAKURA               │  │  ← Glass speech bubble
│  │ Great attempt! Try   │  │
│  │ "I went yesterday"   │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ ▁▃▅▇▅▃▁▃▅▇▅▃▁▃▅▇▅  │  │  ← Waveform (Indigo→Sky gradient)
│  └──────────────────────┘  │
└────────────────────────────┘

Overlay gradient:
  top: rgba(10,10,26,0.5) → transparent (for burger/credit readability)
  bottom: transparent → rgba(10,10,26,0.7) (for speech bubble/waveform)
```

### Desktop Session Layout

```
┌──────────────────────────────────────────────┐
│  LoLA                              [12 ●]   │  ← Top bar
├────────────────────┬─────────────────────────┤
│                    │ Live Transcript          │
│  [AVATAR]          │                          │
│  (portrait)        │ Sakura: "Great try!..."  │
│                    │ You: "I went yesterday"  │
│  ▁▃▅▇▅▃▁▃▅▇▅     │ Sakura: "Perfect! 🎯"   │
│  Sakura · Coach    │                          │
│                    │                          │
├────────────────────┼─────────────────────────┤
│                    │ 🟢 Mic active  [End]    │
└────────────────────┴─────────────────────────┘

Left panel: 35-40% width, avatar with waveform below
Right panel: 60-65% width, scrolling transcript
Divider: 1px solid rgba(255,255,255,0.06)
```

---

## CSS Variables (Complete)

Copy this into the project's `globals.css`:

```css
:root {
  /* Backgrounds */
  --lola-bg: #0a0a1a;
  --lola-surface: #12122a;
  --lola-surface-2: #1a1a3a;
  --lola-surface-3: #22224a;

  /* Brand Colors */
  --lola-indigo: #4361ee;
  --lola-indigo-hover: #5271ff;
  --lola-indigo-active: #3a56d4;
  --lola-rose: #ff4d6d;
  --lola-rose-hover: #ff6680;
  --lola-rose-active: #e64460;
  --lola-sky: #4cc9f0;
  --lola-sky-hover: #66d4f4;
  --lola-sky-active: #3fb8dd;

  /* Semantic */
  --lola-success: #06d6a0;
  --lola-warning: #ffd166;
  --lola-error: #ef476f;
  --lola-info: #4cc9f0;

  /* Text */
  --lola-text: #f0f0f8;
  --lola-text-secondary: #9595b0;
  --lola-text-muted: #555575;
  --lola-text-inverse: #0a0a1a;

  /* Glass / Overlay */
  --lola-overlay: rgba(10, 10, 26, 0.7);
  --lola-glass: rgba(18, 18, 42, 0.65);
  --lola-glass-border: rgba(255, 255, 255, 0.08);
  --lola-glass-blur: 12px;

  /* Borders */
  --lola-border: rgba(255, 255, 255, 0.06);
  --lola-border-hover: rgba(67, 97, 238, 0.3);

  /* Brand Gradient */
  --lola-gradient: linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%);
  --lola-gradient-rose: linear-gradient(135deg, #ff4d6d 0%, #ff6b9d 100%);

  /* Spacing (8pt grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 99px;

  /* Shadows */
  --shadow-1: 0 1px 3px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05) inset;
  --shadow-2: 0 4px 12px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05) inset;
  --shadow-3: 0 8px 24px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.08) inset;
  --shadow-glow: 0 0 20px rgba(67,97,238,0.25);
}
```

---

## Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        lola: {
          bg: '#0a0a1a',
          surface: '#12122a',
          'surface-2': '#1a1a3a',
          'surface-3': '#22224a',
          indigo: '#4361ee',
          'indigo-hover': '#5271ff',
          'indigo-active': '#3a56d4',
          rose: '#ff4d6d',
          'rose-hover': '#ff6680',
          'rose-active': '#e64460',
          sky: '#4cc9f0',
          'sky-hover': '#66d4f4',
          'sky-active': '#3fb8dd',
          success: '#06d6a0',
          warning: '#ffd166',
          error: '#ef476f',
          text: '#f0f0f8',
          'text-secondary': '#9595b0',
          'text-muted': '#555575',
          'text-inverse': '#0a0a1a',
        },
      },
      fontFamily: {
        display: ['Exo 2', 'system-ui', 'sans-serif'],
        body: ['Exo 2', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        jp: ['Noto Sans JP', 'Exo 2', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'modal': '20px',
      },
      backdropBlur: {
        'glass': '12px',
      },
      backgroundImage: {
        'lola-gradient': 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
        'lola-gradient-rose': 'linear-gradient(135deg, #ff4d6d 0%, #ff6b9d 100%)',
      },
    },
  },
  plugins: [],
}
export default config
```

---

## Voice and Tone

### Product Copy

| Context | Tone | Example |
|---------|------|---------|
| Landing page | Confident, aspirational | "Every learner deserves a coach who understands how they think." |
| Onboarding | Warm, encouraging | "Let's figure out how you learn best. This takes 30 seconds." |
| Session start | Personal, calm | "Hey! I'm Sakura. What would you like to practice today?" |
| Credit warning | Gentle, not pushy | "You have 2 minutes left. Want to keep going?" |
| Error/correction | Supportive, specific | "Close! Try 'went' instead of 'go' — past tense changes the verb." |
| Empty state | Inviting | "No sessions yet. Ready for your first conversation?" |
| Success | Celebratory but brief | "Nice work today. Your report is ready." |

### Vocabulary

| Use | Avoid |
|-----|-------|
| Coach, coaching | Tutor, tutoring |
| Session | Lesson, class |
| Avatar | Bot, AI, assistant |
| Credits | Tokens, coins, points |
| Practice | Study, drill |
| Conversation | Exercise, task |
| Your coach | The AI, the system |
| Adapted to you | Personalized (overused) |

---

## Logo and Wordmark

LoLA uses a wordmark: **LoLA** in Exo 2, weight 700. The "L" and "A" are capitalized; "o" and "L" are lowercase. This creates a distinctive rhythm.

Usage rules:
- Minimum size: 24px height
- Clear space: equal to the height of the "L" on all sides
- On dark backgrounds: `--lola-text` (#f0f0f8)
- On light backgrounds (rare): `--lola-bg` (#0a0a1a)
- The brand gradient may be applied to the wordmark for hero contexts: `background: var(--lola-gradient); -webkit-background-clip: text;`
- Relationship mark: "LoLA by LokaLingo" in contexts where the parent brand adds credibility (e.g., hackathon submissions, investor materials). "by LokaLingo" is set in Exo 2, weight 300, `--lola-text-secondary`.

---

## Accessibility

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Color contrast | WCAG AA minimum (4.5:1 for text) | `--lola-text` on `--lola-bg` = 15.2:1 ✓ |
| Focus indicators | Visible on all interactive elements | 2px solid `--lola-indigo` with 2px offset |
| Reduced motion | Respect `prefers-reduced-motion` | Disable waveform, carousel, and transition animations |
| Screen readers | All interactive elements labeled | `aria-label` on credit pill, burger menu, waveform |
| Touch targets | 44×44px minimum | All buttons and interactive elements |
| Font scaling | Support up to 200% browser zoom | Use rem units, test at 200% |

---

*This brand guide is the visual identity reference for all LoLA surfaces: the Next.js web app, social media content templates, demo videos, hackathon submissions, and future native apps. When this guide conflicts with inherited LokaLingo styles, this guide wins for LoLA contexts.*
