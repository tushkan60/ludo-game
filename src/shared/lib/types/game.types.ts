export interface DiceRoll {
  value: number;
  isHeld: boolean;
  id: number;
}

export interface RoundState {
  dice: DiceRoll[];
  rollsLeft: number;
  currentScore: number;
  isComplete: boolean;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  roundState: RoundState;
  totalScore: number;
  highScore: number;
  isGameOver: boolean;
}

export type PokerHand =
  | 'Five of a Kind'
  | 'Four of a Kind'
  | 'Full House'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'One Pair'
  | 'High Dice'
  | 'Nothing'
  | 'Big Straight'
  | 'Small Straight';

export interface HandResult {
  name: PokerHand;
  score: number;
}

export interface DotPosition {
  id: number;
  class: string;
}
