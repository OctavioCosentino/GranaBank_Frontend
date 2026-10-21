# Directrices de Desarrollo para GranaBank

Estándares de arquitectura y desarrollo a seguir en este repositorio:

## 1. Componentización Estricta
- **Atoms / Primitivas UI (`src/components/ui/`)**: Componentes agnósticos reutilizables. Usar `class-variance-authority` y `cn` (`clsx` + `tailwind-merge`).
- **Layout (`src/components/layout/`)**: Estructuras globales y contenedores.
- **Features (`src/components/features/<feature>/`)**: Componentes moleculares específicos de dominio.
- **Feedback (`src/components/feedback/`)**: Spinners, alertas y estados vacíos.

## 2. Backend & Supabase
- **Backend Externo**: Todas las llamadas pasan por `src/services/api-client.ts`. Inyecta automáticamente el JWT de Supabase en `Authorization: Bearer <token>`.
- **Supabase**: Uso exclusivo de `@supabase/ssr` (`client.ts`, `server.ts`, `middleware.ts`).

## 3. Manejo de Estado (TanStack Query)
- Usar hooks personalizados (`useQuery`, `useMutation`) conectados a `src/services/api-client.ts`.
- Definir claves de consulta centralizadas en `src/constants/query-keys.ts`.
- Configuración y cliente centralizados en `src/lib/query-client.ts` y provistos por `QueryProvider`.

## 4. Comentarios en Código
- Breves, directos y sin decoración (sin divisores de caracteres o texto excesivo).
- Explicar únicamente el propósito del componente o función cuando sea necesario.

## 5. Despliegue en Vercel & TypeScript
- Código siempre apto para `pnpm build` sin errores de compilación ni tipos (`no any`).
- Variables públicas con prefijo `NEXT_PUBLIC_`.
