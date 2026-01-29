# LINK-US Project Overview

**LINK-US** is a web platform designed to connect international exchange students with Korean students. Its goal is to bridge the information gap and foster a community by providing personalized information found in events and job postings.

## 🌟 Key Features
*   **Personalized Dashboard**: Content is filtered based on the user's profile (Foreigner or Korean).
    *   *For Foreigners*: Highlights foreigner-friendly events and visa-sponsored jobs.
    *   *For Koreans*: Shows language exchange programs and local opportunities.
*   **Modern UI**: Features a "Glassmorphism" design aesthetic (glass-like visual effects).
*   **Real-time Filtering**: Fast filtering without reloading the page.

## 🛠 Tech Stack
The project is set up as a full-stack application with a clear separation between client and server:

### Frontend (`/frontend`)
*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Vanilla CSS
*   **State Management**: Context API

### Backend (`/backend`)
*   **Framework**: FastAPI (Python)
*   **Server**: Uvicorn
*   **Data**: Currently uses an in-memory mock data structure for prototyping.

## 📂 Structure
*   `backend/`: Contains the FastAPI server code (`main.py`) and Python requirements.
*   `frontend/`: Contains the React application code, including pages, components, and context.

## 🚀 Running the Project
*   **Backend**: `uvicorn main:app --reload` (runs on `http://localhost:8000`)
*   **Frontend**: `npm run dev` (runs on `http://localhost:5173`)
