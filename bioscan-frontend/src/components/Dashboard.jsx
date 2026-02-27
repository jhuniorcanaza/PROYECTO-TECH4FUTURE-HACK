import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bird, TreePine, Bug, Users, Eye, AlertTriangle } from 'lucide-react'
import { obtenerEstadisticas } from '../services/api'

const iconMap = {
  totalEspecies: TreePine,
  avesRegistradas: Bird,
  enPeligro: AlertTriangle,
  observacionesHoy: Eye,
  voluntariosActivos: Users,
  mariposasRegistradas: Bug,
}

const labelMap = {
  totalEspecies: 'Especies Totales',
  avesRegistradas: 'Aves Registradas',
  enPeligro: 'En Peligro',
  observacionesHoy: 'Observaciones Hoy',
  voluntariosActivos: 'Voluntarios Activos',
  mariposasRegistradas: 'Mariposas',
}

const colorMap = {
  totalEspecies: 'bg-green-100 text-green-700',
  avesRegistradas: 'bg-blue-100 text-blue-700',
  enPeligro: 'bg-red-100 text-red-700',
  observacionesHoy: 'bg-amber-100 text-amber-700',
  voluntariosActivos: 'bg-purple-100 text-purple-700',
  mariposasRegistradas: 'bg-orange-100 text-orange-700',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    obtenerEstadisticas().then(setStats)
  }, [])

  if (!stats) return null

  const cards = ['totalEspecies', 'avesRegistradas', 'enPeligro', 'observacionesHoy', 'voluntariosActivos', 'mariposasRegistradas']

  return (
    <section id="dashboard" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Dashboard de Biodiversidad
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Datos en tiempo real del monitoreo del Cerro San Pedro, Cochabamba
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((key, i) => {
            const Icon = iconMap[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${colorMap[key]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats[key]}</p>
                <p className="text-xs text-gray-500 mt-1">{labelMap[key]}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
