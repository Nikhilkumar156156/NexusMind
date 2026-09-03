import type { TriageInput, TriageAssessment } from '../../domain/models/triage.model.ts';
import { evaluateTriage } from '../../domain/rules/triage-rules.ts';

export class AssessTriageUseCase {
  async execute(input: TriageInput): Promise<TriageAssessment> {
    return evaluateTriage(input);
  }
}
