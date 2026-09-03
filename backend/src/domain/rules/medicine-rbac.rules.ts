/**
 * Domain Rules for Feature Map 06: Medicine Availability & Diagnostic Coordination
 * RBAC validation, Geo-proximity ranking, and Out-of-radius search fallback rules.
 */

import type {
  ActorContext,
  DiagnosticCenter,
  DiagnosticSearchResultItem,
  DiagnosticTestOffering,
  MedicalShop,
  MedicineInventoryItem,
  MedicineSearchResultItem
} from '../models/medicine-diagnostic.model.ts';

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Validates whether the actor has write permission on the shop's inventory.
 * Strict RBAC invariant: Non-owner roles (patients, workers, doctors) cannot write to inventory.
 */
export function validateShopInventoryAccess(actor: ActorContext, shop: MedicalShop): void {
  if (!actor || !actor.id) {
    throw new UnauthorizedError('Authentication required to modify shop inventory.');
  }

  if (actor.role === 'admin') {
    return;
  }

  if (actor.role !== 'shop_owner') {
    throw new ForbiddenError(
      `Role '${actor.role}' is not authorized to modify shop inventory. Only registered medical shop owners can perform inventory CRUD operations.`
    );
  }

  if (actor.id !== shop.ownerId && (!actor.shopId || actor.shopId !== shop.shopId)) {
    throw new ForbiddenError(
      `Access denied. You do not own shop '${shop.name}' (Shop ID: ${shop.shopId}). Shop owners can only manage their own inventory.`
    );
  }
}

/**
 * Validates whether the actor has write permission on the diagnostic center's catalog and orders.
 * Strict RBAC invariant: Non-staff roles cannot modify test catalog or post results.
 */
export function validateDiagnosticCenterAccess(actor: ActorContext, center: DiagnosticCenter): void {
  if (!actor || !actor.id) {
    throw new UnauthorizedError('Authentication required to modify diagnostic catalog.');
  }

  if (actor.role === 'admin') {
    return;
  }

  if (actor.role !== 'lab_staff') {
    throw new ForbiddenError(
      `Role '${actor.role}' is not authorized to modify diagnostic center offerings. Only registered diagnostic center staff can manage test catalogs.`
    );
  }

  if (actor.id !== center.ownerId && (!actor.centerId || actor.centerId !== center.centerId)) {
    throw new ForbiddenError(
      `Access denied. You do not manage diagnostic center '${center.name}' (Center ID: ${center.centerId}).`
    );
  }
}

/**
 * Haversine formula to compute distance in km between two geo coordinates.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Ranks medicine search results by stock status, proximity, and freshness.
 * Implements fallback: If 0 matching shops exist within radius, returns nearest available shops beyond radius.
 */
export function rankMedicineShops(
  allShops: MedicalShop[],
  allInventory: MedicineInventoryItem[],
  targetLat: number,
  targetLng: number,
  query: string,
  searchRadiusKm: number = 25
): { results: MedicineSearchResultItem[]; isFallback: boolean; message: string } {
  const normQuery = (query || '').toLowerCase().trim();
  const shopMap = new Map<string, MedicalShop>(allShops.map((s) => [s.shopId, s]));

  const matchingItems: Array<{ item: MedicineInventoryItem; shop: MedicalShop; distance: number; isSub: boolean }> = [];

  for (const item of allInventory) {
    const shop = shopMap.get(item.shopId);
    if (!shop) continue;

    const nameMatch = item.medicineName.toLowerCase().includes(normQuery);
    const genericMatch = item.genericName?.toLowerCase().includes(normQuery) || false;

    if (nameMatch || genericMatch) {
      const distance = calculateHaversineDistance(
        targetLat,
        targetLng,
        shop.location.lat,
        shop.location.lng
      );
      matchingItems.push({
        item,
        shop,
        distance,
        isSub: !nameMatch && genericMatch
      });
    }
  }

  // Sort by: 1) in_stock first, 2) distance ascending, 3) freshness
  matchingItems.sort((a, b) => {
    if (a.item.status === 'in_stock' && b.item.status !== 'in_stock') return -1;
    if (a.item.status !== 'in_stock' && b.item.status === 'in_stock') return 1;
    if (a.distance !== b.distance) return a.distance - b.distance;
    return new Date(b.item.lastUpdated).getTime() - new Date(a.item.lastUpdated).getTime();
  });

  const withinRadius = matchingItems.filter((m) => m.distance <= searchRadiusKm && m.item.status === 'in_stock');

  if (withinRadius.length > 0) {
    const results: MedicineSearchResultItem[] = withinRadius.map((m) => ({
      medicine: m.item,
      shop: m.shop,
      distanceKm: m.distance,
      isNearby: true,
      isSubstitute: m.isSub
    }));
    return {
      results,
      isFallback: false,
      message: `Found ${results.length} nearby medical shops with '${query}' in stock within ${searchRadiusKm} km.`
    };
  }

  // Fallback: If 0 in-stock results nearby, return nearest available option beyond radius or out-of-stock nearby
  const inStockBeyondRadius = matchingItems.filter((m) => m.item.status === 'in_stock');
  if (inStockBeyondRadius.length > 0) {
    const results: MedicineSearchResultItem[] = inStockBeyondRadius.slice(0, 5).map((m) => ({
      medicine: m.item,
      shop: m.shop,
      distanceKm: m.distance,
      isNearby: false,
      isSubstitute: m.isSub
    }));
    const nearestDist = results[0].distanceKm;
    return {
      results,
      isFallback: true,
      message: `No nearby shops have '${query}' within ${searchRadiusKm} km. Nearest available stock located at ${results[0].shop.name} (${nearestDist} km away).`
    };
  }

  // If completely out of stock everywhere, show the closest shops with the catalog listing
  const results: MedicineSearchResultItem[] = matchingItems.slice(0, 5).map((m) => ({
    medicine: m.item,
    shop: m.shop,
    distanceKm: m.distance,
    isNearby: m.distance <= searchRadiusKm,
    isSubstitute: m.isSub
  }));

  return {
    results,
    isFallback: true,
    message: results.length > 0
      ? `'${query}' is currently out of stock across nearby shops. Listed nearest suppliers above.`
      : `No registered shops carry '${query}'.`
  };
}

/**
 * Ranks diagnostic center test offerings by availability, proximity, and turnaround time.
 */
export function rankDiagnosticCenters(
  allCenters: DiagnosticCenter[],
  allTests: DiagnosticTestOffering[],
  targetLat: number,
  targetLng: number,
  query: string,
  searchRadiusKm: number = 30
): { results: DiagnosticSearchResultItem[]; isFallback: boolean; message: string } {
  const normQuery = (query || '').toLowerCase().trim();
  const centerMap = new Map<string, DiagnosticCenter>(allCenters.map((c) => [c.centerId, c]));

  const matchingTests: Array<{ test: DiagnosticTestOffering; center: DiagnosticCenter; distance: number }> = [];

  for (const test of allTests) {
    const center = centerMap.get(test.centerId);
    if (!center || center.operationalStatus === 'closed') continue;

    const testMatch = test.testName.toLowerCase().includes(normQuery);
    const catMatch = test.category.toLowerCase().includes(normQuery);

    if (testMatch || catMatch) {
      const distance = calculateHaversineDistance(
        targetLat,
        targetLng,
        center.location.lat,
        center.location.lng
      );
      matchingTests.push({ test, center, distance });
    }
  }

  // Sort: 1) available status first, 2) distance ascending
  matchingTests.sort((a, b) => {
    if (a.test.status === 'available' && b.test.status !== 'available') return -1;
    if (a.test.status !== 'available' && b.test.status === 'available') return 1;
    return a.distance - b.distance;
  });

  const withinRadius = matchingTests.filter((m) => m.distance <= searchRadiusKm && m.test.status === 'available');

  if (withinRadius.length > 0) {
    const results: DiagnosticSearchResultItem[] = withinRadius.map((m) => ({
      test: m.test,
      center: m.center,
      distanceKm: m.distance,
      isNearby: true
    }));
    return {
      results,
      isFallback: false,
      message: `Found ${results.length} diagnostic centers offering '${query}' within ${searchRadiusKm} km.`
    };
  }

  // Fallback: nearest beyond radius
  const results: DiagnosticSearchResultItem[] = matchingTests.slice(0, 5).map((m) => ({
    test: m.test,
    center: m.center,
    distanceKm: m.distance,
    isNearby: m.distance <= searchRadiusKm
  }));

  return {
    results,
    isFallback: true,
    message: results.length > 0
      ? `No centers offering '${query}' within ${searchRadiusKm} km. Nearest option is ${results[0].center.name} (${results[0].distanceKm} km away).`
      : `No registered diagnostic centers offer '${query}'.`
  };
}
