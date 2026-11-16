import { useCallback, useEffect, useState } from 'react';
import { Box, Building2, ChevronDown, CircleHelp, Crosshair, Factory, Grid2X2, Layers3, Minus, MousePointer2, Move, Plus, Save, Settings2, TrainFront, Undo2, Redo2, Trees, Waves, ZoomIn, ZoomOut } from 'lucide-react';
import Viewport from './components/Viewport';
import type { CameraState, ViewSettings } from './types/world';

const categories = [
  { label: 'Buildings', icon: Building2, detail: 'Residential · Office · Commercial' },
  { label: 'Infrastructure', icon: Layers3, detail: 'Roads · Bridges · Tunnels' },
  { label: 'Transport', icon: TrainFront, detail: 'Railways · Stations · Depots' },
  { label: 'Industrial', icon: Factory, detail: 'Factories · Warehouses · Plants' },
  { label: 'Utilities', icon: Waves, detail: 'Power · Water · Services' },
  { label: 'Environment', icon: Trees, detail: 'Parks · Terrain · Landscape' },
];

export default function App() {
  const [settings, setSettings] = useState<ViewSettings>({ showGrid: true, snapToGrid: false, gridSize: 40 });
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: 1 });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState('Buildings');
  const [activeTool, setActiveTool] = useState('Select');
  const [showSettings, setShowSettings] = useState(false);

  const zoomBy = useCallback((factor: number) => setCamera(current => {
    const zoom = Math.max(0.12, Math.min(4, current.zoom * factor));
    const cx = window.innerWidth * 0.56;
    const cy = window.innerHeight * 0.52;
    const worldX = (cx - current.x) / current.zoom;
    const worldY = (cy - current.y) / current.zoom;
    return { x: cx - worldX * zoom, y: cy - worldY * zoom, zoom };
  }), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !(event.target instanceof HTMLInputElement)) event.preventDefault();
      if (event.key === 'g' || event.key === 'G') setSettings(s => ({ ...s, showGrid: !s.showGrid }));
      if (event.key === 'Escape') setShowSettings(false);
      if (event.key === '+' || event.key === '=') zoomBy(1.15);
      if (event.key === '-') zoomBy(1 / 1.15);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomBy]);

  const resetView = () => setCamera({ x: window.innerWidth * 0.25, y: window.innerHeight * 0.5, zoom: 1 });

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><span /><span /><span /></div><div><div className="brand-name">INFINITE CITY</div><div className="brand-sub">ARCHITECTURAL SANDBOX <i /> EARLY ACCESS</div></div></div>
      <div className="project-switch"><span className="project-label">PROJECT</span><strong>Untitled city</strong><ChevronDown size={13} /></div>
      <div className="top-actions">
        <button className="top-icon" title="Undo (not available until Phase 2)" disabled><Undo2 size={16} /></button>
        <button className="top-icon" title="Redo (not available until Phase 2)" disabled><Redo2 size={16} /></button>
        <span className="top-divider" />
        <button className="top-icon" onClick={() => setShowSettings(v => !v)} title="View settings"><Settings2 size={16} /></button>
        <button className="save-button" onClick={() => window.alert('Project saving and export are scheduled for Phase 7.')}><Save size={14} /> <span>Save project</span></button>
      </div>
    </header>

    <aside className="sidebar">
      <div className="side-heading">CONSTRUCTION LIBRARY <span>01</span></div>
      <div className="library-search"><span>⌕</span><input aria-label="Search library" placeholder="Search objects" disabled /><kbd>⌘ K</kbd></div>
      <div className="category-list">{categories.map(({ label, icon: Icon, detail }) => <button key={label} className={`category-item ${activeCategory === label ? 'active' : ''}`} onClick={() => setActiveCategory(label)}><Icon size={17} strokeWidth={1.7} /><span className="category-copy"><strong>{label}</strong><small>{detail}</small></span><span className="category-chevron">›</span></button>)}</div>
      <div className="sidebar-bottom"><div className="library-status"><span className="status-ring" /><div><strong>Library is ready</strong><small>Asset catalog · Phase 3+</small></div></div><button className="help-link"><CircleHelp size={15} /> Documentation</button></div>
    </aside>

    <section className="workspace">
      <Viewport settings={settings} camera={camera} onCameraChange={setCamera} onPointerWorld={setPointer} />
      <div className="canvas-tools"><button className={activeTool === 'Select' ? 'selected' : ''} onClick={() => setActiveTool('Select')} title="Select"><MousePointer2 size={16} /></button><button className={activeTool === 'Move' ? 'selected' : ''} onClick={() => setActiveTool('Move')} title="Move camera"><Move size={16} /></button><span /><button onClick={() => zoomBy(1.15)} title="Zoom in"><Plus size={16} /></button><button onClick={() => zoomBy(1 / 1.15)} title="Zoom out"><Minus size={16} /></button><button onClick={resetView} title="Reset view"><Crosshair size={15} /></button></div>
      {showSettings && <div className="settings-popover"><div className="popover-title">VIEW SETTINGS <button onClick={() => setShowSettings(false)}>×</button></div><label className="setting-row"><span>Construction grid</span><input type="checkbox" checked={settings.showGrid} onChange={e => setSettings(s => ({ ...s, showGrid: e.target.checked }))} /></label><label className="setting-row"><span>Grid snapping</span><input type="checkbox" checked={settings.snapToGrid} onChange={e => setSettings(s => ({ ...s, snapToGrid: e.target.checked }))} /></label><label className="setting-row grid-size"><span>Grid spacing</span><select value={settings.gridSize} onChange={e => setSettings(s => ({ ...s, gridSize: Number(e.target.value) }))}><option value="20">20 units</option><option value="40">40 units</option><option value="80">80 units</option></select></label><small className="setting-note">Shortcut: G toggles the grid</small></div>}
      <div className="coordinates"><span>WORLD COORDINATES</span><strong>X {Math.round(pointer.x)} <i /> Y {Math.round(pointer.y)}</strong></div>
      <div className="zoom-indicator"><button onClick={() => zoomBy(1 / 1.15)}><ZoomOut size={14} /></button><span>{Math.round(camera.zoom * 100)}%</span><button onClick={() => zoomBy(1.15)}><ZoomIn size={14} /></button></div>
    </section>

    <aside className="inspector"><div className="inspector-head"><span>INSPECTOR</span><span className="inspector-count">—</span></div><div className="empty-inspector"><div className="empty-icon"><Box size={23} strokeWidth={1.2} /></div><strong>Nothing selected</strong><p>Select an object in the construction space to inspect and edit its properties.</p><span className="inspector-rule" /><small>OBJECT PROPERTIES</small><div className="property-placeholder"><span>Position</span><b>—</b></div><div className="property-placeholder"><span>Dimensions</span><b>—</b></div><div className="property-placeholder"><span>Appearance</span><b>—</b></div></div><div className="inspector-footer"><span className="status-ring" /> EDITOR READY</div></aside>

    <footer className="bottombar"><div className="tool-group"><span className="bottom-label">TOOLS</span><button className="bottom-tool active"><MousePointer2 size={14} /> Select</button><button className="bottom-tool" onClick={() => setActiveTool('Move')}><Move size={14} /> Pan</button><button className="bottom-tool disabled" title="Available in Phase 2"><Plus size={14} /> Create</button><button className="bottom-tool disabled" title="Available in Phase 2"><Grid2X2 size={14} /> Transform</button></div><div className="bottom-right"><span className="world-status"><i /> EMPTY WORLD</span><span className="bottom-divider" /><span>GRID {settings.showGrid ? 'ON' : 'OFF'}</span><span className="bottom-divider" /><span>SNAP {settings.snapToGrid ? 'ON' : 'OFF'}</span></div></footer>
  </main>;
}
