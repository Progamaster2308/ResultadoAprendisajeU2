# RA2: Django + React con Autenticación JWT y APIs

1. **Frontend en React (Vite)**:
   - React Router v6 con separación de layouts (`AdminLayout`, `ClientLayout`, `CommonLayout`).
   - Contexto de usuario (`AuthContext`) y Custom Hook `useAuth()` para persistencia de sesión con JWT.
   - Formularios de **Inicio de Sesión** y **Registro de Usuarios** validados con **Formik** y **Yup**.
   - Notificaciones interactivas con `react-toastify`.
2. **Integración de API de Terceros (Unidad 3)**:
   - Widget interactivo en el Dashboard protegido que consume APIs externas públicas en tiempo real (Advice Slip API y Open-Meteo Weather) utilizando `fetch()`.
3. **Web Services Propios y SOAP (Unidad 3)**:
   - **Endpoint propio protegido**: `/api/v1/auth/me/` con validación de cabecera `Authorization: Bearer <token>`.
   - **Consumo SOAP con Zeep**: Endpoint en Django `/api/v1/soap/countries/?code=MX` que consume el servicio WSDL público `CountryInfoService` mediante la librería Python `zeep`.
   - Script de prueba rápida en terminal: `backend/test_soap.py`.

---

##  Estructura del Repositorio

```
├── backend/                      # Proyecto Backend en Django
│   ├── manage.py                 # Gestor de comandos Django
│   ├── requirements.txt          # Dependencias Python (Django, DRF, SimpleJWT, Zeep, CORS)
│   ├── test_soap.py              # Script para prueba en terminal del servicio SOAP
│   ├── core/                     # Configuración principal del proyecto Django
│   │   ├── settings.py           # Configuración con CORS, JWT y apps instaladas
│   │   ├── urls.py               # Rutas principales y documentación Swagger
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── users/                    # Aplicación de usuarios y Web Services
│       ├── models.py             # Modelo personalizado de Usuario (AbstractUser)
│       ├── serializers.py        # Serializadores (UserSerializer, RegisterUserSerializer)
│       ├── views.py              # UserView, RegisterUserView, SoapCountryView (Zeep)
│       └── urls.py               # Endpoints /auth/token/, /auth/me/, /auth/register/, /soap/countries/
│
├── src/                          # Frontend en React (Vite)
│   ├── api/                      # Conexión con endpoints (token.ts, user.ts)
│   ├── context/                  # AuthContext.tsx para persistencia de sesión
│   ├── hooks/                    # useAuth.tsx, useUser.tsx
│   ├── layouts/                  # AdminLayout, ClientLayout, CommonLayout
│   ├── pages/
│   │   ├── admin/                # Dashboard.tsx (Protegido, API terceros, SOAP)
│   │   ├── client/               # Home.tsx
│   │   └── common/               # Login.tsx, Register.tsx, Error404.tsx
│   ├── routes/                   # Navigation.tsx, routes.admin, routes.client, routes.common
│   ├── App.tsx                   # Punto de entrada con AuthProvider y ToastContainer
│   └── main.tsx
├── package.json
└── README.md
```

---

##  Instalación y Puesta en Marcha

### 1. Requisitos Previos
- **Node.js** (versión 18 o superior) y **npm**
- **Python** (versión 3.9 o superior) y **pip**
- **Git**

---

### 2. Puesta en Marcha del Backend (Django)

1. Abrir una terminal y navegar a la carpeta `backend`:
   ```
   cd backend
   ```

2. Crear un entorno virtual (recomendado):
   ```
   # En Windows:
   python -m venv venv
   .\venv\Scripts\activate

   # En Linux / Mac:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Instalar las dependencias requeridas (incluye `zeep` y `simplejwt`):
   ```
   pip install -r requirements.txt
   ```

4. Ejecutar las migraciones y crear un superusuario:
   ```
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. Iniciar el servidor Django en el puerto 8000:
   ```
   python manage.py runserver 8000
   ```
   *El backend quedará disponible en: `http://127.0.0.1:8000/`*
   - Documentación Swagger: `http://127.0.0.1:8000/docs/`
   - Endpoint SOAP: `http://127.0.0.1:8000/api/v1/soap/countries/?code=MX`

---

### 3. Puesta en Marcha del Frontend (React + Vite)

1. En una nueva terminal, ubicarse en la raíz del proyecto:
   ```
   cd ..
   ```

2. Instalar las dependencias de Node:
   ```
   npm install
   ```

3. (Opcional) Configurar el archivo `.env`:
   ```
   VITE_BASE_API_URL=http://localhost:8000
   VITE_LOCAL_STORAGE_ITEM_NAME=TOKEN
   ```

4. Iniciar el servidor de desarrollo Vite:
   ```
   npm run dev
   ```
   *La aplicación estará visible en: `http://localhost:3000/`*
   ```
