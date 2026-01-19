export type FishClass = 'trash' | 'common' | 'rare' | 'epic' | 'legendary';

export interface Entity {
  id: number;
  type: FishClass;
  name: string;
  x: number;
  y: number;
  speed: number;
  value: number;
  weight: number; // Multiplier
  color: string;
  radius: number;
  direction: 1 | -1; // 1 = moving right, -1 = moving left
}

export interface Hook {
  angle: number; // in radians
  length: number;
  state: 'idle' | 'shooting' | 'retracting';
  direction: 1 | -1; // 1 = right, -1 = left (oscillation direction)
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

export const OBJECT_MATRIX: Record<FishClass, {
  names: string[];
  colors: string[];
  speedMultiplier: number;
  weightMultiplier: number;
  value: number;
  radius: number;
}> = {
  trash: {
    names: ['Taş', 'Eski Bot', 'Yosun'],
    colors: ['#808080', '#5D4037', '#2E7D32'],
    speedMultiplier: 1.0,
    weightMultiplier: 3.0,
    value: 1,
    radius: 25,
  },
  common: {
    names: ['Hamsi', 'İstavrit'],
    colors: ['#C0C0C0', '#4682B4'],
    speedMultiplier: 1.5,
    weightMultiplier: 1.0,
    value: 5,
    radius: 15,
  },
  rare: {
    names: ['Somon', 'Çipura'],
    colors: ['#FF7043', '#00E676'],
    speedMultiplier: 2.5,
    weightMultiplier: 1.5,
    value: 15,
    radius: 20,
  },
  epic: {
    names: ['Kılıç Balığı', 'Ton'],
    colors: ['#1A237E', '#7B1FA2'],
    speedMultiplier: 4.0,
    weightMultiplier: 2.5,
    value: 50,
    radius: 30,
  },
  legendary: {
    names: ['Altın Balık', 'Hazine'],
    colors: ['#FFD700', '#FFFF00'],
    speedMultiplier: 6.0,
    weightMultiplier: 0.5,
    value: 150,
    radius: 35,
  },
};
