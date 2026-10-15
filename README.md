# Move

A React single-page application scaffolded from the official Vite React + TypeScript template.

## Getting started

Use Node.js 20.19+ or 22.12+ (supported by Vite) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Edit `src/App.tsx` to start building your app; changes appear with hot module replacement.

## Countdown setup

Use the floating form to enter a label, Move duration, reps, and break seconds, then select **Create interval session**. Move accepts positive integer seconds (for example, `30` for thirty seconds or `120` for two minutes). Decimal values and `mm:ss` input are not accepted. Reps must be a positive whole number; Break accepts whole seconds and can be zero. Each submission adds a countdown card showing the initial move duration and configuration. Countdowns are saved in localStorage and restored between browser sessions. The setup form opens in a modal with a blurred backdrop when no countdowns exist. With existing countdowns, use the plus button in the top-right corner to open it and create another countdown. The modal closes after creation; use its close button or Escape to dismiss it when countdowns already exist. If browser storage is unavailable, countdowns remain available for the current page session and a message explains that they could not be saved. Select **Play** on a card to start its Move interval in a modal. A custom SVG ring shrinks as time passes, changing from green to amber at 25% remaining and red at 10%. Use the **Restart countdown** icon in the bottom-right corner of the modal to reset and immediately start the full Move duration again. The timer stops at zero; closing the modal stops it, and playing again starts a fresh interval. Reps and breaks are saved configuration; automatic sequencing is not implemented yet.

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
