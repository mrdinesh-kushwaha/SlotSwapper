# SlotSwapper

SlotSwapper is a peer-to-peer time-slot swapping application.

## Quick Start

1. Start MongoDB locally (or use Atlas). For local dev, use mongodb://127.0.0.1:27017/slotswapper
2. Backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
3. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

API base: http://localhost:4000

See backend/.env.example for env vars.
