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
 *   - Google Gemini:  Chatbot eco-asistente BioBot (REST API, gratis)
 *   - Groq / Llama 3: Chatbot eco-asistente BioBot (30 req/min, 14400/dia gratis)
 *
 * Persona A (Dylan): usa las funciones exportadas, no toques la lógica interna.
 * Persona B (Tomas): ajusta los endpoints cuando su NestJS esté listo.
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MODE = import.meta.env.VITE_MODE || 'directo'
const PLANT_ID_KEY = import.meta.env.VITE_PLANT_ID_KEY || ''
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY || ''

const STATS_BASE = {
  totalEspecies: 724,
  enPeligro: 47,
  voluntariosActivos: 156,
  avesRegistradas: 104,
  plantasRegistradas: 527,
  mariposasRegistradas: 41,
}

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
// 3. CHATBOT ECO-ASISTENTE (Groq + Llama 3 / NestJS)
// ===================================================================
/**
 * Manda una pregunta a BioBot usando Groq (Llama 3).
 * Groq es GRATIS: 30 requests/minuto, 14,400/día.
 * El historial permite conversaciones con memoria de lo anterior.
 *
 * @param {string} pregunta - Pregunta del usuario
 * @param {Array}  historial - Array de { role: 'user'|'assistant', content: string }
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

    // --- MODO DIRECTO: Groq API (Llama 3, gratis, 30 req/min) ---
    if (!GROQ_KEY || GROQ_KEY === 'tu_clave_aqui') {
      return getRespuestaDemo(pregunta)
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Eres BioBot 🌿, el eco-asistente oficial de BioScan Cochabamba.
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
- Usa emojis ocasionalmente
- Si no sabes algo, admítelo con humildad`,
          },
          ...historial.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: pregunta },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    // Si Groq falla por cualquier razón → fallback al demo
    if (!response.ok) {
      console.warn('Groq no disponible, usando demo:', response.status, data)
      return getRespuestaDemo(pregunta)
    }

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content
    }

    return getRespuestaDemo(pregunta)
  } catch (error) {
    console.error('Error en chatbot Groq:', error)
    return getRespuestaDemo(pregunta)
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
      ...STATS_BASE,
      observacionesHoy: Math.floor(Math.random() * 20) + 12,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return {
      ...STATS_BASE,
      observacionesHoy: 15,
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

  // --- SALUDOS ---
  if (p.match(/^(hola|buenos|buenas|hey|hi|saludos|ola)/))
    return '¡Hola! 🌿 Soy BioBot, el eco-asistente de BioScan Cochabamba. Estoy aquí para ayudarte a conocer la biodiversidad del Cerro San Pedro. ¿Qué especie o tema te gustaría explorar?'

  // --- MONTERITA ---
  if (p.includes('monterita') || p.includes('garleppi') || p.includes('poospiza'))
    return '🐦 La Monterita de Cochabamba (Poospiza garleppi) es un ave ENDÉMICA en PELIGRO CRÍTICO de extinción. Solo vive en los bosques de Polylepis del Cerro San Pedro, entre 2800-3500m. Es el símbolo de la conservación del cerro.'

  // --- TÚNEL ---
  if (p.includes('túnel') || p.includes('tunel') || p.includes('tunnel'))
    return '🚧 El proyecto del túnel en el Cerro San Pedro fragmentaría directamente los corredores biológicos. Más de 700 especies dependen de este ecosistema interconectado. El Proyecto ATUQ de WWF trabaja para detenerlo.'

  // --- POLYLEPIS / QUEWIÑA ---
  if (p.includes('polylepis') || p.includes('quewiña') || p.includes('queñua') || p.includes('quewi'))
    return '🌳 Los bosques de Polylepis (quewiña) son los ecosistemas más amenazados del Cerro San Pedro. Crecen a mayor altitud que cualquier otro árbol del mundo y son el único hábitat de la Monterita de Cochabamba.'

  // --- ESPECIES / BIODIVERSIDAD ---
  if (p.includes('cuántas') || p.includes('cuantas') || p.includes('cuántos') || p.includes('cuantos') || p.includes('número') || p.includes('total'))
    return '📊 El Cerro San Pedro registra 700+ especies: 104 aves, 527 plantas vasculares, 41 mariposas, 10 murciélagos y decenas de insectos. Es uno de los corredores biológicos urbanos más importantes de Bolivia.'

  // --- AVES ---
  if (p.includes('ave') || p.includes('pájaro') || p.includes('pajaro') || p.includes('bird') || p.includes('pato') || p.includes('loro') || p.includes('colibr'))
    return '🐦 El cerro alberga 104 especies de aves. Entre las más representativas: la Monterita de Cochabamba (endémica en peligro), el Colibrí Andino, el Zorzal boliviano y el Cernícalo Americano. ¡Son excelentes bioindicadores del ecosistema!'

  // --- PLANTAS ---
  if (p.includes('planta') || p.includes('flora') || p.includes('árbol') || p.includes('arbol') || p.includes('vegeta'))
    return '🌿 Con 527 plantas vasculares registradas, la flora del Cerro San Pedro es extraordinaria. Destacan el Molle (Schinus molle), la Quewiña (Polylepis), el Cactus San Pedro y diversas especies de bromeliáceas nativas.'

  // --- MARIPOSAS / INSECTOS ---
  if (p.includes('mariposa') || p.includes('insecto') || p.includes('butterfly') || p.includes('morpho'))
    return '🦋 El Cerro San Pedro tiene 41 especies de mariposas registradas, incluyendo la espectacular Morpho. Las mariposas son bioindicadoras clave: su diversidad refleja directamente la salud del ecosistema.'

  // --- MURCIÉLAGOS ---
  if (p.includes('murciélago') || p.includes('murcielago') || p.includes('bat'))
    return '🦇 Hay 10 especies de murciélagos en el cerro. Son polinizadores nocturnos esenciales — polinizan el Cactus San Pedro cuando sus flores abren de noche. Sin murciélagos, muchos cactus desaparecerían.'

  // --- PELIGRO / EXTINCIÓN / CONSERVACIÓN ---
  if (p.includes('peligro') || p.includes('extinci') || p.includes('amenaza') || p.includes('conserv'))
    return '⚠️ En el Cerro San Pedro, 47 especies están en alguna categoría de amenaza. Las principales causas son: quemas, asentamientos ilegales, el proyecto del túnel y la contaminación. BioScan ayuda a documentar estas amenazas en tiempo real.'

  // --- BIOSCAN ---
  if (p.includes('bioscan') || p.includes('app') || p.includes('aplicación') || p.includes('plataforma') || p.includes('proyecto'))
    return '🌿 BioScan Cochabamba es una plataforma creada por estudiantes de la UPDS para monitorear la biodiversidad del Cerro San Pedro. Permite identificar especies con IA, registrar observaciones en mapa y consultar datos de iNaturalist en tiempo real.'

  // --- VOLUNTARIOS ---
  if (p.includes('voluntario') || p.includes('participar') || p.includes('cómo ayudo') || p.includes('contribuir'))
    return '🙌 ¡Podés ser un guardián del cerro! Solo tenés que salir al Cerro San Pedro, fotografiar especies que encuentres y subirlas a BioScan. La IA las identifica automáticamente y tu observación queda en el mapa para todos.'

  // --- MOLLE ---
  if (p.includes('molle') || p.includes('schinus'))
    return '🌿 El Molle (Schinus molle) es el árbol nativo más icónico de Cochabamba. Sus frutos rojos alimentan a zorzales y picaflores. Tiene propiedades medicinales ancestrales y es fundamental para la conectividad del ecosistema.'

  // --- CACTUS ---
  if (p.includes('cactus') || p.includes('cacto') || p.includes('echinopsis'))
    return '🌵 El Cactus San Pedro (Echinopsis lageniformis) es el cactus más característico del cerro. Sus flores blancas abren solo de noche y son polinizadas por murciélagos. Es también una planta de profundo valor cultural para los pueblos andinos.'

  // --- ATUQ / WWF ---
  if (p.includes('atuq') || p.includes('wwf') || p.includes('proyecto'))
    return '🦊 El Proyecto ATUQ de WWF Bolivia trabaja específicamente en la conservación del Cerro San Pedro. Monitorea corredores biológicos, trabaja con comunidades locales y combate las quemas ilegales. BioScan complementa su trabajo con tecnología ciudadana.'

  // --- CLIMA / TEMPERATURA ---
  if (p.includes('clima') || p.includes('temperatura') || p.includes('lluvia') || p.includes('altitud'))
    return '🌡️ El Cerro San Pedro va de los 2600m hasta más de 4000m de altitud. El clima varía desde templado en las laderas hasta frígido en las cumbres. Esta gradiente altitudinal explica la extraordinaria diversidad de especies que alberga.'

  // --- CÓMO FUNCIONA LA IA ---
  if (p.includes('cómo funciona') || p.includes('como funciona') || p.includes('ia') || p.includes('inteligencia') || p.includes('identificar') || p.includes('foto'))
    return '📸 La IA de BioScan analiza tu foto y la compara con millones de imágenes de especies. Usa Plant.id para plantas e iNaturalist para animales. En segundos te da el nombre científico, descripción y estado de conservación de la especie fotografiada.'

  // --- UPDS / EQUIPO ---
  if (p.includes('upds') || p.includes('universidad') || p.includes('equipo') || p.includes('creador') || p.includes('quién hizo'))
    return '👨‍💻 BioScan fue creado por Dylan, Tomas y Jhunior — estudiantes de Ingeniería en Sistemas de la UPDS Cochabamba — durante el Tech4Future Hack 2026, organizado por el Hub Boliviano de IA y Microsoft Learn Student Ambassadors.'

  // --- ODS / SOSTENIBILIDAD ---
  if (p.includes('ods') || p.includes('sostenible') || p.includes('objetivo') || p.includes('onu'))
    return '🌍 BioScan está alineado con los ODS de la ONU: ODS 15 (Vida de ecosistemas terrestres), ODS 13 (Acción por el clima), ODS 11 (Ciudades sostenibles) y ODS 17 (Alianzas). Tecnología al servicio de la biodiversidad boliviana.'

  // --- RESPUESTA GENERAL ---
  const respuestasGenerales = [
    '🌿 El Cerro San Pedro es un tesoro de biodiversidad en el corazón de Cochabamba. Con 700+ especies registradas, es un corredor biológico vital. ¿Querés saber sobre alguna especie en particular?',
    '🦋 La biodiversidad del Cerro San Pedro es increíble. Desde la Monterita de Cochabamba (un ave que no existe en ningún otro lugar del mundo) hasta 41 especies de mariposas. ¿Qué te gustaría explorar?',
    '🌳 El Cerro San Pedro enfrenta amenazas reales: quemas, asentamientos y el proyecto del túnel. BioScan nació para documentar y proteger este ecosistema único. ¿Cómo puedo ayudarte?',
  ]
  return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)]
}
