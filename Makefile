.PHONY: up down restart logs logs-grafana logs-influxdb logs-k6 \
        k6 test \
        json json-inicio json-fim json-aleatorio \
        csv csv-inicio csv-fim csv-aleatorio \
        txt txt-inicio txt-fim txt-aleatorio \
        all parallel users-local users-compose \
        clean clean-all up-build

COMPOSE := docker compose

# =========================
# Massa de dados
# =========================

users-local:
	DATA_DIR=./data ./data/buscar-usuarios.sh

users-compose:
	$(COMPOSE) run --rm -e DATA_DIR=/data k6 sh /scripts/data/buscar-usuarios.sh


# =========================
# Docker Compose
# =========================

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

up-build:
	$(COMPOSE) up -d --build

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


# =========================
# k6
# =========================

k6:
	$(COMPOSE) run --rm k6 run /scripts/test.js

test: k6


# =========================
# Testes JSON
# =========================

json-inicio:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/json/teste-inicio-fim.js

json-fim:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/json/teste-fim-inicio.js

json-aleatorio:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/json/teste-aleatorio.js

json: json-inicio json-fim json-aleatorio


# =========================
# Testes CSV
# =========================

csv-inicio:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/csv/teste-inicio-fim.js

csv-fim:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/csv/teste-fim-inicio.js

csv-aleatorio:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/csv/teste-aleatorio.js

csv: csv-inicio csv-fim csv-aleatorio


# =========================
# Testes TXT
# =========================

txt-inicio:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/txt/teste-inicio-fim.js

txt-fim:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/txt/teste-fim-inicio.js

txt-aleatorio:
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/txt/teste-aleatorio.js

txt: txt-inicio txt-fim txt-aleatorio

# =========================
# Todos os testes
# =========================

all: users-local json csv txt


# =========================
# 9 cenários em paralelo
# =========================

parallel: up
	$(MAKE) users-local
	$(COMPOSE) run --rm k6 run \
		--out influxdb=http://influxdb:8086/k6 \
		/scripts/teste-paralelo.js

# =========================
# Limpeza
# =========================

clean:
	$(COMPOSE) down

clean-all:
	$(COMPOSE) down -v
