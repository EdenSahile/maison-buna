# Design : Sélection des cafés dans le devis

**Date :** 2026-05-30
**Branche :** feature/react-migration
**Statut :** Approuvé

---

## Contexte

Maison Buna vend 3 cafés éthiopiens : Limmu, Sidamo, Yirgacheffe. Le formulaire de devis ne permet pas encore de choisir le ou les cafés souhaités. Les photos des 3 cafés sont disponibles dans `client/src/assets/`.

---

## Comportement attendu

- Le client sélectionne **un ou plusieurs cafés** (checkbox multi-sélection, min. 1 obligatoire)
- La quantité choisie s'applique **à chaque café sélectionné** indépendamment (1 kg par café, pas 1 kg partagé)
- Le devis PDF affiche **une ligne par café** dans le tableau de prix
- Le total = prix unitaire × nombre de cafés sélectionnés

**Exemple :** Limmu + Yirgacheffe, quantité 1 kg → Total TTC 99,98 €

---

## Design des cartes (Option A validée)

Cartes portrait avec grande photo en haut, nom + région + notes de dégustation en dessous. Composant dédié `CoffeeGrid.jsx` (pas une extension de `ChoiceGrid`). Charte Maison Buna : couleurs `#2e2010`, `#4F3422`, `#D3C2AC`, `#AB9679`, `#FAF7F3`.

---

## Fichiers à créer ou modifier

### Nouveau fichier

**`client/src/components/CoffeeGrid.jsx`**
- Props : `value` (string[]), `onChange` (fn), `error` (string|undefined)
- Données cafés hardcodées dans le composant (CAFES array)
- Chaque café : `{ value, name, region, notes, img }` — images importées depuis `../../assets/`
- Rendu : grille 3 colonnes, carte portrait (photo 160px de haut, info en dessous, checkbox en overlay)
- État sélectionné : bordure `#4F3422`, fond `#FAF7F3`, ombre subtile

### Fichiers modifiés

**`client/src/components/SectionCommande.jsx`**
- Importer `CoffeeGrid`
- Ajouter le champ cafés en premier dans la section 03 (avant la quantité)
- Label : "Café(s) souhaité(s)" + badge obligatoire `*`

**`client/src/components/DevisForm.jsx`**
- Ajouter `cafes: []` à l'état initial `formData`
- Passer `formData.cafes` et `onChange('cafes', arr)` à `SectionCommande`

**`client/src/utils/formUtils.js`**
- `validate()` : erreur si `cafes.length === 0` pour les deux audiences
- `buildPayload()` : inclure `cafes`
- `computeStepProgress()` : step 3 requiert `cafes.length >= 1` ET `quantite` non vide

**`routes/devis.js`**
- Extraire `cafes` depuis `req.body`
- Validation : `cafes` doit être un tableau non vide
- Remplacer `computePricing(quantite)` par `computePricing(quantite, cafes)` qui retourne :
  ```js
  {
    pricing_rows: [
      { cafe, region, designation, qte_label, pu_ttc_fmt, total_ttc_fmt },
      ...
    ],
    grand_total_fmt,  // somme de toutes les lignes
    sur_devis,        // true si quantite === 'À estimer'
  }
  ```
- Données cafés dans la route :
  ```js
  const CAFES_META = {
    'Limmu':       { region: 'Région Limmu · Éthiopie' },
    'Sidamo':      { region: 'Région Sidama · Éthiopie' },
    'Yirgacheffe': { region: 'Région Yirgacheffe · Éthiopie' },
  }
  ```
- Stocker `cafes` (tableau), `pricing_rows`, `grand_total_fmt`, `sur_devis` dans l'objet devis

**`templates/devis-template.html`**
- Tableau : `{{#each pricing_rows}}` → une `<tr>` par café avec `{{cafe}}`, `{{region}}`, `{{qte_label}}`, `{{total_ttc_fmt}}`
- Totaux : remplacer `{{pricing.total_ttc_fmt}}` par `{{grand_total_fmt}}`
- Condition sur devis : basée sur `{{sur_devis}}` (inchangé)

**`templates/email-client.html`**
- Ajouter une ligne "Café(s)" dans le tableau récapitulatif : `{{#each cafes}}{{this}}{{/each}}`

**`templates/email-admin.html`**
- Ajouter une ligne "Café(s)" dans la section "Détails de la commande" avec le même rendu

**`scripts/test-pdf.js`** et **`scripts/test-pdf-particulier.js`**
- Ajouter `cafes: ['Limmu', 'Yirgacheffe']` et mettre à jour `pricing_rows` / `grand_total_fmt`

**`client/src/utils/formUtils.test.js`**
- Ajouter `cafes: ['Limmu']` dans `baseEnt` et `basePart`
- Ajouter un test : `validate` renvoie une erreur si `cafes` est vide

---

## Données de référence

### CAFES dans le formulaire
```js
[
  { value: 'Limmu',       name: 'Limmu',       region: 'Région Limmu · Éthiopie',       notes: 'Floral, bergamote, jasmin', img: limmuImg },
  { value: 'Sidamo',      name: 'Sidamo',       region: 'Région Sidama · Éthiopie',      notes: 'Fruité, pêche, agrumes',    img: sidamoImg },
  { value: 'Yirgacheffe', name: 'Yirgacheffe',  region: 'Région Yirgacheffe · Éthiopie', notes: 'Thé, citron, fleur blanche', img: yirgImg },
]
```

### Noms des images dans assets
- `LIMMU.png`
- `SIDAMO.png`
- `maison buna yirgacheffe.png`

---

## Validation

- `cafes` : tableau, longueur ≥ 1 (côté client et côté serveur)
- `quantite` : inchangé (obligatoire)
- Si `cafes` vide côté serveur → 400 `{ error: 'Champ manquant : cafes' }`

---

## Comportement "Sur devis"

Si `quantite === 'À estimer'` : `sur_devis = true`, `pricing_rows = null`, `grand_total_fmt = null`. Le bloc "prix sur devis" s'affiche à la place du tableau, mais les cafés sélectionnés sont visibles dans la section "Détails de la demande".

---

## Ce qui ne change pas

- La grille des quantités (ENT / PART) est inchangée
- La fréquence et les moutures sont inchangées
- Le step 4 (précisions) est inchangé
- La logique d'envoi email (2 emails) est inchangée
