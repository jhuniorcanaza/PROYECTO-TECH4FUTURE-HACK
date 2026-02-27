# 🌿 BioScan Cochabamba

**Plataforma de monitoreo de biodiversidad con IA para el Cerro San Pedro, Cochabamba, Bolivia.**

> Hackathon Tech4Future Hack 2026 — Hub Boliviano de IA × Microsoft Learn Student Ambassadors

## 🎯 Problema

El Cerro San Pedro es un corredor biológico urbano con **700+ especies** registradas. Está amenazado por el proyecto del túnel, asentamientos ilegales y quemas estacionales.

## 💡 Solución

- 📸 **Identificación con IA** — Sube una foto → la IA identifica la especie
- 🗺️ **Mapa interactivo** — Ubicación de especies en el cerro
- 🤖 **Eco-Asistente** — Chatbot sobre biodiversidad
- 📊 **Dashboard** — Estadísticas en tiempo real

## 🌍 ODS 15: Vida de Ecosistemas Terrestres

## 🛠️ Stack

| Componente | Tecnología |
|---|---|
| Frontend | React + Tailwind CSS + Vite |
| Backend | NestJS (TypeScript) |
| IA | Plant.id + Groq (Llama 3) |
| Datos | iNaturalist API + GBIF |
| Mapas | Leaflet.js + OpenStreetMap |

## 🚀 Cómo correr

### Frontend
```bash
cd bioscan-frontend
npm install
cp .env.example .env   # Editar con tus API keys
npm run dev             # → http://localhost:5173
```

### Backend
```bash
cd bioscan-backend
npm install
cp .env.example .env   # Editar con tus API keys
npm run start:dev       # → http://localhost:3000/api
```

### API Keys necesarias
1. **Plant.id**: [web.plant.id](https://web.plant.id) → obtener API key gratis
2. **Groq**: [console.groq.com](https://console.groq.com) → obtener API key gratis

## 📁 Estructura

```
├── bioscan-frontend/     ← React + Tailwind (Persona A)
│   ├── src/components/   ← Componentes UI
│   ├── src/pages/        ← Páginas
│   ├── src/services/     ← Conexión APIs
│   └── src/data/         ← Datos especies
├── bioscan-backend/      ← NestJS (Persona B)
│   ├── src/identificacion/ ← Plant.id API
│   ├── src/chat/           ← Groq chatbot
│   └── src/especies/       ← iNaturalist
└── README.md
```

## 👥 Equipo

| Rol | Carpeta |
|---|---|
| Frontend (React) | `bioscan-frontend/` |
| Backend + IA (NestJS) | `bioscan-backend/` |
| Datos + Pitch | `bioscan-frontend/src/data/` |

---

*Hecho con 💚 en Cochabamba — Tech4Future Hack 2026*
