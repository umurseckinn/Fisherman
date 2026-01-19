export type FishType = 'gold' | 'normal' | 'trash' | 'treasure';

export interface Entity {
  id: number;
  type: FishType;
  x: number;
  y: number;
  speed: number;
  value: number;
  weight: 'light' | 'medium' | 'heavy';
  color: string;
  radius: number;
}

export interface Hook {
  angle: number; // in radians
  length: number;
  state: 'idle' | 'shooting' | 'retracting';
  direction: 1 | -1; // 1 = right, -1 = left
  x: number;
  y: number;
  caughtEntity: Entity | null;
}

export interface GameState {
  score: number;
  island: number;
  fuelCost: number;
  timeRemaining: number;
  isPlaying: boolean;
  hook: Hook;
  fishes: Entity[];
}
