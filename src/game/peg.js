import { Bodies, Body, addBody, removeBody } from '../engine/physics.js';
import { drawCircle, drawText, BASE_WIDTH, BASE_HEIGHT } from '../engine/renderer.js';

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
const OWNER_OUTLINE_COLOR = '#ffffff';
const PEG_RADIUS = 12;
const FADE_DURATION = 500; // ms
const MOVE_SPEED = 3;
const BOUNDARY_MARGIN = 20;

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

  assign(ownerName) {
    this.owner = ownerName;
  }

  update(currentTime) {
    // Clamp owned pegs to play area boundaries
    if (this.owner && !this.removing) {
      const minX = BOUNDARY_MARGIN + this.radius;
      const maxX = BASE_WIDTH - BOUNDARY_MARGIN - this.radius;
      const minY = BOUNDARY_MARGIN + this.radius;
      const maxY = BASE_HEIGHT - BOUNDARY_MARGIN - this.radius;
      this.x = Math.max(minX, Math.min(maxX, this.x));
      this.y = Math.max(minY, Math.min(maxY, this.y));
      Body.setPosition(this.body, { x: this.x, y: this.y });
    }

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
      drawCircle(this.x, this.y, drawRadius + 3, HIT_COLOR, alpha * 0.4);
    }

    const color = this.hit ? HIT_COLOR : PEG_COLORS[this.type];
    drawCircle(this.x, this.y, drawRadius, color, alpha);

    // Owner name label below peg
    if (this.owner && !this.removing) {
      drawText(this.owner, this.x, this.y + drawRadius + 3, '#cccccc', '12px sans-serif', 'center');
    }
  }

  move(direction, allPegs) {
    if (!this.owner || this.hit) return;
    const directions = {
      left:  { x: -MOVE_SPEED, y: 0 },
      right: { x: MOVE_SPEED,  y: 0 },
      up:    { x: 0, y: -MOVE_SPEED },
      down:  { x: 0, y: MOVE_SPEED },
    };
    const delta = directions[direction];
    if (!delta) return;

    let newX = this.x + delta.x;
    let newY = this.y + delta.y;

    // Push out of any overlapping pegs
    const minDist = this.radius * 2;
    for (const other of allPegs) {
      if (other === this || other.removed) continue;
      const dx = newX - other.x;
      const dy = newY - other.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDist * minDist && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const overlap = minDist - dist;
        // Push away from the other peg
        newX += (dx / dist) * overlap;
        newY += (dy / dist) * overlap;
      }
    }

    this.x = newX;
    this.y = newY;
  }
}

export { PEG_RADIUS };
