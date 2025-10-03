# Deployment Guide

This guide covers deploying your personal blog application to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Best for:** Quick deployment with minimal configuration

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

#### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Deploy
cd apps/backend
railway up

# Set environment variables
railway variables set JWT_SECRET=your-super-secret-key
railway variables set DB_PATH=/app/data/app.db
```

### Option 2: Docker Deployment

**Best for:** Self-hosting or cloud providers

#### Create Dockerfile for Backend

```dockerfile
# apps/backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/backend ./apps/backend

# Build
WORKDIR /app/apps/backend
RUN pnpm build

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4000

CMD ["pnpm", "start:prod"]
```

#### Create Dockerfile for Frontend

```dockerfile
# apps/frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/package.json ./

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DB_PATH=/app/data/app.db
      - JWT_SECRET=${JWT_SECRET}
      - PORT=4000
    volumes:
      - backend-data:/app/data
      - backend-uploads:/app/apps/backend/uploads
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=http://backend:4000
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend-data:
  backend-uploads:
```

**Deploy:**
```bash
docker-compose up -d
```

### Option 3: VPS Deployment (Ubuntu)

**Best for:** Full control and customization

#### Setup Server

```bash
# SSH into your VPS
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### Clone and Build

```bash
# Clone repository
git clone <your-repo-url>
cd personal-website

# Install dependencies
pnpm install

# Build applications
pnpm -r build
```

#### Setup Environment Variables

```bash
# Backend .env
cat > apps/backend/.env << EOF
DB_PATH=/home/user/personal-website/apps/backend/app.db
JWT_SECRET=$(openssl rand -base64 32)
PORT=4000
EOF

# Frontend .env
cat > apps/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
EOF
```

#### Start with PM2

```bash
# Start backend
cd apps/backend
pm2 start npm --name "blog-backend" -- run start:prod

# Start frontend
cd ../frontend
pm2 start npm --name "blog-frontend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Configure Nginx

```nginx
# /etc/nginx/sites-available/blog

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    # Enable gzip (redundant if using compression middleware, but doesn't hurt)
    gzip on;
    gzip_types application/json;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static files (uploads)
    location /uploads {
        alias /home/user/personal-website/apps/backend/uploads;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is set up automatically
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up firewall (ufw on Ubuntu)
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular backups of database
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable security headers

### Update CORS Settings

```typescript
// apps/backend/src/main.ts
app.enableCors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
  maxAge: 86400,
});
```

## 📊 Monitoring

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate

# View logs
pm2 logs

# Monitor
pm2 monit
```

### Database Backup

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
DB_PATH="/home/user/personal-website/apps/backend/app.db"

mkdir -p $BACKUP_DIR
sqlite3 $DB_PATH ".backup '$BACKUP_DIR/app_$DATE.db'"

# Keep only last 7 days
find $BACKUP_DIR -name "app_*.db" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/user/backup.sh") | crontab -
```

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Build
pnpm -r build

# Restart services
pm2 restart all
```

### Database Migrations

If you make schema changes:

```bash
# TypeORM will auto-sync in development
# For production, disable synchronize and use migrations

# Generate migration
cd apps/backend
npm run typeorm migration:generate -- -n MigrationName

# Run migration
npm run typeorm migration:run
```

## 🌍 Environment Variables Reference

### Backend (.env)

```env
# Database
DB_PATH=/path/to/app.db

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Server
PORT=4000
NODE_ENV=production

# Optional
LOG_LEVEL=warn
```

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📈 Performance Tips for Production

1. **Enable HTTP/2** in Nginx for better performance
2. **Use a CDN** for static assets (Cloudflare, etc.)
3. **Database** - Consider PostgreSQL for better scalability
4. **Caching** - Add Redis for distributed caching
5. **Load Balancing** - Multiple instances behind a load balancer
6. **Monitoring** - Set up APM (e.g., New Relic, DataDog)

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check logs
pm2 logs blog-backend

# Check if port is in use
lsof -i :4000

# Check environment variables
pm2 env blog-backend
```

### Database locked errors

```bash
# Ensure WAL mode is enabled
sqlite3 app.db "PRAGMA journal_mode=WAL;"
```

### Frontend can't connect to backend

```bash
# Check CORS settings
# Verify NEXT_PUBLIC_API_URL is correct
# Check Nginx proxy configuration
# Verify backend is running
pm2 status
```

---

**Your blog is now ready for production! 🚀**

