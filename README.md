# MathMentor AI 🧮

Tutor inteligente de matemáticas que analiza el procedimiento del estudiante paso a paso.  
Usa **Groq** (gratis) como motor de IA para dar retroalimentación en tiempo real con streaming.

## Stack

| Capa | Tecnología | Deploy |
|------|-----------|--------|
| Frontend | React + Vite | Vercel (gratis) |
| Backend | Node.js + Express | Railway o Render (gratis) |
| IA | Groq API (llama-3.3-70b) | Groq Cloud (gratis) |

---

## Desarrollo local

### 1. Clona el repo

```bash
git clone https://github.com/TU_USUARIO/mathmentor-ai.git
cd mathmentor-ai
```

### 2. Configura el backend

```bash
cd backend
cp .env.example .env
# Edita .env y pega tu GROQ_API_KEY (obtenla en https://console.groq.com)
npm install
npm run dev
# Corre en http://localhost:3001
```

### 3. Configura el frontend

```bash
cd frontend
# No necesitas .env en desarrollo (el proxy de Vite apunta a localhost:3001)
npm install
npm run dev
# Abre http://localhost:5173
```

---

## Deploy en producción

### Backend → Railway

1. Entra a [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Selecciona este repo → **Root Directory: `backend`**
3. En Variables agrega:
   - `GROQ_API_KEY` = tu key de Groq
   - `GROQ_MODEL` = `llama-3.3-70b-versatile`
   - `FRONTEND_URL` = URL de Vercel (la obtienes después)
4. Railway detecta `npm start` automáticamente.
5. Copia la URL generada (ej: `https://mathmentor-backend.up.railway.app`)

### Frontend → Vercel

1. Entra a [vercel.com](https://vercel.com) → Add New Project → importa este repo
2. Configuración:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. En **Environment Variables** agrega:
   - `VITE_API_URL` = URL de Railway del paso anterior
4. Deploy → obtienes tu URL pública.
5. Vuelve a Railway y actualiza `FRONTEND_URL` con la URL de Vercel.

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GROQ_API_KEY` | API Key de Groq (obligatoria) | `gsk_xxx...` |
| `GROQ_MODEL` | Modelo de Groq | `llama-3.3-70b-versatile` |
| `PORT` | Puerto del servidor | `3001` |
| `FRONTEND_URL` | URL del frontend para CORS | `https://mathmentor.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend en producción | `https://mathmentor-backend.up.railway.app` |

---

## Obtener API Key de Groq (gratis)

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita
3. Ve a **API Keys** → **Create API Key**
4. Copia la key y pégala en `backend/.env`

El plan gratuito incluye ~100,000 tokens/día, más que suficiente para uso personal.


Última actualización para despliegue en Vercel.
