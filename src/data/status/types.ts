import type { InconsistencyRule } from '../inconsistencies/types';
import type { InfractionInput } from '../../services/infractions/types';

/**
 * Status possíveis de uma multa cuja defesa foi enviada ao órgão.
 */
export type StatusMultaEnviadaCode =
  | 'enviada'
  | 'em_analise'
  | 'deferido'
  | 'indeferido'
  | 'cancelado';

export interface StatusMultaEnviada {
  id: string;
  /** Referência ao registro de defesa (AnalyzedInfractionRecord.id) */
  recordId: string;
  aitNumber: string;
  description: string;
  status: StatusMultaEnviadaCode;
  /** Data/hora do último envio ou atualização de status */
  updatedAt: string;
  /** Mensagem ou descrição da atualização (ex.: "Defesa encaminhada ao DETRAN") */
  lastMessage: string;
  /** Dados para gerar recurso à JARI quando a defesa não for suficiente (opcional) */
  findings?: InconsistencyRule[];
  input?: InfractionInput;
  /** Recurso à JARI gerado (preenchido após confirmação de necessidade na aba Status) */
  recursoJARI?: string;
}

export const STATUS_LABELS: Record<StatusMultaEnviadaCode, string> = {
  enviada: 'Enviada',
  em_analise: 'Em análise',
  deferido: 'Deferido',
  indeferido: 'Indeferido',
  cancelado: 'Cancelado',
};

export const STATUS_DESCRIPTIONS: Record<StatusMultaEnviadaCode, string> = {
  enviada: 'Sua defesa foi enviada ao órgão competente. Aguarde o protocolo de análise.',
  em_analise: 'O órgão está analisando sua defesa. O prazo legal pode variar conforme a unidade.',
  deferido: 'Sua defesa foi aceita. A multa foi cancelada ou o recurso provido.',
  indeferido: 'Sua defesa foi indeferida. Você pode recorrer à JARI se ainda houver prazo.',
  cancelado: 'Registro cancelado ou arquivado.',
};
