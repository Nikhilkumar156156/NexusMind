import type { Referral, ReferralStatusHistoryItem } from '../../domain/models/referral.model.ts';

export class InMemoryReferralStore {
  private referrals: Map<string, Referral> = new Map();
  private historyLogs: ReferralStatusHistoryItem[] = [];

  constructor() {
    this.seedInitialReferrals();
  }

  private seedInitialReferrals(): void {
    const seedData: Referral[] = [
      {
        id: 'ref_seed_1',
        referralId: 'REF-2026-00125',
        patientId: 'PAT-1024',
        patientName: 'Ramesh Mahto',
        patientAge: 48,
        patientSex: 'male',
        patientPhone: '+91-94311-28901',
        patientLocation: 'Katkamsandi, Hazaribagh',
        referringDoctorId: 'doc_1',
        referringDoctorName: 'Dr. Priya Sharma',
        referringFacilityId: 'fac_phc_katkamsandi',
        referringFacilityName: 'Katkamsandi Primary Health Centre',
        receivingFacilityId: 'fac_sbmch',
        receivingFacilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
        specialty: 'Cardiology',
        reason: 'Severe exertional angina and ST depression on field ECG',
        clinicalSummary:
          '48M presenting with progressive retrosternal pain for 3 days. SBP 154/96 mmHg. Initial aspirin and nitrates administered. Referred for emergency coronary evaluation.',
        urgencyTier: 'CRITICAL',
        status: 'IN_PROGRESS',
        createdAt: '2026-08-31T10:20:00.000Z',
        updatedAt: '2026-08-31T12:30:00.000Z',
        statusHistory: [
          {
            id: 'hist_1',
            referralId: 'REF-2026-00125',
            fromStatus: null,
            toStatus: 'CREATED',
            updatedBy: 'Dr. Priya Sharma',
            userRole: 'doctor',
            remarks: 'Initial referral generated following teleconsultation.',
            timestamp: '2026-08-31T10:20:00.000Z'
          },
          {
            id: 'hist_2',
            referralId: 'REF-2026-00125',
            fromStatus: 'CREATED',
            toStatus: 'SENT',
            updatedBy: 'Dr. Priya Sharma',
            userRole: 'doctor',
            remarks: 'Transmitted to SBMC&H Cardiology department.',
            timestamp: '2026-08-31T10:25:00.000Z'
          },
          {
            id: 'hist_3',
            referralId: 'REF-2026-00125',
            fromStatus: 'SENT',
            toStatus: 'IN_PROGRESS',
            updatedBy: 'ASHA Anita Devi',
            userRole: 'worker',
            remarks: 'Contacted patient family; 108 ambulance arranged and en route.',
            timestamp: '2026-08-31T12:30:00.000Z'
          }
        ]
      },
      {
        id: 'ref_seed_2',
        referralId: 'REF-2026-00126',
        patientId: 'PAT-1056',
        patientName: 'Sunita Soren',
        patientAge: 32,
        patientSex: 'female',
        patientPhone: '+91-98350-11234',
        patientLocation: 'Barkagaon, Hazaribagh',
        referringDoctorId: 'doc_4',
        referringDoctorName: 'Dr. Kavita Murmu',
        referringFacilityId: 'fac_chc_barkagaon',
        referringFacilityName: 'Barkagaon Community Health Centre',
        receivingFacilityId: 'fac_sadar',
        receivingFacilityName: 'Sadar Hospital Hazaribagh',
        specialty: 'Obstetrics & Gynecology',
        reason: 'High-risk primigravida at 34 weeks with severe pre-eclampsia',
        clinicalSummary: 'BP 160/105 mmHg, bilateral pedal edema +++, 2+ proteinuria on dipstick. Needs urgent maternal ICU monitoring.',
        urgencyTier: 'CRITICAL',
        status: 'SENT',
        createdAt: '2026-08-31T11:00:00.000Z',
        updatedAt: '2026-08-31T11:05:00.000Z',
        statusHistory: [
          {
            id: 'hist_4',
            referralId: 'REF-2026-00126',
            fromStatus: null,
            toStatus: 'CREATED',
            updatedBy: 'Dr. Kavita Murmu',
            userRole: 'doctor',
            remarks: 'High-risk antenatal referral created.',
            timestamp: '2026-08-31T11:00:00.000Z'
          },
          {
            id: 'hist_5',
            referralId: 'REF-2026-00126',
            fromStatus: 'CREATED',
            toStatus: 'SENT',
            updatedBy: 'Dr. Kavita Murmu',
            userRole: 'doctor',
            remarks: 'Transmitted to Sadar Hospital Maternity Wing.',
            timestamp: '2026-08-31T11:05:00.000Z'
          }
        ]
      },
      {
        id: 'ref_seed_3',
        referralId: 'REF-2026-00127',
        patientId: 'PAT-1088',
        patientName: 'Kishore Gope',
        patientAge: 62,
        patientSex: 'male',
        patientPhone: '+91-94301-44556',
        patientLocation: 'Mandu, Ramgarh',
        referringDoctorId: 'doc_2',
        referringDoctorName: 'Dr. Rajesh Verma',
        referringFacilityId: 'fac_sadar',
        referringFacilityName: 'Sadar Hospital Hazaribagh',
        receivingFacilityId: 'fac_kalyani',
        receivingFacilityName: 'Kalyani Super Specialty Hospital & Trauma Centre',
        specialty: 'Neurology',
        reason: 'Ischemic stroke rehabilitation & advanced neuro-imaging evaluation',
        clinicalSummary: 'Post acute stroke day 12, recovering right hemiparesis. Referred for neuro-rehabilitation assessment.',
        urgencyTier: 'ROUTINE',
        status: 'COMPLETED',
        createdAt: '2026-08-30T09:00:00.000Z',
        updatedAt: '2026-08-30T16:00:00.000Z',
        statusHistory: [
          {
            id: 'hist_6',
            referralId: 'REF-2026-00127',
            fromStatus: null,
            toStatus: 'CREATED',
            updatedBy: 'Dr. Rajesh Verma',
            userRole: 'doctor',
            remarks: 'Neuro rehab referral created.',
            timestamp: '2026-08-30T09:00:00.000Z'
          },
          {
            id: 'hist_7',
            referralId: 'REF-2026-00127',
            fromStatus: 'CREATED',
            toStatus: 'SENT',
            updatedBy: 'Dr. Rajesh Verma',
            userRole: 'doctor',
            remarks: 'Sent to Kalyani Trauma & Neuro center.',
            timestamp: '2026-08-30T09:10:00.000Z'
          },
          {
            id: 'hist_8',
            referralId: 'REF-2026-00127',
            fromStatus: 'SENT',
            toStatus: 'IN_PROGRESS',
            updatedBy: 'ASHA Meena Kumari',
            userRole: 'worker',
            remarks: 'Patient arranged vehicle with family escort.',
            timestamp: '2026-08-30T11:00:00.000Z'
          },
          {
            id: 'hist_9',
            referralId: 'REF-2026-00127',
            fromStatus: 'IN_PROGRESS',
            toStatus: 'REACHED_FACILITY',
            updatedBy: 'Kalyani Reception Desk',
            userRole: 'facility',
            remarks: 'Patient registered at Neuro OPD Desk #4.',
            timestamp: '2026-08-30T14:30:00.000Z'
          },
          {
            id: 'hist_10',
            referralId: 'REF-2026-00127',
            fromStatus: 'REACHED_FACILITY',
            toStatus: 'COMPLETED',
            updatedBy: 'Dr. S. K. Mukherjee (Kalyani)',
            userRole: 'facility',
            remarks: 'Neuro assessment completed. MRI Brain performed. Physical therapy initiated.',
            timestamp: '2026-08-30T16:00:00.000Z'
          }
        ]
      }
    ];

    for (const ref of seedData) {
      this.referrals.set(ref.referralId, ref);
      for (const h of ref.statusHistory) {
        this.historyLogs.push(h);
      }
    }
  }

  public save(referral: Referral): Referral {
    this.referrals.set(referral.referralId, referral);
    return referral;
  }

  public findByReferralId(referralId: string): Referral | null {
    return this.referrals.get(referralId) || null;
  }

  public findById(id: string): Referral | null {
    for (const ref of this.referrals.values()) {
      if (ref.id === id) return ref;
    }
    return null;
  }

  public findAll(): Referral[] {
    return Array.from(this.referrals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public appendHistory(item: ReferralStatusHistoryItem): void {
    this.historyLogs.push(item);
  }

  public getHistoryByReferralId(referralId: string): ReferralStatusHistoryItem[] {
    return this.historyLogs
      .filter((h) => h.referralId === referralId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getNextSequenceNumber(): number {
    return this.referrals.size + 128;
  }
}
