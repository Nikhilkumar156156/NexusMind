import { execFileSync } from 'node:child_process';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = 'C:\\Users\\Nikhil Kumar\\.gemini\\antigravity\\brain\\618aea62-eae7-4740-b5e5-bf41333bb543';

const targets = [
  { name: 'screen_home.png', url: 'http://localhost:3000/#home' },
  { name: 'screen_f01_1_profile.png', url: 'http://localhost:3000/#screen=1' },
  { name: 'screen_f01_5_triage.png', url: 'http://localhost:3000/#screen=5' },
  { name: 'screen_f01_7_facilities.png', url: 'http://localhost:3000/#screen=7' },
  { name: 'screen_f01_9_referral.png', url: 'http://localhost:3000/#screen=9' },
  { name: 'screen_f02_1_entry.png', url: 'http://localhost:3000/#teleconsult=entry' },
  { name: 'screen_f02_2_booking.png', url: 'http://localhost:3000/#teleconsult=booking' },
  { name: 'screen_f02_3_queue.png', url: 'http://localhost:3000/#teleconsult=queue' },
  { name: 'screen_f02_4_call.png', url: 'http://localhost:3000/#teleconsult=call' },
  { name: 'screen_f02_5_doctor.png', url: 'http://localhost:3000/#teleconsult=doctor' },
  { name: 'screen_f02_6_summary.png', url: 'http://localhost:3000/#teleconsult=summary' },
  { name: 'screen_f03_1_doctor.png', url: 'http://localhost:3000/#referrals-doctor' },
  { name: 'screen_f03_2_worker.png', url: 'http://localhost:3000/#referrals-worker' },
  { name: 'screen_f03_3_facility.png', url: 'http://localhost:3000/#referrals-facility' },
  { name: 'screen_f03_4_patient.png', url: 'http://localhost:3000/#referrals-patient' },
  { name: 'screen_f04_1_doctor.png', url: 'http://localhost:3000/#followups-doctor' },
  { name: 'screen_f04_2_worker.png', url: 'http://localhost:3000/#followups-worker' },
  { name: 'screen_f04_3_facility.png', url: 'http://localhost:3000/#followups-facility' },
  { name: 'screen_f04_4_patient.png', url: 'http://localhost:3000/#followups-patient' },
  { name: 'screen_f05_1_card_timeline.png', url: 'http://localhost:3000/#records-patient' },
  { name: 'screen_f05_2_doctor_access.png', url: 'http://localhost:3000/#records-doctor' },
  { name: 'screen_f05_3_worker_view.png', url: 'http://localhost:3000/#records-worker' },
  { name: 'screen_f06_1_medicine_search.png', url: 'http://localhost:3000/#medicine' },
  { name: 'screen_f06_2_shop_owner.png', url: 'http://localhost:3000/#shop-owner' },
  { name: 'screen_f06_3_diagnostic_search.png', url: 'http://localhost:3000/#diagnostic' },
  { name: 'screen_f06_4_lab_dashboard.png', url: 'http://localhost:3000/#lab-staff' },
  { name: 'screen_f06_5_doctor_orders.png', url: 'http://localhost:3000/#doctor-orders' },
  { name: 'screen_f07_1_overview.png', url: 'http://localhost:3000/#dashboard-overview' },
  { name: 'screen_f07_2_patient_care.png', url: 'http://localhost:3000/#dashboard-care' },
  { name: 'screen_f07_3_queue.png', url: 'http://localhost:3000/#dashboard-queue' },
  { name: 'screen_f07_4_resources.png', url: 'http://localhost:3000/#dashboard-resources' },
  { name: 'screen_f07_5_analytics.png', url: 'http://localhost:3000/#dashboard-analytics' },
  { name: 'screen_f07_6_alerts.png', url: 'http://localhost:3000/#dashboard-alerts' },
  { name: 'screen_about.png', url: 'http://localhost:3000/#about' }
];

for (const target of targets) {
  const outPath = path.join(outputDir, target.name);
  console.log(`Capturing ${target.name} from ${target.url}...`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--user-data-dir=d:\\NexusMind\\chrome-temp',
      '--virtual-time-budget=2500',
      `--screenshot=${outPath}`,
      '--window-size=1280,900',
      target.url
    ]);
    console.log(`Saved: ${target.name}`);
  } catch (err) {
    console.error(`Error capturing ${target.name}:`, err.message);
  }
}
console.log('All screens captured successfully!');
