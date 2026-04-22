const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

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
}

window.addEventListener('resize', resize);
resize();

// Temporary test: draw a circle to verify canvas works
ctx.fillStyle = '#e94560';
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2);
ctx.fill();

console.log('Ball Game loaded');
