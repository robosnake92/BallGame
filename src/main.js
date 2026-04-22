import { initPhysics } from './engine/physics.js';
import { initRenderer, clear, drawCircle, BASE_WIDTH, BASE_HEIGHT } from './engine/renderer.js';

const { engine, world } = initPhysics();
const canvas = document.getElementById('game');
initRenderer(canvas);

function gameLoop() {
  clear();
  drawCircle(BASE_WIDTH / 2, BASE_HEIGHT / 2, 30, '#e94560');
  requestAnimationFrame(gameLoop);
}

gameLoop();
