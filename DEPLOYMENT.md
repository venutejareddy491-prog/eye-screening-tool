# Deployment Guide — Smart Dry Eye Screening Tool

## Option A: Local / College Demo

1. Install MongoDB Community Server or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier.
2. Set `MONGODB_URI` in `server/.env`.
3. Run `npm run install:all`, `cd server && npm run seed`, then `npm run dev` from root.

## Option B: Single VPS (DigitalOcean, AWS EC2, etc.)

### Server setup

```bash
# Install Node 20, MongoDB, nginx
sudo apt update && sudo apt install -y nginx

# Clone project and install
cd /var/www
git clone <your-repo> smart-dry-eye-screening
cd smart-dry-eye-screening
npm run install:all
npm run build
```

### Environment (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dry-eye-screening
JWT_SECRET=<long-random-string>
JWT_EXPIRE=7d
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
```

### PM2 process manager

```bash
npm install -g pm2
cd server && npm run seed
NODE_ENV=production pm2 start server.js --name dry-eye-api
pm2 save && pm2 startup
```

### Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/smart-dry-eye-screening/client/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable HTTPS with Certbot: `sudo certbot --nginx -d yourdomain.com`

## Option C: Split Deploy (Recommended for hackathons)

| Service | Host | Notes |
|---------|------|-------|
| Frontend | Vercel / Netlify | Build: `cd client && npm run build`, set `VITE_API_URL=https://api.yourdomain.com/api` |
| Backend | Render / Railway | Start: `node server.js`, add env vars |
| Database | MongoDB Atlas | Whitelist `0.0.0.0/0` for demo only |

### Vercel env

```
VITE_API_URL=https://your-api.onrender.com/api
```

### Render env

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

## Production Checklist

- [ ] Change `JWT_SECRET` to a cryptographically random value
- [ ] Use MongoDB Atlas with IP whitelist and strong credentials
- [ ] Set `NODE_ENV=production`
- [ ] Configure real SMTP for appointment emails (optional)
- [ ] Enable HTTPS on all domains
- [ ] Review rate limits in `server.js`
- [ ] Remove or change default admin password after seed

## Build Commands

```bash
# Frontend only
cd client && npm run build

# Production API (serves client/dist if placed correctly)
cd server && NODE_ENV=production node server.js
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Set `CLIENT_URL` to exact frontend origin |
| MongoDB connection refused | Start local MongoDB or fix Atlas URI |
| 401 on screening | Log in again; token may have expired |
| Admin 403 | Run seed script; login as `admin@dryeye.com` |
