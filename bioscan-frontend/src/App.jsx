import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import MapPage from './pages/MapPage'
import About from './pages/About'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/nosotros" element={<About />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  )
}
