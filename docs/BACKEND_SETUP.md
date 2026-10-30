# QuickKart Backend — Developer Setup Guide

## Prerequisites

Make sure you have the following installed:

| Tool | Version | Check |
|---|---|---|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| PostgreSQL | v14+ | `psql --version` |
| Git | any | `git --version` |

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/Abhishek-giri93/QuickKart.git
cd QuickKart/backend
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and update the following:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quickkart_dev"
JWT_ACCESS_SECRET=any_long_random_string_here
JWT_REFRESH_SECRET=another_long_random_string_here
```

> ⚠️ Never commit your `.env` file. It is in `.gitignore`.

---

## Step 4 — Create the PostgreSQL Database

Open your PostgreSQL client and run:

```sql
CREATE DATABASE quickkart_dev;
```

---

## Step 5 — Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables based on `prisma/schema.prisma`.

---

## Step 6 — Generate Prisma Client

```bash
npx prisma generate
```

---

## Step 7 — Start the Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

Health check: **http://localhost:3000/api/v1/health**

---

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload (nodemon) |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npx prisma studio` | Open Prisma GUI for database |
| `npx prisma migrate dev` | Run new migrations |
| `npx prisma migrate reset` | ⚠️ Reset database (destroys all data) |
| `npx prisma generate` | Regenerate Prisma client after schema changes |

---

## Project Structure

```
backend/
├── server.js              # Entry point
├── src/
│   ├── app.js             # Express app setup
│   ├── config/
│   │   ├── env.config.js  # Environment config
│   │   └── prisma.js      # Database client
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── requestLogger.js
│   │   └── validate.js
│   ├── modules/           # Feature modules (auth, users, orders, etc.)
│   ├── routes/
│   │   └── index.js       # Main API router
│   ├── sockets/           # Socket.IO handlers
│   ├── services/          # External service integrations
│   ├── utils/
│   │   ├── AppError.js    # Custom error class
│   │   ├── asyncHandler.js
│   │   ├── constants.js   # Enums and constants
│   │   └── response.js    # Standardized responses
│   └── validators/        # Zod validation schemas
├── prisma/
│   └── schema.prisma      # Database schema
└── tests/                 # Test files
```

---

## API Base URL

All endpoints are prefixed with `/api/v1/`

| Endpoint | Description |
|---|---|
| `GET /api/v1/health` | Server health check |

More endpoints will be added as each module is implemented.

