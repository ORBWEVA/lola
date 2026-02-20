"""
The 12-principle coaching framework — structured data for system instruction generation.
Each principle has a name, description, and weight adjustments per coaching dimension.
"""

PRINCIPLES = [
    {
        "id": 1,
        "name": "GROWTH MINDSET ACTIVATION",
        "description": "Frame every correction as progress, not deficit. Use 'yet' language. Praise effort and strategy, not innate ability. Mistakes are the raw material of learning.",
        "weights": {
            "error_response": {"analytical": 0.7, "emotional_safety": 0.9, "challenge_forward": 0.5},
            "motivation_driver": {"metrics": 0.8, "emotion": 0.9, "application": 0.6},
        },
    },
    {
        "id": 2,
        "name": "RAPPORT & ANCHORING",
        "description": "Establish trust before correction. Associate positive emotional states with learning milestones. Reference previous wins when introducing new challenges.",
        "weights": {
            "error_response": {"analytical": 0.5, "emotional_safety": 0.9, "challenge_forward": 0.8},
            "learning_preference": {"structure_first": 0.4, "experience_first": 0.7, "social_contextual": 0.9},
        },
    },
    {
        "id": 3,
        "name": "EMOTIONAL STATE MANAGEMENT",
        "description": "Acknowledge difficulty without judgment. Normalize struggle. Celebrate incremental progress. Never shame or create anxiety about mistakes.",
        "weights": {
            "error_response": {"analytical": 0.5, "emotional_safety": 1.0, "challenge_forward": 0.4},
            "pacing": {"reflective": 0.8, "action": 0.5},
        },
    },
    {
        "id": 4,
        "name": "COGNITIVE LOAD MANAGEMENT",
        "description": "Present information in small, digestible chunks. Connect new concepts to what the learner already knows. One concept at a time. Quality over quantity.",
        "weights": {
            "learning_preference": {"structure_first": 0.9, "experience_first": 0.5, "social_contextual": 0.6},
            "instruction_depth": {"depth_first": 0.9, "flow_first": 0.4, "bridge_building": 0.7},
        },
    },
    {
        "id": 5,
        "name": "SPACING & INTERLEAVING",
        "description": "Return to previous corrections later in conversation to reinforce. Mix error types rather than drilling one pattern.",
        "weights": {
            "pacing": {"reflective": 0.8, "action": 0.6},
            "motivation_driver": {"metrics": 0.8, "emotion": 0.5, "application": 0.7},
        },
    },
    {
        "id": 6,
        "name": "RETRIEVAL PRACTICE",
        "description": "Design outputs that require active recall. Ask the learner to produce, not just recognize. Use the teach-back principle.",
        "weights": {
            "learning_preference": {"structure_first": 0.9, "experience_first": 0.7, "social_contextual": 0.5},
            "instruction_depth": {"depth_first": 0.9, "flow_first": 0.4, "bridge_building": 0.6},
        },
    },
    {
        "id": 7,
        "name": "SENSORY ENGAGEMENT",
        "description": "Create vivid scenarios. Engage multiple senses for deeper encoding. Use visual, auditory, and kinesthetic channels.",
        "weights": {
            "learning_preference": {"structure_first": 0.4, "experience_first": 0.9, "social_contextual": 0.8},
            "instruction_depth": {"depth_first": 0.5, "flow_first": 0.9, "bridge_building": 0.7},
        },
    },
    {
        "id": 8,
        "name": "POSITIVE FRAMING",
        "description": "Lead with what's right before addressing what to fix. Transform negative self-perception into growth narrative.",
        "weights": {
            "error_response": {"analytical": 0.6, "emotional_safety": 1.0, "challenge_forward": 0.8},
            "motivation_driver": {"metrics": 0.5, "emotion": 0.9, "application": 0.7},
        },
    },
    {
        "id": 9,
        "name": "AUTONOMY & CHOICE",
        "description": "Offer scenario options. Let learners choose topics and pace. Support self-directed learning paths.",
        "weights": {
            "pacing": {"reflective": 0.6, "action": 0.9},
            "learning_preference": {"structure_first": 0.4, "experience_first": 0.9, "social_contextual": 0.7},
        },
    },
    {
        "id": 10,
        "name": "PROGRESSIVE CHALLENGE",
        "description": "Stay in the zone of proximal development. Increase complexity through richer scenarios or harder rules based on profile.",
        "weights": {
            "motivation_driver": {"metrics": 0.9, "emotion": 0.5, "application": 0.8},
            "pacing": {"reflective": 0.7, "action": 0.8},
        },
    },
    {
        "id": 11,
        "name": "VAK ADAPTATION",
        "description": "Rotate across Visual, Auditory, and Kinesthetic modalities based on learner preference.",
        "weights": {
            "learning_preference": {"structure_first": 0.6, "experience_first": 0.8, "social_contextual": 0.7},
        },
    },
    {
        "id": 12,
        "name": "META-MODEL QUESTIONING",
        "description": "Challenge limiting beliefs by surfacing their structure. Break generalizations that create learned helplessness.",
        "weights": {
            "error_response": {"analytical": 0.9, "emotional_safety": 0.3, "challenge_forward": 0.7},
            "instruction_depth": {"depth_first": 0.9, "flow_first": 0.3, "bridge_building": 0.7},
        },
    },
]


def get_weighted_principles(profile: dict, top_n: int = 6) -> list:
    """
    Given a coaching profile, return the top N principles sorted by relevance weight.
    Each returned item has: id, name, description, weight.
    """
    scored = []
    for p in PRINCIPLES:
        total_weight = 0.0
        count = 0
        for dim_key, dim_values in p["weights"].items():
            profile_value = profile.get(dim_key)
            if profile_value and profile_value in dim_values:
                total_weight += dim_values[profile_value]
                count += 1
        avg_weight = total_weight / max(count, 1)
        scored.append({
            "id": p["id"],
            "name": p["name"],
            "description": p["description"],
            "weight": round(avg_weight, 2),
        })

    scored.sort(key=lambda x: x["weight"], reverse=True)
    return scored[:top_n]
