# GranaBank Frontend

Base inicial para la plataforma financiera **GranaBank** con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, autenticación vía **Supabase** y arquitectura preparada para consumir un backend externo y desplegar en **Vercel**.

## Estructura del Proyecto

```text
src/
├── app/                  # Rutas y layouts principales (App Router)
│   ├── globals.css       # Estilos globales y tokens
│   ├── layout.tsx        # Layout raíz (con QueryProvider)
│   └── page.tsx          # Página de inicio
├── components/           # Componentes modulares
│   ├── ui/               # Primitivas UI reutilizables (Button, Input, Card, Badge)
│   ├── layout/           # Componentes de layout (Container)
│   ├── feedback/         # Feedback de usuario (Spinner, EmptyState)
│   ├── features/         # Componentes específicos de dominio
│   └── providers/        # Proveedores de contexto (QueryProvider)
├── constants/            # Rutas y claves de TanStack Query (query-keys.ts)
├── hooks/                # Hooks reutilizables (useSupabase)
├── lib/                  # Clientes de librerías y utilidades
│   ├── supabase/         # Clientes de Supabase para cliente, servidor y middleware
│   ├── query-client.ts   # Configuración y cliente de TanStack Query
│   ├── env.ts            # Variables de entorno tipadas
│   └── utils.ts          # Utilidades (cn, formateadores)
├── services/             # Servicios y cliente API para backend externo
│   └── api-client.ts     # Cliente HTTP con inyección automática de token Supabase
├── types/                # Tipos de TypeScript (database, api, auth)
└── middleware.ts         # Middleware para refrescar sesión de Supabase
```

## Puesta en Marcha

1. Instalar dependencias:
```bash
pnpm install
```

2. Configurar variables de entorno copiando `.env.example`:
```bash
cp .env.example .env.local
```

3. Iniciar entorno de desarrollo:
```bash
pnpm dev
```

4. Compilar para producción (Vercel):
```bash
pnpm build
```
