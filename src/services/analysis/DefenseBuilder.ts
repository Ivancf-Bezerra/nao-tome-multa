import { InconsistencyRule } from '../../data/inconsistencies/types';
import { getTemplateByCode } from '../../data/defenseTemplates/templates';
import { TechnicalProfile } from '../../context/TechnicalProfileContext';
import { InfractionInput } from '../infractions/types';

export interface BuiltDefense {
  defesaPrevia: string;
  recursoJARI: string;
  appliedTemplates: string[];
}

function formatDate(isoOrToday?: string): string {
  const d = isoOrToday ? new Date(isoOrToday) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function applyVariables(
  text: string,
  profile: TechnicalProfile | null,
  input: InfractionInput,
): string {
  const driverName = profile?.driver.fullName ?? 'CONDUTOR NÃO IDENTIFICADO';
  const cpf = profile?.driver.cpf ?? '000.000.000-00';
  const plate = profile?.vehicle.plate ?? input.aitNumber ?? '---';
  const city = profile?.vehicle.city ?? '---';
  const date = formatDate();
  const aitNumber = input.aitNumber || '---';

  return text
    .replace(/\{\{driverName\}\}/g, driverName)
    .replace(/\{\{cpf\}\}/g, cpf)
    .replace(/\{\{plate\}\}/g, plate)
    .replace(/\{\{city\}\}/g, city)
    .replace(/\{\{date\}\}/g, date)
    .replace(/\{\{aitNumber\}\}/g, aitNumber);
}

const SEPARATOR = '\n\n' + '─'.repeat(60) + '\n\n';

export function buildDefense(
  findings: InconsistencyRule[],
  profile: TechnicalProfile | null,
  input: InfractionInput,
): BuiltDefense {
  if (findings.length === 0) {
    return {
      defesaPrevia:
        'Nenhuma inconsistência técnica foi detectada nos dados informados. Não há base formal para geração de defesa.',
      recursoJARI: '',
      appliedTemplates: [],
    };
  }

  const defesaPreviaBlocks: string[] = [];
  const recursoJARIBlocks: string[] = [];
  const appliedTemplates: string[] = [];

  for (const finding of findings) {
    const template = getTemplateByCode(finding.defenseTemplateCode);
    if (!template) continue;

    defesaPreviaBlocks.push(
      applyVariables(template.defesaPreviaText, profile, input),
    );
    recursoJARIBlocks.push(
      applyVariables(template.recursoJARIText, profile, input),
    );
    appliedTemplates.push(template.code);
  }

  const header =
    `AVISO LEGAL\n` +
    `Este documento é gerado automaticamente com base em inconsistências técnicas formais detectadas.\n` +
    `Não constitui orientação jurídica e não garante êxito administrativo ou judicial.\n` +
    `Consulte um advogado especializado em direito de trânsito para orientação profissional.\n`;

  const defesaPrevia =
    header +
    SEPARATOR +
    defesaPreviaBlocks.join(SEPARATOR);

  const recursoJARI =
    recursoJARIBlocks.length > 0
      ? header + SEPARATOR + recursoJARIBlocks.join(SEPARATOR)
      : '';

  return { defesaPrevia, recursoJARI, appliedTemplates };
}
