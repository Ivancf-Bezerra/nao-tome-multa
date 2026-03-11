import { InfractionInput } from '../../services/infractions/types';

/**
 * Dados de exemplo para preenchimento rápido do formulário de multa em ambiente de desenvolvimento.
 * Não utilizado em produção — formulário inicia vazio.
 */
export const SAMPLE_INFRACTION_INPUT: InfractionInput = {
  aitNumber: '87654321',
  renainf: '123456789',
  infractionCode: '21813',
  description: 'Transitar com velocidade superior à máxima permitida em até 20%',
  issuingBodyCode: '0049',
  issuingBody: 'DETRAN-SP',
  competentBodyCode: '0049',
  competentBody: 'DETRAN-SP',
  agentId: '', // propositalmente vazio para gerar inconsistência (MISSING_AGENT_ID) e testar fluxo até defesas
  equipmentId: 'RADAR-LAPA-042',
  equipmentCalibrationDate: '15/03/2024',
  infractionDate: '20/01/2025',
  notes: 'Dados preenchidos automaticamente para teste.',
};
