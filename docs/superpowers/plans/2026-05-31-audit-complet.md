# Audit Complet — Maison Buna Devis

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auditer l'intégralité du projet (UX, qualité de code, tests, sécurité) et corriger toutes les dettes techniques identifiées.

**Architecture:** Audit en 4 passes séquentielles via les agents spécialisés — UX Designer → Testeur → Code Reviewer → Sécurité. Chaque agent lit le rapport du précédent et écrit le sien. Le Développeur intervient seulement si des corrections sont nécessaires après review ou sécurité.

**Tech Stack:** Node.js ESM · Express 4 · Puppeteer · Handlebars · Brevo API REST · React 19 · Vite · Styled-components · Vitest

---

## Contexte — Problèmes identifiés avant audit

Les points suivants ont été détectés à la lecture du code. Les agents doivent les vérifier et corriger si nécessaire.

### Backend
- `services/mailService.js` — `fromEmail` hardcodé (`REDACTED_EMAIL`) au lieu d'une variable d'env
- `services/mailService.js` — CID logo inline ne fonctionne pas via l'API REST Brevo (logo en PJ)
- `services/pdfService.js` — utilise `logo-amalivre.jpeg` au lieu du logo Maison Buna
- `package.json` — `nodemailer` listé en dépendance mais plus utilisé (migration vers fetch/Brevo)
- `.env.example` — `BASE_URL` ajouté mais piste abandonnée, variable inutile
- Sécurité MOYEN non corrigés du précédent audit : helmet.js absent, timeout Puppeteer absent, logs email anonymisation, validation Content-Type
- `routes/devis.js` — validation email côté serveur encore faible (`includes('@')`)

### Frontend React
- `client/src/components/BrandPanel.jsx` — utilise `logo-amalivre.jpeg` (mauvais logo)
- `client/src/components/SectionCommande.jsx` — couleurs hardcodées (`#3d2817`, `#c8753a`, etc.) au lieu du theme
- `client/src/theme.js` — couleurs divergent légèrement de la charte CLAUDE.md (`#3D2817` vs `#2e2010`)
- `client/src/playground/` — dossier de prototypes non nettoyé

### Templates
- `templates/devis-template.html` — SIRET encore `[À COMPLÉTER]`
- `templates/email-client.html` — header logo cassé (CID non rendu)
- `templates/email-admin.html` — header logo cassé (CID non rendu)

---

## Fichiers concernés

| Fichier | Agent responsable | Action |
|---------|------------------|--------|
| `services/mailService.js` | Développeur (si nécessaire) | Fix fromEmail env var, fix logo |
| `services/pdfService.js` | Développeur | Fix logo Maison Buna |
| `templates/devis-template.html` | UX Designer | Fix SIRET, fix logo |
| `templates/email-client.html` | UX Designer | Fix header logo |
| `templates/email-admin.html` | UX Designer | Fix header logo |
| `client/src/components/BrandPanel.jsx` | UX Designer | Fix logo |
| `client/src/components/SectionCommande.jsx` | UX Designer | Fix couleurs hardcodées |
| `client/src/theme.js` | UX Designer | Aligner sur charte CLAUDE.md |
| `package.json` | Développeur | Retirer nodemailer si inutilisé |
| `.env.example` | Développeur | Retirer BASE_URL |
| `server.js` | Développeur | Ajouter helmet |
| `routes/devis.js` | Développeur | Fix validation email regex |
| `reports/dev-report.md` | UX Designer puis Développeur | Écrire "DONE" |
| `reports/test-report.md` | Testeur | Écrire "DONE" |
| `reports/review-report.md` | Code Reviewer | Écrire "APPROUVÉ" |
| `reports/security-report.md` | Sécurité | Écrire "SÛR" |

---

## Tâche 1 — UX Designer : audit et corrections visuelles

**Agent :** `ux-designer`
**Fichiers :** templates/ + client/src/components/ + client/src/theme.js
**Rapport :** `reports/dev-report.md`

### Contexte obligatoire pour l'agent

Stack : Node.js ESM + Express + Handlebars + React 19 + Styled-components
Charte Maison Buna :
- `#2e2010` — brun très foncé (textes principaux, header)
- `#4F3422` — brun moyen (titres, accents)
- `#D3C2AC` — crème (bordures, éléments secondaires)
- `#AB9679` — sable (textes secondaires, labels)
- `#FAF7F3` — fond crème clair (background)
Polices : Cormorant Garamond (serif) + Jost (sans-serif)
**Règle absolue : ne jamais hardcoder d'autres couleurs — utiliser uniquement les 5 couleurs ci-dessus ou le theme.js.**

### Checklist

- [ ] **Lire** `templates/devis-template.html` et corriger le SIRET (`[À COMPLÉTER]` → `[SIRET non communiqué]` ou supprimer la ligne)
- [ ] **Lire** `templates/email-client.html` — supprimer le `<img src="cid:logo-buna">` cassé et le remplacer par le header SVG monogramme original (fond `#2e2010`, texte `MB`, sous-titre "Le berceau du café") — le logo CID Brevo ne fonctionne pas
- [ ] **Lire** `templates/email-admin.html` — même correction : revenir à un header fonctionnel sans CID
- [ ] **Lire** `client/src/components/BrandPanel.jsx` — remplacer `logo-amalivre.jpeg` par le logo Maison Buna (`public/images/logo-buna.png` servi depuis `/images/logo-buna.png`) ou utiliser le monogramme SVG inline
- [ ] **Lire** `client/src/theme.js` — aligner les couleurs sur la charte :
  - `brown` → `#4F3422`
  - `dark` → `#2e2010`
  - `cream` → `#D3C2AC`
  - `sand` → `#AB9679`
  - `white` → `#FAF7F3`
  - Garder `accent`, `error`, `ok` tels quels (non réglementés)
- [ ] **Lire** `client/src/components/SectionCommande.jsx` — remplacer toutes les couleurs hardcodées par les valeurs du theme (importer theme.js)
- [ ] **Vérifier** que les autres composants React n'ont pas de couleurs hardcodées hors charte (SectionProfil, SectionContact, SectionPrecisions, SuccessView, SummaryRail)
- [ ] **Écrire** dans `reports/dev-report.md` : `## UX Designer — DONE` + liste des fichiers modifiés

---

## Tâche 2 — Développeur : corrections techniques

**Agent :** `developer`
**Fichiers :** services/ + routes/ + server.js + package.json + .env.example
**Rapport :** `reports/dev-report.md` (ajouter à la suite)

**Prérequis :** Lire `reports/dev-report.md` avant de commencer.

### Contexte obligatoire pour l'agent

Stack : Node.js ESM (`"type":"module"`) + Express 4 + fetch (Brevo API REST)
Variables d'env disponibles : `PORT`, `BREVO_API_KEY`, `ADMIN_EMAIL`
Ne jamais committer `.env`.
Toujours valider côté serveur. Toujours envoyer 2 emails (client + admin). Toujours sauvegarder dans data/devis.json.

### Checklist

- [ ] **Lire** `services/mailService.js` — remplacer `fromEmail` hardcodé par `process.env.SMTP_USER || process.env.ADMIN_EMAIL` et ajouter `SMTP_USER` à `.env.example`
- [ ] **Lire** `services/mailService.js` — supprimer tout le bloc `inlineImages` (CID Brevo non supporté), simplifier `sendOne` pour ne gérer que les `attachments` normaux
- [ ] **Lire** `services/pdfService.js` — remplacer `logo-amalivre.jpeg` par `public/images/logo-buna.png` (chemin : `join(__dirname, '../public/images/logo-buna.png')`, format PNG donc `data:image/png;base64,...`)
- [ ] **Lire** `package.json` — vérifier si `nodemailer` est encore importé quelque part (`grep -r "nodemailer" --include="*.js"`) — si non, le retirer de `dependencies`
- [ ] **Lire** `.env.example` — retirer `BASE_URL` (piste abandonnée), ajouter `SMTP_USER` si absent
- [ ] **Lire** `routes/devis.js` — remplacer `!email?.includes('@')` par `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false`
- [ ] **Lire** `server.js` — ajouter `helmet` : `npm install helmet`, puis `import helmet from 'helmet'` et `app.use(helmet())` avant les autres middlewares
- [ ] **Lire** `services/pdfService.js` — ajouter `page.setDefaultNavigationTimeout(10000)` après `browser.newPage()`
- [ ] **Lire** `services/mailService.js` — anonymiser les logs : `devis.email.replace(/(.{2}).+(@.+)/, '$1***$2')`
- [ ] **Lire** `server.js` — ajouter validation Content-Type sur la route API : `if (!req.is('application/json')) return res.status(415).json({ error: 'Content-Type application/json requis' })` (dans routes/devis.js en début de handler)
- [ ] **Ajouter** dans `reports/dev-report.md` : `## Développeur — DONE` + liste des fichiers modifiés

---

## Tâche 3 — Testeur : validation complète

**Agent :** `tester`
**Rapport :** `reports/test-report.md`

**Prérequis :** Lire `reports/dev-report.md` — doit contenir "Développeur — DONE".

### Contexte obligatoire pour l'agent

Stack : Node.js ESM + Express port 3000 + Vitest (tests unitaires client)
Commandes : `npm run dev` (serveur), `npm test` (tests unitaires Vitest dans client/)
Le serveur doit tourner sur port 3000 pour les tests HTTP.

### Checklist

- [ ] **Lancer** les tests unitaires : `cd client && npm test` — tous doivent passer
- [ ] **Démarrer** le serveur : `npm run dev` (port 3000)
- [ ] **Tester** GET / → réponse HTML 200
- [ ] **Tester** POST /api/devis nominale (payload valide entreprise) → `{"success":true}`
- [ ] **Tester** POST /api/devis sans Content-Type: application/json → 415
- [ ] **Tester** POST /api/devis champ manquant → 400
- [ ] **Tester** POST /api/devis email invalide → 400
- [ ] **Tester** POST /api/devis corps vide → 400
- [ ] **Tester** POST /api/devis cas particulier (societe: "Particulier", adresse requise) → 200
- [ ] **Vérifier** `data/devis.json` → nouvelle entrée avec id + timestamp
- [ ] **Tester** génération PDF : `npm run pdf:test` → fichier > 0 bytes
- [ ] **Vérifier** que le logo dans le PDF est bien le logo Maison Buna (pas logo-amalivre)
- [ ] **Tester** envoi email : `npm run mail:test` → emails envoyés sans erreur (si BREVO_API_KEY configurée)
- [ ] **Écrire** dans `reports/test-report.md` : tableau résultats + `## Testeur — DONE` ou `FAILED`

---

## Tâche 4 — Code Reviewer : audit qualité

**Agent :** `code-reviewer`
**Rapport :** `reports/review-report.md`

**Prérequis :** Lire `reports/test-report.md` — doit contenir "DONE".

### Contexte obligatoire pour l'agent

Stack : Node.js ESM + Express + React 19 + Styled-components
Charte couleurs : `#2e2010`, `#4F3422`, `#D3C2AC`, `#AB9679`, `#FAF7F3` uniquement.
Règles : pas de couleurs hardcodées hors theme, pas de secrets hardcodés, validation côté serveur obligatoire.

### Checklist

- [ ] **Auditer** `server.js` — helmet présent, rate-limit présent, structure propre
- [ ] **Auditer** `routes/devis.js` — validation complète, pas de `err.message` exposé, regex email correcte
- [ ] **Auditer** `services/mailService.js` — pas de hardcode, inlineImages supprimé, logs anonymisés
- [ ] **Auditer** `services/pdfService.js` — bon logo, timeout présent
- [ ] **Auditer** `data/storage.js` — simple et correct
- [ ] **Auditer** `client/src/theme.js` — couleurs alignées sur charte
- [ ] **Auditer** `client/src/components/` — pas de couleurs hardcodées hors theme dans aucun composant
- [ ] **Auditer** `client/src/utils/formUtils.js` — logique propre, pas de dette
- [ ] **Vérifier** `package.json` — nodemailer absent si non utilisé
- [ ] **Vérifier** `.env.example` — toutes les variables nécessaires présentes, aucune inutile
- [ ] **Écrire** dans `reports/review-report.md` : points positifs, points à corriger, `## Code Reviewer — APPROUVÉ` ou `BLOQUANT`

---

## Tâche 5 — Sécurité : audit final

**Agent :** `security`
**Rapport :** `reports/security-report.md`

**Prérequis :** Lire `reports/review-report.md` — doit contenir "APPROUVÉ".

### Contexte obligatoire pour l'agent

Stack : Node.js ESM + Express + fetch (Brevo REST) + Puppeteer
Points du précédent audit (2026-05-26) : 3 ÉLEVÉ corrigés. Points MOYEN restants : helmet, timeout Puppeteer, logs email, validation Content-Type.

### Checklist

- [ ] **Vérifier** helmet installé et actif dans `server.js`
- [ ] **Vérifier** timeout Puppeteer dans `pdfService.js`
- [ ] **Vérifier** logs email anonymisés dans `mailService.js`
- [ ] **Vérifier** validation Content-Type dans `routes/devis.js`
- [ ] **Vérifier** regex email côté serveur dans `routes/devis.js`
- [ ] **Vérifier** `npm audit` → 0 vulnérabilités HIGH/CRITICAL
- [ ] **Vérifier** `.env` non commité (`git ls-files .env` → vide)
- [ ] **Vérifier** `data/devis.json` non accessible via HTTP
- [ ] **Vérifier** rate-limit encore actif sur POST /api/devis
- [ ] **Vérifier** secrets non hardcodés dans le nouveau code mailService
- [ ] **Écrire** dans `reports/security-report.md` : résumé, détail, `## Agent Sécurité — SÛR` ou `BLOQUANT`

---

## Ordre d'exécution

```
[Branche: chore/audit-complet]

Tâche 1 — UX Designer
    ↓ reports/dev-report.md : "UX Designer — DONE"
Tâche 2 — Développeur
    ↓ reports/dev-report.md : "Développeur — DONE"
Tâche 3 — Testeur
    ↓ reports/test-report.md : "DONE"
    ↓ (si FAILED → retour Développeur)
Tâche 4 — Code Reviewer
    ↓ reports/review-report.md : "APPROUVÉ"
    ↓ (si BLOQUANT → retour Développeur)
Tâche 5 — Sécurité
    ↓ reports/security-report.md : "SÛR"
    ↓ (si BLOQUANT → retour Développeur)

→ PR chore/audit-complet → main
```

## Critères de succès

- [ ] Tous les templates emails ont un header fonctionnel (pas de CID cassé)
- [ ] Le PDF utilise le logo Maison Buna
- [ ] Aucune couleur hardcodée hors theme dans les composants React
- [ ] Theme React aligné sur la charte CLAUDE.md
- [ ] `fromEmail` vient d'une variable d'env
- [ ] `nodemailer` retiré si non utilisé
- [ ] helmet actif
- [ ] Timeout Puppeteer actif
- [ ] Logs email anonymisés
- [ ] `npm audit` → 0 HIGH/CRITICAL
- [ ] Tous les tests unitaires passent
- [ ] Route API répond correctement à tous les cas de validation
