import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: { actor: true, lote: true },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching eventos' });
  }
});

router.get('/lote/:loteId', async (req: Request, res: Response) => {
  try {
    const eventos = await prisma.evento.findMany({
      where: { loteId: req.params.loteId },
      include: { actor: true },
      orderBy: { timestamp: 'asc' },
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching eventos' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { loteId, actorId, accion, datos } = req.body;
    const evento = await prisma.evento.create({
      data: { loteId, actorId, accion, datos: datos || {} },
      include: { actor: true },
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error creating evento' });
  }
});

export default router;
