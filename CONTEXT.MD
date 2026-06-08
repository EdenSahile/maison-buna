# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur local (`npm run dev:all`) | ✅ opérationnel |
| PDF Puppeteer (`npm run pdf:test`) | ✅ 365 KB |
| Emails local (`npm run mail:test`) | ✅ logo + Instagram visibles |
| App React (`npm run dev:client`) | ✅ port 5173 |
| Render (production) | ⚠️ `main` déployée — logo/Instagram absents en prod |

---

## Branche active

`main` — `feat/email` mergée PR #19

---

## Tâches terminées ✅

- [x] Fix bug CSP Helmet : script inline extrait dans `public/script.js`
- [x] PRICING simplifié : 250 g / 500 g / Sur mesure
- [x] Grille cafés : 3 cards avec photo (Limmu / Sidamo / Yirgacheffe) + chips de quantité
- [x] Migration confirmation page vers React (`SuccessView.jsx`)
- [x] Script `dev:all` : Express + Vite en parallèle (concurrently)
- [x] Fix 500 Render : `counter.json` absent + Puppeteer `--no-sandbox`
- [x] Keep-alive Render (outil tiers)
- [x] Design v2 landing page : typographie, panneau éditorial, monogramme MB, stepper 4 étapes, photo cérémonie
- [x] Refonte template PDF : Crimson Pro + Open Sans, monogramme, palette landing
- [x] Refonte `email-client.html` : logo CID 80px centré, récap, footer Instagram CID, preheader, bandeau démo
- [x] Refonte `email-admin.html` : logo CID 80px centré, banner table, sections fond beige, preheader, bandeau démo
- [x] Fix double bordure recap
- [x] Logo monogramme PNG visible en local via Nodemailer SMTP + CID
- [x] Icône Instagram visible en local (CID)
- [x] Fix clipping Gmail : preheader invisible avec numéro de devis
- [x] Fix pièce jointe orpheline admin : images CID séparées client/admin
- [x] Bandeau démo : landing + success + emails client + admin

---

## Tâches restantes

- [ ] **BLOQUANT** : logo + Instagram absents en production Render (SMTP probablement bloqué — voir handoff 2026-06-08-1857)
- [ ] Reset compteur devis (`data/counter.json` → `{"counter":0}`) avant mise en prod Mélissa

---

## Notes techniques

- `SMTP_PASS` = clé API Brevo REST (`xkeysib-...`) → ne pas changer
- `BREVO_SMTP_USER` = `ac9d17001@smtp-brevo.com`
- `BREVO_SMTP_PASS` = `xsmtpsib-...`
- `SMTP_USER` = `edensahile28@gmail.com` (expéditeur)
- `ADMIN_EMAIL` = `edensahile28@gmail.com`
- Port 3000 = API Express · Port 5173 = React Vite (dev)
- Tuer ports : `lsof -ti:3000,5173,5174,5175,5176,5177,5178,5179,5180 | xargs kill -9`
- Fondatrice : Mélissa Sahilé — Entrepreneur individuel, SIRET 999 382 484 00015
- Render URL : https://maison-buna.onrender.com
- Keep-alive : outil tiers (pas GitHub Actions)
- Numérotation devis : compteur ~35 (à remettre à 0 avant prod Mélissa)
- `nodemailer` installé et utilisé pour SMTP + CID
