# Spec — Refonte template PDF devis Maison Buna

Date : 2026-06-07  
Statut : Validé par l'utilisateur  
Branche cible : `feat/design-v2`

---

## Objectif

Refondre `templates/devis-template.html` pour le rendre cohérent avec le design de la landing page React (`feat/design-v2`) : même typographie, même palette de couleurs, même système de composants visuels.

---

## Décisions de design (validées en session)

### Direction générale — **Type Lift**
Conserver la structure et le contenu exacts du template actuel. Mettre à jour uniquement la typographie, les couleurs et les détails visuels pour aligner sur la landing page. Aucune réorganisation des sections.

### Typographie
| Usage | Actuel | Nouveau |
|---|---|---|
| Nom de marque | Verdana bold uppercase | Crimson Pro 700, letter-spacing 3px, uppercase |
| Noms de produits | Verdana bold | Crimson Pro 600 |
| Total TTC/HT (montant) | Verdana bold | Crimson Pro 700 |
| N° de devis | Verdana bold | Crimson Pro 700 |
| Corps de texte, labels | Verdana | Open Sans |
| Tagline | Verdana italic | Open Sans italic |

Chargement via Google Fonts dans le `<head>` (Puppeteer charge les web fonts) :
```html
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### Palette de couleurs
Alignée exactement sur `client/src/theme.js` :

| Token | Valeur | Usage |
|---|---|---|
| `dark` | `#2C1A0E` | Textes principaux, fond monogramme |
| `brown` | `#4F3422` | Titres, bordure objet, en-tête tableau, total bg |
| `sandText` | `#705540` | Texte secondaire (plines) |
| `sandDark` | `#6F5A41` | Texte corps |
| `sand` | `#9B8266` | Labels uppercase, textes tertiaires |
| `cream` | `#E8DDCC` | Fin du dégradé divider |
| `line` | `#E5DCCD` | Bordures, séparateurs |
| `white` | `#FAF7F2` | Fond général |
| `formBg` | `#F0E8DB` | Fond blocs prestataire, en-tête tableau, conditions |
| `accent` | `#C8753A` | Dégradé divider uniquement |

**Règle accent** : `#C8753A` apparaît **uniquement** dans le dégradé du divider. Aucun autre élément en orange.

### Header
- **Monogramme** : image `monogram-mb.png` (path absolu fourni par `pdfService.js` via `logo_src`), fond `#2C1A0E`, `border-radius: 9px`, `border: 1.5px solid #E5DCCD`, `box-shadow: 0 1px 6px rgba(0,0,0,0.10)`, 56×56px
- **Nom de marque** : Crimson Pro 700, 13pt, letter-spacing 3px, uppercase, `#2C1A0E`
- **Tagline** : Open Sans italic, 8.5pt, `#9B8266`
- **Label "Devis"** : Open Sans 700, 6.5pt, letter-spacing 3px, uppercase, `#9B8266`
- **N° de devis** : Crimson Pro 700, 13pt, `#4F3422`
- **Dates** : Open Sans, 7pt, `#9B8266`, line-height 1.7

### Divider gradient
```css
height: 3px;
background: linear-gradient(90deg, #4F3422 0%, #C8753A 45%, #E8DDCC 100%);
```

### Blocs Prestataire / Client
- Fond prestataire : `#F0E8DB` (token `formBg`)
- Fond client : `#FAF7F2`
- Bordure : `1px solid #E5DCCD`, `border-radius: 2px`
- Titre de bloc : Open Sans 700, 6.5pt, letter-spacing 2.5px, uppercase, `#9B8266`
- Nom : Crimson Pro 600, 11pt, `#2C1A0E`
- Lignes : Open Sans, 8pt, `#6F5A41`, line-height 1.65
- Lignes muted : 7.5pt, `#9B8266`

### Objet du devis
- `border-left: 3px solid #4F3422`
- Label : 6.5pt, 700, letter-spacing 2.5px, uppercase, `#9B8266`
- Valeur : Open Sans, 9pt, `#2C1A0E`

### Tableau produits — **Tableau classique**
- En-tête : fond `#F0E8DB`, bordure inférieure `2px solid #4F3422`
- Labels colonnes : Open Sans 700, 6.5pt, letter-spacing 2.5px, uppercase, `#4F3422`
- Nom de produit : Crimson Pro 600, 11pt, `#2C1A0E`
- Détail produit : Open Sans, 7pt, `#9B8266` — la **quantité (ex: 500 g, 250 g) en gras** `<strong>` couleur `#4F3422`
- Prix : Open Sans 600, 8.5pt, `#4F3422`
- Séparateurs lignes : `1px solid #E5DCCD`

### Bloc totaux
- Fond ligne Total : `#4F3422` (brun foncé)
- Label "Total HT/TTC" : Open Sans 700, 6.5pt, letter-spacing 2px, uppercase, `#D3C2AC`
- Montant : Crimson Pro 700, 13pt, `#FAF7F2`
- Note TVA : Open Sans, 7pt, `#9B8266`

### Numérotation des devis
Format conservé tel quel : `MBE-YYYYMMDD-NNNNN` (entreprise) / `MBP-YYYYMMDD-NNNNN` (particulier).  
**À faire avant mise en prod** : remettre `data/counter.json` à `{"counter": 0}`.

### Conditions générales
Les 9 conditions entreprise et les 6 conditions particulier du template actuel sont conservées **sans modification** — validées par Mélissa Sahilé. Ne pas toucher au contenu des `<li>`.

### Sections inchangées dans leur structure
- Détails de la demande (section-title, detail-row, mouture-tags)
- Message client (message-block)
- Bon pour accord (bpa)
- Mentions légales
- Footer

---

## Fichiers à modifier

| Fichier | Nature de la modification |
|---|---|
| `templates/devis-template.html` | Refonte CSS complète + fonts + couleurs |

Aucun autre fichier n'est modifié (routes, services, scripts de test inchangés).

---

## Critères de succès

1. `npm run pdf:test` génère un PDF sans erreur
2. Le PDF affiche le vrai logo monogramme (non brisé)
3. Crimson Pro et Open Sans chargées (Puppeteer connecté à Google Fonts)
4. Les quantités (250 g, 500 g) apparaissent en gras dans la colonne désignation
5. Le dégradé orange est visible dans le divider
6. Aucune couleur hors palette utilisée
7. Le numéro de devis suit le format `MBE/MBP-YYYYMMDD-NNNNN`
8. Les 9 conditions entreprise sont présentes et lisibles
9. Le PDF reste sur 1 page pour une demande standard (2 cafés, sans message long)
