#!/usr/bin/env python3
"""Generate voiceover segments using Gemini TTS for the demo video."""

import os
import wave
import struct
from dotenv import load_dotenv
load_dotenv(override=True)

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = "video/public/voiceover"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Each segment matches the video timeline
# voice: Enceladus (male, authoritative) or Aoede (female, warm)
SEGMENTS = [
    {
        "id": "01_intro",
        "text": "LoLA. Adaptive language coaching powered by Gemini.",
        "voice": "Enceladus",
    },
    {
        "id": "02_hook",
        "text": "Japan ranks 87th in English proficiency. Korea ranks 49th. They spend billions on English education every year. The problem isn't practice.",
        "voice": "Enceladus",
    },
    {
        "id": "03_same_tutors",
        "text": "The problem is that every AI tutor teaches everyone the same way.",
        "voice": "Enceladus",
    },
    {
        "id": "04_problem",
        "text": "A shy, analytical learner needs to understand grammar rules before speaking. An outgoing explorer learns by jumping in and making mistakes. Every AI tutor on the market gives both the same correction. That's not coaching. That's a chatbot.",
        "voice": "Enceladus",
    },
    {
        "id": "05_insight",
        "text": "Two learners make the same mistake. Different brains need different coaching. This is LoLA.",
        "voice": "Enceladus",
    },
    {
        "id": "06_landing",
        "text": "Five unique coaching personalities. Each adapts to how your brain learns, not just what you say.",
        "voice": "Enceladus",
    },
    {
        "id": "07_pronunciation",
        "text": "Same error, different coaching. The Analyst gets phoneme rules and minimal pair drills. The Explorer gets a guessing game and encouragement. Same question, two completely different approaches.",
        "voice": "Enceladus",
    },
    {
        "id": "08_grammar",
        "text": "Profile A breaks down three error patterns with numbered rules. Profile B recasts naturally and keeps momentum. Both correct the same mistake. Both are valid coaching.",
        "voice": "Enceladus",
    },
    {
        "id": "09_cultural",
        "text": "Japanese learners get face-saving, indirect correction. Spanish learners get warm, direct encouragement. 36 cultural norms across six languages, informed by Hofstede and Erin Meyer.",
        "voice": "Enceladus",
    },
    {
        "id": "10_research",
        "text": "Grounded in peer-reviewed research. Dweck. Sweller. Vygotsky.",
        "voice": "Enceladus",
    },
    {
        "id": "11_architecture",
        "text": "Built on Google Cloud Run. Gemini 2.5 Flash Native Audio via the Google Gen AI SDK. Twelve coaching principles translated into weighted system instructions.",
        "voice": "Enceladus",
    },
    {
        "id": "12_domains",
        "text": "Language coaching is the first domain. But adaptive coaching works everywhere. Business strategy. Fitness. Medical communication.",
        "voice": "Enceladus",
    },
    {
        "id": "13_creator",
        "text": "The Educator Creator Platform lets any coach build, own, and monetize their own AI coaching avatar.",
        "voice": "Enceladus",
    },
    {
        "id": "14_multidomain",
        "text": "One platform. Any coaching domain. The engine adapts to every learner automatically.",
        "voice": "Enceladus",
    },
    {
        "id": "15_close",
        "text": "Built solo in Adelaide, Australia. Powered by Gemini Live API.",
        "voice": "Enceladus",
    },
    {
        "id": "16_tagline",
        "text": "LoLA. No two brains learn the same way. LoLA finally coaches both.",
        "voice": "Enceladus",
    },
]


def generate_segment(seg):
    output_path = os.path.join(OUTPUT_DIR, f"{seg['id']}.wav")
    if os.path.exists(output_path):
        print(f"  SKIP {seg['id']} — exists")
        return True

    print(f"  GEN {seg['id']}...")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=seg["text"],
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=seg["voice"],
                        )
                    ),
                ),
            ),
        )

        # Extract audio data
        audio_data = response.candidates[0].content.parts[0].inline_data.data

        # Save as WAV (PCM 24kHz 16-bit mono)
        with wave.open(output_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(audio_data)

        print(f"  SAVED {output_path}")
        return True
    except Exception as e:
        print(f"  ERROR {seg['id']}: {e}")
        return False


def main():
    print("=== Generating Voiceover Segments ===")
    success = 0
    for seg in SEGMENTS:
        if generate_segment(seg):
            success += 1

    print(f"\n=== DONE: {success}/{len(SEGMENTS)} segments ===")
    print(f"Files in: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
