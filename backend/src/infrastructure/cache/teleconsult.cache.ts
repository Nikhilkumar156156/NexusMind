import type {
  Doctor,
  Appointment,
  QueueEntry,
  Consultation,
  ConsultationMessage,
  VitalsObservation
} from '../../domain/models/teleconsult.model.ts';
import { sortQueueByPriority } from '../../domain/rules/queue-priority.rules.ts';

export interface FacilityInfo {
  readonly id: string;
  readonly name: string;
  readonly location: string;
}

export const SEED_FACILITIES: readonly FacilityInfo[] = [
  { id: 'fac_sbmch', name: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)', location: 'Hazaribagh, Jharkhand' },
  { id: 'fac_sadar', name: 'Sadar Hospital', location: 'Hazaribagh, Jharkhand' },
  { id: 'fac_arogyam', name: 'Arogyam Multi-Specialty Hospital & Critical Care', location: 'Hazaribagh, Jharkhand' },
  { id: 'fac_kalyani', name: 'Kalyani Super Specialty Hospital & Trauma Centre', location: 'Ramgarh Cantt, Jharkhand' }
];

export const SEED_DOCTORS: readonly Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Priya Sharma',
    qualification: 'MD, DM (Neurology), DNB',
    registrationNumber: 'JH-MED-4421',
    specialties: ['Neurology', 'Stroke Care', 'General Medicine'],
    facilityIds: ['fac_sbmch', 'fac_sadar'],
    availabilityWindows: [
      { dayOfWeek: 'Monday', facilityId: 'fac_sbmch', facilityName: 'SBMC&H Hazaribagh', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 20 },
      { dayOfWeek: 'Wednesday', facilityId: 'fac_sadar', facilityName: 'Sadar Hospital', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 20 },
      { dayOfWeek: 'Friday', facilityId: 'fac_sbmch', facilityName: 'SBMC&H Hazaribagh', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 20 }
    ],
    maxDailyLoad: 25,
    isAvailableOnline: true,
    currentActiveConsultations: 0
  },
  {
    id: 'doc_2',
    name: 'Dr. Rajesh Verma',
    qualification: 'MD (Medicine), DM (Cardiology)',
    registrationNumber: 'JH-MED-3890',
    specialties: ['Cardiology', 'Emergency Medicine', 'General Medicine'],
    facilityIds: ['fac_sbmch', 'fac_arogyam'],
    availabilityWindows: [
      { dayOfWeek: 'Tuesday', facilityId: 'fac_sbmch', facilityName: 'SBMC&H Hazaribagh', startTime: '09:00', endTime: '14:00', slotDurationMinutes: 20 },
      { dayOfWeek: 'Thursday', facilityId: 'fac_arogyam', facilityName: 'Arogyam Critical Care', startTime: '11:00', endTime: '16:00', slotDurationMinutes: 20 }
    ],
    maxDailyLoad: 30,
    isAvailableOnline: true,
    currentActiveConsultations: 0
  },
  {
    id: 'doc_3',
    name: 'Dr. Ananya Sen',
    qualification: 'MD (Pediatrics), DCH',
    registrationNumber: 'JH-MED-5102',
    specialties: ['Pediatrics', 'Neonatal Care', 'General Medicine'],
    facilityIds: ['fac_sadar', 'fac_kalyani'],
    availabilityWindows: [
      { dayOfWeek: 'Monday', facilityId: 'fac_sadar', facilityName: 'Sadar Hospital', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 15 },
      { dayOfWeek: 'Wednesday', facilityId: 'fac_kalyani', facilityName: 'Kalyani Trauma Centre', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 15 }
    ],
    maxDailyLoad: 35,
    isAvailableOnline: true,
    currentActiveConsultations: 0
  },
  {
    id: 'doc_4',
    name: 'Dr. Kavita Murmu',
    qualification: 'MS (Obstetrics & Gynecology)',
    registrationNumber: 'JH-MED-6218',
    specialties: ['Obstetrics & Gynecology', 'Maternal Health', 'General Medicine'],
    facilityIds: ['fac_sadar', 'fac_sbmch'],
    availabilityWindows: [
      { dayOfWeek: 'Tuesday', facilityId: 'fac_sadar', facilityName: 'Sadar Hospital', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 20 },
      { dayOfWeek: 'Saturday', facilityId: 'fac_sbmch', facilityName: 'SBMC&H Hazaribagh', startTime: '09:00', endTime: '14:00', slotDurationMinutes: 20 }
    ],
    maxDailyLoad: 25,
    isAvailableOnline: true,
    currentActiveConsultations: 0
  }
];

export class InMemoryTeleconsultStore {
  private readonly doctors: Map<string, Doctor> = new Map();
  private readonly appointments: Map<string, Appointment> = new Map();
  private readonly queue: Map<string, QueueEntry> = new Map();
  private readonly consultations: Map<string, Consultation> = new Map();
  private readonly messages: Map<string, ConsultationMessage[]> = new Map();
  private readonly vitals: Map<string, VitalsObservation[]> = new Map();

  constructor() {
    for (const doc of SEED_DOCTORS) {
      this.doctors.set(doc.id, doc);
    }
  }

  async getDoctorRoster(facilityId?: string, specialty?: string): Promise<Doctor[]> {
    let list = Array.from(this.doctors.values());
    if (facilityId) {
      list = list.filter((d) => d.facilityIds.includes(facilityId));
    }
    if (specialty) {
      const specLower = specialty.toLowerCase();
      list = list.filter((d) => d.specialties.some((s) => s.toLowerCase().includes(specLower)));
    }
    return list;
  }

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getAvailableSlots(doctorId?: string, specialty?: string, _date?: string): Promise<Array<{
    readonly slotId: string;
    readonly doctorId: string;
    readonly doctorName: string;
    readonly specialty: string;
    readonly facilityId: string;
    readonly facilityName: string;
    readonly timeString: string;
    readonly isAvailable: boolean;
  }>> {
    const docs = await this.getDoctorRoster(undefined, specialty);
    const targetDocs = doctorId ? docs.filter((d) => d.id === doctorId) : docs;

    const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
    const result = [];

    for (const doc of targetDocs) {
      const window = doc.availabilityWindows[0] || { facilityId: 'fac_sbmch', facilityName: 'SBMC&H Hazaribagh' };
      for (const t of times) {
        const slotKey = `${doc.id}_${t.replace(/\s/g, '_')}`;
        const isBooked = Array.from(this.appointments.values()).some(
          (app) => app.doctorId === doc.id && app.scheduledTime.includes(t) && app.status === 'booked'
        );
        result.push({
          slotId: slotKey,
          doctorId: doc.id,
          doctorName: doc.name,
          specialty: doc.specialties[0] || 'General Medicine',
          facilityId: window.facilityId,
          facilityName: window.facilityName,
          timeString: t,
          isAvailable: !isBooked
        });
      }
    }

    return result;
  }

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async addToQueue(entry: QueueEntry): Promise<QueueEntry> {
    this.queue.set(entry.id, entry);
    return entry;
  }

  async getQueueEntries(doctorId?: string): Promise<QueueEntry[]> {
    let list = Array.from(this.queue.values()).filter((e) => e.status === 'waiting' || e.status === 'called');
    if (doctorId) {
      list = list.filter((e) => e.doctorId === doctorId);
    }
    return sortQueueByPriority(list);
  }

  async getQueueEntry(id: string): Promise<QueueEntry | undefined> {
    return this.queue.get(id);
  }

  async updateQueueStatus(id: string, status: 'waiting' | 'called' | 'in_consultation' | 'completed'): Promise<void> {
    const entry = this.queue.get(id);
    if (entry) {
      this.queue.set(id, { ...entry, status });
    }
  }

  async saveConsultation(consultation: Consultation): Promise<Consultation> {
    this.consultations.set(consultation.id, consultation);
    return consultation;
  }

  async getConsultation(id: string): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async addMessage(message: ConsultationMessage): Promise<ConsultationMessage> {
    const list = this.messages.get(message.consultationId) || [];
    list.push(message);
    this.messages.set(message.consultationId, list);
    return message;
  }

  async getMessages(consultationId: string): Promise<ConsultationMessage[]> {
    return this.messages.get(consultationId) || [];
  }

  async addVitals(vital: VitalsObservation): Promise<VitalsObservation> {
    const list = this.vitals.get(vital.consultationId) || [];
    list.push(vital);
    this.vitals.set(vital.consultationId, list);
    return vital;
  }

  async getVitals(consultationId: string): Promise<VitalsObservation[]> {
    return this.vitals.get(consultationId) || [];
  }
}
