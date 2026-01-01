# Multi-stage build: Build frontend and backend

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build backend with Python
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements_minimal.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements_minimal.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/dist ./frontend/dist

# Expose port (Railway will assign via PORT env variable)
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production

# Start backend server
CMD ["python", "backend/app.py"]
