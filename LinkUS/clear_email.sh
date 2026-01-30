#!/bin/bash

# ==========================================
# Clear User Email Script
# ==========================================

EMAIL="0620ffff@naver.com"

echo "Clearing email: $EMAIL from database..."

# Try MySQL first (Production)
if command -v mysql &> /dev/null; then
    sudo mysql -e "USE linkus; DELETE FROM users WHERE email='$EMAIL';" 2>/dev/null
    echo "MySQL: Cleared (if existed)"
fi

# Also try to clear SQLite (if it exists as fallback)
if [ -f "backend/linkus.db" ]; then
    sqlite3 backend/linkus.db "DELETE FROM users WHERE email='$EMAIL';"
    echo "SQLite: Cleared (if existed)"
fi

# Restart the backend service
echo "Restarting backend service..."
sudo systemctl restart linkus 2>/dev/null || echo "Note: systemd service not found, you may need to restart manually"

echo "=========================================="
echo "Done! Please try signing up again."
echo "=========================================="
