#!/bin/bash

echo "Starting deployment fix..."

# 1. Force Rebuild Frontend
echo "Rebuilding Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Check if build directory exists
if [ ! -d "frontend/dist" ]; then
    echo "ERROR: Build failed! frontend/dist not found."
    exit 1
fi

# 3. Deploy Files
echo "Copying files to /var/www/linkus..."
sudo mkdir -p /var/www/linkus
# Remove old files to ensure clean slate
sudo rm -rf /var/www/linkus/*
sudo cp -r frontend/dist/* /var/www/linkus/

# 4. Create dummy index if missing (Emergency Fallback)
if [ ! -f "/var/www/linkus/index.html" ]; then
    echo "WARNING: index.html missing after copy! Creating dummy file."
    sudo tee /var/www/linkus/index.html > /dev/null <<EOF
<!DOCTYPE html>
<html><body><h1>Deployment Fix Active</h1><p>Please check build logs.</p></body></html>
EOF
fi

# 5. Fix Permissions
echo "Fixing Permissions..."
sudo chown -R www-data:www-data /var/www/linkus
sudo chmod -R 755 /var/www/linkus

# 6. Check Nginx Config
echo "Checking Nginx..."
sudo nginx -t
sudo systemctl restart nginx

echo "========================================"
echo "Fix Complete. Try accessing the site."
echo "========================================"
