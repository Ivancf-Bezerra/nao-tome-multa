import { INCONSISTENCY_CATALOG } from '../../data/inconsistencies/catalog';
import { InconsistencyRule } from '../../data/inconsistencies/types';
import { InfractionInput } from '../infractions/types';

function isBlank(value: string): boolean {
  return !value || value.trim().length === 0;
}

function isCalibrationExpired(calibrationDate: string, infractionDate: string): boolean {
  if (isBlank(calibrationDate)) return true;

  const parseDate = (raw: string): Date | null => {
    const parts = raw.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  const calibration = parseDate(calibrationDate);
  const infraction = parseDate(infractionDate);

  if (!calibration || !infraction) return true;

  const diffMs = infraction.getTime() - calibration.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays > 365;
}

function isValidDateFormat(value: string): boolean {
  if (isBlank(value)) return false;
  const parts = value.split('/');
  if (parts.length !== 3) return false;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return false;
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 2000) return false;
  return true;
}

export function analyzeInfraction(input: InfractionInput): InconsistencyRule[] {
  const findings: InconsistencyRule[] = [];

  const findRule = (code: string) =>
    INCONSISTENCY_CATALOG.find((r) => r.code === code)!;

  if (isBlank(input.aitNumber) || input.aitNumber.trim().length < 3) {
    findings.push(findRule('MISSING_AIT_NUMBER'));
  }

  if (isBlank(input.agentId)) {
    findings.push(findRule('MISSING_AGENT_ID'));
  }

  if (isBlank(input.renainf)) {
    findings.push(findRule('MISSING_RENAINF'));
  }

  if (isBlank(input.infractionCode)) {
    findings.push(findRule('MISSING_INFRACTION_CODE'));
  }

  if (isBlank(input.issuingBodyCode) || isBlank(input.issuingBody)) {
    findings.push(findRule('MISSING_ISSUING_BODY'));
  }

  if (isBlank(input.competentBodyCode) || isBlank(input.competentBody)) {
    findings.push(findRule('MISSING_COMPETENT_BODY'));
  }

  if (isBlank(input.equipmentId)) {
    findings.push(findRule('MISSING_EQUIPMENT_ID'));
  }

  if (!isValidDateFormat(input.infractionDate)) {
    findings.push(findRule('INVALID_DATE_FORMAT'));
  }

  const equipmentCheck = isCalibrationExpired(
    input.equipmentCalibrationDate,
    input.infractionDate,
  );
  if (equipmentCheck) {
    findings.push(findRule('EQUIPMENT_CALIBRATION_EXPIRED'));
  }

  return findings;
}
