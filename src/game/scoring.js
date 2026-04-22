import { PEG_TYPES } from './peg.js';

const BASE_POINTS = {
  [PEG_TYPES.ORANGE]: 100,
  [PEG_TYPES.BLUE]: 10,
  [PEG_TYPES.GREEN]: 10,
};

const MULTIPLIER_TIERS = [
  { threshold: 0, multiplier: 1 },
  { threshold: 0.25, multiplier: 2 },
  { threshold: 0.50, multiplier: 3 },
  { threshold: 0.75, multiplier: 5 },
  { threshold: 1.0, multiplier: 10 },
];

export class Scoring {
  constructor(totalOrangePegs) {
    this.score = 0;
    this.totalOrangePegs = totalOrangePegs;
    this.orangePegsCleared = 0;
  }

  getMultiplier() {
    const ratio = this.orangePegsCleared / this.totalOrangePegs;
    let multiplier = 1;
    for (const tier of MULTIPLIER_TIERS) {
      if (ratio >= tier.threshold) {
        multiplier = tier.multiplier;
      }
    }
    return multiplier;
  }

  scoreHits(hitPegs) {
    const multiplier = this.getMultiplier();
    let shotScore = 0;

    for (const peg of hitPegs) {
      const base = BASE_POINTS[peg.type] || 10;
      shotScore += base * multiplier;
      if (peg.type === PEG_TYPES.ORANGE) {
        this.orangePegsCleared++;
      }
    }

    this.score += shotScore;
    return shotScore;
  }

  getScore() {
    return this.score;
  }

  getOrangeRemaining() {
    return this.totalOrangePegs - this.orangePegsCleared;
  }

  allOrangeCleared() {
    return this.orangePegsCleared >= this.totalOrangePegs;
  }
}
