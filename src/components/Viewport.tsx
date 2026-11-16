import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { WorldRenderer } from '../engine/WorldRenderer';
import type { CameraState, ViewSettings } from '../types/world';

interface Props {
  settings: ViewSettings;
  camera: CameraState;
  onCameraChange: (camera: CameraState) => void;
  onPointerWorld: (point: { x: number; y: number }) => void;
}

export default function Viewport({ settings, camera, onCameraChange, onPointerWorld }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WorldRenderer | null>(null);
  const dragRef = useRef<{ x: number; y: number; cameraX: number; cameraY: number } | null>(null);
  const spacePressed = useRef(false);
  const cameraRef = useRef<CameraState>({ x: 0, y: 0, zoom: 1 });

  useEffect(() => {
    if (!hostRef.current) return;
    const engine = new WorldRenderer();
    engineRef.current = engine;
    let alive = true;
    engine.mount(hostRef.current).then(() => { if (alive) engine.setViewSettings(settings); });
    return () => { alive = false; engine.destroy(); engineRef.current = null; };
    // Mount once; settings are applied in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { engineRef.current?.setViewSettings(settings); }, [settings]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => { if (event.code === 'Space') spacePressed.current = true; };
    const up = (event: KeyboardEvent) => { if (event.code === 'Space') spacePressed.current = false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  useEffect(() => { cameraRef.current = camera; engineRef.current?.setCamera(camera); }, [camera]);

  const updateCamera = (next: CameraState) => {
    cameraRef.current = next;
    engineRef.current?.setCamera(next);
    onCameraChange(next);
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const current = cameraRef.current;
    const world = { x: (pointer.x - current.x) / current.zoom, y: (pointer.y - current.y) / current.zoom };
    const zoom = Math.max(0.12, Math.min(4, current.zoom * Math.exp(-event.deltaY * 0.001)));
    updateCamera({ x: pointer.x - world.x * zoom, y: pointer.y - world.y * zoom, zoom });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button === 1 || event.button === 2 || spacePressed.current) {
      event.preventDefault();
      dragRef.current = { x: event.clientX, y: event.clientY, cameraX: cameraRef.current.x, cameraY: cameraRef.current.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left - cameraRef.current.x) / cameraRef.current.zoom, y: (event.clientY - rect.top - cameraRef.current.y) / cameraRef.current.zoom };
    onPointerWorld(point);
    if (dragRef.current) updateCamera({ ...cameraRef.current, x: dragRef.current.cameraX + event.clientX - dragRef.current.x, y: dragRef.current.cameraY + event.clientY - dragRef.current.y });
  };
  const stopDrag = () => { dragRef.current = null; };

  return <div ref={hostRef} className={`viewport ${dragRef.current ? 'is-panning' : ''}`} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag} onContextMenu={e => e.preventDefault()}>
    <div className="viewport-hint"><span className="hint-dot" /> EMPTY CONSTRUCTION SPACE <span className="hint-separator">/</span> WORLD 01</div>
  </div>;
}
