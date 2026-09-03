import type {
  RiskLevel,
  RiskTrend,
  BloodPressure,
  AdherenceLevel,
  SymptomProgression
} from '../models/followup.model.ts';

export interface ScoreEvaluationInput {
  readonly previousScore?: number;
  readonly bloodPressure?: BloodPressure;
  readonly medicationAdherence: AdherenceLevel;
  readonly symptomProgression: SymptomProgression;
  readonly generalCondition?: string;
}

export interface ScoreEvaluationResult {
  readonly riskScore: number;
  readonly riskLevel: RiskLevel;
  readonly trend: RiskTrend;
  readonly reason: string;
  readonly triggersFacilityAlert: boolean;
}

export const RISK_THRESHOLDS = {
  LOW_MAX: 39,
  MODERATE_MAX: 59,
  HIGH_MAX: 79,
  CRITICAL_MIN: 80
};

export function evaluateDynamicRiskScore(input: ScoreEvaluationInput): ScoreEvaluationResult {
  const base = input.previousScore !== undefined ? input.previousScore : 40;
  let delta = 0;
  const reasons: string[] = [];

  // 1. Vital Parameters (Blood Pressure)
  if (input.bloodPressure) {
    const sbp = input.bloodPressure.systolic;
    const dbp = input.bloodPressure.diastolic;

    if (sbp >= 160 || dbp >= 100) {
      delta += 25;
      reasons.push(`Severely elevated BP (${sbp}/${dbp} mmHg)`);
    } else if (sbp >= 140 || dbp >= 90) {
      delta += 15;
      reasons.push(`Elevated Stage-1 BP (${sbp}/${dbp} mmHg)`);
    } else if (sbp <= 120 && dbp <= 80) {
      delta -= 10;
      reasons.push(`Controlled BP (${sbp}/${dbp} mmHg)`);
    }
  }

  // 2. Medication Adherence
  if (input.medicationAdherence === 'NONE') {
    delta += 25;
    reasons.push('Complete medication non-adherence reported');
  } else if (input.medicationAdherence === 'PARTIAL') {
    delta += 15;
    reasons.push('Partial medication adherence with missed doses');
  } else if (input.medicationAdherence === 'FULL') {
    delta -= 10;
    reasons.push('Strict medication adherence confirmed');
  }

  // 3. Symptom Progression
  if (input.symptomProgression === 'WORSENED') {
    delta += 25;
    reasons.push('Patient-reported symptom worsening');
  } else if (input.symptomProgression === 'UNCHANGED') {
    delta += 5;
  } else if (input.symptomProgression === 'IMPROVED') {
    delta -= 15;
    reasons.push('Symptom improvement noted');
  }

  // 4. Calculate Final Score clamped to [0, 100]
  const rawScore = base + delta;
  const riskScore = Math.max(0, Math.min(100, rawScore));

  // 5. Determine Risk Level
  let riskLevel: RiskLevel = 'LOW';
  if (riskScore >= RISK_THRESHOLDS.CRITICAL_MIN) {
    riskLevel = 'CRITICAL';
  } else if (riskScore > RISK_THRESHOLDS.MODERATE_MAX) {
    riskLevel = 'HIGH';
  } else if (riskScore > RISK_THRESHOLDS.LOW_MAX) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  // 6. Determine Trend
  let trend: RiskTrend = 'STABLE';
  if (input.previousScore !== undefined) {
    const diff = riskScore - input.previousScore;
    if (diff >= 8) {
      trend = 'WORSENING';
    } else if (diff <= -8) {
      trend = 'IMPROVING';
    } else {
      trend = 'STABLE';
    }
  } else {
    trend = riskScore >= 60 ? 'WORSENING' : 'STABLE';
  }

  // 7. Generate Clinical Reason Explanation
  let explanation = '';
  if (input.previousScore !== undefined) {
    const diff = riskScore - input.previousScore;
    const changeWord = diff > 0 ? 'increased' : diff < 0 ? 'decreased' : 'remained stable';
    explanation = `Risk ${changeWord} from ${input.previousScore} to ${riskScore} (${riskLevel}): ${
      reasons.length > 0 ? reasons.join('; ') : 'Routine observation.'
    }.`;
  } else {
    explanation = `Initial dynamic risk score established at ${riskScore} (${riskLevel}): ${
      reasons.length > 0 ? reasons.join('; ') : 'Baseline parameters recorded.'
    }.`;
  }

  const triggersFacilityAlert = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

  return {
    riskScore,
    riskLevel,
    trend,
    reason: explanation,
    triggersFacilityAlert
  };
}
