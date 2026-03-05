#!/bin/bash
# Deploy LoLA to Google Cloud Run
#
# Prerequisites:
#   1. gcloud CLI installed and authenticated: gcloud auth login
#   2. Project selected: gcloud config set project YOUR_PROJECT_ID
#   3. GEMINI_API_KEY stored in Secret Manager:
#      echo -n "YOUR_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-
#      gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
#        --member="serviceAccount:$(gcloud iam service-accounts list --format='value(email)' --filter='display_name:Compute')" \
#        --role="roles/secretmanager.secretAccessor"
#
# Usage:
#   ./scripts/deploy.sh                    # Deploy with defaults
#   GCP_REGION=asia-northeast1 ./scripts/deploy.sh   # Custom region

set -euo pipefail
cd "$(dirname "$0")/.."

# ── Configuration ────────────────────────────────────────────────────

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
REGION="${GCP_REGION:-us-central1}"
SERVICE="lola"
MIN_INSTANCES="${MIN_INSTANCES:-0}"  # Set to 1 on demo day to avoid cold starts
MAX_INSTANCES="${MAX_INSTANCES:-3}"
MEMORY="1Gi"
CPU="1"
TIMEOUT="300"       # 5 min — must exceed SESSION_TIME_LIMIT
SESSION_LIMIT="180" # 3 min coaching sessions

if [ -z "$PROJECT_ID" ]; then
  echo "Error: No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "=== LoLA Cloud Run Deployment ==="
echo "  Project:   $PROJECT_ID"
echo "  Region:    $REGION"
echo "  Service:   $SERVICE"
echo "  Instances: $MIN_INSTANCES-$MAX_INSTANCES"
echo ""

# ── Check Secret Manager ────────────────────────────────────────────

SECRETS=""

if ! gcloud secrets describe GEMINI_API_KEY --project="$PROJECT_ID" &>/dev/null; then
  echo "Warning: GEMINI_API_KEY secret not found in Secret Manager."
  echo "Create it with:"
  echo "  echo -n \"YOUR_KEY\" | gcloud secrets create GEMINI_API_KEY --data-file=-"
  echo ""
  read -p "Continue without secret (will use env var fallback)? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  SECRETS="GEMINI_API_KEY=GEMINI_API_KEY:latest"
fi

# Supabase secrets (optional — app works without)
if gcloud secrets describe SUPABASE_URL --project="$PROJECT_ID" &>/dev/null; then
  SECRETS="${SECRETS:+$SECRETS,}SUPABASE_URL=SUPABASE_URL:latest"
fi
if gcloud secrets describe SUPABASE_SERVICE_KEY --project="$PROJECT_ID" &>/dev/null; then
  SECRETS="${SECRETS:+$SECRETS,}SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY:latest"
fi

SECRET_FLAG=""
if [ -n "$SECRETS" ]; then
  SECRET_FLAG="--update-secrets=$SECRETS"
fi

# ── Build & Deploy ──────────────────────────────────────────────────

echo "Building and deploying..."
gcloud run deploy "$SERVICE" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --allow-unauthenticated \
  --port 8080 \
  --memory "$MEMORY" \
  --cpu "$CPU" \
  --min-instances "$MIN_INSTANCES" \
  --max-instances "$MAX_INSTANCES" \
  --timeout "$TIMEOUT" \
  --set-env-vars "DEV_MODE=false,SESSION_TIME_LIMIT=$SESSION_LIMIT" \
  --concurrency 80 \
  $SECRET_FLAG

# ── Output ──────────────────────────────────────────────────────────

URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --project "$PROJECT_ID" --format="value(status.url)")
echo ""
echo "=== Deployment Complete ==="
echo "  URL: $URL"
echo ""
echo "  Demo day tip: set MIN_INSTANCES=1 to avoid cold starts"
echo "  MIN_INSTANCES=1 ./scripts/deploy.sh"
