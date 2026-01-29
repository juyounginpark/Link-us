#!/bin/bash

# ==========================================
# LINK-US Deployment Script (Run from Repo Root)
# ==========================================

echo "Starting Deployment..."

# 0. Check we are in the right place
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: Please run this script from the root of the repository (where backend/ and frontend/ folders are)."
    exit 1
fi

# 1. Update System & Install Dependencies
echo "Update System..."
sudo apt update
echo "Install Dependencies..."
sudo apt install -y git python3-pip python3-venv nginx nodejs npm

# 2. Backend Setup
echo "Setting up Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# 3. Frontend Setup
echo "Setting up Frontend..."
cd frontend
# Install Node.js dependencies
npm install
# Build for production
npm run build
cd ..

# 4. Deploy Frontend to Nginx
echo "Deploying Frontend to /var/www/linkus..."
sudo mkdir -p /var/www/linkus
sudo rm -rf /var/www/linkus/*
# Copy dist contents to web root
sudo cp -r frontend/dist/* /var/www/linkus/
# Fix permissions
sudo chown -R www-data:www-data /var/www/linkus
sudo chmod -R 755 /var/www/linkus

# 5. Configure Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/linkus > /dev/null <<EOF
server {
    listen 80;
    server_name _;  # Accepts all IP/Domains

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

# Enable Site & Remove Default
sudo ln -sf /etc/nginx/sites-available/linkus /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 6. Configure Systemd for Backend
echo "Configuring Systemd..."
USER_NAME=$(whoami)
REPO_PATH=$(pwd)

# Create service file
sudo tee /etc/systemd/system/linkus.service > /dev/null <<EOF
[Unit]
Description=Gunicorn instance to serve LINK-US Backend
After=network.target

[Service]
User=$USER_NAME
Group=www-data
WorkingDirectory=$REPO_PATH/backend
Environment="PATH=$REPO_PATH/backend/venv/bin"
ExecStart=$REPO_PATH/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
EOF

# Start Service
sudo systemctl daemon-reload
sudo systemctl enable linkus
sudo systemctl restart linkus

echo "=========================================="
echo "Deployment Complete!"
echo "Visit your instance IP to see the site."
echo "=========================================="
