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
| PDF Puppeteer | ✅ généré (logo à corriger dans audit) |
| Emails Brevo REST API | ✅ client + admin envoyés |
| Logo email inline (CID) | ❌ s'affiche en PJ — à corriger dans audit |
| Tests Vitest | ✅ 20/20 (à re-confirmer après audit) |

---

## Branche active

`main` — prochaine branche à créer : `chore/audit-complet`

---

## Tâches terminées ✅

- [x] Migration formulaire React (DevisForm, CoffeeGrid, AudienceToggle, BrandPanel, SectionCommande)
- [x] Sélection cafés par quantité individuelle (`quantiteParCafe`)
- [x] Audience toggle Entreprise / Particulier avec tarifs adaptés
- [x] Templates email audience-aware + numéro devis `MB-YYYY-XXXXXXXX`
- [x] Réécriture mailService SMTP → API REST Brevo (fetch)
- [x] Fix bug emails nodemon (`nodemonConfig.ignore: ["data/*"]`)
- [x] Mouture — chip statique "Grains entiers" (non interactive)
- [x] Email recap — quantités affichées même pour `sur_devis:true`
- [x] Workflow git — pipeline branches/PR/merge propre
- [x] Audit sécurité initial (3 ÉLEVÉ corrigés, helmet + rate-limit + nodemailer CVE)
- [x] Plan audit complet rédigé (`docs/superpowers/plans/2026-05-31-audit-complet.md`)

---

## Tâches en cours / restantes ⏳

### Audit complet — pipeline multi-agents (`chore/audit-complet`)

- [ ] Créer branche `chore/audit-complet`
- [ ] Agent UX Designer — fix templates email (CID→SVG), PDF logo, couleurs React, theme.js
- [ ] Agent Développeur — fromEmail env var, helmet, timeout Puppeteer, regex email, logs anonymisés, nodemailer, .env.example
- [x] Agent Testeur — 9/9 tests passes (HTTP, Helmet, JSON, PDF)
- [x] Agent Code Reviewer — audit qualité tout le code modifié (APPROUVÉ)
- [x] Agent Sécurité — vérif MOYEN restants + npm audit (SUR — 2026-05-31)
- [ ] PR `chore/audit-complet` → `main` + merge

### Après audit

- [ ] Polices KALUFONIA + Classy Vogue (`client/src/assets/fonts/`) — en attente fichiers
- [ ] SIRET dans template PDF (`templates/devis-template.html`) — info à compléter

---

## Notes techniques

- `SMTP_PASS` dans `.env` = clé API Brevo `xkeysib-...` (89 chars)
- `ADMIN_EMAIL` dans `.env` = `REDACTED_EMAIL`
- Vite dev sur port **5180**
- Nodemon ignore `data/*`
- REST API Brevo : POST `https://api.brevo.com/v3/smtp/email` avec header `api-key: SMTP_PASS`
- Pipeline multi-agents obligatoire pour toute feature (voir CLAUDE.md)

---

## Audit sécurité

Dernier audit : 2026-05-31 — SUR (0 CRITIQUE/ÉLEVÉ)
npm audit : 0 vulnérabilité
Points MOYEN résiduels (non bloquants) :
- Rate limiting absent (à réinstaller — express-rate-limit disparu lors migration Brevo)
- BREVO_API_KEY fantôme dans .env.example (incohérence avec SMTP_PASS utilisé dans le code)
