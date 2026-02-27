import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import SpeciesCard from '../components/SpeciesCard'
import especies from '../data/especies.json'

const tipos = ['todos', ...new Set(especies.map((e) => e.tipo))]
const estados = ['todos', 'en peligro', 'vulnerable', 'preocupacion menor', 'no evaluado']

export default function Catalog() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const filtradas = useMemo(() => {
    return especies.filter((esp) => {
      const matchBusqueda = !busqueda ||
        esp.nombre_comun.toLowerCase().includes(busqueda.toLowerCase()) ||
        esp.nombre_cientifico.toLowerCase().includes(busqueda.toLowerCase())
      const matchTipo = filtroTipo === 'todos' || esp.tipo === filtroTipo
      const matchEstado = filtroEstado === 'todos' || esp.estado_conservacion === filtroEstado
      return matchBusqueda && matchTipo && matchEstado
    })
  }, [busqueda, filtroTipo, filtroEstado])

  const conteo = useMemo(() => {
    const c = {}
    especies.forEach((e) => {
      c[e.tipo] = (c[e.tipo] || 0) + 1
    })
    return c
  }, [])

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">📋 Catálogo de Especies</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Explora las {especies.length} especies documentadas del Cerro San Pedro, Cochabamba
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 -mt-10 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 capitalize"
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t === 'todos' ? 'Todos los tipos' : `${t} (${conteo[t] || 0})`}
                  </option>
                ))}
              </select>
            </div>

            {/* State filter */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e === 'todos' ? 'Todos los estados' : e}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Mostrando {filtradas.length} de {especies.length} especies
          </p>
        </div>

        {/* Species grid */}
        {filtradas.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtradas.map((esp, i) => (
              <SpeciesCard key={esp.id} especie={esp} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">No se encontraron especies</p>
            <p className="text-gray-500">Intenta con otro término de búsqueda o filtro</p>
          </div>
        )}
      </div>
    </div>
  )
}
