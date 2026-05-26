import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const HANDOFFS_DIR = 'handoffs';

if (!existsSync(HANDOFFS_DIR)) {
  console.log('📁 Aucun handoff trouvé — première session.');
  process.exit(0);
}

const files = readdirSync(HANDOFFS_DIR)
  .filter(f => f.endsWith('.md'))
  .sort();

if (files.length === 0) {
  console.log('📁 Aucun handoff trouvé — première session.');
  process.exit(0);
}

const lastHandoff = files[files.length - 1];
const content = readFileSync(join(HANDOFFS_DIR, lastHandoff), 'utf8');

console.log(`📋 Dernier handoff : ${lastHandoff}`);
console.log('');
console.log('--- CONTENU DU HANDOFF ---');
console.log(content);
console.log('--- FIN DU HANDOFF ---');
console.log('');
console.log('⚠️  INSTRUCTION OBLIGATOIRE : Affiche immédiatement le résumé du handoff ci-dessus dans ta première réponse au chat, AVANT de répondre à quoi que ce soit d\'autre. L\'utilisateur ne voit pas ce system-reminder. Tu dois le lui présenter toi-même.');

process.exit(0);