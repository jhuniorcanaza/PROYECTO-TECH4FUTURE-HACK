import { motion } from 'framer-motion'

export default function SpeciesCard({ especie, index = 0 }) {
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'en peligro':
        return 'bg-red-100 text-red-700'
      case 'vulnerable':
        return 'bg-amber-100 text-amber-700'
      case 'preocupacion menor':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getTipoEmoji = (tipo) => {
    switch (tipo) {
      case 'ave': return '🐦'
      case 'mamifero': return '🦊'
      case 'planta': return '🌿'
      case 'reptil': return '🦎'
      case 'anfibio': return '🐸'
      case 'insecto': return '🦋'
      default: return '🔬'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-shadow group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {especie.imagen ? (
          <img
            src={especie.imagen}
            alt={especie.nombre_comun}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x300/e8f5e9/2e7d32?text=${encodeURIComponent(especie.nombre_comun)}`
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-50">
            <span className="text-5xl">{getTipoEmoji(especie.tipo)}</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm capitalize">
          {getTipoEmoji(especie.tipo)} {especie.tipo}
        </div>

        {/* Conservation badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getEstadoStyle(especie.estado_conservacion)}`}>
          {especie.estado_conservacion}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-0.5">
          {especie.nombre_comun}
        </h3>
        <p className="text-sm italic text-gray-400 mb-3">
          {especie.nombre_cientifico}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {especie.descripcion}
        </p>
      </div>
    </motion.div>
  )
}
