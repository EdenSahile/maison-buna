# React + Styled Components Migration — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer `public/index.html` (vanilla HTML/CSS/JS, ~1 686 lignes) vers une application React + Styled Components servie par Vite, sans toucher à l'API Express.

**Architecture:** Vite standalone (`:5173`) proxy `/api` → Express (`:3000`). En production, `npm run build` génère `client/dist/` que Express sert via `express.static`. `DevisForm` possède tout l'état et le distribue via props aux composants enfants.

**Tech Stack:** React 18, Vite 5, Styled Components 6, Vitest (tests utils pures), Express 4 (inchangé)

---

## Carte des fichiers

| Fichier | Rôle |
|---------|------|
| `client/index.html` | Point d'entrée Vite + Google Fonts |
| `client/vite.config.js` | Config Vite + proxy `/api` |
| `client/src/main.jsx` | Monte `<App>` avec GlobalStyle |
| `client/src/App.jsx` | Racine → `<DevisForm>` |
| `client/src/theme.js` | Palette Maison Buna |
| `client/src/styles/GlobalStyle.js` | Reset CSS global |
| `client/src/utils/formUtils.js` | validate, computeProgress, buildPayload |
| `client/src/utils/formUtils.test.js` | Tests Vitest des utils |
| `client/src/components/Reusable-ui/Button.jsx` | PrimaryButton + GhostButton |
| `client/src/components/Reusable-ui/SectionHead.jsx` | En-tête numérotée de section |
| `client/src/components/Reusable-ui/Field.jsx` | Label + input/select/textarea + erreur |
| `client/src/components/Reusable-ui/ChoiceGrid.jsx` | Grille radio/checkbox cards |
| `client/src/components/BrandPanel.jsx` | Sidebar gauche + stepper |
| `client/src/components/AudienceToggle.jsx` | Toggle entreprise / particulier |
| `client/src/components/SectionProfil.jsx` | Section 01 |
| `client/src/components/SectionContact.jsx` | Section 02 |
| `client/src/components/SectionCommande.jsx` | Section 03 |
| `client/src/components/SummaryRail.jsx` | Récap live |
| `client/src/components/SectionPrecisions.jsx` | Section 04 |
| `client/src/components/SuccessView.jsx` | Vue post-envoi |
| `client/src/components/DevisForm.jsx` | État global + submit |
| `routes/devis.js` | Fix setImmediate (respond avant PDF) |
| `server.js` | Servir `client/dist/` en prod |
| `package.json` (root) | Scripts mis à jour |

---

## Task 1 — Bootstrap Vite + React dans `client/`

**Files:**
- Create: `client/` (via scaffolding)
- Create: `client/vite.config.js`
- Create: `client/index.html`

- [ ] **Step 1: Scaffolder le projet Vite dans le répertoire racine**

```bash
npm create vite@latest client -- --template react
```

- [ ] **Step 2: Installer les dépendances**

```bash
cd client && npm install && npm install styled-components
```

- [ ] **Step 3: Copier les assets publics**

```bash
cp -r ../public/assets client/public/
```

(Si le dossier `public/assets` n'existe pas, ignorer cette étape — les images seront absentes mais sans erreur bloquante.)

- [ ] **Step 4: Remplacer `client/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

- [ ] **Step 5: Remplacer `client/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Maison Buna — Demande de devis</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Vérifier que le dev server démarre**

Depuis la racine du projet, démarrer Express puis Vite :
```bash
# Terminal 1
node server.js

# Terminal 2
cd client && npm run dev
```

Ouvrir `http://localhost:5173` — la page React par défaut (Vite logo) doit s'afficher. Pas d'erreur dans la console.

- [ ] **Step 7: Supprimer les fichiers de démo Vite inutiles**

```bash
rm client/src/App.css client/src/index.css
rm -f client/src/assets/react.svg client/public/vite.svg
```

- [ ] **Step 8: Commit**

```bash
git add client/
git commit -m "chore: bootstrap Vite + React dans client/"
```

---

## Task 2 — Theme + GlobalStyle + main.jsx + App.jsx

**Files:**
- Create: `client/src/theme.js`
- Create: `client/src/styles/GlobalStyle.js`
- Modify: `client/src/main.jsx`
- Create: `client/src/App.jsx`

- [ ] **Step 1: Créer `client/src/theme.js`**

```js
const theme = {
  brown: '#3D2817',
  dark: '#1F1509',
  cream: '#E8DDCC',
  creamSoft: '#F4ECE0',
  sand: '#9B8266',
  sandDark: '#6F5A41',
  white: '#FBF8F3',
  line: '#E5DCCD',
  accent: '#C8753A',
  error: '#B0432E',
  ok: '#5C7A4F',
}

export default theme
```

- [ ] **Step 2: Créer `client/src/styles/GlobalStyle.js`**

```js
import { createGlobalStyle } from 'styled-components'
import theme from '../theme'

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    background: ${theme.white};
    color: ${theme.dark};
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.5;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 100;
    mix-blend-mode: multiply;
  }
`

export default GlobalStyle
```

- [ ] **Step 3: Remplacer `client/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import GlobalStyle from './styles/GlobalStyle'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 4: Créer `client/src/App.jsx`**

```jsx
import DevisForm from './components/DevisForm'

export default function App() {
  return <DevisForm />
}
```

- [ ] **Step 5: Vérifier dans le browser**

`http://localhost:5173` — la page doit afficher un fond crème clair (`#FBF8F3`), sans erreur console.

- [ ] **Step 6: Commit**

```bash
git add client/src/
git commit -m "feat: theme + GlobalStyle + App skeleton"
```

---

## Task 3 — Reusable-ui : Button + SectionHead

**Files:**
- Create: `client/src/components/Reusable-ui/Button.jsx`
- Create: `client/src/components/Reusable-ui/SectionHead.jsx`

- [ ] **Step 1: Créer `client/src/components/Reusable-ui/Button.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../../theme'

export const PrimaryButton = styled.button`
  background: ${theme.brown};
  color: ${theme.white};
  border: none;
  padding: 16px 32px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 4px 14px rgba(61,40,23,0.18);

  &:hover {
    background: ${theme.dark};
    transform: translateY(-1px);
    box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 8px 20px rgba(61,40,23,0.28);
  }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  svg { transition: transform 0.25s ease; }
  &:hover svg { transform: translateX(3px); }
`

export const GhostButton = styled.button`
  background: transparent;
  color: ${theme.brown};
  border: 1px solid ${theme.line};
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.creamSoft};
    border-color: ${theme.sand};
  }
`
```

- [ ] **Step 2: Créer `client/src/components/Reusable-ui/SectionHead.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../../theme'

const Head = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.line};
`

const Num = styled.span`
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 22px;
  color: ${theme.accent};
  line-height: 1;
`

const Title = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: 26px;
  color: ${theme.brown};
  letter-spacing: -0.3px;
`

const Meta = styled.span`
  margin-left: auto;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.sand};

  @media (max-width: 640px) { display: none; }
`

export default function SectionHead({ num, title, step }) {
  return (
    <Head>
      <Num>{num}</Num>
      <Title>{title}</Title>
      <Meta>{step}</Meta>
    </Head>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/
git commit -m "feat: Reusable-ui Button + SectionHead"
```

---

## Task 4 — Reusable-ui : Field

**Files:**
- Create: `client/src/components/Reusable-ui/Field.jsx`

- [ ] **Step 1: Créer `client/src/components/Reusable-ui/Field.jsx`**

`Field` est un composant wrapper : il fournit le `<label>`, le message d'erreur et la mise en page. L'input réel est passé en `children`. Les styled inputs (`StyledInput`, `StyledSelect`, `StyledTextarea`) sont exportés séparément pour être utilisés à l'intérieur de `Field`.

```jsx
import styled, { css } from 'styled-components'
import theme from '../../theme'

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
`

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${theme.brown};
  margin-bottom: 8px;
  letter-spacing: 0.2px;
`

const Req = styled.span`
  color: ${theme.accent};
  margin-left: 2px;
`

const Opt = styled.span`
  color: ${theme.sand};
  font-weight: 400;
  margin-left: 6px;
  font-size: 11px;
`

const baseInputStyles = css`
  width: 100%;
  background: ${theme.white};
  border: 1px solid ${({ $invalid }) => ($invalid ? theme.error : theme.line)};
  border-radius: 6px;
  padding: 14px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: ${theme.dark};
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-color: ${({ $invalid }) => ($invalid ? '#FCF3F1' : theme.white)};

  &::placeholder { color: #B8AB97; }
  &:hover {
    border-color: ${theme.cream};
    background: ${theme.creamSoft};
  }
  &:focus {
    border-color: ${theme.brown};
    background: ${theme.white};
    box-shadow: 0 0 0 4px rgba(61,40,23,0.07);
  }
`

export const StyledInput = styled.input`
  ${baseInputStyles}
`

export const StyledSelect = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%239B8266' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  background-color: ${({ $invalid }) => ($invalid ? '#FCF3F1' : theme.white)};
`

export const StyledTextarea = styled.textarea`
  ${baseInputStyles}
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`

const ErrorMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.error};
  margin-top: 6px;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${theme.error};
    flex-shrink: 0;
  }
`

const Hint = styled.div`
  font-size: 12px;
  color: ${theme.sand};
  margin-top: 8px;
`

export default function Field({ id, label, required, optional, error, hint, full, children }) {
  return (
    <Wrapper id={id ? `field-${id}` : undefined} $full={full}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <Req>*</Req>}
          {optional && <Opt>facultatif</Opt>}
        </Label>
      )}
      {children}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {hint && <Hint>{hint}</Hint>}
    </Wrapper>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Reusable-ui/Field.jsx
git commit -m "feat: Reusable-ui Field component"
```

---

## Task 5 — Reusable-ui : ChoiceGrid

**Files:**
- Create: `client/src/components/Reusable-ui/ChoiceGrid.jsx`

- [ ] **Step 1: Créer `client/src/components/Reusable-ui/ChoiceGrid.jsx`**

`ChoiceGrid` gère les deux types de sélection : radio (valeur unique, string) et checkbox (valeurs multiples, array). Les options s'affichent comme des cartes cliquables.

```jsx
import styled from 'styled-components'
import theme from '../../theme'

const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols}, 1fr)`};

  @media (max-width: 640px) {
    grid-template-columns: ${({ $cols }) => $cols >= 3 ? 'repeat(2, 1fr)' : `repeat(${$cols}, 1fr)`};
  }
`

const ChoiceItem = styled.div`
  position: relative;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    padding: 16px 18px;
    border: 1px solid ${({ $checked }) => ($checked ? theme.brown : theme.line)};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${({ $checked }) => ($checked ? theme.creamSoft : theme.white)};
    box-shadow: ${({ $checked }) => ($checked ? `0 0 0 3px rgba(61,40,23,0.06), 0 1px 0 ${theme.brown}` : 'none')};
    text-align: left;
    margin: 0;
    min-height: 64px;
    position: relative;

    &:hover {
      border-color: ${theme.sand};
      background: ${theme.creamSoft};
    }

    .main {
      font-size: 15px;
      font-weight: 500;
      color: ${theme.brown};
      letter-spacing: -0.1px;
    }

    .sub {
      font-size: 12px;
      color: ${theme.sand};
      font-weight: 400;
    }
  }
`

const Check = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 18px;
  height: 18px;
  border: 1px solid ${({ $checked }) => ($checked ? theme.brown : theme.line)};
  border-radius: ${({ $checkbox }) => ($checkbox ? '4px' : '50%')};
  background: ${({ $checked }) => ($checked ? theme.brown : 'transparent')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    border-radius: ${({ $checkbox }) => ($checkbox ? '1px' : '50%')};
    ${({ $checkbox, $checked }) =>
      $checkbox
        ? `
          width: 6px;
          height: 10px;
          background: transparent;
          border-right: 2px solid ${theme.white};
          border-bottom: 2px solid ${theme.white};
          transform: ${$checked ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)'};
          margin-bottom: 2px;
          transition: transform 0.2s;
        `
        : `
          width: 8px;
          height: 8px;
          background: ${theme.white};
          transform: ${$checked ? 'scale(1)' : 'scale(0)'};
          transition: transform 0.2s;
        `}
  }
`

const ErrorMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.error};
  margin-top: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${theme.error};
    flex-shrink: 0;
  }
`

export default function ChoiceGrid({ cols = 3, type = 'radio', name, value, onChange, options, error }) {
  const handleChange = (optValue) => {
    if (type === 'radio') {
      onChange(optValue)
    } else {
      const newValue = value.includes(optValue)
        ? value.filter(v => v !== optValue)
        : [...value, optValue]
      onChange(newValue)
    }
  }

  const isChecked = (optValue) =>
    type === 'radio' ? value === optValue : value.includes(optValue)

  return (
    <div>
      <Grid $cols={cols}>
        {options.map((opt, i) => {
          const inputId = `${name}-${i}`
          const checked = isChecked(opt.value)
          return (
            <ChoiceItem key={opt.value} $checked={checked}>
              <input
                type={type}
                name={name}
                id={inputId}
                value={opt.value}
                checked={checked}
                onChange={() => handleChange(opt.value)}
              />
              <label htmlFor={inputId}>
                <Check $checked={checked} $checkbox={type === 'checkbox'} />
                <span className="main">{opt.label}</span>
                {opt.sub && <span className="sub">{opt.sub}</span>}
              </label>
            </ChoiceItem>
          )
        })}
      </Grid>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Reusable-ui/ChoiceGrid.jsx
git commit -m "feat: Reusable-ui ChoiceGrid (radio + checkbox)"
```

---

## Task 6 — Utilitaires de formulaire + tests

**Files:**
- Create: `client/src/utils/formUtils.js`
- Create: `client/src/utils/formUtils.test.js`

- [ ] **Step 1: Créer `client/src/utils/formUtils.js`**

```js
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const validateCP = (cp) => /^\d{5}$/.test(cp)

export const INITIAL_FORM_DATA = {
  societe: '', secteur: '', collaborateurs: '',
  adresse: '', codepostal: '', ville: '',
  prenom: '', nom: '', email: '', telephone: '',
  quantite: '', frequence: '', moutures: [],
  message: '',
}

export function validate(formData, audience) {
  const errors = {}
  const isEnt = audience === 'entreprise'

  if (isEnt) {
    if (!formData.societe) errors.societe = 'Veuillez renseigner le nom de votre société'
    if (!formData.collaborateurs) errors.collaborateurs = 'Veuillez sélectionner une taille d\'équipe'
  } else {
    if (!formData.adresse) errors.adresse = 'Veuillez renseigner votre adresse'
    if (!validateCP(formData.codepostal)) errors.codepostal = 'Code postal requis (5 chiffres)'
    if (!formData.ville) errors.ville = 'Veuillez renseigner votre ville'
  }

  if (!formData.prenom) errors.prenom = 'Veuillez renseigner votre prénom'
  if (!formData.nom) errors.nom = 'Veuillez renseigner votre nom'
  if (!validateEmail(formData.email)) errors.email = 'Email invalide'
  if (!formData.quantite) errors.quantite = 'Veuillez sélectionner une quantité indicative'

  return errors
}

export function computeStepProgress(formData, audience) {
  const isEnt = audience === 'entreprise'
  return [
    isEnt
      ? !!(formData.societe && formData.collaborateurs)
      : !!(formData.adresse && validateCP(formData.codepostal) && formData.ville),
    !!(formData.prenom && formData.nom && validateEmail(formData.email)),
    !!formData.quantite,
    true,
  ]
}

export function computeProgress(formData, audience) {
  const isEnt = audience === 'entreprise'
  let filled, total

  if (isEnt) {
    filled =
      (formData.societe ? 1 : 0) +
      (formData.collaborateurs ? 1 : 0) +
      (formData.prenom ? 1 : 0) +
      (formData.nom ? 1 : 0) +
      (validateEmail(formData.email) ? 1 : 0) +
      (formData.quantite ? 1 : 0) +
      (formData.frequence ? 0.5 : 0) +
      (formData.moutures.length ? 0.5 : 0) +
      (formData.secteur ? 0.3 : 0) +
      (formData.telephone ? 0.3 : 0) +
      (formData.ville ? 0.3 : 0) +
      (formData.message ? 0.6 : 0)
    total = 1+1+1+1+1+1+0.5+0.5+0.3+0.3+0.3+0.6
  } else {
    filled =
      (formData.adresse ? 1 : 0) +
      (validateCP(formData.codepostal) ? 1 : 0) +
      (formData.ville ? 1 : 0) +
      (formData.prenom ? 1 : 0) +
      (formData.nom ? 1 : 0) +
      (validateEmail(formData.email) ? 1 : 0) +
      (formData.quantite ? 1 : 0) +
      (formData.frequence ? 0.5 : 0) +
      (formData.moutures.length ? 0.5 : 0) +
      (formData.telephone ? 0.3 : 0) +
      (formData.message ? 0.6 : 0)
    total = 1+1+1+1+1+1+1+0.5+0.5+0.3+0.6
  }

  return Math.min(100, Math.round((filled / total) * 100))
}

export function buildPayload(formData, audience) {
  const isEnt = audience === 'entreprise'
  return {
    societe: isEnt ? formData.societe : 'Particulier',
    prenom: formData.prenom,
    nom: formData.nom,
    email: formData.email,
    telephone: formData.telephone,
    collaborateurs: isEnt ? formData.collaborateurs : '',
    secteur: formData.secteur,
    adresse: !isEnt ? formData.adresse : '',
    codepostal: !isEnt ? formData.codepostal : '',
    ville: formData.ville,
    quantite: formData.quantite,
    frequence: formData.frequence,
    moutures: formData.moutures,
    message: formData.message,
  }
}
```

- [ ] **Step 2: Créer `client/src/utils/formUtils.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { validate, computeStepProgress, computeProgress, buildPayload } from './formUtils'

const baseEnt = {
  societe: 'Acme', secteur: 'Tech / Startup', collaborateurs: '11 – 25',
  adresse: '', codepostal: '', ville: 'Paris',
  prenom: 'Jean', nom: 'Dupont', email: 'jean@acme.fr', telephone: '',
  quantite: '1 – 3 kg', frequence: '', moutures: [], message: '',
}

const basePart = {
  societe: '', secteur: '', collaborateurs: '',
  adresse: '12 rue de la Paix', codepostal: '75001', ville: 'Paris',
  prenom: 'Marie', nom: 'Martin', email: 'marie@email.fr', telephone: '',
  quantite: '500 g — 1 personne', frequence: '', moutures: [], message: '',
}

describe('validate', () => {
  it('retourne {} si entreprise valide', () => {
    expect(validate(baseEnt, 'entreprise')).toEqual({})
  })

  it('retourne {} si particulier valide', () => {
    expect(validate(basePart, 'particulier')).toEqual({})
  })

  it('exige societe et collaborateurs pour entreprise', () => {
    const errors = validate({ ...baseEnt, societe: '', collaborateurs: '' }, 'entreprise')
    expect(errors).toHaveProperty('societe')
    expect(errors).toHaveProperty('collaborateurs')
  })

  it('exige adresse + codepostal valide + ville pour particulier', () => {
    const errors = validate({ ...basePart, adresse: '', codepostal: '750' }, 'particulier')
    expect(errors).toHaveProperty('adresse')
    expect(errors).toHaveProperty('codepostal')
  })

  it('rejette email invalide', () => {
    expect(validate({ ...baseEnt, email: 'pasunemail' }, 'entreprise')).toHaveProperty('email')
  })

  it('exige quantite', () => {
    expect(validate({ ...baseEnt, quantite: '' }, 'entreprise')).toHaveProperty('quantite')
  })
})

describe('computeStepProgress', () => {
  it('retourne [true,true,true,true] si formulaire entreprise complet', () => {
    expect(computeStepProgress(baseEnt, 'entreprise')).toEqual([true, true, true, true])
  })

  it('step 4 est toujours true', () => {
    expect(computeStepProgress({ ...baseEnt, quantite: '' }, 'entreprise')[3]).toBe(true)
  })

  it('step 1 false si societe manquante (entreprise)', () => {
    expect(computeStepProgress({ ...baseEnt, societe: '' }, 'entreprise')[0]).toBe(false)
  })

  it('retourne [true,true,true,true] si formulaire particulier complet', () => {
    expect(computeStepProgress(basePart, 'particulier')).toEqual([true, true, true, true])
  })
})

describe('computeProgress', () => {
  it('retourne 0 si rien n\'est rempli', () => {
    const empty = { ...baseEnt, societe: '', collaborateurs: '', prenom: '', nom: '', email: '', quantite: '', ville: '' }
    expect(computeProgress(empty, 'entreprise')).toBe(0)
  })

  it('retourne 100 si tout est rempli', () => {
    const full = { ...baseEnt, frequence: 'Mensuelle', moutures: ['Grains entiers'], telephone: '0600000000', message: 'Hello' }
    expect(computeProgress(full, 'entreprise')).toBe(100)
  })
})

describe('buildPayload', () => {
  it('met societe = "Particulier" pour audience particulier', () => {
    expect(buildPayload(basePart, 'particulier').societe).toBe('Particulier')
  })

  it('inclut adresse et codepostal pour particulier', () => {
    const p = buildPayload(basePart, 'particulier')
    expect(p.adresse).toBe('12 rue de la Paix')
    expect(p.codepostal).toBe('75001')
  })

  it('laisse adresse vide pour entreprise', () => {
    expect(buildPayload(baseEnt, 'entreprise').adresse).toBe('')
  })
})
```

- [ ] **Step 3: Installer Vitest et lancer les tests**

```bash
cd client && npm install -D vitest
```

Ajouter dans `client/package.json` → `"scripts"` :
```json
"test": "vitest run"
```

```bash
npm test
```

Résultat attendu : **10 tests passent**, 0 échec.

- [ ] **Step 4: Commit**

```bash
git add client/src/utils/
git commit -m "feat: formUtils (validate, computeProgress, buildPayload) + tests"
```

---

## Task 7 — BrandPanel

**Files:**
- Create: `client/src/components/BrandPanel.jsx`

- [ ] **Step 1: Créer `client/src/components/BrandPanel.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../theme'

const Brand = styled.aside`
  background: #4F3422;
  color: ${theme.cream};
  padding: 48px 44px;
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -120px;
    bottom: -120px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(200,117,58,0.22), transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    position: relative;
    height: auto;
    padding: 32px 32px 28px;
  }
`

const BrandHead = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 56px;

  @media (max-width: 1024px) { margin-bottom: 24px; }
`

const Monogram = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px rgba(0,0,0,0.35);

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`

const BrandName = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 4px;
  color: ${theme.cream};
  text-transform: uppercase;
  line-height: 1.4;

  small {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 13px;
    letter-spacing: 0.5px;
    color: #FAF6F1;
    text-transform: none;
    margin-top: 2px;
  }
`

const BrandHero = styled.div`
  margin: 0 0 32px;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  background: #3D2817;
  box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 18px 40px rgba(0,0,0,0.4);
  position: relative;
  max-width: 280px;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 1px rgba(232,221,204,0.08);
    border-radius: inherit;
    pointer-events: none;
  }

  @media (max-width: 1024px) { display: none; }
`

const BrandHeadline = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: 42px;
  line-height: 1.05;
  color: ${theme.white};
  margin-bottom: 24px;
  letter-spacing: -0.5px;

  em { font-style: italic; color: ${theme.accent}; }

  @media (max-width: 1024px) { font-size: 32px; margin-bottom: 12px; }
  @media (max-width: 640px) { font-size: 26px; }
`

const BrandSub = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: rgba(232, 221, 204, 0.7);
  max-width: 320px;
  margin-bottom: 48px;

  @media (max-width: 1024px) { margin-bottom: 24px; }
`

const Stepper = styled.div`
  margin-top: auto;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { display: none; }
`

const StepperTitle = styled.div`
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.sand};
  margin-bottom: 20px;
`

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid rgba(232, 221, 204, 0.12);
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child { border-bottom: 1px solid rgba(232, 221, 204, 0.12); }
`

const StepNum = styled.span`
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-style: italic;
  color: ${({ $done, $active }) => $active ? theme.accent : $done ? theme.cream : theme.sand};
  width: 22px;
  transition: color 0.3s;
`

const StepLabel = styled.span`
  font-size: 13px;
  color: ${({ $done, $active }) => $active ? theme.white : $done ? 'rgba(232,221,204,0.85)' : 'rgba(232,221,204,0.6)'};
  flex: 1;
  transition: color 0.3s;
`

const StepStatus = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid ${({ $done, $active }) => ($done || $active) ? 'transparent' : 'rgba(232,221,204,0.3)'};
  background: ${({ $done, $active }) => $active ? theme.accent : $done ? theme.cream : 'transparent'};
  box-shadow: ${({ $active }) => $active ? `0 0 0 4px rgba(200,117,58,0.18)` : 'none'};
  transition: all 0.3s;
`

const STEPS = [
  { num: '01', id: 1 },
  { num: '02', label: 'Contact', id: 2 },
  { num: '03', label: 'Votre commande', id: 3 },
  { num: '04', label: 'Précisions', id: 4 },
]

export default function BrandPanel({ stepProgress, audience }) {
  const activeIdx = stepProgress.findIndex(x => !x)
  const step1Label = audience === 'entreprise' ? 'Votre entreprise' : 'Votre livraison'

  const scrollToSection = (id) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Brand>
      <BrandHead>
        <Monogram>
          <img src="/assets/monogram-mb.png" alt="Monogramme Maison Buna" />
        </Monogram>
        <BrandName>
          Maison Buna
          <small>Le berceau du café</small>
        </BrandName>
      </BrandHead>

      <BrandHero>
        <img src="/assets/hero-coffee.jpg" alt="Café Maison Buna" />
      </BrandHero>

      <BrandHeadline>
        Un café <em><span style={{ color: '#FBF8F3' }}>de caractère</span></em>, chez vous ou au bureau.
      </BrandHeadline>
      <BrandSub>
        Café de spécialité éthiopien, torréfié artisanalement en France. Livraison régulière, sans engagement.
      </BrandSub>

      <Stepper>
        <StepperTitle>Votre demande</StepperTitle>
        {STEPS.map((step, i) => {
          const isDone = stepProgress[i]
          const isActive = i === activeIdx
          const label = i === 0 ? step1Label : step.label
          return (
            <Step key={step.id} onClick={() => scrollToSection(step.id)}>
              <StepNum $done={isDone} $active={isActive}>{step.num}</StepNum>
              <StepLabel $done={isDone} $active={isActive}>{label}</StepLabel>
              <StepStatus $done={isDone} $active={isActive} />
            </Step>
          )
        })}
      </Stepper>
    </Brand>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/BrandPanel.jsx
git commit -m "feat: BrandPanel avec stepper dynamique"
```

---

## Task 8 — AudienceToggle

**Files:**
- Create: `client/src/components/AudienceToggle.jsx`

- [ ] **Step 1: Créer `client/src/components/AudienceToggle.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../theme'

const Audience = styled.div`
  margin-bottom: 48px;
`

const AudienceLabel = styled.div`
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.sand};
  margin-bottom: 12px;
  font-weight: 500;
`

const Toggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: ${theme.creamSoft};
  border: 1px solid ${theme.line};
  border-radius: 14px;
  padding: 6px;
`

const AudOpt = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? theme.white : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? theme.brown : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? `0 1px 0 ${theme.brown}, 0 4px 14px rgba(61,40,23,0.10)` : 'none')};
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
  font-family: inherit;
  color: ${theme.brown};
  width: 100%;

  &:hover { background: rgba(255,255,255,0.55); }
`

const AudIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? theme.brown : theme.white)};
  color: ${({ $active }) => ($active ? theme.cream : theme.sandDark)};
  border: 1px solid ${({ $active }) => ($active ? theme.brown : theme.line)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
`

const AudText = styled.span`line-height: 1.3;`
const AudTitle = styled.span`display: block; font-size: 14px; font-weight: 500; color: ${theme.brown}; letter-spacing: -0.1px;`
const AudSub = styled.span`display: block; font-size: 12px; color: ${theme.sand}; margin-top: 2px; font-weight: 400;`

export default function AudienceToggle({ audience, onChange }) {
  return (
    <Audience>
      <AudienceLabel>Vous commandez pour…</AudienceLabel>
      <Toggle role="radiogroup">
        <AudOpt
          type="button"
          $active={audience === 'entreprise'}
          role="radio"
          aria-checked={audience === 'entreprise'}
          onClick={() => onChange('entreprise')}
        >
          <AudIcon $active={audience === 'entreprise'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/>
              <path d="M9 9h.01M13 9h.01M9 13h.01M13 13h.01M9 17h.01M13 17h.01"/>
            </svg>
          </AudIcon>
          <AudText>
            <AudTitle>Mon entreprise</AudTitle>
            <AudSub>Bureaux, équipes, événements</AudSub>
          </AudText>
        </AudOpt>

        <AudOpt
          type="button"
          $active={audience === 'particulier'}
          role="radio"
          aria-checked={audience === 'particulier'}
          onClick={() => onChange('particulier')}
        >
          <AudIcon $active={audience === 'particulier'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>
            </svg>
          </AudIcon>
          <AudText>
            <AudTitle>Moi à la maison</AudTitle>
            <AudSub>Dégustation, abonnement, cadeau</AudSub>
          </AudText>
        </AudOpt>
      </Toggle>
    </Audience>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/AudienceToggle.jsx
git commit -m "feat: AudienceToggle entreprise/particulier"
```

---

## Task 9 — SectionProfil

**Files:**
- Create: `client/src/components/SectionProfil.jsx`

- [ ] **Step 1: Créer `client/src/components/SectionProfil.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../theme'
import SectionHead from './Reusable-ui/SectionHead'
import Field, { StyledInput, StyledSelect } from './Reusable-ui/Field'

const Section = styled.section`
  padding-top: 48px;
  margin-bottom: 8px;
  scroll-margin-top: 24px;
`

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

export default function SectionProfil({ audience, formData, errors, onChange }) {
  const isEnt = audience === 'entreprise'

  return (
    <Section id="section-1" data-step="1">
      <SectionHead
        num="01"
        title={isEnt ? 'Votre entreprise' : 'Votre livraison'}
        step="Étape 1 / 4"
      />
      <Grid2>
        {isEnt ? (
          <>
            <Field id="societe" label="Société" required error={errors.societe}>
              <StyledInput
                id="societe"
                type="text"
                value={formData.societe}
                onChange={e => onChange('societe', e.target.value)}
                placeholder="Nom de votre société"
                autoComplete="organization"
                $invalid={!!errors.societe}
              />
            </Field>

            <Field id="secteur" label="Secteur" optional>
              <StyledSelect
                id="secteur"
                value={formData.secteur}
                onChange={e => onChange('secteur', e.target.value)}
              >
                <option value="" disabled>Sélectionner un secteur</option>
                <option>Agence / Conseil</option>
                <option>Tech / Startup</option>
                <option>Finance / Juridique</option>
                <option>Santé / Médical</option>
                <option>Commerce / Retail</option>
                <option>Industrie</option>
                <option>Autre</option>
              </StyledSelect>
            </Field>

            <Field id="collaborateurs" label="Nombre de collaborateurs" required error={errors.collaborateurs}>
              <StyledSelect
                id="collaborateurs"
                value={formData.collaborateurs}
                onChange={e => onChange('collaborateurs', e.target.value)}
                $invalid={!!errors.collaborateurs}
              >
                <option value="" disabled>Taille de l'équipe</option>
                <option>1 – 10</option>
                <option>11 – 25</option>
                <option>26 – 50</option>
                <option>51 – 100</option>
                <option>100 – 250</option>
                <option>250+</option>
              </StyledSelect>
            </Field>

            <Field id="ville" label="Ville de livraison" optional>
              <StyledInput
                id="ville"
                type="text"
                value={formData.ville}
                onChange={e => onChange('ville', e.target.value)}
                placeholder="Paris, Lyon, Bordeaux…"
                autoComplete="address-level2"
              />
            </Field>
          </>
        ) : (
          <>
            <Field id="adresse" label="Adresse de livraison" required full error={errors.adresse}>
              <StyledInput
                id="adresse"
                type="text"
                value={formData.adresse}
                onChange={e => onChange('adresse', e.target.value)}
                placeholder="N° et nom de rue"
                autoComplete="street-address"
                $invalid={!!errors.adresse}
              />
            </Field>

            <Field id="codepostal" label="Code postal" required error={errors.codepostal}>
              <StyledInput
                id="codepostal"
                type="text"
                value={formData.codepostal}
                onChange={e => onChange('codepostal', e.target.value)}
                placeholder="75001"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={5}
                $invalid={!!errors.codepostal}
              />
            </Field>

            <Field id="ville" label="Ville" required error={errors.ville}>
              <StyledInput
                id="ville"
                type="text"
                value={formData.ville}
                onChange={e => onChange('ville', e.target.value)}
                placeholder="Paris, Lyon, Bordeaux…"
                autoComplete="address-level2"
                $invalid={!!errors.ville}
              />
            </Field>
          </>
        )}
      </Grid2>
    </Section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/SectionProfil.jsx
git commit -m "feat: SectionProfil (entreprise + particulier)"
```

---

## Task 10 — SectionContact

**Files:**
- Create: `client/src/components/SectionContact.jsx`

- [ ] **Step 1: Créer `client/src/components/SectionContact.jsx`**

```jsx
import styled from 'styled-components'
import SectionHead from './Reusable-ui/SectionHead'
import Field, { StyledInput } from './Reusable-ui/Field'

const Section = styled.section`
  padding-top: 48px;
  margin-bottom: 8px;
  scroll-margin-top: 24px;
`

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

export default function SectionContact({ audience, formData, errors, onChange }) {
  const isEnt = audience === 'entreprise'

  return (
    <Section id="section-2" data-step="2">
      <SectionHead num="02" title="Vos coordonnées" step="Étape 2 / 4" />
      <Grid2>
        <Field id="prenom" label="Prénom" required error={errors.prenom}>
          <StyledInput
            id="prenom"
            type="text"
            value={formData.prenom}
            onChange={e => onChange('prenom', e.target.value)}
            placeholder="Votre prénom"
            autoComplete="given-name"
            $invalid={!!errors.prenom}
          />
        </Field>

        <Field id="nom" label="Nom" required error={errors.nom}>
          <StyledInput
            id="nom"
            type="text"
            value={formData.nom}
            onChange={e => onChange('nom', e.target.value)}
            placeholder="Votre nom"
            autoComplete="family-name"
            $invalid={!!errors.nom}
          />
        </Field>

        <Field
          id="email"
          label={isEnt ? 'Email professionnel' : 'Email'}
          required
          error={errors.email}
        >
          <StyledInput
            id="email"
            type="email"
            value={formData.email}
            onChange={e => onChange('email', e.target.value)}
            placeholder="vous@exemple.fr"
            autoComplete="email"
            $invalid={!!errors.email}
          />
        </Field>

        <Field id="telephone" label="Téléphone" optional>
          <StyledInput
            id="telephone"
            type="tel"
            value={formData.telephone}
            onChange={e => onChange('telephone', e.target.value)}
            placeholder="+33 6 00 00 00 00"
            autoComplete="tel"
          />
        </Field>
      </Grid2>
    </Section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/SectionContact.jsx
git commit -m "feat: SectionContact"
```

---

## Task 11 — SectionCommande

**Files:**
- Create: `client/src/components/SectionCommande.jsx`

- [ ] **Step 1: Créer `client/src/components/SectionCommande.jsx`**

```jsx
import styled from 'styled-components'
import SectionHead from './Reusable-ui/SectionHead'
import ChoiceGrid from './Reusable-ui/ChoiceGrid'

const Section = styled.section`
  padding-top: 48px;
  margin-bottom: 8px;
  scroll-margin-top: 24px;
`

const FieldBlock = styled.div`
  margin-bottom: 20px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
  
  & + & { margin-top: 28px; }
`

const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #3D2817;
  margin-bottom: 8px;
  letter-spacing: 0.2px;

  span.req { color: #C8753A; margin-left: 2px; }
  span.opt { color: #9B8266; font-weight: 400; margin-left: 6px; font-size: 11px; }
`

const ENT_QUANTITE = [
  { value: '500 g – 1 kg', label: '500 g – 1 kg', sub: 'Petite équipe' },
  { value: '1 – 3 kg', label: '1 – 3 kg', sub: 'Équipe moyenne' },
  { value: '3 – 5 kg', label: '3 – 5 kg', sub: 'Grande équipe' },
  { value: '5 – 10 kg', label: '5 – 10 kg', sub: 'Volume important' },
  { value: '10 kg et +', label: '10 kg et +', sub: 'Sur mesure' },
  { value: 'À estimer ensemble', label: 'À estimer', sub: 'On vous guide' },
]

const PART_QUANTITE = [
  { value: '250 g — Découverte', label: '250 g', sub: 'Découverte' },
  { value: '500 g — 1 personne', label: '500 g', sub: 'Pour 1 personne' },
  { value: '1 kg — Couple', label: '1 kg', sub: 'Couple / duo' },
  { value: '2 kg — Famille', label: '2 kg', sub: 'Famille / amis' },
  { value: 'Abonnement découverte', label: 'Abonnement', sub: 'Sélection mensuelle' },
  { value: 'Coffret cadeau', label: 'Cadeau', sub: 'Coffret à offrir' },
]

const FREQUENCE = [
  { value: 'Hebdomadaire', label: 'Hebdo', sub: 'Chaque semaine' },
  { value: 'Bi-mensuelle', label: 'Bi-mensuelle', sub: 'Tous les 15 j' },
  { value: 'Mensuelle', label: 'Mensuelle', sub: 'Une fois / mois' },
  { value: 'Ponctuelle', label: 'Ponctuelle', sub: 'Événementiel' },
]

const MOUTURES = [
  { value: 'Grains entiers', label: 'Grains entiers', sub: 'À moudre soi-même' },
  { value: 'Moulu fin (espresso)', label: 'Moulu fin', sub: 'Pour espresso' },
  { value: 'Moulu moyen (filtre)', label: 'Moulu moyen', sub: 'Pour filtre' },
  { value: 'Mix selon besoin', label: 'Mix sur mesure', sub: 'Plusieurs moutures' },
]

export default function SectionCommande({ audience, formData, errors, onChange }) {
  const isEnt = audience === 'entreprise'

  return (
    <Section id="section-3" data-step="3">
      <SectionHead num="03" title="Votre commande" step="Étape 3 / 4" />

      <div id="field-quantite">
        <FieldLabel>
          Quantité {isEnt ? 'mensuelle souhaitée' : 'souhaitée'} <span className="req">*</span>
        </FieldLabel>
        <ChoiceGrid
          cols={3}
          type="radio"
          name="quantite"
          value={formData.quantite}
          onChange={v => onChange('quantite', v)}
          options={isEnt ? ENT_QUANTITE : PART_QUANTITE}
          error={errors.quantite}
        />
      </div>

      <FieldBlock style={{ marginTop: '28px' }}>
        <FieldLabel>
          {isEnt ? 'Fréquence de livraison' : 'Fréquence souhaitée'} <span className="opt">facultatif</span>
        </FieldLabel>
        <ChoiceGrid
          cols={4}
          type="radio"
          name="frequence"
          value={formData.frequence}
          onChange={v => onChange('frequence', v)}
          options={FREQUENCE}
        />
      </FieldBlock>

      <FieldBlock style={{ marginTop: '28px' }}>
        <FieldLabel>
          Mouture souhaitée <span className="opt">plusieurs choix possibles</span>
        </FieldLabel>
        <ChoiceGrid
          cols={2}
          type="checkbox"
          name="moutures"
          value={formData.moutures}
          onChange={arr => onChange('moutures', arr)}
          options={MOUTURES}
        />
      </FieldBlock>
    </Section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/SectionCommande.jsx
git commit -m "feat: SectionCommande (quantite + frequence + moutures)"
```

---

## Task 12 — SummaryRail + SectionPrecisions

**Files:**
- Create: `client/src/components/SummaryRail.jsx`
- Create: `client/src/components/SectionPrecisions.jsx`

- [ ] **Step 1: Créer `client/src/components/SummaryRail.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../theme'

const Rail = styled.div`
  margin-top: 24px;
  margin-bottom: 32px;
  background: ${theme.creamSoft};
  border: 1px solid ${theme.line};
  border-radius: 10px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  opacity: ${({ $empty }) => ($empty ? 0.6 : 1)};
`

const Icon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${theme.white};
  border: 1px solid ${theme.line};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${theme.accent};
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 22px;
`

const Text = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${theme.sandDark};
  line-height: 1.5;

  strong { color: ${theme.brown}; font-weight: 500; }
`

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  )
}

export default function SummaryRail({ formData, audience }) {
  const isEnt = audience === 'entreprise'
  const bits = []

  if (isEnt) {
    if (formData.societe) bits.push(<strong key="s">{formData.societe}</strong>)
    if (formData.collaborateurs) bits.push(`${formData.collaborateurs} collab.`)
    if (formData.quantite) bits.push(`${formData.quantite} / mois`)
    if (formData.frequence) bits.push(`livraison ${formData.frequence.toLowerCase()}`)
  } else {
    const name = `${formData.prenom} ${formData.nom}`.trim()
    if (name) bits.push(<strong key="n">{name}</strong>)
    if (formData.ville) bits.push(formData.ville)
    if (formData.quantite) bits.push(formData.quantite)
    if (formData.frequence) bits.push(`livraison ${formData.frequence.toLowerCase()}`)
  }

  const isEmpty = bits.length < 2

  const content = isEmpty
    ? 'Remplissez les champs ci-dessus — un récapitulatif apparaîtra ici à mesure que vous avancez.'
    : bits.reduce((acc, bit, i) => {
        if (i === 0) return [bit]
        return [...acc, ' · ', bit]
      }, [])

  return (
    <Rail $empty={isEmpty}>
      <Icon>✦</Icon>
      <Text>
        {isEmpty ? content : <>Votre demande : {content}</>}
      </Text>
    </Rail>
  )
}
```

- [ ] **Step 2: Créer `client/src/components/SectionPrecisions.jsx`**

```jsx
import styled from 'styled-components'
import SectionHead from './Reusable-ui/SectionHead'
import Field, { StyledTextarea } from './Reusable-ui/Field'
import SummaryRail from './SummaryRail'

const Section = styled.section`
  padding-top: 48px;
  margin-bottom: 8px;
  scroll-margin-top: 24px;
`

export default function SectionPrecisions({ formData, audience, onChange }) {
  return (
    <Section id="section-4" data-step="4">
      <SectionHead num="04" title="Vos précisions" step="Étape 4 / 4" />

      <Field
        id="message"
        label="Informations complémentaires"
        optional
        hint="Plus vous nous en dites, plus notre proposition sera précise."
      >
        <StyledTextarea
          id="message"
          value={formData.message}
          onChange={e => onChange('message', e.target.value)}
          placeholder="Préférences d'arômes, équipement (machine espresso, filtre…), budget indicatif, contraintes logistiques…"
        />
      </Field>

      <SummaryRail formData={formData} audience={audience} />
    </Section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/SummaryRail.jsx client/src/components/SectionPrecisions.jsx
git commit -m "feat: SummaryRail + SectionPrecisions"
```

---

## Task 13 — SuccessView

**Files:**
- Create: `client/src/components/SuccessView.jsx`

- [ ] **Step 1: Créer `client/src/components/SuccessView.jsx`**

```jsx
import styled from 'styled-components'
import theme from '../theme'
import { GhostButton } from './Reusable-ui/Button'

const Wrap = styled.div`
  animation: fadeUp 0.6s cubic-bezier(.4,0,.2,1);

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${theme.creamSoft};
  border: 1px solid ${theme.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  color: ${theme.accent};
`

const Title = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: 48px;
  color: ${theme.brown};
  line-height: 1.05;
  letter-spacing: -0.5px;
  margin-bottom: 20px;

  em { font-style: italic; color: ${theme.accent}; }
`

const Lead = styled.p`
  font-size: 17px;
  color: ${theme.sandDark};
  line-height: 1.6;
  max-width: 480px;
  margin-bottom: 40px;
`

const SummaryBox = styled.div`
  background: ${theme.white};
  border: 1px solid ${theme.line};
  border-radius: 12px;
  overflow: hidden;
  max-width: 560px;
`

const SummaryBoxHead = styled.div`
  padding: 16px 24px;
  background: ${theme.creamSoft};
  border-bottom: 1px solid ${theme.line};
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.sandDark};
  font-weight: 500;
`

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 16px;
  padding: 14px 24px;
  border-bottom: 1px solid ${theme.line};
  font-size: 14px;

  &:last-child { border-bottom: none; }

  dt {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${theme.sand};
    padding-top: 2px;
  }

  dd { color: ${theme.dark}; line-height: 1.5; }
`

const Footer = styled.div`
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid ${theme.line};
  display: flex;
  align-items: center;
  gap: 20px;
`

const Tagline = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  color: ${theme.sand};
  font-size: 16px;
  flex: 1;
`

export default function SuccessView({ formData, audience, onReset }) {
  const isEnt = audience === 'entreprise'

  const rows = []
  if (isEnt) {
    rows.push(['Société', `${formData.societe}${formData.secteur ? ` · ${formData.secteur}` : ''}`])
    rows.push(['Contact', `${formData.prenom} ${formData.nom}`])
    rows.push(['Email', `${formData.email}${formData.telephone ? ` · ${formData.telephone}` : ''}`])
    rows.push(['Équipe', `${formData.collaborateurs} collaborateurs`])
    if (formData.ville) rows.push(['Livraison', formData.ville])
    rows.push(['Quantité', `${formData.quantite} / mois`])
  } else {
    rows.push(['Type', 'Particulier'])
    rows.push(['Contact', `${formData.prenom} ${formData.nom}`])
    rows.push(['Email', `${formData.email}${formData.telephone ? ` · ${formData.telephone}` : ''}`])
    rows.push(['Livraison', `${formData.adresse}, ${formData.codepostal} ${formData.ville}`])
    rows.push(['Commande', formData.quantite])
  }
  if (formData.frequence) rows.push(['Fréquence', formData.frequence])
  if (formData.moutures.length) rows.push(['Mouture', formData.moutures.join(', ')])
  if (formData.message) rows.push(['Précisions', formData.message])

  return (
    <Wrap>
      <SuccessIcon>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l5 5L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </SuccessIcon>

      <Title>Demande <em>bien reçue.</em></Title>
      <Lead>
        Merci de votre confiance. Notre équipe étudie votre demande et reviendra vers vous sous 48 heures avec une proposition personnalisée.
      </Lead>

      <SummaryBox>
        <SummaryBoxHead>Récapitulatif</SummaryBoxHead>
        <dl>
          {rows.map(([key, val]) => (
            <SummaryRow key={key}>
              <dt>{key}</dt>
              <dd>{val}</dd>
            </SummaryRow>
          ))}
        </dl>
      </SummaryBox>

      <Footer>
        <Tagline>— Maison Buna, le berceau du café.</Tagline>
        <GhostButton type="button" onClick={onReset}>Nouvelle demande</GhostButton>
      </Footer>
    </Wrap>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/SuccessView.jsx
git commit -m "feat: SuccessView avec récapitulatif"
```

---

## Task 14 — DevisForm — assemblage complet

**Files:**
- Create: `client/src/components/DevisForm.jsx`

- [ ] **Step 1: Créer `client/src/components/DevisForm.jsx`**

```jsx
import { useState } from 'react'
import styled from 'styled-components'
import theme from '../theme'
import BrandPanel from './BrandPanel'
import AudienceToggle from './AudienceToggle'
import SectionProfil from './SectionProfil'
import SectionContact from './SectionContact'
import SectionCommande from './SectionCommande'
import SectionPrecisions from './SectionPrecisions'
import SuccessView from './SuccessView'
import { PrimaryButton } from './Reusable-ui/Button'
import { validate, computeStepProgress, computeProgress, buildPayload, INITIAL_FORM_DATA } from '../utils/formUtils'

const Shell = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  min-height: 100vh;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`

const FormArea = styled.main`
  padding: 56px 72px 80px;
  max-width: 760px;
  width: 100%;

  @media (max-width: 1024px) { padding: 48px 32px 64px; }
  @media (max-width: 640px) { padding: 32px 20px 56px; }
`

const FormMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  letter-spacing: 1px;
  color: ${theme.sand};
  margin-bottom: 32px;
  text-transform: uppercase;
`

const ProgressWrap = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ProgressBar = styled.span`
  display: inline-block;
  width: 120px;
  height: 2px;
  background: ${theme.line};
  border-radius: 2px;
  overflow: hidden;
`

const ProgressFill = styled.span`
  display: block;
  height: 100%;
  background: ${theme.brown};
  width: ${({ $pct }) => $pct}%;
  transition: width 0.5s cubic-bezier(.4,0,.2,1);
`

const PageTitle = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: 52px;
  line-height: 1.05;
  color: ${theme.brown};
  margin-bottom: 16px;
  letter-spacing: -1px;

  em { font-style: italic; color: ${theme.accent}; }

  @media (max-width: 1024px) { font-size: 40px; }
  @media (max-width: 640px) { font-size: 32px; }
`

const PageIntro = styled.p`
  color: ${theme.sandDark};
  font-size: 16px;
  line-height: 1.6;
  max-width: 520px;
  margin-bottom: 56px;
`

const SubmitArea = styled.div`
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid ${theme.line};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    button { justify-content: center; }
  }
`

const SubmitNote = styled.p`
  font-size: 13px;
  color: ${theme.sandDark};
  line-height: 1.6;
  max-width: 320px;

  strong { color: ${theme.brown}; font-weight: 500; }
`

export default function DevisForm() {
  const [audience, setAudience] = useState('entreprise')
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e })
    }
  }

  const handleAudienceChange = (aud) => {
    setAudience(aud)
    setFormData(prev => ({ ...prev, quantite: '' }))
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate(formData, audience)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstKey = Object.keys(newErrors)[0]
      const el = firstKey === 'quantite'
        ? document.getElementById('field-quantite')
        : document.getElementById(`field-${firstKey}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(formData, audience)),
      })
      if (!res.ok) throw new Error('Erreur lors de l\'envoi. Veuillez réessayer.')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
    setAudience('entreprise')
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepProgress = computeStepProgress(formData, audience)
  const progress = computeProgress(formData, audience)
  const isEnt = audience === 'entreprise'

  if (submitted) {
    return (
      <Shell>
        <BrandPanel stepProgress={[true, true, true, true]} audience={audience} />
        <FormArea>
          <SuccessView formData={formData} audience={audience} onReset={handleReset} />
        </FormArea>
      </Shell>
    )
  }

  return (
    <Shell>
      <BrandPanel stepProgress={stepProgress} audience={audience} />
      <FormArea>
        <FormMeta>
          <span>Demande de devis</span>
          <ProgressWrap>
            <span>{progress}%</span>
            <ProgressBar>
              <ProgressFill $pct={progress} />
            </ProgressBar>
          </ProgressWrap>
        </FormMeta>

        <PageTitle>Parlons de votre <em>café</em>.</PageTitle>
        <PageIntro>
          {isEnt
            ? 'Quelques informations sur votre équipe et vos préférences, et vous recevrez un devis dans quelques minutes.'
            : 'Quelques détails sur vos goûts et votre adresse, et nous préparons votre première sélection.'}
        </PageIntro>

        <AudienceToggle audience={audience} onChange={handleAudienceChange} />

        <form onSubmit={handleSubmit} noValidate>
          <SectionProfil audience={audience} formData={formData} errors={errors} onChange={handleChange} />
          <SectionContact audience={audience} formData={formData} errors={errors} onChange={handleChange} />
          <SectionCommande audience={audience} formData={formData} errors={errors} onChange={handleChange} />
          <SectionPrecisions formData={formData} audience={audience} onChange={handleChange} />

          <SubmitArea>
            <SubmitNote>
              <strong>Devis en quelques minutes</strong><br />
              {isEnt && 'Aucun engagement — nous étudions chaque demande individuellement.'}
            </SubmitNote>
            <PrimaryButton type="submit" disabled={loading}>
              <span>{loading ? 'Envoi en cours…' : 'Envoyer ma demande'}</span>
              {!loading && (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M1 6h13M9 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </PrimaryButton>
          </SubmitArea>
        </form>
      </FormArea>
    </Shell>
  )
}
```

- [ ] **Step 2: Lancer le dev server et vérifier visuellement**

```bash
# Terminal 1 : Express
node server.js

# Terminal 2 : Vite
cd client && npm run dev
```

Ouvrir `http://localhost:5173` et vérifier :
- ✅ Layout deux colonnes (sidebar gauche + formulaire)
- ✅ Toggle entreprise/particulier fonctionne
- ✅ Barre de progression se met à jour
- ✅ Stepper reflète les sections complètes
- ✅ Rail récapitulatif s'active à partir de 2 champs

- [ ] **Step 3: Commit**

```bash
git add client/src/components/DevisForm.jsx
git commit -m "feat: DevisForm — assemblage complet + submit"
```

---

## Task 15 — Fix `routes/devis.js` : répondre avant le PDF

**Files:**
- Modify: `routes/devis.js`

- [ ] **Step 1: Lire le fichier actuel**

```bash
cat routes/devis.js
```

- [ ] **Step 2: Remplacer le bloc de traitement**

Trouver le bloc qui appelle `generatePDF` et `sendDevisEmails` de façon synchrone. Le remplacer par ce pattern : répondre immédiatement, puis traiter en arrière-plan.

```js
// Sauvegarder d'abord
saveDevis(devis);

// Répondre IMMÉDIATEMENT au navigateur (< 100ms)
res.json({ success: true, id: devis.id });

// PDF + emails en arrière-plan (ne bloque plus la réponse HTTP)
setImmediate(async () => {
  try {
    const pdfBuffer = await generatePDF(devis);
    await sendDevisEmails(devis, pdfBuffer);
  } catch (err) {
    console.error('Erreur traitement arrière-plan :', err.message);
  }
});
```

- [ ] **Step 3: Tester la soumission du formulaire**

Soumettre le formulaire depuis `http://localhost:5173`. Vérifier :
- ✅ La vue succès s'affiche immédiatement (< 1s)
- ✅ `data/devis.json` contient la nouvelle entrée
- ✅ Un email arrivera dans les 10-15s (Puppeteer en arrière-plan)

- [ ] **Step 4: Commit**

```bash
git add routes/devis.js
git commit -m "fix: répondre avant génération PDF (setImmediate)"
```

---

## Task 16 — `server.js` : servir `client/dist/` en production

**Files:**
- Modify: `server.js`

- [ ] **Step 1: Ajouter le middleware static pour prod**

Dans `server.js`, après les imports et avant les routes API, ajouter :

```js
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Servir le build React en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'client', 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client', 'dist', 'index.html'))
  })
}
```

Ce bloc doit être placé **après** `app.use('/api', devisRouter)` pour que les routes API soient prioritaires.

- [ ] **Step 2: Tester le build de production**

```bash
cd client && npm run build
cd .. && NODE_ENV=production node server.js
```

Ouvrir `http://localhost:3000` — le formulaire React doit s'afficher depuis le build statique.

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "feat: server.js sert client/dist/ en production"
```

---

## Task 17 — Mise à jour des scripts root `package.json`

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Mettre à jour les scripts**

Dans `package.json` à la racine, remplacer la section `"scripts"` par :

```json
"scripts": {
  "dev": "node server.js",
  "dev:client": "cd client && npm run dev",
  "start": "NODE_ENV=production node server.js",
  "build": "cd client && npm run build",
  "pdf:test": "node scripts/test-pdf.js",
  "mail:test": "node scripts/test-mail.js",
  "test": "cd client && npm test"
}
```

- [ ] **Step 2: Vérifier**

```bash
npm run build
```

Résultat attendu : `client/dist/` créé, pas d'erreur.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: scripts root mis à jour pour React + Vite"
```

---

## Task 18 — Test end-to-end final

- [ ] **Step 1: Lancer Express + Vite**

```bash
# Terminal 1
node server.js

# Terminal 2
cd client && npm run dev
```

- [ ] **Step 2: Parcours entreprise**

1. Ouvrir `http://localhost:5173`
2. Remplir Société + Collaborateurs → stepper section 1 passe en ✅
3. Remplir Prénom + Nom + Email → stepper section 2 passe en ✅
4. Sélectionner une Quantité → stepper section 3 passe en ✅
5. Barre de progression monte à 100%
6. Rail récapitulatif affiche la demande
7. Cliquer "Envoyer ma demande"
8. Vue succès apparaît immédiatement
9. Vérifier `data/devis.json` — nouvelle entrée présente

- [ ] **Step 3: Parcours particulier**

1. Sélectionner "Moi à la maison"
2. Vérifier que les champs changent (adresse au lieu de société)
3. Remplir + soumettre
4. Vue succès avec récap correct

- [ ] **Step 4: Test validation**

1. Soumettre formulaire vide → champs requis en rouge
2. Email invalide → message d'erreur affiché
3. Corriger → erreurs disparaissent en temps réel

- [ ] **Step 5: Commit final**

```bash
git add .
git commit -m "feat: migration React + Styled Components complète"
```
