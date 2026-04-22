const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

let canvas;
let ctx;
let scale = 1;

export function initRenderer(canvasElement) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  return { canvas, ctx };
}

function resize() {
  const windowRatio = window.innerWidth / window.innerHeight;
  const gameRatio = BASE_WIDTH / BASE_HEIGHT;

  if (windowRatio > gameRatio) {
    canvas.height = window.innerHeight;
    canvas.width = canvas.height * gameRatio;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / gameRatio;
  }

  scale = canvas.width / BASE_WIDTH;
}

export function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawCircle(x, y, radius, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x * scale, y * scale, radius * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawRect(x, y, width, height, color, angle = 0) {
  ctx.save();
  ctx.translate(x * scale, y * scale);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect((-width / 2) * scale, (-height / 2) * scale, width * scale, height * scale);
  ctx.restore();
}

export function drawLine(x1, y1, x2, y2, color, lineWidth = 2, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * scale;
  ctx.setLineDash(dash.map(d => d * scale));
  ctx.beginPath();
  ctx.moveTo(x1 * scale, y1 * scale);
  ctx.lineTo(x2 * scale, y2 * scale);
  ctx.stroke();
  ctx.restore();
}

export function drawText(text, x, y, color, font = '20px sans-serif', align = 'left') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font.replace(/(\d+)px/, (_, size) => `${size * scale}px`);
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x * scale, y * scale);
  ctx.restore();
}

export function drawPolygon(points, color, cx = 0, cy = 0, angle = 0) {
  ctx.save();
  ctx.translate(cx * scale, cy * scale);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x * scale, points[0].y * scale);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * scale, points[i].y * scale);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function getScale() {
  return scale;
}

export function getMouseGamePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  };
}

export { BASE_WIDTH, BASE_HEIGHT };
