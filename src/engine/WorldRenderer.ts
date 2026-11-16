import { Application, Container, Graphics } from 'pixi.js';
import type { CameraState, ViewSettings } from '../types/world';

const BACKGROUND = 0x202326;
const GRID_MINOR = 0x34383b;
const GRID_MAJOR = 0x41464a;

/** PixiJS owns world rendering. Coordinates are world units; the camera is a transform. */
export class WorldRenderer {
  readonly app = new Application();
  readonly cameraLayer = new Container();
  private grid = new Graphics();
  private initialized = false;
  private settings: ViewSettings = { showGrid: true, snapToGrid: false, gridSize: 40 };
  private camera: CameraState = { x: 0, y: 0, zoom: 1 };
  private resizeObserver?: ResizeObserver;
  private host?: HTMLElement;

  async mount(host: HTMLElement) {
    this.host = host;
    await this.app.init({ background: BACKGROUND, antialias: true, autoDensity: true, resolution: Math.min(window.devicePixelRatio || 1, 2), resizeTo: host });
    host.appendChild(this.app.canvas);
    this.app.stage.addChild(this.cameraLayer);
    this.cameraLayer.addChild(this.grid);
    this.initialized = true;
    this.resizeObserver = new ResizeObserver(() => this.drawGrid());
    this.resizeObserver.observe(host);
    this.applyCamera();
    this.drawGrid();
  }

  setCamera(camera: CameraState) {
    this.camera = { ...camera, zoom: Math.max(0.12, Math.min(4, camera.zoom)) };
    this.applyCamera();
  }

  getCamera() { return { ...this.camera }; }

  setViewSettings(settings: ViewSettings) {
    this.settings = settings;
    this.drawGrid();
  }

  worldToScreen(point: { x: number; y: number }) {
    return { x: point.x * this.camera.zoom + this.camera.x, y: point.y * this.camera.zoom + this.camera.y };
  }

  screenToWorld(point: { x: number; y: number }) {
    return { x: (point.x - this.camera.x) / this.camera.zoom, y: (point.y - this.camera.y) / this.camera.zoom };
  }

  snap(value: number) {
    return this.settings.snapToGrid ? Math.round(value / this.settings.gridSize) * this.settings.gridSize : value;
  }

  destroy() {
    this.resizeObserver?.disconnect();
    if (this.initialized) this.app.destroy(true, { children: true });
    this.initialized = false;
    this.host = undefined;
  }

  private applyCamera() {
    this.cameraLayer.position.set(this.camera.x, this.camera.y);
    this.cameraLayer.scale.set(this.camera.zoom);
  }

  /** Redraw only visible grid lines: no infinite set of world objects is allocated. */
  private drawGrid() {
    if (!this.initialized || !this.host) return;
    this.grid.clear();
    if (!this.settings.showGrid) return;
    const { width, height } = this.host.getBoundingClientRect();
    const step = this.settings.gridSize;
    const left = -this.camera.x / this.camera.zoom;
    const top = -this.camera.y / this.camera.zoom;
    const right = (width - this.camera.x) / this.camera.zoom;
    const bottom = (height - this.camera.y) / this.camera.zoom;
    const startX = Math.floor(left / step) * step;
    const startY = Math.floor(top / step) * step;
    const countX = Math.ceil((right - startX) / step);
    const countY = Math.ceil((bottom - startY) / step);
    const minorAlpha = Math.max(0.18, Math.min(0.55, this.camera.zoom * 0.42));
    for (let i = 0; i <= countX; i++) {
      const x = startX + i * step;
      const major = Math.round(x / (step * 5)) % 2 === 0;
      this.grid.moveTo(x, top).lineTo(x, bottom).stroke({ color: major ? GRID_MAJOR : GRID_MINOR, alpha: major ? minorAlpha : minorAlpha * 0.52, width: (major ? 1 : 0.7) / this.camera.zoom });
    }
    for (let i = 0; i <= countY; i++) {
      const y = startY + i * step;
      const major = Math.round(y / (step * 5)) % 2 === 0;
      this.grid.moveTo(left, y).lineTo(right, y).stroke({ color: major ? GRID_MAJOR : GRID_MINOR, alpha: major ? minorAlpha : minorAlpha * 0.52, width: (major ? 1 : 0.7) / this.camera.zoom });
    }
  }
}
