import { drawLine, drawCircle, getMouseGamePos, BASE_WIDTH } from '../engine/renderer.js';

const LAUNCHER_X = BASE_WIDTH / 2;
const LAUNCHER_Y = 40;
const GUIDE_LENGTH = 80;
const GUIDE_DASH = [6, 4];
const MIN_ANGLE = Math.PI * 0.1;  // ~18 degrees from horizontal
const MAX_ANGLE = Math.PI * 0.9;  // ~162 degrees from horizontal

export class Launcher {
  constructor(canvas) {
    this.x = LAUNCHER_X;
    this.y = LAUNCHER_Y;
    this.angle = Math.PI / 2; // pointing straight down
    this.canvas = canvas;

    this.canvas.addEventListener('mousemove', (e) => {
      const pos = getMouseGamePos(e);
      const dx = pos.x - this.x;
      const dy = pos.y - this.y;
      let angle = Math.atan2(dy, dx);

      // Clamp angle so launcher only aims downward
      if (angle < MIN_ANGLE) angle = MIN_ANGLE;
      if (angle > MAX_ANGLE) angle = MAX_ANGLE;

      this.angle = angle;
    });
  }

  getAngle() {
    return this.angle;
  }

  getLaunchPosition() {
    return { x: this.x, y: this.y };
  }

  draw() {
    // Launcher base circle
    drawCircle(this.x, this.y, 14, '#555');
    drawCircle(this.x, this.y, 10, '#888');

    // Cannon barrel — line in aim direction
    const barrelLen = 25;
    const bx = this.x + Math.cos(this.angle) * barrelLen;
    const by = this.y + Math.sin(this.angle) * barrelLen;
    drawLine(this.x, this.y, bx, by, '#aaa', 6);

    // Dotted guide line
    const gx1 = this.x + Math.cos(this.angle) * (barrelLen + 5);
    const gy1 = this.y + Math.sin(this.angle) * (barrelLen + 5);
    const gx2 = this.x + Math.cos(this.angle) * (barrelLen + 5 + GUIDE_LENGTH);
    const gy2 = this.y + Math.sin(this.angle) * (barrelLen + 5 + GUIDE_LENGTH);
    drawLine(gx1, gy1, gx2, gy2, 'rgba(255,255,255,0.3)', 2, GUIDE_DASH);
  }
}
