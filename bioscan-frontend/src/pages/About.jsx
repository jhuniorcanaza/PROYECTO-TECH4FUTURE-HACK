import { motion } from 'framer-motion'
import { Leaf, Target, Users, Code, Shield, ExternalLink } from 'lucide-react'

const tecnologias = [
  { nombre: 'React + Tailwind CSS', desc: 'Frontend moderno y responsive', emoji: '⚛️' },
  { nombre: 'NestJS (TypeScript)', desc: 'Backend profesional y escalable', emoji: '🏗️' },
  { nombre: 'Plant.id API', desc: 'IA de visión para identificar plantas', emoji: '🌿' },
  { nombre: 'Groq (Llama 3)', desc: 'Chatbot eco-asistente con IA', emoji: '🤖' },
  { nombre: 'iNaturalist API', desc: 'Base de datos de biodiversidad', emoji: '🔬' },
  { nombre: 'Leaflet.js + OpenStreetMap', desc: 'Mapas interactivos open-source', emoji: '🗺️' },
]

const ods = [
  {
    num: 15,
    titulo: 'Vida de Ecosistemas Terrestres',
    desc: 'Proteger, restaurar y promover el uso sostenible de los ecosistemas terrestres y detener la pérdida de biodiversidad.',
    color: 'bg-green-600',
  },
  {
    num: 13,
    titulo: 'Acción por el Clima',
    desc: 'Adoptar medidas urgentes para combatir el cambio climático y sus efectos.',
    color: 'bg-emerald-700',
  },
  {
    num: 17,
    titulo: 'Alianzas para lograr los Objetivos',
    desc: 'Fortalecer los medios de implementación mediante alianzas entre gobierno, sociedad civil y sector privado.',
    color: 'bg-blue-800',
  },
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-700 to-green-800 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-6">
              <Shield className="w-4 h-4" />
              Tech4Future Hack 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Sobre BioScan Cochabamba
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Una plataforma de monitoreo de biodiversidad impulsada por IA, creada para proteger el
              Cerro San Pedro y sus 700+ especies.
            </p>
          </motion.div>
        </div>
      </div>

      {/* El problema */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-red-500" />
              El Problema
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                El <strong>Cerro San Pedro</strong> es un corredor biológico urbano vital en Cochabamba, Bolivia.
                Alberga más de <strong>700 especies</strong> registradas: 104 aves, 527 plantas, 41 mariposas,
                10 murciélagos y muchos más.
              </p>
              <p>
                Sin embargo, enfrenta múltiples amenazas en 2026:
              </p>
              <ul className="space-y-2">
                <li>🚧 <strong>Proyecto del túnel</strong> que fragmentaría los corredores biológicos</li>
                <li>🏘️ <strong>Asentamientos ilegales</strong> que destruyen hábitat nativo</li>
                <li>🔥 <strong>Quemas e incendios</strong> estacionales que arrasan vegetación</li>
                <li>📝 <strong>Falta de tecnología</strong> — los voluntarios registran datos manualmente en cuadernos</li>
              </ul>
              <p>
                La <strong>Monterita de Cochabamba</strong> (<em>Poospiza garleppi</em>), un ave endémica que solo
                existe aquí, está en peligro crítico de extinción.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* La solución */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              Nuestra Solución
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100">
              <p className="text-lg text-gray-600 mb-6">
                <strong>BioScan Cochabamba</strong> digitaliza el monitoreo de biodiversidad:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: '📸', title: 'Identificación con IA', desc: 'Sube una foto y la IA identifica la especie al instante' },
                  { icon: '🗺️', title: 'Mapa interactivo', desc: 'Visualiza dónde se encuentran las especies en el cerro' },
                  { icon: '🤖', title: 'Eco-Asistente', desc: 'Chatbot que responde preguntas sobre biodiversidad local' },
                  { icon: '📊', title: 'Dashboard en tiempo real', desc: 'Estadísticas de especies, estado de conservación y más' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 bg-green-50 rounded-xl">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ODS */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🌍 Objetivos de Desarrollo Sostenible
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ods.map((o) => (
              <motion.div
                key={o.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className={`${o.color} text-white p-4 text-center`}>
                  <p className="text-4xl font-bold">{o.num}</p>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{o.titulo}</h3>
                  <p className="text-sm text-gray-600">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologías */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 justify-center">
            <Code className="w-8 h-8 text-secondary" />
            Stack Tecnológico
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tecnologias.map((tech) => (
              <motion.div
                key={tech.nombre}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl mb-2 block">{tech.emoji}</span>
                <p className="font-bold text-gray-900 text-sm">{tech.nombre}</p>
                <p className="text-xs text-gray-500">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 justify-center">
            <Users className="w-8 h-8 text-primary" />
            Nuestro Equipo
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { rol: 'Frontend', nombre: 'Persona A', tech: 'React + Tailwind', emoji: '🎨' },
              { rol: 'Backend + IA', nombre: 'Persona B', tech: 'NestJS + APIs', emoji: '⚙️' },
              { rol: 'Datos + Pitch', nombre: 'Persona C', tech: 'Investigación + Presentación', emoji: '📊' },
            ].map((member) => (
              <div key={member.rol} className="bg-gray-50 rounded-2xl p-6">
                <span className="text-4xl block mb-3">{member.emoji}</span>
                <p className="font-bold text-gray-900">{member.nombre}</p>
                <p className="text-primary font-medium text-sm">{member.rol}</p>
                <p className="text-xs text-gray-500 mt-1">{member.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
