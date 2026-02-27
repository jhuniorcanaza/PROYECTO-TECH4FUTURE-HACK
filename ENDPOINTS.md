# 🌱 Plant.id API - Endpoints para Bruno

## Base URL
```
http://localhost:3000/api
```

---

## 📋 Health Check / General

### 1. Hello World
**Descripción:** Verifica que el servidor esté corriendo correctamente.

- **Método:** `GET`
- **URL:** `http://localhost:3000/api`
- **Headers:** Ninguno
- **Body:** Ninguno

**Respuesta esperada (200 OK):**
```
Hello World!
```

---

## 🔑 Plant.id - Verificación

### 2. Test API Key
**Descripción:** Verifica que la API key de Plant.id se está leyendo correctamente desde el archivo .env

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/plantid/test`
- **Headers:** Ninguno
- **Body:** Ninguno

**Respuesta esperada (200 OK):**
```json
{
  "status": "ok",
  "keyPreview": "hoeK****"
}
```

---

## 🌿 Plant.id - Identificación

### 3. Identificar Planta (con imagen completa en base64)
**Descripción:** Envía una imagen de una planta en formato base64 y recibe la identificación completa desde Plant.id

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/plantid/identify`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```

**Ejemplo de respuesta (200 OK):**
```json
{
  "is_plant": true,
  "is_plant_probability": 0.999,
  "suggestions": [
    {
      "id": "b6e99d4c2e8c4d9c",
      "plant_name": "Rosa damascena",
      "plant_details": {
        "common_names": [
          "Damask rose",
          "Rosa de Damasco"
        ],
        "taxonomy": {
          "kingdom": "Plantae",
          "phylum": "Tracheophyta",
          "class": "Magnoliopsida",
          "order": "Rosales",
          "family": "Rosaceae",
          "genus": "Rosa"
        }
      },
      "probability": 0.89,
      "similar_images": [
        {
          "url": "https://plant.id/media/imgs/...",
          "similarity": 0.92
        }
      ]
    }
  ]
}
```

**Posibles errores:**

- **400 Bad Request** (si la imagen no es válida):
```json
{
  "statusCode": 400,
  "message": [
    "La imagen es obligatoria"
  ],
  "error": "Bad Request"
}
```

- **502 Bad Gateway** (si Plant.id no responde):
```json
{
  "message": "Error al identificar la planta con Plant.id",
  "detail": "..."
}
```

---

## 📝 Cómo obtener una imagen en base64

### Opción 1: Usar un convertidor online
1. Ve a: https://www.base64-image.de/
2. Sube una foto de una planta
3. Copia el texto completo que empieza con `data:image/jpeg;base64,...`
4. Pégalo en el campo `"image"` del body JSON en Bruno

### Opción 2: Usar Node.js/JavaScript
```javascript
const fs = require('fs');
const imageBuffer = fs.readFileSync('planta.jpg');
const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
console.log(base64Image);
```

### Opción 3: Usar Python
```python
import base64

with open('planta.jpg', 'rb') as f:
    image_data = f.read()
    base64_image = f"data:image/jpeg;base64,{base64.b64encode(image_data).decode()}"
    print(base64_image)
```

---

## 🧪 Colección completa para Bruno

### Estructura de carpetas sugerida:
```
plantid-api/
├── 01-hello-world.bru
├── 02-test-api-key.bru
└── 03-identify-plant.bru
```

### Contenido de cada archivo .bru:

#### `01-hello-world.bru`
```
meta {
  name: Hello World
  type: http
  seq: 1
}

get {
  url: http://localhost:3000/api
  body: none
  auth: none
}
```

#### `02-test-api-key.bru`
```
meta {
  name: Test API Key
  type: http
  seq: 2
}

get {
  url: http://localhost:3000/api/plantid/test
  body: none
  auth: none
}
```

#### `03-identify-plant.bru`
```
meta {
  name: Identify Plant
  type: http
  seq: 3
}

post {
  url: http://localhost:3000/api/plantid/identify
  body: json
  auth: none
}

body:json {
  {
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  }
}
```

---

## 🚀 Pasos para probar en Bruno

1. **Asegúrate de que el servidor está corriendo:**
   ```powershell
   cd C:\Users\Public\PROGRAMACION\APIS\nest\backend-api
   npm run start:dev
   ```

2. **En Bruno:**
   - Crea una nueva colección llamada `plantid-api`
   - Agrega las 3 peticiones con los datos de arriba
   - Prueba primero `Hello World` para verificar que el servidor responde
   - Luego prueba `Test API Key` para verificar la configuración
   - Finalmente prueba `Identify Plant` con una imagen real en base64

3. **Solución de problemas:**
   - Si obtienes `404 Not Found`: verifica que la URL sea exactamente `http://localhost:3000/api/...`
   - Si obtienes `Connection refused`: el servidor no está corriendo
   - Si obtienes `400 Bad Request` en identify: verifica que el JSON esté bien formado y contenga el campo `"image"`
   - Si obtienes `502 Bad Gateway`: puede ser un problema con la API key o con Plant.id

---

## 📊 Resumen de Endpoints

| # | Título | Método | URL | Body |
|---|--------|--------|-----|------|
| 1 | Hello World | `GET` | `/api` | No |
| 2 | Test API Key | `GET` | `/api/plantid/test` | No |
| 3 | Identify Plant | `POST` | `/api/plantid/identify` | Sí (JSON) |

---

## ✅ Checklist de prueba

- [ ] Servidor corriendo (`npm run start:dev`)
- [ ] Endpoint `/api` responde "Hello World!"
- [ ] Endpoint `/api/plantid/test` devuelve status "ok"
- [ ] Endpoint `/api/plantid/identify` acepta imagen en base64
- [ ] La respuesta de identify contiene información de la planta

