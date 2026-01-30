#!/bin/bash

echo "=== Debugging Server Status ==="
echo "1. Checking models.py content (for String lengths)..."
grep "Column(String" backend/models.py | head -n 5

echo ""
echo "2. Checking Python Dependencies..."
backend/venv/bin/pip freeze | grep -E "sqlalchemy|mysql"

echo ""
echo "3. Restarting Service..."
sudo systemctl restart linkus

echo ""
echo "4. Checking Service Logs (Last 50 lines)..."
sudo journalctl -u linkus -n 50 --no-pager
