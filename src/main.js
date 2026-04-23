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
let ballStuckTime = 0;
const STUCK_SPEED_THRESHOLD = 0.3;
const STUCK_DURATION = 2000; // ms of low speed before forcing resolve

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

// Sound effects
const BASE_URL = import.meta.env.BASE_URL;
const SCREAM_SOUNDS = [
  'sounds/freesound_community-cartoon-scream-1-6835.mp3',
  'sounds/freesound_community-panic-stricken-screaming-1-6880.mp3',
  'sounds/universfield-a-scream-of-a-panic-stricken-female-191977.mp3',
  'sounds/universfield-intense-male-falling-scream-244325.mp3',
  'sounds/universfield-male-extreme-scream-123078.mp3',
  'sounds/universfield-man-scream-010-277572.mp3',
  'sounds/untitled-creator-man-screaming-417689.mp3',
  'sounds/wakanatsukiko-female-scream-short-251067.mp3',
];

function playScream() {
  const src = SCREAM_SOUNDS[Math.floor(Math.random() * SCREAM_SOUNDS.length)];
  const audio = new Audio(BASE_URL + src);
  audio.play().catch(() => {});
}

// Keyboard input — R to assign random peg, WASD to move owned peg, Q for scream
let myPeg = null;

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (key === 'r') {
    // Assign a random unowned, unhit peg
    const available = pegs.filter(p => !p.owner && !p.hit && !p.removed);
    if (available.length > 0) {
      // Unassign previous peg if any
      if (myPeg && !myPeg.removed) {
        myPeg.owner = null;
      }
      myPeg = available[Math.floor(Math.random() * available.length)];
      myPeg.assign('player');
    }
  }

  if (key === 'q') {
    playScream();
  }

  if (myPeg && !myPeg.removed) {
    const dirMap = { w: 'up', a: 'left', s: 'down', d: 'right' };
    if (dirMap[key]) {
      myPeg.move(dirMap[key], pegs);
    }
  }
});

// Click input
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
  ballStuckTime = 0;
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

  // Update physics (always step so owned pegs can move)
  if (state === STATES.AIMING || state === STATES.FIRING || state === STATES.RESOLVING) {
    stepPhysics(1000 / 60);
    bucket.update();
    for (const peg of pegs) {
      peg.update(currentTime);
    }
  }

  // State-specific logic
  if (state === STATES.FIRING) {
    if (ball) {
      if (ball.isOffScreen() || caughtByBucket) {
        ball.destroy();
        ball = null;
        startResolving();
      } else {
        // Detect stuck ball — start fading hit pegs to unstick, keep ball in play
        const vel = ball.body.velocity;
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        if (speed < STUCK_SPEED_THRESHOLD) {
          ballStuckTime += delta;
          if (ballStuckTime >= STUCK_DURATION && hitPegsThisShot.length > 0) {
            const now = performance.now();
            scoring.scoreHits(hitPegsThisShot);
            for (const peg of hitPegsThisShot) {
              peg.startRemoval(now);
            }
            hitPegsThisShot = [];
            ballStuckTime = 0;
          }
        } else {
          ballStuckTime = 0;
        }
      }
    }
  }

  // Clean up fully removed pegs
  pegs = pegs.filter(p => !p.removed);

  if (state === STATES.RESOLVING) {

    // Check if all hit pegs have finished animating
    const allRemoved = hitPegsThisShot.every(p => p.removed);
    if (allRemoved && currentTime - resolveStartTime > RESOLVE_DELAY) {
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
