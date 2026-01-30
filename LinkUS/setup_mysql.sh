#!/bin/bash

# ==========================================
# MySQL Setup Script
# ==========================================

echo "Installing MySQL Server..."
sudo apt update
sudo apt install -y mysql-server

echo "Starting MySQL Service..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Database Configuration
DB_NAME="linkus"
DB_USER="linkus_user"
DB_PASS="linkus_pass_2026"

echo "Configuring Database: $DB_NAME"
echo "Creating User: $DB_USER"

# Execute SQL commands as root
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "=========================================="
echo "MySQL Setup Complete."
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASS"
echo "=========================================="
