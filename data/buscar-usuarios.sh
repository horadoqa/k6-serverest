#!/bin/bash

set -e

URL="https://serverest.dev/usuarios"

DATA_DIR="${DATA_DIR:-./data}"

JSON_OUTPUT="$DATA_DIR/users.json"
CSV_OUTPUT="$DATA_DIR/users.csv"
TXT_OUTPUT="$DATA_DIR/users.txt"

echo "========================================"
echo "Buscando usuários..."
echo "========================================"
echo "Diretório: $DATA_DIR"
echo "========================================"

mkdir -p "$DATA_DIR"

curl --fail --silent --show-error "$URL" \
  --output "$JSON_OUTPUT"

echo "Usuários salvos em: $JSON_OUTPUT"

echo "Convertendo para CSV..."

jq -r '
  .usuarios[] |
  [
    .nome,
    .email,
    .password,
    .administrador,
    ._id
  ] |
  @csv
' "$JSON_OUTPUT" | sed 's/"//g' > "$CSV_OUTPUT"

echo "CSV salvo em: $CSV_OUTPUT"

echo "Gerando arquivo TXT com os IDs..."

jq -r '.usuarios[]._id' "$JSON_OUTPUT" > "$TXT_OUTPUT"

echo "TXT salvo em: $TXT_OUTPUT"

echo "========================================"
echo "Arquivos gerados:"
echo "  $JSON_OUTPUT"
echo "  $CSV_OUTPUT"
echo "  $TXT_OUTPUT"
echo "========================================"
