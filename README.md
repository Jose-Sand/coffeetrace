# CoffeeTrace ☕

Plataforma de trazabilidad blockchain para café de especialidad. Permite rastrear un lote de café desde la finca hasta el consumidor final, registrando cada etapa de la cadena de suministro con datos verificables.

## ¿Qué hace?

- **Trazabilidad completa**: cada lote recorre Finca → Beneficio → Exportador → Tostador
- **Línea de tiempo de eventos**: cada actor registra su acción con datos estructurados
- **Sensores IoT simulados**: temperatura, humedad y peso actualizados cada 5 segundos
- **QR por lote**: escaneable para ver el historial completo del lote
- **Registro blockchain**: smart contract en Solidity que guarda un hash de cada evento
- **Dashboard en tiempo real**: visualización con gráficas y estado de cada lote

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + Recharts |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL + Prisma ORM |
| Blockchain | Hardhat + Solidity (Polygon Mumbai / local) |
| IoT simulado | Python + requests |
| QR | qrcode.react |

## Estructura

```
coffeetrace/
├── frontend/        → Dashboard Next.js
├── backend/         → API REST Express
├── blockchain/      → Smart contract Solidity
└── iot-simulator/   → Simulador Python
```

## Requisitos

- Node.js 18+
- PostgreSQL corriendo localmente
- Python 3.8+

## Instalación

```bash
# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install
cd ../blockchain && npm install

# Crear base de datos
psql -U postgres -c "CREATE DATABASE coffeetrace;"

# Migrar y poblar datos de demo
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

## Correr el proyecto (4 terminales)

```bash
# Terminal 1 — API
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Simulador IoT
cd iot-simulator
pip install -r requirements.txt
python simulator.py

# Terminal 4 — Blockchain (opcional)
cd blockchain && npx hardhat node
```

## URLs locales

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3002 |
| Backend API | http://localhost:3001 |
| Health check | http://localhost:3001/health |
| Prisma Studio | `cd backend && npm run db:studio` |

## Despliegue en producción

| Servicio | Plataforma |
|---|---|
| Frontend | Vercel (Root Directory: `frontend`) |
| Backend | Railway (Root Directory: `backend`) |
| Base de datos | Neon (PostgreSQL serverless) |

Variables de entorno necesarias:

**Backend (Railway):**
```
DATABASE_URL=postgresql://...
PORT=3001
```

**Frontend (Vercel):**
```
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app
```

## Actores de la cadena

1. **Finca** — registra variedad, altitud, método de cosecha y peso
2. **Beneficio** — registra proceso (lavado/natural/honey), días de secado y puntaje de calidad
3. **Exportador** — registra número de BL, destino, naviera y certificaciones
4. **Tostador** — registra perfil de tueste, temperatura máxima y duración
5. **Consumidor** — escanea el QR y ve el historial completo del lote
