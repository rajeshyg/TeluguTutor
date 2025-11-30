# Configuration Summary

## Port Configuration Changes ✅

All port configurations have been updated and verified to use **strict mode**, ensuring they will never automatically find the next available port.

### Frontend (Vite)
- **File**: `vite.config.js`
- **Port**: 5175
- **Setting**: `strictPort: true`
- **Behavior**: Fails immediately if port 5175 is already in use

### Backend (Express)
- **File**: `server/index.js`
- **Port**: 3003 (via `PORT` environment variable, default to 3003)
- **Setting**: Error handler on `EADDRINUSE` event
- **Behavior**: Fails immediately with clear error message if port 3003 is already in use

## Development Command

### Single Command to Start Everything
```bash
npm run dev
```

This single command now:
1. Starts the **frontend** on http://localhost:5175
2. Starts the **backend** on http://localhost:3003
3. Both run in the same terminal using `concurrently`
4. Both use strict port enforcement - will error if ports are in use

### Alternative Commands (if needed separately)

**Frontend Only:**
```bash
npm run dev:frontend
```

**Backend Only:**
```bash
npm run dev:server
```

**Backend Production:**
```bash
npm run server
```

## API Configuration

### Frontend → Backend Communication
- **Config File**: `src/api/apiClient.js`
- **API URL**: `http://localhost:3003/api`
- **Environment Variable**: `VITE_API_URL` (defaults to backend URL)

## What's Changed

1. ✅ **package.json**: `dev` script now uses `concurrently` to run both servers
2. ✅ **vite.config.js**: Added `strictPort: true` for both dev and preview servers
3. ✅ **server/index.js**: Moved server startup to top with error handling for port conflicts
4. ✅ **.env.development**: Added documentation of ports used
5. ✅ **DEV_SETUP.md**: Complete development setup guide

## Error Handling

### If Port is Already in Use

**Frontend Error:**
```
Error: listen EADDRINUSE: address already in use :::5175
```

**Backend Error:**
```
❌ ERROR: Port 3003 is already in use!
Please close any existing processes using port 3003 or change the PORT environment variable.
```

Both will exit with error code 1 - no automatic port hunting!

## Verification

To verify both servers are running correctly, you should see output similar to:

```
[0]   VITE v5.4.21  ready in 622 ms
[0]   ➜  Local:   http://localhost:5175/
[1] Server running on http://localhost:3003
[1] API endpoints available: ...
```

The `[0]` prefix indicates frontend output, `[1]` indicates backend output.
