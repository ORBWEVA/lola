from server.l1_patterns.japanese import JA_PATTERNS
from server.l1_patterns.korean import KO_PATTERNS

L1_PATTERNS = {
    "ja": JA_PATTERNS,
    "ko": KO_PATTERNS,
}


def get_l1_patterns(l1: str) -> dict:
    return L1_PATTERNS.get(l1, JA_PATTERNS)
