// k6 — Percorrer IDs do fim para o início

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://serverest.dev';
const USERS_FILE = '../../data/users.csv';
// Para o Docker, use o caminho absoluto do arquivo:
// const USERS_FILE = '/data/users.csv';

// Lê o arquivo CSV e extrai apenas os IDs
const lines = open(USERS_FILE)
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

// Remove o cabeçalho e pega o último campo (_id)
const ids = lines
  .slice(1)
  .map(line => line.split(',').pop().trim())
  .reverse();

export const options = {
  vus: 1,
  iterations: ids.length,
};

export default function () {
  const id = ids[__ITER];

  const response = http.get(`${BASE_URL}/usuarios/${id}`);

  check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta possui conteúdo': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}

// k6 run ./scripts/csv/teste-fim-inicio.js