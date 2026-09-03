import type { TriageInput, TriageAssessment, UrgencyLevel } from '../models/triage.model.ts';

export function evaluateTriage(input: TriageInput): TriageAssessment {
  const flagsDetected: string[] = [];
  const textLower = (input.primarySymptoms + ' ' + (input.medicalHistory?.join(' ') ?? '')).toLowerCase();

  // 1. Evaluate Explicit Red Flags
  if (input.redFlags.facialDroopOrSpeech) {
    flagsDetected.push('Acute Neurological / FAST Signs (Facial droop / slurred speech / limb weakness)');
  }
  if (input.redFlags.chestPain) {
    flagsDetected.push('Acute Chest Pain / Potential Coronary Syndrome');
  }
  if (input.redFlags.breathingDistress) {
    flagsDetected.push('Severe Respiratory Distress / Airway Compromise');
  }
  if (input.redFlags.unconsciousOrConfusion) {
    flagsDetected.push('Altered Mental Status / Loss of Consciousness');
  }
  if (input.redFlags.severeBleeding) {
    flagsDetected.push('Severe Hemorrhage / Acute Trauma');
  }

  // 2. Rule-Based Symptom Invariants (Text heuristics)
  const isStrokeLike =
    flagsDetected.some((f) => f.includes('Neurological')) ||
    textLower.includes('facial droop') ||
    textLower.includes('slurred speech') ||
    textLower.includes('paralysis') ||
    textLower.includes('weakness in left arm') ||
    textLower.includes('weakness in right arm') ||
    textLower.includes('numbness');

  const isCardiacLike =
    flagsDetected.some((f) => f.includes('Chest Pain')) ||
    textLower.includes('chest pain') ||
    textLower.includes('pressure radiating') ||
    textLower.includes('heart attack');

  const isRespiratoryLike =
    flagsDetected.some((f) => f.includes('Respiratory')) ||
    textLower.includes('cannot breathe') ||
    textLower.includes('shortness of breath') ||
    textLower.includes('gasping');

  let urgency: UrgencyLevel = 'NON_URGENT';
  let requiredSpecialty = 'General Medicine';
  let conditionCategory = 'Non-Emergency Health Concern';
  let clinicalRoutingAdvice =
    'Symptoms appear stable for routine evaluation. Schedule a consultation at a nearby Community Health Centre or Primary Health Clinic.';
  let emergencyRequired = false;

  if (flagsDetected.length > 0 || input.severity === 'severe' || isStrokeLike || isCardiacLike || isRespiratoryLike) {
    urgency = 'CRITICAL';
    emergencyRequired = true;

    if (isStrokeLike) {
      requiredSpecialty = 'Neurology';
      conditionCategory = 'Suspected Acute Neurological Emergency';
      clinicalRoutingAdvice =
        'Symptoms indicate a possible acute neurological emergency requiring immediate medical evaluation. Do not give oral food or fluids; keep patient in a safe seated/reclined position and transport immediately to a facility with 24x7 emergency neurology.';
    } else if (isCardiacLike) {
      requiredSpecialty = 'Cardiology';
      conditionCategory = 'Suspected Acute Coronary Syndrome';
      clinicalRoutingAdvice =
        'Symptoms indicate a possible acute cardiovascular emergency requiring immediate medical evaluation. Minimize physical exertion and transport immediately to a facility equipped with cardiac emergency & catheterization services.';
    } else if (isRespiratoryLike) {
      requiredSpecialty = 'Pulmonology / Critical Care';
      conditionCategory = 'Acute Respiratory Compromise';
      clinicalRoutingAdvice =
        'Symptoms indicate acute respiratory compromise requiring immediate supplemental oxygen and emergency airway stabilization.';
    } else {
      requiredSpecialty = 'Emergency Medicine';
      conditionCategory = 'Acute Medical Emergency';
      clinicalRoutingAdvice =
        'Severe acute presentation requiring immediate emergency department evaluation and stabilization.';
    }
  } else if (input.severity === 'moderate') {
    urgency = 'URGENT';
    emergencyRequired = false;
    requiredSpecialty = 'General Medicine';
    conditionCategory = 'Moderate Health Condition';
    clinicalRoutingAdvice =
      'Symptoms require same-day outpatient medical evaluation to prevent acute escalation. Visit an Outpatient Department (OPD) or Day Clinic today.';
  }

  // Targeted queries for Agent 2 Search MCP (Explicitly targeting <= 50km radius & multi-specialty emergency centers)
  const searchQueries: string[] = [
    `"${requiredSpecialty.toLowerCase()}" 24x7 emergency hospital within 50 km of ${input.location}`,
    `best multi specialty hospital emergency ICU near ${input.location}`,
    `government medical college hospital emergency trauma centre ${input.location}`,
    `hospital 24x7 emergency stroke neurology ${input.location}`
  ];

  return {
    urgency,
    acuityBadge: urgency === 'CRITICAL' ? '🔴 CRITICAL' : urgency === 'URGENT' ? '🟡 URGENT' : '🟢 NON-URGENT',
    requiredSpecialty,
    conditionCategory,
    clinicalRoutingAdvice,
    emergencyRequired,
    redFlagsDetected: flagsDetected,
    searchQueries
  };
}
