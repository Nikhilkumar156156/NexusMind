/**
 * Feature Map 07 — Facility Dashboard Domain Models
 * Multi-Source Aggregation Layer across Features 01 - 06
 */

export type AlertType =
  | 'high_risk_patient'
  | 'critical_resource'
  | 'emergency_case'
  | 'missed_follow_up'
  | 'system_data_update';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export type ResourceType = 'bed' | 'icu_bed' | 'ambulance' | 'oxygen' | 'ventilator';

export type DashboardActorRole = 'facility' | 'admin' | 'doctor' | 'worker' | 'patient';

export type DashboardSection =
  | 'overview'
  | 'patient_care'
  | 'appointments_queue'
  | 'service_resource'
  | 'analytics'
  | 'alerts';

export interface FacilityAlert {
  alertId: string;
  facilityId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  relatedEntityId?: string;
  message: string;
  status: AlertStatus;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface FacilityResourceStatus {
  facilityId: string;
  resourceType: ResourceType;
  resourceName: string;
  totalCount: number;
  availableCount: number;
  lastUpdated: string;
  isStale?: boolean;
}

export interface DashboardActorContext {
  actorId: string;
  role: DashboardActorRole;
  facilityId?: string;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  severity?: AlertSeverity;
  actor?: string;
}

export interface DashboardOverviewSummary {
  facilityId: string;
  facilityName: string;
  totalPatientsServed: number;
  appointmentsToday: number;
  highRiskUnderFollowUp: number;
  criticalAlertsCount: number;
  activeQueueCount: number;
  careContinuityIndex: number; // 0 - 100 percentage
  recentActivities: RecentActivityItem[];
}

export interface CareContinuityChain {
  patientId: string;
  patientName: string;
  chainComplete: boolean;
  stages: {
    triage: boolean;
    teleconsult: boolean;
    referral: boolean;
    followUp: boolean;
  };
  lastActivityDate: string;
}

export interface DashboardPatientCare {
  facilityId: string;
  activeQueueCount: number;
  highRiskPatientsCount: number;
  highRiskPatients: Array<{
    patientId: string;
    patientName: string;
    phone: string;
    riskScore: number;
    riskLevel: string;
    primaryCondition: string;
    assignedWorkerName: string;
    lastFollowUpDate: string;
    trend: string;
  }>;
  incomingReferrals: Array<{
    referralId: string;
    patientName: string;
    referringDoctorName: string;
    priority: string;
    status: string;
    createdAt: string;
  }>;
  outgoingReferrals: Array<{
    referralId: string;
    patientName: string;
    receivingFacilityName: string;
    priority: string;
    status: string;
    createdAt: string;
  }>;
  careContinuityChains: CareContinuityChain[];
}

export interface DashboardAppointmentQueue {
  facilityId: string;
  totalToday: number;
  completedCount: number;
  inProgressCount: number;
  waitingCount: number;
  avgWaitTimeMinutes: number;
  walkInCount: number;
  bookedCount: number;
  liveQueue: Array<{
    queueId: string;
    appointmentId?: string;
    patientName: string;
    urgencyTier: string;
    priorityScore: number;
    waitDurationMinutes: number;
    status: string;
    isWalkIn: boolean;
  }>;
  peakHourMetrics: Array<{
    hour: string;
    patientCount: number;
  }>;
}

export interface DashboardServiceResource {
  facilityId: string;
  departments: Array<{
    departmentId: string;
    name: string;
    status: 'operational' | 'busy' | 'full' | 'maintenance';
    headDoctor: string;
    availableBeds: number;
    totalBeds: number;
    utilizationPercent: number;
  }>;
  doctorsOnDuty: Array<{
    doctorId: string;
    name: string;
    specialty: string;
    status: 'available' | 'in_consultation' | 'off_duty';
    activeConsultations: number;
  }>;
  resources: FacilityResourceStatus[];
  diagnosticServicesStatus: Array<{
    testName: string;
    category: string;
    turnaroundTime: string;
    status: string;
  }>;
  criticalMedicinesStock: Array<{
    medicineName: string;
    quantity: number;
    status: string;
    price?: number;
  }>;
  emergencyReadinessScore: number; // 0 - 100
}

export interface DashboardAnalytics {
  facilityId: string;
  dateRange: {
    start: string;
    end: string;
  };
  footfallTrends: Array<{
    date: string;
    totalCount: number;
    emergencyCount: number;
    opdCount: number;
  }>;
  diseaseCategoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  referralAnalytics: {
    totalIncoming: number;
    totalOutgoing: number;
    bySpecialty: Array<{
      specialty: string;
      count: number;
    }>;
  };
  departmentUtilization: Array<{
    department: string;
    utilizationPercent: number;
  }>;
  highRiskCompletionRate: number; // 0 - 100 percentage
}
