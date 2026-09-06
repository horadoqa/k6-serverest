// k6 — Percorrer IDs do fim para o início

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://serverest.dev';
const USERS_FILE = '../../data/users.json';
// Para o Docker, use o caminho absoluto do arquivo:
// const USERS_FILE = '/data/user.json';

// Lê o arquivo JSON e transforma em um array de usuários
const data = JSON.parse(open(USERS_FILE));
const users = data.usuarios.reverse();

export const options = {
  vus: 1,
  iterations: users.length,
};

export default function () {
  const user = users[__ITER];
  const id = user._id;

  const response = http.get(`${BASE_URL}/usuarios/${id}`);

  check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta possui conteúdo': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}

// k6 run ./scripts/json/teste-fim-inicio.js
