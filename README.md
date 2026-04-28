# ITMS - Intelligent Traffic Management System

A full-stack web application for the research project: **"The Development of an Intelligent Traffic Management System using Deep Reinforcement Learning to Optimize Urban Traffic Flow"**

Built as part of research at the Federal University of Technology, Akure (FUTA).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | NestJS, TypeScript, TypeORM |
| Database | PostgreSQL |
| Real-time | Socket.IO |
| State Management | Zustand, React Query |
| AI/ML | Q-Learning (Deep Reinforcement Learning) |

## Features

- **Research Showcase** - Public landing page presenting the research, methodology, and results
- **Role-Based Authentication** - JWT auth with Admin, Operator, and Viewer roles
- **Traffic Simulation** - Real-time traffic simulation with HTML5 Canvas visualization
- **DRL Signal Optimization** - Q-learning agent that optimizes traffic signal timing
- **Intersection Management** - CRUD operations for managing traffic intersections
- **Analytics Dashboard** - Comprehensive charts comparing DRL vs fixed-time signal control
- **Real-time Updates** - WebSocket-based live simulation data streaming

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

## Getting Started

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE itms;
```

### 3. Environment Variables

**Server** (`server/.env`):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=itms
JWT_SECRET=your-secret-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
CLIENT_URL=http://localhost:3000
PORT=3001
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### 4. Run the Application

```bash
# Terminal 1 - Start the backend
cd server
npm run start:dev

# Terminal 2 - Start the frontend
cd client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- Health Check: http://localhost:3001/api/v1/health

## Default Login Credentials

The database is automatically seeded with these accounts on first startup. They also work in **Demo Mode** (when the backend is unavailable).

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@itms.com` | `admin123` |
| Operator | `operator@itms.com` | `operator123` |
| Viewer | `viewer@itms.com` | `viewer123` |

### Passphrase (2FA)

After signing in with email and password, a second-factor **passphrase** verification is required. The demo accounts are pre-seeded with the following passphrases:

| Role | Passphrase |
|------|------------|
| Admin | `admin-secure-phrase` |
| Operator | `operator-secure-phrase` |
| Viewer | `viewer-secure-phrase` |

New users will be prompted to create their own passphrase on first login. Passphrases can be changed from **Settings > Profile > Passphrase (2FA)**.

> **Demo Mode:** If PostgreSQL or the backend server is not running, you can still log in with the credentials above. The dashboard will display pre-populated demo data so the full UI is functional without any infrastructure.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh | Refresh token |
| GET | /api/v1/auth/me | Current user profile |
| GET/POST/PUT/DELETE | /api/v1/intersections | Manage intersections |
| GET/PUT | /api/v1/intersections/:id/signals | Manage signals |
| POST | /api/v1/drl/training | Start DRL training |
| GET | /api/v1/drl/models | List trained models |
| GET | /api/v1/analytics/overview | Dashboard stats |
| GET | /api/v1/analytics/comparison | DRL vs fixed-time data |
| GET | /api/v1/health | Health check |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| start_simulation | Client -> Server | Start traffic simulation |
| stop_simulation | Client -> Server | Stop simulation |
| reset_simulation | Client -> Server | Reset simulation |
| simulation_update | Server -> Client | Real-time simulation state |
| simulation_complete | Server -> Client | Simulation finished |

## Project Structure

```
ITMS/
├── client/                 # Next.js frontend
│   └── src/
│       ├── app/            # Pages (App Router)
│       ├── components/     # UI & feature components
│       ├── lib/            # API client, utilities
│       ├── store/          # Zustand stores
│       └── types/          # TypeScript types
├── server/                 # NestJS backend
│   └── src/
│       ├── auth/           # Authentication
│       ├── users/          # User management
│       ├── traffic/        # Intersection & signal management
│       ├── simulation/     # Traffic simulation engine
│       ├── drl/            # Deep RL training engine
│       ├── analytics/      # Analytics & reporting
│       └── gateway/        # WebSocket gateway
└── README.md
```

## License

This project is developed for academic research purposes.
