import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.lecturaIoT.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.lote.deleteMany();
  await prisma.actor.deleteMany();

  // Create actors
  const finca = await prisma.actor.create({
    data: {
      nombre: 'Finca El Paraíso',
      tipo: 'FINCA',
      ubicacion: 'Huila, Colombia',
      wallet: '0x742d35Cc6634C0532925a3b8D4C9B7F5e3d8F1a2',
    },
  });

  const beneficio = await prisma.actor.create({
    data: {
      nombre: 'Beneficio San Rafael',
      tipo: 'BENEFICIO',
      ubicacion: 'Pitalito, Huila',
      wallet: '0x8a3D9B2c4E7F1a5b6C8d9E0f1A2B3c4D5e6F7a8B',
    },
  });

  const exportador = await prisma.actor.create({
    data: {
      nombre: 'Exportcafé Colombia S.A.',
      tipo: 'EXPORTADOR',
      ubicacion: 'Bogotá, Colombia',
      wallet: '0x1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c',
    },
  });

  const tostador = await prisma.actor.create({
    data: {
      nombre: 'Artisan Roasters GmbH',
      tipo: 'TOSTADOR',
      ubicacion: 'Berlín, Alemania',
      wallet: '0x9C8b7A6d5E4f3C2b1A0d9E8f7C6b5A4d3E2f1C0b',
    },
  });

  console.log('✅ Actores creados');

  // Create batch 1 - complete journey
  const lote1 = await prisma.lote.create({
    data: {
      codigo: 'CF-HUI2024A',
      origen: 'Huila, Colombia',
      variedad: 'Caturra',
      fechaCosecha: new Date('2024-03-15'),
      estado: 'TOSTADO',
      pesoKg: 1200,
      actorId: finca.id,
    },
  });

  await prisma.evento.createMany({
    data: [
      {
        loteId: lote1.id,
        actorId: finca.id,
        accion: 'COSECHA_REGISTRADA',
        datos: {
          variedad: 'Caturra',
          altitud: '1650 msnm',
          metodoCosecha: 'Selectiva manual',
          pesoKg: 1200,
          notas: 'Cosecha de temporada principal, granos en óptimo estado',
        },
        timestamp: new Date('2024-03-15T08:00:00Z'),
      },
      {
        loteId: lote1.id,
        actorId: beneficio.id,
        accion: 'PROCESO_INICIADO',
        datos: {
          proceso: 'Lavado',
          duracionFermentacion: '36 horas',
          puntajeCalidad: 86,
          notas: 'Proceso lavado estándar, fermentación controlada',
        },
        timestamp: new Date('2024-03-16T09:00:00Z'),
      },
      {
        loteId: lote1.id,
        actorId: exportador.id,
        accion: 'EXPORTACION_PREPARADA',
        datos: {
          numeroBL: 'BL-2024-04521',
          destino: 'Hamburgo, Alemania',
          naviera: 'Maersk Line',
          fechaSalida: '2024-04-10',
          certificaciones: ['Fair Trade', 'Rainforest Alliance'],
        },
        timestamp: new Date('2024-04-08T14:00:00Z'),
      },
      {
        loteId: lote1.id,
        actorId: tostador.id,
        accion: 'TUESTE_COMPLETADO',
        datos: {
          perfilTueste: 'Medium Roast',
          temperaturaMax: 210,
          duracionMinutos: 12,
          perdidaPeso: '18%',
          notas: 'Perfil diseñado para resaltar notas frutales de la variedad',
        },
        timestamp: new Date('2024-05-03T10:00:00Z'),
      },
    ],
  });

  // Add IoT readings for lote1
  const iotReadings1 = Array.from({ length: 20 }, (_, i) => ({
    loteId: lote1.id,
    temperatura: 18 + Math.random() * 8,
    humedad: 55 + Math.random() * 20,
    peso: 1180 + Math.random() * 40,
    timestamp: new Date(Date.now() - (20 - i) * 5 * 60 * 1000),
  }));

  await prisma.lecturaIoT.createMany({ data: iotReadings1 });

  // Create batch 2 - in export
  const lote2 = await prisma.lote.create({
    data: {
      codigo: 'CF-NAR2024B',
      origen: 'Nariño, Colombia',
      variedad: 'Geisha',
      fechaCosecha: new Date('2024-04-02'),
      estado: 'EXPORTADO',
      pesoKg: 800,
      actorId: finca.id,
    },
  });

  await prisma.evento.createMany({
    data: [
      {
        loteId: lote2.id,
        actorId: finca.id,
        accion: 'COSECHA_REGISTRADA',
        datos: {
          variedad: 'Geisha',
          altitud: '1900 msnm',
          metodoCosecha: 'Selectiva manual',
          pesoKg: 800,
          notas: 'Variedad premium, condiciones de cultivo excepcionales',
        },
        timestamp: new Date('2024-04-02T07:00:00Z'),
      },
      {
        loteId: lote2.id,
        actorId: beneficio.id,
        accion: 'PROCESO_INICIADO',
        datos: {
          proceso: 'Natural',
          diasSecado: 21,
          puntajeCalidad: 91,
          notas: 'Proceso natural en camas africanas, secado controlado',
        },
        timestamp: new Date('2024-04-04T08:00:00Z'),
      },
      {
        loteId: lote2.id,
        actorId: exportador.id,
        accion: 'EXPORTACION_PREPARADA',
        datos: {
          numeroBL: 'BL-2024-05133',
          destino: 'Tokio, Japón',
          naviera: 'CMA CGM',
          fechaSalida: '2024-05-15',
          certificaciones: ['Organic', 'Cup of Excellence'],
        },
        timestamp: new Date('2024-05-12T16:00:00Z'),
      },
    ],
  });

  const iotReadings2 = Array.from({ length: 15 }, (_, i) => ({
    loteId: lote2.id,
    temperatura: 16 + Math.random() * 6,
    humedad: 52 + Math.random() * 15,
    peso: 790 + Math.random() * 20,
    timestamp: new Date(Date.now() - (15 - i) * 5 * 60 * 1000),
  }));

  await prisma.lecturaIoT.createMany({ data: iotReadings2 });

  // Create batch 3 - fresh harvest
  const lote3 = await prisma.lote.create({
    data: {
      codigo: 'CF-ANT2024C',
      origen: 'Antioquia, Colombia',
      variedad: 'Castillo',
      fechaCosecha: new Date('2024-05-20'),
      estado: 'PROCESADO',
      pesoKg: 1500,
      actorId: finca.id,
    },
  });

  await prisma.evento.createMany({
    data: [
      {
        loteId: lote3.id,
        actorId: finca.id,
        accion: 'COSECHA_REGISTRADA',
        datos: {
          variedad: 'Castillo',
          altitud: '1450 msnm',
          metodoCosecha: 'Mecánica asistida',
          pesoKg: 1500,
          notas: 'Variedad resistente a roya, alta producción',
        },
        timestamp: new Date('2024-05-20T06:00:00Z'),
      },
      {
        loteId: lote3.id,
        actorId: beneficio.id,
        accion: 'PROCESO_INICIADO',
        datos: {
          proceso: 'Honey',
          diasSecado: 14,
          puntajeCalidad: 84,
          notas: 'Proceso honey amarillo, secado en marquesinas',
        },
        timestamp: new Date('2024-05-22T10:00:00Z'),
      },
    ],
  });

  const iotReadings3 = Array.from({ length: 10 }, (_, i) => ({
    loteId: lote3.id,
    temperatura: 22 + Math.random() * 8,
    humedad: 60 + Math.random() * 20,
    peso: 1480 + Math.random() * 30,
    timestamp: new Date(Date.now() - (10 - i) * 5 * 60 * 1000),
  }));

  await prisma.lecturaIoT.createMany({ data: iotReadings3 });

  console.log('✅ Lotes y eventos creados');
  console.log('✅ Lecturas IoT creadas');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\nLote IDs para QR:');
  console.log(`  Lote 1 (Tostado): ${lote1.id}`);
  console.log(`  Lote 2 (Exportado): ${lote2.id}`);
  console.log(`  Lote 3 (Procesado): ${lote3.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
