#!/bin/bash
DOMAIN="LinkUsKNU.mooo.com"

# ==========================================
# Domain Setup Script
# ==========================================
echo "Setting up domain: $DOMAIN"

# 1. Configure Nginx with Domain
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/linkus > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend (Static Files)
    location / {
        root /var/www/linkus;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend (API Proxy)
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Reload Nginx to apply changes
sudo nginx -t && sudo systemctl reload nginx

# 2. Install Certbot (SSL Tool)
echo "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

echo "========================================================"
echo "Nginx has been updated to use $DOMAIN."
echo ""
echo "To finish setup and enable HTTPS (Safety Lock), run:"
echo "    sudo certbot --nginx -d $DOMAIN"
echo ""
echo "Follow the instructions on screen (Enter email, Agree Y)."
echo "========================================================"
