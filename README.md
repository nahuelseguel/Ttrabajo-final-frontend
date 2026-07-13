# LogiTrack — Frontend
Interfaz de usuario para el sistema de logística y trazabilidad, construida con **React 18**, **React Router v6** y **Vite**.

## Tabla de contenidos
1. [Requisitos previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Variables de entorno](#variables-de-entorno)
4. [Ejecución](#ejecución)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Páginas y rutas](#páginas-y-rutas)
7. [Conexión con el backend](#conexión-con-el-backend)
8. [Autenticación y sesión](#autenticación-y-sesión)

## Requisitos previos
| Herramienta | Versión mínima | Cómo verificar |
|-------------|---------------|----------------|
| Node.js     | 18.x          | `node -v`      |
| npm         | 9.x           | `npm -v`       |
> El backend debe estar corriendo antes de iniciar el frontend. Ver el README del backend para levantarlo.

## Instalación

### 1. Clonar el repositorio
git clone <url-del-repositorio>
cd logistics-frontend

### 2. Instalar dependencias
npm install

## Variables de entorno

### 1. Crear el archivo `.env`
cp .env.example .env

### 2. Contenido del `.env`
```env
# URL base del backend (sin barra al final)
VITE_API_URL=http://localhost:3000/api/v1
```
> Si el backend corre en otro puerto o servidor, actualizar este valor. Todas las variables de Vite deben comenzar con `VITE_` para ser accesibles en el código del cliente.

## Ejecución

### Modo desarrollo
npm run dev
La app queda disponible en: `http://localhost:5173`

### Build para producción
npm run build
Los archivos compilados se generan en la carpeta `dist/`.

### Previsualizar el build
npm run preview

## Estructura del proyecto
```
src/
├── main.jsx                        # Punto de entrada de React
├── App.jsx                         # Router principal con todas las rutas
├── index.css                       # Design tokens y estilos globales
│
├── lib/
│   └── api.js                      # Capa HTTP única (get/post/patch/delete)
│                                   # Todas las peticiones al backend pasan por aquí
│
├── context/
│   └── UserContext.jsx             # Estado global de autenticación
│                                   # Provee: user, isLoggedIn, isAdmin, loginUser, logoutUser
│
├── hooks/
│   └── useFetch.js                 # Hook genérico para GET con loading/error/refetch
│
└── components/
    ├── layout/
    │   ├── Header.jsx              # Barra de navegación principal
    │   └── ProtectedRoute.jsx      # Wrapper para rutas que requieren autenticación
    │
    ├── ui/                         # Componentes reutilizables
    │   ├── Button.jsx + .module.css
    │   ├── Input.jsx  + .module.css
    │   ├── Alert.jsx  + .module.css
    │   ├── Badge.jsx  + .module.css   # Estado visual de pedidos
    │   └── Spinner.jsx + .module.css
    │
    └── pages/
        ├── Auth/
        │   ├── Login/
        │   │   ├── Login.jsx       # Página de login con lógica
        │   │   └── LoginForm.jsx   # Formulario reutilizable
        │   └── Register/
        │       └── Register.jsx    # Registro de nuevo usuario
        │
        ├── Home/
        │   └── Home.jsx            # Página de inicio
        │
        ├── Orders/
        │   ├── Orders.jsx          # Listado de pedidos + CRUD completo
        │   └── OrderForm.jsx       # Formulario de creación/edición
        │
        ├── Tracking/
        │   └── Tracking.jsx        # Rastreo por código (acceso público)
        │
        ├── Profile/
        │   └── Profile.jsx         # Ver y editar datos propios
        │
        └── Admin/
            └── Admin.jsx           # Panel admin: usuarios + pedidos
```

## Páginas y rutas
| Ruta         | Componente   | Acceso              | Descripción                                   |
|--------------|--------------|---------------------|-----------------------------------------------|
| `/`          | Home         | Público             | Página de inicio                              |
| `/login`     | Login        | Solo no autenticados| Formulario de inicio de sesión                |
| `/register`  | Register     | Solo no autenticados| Formulario de registro                        |
| `/tracking`  | Tracking     | Público             | Rastrear pedido por código                    |
| `/orders`    | Orders       | Autenticado         | Ver, crear, editar y eliminar pedidos propios |
| `/profile`   | Profile      | Autenticado         | Ver y editar datos del perfil                 |
| `/admin`     | Admin        | Solo admin          | Gestión de usuarios y pedidos                 |

## Conexión con el backend
Toda la comunicación con el servidor pasa por `src/lib/api.js`. Este módulo:
- Lee la URL base desde `VITE_API_URL`
- Adjunta automáticamente el token JWT en el header `Authorization`
- Busca el token primero en `localStorage`, luego en `sessionStorage`
- Desenvuelve la respuesta del interceptor del backend (`{ success, data }`)
- Lanza un error con el mensaje del backend en caso de respuesta no-OK

```js
// Ejemplo de uso en cualquier componente
import { api } from '@/lib/api'

const orders = await api.get('/orders')
const newOrder = await api.post('/orders', { ...datos })
await api.patch(`/orders/${id}`, { status: 'confirmed' })
await api.delete(`/orders/${id}`)
```

## Autenticación y sesión
El estado de autenticación vive en `UserContext`. Al hacer login:
1. El backend devuelve `{ accessToken, user }`
2. El token se guarda en `localStorage` (si el usuario marcó "Recordarme") o en `sessionStorage`
3. Los datos del usuario se guardan en el mismo storage y se restauran automáticamente al recargar la página

### Acceder al usuario en cualquier componente
```jsx
import { useUser } from '@/context/UserContext'

function MiComponente() {
  const { user, isLoggedIn, isAdmin, logoutUser } = useUser()
  // ...
}
```

### Proteger una ruta
```jsx
// En App.jsx — rutas protegidas ya configuradas:
<Route path="/orders" element={
  <ProtectedRoute>
    <Orders />
  </ProtectedRoute>
} />

// Ruta solo para admins:
<Route path="/admin" element={
  <ProtectedRoute adminOnly>
    <Admin />
  </ProtectedRoute>
} />
```

## Flujo completo de uso
```
1. El usuario se registra en /register
   └── POST /auth/register → guarda token → redirige a /

2. El usuario crea un pedido en /orders
   └── POST /orders → el backend genera el código LOG-XXXX-XXXXXX

3. El destinatario rastrea el paquete en /tracking
   └── GET /orders/track/LOG-XXXX-XXXXXX → sin necesidad de login

4. El operador/admin actualiza el estado desde /admin
   └── PATCH /orders/:id → se crea evento de tracking automáticamente
