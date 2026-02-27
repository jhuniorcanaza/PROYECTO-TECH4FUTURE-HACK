import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X, Map, BookOpen, Users } from 'lucide-react'

const links = [
  { to: '/', label: 'Inicio', icon: Leaf },
  { to: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/nosotros', label: 'Nosotros', icon: Users },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">BioScan</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
