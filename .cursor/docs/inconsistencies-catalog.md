# Catálogo de Inconsistências — Não Tome Multa

Este documento descreve todas as inconsistências técnicas que o motor de análise pode detectar em autos de infração de trânsito.

**Fonte de verdade no código**: `src/data/inconsistencies/catalog.ts`

---

## Código de Inconsistência: MISSING_AGENT_ID

**Título**: Ausência de identificação do agente ou autoridade de trânsito

**Severidade**: Crítica

**Base Legal**: Art. 280, inciso V do Código de Trânsito Brasileiro (CTB)

**Descrição**:
O auto de infração deve conter obrigatoriamente a identificação do agente de trânsito ou autoridade que o lavrou. A ausência deste dado constitui vício formal que pode fundamentar a nulidade do auto.

**Como é detectado**:
Campo `agentId` vazio ou ausente no formulário da infração.

**Template de defesa associado**: `MISSING_AGENT_ID_DEFENSE`

---

## Código de Inconsistência: MISSING_AIT_NUMBER

**Título**: Número do Auto de Infração de Trânsito (AIT) ausente

**Severidade**: Crítica

**Base Legal**: Art. 280 do CTB; Resolução CONTRAN n° 619/2016

**Descrição**:
O AIT deve possuir número identificador único. A ausência do número impossibilita a rastreabilidade e o exercício do direito de defesa.

**Como é detectado**:
Campo `aitNumber` vazio ou com menos de 3 caracteres.

**Template de defesa associado**: `MISSING_AIT_NUMBER_DEFENSE`

---

## Código de Inconsistência: MISSING_RENAINF

**Título**: Número RENAINF ausente

**Severidade**: Alta

**Base Legal**: Resolução CONTRAN n° 619/2016; Resolução DENATRAN n° 396/2011

**Descrição**:
O Registro Nacional de Infrações (RENAINF) é o número de cadastro da infração no sistema nacional. Sua ausência prejudica a consulta e o exercício do contraditório.

**Como é detectado**:
Campo `renainf` vazio no formulário.

**Template de defesa associado**: `MISSING_RENAINF_DEFENSE`

---

## Código de Inconsistência: MISSING_EQUIPMENT_ID

**Título**: Identificação do equipamento de aferição ausente

**Severidade**: Alta

**Base Legal**: Art. 280, VI do CTB; Resolução CONTRAN n° 396/2011

**Descrição**:
O número de identificação do equipamento utilizado (radar, etilômetro, etc.) deve constar no auto de infração. Sem esta informação, não é possível verificar se o equipamento estava regular.

**Como é detectado**:
Campo `equipmentId` vazio no formulário.

**Template de defesa associado**: `MISSING_EQUIPMENT_ID_DEFENSE`

---

## Código de Inconsistência: EQUIPMENT_CALIBRATION_EXPIRED

**Título**: Equipamento fora do prazo de aferição ou data não informada

**Severidade**: Crítica

**Base Legal**: Resolução CONTRAN n° 396/2011; Portaria INMETRO n° 006/2002

**Descrição**:
Radares devem ser aferidos a cada 12 meses pelo INMETRO. Etilômetros anualmente. Tacógrafo a cada 24 meses. Equipamentos fora do prazo não podem registrar infrações validamente. Multas aplicadas por equipamentos com aferição vencida podem ser anuladas.

**Como é detectado**:
Campo `equipmentCalibrationDate` vazio, ou data calculada como superior a 12 meses antes da data da infração.

**Template de defesa associado**: `EQUIPMENT_CALIBRATION_EXPIRED_DEFENSE`

---

## Código de Inconsistência: MISSING_ISSUING_BODY

**Título**: Órgão autuador não identificado

**Severidade**: Alta

**Base Legal**: Art. 280, I do CTB

**Descrição**:
O auto de infração deve identificar o órgão ou entidade de trânsito que lavrou o auto. A ausência do código e nome do órgão autuador constitui vício formal.

**Como é detectado**:
Campos `issuingBodyCode` e/ou `issuingBody` vazios.

**Template de defesa associado**: `MISSING_ISSUING_BODY_DEFENSE`

---

## Código de Inconsistência: MISSING_COMPETENT_BODY

**Título**: Órgão competente não identificado

**Severidade**: Média

**Base Legal**: Art. 280, I do CTB; Art. 7° do CTB

**Descrição**:
O órgão ou entidade competente para julgamento do recurso deve ser identificado no auto. A ausência dificulta o exercício do direito de defesa e recurso administrativo.

**Como é detectado**:
Campos `competentBodyCode` e/ou `competentBody` vazios.

**Template de defesa associado**: `MISSING_COMPETENT_BODY_DEFENSE`

---

## Código de Inconsistência: INVALID_DATE_FORMAT

**Título**: Data ou hora da infração inválida ou inconsistente

**Severidade**: Média

**Base Legal**: Art. 280, II do CTB

**Descrição**:
A data e a hora da lavratura do auto de infração são elementos essenciais para a validade do ato. Datas inválidas ou inconsistentes constituem vício formal.

**Como é detectado**:
Campo `infractionDate` vazio, com formato inválido (não DD/MM/AAAA), ou com dia/mês impossíveis.

**Template de defesa associado**: `INVALID_DATE_FORMAT_DEFENSE`

---

## Código de Inconsistência: MISSING_INFRACTION_CODE

**Título**: Código da infração (CTB) ausente

**Severidade**: Alta

**Base Legal**: Art. 280, III do CTB

**Descrição**:
O enquadramento da infração deve ser indicado pelo código previsto no CTB ou legislação específica. A ausência do código impede a identificação precisa da infração e prejudica a defesa.

**Como é detectado**:
Campo `infractionCode` vazio no formulário.

**Template de defesa associado**: `MISSING_INFRACTION_CODE_DEFENSE`

---

## Tabela Resumo

| Código | Severidade | Base Legal | Campo Verificado |
|---|---|---|---|
| MISSING_AGENT_ID | Crítica | Art. 280, V CTB | `agentId` |
| MISSING_AIT_NUMBER | Crítica | Art. 280 CTB | `aitNumber` |
| MISSING_RENAINF | Alta | Res. 619/2016 | `renainf` |
| MISSING_EQUIPMENT_ID | Alta | Art. 280, VI CTB | `equipmentId` |
| EQUIPMENT_CALIBRATION_EXPIRED | Crítica | Res. 396/2011 | `equipmentCalibrationDate` |
| MISSING_ISSUING_BODY | Alta | Art. 280, I CTB | `issuingBodyCode` + `issuingBody` |
| MISSING_COMPETENT_BODY | Média | Art. 280, I CTB | `competentBodyCode` + `competentBody` |
| INVALID_DATE_FORMAT | Média | Art. 280, II CTB | `infractionDate` |
| MISSING_INFRACTION_CODE | Alta | Art. 280, III CTB | `infractionCode` |
