from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255)) # Hashed
    name = Column(String(100))
    university = Column(String(100))
    nationality = Column(String(50)) # 'korean' or 'foreigner'
    major = Column(String(100))
    year = Column(Integer)
    joinedDate = Column(String(50))
    profileImage = Column(String(255))
