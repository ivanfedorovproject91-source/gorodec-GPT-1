# INFINITE CITY

A browser-based 2D architectural construction sandbox. This repository currently contains **Phase 1 — Foundation**: the application shell, PixiJS world renderer, empty world, camera pan/zoom, world/screen coordinate transforms, and configurable construction grid.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
The repository includes `.github/workflows/deploy.yml`. It builds the Vite app and publishes the `dist` directory automatically on every push to `main`.

In GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The expected site URL is:

`https://ivanfedorovproject91-source.github.io/gorodec-GPT-1/`

## Controls
- Mouse wheel / trackpad scroll: zoom around the pointer.
- Middle mouse button, right mouse button, or Space + drag: pan the camera.
- `+` / `-`: zoom in / out.
- `G`: toggle the construction grid.
- Top-right gear: grid visibility, grid snapping setting, and grid spacing.
- Bottom-left viewport controls: select tool display, pan tool display, zoom, reset view.

The world starts empty by design. The grid is a visual reference and is not a pre-generated city or object layer.

## Current scope
See [PROJECT_STATE.md](./PROJECT_STATE.md), [ARCHITECTURE.md](./ARCHITECTURE.md), and [TODO.md](./TODO.md). Features from later phases are intentionally not represented as working functionality.
