import type {
  Consultation,
  ConsultationMessage,
  ConsultationMode,
  PrescriptionItem,
  VitalsObservation,
  VitalsSource
} from '../../domain/models/teleconsult.model.ts';
import { InMemoryTeleconsultStore } from '../../infrastructure/cache/teleconsult.cache.ts';

export class TeleconsultSessionUseCase {
  private readonly store: InMemoryTeleconsultStore;

  constructor(store: InMemoryTeleconsultStore) {
    this.store = store;
  }

  async startSession(consultationId: string, appointmentId: string | undefined, patientName: string, doctorId: string, doctorName: string, specialty: string, mode: ConsultationMode = 'video'): Promise<Consultation> {
    const existing = await this.store.getConsultation(consultationId);
    if (existing) return existing;

    const consultation: Consultation = {
      id: consultationId,
      appointmentId,
      patientId: `PAT-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName,
      doctorId,
      doctorName,
      specialty,
      modeUsed: mode,
      initialModeAttempted: mode,
      modeDegraded: false,
      doctorNotes: '',
      differentialDiagnosis: '',
      prescription: [],
      referralFlag: false,
      diagnosticOrderFlag: false,
      diagnosticTestsOrdered: [],
      followUpFlag: false,
      recordedAt: new Date().toISOString()
    };

    return this.store.saveConsultation(consultation);
  }

  async recordVitals(params: {
    consultationId: string;
    patientId: string;
    type: 'bp' | 'spo2' | 'pulse' | 'temp' | 'glucose' | 'respiratory_rate';
    label: string;
    value: string;
    unit: string;
    source: VitalsSource;
  }): Promise<VitalsObservation> {
    const vital: VitalsObservation = {
      id: `VIT-${Date.now().toString(36)}`,
      consultationId: params.consultationId,
      patientId: params.patientId,
      type: params.type,
      label: params.label,
      value: params.value,
      unit: params.unit,
      source: params.source,
      recordedAt: new Date().toISOString()
    };

    return this.store.addVitals(vital);
  }

  async getSessionVitals(consultationId: string): Promise<VitalsObservation[]> {
    return this.store.getVitals(consultationId);
  }

  async sendMessage(params: {
    consultationId: string;
    sender: 'doctor' | 'patient' | 'worker';
    senderName: string;
    messageText: string;
  }): Promise<ConsultationMessage> {
    const message: ConsultationMessage = {
      id: `MSG-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      consultationId: params.consultationId,
      sender: params.sender,
      senderName: params.senderName,
      messageText: params.messageText,
      sentAt: new Date().toISOString()
    };

    return this.store.addMessage(message);
  }

  async getMessages(consultationId: string): Promise<ConsultationMessage[]> {
    return this.store.getMessages(consultationId);
  }

  async switchMode(consultationId: string, newMode: ConsultationMode): Promise<Consultation | null> {
    const session = await this.store.getConsultation(consultationId);
    if (!session) return null;

    const updated: Consultation = {
      ...session,
      modeUsed: newMode,
      modeDegraded: newMode !== session.initialModeAttempted
    };

    return this.store.saveConsultation(updated);
  }

  async finalizeConsultation(params: {
    consultationId: string;
    doctorNotes: string;
    differentialDiagnosis: string;
    prescription: readonly PrescriptionItem[];
    referralFlag: boolean;
    referralFacilityName?: string;
    referralReason?: string;
    diagnosticOrderFlag: boolean;
    diagnosticTestsOrdered?: readonly string[];
    followUpFlag: boolean;
    followUpDays?: number;
  }): Promise<Consultation | null> {
    const session = await this.store.getConsultation(params.consultationId);
    if (!session) return null;

    const finalized: Consultation = {
      ...session,
      doctorNotes: params.doctorNotes,
      differentialDiagnosis: params.differentialDiagnosis,
      prescription: params.prescription,
      referralFlag: params.referralFlag,
      referralFacilityName: params.referralFacilityName,
      referralReason: params.referralReason,
      diagnosticOrderFlag: params.diagnosticOrderFlag,
      diagnosticTestsOrdered: params.diagnosticTestsOrdered || [],
      followUpFlag: params.followUpFlag,
      followUpDays: params.followUpDays,
      recordedAt: new Date().toISOString()
    };

    return this.store.saveConsultation(finalized);
  }
}
