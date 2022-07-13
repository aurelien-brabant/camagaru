COMPOSE_DEV=docker compose -f docker-compose.dev.yml -p camagru_dev

all: dev
.PHONY: all

dev:
	$(COMPOSE_DEV) up --build
.PHONY: dev

dev-bg:
	$(COMPOSE_DEV) up --build -d

dev-stop:
	$(COMPOSE_DEV) down
.PHONY: dev-stop
