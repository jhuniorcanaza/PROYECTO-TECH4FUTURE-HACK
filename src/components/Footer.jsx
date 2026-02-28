import { Leaf, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">BioScan Cochabamba</span>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma de monitoreo de biodiversidad con IA para proteger el Cerro San Pedro
              y sus corredores biológicos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm hover:text-primary transition-colors">Inicio</Link>
              <Link to="/catalogo" className="block text-sm hover:text-primary transition-colors">Catálogo de Especies</Link>
              <Link to="/mapa" className="block text-sm hover:text-primary transition-colors">Mapa Interactivo</Link>
              <Link to="/nosotros" className="block text-sm hover:text-primary transition-colors">Sobre Nosotros</Link>
            </div>
          </div>

          {/* ODS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Alineado con ODS</h4>
            <div className="space-y-2 text-sm">
              <p>🌿 ODS 15: Vida de Ecosistemas Terrestres</p>
              <p>🌍 ODS 13: Acción por el Clima</p>
              <p>🤝 ODS 17: Alianzas para los Objetivos</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm flex items-center gap-1.5">
            Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> en Cochabamba, Bolivia
          </p>
          <p className="text-sm">
            Tech4Future Hack 2026 — Hub Boliviano de IA × Microsoft Learn Student Ambassadors
          </p>
        </div>
      </div>
    </footer>
  )
}
