import { DefenseTemplate } from './types';

export const DEFENSE_TEMPLATES: DefenseTemplate[] = [
  {
    code: 'MISSING_AGENT_ID_DEFENSE',
    title: 'Defesa — Ausência de identificação do agente autuador',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, portador(a) do CPF n° {{cpf}}, condutor(a) do veículo de placa {{plate}}, vem, tempestivamente e com o devido respeito, apresentar DEFESA PRÉVIA em face do Auto de Infração de Trânsito (AIT) n° {{aitNumber}}, com fundamento no seguinte:

I — DA NULIDADE FORMAL DO AUTO DE INFRAÇÃO

O auto de infração ora impugnado padece de vício formal insanável, consistente na ausência da identificação do agente ou autoridade de trânsito responsável pela lavratura, conforme exigido pelo Art. 280, inciso V, do Código de Trânsito Brasileiro (CTB).

A exigência de identificação do agente não constitui mera formalidade burocrática, mas garantia fundamental do autuado ao contraditório e à ampla defesa, assegurados pelo Art. 5°, inciso LV, da Constituição Federal.

A ausência deste elemento essencial impossibilita:
a) a verificação da competência do agente para lavrar o auto;
b) a aferição da regularidade do ato;
c) o exercício pleno do direito de defesa e recurso.

II — DO PEDIDO

Diante do exposto, requer-se a NULIDADE do presente Auto de Infração de Trânsito, com o consequente arquivamento do processo administrativo, por vício formal expresso na ausência de identificação do agente autuador, nos termos do Art. 280, inciso V, do CTB.

Nestes termos, pede deferimento.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JUNTA ADMINISTRATIVA DE RECURSOS DE INFRAÇÕES — JARI

À Junta Administrativa de Recursos de Infrações — JARI,

O(A) recorrente {{driverName}}, portador(a) do CPF n° {{cpf}}, condutor(a) do veículo de placa {{plate}}, não se conformando com o indeferimento da Defesa Prévia referente ao AIT n° {{aitNumber}}, vem interpor o presente RECURSO, pelos seguintes fundamentos:

I — DA MANUTENÇÃO DO VÍCIO FORMAL

A decisão que indeferiu a Defesa Prévia não sanou o vício formal apontado: a ausência da identificação do agente autuador, exigida pelo Art. 280, V, do CTB.

O auto de infração permanece eivado de nulidade insanável, pois a identificação do agente é elemento essencial do ato administrativo, não podendo ser suprimida ou suprida por qualquer outro meio.

II — DA JURISPRUDÊNCIA APLICÁVEL

Tribunais de Justiça e o Superior Tribunal de Justiça já se manifestaram reiteradamente no sentido de que a ausência dos elementos essenciais do AIT configura nulidade absoluta, insuscetível de convalidação.

III — DO PEDIDO

Requer o provimento do presente recurso para anular o Auto de Infração n° {{aitNumber}}, por vício formal insanável.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'MISSING_AIT_NUMBER_DEFENSE',
    title: 'Defesa — Ausência do número do AIT',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, portador(a) do CPF n° {{cpf}}, condutor(a) do veículo de placa {{plate}}, vem apresentar DEFESA PRÉVIA em face de auto de infração que não apresenta número identificador (AIT), com fundamento no seguinte:

I — DA NULIDADE FORMAL

O auto de infração não apresenta número identificador único (AIT), elemento essencial para a validade do ato administrativo nos termos do Art. 280 do CTB e da Resolução CONTRAN n° 619/2016.

A ausência do número do AIT:
a) impede a individualização da autuação no sistema nacional (RENAINF);
b) inviabiliza a consulta e acompanhamento pelo autuado;
c) viola o princípio da publicidade e transparência dos atos administrativos.

II — DO PEDIDO

Requer-se a NULIDADE do presente auto de infração por ausência de elemento formal essencial.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, veículo placa {{plate}}, reitera os fundamentos da Defesa Prévia anteriormente apresentada quanto à ausência do número do AIT, vício formal que invalida o ato autuador nos termos do Art. 280 do CTB.

Requer o provimento do recurso e o consequente cancelamento da autuação.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'MISSING_RENAINF_DEFENSE',
    title: 'Defesa — Ausência do número RENAINF',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, com fundamento na ausência do número de Registro Nacional de Infrações (RENAINF).

I — DO VÍCIO FORMAL

O RENAINF é o identificador único da infração no sistema nacional de trânsito, cuja ausência viola a Resolução CONTRAN n° 619/2016 e compromete a regularidade do processo administrativo de autuação.

Sem o registro no RENAINF, a infração não pode ser considerada regularmente constituída no sistema nacional, impedindo o exercício pleno do contraditório.

II — DO PEDIDO

Requer-se a nulidade do presente auto de infração por vício formal consistente na ausência do número RENAINF.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, veículo placa {{plate}}, mantém os fundamentos apresentados em Defesa Prévia quanto à ausência do número RENAINF no AIT n° {{aitNumber}}, requerendo o cancelamento da autuação.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'MISSING_EQUIPMENT_ID_DEFENSE',
    title: 'Defesa — Ausência de identificação do equipamento de medição',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, em razão da ausência de identificação do equipamento de aferição utilizado.

I — DO VÍCIO FORMAL

O auto de infração não contém o número de identificação do equipamento utilizado para registro da infração. Esta identificação é elemento obrigatório nos termos do Art. 280, inciso VI, do CTB e da Resolução CONTRAN n° 396/2011.

A ausência da identificação do equipamento impossibilita:
a) a verificação da regularidade e calibração do instrumento;
b) a confirmação de que o equipamento possuía certificação válida do INMETRO;
c) a aferição de que o equipamento estava operando dentro dos parâmetros técnicos exigidos.

Sem esses elementos, não há como garantir a precisão e a confiabilidade da medição que fundamentou a autuação.

II — DO PEDIDO

Requer-se a NULIDADE do AIT n° {{aitNumber}} por vício formal consistente na ausência de identificação do equipamento de aferição, nos termos do Art. 280, VI, do CTB.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, veículo placa {{plate}}, mantém os fundamentos apresentados em Defesa Prévia quanto à ausência de identificação do equipamento de aferição no AIT n° {{aitNumber}}, requerendo o cancelamento da autuação por vício formal insanável.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'EQUIPMENT_CALIBRATION_EXPIRED_DEFENSE',
    title: 'Defesa — Equipamento com aferição vencida ou não informada',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, em razão de irregularidade relacionada à aferição do equipamento de medição utilizado.

I — DA IRREGULARIDADE DO EQUIPAMENTO DE AFERIÇÃO

Nos termos da Resolução CONTRAN n° 396/2011 e da Portaria INMETRO n° 006/2002, os equipamentos utilizados para registro de infrações de trânsito — em especial radares — devem ser submetidos à verificação periódica pelo INMETRO com periodicidade máxima de 12 (doze) meses.

A análise do auto de infração ora impugnado revela que:
a) a data da última aferição do equipamento não foi informada; e/ou
b) há indícios de que o equipamento se encontrava fora do prazo de aferição na data da suposta infração.

Equipamentos fora do prazo de aferição não estão habilitados a registrar infrações com validade legal, na medida em que não há garantia de precisão das leituras realizadas.

II — DA CONSEQUÊNCIA JURÍDICA

Multas aplicadas por equipamentos com aferição vencida ou não certificada são passíveis de nulidade, pois o ato autuador perde seu fundamento técnico e legal.

III — DO PEDIDO

Requer-se a NULIDADE do AIT n° {{aitNumber}}, com o arquivamento do processo, ante a irregularidade do equipamento de aferição utilizado, conforme Resolução CONTRAN n° 396/2011.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, veículo placa {{plate}}, reitera os fundamentos apresentados em Defesa Prévia quanto à irregularidade do equipamento de aferição utilizado no registro da suposta infração objeto do AIT n° {{aitNumber}}.

A manutenção da autuação sem a comprovação da regularidade do equipamento viola a Resolução CONTRAN n° 396/2011 e o princípio da legalidade, razão pela qual se requer o provimento do presente recurso e o cancelamento da multa.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'MISSING_ISSUING_BODY_DEFENSE',
    title: 'Defesa — Órgão autuador não identificado',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, em razão da ausência de identificação do órgão autuador.

I — DO VÍCIO FORMAL

O auto de infração não identifica o órgão ou entidade de trânsito responsável pela autuação, conforme exigido pelo Art. 280, inciso I, do CTB.

A identificação do órgão autuador é elemento essencial para:
a) a verificação da competência para lavratura do auto;
b) o correto direcionamento de eventual defesa ou recurso;
c) a transparência do ato administrativo.

II — DO PEDIDO

Requer-se a NULIDADE do AIT n° {{aitNumber}} por ausência de identificação do órgão autuador, vício formal previsto no Art. 280, I, do CTB.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, mantém os fundamentos apresentados em Defesa Prévia quanto à ausência de identificação do órgão autuador no AIT n° {{aitNumber}}, requerendo o cancelamento da autuação.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'MISSING_COMPETENT_BODY_DEFENSE',
    title: 'Defesa — Órgão competente para julgamento não identificado',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, em razão da ausência de identificação do órgão competente para processamento e julgamento.

I — DO VÍCIO FORMAL

O auto de infração não identifica o órgão ou entidade de trânsito competente para processar e julgar o feito, nos termos do Art. 280, inciso I, e Art. 7° do CTB. Esta ausência compromete o exercício do direito de defesa e recurso pelo autuado.

II — DO PEDIDO

Requer-se o reconhecimento do vício formal e a nulidade do AIT n° {{aitNumber}}.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, mantém os fundamentos apresentados em Defesa Prévia quanto à ausência de identificação do órgão competente no AIT n° {{aitNumber}}.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'INVALID_DATE_FORMAT_DEFENSE',
    title: 'Defesa — Data ou hora da infração inválida ou ausente',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, em razão de vício formal relacionado à data e hora da infração.

I — DO VÍCIO FORMAL

A data e hora da lavratura do auto de infração são elementos essenciais do ato autuador, conforme Art. 280, inciso II, do CTB. O auto ora impugnado apresenta data ausente, inválida ou em formato inconsistente, o que invalida o ato.

A data da infração é indispensável para:
a) verificação da prescrição do direito de autuação;
b) confronto com registros e documentos do autuado;
c) validade temporal do ato administrativo.

II — DO PEDIDO

Requer-se a NULIDADE do AIT n° {{aitNumber}} por vício formal consistente em data inválida ou ausente, nos termos do Art. 280, II, do CTB.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, mantém os fundamentos da Defesa Prévia quanto ao vício formal de data inválida ou ausente no AIT n° {{aitNumber}}, requerendo o cancelamento da autuação.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },

  {
    code: 'MISSING_INFRACTION_CODE_DEFENSE',
    title: 'Defesa — Código da infração (CTB) ausente',
    defesaPreviaText: `DEFESA PRÉVIA

Ao(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,

O(A) autuado(a) {{driverName}}, CPF n° {{cpf}}, condutor(a) do veículo placa {{plate}}, vem apresentar DEFESA PRÉVIA em face do AIT n° {{aitNumber}}, em razão da ausência do código de enquadramento da infração.

I — DO VÍCIO FORMAL

O enquadramento da infração pelo código previsto no CTB ou legislação específica é elemento essencial do auto de infração, nos termos do Art. 280, inciso III, do CTB. Sua ausência impede a identificação precisa da infração imputada e a correspondente dosimetria da penalidade.

A ausência do código:
a) inviabiliza a identificação da natureza e gravidade da infração;
b) impossibilita a aferição da penalidade aplicável;
c) viola o princípio da legalidade e da tipicidade administrativa.

II — DO PEDIDO

Requer-se a NULIDADE do AIT n° {{aitNumber}} por ausência do código de enquadramento da infração, vício formal insanável previsto no Art. 280, III, do CTB.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,

    recursoJARIText: `RECURSO À JARI

O(A) recorrente {{driverName}}, CPF n° {{cpf}}, mantém os fundamentos apresentados em Defesa Prévia quanto à ausência do código de infração no AIT n° {{aitNumber}}, requerendo o cancelamento da autuação por vício formal insanável.

{{city}}, {{date}}.

{{driverName}}
CPF: {{cpf}}`,
  },
];

export function getTemplateByCode(code: string): DefenseTemplate | undefined {
  return DEFENSE_TEMPLATES.find((t) => t.code === code);
}
