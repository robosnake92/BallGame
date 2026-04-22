import { Bodies, Body, addBody, removeBody } from '../engine/physics.js';
import { drawCircle, BASE_HEIGHT } from '../engine/renderer.js';

const BALL_RADIUS = 8;
const BALL_COLOR = '#e0e0e0';
const LAUNCH_SPEED = 12;

export class Ball {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, BALL_RADIUS, {
      restitution: 0.8,
      friction: 0.05,
      density: 0.002,
      label: 'ball',
    });
    this.active = false;
    this.radius = BALL_RADIUS;
    addBody(this.body);
  }

  launch(angle) {
    this.active = true;
    const vx = Math.cos(angle) * LAUNCH_SPEED;
    const vy = Math.sin(angle) * LAUNCH_SPEED;
    Body.setVelocity(this.body, { x: vx, y: vy });
  }

  isOffScreen() {
    return this.body.position.y > BASE_HEIGHT + 50;
  }

  getPosition() {
    return this.body.position;
  }

  draw() {
    const pos = this.body.position;
    drawCircle(pos.x, pos.y, this.radius, BALL_COLOR);
  }

  destroy() {
    removeBody(this.body);
    this.active = false;
  }
}

export { BALL_RADIUS, LAUNCH_SPEED };
