#!/bin/bash

set -e

echo "🚀 Starting AI Learning Platform deployment..."

# Configuration
HEALTH_CHECK_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health"
API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000/api}"

# Check environment variables
echo "🔍 Checking environment variables..."
required_vars=("DATABASE_URL" "JWT_SECRET" "YOOKASSA_SECRET_KEY" "YOOKASSA_SHOP_ID" "YOOKASSA_WEBHOOK_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ ERROR: $var is not set"
        exit 1
    fi
done
echo "✅ Environment variables OK"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🔨 Building application..."
npm run build

# Run admin setup
echo "👤 Setting up admin user..."
if [ -f "scripts/006-add-admin-features.sql" ]; then
    psql "$DATABASE_URL" -f scripts/006-add-admin-features.sql
    echo "✅ Admin user configured: admin@site.local"
else
    echo "⚠️ Admin setup script not found"
fi

# Start the application (for local deployment)
if [ "$NODE_ENV" != "production" ]; then
    echo "▶️ Starting development server..."
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 10
else
    echo "▶️ Starting production server..."
    npm run start &
    SERVER_PID=$!
    sleep 15
fi

# Health checks
echo "🏥 Running health checks..."

# Check main health endpoint
if curl -f "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
    echo "✅ Health check passed: $HEALTH_CHECK_URL"
else
    echo "❌ Health check failed: $HEALTH_CHECK_URL"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Check API endpoints
endpoints=("/courses" "/auth/login")
for endpoint in "${endpoints[@]}"; do
    url="$API_URL$endpoint"
    if curl -f "$url" >/dev/null 2>&1; then
        echo "✅ API endpoint OK: $endpoint"
    else
        echo "⚠️ API endpoint check failed: $endpoint (may be normal for protected routes)"
    fi
done

# Display deployment info
echo ""
echo "🎉 Deployment completed successfully!"
echo "📍 Frontend URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
echo "🔗 API URL: ${API_URL}"
echo "👤 Admin login: admin@site.local"
echo "🔑 Admin password: AdminPass2024!"
echo "📊 Admin panel: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/admin"
echo ""

# Keep server running in development
if [ "$NODE_ENV" != "production" ]; then
    echo "🔄 Server running with PID: $SERVER_PID"
    echo "Press Ctrl+C to stop the server"
    wait $SERVER_PID
fi
