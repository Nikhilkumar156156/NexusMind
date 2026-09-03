// ==========================================
// Feature Map 05: ABDM Sandbox Gateway HIU Client Simulator
// ==========================================

import type { HealthRecordItem, ExtractedRecordData } from '../../domain/models/records.model.ts';

export interface AbdmConsentRequestPayload {
  internalMedicalId: string;
  abhaId: string;
  hiuId: string; // e.g. "IN-MEDVEDA-HIU-01"
  purpose: string;
  hiTypes: Array<'DiagnosticReport' | 'Prescription' | 'DischargeSummary' | 'OPConsultation'>;
  dateRange: { from: string; to: string };
  expiry: string;
}

export class AbdmSandboxClient {
  private readonly gatewayUrl: string = 'https://sandbox.abdm.gov.in/v0.5';

  /**
   * Dispatches a consent request to ABDM Sandbox Consent Manager.
   */
  async createConsentRequest(payload: AbdmConsentRequestPayload): Promise<{
    consentRequestId: string;
    status: 'REQUESTED';
    gatewayRef: string;
  }> {
    const consentRequestId = `abdm_cr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      consentRequestId,
      status: 'REQUESTED',
      gatewayRef: `GW-ABDM-SBX-${Math.floor(Math.random() * 100000)}`
    };
  }

  /**
   * Fetches FHIR-structured records from simulated ABDM Sandbox Health Information Providers (HIPs).
   */
  async fetchSandboxFhirRecords(
    consentId: string,
    abhaId: string,
    internalMedicalId: string
  ): Promise<HealthRecordItem[]> {
    const now = new Date().toISOString();

    const fhirRecord1: HealthRecordItem = {
      id: `rec_abdm_${Date.now()}_1`,
      internalMedicalId,
      source: 'abha',
      recordType: 'lab_report',
      title: 'Lipid Profile & Serum Electrolytes (ABDM FHIR Bundle)',
      summary: 'Diagnostic report from ABDM Health Information Provider (Apollo Health Grid).',
      facilityName: 'Apollo Diagnostics & Health Grid (HIP-0842)',
      doctorName: 'Dr. S. K. Roy (Pathologist)',
      recordedAt: '2026-07-03T09:30:00.000Z',
      verificationStatus: 'hip_verified',
      verifiedBy: 'ABDM Sandbox HIP (Digital Signature Validated)',
      extractedData: {
        testName: 'Lipid Profile & Serum Electrolytes',
        results: [
          { parameter: 'TOTAL CHOLESTEROL', observedValue: '210', unit: 'mg/dL', referenceRange: '125 - 200', isAbnormal: true },
          { parameter: 'HDL CHOLESTEROL', observedValue: '42', unit: 'mg/dL', referenceRange: '40 - 60', isAbnormal: false },
          { parameter: 'LDL CHOLESTEROL', observedValue: '138', unit: 'mg/dL', referenceRange: '0 - 100', isAbnormal: true },
          { parameter: 'SERUM POTASSIUM', observedValue: '4.2', unit: 'mEq/L', referenceRange: '3.5 - 5.0', isAbnormal: false }
        ],
        labName: 'Apollo Diagnostics & Health Grid',
        date: '2026-07-03'
      },
      metadata: {
        fhirResourceType: 'DiagnosticReport',
        abdmConsentArtifactId: consentId,
        abdmPatientId: abhaId
      }
    };

    const fhirRecord2: HealthRecordItem = {
      id: `rec_abdm_${Date.now()}_2`,
      internalMedicalId,
      source: 'abha',
      recordType: 'discharge_summary',
      title: 'Inpatient Cardiology Discharge Summary (ABDM FHIR Bundle)',
      summary: 'Discharge summary following emergency PCI and coronary stent placement.',
      facilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
      doctorName: 'Dr. Priya Sharma (Interventional Cardiologist)',
      recordedAt: '2026-08-05T14:00:00.000Z',
      verificationStatus: 'hip_verified',
      verifiedBy: 'ABDM Sandbox HIP (SBMC&H Verified)',
      extractedData: {
        admissionDate: '2026-08-01',
        dischargeDate: '2026-08-05',
        primaryDiagnosis: 'Acute Coronary Syndrome / Anterior Wall Myocardial Infarction',
        proceduresPerformed: ['Primary Percutaneous Coronary Intervention (PCI)', 'Drug-Eluting Stent (DES) in LAD'],
        dischargeMedications: [
          'Tab. Aspirin 75mg once daily',
          'Tab. Clopidogrel 75mg once daily',
          'Tab. Atorvastatin 40mg at bedtime',
          'Tab. Metoprolol Succinate 25mg once daily'
        ],
        followUpAdvice: 'ASHA home monitoring weekly. Avoid unprescribed NSAIDs. Teleconsultation review in 14 days.'
      },
      metadata: {
        fhirResourceType: 'DischargeSummary',
        abdmConsentArtifactId: consentId,
        abdmPatientId: abhaId
      }
    };

    return [fhirRecord1, fhirRecord2];
  }
}
