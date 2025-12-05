# Use Node.js 20 as base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy backend and frontend package files first to leverage caching
COPY backend/package*.json backend/
COPY backend/tsconfig.json backend/
COPY frontend/package*.json frontend/

# Install dependencies separately
RUN cd backend && npm install --include=dev
RUN cd frontend && npm install

# Copy all other files
COPY backend backend/
COPY frontend frontend/

# Build frontend
RUN cd frontend && npm run build

# Build backend (also copies frontend build into backend/dist/frontend)
RUN cd backend && npm run build

# Expose port 4000
EXPOSE 4000

# Start the backend server
CMD ["node", "backend/dist/index.js"]
