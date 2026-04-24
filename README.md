# MeetMind 🧠

Tu asistente inteligente para reuniones — transforma conversaciones en decisiones, tareas y agenda automáticamente.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **IA**: Claude (Anthropic) via Serverless Edge Functions
- **Deploy**: Vercel

## Funcionalidades con IA real

| Función | Endpoint | Descripción |
|---|---|---|
| Generar resumen | `POST /api/generate-summary` | Resumen, esquema o mapa conceptual desde transcripción |
| Extraer tareas | `POST /api/generate-tasks` | Extrae action items y decisiones con asignados y fechas |
| Analizar transcripción | `POST /api/analyze-transcript` | Clasifica cada segmento: decisión, tarea, insight |

## Deploy en Vercel

### 1. Instala Vercel CLI (si no lo tienes)
```bash
npm install -g vercel
```

### 2. Login y deploy
```bash
cd meetmind
vercel
```

### 3. Configura la variable de entorno
En el dashboard de Vercel → **Settings → Environment Variables**:

```
ANTHROPIC_API_KEY = sk-ant-tu-clave-aqui
```

O por CLI:
```bash
vercel env add ANTHROPIC_API_KEY
```

### 4. Redeploy con la variable
```bash
vercel --prod
```

## Desarrollo local

```bash
# Copia el archivo de entorno
cp .env.example .env.local

# Edita .env.local con tu clave real
# ANTHROPIC_API_KEY=sk-ant-...

# Instala dependencias
npm install

# Levanta el servidor de desarrollo + funciones serverless
vercel dev
```

> **Nota**: Para que las funciones `/api/*` funcionen en local, usa `vercel dev` en lugar de `npm run dev`. Esto simula el entorno de Vercel localmente.

## Estructura del proyecto

```
meetmind/
├── api/                          # Serverless Edge Functions (Vercel)
│   ├── generate-summary.js       # Genera resumen/esquema/mapa conceptual
│   ├── generate-tasks.js         # Extrae tareas y decisiones
│   └── analyze-transcript.js     # Analiza y clasifica transcripción
├── src/
│   └── app/
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── MeetingDetail.tsx  ← IA: resumen + extracción de tareas
│       │   ├── MeetingSummary.tsx ← IA: resumen con niveles de detalle
│       │   ├── TasksManager.tsx   ← IA: priorización inteligente
│       │   ├── CalendarView.tsx
│       │   ├── ProjectManager.tsx
│       │   ├── UserProfile.tsx
│       │   └── Notifications.tsx
│       └── components/
│           └── TranscriptionFlow.tsx
├── vercel.json                   # Configuración de deploy
├── .env.example                  # Plantilla de variables de entorno
└── package.json
```
