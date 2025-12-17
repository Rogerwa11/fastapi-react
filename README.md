# fastapi-react

A full-stack mono-repo application developed as a personal study project, combining FastAPI on the backend and React + Vite on the frontend. The goal is to practice JWT authentication, layered architecture best practices, and a modern UI flow with Tailwind CSS and Zod validation.

## ✨ Features

- User registration and login with JWT and configurable expiration.
- Simplified JSON file persistence for easy local testing.
- Secure password hashing with **passlib** (`bcrypt_sha256`).
- Complete authentication flow with protected routes and global frontend state.
- Reactive forms with validation using **Zod**.
- Responsive styling with **Tailwind CSS**.

## 🧱 Technologies & Techniques

### Backend
- **FastAPI** with modular routing and `APIRouter`.
- **pydantic-settings** for centralized configuration.
- **python-jose** for JWT token creation/validation.
- **passlib** (`CryptContext`) for password hashing.
- Separation of concerns (`database`, `models`, `schemas`, `services`, `routes`) to keep the domain organized.
- Test coverage with **pytest** and `TestClient`.

### Frontend
- **React 18** with **TypeScript** and **Vite** bundler.
- **React Router v7** for public and protected routes.
- **Tailwind CSS** as the utility-first styling foundation.
- **Zod** + custom hooks for validation and form feedback.
- **Axios** configured with interceptors to handle JWT tokens.
- Context API (`AuthContext`) for session control, auto-login, and refresh logic.

### Other Practices
- Unified scripts via **concurrently** to run backend and frontend with a single command.
- Mirrored directory structure (`backend/` and `frontend/`) for easier maintenance.

## 📁 Folder Structure

```
.
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── tests/
│       └── test_auth.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validation/
│   └── tailwind.config.js
└── package.json (scripts para rodar os dois lados)
```

## 🚀 How to Run

### Prerequisites
- Python 3.11+
- Node.js 20+
- `pip`, `npm`

### 1. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Run everything with a single command
In the project root, there is a `package.json` with a script that uses **concurrently**:
```bash
npm install      # installs only the concurrently package listed in the root
npm run dev      # runs uvicorn and Vite in parallel
```

## 🔐 Environment Variables

### Backend (`backend/.env`)
```
SECRET_KEY=super-secret-key
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://127.0.0.1:8000
```

## 🧪 Tests

- Backend (pytest):
  ```bash
  cd backend
  pytest
  ```
- The frontend can be tested manually by accessing `http://localhost:5173` after running `npm run dev`.

## 🗺️ Main Routes

- `POST /auth/register` – create user.
- `POST /auth/login` – returns JWT token (JSON).
- `GET /auth/me` – get authenticated user info.
- Frontend:
  - `/login` – user login page.
  - `/register` – registration page.
  - `/dashboard` – protected route, displays profile data.

## 📌 Observações

- Current persistence is based on a JSON file to simplify learning; for production, replace this with a real database.
- The code is organized to facilitate future replacements (e.g., adding refresh tokens or database integrations).
- Feel free to fork and experiment with new features.

---

Project created for personal learning. Feedback and suggestions are always welcome!
