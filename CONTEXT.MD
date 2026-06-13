# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur local (`npm run dev:all`) | ✅ opérationnel |
| PDF Puppeteer (`npm run pdf:test`) | ✅ 374 KB |
| Emails local (`npm run mail:test`) | ✅ logo + Instagram visibles |
| App React (`npm run dev:client`) | ✅ port 5173 |
| Render démo (`maison-buna.onrender.com`) | ✅ infos fictives — bandeau DÉMO actif |
| Render prod (`maison-buna-prod.onrender.com`) | ✅ vraies infos — PDF + emails fonctionnels |

---

## Branches actives

- `main` — repo prod (`EdenSahile/maison-buna-prod`) — branché sur Render prod
- `main` — repo démo (`EdenSahile/maison-buna`) — branché sur Render démo

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
- [x] Bandeau démo supprimé sur la version prod (App.jsx + email-client.html + email-admin.html)
- [x] Fix logo/Instagram prod : resolveImagesForREST() + route /images statique + BASE_URL
- [x] Fix compteur devis Render : compteur en mémoire + COUNTER_SEED env var
- [x] Suppression ligne signoff email-client + margin-top section-label
- [x] PDF : break-before déplacé sur wrapper conditions (toujours page 2)
- [x] CoffeeGrid : max-width 960px + centrage + aspect-ratio 4/3
- [x] Sidebar : sticky top 35px, photo 254px, hover stepper
- [x] Responsive mobile : BrandBody masqué, toggle audience vertical
- [x] Coordonnées réelles Maison Buna dans templates (SIRET, email, adresse, nom)
- [x] Création repo GitHub prod `EdenSahile/maison-buna-prod`
- [x] Déploiement Render prod `maison-buna-prod.onrender.com`
- [x] Fix Puppeteer Chrome sur Render prod : PUPPETEER_CACHE_DIR=/opt/render/project/src/.cache/puppeteer
- [x] UptimeRobot ajouté pour maison-buna-prod.onrender.com
- [x] Dette technique : fix incohérence sur-mesure (`"À estimer"` → `"Sur mesure"` front ↔ serveur)
- [x] Dette technique : middleware d'erreur global Express (server.js) — n'expose plus la stack trace
- [x] Dette technique : warning au boot si `BASE_URL` absent en prod
- [x] Dette technique : suppression `postinstall` redondant (Chrome installé 3× au build)
- [x] Dette technique : log d'erreur sur échec d'écriture du compteur (plus de `catch {}` silencieux)

---

## Tâches restantes

- [ ] Reset compteur devis (`COUNTER_SEED=0`) sur Render prod avant le premier vrai devis Mélissa
- [ ] Vérifier `BASE_URL` configuré dans Render prod (sinon images emails REST → fallback démo)
- [ ] (Optionnel) Retirer code mort `computeProgress` dans formUtils.js (gardé en vie par ses seuls tests)

---

## Notes techniques

- Credentials : voir `.env` uniquement — ne jamais écrire de valeurs réelles ici
- Port 3000 = API Express · Port 5173/5174 = React Vite (dev)
- Tuer ports : `lsof -ti:3000,5173,5174,5175,5176,5177,5178,5179,5180 | xargs kill -9`
- **Render démo** : https://maison-buna.onrender.com — repo `EdenSahile/maison-buna`
- **Render prod** : https://maison-buna-prod.onrender.com — repo `EdenSahile/maison-buna-prod`
- Keep-alive démo : UptimeRobot — https://stats.uptimerobot.com/SzyJuH3k1f
- Keep-alive prod : UptimeRobot — monitor ajouté cette session
- Puppeteer Render prod : PUPPETEER_CACHE_DIR=/opt/render/project/src/.cache/puppeteer (env var Render)
- SMTP bloqué sur Render free tier → fallback automatique Brevo REST API (fonctionnel)
- Compteur devis : en mémoire, initialisé depuis COUNTER_SEED env var (défaut 0)
- Copie démo locale : `/Users/macbookeden/Documents/Claude/maison-buna-demo/maison-buna-devis copie` — connectée à `EdenSahile/maison-buna`
