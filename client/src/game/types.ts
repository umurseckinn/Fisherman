export type FishClass = 'trash' | 'common' | 'rare' | 'epic' | 'legendary';

export interface InventoryItem {
  id: string;
  type: FishClass;
  name: string;
  value: number;
}

export interface Entity {
  id: number;
  type: FishClass;
  name: string;
  x: number;
  y: number;
  speed: number;
  value: number;
  weight: number; 
  color: string;
  radius: number;
  direction: 1 | -1; 
}

export interface Hook {
  angle: number; 
  length: number;
  state: 'idle' | 'shooting' | 'retracting';
  direction: 1 | -1; 
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
  inventory: InventoryItem[];
  upgrades: {
    rodLevel: number;
    boatLevel: number;
    hasFuel: boolean;
  };
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
    speedMultiplier: 0.7,
    weightMultiplier: 1.2,
    value: 25,
    radius: 20,
  },
  common: {
    names: ['Hamsi', 'İstavrit'],
    colors: ['#C0C0C0', '#4682B4'],
    speedMultiplier: 1.0,
    weightMultiplier: 0.8,
    value: 80,
    radius: 15,
  },
  rare: {
    names: ['Somon', 'Çipura'],
    colors: ['#FF7043', '#00E676'],
    speedMultiplier: 1.5,
    weightMultiplier: 1.0,
    value: 200,
    radius: 20,
  },
  epic: {
    names: ['Kılıç Balığı', 'Ton'],
    colors: ['#1A237E', '#7B1FA2'],
    speedMultiplier: 2.2,
    weightMultiplier: 1.5,
    value: 550,
    radius: 30,
  },
  legendary: {
    names: ['Altın Balık', 'Hazine'],
    colors: ['#FFD700', '#FFFF00'],
    speedMultiplier: 3.5,
    weightMultiplier: 0.4,
    value: 2000,
    radius: 35,
  },
};
