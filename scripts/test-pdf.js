import { generatePDF } from '../services/pdfService.js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const devisTest = {
  id: 'test-1234-abcd-5678',
  timestamp: new Date().toISOString(),
  societe: 'Startup Café SAS',
  prenom: 'Marie',
  nom: 'Dupont',
  email: 'marie@startup.fr',
  telephone: '06 12 34 56 78',
  collaborateurs: '11 - 25',
  secteur: 'Tech / Startup',
  ville: 'Paris',
  quantite: '1 – 3 kg',
  frequence: 'Mensuelle',
  moutures: ['Grains entiers', 'Mouture filtre'],
  message: 'Nous souhaitons découvrir vos cafés éthiopiens pour notre espace détente.'
};

const pdfBuffer = await generatePDF(devisTest);
const outputPath = join(__dirname, 'test-output.pdf');
writeFileSync(outputPath, pdfBuffer);
console.log(`PDF généré : ${outputPath} (${pdfBuffer.length} bytes)`);
