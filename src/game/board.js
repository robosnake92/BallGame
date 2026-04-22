import { Peg, PEG_TYPES } from './peg.js';
import { BASE_WIDTH, BASE_HEIGHT } from '../engine/renderer.js';

const ROWS = 10;
const COLS = 11; // odd rows get 11, even rows get 10
const MARGIN_X = 140;
const MARGIN_TOP = 120;
const MARGIN_BOTTOM = 140;

export function createBoard() {
  const pegs = [];
  const positions = [];

  const usableHeight = BASE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
  const usableWidth = BASE_WIDTH - MARGIN_X * 2;
  const rowSpacing = usableHeight / (ROWS - 1);
  const colSpacing = usableWidth / (COLS - 1);

  for (let row = 0; row < ROWS; row++) {
    const isOffset = row % 2 === 1;
    const colsInRow = isOffset ? COLS - 1 : COLS;
    const offsetX = isOffset ? colSpacing / 2 : 0;

    for (let col = 0; col < colsInRow; col++) {
      const x = MARGIN_X + offsetX + col * colSpacing;
      const y = MARGIN_TOP + row * rowSpacing;
      positions.push({ x, y });
    }
  }

  // Assign types randomly: 25 orange, 2 green, rest blue
  const types = assignPegTypes(positions.length);

  for (let i = 0; i < positions.length; i++) {
    pegs.push(new Peg(positions[i].x, positions[i].y, types[i]));
  }

  return pegs;
}

function assignPegTypes(count) {
  const types = new Array(count).fill(PEG_TYPES.BLUE);

  // Place 25 orange pegs at random positions
  const indices = Array.from({ length: count }, (_, i) => i);
  shuffle(indices);

  for (let i = 0; i < 25 && i < count; i++) {
    types[indices[i]] = PEG_TYPES.ORANGE;
  }

  // Place 2 green pegs at random non-orange positions
  let greenPlaced = 0;
  for (let i = 25; i < indices.length && greenPlaced < 2; i++) {
    types[indices[i]] = PEG_TYPES.GREEN;
    greenPlaced++;
  }

  return types;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
