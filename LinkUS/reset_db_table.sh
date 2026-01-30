#!/bin/bash

# ==========================================
# Reset Database Table Script
# ==========================================

echo "Resetting 'users' table in MySQL..."

# Drop the table so SQLAlchemy can recreate it with correct Schema
sudo mysql -e "USE linkus; DROP TABLE IF EXISTS users;"

# Restart Backend to trigger create_all()
echo "Restarting backend..."
sudo systemctl restart linkus

echo "=========================================="
echo "Table reset complete."
echo "Please try signing up again."
echo "=========================================="
