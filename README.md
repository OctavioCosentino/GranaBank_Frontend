# GranaBank Frontend

Plataforma financiera digital **GranaBank** desarrollada con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query v5**, arquitectura modular y cliente HTTP preparado para backend externo y despliegues optimizados en **Vercel**.

---

## Índice

- [Arquitectura y Estructura del Proyecto](#arquitectura-y-estructura-del-proyecto)
- [Navegación y Protección de Rutas](#navegación-y-protección-de-rutas)
- [Gestión de Estado y Comunicación con el Backend](#gestión-de-estado-y-comunicación-con-el-backend)
- [Manejo de Sesión: Access Token, Refresh Token y "Recordarme"](#manejo-de-sesión-access-token-refresh-token-y-recordarme)
- [Componentización Estricta y Sistema de Diseño](#componentización-estricta-y-sistema-de-diseño)
- [Optimización de Assets e Imágenes a WebP](#optimización-de-assets-e-imágenes-a-webp)
- [Puesta en Marcha](#puesta-en-marcha)

---

## Arquitectura y Estructura del Proyecto

El proyecto está organizado bajo una estructura modular orientada al dominio y a la mantenibilidad a largo plazo:

```text
src/
├── app/                         # Rutas y páginas (Next.js App Router)
│   ├── (public)/                # Rutas públicas (Login)
│   │   └── page.tsx             # Pantalla de acceso
│   ├── (private)/               # Rutas protegidas (Home, Movimientos)
│   │   ├── layout.tsx           # Layout privado (guard de cliente + BottomBar)
│   │   ├── home/                # Vista principal con tarjetas y últimos movimientos
│   │   └── transactions/        # Vista de movimientos con búsqueda y filtros
│   ├── not-found.tsx            # Página 404 minimalista GranaBank
│   ├── layout.tsx               # Layout raíz (fuente Poppins, QueryProvider, Toaster)
│   └── globals.css              # Estilos base y variables globales
├── components/                  # Biblioteca de componentes UI y features
│   ├── feedback/                # Spinners, skeletons y estados vacíos (EmptyState)
│   ├── providers/               # QueryProvider para TanStack Query
│   ├── add-card-modal.tsx       # Modal para registrar nuevas tarjetas
│   ├── bottom-bar.tsx           # Barra de navegación móvil persistente
│   ├── card-carousel.tsx        # Carrusel táctil con soporte de arrastre y rueda
│   ├── card.tsx                 # Tarjeta corporativa GranaBank y CardSkeleton
│   ├── filter-bar.tsx           # Barra de filtros con mini slider indicador
│   ├── home-header.tsx          # Encabezado del dashboard
│   ├── search-bar.tsx           # Barra de búsqueda con autoenfoque e iconos
│   └── transaction.tsx          # Componente de transacción y TransactionSkeleton
├── constants/                   # Claves de Query y rutas centralizadas
│   ├── query-keys.ts            # Claves de consulta estructuradas y tipadas
│   └── routes.ts                # Rutas de la aplicación
├── hooks/                       # Hooks personalizados desacoplados
│   ├── use-cards.ts             # Queries y mutaciones de tarjetas
│   ├── use-login-mutation.ts    # Mutación de inicio de sesión
│   └── use-transactions.ts      # Queries infinitas y recientes de movimientos
├── lib/                         # Configuraciones y utilidades compartidas
│   ├── supabase/                # Clientes de Supabase (@supabase/ssr)
│   ├── env.ts                   # Variables de entorno validadas
│   ├── query-client.ts          # Configuración centralizada de TanStack Query
│   ├── token-manager.ts         # Gestor de tokens y ciclo de vida de sesión
│   └── utils.ts                 # Utilidades de combinación de clases (cn)
├── services/                    # Servicios HTTP hacia el backend
│   ├── api-client.ts            # Cliente HTTP con inyección automática de Bearer Token
│   ├── auth-service.ts          # Endpoints de autenticación
│   ├── card-service.ts          # Endpoints de tarjetas
│   └── transaction-service.ts   # Endpoints de movimientos con paginación
├── types/                       # Tipos e interfaces de TypeScript
│   ├── api.ts                   # Respuestas y errores HTTP estandarizados
│   ├── auth.ts                  # Modelos de sesión, perfil y credenciales
│   ├── card.ts                  # Modelos y DTOs de tarjetas
│   └── transaction.ts           # Modelos de movimientos y metadatos de paginación
└── middleware.ts                # Middleware en Edge para protección perimetral de rutas
```

---

## Navegación y Protección de Rutas

La aplicación implementa un esquema de **doble capa de seguridad** utilizando la arquitectura de rutas por carpetas (_Route Groups_) de Next.js:

### 1. Route Groups

- **`(public)`**: Aísla las rutas accesibles a usuarios no autenticados, permitiendo una experiencia de inicio de sesión enfocada sin componentes de navegación secundaria.
- **`(private)`**: Agrupa las pantallas financieras (`/home`, `/transactions`). Comparten un [`PrivateLayout`](<src/app/(private)/layout.tsx>) que persiste la barra de navegación inferior ([`BottomBar`](src/components/bottom-bar.tsx)) y ejecuta validaciones de seguridad en el cliente.

### 2. Doble Capa de Autenticación

1. **Protección Perimetral en el Servidor ([`src/middleware.ts`](src/middleware.ts))**:
   - Corre en el Edge antes de que la página comience a renderizarse.
   - Detecta accesos a `/home` o `/transactions` sin credenciales válidas y los redirige inmediatamente al login (`/`).
   - Redirige automáticamente del login (`/`) a `/home` a nivel de servidor si el usuario cuenta con una sesión persistente (`granabank_remember=true`). Para sesiones temporales, la redirección la coordina el cliente mediante `useSyncExternalStore` por pestaña, eliminando cualquier bucle o retraso entre servidor y cliente.
2. **Validación en Cliente ([`PrivateLayout`](<src/app/(private)/layout.tsx>))**:
   - Resuelve el estado de autenticación de forma reactiva y sincrónica con `useSyncExternalStore` conectado a [`tokenManager.getAccessToken()`](src/lib/token-manager.ts).
   - Si no hay token activo, purga cualquier rastro residual de cookies y redirige al login de inmediato sin bloqueos ni loaders infinitos.

> **Nota**: Las rutas no existentes son interceptadas por una página 404 personalizada ([`src/app/not-found.tsx`](src/app/not-found.tsx)), que redirige al usuario al inicio según su estado de sesión.

---

## Gestión de Estado y Comunicación con el Backend

Toda la comunicación de datos asíncronos con el backend externo se gestiona mediante **TanStack Query v5**, evitando llamadas manuales dispersas y garantizando consistencia, caché inteligente y reintentos controlados:

### 1. Cliente HTTP Centralizado ([`src/services/api-client.ts`](src/services/api-client.ts))

- Todas las peticiones pasan a través de `ApiClient`.
- Inyecta de forma transparente el encabezado `Authorization: Bearer <access_token>` obtenido de [`TokenManager`](src/lib/token-manager.ts).
- Normaliza los errores del servidor devolviendo instancias tipadas de `ApiError` (`statusCode`, `message`, `details`).

### 2. Claves de Consulta Centralizadas ([`src/constants/query-keys.ts`](src/constants/query-keys.ts))

Las claves de consulta se definen en un único archivo bajo objetos inmutables con funciones factory para evitar colisiones de caché:

```typescript
export const QUERY_KEYS = {
  auth: { ... },
  cards: { all: ["cards"] as const },
  transactions: {
    all: ["transactions"] as const,
    list: (params: { search?: string; type?: string }) => ["transactions", params] as const,
    recent: (limit: number) => ["transactions", "recent", limit] as const,
  },
};
```

### 3. Scroll Infinito y Filtros Reactivos en Movimientos

- **`useInfiniteQuery`**: En la vista de movimientos, [`useInfiniteTransactionsQuery`](src/hooks/use-transactions.ts) maneja la paginación por lotes (`pageParam = 1`, `limit: 15`).
- **Sentinel `IntersectionObserver`**: Carga de forma automática la siguiente página cuando el usuario se desplaza al final del listado.
- **Búsqueda con Debounce (300ms)**: El input de búsqueda retarda la actualización del query key 300 ms, evitando saturar el backend con llamadas intermedias por cada tecla presionada.
- **Home sincronizado (`useRecentTransactionsQuery`)**: En la página principal se consumen únicamente los primeros 6 movimientos ordenados cronológicamente desde el más reciente hacia el más antiguo mediante la columna `created_at`.

---

## Manejo de Sesión: Access Token, Refresh Token y "Recordarme"

La arquitectura de autenticación resuelve de forma diferenciada la persistencia según la casilla de verificación **"Recordarme"** mediante [`TokenManager`](src/lib/token-manager.ts):

### Cuando "Recordarme" está ACTIVADO

- **Almacenamiento**: El `access_token` y `refresh_token` se guardan en `localStorage`.
- **Cookies**: Se emite la cookie `granabank_token` y `granabank_remember=true` con una caducidad de **30 días** (`max-age=2592000`).
- **Comportamiento**: El usuario puede cerrar la pestaña, reiniciar el navegador o apagar el equipo; al regresar a la aplicación, su sesión continuará abierta.

### Cuando "Recordarme" está DESACTIVADO

- **Almacenamiento**: Los tokens se almacenan estrictamente en `sessionStorage`.
- **Cookies**: Se emite una cookie de sesión sin atributo `max-age` para permitir que el middleware autorice la navegación entre páginas dentro de la misma sesión. La cookie `granabank_remember` se elimina.
- **Comportamiento al cerrar la pestaña**:
  - `sessionStorage` es destruido por el navegador al cerrar la pestaña.
  - Si el usuario abre una nueva pestaña e intenta ingresar a `/home`, el layout detecta que `sessionStorage` está vacío.
  - Inmediatamente se ejecuta `tokenManager.clearSession()`, que establece la expiración de las cookies en el pasado (`expires=Thu, 01 Jan 1970 00:00:00 GMT`), destruyendo la cookie y redirigiendo al login (`/`) sin bucles de redirección.

---

## Componentización Estricta y Sistema de Diseño

El proyecto sigue una política de componentización estricta para garantizar reutilización, consistencia y facilidad de mantenimiento:

- **Atoms y Primitivas UI**: Componentes independientes de dominio como botones granate ([`GranaButton`](src/components/grana-button.tsx)), inputs con bordes reactivos ([`Input`](src/components/input.tsx)) y checkboxes con estados animados ([`Checkbox`](src/components/checkbox.tsx)).
- **Feedback Visual**:
  - **Skeletons**: [`CardSkeleton`](src/components/card.tsx) y [`TransactionSkeleton`](src/components/transaction.tsx) con animaciones de pulso que evitan saltos visuales (_layout shift_) durante la carga de datos del backend.
  - **Estados Vacíos ([`EmptyState`](src/components/feedback/empty-state.tsx))**: Variantes `no-transactions` y `no-results` con ilustraciones minimalistas, textos amigables y botones para restablecer filtros.
- **Componentes Moleculares / Features**:
  - **[`CardCarousel`](src/components/card-carousel.tsx)**: Carrusel horizontal con soporte para scroll táctil con snap obligatorio, arrastre con cursor de ratón en computadoras y navegación rápida tarjeta por tarjeta mediante la rueda vertical del ratón (`wheel`). Muestra una tarjeta en tono apagado (`#82444D`) si el usuario no tiene tarjetas registradas.
  - **[`FilterBar`](src/components/filter-bar.tsx)**: Barra de filtros horizontales con pastillas `shrink-0` y un **mini slider horizontal granate (`#7A1D2D`)** centrado en la base que se desplaza proporcionalmente en tiempo real para indicar visualmente que el contenido continúa hacia la derecha.
  - **[`AddCardModal`](src/components/add-card-modal.tsx)**: Modal con previsualización interactiva de la tarjeta, enmascaramiento automático de vencimiento (`MM/YY`) y validación de año en curso.

### Paleta Institucional

- **Granate Primario**: `#7A1D2D`
- **Granate Apagado / Empty Card**: `#82444D`
- **Acento Suave / Tinte Pastel**: `#E4D2D5`
- **Fondo Neutro**: `#F9FAFC`
- **Dorado de Divisa**: Degradado `#E6BC5C` a `#CA9333`

---

## Optimización de Assets e Imágenes a WebP

Para optimizar al máximo la carga en **Vercel** y mejorar los puntajes de **Core Web Vitals** (en particular **LCP - Largest Contentful Paint**), todas las imágenes estáticas del directorio `public/` fueron convertidas del formato PNG tradicional a **WebP**:

### Resultados de la compresión:

| Asset            | Formato Original (PNG) | Formato Optimizado (WebP) | Reducción |
| :--------------- | :--------------------: | :-----------------------: | :-------: |
| `GranaBank_Logo` |        16.15 KB        |        **3.60 KB**        | **-78%**  |
| `mastercard`     |        1.53 KB         |        **0.98 KB**        | **-36%**  |
| `visa`           |        1.33 KB         |        **0.95 KB**        | **-28%**  |

_El directorio público completo de la aplicación pesa en conjunto menos de **6 KB**._

---

## Puesta en Marcha

### Requisitos Previos

- Node.js versión 18 o superior.
- Gestor de paquetes `pnpm` (`npm install -g pnpm`).

### Instalación y Ejecución

1. Clonar el repositorio e instalar las dependencias:

```bash
pnpm install
```

2. Configurar las variables de entorno creando el archivo `.env.local`:

```env
# Backend externo (API desplegada en Render)
NEXT_PUBLIC_API_URL=https://granabank-backend.onrender.com/api/v1

# URL pública del frontend (En producción: URL de Vercel)
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

> [!NOTE]
> **Pruebas y desarrollo local (`localhost`)**:
> Si vas a ejecutar la aplicación localmente en tu máquina, ajusta en tu `.env.local`:
>
> ```env
> NEXT_PUBLIC_SITE_URL=http://localhost:3000
> ```
>
> La API del backend (`NEXT_PUBLIC_API_URL`) puede seguir apuntando a Render (`https://granabank-backend.onrender.com/api/v1`) para contar con datos reales, o a un backend local (por ejemplo `http://localhost:5000/api/v1`) si estás desarrollando en local.

3. Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

4. Validar linter y compilación para producción (Vercel):

```bash
pnpm lint
pnpm build
```

Ambos comandos deben finalizar con **0 errores y 0 advertencias**.
