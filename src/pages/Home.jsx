import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import PhotoUpload from '../components/PhotoUpload'
import Dashboard from '../components/Dashboard'
import MapView from '../components/MapView'
import SpeciesCard from '../components/SpeciesCard'
import especies from '../data/especies.json'

export default function Home() {
  const uploadRef = useRef(null)

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Show only first 6 species as preview
  const preview = especies.slice(0, 6)

  return (
    <>
      <Hero onScrollToUpload={scrollToUpload} />

      <div ref={uploadRef}>
        <PhotoUpload />
      </div>

      <Dashboard />

      {/* Map section */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MapView />
        </div>
      </section>

      {/* Species preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              📋 Especies Destacadas
            </h2>
            <p className="text-gray-500">
              Algunas de las 700+ especies registradas en el Cerro San Pedro
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.map((esp, i) => (
              <SpeciesCard key={esp.id} especie={esp} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-2xl shadow-lg shadow-green-500/25 transition-all hover:scale-105"
            >
              Ver todo el catálogo →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ayuda a proteger la biodiversidad de Cochabamba
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Cada foto que subes alimenta nuestra base de datos y ayuda a monitorear el estado del Cerro San Pedro.
            Únete a los 156+ voluntarios activos.
          </p>
          <button
            onClick={scrollToUpload}
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all"
          >
            📸 Empezar a Escanear
          </button>
        </div>
      </section>
    </>
  )
}
