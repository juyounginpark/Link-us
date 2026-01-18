# LINK-US 🌏

LINK-US is a web platform designed to connect international exchange students with Korean students, bridging the information gap and fostering community.
LINK-US는 외국인 유학생과 한국 학생을 연결하여 정보 격차를 해소하고 교류를 장려하는 웹 플랫폼입니다.

---

## 📖 Introduction (소개)

**English**
Exchange students often face difficulties finding reliable local information due to language barriers and fragmented community channels. **LINK-US** solves this by aggregating essential information—such as social gatherings (Events) and internships/part-time jobs (Jobs)—and filtering it to match the user's profile (Korean or Foreigner).

**Korean**
유학생들은 언어 장벽과 정보의 파편화로 인해 신뢰할 수 있는 지역 정보를 찾는 데 어려움을 겪곤 합니다. **LINK-US**는 사교 모임(Events)이나 인턴십/아르바이트(Jobs) 같은 필수 정보를 한곳에 모으고, 사용자의 국적(한국인/외국인)에 맞춰 맞춤형으로 필터링하여 제공함으로써 이 문제를 해결합니다.

---

## ✨ Key Features (주요 기능)

- **Personalized Dashboard**: Content is automatically filtered based on the selected nationality.
  - **For Foreigners**: Prioritizes foreigner-friendly events and visa-sponsored jobs.
  - **For Koreans**: Shows relevant local opportunities and language exchange programs.
- **Glassmorphism UI**: A modern, clean user interface with glass-like aesthetics.
- **Real-time Filtering**: fast and responsive filtering without page reloads.

**주요 기능 요약**
- **개인화 대시보드**: 선택한 국적에 따라 콘텐츠가 자동으로 필터링됩니다.
  - **외국인용**: 외국인 친화적 행사와 비자 지원이 가능한 일자리를 우선 노출합니다.
  - **한국인용**: 관련 지역 정보 및 언어 교환 프로그램을 보여줍니다.
- **글래스모피즘 UI**: 유리 질감의 현대적이고 깔끔한 사용자 인터페이스를 제공합니다.
- **실시간 필터링**: 페이지 새로고침 없이 빠르고 즉각적인 필터링을 지원합니다.

---

## 🛠 Tech Stack (기술 스택)

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Glassmorphism), Flexbox/Grid layouts
- **State Management**: Context API (AuthContext)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Server**: Uvicorn (ASGI)
- **Data**: In-Memory Mock Data structure (Prototyping)

---

## 📂 Project Structure (프로젝트 구조)

```bash
LINK-US/
├── backend/            # FastAPI Server
│   ├── main.py         # API Entry point & Logic
│   └── requirements.txt
├── frontend/           # React Client
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global State (Auth)
│   │   ├── pages/      # Route Pages (Landing, Dashboard...)
│   │   └── App.tsx     # Main Component
│   └── vite.config.ts
└── README.md           # Project Documentation
```

---

## 🚀 Getting Started (시작하기)

Follow these steps to set up the project locally.
로컬 환경에서 프로젝트를 실행하려면 아래 단계를 따라주세요.

### Prerequisites (사전 준비)
- Node.js (v18+)
- Python (v3.9+)

### 1. Backend Setup
```bash
cd backend
# Create virtual environment (optional but recommended)
# 가상환경 생성 (권장)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies (의존성 설치)
pip install -r requirements.txt

# Run server (서버 실행)
uvicorn main:app --reload
```
The server will start at `http://localhost:8000`.  
API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies (의존성 설치)
npm install

# Run development server (개발 서버 실행)
npm run dev
```
The client will start at `http://localhost:5173`.

---

## 👥 Authors (만든 사람들)

- **Park Ju-young** - Frontend Lead & Design
- **Tuumnyam Gerel** - Backend Lead & API Design

---
© 2026 LINK-US Team.
