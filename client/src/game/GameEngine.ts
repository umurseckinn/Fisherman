import { type GameState, type Entity, type FishClass, OBJECT_MATRIX } from "./types";
import { SpriteManager, ASSETS } from "./SpriteManager";

export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;
export const SEA_LEVEL_Y = CANVAS_HEIGHT * 0.25;

export const ISLAND_CONFIG = {
  1: {
    duration: 60,
    fuelCost: 50,
    seaColor: '#29B6F6',
    skyColor: '#87CEEB',
    weatherWeights: { sunny: 1 },
    fish: ['bubble', 'sakura', 'zap', 'candy'] as FishClass[],
    obstacles: { sea_kelp: 2, sea_rock: 1, coral: 0, anchor: 0 },
    dynamic: [] as FishClass[]
  },
  2: {
    duration: 65,
    fuelCost: 80,
    seaColor: '#0288D1',
    skyColor: '#9AD1FF',
    weatherWeights: { sunny: 0.8, cloudy: 0.2 },
    fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide'] as FishClass[],
    obstacles: { sea_kelp: 3, sea_rock: 0, coral: 1, anchor: 1 },
    dynamic: ['whirlpool'] as FishClass[]
  },
  3: {
    duration: 70,
    fuelCost: 120,
    seaColor: '#01579B',
    skyColor: '#FFB36B',
    weatherWeights: { sunny: 0.5, cloudy: 0.3, rainy: 0.2 },
    fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy'] as FishClass[],
    obstacles: { sea_kelp: 3, sea_rock: 2, coral: 2, anchor: 1 },
    dynamic: ['whirlpool', 'shark_skeleton'] as FishClass[]
  },
  4: {
    duration: 75,
    fuelCost: 180,
    seaColor: '#0D2137',
    skyColor: '#4A4A6A',
    weatherWeights: { cloudy: 0.2, stormy: 0.8 },
    fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'] as FishClass[],
    obstacles: { sea_kelp: 4, sea_rock: 3, coral: 2, anchor: 2 },
    dynamic: ['whirlpool', 'shark_skeleton'] as FishClass[]
  },
  5: {
    duration: 80,
    fuelCost: 0,
    seaColor: '#080C2B',
    skyColor: '#1B1143',
    weatherWeights: { magic: 1 },
    fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'] as FishClass[],
    obstacles: { sea_kelp: 5, sea_rock: 4, coral: 3, anchor: 2 },
    dynamic: ['whirlpool', 'shark_skeleton'] as FishClass[]
  }
} as const;

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private lastFrameTime: number = 0;
  private onGameOver: (score: number, island: number, reason?: string) => void;
  private onScoreUpdate: (score: number) => void;
  private onIslandComplete: (island: number) => void;
  private onFishCaught: (fish: Entity) => void;
  private arrivalProgress: number = 0;
  private isArriving: boolean = false;
  private isSinking: boolean = false;
  private sinkProgress: number = 0;
  private spriteManager: SpriteManager;
  private assetsLoaded: boolean = false;
  private whirlpoolCenter: { x: number; y: number } | null = null;
  private whirlpoolAngle: number = 0;
  private whirlpoolTurns: number = 0;
  private whirlpoolRadius: number = 0;
  private hookBreakDuration: number = 3500;
  private lastSnagType: 'anchor' | 'kelp' | 'rock' | null = null;
  private lastSpawnedType: FishClass | null = null;

  constructor(
    ctx: CanvasRenderingContext2D, 
    initialState: GameState,
    callbacks: {
      onGameOver: (score: number, island: number, reason?: string) => void;
      onScoreUpdate: (score: number) => void;
      onIslandComplete: (island: number) => void;
      onFishCaught: (fish: Entity) => void;
    }
  ) {
    this.ctx = ctx;
    this.state = initialState;
    this.onGameOver = callbacks.onGameOver;
    this.onScoreUpdate = callbacks.onScoreUpdate;
    this.onIslandComplete = callbacks.onIslandComplete;
    this.onFishCaught = callbacks.onFishCaught;
    
    this.spriteManager = new SpriteManager(() => {
      this.assetsLoaded = true;
    });
    this.spriteManager.loadImages(ASSETS);
  }

  start() {
    this.state.isPlaying = true;
    this.isArriving = false;
    this.arrivalProgress = 0;
    this.isSinking = false;
    this.sinkProgress = 0;
    this.state.weather = this.pickWeather();
    const config = ISLAND_CONFIG[this.state.island as keyof typeof ISLAND_CONFIG];
    if (config) {
      this.state.timeRemaining = config.duration;
      this.state.fuelCost = config.fuelCost;
    }
    this.seedStaticObstacles();
    this.lastFrameTime = performance.now();
    this.loop();
  }

  stop() {
    this.state.isPlaying = false;
  }

  getState() {
    return this.state;
  }

  handleInput() {
    if (this.state.anchorSnagMs > 0 && this.lastSnagType === 'anchor') {
      this.state.anchorSnagMs = 500;
      return;
    }
    if (this.state.hookBrokenMs > 0) return;
    if (this.state.hookAttempts <= 0) return;
    if (this.state.hook.state === 'idle' && !this.isArriving) {
      this.state.hook.state = 'shooting';
    }
  }

  private loop = (timestamp: number = 0) => {
    if (!this.state.isPlaying) return;

    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number) {
    if (this.isSinking) {
      this.sinkProgress += deltaTime / 2000;
      if (this.sinkProgress >= 1) {
        this.sinkProgress = 1;
        this.state.isPlaying = false;
        // Trigger game over with generic message
        this.onGameOver(this.state.score, this.state.island, "Tekne battı! Çok ağır yük altında ezildi.");
      }
      return;
    }

    this.updateTimers(deltaTime);

    if (this.isArriving) {
      this.arrivalProgress += deltaTime / 2000;
      if (this.arrivalProgress >= 1) {
        this.arrivalProgress = 1;
        this.state.isPlaying = false;
        // Small delay to let the animation settle
        setTimeout(() => {
          this.onIslandComplete(this.state.island);
        }, 100);
      }
      return;
    }

    if (this.state.timeRemaining > 0) {
      this.state.timeRemaining -= deltaTime / 1000;
    } else if (!this.isArriving) {
      this.isArriving = true;
      this.state.hook.state = 'idle';
      // Reset arrival progress to ensure a clean animation start
      this.arrivalProgress = 0;
    }

    this.updateHook(deltaTime);
    this.updateFishes(deltaTime);
    this.spawnFishes(deltaTime);
    this.ensureAmbientBubbles();
  }

  private updateTimers(deltaTime: number) {
    const clamp = (value: number) => Math.max(0, value - deltaTime);
    const prevHookBrokenMs = this.state.hookBrokenMs;
    this.state.hookSpeedBoostMs = clamp(this.state.hookSpeedBoostMs);
    this.state.fishPanicMs = clamp(this.state.fishPanicMs);
    this.state.buoyancyOffsetMs = clamp(this.state.buoyancyOffsetMs);
    this.state.weightDisplayOffsetMs = clamp(this.state.weightDisplayOffsetMs);
    this.state.anchorSnagMs = clamp(this.state.anchorSnagMs);
    this.state.hookBrokenMs = clamp(this.state.hookBrokenMs);

    if (this.state.buoyancyOffsetMs === 0 && this.state.buoyancyOffset !== 0) {
      this.state.buoyancyOffset = 0;
      this.recalculateStorage();
    }
    if (this.state.weightDisplayOffsetMs === 0 && this.state.weightDisplayOffset !== 0) {
      this.state.weightDisplayOffset = 0;
    }
    if (this.state.anchorSnagMs === 0) {
      this.lastSnagType = null;
    }
    if (prevHookBrokenMs > 0 && this.state.hookBrokenMs === 0 && this.state.hookAttempts > 0) {
      this.state.hook.state = 'idle';
      this.state.hook.length = 0;
      this.state.hook.x = CANVAS_WIDTH / 2;
      this.state.hook.y = SEA_LEVEL_Y;
    }
  }

  private pickWeather(): GameState['weather'] {
    const config = ISLAND_CONFIG[this.state.island as keyof typeof ISLAND_CONFIG];
    if (!config) return 'sunny';
    const weights = config.weatherWeights;
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);
    const roll = Math.random() * total;
    let acc = 0;
    for (const [weather, weight] of entries) {
      acc += weight;
      if (roll <= acc) return weather as GameState['weather'];
    }
    return 'sunny';
  }

  private seedStaticObstacles() {
    const config = ISLAND_CONFIG[this.state.island as keyof typeof ISLAND_CONFIG];
    if (!config) return;
    const spawnStatic = (type: FishClass, count: number) => {
      for (let i = 0; i < count; i++) {
        const y = type === 'sea_rock' && Math.random() < 0.4
          ? SEA_LEVEL_Y + 120 + Math.random() * 200
          : CANVAS_HEIGHT - 60 + Math.random() * 20;
        const x = 40 + Math.random() * (CANVAS_WIDTH - 80);
        const configEntry = OBJECT_MATRIX[type];
        this.state.fishes.push({
          id: Math.random(),
          type,
          name: configEntry.names[0],
          x,
          y,
          startY: y,
          animationOffset: Math.random() * 1000,
          speed: configEntry.speedMultiplier,
          value: configEntry.value,
          weight: configEntry.weightMultiplier,
          color: configEntry.colors[0],
          radius: configEntry.radius,
          direction: -1
        });
      }
    };
    spawnStatic('sea_kelp', config.obstacles.sea_kelp);
    spawnStatic('sea_rock', config.obstacles.sea_rock);
    spawnStatic('coral', config.obstacles.coral);
    spawnStatic('anchor', config.obstacles.anchor);
  }

  private addScore(amount: number) {
    this.state.score += amount;
    this.onScoreUpdate(this.state.score);
  }

  private recalculateStorage() {
    const currentStorage = this.state.inventory.reduce((sum, item) => sum + item.weight, 0);
    const newStorage = currentStorage + (this.state.buoyancyOffset || 0);
    this.state.currentStorage = newStorage;
    const maxStorage = this.state.upgrades.storageCapacity || 50;
    if (newStorage > maxStorage) {
      this.isSinking = true;
    }
  }

  private getRodStats() {
    if (this.state.upgrades.rodLevel === 2) {
      return { swingMultiplier: 0.025 / 0.022, throwMultiplier: 11 / 9, catchMultiplier: 1.2, coralProtection: 0.3, kelpSnagMs: 800, rodWidth: 4, lineWidth: 2 };
    }
    if (this.state.upgrades.rodLevel >= 3) {
      return { swingMultiplier: 0.029 / 0.022, throwMultiplier: 13 / 9, catchMultiplier: 1.4, coralProtection: 0.6, kelpSnagMs: 400, rodWidth: 6, lineWidth: 3 };
    }
    return { swingMultiplier: 0.85, throwMultiplier: 0.85, catchMultiplier: 1, coralProtection: 0, kelpSnagMs: 800, rodWidth: 2, lineWidth: 1.2 };
  }

  private updateHook(deltaTime: number) {
    const hook = this.state.hook;
    const rod = this.getRodStats();
    if (this.state.hookBrokenMs > 0) {
      hook.state = 'idle';
      hook.length = 0;
      hook.x = CANVAS_WIDTH / 2;
      hook.y = SEA_LEVEL_Y;
      return;
    }
    const baseSpeed = 0.45 * rod.throwMultiplier * (this.state.hookSpeedBoostMs > 0 ? 1.3 : 1);
    const catchMultiplier = rod.catchMultiplier;
    const maxDepth = CANVAS_HEIGHT - (this.state.weather === 'stormy' ? 10 : 0);

    if (hook.state === 'idle') {
      const minAngle = 0; 
      const maxAngle = Math.PI;
      
      const oscillationSpeed = 0.0015 * rod.swingMultiplier;
      if (hook.direction === 1) {
        hook.angle += oscillationSpeed * deltaTime;
        if (hook.angle >= maxAngle) {
          hook.angle = maxAngle;
          hook.direction = -1;
        }
      } else {
        hook.angle -= oscillationSpeed * deltaTime;
        if (hook.angle <= minAngle) {
          hook.angle = minAngle;
          hook.direction = 1;
        }
      }
      
      hook.x = CANVAS_WIDTH / 2;
      hook.y = SEA_LEVEL_Y;
      hook.length = 0;
    } 
    else if (hook.state === 'shooting') {
      hook.length += baseSpeed * 1.5 * deltaTime;
      hook.x = CANVAS_WIDTH / 2 + Math.cos(hook.angle) * hook.length;
      hook.y = SEA_LEVEL_Y + Math.sin(hook.angle) * hook.length;

      if (hook.x < 0 || hook.x > CANVAS_WIDTH || hook.y > maxDepth) {
        hook.state = 'retracting';
      }

      for (let i = 0; i < this.state.fishes.length; i++) {
        const fish = this.state.fishes[i];

        if (fish.type === 'galaxy' && this.isGalaxyHidden(fish)) {
          continue;
        }

        if (fish.type === 'coral') {
          const coralWidth = fish.radius * 4.8;
          const coralHeight = fish.radius * 3.4;
          const dx = Math.abs(hook.x - fish.x);
          const dy = hook.y - (fish.y - coralHeight / 2);
          if (dx < coralWidth * 0.4 && Math.abs(dy) < coralHeight * 0.35) {
            hook.state = 'retracting';
            hook.caughtEntity = null;
            if (rod.coralProtection === 0 || Math.random() > rod.coralProtection) {
              this.updateHookAttempts(-1);
            }
            break;
          }
          continue;
        }

        const dist = Math.hypot(hook.x - fish.x, hook.y - fish.y);
        const catchRadius = fish.radius * catchMultiplier;

        if (fish.type === 'sea_kelp' && dist < fish.radius) {
          hook.state = 'retracting';
          hook.caughtEntity = null;
          this.state.anchorSnagMs = rod.kelpSnagMs;
          this.lastSnagType = 'kelp';
          break;
        }

        if (fish.type === 'sea_rock' && dist < fish.radius) {
          hook.state = 'retracting';
          hook.caughtEntity = null;
          this.state.anchorSnagMs = 200;
          this.lastSnagType = 'rock';
          break;
        }

        if (fish.type === 'anchor' && dist < fish.radius) {
          hook.state = 'retracting';
          hook.caughtEntity = null;
          this.state.anchorSnagMs = 2000;
          this.lastSnagType = 'anchor';
          this.state.timeRemaining = Math.max(0, this.state.timeRemaining - 2);
          break;
        }

        if (fish.type === 'sunken_boat' && dist < fish.radius) {
          hook.state = 'snagged';
          hook.caughtEntity = fish;
          break;
        }

        if (fish.type === 'whirlpool' && dist < fish.radius) {
          hook.state = 'whirlpool';
          hook.caughtEntity = null;
          this.whirlpoolCenter = { x: fish.x, y: fish.y };
          this.whirlpoolAngle = Math.atan2(hook.y - fish.y, hook.x - fish.x);
          this.whirlpoolRadius = Math.max(20, dist);
          this.whirlpoolTurns = 0;
          if (this.state.upgrades.boatLevel < 3) {
            this.state.weightDisplayOffset = 3;
            this.state.weightDisplayOffsetMs = 2000;
          }
          break;
        }

        if (fish.type === 'shark_skeleton' && dist < fish.radius) {
          hook.state = 'retracting';
          hook.caughtEntity = null;
          this.addScore(-10);
          this.updateHookAttempts(-1);
          this.state.fishPanicMs = 5000;
          break;
        }

        if (fish.type === 'env_bubbles' && dist < fish.radius) {
          hook.state = 'retracting';
          hook.caughtEntity = null;
          this.applyBubbleEffect();
          this.state.fishes.splice(i, 1);
          break;
        }

        if (dist < catchRadius) {
          hook.state = 'retracting';
          hook.caughtEntity = fish;
          this.state.fishes.splice(i, 1);
          break;
        }
      }
    } 
    else if (hook.state === 'whirlpool' && this.whirlpoolCenter) {
      const center = this.whirlpoolCenter;
      this.whirlpoolAngle += 0.02 * deltaTime;
      if (this.whirlpoolAngle >= Math.PI * 2) {
        this.whirlpoolAngle -= Math.PI * 2;
        this.whirlpoolTurns += 1;
      }

      hook.x = center.x + Math.cos(this.whirlpoolAngle) * this.whirlpoolRadius;
      hook.y = center.y + Math.sin(this.whirlpoolAngle) * this.whirlpoolRadius;

      if (this.whirlpoolTurns >= 3) {
        const outcome = Math.random();
        if (outcome < 0.4) {
          const angle = Math.atan2(hook.y - SEA_LEVEL_Y, hook.x - CANVAS_WIDTH / 2);
          hook.angle = angle;
          hook.length = Math.hypot(hook.x - CANVAS_WIDTH / 2, hook.y - SEA_LEVEL_Y);
          hook.state = 'shooting';
        } else if (outcome < 0.75) {
          const angle = Math.atan2(SEA_LEVEL_Y - SEA_LEVEL_Y, hook.x - CANVAS_WIDTH / 2);
          hook.angle = angle;
          hook.length = Math.hypot(hook.x - CANVAS_WIDTH / 2, SEA_LEVEL_Y - SEA_LEVEL_Y);
          hook.y = SEA_LEVEL_Y;
          hook.state = 'retracting';
          this.state.timeRemaining = Math.max(0, this.state.timeRemaining - 3);
        } else {
          hook.state = 'idle';
          hook.length = 0;
          hook.x = CANVAS_WIDTH / 2;
          hook.y = SEA_LEVEL_Y;
        }
        this.whirlpoolCenter = null;
      }
    }
    else if (hook.state === 'snagged') {
      if (hook.caughtEntity) {
        hook.x = hook.caughtEntity.x;
        hook.y = hook.caughtEntity.y;
        
        // Break hook if entity goes off-screen or is removed
        if (hook.x < -hook.caughtEntity.radius || !this.state.fishes.includes(hook.caughtEntity)) {
           this.triggerHookBreak();
        }
      } else {
        this.triggerHookBreak();
      }
    }
    else if (hook.state === 'retracting') {
      let vBase = baseSpeed * 1.5;
      if (this.state.anchorSnagMs > 0 && this.lastSnagType === 'anchor') {
        vBase *= 0.3;
      }
      let weightMult = hook.caughtEntity ? hook.caughtEntity.weight : 1.0;
      
      // Upgrade application: Rod Level reduces weight penalty
      const weightBonus = (this.state.upgrades.rodLevel - 1) * 0.2;
      const weight = Math.max(1, weightMult - weightBonus);
      
      let retractSpeed = (vBase / weight) * deltaTime;

      hook.length -= retractSpeed;

      if (hook.length <= 0) {
        hook.length = 0;
        hook.state = 'idle';
        
        if (hook.caughtEntity) {
          const caught = hook.caughtEntity;
          if (caught.type === 'sunken_boat') {
            this.handleSunkenBoat(caught);
          } else if (caught.type === 'treasure_chest') {
            this.handleTreasureChest(caught);
          } else if (caught.type === 'shell') {
            this.handleShell(caught);
          } else {
            this.handleStandardCatch(caught);
          }
          hook.caughtEntity = null;
        }
      } else {
        hook.x = CANVAS_WIDTH / 2 + Math.cos(hook.angle) * hook.length;
        hook.y = SEA_LEVEL_Y + Math.sin(hook.angle) * hook.length;
      }
    }
  }

  private updateFishes(deltaTime: number) {
    const levelSpeedBonus = (this.state.island - 1) * 0.1;
    const travelSpeed = 2 + levelSpeedBonus;
    const panicMultiplier = this.state.fishPanicMs > 0 ? 2 : 1;
    const time = performance.now() * 0.002;
    const timeMs = performance.now();
    const weatherSpeedBonus = this.state.weather === 'stormy' ? 0.5 : 0;
    const weatherSpeedMultiplier = this.state.weather === 'rainy' ? 1.2 : 1;
    const baseSpeed = (speed: number) => (speed + travelSpeed + weatherSpeedBonus) * weatherSpeedMultiplier;

    for (let i = this.state.fishes.length - 1; i >= 0; i--) {
      const fish = this.state.fishes[i];

      // Remove fish that would overlap with the arrival island
      if (this.isArriving) {
        const islandWidth = CANVAS_WIDTH * 0.6;
        const islandX = CANVAS_WIDTH - (Math.min(1, this.arrivalProgress) * islandWidth);
        
        // More aggressive culling for land overlap
        // The land curve starts roughly at islandX - 100 at the bottom and curves up
        // We define a safe zone to the left of the land mass
        const landLeftEdge = islandX - 120; // Extra buffer
        
        if (fish.x > landLeftEdge) {
           this.state.fishes.splice(i, 1);
           continue;
        }
      }

      if (this.whirlpoolCenter && this.state.hook.state === 'whirlpool' && fish.value < 100) {
        const dist = Math.hypot(fish.x - this.whirlpoolCenter.x, fish.y - this.whirlpoolCenter.y);
        if (dist < 80) {
          this.state.fishes.splice(i, 1);
          continue;
        }
      }

      if (fish.type === 'env_bubbles') {
        fish.y -= (fish.speed + 1) * (deltaTime / 16);
        fish.x += Math.sin(time + (fish.animationOffset || 0)) * 0.3;
        if (fish.y < SEA_LEVEL_Y - 20) {
          fish.y = CANVAS_HEIGHT - 20;
          fish.x = 20 + Math.random() * (CANVAS_WIDTH - 40);
          fish.startY = fish.y;
        }
      } else if (fish.type === 'bubble') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        const waveY = Math.sin(fish.x * 0.04) * 30;
        fish.y = (fish.startY || fish.y) + waveY;
      } else if (fish.type === 'candy') {
        const spiral = time * 1.4 + (fish.animationOffset || 0);
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.x += Math.cos(spiral) * 1.5;
        fish.y = (fish.startY || fish.y) + Math.sin(spiral) * 20;
      } else if (fish.type === 'sakura') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        const deviation = Math.sin(time + (fish.animationOffset || 0)) * 15;
        fish.y = (fish.startY || fish.y) + deviation;
      } else if (fish.type === 'leaf') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        const drift = Math.sin(time + (fish.animationOffset || 0)) * 18;
        fish.y = (fish.startY || fish.y) + drift;
      } else if (fish.type === 'crystal') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        const slalom = Math.sin(time * 2 + (fish.animationOffset || 0)) * 45;
        fish.y = (fish.startY || fish.y) + slalom;
      } else if (fish.type === 'galaxy') {
        const cycle = 1200 + ((fish.animationOffset || 0) % 800);
        const phase = (timeMs + (fish.animationOffset || 0) * 1000) % cycle;
        const jumpSeed = Math.floor((timeMs + (fish.animationOffset || 0) * 1000) / cycle);
        const jumpDir = Math.sin(jumpSeed * 12.9898 + (fish.animationOffset || 0)) < 0 ? -1 : 1;
        const jumpOffset = (0.5 + Math.sin(jumpSeed * 9.1 + (fish.animationOffset || 0)) * 0.5) * 120;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.y = (fish.startY || fish.y) + jumpDir * jumpOffset;
        if (phase < 100) {
          fish.y += 0;
        }
      } else if (fish.type === 'mushroom') {
        const cycle = 1000;
        const phase = (timeMs + (fish.animationOffset || 0) * 1000) % cycle;
        const jumpSeed = Math.floor((timeMs + (fish.animationOffset || 0) * 1000) / cycle);
        const jumpDir = Math.sin(jumpSeed * 8.37 + (fish.animationOffset || 0)) < 0 ? -1 : 1;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        if (phase < 800) {
          fish.y = (fish.startY || fish.y);
        } else {
          const progress = (phase - 800) / 200;
          fish.y = (fish.startY || fish.y) + jumpDir * 30 * Math.sin(progress * Math.PI);
        }
      } else if (fish.type === 'king') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.y = (fish.startY || fish.y) + Math.sin(time + (fish.animationOffset || 0)) * 5;
        if (fish.x < CANVAS_WIDTH && fish.x > 0 && this.state.fishPanicMs < 500) {
          this.state.fishPanicMs = 3000;
        }
      } else if (fish.type === 'shark_skeleton') {
        fish.x -= (baseSpeed(fish.speed) * 0.4) * (deltaTime / 16);
        fish.y = (fish.startY || fish.y) + Math.sin(time + (fish.animationOffset || 0)) * 8;
      } else if (fish.type === 'whirlpool') {
        fish.x -= (baseSpeed(fish.speed) * 0.4) * (deltaTime / 16);
        fish.y = (fish.startY || fish.y) + Math.sin(time + (fish.animationOffset || 0)) * 10;
      } else if (fish.type === 'anchor') {
        fish.x -= (baseSpeed(fish.speed) * 0.4) * (deltaTime / 16);
        fish.x += Math.sin(time + (fish.animationOffset || 0)) * 2;
      } else if (fish.type === 'sea_kelp') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16);
        fish.y = (fish.startY || fish.y) + Math.sin(time + (fish.animationOffset || 0)) * 3;
      } else if (fish.type === 'coral') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16);
      } else {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
      }

      if (this.state.fishPanicMs > 0 && fish.value < 100 && fish.type !== 'env_bubbles') {
        fish.y += Math.sin(time * 8 + (fish.animationOffset || 0)) * 3;
      }

      if (fish.x < -120) {
        this.state.fishes.splice(i, 1);
      }
    }
  }

  private spawnFishes(deltaTime: number) {
    // Stop spawning if arriving
    if (this.isArriving) return;

    const islandConfig = ISLAND_CONFIG[this.state.island as keyof typeof ISLAND_CONFIG];
    const hue = (this.state.island - 1) * 30;
    if (!islandConfig) return;
    const weatherSpawnMultiplier = this.state.weather === 'cloudy' ? 1.1 : this.state.weather === 'magic' ? 1.25 : 1;
    // Reduced spawn frequency significantly
    const spawnChance = (0.015 + this.state.island * 0.005) * weatherSpawnMultiplier;
    
    if (Math.random() < spawnChance) {
      const pool: Array<{ type: FishClass; weight: number }> = [];
      for (const type of islandConfig.fish) {
        pool.push({ type, weight: type === 'king' ? (this.state.island >= 5 ? 0.12 : 0.05) : 1 });
      }
      for (const type of islandConfig.dynamic) {
        const weight = type === 'whirlpool' ? (this.state.island === 2 ? 0.2 : this.state.island === 3 ? 0.35 : 0.5) : 0.25;
        pool.push({ type, weight });
      }
      pool.push({ type: 'treasure_chest', weight: 0.4 });
      pool.push({ type: 'sunken_boat', weight: 0.3 });
      pool.push({ type: 'shell', weight: 0.7 });

      const total = pool.reduce((sum, item) => sum + item.weight, 0);
      
      let fishClass: FishClass | null = null;
      let attempts = 0;
      
      // Retry loop to prevent consecutive duplicates
      do {
          let roll = Math.random() * total;
          fishClass = pool[0].type;
          for (const entry of pool) {
            roll -= entry.weight;
            if (roll <= 0) {
              fishClass = entry.type;
              break;
            }
          }
          attempts++;
      } while (fishClass === this.lastSpawnedType && attempts < 5);
      
      this.lastSpawnedType = fishClass;

      const assetConfig = OBJECT_MATRIX[fishClass];
      const name = assetConfig.names[Math.floor(Math.random() * assetConfig.names.length)];
      const color = assetConfig.colors[Math.floor(Math.random() * assetConfig.colors.length)];
      
      const speed = 1.0 * assetConfig.speedMultiplier;
      
      // Spawn Y position logic
      let y;
      if (fishClass === 'coral' || fishClass === 'sunken_boat' || fishClass === 'anchor' || fishClass === 'treasure_chest' || fishClass === 'shell' || fishClass === 'sea_kelp') {
        y = CANVAS_HEIGHT - 60 + (Math.random() * 20);
      } else if (fishClass === 'sea_rock') {
        y = Math.random() < 0.5 ? CANVAS_HEIGHT - 70 + Math.random() * 10 : SEA_LEVEL_Y + 100 + Math.random() * 200;
      } else if (fishClass === 'whirlpool') {
        y = SEA_LEVEL_Y + 80 + Math.random() * 200;
      } else {
        y = SEA_LEVEL_Y + 50 + Math.random() * (CANVAS_HEIGHT - SEA_LEVEL_Y - 150);
      }
      
      this.state.fishes.push({
        id: Math.random(),
        type: fishClass,
        name,
        x: CANVAS_WIDTH + 100,
        y,
        startY: y,
        animationOffset: Math.random() * 1000,
        speed,
        value: assetConfig.value,
        weight: assetConfig.weightMultiplier,
        color,
        radius: assetConfig.radius,
        direction: -1
      });
    }
  }

  private ensureAmbientBubbles() {
    const bubbleCount = this.state.fishes.filter(fish => fish.type === 'env_bubbles').length;
    if (bubbleCount >= 2) return;
    const needed = 2 - bubbleCount;
    for (let i = 0; i < needed; i++) {
      const config = OBJECT_MATRIX.env_bubbles;
      const y = CANVAS_HEIGHT - 20;
      const x = 20 + Math.random() * (CANVAS_WIDTH - 40);
      this.state.fishes.push({
        id: Math.random(),
        type: 'env_bubbles',
        name: config.names[0],
        x,
        y,
        startY: y,
        animationOffset: Math.random() * 1000,
        speed: config.speedMultiplier,
        value: config.value,
        weight: config.weightMultiplier,
        color: config.colors[0],
        radius: config.radius,
        direction: -1
      });
    }
  }

  private updateHookAttempts(delta: number) {
    const next = Math.max(0, Math.min(this.state.maxHookAttempts, this.state.hookAttempts + delta));
    this.state.hookAttempts = next;
    if (delta < 0) {
      this.triggerHookBreak();
    }
    if (next === 0 && !this.isArriving && !this.isSinking) {
      this.state.isPlaying = false;
      this.onGameOver(this.state.score, this.state.island, "Olta kullanılamaz! Tüm kancalar kırıldı.");
    }
  }

  private triggerHookBreak() {
    this.state.hookBrokenMs = this.hookBreakDuration;
    this.state.hook.state = 'idle';
    this.state.hook.length = 0;
    this.state.hook.x = CANVAS_WIDTH / 2;
    this.state.hook.y = SEA_LEVEL_Y;
  }

  private applyBubbleEffect() {
    this.state.hookSpeedBoostMs = 5000;
    this.state.buoyancyOffset = -3;
    this.state.buoyancyOffsetMs = 5000;
    this.recalculateStorage();
  }

  private applyValueMultiplier(multiplier: number) {
    this.state.valueMultiplier *= multiplier;
    this.state.inventory = this.state.inventory.map(item => ({
      ...item,
      value: Math.round(item.value * multiplier)
    }));
  }

  private addInventoryItem(item: { id: string; type: FishClass; name: string; value: number; weight: number }) {
    this.state.inventory.push(item);
    this.recalculateStorage();
  }

  private handleStandardCatch(caught: Entity) {
    let value = caught.value;
    if (caught.type === 'crystal') {
      const roll = Math.random();
      if (roll < 0.4) value += 50;
      else if (roll < 0.6) value -= 30;
    }

    const adjustedValue = Math.round(value * this.state.valueMultiplier);
    this.addInventoryItem({
      id: Math.random().toString(),
      type: caught.type,
      name: caught.name,
      value: adjustedValue,
      weight: caught.weight
    });

    if (!this.isSinking) {
      this.onFishCaught(caught);
    }

    if (caught.type === 'leaf' && this.state.leafBonusStacks < 3) {
      this.state.leafBonusStacks += 1;
      this.applyValueMultiplier(1.1);
    }

    if (caught.type === 'candy' && this.state.candyBonusStacks < 3) {
      this.state.candyBonusStacks += 1;
      this.state.inventory = this.state.inventory.map(item => ({
        ...item,
        weight: Math.max(0, item.weight - 1)
      }));
      this.recalculateStorage();
    }

    if (caught.type === 'king') {
      this.applyValueMultiplier(1.2);
    }

    if (caught.type === 'galaxy') {
      const roll = Math.random();
      if (roll < 0.3) this.addScore(100);
      else if (roll < 0.6) this.state.fuelCost = Math.max(10, Math.floor(this.state.fuelCost * 0.9));
    }

    if (caught.type === 'mushroom' && this.state.inventory.length > 0) {
      const idx = Math.floor(Math.random() * this.state.inventory.length);
      const item = this.state.inventory[idx];
      this.state.inventory[idx] = { ...item, value: item.value * 2 };
    }
  }

  private handleTreasureChest(caught: Entity) {
    this.addInventoryItem({
      id: Math.random().toString(),
      type: 'treasure_chest',
      name: caught.name,
      value: 0,
      weight: 8
    });

    this.addScore(80 + Math.floor(Math.random() * 121));

    if (Math.random() < 0.6) {
      const bonusType: FishClass = Math.random() < 0.5 ? 'crystal' : 'galaxy';
      const config = OBJECT_MATRIX[bonusType];
      let value = config.value;
      if (bonusType === 'crystal') {
        const roll = Math.random();
        if (roll < 0.4) value += 50;
        else if (roll < 0.6) value -= 30;
      }
      this.addInventoryItem({
        id: Math.random().toString(),
        type: bonusType,
        name: config.names[0],
        value: Math.round(value * this.state.valueMultiplier),
        weight: config.weightMultiplier
      });
    }

    if (Math.random() < 0.2) {
      this.state.hookAttempts = this.state.maxHookAttempts;
    }

    if (!this.isSinking) {
      this.onFishCaught(caught);
    }
  }

  private handleSunkenBoat(caught: Entity) {
    this.addInventoryItem({
      id: Math.random().toString(),
      type: 'sunken_boat',
      name: caught.name,
      value: 0,
      weight: 5
    });

    const roll = Math.random();
    if (roll < 0.35) {
      const fishCount = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < fishCount; i++) {
        const type: FishClass = Math.random() < 0.5 ? 'bubble' : 'sakura';
        const config = OBJECT_MATRIX[type];
        this.addInventoryItem({
          id: Math.random().toString(),
          type,
          name: config.names[0],
          value: Math.round(config.value * this.state.valueMultiplier),
          weight: config.weightMultiplier
        });
      }
    } else if (roll < 0.6) {
      this.addScore(50 + Math.floor(Math.random() * 71));
      const type: FishClass = Math.random() < 0.5 ? 'tide' : 'candy';
      const config = OBJECT_MATRIX[type];
      this.addInventoryItem({
        id: Math.random().toString(),
        type,
        name: config.names[0],
        value: Math.round(config.value * this.state.valueMultiplier),
        weight: config.weightMultiplier
      });
    } else if (roll < 0.8) {
    } else if (roll < 0.95) {
      const type: FishClass = Math.random() < 0.5 ? 'moon' : 'lava';
      const config = OBJECT_MATRIX[type];
      this.addInventoryItem({
        id: Math.random().toString(),
        type,
        name: config.names[0],
        value: Math.round(config.value * this.state.valueMultiplier),
        weight: config.weightMultiplier
      });
    } else {
      this.addScore(-10);
    }

    this.updateHookAttempts(-1);
    if (!this.isSinking) {
      this.onFishCaught(caught);
    }
  }

  private handleShell(caught: Entity) {
    this.addInventoryItem({
      id: Math.random().toString(),
      type: 'shell',
      name: caught.name,
      value: 0,
      weight: 1
    });

    this.addScore(20);

    if (Math.random() < 0.25) {
      const type: FishClass = Math.random() < 0.5 ? 'bubble' : 'sakura';
      const config = OBJECT_MATRIX[type];
      this.addInventoryItem({
        id: Math.random().toString(),
        type,
        name: config.names[0],
        value: Math.round(config.value * this.state.valueMultiplier),
        weight: config.weightMultiplier
      });
    }

    if (Math.random() < 0.1) {
      this.updateHookAttempts(1);
    }

    if (!this.isSinking) {
      this.onFishCaught(caught);
    }
  }

  private checkIslandProgress() {
    // Moved logic to update isArriving
  }

  private darkenColor(hex: string, amount: number) {
    const value = hex.replace('#', '');
    const num = parseInt(value, 16);
    const r = Math.max(0, ((num >> 16) & 255) - amount);
    const g = Math.max(0, ((num >> 8) & 255) - amount);
    const b = Math.max(0, (num & 255) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  private drawWeatherEffects() {
    if (this.state.weather === 'cloudy') {
      this.ctx.fillStyle = 'rgba(0,0,0,0.08)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (this.state.weather === 'rainy' || this.state.weather === 'stormy') {
      this.ctx.fillStyle = this.state.weather === 'stormy' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.12)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.ctx.strokeStyle = 'rgba(180,220,255,0.6)';
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * CANVAS_WIDTH;
        const y = Math.random() * CANVAS_HEIGHT;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 4, y + 10);
        this.ctx.stroke();
      }
    } else if (this.state.weather === 'magic') {
      this.ctx.fillStyle = 'rgba(123,31,162,0.12)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const islandConfig = ISLAND_CONFIG[this.state.island as keyof typeof ISLAND_CONFIG];
    const hue = (this.state.island - 1) * 30;
    const skyTop = islandConfig?.skyColor ?? '#87CEEB';
    const skyBottom = this.darkenColor(skyTop, 20);
    const seaTop = islandConfig?.seaColor ?? '#29B6F6';
    const seaBottom = this.darkenColor(seaTop, 40);

    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, SEA_LEVEL_Y);
    skyGradient.addColorStop(0, skyTop);
    skyGradient.addColorStop(1, skyBottom);
    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, SEA_LEVEL_Y);

    if (this.state.weather === 'sunny' || this.state.weather === 'cloudy') {
      this.drawSun(CANVAS_WIDTH - 60, 50);
    }
    if (this.state.weather !== 'magic') {
      this.drawCloud(60, 40, 40);
      this.drawCloud(150, 60, 30);
      this.drawCloud(300, 45, 35);
    }

    const seaGradient = this.ctx.createLinearGradient(0, SEA_LEVEL_Y, 0, CANVAS_HEIGHT);
    seaGradient.addColorStop(0, seaTop);
    seaGradient.addColorStop(1, seaBottom);
    this.ctx.fillStyle = seaGradient;
    
    // Wave surface effect
    this.ctx.beginPath();
    const time = performance.now() * 0.002;
    this.ctx.moveTo(0, SEA_LEVEL_Y);
    for (let x = 0; x <= CANVAS_WIDTH; x += 10) {
      const y = SEA_LEVEL_Y + Math.sin(x * 0.02 + time) * 5;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.lineTo(0, CANVAS_HEIGHT);
    this.ctx.closePath();
    this.ctx.fill();

    this.drawWeatherEffects();
    
    // Bottom Sand
    this.ctx.fillStyle = `hsl(40, 100%, 80%)`;
    this.ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);

    // Draw Arrival Island
    if (this.isArriving) {
      const progress = Math.min(1, this.arrivalProgress);
      // Island enters from right to left
      // Start position (offscreen right) to end position (filling ~40% of screen)
      const islandWidth = CANVAS_WIDTH * 0.6;
      const islandX = CANVAS_WIDTH - (progress * islandWidth);
      
      // Gradient for sand/beach
      const sandGradient = this.ctx.createLinearGradient(islandX, SEA_LEVEL_Y, CANVAS_WIDTH, CANVAS_HEIGHT);
      sandGradient.addColorStop(0, '#FFE082'); // Wet sand
      sandGradient.addColorStop(0.4, '#FFD54F'); // Dry sand
      sandGradient.addColorStop(1, '#FFCA28'); // Deep sand

      this.ctx.fillStyle = sandGradient;
      this.ctx.beginPath();
      
      // Logarithmic/Exponential curve for coastline
      // Starting from bottom right corner
      this.ctx.moveTo(CANVAS_WIDTH, CANVAS_HEIGHT);
      this.ctx.lineTo(CANVAS_WIDTH, SEA_LEVEL_Y - 50); // Top of hill/cliff
      
      // Coastline curve dipping into water
      // We simulate a natural slope: steep at top, flattening out under water
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // x goes from islandX to CANVAS_WIDTH
        // y follows a curve
        const x = islandX + (CANVAS_WIDTH - islandX) * t;
        
        // Log-like curve: y drops rapidly then flattens
        // Let's use an exponential decay or simple power function for the slope
        // At t=0 (waterline start), y should be deep underwater or at sea level?
        // Let's make it slope UP from underwater to land
        
        // Alternative: Draw from deep water up to surface
        // Start deep underwater at islandX
        // Curve up to surface level and then form a hill
        
        // Let's try a cubic bezier for a nice slope
      }
      
      // Simpler approach with Bezier for premium feel
      this.ctx.moveTo(CANVAS_WIDTH, CANVAS_HEIGHT); // Bottom right
      this.ctx.lineTo(islandX - 100, CANVAS_HEIGHT); // Bottom left (underwater base)
      
      // Curve up to sea level
      // Control points to make it "logarithmic" - steep rise then flatten
      this.ctx.bezierCurveTo(
        islandX - 50, CANVAS_HEIGHT, // CP1
        islandX, SEA_LEVEL_Y + 100,  // CP2
        islandX + 20, SEA_LEVEL_Y    // End point at surface
      );
      
      // Continue up to form a hill/dune
      this.ctx.bezierCurveTo(
        islandX + 40, SEA_LEVEL_Y - 30, // CP1
        CANVAS_WIDTH - 50, SEA_LEVEL_Y - 60, // CP2
        CANVAS_WIDTH, SEA_LEVEL_Y - 50 // End point offscreen
      );
      
      this.ctx.closePath();
      this.ctx.fill();
      
      // Add some "vegetation" or detail on top
      this.ctx.fillStyle = `hsl(${100 + hue}, 60%, 45%)`; // Greenish based on island
      this.ctx.beginPath();
      this.ctx.moveTo(islandX + 20, SEA_LEVEL_Y);
      this.ctx.quadraticCurveTo(islandX + 60, SEA_LEVEL_Y - 40, CANVAS_WIDTH, SEA_LEVEL_Y - 20);
      this.ctx.lineTo(CANVAS_WIDTH, SEA_LEVEL_Y);
      this.ctx.closePath();
      this.ctx.fill();

      // Arrival Text
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 32px Fredoka';
      this.ctx.textAlign = 'center';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'black';
      this.ctx.fillText('ADA GÖRÜNDÜ!', CANVAS_WIDTH / 2, SEA_LEVEL_Y + 150);
      this.ctx.shadowBlur = 0;
    }

    // Island Start Text
    if (this.state.timeRemaining > 57) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 48px Fredoka';
      this.ctx.textAlign = 'center';
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = 'black';
      this.ctx.fillText(`${this.state.island}. ADA`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.shadowBlur = 0;
    }

    // 3. Draw Boat & Fisherman
    this.ctx.save();
    if (this.isArriving) {
      this.ctx.translate(this.arrivalProgress * 100, 0);
    } else if (this.isSinking) {
      // Sinking animation: move down and rotate slightly
      this.ctx.translate(0, this.sinkProgress * 200);
      this.ctx.rotate(this.sinkProgress * 0.2); // Tilt
    }
    
    // Detailed Boat
    const boatSprite = this.spriteManager.getImage('boat');
    if (boatSprite) {
      this.ctx.drawImage(boatSprite, CANVAS_WIDTH / 2 - 60, SEA_LEVEL_Y - 20, 120, 60);
    } else {
      this.ctx.fillStyle = '#D4A373';
      this.ctx.strokeStyle = '#5c2d0c';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(CANVAS_WIDTH / 2 - 60, SEA_LEVEL_Y);
      this.ctx.bezierCurveTo(CANVAS_WIDTH / 2 - 60, SEA_LEVEL_Y + 40, CANVAS_WIDTH / 2 + 60, SEA_LEVEL_Y + 40, CANVAS_WIDTH / 2 + 60, SEA_LEVEL_Y);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
    
    this.drawFisherman();
    this.drawFishingRod();

    // 5. Draw Hook Line
    const rod = this.getRodStats();
    if (this.state.hookBrokenMs > 0) {
      const progress = Math.min(1, Math.max(0, this.state.hookBrokenMs / this.hookBreakDuration));
      const startX = CANVAS_WIDTH / 2;
      const startY = SEA_LEVEL_Y - 40;
      const midX = startX + Math.cos(this.state.hook.angle) * 30;
      const midY = startY + Math.sin(this.state.hook.angle) * 30;
      this.ctx.strokeStyle = '#D64545';
      this.ctx.lineWidth = rod.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(midX, midY);
      this.ctx.stroke();
      this.ctx.fillStyle = `rgba(255,200,80,${0.6 + (1 - progress) * 0.4})`;
      this.ctx.beginPath();
      const radius = Math.max(0.1, 4 + (1 - progress) * 3);
      this.ctx.arc(midX, midY, radius, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = '#333333';
      this.ctx.lineWidth = rod.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 40);
      this.ctx.lineTo(this.state.hook.x, this.state.hook.y);
      this.ctx.stroke();
      this.drawHookHead(this.state.hook.x, this.state.hook.y, Math.max(1.5, rod.lineWidth));
    }

    if (this.state.hook.caughtEntity) {
      const entity = this.state.hook.caughtEntity;
      // For sunken boat, we don't want to snap it to hook position or rotate it
      if (entity.type === 'sunken_boat') {
        // Just ensure it's drawn, position is handled by update loop
        // We pass isCaught=false to prevent rotation
        this.drawEntity(entity.x, entity.y, entity.radius, entity.color, entity.type, false, entity);
      } else {
        entity.x = this.state.hook.x;
        entity.y = this.state.hook.y + 15;
        this.drawEntity(entity.x, entity.y, entity.radius, entity.color, entity.type, true, entity);
      }
    }
    
    this.ctx.restore();

    // 8. Draw Swimming Entities
    for (const fish of this.state.fishes) {
      // Skip drawing if it's the caught entity to avoid double drawing
      if (this.state.hook.caughtEntity && this.state.hook.caughtEntity.id === fish.id) continue;
      this.drawEntity(fish.x, fish.y, fish.radius, fish.color, fish.type, false, fish);
    }
  }

  private drawSun(x: number, y: number) {
    this.ctx.fillStyle = '#FFD700';
    this.ctx.strokeStyle = '#FFA500';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 25, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#333';
    this.ctx.beginPath();
    this.ctx.arc(x - 8, y - 5, 2, 0, Math.PI * 2);
    this.ctx.arc(x + 8, y - 5, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x, y + 5, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    this.ctx.stroke();
  }

  private drawCloud(x: number, y: number, r: number) {
    const safeRadius = Math.max(1, Math.abs(r));
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y, safeRadius, 0, Math.PI * 2);
    this.ctx.arc(x + safeRadius, y - safeRadius / 2, safeRadius * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x - safeRadius, y - safeRadius / 2, safeRadius * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawFisherman() {
    const x = CANVAS_WIDTH / 2;
    const y = SEA_LEVEL_Y - 40;
    
    // Body/Shirt (Premium Gradient)
    const shirtGrad = this.ctx.createLinearGradient(x - 15, y, x + 15, y + 25);
    shirtGrad.addColorStop(0, '#FF6B6B');
    shirtGrad.addColorStop(1, '#EE5253');
    this.ctx.fillStyle = shirtGrad;
    this.ctx.beginPath();
    this.ctx.roundRect(x - 15, y, 30, 25, 8);
    this.ctx.fill();
    this.ctx.strokeStyle = '#8B0000';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Head (Chibi style with shading)
    const headGrad = this.ctx.createRadialGradient(x + 5, y - 30, 5, x, y - 25, 25);
    headGrad.addColorStop(0, '#FFF5E6');
    headGrad.addColorStop(1, '#FFE0BD');
    this.ctx.fillStyle = headGrad;
    this.ctx.beginPath();
    this.ctx.arc(x, y - 25, 25, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Blushing cheeks
    this.ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(x - 12, y - 22, 5, 0, Math.PI * 2);
    this.ctx.arc(x + 12, y - 22, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Premium Kawaii Eyes (Bigger, more expressive)
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(x - 8, y - 25, 4.5, 0, Math.PI * 2);
    this.ctx.arc(x + 8, y - 25, 4.5, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Multi-layered eye shines
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath();
    this.ctx.arc(x - 9.5, y - 27.5, 2.5, 0, Math.PI * 2);
    this.ctx.arc(x + 6.5, y - 27.5, 2.5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x - 6.5, y - 23.5, 1.2, 0, Math.PI * 2);
    this.ctx.arc(x + 9.5, y - 23.5, 1.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Tiny Smile
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(x, y - 18, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    this.ctx.stroke();

    // Premium Straw Hat with Texture
    const hatGrad = this.ctx.createLinearGradient(x - 35, y - 55, x + 35, y - 30);
    hatGrad.addColorStop(0, '#F4D03F');
    hatGrad.addColorStop(1, '#D4AC0D');
    this.ctx.fillStyle = hatGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y - 42, 35, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#B7950B';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Hat Top
    this.ctx.beginPath();
    this.ctx.arc(x, y - 45, 18, Math.PI, 0);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Red Ribbon with shine
    this.ctx.fillStyle = '#C0392B';
    this.ctx.fillRect(x - 18, y - 47, 36, 6);
    this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
    this.ctx.fillRect(x - 18, y - 47, 36, 2);
  }

  private drawFishingRod() {
    const x = CANVAS_WIDTH / 2;
    const y = SEA_LEVEL_Y - 40;
    const rodLength = 40;
    const rod = this.getRodStats();
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(this.state.hook.angle - Math.PI / 2);
    
    // Premium Rod Gradient
    const rodGrad = this.ctx.createLinearGradient(0, 0, 0, rodLength);
    rodGrad.addColorStop(0, '#8B4513');
    rodGrad.addColorStop(1, '#A0522D');
    this.ctx.strokeStyle = rodGrad;
    
    this.ctx.lineWidth = rod.rodWidth;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, rodLength);
    this.ctx.stroke();
    
    // Reel detail
    this.ctx.fillStyle = '#333';
    this.ctx.beginPath();
    this.ctx.arc(0, 5, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  private drawHookHead(x: number, y: number, lineWidth: number) {
    this.ctx.strokeStyle = '#777';
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(x, y - 5, 8, 0, Math.PI * 0.8);
    this.ctx.stroke();
    
    // Bait detail
    this.ctx.fillStyle = '#FF6347';
    this.ctx.beginPath();
    this.ctx.arc(x + 5, y - 2, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawEntity(x: number, y: number, radius: number, color: string, type: FishClass, isCaught: boolean = false, entity?: Entity) {
    if (type === 'galaxy' && !isCaught && entity && this.isGalaxyHidden(entity)) {
      return;
    }
    const safeRadius = Math.max(1, Math.abs(radius));
    this.ctx.save();
    const time = performance.now() * 0.005;
    const wobble = isCaught ? 0 : Math.sin(time + x * 0.05) * 5;
    
    // Position handling
    // Static objects shouldn't wobble and should be pivoted at bottom
    const isStatic = type === 'coral' || type === 'sea_kelp' || type === 'sea_rock' || type === 'anchor' || type === 'shell' || type === 'treasure_chest' || type === 'sunken_boat';
    
    if (isStatic) {
        this.ctx.translate(x, y);
    } else {
        this.ctx.translate(x, y + wobble);
    }
    
    if (isCaught) this.ctx.rotate(Math.PI / 2);

    // Try to draw sprite if available
    const spriteKey = `fish_${type}`;
    const sprite = this.spriteManager.getImage(spriteKey);

    if (sprite) {
      // Draw sprite
      // Increase size multiplier for better visibility
      let width = safeRadius * 4.5; 
      let height = safeRadius * 4.5;
      let offsetX = -width/2;
      let offsetY = -height/2;

      // Custom dimensions for sprite drawing
      // Use natural aspect ratio to prevent flattening/distortion
      const ratio = sprite.naturalWidth / sprite.naturalHeight || 1;
      
      if (type === 'bubble') {
          // Target height: 72px (approx 2x original assumption)
          height = 72;
          width = height * ratio;
          
          offsetX = -width/2;
          offsetY = -height/2;
      } else if (type === 'sakura') {
          // Target height: 80px (approx 2x original assumption)
          height = 80;
          width = height * ratio;
          
          offsetX = -width/2;
          offsetY = -height/2;
          
          // Particle effect
          if (!isCaught && Math.random() < 0.05) {
             this.ctx.fillStyle = '#FFB7C5';
             this.ctx.beginPath();
             this.ctx.arc(-10 + Math.random()*20, -10 + Math.random()*20, 2, 0, Math.PI*2);
             this.ctx.fill();
          }

      } else if (type === 'zap' || type === 'candy' || type === 'moon' || type === 'lava' || type === 'crystal' || type === 'leaf' || type === 'tide' || type === 'mushroom' || type === 'king' || type === 'galaxy') {
          height = 80;
          if (type === 'king') height = 100;
          if (type === 'galaxy') height = 90;
          width = height * ratio;
          
          offsetX = -width/2;
          offsetY = -height/2;
      } else if (type === 'coral') {
          height = 104;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height; // Draw upwards from pivot
          
          const scaleTime = performance.now() * 0.002; 
          const scaleY = 1.0 + Math.sin(scaleTime) * 0.03;
          this.ctx.scale(1, scaleY);
      } else if (type === 'sea_kelp') {
          height = 100;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height;
          
          // Sway effect
          const sway = Math.sin(performance.now() * 0.002) * 0.05;
          this.ctx.rotate(sway);
      } else if (type === 'sea_rock') {
          height = 60;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height;
      } else if (type === 'treasure_chest') {
          height = 60;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height; // Pivot bottom
      } else if (type === 'whirlpool') {
          height = 110;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height/2; // Center pivot
          const spin = performance.now() * 0.004;
          const scaleY = 0.55 + Math.sin(spin) * 0.35;
          this.ctx.rotate(spin);
          this.ctx.scale(1, scaleY);
      } else if (type === 'sunken_boat') {
          height = 120;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height + 20; // Buried in sand
      } else if (type === 'shark_skeleton') {
          height = 60;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height/2;
      } else if (type === 'env_bubbles') {
          height = 30;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height/2;
      } else if (type === 'anchor') {
          height = 60;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height; // Pivot bottom
      } else if (type === 'shell') {
          height = 20;
          width = height * ratio;
          offsetX = -width/2;
          offsetY = -height; // Pivot bottom
      }

      if (type === 'candy' && !isCaught && Math.random() < 0.08) {
        const colors = ['#FFB3C6', '#FFD6A5', '#BDE0FE'];
        this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        this.ctx.beginPath();
        this.ctx.arc(-10 + Math.random() * 20, -10 + Math.random() * 20, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.drawImage(sprite, offsetX, offsetY, width, height);
    } else {
      // Fallback to procedural drawing
      this.drawProceduralEntity(safeRadius, color, type, time);
    }
    
    this.ctx.restore();
  }

  private isGalaxyHidden(fish: Entity) {
    const timeMs = performance.now();
    const cycle = 1200 + ((fish.animationOffset || 0) % 800);
    const phase = (timeMs + (fish.animationOffset || 0) * 1000) % cycle;
    return phase < 100;
  }

  private drawProceduralEntity(radius: number, color: string, type: FishClass, time: number) {
    // Dynamic Shadow based on depth
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = 'rgba(0,0,0,0.25)';

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2.5;

    const fishGrad = this.ctx.createRadialGradient(-radius * 0.6, -radius * 0.6, 0, 0, 0, radius * 2);
    fishGrad.addColorStop(0, 'rgba(255,255,255,0.5)');
    fishGrad.addColorStop(0.3, color);
    fishGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
    this.ctx.fillStyle = fishGrad;

    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, radius * 1.5, radius, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -radius);
    this.ctx.bezierCurveTo(radius * 0.5, -radius * 1.8, radius * 1.2, -radius * 1.5, radius, -radius * 0.5);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(radius * 1.2, 0);
    this.ctx.bezierCurveTo(radius * 2.2, -radius * 1.2, radius * 2.2, radius * 1.2, radius * 1.2, 0);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(-radius * 0.75, -radius * 0.2, 7.5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(-radius * 0.75, -radius * 0.2, 4.5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(-radius * 0.85, -radius * 0.35, 2.5, 0, Math.PI * 2);
    this.ctx.arc(-radius * 0.65, -radius * 0.1, 1.2, 0, Math.PI * 2);
    this.ctx.arc(-radius * 0.75, 0, 0.8, 0, Math.PI * 2);
    this.ctx.fill();

    const blushGrad = this.ctx.createRadialGradient(-radius * 0.4, 0, 0, -radius * 0.4, 0, 6);
    blushGrad.addColorStop(0, 'rgba(255, 100, 150, 0.5)');
    blushGrad.addColorStop(1, 'rgba(255, 100, 150, 0)');
    this.ctx.fillStyle = blushGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(-radius * 0.4, 0, 6, 3, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        this.ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        this.ctx.lineTo(x, y);
        rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
  }
}
