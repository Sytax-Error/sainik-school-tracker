# Sainik School Project Tracker — Development Guide

## Quick Start

### Prerequisites

- Node.js 22+
- MongoDB 7+ (local or Docker)
- Docker & Docker Compose (for containerized setup)

### Option 1: Local Development (Recommended for Development)

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure environment**

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and other settings
```

3. **Start MongoDB** (if using Docker)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

4. **Run development servers**

```bash
# Runs both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:5173
```

### Option 2: Docker Development (Full Containerized)

```bash
# Start all services with the user. The user asked: "you add docker so can we run this project using doeck or not ?" The user is asking if we can run the project using Docker. We have created a docker compose -f docker-compose.dev.yml up --build
```

This starts:
- MongoDB on port 27017
- Backend on port 5000 (with hot reload)
- Frontend on port 5173 (with hot reload)

### Option 3: Docker Production

```bash
# Build and start production containers
docker compose up --build -d
```

This starts:
- MongoDB on port 27017
- Backend on port 5000
- Frontend (nginx) on port 80

Access the app at **http://localhost**

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:backend` | Start backend only (with hot reload via tsx) |
| `npm run dev:frontend` | Start frontend only (Vite dev server) |
| `npm run build` | Build both frontend and backend for production |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |
| `npm run lint` | Lint both frontend and backend |
| `npm run typecheck` | Type-check both frontend and backend |
| `npm run db:import` | Import workbook data into MongoDB (backend only) |

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose -f docker-compose.dev.yml up --build` | Start dev environment with hot reload |
| `docker compose -f docker-compose.dev.yml down` | Stop dev environment |
| `docker compose up --build -d` | Start production environment |
| `docker compose down` | Stop production environment |
| `docker compose logs -f` | View logs |

## Project Structure

```
sainik-tracker-copilot-kit/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── errors/         # Custom error classes
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models (Phase 2+)
│   │   ├── routes/         # API route definitions
│   │   ├── scripts/        # One-time scripts (import, seed)
│   │   ├── services/       # Business logic
│   │   ├── types/          # Shared TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Zod validation schemas
│   │   ├── app.ts          # Express app factory
│   │   └── server.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── Dockerfile
│   └── Dockerfile.dev
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client and API functions
│   │   ├── app/            # App-level components
│   │   ├── components/     # Reusable UI components
│   │   │   └── ui/         # Primitive UI components
│   │   ├── features/       # Feature-specific code
│   │   │   ├── dashboard/
│   │   │   └── items/
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Route configuration
│   │   ├── styles/         # Global styles
│   │   ├── types/          # Shared TypeScript types
│   │   └── utils/          # Utility functions
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx.conf
├── source-data/
│   └── Sainik Phase wise Sheets.xls
├── docs/
│   ├── MVP_SCOPE.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── KNOWN_LIMITATIONS.md
├── docker-compose.yml
├── docker-compose.dev.yml
├── package.json
└── README.md
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/sainik_tracker` |
| `CORS_ORIGIN` | Frontend origin for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |
| `SOURCE_WORKBOOK_PATH` | Path to source workbook | `../source-data/Sainik Phase wise Sheets.xls` |

### Frontend

Frontend uses Vite's environment variables. Create `.env` in frontend root:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

## API Endpoints (Phase 1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |

## Technology Stack

### Frontend
- React 18
- Vite 5
- TypeScript 5 (strict mode)
- Tailwind CSS 3
- React Router 6
- Axios
- TanStack Query 5

### Backend
- Node.js 22+
- Express 5
- TypeScript 5 (strict mode)
- MongoDB + Mongoose 8
- Zod (validation)
- xlsx (workbook import)
- tsx (development)
- Helmet, CORS, Morgan

## Development Workflow

1. **Make changes** to frontend or backend code
2. **Type-check**: `npm run typecheck`
3. **Lint**: `npm run lint`
4. **Build**: `npm run build`
5. **Test manually** via browser and API calls

## Phase 1 Completion Checklist

- [x] Root project structure with monorepo layout
- [x] Backend with Express, TypeScript, MongoDB connection
- [x] Backend environment validation
- [x] Health check endpoint (`/api/v1/health`)
- [x] Frontend with React, Vite, TypeScript, Tailwind CSS
- [x] Frontend app shell with routing
- [x] Shared design tokens
- [x] Strict TypeScript configuration for both
- [x] ESLint configuration for both
- [x] All type-checks pass
- [x] All builds succeed
- [x] Development documentation

## Next Steps (Phase 2)

- Create Mongoose models (Project, Phase, Item)
- Implement workbook import script
- Seed initial data