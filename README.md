# KOGNT — MVP

Plataforma de acompañamiento psicológico. Next.js 14 + Supabase Auth + Gemini.

## Setup

1. `npm install`
2. Copia `.env.example` a `.env.local` y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (obtenla en https://aistudio.google.com/apikey)
   - `NEXT_PUBLIC_ROOT_DOMAIN` (opcional — ver «Portales»)
3. En Supabase → SQL Editor, copia y ejecuta `supabase/schema.sql`.
4. `npm run dev` y abre http://localhost:3000.

## Portales (arquitectura)

KOGNT se divide en **tres portales independientes**, aislados por rol y, en
producción, por subdominio. Un usuario común **no puede acceder** al SaaS ni al
MaaS, y no existe ningún enlace entre ellos.

| Portal     | Subdominio        | Rutas internas        | Rol             | Diseño            |
| ---------- | ----------------- | --------------------- | --------------- | ----------------- |
| Consumer   | `kognt.io`        | `/`, `/chat`, `/configuracion`, `/faq`, `/legales` | `user`    | AppShell (sidebar) |
| SaaS Pro   | `saas.kognt.io`   | `/saas/clinica`, `/saas/corporativo`               | `clinico` / `empresa` | SaasShell (badge PRO) |
| MaaS       | `maas.kognt.io`   | `/maas`               | público         | Landing dev API   |

- **Roles**: se leen de `user.user_metadata.role` (`user` | `clinico` | `empresa`),
  normalizados en `lib/portal.ts`.
- **Login único**: el acceso es el mismo (`/`); tras autenticarse, el middleware
  redirige a cada quien a su portal según el rol (`homeForRole`).
- **Aislamiento**: `middleware.ts` aplica los guards. Con `NEXT_PUBLIC_ROOT_DOMAIN`
  configurado, además fuerza el subdominio canónico de cada portal. Sin esa
  variable (dev), los portales conviven por ruta pero el aislamiento por rol se
  mantiene.

## Estructura

- `app/page.tsx` — landing + login/registro (consumer)
- `app/chat/` — interfaz de chat (consumer)
- `app/configuracion/`, `app/faq/`, `app/legales/` — resto del portal consumer
- `app/saas/` — portal profesional (clínica + corporativo)
- `app/maas/` — landing del producto API
- `app/components/AppShell.tsx` — shell del consumer
- `app/components/SaasShell.tsx` — shell del SaaS
- `app/components/PublicShell.tsx` — shell de páginas públicas (faq/legales)
- `lib/portal.ts` — lógica de roles y portales
- `lib/supabase/` — clientes browser/server con SSR
- `middleware.ts` — separación de portales + protección de rutas
- `supabase/schema.sql` — esquema y políticas RLS

## Notas

- El historial completo por usuario se carga al entrar a `/chat`.
- Cada turno envía hasta los últimos 40 mensajes como contexto a Gemini.
- RLS asegura que cada usuario solo ve sus propios mensajes.
