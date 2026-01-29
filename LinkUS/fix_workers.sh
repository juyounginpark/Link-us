#!/bin/bash

# ==========================================
# Fix Gunicorn Workers (Multi-process Memory Fix)
# ==========================================

echo "Fixing Gunicorn service..."

USER_NAME=$(whoami)
REPO_PATH=$(pwd)

# Re-create service file with -w 1 (Single Worker)
# This ensures all requests hit the SAME memory database
sudo tee /etc/systemd/system/linkus.service > /dev/null <<EOF
[Unit]
Description=Gunicorn instance to serve LINK-US Backend
After=network.target

[Service]
User=$USER_NAME
Group=www-data
WorkingDirectory=$REPO_PATH/backend
Environment="PATH=$REPO_PATH/backend/venv/bin"
ExecStart=$REPO_PATH/backend/venv/bin/gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
EOF

# Reload and Restart
sudo systemctl daemon-reload
sudo systemctl restart linkus

echo "=========================================="
echo "Fixed! Server is now running in Single Process Mode."
echo "Your memory database is now consistent."
echo "=========================================="
