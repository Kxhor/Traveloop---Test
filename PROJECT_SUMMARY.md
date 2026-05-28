# ZUno (Traveloop) — Complete Project Summary
> Generated: 2026-05-29 | Branch: main | Last commit: cbfa4bd "Initial commit"

---

## 1. WHAT IS THIS PROJECT?

**ZUno** (internally called **Traveloop**) is a premium multi-city travel itinerary management web application. It lets users plan trips across multiple cities, track stops and activities at each city, and manage travel expenses with automatic budget calculation.

The project is a full-stack web app with a Python FastAPI backend, a vanilla JavaScript SPA frontend, and 18 pre-designed UI templates (called "Stitch screens") that define the visual design language.

---

## 2. TECH STACK

| Layer | Technology |
|---|---|
| Backend API | Python 3.10+, FastAPI 0.115.0 |
| ORM | SQLAlchemy 2.0.35 |
| Database | PostgreSQL (Neon cloud) / SQLite (dev fallback) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Frontend | Vanilla JavaScript (ES6 modules) |
| Styling | Tailwind CSS (CDN), Material Design Icons, Plus Jakarta Sans |
| Dev Server | Node.js + Express.js 4.18.2 (proxy + static serving) |
| Validation | Pydantic 2.9.2 + pydantic-settings 2.5.2 |

---

## 3. FULL DIRECTORY TREE

```
ZUno--Your-Next-Escape-main/
│
├── backend/                              # Python FastAPI backend
│   ├── app/
│   │   ├── main.py                       # FastAPI app entry point, router registration, CORS
│   │   ├── config/
│   │   │   └── settings.py               # Pydantic BaseSettings (reads .env)
│   │   ├── database/
│   │   │   ├── database.py               # SQLAlchemy engine + declarative Base
│   │   │   └── session.py                # SessionLocal factory + get_db dependency
│   │   ├── models/
│   │   │   ├── user.py                   # User ORM model
│   │   │   ├── trip.py                   # Trip ORM model
│   │   │   ├── stop.py                   # Stop (city) ORM model
│   │   │   ├── activity.py               # Activity ORM model
│   │   │   └── expense.py                # Expense ORM model
│   │   ├── schemas/
│   │   │   ├── user_schema.py            # UserCreate, UserLogin, UserResponse, TokenResponse
│   │   │   ├── trip_schema.py            # TripCreate, TripUpdate, TripResponse
│   │   │   ├── stop_schema.py            # StopCreate, StopUpdate, StopResponse
│   │   │   ├── activity_schema.py        # ActivityCreate, ActivityUpdate, ActivityResponse
│   │   │   └── expense_schema.py         # ExpenseCreate, ExpenseUpdate, ExpenseResponse
│   │   ├── routes/
│   │   │   ├── auth_routes.py            # /api/auth/* endpoints
│   │   │   ├── trip_routes.py            # /api/trips/* endpoints
│   │   │   ├── stop_routes.py            # /api/stops/* endpoints
│   │   │   ├── activity_routes.py        # /api/activities/* endpoints
│   │   │   └── expense_routes.py         # /api/expenses/* endpoints
│   │   ├── services/
│   │   │   ├── budget_service.py         # Budget recalculation logic (IMPLEMENTED)
│   │   │   ├── validation_service.py     # Data validation logic (IMPLEMENTED)
│   │   │   ├── route_service.py          # Route optimization (PLACEHOLDER)
│   │   │   └── recommendation_service.py # Recommendations (PLACEHOLDER)
│   │   └── utils/
│   │       ├── jwt_handler.py            # JWT create/verify
│   │       ├── helpers.py                # bcrypt password hashing
│   │       └── constants.py              # Shared constants
│   ├── requirements.txt
│   ├── .env                              # Live credentials (PostgreSQL Neon)
│   └── .env.example                      # Template
│
├── frontend/                             # Vanilla JS SPA
│   ├── index.html                        # Single HTML entry point
│   ├── js/
│   │   ├── app.js                        # App init, route registration, auth guard
│   │   ├── router.js                     # Hash-based SPA router
│   │   ├── api.js                        # API client (all endpoints, token injection)
│   │   ├── store.js                      # Event-based state management (pub/sub)
│   │   ├── config.js                     # API_BASE URL config
│   │   ├── constants.js                  # Frontend constants
│   │   ├── components.js                 # Toast, modal, formatters, app shell
│   │   ├── template-renderer.js          # Stitch template loader + renderer
│   │   ├── utils.js                      # Helper utilities
│   │   ├── pages/
│   │   │   ├── stitch-login.js           # Login page (ACTIVE)
│   │   │   ├── stitch-trips.js           # Trips list page (ACTIVE)
│   │   │   ├── stitch-plan-trip.js       # Create trip page (ACTIVE)
│   │   │   ├── stitch-itinerary.js       # Trip detail/itinerary page (ACTIVE)
│   │   │   ├── login.js                  # Legacy login (unused)
│   │   │   ├── trips.js                  # Legacy trips (unused)
│   │   │   ├── plan-trip.js              # Legacy plan-trip (unused)
│   │   │   └── itinerary.js              # Legacy itinerary (unused)
│   │   └── services/
│   │       ├── trip-service.js           # Trip API wrapper
│   │       ├── stop-service.js           # Stop API wrapper
│   │       ├── activity-service.js       # Activity API wrapper
│   │       └── expense-service.js        # Expense API wrapper
│   ├── css/
│   │   └── app.css                       # Global styles (glassmorphism, animations)
│   └── test.html                         # Debug/test utilities page
│
├── Stitch screens/                       # 18 pre-designed HTML UI templates
│   ├── Traveloop - Interactive Login.html
│   ├── Traveloop - Preplanned Trips View.html
│   ├── Traveloop - Plan New Trip.html
│   ├── Traveloop - Hawaiian Itinerary & Budget Planner.html
│   ├── Traveloop - Interactive Packing Checklist.html
│   ├── Traveloop - Trip Notes & Journal.html
│   ├── Traveloop - Tropical Budget Analysis.html
│   ├── Traveloop - Tropical Expense Analysis & Invoice.html
│   ├── Traveloop - Previous Trips Memories.html
│   ├── Traveloop - Interactive Profile Memories.html
│   ├── Traveloop - Explore North India (Sikkim).html
│   ├── Traveloop - Explore India Toggles.html
│   ├── Traveloop - Community Discovery.html
│   ├── Traveloop - Community Feed (Lush Kerala).html
│   ├── Traveloop - Community & Social Journeys.html
│   ├── Traveloop - Discussion Thread.html
│   └── Traveloop - Admin Analytics (Divine Theme).html (x2)
│
├── my-project/                           # React/Vite scaffold (UNUSED, ignore)
│   ├── package.json                      # React 19, Vite, ESLint
│   └── src/ (App.jsx, main.jsx)
│
├── server.js                             # Express dev server (port 3000, proxies /api to :8000)
├── package.json                          # Node deps: express, cors, tailwindcss
├── package-lock.json
│
├── PROJECT_SUMMARY.md                    # This file
├── Rules.md                              # Implementation constraints
├── README.md                             # Main docs
├── QUICK_START.md
├── TESTING_GUIDE.md
├── INTEGRATION_GUIDE.md
├── INTEGRATION_SUMMARY.md
├── FRONTEND_FOUNDATION.md
├── DEBUG_SUMMARY.md
├── VERIFICATION_CHECKLIST.md
├── TROUBLESHOOTING.md
├── FINAL_SUMMARY.txt
├── DEBUG_REPORT.md
│
└── .claude/settings.local.json           # Claude Code permissions config
```

---

## 4. DATABASE SCHEMA

### Entity Relationships
```
USERS (1) ──owns──────> (many) TRIPS
TRIPS (1) ──has──────── (many) STOPS      [cascade delete]
TRIPS (1) ──has──────── (many) EXPENSES   [cascade delete]
STOPS (1) ──has──────── (many) ACTIVITIES [cascade delete]
```

### Table: `users`
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| username | String | Unique, indexed |
| email | String | Unique, indexed |
| hashed_password | String | bcrypt hash |
| created_at | DateTime | Server default |
| updated_at | DateTime | On update |

### Table: `trips`
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| title | String | Required |
| description | String | Optional |
| start_date | Date | Optional |
| end_date | Date | Optional |
| total_budget | Float | Default 0.0, auto-recalculated |
| owner_id | FK → users | Optional (nullable) |
| created_at | DateTime | Server default |
| updated_at | DateTime | On update |

### Table: `stops`
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| city | String | Required |
| country | String | Optional |
| arrival_date | Date | Optional |
| departure_date | Date | Optional |
| order_index | Integer | Sequence within trip |
| trip_id | FK → trips | Required |
| created_at | DateTime | Server default |

### Table: `activities`
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| name | String | Required |
| category | String | Optional (sightseeing, food, adventure, etc.) |
| scheduled_at | DateTime | Optional |
| duration_minutes | Integer | Optional |
| estimated_cost | Float | Optional, default 0.0 |
| notes | String | Optional |
| stop_id | FK → stops | Required |
| created_at | DateTime | Server default |

### Table: `expenses`
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| title | String | Required |
| amount | Float | Required |
| currency | String | Default "USD" |
| category | String | Optional (transport, food, lodging, etc.) |
| trip_id | FK → trips | Required |
| created_at | DateTime | Server default |

---

## 5. ALL API ENDPOINTS

**Backend base:** `http://localhost:8000`  
**Frontend proxy:** All `/api/*` requests from port 3000 are proxied to port 8000

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Bearer | Get current user |

### Trips — `/api/trips`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/trips/` | Bearer | Create trip |
| GET | `/api/trips/` | Bearer | List all trips |
| GET | `/api/trips/{id}` | Bearer | Get trip by ID |
| PUT | `/api/trips/{id}` | Bearer | Update trip |
| DELETE | `/api/trips/{id}` | Bearer | Delete trip (cascades) |

### Stops — `/api/stops`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/stops/` | Bearer | Add stop to trip |
| GET | `/api/stops/trip/{trip_id}` | Bearer | List stops in trip |
| PUT | `/api/stops/{id}` | Bearer | Update stop |
| DELETE | `/api/stops/{id}` | Bearer | Delete stop (cascades) |

### Activities — `/api/activities`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/activities/` | Bearer | Add activity to stop |
| GET | `/api/activities/stop/{stop_id}` | Bearer | List activities in stop |
| GET | `/api/activities/trip/{trip_id}` | Bearer | List all activities in trip |
| PUT | `/api/activities/{id}` | Bearer | Update activity |
| DELETE | `/api/activities/{id}` | Bearer | Delete activity |

### Expenses — `/api/expenses`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/expenses/` | Bearer | Log expense (triggers budget recalc) |
| GET | `/api/expenses/trip/{trip_id}` | Bearer | List expenses for trip |
| PUT | `/api/expenses/{id}` | Bearer | Update expense |
| DELETE | `/api/expenses/{id}` | Bearer | Delete expense (triggers budget recalc) |

**Interactive API docs:** http://localhost:8000/docs (Swagger UI)  
**Redoc:** http://localhost:8000/redoc

---

## 6. BACKEND ARCHITECTURE

### Request Flow
```
HTTP Request
    ↓
FastAPI Route Handler  (routes/*.py)
    ↓
Pydantic Schema        (schemas/*.py)   — validates + deserializes input
    ↓
Business Logic         (services/*.py)  — budget calc, validation
    ↓
SQLAlchemy ORM         (models/*.py)    — maps to DB tables
    ↓
Database               (PostgreSQL / SQLite)
```

### Key Files

**`backend/app/main.py`**
- Creates FastAPI app instance
- Registers all routers with `/api` prefix
- Adds CORS middleware (allows all origins in dev)
- Calls `Base.metadata.create_all()` on startup to create tables

**`backend/app/config/settings.py`**
- Pydantic `BaseSettings` class
- Reads from `.env` file automatically
- Fields: `APP_NAME`, `DEBUG`, `DATABASE_URL`, `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRATION_MINUTES`, `REDIS_URL`, `CORS_ORIGINS`

**`backend/app/database/database.py`**
- Creates SQLAlchemy engine from `DATABASE_URL`
- Defines `Base = declarative_base()`

**`backend/app/database/session.py`**
- `SessionLocal = sessionmaker(...)` factory
- `get_db()` generator — FastAPI dependency injection

**`backend/app/utils/jwt_handler.py`**
- `create_access_token(data, expires_delta)` — creates JWT
- `verify_token(token)` — decodes and validates JWT
- `get_current_user(token, db)` — FastAPI dependency, returns User

**`backend/app/utils/helpers.py`**
- `hash_password(password)` — bcrypt hash
- `verify_password(plain, hashed)` — bcrypt verify

**`backend/app/services/budget_service.py`**
- `recalculate_trip_budget(trip_id, db)` — sums all expenses + activity costs, updates `trip.total_budget`
- Called automatically on expense create/update/delete

---

## 7. FRONTEND ARCHITECTURE

### Routing
Hash-based SPA routing via `frontend/js/router.js`:
```
/#/login          → stitch-login.js
/#/trips          → stitch-trips.js
/#/plan-trip      → stitch-plan-trip.js
/#/itinerary/:id  → stitch-itinerary.js
```
- Auth guard: unauthenticated users redirected to `/#/login`
- Token stored in `localStorage` as `auth_token`

### State Management (`store.js`)
Simple pub/sub pattern:
```js
store.set('user', userData)
store.get('user')
store.on('user', callback)
```

### API Client (`api.js`)
Centralized fetch wrapper:
- Automatically injects `Authorization: Bearer {token}` header
- Namespaced: `api.auth.login()`, `api.trips.list()`, `api.stops.create()`, etc.
- Returns parsed JSON or throws with error message

### Template System (`template-renderer.js`)
- Loads Stitch HTML files from `/Stitch screens/` folder via fetch
- Caches templates in memory after first load
- Extracts `<body>` content from full HTML
- Supports `{{placeholder}}` substitution for dynamic data

### Page Modules (`pages/stitch-*.js`)
Each page module exports a `render(container)` function:
1. Loads its Stitch template
2. Injects template HTML into container
3. Fetches data from backend API
4. Populates DOM with real data
5. Attaches event listeners

### UI Components (`components.js`)
- `showToast(message, type)` — bottom-right toast notification
- `showModal(content)` — overlay modal
- `formatDate(dateStr)` — human-readable date
- `formatCurrency(amount, currency)` — formatted money string
- `daysBetween(d1, d2)` — integer day count
- `renderAppShell(activePage)` — sidebar nav (desktop) + bottom nav (mobile)

### Styling (`css/app.css`)
- Glassmorphism: `backdrop-filter: blur()`, semi-transparent backgrounds
- Tailwind CSS utility classes
- Custom animations: `fadeIn`, `slideIn`, `pulse-glow`
- Responsive: sidebar on desktop, bottom nav on mobile
- Color palette: deep purples, teals, warm ambers (tropical/travel theme)

---

## 8. FRONTEND PAGES — CURRENT STATE

### ✅ Login Page (`/#/login`)
- File: `frontend/js/pages/stitch-login.js`
- Template: `Stitch screens/Traveloop - Interactive Login.html`
- Features: email/password form, JWT login, error toasts, redirect on success

### ✅ Trips List (`/#/trips`)
- File: `frontend/js/pages/stitch-trips.js`
- Template: `Stitch screens/Traveloop - Preplanned Trips View.html`
- Features: fetches trips from API, renders trip cards, click to navigate, "New Trip" button

### ✅ Plan Trip (`/#/plan-trip`)
- File: `frontend/js/pages/stitch-plan-trip.js`
- Template: `Stitch screens/Traveloop - Plan New Trip.html`
- Features: form with title/description/dates/budget, creates trip via API, redirects to itinerary

### ✅ Trip Itinerary (`/#/itinerary/:id`)
- File: `frontend/js/pages/stitch-itinerary.js`
- Template: `Stitch screens/Traveloop - Hawaiian Itinerary & Budget Planner.html`
- Features: trip details, stops timeline, activities per stop, back button
- Partial: "Add Activity" shows "coming soon" toast

### ❌ Not Yet Wired (templates exist, no JS page module):
- Packing Checklist
- Trip Notes & Journal
- Budget Analysis
- Expense Analysis & Invoice
- Previous Trips / Memories
- Profile
- Explore (India, Sikkim)
- Community (Discovery, Feed, Discussions)
- Admin Analytics

---

## 9. STITCH SCREENS (UI TEMPLATES)

All 18 templates are self-contained HTML files with inline Tailwind CSS and full design. They live in `Stitch screens/` and are loaded dynamically by the frontend.

| Template File | Purpose | Wired? |
|---|---|---|
| Interactive Login | Login/register UI | ✅ Yes |
| Preplanned Trips View | Trip cards grid | ✅ Yes |
| Plan New Trip | Trip creation form | ✅ Yes |
| Hawaiian Itinerary & Budget Planner | Trip detail + stops | ✅ Yes |
| Interactive Packing Checklist | Packing list UI | ❌ No |
| Trip Notes & Journal | Notes/journal UI | ❌ No |
| Tropical Budget Analysis | Budget charts | ❌ No |
| Tropical Expense Analysis & Invoice | Expense breakdown | ❌ No |
| Previous Trips Memories | Past trips gallery | ❌ No |
| Interactive Profile Memories | User profile | ❌ No |
| Explore North India (Sikkim) | Destination explore | ❌ No |
| Explore India Toggles | Destination explore | ❌ No |
| Community Discovery | Community browse | ❌ No |
| Community Feed (Lush Kerala) | Social feed | ❌ No |
| Community & Social Journeys | Social journeys | ❌ No |
| Discussion Thread | Forum/discussion | ❌ No |
| Admin Analytics (Divine Theme) | Admin dashboard | ❌ No |

---

## 10. DEVELOPMENT SETUP

### Start Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
# Copy and configure .env (already has Neon PostgreSQL credentials)
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### Start Frontend
```bash
# From project root
npm install
npm run dev
# Runs on http://localhost:3000
```

### Access Points
| URL | What |
|---|---|
| http://localhost:3000 | Frontend SPA |
| http://localhost:8000 | Backend API |
| http://localhost:8000/docs | Swagger UI (interactive API docs) |
| http://localhost:8000/redoc | Redoc API docs |
| http://localhost:3000/test.html | Debug test page |

---

## 11. ENVIRONMENT CONFIGURATION

### `backend/.env` (current live values)
```
APP_NAME=Traveloop
DEBUG=True
DATABASE_URL=postgresql://neondb_owner:npg_RMr8Ig7SVoTG@ep-restless-flower-aqc828u5-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-super-secret-key-change-me
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=["http://localhost:3000"]
```

> Note: JWT_SECRET is still the default placeholder — should be changed before any real deployment.

### `frontend/js/config.js`
```js
const API_BASE = '/api';  // proxied to localhost:8000 by Express server
```

### `server.js` (Express proxy)
- Serves static files from `frontend/` on port 3000
- Proxies all `/api/*` requests to `http://localhost:8000`
- Serves `Stitch screens/` folder as static assets

---

## 12. DEPENDENCIES

### Backend (`backend/requirements.txt`)
```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
pydantic==2.9.2
pydantic-settings==2.5.2
email-validator==2.2.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
redis==5.1.1
httpx==0.27.2
pytest==8.3.3
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "express": "4.18.2",
    "cors": "2.8.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.3.0",
    "tailwindcss": "4.3.0"
  },
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  }
}
```

### Frontend CDN (loaded in index.html)
- Tailwind CSS (CDN)
- Material Design Icons (Google Fonts CDN)
- Plus Jakarta Sans font (Google Fonts CDN)

---

## 13. KEY WORKFLOWS

### Authentication Flow
```
1. User submits email + password on /#/login
2. Frontend: POST /api/auth/login
3. Backend: validates credentials, returns { access_token, token_type }
4. Frontend: stores token in localStorage['auth_token']
5. All subsequent API calls: Authorization: Bearer {token}
6. On page load: GET /api/auth/me to verify token still valid
7. If 401: clear token, redirect to /#/login
```

### Trip Creation Flow
```
1. User fills form on /#/plan-trip
2. Frontend: POST /api/trips/ with { title, description, start_date, end_date, total_budget }
3. Backend: creates trip, returns TripResponse with id
4. Frontend: redirects to /#/itinerary/{id}
5. Itinerary page: GET /api/trips/{id} + GET /api/stops/trip/{id}
6. Renders trip details and stops timeline
```

### Budget Recalculation Flow
```
1. User creates/updates/deletes an expense
2. Backend route calls budget_service.recalculate_trip_budget(trip_id, db)
3. Service: SUM(expenses.amount) + SUM(activities.estimated_cost) for trip
4. Updates trip.total_budget in database
5. Next GET /api/trips/{id} returns updated budget
```

### Stop Ordering
```
- Each stop has order_index (integer)
- Stops fetched via GET /api/stops/trip/{id} are sorted by order_index
- Frontend renders stops in that order as a timeline
- Reordering: update order_index via PUT /api/stops/{id}
```

---

## 14. BUGS FIXED (from DEBUG_SUMMARY.md)

1. **Router parameter bug** — Trip IDs were passed as `:1` (with colon) instead of `1`. Fixed by using event delegation with `data-trip-id` attributes on cards.

2. **Template rendering issue** — Body extraction regex didn't match actual Stitch template structure (body was only 473 bytes). Fixed by updating regex patterns.

3. **Event listener duplication** — Multiple listeners attached on re-render. Fixed by cloning and replacing DOM nodes before attaching listeners.

4. **Missing error handling** — API errors weren't surfaced to users. Fixed by adding validation and user-friendly toast messages.

5. **Console logging** — Added comprehensive logging with emoji indicators for debugging.

---

## 15. WHAT'S COMPLETE vs INCOMPLETE

### ✅ Complete & Working
- Full backend API (all 5 resource types: users, trips, stops, activities, expenses)
- JWT authentication with bcrypt password hashing
- PostgreSQL database with Neon cloud connection
- Cascade deletes (trip → stops → activities, trip → expenses)
- Budget auto-recalculation on expense changes
- Frontend SPA with hash routing
- 4 core pages: Login, Trips List, Plan Trip, Itinerary
- Stitch template integration system
- Responsive design (desktop + mobile)
- Error handling and toast notifications
- Express dev server with API proxy

### ⚠️ Partially Complete
- Itinerary page: shows stops and activities but "Add Activity" button shows "coming soon" toast — the backend endpoint exists, just no UI form yet
- Expense tracking: full backend API exists, no frontend UI yet

### ❌ Not Started (infrastructure exists, UI missing)
- Activity creation form in itinerary page
- Expense logging UI
- Packing checklist page
- Trip notes & journal page
- Budget analysis page
- Expense analysis & invoice page
- Previous trips / memories page
- User profile page
- Explore destinations pages (India, Sikkim)
- Community pages (discovery, feed, discussions, threads)
- Admin analytics dashboard
- Route optimization service (placeholder only)
- Recommendation engine (placeholder only)

---

## 16. SERVICES — PLACEHOLDER STATUS

| Service | File | Status |
|---|---|---|
| Budget Service | `services/budget_service.py` | ✅ Implemented |
| Validation Service | `services/validation_service.py` | ✅ Implemented |
| Route Service | `services/route_service.py` | ❌ Placeholder only |
| Recommendation Service | `services/recommendation_service.py` | ❌ Placeholder only |

---

## 17. RULES & CONSTRAINTS (from Rules.md)

The project has a `Rules.md` file defining implementation constraints. Key points:
- Must use the Stitch HTML templates as the visual foundation — do not redesign from scratch
- Backend must remain FastAPI + SQLAlchemy
- Frontend must remain vanilla JS (no React/Vue/Angular)
- All API calls must go through the centralized `api.js` client
- JWT tokens must be stored in localStorage
- Hash-based routing must be used (no server-side routing)

---

## 18. GIT STATE

- **Branch:** main
- **Commits:** 1 (`cbfa4bd Initial commit`)
- **Untracked files (not committed):**
  - DEBUG_REPORT.md
  - DEBUG_SUMMARY.md
  - FINAL_SUMMARY.txt
  - FRONTEND_FOUNDATION.md
  - INTEGRATION_GUIDE.md
  - INTEGRATION_SUMMARY.md
  - QUICK_START.md
  - Rules.md
  - TESTING_GUIDE.md
  - TROUBLESHOOTING.md
  - VERIFICATION_CHECKLIST.md
  - package-lock.json
  - package.json

---

## 19. WHERE THE PROJECT IS LEFT OFF

The project is at a **functional MVP state**. The core trip planning loop works end-to-end:
- Register/login → create trip → add stops → view itinerary

The next logical steps to continue development are:

1. **Add Activity creation UI** in the itinerary page (backend ready, just needs a form modal)
2. **Add Expense logging UI** (backend ready, Stitch template exists)
3. **Wire up remaining Stitch screens** — 14 templates are designed but have no JS page modules
4. **Implement route optimization** in `route_service.py`
5. **Implement recommendations** in `recommendation_service.py`
6. **Change JWT_SECRET** from placeholder to a real secret before any deployment
7. **Add stop reordering UI** (drag-and-drop or up/down buttons)
8. **Community features** — requires new backend models (posts, comments, follows)

---

## 20. QUICK REFERENCE — HOW TO RUN

```bash
# Terminal 1 — Backend
cd backend
venv\Scripts\activate          # Windows
uvicorn app.main:app --reload  # http://localhost:8000

# Terminal 2 — Frontend
npm run dev                    # http://localhost:3000
```

Then open http://localhost:3000 in a browser.
