# 📄 AI Interview App - API Contract

This document outlines the primary API endpoints and their requirements for the AI Interview App.

## 🔐 Authentication
**Base URL**: `/api/v1/auth/`

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `login/` | `POST` | Get JWT tokens (access/refresh) and user role. | No |
| `register/recruiter/` | `POST` | Register a new recruiter (awaits admin approval). | No |
| `token/refresh/` | `POST` | Refresh access token using refresh token. | No |

---

## 👥 User Management
**Base URL**: `/api/v1/auth/`

| Endpoint | Method | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `pending-recruiters/` | `GET` | List recruiters awaiting approval. | Admin |
| `approve/<id>/` | `POST` | Approve a recruiter account. | Admin |
| `reject/<id>/` | `POST` | Reject a recruiter account. | Admin |

---

## 💼 Jobs & Screening
**Base URL**: `/api/v1/`

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `upload/` | `POST` | Upload JD/Resume (.pdf, .docx). | Yes |
| `jobs/` | `GET/POST`| Manage job listings. | Recruiter/Admin |

---

## 🎥 Interviews & Real-time
**Base URL**: `/api/v1/interviews/`

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `session/<token>/` | `GET` | Fetch interview session details. | Candidate |
| `anomalies/` | `POST` | Log behavioral anomalies during interview. | Candidate |
| `ws/interview/<id>/`| `WS` | Real-time WebSocket for interview signals. | Candidate |

---

## 📊 Reports
**Base URL**: `/api/v1/reports/`

| Endpoint | Method | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `detail/<id>/` | `GET` | Get detailed AI screening report. | Recruiter/Admin |
| `visible/` | `GET` | Get reports visible to candidate. | Candidate |

---

## 📋 Role Definitions
- **Admin**: Full access to all data and recruiter approval.
- **Recruiter**: Manage jobs, upload candidates, and view reports.
- **Candidate**: Perform interviews, view feedback (if allowed).
