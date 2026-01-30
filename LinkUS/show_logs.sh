#!/bin/bash
echo "=== LINK-US Service Logs (Last 100 lines) ==="
sudo journalctl -u linkus -n 100 --no-pager
echo "============================================="
