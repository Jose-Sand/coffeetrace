import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function startMqttClient() {
  const brokerUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log('📡 MQTT connected');
    client.subscribe('coffee/lote/+/sensores');
  });

  client.on('message', async (topic: string, message: Buffer) => {
    try {
      const parts = topic.split('/');
      const loteId = parts[2];
      const data = JSON.parse(message.toString());

      await prisma.lecturaIoT.create({
        data: {
          loteId,
          temperatura: data.temperatura,
          humedad: data.humedad,
          peso: data.peso,
        },
      });
      console.log(`IoT data saved for lote ${loteId}`);
    } catch (error) {
      console.error('Error saving IoT data:', error);
    }
  });

  client.on('error', (err: Error) => {
    console.error('MQTT error:', err);
  });
}
