# Transcendance Frontend

## Context

_This project has been created as part of the 42 curriculum by halnuma, ppontet, secros, vdurand, yabokhar._

## Introduction

This project is the frontend for the project [Transcendence](https://github.com/Raiders-io/Transcendence). It regroups all the pages, components, style and API calls for all the services. It ouputs files that are given to the web server (nginx), to be shown to users.

## Features

- Interface to interact with a lot of routes from the services
- View Lessons through file preview directly in the browser
- In-browser chat application

## AI / LLM Usage

LLM's were used to advices about legal procedures, such as cookies, privacy policy and terms of service. It was also used for ideal buttons placement for a better UI/UX. It was also used to learn how to use React TS.

## Installation

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

## Project Organization

This project is organized as following

```sh
├── public # <-- static files
├── scripts
└── src
    ├── components # <-- all components
    │   ├── file-list
    │   └── ui # <-- components from Shadcn
    ├── pages
    │   ├── about
    │   ├── auth
    │   │   ├── login
    │   │   └── signup
    │   ├── contact
    │   ├── file
    │   ├── home
    │   ├── lesson
    │   ├── services
    │   │   └── chat
    │   └── user
    ├── services # <-- functions to call the APIs
    └── utils
        ├── helpers
        ├── hooks
        ├── lib
        ├── router # <-- router to define pages access
        ├── stores
        ├── style
        ├── types
        └── utils
```

And build outputs as

```sh
├── dist # <-- files from 'public/' folder
│   └── assets # <-- .js files, contains informations about pages, components and node_modules used
```

## Technical Stack

### React TS

A framework for designing component-based interfaces, enabling reactive and conditionally rendered interfaces, and thus simplifying the design process. React TS helps us write more reliable and consistent code during development.

### Vite

Frontend build tool, that produces the files for generating pages on user's browsers, optimizing images, transforms classes from Tailwind in pure CSS, and more.

### Shadcn

A library of basic components that ensures consistency across all interfaces and is based on Tailwind.

### Tailwind

CSS library, industry standard, and integrates seamlessly with Shadcn. Tailwind helps you avoid having to use tons of classes/ids to apply styles to tags, and ties the styling directly to what it's applied to.

### Zustand

State manager: to manage the overall state (logged-in user, notifications, etc.) See : <https://www.youtube.com/watch?v=YMXN-t4jXbU>

### Zod

Zod is used to validate on user's browser forms before sending them to APIs. It's not a safe way to trust user input but provides a seamless link with the backend as you can reuse the same schemas.

### TanStack Query

TanStack Query is used to manage cache, loading states, and synchronise the data with the APIs.
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
