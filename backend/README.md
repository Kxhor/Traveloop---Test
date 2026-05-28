# 🌍 Traveloop — Backend API

A **multi-city travel itinerary management platform** built with FastAPI, PostgreSQL, and SQLAlchemy.

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── config/
│   │   └── settings.py      # Environment-based configuration
│   ├── database/
│   │   ├── database.py      # SQLAlchemy engine & Base
│   │   └── session.py       # Session factory & get_db dependency
│   ├── models/              # ORM models (User, Trip, Stop, Activity, Expense)
│   ├── schemas/             # Pydantic request/response schemas
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic layer
│   └── utils/               # JWT, password hashing, constants
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & enter the project

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

### 5. Run the development server

```bash
uvicorn app.main:app --reload
```

The API will be available at **http://localhost:8000**.  
Interactive docs at **http://localhost:8000/docs**.

---

## 🐳 Docker

```bash
docker build -t traveloop-backend .
docker run -p 8000:8000 --env-file .env traveloop-backend
```

---

## 🛠 Tech Stack

| Layer          | Technology          |
|----------------|---------------------|
| Framework      | FastAPI             |
| Database       | PostgreSQL          |
| ORM            | SQLAlchemy 2.0      |
| Validation     | Pydantic v2         |
| Auth           | JWT (python-jose)   |
| Password Hash  | passlib + bcrypt    |
| Cache (opt.)   | Redis               |
| Config         | python-dotenv       |

---

## 📝 License

MIT
