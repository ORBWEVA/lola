import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

_client = None


def get_db():
    global _client
    if _client is None and SUPABASE_URL and SUPABASE_KEY:
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client
