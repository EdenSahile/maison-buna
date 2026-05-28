# Design — Migration React + Styled Components
**Date :** 2026-05-28
**Projet :** Maison Buna Devis

---

## Contexte

`public/index.html` est un fichier unique de ~1 686 lignes (HTML + CSS inline + JS vanilla). L'objectif est de le migrer vers une application React moderne, sans toucher au backend Express qui reste l'API.

---

## Décisions prises

| Décision | Choix |
|----------|-------|
| Bundler | Vite (standalone, port :5173) |
| Framework | React 18 |
| Style | Styled Components |
| Langage | JavaScript / JSX (pas TypeScript) |
| État | useState local + props drilling |
| UX formulaire | Migration 1:1 (scroll unique, 4 sections) |
| Composants | Décomposition plate (Approche 2) |

---

## Structure du projet

```
maison-buna-devis/
├── client/
│   ├── index.html
│   ├── vite.config.js             ← proxy /api/* → localhost:3000
│   ├── package.json               ← dépendances React séparées
│   └── src/
│       ├── main.jsx               ← ReactDOM.createRoot(...)
│       ├── App.jsx                ← <DevisForm />
│       ├── theme.js               ← palette Maison Buna
│       ├── components/
│       │   ├── DevisForm.jsx      ← état global + submit
│       │   ├── BrandPanel.jsx     ← sidebar gauche + stepper
│       │   ├── AudienceToggle.jsx ← toggle entreprise/particulier
│       │   ├── SectionProfil.jsx  ← section 01
│       │   ├── SectionContact.jsx ← section 02
│       │   ├── SectionCommande.jsx← section 03
│       │   ├── SectionPrecisions.jsx ← section 04
│       │   ├── SummaryRail.jsx    ← récapitulatif live
│       │   ├── SuccessView.jsx    ← vue post-envoi
│       │   └── Reusable-ui/
│       │       ├── Field.jsx      ← Label + input + erreur
│       │       ├── ChoiceGrid.jsx ← grille radio/checkbox cards
│       │       └── Button.jsx     ← primary + ghost
│       └── styles/
│           └── GlobalStyle.js     ← reset CSS global
│
├── server.js                      ← inchangé
├── routes/devis.js                ← inchangé (+ fix setImmediate)
└── package.json                   ← scripts root mis à jour
```

---

## Architecture

### Intégration Vite ↔ Express

- **Développement** : Vite sur `:5173`, proxy `/api/*` → Express `:3000`
- **Production** : `npm run build` génère `client/dist/`, Express sert ce dossier via `express.static`

### Arbre des composants

```
<App>
  └── <DevisForm>                     ← owns all state
        ├── <BrandPanel>              ← stepProgress[]
        ├── <AudienceToggle>          ← audience, onAudienceChange
        ├── <SectionProfil>           ← audience, formData, errors, onChange
        ├── <SectionContact>          ← formData, errors, onChange
        ├── <SectionCommande>         ← audience, formData, errors, onChange
        ├── <SectionPrecisions>       ← formData, onChange
        │     └── <SummaryRail>       ← formData
        └── <SuccessView>             ← formData, onReset
```

### State dans DevisForm

```js
const [audience, setAudience] = useState('entreprise')
const [formData, setFormData] = useState({ ...champsVides })
const [errors, setErrors] = useState({})
const [loading, setLoading] = useState(false)
const [submitted, setSubmitted] = useState(false)
```

---

## Styled Components

- `theme.js` exporte la palette complète (brown, accent, cream, sand, etc.)
- Chaque composant importe `theme` — aucune couleur hardcodée
- Les props dynamiques (`$invalid`, `$active`, `$done`) remplacent les toggles de classes CSS manuels

---

## Validation & Soumission

### Validation au submit

`validate(formData, audience)` retourne `{}` si tout est valide, sinon `{ champ: "message" }`.
Si des erreurs existent → state `errors` mis à jour → champs en rouge.

### Soumission (fix "Failed to fetch")

1. `loading = true` → bouton désactivé
2. `fetch('/api/devis', { method: 'POST', ... })`
3. Serveur répond **immédiatement** `{ success: true }` (avant PDF/emails)
4. `submitted = true` → `<SuccessView>` s'affiche
5. PDF + emails traités en `setImmediate` côté serveur

---

## Charte graphique

Polices : **Cormorant Garamond** (serif) + **Inter** (sans-serif), chargées via Google Fonts dans `client/index.html`. (Note : CLAUDE.md mentionne Jost, mais l'implémentation actuelle utilise Inter — on conserve Inter pour la migration 1:1.)

Palette (via `theme.js`) :
```
brown:    #3D2817
dark:     #1F1509
cream:    #E8DDCC
creamSoft:#F4ECE0
sand:     #9B8266
sandDark: #6F5A41
white:    #FBF8F3
line:     #E5DCCD
accent:   #C8753A
error:    #B0432E
ok:       #5C7A4F
```

---

## Hors scope

- TypeScript
- Multi-step avec navigation Suivant/Précédent
- Tests automatisés
- Authentification / dashboard admin
