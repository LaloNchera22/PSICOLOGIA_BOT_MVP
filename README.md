# Psicología Bot — MVP

Chatbot minimalista de acompañamiento psicológico. Next.js 14 + Supabase Auth + Gemini.

## Setup

1. `npm install`
2. Copia `.env.example` a `.env.local` y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (obtenla en https://aistudio.google.com/apikey)
3. En Supabase → SQL Editor, copia y ejecuta `supabase/schema.sql`.
4. `npm run dev` y abre http://localhost:3000.

## Estructura

- `app/page.tsx` — login / registro
- `app/chat/` — interfaz de chat
- `app/api/chat/route.ts` — endpoint que llama a Gemini y persiste mensajes
- `lib/supabase/` — clientes browser/server con SSR
- `middleware.ts` — protección de rutas
- `supabase/schema.sql` — esquema y políticas RLS

## Notas

- El historial completo por usuario se carga al entrar a `/chat`.
- Cada turno envía hasta los últimos 40 mensajes como contexto a Gemini.
- RLS asegura que cada usuario solo ve sus propios mensajes.
