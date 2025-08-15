#!/bin/bash

# Database setup script
set -e

echo "🗄️  Setting up database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL to your PostgreSQL connection string"
    exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Run admin setup script
echo "👤 Setting up admin user..."
if [ -f "scripts/006-add-admin-features.sql" ]; then
    psql "$DATABASE_URL" -f scripts/006-add-admin-features.sql
    echo "✅ Admin user created: admin@site.local"
    echo "🔑 Admin password: AdminPass2024!"
else
    echo "⚠️  Admin setup script not found, skipping..."
fi

echo "✅ Database setup completed!"
