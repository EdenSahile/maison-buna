# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur local (`npm run dev:all`) | ✅ opérationnel |
| PDF Puppeteer (`npm run pdf:test`) | ✅ opérationnel (365 KB) |
| Emails Brevo (`npm run mail:test`) | ✅ OK — client + admin envoyés |
| App React (`npm run dev:client`) | ✅ port 5173 |
| Render (production) | ✅ sur `main` — `feat/email` pas encore mergée |

---

## Branche active

`feat/email` — refonte templates email, 2 commits, non pushée

---

## Tâches terminées ✅

- [x] Fix bug CSP Helmet : script inline extrait dans `public/script.js`
- [x] PRICING simplifié : 250 g / 500 g / Sur mesure
- [x] Grille cafés : 3 cards avec photo (Limmu / Sidamo / Yirgacheffe) + chips de quantité
- [x] Migration confirmation page vers React (`SuccessView.jsx`)
- [x] Script `dev:all` : Express + Vite en parallèle (concurrently)
- [x] Fix 500 Render : `counter.json` absent + Puppeteer `--no-sandbox`
- [x] Keep-alive Render (outil tiers — pas GitHub Actions)
- [x] Design v2 landing page : typographie, panneau éditorial, monogramme MB, stepper 4 étapes, photo cérémonie
- [x] Refonte template PDF : Crimson Pro + Open Sans, monogramme, palette landing
- [x] Refonte `email-client.html` : DM Sans + DM Serif Display, monogramme base64, card crème, récap CSS Grid, footer Instagram
- [x] Refonte `email-admin.html` : même charte, banner notification interne, sections coordonnées + commande
- [x] Fix email : logo base64 inline (monogram-email.png 88×88), tagline block, SVG Instagram data URI

---

## Tâches restantes

- [ ] Pusher `feat/email` → remote + ouvrir PR → `main`
- [ ] Reset compteur devis (`data/counter.json` → `{"counter":0}`) avant mise en prod
- [ ] Valider visuellement les emails reçus (vérifier monogramme + Instagram + tagline)

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
- Keep-alive : outil tiers (pas GitHub Actions, supprimé)
- Numérotation devis : `MBE-YYYYMMDD-NNNNN` (entreprise) / `MBP-YYYYMMDD-NNNNN` (particulier) — compteur actuel : 31 (à remettre à 0 avant prod)
- `public/images/monogram-email.png` : version 88×88 pour email (base64 inline via `mailService.js`)
