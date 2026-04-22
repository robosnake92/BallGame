import { initPhysics, stepPhysics, onCollision, Bodies, addBody, removeBody } from './engine/physics.js';
import { initRenderer, clear, BASE_WIDTH, BASE_HEIGHT } from './engine/renderer.js';
import { createBoard } from './game/board.js';
import { Ball } from './game/ball.js';
import { Launcher } from './game/launcher.js';
import { Bucket } from './game/bucket.js';
import { Scoring } from './game/scoring.js';
import { drawHUD } from './ui/hud.js';
import { drawTitleScreen, drawWinScreen, drawLoseScreen } from './ui/screens.js';

const STATES = {
  TITLE: 'TITLE',
  AIMING: 'AIMING',
  FIRING: 'FIRING',
  RESOLVING: 'RESOLVING',
  WIN: 'WIN',
  LOSE: 'LOSE',
};

const TOTAL_BALLS = 10;
const RESOLVE_DELAY = 300;

let state = STATES.TITLE;
let pegs = [];
let ball = null;
let launcher;
let bucket;
let scoring;
let ballsRemaining = TOTAL_BALLS;
let hitPegsThisShot = [];
let resolveStartTime = 0;
let caughtByBucket = false;

// Init engine and renderer
initPhysics();
const canvas = document.getElementById('game');
initRenderer(canvas);

// Collision handling
onCollision((event) => {
  if (state !== STATES.FIRING) return;

  for (const pair of event.pairs) {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;

    // Check for ball-peg collision
    let pegBody = null;
    let otherBody = null;
    if (bodyA.label === 'peg') { pegBody = bodyA; otherBody = bodyB; }
    if (bodyB.label === 'peg') { pegBody = bodyB; otherBody = bodyA; }

    if (pegBody && otherBody.label === 'ball') {
      const peg = pegBody.pegRef;
      if (peg && !peg.hit) {
        peg.markHit();
        hitPegsThisShot.push(peg);
      }
    }

    // Check for ball-bucket collision
    if (
      (bodyA.label === 'bucket' && bodyB.label === 'ball') ||
      (bodyB.label === 'bucket' && bodyA.label === 'ball')
    ) {
      caughtByBucket = true;
    }
  }
});

// Input handling
canvas.addEventListener('click', () => {
  if (state === STATES.TITLE) {
    startGame();
  } else if (state === STATES.AIMING) {
    fireBall();
  } else if (state === STATES.WIN || state === STATES.LOSE) {
    startGame();
  }
});

function startGame() {
  // Clear existing pegs from physics world
  for (const peg of pegs) {
    if (!peg.removed) {
      removeBody(peg.body);
    }
  }

  pegs = createBoard();
  scoring = new Scoring(25);
  ballsRemaining = TOTAL_BALLS;
  state = STATES.AIMING;
}

function fireBall() {
  const pos = launcher.getLaunchPosition();
  ball = new Ball(pos.x, pos.y);
  ball.launch(launcher.getAngle());
  hitPegsThisShot = [];
  caughtByBucket = false;
  state = STATES.FIRING;
}

function startResolving() {
  resolveStartTime = performance.now();
  state = STATES.RESOLVING;

  // Score the hits
  scoring.scoreHits(hitPegsThisShot);

  // Deduct ball (unless caught by bucket)
  if (!caughtByBucket) {
    ballsRemaining--;
  }

  // Start peg removal animations
  const now = performance.now();
  for (const peg of hitPegsThisShot) {
    peg.startRemoval(now);
  }
}

// Create persistent objects
launcher = new Launcher(canvas);
bucket = new Bucket();

// Walls — left and right boundaries
const wallThickness = 40;
addBody(Bodies.rectangle(-wallThickness / 2, BASE_HEIGHT / 2, wallThickness, BASE_HEIGHT * 2, { isStatic: true, label: 'wall' }));
addBody(Bodies.rectangle(BASE_WIDTH + wallThickness / 2, BASE_HEIGHT / 2, wallThickness, BASE_HEIGHT * 2, { isStatic: true, label: 'wall' }));

let lastTime = performance.now();

function gameLoop(currentTime) {
  const delta = currentTime - lastTime;
  lastTime = currentTime;

  // Update physics
  if (state === STATES.FIRING || state === STATES.RESOLVING) {
    stepPhysics(1000 / 60);
    bucket.update();
  } else if (state === STATES.AIMING) {
    bucket.update();
  }

  // State-specific logic
  if (state === STATES.FIRING) {
    if (ball && (ball.isOffScreen() || caughtByBucket)) {
      ball.destroy();
      ball = null;
      startResolving();
    }
  }

  if (state === STATES.RESOLVING) {
    // Update peg removal animations
    for (const peg of pegs) {
      peg.update(currentTime);
    }

    // Check if all hit pegs have finished animating
    const allRemoved = hitPegsThisShot.every(p => p.removed);
    if (allRemoved && currentTime - resolveStartTime > RESOLVE_DELAY) {
      // Remove cleared pegs from the array
      pegs = pegs.filter(p => !p.removed);

      // Check win/lose
      if (scoring.allOrangeCleared()) {
        state = STATES.WIN;
      } else if (ballsRemaining <= 0) {
        state = STATES.LOSE;
      } else {
        state = STATES.AIMING;
      }
    }
  }

  // Render
  clear();

  // Draw pegs
  for (const peg of pegs) {
    peg.draw();
  }

  // Draw bucket
  bucket.draw();

  // Draw launcher (only when aiming)
  if (state === STATES.AIMING) {
    launcher.draw();
  }

  // Draw ball
  if (ball && state === STATES.FIRING) {
    ball.draw();
  }

  // Draw HUD
  if (state !== STATES.TITLE) {
    drawHUD(
      scoring.getScore(),
      ballsRemaining,
      scoring.getMultiplier(),
      scoring.orangePegsCleared,
      scoring.totalOrangePegs
    );
  }

  // Draw overlay screens
  if (state === STATES.TITLE) {
    drawTitleScreen();
  } else if (state === STATES.WIN) {
    drawWinScreen(scoring.getScore());
  } else if (state === STATES.LOSE) {
    drawLoseScreen(scoring.getScore(), scoring.getOrangeRemaining());
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
