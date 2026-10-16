# ATM Cockpit — export React + Tailwind pour Figma Make

Version du projet Cockpit avec tout le CSS converti en classes Tailwind.
Aucun fichier `.css` par composant : le style vit dans le JSX.

## Démarrer

```bash
npm install
npm run dev
```

## Structure

```
index.html
tailwind.config.js      ← thème : couleurs, typo, animations
postcss.config.js
src/
  index.css             ← seul fichier CSS : tokens + directives Tailwind
  main.jsx
  App.jsx               ← routeur par state, ordre des widgets
  ui.js                 ← classes partagées (chip, bouton fantôme, fil d'Ariane)
  components/
    DataTable.jsx       ← primitives de tableau partagées (TH, CELL, SortableTh…)
    Header.jsx  Sidebar.jsx  NotificationPanel.jsx  SearchSuggestions.jsx
    Dashboard.jsx  AlertCard.jsx  ScopeOverview.jsx  HomepageCustomizeModal.jsx
    PortfolioPage.jsx  DealPage.jsx  ClientsPage.jsx  ControlsPage.jsx
    NotificationsPage.jsx  MyApplicationsPage.jsx  SearchResultsPage.jsx
    SettingsPage.jsx  LoginPage.jsx
  data/                 ← données de démo (searchData, appsData)
  assets/               ← SVG (logos, icônes d'objets)
```

## Le thème

`tailwind.config.js` ne contient pas de valeurs en dur : chaque couleur pointe
vers une variable CSS déclarée dans `src/index.css`.

| Classe Tailwind | Variable CSS |
|---|---|
| `bg-primary`, `text-primary` | `--color-primary` |
| `bg-page` | `--color-bg-page` |
| `bg-surface` | `--color-bg-surface` |
| `text-major` / `text-minor` / `text-reverse` | `--color-text-*` |
| `border-line` | `--color-border-default` |
| `bg-danger` | `--color-danger` |
| `shadow-header` | `--shadow-header` |

Conséquence utile : le **dark mode** est géré par la redéfinition des variables
sous `html.dark`. Aucune classe `dark:` n'est nécessaire — changer une valeur
dans `index.css` propage partout, dans les deux thèmes.

Les échelles « métier » (statuts de deal, sévérité des contrôles, types d'objets)
restent en hexadécimal au plus près de leur composant : ce sont des données,
pas des tokens de thème.

## Responsive

Le CSS d'origine utilisait `@media (max-width: 767px)`. La conversion est passée
en mobile-first : le style de base est celui du mobile, `md:` (≥768 px) porte le
desktop. Le décalage de la sidebar se fait par une classe (`offsetClass` passée
par `App.jsx`) et non plus par un `style` inline corrigé à coups de `!important`.
