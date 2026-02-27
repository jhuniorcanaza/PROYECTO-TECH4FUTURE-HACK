import { Camera, ArrowDown, Leaf, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero({ onScrollToUpload }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 lg:py-28">
      {/* Decorative bg elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              ODS 15 — Vida de Ecosistemas Terrestres
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Identifica especies del{' '}
              <span className="gradient-text">Cerro San Pedro</span>{' '}
              con IA
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Sube una foto de cualquier especie y nuestra inteligencia artificial la identifica al instante.
              Ayuda a proteger las <strong>700+ especies</strong> del corredor biológico de Cochabamba.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onScrollToUpload}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Camera className="w-5 h-5" />
                Identificar Especie
              </button>
              <a
                href="#dashboard"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold px-8 py-4 rounded-2xl transition-all"
              >
                <ArrowDown className="w-5 h-5" />
                Ver Dashboard
              </a>
            </div>
          </motion.div>

          {/* Right - illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Main card */}
              <div className="w-80 h-96 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl shadow-2xl shadow-green-500/30 flex items-center justify-center overflow-hidden">
                <div className="text-center text-white p-6">
                  <Leaf className="w-20 h-20 mx-auto mb-4 animate-float" />
                  <p className="text-2xl font-bold mb-2">BioScan</p>
                  <p className="text-green-100">Cochabamba, Bolivia</p>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-xl p-4"
              >
                <p className="text-sm font-bold text-gray-800">🐦 104 Aves</p>
                <p className="text-xs text-gray-500">registradas</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-xl p-4"
              >
                <p className="text-sm font-bold text-gray-800">🌿 527 Plantas</p>
                <p className="text-xs text-gray-500">documentadas</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/2 -right-12 bg-red-50 text-red-700 rounded-2xl shadow-xl p-4"
              >
                <p className="text-sm font-bold">⚠️ 47 en peligro</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
