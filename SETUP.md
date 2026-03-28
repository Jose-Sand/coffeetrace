# CoffeeTrace MVP - Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL running locally
- Python 3.8+
- pip

## Quick Start

### 1. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../blockchain && npm install
```

### 2. Setup database
Create PostgreSQL database:
```sql
CREATE DATABASE coffeetrace;
```

Run migrations:
```bash
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

### 3. Start all services (4 terminals)

**Terminal 1 - Backend API:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

**Terminal 3 - IoT Simulator:**
```bash
cd iot-simulator
pip install -r requirements.txt
python simulator.py
```

**Terminal 4 - Blockchain (optional):**
```bash
cd blockchain && npx hardhat node
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: cd backend && npm run db:studio
