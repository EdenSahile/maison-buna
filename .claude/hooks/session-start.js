import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const HANDOFFS_DIR = 'handoffs';

// === 1. Dernier handoff ===
if (!existsSync(HANDOFFS_DIR)) {
  console.log('📁 Aucun handoff trouvé — première session.');
} else {
  const files = readdirSync(HANDOFFS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('📁 Aucun handoff trouvé — première session.');
  } else {
    const lastHandoff = files[files.length - 1];
    const content = readFileSync(join(HANDOFFS_DIR, lastHandoff), 'utf8');
    console.log(`📋 Dernier handoff : ${lastHandoff}`);
    console.log('');
    console.log('--- CONTENU DU HANDOFF ---');
    console.log(content);
    console.log('--- FIN DU HANDOFF ---');
  }
}

// === 2. CONTEXT.md ===
if (existsSync('CONTEXT.md')) {
  const context = readFileSync('CONTEXT.md', 'utf8');
  const unchecked = (context.match(/\[ \]/g) || []).length;
  const checked   = (context.match(/\[x\]/g) || []).length;

  console.log('');
  console.log('--- CONTEXT.md ---');
  console.log(context);
  console.log('--- FIN CONTEXT.md ---');
  console.log('');
  console.log(`📊 Tâches : ${checked} terminées ✅ / ${unchecked} restantes ⏳`);
}

console.log('');
console.log('⚠️  INSTRUCTIONS OBLIGATOIRES :');
console.log('1. Affiche le résumé du handoff dans ta PREMIÈRE réponse au chat.');
console.log('2. Lis CONTEXT.md ci-dessus — c\'est l\'état courant du projet.');
console.log('3. Coche [x] chaque tâche dans CONTEXT.md IMMÉDIATEMENT après l\'avoir accomplie.');
console.log('4. Ne jamais laisser CONTEXT.md désynchronisé avec le travail réel.');

process.exit(0);
