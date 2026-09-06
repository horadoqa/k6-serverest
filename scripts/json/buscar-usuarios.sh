#!/bin/bash

set -e

URL="https://serverest.dev/usuarios"
OUTPUT="users.json"

echo "Buscando usuários..."

curl --fail --silent --show-error "$URL" \
  --output "$OUTPUT"

echo "Usuários salvos em: $OUTPUT"
