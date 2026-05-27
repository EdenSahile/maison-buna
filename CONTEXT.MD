# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.
> Contient uniquement l'état courant et les prochaines étapes.
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build

Serveur : ✅ démarre sur port 3000 · route POST /api/devis opérationnelle
PDF : ✅ Puppeteer génère scripts/test-output.pdf (212 Ko testé)
Emails : ⚠️ SMTP Brevo non configuré dans .env (variables manquantes) — logique mailService.js correcte, envoi best-effort

---

## Features terminées

- **Infrastructure complète** — serveur, routes, services, templates, scripts de test
- **Pipeline multi-agents** — 5 agents dans `.claude/agents/`, rapports dans `reports/`
- **Audit sécurité** — 3 vulnérabilités ÉLEVÉ corrigées (nodemailer, err.message, rate-limit)

---

## Session en cours — Initialisation projet

### Checklist tâches

| # | Tâche | Fichier(s) | Statut |
|---|-------|------------|--------|
| 1 | Formulaire HTML | `public/index.html` | ✅ |
| 2 | Serveur Express | `server.js` | ✅ |
| 3 | Route POST /api/devis | `routes/devis.js` | ✅ |
| 4 | Validation données | `routes/devis.js` | ✅ |
| 5 | Stockage JSON | `data/storage.js` | ✅ |
| 6 | Service PDF | `services/pdfService.js` | ✅ |
| 7 | Template PDF | `templates/devis-template.html` | ✅ |
| 8 | Service mail | `services/mailService.js` | ✅ |
| 9 | Email client | `templates/email-client.html` | ✅ |
| 10 | Email admin | `templates/email-admin.html` | ✅ |
| 11 | Hook PostToolUse | `.claude/hooks/post-tool-use.js` | ✅ |
| 12 | Hook Stop | `.claude/hooks/stop.js` | ✅ |
| 13 | Scripts de test | `scripts/test-pdf.js` + `scripts/test-mail.js` | ✅ |

**Progression : 13/13 tâches cochées**

### Notes techniques

- SMTP : Brevo — variables dans `.env` (jamais committées)
- PDF : Puppeteer (headless Chrome) → rendu HTML fidèle à la charte
- Stockage : JSON simple (`data/devis.json`) — pas de BDD pour l'instant
- Charte : `#2e2010` `#4F3422` `#D3C2AC` `#AB9679` `#FAF7F3`
- Formulaire déjà finalisé : **ne pas modifier `public/index.html`**
- `ADMIN_EMAIL` dans `.env` = destinataire des notifications internes
- Node.js ESM (`"type": "module"`) — utiliser `import/export` partout

---

## Audit sécurité
Dernier audit : 2026-05-26
Verdict : ✅ SÛR (3 ÉLEVÉ corrigés — 0 CRITIQUE/ÉLEVÉ restant)
Points MOYEN restants : helmet.js absent · timeout Puppeteer absent · emails loggés en clair