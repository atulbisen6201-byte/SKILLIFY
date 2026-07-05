# Skillify Backend

Production-oriented REST API for **Skillify** — AI-assisted, multilingual career guidance.

## Stack

- Node.js 20+, Express 5-ready patterns on Express 4, TypeScript
- PostgreSQL (Supabase-compatible) + Prisma ORM
- JWT access + refresh tokens (bcrypt passwords)
- Google Gemini for AI (recommendations, chat, resume optimization, interview feedback)
- Socket.io for realtime notifications and community updates
- Helmet, CORS, rate limits, Zod validation, i18n JSON locales

## Quick start

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_* secrets (32+ chars), GEMINI_API_KEY
npm install
npx prisma migrate dev
npm run prisma:seed   # optional demo data
npm run dev
```

Health check: `GET http://localhost:4000/api/health`

## Docker

```bash
cd backend
docker compose up --build
```

Apply migrations are run on container start (`prisma migrate deploy`).

## API surface (summary)

| Area | Method | Path |
|------|--------|------|
| Auth | POST | `/api/auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password` |
| Users | GET/PUT | `/api/users/me`, `GET /api/users/:id` |
| Careers | POST | `/api/careers/recommend` |
| Chat | POST | `/api/chat`, `GET /api/chat/history/:userId` |
| Resumes | CRUD | `/api/resumes`, `/api/resumes/:id`, `POST /api/resumes/ai-optimize`, `GET /api/resumes/templates` |
| Community | | `/api/community/posts`, comments, like |
| Interview | | `/api/interview/questions`, `/api/interview/mock-feedback` |
| Analytics | | `/api/analytics/dashboard` |
| Notifications | | `/api/notifications` |
| VR metadata | | `/api/vr/rooms`, `/api/vr/rooms/:slug` |
| Admin | | `/api/admin/users`, `/api/admin/stats`, `PATCH /api/admin/users/:id/role` |

Send `Authorization: Bearer <accessToken>` for protected routes. Optional headers: `X-Locale`, `Accept-Language` for translated error/messages where applicable.

## WebSocket

Connect Socket.io to the same host/port. Pass `auth: { token: '<access jwt>' }` to join per-user rooms (`user:<id>`). Events: `notification:new`, `community:update`, `skillify:connected`.

## Google OAuth

Structure is in `src/config/passport.ts` and stub routes under `/api/auth/google`. Set `GOOGLE_*` env vars and finish the callback to upsert `OAuthAccount` + issue JWTs.

## Scripts

- `npm run dev` — tsx watch
- `npm run build` / `npm start` — production
- `npm run prisma:migrate` — local migrations
- `npm run prisma:seed` — demo users (`demo@skillify.dev` / `SkillifyDemo!23`)

## Security notes

- JWT secrets must be long random values in production.
- Configure `CLIENT_ORIGIN` to your real frontend; supports comma-separated origins.
- AI routes require `GEMINI_API_KEY`.
