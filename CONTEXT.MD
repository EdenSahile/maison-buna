# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur (port 3000) | ✅ opérationnel |
| PDF Puppeteer (`npm run pdf:test`) | ✅ |
| Emails Brevo | ✅ (SMTP OK — non retesté cette session) |
| Formulaire HTML (public/index.html) | ✅ grille cafés + chips quantité |
| Script JS (public/script.js) | ✅ CSP-safe, cafes/quantiteParCafe |

---

## Branche active

`feat/fix-message-succes` — non pushée, 9 commits propres

---

## Tâches terminées ✅

- [x] Fix bug CSP Helmet : script inline extrait dans `public/script.js`
- [x] Suppression barre de progression (HTML + CSS)
- [x] PRICING simplifié : 250 g (14,99 €) / 500 g (28,00 €) / Sur mesure
- [x] Grille cafés : 3 cards avec photo (Limmu / Sidamo / Yirgacheffe) + chips de quantité
- [x] Sélection multiple possible (plusieurs cafés, quantités différentes)
- [x] script.js : modèle `cafes[]` + `quantiteParCafe{}` aligné avec l'API routes/devis.js
- [x] Fix tag `</script>` manquant (310 lignes de vieux code inline supprimées)
- [x] Mouture : Grains entiers uniquement, coché par défaut
- [x] SIRET + mentions légales dans footer emails client et admin
- [x] "Mélissa Sahilé EI — Micro-entreprise" → "Mélissa Sahilé — Entrepreneur individuel" (PDF + 2 emails)
- [x] "Recontact 48h" → "Devis sous 48 h"
- [x] Photos cafés copiées dans `public/images/` (limmu.png, sidamo.png, yirgacheffe.png)
- [x] Hook session-start.js : injection CONTEXT.md au démarrage (partiel — stop.js et CLAUDE.md restants)
- [x] Fix bug `surDevis` : `DevisForm.jsx:187` — croiser `formData.cafes` pour n'inspecter que les cafés sélectionnés

---

## Tâches restantes ⏳

- [ ] Finaliser les hooks CONTEXT.md :
  - `stop.js` → bloquer avec `systemMessage` si tâches non cochées
  - `CLAUDE.md` → template sous-agent avec contenu CONTEXT.md inclus
- [ ] Push branche + créer PR `feat/fix-message-succes` → `main`
- [ ] Mettre à jour `client/src/components/SectionCommande.jsx` (React port 5173) :
  - Chips quantité : 250 g / 500 g / Sur mesure

---

## Notes techniques

- `SMTP_PASS` dans `.env` = clé API Brevo `xkeysib-...`
- `ADMIN_EMAIL` dans `.env` = `edensahile28@gmail.com`
- `SMTP_USER` = `edensahile28@gmail.com`
- Port 3000 = formulaire HTML Express
- Port 5173/5180 = app React Vite
- Tuer port 3000 si EADDRINUSE : `lsof -ti:3000 | xargs kill -9`
- Fondatrice : Mélissa Sahilé — Entrepreneur individuel, SIRET 999 382 484 00015
- `data/counter.json` : compteur global devis — ne pas remettre à 0 en production
