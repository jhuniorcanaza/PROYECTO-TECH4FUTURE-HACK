import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Loader2, CheckCircle2, Leaf, BarChart3 } from 'lucide-react'
import { identificarEspecie } from '../services/api'

export default function PhotoUpload() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setResultado(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
  })

  const handleIdentificar = async () => {
    if (!preview) return
    setLoading(true)
    try {
      const base64 = preview.split(',')[1]
      const result = await identificarEspecie(base64)
      setResultado(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPreview(null)
    setResultado(null)
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'en peligro': return 'bg-red-100 text-red-700 border-red-200'
      case 'vulnerable': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'preocupacion menor': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <section id="upload" className="py-16 bg-gradient-to-b from-white to-green-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            📸 Identifica una Especie
          </h2>
          <p className="text-gray-500">
            Sube una foto de una planta o animal del Cerro San Pedro y nuestra IA la identificará
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload zone */}
          <div>
            {!preview ? (
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all h-80 flex flex-col items-center justify-center
                  ${isDragActive
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : 'border-gray-300 hover:border-primary/50 hover:bg-green-50/50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una foto aquí'}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  o haz clic para seleccionar
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Camera className="w-4 h-4" />
                  JPG, PNG, WebP — Max 10MB
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden shadow-lg h-80"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors text-sm"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Identify button */}
            {preview && !resultado && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleIdentificar}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Identificando con IA...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    Identificar Especie
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Result zone */}
          <AnimatePresence mode="wait">
            {resultado ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg border border-green-100 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-primary">Especie Identificada</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {resultado.nombre}
                </h3>
                <p className="text-sm italic text-gray-500 mb-4">
                  {resultado.nombre_cientifico}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <BarChart3 className="w-4 h-4" />
                    {resultado.probabilidad}% confianza
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(resultado.estado_conservacion)}`}>
                    {resultado.estado_conservacion}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {resultado.descripcion}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-medium rounded-xl transition-all text-sm"
                  >
                    Otra foto
                  </button>
                  <button
                    onClick={() => navigate('/mapa')}
                    className="flex-1 py-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-all text-sm"
                  >
                    Ver en mapa
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8"
              >
                <Leaf className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400 text-center">
                  {preview
                    ? 'Haz clic en "Identificar Especie" para ver el resultado'
                    : 'Sube una foto para empezar la identificación'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
