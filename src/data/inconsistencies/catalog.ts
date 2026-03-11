import { InconsistencyRule } from './types';

export const INCONSISTENCY_CATALOG: InconsistencyRule[] = [
  {
    code: 'MISSING_AGENT_ID',
    title: 'Ausência de identificação do agente ou autoridade de trânsito',
    description:
      'O auto de infração não contém a identificação do agente ou autoridade de trânsito. Este dado é obrigatório para a validade do ato autuador.',
    severity: 'critical',
    legalBasis: 'Art. 280, inciso V do Código de Trânsito Brasileiro (CTB)',
    defenseTemplateCode: 'MISSING_AGENT_ID_DEFENSE',
  },
  {
    code: 'MISSING_AIT_NUMBER',
    title: 'Número do Auto de Infração de Trânsito (AIT) ausente',
    description:
      'O AIT não apresenta número identificador único. A ausência impossibilita a rastreabilidade e o exercício pleno do direito de defesa.',
    severity: 'critical',
    legalBasis: 'Art. 280 do CTB; Resolução CONTRAN n° 619/2016',
    defenseTemplateCode: 'MISSING_AIT_NUMBER_DEFENSE',
  },
  {
    code: 'MISSING_RENAINF',
    title: 'Número de Registro Nacional de Infrações (RENAINF) ausente',
    description:
      'O número de cadastro da infração no sistema nacional (RENAINF) está ausente, prejudicando a consulta e o exercício do contraditório.',
    severity: 'high',
    legalBasis: 'Resolução CONTRAN n° 619/2016',
    defenseTemplateCode: 'MISSING_RENAINF_DEFENSE',
  },
  {
    code: 'MISSING_EQUIPMENT_ID',
    title: 'Identificação do equipamento de aferição ausente',
    description:
      'O número de identificação do equipamento utilizado (radar, etilômetro ou similar) não consta no auto de infração, impedindo a verificação da regularidade do instrumento.',
    severity: 'high',
    legalBasis: 'Art. 280, inciso VI do CTB; Resolução CONTRAN n° 396/2011',
    defenseTemplateCode: 'MISSING_EQUIPMENT_ID_DEFENSE',
  },
  {
    code: 'EQUIPMENT_CALIBRATION_EXPIRED',
    title: 'Equipamento fora do prazo de aferição ou data de aferição não informada',
    description:
      'A data da última aferição do equipamento não foi informada ou indica que o instrumento estava fora do prazo de calibração obrigatória de 12 meses na data da infração. Equipamentos fora do prazo não podem registrar infrações com validade legal.',
    severity: 'critical',
    legalBasis:
      'Resolução CONTRAN n° 396/2011; Portaria INMETRO n° 006/2002; Art. 280, VI do CTB',
    defenseTemplateCode: 'EQUIPMENT_CALIBRATION_EXPIRED_DEFENSE',
  },
  {
    code: 'MISSING_ISSUING_BODY',
    title: 'Órgão autuador não identificado',
    description:
      'O código e/ou nome do órgão ou entidade de trânsito responsável pela autuação estão ausentes, constituindo vício formal no auto de infração.',
    severity: 'high',
    legalBasis: 'Art. 280, inciso I do CTB',
    defenseTemplateCode: 'MISSING_ISSUING_BODY_DEFENSE',
  },
  {
    code: 'MISSING_COMPETENT_BODY',
    title: 'Órgão competente para julgamento não identificado',
    description:
      'O órgão ou entidade competente para processar e julgar eventual recurso não foi identificado no auto, dificultando o exercício do direito de defesa.',
    severity: 'medium',
    legalBasis: 'Art. 280, inciso I do CTB; Art. 7° do CTB',
    defenseTemplateCode: 'MISSING_COMPETENT_BODY_DEFENSE',
  },
  {
    code: 'INVALID_DATE_FORMAT',
    title: 'Data ou hora da infração inválida ou ausente',
    description:
      'A data e hora da lavratura do auto de infração são elementos essenciais para a validade do ato. Data ausente, em formato inválido ou com valores impossíveis constitui vício formal.',
    severity: 'medium',
    legalBasis: 'Art. 280, inciso II do CTB',
    defenseTemplateCode: 'INVALID_DATE_FORMAT_DEFENSE',
  },
  {
    code: 'MISSING_INFRACTION_CODE',
    title: 'Código da infração (CTB) ausente',
    description:
      'O enquadramento da infração deve ser indicado pelo código previsto no CTB ou legislação específica. A ausência impede a identificação precisa da infração e prejudica a defesa.',
    severity: 'high',
    legalBasis: 'Art. 280, inciso III do CTB',
    defenseTemplateCode: 'MISSING_INFRACTION_CODE_DEFENSE',
  },
];

export function getRuleByCode(code: string): InconsistencyRule | undefined {
  return INCONSISTENCY_CATALOG.find((r) => r.code === code);
}
