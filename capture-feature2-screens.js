import puppeteer from 'puppeteer';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/Nikhil Kumar/.gemini/antigravity/brain/618aea62-eae7-4740-b5e5-bf41333bb543';

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Capture Homepage
  await page.goto('http://localhost:3000/#home', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_home.png') });
  console.log('Captured screen_home.png');

  // 2. Capture Feature 02 Entry
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Teleconsultation (F02)'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_1_entry.png') });
  console.log('Captured screen_f02_1_entry.png');

  // 3. Capture Feature 02 Booking (Assisted Path)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue as Frontline Worker'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_2_booking.png') });
  console.log('Captured screen_f02_2_booking.png');

  // 4. Capture Booking Confirmation & SMS Simulation
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm Booking'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_3_sms_confirmed.png') });
  console.log('Captured screen_f02_3_sms_confirmed.png');

  // 5. Capture Priority Queue Tracker
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Priority Queue'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_4_queue.png') });
  console.log('Captured screen_f02_4_queue.png');

  // 6. Capture Degrading Consultation Room (Video Call)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Join Teleconsultation Room Now'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_5_videocall.png') });
  console.log('Captured screen_f02_5_videocall.png');

  // 7. Capture Audio-Only Degradation Mode
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Audio (Low BW)'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_6_audiocall.png') });
  console.log('Captured screen_f02_6_audiocall.png');

  // 8. Capture In-App Chat Degradation Mode
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('In-App Chat (2G)'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_7_inappchat.png') });
  console.log('Captured screen_f02_7_inappchat.png');

  // 9. Capture Doctor Documentation Workspace
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Doctor Rx'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_8_doctor_rx.png') });
  console.log('Captured screen_f02_8_doctor_rx.png');

  // 10. Capture Digital Consultation Summary & QR Record
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign & Issue Digital EMR Consultation Summary'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen_f02_9_summary_pass.png') });
  console.log('Captured screen_f02_9_summary_pass.png');

  await browser.close();
  console.log('All screens successfully captured and saved to artifact directory!');
}
capture().catch(console.error);
