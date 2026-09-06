import http from 'k6/http';
import { check, sleep } from 'k6';

// ============================================================
// Configuração
// ============================================================

const BASE_URL = 'https://serverest.dev';

const JSON_FILE = '/data/users.json';
const CSV_FILE = '/data/users.csv';
const TXT_FILE = '/data/users.txt';

// ============================================================
// Carregamento das massas
// ============================================================

// JSON
const jsonData = JSON.parse(open(JSON_FILE));
const jsonUsers = jsonData.usuarios;

// CSV
const csvLines = open(CSV_FILE)
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

const csvIds = csvLines
  .slice(1) // remove cabeçalho
  .map(line => line.split(',').pop().trim());

// TXT
const txtIds = open(TXT_FILE)
  .split('\n')
  .map(id => id.trim())
  .filter(id => id.length > 0);

// ============================================================
// Cenários
// ============================================================

export const options = {
  scenarios: {

    // --------------------------------------------------------
    // JSON
    // --------------------------------------------------------

    json_inicio_fim: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: jsonUsers.length,
      exec: 'jsonInicioFim',
      startTime: '0s',
    },

    json_fim_inicio: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: jsonUsers.length,
      exec: 'jsonFimInicio',
      startTime: '0s',
    },

    json_aleatorio: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 10,
      exec: 'jsonAleatorio',
      startTime: '0s',
    },

    // --------------------------------------------------------
    // CSV
    // --------------------------------------------------------

    csv_inicio_fim: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: csvIds.length,
      exec: 'csvInicioFim',
      startTime: '0s',
    },

    csv_fim_inicio: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: csvIds.length,
      exec: 'csvFimInicio',
      startTime: '0s',
    },

    csv_aleatorio: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 10,
      exec: 'csvAleatorio',
      startTime: '0s',
    },

    // --------------------------------------------------------
    // TXT
    // --------------------------------------------------------

    txt_inicio_fim: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: txtIds.length,
      exec: 'txtInicioFim',
      startTime: '0s',
    },

    txt_fim_inicio: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: txtIds.length,
      exec: 'txtFimInicio',
      startTime: '0s',
    },

    txt_aleatorio: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 10,
      exec: 'txtAleatorio',
      startTime: '0s',
    },
  },
};

// ============================================================
// Função auxiliar
// ============================================================

function consultarUsuario(id) {
  const response = http.get(`${BASE_URL}/usuarios/${id}`);

  check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta possui conteúdo': (r) =>
      r.body && r.body.length > 0,
  });

  sleep(1);
}

// ============================================================
// JSON — início → fim
// ============================================================

export function jsonInicioFim() {
  const user = jsonUsers[__ITER];
  const id = user._id;

  consultarUsuario(id);
}

// ============================================================
// JSON — fim → início
// ============================================================

export function jsonFimInicio() {
  const index = jsonUsers.length - 1 - __ITER;
  const user = jsonUsers[index];
  const id = user._id;

  consultarUsuario(id);
}

// ============================================================
// JSON — aleatório
// ============================================================

export function jsonAleatorio() {
  const user =
    jsonUsers[Math.floor(Math.random() * jsonUsers.length)];

  consultarUsuario(user._id);
}

// ============================================================
// CSV — início → fim
// ============================================================

export function csvInicioFim() {
  const id = csvIds[__ITER];

  consultarUsuario(id);
}

// ============================================================
// CSV — fim → início
// ============================================================

export function csvFimInicio() {
  const index = csvIds.length - 1 - __ITER;
  const id = csvIds[index];

  consultarUsuario(id);
}

// ============================================================
// CSV — aleatório
// ============================================================

export function csvAleatorio() {
  const id =
    csvIds[Math.floor(Math.random() * csvIds.length)];

  consultarUsuario(id);
}

// ============================================================
// TXT — início → fim
// ============================================================

export function txtInicioFim() {
  const id = txtIds[__ITER];

  consultarUsuario(id);
}

// ============================================================
// TXT — fim → início
// ============================================================

export function txtFimInicio() {
  const index = txtIds.length - 1 - __ITER;
  const id = txtIds[index];

  consultarUsuario(id);
}

// ============================================================
// TXT — aleatório
// ============================================================

export function txtAleatorio() {
  const id =
    txtIds[Math.floor(Math.random() * txtIds.length)];

  consultarUsuario(id);
}
