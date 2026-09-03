import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire('C:/Users/Nikhil Kumar/AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/dummy.js');
const sucrase = require('sucrase');

const inputPath = 'd:/NexusMind/frontend/public/app.js';
const outputPath = 'd:/NexusMind/frontend/public/app.compiled.js';

const inputCode = fs.readFileSync(inputPath, 'utf8');
const result = sucrase.transform(inputCode, { transforms: ['jsx'] });

fs.writeFileSync(outputPath, result.code, 'utf8');
console.log('Successfully compiled app.js -> app.compiled.js (' + result.code.length + ' bytes)');
