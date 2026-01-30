from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
import json
import time 
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from auth import (
    Token, get_password_hash, verify_password, 
    create_access_token, get_current_user_email,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LINK-US API", version="1.0.0")

# --- Security: Hardened CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://LinkUsKNU.mooo.com",
    "https://LinkUsKNU.mooo.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models (Pydantic) ---
class UserBase(BaseModel):
    email: str
    name: str 
    university: str
    nationality: str # 'korean' or 'foreigner'
    major: str
    year: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    joinedDate: str
    profileImage: str

    class Config:
        orm_mode = True

# --- Mock Data (Events/Jobs) ---
EVENTS = [
    {
        "id": 1,
        "title": "Seoul Hiking Club - Bukhansan",
        "title_ko": "서울 등산 클럽 - 북한산",
        "type": "event",
        "category": "hiking",
        "date": "2026-02-15",
        "location": "Bukhansan National Park",
        "location_ko": "북한산 국립공원",
        "description": "Join us for a scenic hike up Bukhansan! All levels welcome.",
        "description_ko": "북한산 등산에 함께해요! 모든 수준 환영합니다.",
        "forForeigners": True,
        "forKoreans": True,
        "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
        "organizer": "Seoul Hiking Community"
    },
    {
        "id": 2,
        "title": "Korean Language Exchange",
        "title_ko": "한국어 언어 교환",
        "type": "event",
        "category": "language",
        "date": "2026-02-10",
        "location": "Hongdae, Seoul",
        "location_ko": "홍대, 서울",
        "description": "Practice Korean with native speakers in a friendly cafe setting.",
        "description_ko": "친근한 카페에서 원어민과 한국어를 연습하세요.",
        "forForeigners": True,
        "forKoreans": True,
        "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
        "organizer": "Language Bridge Seoul"
    },
    {
        "id": 3,
        "title": "International Student Debate Club",
        "title_ko": "유학생 토론 클럽",
        "type": "event",
        "category": "debate",
        "date": "2026-02-20",
        "location": "Yonsei University",
        "location_ko": "연세대학교",
        "description": "Weekly debate sessions on current affairs. Improve your public speaking!",
        "description_ko": "시사 문제에 대한 주간 토론 세션. 발표 실력을 향상시키세요!",
        "forForeigners": True,
        "forKoreans": True,
        "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
        "organizer": "Yonsei Debate Society"
    },
    {
        "id": 4,
        "title": "K-Pop Cover Dance Competition",
        "title_ko": "K-Pop 커버댄스 대회",
        "type": "competition",
        "category": "dance",
        "date": "2026-03-01",
        "location": "COEX, Seoul",
        "location_ko": "코엑스, 서울",
        "description": "Show off your K-Pop dance skills! Prizes for top 3 teams.",
        "description_ko": "K-Pop 댄스 실력을 뽐내세요! 상위 3팀에게 상품 수여.",
        "forForeigners": True,
        "forKoreans": True,
        "image": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400",
        "organizer": "Korean Dance Federation"
    },
    {
        "id": 5,
        "title": "Art Exhibition Competition",
        "title_ko": "미술 전시 대회",
        "type": "competition",
        "category": "art",
        "date": "2026-03-15",
        "location": "DDP, Seoul",
        "location_ko": "동대문디자인플라자, 서울",
        "description": "Submit your artwork for a chance to be featured in the exhibition!",
        "description_ko": "전시회에 작품을 출품해보세요!",
        "forForeigners": True,
        "forKoreans": True,
        "image": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
        "organizer": "Seoul Art Council"
    },
    {
        "id": 6,
        "title": "Volunteer Teaching at Local School",
        "title_ko": "지역 학교 봉사활동",
        "type": "volunteer",
        "category": "education",
        "date": "Every Saturday",
        "location": "Various Schools, Seoul",
        "location_ko": "서울 각 학교",
        "description": "Teach English to elementary students. Great for community service hours!",
        "description_ko": "초등학생들에게 영어를 가르쳐주세요. 봉사시간 인정!",
        "forForeigners": True,
        "forKoreans": True,
        "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
        "organizer": "Seoul Volunteer Network"
    },
]

JOBS = [
    {
        "id": 101,
        "title": "Software Engineering Intern",
        "title_ko": "소프트웨어 엔지니어 인턴",
        "company": "Samsung Electronics",
        "company_ko": "삼성전자",
        "location": "Suwon, Korea",
        "location_ko": "수원",
        "type": "internship",
        "duration": "6 months",
        "salary": "₩2,500,000/month",
        "description": "Join our mobile development team. Work on cutting-edge Android features.",
        "description_ko": "모바일 개발팀에 합류하세요. 최신 안드로이드 기능 개발.",
        "requirements": ["CS Major", "Python or Java", "English Proficiency"],
        "forForeigners": True,
        "forKoreans": True,
        "visaSponsorship": True,
        "image": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
        "deadline": "2026-02-28"
    },
    {
        "id": 102,
        "title": "Marketing Intern (English Content)",
        "title_ko": "마케팅 인턴 (영문 콘텐츠)",
        "company": "Naver Corp",
        "company_ko": "네이버",
        "location": "Seongnam, Korea",
        "location_ko": "성남",
        "type": "internship",
        "duration": "3 months",
        "salary": "₩2,000,000/month",
        "description": "Create English marketing content for global expansion projects.",
        "description_ko": "글로벌 확장 프로젝트를 위한 영문 마케팅 콘텐츠 제작.",
        "requirements": ["Marketing Major preferred", "Native English", "Creative Writing"],
        "forForeigners": True,
        "forKoreans": False,
        "visaSponsorship": True,
        "image": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
        "deadline": "2026-03-15"
    },
    {
        "id": 103,
        "title": "Data Science Intern",
        "title_ko": "데이터 사이언스 인턴",
        "company": "Kakao",
        "company_ko": "카카오",
        "location": "Pangyo, Korea",
        "location_ko": "판교",
        "type": "internship",
        "duration": "6 months",
        "salary": "₩2,800,000/month",
        "description": "Analyze user behavior data and build ML models for recommendation systems.",
        "description_ko": "사용자 행동 데이터 분석 및 추천 시스템 ML 모델 개발.",
        "requirements": ["Statistics/CS Major", "Python", "SQL", "Machine Learning basics"],
        "forForeigners": True,
        "forKoreans": True,
        "visaSponsorship": True,
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        "deadline": "2026-03-01"
    },
    {
        "id": 104,
        "title": "UX Design Intern",
        "title_ko": "UX 디자인 인턴",
        "company": "Coupang",
        "company_ko": "쿠팡",
        "location": "Seoul, Korea",
        "location_ko": "서울",
        "type": "internship",
        "duration": "4 months",
        "salary": "₩2,200,000/month",
        "description": "Design user interfaces for e-commerce platform. Figma experience required.",
        "description_ko": "이커머스 플랫폼 UI 디자인. Figma 경험 필수.",
        "requirements": ["Design Major", "Figma/Sketch", "Portfolio required"],
        "forForeigners": True,
        "forKoreans": True,
        "visaSponsorship": False,
        "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
        "deadline": "2026-02-20"
    },
    {
        "id": 105,
        "title": "Translation Intern (Chinese)",
        "title_ko": "번역 인턴 (중국어)",
        "company": "LG Electronics",
        "company_ko": "LG전자",
        "location": "Seoul, Korea",
        "location_ko": "서울",
        "type": "internship",
        "duration": "3 months",
        "salary": "₩1,800,000/month",
        "description": "Translate product manuals and marketing materials between Korean and Chinese.",
        "description_ko": "한국어-중국어 제품 매뉴얼 및 마케팅 자료 번역.",
        "requirements": ["Chinese Native Speaker", "TOPIK Level 5+", "Technical Writing"],
        "forForeigners": True,
        "forKoreans": False,
        "visaSponsorship": True,
        "image": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
        "deadline": "2026-02-25"
    },
]

# --- API Endpoints ---
@app.get("/")
def root():
    return {"message": "Welcome to LINK-US API", "version": "1.0.0"}

# --- Auth Endpoints (Database) ---
@app.post("/api/auth/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    
    # Random ID (simplification)
    import random
    new_user = models.User(
        id=str(int(time.time())) + str(random.randint(100, 999)),
        email=user.email,
        password=hashed_password,
        name=user.name,
        university=user.university,
        nationality=user.nationality,
        major=user.major,
        year=user.year,
        joinedDate="2026-01-30",
        profileImage=f"https://api.dicebear.com/7.x/initials/svg?seed={user.name}"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find user
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=User)
def read_users_me(email: str = Depends(get_current_user_email), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Admin Endpoint (Database) ---
@app.get("/api/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    """List all registered users from DB"""
    users = db.query(models.User).all()
    return users

# --- Data Endpoints ---
@app.get("/api/events")
def get_events(nationality: Optional[str] = None, category: Optional[str] = None):
    """Get all events, optionally filtered by nationality preference and category"""
    result = EVENTS.copy()
    
    if nationality == "foreigner":
        result = [e for e in result if e.get("forForeigners", True)]
        # Sort to prioritize foreigner-friendly events
        result.sort(key=lambda x: (not x.get("forForeigners", False)), reverse=False)
    elif nationality == "korean":
        result = [e for e in result if e.get("forKoreans", True)]
    
    if category:
        result = [e for e in result if e.get("category") == category]
    
    return {"events": result, "total": len(result)}

@app.get("/api/jobs")
def get_jobs(nationality: Optional[str] = None, visa_sponsorship: Optional[bool] = None):
    """Get all jobs/internships, optionally filtered"""
    result = JOBS.copy()
    
    if nationality == "foreigner":
        result = [j for j in result if j.get("forForeigners", True)]
        # Prioritize jobs with visa sponsorship for foreigners
        result.sort(key=lambda x: (not x.get("visaSponsorship", False)), reverse=False)
    elif nationality == "korean":
        result = [j for j in result if j.get("forKoreans", True)]
    
    if visa_sponsorship is not None:
        result = [j for j in result if j.get("visaSponsorship") == visa_sponsorship]
    
    return {"jobs": result, "total": len(result)}

@app.get("/api/all")
def get_all_content(nationality: Optional[str] = None):
    """Get all content (events + jobs) for dashboard"""
    events_result = get_events(nationality)
    jobs_result = get_jobs(nationality)
    
    return {
        "events": events_result["events"],
        "jobs": jobs_result["jobs"],
        "total_events": events_result["total"],
        "total_jobs": jobs_result["total"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
