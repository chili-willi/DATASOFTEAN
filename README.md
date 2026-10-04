# DataSoft Inventory

> **Aplicación fullstack** de gestión de inventarios empresariales construida con **Django + FastAPI + Next.js + PostgreSQL**, siguiendo principios de Arquitectura Limpia y microservicios.

---

## Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Prerrequisitos](#prerrequisitos)
- [Instalación Rápida](#instalación-rápida)
- [Variables de Entorno](#variables-de-entorno)
- [Calidad de Código y Comprobaciones](#calidad-de-código-y-comprobaciones)
- [Ejecución de Servidores de Desarrollo](#ejecución-de-servidores-de-desarrollo)
- [Endpoints de la API](#endpoints-de-la-api)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Licencia](#licencia)

---

## Arquitectura del Sistema

El proyecto sigue una **arquitectura de microservicios** con una capa de dominio desacoplada:

```
datasoft-inventory/
│
├── domain-package/          ← Capa de Dominio (Entidades Pydantic)
├── backend-django/          ← Backend principal (REST API + Auth)
├── microservice-fastapi/    ← Microservicio auxiliar (PDF, Brevo, Gemini, Auditoría)
├── frontend-nextjs/         ← Frontend (Next.js 16 - Pages Router)
├── docker-compose.yml       ← Orquestación de PostgreSQL + pgvector
├── pyproject.toml           ← Configuración global de Ruff (linter/formatter de Python)
└── .env                     ← Variables de entorno (local)
```

### Resumen por carpeta

| Carpeta | Responsabilidad |
|---|---|
| **`domain-package/`** | Paquete Python gestionado con **Poetry**. Contiene las entidades puras del negocio (`Empresa`, `Producto`, `Usuario`) y sus reglas de validación, usando **Pydantic**. Está **completamente desacoplada** de Django, HTTP, vistas o infraestructura. |
| **`backend-django/`** | API REST desarrollada con **Django 6 + Django REST Framework**. Gestiona autenticación con tokens, CRUD de empresas y productos, y persistencia en **PostgreSQL**. Consume `domain-package` a través del `sys.path`. |
| **`microservice-fastapi/`** | Microservicio independiente con **FastAPI**. Proporciona: generación de **reportes PDF** (ReportLab), envío de **emails con adjuntos** (Brevo REST API), sugerencias con **IA Generativa** (Gemini API), y un **libro de auditoría criptográfico** (Blockchain simplificada con SHA-256). |
| **`frontend-nextjs/`** | Interfaz de usuario con **Next.js 14 + React 18**. Incluye páginas para login, gestión de empresas, productos, vista de inventario con descarga/envío de PDF, y un copiloto de IA. Usa **Lucide React** para iconografía. |

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14, React 18, Lucide React |
| Backend API | Django 6, Django REST Framework, Token Auth |
| Microservicio | FastAPI, Uvicorn, ReportLab, Gemini AI |
| Dominio | Python, Pydantic v2, Poetry |
| Base de Datos | PostgreSQL 16 + pgvector (Docker) |
| Infraestructura | Docker Compose |
| Email | Brevo REST API |
| IA Generativa | Google Gemini 2.5 Flash |
| Auditoría | Blockchain simplificada (SHA-256) |

---

## Prerrequisitos

- **Python 3.13+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** y **npm** → [nodejs.org](https://nodejs.org/)
- **Docker Desktop** → [docker.com](https://www.docker.com/products/docker-desktop/)
- **Poetry** (para el paquete de dominio) → [python-poetry.org](https://python-poetry.org/docs/#installation)
- **Git** → [git-scm.com](https://git-scm.com/)

---

## Instalación Rápida

### 1. Clonar el repositorio y configurar el archivo de entorno

Copia el ejemplo de entorno y configura tus llaves (`BREVO_API_KEY` y `GEMINI_API_KEY`):

```bash
cp .env.example .env
```

### 2. Levantar la base de datos con Docker

```bash
docker compose up -d
```
> **Nota:** La base de datos se expone en el puerto **5433** del host (`5433:5432` en el contenedor) para evitar conflictos locales.

### 3. Configurar el Backend (Django)

```bash
cd backend-django

# Instalar dependencias
pip install -r requirements.in

# Aplicar migraciones
python3 manage.py migrate
python3 init_db.py          # Crea los usuarios iniciales de prueba
cd ..
```

```bash
# Opcional: instalar pip-tools para autogenerar requirements.txt con las dependencias y sus versiones
pip-compile requirements.in
```

**Usuarios de semilla (creados por `init_db.py`):**

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@litetest.com` | `password123` | Administrador |
| `externo@litetest.com` | `password123` | Externo |

### 4. Configurar el Microservicio (FastAPI)

```bash
cd microservice-fastapi
pip install -r requirements.in
cd ..
```

### 5. Configurar el Frontend (Next.js)

```bash
cd frontend-nextjs
npm install
cd ..
```

---

## Variables de Entorno

El proyecto utiliza un único archivo `.env` en la **raíz del proyecto** que es leído por los tres servicios (Django, FastAPI, y Docker Compose).

Consulta el archivo [`.env.example`](.env.example) como plantilla:

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `DB_USER` | Usuario de PostgreSQL | `ean_user` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `ean_password` |
| `DB_NAME` | Nombre de la base de datos | `ean_db` |
| `DB_PORT` | Puerto de la base de datos (por defecto) | `5433` |
| `GEMINI_API_KEY` | API Key de Google Gemini (para IA) | `tu_api_key_aqui` |
| `BREVO_API_KEY` | API Key de Brevo (para envío de correos) | `tu_api_key_de_brevo` |


### Variables de Entorno en Producción (Despliegue)

Cuando el proyecto se encuentra desplegado en producción, las variables se configuran en las plataformas de hosting en lugar de usar el archivo `.env` local:

* **En Render** (Backend Django y Microservicio FastAPI):
  * `BREVO_API_KEY`: API Key para el envío de correos desde brevo.com.
  * `GEMINI_API_KEY`: API Key para el copiloto de IA de Google Gemini.
  * Variables de la base de datos PostgreSQL de producción (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`).
  * `DJANGO_SECRET_KEY`: Llave secreta para Django.

* **En Vercel** (Frontend Next.js):
  * `NEXT_PUBLIC_API_URL`: URL de la API del backend en Render (ej. `https://...onrender.com`).
  * `NEXT_PUBLIC_FASTAPI_URL`: URL de la API del microservicio en Render (ej. `https://...onrender.com`).

---

## Calidad de Código y Comprobaciones

El proyecto cuenta con herramientas estandarizadas de calidad de código:

- **Python (Django & FastAPI):** Utiliza **Ruff** para linting y formateo.
  ```bash
  python3 -m ruff check .
  python3 -m ruff format .
  ```
- **Frontend (Next.js):** Utiliza **ESLint** (Flat Config) y **Prettier**.
  ```bash
  cd frontend-nextjs
  npm run lint
  npm run format
  ```
- **Tests Unitarios (FastAPI):**
  ```bash
  cd microservice-fastapi
  python3 -m pytest
  ```
  El script valida:
  1. Login de admin y usuario externo
  2. Restricción de permisos (usuario externo no puede crear empresas)
  3. Creación de empresa y producto como admin
  4. Generación de PDF
  5. Envío simulado de correo
  6. Sugerencia de IA
  7. Consulta del libro de auditoría

---

## Ejecución de Servidores de Desarrollo

Puedes iniciar los 4 procesos en terminales separadas:

1. **Base de Datos:** (Puerto 5433)
```bash
docker compose up -d
```

2. **Django:** (Puerto 8000)
```bash
cd backend-django
python3 manage.py runserver
```

3. **FastAPI:** (Puerto 8001)

```bash
cd microservice-fastapi
uvicorn main:app --port 8001 --reload
```
> Documentación interactiva (Swagger): **http://127.0.0.1:8001/docs**

4. **Next.js:** (Puerto 3000)
```bash
cd frontend-nextjs
npm run dev
```

## Endpoints de la API

### Backend Django (`http://127.0.0.1:8000/api/`)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register/` | Registrar un nuevo usuario |
| `POST` | `/api/auth/login/` | Iniciar sesión (devuelve token) |
| `GET` | `/api/auth/me/` | Obtener perfil del usuario autenticado |
| `GET/POST` | `/api/empresas/` | Listar / Crear empresas |
| `GET/PUT/DELETE` | `/api/empresas/{nit}/` | Detalle / Editar / Eliminar empresa |
| `GET/POST` | `/api/productos/` | Listar / Crear productos |
| `GET/PUT/DELETE` | `/api/productos/{id}/` | Detalle / Editar / Eliminar producto |

### Microservicio FastAPI (`http://127.0.0.1:8001`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/` | Health check del microservicio |
| `POST` | `/api/micro/pdf/generate` | Generar reporte PDF del inventario |
| `POST` | `/api/micro/email/send-pdf` | Enviar reporte PDF por correo electrónico |
| `POST` | `/api/micro/ai/suggest` | Sugerencia de descripción con IA (Gemini) |
| `POST` | `/api/micro/blockchain/add` | Registrar transacción en cadena de auditoría |
| `GET` | `/api/micro/blockchain/ledger` | Consultar libro de auditoría completo |

---

## Funcionalidades Principales

- **CRUD de Empresas y Productos** con control de acceso por roles.
- **Autenticación con tokens** y contraseñas encriptadas.
- **Roles de usuario**: `Administrador` (CRUD completo) y `Externo` (solo lectura).
- **Generación de reportes PDF** con ReportLab desde el microservicio.
- **Envío de reportes por email** a cualquier destinatario vía la API REST de Brevo.
- **Copiloto de IA** que sugiere descripciones de productos usando Google Gemini.
- **Libro de auditoría criptográfico (Blockchain)** con integridad verificable en tiempo real.
- **Capa de dominio independiente** gestionada con Poetry, siguiendo Clean Architecture.
- **PostgreSQL con pgvector** preparado para búsquedas semánticas con embeddings.

---

## Licencia

Proyecto desarrollado para **DataSoft Inventory — 2026**.