import Link from 'next/link';
import { getLotes, getActores } from '@/lib/api';

const ESTADO_CONFIG: Record<string, { label: string; color: string; step: number }> = {
  COSECHADO: { label: 'Cosechado', color: 'bg-green-100 text-green-800 border-green-200', step: 1 },
  PROCESADO: { label: 'Procesado', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', step: 2 },
  EXPORTADO: { label: 'Exportado', color: 'bg-blue-100 text-blue-800 border-blue-200', step: 3 },
  TOSTADO: { label: 'Tostado', color: 'bg-orange-100 text-orange-800 border-orange-200', step: 4 },
  DISPONIBLE: { label: 'Disponible', color: 'bg-purple-100 text-purple-800 border-purple-200', step: 5 },
};

const ACTOR_ICONS: Record<string, string> = {
  FINCA: '🌱',
  BENEFICIO: '⚙️',
  EXPORTADOR: '🚢',
  TOSTADOR: '🔥',
};

export default async function Home() {
  let lotes = [];
  let actores = [];

  try {
    [lotes, actores] = await Promise.all([getLotes(), getActores()]);
  } catch (e) {
    // Will show empty state
  }

  const estadoStats = Object.keys(ESTADO_CONFIG).reduce((acc, estado) => {
    acc[estado] = lotes.filter((l: any) => l.estado === estado).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-amber-50">
      {/* Header */}
      <header className="bg-coffee-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☕</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CoffeeTrace</h1>
              <p className="text-coffee-300 text-sm">Trazabilidad de café en blockchain</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-coffee-300 text-sm">{new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Sistema activo"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(ESTADO_CONFIG).map(([estado, config]) => (
            <div key={estado} className="bg-white rounded-xl shadow-sm border border-coffee-100 p-4 text-center">
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border mb-2 ${config.color}`}>
                {config.label}
              </div>
              <div className="text-3xl font-bold text-coffee-900">{estadoStats[estado] || 0}</div>
              <div className="text-xs text-gray-500 mt-1">lotes</div>
            </div>
          ))}
        </div>

        {/* Actors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {actores.map((actor: any) => (
            <div key={actor.id} className="bg-white rounded-xl shadow-sm border border-coffee-100 p-4 flex items-center gap-3">
              <span className="text-2xl">{ACTOR_ICONS[actor.tipo] || '👤'}</span>
              <div>
                <div className="font-medium text-coffee-900 text-sm">{actor.nombre}</div>
                <div className="text-xs text-gray-500">{actor.tipo}</div>
                {actor.ubicacion && <div className="text-xs text-gray-400">📍 {actor.ubicacion}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Lotes table */}
        <div className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-coffee-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-coffee-900">Lotes de Café</h2>
            <span className="text-sm text-gray-500">{lotes.length} lotes registrados</span>
          </div>

          {lotes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg">No hay lotes registrados</p>
              <p className="text-gray-300 text-sm mt-2">Ejecuta el seed: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code></p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lotes.map((lote: any) => {
                const estadoConf = ESTADO_CONFIG[lote.estado] || ESTADO_CONFIG.COSECHADO;
                const ultimoEvento = lote.eventos?.[0];
                return (
                  <Link
                    key={lote.id}
                    href={`/lote/${lote.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-coffee-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center text-xl">
                        ☕
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-coffee-900">{lote.codigo}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${estadoConf.color}`}>
                            {estadoConf.label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-0.5">
                          {lote.variedad} · {lote.origen}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {lote.actor.nombre} · {lote.pesoKg}kg · {lote._count?.eventos || 0} eventos
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(lote.fechaCosecha).toLocaleDateString('es-CO')}
                      </div>
                      {ultimoEvento && (
                        <div className="text-xs text-gray-400 mt-1">
                          Último: {ultimoEvento.accion.replace(/_/g, ' ')}
                        </div>
                      )}
                      <div className="text-coffee-600 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver detalle →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
