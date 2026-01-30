from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database Configuration
# Default to SQLite for Local Development (Robustness)
SQLALCHEMY_DATABASE_URL = "sqlite:///./linkus.db"

# Check if we are in production (or if MySQL is preferred)
# We can detect this, or just try/except. 
# For simplicity, we'll try to connect to MySQL if the environment variable is set
# OR, we simply use SQLite locally and MySQL on server.

# Let's check for a specific marker file or env var that exists on the server
if os.path.exists("/etc/nginx"): # Simple check for Linux/Server environment
    # Production (AWS EC2)
    SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://linkus_user:linkus_pass_2026@localhost/linkus"
    connect_args = {}
else:
    # Local Windows Dev -> SQLite
    SQLALCHEMY_DATABASE_URL = "sqlite:///./linkus.db"
    connect_args = {"check_same_thread": False}

try:
    if "sqlite" in SQLALCHEMY_DATABASE_URL:
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL, connect_args=connect_args
        )
    else:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
except Exception as e:
    print(f"Database connection error: {e}")
    # Fallback to SQLite in worst case
    SQLALCHEMY_DATABASE_URL = "sqlite:///./linkus.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

# Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
