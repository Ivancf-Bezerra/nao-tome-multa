import { InconsistencyRule, InconsistencySeverity } from '../../data/inconsistencies/types';

export interface AnalysisResult {
  hasInconsistencies: boolean;
  findings: InconsistencyRule[];
  summary: string;
  criticalCount: number;
  highCount: number;
}

const SEVERITY_ORDER: Record<InconsistencySeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function buildSummary(findings: InconsistencyRule[]): string {
  if (findings.length === 0) {
    return 'Nenhuma inconsistência técnica detectada com os dados informados. O auto aparenta estar formalmente regular.';
  }

  const critical = findings.filter((f) => f.severity === 'critical');
  const high = findings.filter((f) => f.severity === 'high');

  const parts: string[] = [];

  if (critical.length > 0) {
    parts.push(
      `${critical.length} inconsistência${critical.length > 1 ? 's' : ''} crítica${critical.length > 1 ? 's' : ''} detectada${critical.length > 1 ? 's' : ''}`,
    );
  }

  if (high.length > 0) {
    parts.push(
      `${high.length} inconsistência${high.length > 1 ? 's' : ''} de alta relevância`,
    );
  }

  const rest = findings.length - critical.length - high.length;
  if (rest > 0) {
    parts.push(
      `${rest} ocorrência${rest > 1 ? 's' : ''} de menor severidade`,
    );
  }

  return `${parts.join(', ')}. Existem bases técnicas para apresentação de defesa formal.`;
}

export function buildAnalysisResult(findings: InconsistencyRule[]): AnalysisResult {
  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return {
    hasInconsistencies: findings.length > 0,
    findings: sorted,
    summary: buildSummary(findings),
    criticalCount: findings.filter((f) => f.severity === 'critical').length,
    highCount: findings.filter((f) => f.severity === 'high').length,
  };
}
