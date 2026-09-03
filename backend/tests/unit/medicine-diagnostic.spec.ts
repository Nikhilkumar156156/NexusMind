/**
 * Unit Tests for Feature Map 06: Medicine Availability & Diagnostic Coordination
 */

import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import { ManageMedicineDiagnosticUseCase } from '../../src/application/use-cases/manage-medicine-diagnostic.use-case.ts';
import type { ActorContext } from '../../src/domain/models/medicine-diagnostic.model.ts';
import { ForbiddenError } from '../../src/domain/rules/medicine-rbac.rules.ts';
import { InMemoryMedicineDiagnosticStore } from '../../src/infrastructure/cache/medicine-diagnostic.store.ts';

describe('Feature 06: Medicine Availability & Diagnostic Coordination', () => {
  let store: InMemoryMedicineDiagnosticStore;
  let useCase: ManageMedicineDiagnosticUseCase;

  const shopOwner1: ActorContext = {
    id: 'owner_pharma_1',
    role: 'shop_owner',
    shopId: 'shop_01',
    name: 'R. K. Gupta (Jan Aushadhi)'
  };

  const patientActor: ActorContext = {
    id: 'MV-MED-2026-1024',
    role: 'patient',
    name: 'Ramesh Mahto'
  };

  const doctorActor: ActorContext = {
    id: 'doc_1',
    role: 'doctor',
    name: 'Dr. Priya Sharma'
  };

  const labStaff1: ActorContext = {
    id: 'owner_lab_1',
    role: 'lab_staff',
    centerId: 'center_01',
    name: 'Dr. S. K. Roy (Pathologist)'
  };

  beforeEach(() => {
    store = new InMemoryMedicineDiagnosticStore();
    useCase = new ManageMedicineDiagnosticUseCase(store);
  });

  // ==========================================
  // SCENARIO 1: OWNER-ONLY WRITE ENFORCEMENT ON SHOP INVENTORY
  // ==========================================
  it('should strictly reject inventory write attempts from non-owner roles (patient, doctor, worker)', async () => {
    // Attempt to add inventory as a patient
    await assert.rejects(
      async () => {
        await useCase.addInventoryItem('shop_01', patientActor, {
          medicineName: 'Aspirin 100mg',
          quantity: 50
        });
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenError || err.message.includes('not authorized'));
        return true;
      }
    );

    // Attempt to edit inventory as another shop's owner
    const rogueOwner: ActorContext = {
      id: 'owner_pharma_2',
      role: 'shop_owner',
      shopId: 'shop_02'
    };

    await assert.rejects(
      async () => {
        await useCase.updateInventoryItem('shop_01', 'inv_01', rogueOwner, {
          quantity: 0
        });
      },
      (err: any) => {
        assert.ok(err instanceof ForbiddenError || err.message.includes('Access denied'));
        return true;
      }
    );
  });

  // ==========================================
  // SCENARIO 2: SHOP OWNER INVENTORY CRUD
  // ==========================================
  it('should allow authenticated shop owner to perform full CRUD on their own inventory', async () => {
    // 1. Add Medicine
    const newItem = await useCase.addInventoryItem('shop_01', shopOwner1, {
      medicineName: 'Atorvastatin 40mg',
      genericName: 'Atorvastatin Calcium',
      dosageForm: 'Tablet',
      strength: '40mg',
      quantity: 50,
      price: 95.0
    });

    assert.ok(newItem.inventoryId);
    assert.equal(newItem.medicineName, 'Atorvastatin 40mg');
    assert.equal(newItem.status, 'in_stock');

    // 2. Update Medicine
    const updated = await useCase.updateInventoryItem('shop_01', newItem.inventoryId, shopOwner1, {
      quantity: 0
    });
    assert.equal(updated.quantity, 0);
    assert.equal(updated.status, 'out_of_stock');

    // 3. Delete Medicine
    const delRes = await useCase.deleteInventoryItem('shop_01', newItem.inventoryId, shopOwner1);
    assert.equal(delRes.success, true);

    const check = store.getInventoryItemById(newItem.inventoryId);
    assert.equal(check, undefined);
  });

  // ==========================================
  // SCENARIO 3: GEO-PROXIMITY SEARCH & OUT-OF-RADIUS FALLBACK
  // ==========================================
  it('should rank nearby shops by distance and provide out-of-radius fallback when local stock is depleted', async () => {
    // Search for Telmisartan (available in Katkamsandi nearby)
    const localRes = await useCase.searchMedicines('Telmisartan', 23.998, 85.345, 25);
    assert.equal(localRes.isFallback, false);
    assert.ok(localRes.results.length >= 1);
    assert.equal(localRes.results[0].medicine.medicineName, 'Telmisartan 40mg');
    assert.ok(localRes.results[0].distanceKm <= 5);

    // Search for rare emergency medicine 'Tenecteplase' (only in Ranchi 62 km away)
    const rareRes = await useCase.searchMedicines('Tenecteplase', 23.998, 85.345, 25);
    assert.equal(rareRes.isFallback, true);
    assert.ok(rareRes.results.length >= 1);
    assert.equal(rareRes.results[0].medicine.medicineName, 'Tenecteplase 50mg Injection');
    assert.ok(rareRes.results[0].distanceKm > 50); // Surfaces nearest option beyond radius
    assert.ok(rareRes.message.includes('Nearest available stock located at'));
  });

  // ==========================================
  // SCENARIO 4: RESERVATION-BASED ORDER CREATION & OWNER CONFIRMATION
  // ==========================================
  it('should allow patient to place order reservation and shop owner to confirm it', async () => {
    const order = await useCase.createMedicineOrder({
      patientId: 'MV-MED-2026-1024',
      patientName: 'Ramesh Mahto',
      patientPhone: '+91-94311-28901',
      shopId: 'shop_01',
      inventoryId: 'inv_02',
      quantityRequested: 30
    });

    assert.ok(order.orderId);
    assert.equal(order.status, 'requested');
    assert.equal(order.medicineName, 'Telmisartan 40mg');

    // Shop owner views incoming orders
    const shopOrders = await useCase.getShopOrders('shop_01', shopOwner1);
    assert.ok(shopOrders.some((o) => o.orderId === order.orderId));

    // Shop owner confirms order
    const confirmed = await useCase.updateMedicineOrderStatus(
      'shop_01',
      order.orderId,
      shopOwner1,
      'confirmed',
      'Packed and kept at counter #1'
    );

    assert.equal(confirmed.status, 'confirmed');
    assert.ok(confirmed.confirmedAt);
    assert.equal(confirmed.ownerNotes, 'Packed and kept at counter #1');
  });

  // ==========================================
  // SCENARIO 5: DIAGNOSTIC TEST SEARCH & DIRECT BOOKING
  // ==========================================
  it('should support direct search and booking of diagnostic tests without requiring doctor order', async () => {
    const searchRes = await useCase.searchDiagnosticTests('Lipid Profile', 23.994, 85.364, 30);
    assert.ok(searchRes.results.length >= 1);
    assert.equal(searchRes.results[0].test.testName, 'Lipid Profile Panel (Cholesterol, Triglycerides, HDL, LDL)');

    const booking = await useCase.bookDiagnosticTest({
      patientId: 'MV-MED-2026-2048',
      patientName: 'Sunita Soren',
      patientPhone: '+91-98352-19203',
      centerId: 'center_01',
      testOfferingId: 'test_03'
    });

    assert.ok(booking.orderId);
    assert.equal(booking.source, 'direct_search');
    assert.equal(booking.status, 'sample_pending');
  });

  // ==========================================
  // SCENARIO 6: DOCTOR-ORDERED DIAGNOSTIC STATUS PROGRESSION & DUAL RESULT VIEW
  // ==========================================
  it('should track doctor-ordered diagnostic progression (sample_pending -> delivered) with dual result view', async () => {
    // 1. Doctor initiates order during teleconsult
    const docOrder = await useCase.createDoctorDiagnosticOrder({
      patientId: 'MV-MED-2026-1024',
      patientName: 'Ramesh Mahto',
      patientPhone: '+91-94311-28901',
      centerId: 'center_02',
      testOfferingId: 'test_06', // Troponin-I
      doctor: {
        id: 'doc_1',
        name: 'Dr. Priya Sharma',
        role: 'doctor'
      }
    });

    assert.equal(docOrder.source, 'doctor_ordered');
    assert.equal(docOrder.status, 'sample_pending');

    // 2. Lab collects sample -> in_progress
    const inProgress = await useCase.updateDiagnosticOrderStatus(
      'center_02',
      docOrder.orderId,
      { id: 'owner_lab_2', role: 'lab_staff', centerId: 'center_02' },
      'in_progress'
    );
    assert.equal(inProgress.status, 'in_progress');
    assert.ok(inProgress.sampleCollectedAt);

    // 3. Lab uploads results -> result_ready
    const readyOrder = await useCase.updateDiagnosticOrderStatus(
      'center_02',
      docOrder.orderId,
      { id: 'owner_lab_2', role: 'lab_staff', centerId: 'center_02' },
      'result_ready',
      {
        clinicalSummary: 'Troponin-I within normal limits (<0.04 ng/mL). Acute STEMI excluded.',
        parameters: [
          { name: 'Troponin-I High Sensitivity', value: '0.012', unit: 'ng/mL', referenceRange: '0.000 - 0.040', isAbnormal: false }
        ],
        patientFriendlySummary: 'Your heart enzyme test is normal and shows no acute heart attack damage.',
        certifiedBy: 'Dr. Pathologist'
      }
    );

    assert.equal(readyOrder.status, 'result_ready');
    assert.ok(readyOrder.resultData);
    assert.equal(readyOrder.resultData.parameters[0].isAbnormal, false);
    assert.ok(readyOrder.resultData.patientFriendlySummary.includes('normal'));

    // 4. Delivered to doctor & patient longitudinal EHR
    const delivered = await useCase.updateDiagnosticOrderStatus(
      'center_02',
      docOrder.orderId,
      { id: 'owner_lab_2', role: 'lab_staff', centerId: 'center_02' },
      'delivered'
    );
    assert.equal(delivered.status, 'delivered');
    assert.ok(delivered.deliveredAt);
  });
});
