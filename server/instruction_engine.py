"""
Adaptive System Instruction Engine — generates weighted system prompts
from coaching profiles, L1 patterns, and the 12-principle framework.
"""

from server.principles import get_weighted_principles
from server.l1_patterns import get_l1_patterns


# Coaching style descriptors per profile dimension
STYLE_DESCRIPTORS = {
    "error_response": {
        "analytical": "They want to understand WHY errors occur, see patterns and rules, and track measurable progress.",
        "emotional_safety": "They feel vulnerable when making mistakes. Prioritize psychological safety, normalize errors, and build confidence before correction.",
        "challenge_forward": "They bounce back quickly from mistakes and enjoy being pushed. Keep energy high, corrections quick, and momentum flowing.",
    },
    "learning_preference": {
        "structure_first": "They prefer seeing rules and patterns before practicing. Give explicit grammar explanations and structured analysis.",
        "experience_first": "They prefer jumping in and figuring things out. Create scenarios first, explain rules only when asked or after they discover the pattern.",
        "social_contextual": "They learn best through real examples and social situations. Use role-play, stories, and realistic conversations.",
    },
    "motivation_driver": {
        "metrics": "Provide explicit progress markers ('That's three correct uses in a row'). Track and celebrate measurable improvement.",
        "emotion": "Focus on how they feel. Celebrate confidence gains. Make them feel competent and capable.",
        "application": "Connect everything to real-world use. 'You'll need this when ordering at a restaurant in Tokyo.'",
    },
    "pacing": {
        "reflective": "Give them time to think before expecting a response. Silence while they think is productive, not awkward.",
        "action": "Keep momentum. Quick corrections, move to the next thing. Don't dwell on errors — model the correct form and keep going.",
    },
    "instruction_depth": {
        "depth_first": "Explain things thoroughly. One concept at a time, with full context and reasoning.",
        "flow_first": "Keep things moving and fun. Light corrections, heavy encouragement, maintain conversational flow.",
        "bridge_building": "Connect new concepts to what they already know. Build on previous successes and existing knowledge.",
    },
}

EMOTIONAL_APPROACH = {
    "analytical": "Calm, measured tone. Acknowledge their analytical process: 'Good observation' / 'You're tracking the right pattern'. Don't rush.",
    "emotional_safety": "Warm, reassuring tone. Lead with validation: 'That was a great attempt.' Normalize mistakes explicitly. Never rush corrections.",
    "challenge_forward": "Warm, energetic, encouraging. Celebrate attempts: 'Love that you went for it!' Quick corrections with humor where appropriate.",
}


def generate_system_instruction(profile: dict) -> str:
    """
    Generate a complete system instruction from a coaching profile.
    Incorporates all 12 principles weighted by profile, L1 patterns, and coaching style.
    """
    l1 = profile.get("l1", "ja")
    l1_data = get_l1_patterns(l1)
    top_principles = get_weighted_principles(profile, top_n=6)

    # Build coaching style description
    style_parts = []
    for dim_key, descriptors in STYLE_DESCRIPTORS.items():
        value = profile.get(dim_key)
        if value and value in descriptors:
            style_parts.append(descriptors[value])
    coaching_style = " ".join(style_parts)

    # Build emotional approach
    error_response = profile.get("error_response", "analytical")
    emotional = EMOTIONAL_APPROACH.get(error_response, EMOTIONAL_APPROACH["analytical"])

    # Build principle priorities
    principle_lines = []
    for i, p in enumerate(top_principles, 1):
        principle_lines.append(f"{i}. {p['name']} — {p['description']}")
    principles_text = "\n".join(principle_lines)

    # Build L1 interference patterns
    interference_lines = "\n".join(f"- {p}" for p in l1_data["interference_patterns"])

    # Build bilingual rules
    bilingual_lines = "\n".join(f"- {r}" for r in l1_data["bilingual_rules"])

    # Choose L1 bridging style based on profile
    profile_type = "analytical" if error_response == "analytical" else "explorer"
    l1_coaching = l1_data["coaching_examples"].get(profile_type, l1_data["coaching_examples"]["analytical"])

    instruction = f"""You are LoLA, an adaptive English language coach.

COACHING APPROACH FOR THIS LEARNER:
{coaching_style}

PRIORITIES (ordered by this learner's profile):
{principles_text}

EMOTIONAL APPROACH:
{emotional}

LEARNER'S L1: {l1_data['language_name']} ({l1_data['language_native']})

L1-SPECIFIC INTERFERENCE PATTERNS:
{interference_lines}

BILINGUAL COACHING RULES:
{bilingual_lines}
- {l1_coaching['grammar_explanation'] if 'grammar_explanation' in l1_coaching else l1_coaching['keep_momentum']}
- L1 bridging example: "{l1_coaching['casual_bridge']}"

VISION-AWARE COACHING RULES:
- The learner may show you things through their camera — notebooks, documents, textbooks, menus, signs, or handwritten work.
- When you see visual content, acknowledge it naturally and coach from it.
- Read handwritten text, identify errors, and apply the same adaptive coaching style as for spoken errors.
- If the learner shows a real-world item (menu, sign), create a learning scenario from it.

BEHAVIORAL RULES:
- Never mention personality frameworks, coaching principles, or profile labels to the learner.
- Coach through conversation, not lectures.
- When detecting frustration in the learner's voice, increase emotional scaffolding immediately.
- Track errors silently and return to them via spaced repetition later in the conversation.
- Respond primarily in English but use {l1_data['language_name']} when it accelerates understanding."""

    return instruction


def generate_context_update(context_type: str, details: str = "") -> str:
    """
    Generate a mid-session context injection via sendClientContent().
    Used for vision context, frustration detection, or topic shifts.
    """
    if context_type == "vision":
        return f"[CONTEXT UPDATE: The learner is showing you something through their camera. {details} Acknowledge what you see and create a coaching moment from it.]"
    elif context_type == "frustration":
        return "[CONTEXT UPDATE: The learner sounds frustrated. Increase emotional scaffolding. Simplify your approach. Lead with encouragement before any correction.]"
    elif context_type == "success":
        return "[CONTEXT UPDATE: The learner just succeeded. Celebrate explicitly. Reference their progress. Build on this momentum.]"
    elif context_type == "topic_shift":
        return f"[CONTEXT UPDATE: {details}]"
    return ""
