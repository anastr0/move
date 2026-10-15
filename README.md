# Move

A React single-page application scaffolded from the official Vite React + TypeScript template.

## Getting started

Use Node.js 20.19+ or 22.12+ (supported by Vite) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Edit `src/App.tsx` to start building your app; changes appear with hot module replacement.

## Styling

Tailwind CSS is integrated through its Vite plugin. The app uses a permanent dark theme with zinc surfaces and `fuchsia-700` accents. Update utility classes in `src/App.tsx` and global base styles in `src/index.css`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

## Project structure

- `src/`: React components, styles, and bundled assets
- `public/`: Static assets served directly
- `index.html`: HTML entry point
- `vite.config.ts`: Vite configuration

## Deployment

Run `npm run build` and deploy `dist/` to a static hosting service. If you add client-side routes, configure the host to serve `index.html` for application routes.

## License

[MIT](LICENSE) © 2026 Anaswara T Rajan.
