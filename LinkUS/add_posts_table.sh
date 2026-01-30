#!/bin/bash

# ==========================================
# Add Posts Table to Database
# ==========================================

echo "Adding posts table to MySQL..."

# Create posts table
sudo mysql -e "USE linkus; 
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(50) PRIMARY KEY,
    author_email VARCHAR(100),
    author_name VARCHAR(100),
    author_university VARCHAR(100),
    author_nationality VARCHAR(50),
    title VARCHAR(200),
    content TEXT,
    category VARCHAR(50),
    created_at VARCHAR(50),
    INDEX (author_email)
);"

echo "Posts table created!"

# Restart backend
echo "Restarting backend..."
sudo systemctl restart linkus

echo "=========================================="
echo "Posts feature ready!"
echo "=========================================="
