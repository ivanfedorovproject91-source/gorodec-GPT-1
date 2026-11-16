# Project State

**Current stage:** Phase 1 — Foundation (implemented)

## What works
- Vite + React + TypeScript application setup.
- PixiJS 8 rendering engine mounted in the main viewport.
- Empty construction world with restrained graphite palette.
- Camera pan using middle/right mouse drag.
- Smooth pointer-anchored wheel zoom, clamped between 12% and 400%.
- World-to-screen and screen-to-world coordinate conversion.
- Optional construction grid with configurable 20/40/80 world-unit spacing.
- Grid snapping preference state (ready for object tools; no objects exist yet).
- Responsive desktop layout and compact mobile layout.
- Keyboard shortcuts: `G`, `+`, `-`, `Escape`.

## Files created
- `index.html`, `package.json`, `vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `src/main.tsx`, `src/App.tsx`
- `src/components/Viewport.tsx`
- `src/engine/WorldRenderer.ts`
- `src/types/world.ts`
- `src/styles/global.css`
- `README.md`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, `TODO.md`

## Not implemented yet
- Editable objects, building generation, roads/railways, selection and transform handles.
- Undo/redo, grouping, layers, copy/paste.
- IndexedDB autosave, project import/export and project management.
- Telegram integration and deployment workflow.

## Verification note
- Source package and project structure are prepared. A local production build could not be verified in the authoring environment because `npm install` timed out before dependencies were installed. Run `npm install` followed by `npm run build` on a machine with npm registry access.

## Known limitations
- The Save project button currently explains that persistence is planned for Phase 7; it does not save.
- Sidebar library categories are navigation states only; object catalogs arrive in later phases.
- Inspector is an empty state until Phase 2 introduces selectable entities.
- The pan mode label is present, but panning is currently performed with middle/right mouse drag.
- Grid snapping is stored as a preference and will be applied when object placement exists.
- Google Fonts are requested remotely; system font fallbacks are provided.

## Next exact task
**Phase 2 — Object Editor:** introduce serializable scene entities, a basic procedural rectangle/building placeholder, selection hit-testing, drag movement, resize handles, duplication, deletion, and command-based undo/redo. Keep React state and Pixi rendering separated; Pixi display objects must not become the source of truth.
