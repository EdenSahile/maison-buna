# Devis Template Redesign — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre `templates/devis-template.html` pour aligner le PDF sur le design de la landing page React (typographie Crimson Pro + Open Sans, palette exacte du `theme.js`), et corriger le chargement du logo + des web fonts dans `pdfService.js`.

**Architecture:** Modification CSS pure du template Handlebars existant. Aucune logique métier touchée. Deux fichiers modifiés : `services/pdfService.js` (logo + waitUntil) et `templates/devis-template.html` (CSS + markup quantités). Le template reste compatible avec toutes les variables Handlebars existantes.

**Tech Stack:** Handlebars, Puppeteer, HTML/CSS, Google Fonts (Crimson Pro + Open Sans)

---

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `services/pdfService.js` | Logo path → monogram-mb.png · waitUntil → networkidle0 |
| `public/images/monogram-mb.png` | Copie depuis client/src/assets/ |
| `templates/devis-template.html` | CSS complet + `<strong>` sur quantités |

---

## Task 1 — Copier le monogramme dans public/images

**Files:**
- Create: `public/images/monogram-mb.png` (copie)

- [ ] **Step 1 : Copier l'asset**

```bash
cp client/src/assets/monogram-mb.png public/images/monogram-mb.png
```

- [ ] **Step 2 : Vérifier**

```bash
ls -lh public/images/
# doit afficher monogram-mb.png
```

---

## Task 2 — Mettre à jour pdfService.js

**Files:**
- Modify: `services/pdfService.js`

- [ ] **Step 1 : Changer le logo path et le waitUntil**

Dans `services/pdfService.js`, remplacer :

```js
const logoPath = join(__dirname, '../public/images/logo-buna.png');
const logoSrc = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`;
```

par :

```js
const logoPath = join(__dirname, '../public/images/monogram-mb.png');
const logoSrc = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`;
```

Et remplacer :

```js
await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 });
```

par :

```js
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
```

> **Pourquoi networkidle0 ?** Puppeteer doit attendre que les Google Fonts soient téléchargées avant de rendre le PDF. `domcontentloaded` ne le garantit pas — les fonts arriveraient en Verdana fallback.

- [ ] **Step 2 : Vérifier que le fichier compile sans erreur**

```bash
node --input-type=module <<'EOF'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, 'public/images/monogram-mb.png');
const b = readFileSync(p).toString('base64');
console.log('Logo OK, taille base64:', b.length, 'chars');
EOF
```

Résultat attendu : `Logo OK, taille base64: XXXXX chars` (pas d'erreur).

- [ ] **Step 3 : Commit**

```bash
git add services/pdfService.js public/images/monogram-mb.png
git commit -m "fix: monogram logo + networkidle0 pour chargement des web fonts"
```

---

## Task 3 — Réécrire le CSS du template

**Files:**
- Modify: `templates/devis-template.html` (bloc `<style>` uniquement, lignes 6–527)

- [ ] **Step 1 : Ajouter Google Fonts dans le `<head>`**

Après `<meta charset="UTF-8">` et avant `<title>`, insérer :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

- [ ] **Step 2 : Remplacer intégralement le bloc `<style>`**

Remplacer tout le contenu entre `<style>` et `</style>` par le CSS suivant :

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@page { size: A4; margin: 0; }

html, body {
  width: 210mm;
  min-height: 297mm;
  background: #FAF7F2;
  font-family: 'Open Sans', Verdana, sans-serif;
  font-size: 9.5pt;
  color: #2C1A0E;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ─── HEADER ──────────────────────────────────────────── */
.header {
  background: #FAF7F2;
  padding: 22px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E5DCCD;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-monogram {
  flex-shrink: 0;
  border: 1.5px solid #E5DCCD;
  border-radius: 9px;
  overflow: hidden;
  width: 56px;
  height: 56px;
  background: #2C1A0E;
  box-shadow: 0 1px 6px rgba(0,0,0,0.10);
}
.header-monogram img { width: 56px; height: 56px; object-fit: contain; display: block; }

.header-brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.header-name {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 13pt;
  font-weight: 700;
  letter-spacing: 3px;
  color: #2C1A0E;
  text-transform: uppercase;
  line-height: 1;
}

.header-tagline {
  font-family: 'Open Sans', sans-serif;
  font-size: 8.5pt;
  font-weight: 400;
  font-style: italic;
  color: #9B8266;
}

.header-doc {
  text-align: right;
}

.doc-type {
  font-family: 'Open Sans', sans-serif;
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #9B8266;
  margin-bottom: 4px;
}

.doc-number {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 13pt;
  font-weight: 700;
  color: #4F3422;
  letter-spacing: 0.02em;
}

.doc-dates {
  margin-top: 4px;
  font-size: 7pt;
  font-weight: 400;
  color: #9B8266;
  line-height: 1.7;
}

/* ─── GRADIENT DIVIDER ────────────────────────────────── */
.divider {
  height: 3px;
  background: linear-gradient(90deg, #4F3422 0%, #C8753A 45%, #E8DDCC 100%);
}

/* ─── BODY ────────────────────────────────────────────── */
.body { padding: 36px 48px 100px; }

/* ─── PARTIES (vendeur / client) ─────────────────────── */
.parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.party-block {
  padding: 14px 16px;
  border: 1px solid #E5DCCD;
  border-radius: 2px;
}

.party-block.vendeur { background: #F0E8DB; }
.party-block.client  { background: #FAF7F2; }

.party-title {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #9B8266;
  margin-bottom: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid #E5DCCD;
}

.party-name {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 11pt;
  font-weight: 600;
  color: #2C1A0E;
  margin-bottom: 5px;
}

.party-line {
  font-size: 8pt;
  font-weight: 400;
  color: #6F5A41;
  line-height: 1.65;
}

.party-line.muted { color: #9B8266; font-size: 7.5pt; margin-top: 5px; }

/* ─── OBJET DU DEVIS ──────────────────────────────────── */
.objet-row {
  background: #FAF7F2;
  border: 1px solid #E5DCCD;
  border-left: 3px solid #4F3422;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.objet-label {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #9B8266;
  margin-bottom: 3px;
}

.objet-value {
  font-family: 'Open Sans', sans-serif;
  font-size: 9pt;
  font-weight: 400;
  color: #2C1A0E;
}

.objet-validite {
  font-size: 7pt;
  font-weight: 400;
  color: #9B8266;
}

/* ─── TABLEAU PRODUITS ────────────────────────────────── */
.table-wrap { margin-bottom: 14px; }

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background: #F0E8DB;
  border-bottom: 2px solid #4F3422;
}

thead th {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #4F3422;
  padding: 9px 12px;
  text-align: left;
}

thead th.right { text-align: right; }

tbody tr { border-bottom: 1px solid #E5DCCD; }

tbody td {
  padding: 11px 12px;
  font-size: 8.5pt;
  font-weight: 400;
  color: #2C1A0E;
  line-height: 1.5;
  vertical-align: top;
}

tbody td.right { text-align: right; font-weight: 400; }

.product-name {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 11pt;
  font-weight: 600;
  color: #2C1A0E;
  display: block;
  margin-bottom: 2px;
}

.product-detail {
  font-size: 7.5pt;
  color: #9B8266;
  letter-spacing: 0.02em;
}

.product-detail strong {
  font-weight: 700;
  color: #4F3422;
}

/* ─── TOTAUX ──────────────────────────────────────────── */
.totaux {
  width: 240px;
  margin-left: auto;
  border: 1px solid #E5DCCD;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 24px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  border-bottom: 1px solid #E5DCCD;
  font-size: 8pt;
}

.total-row:last-child { border-bottom: none; }

.total-row .label { color: #9B8266; font-weight: 400; }
.total-row .value { font-weight: 700; color: #2C1A0E; }

.total-row.ttc {
  background: #4F3422;
}

.total-row.ttc .label {
  color: #D3C2AC;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 6.5pt;
  text-transform: uppercase;
}
.total-row.ttc .value {
  color: #FAF7F2;
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 13pt;
  font-weight: 700;
}

/* ─── SUR DEVIS ───────────────────────────────────────── */
.sur-devis-block {
  background: #F0E8DB;
  border: 1px solid #E5DCCD;
  border-left: 3px solid #4F3422;
  padding: 18px 24px;
  margin-bottom: 24px;
}

.sur-devis-title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 11pt;
  font-weight: 600;
  color: #4F3422;
  margin-bottom: 6px;
}

.sur-devis-text {
  font-size: 8.5pt;
  font-weight: 400;
  color: #9B8266;
  line-height: 1.6;
}

/* ─── DÉTAILS COMMANDE ────────────────────────────────── */
.details-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #9B8266;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #E5DCCD;
}

.detail-row {
  display: flex;
  gap: 10px;
  margin-bottom: 7px;
  align-items: baseline;
}

.detail-label {
  font-size: 7pt;
  font-weight: 700;
  color: #9B8266;
  letter-spacing: 1px;
  text-transform: uppercase;
  min-width: 72px;
  flex-shrink: 0;
}

.detail-value {
  font-family: 'Open Sans', sans-serif;
  font-size: 9pt;
  font-weight: 400;
  color: #2C1A0E;
  line-height: 1.4;
}

.moutures-list { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 1px; }

.mouture-tag {
  background: transparent;
  border: 1px solid #E5DCCD;
  color: #4F3422;
  font-family: 'Open Sans', sans-serif;
  font-size: 7pt;
  font-weight: 400;
  padding: 2px 8px;
  letter-spacing: 0.04em;
}

/* ─── MESSAGE ─────────────────────────────────────────── */
.message-block {
  margin-top: 36px;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: #FAF7F2;
  border: 1px solid #E5DCCD;
  border-left: 3px solid #4F3422;
  break-before: page;
  page-break-before: always;
}

.message-text {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 11pt;
  color: #2C1A0E;
  line-height: 1.7;
  font-style: italic;
}

/* ─── CONDITIONS ──────────────────────────────────────── */
.conditions {
  background: #F0E8DB;
  border: 1px solid #E5DCCD;
  border-radius: 2px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.conditions-title {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #9B8266;
  margin-bottom: 10px;
}

.conditions-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.conditions-list li {
  font-size: 7.5pt;
  font-weight: 400;
  color: #4F3422;
  line-height: 1.5;
  padding-left: 12px;
  position: relative;
}

.conditions-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: #9B8266;
}

/* ─── MENTIONS LÉGALES ────────────────────────────────── */
.legal {
  font-size: 7pt;
  font-weight: 400;
  color: #9B8266;
  line-height: 1.6;
  border-top: 1px solid #E5DCCD;
  padding-top: 10px;
  margin-bottom: 14px;
}

/* ─── BON POUR ACCORD ────────────────────────────────── */
.bpa {
  display: flex;
  gap: 24px;
  margin: 20px 0 16px;
  break-inside: avoid;
}

.bpa-block {
  flex: 1;
  border: 1px solid #E5DCCD;
  border-radius: 4px;
  padding: 12px 14px 34px;
}

.bpa-title {
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9B8266;
  margin-bottom: 9px;
}

.bpa-line {
  font-size: 7.5pt;
  color: #4F3422;
  margin-bottom: 5px;
}

.bpa-sign {
  border-bottom: 1px solid #E5DCCD;
  margin-top: 18px;
  padding-bottom: 2px;
  font-size: 7pt;
  color: #9B8266;
}

/* ─── FOOTER ──────────────────────────────────────────── */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FAF7F2;
  border-top: 1px solid #E5DCCD;
  padding: 10px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 10pt;
  font-weight: 700;
  color: #4F3422;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.footer-legal {
  font-size: 6pt;
  font-weight: 400;
  color: #9B8266;
  letter-spacing: 0.02em;
  text-align: right;
  line-height: 1.7;
}

/* ─── PAGE BREAKS ────────────────────────────────────── */
.parties,
.party-block,
.objet-row,
.table-wrap,
.totaux,
.sur-devis-block,
.details-section,
.message-block,
.conditions,
.legal {
  break-inside: avoid;
  page-break-inside: avoid;
}

tbody tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

p, li {
  orphans: 3;
  widows: 3;
}

@media print {
  .footer { position: fixed; bottom: 0; }
  .body { padding-bottom: 80px; }
}
```

- [ ] **Step 3 : Vérifier que le fichier est valide HTML**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('templates/devis-template.html', 'utf8');
const hasGFonts = html.includes('fonts.googleapis.com');
const hasCrimson = html.includes('Crimson Pro');
const hasOpenSans = html.includes('Open Sans');
const hasOldVerdana = (html.match(/font-family: Verdana/g) || []).length;
console.log('Google Fonts:', hasGFonts);
console.log('Crimson Pro:', hasCrimson);
console.log('Open Sans:', hasOpenSans);
console.log('Verdana restants (doit être 0):', hasOldVerdana);
"
```

Résultat attendu :
```
Google Fonts: true
Crimson Pro: true
Open Sans: true
Verdana restants (doit être 0): 0
```

---

## Task 4 — Mettre les quantités en gras dans le HTML

**Files:**
- Modify: `templates/devis-template.html` (section tableau, ligne ~619)

- [ ] **Step 1 : Localiser la ligne product-detail dans le tbody**

Chercher ce fragment dans le template :
```html
<span class="product-detail"><strong>{{qte_label}}</strong> · {{region}} · Arabica grade 1 · Score SCA 87/100</span>
```

Si la balise `<strong>` autour de `{{qte_label}}` est déjà présente, cette tâche est déjà faite — passer à la suivante.

Si `{{qte_label}}` n'est pas encore dans un `<strong>`, remplacer :
```html
<span class="product-detail">{{qte_label}} · {{region}} · Arabica grade 1 · Score SCA 87/100</span>
```

par :
```html
<span class="product-detail"><strong>{{qte_label}}</strong> · {{region}} · Arabica grade 1 · Score SCA 87/100</span>
```

> La règle CSS `.product-detail strong { font-weight: 700; color: #4F3422; }` est déjà définie dans le Task 3 — le gras sera appliqué automatiquement.

- [ ] **Step 2 : Vérifier**

```bash
grep -n "qte_label" templates/devis-template.html
# doit afficher : <strong>{{qte_label}}</strong>
```

---

## Task 5 — Tester la génération PDF

**Files:**
- Read: `scripts/test-pdf.js` (pour comprendre les données de test)

- [ ] **Step 1 : Lancer le test PDF**

```bash
npm run pdf:test
```

Résultat attendu :
```
✅ PDF généré : output/test-devis.pdf  (ou chemin équivalent)
```

Pas d'erreur Puppeteer, pas de timeout.

- [ ] **Step 2 : Ouvrir le PDF et vérifier visuellement**

```bash
open output/test-devis.pdf   # macOS
# ou : xdg-open output/test-devis.pdf  # Linux
```

Checklist visuelle :
- [ ] Logo monogramme visible (pas une icône brisée)
- [ ] "Maison Buna" en Crimson Pro (serif, espacement large) — pas en Verdana
- [ ] N° de devis en Crimson Pro brun
- [ ] Dégradé orange visible dans la barre sous le header
- [ ] En-tête tableau sur fond crème `#F0E8DB`
- [ ] Noms de cafés en Crimson Pro (ex : "Yirgacheffe" en serif)
- [ ] Quantité (ex : "500 g") en gras et couleur brun `#4F3422`
- [ ] Total sur fond brun foncé, montant en Crimson Pro blanc
- [ ] Conditions générales complètes (9 items pour entreprise)
- [ ] Footer "Maison Buna" en Crimson Pro

- [ ] **Step 3 : Commit final**

```bash
git add templates/devis-template.html
git commit -m "feat: refonte template PDF — Crimson Pro + Open Sans + palette landing page"
```

---

## Rappel avant mise en production

Remettre le compteur à zéro :

```bash
echo '{"counter":0}' > data/counter.json
git add data/counter.json
git commit -m "chore: reset compteur devis pour mise en production"
```

> Ne pas faire ce commit maintenant — uniquement juste avant le merge en production.
