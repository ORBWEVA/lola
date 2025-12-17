import hashlib
from fastapi import Request

def generate_fingerprint(request: Request):
    """Generates a unique ID based on client request details."""
    # Combine IP, User-Agent, and Accept headers
    # FastAPI request.client can be None in some cases (e.g. test client), handle gracefully
    client_host = request.client.host if request.client else "unknown"
    
    data_points = [
        client_host,
        request.headers.get('User-Agent', ''),
        request.headers.get('Accept-Language', ''),
        request.headers.get('Accept', '')
    ]
    # Create a consistent string and hash it
    raw_id = "|".join(str(d) for d in data_points)
    return hashlib.sha256(raw_id.encode('utf-8')).hexdigest()
