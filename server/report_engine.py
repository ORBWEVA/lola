"""
Post-session coaching report generator.
Uses Gemini 2.5 Flash (text mode) to analyze transcripts and produce
structured coaching reports with strengths, improvements, and tips.
"""

import json
import logging

from server.principles import get_weighted_principles
from server.l1_patterns import get_l1_patterns
from server.instruction_engine import STYLE_DESCRIPTORS

logger = logging.getLogger(__name__)

REPORT_MODEL = "gemini-2.5-flash"


def build_report_prompt(transcript: list, profile_data: dict, duration_seconds: int, frustration_count: int) -> str:
    """Build the analysis prompt incorporating profile, principles, L1 patterns, and transcript."""
    l1 = profile_data.get("l1", "ja")
    l1_data = get_l1_patterns(l1)
    top_principles = get_weighted_principles(profile_data, top_n=6)

    # Coaching style summary
    style_parts = []
    for dim_key, descriptors in STYLE_DESCRIPTORS.items():
        value = profile_data.get(dim_key)
        if value and value in descriptors:
            style_parts.append(f"- {dim_key}: {descriptors[value]}")
    style_text = "\n".join(style_parts) if style_parts else "No profile dimensions available."

    # Principles
    principle_lines = "\n".join(
        f"{i}. {p['name']} (weight: {p['weight']})" for i, p in enumerate(top_principles, 1)
    )

    # L1 interference patterns
    interference = "\n".join(f"- {p}" for p in l1_data["interference_patterns"])

    # Format transcript
    transcript_text = "\n".join(
        f"{'User' if t.get('role') == 'user' else 'LoLA'}: {t.get('content', '')}"
        for t in transcript
    )

    duration_min = round(duration_seconds / 60, 1)

    return f"""You are an expert language coaching analyst. Analyze this coaching session transcript and produce a structured report.

LEARNER PROFILE:
- L1: {l1_data['language_name']}
- Target language: {l1_data.get('target_language', 'English')}
{style_text}

TOP COACHING PRINCIPLES FOR THIS LEARNER:
{principle_lines}

KNOWN L1 INTERFERENCE PATTERNS:
{interference}

SESSION METADATA:
- Duration: {duration_min} minutes
- Frustration signals detected: {frustration_count}
- Total transcript entries: {len(transcript)}

TRANSCRIPT:
{transcript_text}

Produce a JSON report with this exact schema:
{{
  "summary": "2-3 sentence overview of the session — what was practiced, learner engagement level, overall quality",
  "strengths": [
    {{"observation": "What the learner did well", "example": "Direct quote or paraphrase from the transcript"}}
  ],
  "improvements": [
    {{"pattern": "L1 interference pattern or error category", "observation": "What happened", "example": "Direct quote showing the error", "tip": "Specific actionable advice for the learner"}}
  ],
  "personalized_tips": ["Actionable tip based on their profile and this session's patterns"],
  "progress_indicators": {{
    "fluency": "emerging|developing|moderate|strong",
    "accuracy": "emerging|developing|moderate|strong",
    "confidence": "emerging|developing|moderate|strong",
    "engagement": "emerging|developing|moderate|strong"
  }},
  "session_stats": {{
    "total_turns": {len(transcript)},
    "user_turns": {sum(1 for t in transcript if t.get('role') == 'user')},
    "avg_user_length": {round(sum(len(t.get('content', '')) for t in transcript if t.get('role') == 'user') / max(1, sum(1 for t in transcript if t.get('role') == 'user')))}
  }}
}}

Return ONLY valid JSON, no markdown fences or extra text."""


async def generate_report(client, session_id: str, transcript: list, profile_data: dict, duration_seconds: int, frustration_count: int) -> dict:
    """Call Gemini text model to generate a structured coaching report."""
    prompt = build_report_prompt(transcript, profile_data, duration_seconds, frustration_count)

    logger.info(f"Generating report for session {session_id} ({len(transcript)} entries)")

    response = await client.aio.models.generate_content(
        model=REPORT_MODEL,
        contents=prompt,
        config={
            "temperature": 0.3,
            "response_mime_type": "application/json",
        },
    )

    report = json.loads(response.text)
    return report
