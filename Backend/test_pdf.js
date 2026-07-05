import { createRequire } from 'module';
import fs from 'fs/promises';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');

async function run() {
  const buffer = Buffer.from('%PDF-1.5 ...'); // dummy pdf header
  try {
    const parser = new pdfParseModule.PDFParse({ data: buffer });
    console.log('Parser instantiated successfully');
    await parser.getText();
  } catch (err) {
    console.log('Error caught:', err.name || 'Error', '-', err.message);
  }
}
run();
