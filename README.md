# DataSoft Inventory

> **Aplicación fullstack** de gestión de inventarios empresariales construida con **Django + FastAPI + Next.js + PostgreSQL**, siguiendo principios de Arquitectura Limpia y microservicios.

---

## Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Prerrequisitos](#prerrequisitos)
- [Instalación Rápida](#instalación-rápida)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecución de Servidores de Desarrollo](#ejecución-de-servidores-de-desarrollo)
- [Calidad de Código y Herramientas](#calidad-de-código-y-herramientas)

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

---

## Prerrequisitos

- **Python 3.10+**
- **Node.js 18+** y **npm**
- **Docker Desktop** & Docker Compose

---

## Instalación Rápida (Desde Cero)

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
python3 -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.in
python3 manage.py migrate
python3 init_db.py          # Crea los usuarios iniciales de prueba
cd ..
```

**Usuarios de semilla (creados por `init_db.py`):**
- **Administrador:** `admin@eantest.com` / `password123`
- **Externo:** `externo@eantest.com` / `password123`

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

---

## Ejecución de Servidores de Desarrollo

Puedes iniciar los 4 procesos en terminales separadas:

1. **Base de Datos:** `docker compose up -d` (Puerto 5433)
2. **Django:** `cd backend-django && python3 manage.py runserver` (Puerto 8000)
3. **FastAPI:** `cd microservice-fastapi && python3 -m uvicorn main:app --port 8001 --reload` (Puerto 8001)
4. **Next.js:** `cd frontend-nextjs && npm run dev` (Puerto 3000)
