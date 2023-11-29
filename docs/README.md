# Starlight Starter Kit: Basics

This directory was initialized with:

```shell
npm create astro@latest -- --template starlight
```

In order to run/build this documentation, you'll need [Node.js](https://nodejs.org/en/download/current) and a package manager such as `npm`, `pnpm`, or `yarn` installed.

You can install Node and `npm`/`pnpm`/`yarn` using `brew` (on macOS) or similar (check their websites). If you've never developed for the web, stick with Node.js and `npm`.

Once those are installed, open your terminal, `cd` to the `./docs/` directory of your repository, and run `npm install`, then `npm run dev` (see below for commands).

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```text
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   │   └── config.ts
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

You can swap `npm` for `pnpm` or `yarn` if you prefer those.

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
