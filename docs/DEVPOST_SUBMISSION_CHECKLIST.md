# Devpost Submission Checklist — LoLA

Paste-ready fields for the [Gemini Live Agent Challenge](https://googledevelopers.devpost.com/) submission form.

---

## Basic Info

- **Project Name:** LoLA — Loka Learning Avatar
- **Tagline:** Adaptive language coaching that adapts to how your brain learns — not just what you say.
- **Category:** Live Agents

## Description

> Copy all sections from `docs/DEVPOST_DESCRIPTION.md` — Inspiration, What it does, How we built it, Challenges we ran into, Accomplishments, What we learned, What's next for LoLA, Built With, Third-Party Resources.

## Built With (paste as comma-separated tags)

```
gemini-live-api, google-genai-sdk, google-cloud-run, fastapi, python, javascript, web-components, vite, web-audio-api, flux-kontext, cloud-build
```

## Links

| Field | Value |
|-------|-------|
| GitHub Repo | https://github.com/ORBWEVA/lola |
| Live Demo | https://lola-bivpadh7zq-uc.a.run.app |
| YouTube Video | **TODO** — upload demo video, paste public URL |
| Blog Post | `docs/BLOG_POST.md` — publish to Medium or dev.to, paste URL |

## Uploads

| Item | Local Path | Notes |
|------|-----------|-------|
| Architecture Diagram | `docs/lola-architecture.png` | 1200x900, branded, includes Report Engine |
| Cover Image | `screenshots/landing.png` | Devpost gallery |
| Screenshots | `screenshots/` | landing, onboarding, session, split-screen, dashboard, report-detail |

## Third-Party Disclosure (paste verbatim)

> This project is built on a fork of Google's Immergo language learning demo (open-source, Apache 2.0 license, listed as an official hackathon resource) by Zack Akil. The 3D avatar rendering uses the TalkingHead library (MIT license) by Mika Suominen (met4citizen) with the HeadAudio module for real-time lip-sync. Avatar models are created via Ready Player Me. The adaptive coaching engine, personality profiling system, 12-principle coaching framework, multilingual L1 interference patterns, bilingual coaching logic, vision-aware coaching rules, avatar mood mapping, split-screen demonstration view, and all system instruction generation logic are original work created during the contest period.

## Cloud Deployment Proof

- [ ] Live demo URL accessible to judges
- [ ] Cloud Run service visible in GCP console
- [ ] `cloudbuild.yaml` in repo root (IaC bonus)
- [ ] README documents deployment steps

## Video Requirements

- [x] Under 4 minutes (3:35 @ 30fps = 6450 frames)
- [ ] Hosted on YouTube or Vimeo (public or unlisted)
- [x] Shows: onboarding flow, coaching session, split-screen demo, dashboard & reports
- [x] Mentions Gemini Live API usage

## Bonus Points Checklist

| Bonus | Points | Status |
|-------|--------|--------|
| Blog post (Medium/dev.to) | +0.6 | DONE — `docs/BLOG_POST.md` (real image URLs, coaching reports section) |
| Automated cloud deployment (IaC) | +0.2 | DONE — `cloudbuild.yaml` |
| Architecture diagram | +0.2 | DONE — `docs/lola-architecture.png` (updated with Report Engine) |

## Pre-Submit Final Checks

- [ ] All Devpost text fields filled
- [ ] Video uploaded and URL pasted
- [ ] Blog post published and URL pasted
- [ ] GitHub repo is public
- [x] Live demo loads without errors
- [x] Architecture diagram uploaded (updated with Report Engine)
- [x] Third-party disclosure included
- [ ] "Live Agents" category selected
- [x] Screenshots captured (`scripts/capture-demo.js`)
- [x] Remotion video wired with real captures
