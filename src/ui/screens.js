import { drawText, drawRect, BASE_WIDTH, BASE_HEIGHT } from '../engine/renderer.js';

export function drawTitleScreen() {
  drawRect(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 'rgba(0,0,0,0.7)');
  drawText('Ball Game', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 60, '#e94560', '48px sans-serif', 'center');
  drawText('Click to Start', BASE_WIDTH / 2, BASE_HEIGHT / 2 + 20, '#ffffff', '24px sans-serif', 'center');
}

export function drawWinScreen(score) {
  drawRect(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 'rgba(0,0,0,0.7)');
  drawText('You Win!', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 60, '#5cb85c', '48px sans-serif', 'center');
  drawText(`Final Score: ${score}`, BASE_WIDTH / 2, BASE_HEIGHT / 2 + 10, '#ffffff', '28px sans-serif', 'center');
  drawText('Click to Play Again', BASE_WIDTH / 2, BASE_HEIGHT / 2 + 60, '#aaaaaa', '20px sans-serif', 'center');
}

export function drawLoseScreen(score, orangeRemaining) {
  drawRect(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 'rgba(0,0,0,0.7)');
  drawText('Game Over', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 60, '#e94560', '48px sans-serif', 'center');
  drawText(`Score: ${score}`, BASE_WIDTH / 2, BASE_HEIGHT / 2 + 10, '#ffffff', '28px sans-serif', 'center');
  drawText(
    `${orangeRemaining} orange peg${orangeRemaining !== 1 ? 's' : ''} remaining`,
    BASE_WIDTH / 2, BASE_HEIGHT / 2 + 45, '#e8873a', '20px sans-serif', 'center'
  );
  drawText('Click to Try Again', BASE_WIDTH / 2, BASE_HEIGHT / 2 + 85, '#aaaaaa', '20px sans-serif', 'center');
}
