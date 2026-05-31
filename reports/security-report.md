## Agent Sécurité — SÛR

### Résumé

- Fichiers audités : `server.js`, `routes/devis.js`, `services/pdfService.js`, `services/mailService.js`, `package.json`, `.gitignore`, `.env.example`
- npm audit : 0 vulnérabilité détectée
- Secrets : OK — aucun secret hardcodé, `.env` non commité
- Helmet : OK — headers CSP, HSTS, X-Frame-Options, X-Content-Type-Options confirmés en live
- Validation entrées : OK — regex email robuste, Content-Type 415, erreur 500 générique
- Rate limiting : ABSENT (MOYEN résiduel — non corrigé dans cet audit)

---

### Détail des points audités

#### 1. npm audit
- Statut : OK
- Résultat : `found 0 vulnerabilities`
- nodemailer a été intégralement supprimé et remplacé par un appel fetch direct vers l'API REST Brevo — les 4 CVE (dont CVSS 7.5 DoS) qui pesaient sur l'ancien audit sont éliminés à la racine.

#### 2. Secrets et données sensibles
- Statut : OK
- `git ls-files .env` : retourne vide — `.env` non tracké.
- `.gitignore` : `.env`, `node_modules/`, `data/devis.json`, `data/bg-errors.log` listés correctement.
- Grep `xkeysib|edensahile|apikey|api_key|password` sur tous les `.js` et `.html` (hors node_modules) : aucun résultat. Tous les secrets passent par `process.env`.
- Point résiduel MOYEN (signalé aussi par le Code Reviewer) : `.env.example` documente `BREVO_API_KEY=xkeysib-votreclé` ET `SMTP_PASS=votre_cle_brevo` alors que le code lit uniquement `process.env.SMTP_PASS`. La variable `BREVO_API_KEY` est un faux indicateur — aucun impact fonctionnel ou sécuritaire, mais peut induire en erreur lors du déploiement.

#### 3. Helmet — headers de sécurité
- Statut : OK
- `app.use(helmet())` est positionné en première ligne de middleware dans `server.js`, avant `express.json()` et le routeur.
- Headers confirmés en test live :
  - `Content-Security-Policy: default-src 'self'; ...` (configuration complète)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Powered-By` supprimé (non visible dans la réponse)

#### 4. Validation des entrées
- Statut : OK
- **Content-Type** : `if (!req.is('application/json')) return res.status(415)` est la première instruction du handler POST — toute requête sans `Content-Type: application/json` est rejetée avant toute autre logique.
- **Regex email** : `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — couvre les cas limites (`@.`, `@@..`, `a@b.`). Robuste et non contournable par injection de whitespace.
- **Erreur 500** : `res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' })` — message générique, `err.message` n'est jamais exposé au client. L'erreur complète est loggée côté serveur uniquement.
- **Logs anonymisés** : `console.log(\`Email client envoyé — id:${devis.id}\`)` — seul l'UUID du devis apparaît, jamais l'adresse email en clair.

#### 5. Rate limiting
- Statut : ABSENT
- Criticité résiduelle : MOYEN
- Grep `express-rate-limit` / `rateLimit` sur tous les fichiers sources : aucun résultat. La protection n'a pas été réintégrée lors de la migration Brevo REST.
- Rappel de risque : chaque requête POST peut déclencher une instance Puppeteer (Chrome) et deux appels API Brevo. Sans rate limiting, un attaquant peut saturer le serveur ou épuiser le quota Brevo.
- Recommandation : réinstaller `express-rate-limit` et appliquer un limiteur sur `/api/devis` (ex: 5 req/15 min/IP).

#### 6. Cohérence BREVO_API_KEY / SMTP_PASS
- Statut : MOYEN résiduel (signalé par le Code Reviewer, confirmé ici)
- `mailService.js` ligne 50 : `const apiKey = process.env.SMTP_PASS` — c'est bien `SMTP_PASS` qui est lu.
- `.env.example` documente les deux : `BREVO_API_KEY=xkeysib-votreclé` et `SMTP_PASS=votre_cle_brevo`. La variable `BREVO_API_KEY` n'est lue nulle part dans le code.
- Aucun impact sécuritaire direct — le bon secret est bien lu depuis l'environnement. Risque opérationnel uniquement (déploiement sur un nouveau serveur sans définir `SMTP_PASS`).

#### 7. Puppeteer — timeout
- Statut : OK
- `pdfService.js` ligne 21 : `await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 })` — timeout de 10 secondes en place.
- Le bloc `finally { await browser.close() }` garantit la fermeture du processus Chrome même en cas d'exception — aucun risque de fuite de processus.

---

### Points résiduels non corrigés dans cet audit

| # | Vulnérabilité | Criticité | Action recommandée |
|---|---------------|-----------|-------------------|
| 1 | Rate limiting absent sur POST /api/devis | MOYEN | Réinstaller `express-rate-limit`, limiter à 5 req/15 min/IP |
| 2 | `BREVO_API_KEY` fantôme dans `.env.example` | MOYEN | Supprimer la ligne `BREVO_API_KEY` de `.env.example` ou renommer `SMTP_PASS` → `BREVO_API_KEY` dans le code |
| 3 | `base_url` injecté dans `devis` mais inutilisé dans les templates | FAIBLE | Supprimer `routes/devis.js` ligne 141 (code mort) |
| 4 | Absence de `try/catch` dans `sendOne()` | FAIBLE | Encapsuler le `fetch()` Brevo pour une gestion d'erreur plus lisible |

---

### Points positifs

- **nodemailer supprimé** : la migration vers l'API REST Brevo native élimine 4 CVE d'un coup — meilleure décision architecturale possible.
- **Helmet complet** : 4 headers de sécurité majeurs confirmés en test live, position correcte avant tous les autres middlewares.
- **Validation entrées solide** : Content-Type, regex email et message d'erreur générique tous en place et testés.
- **Logs RGPD-compatibles** : seul l'ID UUID est loggé, jamais les données personnelles.
- **Puppeteer sans fuite** : timeout + bloc `finally` garantissent la fermeture systématique du navigateur headless.
- **`.env` propre** : aucun secret dans git, `.gitignore` correct.
- **`data/devis.json` non accessible** : le répertoire `data/` n'est pas sous `public/` — inaccessible via HTTP.
- **npm audit : 0 vulnérabilité** — arbre de dépendances propre.

---

### Actions prioritaires

1. Réinstaller `express-rate-limit` sur `POST /api/devis` (MOYEN — était présent, disparu lors de la migration Brevo).
2. Nettoyer `.env.example` : supprimer `BREVO_API_KEY` ou renommer `SMTP_PASS` en cohérence avec le nom réel de la variable.

---

### Verdict final

SUR — Pipeline terminé avec succès

Aucune vulnérabilité CRITIQUE ou ÉLEVÉE. Les 8 points identifiés lors de l'audit initial de mai 2026 sont tous corrigés ou éliminés. Deux points MOYEN résiduels (rate limiting manquant, incohérence `.env.example`) à traiter avant mise en production mais non bloquants pour le pipeline.
