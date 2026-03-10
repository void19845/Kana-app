# 仮名 Kana Master — Séance 5

Application d'apprentissage des kana japonais (hiragana & katakana).

## Lancer le projet

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement Vercel

1. Pusher sur GitHub
2. Importer le repo sur [vercel.com](https://vercel.com)
3. Framework preset : **Vite**
4. Build command : `npm run build`
5. Output directory : `dist`

Le fichier `vercel.json` gère le routing SPA (React Router).

## Nouveautés Séance 5

- **`useLocalStorage`** — hook générique avec lazy initialization
- **Meilleur score persisté** — record par script (hiragana / katakana)
- **Badge 🏆** dans la barre de score et récapitulatif final
- **`vercel.json`** — configuration SPA pour le déploiement

## Structure

```
src/
  App.tsx                       # Layout + React Router
  main.tsx                      # Point d'entrée
  context/SettingsContext.tsx   # useReducer settings
  router/index.tsx              # createBrowserRouter
  pages/index.tsx               # StudyPage · QuizPage · StatsPage
  components/
    CharacterCard.tsx           # Carte kana (S2)
    CharacterGrid.tsx           # Grille de cartes (S2)
    StudyMode.tsx               # Mode étude + useMemo
    QuizMode.tsx                # Mode quiz + useRef + useLocalStorage
    QuizSettings.tsx            # Sidebar paramètres
    QuizSummary.tsx             # Récap + meilleur score
    TimerRing.tsx               # Anneau SVG animé
    StatsView.tsx               # Statistiques localStorage
  hooks/
    useQuiz.ts                  # useReducer état quiz (S4)
    useTimer.ts                 # Timer avec setInterval (S3)
    useStats.ts                 # Persistance stats (S4)
    useLocalStorage.ts          # Hook générique ← NOUVEAU S5
  data/kana.ts                  # 73 caractères + KANA_ROWS
```
