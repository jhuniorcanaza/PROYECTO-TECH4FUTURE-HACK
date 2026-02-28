import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

// Lazy-load pages para code-splitting (reduce bundle inicial)
const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const MapPage = lazy(() => import('./pages/MapPage'))
const About = lazy(() => import('./pages/About'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Cargando...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/nosotros" element={<About />} />
          </Routes>
        </Suspense>
      </main>
      <Chatbot />
      <Footer />
    </div>
  )
}
