#!/bin/bash

set -e

URL="https://serverest.dev/usuarios"
JSON_OUTPUT="users.json"
CSV_OUTPUT="users.csv"

echo "Buscando usuários..."

curl --fail --silent --show-error "$URL" \
  --output "$JSON_OUTPUT"

echo "Usuários salvos em: $JSON_OUTPUT"

echo "Convertendo para CSV..."

jq -r '
  .usuarios[] |
  [
    ._id,
    .nome,
    .email,
    .password,
    .administrador
  ] |
  @csv
' "$JSON_OUTPUT" | sed 's/"//g' > "$CSV_OUTPUT"

echo "CSV salvo em: $CSV_OUTPUT"
