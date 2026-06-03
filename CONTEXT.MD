# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur local (`npm run dev:all`) | ✅ opérationnel |
| PDF Puppeteer (`npm run pdf:test`) | ✅ |
| Emails Brevo | ✅ (SMTP OK — non retesté cette session) |
| Formulaire HTML | ❌ supprimé — migration complète vers React |
| App React (`npm run dev:client`) | ✅ port 5173 |
| Render (production) | ✅ mergé + auto-deploy actif |

---

## Branche active

`feat/fix-message-succes` — mergée dans `main`, pushée

---

## Tâches terminées ✅

- [x] Fix bug CSP Helmet : script inline extrait dans `public/script.js`
- [x] Suppression barre de progression (HTML + CSS)
- [x] PRICING simplifié : 250 g / 500 g / Sur mesure
- [x] Grille cafés : 3 cards avec photo (Limmu / Sidamo / Yirgacheffe) + chips de quantité
- [x] Sélection multiple possible (plusieurs cafés, quantités différentes)
- [x] Fix bug `surDevis` : `DevisForm.jsx:187` — croiser `formData.cafes` pour n'inspecter que les cafés sélectionnés
- [x] Fix message de confirmation conditionnel (HTML + React)
- [x] Suppression formulaire HTML (`public/index.html` + `public/script.js`)
- [x] Migration confirmation page vers React (`SuccessView.jsx`)
- [x] Script `dev:all` : Express + Vite en parallèle (concurrently)
- [x] Restauration UI : chips toujours visibles, logo avec bordure, toggle avec sous-titres
- [x] Options quantité unifiées : 250 g / 500 g / Sur mesure (entreprise + particulier)
- [x] Logo cliquable sur page confirmation → retour formulaire
- [x] Chips toggleables + suppression CheckBadge
- [x] Fix PDF : padding-top sur bloc conditions (margin ignoré au saut de page)
- [x] Merge `feat/fix-message-succes` → `main` + push
- [x] Fix 500 Render : `counter.json` absent + Puppeteer `--no-sandbox`
- [x] Cron GitHub Actions keep-alive (ping toutes les 14 min)
- [x] Fix hook stop : `client/.claude/settings.json` → `../.claude/hooks/stop.js`
- [x] Suppression barre de progression React (formulaire)
- [x] "de caractère," en orange (`theme.accent`) dans la sidebar

---

## Tâches restantes ⏳

Aucune tâche en cours.

---

## Notes techniques

- `SMTP_PASS` dans `.env` = clé API Brevo `xkeysib-...`
- `ADMIN_EMAIL` dans `.env` = `edensahile28@gmail.com`
- `SMTP_USER` = `edensahile28@gmail.com`
- Port 3000 = API Express
- Port 5173 = app React Vite (dev)
- Tuer ports : `lsof -ti:3000,5173,5174,5175,5176,5177,5178,5179,5180 | xargs kill -9`
- Fondatrice : Mélissa Sahilé — Entrepreneur individuel, SIRET 999 382 484 00015
- Render URL : https://maison-buna.onrender.com
- Render plan : Free (cold start ~30s) — passer Starter $7/mois pour production
- Puppeteer sur Render Free : 512MB RAM, suffisant pour PDF basiques
