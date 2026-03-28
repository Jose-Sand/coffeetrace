import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const router = Router();
const prisma = new PrismaClient();

// GET all lotes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const lotes = await prisma.lote.findMany({
      include: {
        actor: true,
        eventos: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        _count: { select: { eventos: true } },
      },
      orderBy: { creadoEn: 'desc' },
    });
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lotes' });
  }
});

// GET lote by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lote = await prisma.lote.findUnique({
      where: { id: req.params.id },
      include: {
        actor: true,
        eventos: {
          include: { actor: true },
          orderBy: { timestamp: 'asc' },
        },
        lecturas: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });
    if (!lote) return res.status(404).json({ error: 'Lote not found' });
    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lote' });
  }
});

// POST create lote
router.post('/', async (req: Request, res: Response) => {
  try {
    const { origen, variedad, fechaCosecha, pesoKg, actorId } = req.body;
    const codigo = `CF-${nanoid(8).toUpperCase()}`;

    const lote = await prisma.lote.create({
      data: {
        codigo,
        origen,
        variedad,
        fechaCosecha: new Date(fechaCosecha),
        pesoKg: pesoKg || 0,
        actorId,
        estado: 'COSECHADO',
      },
      include: { actor: true },
    });

    // Create initial event
    await prisma.evento.create({
      data: {
        loteId: lote.id,
        actorId,
        accion: 'COSECHA_REGISTRADA',
        datos: { origen, variedad, pesoKg, notas: 'Lote registrado en sistema' },
      },
    });

    res.status(201).json(lote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating lote' });
  }
});

// PATCH update lote estado
router.patch('/:id/estado', async (req: Request, res: Response) => {
  try {
    const { estado, actorId, accion, datos } = req.body;

    const lote = await prisma.lote.update({
      where: { id: req.params.id },
      data: { estado },
    });

    await prisma.evento.create({
      data: {
        loteId: lote.id,
        actorId,
        accion,
        datos: datos || {},
      },
    });

    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: 'Error updating lote' });
  }
});

export default router;
