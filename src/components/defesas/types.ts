import { InconsistencyRule, InconsistencySeverity } from '../../data/inconsistencies/types';
import { InfractionInput } from '../../services/infractions/types';

export type { InconsistencySeverity };

export interface AnalysisFinding extends InconsistencyRule {}

export interface AnalysisResult {
  summary: string;
  hasInconsistencies: boolean;
  findings: InconsistencyRule[];
  criticalCount: number;
  highCount: number;
}

export interface DefenseDraft {
  id: string;
  defesaPrevia: string;
  recursoJARI: string;
  updatedAt: string;
}

export interface AnalyzedInfractionRecord {
  id: string;
  input: InfractionInput;
  analyzedAt: string;
  result: AnalysisResult;
  defense: DefenseDraft | null;
}
