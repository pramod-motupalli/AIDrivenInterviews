# 🚀 Project Setup Guide (Teammate Version)

Welcome to the **AI Interview App**! Follow these steps to get the project running on your local machine.

---

## 1. Environment Setup

### 🔧 Python Virtual Environment
Open a terminal in the root folder and run:
```powershell
python -m venv venv
.\venv\Scripts\activate
```

### 📦 Install Dependencies
Go into the backend folder and install the required packages:
```powershell
cd backend
pip install -r requirements.txt
```

---

## 2. Infrastructure (Redis & Database)

### 🔴 Redis (via Docker)
We use Redis for real-time WebSocket connections. You must have **Docker Desktop** installed.
Run this command to start the Redis server:
```powershell
docker run --name redis-server -p 6379:6379 -d redis
```
*Note: In the future, you can just run `docker start redis-server`.*

### 🗄️ Database (PostgreSQL)
We are using **Neon.tech** for the database. You will need to get the `DATABASE_URL` from the team lead and add it to your `.env` file (see below).

---

## 3. Environment Variables (.env)

1.  Copy the `.env.example` file and rename it to `.env`:
    ```powershell
    cp .env.example .env
    ```
2.  Open `.env` and fill in the missing keys:
    *   `SECRET_KEY`: Generate one or ask team lead.
    *   `DATABASE_URL`: Your Neon connection string.
    *   `GEMINI_API_KEY`: Your Google Gemini API key.
    *   `EMAIL_HOST_USER`: Your Gmail address.
    *   `EMAIL_HOST_PASSWORD`: Your 16-character **Gmail App Password**.

---

## 4. Running the Project

### 🔙 Start Backend
```powershell
cd backend
python manage.py migrate  # Only needed the first time
python manage.py runserver
```

### 🔜 Start Frontends
Open two separate terminals:

**Recruiter Dashboard:**
```powershell
cd frontend-recruiter
npm install
npm run dev
```

**Candidate Dashboard:**
```powershell
cd frontend-candidate
npm install
npm run dev
```

---

## 📝 Important Notes
*   **Media Files**: Since we are skipping AWS S3 for local development, resumes and recordings will be saved in your local `backend/media` folder.
*   **Approval Emails**: To test the recruiter approval flow, you can approve recruiters through the Django Admin at `http://localhost:8000/admin/`.
