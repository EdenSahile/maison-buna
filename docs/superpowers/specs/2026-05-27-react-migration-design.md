# Design — Migration React · Maison Buna Devis

**Date :** 2026-05-27  
**Branche :** `feature/react-migration`  
**Statut :** Approuvé

---

## Contexte

Conversion de `public/index.html` (HTML/CSS/JS vanilla, ~1700 lignes) en application React 18 + Vite + Styled Components v6. Le serveur Express (:3000) reste inchangé — seul le frontend est migré.

---

## Stack technique

| Couche | Choix |
|---|---|
| Framework UI | React 18 |
| Build tool | Vite (racine du projet) |
| CSS-in-JS | Styled Components v6 |
| Dev multi-processus | concurrently (Vite :5173 + Express :3000) |
| API proxy | `vite.config.js` → `/api` → `http://localhost:3000` |

Aucun autre framework CSS (pas Tailwind, pas Bootstrap).

---

## Architecture des fichiers

```
maison-buna-devis/
├── server.js                   ← Express :3000 (inchangé)
├── vite.config.js              ← nouveau — proxy /api → :3000
├── index.html                  ← point d'entrée Vite (racine, pas public/)
├── src/
│   ├── main.jsx                ← ReactDOM.createRoot + ThemeProvider + GlobalStyle
│   ├── App.jsx                 ← Shell + state showSuccess + data soumise
│   ├── theme.js                ← source de vérité couleurs, polices, breakpoints
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Shell.jsx       ← CSS grid 420px | 1fr
│   │   │   ├── BrandPanel.jsx  ← panneau gauche fixe, reçoit stepStatuses[]
│   │   │   └── FormArea.jsx    ← zone droite, switch form↔success
│   │   ├── form/
│   │   │   ├── DevisForm.jsx   ← orchestrateur — hooks + handlers + submit
│   │   │   ├── AudienceToggle.jsx  ← toggle entreprise/particulier
│   │   │   ├── Stepper.jsx     ← 4 étapes cliquables (rendu dans BrandPanel)
│   │   │   ├── ProgressBar.jsx ← barre % + label
│   │   │   ├── ChoiceGrid.jsx  ← grille radio ou checkbox styled
│   │   │   ├── Field.jsx       ← wrapper label + input/select/textarea + erreur
│   │   │   └── SummaryRail.jsx ← récapitulatif live section 4
│   │   └── success/
│   │       ├── SuccessView.jsx ← vue confirmation avec animation fadeUp
│   │       └── SummaryBox.jsx  ← tableau récapitulatif post-submit
│   ├── hooks/
│   │   ├── useFormData.js      ← useState pour tous les champs
│   │   ├── useProgress.js      ← calcul % + stepStatuses[]
│   │   └── useValidation.js    ← errors{}, touch(), validate(), isValid()
│   └── utils/
│       └── helpers.js          ← escapeHtml, validateEmail, validateCP
├── public/
│   └── assets/
│       └── monogram-mb.png     ← déjà présent
└── package.json                ← + vite react styled-components concurrently
```

---

## Theme (source de vérité)

```js
// src/theme.js
export const theme = {
  // Couleurs
  cream: '#E8DDCC',
  creamSoft: '#F4ECE0',
  sand: '#9B8266',
  sandDark: '#6F5A41',
  brown: '#3D2817',
  dark: '#1F1509',
  white: '#FBF8F3',
  line: '#E5DCCD',
  accent: '#C8753A',
  error: '#B0432E',
  ok: '#5C7A4F',
  // Polices
  fontSerif: "'Cormorant Garamond', serif",
  fontSans: "'Inter', system-ui, sans-serif",
  // Breakpoints
  bp: {
    tablet: '1024px',
    mobile: '640px',
  },
}
```

**Règle absolue :** aucune couleur hardcodée dans les composants — toujours `${({ theme }) => theme.xxx}`.

---

## Gestion d'état — Approche hooks centralisés

### useFormData.js
- Gère tous les champs : `societe`, `prenom`, `nom`, `email`, `telephone`, `collaborateurs`, `secteur`, `ville`, `adresse`, `codepostal`, `quantite`, `quantiteP`, `frequence`, `moutures[]`, `message`, `audience`
- Expose : `data`, `setField(name, value)`, `resetForm()`
- `moutures` est un tableau — `setField('moutures', [...])` remplace le tableau entier

### useProgress.js
- Reçoit `data` (objet formData courant)
- Calcule `pct` (0–100) selon les règles de pondération du HTML original
- Calcule `stepStatuses[]` : tableau de 4 booléens (étape complète ou non)
- Expose : `{ pct, stepStatuses }`

### useValidation.js
- Gère `errors` : objet `{ fieldName: string | null }`
- Expose `validateAll(data, audience)` → `{ valid: boolean, firstInvalid: string | null }`
- Expose `setError(field, msg)`, `clearError(field)`, `clearAll()`

---

## Flux de données

```
App.jsx
  state: showSuccess (bool), submittedData (object)
  └── Shell
        ├── BrandPanel
        │     └── Stepper(stepStatuses, onStepClick)
        └── FormArea
              ├── [!showSuccess] DevisForm
              │     ← useFormData() → data, setField, resetForm
              │     ← useProgress(data) → pct, stepStatuses
              │     ← useValidation() → errors, validateAll, clearError
              │     ├── ProgressBar(pct)
              │     ├── AudienceToggle(audience, onChange)
              │     ├── Section 1 (conditionnel audience)
              │     │     Field + ChoiceGrid (entreprise OU particulier)
              │     ├── Section 2 — Field contact
              │     ├── Section 3 — ChoiceGrid quantité + fréquence + mouture
              │     ├── Section 4 — Field message + SummaryRail(data)
              │     └── Submit → onSuccess(data) → App.showSuccess = true
              └── [showSuccess] SuccessView(submittedData, onReset)
                    └── SummaryBox(rows)
```

**Remontée stepStatuses vers BrandPanel :**  
`DevisForm` appelle `useProgress(data)` → passe `stepStatuses` au callback `onStepStatusChange` dans App → App passe à BrandPanel via props.

---

## Points d'implémentation critiques

### 1. Rendu conditionnel audience (pas de CSS `display:none`)
```jsx
// HTML : [data-audience="entreprise"] .part-only { display: none }
// React :
{audience === 'entreprise' && <FieldSociete />}
{audience === 'particulier' && <FieldAdresse />}
```

### 2. ChoiceGrid — radio et checkbox unifiés
Le composant `ChoiceGrid` reçoit :
- `type`: `'radio'` | `'checkbox'`  
- `name`: string  
- `value` / `values[]`: valeur(s) sélectionnée(s)  
- `onChange`: handler  
- `options`: `[{ id, value, main, sub }]`

La logique checked/unchecked est dans le composant. Les styled components gèrent l'apparence via props.

### 3. SummaryRail — rendu React (pas innerHTML)
```jsx
// Pas de dangerouslySetInnerHTML
// Les <strong> sont des composants React
<RailText>
  Votre demande : <strong>{societe}</strong> · {collaborateurs} collab. …
</RailText>
```

### 4. Scroll vers premier champ invalide
`useValidation.validateAll()` retourne `firstInvalid`. Dans `DevisForm` :
```js
document.getElementById('field-' + firstInvalid)
  ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
```
Les IDs des wrappers Field sont conservés pour cette raison.

### 5. Animation SuccessView
```js
import { keyframes } from 'styled-components';
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const SuccessWrapper = styled.div`
  animation: ${fadeUp} 0.6s cubic-bezier(.4,0,.2,1);
`;
```

### 6. Bruit de fond (body::before)
Le SVG noise filter est un `GlobalStyle` dans `main.jsx` — impossible en Styled Component pur sans GlobalStyle.

### 7. Suppression de public/index.html
`public/index.html` est supprimé. Le nouveau point d'entrée Vite est `index.html` à la **racine** du projet. `public/` ne contient plus que `assets/`. Note : `CLAUDE.md` devra être mis à jour pour refléter que le formulaire est maintenant dans `src/`.

---

## Scripts package.json mis à jour

```json
{
  "scripts": {
    "dev":     "concurrently \"vite\" \"nodemon server.js\"",
    "build":   "vite build",
    "preview": "vite preview",
    "start":   "node server.js",
    "pdf:test":  "node scripts/test-pdf.js",
    "mail:test": "node scripts/test-mail.js"
  }
}
```

---

## Comportements à conserver identiquement

| Comportement | Mécanisme HTML | Mécanisme React |
|---|---|---|
| Toggle audience | `data-audience` + CSS | `useState('entreprise')` + rendu conditionnel |
| Validation temps réel | `addEventListener('input')` | `onChange` sur chaque Field |
| Progress % | `updateProgress()` JS | `useProgress(data)` recalcule à chaque render |
| Stepper actif/done | `classList.add('is-active')` | props `status` sur Step styled component |
| Récapitulatif live | `innerHTML` | rendu JSX dans SummaryRail |
| Submit avec validation | `form.addEventListener('submit')` | `onSubmit` React + `validateAll()` |
| Succès → SuccessView | `display:none` / `display:block` | `showSuccess` state en App |
| "Nouvelle demande" | `form.reset()` | `resetForm()` hook |
| Scroll smooth | `scrollIntoView` | `scrollIntoView` (id conservés) |
| Navigation stepper | `scrollIntoView` | `scrollIntoView` (section IDs conservés) |

---

## Responsive

Les breakpoints sont dans le theme (`theme.bp.tablet`, `theme.bp.mobile`).  
Chaque styled component qui a des media queries dans le HTML les réplique :
```js
@media (max-width: ${({ theme }) => theme.bp.tablet}) { ... }
@media (max-width: ${({ theme }) => theme.bp.mobile}) { ... }
```

---

## Critères de succès

- [ ] `npm run dev` démarre les deux serveurs sans erreur
- [ ] Le formulaire se comporte identiquement au HTML original
- [ ] Aucun fichier `.css` séparé, aucun style inline non justifié
- [ ] Aucune couleur hardcodée hors `theme.js`
- [ ] `npm run build` produit un `dist/` valide
- [ ] La soumission du formulaire appelle bien `/api/devis` (proxié vers :3000)

---

## Ce qui NE change PAS

- `server.js`, `routes/`, `services/`, `templates/`, `data/`
- `scripts/test-pdf.js`, `scripts/test-mail.js`
- `.env`, `.env.example`
- Les valeurs des options (quantités, fréquences, moutures, secteurs)
- Les textes et labels
