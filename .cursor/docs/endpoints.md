# Contrato de Endpoints — Backend NTM

> O backend é desenvolvido em repositório separado.
> Este documento é a fonte de verdade para os contratos de API consumidos pelo mobile.
> Arquivo de serviço correspondente indicado em cada seção.

**Base URL**: `https://api.naotomemulta.com.br/v1` (a definir)
**Autenticação**: Bearer token JWT emitido pelo Clerk (`Authorization: Bearer <token>`)

---

## Assinatura

Arquivo de serviço: `src/services/backend/subscriptionApi.ts`

### GET /user/subscription
Retorna o plano atual do usuário autenticado.

**Request**
```
GET /user/subscription
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "plan": "monthly",
  "isActive": true,
  "expiresAt": "2026-03-25T00:00:00.000Z",
  "renewsAt": "2026-03-25T00:00:00.000Z"
}
```

**Response 200 (sem plano)**
```json
{
  "plan": "none",
  "isActive": false,
  "expiresAt": null,
  "renewsAt": null
}
```

**Erros**
- `401` — token inválido ou expirado

---

### POST /subscription/checkout
Inicia uma sessão de checkout para aquisição de plano.

**Request**
```json
{
  "planId": "monthly"
}
```

**Response 200**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_abc123"
}
```

**Erros**
- `400` — planId inválido
- `409` — usuário já possui plano ativo

---

### DELETE /subscription
Cancela o plano ativo do usuário.

**Response 200**
```json
{
  "canceledAt": "2026-02-25T10:00:00.000Z",
  "activeUntil": "2026-03-25T00:00:00.000Z"
}
```

**Erros**
- `404` — usuário não possui plano ativo

---

## Infrações

Arquivo de serviço: `src/services/backend/defesasApi.ts`

### GET /infractions
Lista infrações salvas do usuário autenticado.

**Response 200**
```json
[
  {
    "id": "inf_abc123",
    "aitNumber": "12345678",
    "description": "Excesso de velocidade",
    "analyzedAt": "2026-02-25T10:00:00.000Z",
    "hasInconsistencies": true
  }
]
```

---

### POST /infractions
Salva uma nova infração para análise.

**Request**
```json
{
  "aitNumber": "12345678",
  "renainf": "987654321",
  "infractionCode": "74550",
  "description": "Excesso de velocidade",
  "issuingBodyCode": "0001",
  "issuingBody": "DETRAN-SP",
  "competentBodyCode": "0002",
  "competentBody": "DETRAN-SP",
  "agentId": "",
  "equipmentId": "RADAR-001",
  "equipmentCalibrationDate": "15/01/2025",
  "infractionDate": "20/02/2026",
  "notes": ""
}
```

**Response 201**
```json
{
  "id": "inf_abc123",
  "createdAt": "2026-02-25T10:00:00.000Z"
}
```

---

### GET /infractions/:id
Detalhe de uma infração específica.

**Response 200**
```json
{
  "id": "inf_abc123",
  "aitNumber": "12345678",
  "description": "Excesso de velocidade",
  "analysis": {
    "hasInconsistencies": true,
    "findings": [
      {
        "code": "MISSING_AGENT_ID",
        "title": "Ausência de identificação do agente",
        "severity": "critical"
      }
    ]
  }
}
```

**Erros**
- `404` — infração não encontrada

---

### DELETE /infractions/:id
Remove uma infração do histórico do usuário.

**Response 204** — sem body

**Erros**
- `404` — infração não encontrada

---

### POST /infractions/:id/analyze
Dispara análise server-side de uma infração (futuro).

**Response 200**
```json
{
  "hasInconsistencies": true,
  "findings": [],
  "summary": "..."
}
```

---

## Defesas

Arquivo de serviço: `src/services/backend/defesasApi.ts`

### GET /defesas
Lista defesas geradas pelo usuário.

**Response 200**
```json
[
  {
    "id": "def_abc123",
    "infractionId": "inf_abc123",
    "content": "DEFESA PRÉVIA...",
    "updatedAt": "2026-02-25T10:00:00.000Z"
  }
]
```

---

### POST /defesas
Salva uma defesa gerada localmente no backend.

**Request**
```json
{
  "infractionId": "inf_abc123",
  "content": "DEFESA PRÉVIA...",
  "findings": ["MISSING_AGENT_ID"]
}
```

**Response 201**
```json
{
  "id": "def_abc123",
  "createdAt": "2026-02-25T10:00:00.000Z"
}
```

**Erros**
- `402` — usuário sem plano ativo
- `404` — infração não encontrada

---

### GET /defesas/:id
Detalhe de uma defesa.

**Response 200**
```json
{
  "id": "def_abc123",
  "infractionId": "inf_abc123",
  "content": "DEFESA PRÉVIA...",
  "updatedAt": "2026-02-25T10:00:00.000Z"
}
```

---

### DELETE /defesas/:id
Remove uma defesa.

**Response 204** — sem body

---

## Catálogo de Inconsistências (futuro)

Arquivo de serviço: (a criar) `src/services/backend/catalogApi.ts`

### GET /inconsistency-catalog
Retorna versão server-side do catálogo de inconsistências (para atualizações sem deploy).

**Response 200**
```json
{
  "version": "1.0.0",
  "updatedAt": "2026-02-25T00:00:00.000Z",
  "rules": []
}
```
