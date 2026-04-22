import { Bodies, Body, addBody } from '../engine/physics.js';
import { drawRect, BASE_WIDTH, BASE_HEIGHT } from '../engine/renderer.js';

const BUCKET_WIDTH = 80;
const BUCKET_HEIGHT = 20;
const BUCKET_Y = BASE_HEIGHT - 15;
const BUCKET_SPEED = 2;
const BUCKET_COLOR = '#7a7aaa';

export class Bucket {
  constructor() {
    this.width = BUCKET_WIDTH;
    this.height = BUCKET_HEIGHT;
    this.direction = 1;

    // The bucket is a sensor (detects collisions but doesn't block the ball physically).
    // We use walls on the sides to catch the ball.
    this.body = Bodies.rectangle(BASE_WIDTH / 2, BUCKET_Y, BUCKET_WIDTH, BUCKET_HEIGHT, {
      isStatic: true,
      isSensor: true,
      label: 'bucket',
    });
    addBody(this.body);

    // Side walls to form a U-shape
    const wallThickness = 6;
    const wallHeight = BUCKET_HEIGHT + 10;
    const initX = BASE_WIDTH / 2;
    this.leftWall = Bodies.rectangle(
      initX - BUCKET_WIDTH / 2 + wallThickness / 2, BUCKET_Y - 5,
      wallThickness, wallHeight,
      { isStatic: true, label: 'bucketWall' }
    );
    this.rightWall = Bodies.rectangle(
      initX + BUCKET_WIDTH / 2 - wallThickness / 2, BUCKET_Y - 5,
      wallThickness, wallHeight,
      { isStatic: true, label: 'bucketWall' }
    );
    addBody(this.leftWall);
    addBody(this.rightWall);
  }

  update() {
    const pos = this.body.position;
    let newX = pos.x + BUCKET_SPEED * this.direction;

    if (newX > BASE_WIDTH - BUCKET_WIDTH / 2) {
      newX = BASE_WIDTH - BUCKET_WIDTH / 2;
      this.direction = -1;
    } else if (newX < BUCKET_WIDTH / 2) {
      newX = BUCKET_WIDTH / 2;
      this.direction = 1;
    }

    const dx = newX - pos.x;
    Body.setPosition(this.body, { x: newX, y: BUCKET_Y });
    Body.setPosition(this.leftWall, {
      x: newX - this.width / 2 + 3,
      y: BUCKET_Y - 5,
    });
    Body.setPosition(this.rightWall, {
      x: newX + this.width / 2 - 3,
      y: BUCKET_Y - 5,
    });
  }

  draw() {
    const pos = this.body.position;
    // Bucket base
    drawRect(pos.x, pos.y, this.width, this.height, BUCKET_COLOR);
    // Side walls
    drawRect(pos.x - this.width / 2 + 3, pos.y - 5, 6, this.height + 10, '#8888bb');
    drawRect(pos.x + this.width / 2 - 3, pos.y - 5, 6, this.height + 10, '#8888bb');
  }
}
