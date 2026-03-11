import { AnalyzedInfractionRecord } from '../../components/defesas/types';
import { InfractionInput } from '../../services/infractions/types';
import { getRuleByCode } from '../inconsistencies/catalog';
import type { InconsistencyRule } from '../inconsistencies/types';

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

function result(findings: InconsistencyRule[]) {
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const parts: string[] = [];
  if (criticalCount > 0) parts.push(`${criticalCount} inconsistência(s) crítica(s)`);
  if (highCount > 0) parts.push(`${highCount} de alta relevância`);
  const rest = findings.length - criticalCount - highCount;
  if (rest > 0) parts.push(`${rest} de menor severidade`);
  const summary =
    findings.length === 0
      ? 'Nenhuma inconsistência técnica detectada.'
      : `${parts.join(', ')}. Existem bases técnicas para apresentação de defesa formal.`;
  return {
    hasInconsistencies: findings.length > 0,
    findings,
    summary,
    criticalCount,
    highCount,
  };
}

/**
 * Exemplos de multas analisadas para desenvolvimento e testes.
 * Inclui registros em rascunho (sem defesa gerada) e com defesa já gerada.
 */
export function buildSampleDefesas(): AnalyzedInfractionRecord[] {
  const r1 = getRuleByCode('MISSING_AGENT_ID');
  const r2 = getRuleByCode('EQUIPMENT_CALIBRATION_EXPIRED');
  const r3 = getRuleByCode('MISSING_EQUIPMENT_ID');
  const r4 = getRuleByCode('MISSING_RENAINF');
  const r5 = getRuleByCode('INVALID_DATE_FORMAT');

  if (!r1 || !r2 || !r3 || !r4 || !r5) return [];

  return [
    // 1 — Rascunho: só agente ausente (para gerar defesa)
    {
      id: 'sample_ait_001',
      input: input({
        aitNumber: '11223344',
        renainf: '998877665',
        infractionCode: '21813',
        description: 'Transitar com velocidade superior à máxima permitida em até 20%',
        issuingBodyCode: '0049',
        issuingBody: 'DETRAN-SP',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: '',
        equipmentId: 'RADAR-102',
        equipmentCalibrationDate: '10/06/2024',
        infractionDate: '15/01/2025',
        notes: 'Exemplo em rascunho — sem defesa gerada.',
      }),
      analyzedAt: '2025-01-20T10:00:00.000Z',
      result: result([r1]),
      defense: null,
    },
    // 2 — Rascunho: equipamento e calibração (para gerar defesa)
    {
      id: 'sample_ait_002',
      input: input({
        aitNumber: '55667788',
        renainf: '554433221',
        infractionCode: '74550',
        description: 'Dirigir veículo utilizando radar de obstrução à fiscalização',
        issuingBodyCode: '0049',
        issuingBody: 'DETRAN-SP',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: 'Func. 12345',
        equipmentId: '',
        equipmentCalibrationDate: '',
        infractionDate: '18/01/2025',
        notes: 'Equipamento não identificado no auto.',
      }),
      analyzedAt: '2025-01-21T14:30:00.000Z',
      result: result([r2, r3]),
      defense: null,
    },
    // 3 — Já com defesa gerada (exemplo)
    {
      id: 'sample_ait_003',
      input: input({
        aitNumber: '99887766',
        renainf: '112233445',
        infractionCode: '61998',
        description: 'Avançar o sinal vermelho do semáforo',
        issuingBodyCode: '0049',
        issuingBody: 'DETRAN-SP',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: 'Func. 67890',
        equipmentId: 'LPR-001',
        equipmentCalibrationDate: '01/08/2024',
        infractionDate: '12/01/2025',
        notes: 'Exemplo com defesa prévia e recurso JARI já gerados.',
      }),
      analyzedAt: '2025-01-19T09:15:00.000Z',
      result: result([r4, r5]),
      defense: {
        id: 'def_sample_ait_003',
        defesaPrevia:
          'DEFESA PRÉVIA\n\nAo(À) Ilustríssimo(a) Senhor(a) Diretor(a) do Órgão Autuador,\n\nO(A) autuado(a) vem apresentar DEFESA PRÉVIA em face do AIT n° 99887766.\n\nI — RENAINF AUSENTE\nO número de Registro Nacional de Infrações (RENAINF) não consta de forma adequada no auto, prejudicando o exercício do contraditório (Resolução CONTRAN n° 619/2016).\n\nII — DATA INVÁLIDA\nA data da infração apresenta vício formal (Art. 280, II do CTB).\n\nRequer-se o arquivamento do processo administrativo.\n\n[Texto de exemplo — defesa gerada por template.]',
        recursoJARI:
          'RECURSO À JARI\n\nO(A) recorrente não se conformando com o indeferimento da Defesa Prévia referente ao AIT n° 99887766 vem interpor o presente RECURSO.\n\nManutenção dos vícios formais apontados na defesa prévia. Requer-se a reforma da decisão e o arquivamento dos autos.\n\n[Texto de exemplo — recurso JARI gerado por template.]',
        updatedAt: '2025-01-19T09:45:00.000Z',
      },
    },
    // 4 — Rascunho: múltiplas inconsistências
    {
      id: 'sample_ait_004',
      input: input({
        aitNumber: '44332211',
        renainf: '',
        infractionCode: '',
        description: 'Estacionar em local proibido',
        issuingBodyCode: '',
        issuingBody: '',
        competentBodyCode: '0049',
        competentBody: 'DETRAN-SP',
        agentId: '',
        equipmentId: '',
        equipmentCalibrationDate: '',
        infractionDate: '20/01/2025',
        notes: 'Auto com várias falhas formais — use para testar geração de defesa.',
      }),
      analyzedAt: '2025-01-22T11:00:00.000Z',
      result: result([r1, r3, r4, r5]),
      defense: null,
    },
  ];
}
