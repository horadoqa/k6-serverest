# Validações

```bash
curl -s -u admin:admin \
  http://localhost:3000/api/dashboards/uid/k6-load-test | jq '.dashboard | {
    uid,
    title,
    panels: [.panels[] | {
      id,
      title,
      targets: [.targets[] | {
        refId,
        rawQuery,
        resultFormat,
        query
      }]
    }]
  }'
```

Retorna

```json
{
  "uid": "k6-load-test",
  "title": "k6 Load Test",
  "panels": [
    {
      "id": 1,
      "title": "HTTP Request Duration - P95",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT percentile(\"value\", 95) FROM \"http_req_duration\" WHERE $timeFilter GROUP BY time($__interval), \"scenario\" fill(null)"
        }
      ]
    },
    {
      "id": 2,
      "title": "HTTP Request Duration - Média",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT mean(\"value\") FROM \"http_req_duration\" WHERE $timeFilter GROUP BY time($__interval), \"scenario\" fill(null)"
        }
      ]
    },
    {
      "id": 3,
      "title": "Requisições por Segundo",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT count(\"value\") FROM \"http_reqs\" WHERE $timeFilter GROUP BY time(1s), \"scenario\" fill(0)"
        }
      ]
    },
    {
      "id": 4,
      "title": "Total de Requisições",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT sum(\"value\") FROM \"http_reqs\" WHERE $timeFilter"
        }
      ]
    },
    {
      "id": 5,
      "title": "Tempo de Espera - http_req_waiting",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT mean(\"value\") FROM \"http_req_waiting\" WHERE $timeFilter GROUP BY time($__interval), \"scenario\" fill(null)"
        }
      ]
    },
    {
      "id": 6,
      "title": "Taxa de Falha",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT mean(\"value\") * 100 FROM \"http_req_failed\" WHERE $timeFilter GROUP BY time($__interval), \"scenario\" fill(null)"
        }
      ]
    },
    {
      "id": 7,
      "title": "Requisições por Cenário",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT count(\"value\") FROM \"http_reqs\" WHERE $timeFilter GROUP BY time($__interval), \"scenario\" fill(0)"
        }
      ]
    },
    {
      "id": 8,
      "title": "VUs Ativos",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT mean(\"value\") FROM \"vus\" WHERE $timeFilter GROUP BY time($__interval) fill(null)"
        }
      ]
    },
    {
      "id": 9,
      "title": "Requests com Falha",
      "targets": [
        {
          "refId": "A",
          "rawQuery": true,
          "resultFormat": "time_series",
          "query": "SELECT sum(\"value\") FROM \"http_req_failed\" WHERE $timeFilter"
        }
      ]
    }
  ]
}
```
