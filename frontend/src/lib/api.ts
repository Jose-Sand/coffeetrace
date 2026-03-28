const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Actor {
  id: string;
  nombre: string;
  tipo: 'FINCA' | 'BENEFICIO' | 'EXPORTADOR' | 'TOSTADOR';
  ubicacion?: string;
  wallet?: string;
}

export interface Lote {
  id: string;
  codigo: string;
  origen: string;
  variedad: string;
  fechaCosecha: string;
  estado: 'COSECHADO' | 'PROCESADO' | 'EXPORTADO' | 'TOSTADO' | 'DISPONIBLE';
  pesoKg: number;
  actor: Actor;
  eventos?: Evento[];
  lecturas?: LecturaIoT[];
  _count?: { eventos: number };
}

export interface Evento {
  id: string;
  loteId: string;
  actorId: string;
  actor: Actor;
  accion: string;
  datos: Record<string, any>;
  timestamp: string;
  txHash?: string;
}

export interface LecturaIoT {
  id: string;
  loteId: string;
  temperatura: number;
  humedad: number;
  peso: number;
  timestamp: string;
}

export async function getLotes(): Promise<Lote[]> {
  const res = await fetch(`${API_URL}/api/lotes`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch lotes');
  return res.json();
}

export async function getLote(id: string): Promise<Lote> {
  const res = await fetch(`${API_URL}/api/lotes/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch lote');
  return res.json();
}

export async function getActores(): Promise<Actor[]> {
  const res = await fetch(`${API_URL}/api/actores`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch actores');
  return res.json();
}

export async function getLecturas(loteId: string): Promise<LecturaIoT[]> {
  const res = await fetch(`${API_URL}/api/iot/lecturas/${loteId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch lecturas');
  return res.json();
}
