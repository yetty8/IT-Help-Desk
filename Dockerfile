# Use Node.js 20 as base image
FROM node:20

# Set working directory
WORKDIR /app

# ----------------------
# Backend dependencies
# ----------------------
# Copy package files and Prisma schema first for caching
COPY backend/package*.json backend/
COPY backend/tsconfig.json backend/
COPY backend/prisma backend/prisma/

# Install backend dependencies (prisma generate will now work)
RUN cd backend && npm install --include=dev

# ----------------------
# Frontend dependencies
# ----------------------
COPY backend/frontend/package*.json frontend/
RUN cd frontend && npm install

# ----------------------
# Copy all source files
# ----------------------
COPY backend backend/
COPY backend/frontend frontend/

# ----------------------
# Build frontend
# ----------------------
RUN cd frontend && npm run build

# ----------------------
# Copy frontend build into backend
# ----------------------
RUN cp -r frontend/dist backend/dist/frontend

# ----------------------
# Build backend
# ----------------------
RUN cd backend && npm run build

# Expose backend port
EXPOSE 4000

# Start the backend server
CMD ["node", "backend/dist/index.js"]
