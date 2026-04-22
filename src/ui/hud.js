import { drawText, drawCircle, BASE_WIDTH } from '../engine/renderer.js';

const TEXT_COLOR = '#ffffff';
const BALL_ICON_COLOR = '#e0e0e0';
const BALL_ICON_RADIUS = 6;
const BALL_ICON_SPACING = 18;

export function drawHUD(score, ballsRemaining, multiplier, orangeCleared, totalOrange) {
  // Score — top-left
  drawText(`Score: ${score}`, 20, 15, TEXT_COLOR, '22px sans-serif', 'left');

  // Multiplier — below score
  if (multiplier > 1) {
    drawText(`${multiplier}x`, 20, 42, '#ffcc00', '18px sans-serif', 'left');
  }

  // Orange pegs remaining — center top
  drawText(
    `${orangeCleared}/${totalOrange} orange cleared`,
    BASE_WIDTH / 2, 15,
    '#e8873a', '18px sans-serif', 'center'
  );

  // Balls remaining — top-right as icons
  for (let i = 0; i < ballsRemaining; i++) {
    const x = BASE_WIDTH - 30 - i * BALL_ICON_SPACING;
    drawCircle(x, 22, BALL_ICON_RADIUS, BALL_ICON_COLOR);
  }
}
