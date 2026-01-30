#!/bin/bash

# ==========================================
# Cache Fix Script v2 - Simplified
# ==========================================

echo "Fixing cache headers in Nginx (v2)..."

# 1. Update Nginx config with proper cache control
sudo tee /etc/nginx/sites-available/linkus > /dev/null <<'EOF'
server {
    listen 80;
    server_name linkusknu.mooo.com _;

    root /var/www/linkus;
    index index.html;

    # HTML files - no cache
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires 0;
    }

    # JS and CSS files - long cache (they have hashes in filename)
    location ~* \.(js|css)$ {
        add_header Cache-Control "public, max-age=31536000";
    }

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# 2. Rebuild frontend
echo "Rebuilding frontend..."
cd frontend
npm install
npm run build

# 3. Deploy new build
echo "Deploying new build..."
sudo rm -rf /var/www/linkus/*
sudo cp -r dist/* /var/www/linkus/
sudo chown -R www-data:www-data /var/www/linkus

# 4. Test and reload Nginx
echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# 5. Restart backend
echo "Restarting backend..."
sudo systemctl restart linkus

echo "=========================================="
echo "Cache fix v2 complete!"
echo "Try refreshing without clearing cache now."
echo "=========================================="
