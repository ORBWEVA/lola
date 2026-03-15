#!/usr/bin/env python3
"""Generate VEO3 clips for LoLA demo video.

Usage:
    cd ~/lola
    venv/bin/python scripts/generate-veo3-clips.py

Generates all 10 clips defined in docs/DEMO_VIDEO_SCRIPT.md.
Videos are saved to video/veo3-clips/
"""

import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(override=True)

from google import genai
from google.genai import types

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not set in .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)

OUTPUT_DIR = Path("video/veo3-clips")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# All 10 clips with comprehensive prompts
CLIPS = [
    {
        "id": "1A_classroom",
        "duration": "8",
        "prompt": (
            "Cinematic wide shot of a large Japanese high school English classroom, "
            "30+ students in navy uniforms seated at wooden desks. Late afternoon golden hour "
            "light streaming through tall windows on the left side, casting long warm shadows "
            "across the room. A teacher writes English grammar on a green chalkboard. The students "
            "look disengaged — some staring out windows, one resting chin on hand. Shot on "
            "anamorphic lens with shallow depth of field, the foreground student in sharp focus, "
            "background softly blurred. Slow dolly push forward. Color grading: warm amber tones "
            "with desaturated blues. No text overlays. Photorealistic, cinematic 24fps."
        ),
    },
    {
        "id": "1B_frustrated_learner",
        "duration": "8",
        "prompt": (
            "Close-up portrait of a young Japanese woman in her mid-20s sitting alone at a cafe "
            "table at night, laptop open showing an English learning app interface with a chat "
            "window. She wears a cream knit sweater. Warm tungsten overhead pendant light creates "
            "a soft pool of light on her face and hands, the rest of the cafe falling into soft "
            "bokeh darkness behind her. She sighs, closes the laptop halfway, and rubs her temples "
            "with both hands in quiet frustration. Shot at eye level, shallow depth of field f/1.4, "
            "handheld with subtle natural movement. Mood: isolation, quiet defeat. Color grading: "
            "warm highlights, cool shadow tones. Photorealistic, cinematic."
        ),
    },
    {
        "id": "1C_same_tutors",
        "duration": "6",
        "prompt": (
            "Split-frame composition: left side shows a phone screen with a generic AI chatbot "
            "interface displaying identical robotic text responses, right side shows a different "
            "phone with another AI language app showing the same style of response. Both screens "
            "are held by different hands — one with painted nails, one masculine — against a dark "
            "matte background. Overhead camera angle looking straight down at both phones side by "
            "side on a dark wood table. Flat studio lighting, even and clinical. The sameness is "
            "the point. Slow zoom out revealing both phones. Color grading: cool, slightly "
            "desaturated, sterile. Photorealistic, product-shot aesthetic."
        ),
    },
    {
        "id": "2A_two_learners",
        "duration": "8",
        "prompt": (
            "Medium shot of two young women sitting side by side in a modern coworking space, "
            "both wearing earbuds, both looking at their own laptop screens. The woman on the left "
            "has short dark hair, glasses, a notebook open beside her laptop — she's analytical, "
            "studious. The woman on the right has long hair, no notebook, leaning back casually "
            "with a coffee cup — she's relaxed, conversational. Natural daylight from a large "
            "window behind them creates a bright, airy atmosphere with soft shadows. Both are "
            "mid-conversation with their screens, mouths slightly open as if speaking. Camera is "
            "static, centered, symmetrical framing emphasizing the contrast between their body "
            "language. Shallow depth of field. Color grading: clean, bright, modern. Photorealistic, 24fps."
        ),
    },
    {
        "id": "2B_brand_reveal",
        "duration": "6",
        "prompt": (
            "Abstract dark background with deep indigo and rose colored light particles slowly "
            "drifting upward like embers, converging toward center frame. A soft sky-blue glow "
            "pulses gently in the center. The particles move with calm, organic motion — not "
            "chaotic, but purposeful. Extremely shallow depth of field creates layers of bokeh. "
            "No text, no logos — just the brand colors in motion. Camera slowly pushes in. "
            "Mood: emergence, possibility. Black background, cinematic lighting. Smooth 24fps."
        ),
    },
    {
        "id": "5T_vision_transition",
        "duration": "4",
        "prompt": (
            "Extreme close-up of a hand holding a smartphone, camera app open and pointed at a "
            "handwritten notebook page with English text visible but slightly out of focus. The "
            "phone screen shows a live camera viewfinder. Warm desk lamp lighting from the upper "
            "left, dark background. Shallow depth of field — the hand and phone edge are sharp, "
            "the notebook behind is beautifully blurred. Slow rack focus from phone to notebook. "
            "Cinematic, intimate, tactile. Color grading: warm amber with dark shadows. "
            "Photorealistic."
        ),
    },
    {
        "id": "7T_research_books",
        "duration": "4",
        "prompt": (
            "Slow tracking shot across the spines of academic books on a dark wooden bookshelf "
            "in a university library. Titles subtly visible — psychology, neuroscience, linguistics "
            "textbooks. Warm reading lamp light from the right casting a golden glow across the "
            "book spines, deep shadows between them. Dust particles floating in the light beam. "
            "Camera moves left to right at a steady, contemplative pace. Shallow depth of field — "
            "only 2-3 spines in focus at any time. Mood: gravitas, intellectual foundation. "
            "Color grading: warm gold highlights, rich dark wood tones. Photorealistic, cinematic."
        ),
    },
    {
        "id": "8A_domain_expansion",
        "duration": "8",
        "prompt": (
            "Cinematic montage sequence with smooth crossfade transitions between three scenes, "
            "each 2-3 seconds: First, a fitness trainer in a bright modern gym demonstrating a "
            "kettlebell movement to a client, both wearing athletic wear, natural light from "
            "floor-to-ceiling windows, shot from a low angle. Second, a woman in business attire "
            "presenting at a glass whiteboard in a sleek corporate meeting room, mid-gesture, "
            "confident posture, cool blue-toned office lighting with city skyline visible through "
            "windows. Third, a medical professional in a white coat having a warm conversation "
            "with a patient in a modern clinic, sitting at eye level, soft diffused lighting. "
            "Each scene shot with shallow depth of field, warm skin tones. Photorealistic, 24fps."
        ),
    },
    {
        "id": "8B_creator_platform",
        "duration": "8",
        "prompt": (
            "Over-the-shoulder shot of a person seen from behind sitting at a minimalist desk "
            "with a large ultrawide monitor displaying a colorful dashboard interface with avatar "
            "cards, analytics graphs, and a chat preview panel. The screen casts a soft cool glow "
            "on their shoulders and the desk surface. The room is otherwise dark with a single "
            "warm desk lamp on the right providing accent light. Their hand rests on a mouse, "
            "hovering over a button on screen. The composition suggests creation, ownership, "
            "possibility. Camera is static, slightly elevated. Shallow depth of field — the screen "
            "content is slightly soft, the person's silhouette is sharp. Color grading: cool "
            "monitor glow contrasting with warm lamp accent. Photorealistic, cinematic."
        ),
    },
    {
        "id": "9A_adelaide_dawn",
        "duration": "8",
        "prompt": (
            "Extreme wide aerial shot at dawn over Adelaide, Australia — the city skyline "
            "silhouetted against a vibrant sunrise with deep indigo and rose tones bleeding into "
            "the sky naturally. The Torrens River reflects the sky colors. Morning mist sits low "
            "across the parklands surrounding the city. Camera slowly drifts forward and slightly "
            "upward in a gentle drone movement. The light is magical hour — the sun is just below "
            "the horizon, painting the clouds in indigo, rose, and sky blue tones. No people "
            "visible — just the city, the river, the light. Mood: dawn of something new, quiet "
            "ambition. Color grading: push the indigo and rose naturally without looking artificial. "
            "Photorealistic, cinematic, 24fps."
        ),
    },
]


def generate_clip(clip: dict) -> str:
    """Submit a video generation request. Returns operation name."""
    clip_id = clip["id"]
    output_path = OUTPUT_DIR / f"{clip_id}.mp4"

    if output_path.exists():
        print(f"  SKIP {clip_id} — already exists at {output_path}")
        return None

    print(f"  SUBMIT {clip_id} ({clip['duration']}s)...")

    try:
        operation = client.models.generate_videos(
            model="veo-3.0-generate-preview",
            prompt=clip["prompt"],
            config=types.GenerateVideosConfig(
                aspect_ratio="16:9",
                duration_seconds=clip["duration"],
                person_generation="allow_all",
                number_of_videos=1,
            ),
        )
        return {"clip": clip, "operation": operation}
    except Exception as e:
        print(f"  ERROR submitting {clip_id}: {e}")
        return None


def poll_and_save(job: dict):
    """Poll an operation until done, then save the video."""
    clip = job["clip"]
    operation = job["operation"]
    clip_id = clip["id"]
    output_path = OUTPUT_DIR / f"{clip_id}.mp4"

    print(f"  POLL {clip_id}...")
    attempts = 0
    max_attempts = 60  # 10 minutes max

    while not operation.done:
        attempts += 1
        if attempts > max_attempts:
            print(f"  TIMEOUT {clip_id} — gave up after {max_attempts * 10}s")
            return False
        time.sleep(10)
        try:
            operation = client.operations.get(operation)
        except Exception as e:
            print(f"  POLL ERROR {clip_id}: {e}")
            time.sleep(10)
            continue

        if attempts % 6 == 0:
            print(f"    ... {clip_id} still generating ({attempts * 10}s)")

    # Save the video
    try:
        generated_video = operation.response.generated_videos[0]
        client.files.download(file=generated_video.video)
        generated_video.video.save(str(output_path))
        print(f"  SAVED {clip_id} -> {output_path}")
        return True
    except Exception as e:
        print(f"  SAVE ERROR {clip_id}: {e}")
        return False


def main():
    print(f"=== VEO3 Clip Generator for LoLA Demo Video ===")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Clips to generate: {len(CLIPS)}")
    print()

    # Submit all jobs
    jobs = []
    for clip in CLIPS:
        result = generate_clip(clip)
        if result:
            jobs.append(result)

    if not jobs:
        print("\nNo clips to generate (all exist or all failed).")
        return

    print(f"\n{len(jobs)} clips submitted. Polling for results...\n")

    # Poll each job sequentially (API likely has concurrency limits)
    success = 0
    failed = 0
    for job in jobs:
        if poll_and_save(job):
            success += 1
        else:
            failed += 1

    print(f"\n=== DONE: {success} saved, {failed} failed ===")
    print(f"Clips are in: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
