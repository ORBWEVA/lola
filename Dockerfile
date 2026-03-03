# Stage 1: Build the Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY public ./public
COPY src ./src
COPY index.html vite.config.js ./
RUN npm run build

# Stage 2: Set up the Backend
FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend assets (includes public/ contents like avatars, audio-processors)
COPY --from=frontend-builder /app/dist ./dist

# Copy the server code
COPY server ./server

ENV PORT=8080
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "-m", "server.main"]
