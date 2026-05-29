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

- `app/page.tsx` — login / registro (con aceptación de términos en el alta)
- `app/chat/` — interfaz del chatbot
- `app/legales/` — términos y condiciones (deja claro que no sustituye a un profesional)
- `app/api/chat/route.ts` — endpoint que llama a Gemini y persiste mensajes
- `app/components/AppShell.tsx` — layout del chatbot (sidebar, tema)
- `lib/supabase/` — clientes browser/server con SSR
- `lib/i18n.ts` — textos multidioma
- `middleware.ts` — protección de rutas
- `supabase/schema.sql` — esquema y políticas RLS

## Notas

- El proyecto es exclusivamente el chatbot de acompañamiento psicológico.
- El bot **niega el servicio** ante cualquier petición fuera del acompañamiento emocional/psicológico.
- Al crear cuenta se debe aceptar los términos, que aclaran que **KOGNT no sustituye a un profesional**.
- El historial completo por usuario se carga al entrar a `/chat`.
- Cada turno envía hasta los últimos 40 mensajes como contexto a Gemini.
- RLS asegura que cada usuario solo ve sus propios mensajes.
