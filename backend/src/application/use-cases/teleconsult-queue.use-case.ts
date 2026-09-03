import type {
  JoinQueueRequest,
  QueueEntry,
  QueueStatusResponse
} from '../../domain/models/teleconsult.model.ts';
import { computePriorityScore } from '../../domain/rules/queue-priority.rules.ts';
import { InMemoryTeleconsultStore } from '../../infrastructure/cache/teleconsult.cache.ts';

export class TeleconsultQueueUseCase {
  private readonly store: InMemoryTeleconsultStore;

  constructor(store: InMemoryTeleconsultStore) {
    this.store = store;
  }

  async joinQueue(request: JoinQueueRequest): Promise<QueueEntry> {
    const queueId = `QUE-${Date.now().toString(36).toUpperCase()}`;
    const patientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const doctor = await this.store.getDoctorById(request.doctorId);
    const doctorName = doctor ? doctor.name : 'Dr. On Call';

    const priorityScore = computePriorityScore({
      urgencyTier: request.urgencyTier,
      highRiskFlags: request.highRiskFlags,
      patientAge: request.patientAge,
      isBookedAppointment: Boolean(request.appointmentId),
      minutesWaiting: 0
    });

    const entry: QueueEntry = {
      id: queueId,
      appointmentId: request.appointmentId,
      patientId,
      patientName: request.patientName,
      patientAge: request.patientAge,
      patientSex: request.patientSex,
      doctorId: request.doctorId,
      doctorName,
      specialty: request.specialty,
      priorityScore,
      urgencyTier: request.urgencyTier,
      highRiskFlags: request.highRiskFlags || [],
      bookedBy: request.bookedBy,
      workerName: request.workerName,
      joinedAt: new Date().toISOString(),
      scheduledTime: request.scheduledTime,
      status: 'waiting'
    };

    return this.store.addToQueue(entry);
  }

  async getQueueStatus(queueId: string): Promise<QueueStatusResponse | null> {
    const entry = await this.store.getQueueEntry(queueId);
    if (!entry) return null;

    const allWaiting = await this.store.getQueueEntries(entry.doctorId);
    const currentRank = allWaiting.findIndex((e) => e.id === queueId) + 1;
    const rank = currentRank > 0 ? currentRank : 1;

    // Estimate 8 mins per consultation ahead
    const estimatedWaitMinutes = Math.max(2, (rank - 1) * 8);

    return {
      currentRank: rank,
      totalWaiting: allWaiting.length,
      estimatedWaitMinutes,
      activeDoctorName: entry.doctorName,
      activeConsultationPatient: allWaiting[0]?.patientName,
      queueEntry: entry
    };
  }

  async getDoctorQueue(doctorId: string): Promise<QueueEntry[]> {
    return this.store.getQueueEntries(doctorId);
  }

  async callNextPatient(doctorId: string): Promise<QueueEntry | null> {
    const queue = await this.store.getQueueEntries(doctorId);
    if (queue.length === 0) return null;

    const nextPatient = queue[0];
    await this.store.updateQueueStatus(nextPatient.id, 'called');
    return nextPatient;
  }
}
