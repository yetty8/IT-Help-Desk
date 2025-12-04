#!/bin/bash
set -e

echo "🚀 Starting Railway build process..."

# Get the current directory (should be backend if Railway is configured correctly)
CURRENT_DIR=$(pwd)
echo "📁 Current directory: $CURRENT_DIR"

# Check if we're in backend directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Are we in the backend directory?"
  exit 1
fi

# Check if frontend directory exists (relative to backend)
FRONTEND_PATH="../frontend"
if [ ! -d "$FRONTEND_PATH" ]; then
  echo "❌ Error: Frontend directory not found at $FRONTEND_PATH"
  echo "📁 Listing parent directory:"
  ls -la ../
  exit 1
fi

echo "✅ Frontend directory found at $FRONTEND_PATH"

# Build frontend
echo "📦 Building frontend..."
cd "$FRONTEND_PATH"
npm install
npm run build
cd "$CURRENT_DIR"

# Build backend
echo "📦 Building backend..."
tsc

# Copy frontend to backend dist
echo "📋 Copying frontend to backend dist..."
mkdir -p dist/frontend
cp -r "$FRONTEND_PATH/dist" dist/frontend/

echo "✅ Build complete!"
echo "📁 Frontend files at: dist/frontend/dist"
ls -la dist/frontend/dist/

# Generate Prisma Client (if not already done)
echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🎉 All done!"

