#!/bin/bash

# Configuration
# Replace these values with your own project configuration
PROJECT_ID="your-project-id"
SERVICE_NAME="immersive-language-learning"
REGION="us-central1"
MODEL="gemini-live-2.5-flash-native-audio"
SESSION_TIME_LIMIT="180"
GLOBAL_RATE_LIMIT="1000 per hour"
PER_USER_RATE_LIMIT="2 per minute"
RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
REDIS_URL="redis://10.0.0.3:6379/0" # Ensure your VPC setup allows access
DEV_MODE="false" # Set to true to disable Redis/Recaptcha

echo "📦 Building frontend..."
npm run build

echo "🚀 Deploying $SERVICE_NAME to Cloud Run..."

# NOTE: Ensure you have authenticated with gcloud:
# gcloud auth login
# gcloud config set project $PROJECT_ID

gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --network default \
  --subnet default \
  --session-affinity \
  --set-env-vars PROJECT_ID=$PROJECT_ID  \
  --set-env-vars LOCATION=$REGION \
  --set-env-vars MODEL=$MODEL \
  --set-env-vars SESSION_TIME_LIMIT=$SESSION_TIME_LIMIT \
  --set-env-vars APP_NAME=$SERVICE_NAME \
  --set-env-vars GLOBAL_RATE_LIMIT="$GLOBAL_RATE_LIMIT" \
  --set-env-vars PER_USER_RATE_LIMIT="$PER_USER_RATE_LIMIT" \
  --set-env-vars RECAPTCHA_SITE_KEY=$RECAPTCHA_SITE_KEY \
  --set-env-vars REDIS_URL=$REDIS_URL \
  --set-env-vars DEV_MODE=$DEV_MODE


echo "✅ Deployment command finished."
