#!/bin/bash

URL="https://serverest.dev/usuarios"
ARQUIVO="ids.txt"

curl -s "$URL" | jq -r '.usuarios[]."_id"' > "$ARQUIVO"

echo "IDs salvos em $ARQUIVO"
