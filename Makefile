.PHONY: up down restart logs logs-grafana logs-influxdb logs-k6 \
        k6 test ps clean clean-all

COMPOSE := docker compose

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

logs-grafana:
	$(COMPOSE) logs -f grafana

logs-influxdb:
	$(COMPOSE) logs -f influxdb

logs-k6:
	$(COMPOSE) logs -f k6

k6:
	$(COMPOSE) run --rm k6 run /scripts/test.js

test: k6

clean:
	$(COMPOSE) down

clean-all:
	$(COMPOSE) down -v

up-build:
	$(COMPOSE) up -d --build