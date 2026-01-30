#!/bin/bash

# ==========================================
# Cache Fix Script
# ==========================================

echo "Fixing cache headers in Nginx..."

# 1. Update Nginx config to disable caching for HTML/JS
sudo tee /etc/nginx/sites-available/linkus > /dev/null <<EOF
server {
    listen 80;
    server_name linkusknu.mooo.com _;

    # Frontend
    location / {
        root /var/www/linkus;
        try_files \$uri \$uri/ /index.html;
        
        # Disable caching for HTML files
        location ~* \\.html\$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires 0;
        }
        
        # Cache JS/CSS with version hash (1 year)
        location ~* \\.(js|css)\$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# 2. Rebuild frontend (new file hashes)
echo "Rebuilding frontend..."
cd frontend
npm install
npm run build

# 3. Deploy new build
echo "Deploying new build..."
sudo rm -rf /var/www/linkus/*
sudo cp -r dist/* /var/www/linkus/
sudo chown -R www-data:www-data /var/www/linkus

# 4. Reload Nginx
echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "=========================================="
echo "Cache fix complete!"
echo "Please clear your browser cache and refresh."
echo "=========================================="
