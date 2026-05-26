import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '../templates/devis-template.html');

export async function generatePDF(devis) {
  const source = readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(source);
  const html = template(devis);

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    return pdf;
  } finally {
    await browser.close();
  }
}
