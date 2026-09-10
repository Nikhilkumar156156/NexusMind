import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = 'C:\\Users\\shusant\\.gemini\\antigravity-ide\\brain\\eb57e389-b316-4b8c-a06a-76caf8fa1b87';
const tempUserDataDir = path.join(process.cwd(), 'chrome-temp-f8');

if (!fs.existsSync(tempUserDataDir)) {
  fs.mkdirSync(tempUserDataDir, { recursive: true });
}

const targets = [
  { name: 'screen_f08_1_scheme_finder.png', url: 'http://localhost:3000/#feature8', size: '1280,1100' },
  { name: 'screen_f08_2_home_cards.png', url: 'http://localhost:3000/#home', size: '1280,2400' }
];

for (const target of targets) {
  const outPath = path.join(outputDir, target.name);
  console.log(`Capturing ${target.name} from ${target.url}...`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      `--user-data-dir=${tempUserDataDir}`,
      '--virtual-time-budget=3000',
      `--screenshot=${outPath}`,
      `--window-size=${target.size}`,
      target.url
    ]);
    console.log(`Saved: ${target.name}`);
  } catch (err) {
    console.error(`Error capturing ${target.name}:`, err.message);
  }
}
