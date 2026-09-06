// k6 — Percorrer IDs do fim para o início

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://serverest.dev';
const IDS_FILE = '../../data/users.txt';
// Para o Docker, use o caminho absoluto do arquivo de IDs
// const IDS_FILE = '/data/ids.txt';

// Lê o arquivo e transforma cada linha em um ID
const ids = open(IDS_FILE)
  .split('\n')
  .map(id => id.trim())
  .filter(id => id.length > 0)
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
