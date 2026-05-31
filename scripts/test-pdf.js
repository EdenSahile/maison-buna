import { generatePDF } from '../services/pdfService.js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fmt = n => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const now = new Date();
const validite = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const formatDate = d => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const devisTest = {
  id: 'test-1234-abcd-5678',
  timestamp: now.toISOString(),
  devis_numero: `MB-${now.getFullYear()}-TEST1234`,
  date_emission: formatDate(now),
  date_validite: formatDate(validite),
  societe: 'Startup Café SAS',
  prenom: 'Marie',
  nom: 'Dupont',
  email: 'marie@startup.fr',
  telephone: '06 12 34 56 78',
  collaborateurs: '11 - 25',
  secteur: 'Tech / Startup',
  adresse: '',
  codepostal: '',
  ville: 'Paris',
  quantite: '1 – 3 kg',
  frequence: 'Mensuelle',
  moutures: ['Grains entiers', 'Mouture filtre'],
  message: 'Nous souhaitons découvrir vos cafés éthiopiens pour notre espace détente.',
  cafes: ['Limmu', 'Yirgacheffe'],
  pricing_rows: [
    { cafe: 'Limmu',       region: 'Région Limmu · Éthiopie',       designation: 'Café arabica de spécialité — Éthiopien grade 1, torréfié artisanalement en France', qte_label: '1 kg', pu_ttc_fmt: fmt(52.00), total_ttc_fmt: fmt(52.00) },
    { cafe: 'Yirgacheffe', region: 'Région Yirgacheffe · Éthiopie', designation: 'Café arabica de spécialité — Éthiopien grade 1, torréfié artisanalement en France', qte_label: '1 kg', pu_ttc_fmt: fmt(52.00), total_ttc_fmt: fmt(52.00) },
  ],
  grand_total_fmt: fmt(104.00),
  sur_devis: false,
  is_particulier: false,
};

const pdfBuffer = await generatePDF(devisTest);
const outputPath = join(__dirname, 'test-output.pdf');
writeFileSync(outputPath, pdfBuffer);
console.log(`PDF généré : ${outputPath} (${pdfBuffer.length} bytes)`);
