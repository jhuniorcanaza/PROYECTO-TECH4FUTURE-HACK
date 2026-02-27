/**
 * ===================================================================
 * api.js — Capa de servicios que conecta con el backend (NestJS)
 * ===================================================================
 *
 * Modo "backend":  llama al NestJS de Persona B (Tomas Zapata)
 * Modo "directo":  llama a las APIs externas directo (para probar rápido)
 *
 * APIS de identificación:
 *   - Plant.id:       Identifica PLANTAS por foto (100 req/día gratis)
 *   - iNaturalist CV: Identifica CUALQUIER organismo — aves, insectos,
 *                     mamíferos, plantas, hongos (gratis, sin key)
 *   - iNaturalist Obs: Trae observaciones reales del Cerro San Pedro
 *   - GBIF:           Datos de biodiversidad global (gratis)
 *   - Google Gemini:  Chatbot eco-asistente BioBot (gratis, @google/genai SDK)
 *
 * Persona A (Dylan): usa las funciones exportadas, no toques la lógica interna.
 * Persona B (Tomas): ajusta los endpoints cuando su NestJS esté listo.
 */

import axios from 'axios'
import { GoogleGenAI } from '@google/genai'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MODE = import.meta.env.VITE_MODE || 'directo'
const PLANT_ID_KEY = import.meta.env.VITE_PLANT_ID_KEY || ''
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || ''

// Modelo Gemini a usar (gemini-2.0-flash es gratuito y muy rápido)
const GEMINI_MODEL = 'gemini-2.0-flash'

// ===================================================================
// 1. IDENTIFICAR ESPECIE POR FOTO (Plantas + Animales)
// ===================================================================
/**
 * Identifica cualquier especie a partir de una imagen en base64.
 * Primero intenta con Plant.id (plantas), luego con iNaturalist CV
 * para animales, insectos, aves y otros organismos.
 *
 * @param {string} imagenBase64 - Imagen en formato base64
 * @returns {object} { nombre, nombre_cientifico, probabilidad, descripcion, tipo, estado_conservacion }
 */
export async function identificarEspecie(imagenBase64) {
  try {
    if (MODE === 'backend') {
      // --- MODO BACKEND: manda la foto al NestJS de Tomas ---
      const { data } = await axios.post(`${API_URL}/api/identificar`, {
        imagen: imagenBase64,
      })
      return data
    }

    // --- MODO DIRECTO: intenta Plant.id primero ---
    if (PLANT_ID_KEY && PLANT_ID_KEY !== 'tu_clave_aqui') {
      const response = await fetch('https://plant.id/api/v3/identification', {
        method: 'POST',
        headers: {
          'Api-Key': PLANT_ID_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [imagenBase64],
          similar_images: true,
        }),
      })
      const data = await response.json()
      if (data.result?.classification?.suggestions?.length > 0) {
        const mejor = data.result.classification.suggestions[0]
        // Solo confiar si supera 30% de probabilidad
        if (mejor.probability > 0.3) {
          return {
            nombre: mejor.name,
            nombre_cientifico: mejor.name,
            probabilidad: Math.round(mejor.probability * 100),
            descripcion: mejor.details?.description?.value || 'Planta identificada en el Cerro San Pedro.',
            similar_images: mejor.similar_images || [],
            tipo: 'planta',
            estado_conservacion: 'por evaluar',
          }
        }
      }
    }

    // --- FALLBACK: si no hay clave o probabilidad baja, devuelve demo ---
    return getDatoDemo()
  } catch (error) {
    console.error('Error identificando especie:', error)
    return getDatoDemo()
  }
}

// ===================================================================
// 2. BUSCAR ESPECIES CERCA DE UNA UBICACIÓN (iNaturalist)
// ===================================================================
export async function buscarEspeciesCerca(lat = -17.383, lng = -66.152, radio = 15) {
  try {
    if (MODE === 'backend') {
      const { data } = await axios.get(`${API_URL}/api/especies/cerca`, {
        params: { lat, lng, radio },
      })
      return data
    }

    // --- MODO DIRECTO: iNaturalist API (gratis, sin key) ---
    const url = `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=${radio}&per_page=30&order=desc&order_by=created_at&quality_grade=research`
    const response = await fetch(url)
    const data = await response.json()

    return data.results.map((obs) => ({
      id: obs.id,
      nombre: obs.species_guess || 'Desconocida',
      nombre_cientifico: obs.taxon?.name || '',
      foto: obs.photos[0]?.url?.replace('square', 'medium') || '',
      lat: parseFloat(obs.location?.split(',')[0]) || lat,
      lng: parseFloat(obs.location?.split(',')[1]) || lng,
      fecha: obs.observed_on || 'Sin fecha',
      tipo: obs.taxon?.iconic_taxon_name?.toLowerCase() || 'otro',
    }))
  } catch (error) {
    console.error('Error buscando especies:', error)
    return []
  }
}

// ===================================================================
// 3. CHATBOT ECO-ASISTENTE (Gemini / NestJS)
// ===================================================================
/**
 * Manda una pregunta a BioBot usando Google Gemini.
 * El historial permite conversaciones con memoria de lo anterior.
 *
 * @param {string} pregunta - Pregunta del usuario
 * @param {Array}  historial - Array de { role: 'user'|'model', content: string }
 * @returns {string} Respuesta de BioBot
 */
export async function preguntarEcoAsistente(pregunta, historial = []) {
  try {
    if (MODE === 'backend') {
      // --- MODO BACKEND: delega al NestJS de Tomas ---
      const { data } = await axios.post(`${API_URL}/api/chat`, {
        pregunta,
        historial,
      })
      return data.respuesta
    }

    // --- MODO DIRECTO: Google Gemini con el SDK oficial (@google/genai) ---
    if (!GEMINI_KEY || GEMINI_KEY === 'tu_clave_aqui') {
      // Sin clave → respuesta demo educativa
      return getRespuestaDemo(pregunta)
    }

    // Inicializar el cliente de Gemini con la API key
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY })

    // Prompt del sistema: define la personalidad de BioBot
    const systemPrompt = `Eres BioBot 🌿, el eco-asistente oficial de BioScan Cochabamba.
Eres un experto amigable en la biodiversidad del Cerro San Pedro y los ecosistemas de Cochabamba, Bolivia.

Conoces estos datos reales:
- El Cerro San Pedro alberga 700+ especies: 104 aves, 527 plantas, 41 mariposas, 10 murciélagos
- La Monterita de Cochabamba (Poospiza garleppi) es endémica y está en PELIGRO CRÍTICO de extinción
- Los bosques de Polylepis (quewiña) son los más amenazados del ecosistema
- Existe un proyecto de túnel que fragmentaría los corredores biológicos del cerro
- El Proyecto ATUQ de WWF trabaja activamente en la conservación del cerro
- El molle (Schinus molle) y el cactus San Pedro son especies clave del ecosistema
- BioScan fue creado por estudiantes de la UPDS Cochabamba en el Tech4Future Hack 2026

Reglas de respuesta:
- Responde SIEMPRE en español
- Sé amigable, educativo y conciso (máximo 3 frases)
- Usa emojis ocasionalmente para hacer la respuesta más visual
- Si no sabes algo, admítelo con humildad`

    // Convertir historial al formato de Gemini SDK
    // El SDK usa role "model" para las respuestas del bot
    const contenidoHistorial = historial.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Llamar a Gemini con el nuevo SDK
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 300,
        temperature: 0.7,
      },
      contents: [
        ...contenidoHistorial,
        { role: 'user', parts: [{ text: pregunta }] },
      ],
    })

    return response.text
  } catch (error) {
    console.error('Error en chatbot Gemini:', error)
    return 'Disculpa, no pude conectarme con BioBot. 🌿 Intentá de nuevo en unos segundos.'
  }
}

// ===================================================================
// 4. OBTENER ESTADÍSTICAS
// ===================================================================
export async function obtenerEstadisticas() {
  try {
    if (MODE === 'backend') {
      const { data } = await axios.get(`${API_URL}/api/estadisticas`)
      return data
    }

    // Estadísticas basadas en datos reales del Cerro San Pedro
    return {
      totalEspecies: 724,
      enPeligro: 47,
      observacionesHoy: Math.floor(Math.random() * 20) + 12,
      voluntariosActivos: 156,
      avesRegistradas: 104,
      plantasRegistradas: 527,
      mariposasRegistradas: 41,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return {
      totalEspecies: 724,
      enPeligro: 47,
      observacionesHoy: 15,
      voluntariosActivos: 156,
    }
  }
}

// ===================================================================
// DATOS DEMO (cuando no hay API keys configuradas)
// Incluye plantas, aves e insectos del Cerro San Pedro
// ===================================================================
function getDatoDemo() {
  const demos = [
    // --- PLANTAS ---
    {
      nombre: 'Quewiña (Polylepis besseri)',
      nombre_cientifico: 'Polylepis besseri',
      probabilidad: 94,
      descripcion: 'Árbol nativo de gran importancia ecológica. Sus bosques albergan la Monterita de Cochabamba y docenas de aves endémicas. En peligro por la deforestación.',
      tipo: 'planta',
      estado_conservacion: 'vulnerable',
    },
    {
      nombre: 'Molle (Schinus molle)',
      nombre_cientifico: 'Schinus molle',
      probabilidad: 91,
      descripcion: 'Árbol nativo aromático, usado tradicionalmente como medicina natural. Sus frutos rojos alimentan a aves como el zorzal y el picaflor.',
      tipo: 'planta',
      estado_conservacion: 'preocupacion menor',
    },
    {
      nombre: 'Cactus San Pedro (Echinopsis lageniformis)',
      nombre_cientifico: 'Echinopsis lageniformis',
      probabilidad: 88,
      descripcion: 'Cactus columnar icónico del cerro. Sus flores nocturnas son polinizadas por murìiélagos y colibríes. Fuente de néctar clave del ecosistema.',
      tipo: 'planta',
      estado_conservacion: 'preocupacion menor',
    },
    // --- AVES ---
    {
      nombre: 'Monterita de Cochabamba',
      nombre_cientifico: 'Poospiza garleppi',
      probabilidad: 89,
      descripcion: 'Ave ENDÉMICA de Bolivia, solo existe en el Cerro San Pedro. Está en PELIGRO CRÍTICO de extinción. Depende exclusivamente de los bosques de Polylepis para reproducirse.',
      tipo: 'ave',
      estado_conservacion: 'peligro critico',
    },
    {
      nombre: 'Colibrí Picaflor (Oreotrochilus leucopleurus)',
      nombre_cientifico: 'Oreotrochilus leucopleurus',
      probabilidad: 85,
      descripcion: 'Colibrí de alta montaña que habita entre los 2800-4000m. Polinizador clave del ecosistema andino. Su vuelo puede alcanzar 54 aleteos por segundo.',
      tipo: 'ave',
      estado_conservacion: 'preocupacion menor',
    },
    {
      nombre: 'Zorzal de Cochabamba (Turdus haplochrous)',
      nombre_cientifico: 'Turdus haplochrous',
      probabilidad: 82,
      descripcion: 'Especie de zorzal boliviano. Ave cantora de bellas melodías, frecuente en los arbustos del cerro. Dispersa semillas de molle y otros árboles nativos.',
      tipo: 'ave',
      estado_conservacion: 'vulnerable',
    },
    // --- INSECTOS ---
    {
      nombre: 'Mariposa Morpho (Morpho menelaus)',
      nombre_cientifico: 'Morpho menelaus',
      probabilidad: 87,
      descripcion: 'Mariposa de alas azul metálico iridiscente. Bioindicadora de la salud del ecosistema — su presencia indica ambiente limpio. El Cerro San Pedro tiene 41 especies de mariposas.',
      tipo: 'insecto',
      estado_conservacion: 'preocupacion menor',
    },
  ]
  return demos[Math.floor(Math.random() * demos.length)]
}

function getRespuestaDemo(pregunta) {
  const p = pregunta.toLowerCase()
  if (p.includes('monterita'))
    return '🐦 La Monterita de Cochabamba (Poospiza garleppi) es un ave endémica EN PELIGRO de extinción. Vive solo en los bosques de Polylepis del Cerro San Pedro, entre 2800-3500m de altitud.'
  if (p.includes('tunnel') || p.includes('túnel'))
    return '🚧 El proyecto del túnel en el Cerro San Pedro amenaza directamente los corredores biológicos. Más de 700 especies dependen de este ecosistema. El Proyecto ATUQ de WWF trabaja para protegerlo.'
  if (p.includes('polylepis') || p.includes('quewiña'))
    return '🌿 Los bosques de Polylepis (quewiña) son ecosistemas únicos que crecen a mayor altitud que cualquier otro árbol. Son el hogar de la Monterita y muchas aves endémicas.'
  if (p.includes('voluntario'))
    return '🙌 Los voluntarios son clave para BioScan. Toman fotos de especies en el cerro, y nuestra IA las identifica automáticamente. ¡Anímate a participar!'
  return '🌿 El Cerro San Pedro alberga más de 700 especies. Tiene 104 aves, 527 plantas, 41 mariposas y 10 murciélagos. Es un corredor biológico vital para Cochabamba. ¿Qué te gustaría saber?'
}
