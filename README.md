# Transcendance Frontend

<img src="https://img.shields.io/badge/dynamic/json.svg?style=plastic&color=2096F3&label=locize&query=%24.translatedPercentage&url=https://api.lite.locize.app/badgedata/3f48acab-3b26-4486-bac3-78a0758b8abd&suffix=%+translated&link=https://www.locize.com" alt="Percentage of Translated strings"/>

## Usage

The following command builds the frontend and transpiles typescript into javascript into the `dist` folder. It copies all files from `public` and tries to optimize all pictures for size. It also generate the sitemap through a script.

```sh
make build
```

The following command just propagate the `make` command to it's parent project ([deployment](https://github.com/Raiders-io/deployment)). It auto builds and gives the files directly to nginx through a shared volume via docker compose.

```sh
make deploy
```

THe following command lint the code, ignoring files in the 'src/component/ui' folder as they are provided by Shadcn and shouldn't be modified.

```sh
make lint
```

## Stack technique

### React TS

A framework for designing component-based interfaces, enabling reactive and conditionally rendered interfaces, and thus simplifying the design process. React TS helps us write more reliable and consistent code during development.

### Vite

Frontend build tool for web apps

### Shadcn

A library of basic components that ensures consistency across all interfaces and is based on Tailwind.

### Tailwind

CSS library, industry standard, and integrates seamlessly with Shadcn.

### Zustand

State manager: to manage the overall state (logged-in user, notifications, etc.) See : <https://www.youtube.com/watch?v=YMXN-t4jXbU>

### TanStack Query (a voir)

gère le cache, les états de chargement, les erreurs, la synchronisation des données avec l'API

### i18n

Generate i18n types.

```sh
npx i18next-cli types
```

Find hard coded strings.

```sh
npx i18next-cli instrument
```

Extract hard coded strings into i18n translations files.

```sh
npx i18next-cli extract
```
