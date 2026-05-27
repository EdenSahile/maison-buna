## Agent Sécurité — SÛR

### Résumé

- Fichiers audités : `server.js`, `routes/devis.js`, `data/storage.js`, `services/pdfService.js`, `services/mailService.js`, `package.json`, `.gitignore`
- Vulnérabilités initiales : 6 (CRITIQUE 0 · ÉLEVÉ 3 · MOYEN 3 · FAIBLE 2)
- Correctifs appliqués (2026-05-26) : 3 ÉLEVÉ corrigés → **0 ÉLEVÉ restant**
- npm audit : 0 vulnérabilité (nodemailer mis à jour)

### Correctifs appliqués

| # | Vulnérabilité | Correction | Statut |
|---|---------------|------------|--------|
| 1 | nodemailer CVE (DoS CVSS 7.5) | `npm install nodemailer@latest` | ✅ |
| 2 | err.message exposé en 500 | Message générique dans routes/devis.js | ✅ |
| 3 | Absence rate limiting | express-rate-limit 10 req/15min/IP | ✅ |

---

### Détail des vulnérabilités

#### 1. Dépendance nodemailer vulnérable (4 CVE groupés)
- Criticité : ÉLEVÉ
- Fichier : `package.json` — `"nodemailer": "^6.9.0"` (version installée ≤8.0.4)
- Problème : La version installée est affectée par quatre vulnérabilités :
  - **GHSA-rcmh-qjqh-p98v** (CVSS 7.5 — HIGH) : DoS via appels récursifs dans l'addressparser — un attaquant peut bloquer le serveur en fournissant une adresse email malformée
  - **GHSA-mm7p-fcc7-pg87** (moderate) : Email envoyé vers un domaine non prévu par confusion d'interprétation
  - **GHSA-c7w3-x93f-qmm8** (low) : Injection de commandes SMTP via paramètre `envelope.size` non assaini
  - **GHSA-vvjj-xcjg-gr5g** (moderate) : Injection SMTP via CRLF dans l'option `Transport name` (EHLO/HELO)
- Risque : La faille DoS (CVSS 7.5) est directement exploitable via le champ `email` soumis dans le formulaire, même si la validation côté serveur est en place — l'addressparser de nodemailer est appelé avec la valeur utilisateur.
- Recommandation : Mettre à jour nodemailer vers la version 8.0.9 minimum (`npm install nodemailer@latest`). Note : c'est un breaking change (major), tester la compatibilité des options du transporter après mise à jour.

---

#### 2. err.message exposé au client dans la réponse 500
- Criticité : ÉLEVÉ
- Fichier : `routes/devis.js` — ligne 70
- Problème : `res.status(500).json({ error: err.message })` retourne le message d'erreur natif Node.js au client. Lors d'une erreur Puppeteer ou d'un accès fichier, ce message peut contenir des chemins système absolus (ex: `ENOENT: no such file or directory, open '/Users/macbookeden/Desktop/maison-buna-devis/templates/devis-template.html'`), révélant la structure interne du serveur.
- Risque : Information disclosure — facilite la reconnaissance pour un attaquant.
- Recommandation : Remplacer par `res.status(500).json({ error: 'Erreur interne du serveur' })` et conserver `console.error('Erreur /api/devis :', err)` pour le logging interne.

---

#### 3. Absence de rate limiting sur POST /api/devis
- Criticité : ÉLEVÉ
- Fichier : `server.js` / `routes/devis.js`
- Problème : Aucun middleware de rate limiting n'est en place sur la route `POST /api/devis`. Chaque requête lance une instance Puppeteer (processus Chrome) et potentiellement deux envois SMTP. Un attaquant peut soumettre des centaines de requêtes en quelques secondes.
- Risque : Déni de service (saturation CPU/mémoire via Puppeteer), abus de quota SMTP Brevo (compte suspendu), coûts non maîtrisés.
- Recommandation : Ajouter `express-rate-limit` avec une limite stricte (ex: 5 requêtes / 15 min / IP) sur la route `/api/devis`.

---

#### 4. Données personnelles loggées en clair (emails)
- Criticité : MOYEN
- Fichier : `services/mailService.js` — lignes 39 et 48
- Problème : `console.log(`Email client envoyé à ${devis.email}`)` et `console.log(`Email admin envoyé à ${process.env.ADMIN_EMAIL}`)` — les adresses email des clients apparaissent en clair dans les logs serveur.
- Risque : Si les logs sont collectés par un service tiers (ex: Vercel, Heroku, Datadog), les données personnelles des clients y sont exposées, ce qui pose un problème de conformité RGPD.
- Recommandation : Masquer ou supprimer l'adresse email dans les logs (`devis.email.replace(/(.{2}).+(@.+)/, '$1***$2')`) ou ne logger que l'ID du devis.

---

#### 5. Absence de headers de sécurité HTTP (helmet.js)
- Criticité : MOYEN
- Fichier : `server.js`
- Problème : Aucun middleware de headers de sécurité (helmet) n'est configuré. Les headers par défaut d'Express exposent `X-Powered-By: Express` et n'incluent pas `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, etc.
- Risque : Surface d'attaque élargie (clickjacking, MIME sniffing, fingerprinting du serveur).
- Recommandation : Ajouter `import helmet from 'helmet'` et `app.use(helmet())` au début de `server.js`. Installer : `npm install helmet`.

---

#### 6. Absence de timeout Puppeteer
- Criticité : MOYEN
- Fichier : `services/pdfService.js` — ligne 15
- Problème : `puppeteer.launch({ headless: true })` sans timeout configuré. Si le rendu HTML hang (ex: ressource externe qui ne répond pas dans `waitUntil: 'networkidle0'`), le processus Chrome reste bloqué indéfiniment, occupant des ressources serveur.
- Risque : Fuite de processus progressive en cas de requêtes bloquées, pouvant mener à un déni de service par épuisement des ressources.
- Recommandation : Ajouter un timeout explicite : `page.setDefaultNavigationTimeout(10000)` après `browser.newPage()`, et un timeout sur `page.pdf()` via les options Puppeteer.

---

#### 7. Validation email insuffisante
- Criticité : FAIBLE
- Fichier : `routes/devis.js` — ligne 35
- Problème : La validation `email.includes('@') && email.includes('.')` accepte des valeurs invalides (`@.`, `@@..`, `a@b.`) et ne bloque pas les adresses malformées qui pourraient déclencher des comportements inattendus dans nodemailer (cf. vulnérabilité DoS ci-dessus).
- Risque : Amplifie la surface d'exposition à la faille DoS de nodemailer.
- Recommandation : Utiliser une regex minimale : `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)`.

---

#### 8. Validation du Content-Type absente
- Criticité : FAIBLE
- Fichier : `server.js` / `routes/devis.js`
- Problème : Aucune vérification que le Content-Type de la requête POST est bien `application/json`. Express parse `req.body` uniquement si le header est correct, mais en l'absence de middleware de validation du Content-Type, des requêtes malformées peuvent générer un `req.body` vide sans erreur explicite.
- Risque : Comportement inattendu difficile à diagnostiquer, pas de vecteur d'attaque direct.
- Recommandation : Ajouter une vérification en début de route : `if (!req.is('application/json')) return res.status(415).json({ error: 'Content-Type application/json requis' })`.

---

### Points positifs

- **`.env` non commité** : `git ls-files .env` retourne vide — le fichier `.env` n'est pas dans le dépôt git.
- **`.gitignore` correct** : `.env`, `node_modules/` et `data/devis.json` sont listés.
- **Aucun secret hardcodé** : Toutes les credentials (SMTP_USER, SMTP_PASS, ADMIN_EMAIL) passent exclusivement par `process.env`.
- **`data/` hors de `public/`** : Le répertoire `data/` est à la racine du projet, pas dans `public/`. `express.static('public')` ne sert que `public/index.html` — `data/devis.json` n'est PAS accessible via HTTP.
- **Cryptographie correcte** : `crypto.randomUUID()` (module natif Node.js) utilisé pour les IDs — pas de solution maison.
- **Isolation des erreurs email** : L'échec SMTP est isolé dans son propre `try/catch` — l'erreur ne fuit pas dans la réponse cliente.
- **Pas de dépendances inutiles** : Package.json minimal, pas de librairies superflues.
- **Champs obligatoires validés** : La boucle `Object.entries` sur `champsObligatoires` est exhaustive et lisible.

---

### Actions prioritaires

1. **Mettre à jour nodemailer** : `npm install nodemailer@latest` — corrige 4 CVE dont 1 HIGH (DoS). Tester la compatibilité du transporter après mise à jour.
2. **Masquer err.message dans la réponse 500** : Retourner un message générique fixe au client dans `routes/devis.js` ligne 70.
3. **Ajouter rate limiting** : Installer `express-rate-limit` et limiter `POST /api/devis` à ~5 req/15min/IP.
4. **Anonymiser les logs email** : Masquer les adresses email dans les `console.log` de `mailService.js`.
5. **Ajouter helmet.js** : `npm install helmet` + `app.use(helmet())` dans `server.js`.
6. **Ajouter un timeout Puppeteer** : `page.setDefaultNavigationTimeout(10000)` dans `pdfService.js`.

---

### Verdict final

✅ **SÛR** — Pipeline terminé avec succès

Les 3 vulnérabilités ÉLEVÉ ont été corrigées le 2026-05-26. Aucune faille CRITIQUE ou ÉLEVÉE restante. Points MOYEN à traiter avant mise en production (helm, timeout Puppeteer, anonymisation logs).
