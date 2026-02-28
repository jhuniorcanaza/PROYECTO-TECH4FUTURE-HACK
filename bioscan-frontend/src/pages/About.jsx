import { motion } from 'framer-motion'
import { Leaf, Target, Users, Code, Shield, GraduationCap, Globe, Bird } from 'lucide-react'

const tecnologias = [
  { nombre: 'React 19 + Vite 6', desc: 'Frontend moderno, rápido y responsive', emoji: '⚛️' },
  { nombre: 'Tailwind CSS v4', desc: 'Estilos utilitarios con diseño profesional', emoji: '🎨' },
  { nombre: 'NestJS (TypeScript)', desc: 'Backend profesional, escalable y tipado', emoji: '🏗️' },
  { nombre: 'Plant.id API', desc: 'IA de visión para identificar plantas por foto', emoji: '🌿' },
  { nombre: 'iNaturalist API', desc: 'Base de datos real de biodiversidad global', emoji: '🔬' },
  { nombre: 'GBIF API', desc: 'Datos de biodiversidad a escala mundial', emoji: '🌍' },
  { nombre: 'Groq / Llama 3', desc: 'Chatbot eco-asistente impulsado por IA', emoji: '🤖' },
  { nombre: 'Leaflet.js + OpenStreetMap', desc: 'Mapas interactivos 100% open-source', emoji: '🗺️' },
  { nombre: 'Framer Motion', desc: 'Animaciones fluidas y experiencia premium', emoji: '✨' },
]

const ods = [
  {
    num: 15,
    titulo: 'Vida de Ecosistemas Terrestres',
    desc: 'Proteger, restaurar y promover el uso sostenible de los ecosistemas terrestres y detener la pérdida de biodiversidad.',
    color: 'bg-green-600',
    icon: '🌳',
  },
  {
    num: 13,
    titulo: 'Acción por el Clima',
    desc: 'Adoptar medidas urgentes para combatir el cambio climático y sus efectos sobre el planeta.',
    color: 'bg-emerald-700',
    icon: '🌡️',
  },
  {
    num: 11,
    titulo: 'Ciudades Sostenibles',
    desc: 'Hacer que las ciudades sean inclusivas, seguras, resilientes y sostenibles, preservando sus áreas verdes.',
    color: 'bg-blue-600',
    icon: '🏙️',
  },
  {
    num: 17,
    titulo: 'Alianzas para los Objetivos',
    desc: 'Fortalecer los medios de implementación mediante alianzas entre gobierno, sociedad civil y sector privado.',
    color: 'bg-blue-800',
    icon: '🤝',
  },
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 py-24 text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm mb-6 backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              Tech4Future Hack 2026 — Cochabamba, Bolivia
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Sobre BioScan Cochabamba
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              Una plataforma de monitoreo de biodiversidad impulsada por IA, creada por estudiantes
              de la <strong className="text-white">UPDS Cochabamba</strong> para proteger el
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
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🌍 Objetivos de Desarrollo Sostenible
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              BioScan está alineado con la Agenda 2030 de la ONU — contribuimos directamente a 4 ODS.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ods.map((o) => (
              <motion.div
                key={o.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`${o.color} text-white p-5 text-center`}>
                  <p className="text-3xl mb-1">{o.icon}</p>
                  <p className="text-4xl font-black">ODS {o.num}</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{o.titulo}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologías */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3 justify-center">
              <Code className="w-8 h-8 text-secondary" />
              Stack Tecnológico
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Elegimos tecnologías modernas, open-source y escalables para construir una solución robusta en 48 horas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tecnologias.map((tech, i) => (
              <motion.div
                key={tech.nombre}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
              >
                <span className="text-2xl mb-3 block">{tech.emoji}</span>
                <p className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors">{tech.nombre}</p>
                <p className="text-xs text-gray-500 mt-1">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3 justify-center">
              <Users className="w-8 h-8 text-primary" />
              Nuestro Equipo
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Somos tres estudiantes de la <strong>Universidad Privada Domingo Savio (UPDS)</strong>,
              sede Cochabamba. Este hackathon representa una oportunidad real de demostrar nuestras
              habilidades y aportar soluciones tecnológicas a problemas que afectan nuestra ciudad.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {/* Dylan - Frontend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-gradient-to-b from-green-50 to-white rounded-2xl p-7 border border-green-100 shadow-sm hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                🎨
              </div>
              <p className="font-black text-gray-900 text-lg leading-tight">Dylan Stuwarth</p>
              <p className="text-gray-600 text-sm font-medium">Camacho Bustamante</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                ⚛️ Frontend Developer
              </div>
              <div className="mt-4 space-y-1.5 text-left">
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 React + Tailwind CSS</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 UI/UX e Interfaces</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 Integración de APIs</p>
              </div>
            </motion.div>

            {/* Tomas - Backend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-7 border border-blue-100 shadow-sm hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                ⚙️
              </div>
              <p className="font-black text-gray-900 text-lg leading-tight">Tomas Zapata</p>
              <p className="text-gray-600 text-sm font-medium">Ortiz</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                🏗️ Backend Developer
              </div>
              <div className="mt-4 space-y-1.5 text-left">
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 NestJS + TypeScript</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 APIs e Integraciones</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 Arquitectura de Datos</p>
              </div>
            </motion.div>

            {/* Jhunior - Datos + Pitch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-7 border border-amber-100 shadow-sm hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                📊
              </div>
              <p className="font-black text-gray-900 text-lg leading-tight">Jhunior Danilo</p>
              <p className="text-gray-600 text-sm font-medium">Sonco Canaza</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                📈 Datos + Pitch
              </div>
              <div className="mt-4 space-y-1.5 text-left">
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 Investigación de datos</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 Presentación y Pitch</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">🔷 Gestión del proyecto</p>
              </div>
            </motion.div>
          </div>

          {/* Universidad badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl p-8 text-white text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <GraduationCap className="w-8 h-8" />
              <h3 className="text-2xl font-bold">UPDS — Universidad Privada Domingo Savio</h3>
            </div>
            <p className="text-green-100 max-w-2xl mx-auto">
              Sede Cochabamba, Bolivia. Ingeniería en Sistemas e Informática.
              Este proyecto es una demostración de que los estudiantes bolivianos pueden crear
              soluciones tecnológicas de impacto real para los problemas de su entorno.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                🏆 Tech4Future Hack 2026
              </span>
              <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                🤝 Hub Boliviano de IA
              </span>
              <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                💙 Microsoft Learn Student Ambassadors
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Misión final */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nuestra Visión
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              BioScan Cochabamba nació en 48 horas, pero representa algo más grande:
              la voluntad de tres jóvenes de usar la tecnología para proteger la naturaleza de su ciudad.
              El Cerro San Pedro es de todos — y todos podemos contribuir a conservarlo.
            </p>
            <p className="text-green-700 font-semibold mt-4 text-lg">
              🌿 "La tecnología al servicio de la biodiversidad boliviana"
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
