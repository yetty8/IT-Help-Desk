#!/bin/bash
# Railway startup script

echo "🚀 Starting Railway deployment..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Start the server
echo "✅ Starting server..."
npm start

