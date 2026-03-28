import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import lotesRouter from './routes/lotes';
import eventosRouter from './routes/eventos';
import actoresRouter from './routes/actores';
import iotRouter from './routes/iot';
import { startMqttClient } from './mqtt/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/lotes', lotesRouter);
app.use('/api/eventos', eventosRouter);
app.use('/api/actores', actoresRouter);
app.use('/api/iot', iotRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CoffeeTrace API running on http://localhost:${PORT}`);
  // startMqttClient(); // Uncomment when MQTT broker is available
});

export { prisma };
