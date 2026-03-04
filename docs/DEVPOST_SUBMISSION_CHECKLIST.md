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
| Architecture Diagram | `docs/lola-architecture.png` | 1600x900, branded |
| Cover Image | Use architecture diagram or screenshot | Devpost gallery |
| Screenshots | Capture from live demo | Onboarding, session, split-screen |

## Third-Party Disclosure (paste verbatim)

> This project is built on a fork of Google's Immergo language learning demo (open-source, Apache 2.0 license, listed as an official hackathon resource) by Zack Akil. The 3D avatar rendering uses the TalkingHead library (MIT license) by Mika Suominen (met4citizen) with the HeadAudio module for real-time lip-sync. Avatar models are created via Ready Player Me. The adaptive coaching engine, personality profiling system, 12-principle coaching framework, multilingual L1 interference patterns, bilingual coaching logic, vision-aware coaching rules, avatar mood mapping, split-screen demonstration view, and all system instruction generation logic are original work created during the contest period.

## Cloud Deployment Proof

- [ ] Live demo URL accessible to judges
- [ ] Cloud Run service visible in GCP console
- [ ] `cloudbuild.yaml` in repo root (IaC bonus)
- [ ] README documents deployment steps

## Video Requirements

- [ ] Under 4 minutes
- [ ] Hosted on YouTube or Vimeo (public or unlisted)
- [ ] Shows: onboarding flow, coaching session, split-screen demo, vision input
- [ ] Mentions Gemini Live API usage

## Bonus Points Checklist

| Bonus | Points | Status |
|-------|--------|--------|
| Blog post (Medium/dev.to) | +0.6 | DONE — `docs/BLOG_POST.md` |
| Automated cloud deployment (IaC) | +0.2 | DONE — `cloudbuild.yaml` |
| Architecture diagram | +0.2 | DONE — `docs/lola-architecture.png` |

## Pre-Submit Final Checks

- [ ] All Devpost text fields filled
- [ ] Video uploaded and URL pasted
- [ ] Blog post published and URL pasted
- [ ] GitHub repo is public
- [ ] Live demo loads without errors
- [ ] Architecture diagram uploaded
- [ ] Third-party disclosure included
- [ ] "Live Agents" category selected
