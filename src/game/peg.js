import { Bodies, addBody, removeBody } from '../engine/physics.js';
import { drawCircle } from '../engine/renderer.js';

export const PEG_TYPES = {
  BLUE: 'blue',
  ORANGE: 'orange',
  GREEN: 'green',
};

const PEG_COLORS = {
  [PEG_TYPES.BLUE]: '#4a90d9',
  [PEG_TYPES.ORANGE]: '#e8873a',
  [PEG_TYPES.GREEN]: '#5cb85c',
};

const HIT_COLOR = '#ffffaa';
const PEG_RADIUS = 12;
const FADE_DURATION = 500; // ms

export class Peg {
  constructor(x, y, type = PEG_TYPES.BLUE) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hit = false;
    this.owner = null; // for future Twitch integration
    this.removing = false;
    this.removeStartTime = 0;
    this.removeProgress = 0;
    this.removed = false;
    this.radius = PEG_RADIUS;

    this.body = Bodies.circle(x, y, PEG_RADIUS, {
      isStatic: true,
      restitution: 0.7,
      label: 'peg',
    });
    this.body.pegRef = this;
    addBody(this.body);
  }

  markHit() {
    this.hit = true;
  }

  startRemoval(currentTime) {
    this.removing = true;
    this.removeStartTime = currentTime;
  }

  update(currentTime) {
    if (this.removing) {
      this.removeProgress = Math.min(1, (currentTime - this.removeStartTime) / FADE_DURATION);
      if (this.removeProgress >= 1) {
        this.removed = true;
        removeBody(this.body);
      }
    }
  }

  draw() {
    if (this.removed) return;

    const alpha = this.removing ? 1 - this.removeProgress : 1;
    const scaleMultiplier = this.removing ? 1 - this.removeProgress * 0.5 : 1;
    const drawRadius = this.radius * (this.hit && !this.removing ? 1.15 : scaleMultiplier);

    if (this.hit) {
      // Glow effect
      drawCircle(this.x, this.y, drawRadius + 3, HIT_COLOR, alpha * 0.4);
    }

    const color = this.hit ? HIT_COLOR : PEG_COLORS[this.type];
    drawCircle(this.x, this.y, drawRadius, color, alpha);
  }

  // Future Twitch integration: apply velocity impulse to move peg
  move(direction) {
    // Will be implemented when Twitch integration is added
    // Body.setVelocity(this.body, { x: dx, y: dy });
  }
}

export { PEG_RADIUS };
