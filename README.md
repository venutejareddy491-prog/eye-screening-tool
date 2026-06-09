# Smart Dry Eye Screening Tool

AI-inspired healthcare web application for self-screening dry eye disease risk using symptoms, lifestyle habits, and environmental factors.

**Status: Project complete** — see [docs/PROJECT_COMPLETE.md](./docs/PROJECT_COMPLETE.md) for the full checklist.

## Features

- **Landing page** — Healthcare-themed hero, dark/light mode, animations
- **Multi-step questionnaire** — 12 factors, progress bar, voice-assisted input, guest mode
- **Risk scoring** — Low / Moderate / High with percentage and charts
- **Recommendations** — 20-20-20 rule, hydration, sleep, artificial tears, doctor referral
- **Appointment booking** — Form with email notification simulation
- **Dashboard** — History, trends, PDF download, lifestyle analytics, screen timer
- **Authentication** — JWT signup/login with bcrypt password hashing
- **Admin panel** — Users, reports, high-risk filter, analytics, appointment status
- **Extras** — AI chatbot, care reminders, multi-language (EN/ES/HI), PDF & email reports

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Recharts, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt |
| Security | Helmet, rate limiting, mongo-sanitize, express-validator |

## Project Structure

```
smart-dry-eye-screening/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       └── utils/
├── server/                 # Express API
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── config/
├── docs/                   # API, schema, completion checklist
├── scripts/verify-setup.js
├── START.bat               # Windows one-click dev
├── STOP-PORTS.bat
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Install dependencies

```bash
cd smart-dry-eye-screening
npm run install:all
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and `JWT_SECRET`.

### 3. Seed admin user

```bash
npm run seed
```

**Admin login:** `admin@dryeye.com` / `admin123`

### 4. Run development

```bash
npm run dev
```

Or double-click **START.bat** (Windows).

- Frontend: http://localhost:5173
- API: http://localhost:5000

### 5. Verify setup

```bash
npm run verify
```

## User flows

| Flow | Steps |
|------|--------|
| Guest screening | Home → Screening → Results (preview) → Register to save |
| Registered user | Login → Screening → Results → Dashboard / PDF / Appointment |
| Admin | Login as admin → `/admin` for analytics |

## API Endpoints

See [docs/API.md](./docs/API.md) for full reference.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/screening/submit` | Submit questionnaire |
| GET | `/api/screening/results` | User screening history |
| GET | `/api/screening/:id` | Single screening report |
| POST | `/api/screening/:id/email` | Email report (simulated) |
| POST | `/api/appointment/book` | Book appointment |
| GET | `/api/admin/users` | List users (admin) |
| GET | `/api/admin/reports` | Reports & analytics (admin) |
| PATCH | `/api/admin/appointments/:id` | Update appointment status |

## Database Schemas

See [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md).

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Error -102 in browser | Run `START.bat`; wait for port 5173 |
| Port 5000 in use | Run `STOP-PORTS.bat`, then start again |
| Admin 403 | Use `admin@dryeye.com` after `npm run seed` |
| API banner yellow | Start server: `cd server && npm run dev` |

## Production

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Disclaimer

This tool is for **educational screening only** and does not replace professional medical diagnosis or treatment.

## License

MIT — see [LICENSE](./LICENSE).
