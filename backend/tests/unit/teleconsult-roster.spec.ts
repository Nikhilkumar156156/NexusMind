import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryTeleconsultStore } from '../../src/infrastructure/cache/teleconsult.cache.ts';
import { TeleconsultBookingUseCase } from '../../src/application/use-cases/teleconsult-booking.use-case.ts';

describe('Feature 02: Doctor Roster & Multi-Facility Booking', () => {
  it('should query doctors filtered by specialty across rotating facilities', async () => {
    const store = new InMemoryTeleconsultStore();
    const bookingUseCase = new TeleconsultBookingUseCase(store);

    const neuroDoctors = await bookingUseCase.getRoster(undefined, 'Neurology');
    assert.ok(neuroDoctors.length >= 1);
    assert.equal(neuroDoctors[0].name, 'Dr. Priya Sharma');
    assert.ok(neuroDoctors[0].facilityIds.includes('fac_sbmch'));
    assert.ok(neuroDoctors[0].facilityIds.includes('fac_sadar'));
  });

  it('should fetch available slots and book an appointment with simulated confirmation SMS', async () => {
    const store = new InMemoryTeleconsultStore();
    const bookingUseCase = new TeleconsultBookingUseCase(store);

    const slots = await bookingUseCase.getSlots('doc_1', 'Neurology');
    assert.ok(slots.length > 0);
    assert.ok(slots[0].isAvailable);

    const { appointment, smsSimulation } = await bookingUseCase.bookAppointment({
      patientName: 'Ramesh Mahto',
      patientAge: 52,
      patientSex: 'male',
      patientLocation: 'Hazaribagh',
      specialty: 'Neurology',
      doctorId: 'doc_1',
      facilityId: 'fac_sbmch',
      scheduledTime: '10:00 AM',
      urgencyTier: 'ROUTINE',
      bookedBy: 'worker',
      workerName: 'ASHA Anita Kumari',
      symptomsSummary: 'Recurrent morning headaches for 2 weeks'
    });

    assert.ok(appointment.id.startsWith('APT-'));
    assert.equal(appointment.patientName, 'Ramesh Mahto');
    assert.equal(appointment.doctorName, 'Dr. Priya Sharma');
    assert.equal(appointment.bookedBy, 'worker');
    assert.match(smsSimulation.messageText, /Teleconsult confirmed/i);
    assert.match(smsSimulation.recipient, /ASHA Anita Kumari/i);
  });
});
