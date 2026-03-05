export type FishClass = 'bubble' | 'sakura' | 'zap' | 'candy' | 'moon' | 'lava' | 'crystal' | 'leaf' | 'tide' | 'mushroom' | 'king' | 'galaxy' | 'coral' | 'sea_kelp' | 'sea_rock' | 'treasure_chest' | 'whirlpool' | 'sunken_boat' | 'shark_skeleton' | 'env_bubbles' | 'anchor' | 'shell';

export interface InventoryItem {
  id: string;
  type: FishClass;
  name: string;
  value: number;
  weight: number; // New property for storage calculation
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
  // Specific properties for new entities
  startY?: number; // For sine wave or deviation reference
  animationOffset?: number; // Random seed for animations
}

export interface Hook {
  angle: number; 
  length: number;
  state: 'idle' | 'shooting' | 'retracting' | 'whirlpool' | 'snagged';
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
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'magic';
  hook: Hook;
  fishes: Entity[];
  inventory: InventoryItem[];
  upgrades: {
    rodLevel: number;
    boatLevel: number;
    hasFuel: boolean;
    storageCapacity: number; // New upgrade property
  };
  currentStorage: number; // New state property
  hookAttempts: number;
  maxHookAttempts: number;
  hookSpeedBoostMs: number;
  fishPanicMs: number;
  buoyancyOffset: number;
  buoyancyOffsetMs: number;
  weightDisplayOffset: number;
  weightDisplayOffsetMs: number;
  anchorSnagMs: number;
  hookBrokenMs: number;
  valueMultiplier: number;
  leafBonusStacks: number;
  candyBonusStacks: number;
}

export const OBJECT_MATRIX: Record<FishClass, {
  names: string[];
  colors: string[];
  speedMultiplier: number;
  weightMultiplier: number;
  value: number;
  radius: number;
  isObstacle?: boolean;
}> = {
  bubble: {
    names: ['Bubble Fish'],
    colors: ['#E8F4FD'],
    speedMultiplier: 1.2, // 1.2px/frame
    weightMultiplier: 2,
    value: 15,
    radius: 20, // Approx 48x36 -> 24x18 radius
  },
  sakura: {
    names: ['Sakura Fish'],
    colors: ['#FDF0F5'],
    speedMultiplier: 1.5, // 1.5px/frame
    weightMultiplier: 3,
    value: 25,
    radius: 22, // Approx 52x40 -> 26x20 radius
  },
  zap: {
    names: ['Zap Fish'],
    colors: ['#FFE066'],
    speedMultiplier: 1.7,
    weightMultiplier: 4,
    value: 40,
    radius: 24,
  },
  candy: {
    names: ['Candy Fish'],
    colors: ['#FFC0CB'],
    speedMultiplier: 1.3,
    weightMultiplier: 5,
    value: 55,
    radius: 23,
  },
  moon: {
    names: ['Moon Fish'],
    colors: ['#DDE6FF'],
    speedMultiplier: 1.4,
    weightMultiplier: 8,
    value: 80,
    radius: 24,
  },
  lava: {
    names: ['Lava Fish'],
    colors: ['#FF6B3D'],
    speedMultiplier: 1.6,
    weightMultiplier: 12,
    value: 110,
    radius: 24,
  },
  crystal: {
    names: ['Crystal Fish'],
    colors: ['#C9B6FF'],
    speedMultiplier: 1.5,
    weightMultiplier: 18,
    value: 300,
    radius: 24,
  },
  leaf: {
    names: ['Leaf Fish'],
    colors: ['#FFA94D'],
    speedMultiplier: 1.2,
    weightMultiplier: 1,
    value: 200,
    radius: 22,
  },
  tide: {
    names: ['Tide Fish'],
    colors: ['#74C0FC'],
    speedMultiplier: 1.4,
    weightMultiplier: 9,
    value: 150,
    radius: 23,
  },
  mushroom: {
    names: ['Mushroom Fish'],
    colors: ['#E85D75'],
    speedMultiplier: 1.2,
    weightMultiplier: 15,
    value: 600,
    radius: 23,
  },
  king: {
    names: ['King Fish'],
    colors: ['#F3C969'],
    speedMultiplier: 1.5,
    weightMultiplier: 35,
    value: 1000,
    radius: 26,
  },
  galaxy: {
    names: ['Galaxy Fish'],
    colors: ['#7C5CFA'],
    speedMultiplier: 1.6,
    weightMultiplier: 7,
    value: 450,
    radius: 25,
  },
  coral: {
    names: ['Coral Reef'],
    colors: ['#FFF3E0'],
    speedMultiplier: 0, // Static
    weightMultiplier: 999, // Unliftable
    value: 0,
    radius: 30, // Approx 72x52
    isObstacle: true,
  },
  sea_kelp: {
    names: ['Sea Kelp'],
    colors: ['#7ED957'],
    speedMultiplier: 0,
    weightMultiplier: 999,
    value: 0,
    radius: 28,
    isObstacle: true,
  },
  sea_rock: {
    names: ['Sea Rock'],
    colors: ['#8A9AA9'],
    speedMultiplier: 0,
    weightMultiplier: 999,
    value: 0,
    radius: 30,
    isObstacle: true,
  },
  treasure_chest: {
    names: ['Treasure Chest'],
    colors: ['#FFD700'],
    speedMultiplier: 0.5,
    weightMultiplier: 2.5,
    value: 500,
    radius: 35,
  },
  whirlpool: {
    names: ['Whirlpool'],
    colors: ['#00BFFF'],
    speedMultiplier: 0.8,
    weightMultiplier: 999,
    value: 0,
    radius: 45,
    isObstacle: true,
  },
  sunken_boat: {
    names: ['Sunken Boat'],
    colors: ['#8B4513'],
    speedMultiplier: 0,
    weightMultiplier: 999,
    value: 0,
    radius: 60,
    isObstacle: true,
  },
  shark_skeleton: {
    names: ['Shark Skeleton'],
    colors: ['#E0E0E0'],
    speedMultiplier: 1.2,
    weightMultiplier: 1.0,
    value: 80,
    radius: 40,
  },
  env_bubbles: {
    names: ['Bubbles'],
    colors: ['#E0FFFF'],
    speedMultiplier: 1.5,
    weightMultiplier: 0.1,
    value: 10,
    radius: 15,
  },
  anchor: {
    names: ['Rusty Anchor'],
    colors: ['#708090'],
    speedMultiplier: 0,
    weightMultiplier: 3.0,
    value: 150,
    radius: 30,
  },
  shell: {
    names: ['Sea Shell'],
    colors: ['#FFEFD5'],
    speedMultiplier: 0,
    weightMultiplier: 0.2,
    value: 25,
    radius: 15,
  }
};
