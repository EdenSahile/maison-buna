# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

| Composant | État |
|-----------|------|
| Serveur (port 3000) | ✅ opérationnel |
| Vite dev client (port 5180) | ✅ opérationnel |
| PDF Puppeteer | ✅ généré et joint en PJ email |
| Emails Brevo REST API | ✅ client + admin envoyés |
| Tests Vitest | ✅ 20/20 (à re-confirmer) |

---

## Branche active

`feature/react-migration`

---

## Features terminées (cette branche)

- **Migration React** — formulaire React complet avec composants (DevisForm, CoffeeGrid, AudienceToggle, BrandPanel, SectionCommande)
- **Sélection des cafés** — Limmu, Sidamo, Yirgacheffe avec visuels et régions
- **Audience toggle** — mode Entreprise / Particulier avec tarifs adaptés
- **Templates email** — audience-aware, numéro de devis `MB-YYYY-XXXXXXXX`, bloc "48h" uniquement pour `sur_devis:true`
- **mailService.js** — réécriture SMTP → API REST Brevo (fetch), plus de connexions TCP pendantes
- **Fix bug emails** — nodemon ignorait pas `data/` → redémarrait après chaque save → `setImmediate` tué. Corrigé via `nodemonConfig.ignore: ["data/*"]` dans `package.json`

---

## Tâches restantes

| # | Tâche | Fichier(s) | Statut |
|---|-------|------------|--------|
| 1 | Polices KALUFONIA + Classy Vogue | `client/src/assets/fonts/` | ⏳ en attente (fichiers à fournir) |
| 2 | SIRET dans template PDF | `templates/devis-template.html` | ⏳ info à compléter |
| 3 | Merger `feature/react-migration` → `main` | — | ⏳ après validation complète |

---

## Notes techniques

- `SMTP_PASS` dans `.env` = clé API Brevo `xkeysib-...` (89 chars) — utilisée par `mailService.js`
- `ADMIN_EMAIL` dans `.env` = `REDACTED_EMAIL`
- Vite dev sur port **5180** (5173 occupé par autre app)
- Nodemon ignore `data/*` — ne redémarre plus sur changement de `data/devis.json`
- Flow `sur_devis` : quantité "À estimer" → pas de PDF, email client sans bloc délai, email admin "sur mesure"
- REST API Brevo : POST `https://api.brevo.com/v3/smtp/email` avec header `api-key: SMTP_PASS`
- `from.email` dans `mailService.js` : `REDACTED_EMAIL` (domaine validé Brevo)

---

## Audit sécurité

Dernier audit : 2026-05-26
Verdict : ✅ SÛR (3 ÉLEVÉ corrigés — 0 CRITIQUE/ÉLEVÉ restant)
Points MOYEN restants : helmet.js absent · timeout Puppeteer absent · emails loggés en clair
