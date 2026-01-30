#!/bin/bash

echo "=== DEEP DEBUG MODE ==="

# 1. Clear compiled Python files (force re-compile)
echo "Cleaning __pycache__..."
find . -name "__pycache__" -type d -exec rm -rf {} +
find . -name "*.pyc" -delete

# 2. LOCATE actual file being used
# Assuming standard path
AUTH_FILE="backend/auth.py"

echo "=== CONTENT OF $AUTH_FILE ==="
# Print the lines around get_password_hash to PROVE it's there
grep -A 5 "def get_password_hash" $AUTH_FILE
echo "============================="

# 3. Check modification time
ls -l $AUTH_FILE

# 4. Force Restart
echo "Restarting service..."
sudo systemctl restart linkus

echo "=== DONE ==="
