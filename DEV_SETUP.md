# Telugu Tutor - Development Setup

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Ports 5175 (frontend) and 3003 (backend) must be available

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
npm run setup:server
```

### Running the Application

#### Start Both Frontend and Backend
```bash
npm run dev
```

This will automatically start:
- **Frontend**: http://localhost:5175 (Vite dev server)
- **Backend**: http://localhost:3003 (Express API server)

Both servers will run in the same terminal using `concurrently`.

#### Individual Server Commands

If you need to run servers separately:

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:server
```

**Production build:**
```bash
npm run build
```

## Configuration

### Port Configuration
- **Frontend**: Port 5175 (strict mode - will error if port is in use)
- **Backend**: Port 3003 (strict mode - will error if port is in use)
- **API Base URL**: http://localhost:3003/api

Both ports are configured with `strictPort: true`, which means:
- ✅ The application will fail immediately if a port is already in use
- ✅ You'll never accidentally run on a different port
- ❌ You must close any existing processes using these ports

### Environment Variables
The application respects `VITE_API_URL` environment variable. By default:
- Development: `http://localhost:3003/api`
- See `.env.development` for reference

## Database

The SQLite database is stored at: `/data/telugututor.db`

The database includes tables for:
- Users and authentication
- User profiles and learning progress
- Grapheme mastery tracking
- Practice session history

### Authentication

The app has automatic fallback:
- **With Backend**: Uses SQLite database + token-based auth
- **Without Backend**: Falls back to localStorage for local development

## Troubleshooting

### Port Already in Use

If you get an error like "Port 5175 is already in use" or "Port 3003 is already in use":

**Windows:**
```powershell
# Find process using port 5175
netstat -ano | findstr :5175
# Kill process by PID
taskkill /PID <PID> /F

# Find process using port 3003
netstat -ano | findstr :3003
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 5175
lsof -i :5175
# Kill process by PID
kill -9 <PID>

# Find process using port 3003
lsof -i :3003
kill -9 <PID>
```

### Backend Not Connecting

If the backend fails to start:
1. Ensure port 3003 is free
2. Check database permissions in `/data/` folder
3. Try deleting `/data/telugututor.db` and restarting (will recreate)

## Development Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run server` | Start backend production server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run Playwright tests |
| `npm run setup:server` | Install backend dependencies |
