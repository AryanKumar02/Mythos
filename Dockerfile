FROM docker/compose:latest

WORKDIR /app

COPY docker-compose.prod.yml .
COPY frontend ./frontend
COPY backend ./backend

CMD ["docker-compose", "-f", "docker-compose.prod.yml", "up"]