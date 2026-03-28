import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const actores = await prisma.actor.findMany({
      include: {
        _count: { select: { lotes: true, eventos: true } },
      },
    });
    res.json(actores);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching actores' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const actor = await prisma.actor.findUnique({
      where: { id: req.params.id },
      include: {
        lotes: {
          include: { _count: { select: { eventos: true } } },
          orderBy: { creadoEn: 'desc' },
        },
        eventos: {
          include: { lote: true },
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });
    if (!actor) return res.status(404).json({ error: 'Actor not found' });
    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching actor' });
  }
});

export default router;
