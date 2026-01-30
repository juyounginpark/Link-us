from sqlalchemy import Column, Integer, String, Text
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
    profileImage = Column(Text)


class Post(Base):
    __tablename__ = "posts"

    id = Column(String(50), primary_key=True, index=True)
    author_email = Column(String(100), index=True)
    author_name = Column(String(100))
    author_university = Column(String(100))
    author_nationality = Column(String(50))
    title = Column(String(200))
    content = Column(Text)
    category = Column(String(50))  # general, qna, events, jobs, tips
    created_at = Column(String(50))
