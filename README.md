# Teste de Performance com k6 — ServeRest

Projeto de testes de performance utilizando **k6** para realizar requisições na API do [ServeRest](<https://serverest.dev>).

O projeto permite testar diferentes estratégias de acesso aos usuários da API:

- Percorrer usuários do primeiro ao último.
- Percorrer usuários do último ao primeiro.
- Acessar usuários aleatoriamente.
- Utilizar diferentes formatos de massa: **JSON, CSV e TXT**.
- Executar os 9 cenários individualmente.
- Executar todos os 9 cenários simultaneamente através de um único teste k6.
- Enviar as métricas para **InfluxDB**.
- Visualizar os resultados através do **Grafana**.
- Utilizar o `Makefile` para automatizar a execução.

---

## Estrutura do projeto

```
.
├── Makefile
├── README.md
├── data
│   ├── buscar-usuarios.sh
│   ├── users.csv
│   ├── users.json
│   └── users.txt
├── docker-compose.yml
├── grafana
│   └── provisioning
│       ├── dashboards
│       │   ├── dashboard.yml
│       │   └── k6-dashboard.json
│       └── datasources
│           └── influxdb.yml
└── scripts
    ├── csv
    │   ├── teste-aleatorio.js
    │   ├── teste-fim-inicio.js
    │   └── teste-inicio-fim.js
    ├── json
    │   ├── teste-aleatorio.js
    │   ├── teste-fim-inicio.js
    │   └── teste-inicio-fim.js
    ├── teste-paralelo.js
    └── txt
        ├── shuffle.js
        ├── teste-aleatorio.js
        ├── teste-fim-inicio.js
        └── teste-inicio-fim.js
```

### Organização

A estrutura foi separada em duas responsabilidades:

```
data/
└── Massa de dados

scripts/
└── Scripts de teste k6
```

 A pasta `data` contém os arquivos utilizados pelos testes:

```
data/
├── users.json
├── users.csv
└── users.txt
```

O diretório `scripts` contém os cenários de performance.

---

# Pré-requisitos

Para executar o projeto localmente, é necessário ter:

- Docker
- Docker Compose
- Bash
- curl
- jq
- GNU Make

O k6 não precisa estar instalado no host quando os testes forem executados pelo Docker.

## Verificar instalação

```bash
docker --version
docker compose version
curl --version
jq --version
make --version
```

Caso queira executar os testes k6 diretamente no host, também será necessário:

```
k6 version
```

---

# Massa de dados

A massa de dados é obtida diretamente da API:

```
https://serverest.dev/usuarios
```

O script responsável pela geração é:

```
data/buscar-usuarios.sh
```

Esse script consulta a API e gera três formatos de arquivo:

```text
data/users.json
data/users.csv
data/users.txt
```

## JSON

O arquivo `users.json` mantém a estrutura retornada pela API:

```json
{
  "usuarios": [
    {
      "nome": "Fulano da Silva",
      "email": "fulano@qa.com",
      "password": "teste",
      "administrador": "true",
      "_id": "0uxuPY0cbmQhpEz1"
    }
  ]
}
```

## CSV

O arquivo `users.csv` contém os dados dos usuários sem aspas:

```
nome,email,password,administrador,_id
Fulano da Silva,fulano@qa.com,teste,true,0uxuPY0cbmQhpEz1
QA Automation,qa.automation@teste.com,Senha@123,false,BP69Hi1rxvTAUzvR
```

 ## TXT

O arquivo `users.txt` contém somente os IDs, um por linha:

```
0uxuPY0cbmQhpEz1
BP69Hi1rxvTAUzvR
EZbyiaqpEsEeY7zZ
OCYAn0HsuX27RPrs
```

Esse formato é utilizado pelos cenários TXT.

---

# Atualizando a massa

A atualização da massa pode ser feita através do Makefile:

```
make users-local
```

O comando executa:

```
DATA_DIR=./data ./data/buscar-usuarios.sh
```

 Ao finalizar, os arquivos serão atualizados:

```
data/
├── users.csv
├── users.json
└── users.txt
```

 Sempre que `make all` ou `make parallel` for executado, a massa será atualizada antes dos testes.

---

# Cenários de teste

Existem três estratégias de acesso:

```
1. Início → fim
2. Fim → início
3. Aleatório
```

Cada estratégia é implementada para os três formatos de massa:

```
             JSON        CSV        TXT

Início       cenário     cenário    cenário
Fim          cenário     cenário    cenário
Aleatório    cenário     cenário    cenário
```

No total são **9 cenários**.

---

# 1\. JSON — início → fim

 Arquivo:

```
scripts/json/teste-inicio-fim.js
```

Esse cenário carrega o `users.json` e percorre os usuários na ordem original.

```
Usuário 001
    ↓
Usuário 002
    ↓
Usuário 003
    ↓
...
Usuário N
```

Execução:

```
make json-inicio
```

---

# 2\. JSON — fim → início

 Arquivo:

```
scripts/json/teste-fim-inicio.js
```

 O cenário percorre os usuários na ordem inversa.

```
Usuário N
    ↓
Usuário N-1
    ↓
Usuário N-2
    ↓
...
Usuário 001
```

 Execução:

```
make json-fim
```

---

# 3\. JSON — aleatório

Arquivo:

```
scripts/json/teste-aleatorio.js
```

 A cada iteração, um usuário é escolhido aleatoriamente.

 Exemplo:

```
Usuário 003
Usuário 001
Usuário 005
Usuário 002
Usuário 002
Usuário 004
Usuário 001
...
```

 Os usuários podem ser repetidos.

 Execução:

```
make json-aleatorio
```

---

# 4\. CSV — início → fim

 Arquivo:

```
scripts/csv/teste-inicio-fim.js
```

Lê o `users.csv` e percorre os IDs do primeiro ao último.

Execução:

```
make csv-inicio
```

---

# 5\. CSV — fim → início

Arquivo:

```
scripts/csv/teste-fim-inicio.js
```

Lê o `users.csv` e percorre os IDs do último ao primeiro.

Execução:

```
make csv-fim
```

---

# 6\. CSV — aleatório

Arquivo:

```
scripts/csv/teste-aleatorio.js
```

Seleciona um usuário aleatoriamente a cada iteração.

Execução:

```
make csv-aleatorio
```

---

# 7\. TXT — início → fim

Arquivo:

```
scripts/txt/teste-inicio-fim.js
```

 Lê o `users.txt` e percorre os IDs na ordem original.

 Execução:

```
make txt-inicio
```

---

# 8\. TXT — fim → início

Arquivo:

```
scripts/txt/teste-fim-inicio.js
```

Lê o `users.txt` e percorre os IDs na ordem inversa.

Execução:

```
make txt-fim
```

---

# 9\. TXT — aleatório

Arquivo:

```
scripts/txt/teste-aleatorio.js
```

Seleciona aleatoriamente um ID do arquivo `users.txt`.

Execução:

```
make txt-aleatorio
```

---

# Executando grupos de testes

Além dos cenários individuais, o Makefile possui agrupadores.

## Todos os cenários JSON

```
make json
```

Executa:

```
json-inicio
json-fim
json-aleatorio
```

Os cenários são executados sequencialmente.

---

 ## Todos os cenários CSV

```
make csv
```

Executa:

```
csv-inicio
csv-fim
csv-aleatorio
```

---

## Todos os cenários TXT

```
make txt
```

Executa:

```
txt-inicio
txt-fim
txt-aleatorio
```

---

# Executando todos os testes sequencialmente

O target `all` atualiza a massa antes de iniciar os testes:

```
make all
```

Fluxo:

```
make all
   │
   ▼
Atualiza usuários
   │
   ├── users.json
   ├── users.csv
   └── users.txt
   │
   ▼
Testes JSON
   │
   ├── início → fim
   ├── fim → início
   └── aleatório
   │
   ▼
Testes CSV
   │
   ├── início → fim
   ├── fim → início
   └── aleatório
   │
   ▼
Testes TXT
   │
   ├── início → fim
   ├── fim → início
   └── aleatório
```

Nesse modo, os 9 cenários são executados **um após o outro**.

---

# Executando os 9 cenários simultaneamente

Para executar os nove cenários ao mesmo tempo, o projeto possui:

```
scripts/teste-paralelo.js
```

Esse arquivo utiliza o recurso `scenarios` do k6.

Cada cenário possui sua própria função:

```
json_inicio_fim
json_fim_inicio
json_aleatorio

csv_inicio_fim
csv_fim_inicio
csv_aleatorio

txt_inicio_fim
txt_fim_inicio
txt_aleatorio
```

Todos os cenários são iniciados com:

```
startTime: '0s'
```

Isso permite que os nove testes sejam executados simultaneamente dentro do mesmo processo k6.

## Execução

```
make parallel
```

O fluxo é:

```
                 make parallel
                       │
                       ▼
                Atualiza a massa
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
        users.json users.csv users.txt
                       │
                       ▼
              teste-paralelo.js
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
       JSON           CSV            TXT
        │              │              │
     ┌──┼──┐        ┌──┼──┐        ┌──┼──┐
     ▼  ▼  ▼        ▼  ▼  ▼        ▼  ▼  ▼
    I→F F→I Rand   I→F F→I Rand   I→F F→I Rand
```

Dessa forma, os nove cenários ficam concorrentes e podem ser analisados simultaneamente.

---

# Makefile

O `Makefile` é o ponto de entrada principal do projeto.

## Massa de dados

```
make users-local
```

Atualiza:

```
data/users.json
data/users.csv
data/users.txt
```

---

## Infraestrutura

Subir os containers:

```
make up
```

Subir reconstruindo as imagens:

```
make up-build
```

Parar os containers:

```
make down
```

Reiniciar:

```
make restart
```

Ver status:

```
make ps
```

---

## Logs

Todos os serviços:

```
make logs
```

Grafana:

```
make logs-grafana
```

InfluxDB:

```
make logs-influxdb
```

k6:

```
make logs-k6
```

---

# Comandos dos testes

## JSON

```
make json-inicio
make json-fim
make json-aleatorio
make json
```

## CSV

```
make csv-inicio
make csv-fim
make csv-aleatorio
make csv
```

## TXT

```
make txt-inicio
make txt-fim
make txt-aleatorio
make txt
```

## Todos os testes sequenciais

```
make all
```

## Todos os testes simultâneos

```
make parallel
```

---

# Docker Compose

Os testes são executados através do Docker Compose.

O serviço k6 utiliza os scripts montados em:

```
/scripts
```

e os arquivos de massa montados em:

```
/data
```

A relação entre host e container é:

```
Host                    Container

./scripts       ──────► /scripts
./data          ──────► /data
```

Assim, por exemplo:

```
./data/users.json
```

fica disponível para o k6 como:

```
/data/users.json
```

 E:

```
./scripts/teste-paralelo.js
```

 fica disponível como:

```
/scripts/teste-paralelo.js
```

---

# InfluxDB e Grafana

A infraestrutura utiliza:

```
k6
 │
 │ métricas
 ▼
InfluxDB
 │
 │ consultas
 ▼
Grafana
```

O InfluxDB armazena as métricas produzidas pelo k6.

O Grafana permite visualizar e analisar:

- Tempo de resposta.
- Throughput.
- Requisições.
- Taxa de erros.
- Checks.
- Percentis.
- Duração das requisições.
- Comparação entre cenários.

---

# Subindo a infraestrutura

Para iniciar os serviços:

```
make up
```

Verifique:

```
make ps
```

Os principais serviços são:

```
k6
influxdb
grafana
```

O Grafana fica disponível em:

```
http://localhost:3000
```

 O InfluxDB fica disponível em:

```
http://localhost:8086
```

---

 # Fluxo recomendado

 Para executar uma bateria completa de testes:

```
make parallel
```

Esse comando é o fluxo recomendado para os testes concorrentes.

Internamente:

```
1. Consulta a API ServeRest
2. Gera users.json
3. Gera users.csv
4. Gera users.txt
5. Inicia o k6
6. Executa os 9 cenários simultaneamente
7. Envia as métricas para o InfluxDB
8. Permite análise no Grafana
```

---

 # Diferença entre `all` e `parallel`

 ## `make all`

 Executa os testes **sequencialmente**:

```
Massa
  ↓
JSON
  ↓
CSV
  ↓
TXT
```

 É útil para analisar cada grupo de testes de forma isolada.

## `make parallel`

Executa os nove cenários **simultaneamente**:

```
                    k6
                     │
       ┌─────────────┼─────────────┐
       │             │             │
      JSON          CSV           TXT
       │             │             │
    ┌──┼──┐       ┌──┼──┐       ┌──┼──┐
    │  │  │       │  │  │       │  │  │
   I→F F→I R     I→F F→I R     I→F F→I R
```

Esse modo é indicado para observar o comportamento da API quando diferentes padrões de acesso acontecem simultaneamente.

---

 # Limpeza

Parar e remover os containers:

```
make clean
```

Remover também os volumes:

```
make clean-all
```

> `clean-all` remove os volumes do Docker e, consequentemente, os dados persistidos pelo InfluxDB e Grafana.

---

# Resumo dos comandos

| Comando | Descrição |
| --- | --- |
| `make up` | Inicia a infraestrutura |
| `make down` | Para a infraestrutura |
| `make restart` | Reinicia os serviços |
| `make ps` | Exibe o status dos containers |
| `make users-local` | Atualiza a massa de usuários |
| `make json` | Executa os 3 cenários JSON |
| `make csv` | Executa os 3 cenários CSV |
| `make txt` | Executa os 3 cenários TXT |
| `make all` | Atualiza a massa e executa os 9 testes sequencialmente |
| `make parallel` | Atualiza a massa e executa os 9 cenários simultaneamente |
| `make logs` | Exibe os logs |
| `make logs-grafana` | Exibe os logs do Grafana |
| `make logs-influxdb` | Exibe os logs do InfluxDB |
| `make clean` | Remove os containers |
| `make clean-all` | Remove containers e volumes |

---

# Fluxo rápido

Para iniciar o ambiente:

```
make up
```

Para executar os 9 cenários simultaneamente:

```
make parallel
```

Depois, acesse:

```
http://localhost:3000
```

para analisar as métricas no Grafana.

Para encerrar:

```
make clean
```
