# 🌿 BioScan Cochabamba — Frontend

> Plataforma web para el monitoreo, identificación y registro de biodiversidad en el **Cerro San Pedro**, Cochabamba, Bolivia.  
> Desarrollado en el marco del **Tech4Future Hack** — Hub Boliviano de IA + Microsoft Learn Student Ambassadors.

---

## 📋 Descripción

BioScan Cochabamba es una aplicación web que permite a ciudadanos, investigadores y conservacionistas:

- 📸 **Identificar especies** mediante fotos con IA (Plant.id API)
- 🗺️ **Visualizar en mapa** las observaciones registradas (Leaflet + iNaturalist)
- 🤖 **Consultar a BioBot**, un asistente ecológico con IA (Groq / Llama 3)
- 📚 **Explorar el catálogo** de 20+ especies del Cerro San Pedro
- 📊 **Ver estadísticas** de biodiversidad en tiempo real

---

## 🚀 Tecnologías

| Tecnología | Uso |
|---|---|
| React 19 + Vite 6 | Framework frontend + bundler |
| Tailwind CSS v4 | Estilos utilitarios |
| React Router v7 | Navegación SPA |
| React Leaflet | Mapas interactivos |
| Framer Motion | Animaciones |
| React Dropzone | Carga de imágenes |
| Axios | Peticiones HTTP |
| Lucide React | Iconografía |

---

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx       # Barra de navegación responsiva
│   ├── Hero.jsx         # Sección principal animada
│   ├── PhotoUpload.jsx  # Carga y análisis de fotos
│   ├── Dashboard.jsx    # Panel de estadísticas
│   ├── MapView.jsx      # Mapa interactivo de especies
│   ├── SpeciesCard.jsx  # Tarjeta de especie individual
│   ├── Chatbot.jsx      # Asistente BioBot flotante
│   └── Footer.jsx       # Pie de página
├── pages/               # Vistas/rutas de la app
│   ├── Home.jsx         # Página principal
│   ├── Catalog.jsx      # Catálogo completo de especies
│   ├── MapPage.jsx      # Vista de mapa completo
│   └── About.jsx        # Sobre el proyecto
├── services/
│   └── api.js           # Capa de servicios (Plant.id, Groq, iNaturalist)
├── data/
│   └── especies.json    # Dataset de 20 especies del Cerro San Pedro
├── App.jsx              # Componente raíz + router
├── main.jsx             # Punto de entrada React
└── index.css            # Estilos globales + tema Tailwind
```

---

## ⚙️ Instalación y uso

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/jhuniorcanaza/PROYECTO-TECH4FUTURE-HACK.git
cd PROYECTO-TECH4FUTURE-HACK
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus claves:

```env
# URL del backend NestJS (si usas modo "backend")
VITE_API_URL=http://localhost:3000

# API Key de Plant.id — https://plant.id (100 requests/día gratis)
VITE_PLANT_ID_KEY=tu_clave_aqui

# API Key de Groq — https://console.groq.com (gratis)
VITE_GROQ_KEY=tu_clave_aqui

# Modo de conexión: "directo" (llama APIs desde el frontend)
#                   "backend"  (llama al NestJS en VITE_API_URL)
VITE_MODE=directo
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
# → http://localhost:5173
```

### 4. Build para producción

```bash
npm run build
npm run preview
```

---

## 🔌 APIs integradas

| API | Propósito | Precio |
|---|---|---|
| [Plant.id](https://plant.id) | Identificación de plantas por foto | 100 req/día gratis |
| [Groq / Llama 3](https://console.groq.com) | Chatbot BioBot eco-asistente | Gratis |
| [iNaturalist API](https://api.inaturalist.org/v1) | Observaciones reales de biodiversidad | Gratis, sin clave |
| [GBIF API](https://www.gbif.org/developer/summary) | Datos globales de biodiversidad | Gratis, sin clave |
| [OpenStreetMap + Leaflet](https://leafletjs.com) | Mapas interactivos | Gratis, open source |

---

## 🌳 Ramas del repositorio

| Rama | Contenido |
|---|---|
| `main` | Código estable — listo para revisión y demo |
| `develop` | Rama de desarrollo activa |

---

## 👥 Equipo BioScan

| Persona | Rol |
|---|---|
| **Persona A** | Frontend — React + Tailwind CSS |
| **Persona B** | Backend — NestJS + APIs |
| **Persona C** | Datos + Pitch + Presentación |

---

## 🏆 Hackathon

- **Evento:** Tech4Future Hack
- **Organizadores:** Hub Boliviano de IA + Microsoft Learn Student Ambassadors
- **Sede:** Cochabamba, Bolivia
- **Pitch:** 28 de febrero de 2026 — 14:30

---

## 📜 Licencia

MIT — libre para uso educativo y de investigación.
