-- LoLA Phase 3: Persistence Layer
-- Apply via Supabase SQL Editor or CLI

-- Devices (anonymous visitors)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credits INT NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id),
  profile_key TEXT NOT NULL,
  profile_label TEXT NOT NULL,
  profile_data JSONB NOT NULL,
  voice TEXT,
  duration_seconds INT,
  frustration_count INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Transcript entries (bulk inserted at session end)
CREATE TABLE transcript_entries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  seq INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_sessions_device ON sessions(device_id);
CREATE INDEX idx_transcripts_session ON transcript_entries(session_id);

-- RLS (service key bypasses, but set up for future)
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_entries ENABLE ROW LEVEL SECURITY;
