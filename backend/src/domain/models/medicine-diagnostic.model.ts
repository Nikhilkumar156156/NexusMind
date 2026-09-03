/**
 * Domain Models for Feature Map 06: Medicine Availability & Diagnostic Coordination
 */

export type MedicineStockStatus = 'in_stock' | 'out_of_stock';
export type MedicineOrderRequestStatus = 'requested' | 'confirmed' | 'unavailable' | 'picked_up';
export type DiagnosticTestOfferingStatus = 'available' | 'unavailable';
export type DiagnosticOrderStatus = 'sample_pending' | 'in_progress' | 'result_ready' | 'delivered';
export type DiagnosticOrderSource = 'doctor_ordered' | 'direct_search';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface MedicalShop {
  shopId: string;
  ownerId: string;
  name: string;
  location: GeoLocation;
  contactNumber: string;
  openingHours?: string;
  rating?: number;
  isVerified?: boolean;
}

export interface MedicineInventoryItem {
  inventoryId: string;
  shopId: string;
  medicineName: string;
  genericName?: string;
  dosageForm?: string; // Tablet, Syrup, Injection, Capsule
  strength?: string;   // e.g. 500mg, 40mg
  quantity: number;
  status: MedicineStockStatus;
  price?: number;      // INR
  lastUpdated: string;
}

export interface MedicineOrderRequest {
  orderId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  shopId: string;
  shopName: string;
  inventoryId: string;
  medicineName: string;
  quantityRequested: number;
  status: MedicineOrderRequestStatus;
  requestedAt: string;
  confirmedAt?: string;
  ownerNotes?: string;
}

export interface DiagnosticCenter {
  centerId: string;
  ownerId: string;
  name: string;
  location: GeoLocation;
  contactNumber: string;
  accreditation?: string; // NABL, Govt Certified, NABH
  operationalStatus: 'operational' | 'closed';
  rating?: number;
}

export interface DiagnosticTestOffering {
  testOfferingId: string;
  centerId: string;
  testName: string;
  category: 'blood' | 'radiology' | 'pathology' | 'cardiac' | 'general';
  status: DiagnosticTestOfferingStatus;
  turnaroundTime: string; // e.g. "Same Day (3 hrs)", "24 hours", "2 days"
  price?: number;
  fastingRequired: boolean;
  sampleType?: string; // e.g. "Venous Blood", "Urine", "Digital Imaging"
  lastUpdated: string;
}

export interface DiagnosticLabParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface DiagnosticOrderResultData {
  clinicalSummary: string;
  parameters: DiagnosticLabParameter[];
  patientFriendlySummary: string;
  certifiedBy?: string;
}

export interface DiagnosticOrder {
  orderId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  centerId: string;
  centerName: string;
  testOfferingId: string;
  testName: string;
  source: DiagnosticOrderSource;
  status: DiagnosticOrderStatus;
  orderedBy?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  sampleCollectedAt?: string;
  resultReadyAt?: string;
  deliveredAt?: string;
  resultData?: DiagnosticOrderResultData;
  centerNotes?: string;
}

export interface MedicineSearchResultItem {
  medicine: MedicineInventoryItem;
  shop: MedicalShop;
  distanceKm: number;
  isNearby: boolean; // within search radius
  isSubstitute?: boolean;
}

export interface DiagnosticSearchResultItem {
  test: DiagnosticTestOffering;
  center: DiagnosticCenter;
  distanceKm: number;
  isNearby: boolean;
}

export interface ActorContext {
  id: string;
  role: 'patient' | 'worker' | 'doctor' | 'shop_owner' | 'lab_staff' | 'admin';
  name?: string;
  shopId?: string;
  centerId?: string;
}
