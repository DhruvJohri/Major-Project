Smart Class Scheduler - Backend

Quick start:

1. Copy `.env.example` to `.env` and edit `MONGO_URI` if needed.
2. Install dependencies:

```bash
npm install
```

3. Start server:

```bash
npm start
```

Server will run on `PORT` (default 5000). API root: `http://localhost:5000/api/`

Notes:
- This backend intentionally uses no JWT/auth tokens (per request). Auth endpoints `/api/auth/*` return user objects only.
- Timetable generation endpoint: `POST /api/timetables/generate` accepts payload with `courses`, `teachers`, `rooms`, `days`, `slotsPerDay`, `timeslots` and returns a saved Timetable document.
