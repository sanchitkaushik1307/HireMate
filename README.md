# HireMate — V0 Authentication System

> **Your career, moving forward.**

HireMate is an AI-powered career platform. This is the V0 authentication foundation.

---

## Architecture

```
HireMate/
├── client/          # React + Vite + TypeScript + Tailwind CSS
│   └── src/
│       ├── components/   # Logo, GoogleButton
│       ├── context/      # AuthContext (provider)
│       ├── hooks/        # useAuth
│       ├── lib/          # API client
│       └── pages/        # Login, Signup, Dashboard
│
├── server/          # Express + TypeScript
│   └── src/
│       ├── config/       # env, database, session, passport
│       ├── controllers/  # auth.controller
│       ├── middleware/    # requireAuth
│       ├── models/       # Drizzle schema
│       ├── routes/       # auth.routes
│       ├── scripts/      # setup-db
│       ├── services/     # auth.service (business logic)
│       ├── types/        # TypeScript augmentations
│       └── app.ts        # Entry point
│
├── .env.example     # Environment template
└── .gitignore
```

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14

## Quick Start

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

```bash
# From the project root
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Create the database

```sql
-- In psql or pgAdmin:
CREATE DATABASE hiremate;
```

### 4. Run database setup

```bash
cd server
npx tsx src/scripts/setup-db.ts
```

### 5. Start development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at **http://localhost:3000**.

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/register` | Create account (email/password) | ✗ |
| `POST` | `/api/auth/login` | Sign in (email/password) | ✗ |
| `POST` | `/api/auth/logout` | Sign out | ✗ |
| `GET` | `/api/auth/me` | Get current user | ✓ |
| `GET` | `/api/auth/google` | Start Google OAuth | ✗ |
| `GET` | `/api/auth/google/callback` | Google OAuth callback | ✗ |
| `GET` | `/api/health` | Health check | ✗ |

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select an existing one
3. Enable the **Google+ API** or **People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Set application type to **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
7. Copy the Client ID and Client Secret to `.env`

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- Sessions stored in **PostgreSQL** (not localStorage)
- **HttpOnly** cookies (no JS access)
- **Secure** + **SameSite=strict** cookies in production
- Google OAuth uses server-side **authorization code flow**
- No secrets exposed to the frontend
- Input validation on all backend endpoints
- Generic error messages to prevent enumeration
