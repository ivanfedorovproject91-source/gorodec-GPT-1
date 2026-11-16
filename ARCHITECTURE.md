# Architecture

## Runtime separation
- **React** (`src/App.tsx`, `src/components/`) owns the editor chrome, settings, tool state, and responsive panels.
- **PixiJS** (`src/engine/WorldRenderer.ts`) owns the rendering surface, world camera transform, and grid drawing.
- **Shared types** (`src/types/`) define data contracts between UI and engine.

## World coordinates and camera
World positions are persistent logical coordinates. Screen positions are derived using `screen = world * zoom + cameraOffset`; the inverse transform is `world = (screen - cameraOffset) / zoom`. The renderer applies camera offset and zoom to a dedicated world container, so future world objects can be authored without screen-coordinate coupling.

Zoom is clamped to 0.12–4 and is anchored under the pointer. Pan changes only camera offset. The current construction grid is redrawn using the visible world bounds, rather than creating an unbounded grid.

## Rendering scalability direction
The initial renderer has a dedicated camera layer and draws only visible grid lines. Later phases should add a spatial index and chunk/object layers; visible object queries should be based on camera world bounds. Static and dynamic render layers should be separated before batching is introduced.

## Planned data boundaries
Future editable entities should be plain serializable domain objects (IDs, type, transform, geometry and style), independent from Pixi display objects. Pixi objects should be generated from domain state and never be the source of truth. This enables undo/redo, persistence, import/export and future cloud sync without coupling saved data to the renderer.
