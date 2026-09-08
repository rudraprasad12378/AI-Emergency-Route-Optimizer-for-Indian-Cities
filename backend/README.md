# AI Emergency Route Optimizer — Production Backend

Production-grade, high-reliability Python FastAPI backend for the **AI Emergency Route Optimizer for Indian Cities**.

Built with PostgreSQL persistence, strict server-side RBAC, ACID-compliant transactional vehicle assignment locking, deterministic AI route scoring heuristics, automated incident-avoidance rerouting, structured audit logging, and full automated test coverage.

---

## Architecture Overview

```
Client (React / REST)
       ↓
FastAPI Router (/api/v1)
       ↓
Authentication & Authorization Dependencies (JWT + Server-Side RBAC)
       ↓
Service Layer (Business Logic & State Machine Transitions)
       ↓
Repository Layer (CRUD & Concurrency Locking)
       ↓
SQLAlchemy 2.0 (ORM)
       ↓
PostgreSQL / SQLite Database
```

---

## Technology Stack

- **Language & Runtime**: Python 3.12+ (tested on Python 3.14)
- **Web Framework**: FastAPI 0.115+
- **ASGI Server**: Uvicorn
- **ORM**: SQLAlchemy 2.0+
- **Schema Validation**: Pydantic v2
- **Database Migrations**: Alembic 1.13+
- **Authentication**: JWT (JSON Web Tokens via `python-jose`) & `bcrypt` password hashing
- **Testing**: `pytest` & `httpx`

---

## Directory Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI Application, CORS & Exception handlers
│   ├── api/
│   │   ├── dependencies.py      # Auth & RBAC dependencies
│   │   └── v1/                  # Versioned API Routers
│   │       ├── auth.py          # Login, Register, Me
│   │       ├── users.py         # User management
│   │       ├── emergencies.py   # State machine, triage, dispatch, completion
│   │       ├── vehicles.py      # Fleet registry & driver telemetry
│   │       ├── incidents.py     # Road hazard reporting & clearance
│   │       ├── routes.py        # Candidate calculation & rerouting
│   │       ├── hospitals.py     # Inbound case intake & trauma bay readiness
│   │       ├── notifications.py # Notification dispatch & read markers
│   │       ├── admin.py         # Fleet telemetry, audit log viewer & metrics
│   │       └── health.py        # Liveness & deep DB readiness probes
│   ├── core/
│   │   ├── config.py            # Pydantic Settings & environment variables
│   │   ├── security.py          # JWT generation & password verification
│   │   ├── exceptions.py        # AppException hierarchy & error normalization
│   │   └── logging.py           # Structured application logging
│   ├── db/
│   │   ├── base.py              # DeclarativeBase, UUID & TimestampMixin
│   │   └── session.py           # Engine & SessionLocal dependency
│   ├── models/                  # SQLAlchemy ORM Entities
│   │   ├── user.py
│   │   ├── station.py
│   │   ├── vehicle.py
│   │   ├── emergency.py
│   │   ├── incident.py
│   │   ├── route.py
│   │   ├── route_event.py
│   │   ├── notification.py
│   │   └── audit_log.py
│   ├── repositories/            # Data Access Layer & Concurrency Locks
│   ├── schemas/                 # Pydantic request/response models
│   ├── services/                # Business logic, state machine & AI engine
│   └── utils/                   # Enums & helper utilities
├── migrations/                  # Alembic database migrations
├── seed/
│   └── seed_data.py             # Bhubaneswar emergency network seed script
├── tests/                       # Automated Pytest suite
├── .env.example                 # Environment template
└── requirements.txt             # Python dependencies
```

---

## Quickstart & Setup

### 1. Create and Activate Virtual Environment

```bash
# From the backend directory
python -m venv .venv

# Windows PowerShell:
.venv\Scripts\Activate.ps1

# Linux / macOS:
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

### 4. Run Database Migrations

```bash
alembic upgrade head
```

### 5. Seed Initial Data (Bhubaneswar Emergency Network)

```bash
python -m seed.seed_data
```

### 6. Start the Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base**: `http://localhost:8000/api/v1`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`
- **Health Check**: `http://localhost:8000/api/v1/health`

---

## Development Credentials (Pre-seeded)

| Role | Email | Password | Description |
|---|---|---|---|
| **ADMIN** | `admin@ero.gov.in` | `emergency2026` | Chief Administrator S. Mohapatra |
| **DISPATCHER** | `dispatcher@ero.gov.in` | `emergency2026` | Dispatcher Officer Priya Nayak |
| **DRIVER** | `driver@ero.gov.in` | `emergency2026` | Pilot Rajesh Sahoo (Ambulance OD-02-AX-1081) |
| **DRIVER 2** | `driver2@ero.gov.in` | `emergency2026` | Pilot Amitav Jena (Ambulance OD-02-BX-1082) |
| **CITIZEN** | `citizen@ero.gov.in` | `emergency2026` | Citizen Debabrata Dash |
| **HOSPITAL** | `hospital@ero.gov.in` | `emergency2026` | Dr. Ananya Ray (AIIMS Trauma Triage) |

---

## Running Automated Tests

Run the complete test suite:

```bash
pytest tests/ -v
```

All 21 test suites test:
- JWT Authentication & expired/invalid token handling
- Server-side RBAC & privilege escalation rejection
- Strict State Machine Transitions (`REQUESTED` → `TRIAGED` → `ASSIGNED` → `ACCEPTED` → `EN_ROUTE` → `ARRIVED` → `COMPLETED`)
- Transactional Vehicle Assignment & Double-Assignment Race Prevention
- Driver Telemetry Verification (ownership check)
- Road Incident Reporting & Clearance
- Deterministic AI Route Intelligence & dynamic rerouting
- Trauma bay readiness & inbound case intake
- Notification state management

---

## Connecting Frontend to Backend

The frontend is pre-configured to communicate with `http://localhost:8000/api/v1`.
In the frontend directory:
```bash
# In frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=false
```
