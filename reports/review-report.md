## Code Reviewer — APPROUVÉ

### Fichiers reviewés

1. `templates/email-client.html` — CID -> SVG inline
2. `templates/email-admin.html` — CID -> SVG inline
3. `services/pdfService.js` — logo-buna.png (PNG base64)
4. `services/mailService.js` — fromEmail env, inlineImages supprimé, logs anonymisés
5. `server.js` — helmet.js ajouté
6. `routes/devis.js` — regex email, Content-Type validation
7. `package.json` — nodemailer retiré
8. `.env.example` — BASE_URL retiré
9. `client/src/components/BrandPanel.jsx` — logo + theme
10. `client/src/theme.js` — couleurs charte
11. `client/src/components/SectionCommande.jsx` — couleurs -> theme

---

### Points positifs

- **ESM strict** : aucun `require()` dans aucun fichier, `"type": "module"` présent dans `package.json`, toutes les extensions `.js` présentes dans les imports relatifs (`./routes/devis.js`, `../data/storage.js`, etc.).
- **`import.meta.url` utilisé correctement** dans `pdfService.js` et `mailService.js` pour construire les chemins de fichiers.
- **Suppression propre de nodemailer** : aucune référence résiduelle dans les fichiers sources, `package.json` à jour.
- **Logo email SVG inline** : la migration CID -> SVG inline élimine les problèmes d'affichage en pièce jointe. Les couleurs SVG respectent strictement la charte (#4F3422 et #FAF7F3).
- **Logo PDF base64** : `pdfService.js` embed correctement le PNG en base64, le test T9 confirme un PDF de 173 308 octets sans erreur ENOENT.
- **Helmet ajouté** : `app.use(helmet())` en place avant `express.json()`, les headers T7 confirment CSP + X-Content-Type-Options + X-Frame-Options.
- **Validation Content-Type** : `req.is('application/json')` renvoie 415 proprement, testé en T2.
- **Regex email améliorée** : `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` couvre les cas limites (@., @@..) testés en T3 et T4.
- **Logs anonymisés** : seul l'`id` est loggé (`Email client envoyé — id:${devis.id}`), jamais l'adresse email en clair.
- **Puppeteer fermé dans `finally`** : `pdfService.js` lignes 24-26 — aucun risque de fuite de processus headless.
- **theme.js** : les 5 couleurs de la charte Maison Buna sont toutes présentes et exactes. Les couleurs supplémentaires (`sandDark`, `accent`, `error`, `ok`) sont des extensions fonctionnelles légitimes pour les états UI (erreur formulaire, succès, hover).
- **BrandPanel.jsx et SectionCommande.jsx** : aucune couleur hex hardcodée — tout passe par `theme.*`.
- **Architecture** : `server.js` ne contient que le démarrage et les middlewares globaux. La route orchestre sans logique métier complexe. Les services encapsulent leur domaine.
- **Réponse client non bloquée** : le `setImmediate` dans `routes/devis.js` isole le PDF+email du chemin critique, avec son propre `try/catch`.

---

### Points à corriger

| Fichier | Problème | Priorité |
|---------|----------|----------|
| `.env.example` | `BREVO_API_KEY` est documenté mais aucun fichier JS ne lit `process.env.BREVO_API_KEY` — le code lit `process.env.SMTP_PASS` pour la clé API Brevo (héritage de l'ancien SMTP). La variable `BREVO_API_KEY` dans `.env.example` est un faux indicateur qui peut induire en erreur un nouveau développeur. Recommandation : supprimer `BREVO_API_KEY` de `.env.example` ou renommer `SMTP_PASS` en `BREVO_API_KEY` dans le code et dans `.env`. | MOYENNE |
| `routes/devis.js` ligne 141 | `base_url: process.env.BASE_URL \|\| 'http://localhost:3000'` est calculé et injecté dans l'objet `devis`, mais aucun template (email-client.html, email-admin.html, devis-template.html) ne l'utilise. C'est du code mort. Recommandation : supprimer cette ligne. | FAIBLE |
| `services/mailService.js` | Aucun `try/catch` dans `sendOne()` autour du `fetch()`. Si la réponse Brevo est corrompue ou le réseau coupe, l'erreur remonte brute. Le catch est présent dans `routes/devis.js` (setImmediate), donc pas bloquant fonctionnellement — mais la gestion serait plus lisible dans `sendOne` directement. | FAIBLE |
| `client/src/components/BrandPanel.jsx` ligne 157 | `STEPS[0]` n'a pas de propriété `label` : `{ num: '01', id: 1 }`. La ligne 166 (`label = i === 0 ? step1Label : step.label`) compense dynamiquement, ce qui fonctionne. Mais l'incohérence avec les 3 autres entrées qui ont toutes un `label` fixe peut surprendre un lecteur. Recommandation : ajouter `label: ''` ou un label placeholder pour la cohérence du tableau. | FAIBLE |

---

### Verdict

✅ **APPROUVÉ** — Prêt pour : Agent Sécurité

Un seul point de priorité MOYENNE (incohérence `BREVO_API_KEY` / `SMTP_PASS` dans `.env.example`) sans impact sur le fonctionnement ou la sécurité. Les trois points FAIBLE sont des améliorations de lisibilité. Aucun problème bloquant, aucune régression fonctionnelle, aucun secret hardcodé.
