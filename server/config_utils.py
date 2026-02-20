# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import logging
import google.genai as genai

logger = logging.getLogger(__name__)


def get_project_id():
    """Get the project ID from env or Google Cloud default credentials."""
    env_project_id = os.getenv("PROJECT_ID")
    if env_project_id and env_project_id != "your-project-id":
        return env_project_id

    try:
        import google.auth
        _, auth_project_id = google.auth.default()
        if auth_project_id:
            logger.info(f"Fetched PROJECT_ID from Google Auth: {auth_project_id}")
            return auth_project_id
    except Exception as e:
        logger.warning(f"Could not determine PROJECT_ID from Google Auth: {e}")

    return "your-project-id"


def get_genai_client():
    """
    Create a google-genai client.
    Prefers API key mode (GEMINI_API_KEY) for simplicity.
    Falls back to Vertex AI mode (PROJECT_ID + LOCATION) for Cloud Run.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        logger.info("Using Google AI Studio (API key) mode")
        return genai.Client(api_key=api_key)

    project_id = get_project_id()
    location = os.getenv("LOCATION", "us-central1")
    logger.info(f"Using Vertex AI mode (project={project_id}, location={location})")
    return genai.Client(vertexai=True, project=project_id, location=location)


def get_model_name():
    """
    Get the model name. API key mode and Vertex AI mode use different names.
    """
    model = os.getenv("MODEL")
    if model:
        return model

    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        return "gemini-2.5-flash-native-audio-preview-12-2025"

    return "gemini-live-2.5-flash-native-audio"
