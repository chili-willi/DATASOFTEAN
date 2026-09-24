# Cambiamos python:3.11-slim por python:3.12-slim
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copiar e instalar el paquete de Dominio local
COPY domain-package /app/domain-package
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -e /app/domain-package

# Copiar e instalar requerimientos de Django
COPY backend-django/requirements.in /app/requirements.in
RUN pip install --no-cache-dir -r requirements.in
RUN pip install --no-cache-dir gunicorn

COPY backend-django /app/

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate --noinput && python init_db.py && gunicorn core.wsgi:application --bind 0.0.0.0:8000"]
