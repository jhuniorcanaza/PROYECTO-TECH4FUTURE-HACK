import MapView from '../components/MapView'

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-3">🗺️ Mapa Interactivo</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Explora la ubicación de cada especie registrada en el Cerro San Pedro
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MapView fullPage />
      </div>
    </div>
  )
}
