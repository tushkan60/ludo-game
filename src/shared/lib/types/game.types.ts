export interface DiceRoll {
  value: number;
  isHeld: boolean;
  id: number;
}

export interface GameState {
  dice: DiceRoll[];
  rollsLeft: number;
  currentScore: number;
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
  | 'Nothing';

export interface HandResult {
  name: PokerHand;
  score: number;
}

export interface DotPosition {
  id: number;
  class: string;
}
