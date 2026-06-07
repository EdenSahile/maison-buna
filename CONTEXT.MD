# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur local (`npm run dev:all`) | ✅ opérationnel |
| PDF Puppeteer (`npm run pdf:test`) | ✅ non retesté cette session |
| Emails Brevo | ✅ (SMTP OK — non retesté cette session) |
| App React (`npm run dev:client`) | ✅ port 5173 |
| Render (production) | ✅ mergé + auto-deploy actif |

---

## Branche active

`feat/design-v2` — en cours, non pushée

---

## Tâches terminées ✅

- [x] Fix bug CSP Helmet : script inline extrait dans `public/script.js`
- [x] Suppression barre de progression (HTML + CSS)
- [x] PRICING simplifié : 250 g / 500 g / Sur mesure
- [x] Grille cafés : 3 cards avec photo (Limmu / Sidamo / Yirgacheffe) + chips de quantité
- [x] Sélection multiple possible (plusieurs cafés, quantités différentes)
- [x] Fix bug `surDevis` : `DevisForm.jsx:187`
- [x] Fix message de confirmation conditionnel (HTML + React)
- [x] Migration confirmation page vers React (`SuccessView.jsx`)
- [x] Script `dev:all` : Express + Vite en parallèle (concurrently)
- [x] Restauration UI : chips toujours visibles, logo avec bordure, toggle avec sous-titres
- [x] Options quantité unifiées : 250 g / 500 g / Sur mesure
- [x] Logo cliquable sur page confirmation → retour formulaire
- [x] Fix PDF : padding-top sur bloc conditions
- [x] Merge `feat/fix-message-succes` → `main` + push
- [x] Fix 500 Render : `counter.json` absent + Puppeteer `--no-sandbox`
- [x] Cron GitHub Actions keep-alive
- [x] Design v2 landing page : typographie, panneau éditorial, monogramme MB, stepper 4 étapes, photo cérémonie
- [x] Spec + plan refonte template PDF (`docs/superpowers/specs/` + `docs/superpowers/plans/`)

---

## Tâches restantes ⏳

- [x] Tâche 1 — Copier `monogram-mb.png` dans `public/images/`
- [x] Tâche 2 — Mettre à jour `pdfService.js` (logo + networkidle0)
- [x] Tâche 3 — Réécrire le CSS du template PDF (Crimson Pro + Open Sans)
- [x] Tâche 4 — Mettre les quantités en `<strong>` dans le tableau
- [x] Tâche 5 — Tester la génération PDF
- [ ] Pusher `feat/design-v2` → remote
- [ ] Ouvrir PR `feat/design-v2` → `main`
- [ ] Reset compteur devis (`data/counter.json` → `{"counter":0}`) avant mise en prod
- [ ] Valider PDF + emails après refonte template

---

## Notes techniques

- `SMTP_PASS` dans `.env` = clé API Brevo `xkeysib-...`
- `ADMIN_EMAIL` dans `.env` = `REDACTED_EMAIL`
- `SMTP_USER` = `REDACTED_EMAIL`
- Port 3000 = API Express
- Port 5173 = app React Vite (dev)
- Tuer ports : `lsof -ti:3000,5173,5174,5175,5176,5177,5178,5179,5180 | xargs kill -9`
- Fondatrice : Mélissa Sahilé — Entrepreneur individuel, SIRET 999 382 484 00015
- Render URL : https://maison-buna.onrender.com
- Render plan : Free (cold start ~30s) — passer Starter $7/mois pour production
- Puppeteer sur Render Free : 512MB RAM, suffisant pour PDF basiques
- Numérotation devis : `MBE-YYYYMMDD-NNNNN` (entreprise) / `MBP-YYYYMMDD-NNNNN` (particulier) — compteur actuel : 31
