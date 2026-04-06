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

---

## 🧩 Actividad 2: Identificación de estructura y arquitectura del sistema

### 1) Tipo de arquitectura del proyecto base

El proyecto sigue una arquitectura de frontend SPA (Single Page Application) basada en componentes, construida con React + Vite.

Se observa una separación por capas ligera:

- Capa de presentación: componentes y páginas React.
- Capa de navegación: enrutamiento de vistas con React Router.
- Capa de servicios: módulo centralizado para consumo de APIs externas o backend.
- Capa de datos estáticos: archivos JSON para contenido local.

Este enfoque corresponde a una arquitectura modular por responsabilidades, adecuada para un proyecto de hackathon y evolución incremental.

### 2) Módulos o componentes identificados

Módulos principales detectados:

- components/: UI reutilizable (Navbar, Hero, Dashboard, MapView, PhotoUpload, Chatbot, Footer, SpeciesCard).
- pages/: vistas de alto nivel por ruta (Home, Catalog, MapPage, About).
- services/: integración con APIs y lógica de comunicación externa (api.js).
- data/: catálogo local y datasets (especies.json).
- App.jsx y main.jsx: composición raíz, inicialización y montaje de la aplicación.

Responsabilidad funcional principal:

- Identificación de especies por imagen.
- Visualización de observaciones en mapa.
- Dashboard de métricas de biodiversidad.
- Chatbot ecológico asistido por IA.

### 3) Mejoras arquitectónicas propuestas para mayor mantenibilidad

Mejoras recomendadas:

- Separar la capa de servicios por dominio: crear archivos independientes para identificación, mapa, chatbot y estadísticas, evitando un único archivo grande.
- Incorporar tipado estático (TypeScript o validación con esquemas) para contratos de datos de APIs y reducción de errores en tiempo de ejecución.
- Estandarizar manejo de errores y estados de carga con utilidades compartidas o hooks reutilizables.
- Extraer constantes de configuración (endpoints, límites, textos) a módulos dedicados para facilitar cambios y pruebas.
- Agregar pruebas unitarias básicas en servicios y componentes críticos para asegurar estabilidad en refactorizaciones.
- Definir una estructura de carpetas orientada a features (por ejemplo: features/chatbot, features/mapa, features/upload) para escalar el proyecto con menos acoplamiento.

Conclusión técnica:

La base actual es funcional y bien orientada para prototipado rápido. Con la modularización por dominio, tipado y pruebas, el sistema puede evolucionar a un nivel de mantenibilidad y escalabilidad más alto sin afectar la experiencia de usuario.

---

## ♻️ Actividad 3: Refactorización de código

Se realizaron tres mejoras concretas en la rama de trabajo, enfocadas en mantenibilidad, legibilidad y robustez.

### Mejora 1: Manejo explícito de carga y error en Dashboard

Archivo intervenido: src/components/Dashboard.jsx

Cambios aplicados:

- Se añadió estado de error para fallos al obtener estadísticas.
- Se incorporó estado de carga visible para evitar render vacío.
- Se protegió la actualización de estado cuando el componente se desmonta.

Beneficio técnico:

- Mejor experiencia de usuario en escenarios de latencia o error.
- Menor riesgo de advertencias por actualización de estado en componentes desmontados.

Commit:

- 3554be6 — refactor(dashboard): manejar carga y error de estadisticas

### Mejora 2: Validación de imagen y control de errores en PhotoUpload

Archivo intervenido: src/components/PhotoUpload.jsx

Cambios aplicados:

- Se validó tipo de archivo para aceptar solo imágenes.
- Se validó tamaño máximo (10 MB).
- Se verificó la presencia de base64 antes de invocar la API.
- Se mostraron mensajes de error claros al usuario.

Beneficio técnico:

- Evita solicitudes inválidas al servicio de identificación.
- Mejora legibilidad del flujo de carga y manejo de fallos.

Commit:

- c329685 — refactor(upload): validar archivo y manejo de errores de imagen

### Mejora 3: Eliminación de código duplicado en estadísticas

Archivo intervenido: src/services/api.js

Cambios aplicados:

- Se creó la constante STATS_BASE para valores compartidos.
- Se reutilizó STATS_BASE tanto en respuesta normal como en fallback de error.

Beneficio técnico:

- Reduce duplicación y facilita mantenimiento.
- Centraliza valores base para futuras modificaciones.

Commit:

- 0be4d06 — refactor(api): centralizar constantes base de estadisticas

### Resultado de la refactorización

- Se cumplieron las 3 mejoras mínimas requeridas.
- Se aplicaron cambios en componentes y servicio, con impacto directo en calidad de código.
- El proyecto compila correctamente tras los cambios (build exitoso).
