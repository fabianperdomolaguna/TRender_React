FROM ghcr.io/astral-sh/uv:python3.14-alpine3.23
COPY . /app
WORKDIR /app
# El venv vive fuera del volumen montado (./api:/app) para no escribir en el host.
ENV UV_PROJECT_ENVIRONMENT=/opt/venv
RUN uv sync --locked --no-dev
CMD ["uv", "run", "--no-dev", "fastapi", "run", "app/main.py", "--port", "80"]
