# AI Learning Platform - Production Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- SSL certificates for HTTPS
- Domain name configured
- Server with at least 4GB RAM and 2 CPU cores

## Environment Variables

Create a `.env.production` file with the following variables:

\`\`\`bash
# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/aischool
POSTGRES_PASSWORD=your_secure_password

# Authentication
JWT_SECRET=your_jwt_secret_key_min_32_chars

# Payment Processing
YOOKASSA_SECRET_KEY=your_yookassa_secret_key
YOOKASSA_SHOP_ID=your_yookassa_shop_id

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
# Optional: enable seed endpoint
# ENABLE_SEED_COURSE=true

# Optional: AI Integration
OPENAI_API_KEY=your_openai_api_key
\`\`\`

## Deployment Steps

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-org/ai-learning-platform.git
   cd ai-learning-platform
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.example .env.production
   # Edit .env.production with your values
   \`\`\`

3. **Setup SSL certificates:**
   \`\`\`bash
   mkdir ssl
   # Copy your SSL certificates to ssl/cert.pem and ssl/key.pem
   \`\`\`

4. **Deploy with Docker Compose:**
   \`\`\`bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   \`\`\`

5. **Create admin user:**
   \`\`\`bash
   docker-compose exec app npm run db:seed
   \`\`\`

   # Alternatively, enable the protected seed endpoint:
   # ENABLE_SEED_COURSE=true docker-compose exec app curl -X POST localhost:3000/api/seed-course

## Monitoring

- Health check endpoint: `https://your-domain.com/api/health`
- Admin dashboard: `https://your-domain.com/admin`
- Default admin credentials: `admin@aischool.ru` / `admin123` (change immediately)

## Backup

Setup automated backups:

\`\`\`bash
chmod +x scripts/backup.sh
# Add to crontab: 0 2 * * * /opt/aischool/scripts/backup.sh
\`\`\`

## Security Checklist

- [ ] Change default admin password
- [ ] Configure firewall (ports 80, 443, 22 only)
- [ ] Setup fail2ban for SSH protection
- [ ] Enable automatic security updates
- [ ] Configure log rotation
- [ ] Setup monitoring alerts

## Performance Optimization

- Enable Redis caching for sessions
- Configure CDN for static assets
- Setup database connection pooling
- Enable gzip compression (configured in nginx)
- Monitor resource usage and scale as needed

## Troubleshooting

**Database connection issues:**
\`\`\`bash
docker-compose logs postgres
\`\`\`

**Application errors:**
\`\`\`bash
docker-compose logs app
\`\`\`

**SSL certificate issues:**
\`\`\`bash
docker-compose logs nginx
\`\`\`

For support, contact: support@aischool.ru
