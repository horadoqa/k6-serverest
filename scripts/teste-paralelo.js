import http from 'k6/http';
import { check } from 'k6';

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
// Configuração de carga
//
// 1 minuto  -> 100 req/s
// 4 minutos -> 500 req/s
// 30 segundos -> 0 req/s
// ============================================================

const START_RPS = 1;
const TARGET_RPS = 1;

export const options = {
  scenarios: {

    // --------------------------------------------------------
    // JSON
    // --------------------------------------------------------

    json_inicio_fim: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'jsonInicioFim',
    },

    json_fim_inicio: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'jsonFimInicio',
    },

    json_aleatorio: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'jsonAleatorio',
    },

    // --------------------------------------------------------
    // CSV
    // --------------------------------------------------------

    csv_inicio_fim: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'csvInicioFim',
    },

    csv_fim_inicio: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'csvFimInicio',
    },

    csv_aleatorio: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'csvAleatorio',
    },

    // --------------------------------------------------------
    // TXT
    // --------------------------------------------------------

    txt_inicio_fim: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'txtInicioFim',
    },

    txt_fim_inicio: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'txtFimInicio',
    },

    txt_aleatorio: {
      executor: 'ramping-arrival-rate',

      startRate: START_RPS,
      timeUnit: '1s',

      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: '1m', target: START_RPS },
        { duration: '4m', target: TARGET_RPS },
        { duration: '30s', target: 0 },
      ],

      exec: 'txtAleatorio',
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
}


// ============================================================
// Função para obter índice global aproximado
//
// __ITER é o número da iteração daquele VU.
// __VU identifica o VU.
//
// Para os testes de sequência, usamos uma combinação dos
// dois para evitar que cada VU fique sempre no mesmo registro.
// ============================================================

function indiceMassa(tamanho) {
  return ((__VU - 1) + (__ITER * 1000)) % tamanho;
}


// ============================================================
// JSON — início → fim
// ============================================================

export function jsonInicioFim() {
  const index = indiceMassa(jsonUsers.length);

  const user = jsonUsers[index];

  consultarUsuario(user._id);
}


// ============================================================
// JSON — fim → início
// ============================================================

export function jsonFimInicio() {
  const index = indiceMassa(jsonUsers.length);

  const reverseIndex = jsonUsers.length - 1 - index;

  const user = jsonUsers[reverseIndex];

  consultarUsuario(user._id);
}


// ============================================================
// JSON — aleatório
// ============================================================

export function jsonAleatorio() {
  const index = Math.floor(Math.random() * jsonUsers.length);

  consultarUsuario(jsonUsers[index]._id);
}


// ============================================================
// CSV — início → fim
// ============================================================

export function csvInicioFim() {
  const index = indiceMassa(csvIds.length);

  consultarUsuario(csvIds[index]);
}


// ============================================================
// CSV — fim → início
// ============================================================

export function csvFimInicio() {
  const index = indiceMassa(csvIds.length);

  const reverseIndex = csvIds.length - 1 - index;

  consultarUsuario(csvIds[reverseIndex]);
}


// ============================================================
// CSV — aleatório
// ============================================================

export function csvAleatorio() {
  const index = Math.floor(Math.random() * csvIds.length);

  consultarUsuario(csvIds[index]);
}


// ============================================================
// TXT — início → fim
// ============================================================

export function txtInicioFim() {
  const index = indiceMassa(txtIds.length);

  consultarUsuario(txtIds[index]);
}


// ============================================================
// TXT — fim → início
// ============================================================

export function txtFimInicio() {
  const index = indiceMassa(txtIds.length);

  const reverseIndex = txtIds.length - 1 - index;

  consultarUsuario(txtIds[reverseIndex]);
}


// ============================================================
// TXT — aleatório
// ============================================================

export function txtAleatorio() {
  const index = Math.floor(Math.random() * txtIds.length);

  consultarUsuario(txtIds[index]);
}
