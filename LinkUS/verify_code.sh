#!/bin/bash

echo "=== Verifying Server Code ==="

# 1. Check Auth Fix (Password Limit)
echo -n "Checking Auth Fix... "
if grep -q "password\[:72\]" backend/auth.py; then
    echo "✅ OK (Fix applied)"
else
    echo "❌ MISSING! (Update needed)"
fi

# 2. Check Model Fix (String Lengths)
echo -n "Checking Model Fix... "
if grep -q "String(50)" backend/models.py; then
    echo "✅ OK (Fix applied)"
else
    echo "❌ MISSING! (Update needed)"
fi

echo ""
echo "=== Instructions ==="
echo "If you see any ❌ MISSING above, please run:"
echo "    git pull"
echo "    sudo systemctl restart linkus"
echo "===================="
