import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/lecturas/:loteId', async (req: Request, res: Response) => {
  try {
    const lecturas = await prisma.lecturaIoT.findMany({
      where: { loteId: req.params.loteId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lecturas' });
  }
});

router.post('/lecturas', async (req: Request, res: Response) => {
  try {
    const { loteId, temperatura, humedad, peso } = req.body;
    const lectura = await prisma.lecturaIoT.create({
      data: { loteId, temperatura, humedad, peso },
    });
    res.status(201).json(lectura);
  } catch (error) {
    res.status(500).json({ error: 'Error saving lectura' });
  }
});

export default router;
