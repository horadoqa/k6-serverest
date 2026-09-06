// k6 — IDs variados aleatoriamente

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://serverest.dev';
const IDS_FILE = '../../data/ids.txt';
// Para o Docker, use o caminho absoluto do arquivo de IDs
// const IDS_FILE = '/data/ids.txt';

const ids = open(IDS_FILE)
  .split('\n')
  .map(id => id.trim())
  .filter(id => id.length > 0);

export const options = {
  vus: 1,
  iterations: 100,
};

export default function () {
  // Escolhe um ID aleatório a cada iteração
  const id = ids[Math.floor(Math.random() * ids.length)];

  const response = http.get(`${BASE_URL}/usuarios/${id}`);

  check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta possui conteúdo': (r) => r.body && r.body.length > 0,
  });
  
  sleep(1);

}
