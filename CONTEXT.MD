# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

Serveur : ⬜ non démarré · session [à remplir]
PDF : ⬜ non testé
Emails : ⬜ non testés

---

## Features terminées

_(aucune pour l'instant)_

---

## Session en cours — Initialisation projet

### Checklist tâches

| # | Tâche | Fichier(s) | Statut |
|---|-------|------------|--------|
| 1 | Formulaire HTML | `public/index.html` | ✅ |
| 2 | Serveur Express | `server.js` | ⬜ |
| 3 | Route POST /api/devis | `routes/devis.js` | ⬜ |
| 4 | Validation données | `routes/devis.js` | ⬜ |
| 5 | Stockage JSON | `data/storage.js` | ⬜ |
| 6 | Service PDF | `services/pdfService.js` | ⬜ |
| 7 | Template PDF | `templates/devis-template.html` | ⬜ |
| 8 | Service mail | `services/mailService.js` | ⬜ |
| 9 | Email client | `templates/email-client.html` | ⬜ |
| 10 | Email admin | `templates/email-admin.html` | ⬜ |
| 11 | Hook PostToolUse | `.claude/hooks/post-tool-use.js` | ✅ |
| 12 | Hook Stop | `.claude/hooks/stop.js` | ✅ |
| 13 | Scripts de test | `scripts/test-pdf.js` + `scripts/test-mail.js` | ⬜ |

**Progression : 3/13 tâches cochées**

### Notes techniques

- SMTP : Brevo — variables dans `.env` (jamais committées)
- PDF : Puppeteer (headless Chrome) → rendu HTML fidèle à la charte
- Stockage : JSON simple (`data/devis.json`) — pas de BDD pour l'instant
- Charte : `#2e2010` `#4F3422` `#D3C2AC` `#AB9679` `#FAF7F3`
- Formulaire déjà finalisé : **ne pas modifier `public/index.html`**
- `ADMIN_EMAIL` dans `.env` = destinataire des notifications internes
- Node.js ESM (`"type": "module"`) — utiliser `import/export` partout