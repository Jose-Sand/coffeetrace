'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getLote, getLecturas, Lote, LecturaIoT } from '@/lib/api';

const ESTADO_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  COSECHADO: { label: 'Cosechado', color: 'text-green-700 bg-green-50 border-green-200', icon: '🌱' },
  PROCESADO: { label: 'Procesado', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: '⚙️' },
  EXPORTADO: { label: 'Exportado', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: '🚢' },
  TOSTADO: { label: 'Tostado', color: 'text-orange-700 bg-orange-50 border-orange-200', icon: '🔥' },
  DISPONIBLE: { label: 'Disponible', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: '✅' },
};

const ACCION_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  COSECHA_REGISTRADA: { label: 'Cosecha Registrada', icon: '🌱', color: 'bg-green-500' },
  PROCESO_INICIADO: { label: 'Proceso Iniciado', icon: '⚙️', color: 'bg-yellow-500' },
  EXPORTACION_PREPARADA: { label: 'Exportación Preparada', icon: '🚢', color: 'bg-blue-500' },
  TUESTE_COMPLETADO: { label: 'Tueste Completado', icon: '🔥', color: 'bg-orange-500' },
  DISPONIBLE_VENTA: { label: 'Disponible para Venta', icon: '✅', color: 'bg-purple-500' },
};

const JOURNEY_STEPS = [
  { key: 'COSECHA_REGISTRADA', label: 'Finca', icon: '🌱', estado: 'COSECHADO' },
  { key: 'PROCESO_INICIADO', label: 'Beneficio', icon: '⚙️', estado: 'PROCESADO' },
  { key: 'EXPORTACION_PREPARADA', label: 'Exportador', icon: '🚢', estado: 'EXPORTADO' },
  { key: 'TUESTE_COMPLETADO', label: 'Tostador', icon: '🔥', estado: 'TOSTADO' },
];

export default function LotePage() {
  const params = useParams();
  const id = params.id as string;
  const [lote, setLote] = useState<Lote | null>(null);
  const [lecturas, setLecturas] = useState<LecturaIoT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'iot' | 'blockchain'>('timeline');
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/lote/${id}` : `http://localhost:3002/lote/${id}`;

  const fetchData = useCallback(async () => {
    try {
      const [loteData, lecturasData] = await Promise.all([
        getLote(id),
        getLecturas(id),
      ]);
      setLote(loteData);
      setLecturas(lecturasData.reverse());
    } catch (err) {
      setError('Error cargando datos del lote');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-spin mb-4">☕</div>
          <p className="text-coffee-700 font-medium">Cargando trazabilidad...</p>
        </div>
      </div>
    );
  }

  if (error || !lote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Lote no encontrado'}</p>
          <Link href="/" className="text-coffee-600 hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const estadoConf = ESTADO_CONFIG[lote.estado] || ESTADO_CONFIG.COSECHADO;
  const completedSteps = JOURNEY_STEPS.filter(step =>
    lote.eventos?.some(e => e.accion === step.key)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-amber-50">
      {/* Header */}
      <header className="bg-coffee-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-coffee-300 hover:text-white transition-colors text-sm">
            ← Dashboard
          </Link>
          <span className="text-coffee-600">|</span>
          <span className="text-sm text-coffee-300">Trazabilidad de Lote</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Lote header */}
        <div className="bg-white rounded-xl shadow-sm border border-coffee-100 p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-coffee-900 font-mono">{lote.codigo}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${estadoConf.color}`}>
                  {estadoConf.icon} {estadoConf.label}
                </span>
              </div>
              <p className="text-gray-600 text-lg">{lote.variedad} · {lote.origen}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span>📅 Cosecha: {new Date(lote.fechaCosecha).toLocaleDateString('es-CO', { dateStyle: 'long' })}</span>
                <span>⚖️ Peso: {lote.pesoKg} kg</span>
                <span>👤 {lote.actor.nombre}</span>
                <span>📍 {lote.actor.ubicacion}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white p-3 rounded-xl border-2 border-coffee-200 shadow-sm">
                <QRCodeSVG value={qrUrl} size={120} fgColor="#3d1f0a" />
              </div>
              <span className="text-xs text-gray-500">Escanear para ver trazabilidad</span>
            </div>
          </div>
        </div>

        {/* Journey progress */}
        <div className="bg-white rounded-xl shadow-sm border border-coffee-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-coffee-900 mb-4">Recorrido del Lote</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            {JOURNEY_STEPS.map((step, i) => {
              const completed = lote.eventos?.some(e => e.accion === step.key);
              const isCurrent = !completed && i === completedSteps.length;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                    completed
                      ? 'bg-coffee-600 border-coffee-600 text-white'
                      : isCurrent
                      ? 'bg-coffee-100 border-coffee-400 text-coffee-600 animate-pulse'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-medium ${completed ? 'text-coffee-700' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                  {completed && <span className="text-xs text-green-600">✓ Completado</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {([
              { key: 'timeline', label: '📋 Línea de Tiempo', count: lote.eventos?.length },
              { key: 'iot', label: '📡 Datos IoT', count: lecturas.length },
              { key: 'blockchain', label: '⛓️ Blockchain', count: null },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-coffee-600 text-coffee-700 bg-coffee-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="bg-coffee-100 text-coffee-700 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Timeline */}
            {activeTab === 'timeline' && (
              <div className="space-y-0">
                {lote.eventos?.map((evento, i) => {
                  const accionConf = ACCION_CONFIG[evento.accion] || {
                    label: evento.accion.replace(/_/g, ' '),
                    icon: '📝',
                    color: 'bg-gray-400',
                  };
                  return (
                    <div key={evento.id} className="flex gap-4 relative">
                      {i < (lote.eventos?.length ?? 0) - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100 z-0"></div>
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0 z-10 ${accionConf.color}`}>
                        {accionConf.icon}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-semibold text-gray-900">{accionConf.label}</span>
                              <span className="ml-2 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border">
                                {evento.actor.nombre}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {new Date(evento.timestamp).toLocaleString('es-CO')}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                            {Object.entries(evento.datos).map(([key, val]) => (
                              <div key={key} className="bg-white rounded-lg p-2 border border-gray-100">
                                <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div className="text-sm font-medium text-gray-800 truncate">
                                  {Array.isArray(val) ? val.join(', ') : String(val)}
                                </div>
                              </div>
                            ))}
                          </div>
                          {evento.txHash && (
                            <div className="mt-2 text-xs text-gray-400 font-mono">
                              ⛓️ TX: {evento.txHash}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* IoT */}
            {activeTab === 'iot' && (
              <div>
                {lecturas.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-3">📡</p>
                    <p>No hay lecturas IoT disponibles</p>
                    <p className="text-sm mt-1">Ejecuta el simulador: <code className="bg-gray-100 px-2 py-1 rounded">python simulator.py</code></p>
                  </div>
                ) : (
                  <>
                    {/* Current readings */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { key: 'temperatura', label: 'Temperatura', unit: '°C', icon: '🌡️', color: 'text-red-600', bg: 'bg-red-50' },
                        { key: 'humedad', label: 'Humedad', unit: '%', icon: '💧', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { key: 'peso', label: 'Peso', unit: 'kg', icon: '⚖️', color: 'text-green-600', bg: 'bg-green-50' },
                      ].map(metric => {
                        const last = lecturas[lecturas.length - 1];
                        const val = last ? (last as any)[metric.key] : null;
                        return (
                          <div key={metric.key} className={`${metric.bg} rounded-xl p-4 border`}>
                            <div className="text-2xl mb-1">{metric.icon}</div>
                            <div className={`text-2xl font-bold ${metric.color}`}>
                              {val !== null ? Number(val).toFixed(1) : '--'}{metric.unit}
                            </div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                            <div className="text-xs text-gray-400 mt-1">Última lectura</div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Charts */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Temperatura y Humedad (últimas lecturas)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={lecturas.slice(-20)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="timestamp"
                              tickFormatter={(v) => new Date(v).toLocaleTimeString('es-CO', { timeStyle: 'short' })}
                              tick={{ fontSize: 11 }}
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                              labelFormatter={(v) => new Date(v).toLocaleString('es-CO')}
                              formatter={(v: any, name: string) => [Number(v).toFixed(1), name]}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="temperatura" stroke="#ef4444" name="Temp (°C)" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="humedad" stroke="#3b82f6" name="Humedad (%)" dot={false} strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Blockchain */}
            {activeTab === 'blockchain' && (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm">
                  <div className="text-gray-400 mb-4"># Registro en blockchain</div>
                  <div>contrato: CoffeeTrace.sol</div>
                  <div>red: Polygon Mumbai / Hardhat Local</div>
                  <div>loteId: {lote.id}</div>
                  <div>codigo: {lote.codigo}</div>
                  <div>eventos: {lote.eventos?.length || 0} registrados</div>
                  <div className="mt-4 text-yellow-400">
                    {lote.txHash
                      ? `txHash: ${lote.txHash}`
                      : '# Para registrar en blockchain, conecta Hardhat node'}
                  </div>
                </div>
                <div className="bg-coffee-50 rounded-xl p-4 border border-coffee-200">
                  <h3 className="font-semibold text-coffee-900 mb-2">¿Cómo funciona?</h3>
                  <ol className="text-sm text-coffee-700 space-y-2 list-decimal list-inside">
                    <li>Cada evento en la cadena de suministro genera un hash único</li>
                    <li>El hash se registra en el smart contract CoffeeTrace.sol</li>
                    <li>La transacción queda inmutable en la blockchain</li>
                    <li>Cualquier persona puede verificar la autenticidad escaneando el QR</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
