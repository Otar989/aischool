#!/bin/bash

set -e

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
LOG_FILE="$BACKUP_DIR/last.log"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Start logging
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

echo "🗄️ Starting backup process at $(date)"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

# Database backup using pg_dump
echo "📊 Creating database backup..."
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"

if command -v pg_dump >/dev/null 2>&1; then
    pg_dump "$DATABASE_URL" > "$DB_BACKUP_FILE"
else
    echo "⚠️ pg_dump not found, using docker..."
    docker exec -i $(docker ps -q -f name=postgres) pg_dump -U postgres > "$DB_BACKUP_FILE"
fi

# Compress the backup
gzip "$DB_BACKUP_FILE"
DB_BACKUP_FILE="$DB_BACKUP_FILE.gz"

# Check backup integrity
if [ -s "$DB_BACKUP_FILE" ]; then
    BACKUP_SIZE=$(stat -f%z "$DB_BACKUP_FILE" 2>/dev/null || stat -c%s "$DB_BACKUP_FILE")
    echo "✅ Database backup created: $DB_BACKUP_FILE ($BACKUP_SIZE bytes)"
else
    echo "❌ ERROR: Backup file is empty or not created"
    exit 1
fi

# Backup uploaded files if they exist
if [ -d "./public/uploads" ]; then
    echo "📁 Backing up uploaded files..."
    tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" ./public/uploads
    echo "✅ Files backup created: files_backup_$DATE.tar.gz"
fi

# Backup environment and configuration
echo "⚙️ Backing up configuration..."
cp .env.example "$BACKUP_DIR/env_backup_$DATE.example" 2>/dev/null || echo "⚠️ No .env.example found"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true

# Final status
echo "✅ Backup completed successfully at $(date)"
echo "📍 Backup location: $BACKUP_DIR"
echo "📊 Latest database backup: $DB_BACKUP_FILE"

# Optional: Upload to cloud storage
# if [ -n "$AWS_S3_BUCKET" ]; then
#     echo "☁️ Uploading to S3..."
#     aws s3 cp "$DB_BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/"
# fi
