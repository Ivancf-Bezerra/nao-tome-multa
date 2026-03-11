import { getRuleByCode } from '../inconsistencies/catalog';
import type { StatusMultaEnviada } from './types';
import type { InfractionInput } from '../../services/infractions/types';

function input(overrides: Partial<InfractionInput>): InfractionInput {
  return {
    aitNumber: '',
    renainf: '',
    infractionCode: '',
    description: '',
    issuingBodyCode: '',
    issuingBody: '',
    competentBodyCode: '',
    competentBody: '',
    agentId: '',
    equipmentId: '',
    equipmentCalibrationDate: '',
    infractionDate: '',
    notes: '',
    ...overrides,
  };
}

/**
 * Exemplos de multas enviadas cuja defesa foi indeferida, para testar o fluxo
 * de "Gerar recurso à JARI" na aba Status. Apenas em desenvolvimento.
 */
export function buildSampleStatusIndeferidos(): StatusMultaEnviada[] {
  const r1 = getRuleByCode('MISSING_AGENT_ID');
  const r2 = getRuleByCode('EQUIPMENT_CALIBRATION_EXPIRED');
  const r3 = getRuleByCode('MISSING_EQUIPMENT_ID');
  const r4 = getRuleByCode('MISSING_RENAINF');

  if (!r1 || !r2 || !r3 || !r4) return [];

  const now = new Date().toISOString();

  return [
    {
      id: 'sample_status_indeferido_001',
      recordId: 'sample_ait_001',
      aitNumber: '20001122',
      description: 'Transitar com velocidade superior à máxima permitida em até 20%',
      status: 'indeferido',
      updatedAt: now,
      lastMessage: 'Defesa prévia indeferida. Órgão manteve a penalidade. Prazo para recurso à JARI em aberto.',
      findings: [r1],
      input: input({
        aitNumber: '20001122',
        renainf: '111222333',
        infractionCode: '21813',
        description: 'Transitar com velocidade superior à máxima permitida em até 20%',
        issuingBodyCode: '0049',
        issuingBody: 'DETRAN-SP',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: '',
        equipmentId: 'RADAR-99',
        equipmentCalibrationDate: '10/05/2024',
        infractionDate: '05/02/2025',
        notes: 'Exemplo: defesa indeferida — teste recurso JARI.',
      }),
    },
    {
      id: 'sample_status_indeferido_002',
      recordId: 'sample_ait_002',
      aitNumber: '30004455',
      description: 'Dirigir veículo utilizando radar de obstrução à fiscalização',
      status: 'indeferido',
      updatedAt: now,
      lastMessage: 'Sua defesa foi analisada e indeferida. Você pode recorrer à JARI no prazo de 30 dias.',
      findings: [r2, r3],
      input: input({
        aitNumber: '30004455',
        renainf: '444555666',
        infractionCode: '74550',
        description: 'Dirigir veículo utilizando radar de obstrução à fiscalização',
        issuingBodyCode: '0049',
        issuingBody: 'DETRAN-SP',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: 'Func. 99999',
        equipmentId: '',
        equipmentCalibrationDate: '',
        infractionDate: '10/02/2025',
        notes: 'Exemplo: equipamento e calibração — defesa indeferida.',
      }),
    },
    {
      id: 'sample_status_indeferido_003',
      recordId: 'sample_ait_003',
      aitNumber: '50007788',
      description: 'Avançar o sinal vermelho do semáforo',
      status: 'indeferido',
      updatedAt: now,
      lastMessage: 'Defesa indeferida. Recurso à JARI disponível.',
      findings: [r4],
      input: input({
        aitNumber: '50007788',
        renainf: '',
        infractionCode: '61998',
        description: 'Avançar o sinal vermelho do semáforo',
        issuingBodyCode: '0049',
        issuingBody: 'DETRAN-SP',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: 'Func. 12345',
        equipmentId: 'LPR-002',
        equipmentCalibrationDate: '01/09/2024',
        infractionDate: '15/02/2025',
        notes: 'Exemplo: RENAINF ausente — defesa indeferida.',
      }),
    },
  ];
}
