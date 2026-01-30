#!/bin/bash

# ==========================================
# Complete Migration to MySQL
# ==========================================

echo "Starting Migration to MySQL..."

# 1. Run MySQL Setup (Install Server & Config DB)
if [ -f "setup_mysql.sh" ]; then
    bash setup_mysql.sh
else
    echo "Error: setup_mysql.sh not found!"
    exit 1
fi

# 2. Update Python Dependencies
echo "Updating Python Dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# 3. Restart Backend Service
echo "Restarting Backend Service..."
sudo systemctl restart linkus

echo "=========================================="
echo "Migration Complete!"
echo "Users will now be saved to the MySQL database."
echo "Note: Previous memory-only users are gone."
echo "=========================================="
