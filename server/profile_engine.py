"""
Profile engine: maps 5-question onboarding answers to a coaching profile object.
"""

# Answer-to-dimension mapping
ANSWER_MAP = {
    "q1": {"a": "analytical", "b": "emotional_safety", "c": "challenge_forward"},
    "q2": {"a": "structure_first", "b": "experience_first", "c": "social_contextual"},
    "q3": {"a": "metrics", "b": "emotion", "c": "application"},
    "q4": {"a": "reflective", "b": "action"},
    "q5": {"a": "depth_first", "b": "flow_first", "c": "bridge_building"},
}

DIMENSION_KEYS = {
    "q1": "error_response",
    "q2": "learning_preference",
    "q3": "motivation_driver",
    "q4": "pacing",
    "q5": "instruction_depth",
}


def generate_profile(l1: str, answers: dict) -> dict:
    """
    Generate a coaching profile from L1 selection and 5-question answers.

    Args:
        l1: "ja" or "ko"
        answers: {"q1": "a"|"b"|"c", "q2": ..., "q3": ..., "q4": ..., "q5": ...}

    Returns:
        Coaching profile dict.
    """
    profile = {"l1": l1}
    for q_key, dim_key in DIMENSION_KEYS.items():
        answer = answers.get(q_key, "a")
        mapping = ANSWER_MAP.get(q_key, {})
        profile[dim_key] = mapping.get(answer, list(mapping.values())[0])
    return profile


# Pre-built demo profiles
PROFILE_A = {
    "l1": "ja",
    "error_response": "analytical",
    "learning_preference": "structure_first",
    "motivation_driver": "metrics",
    "pacing": "reflective",
    "instruction_depth": "depth_first",
}

PROFILE_B = {
    "l1": "ja",
    "error_response": "challenge_forward",
    "learning_preference": "social_contextual",
    "motivation_driver": "application",
    "pacing": "action",
    "instruction_depth": "flow_first",
}
