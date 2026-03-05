import { type GameState, type Entity, type FishClass, OBJECT_MATRIX } from "./types";
import { SpriteManager, ASSETS } from "./SpriteManager";
import { GameEffects } from "./GameEffects";

export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;
export const SEA_LEVEL_Y = CANVAS_HEIGHT * 0.25;

export const LEVEL_CONFIG: Record<number, {
  duration: number;
  region: number;
  fuelCost: number;
  seaColor: string;
  skyColor: string;
  weatherWeights: Record<string, number>;
  fish: FishClass[];
  obstacles: { sea_kelp: number; sea_rock: number; coral: number; anchor: number };
  dynamic: FishClass[];
}> = {
  // REGION 1: Başlangıç Körfezi
  1: { duration: 40, region: 1, fuelCost: 0, seaColor: '#29B6F6', skyColor: '#87CEEB', weatherWeights: { sunny: 1 }, fish: ['bubble', 'sakura', 'zap'], obstacles: { sea_kelp: 1, sea_rock: 0, coral: 0, anchor: 0 }, dynamic: [] },
  2: { duration: 40, region: 1, fuelCost: 150, seaColor: '#29B6F6', skyColor: '#87CEEB', weatherWeights: { sunny: 1 }, fish: ['bubble', 'sakura', 'zap', 'candy'], obstacles: { sea_kelp: 1, sea_rock: 1, coral: 0, anchor: 0 }, dynamic: [] },
  3: { duration: 42, region: 1, fuelCost: 0, seaColor: '#29B6F6', skyColor: '#87CEEB', weatherWeights: { sunny: 1 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon'], obstacles: { sea_kelp: 2, sea_rock: 1, coral: 0, anchor: 0 }, dynamic: ['shell'] },
  4: { duration: 42, region: 1, fuelCost: 150, seaColor: '#29B6F6', skyColor: '#87CEEB', weatherWeights: { sunny: 0.8, cloudy: 0.2 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon'], obstacles: { sea_kelp: 2, sea_rock: 1, coral: 0, anchor: 0 }, dynamic: ['anchor', 'shell'] },

  // REGION 2: Mercan Adaları
  5: { duration: 44, region: 2, fuelCost: 0, seaColor: '#0288D1', skyColor: '#FFF9C4', weatherWeights: { sunny: 0.75, cloudy: 0.25 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide'], obstacles: { sea_kelp: 2, sea_rock: 1, coral: 1, anchor: 0 }, dynamic: ['shell'] },
  6: { duration: 44, region: 2, fuelCost: 0, seaColor: '#0288D1', skyColor: '#FFF9C4', weatherWeights: { sunny: 0.70, cloudy: 0.30 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide'], obstacles: { sea_kelp: 2, sea_rock: 2, coral: 1, anchor: 1 }, dynamic: ['sunken_boat', 'shell'] },
  7: { duration: 46, region: 2, fuelCost: 0, seaColor: '#0288D1', skyColor: '#FFF9C4', weatherWeights: { sunny: 0.65, cloudy: 0.35 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf'], obstacles: { sea_kelp: 3, sea_rock: 2, coral: 1, anchor: 1 }, dynamic: ['whirlpool', 'treasure_chest', 'shell'] },
  8: { duration: 46, region: 2, fuelCost: 280, seaColor: '#0288D1', skyColor: '#FFF9C4', weatherWeights: { sunny: 0.60, cloudy: 0.40 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf'], obstacles: { sea_kelp: 3, sea_rock: 2, coral: 1, anchor: 1 }, dynamic: ['whirlpool', 'treasure_chest', 'shell'] },

  // REGION 3: Derin Mavi
  9: { duration: 48, region: 3, fuelCost: 0, seaColor: '#01579B', skyColor: '#FF7043', weatherWeights: { sunny: 0.50, cloudy: 0.30, rainy: 0.20 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal'], obstacles: { sea_kelp: 3, sea_rock: 2, coral: 2, anchor: 1 }, dynamic: ['shark_skeleton', 'whirlpool', 'shell'] },
  10: { duration: 48, region: 3, fuelCost: 0, seaColor: '#01579B', skyColor: '#FF7043', weatherWeights: { sunny: 0.45, cloudy: 0.35, rainy: 0.20 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy'], obstacles: { sea_kelp: 4, sea_rock: 2, coral: 2, anchor: 1 }, dynamic: ['shark_skeleton', 'whirlpool', 'sunken_boat', 'shell'] },
  11: { duration: 50, region: 3, fuelCost: 0, seaColor: '#01579B', skyColor: '#FF7043', weatherWeights: { sunny: 0.40, cloudy: 0.35, rainy: 0.25 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom'], obstacles: { sea_kelp: 4, sea_rock: 3, coral: 2, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool', 'treasure_chest'] },
  12: { duration: 50, region: 3, fuelCost: 450, seaColor: '#01579B', skyColor: '#FF7043', weatherWeights: { sunny: 0.40, cloudy: 0.30, rainy: 0.30 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom'], obstacles: { sea_kelp: 4, sea_rock: 3, coral: 2, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool'] },

  // REGION 4: Fırtına Geçidi
  13: { duration: 52, region: 4, fuelCost: 0, seaColor: '#0D2137', skyColor: '#4A148C', weatherWeights: { cloudy: 0.25, stormy: 0.75 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 5, sea_rock: 3, coral: 2, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool', 'shell'] },
  14: { duration: 52, region: 4, fuelCost: 0, seaColor: '#0D2137', skyColor: '#4A148C', weatherWeights: { cloudy: 0.20, stormy: 0.80 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 5, sea_rock: 3, coral: 3, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool'] },
  15: { duration: 54, region: 4, fuelCost: 0, seaColor: '#0D2137', skyColor: '#4A148C', weatherWeights: { stormy: 0.85, cloudy: 0.15 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 5, sea_rock: 4, coral: 3, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool'] },
  16: { duration: 54, region: 4, fuelCost: 700, seaColor: '#0D2137', skyColor: '#4A148C', weatherWeights: { stormy: 0.90, cloudy: 0.10 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 6, sea_rock: 4, coral: 3, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool'] },

  // REGION 5: Efsane Adası
  17: { duration: 56, region: 5, fuelCost: 0, seaColor: '#080C2B', skyColor: '#080C2B', weatherWeights: { magic: 1 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 6, sea_rock: 4, coral: 3, anchor: 2 }, dynamic: ['shark_skeleton', 'whirlpool'] },
  18: { duration: 58, region: 5, fuelCost: 0, seaColor: '#080C2B', skyColor: '#080C2B', weatherWeights: { magic: 1 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 7, sea_rock: 4, coral: 3, anchor: 3 }, dynamic: ['shark_skeleton', 'whirlpool'] },
  19: { duration: 60, region: 5, fuelCost: 0, seaColor: '#080C2B', skyColor: '#080C2B', weatherWeights: { magic: 1 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 7, sea_rock: 5, coral: 4, anchor: 3 }, dynamic: ['shark_skeleton', 'whirlpool'] },
  20: { duration: 65, region: 5, fuelCost: 0, seaColor: '#080C2B', skyColor: '#080C2B', weatherWeights: { magic: 1 }, fish: ['bubble', 'sakura', 'zap', 'candy', 'moon', 'lava', 'tide', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'], obstacles: { sea_kelp: 8, sea_rock: 5, coral: 4, anchor: 3 }, dynamic: ['shark_skeleton', 'whirlpool'] },
};

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private lastFrameTime: number = 0;
  private onGameOver: (score: number, level: number, reason?: string) => void;
  private onScoreUpdate: (score: number) => void;
  private onLevelComplete: (level: number) => void;
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
  public effects: GameEffects;
  private wasSubmerged: boolean = false;
  private hookLaunchMs: number = 0; // fırlatma animasyonu için timer

  constructor(
    ctx: CanvasRenderingContext2D,
    initialState: GameState,
    callbacks: {
      onGameOver: (score: number, level: number, reason?: string) => void;
      onScoreUpdate: (score: number) => void;
      onLevelComplete: (level: number) => void;
      onFishCaught: (fish: Entity) => void;
    }
  ) {
    this.ctx = ctx;
    this.state = initialState;
    this.onGameOver = callbacks.onGameOver;
    this.onScoreUpdate = callbacks.onScoreUpdate;
    this.onLevelComplete = callbacks.onLevelComplete;
    this.onFishCaught = callbacks.onFishCaught;

    this.spriteManager = new SpriteManager(() => {
      this.assetsLoaded = true;
    });
    this.spriteManager.loadImages(ASSETS);
    this.effects = new GameEffects(CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  start() {
    this.state.isPlaying = true;
    this.isArriving = false;
    this.arrivalProgress = 0;
    this.isSinking = false;
    this.sinkProgress = 0;
    this.state.lavaBurnMs = 0;
    this.state.buoyancyOffset = 0;
    this.state.buoyancyOffsetMs = 0;
    this.state.weather = this.pickWeather();
    const config = LEVEL_CONFIG[this.state.level];
    if (config) {
      this.state.timeRemaining = config.duration;
      this.state.fuelCost = config.fuelCost;
      this.state.region = config.region;
    }
    // Force reset hook state and angle/direction on start to prevent stuck oscillation
    this.state.hook.state = 'idle';
    this.state.hook.length = 0;
    this.state.hook.angle = Math.PI / 2; // Ortadan başla
    this.state.hook.direction = 1;
    this.state.hook.x = CANVAS_WIDTH / 2;
    this.state.hook.y = SEA_LEVEL_Y;
    this.hookLaunchMs = 0;
    this.wasSubmerged = false;

    this.seedStaticObstacles();
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.loop);
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
      this.hookLaunchMs = 250; // fırlatma animasyonu tetiklendi (mechanical.md — fışkırma)
    }
  }

  private loop = (timestamp: number = 0) => {
    if (!this.state.isPlaying) return;

    const deltaTime = Math.min(timestamp - this.lastFrameTime, 50); // 50ms cap
    this.lastFrameTime = timestamp;

    // Hit-stop: mantık güncelleme atla, çizimi devam ettir
    this.effects.update(deltaTime, timestamp);
    if (!this.effects.isHitStopped) {
      this.update(deltaTime);
    }
    this.draw(timestamp);

    requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number) {
    if (this.isSinking) {
      this.sinkProgress += deltaTime / 2000;
      if (this.sinkProgress >= 1) {
        this.sinkProgress = 1;
        this.state.isPlaying = false;
        // Trigger game over with generic message
        this.onGameOver(this.state.score, this.state.level, "Tekne battı! Çok ağır yük altında ezildi.");
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
          this.onLevelComplete(this.state.level);
        }, 100);
      }
      // ONLY return and freeze logic when completely arrived
      if (!this.state.isPlaying) return;
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
    const prevLavaBurnMs = this.state.lavaBurnMs;
    this.state.hookSpeedBoostMs = clamp(this.state.hookSpeedBoostMs);
    this.state.fishPanicMs = clamp(this.state.fishPanicMs);
    this.state.buoyancyOffsetMs = clamp(this.state.buoyancyOffsetMs);
    this.state.weightDisplayOffsetMs = clamp(this.state.weightDisplayOffsetMs);
    this.state.anchorSnagMs = clamp(this.state.anchorSnagMs);
    this.state.hookBrokenMs = clamp(this.state.hookBrokenMs);
    this.state.zapShockMs = clamp(this.state.zapShockMs);
    this.state.moonSlowMs = clamp(this.state.moonSlowMs);
    this.state.lavaBurnMs = clamp(this.state.lavaBurnMs);

    // Lava burn: add +1 weight per second while active
    if (this.state.lavaBurnMs > 0) {
      const prevSecond = Math.floor(prevLavaBurnMs / 1000);
      const curSecond = Math.floor(this.state.lavaBurnMs / 1000);
      if (curSecond < prevSecond) {
        // A full second has passed — add +1 weight
        this.state.buoyancyOffset += 1;
        this.recalculateStorage();
      }
    }

    if (this.state.buoyancyOffsetMs === 0 && this.state.buoyancyOffset !== 0 && this.state.lavaBurnMs === 0) {
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
    const config = LEVEL_CONFIG[this.state.level];
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
    const config = LEVEL_CONFIG[this.state.level];
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
    const actualWeight = this.state.inventory.reduce((sum, item) => sum + item.weight, 0);
    // currentStorage display value includes temporary buoyancy offsets (visual stress as per game_design 2.2)
    this.state.currentStorage = actualWeight + (this.state.buoyancyOffset || 0);
    const maxStorage = this.state.upgrades.storageCapacity || 50;
    // Sink check only against real inventory weight as per game_design
    if (actualWeight > maxStorage) {
      this.isSinking = true;
    }
  }

  private getRodStats() {
    // ROD_SPEED (salınım hızı) game_design Bölüm 2.1
    // L1-4: 0.018, L5-8: 0.020, L9-12: 0.022, L13-16: 0.025, L17-20: 0.028 rad/frame(×deltaTime)
    const lv = this.state.level;
    const baseSwing = lv <= 4 ? 0.018 : lv <= 8 ? 0.020 : lv <= 12 ? 0.022 : lv <= 16 ? 0.025 : 0.028;
    if (this.state.upgrades.rodLevel === 2) {
      // Olta Lv2: +%15 hız, yakalama alanı 1.2x, Coral %30 koruma, atma hakkı 4
      return { swingMultiplier: baseSwing * 1.15, throwMultiplier: 11 / 9, catchMultiplier: 1.2, coralProtection: 0.3, kelpSnagMs: 800, rodWidth: 4, lineWidth: 2, maxAttempts: 4 };
    }
    if (this.state.upgrades.rodLevel >= 3) {
      // Olta Lv3: +%30 hız, yakalama alanı 1.4x, Coral %60 koruma, Kelp 0.4sn, atma hakkı 5
      return { swingMultiplier: baseSwing * 1.30, throwMultiplier: 13 / 9, catchMultiplier: 1.4, coralProtection: 0.6, kelpSnagMs: 400, rodWidth: 6, lineWidth: 3, maxAttempts: 5 };
    }
    // Olta Lv1: base, atma hakkı 3
    return { swingMultiplier: baseSwing, throwMultiplier: 0.85, catchMultiplier: 1, coralProtection: 0, kelpSnagMs: 800, rodWidth: 2, lineWidth: 1.2, maxAttempts: 3 };
  }

  private updateHook(deltaTime: number) {
    const hook = this.state.hook;
    const rod = this.getRodStats();
    if (this.state.hookBrokenMs > 0) {
      hook.state = 'idle';
      hook.length = 0;
      hook.x = CANVAS_WIDTH / 2;
      hook.y = SEA_LEVEL_Y;
      this.wasSubmerged = false;
      return;
    }
    // Launch animasyonu güncellemesi
    if (this.hookLaunchMs > 0) this.hookLaunchMs -= deltaTime;

    const isCurrentlySubmerged = hook.y > SEA_LEVEL_Y;
    if (isCurrentlySubmerged !== this.wasSubmerged && hook.state !== 'idle') {
      if (isCurrentlySubmerged) {
        this.effects.spawnSplash(hook.x, SEA_LEVEL_Y);
      } else {
        this.effects.spawnExitSplash(hook.x, SEA_LEVEL_Y);
      }
      this.wasSubmerged = isCurrentlySubmerged;
    }
    const baseSpeed = 0.45 * rod.throwMultiplier * (this.state.hookSpeedBoostMs > 0 ? 1.3 : 1);
    const catchMultiplier = rod.catchMultiplier;
    const maxDepth = CANVAS_HEIGHT - (this.state.weather === 'stormy' ? 10 : 0);

    if (hook.state === 'idle') {
      const minAngle = 0;
      const maxAngle = Math.PI;

      // Tasarımdaki rad/frame değerini rad/ms'e çevirmek için ~0.06 çarpanı (1/16.6ms)
      const oscillationSpeed = 0.06 * rod.swingMultiplier;
      if (hook.direction === 1) {
        hook.angle += oscillationSpeed * deltaTime;
        if (hook.angle >= maxAngle) {
          hook.angle = maxAngle - 0.01; // Avoid exact PI stuck
          hook.direction = -1;
        }
      } else {
        hook.angle -= oscillationSpeed * deltaTime;
        if (hook.angle <= minAngle) {
          hook.angle = minAngle + 0.01; // Avoid exact 0 stuck
          hook.direction = 1;
        }
      }

      // 180 derece su altı salınımı: 0 = SOL, PI = SAĞ
      const pivotX = CANVAS_WIDTH / 2;
      const pivotY = SEA_LEVEL_Y;
      const idleLength = 120; // Daha görünür salınım için 120px

      hook.x = pivotX - Math.cos(hook.angle) * idleLength;
      hook.y = pivotY + Math.sin(hook.angle) * idleLength;
      hook.length = 0;
    } else if (hook.state === 'retracting' || hook.state === 'snagged' || hook.state === 'whirlpool') {
      if (hook.state === 'retracting') {
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
          // Ensure continuous oscillation by starting from current angle but enforcing direction
          hook.direction = Math.random() < 0.5 ? 1 : -1;

          if (hook.caughtEntity) {
            const caught = hook.caughtEntity;

            // Zap shock: 50% chance caught fish escapes if shock is active
            if (this.state.zapShockMs > 0 && caught.type !== 'sunken_boat' && caught.type !== 'treasure_chest' && caught.type !== 'shell') {
              if (Math.random() < 0.5) {
                // Fish escapes!
                hook.caughtEntity = null;
                return;
              }
            }

            if (caught.type === 'sunken_boat') {
              this.handleSunkenBoat(caught);
              this.effects.spawnRareCatch(CANVAS_WIDTH / 2, SEA_LEVEL_Y, '#8B4513');
            } else if (caught.type === 'treasure_chest') {
              this.handleTreasureChest(caught);
              this.effects.spawnMediumCatch(CANVAS_WIDTH / 2, SEA_LEVEL_Y, '#FFD700');
            } else if (caught.type === 'shell') {
              this.handleShell(caught);
              this.effects.spawnSmallCatch(CANVAS_WIDTH / 2, SEA_LEVEL_Y, '#FFEFD5');
            } else {
              this.handleStandardCatch(caught);
            }
            // Tekne bob animasyonu (mechanical.md)
            this.effects.triggerBoatBob();
            hook.caughtEntity = null;
          }
        } else {
          hook.x = CANVAS_WIDTH / 2 - Math.cos(hook.angle) * hook.length;
          hook.y = SEA_LEVEL_Y + Math.sin(hook.angle) * hook.length;
        }
      } else if (hook.state === 'whirlpool' && this.whirlpoolCenter) {
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
            // New coordinate system: angle = PI - atan2(dy, dx)
            const angle = Math.PI - Math.atan2(hook.y - SEA_LEVEL_Y, hook.x - CANVAS_WIDTH / 2);
            hook.angle = angle;
            hook.length = Math.hypot(hook.x - CANVAS_WIDTH / 2, hook.y - SEA_LEVEL_Y);
            hook.state = 'shooting';
          } else if (outcome < 0.75) {
            const angle = Math.PI - Math.atan2(SEA_LEVEL_Y - SEA_LEVEL_Y, hook.x - CANVAS_WIDTH / 2);
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
      } else if (hook.state === 'snagged') {
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
    } else if (hook.state === 'shooting') {
      hook.length += baseSpeed * 1.5 * deltaTime;
      // Yeni koordinat sistemi: x = center - cos * length
      hook.x = CANVAS_WIDTH / 2 - Math.cos(hook.angle) * hook.length;
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
            this.effects.spawnCoralHit(hook.x, hook.y);
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
          this.effects.spawnKelpHit(hook.x, hook.y);
          this.state.anchorSnagMs = rod.kelpSnagMs;
          this.lastSnagType = 'kelp';
          break;
        }

        if (fish.type === 'sea_rock' && dist < fish.radius) {
          hook.state = 'retracting';
          hook.caughtEntity = null;
          this.effects.spawnRockHit(hook.x, hook.y);
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
          // Yakalama anı titreşimi (mechanical.md — balık direniyor)
          this.effects.shakeScreen(3, 3);
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
      // Speed Booster: 30% faster retraction
      if (this.state.boosters?.speed) {
        vBase *= 1.3;
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

          // Zap shock: 50% chance caught fish escapes if shock is active
          if (this.state.zapShockMs > 0 && caught.type !== 'sunken_boat' && caught.type !== 'treasure_chest' && caught.type !== 'shell') {
            if (Math.random() < 0.5) {
              // Fish escapes!
              hook.caughtEntity = null;
              return;
            }
          }

          if (caught.type === 'sunken_boat') {
            this.handleSunkenBoat(caught);
            this.effects.spawnRareCatch(CANVAS_WIDTH / 2, SEA_LEVEL_Y, '#8B4513');
          } else if (caught.type === 'treasure_chest') {
            this.handleTreasureChest(caught);
            this.effects.spawnMediumCatch(CANVAS_WIDTH / 2, SEA_LEVEL_Y, '#FFD700');
          } else if (caught.type === 'shell') {
            this.handleShell(caught);
            this.effects.spawnSmallCatch(CANVAS_WIDTH / 2, SEA_LEVEL_Y, '#FFEFD5');
          } else {
            this.handleStandardCatch(caught);
          }
          // Tekne bob animasyonu (mechanical.md)
          this.effects.triggerBoatBob();
          hook.caughtEntity = null;
        }
      } else {
        hook.x = CANVAS_WIDTH / 2 + Math.cos(hook.angle) * hook.length;
        hook.y = SEA_LEVEL_Y + Math.sin(hook.angle) * hook.length;
      }
    }
  }

  private updateFishes(deltaTime: number) {
    const levelSpeedBonus = (this.state.level - 1) * 0.1;
    const travelSpeed = 2 + levelSpeedBonus;
    const panicMultiplier = this.state.fishPanicMs > 0 ? 2 : 1;
    const moonSlowMultiplier = this.state.moonSlowMs > 0 ? 0.6 : 1;
    const time = performance.now() * 0.002;
    const timeMs = performance.now();
    const weatherSpeedBonus = this.state.weather === 'stormy' ? 0.5 : 0;
    const weatherSpeedMultiplier = this.state.weather === 'rainy' ? 1.2 : 1;
    const baseSpeed = (speed: number) => (speed + travelSpeed + weatherSpeedBonus) * weatherSpeedMultiplier * moonSlowMultiplier;

    for (let i = this.state.fishes.length - 1; i >= 0; i--) {
      const fish = this.state.fishes[i];

      // Trail güncellemesi (hızlı balıklar için)
      if (fish.type === 'zap' || fish.type === 'tide' || fish.type === 'king') {
        this.effects.updateTrail(fish.id, fish.x, fish.y, fish.color);
      }

      // Remove fish that would overlap with the arrival island
      if (this.isArriving) {
        const islandWidth = CANVAS_WIDTH * 0.6;
        const islandX = CANVAS_WIDTH - (Math.min(1, this.arrivalProgress) * islandWidth);
        const landLeftEdge = islandX - 120;
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
        // Bubble: sinüs dalgası + 5-8sn'de bir 0.5sn pause
        const pauseCycle = 5000 + ((fish.animationOffset || 0) % 3000); // 5-8s cycle
        const pausePhase = (timeMs + (fish.animationOffset || 0) * 500) % pauseCycle;
        const isPaused = pausePhase > (pauseCycle - 500); // last 0.5s of cycle = pause
        if (!isPaused) {
          fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        }
        const waveY = Math.sin(fish.x * 0.04) * 20;
        fish.y = (fish.startY || fish.y) + waveY;
      } else if (fish.type === 'zap') {
        // Zap: sharp zigzag — 0.8-1.2s intervals, ±30px vertical jumps
        const zigzagCycle = 800 + ((fish.animationOffset || 0) % 400);
        const zigzagPhase = (timeMs + (fish.animationOffset || 0) * 1000) % zigzagCycle;
        const zigzagSeed = Math.floor((timeMs + (fish.animationOffset || 0) * 1000) / zigzagCycle);
        const zigzagDir = Math.sin(zigzagSeed * 7.13 + (fish.animationOffset || 0)) < 0 ? -1 : 1;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        // Oscillate around startY — no drift
        const zigzagOffset = zigzagPhase < 150
          ? zigzagDir * 30 * (zigzagPhase / 150)
          : zigzagDir * 30;
        fish.y = (fish.startY || fish.y) + zigzagOffset;
      } else if (fish.type === 'moon') {
        // Moon: very slow S-curve, ±40px, 6s period, 1s pause at peaks
        const moonPeriod = 6;
        const sineProgress = Math.sin(time / (moonPeriod / 2) + (fish.animationOffset || 0));
        const effectiveSine = Math.abs(sineProgress) > 0.95 ? Math.sign(sineProgress) : sineProgress;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.y = (fish.startY || fish.y) + effectiveSine * 40;
      } else if (fish.type === 'lava') {
        // Lava: diagonal bounce ±60px around startY
        const bouncePeriod = 2000 + ((fish.animationOffset || 0) % 2000);
        const bouncePhase = (timeMs + (fish.animationOffset || 0) * 1000) % bouncePeriod;
        const bounceProgress = bouncePhase / bouncePeriod;
        const triangleWave = bounceProgress < 0.5 ? bounceProgress * 2 - 0.5 : 1.5 - bounceProgress * 2;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.y = (fish.startY || fish.y) + triangleWave * 60;
      } else if (fish.type === 'tide') {
        // Tide: wide sine ±45px, 2.5s period, very fast
        const tideWave = Math.sin(time * (Math.PI * 2 / 2.5) + (fish.animationOffset || 0)) * 45;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.y = (fish.startY || fish.y) + tideWave;
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
        const slalom = Math.sin(time * 2 + (fish.animationOffset || 0)) * 35;
        fish.y = (fish.startY || fish.y) + slalom;
      } else if (fish.type === 'galaxy') {
        const cycle = 1200 + ((fish.animationOffset || 0) % 800);
        const phase = (timeMs + (fish.animationOffset || 0) * 1000) % cycle;
        const jumpSeed = Math.floor((timeMs + (fish.animationOffset || 0) * 1000) / cycle);
        const jumpDir = Math.sin(jumpSeed * 12.9898 + (fish.animationOffset || 0)) < 0 ? -1 : 1;
        const jumpOffset = (0.3 + Math.sin(jumpSeed * 9.1 + (fish.animationOffset || 0)) * 0.3) * 50;
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
        fish.y = (fish.startY || fish.y) + jumpDir * jumpOffset;
        if (phase < 100) {
          fish.y = fish.startY || fish.y;
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
          fish.y = (fish.startY || fish.y) + jumpDir * 25 * Math.sin(progress * Math.PI);
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
        // Anchor: pendulum sway ±15px, 4s period
        const pendulum = Math.sin(time * (Math.PI * 2 / 4) + (fish.animationOffset || 0)) * 15;
        fish.x = (fish.startY !== undefined ? fish.x : fish.x) + pendulum * (deltaTime / 500);
      } else if (fish.type === 'sea_kelp') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16);
        fish.y = (fish.startY || fish.y) + Math.sin(time + (fish.animationOffset || 0)) * 3;
      } else if (fish.type === 'coral') {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16);
      } else {
        fish.x -= baseSpeed(fish.speed) * (deltaTime / 16) * panicMultiplier;
      }

      // Global Y-clamp: keep all fish within water bounds (never above sea level or below sand)
      const isStaticElement = fish.type === 'sea_kelp' || fish.type === 'sea_rock' || fish.type === 'coral' ||
        fish.type === 'anchor' || fish.type === 'shell' || fish.type === 'treasure_chest' || fish.type === 'sunken_boat';
      if (!isStaticElement && fish.type !== 'env_bubbles') {
        const minY = SEA_LEVEL_Y + 15; // at least 15px below water surface
        const maxY = CANVAS_HEIGHT - 80; // above the sand
        fish.y = Math.max(minY, Math.min(maxY, fish.y));
      }

      if (this.state.fishPanicMs > 0 && fish.value < 100 && fish.type !== 'env_bubbles') {
        fish.y += Math.sin(time * 8 + (fish.animationOffset || 0)) * 2;
      }

      if (fish.x < -120) {
        this.state.fishes.splice(i, 1);
      }
    }
  }

  private spawnFishes(deltaTime: number) {
    // Stop spawning if arriving
    if (this.isArriving) return;

    const levelConfig = LEVEL_CONFIG[this.state.level];
    if (!levelConfig) return;
    const weatherSpawnMultiplier = this.state.weather === 'cloudy' ? 1.1 : this.state.weather === 'magic' ? 1.25 : 1;
    // Base spawn chance increases with levels
    const spawnChance = (0.012 + this.state.level * 0.003) * weatherSpawnMultiplier;

    if (Math.random() < spawnChance) {
      const pool: Array<{ type: FishClass; weight: number }> = [];

      // game_design Bölüm 3: Her level için exact spawn % oranları tablosu
      const LEVEL_SPAWN_WEIGHTS: Record<number, Partial<Record<FishClass, number>>> = {
        1: { bubble: 90, sakura: 70, zap: 30 },
        2: { bubble: 80, sakura: 65, zap: 40, candy: 20 },
        3: { bubble: 70, sakura: 60, zap: 45, candy: 30, moon: 10 },
        4: { bubble: 65, sakura: 55, zap: 50, candy: 35, moon: 15 },
        5: { bubble: 60, sakura: 50, zap: 50, candy: 35, moon: 25, lava: 15, tide: 10 },
        6: { bubble: 55, sakura: 45, zap: 50, candy: 35, moon: 28, lava: 20, tide: 15 },
        7: { bubble: 50, sakura: 40, zap: 48, candy: 32, moon: 30, lava: 22, tide: 18, leaf: 8 },
        8: { bubble: 45, sakura: 38, zap: 45, candy: 30, moon: 30, lava: 25, tide: 20, leaf: 10 },
        9: { bubble: 40, sakura: 32, zap: 42, candy: 28, moon: 28, lava: 25, tide: 20, leaf: 12, crystal: 8 },
        10: { bubble: 35, sakura: 28, zap: 40, candy: 26, moon: 27, lava: 27, tide: 22, leaf: 13, crystal: 10, galaxy: 6 },
        11: { bubble: 30, sakura: 25, zap: 38, candy: 24, moon: 25, lava: 28, tide: 23, leaf: 14, crystal: 12, galaxy: 8, mushroom: 5 },
        12: { bubble: 28, sakura: 22, zap: 36, candy: 22, moon: 24, lava: 28, tide: 23, leaf: 15, crystal: 13, galaxy: 9, mushroom: 6 },
        13: { bubble: 22, sakura: 18, zap: 34, candy: 20, moon: 22, lava: 28, tide: 24, leaf: 15, crystal: 14, galaxy: 10, mushroom: 7, king: 2 },
        14: { bubble: 18, sakura: 15, zap: 32, candy: 18, moon: 20, lava: 28, tide: 24, leaf: 15, crystal: 15, galaxy: 11, mushroom: 8, king: 3 },
        15: { bubble: 15, sakura: 12, zap: 30, candy: 16, moon: 18, lava: 28, tide: 24, leaf: 15, crystal: 16, galaxy: 12, mushroom: 9, king: 4 },
        16: { bubble: 12, sakura: 10, zap: 28, candy: 14, moon: 16, lava: 27, tide: 23, leaf: 15, crystal: 16, galaxy: 13, mushroom: 10, king: 5 },
        17: { bubble: 10, sakura: 8, zap: 26, candy: 12, moon: 16, lava: 26, tide: 22, leaf: 14, crystal: 17, galaxy: 14, mushroom: 11, king: 8 },
        18: { bubble: 8, sakura: 6, zap: 24, candy: 10, moon: 15, lava: 26, tide: 22, leaf: 14, crystal: 18, galaxy: 15, mushroom: 12, king: 10 },
        19: { bubble: 5, sakura: 4, zap: 22, candy: 8, moon: 14, lava: 25, tide: 21, leaf: 13, crystal: 19, galaxy: 16, mushroom: 13, king: 12 },
        20: { bubble: 3, sakura: 2, zap: 20, candy: 6, moon: 13, lava: 24, tide: 20, leaf: 12, crystal: 20, galaxy: 17, mushroom: 14, king: 15 },
      };

      const spawnWeights = LEVEL_SPAWN_WEIGHTS[this.state.level] ?? {};
      const isLucky = this.state.boosters?.lucky;

      for (const type of levelConfig.fish) {
        let w = (spawnWeights as Record<string, number>)[type] ?? 0;
        if (w > 0) {
          // Lucky Booster: Increase rare fish weights by 20%
          const rareTypes: FishClass[] = ['zap', 'candy', 'moon', 'lava', 'leaf', 'crystal', 'galaxy', 'mushroom', 'king'];
          if (isLucky && rareTypes.includes(type)) {
            w *= 1.2;
          }
          pool.push({ type, weight: w });
        }
      }

      // Dynamic elementler: level'e özgü spawn şansları
      const lv = this.state.level;
      const shellChance = lv >= 3 ? Math.max(15, 70 - (lv - 3) * 5) : 0;
      if (shellChance > 0 && levelConfig.dynamic.includes('shell')) pool.push({ type: 'shell', weight: shellChance });

      if (levelConfig.dynamic.includes('treasure_chest')) {
        const chestW = lv < 7 ? 0 : lv <= 8 ? 30 + (lv - 7) * 5 : 35;
        if (chestW > 0) pool.push({ type: 'treasure_chest', weight: chestW });
      }

      if (levelConfig.dynamic.includes('sunken_boat')) {
        pool.push({ type: 'sunken_boat', weight: lv <= 8 ? 25 : 30 });
      }

      if (levelConfig.dynamic.includes('whirlpool')) {
        const wpChance = lv <= 7 ? 20 : lv <= 8 ? 30 : lv <= 9 ? 35 : lv <= 10 ? 40 : lv <= 11 ? 45 : lv <= 12 ? 48 : lv <= 13 ? 50 : lv <= 14 ? 55 : lv <= 15 ? 60 : lv <= 16 ? 65 : lv <= 17 ? 70 : lv <= 18 ? 75 : lv <= 19 ? 80 : 85;
        pool.push({ type: 'whirlpool', weight: wpChance });
      }

      if (levelConfig.dynamic.includes('shark_skeleton')) {
        const skChance = lv <= 9 ? 25 : lv <= 10 ? 30 : lv <= 11 ? 35 : lv <= 12 ? 38 : lv <= 13 ? 40 : lv <= 14 ? 44 : lv <= 15 ? 48 : lv <= 16 ? 50 : lv <= 17 ? 55 : lv <= 18 ? 58 : lv <= 19 ? 62 : 65;
        pool.push({ type: 'shark_skeleton', weight: skChance });
      }

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

      // Spawn Y position logic — depth zones from spec
      const waterDepth = CANVAS_HEIGHT - SEA_LEVEL_Y - 60; // total water column (above sand)
      let y;
      if (fishClass === 'coral' || fishClass === 'sunken_boat' || fishClass === 'anchor' || fishClass === 'treasure_chest' || fishClass === 'shell' || fishClass === 'sea_kelp') {
        y = CANVAS_HEIGHT - 60 + (Math.random() * 20);
      } else if (fishClass === 'sea_rock') {
        y = Math.random() < 0.5 ? CANVAS_HEIGHT - 70 + Math.random() * 10 : SEA_LEVEL_Y + 100 + Math.random() * 200;
      } else if (fishClass === 'whirlpool') {
        y = SEA_LEVEL_Y + waterDepth * 0.2 + Math.random() * waterDepth * 0.4; // orta zon
      } else if (fishClass === 'bubble') {
        y = SEA_LEVEL_Y + Math.random() * waterDepth * 0.25; // 0-25%
      } else if (fishClass === 'sakura') {
        y = SEA_LEVEL_Y + Math.random() * waterDepth * 0.4; // 0-40%
      } else if (fishClass === 'zap') {
        y = SEA_LEVEL_Y + Math.random() * waterDepth * 0.9; // 0-90%
      } else if (fishClass === 'candy') {
        y = SEA_LEVEL_Y + waterDepth * 0.2 + Math.random() * waterDepth * 0.4; // 20-60%
      } else if (fishClass === 'moon') {
        y = SEA_LEVEL_Y + waterDepth * 0.4 + Math.random() * waterDepth * 0.4; // 40-80%
      } else if (fishClass === 'lava') {
        y = SEA_LEVEL_Y + waterDepth * 0.6 + Math.random() * waterDepth * 0.35; // 60-95%
      } else if (fishClass === 'crystal') {
        y = SEA_LEVEL_Y + waterDepth * 0.55 + Math.random() * waterDepth * 0.35; // 55-90%
      } else if (fishClass === 'tide') {
        y = SEA_LEVEL_Y + Math.random() * waterDepth * 0.5; // 0-50%
      } else if (fishClass === 'mushroom') {
        y = SEA_LEVEL_Y + waterDepth * 0.35 + Math.random() * waterDepth * 0.5; // 35-85%
      } else if (fishClass === 'king') {
        y = SEA_LEVEL_Y + waterDepth * 0.3 + Math.random() * waterDepth * 0.4; // 30-70%
      } else if (fishClass === 'leaf' || fishClass === 'galaxy') {
        y = SEA_LEVEL_Y + Math.random() * waterDepth * 0.95; // 0-95%
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
    // game_design Bölüm 3: Baloncuk sayısı level'e göre azalır
    // L1-2: 3, L3-8: 2, L9-12: 1-2, L13-14: 1 (nadir), L15-16: 0-1, L17+: 0
    const lv = this.state.level;
    let targetBubbles: number;
    if (lv <= 2) targetBubbles = 3;
    else if (lv <= 8) targetBubbles = 2;
    else if (lv <= 12) targetBubbles = Math.random() < 0.6 ? 2 : 1;
    else if (lv <= 14) targetBubbles = Math.random() < 0.3 ? 1 : 0;
    else if (lv <= 16) targetBubbles = Math.random() < 0.2 ? 1 : 0;
    else targetBubbles = 0; // L17-20: hiç baloncuk yok

    const bubbleCount = this.state.fishes.filter(fish => fish.type === 'env_bubbles').length;
    if (bubbleCount >= targetBubbles) return;
    const needed = targetBubbles - bubbleCount;
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
      this.onGameOver(this.state.score, this.state.level, "Olta kullanılamaz! Tüm kancalar kırıldı.");
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
    // Value Booster: 20% more value for catches
    const boosterMultiplier = this.state.boosters?.value ? 1.2 : 1.0;
    const finalValue = Math.round(item.value * boosterMultiplier);

    const newItem = { ...item, value: finalValue };
    this.state.inventory.push(newItem);
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

    // Efektler: Değere göre farklı efektler tetikle
    const baseValue = OBJECT_MATRIX[caught.type].value;
    if (baseValue < 50) {
      this.effects.spawnSmallCatch(caught.x, caught.y, caught.color);
    } else if (baseValue <= 200) {
      this.effects.spawnMediumCatch(caught.x, caught.y, caught.color);
    } else {
      this.effects.spawnRareCatch(caught.x, caught.y, caught.color, caught.type === 'king');
    }

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

    // Zap: 3 second electric shock — next catches have 50% escape chance
    if (caught.type === 'zap') {
      this.state.zapShockMs = 3000;
    }

    // Moon: 10 second all-fish slowdown (40% speed reduction)
    if (caught.type === 'moon') {
      this.state.moonSlowMs = Math.max(this.state.moonSlowMs, 0) + 10000;
    }

    // Lava: yangın etkisi — Tekne Lv3 ise 3sn, diğer durumlarda 5sn (game_design Bölüm 7.1)
    if (caught.type === 'lava') {
      this.state.lavaBurnMs = this.state.upgrades.boatLevel >= 3 ? 3000 : 5000;
      this.state.weightDisplayOffset = 0; // reset visual offset
      this.state.weightDisplayOffsetMs = 0;
    }

    // Tide: visual shake + 20% chance to drop random fish from inventory
    if (caught.type === 'tide') {
      this.state.weightDisplayOffset = 5;
      this.state.weightDisplayOffsetMs = 2000;
      if (this.state.inventory.length > 1 && Math.random() < 0.2) {
        // Drop a random fish from inventory (not the tide fish we just added)
        const candidates = this.state.inventory.filter(item => item.type !== 'tide');
        if (candidates.length > 0) {
          const dropIdx = this.state.inventory.indexOf(candidates[Math.floor(Math.random() * candidates.length)]);
          if (dropIdx >= 0) {
            this.state.inventory.splice(dropIdx, 1);
            this.recalculateStorage();
          }
        }
      }
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
    // Shell game_design Bölüm 3.4: Direk 20 coin verir, inventory'ye girmez
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

    this.updateHookAttempts(-1);
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

  private draw(timestamp: number = 0) {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const t = timestamp * 0.001; // saniye cinsinden

    // Ambient: tekne su salınımı
    const boatBobY = Math.sin(t * 0.04 * 60) * 2.5 + this.effects.boatBobY;
    const boatRotation = Math.sin(t * 0.035 * 60) * (0.8 * Math.PI / 180);

    // Ambient: olta ucu mikro titreme
    const rodTweak = this.effects.applyRodTipAmbientation(timestamp);

    const islandConfig = LEVEL_CONFIG[this.state.level];
    const hue = (this.state.level - 1) * 30;
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
      this.ctx.fillText(`${this.state.level}. LEVEL`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.shadowBlur = 0;
    }

    // 3. Draw Boat & Fisherman (Screen Shake + Zoom transform burada uygulanıyor)
    this.ctx.save();
    // Zoom pulse (nadir balık)
    const zoom = this.effects.currentZoom;
    if (zoom !== 1) {
      this.ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
    }
    // Screen shake
    this.effects.applyShake(this.ctx);

    // Tekne ambient salınımı
    if (this.isArriving) {
      this.ctx.translate(this.arrivalProgress * 100, boatBobY);
    } else if (this.isSinking) {
      this.ctx.translate(0, this.sinkProgress * 200 + boatBobY);
      this.ctx.rotate(this.sinkProgress * 0.2);
    } else {
      this.ctx.translate(0, boatBobY);
      this.ctx.translate(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 40);
      this.ctx.rotate(boatRotation);
      this.ctx.translate(-CANVAS_WIDTH / 2, -(SEA_LEVEL_Y - 40));
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

    // 5. Draw Hook Line — misina bezier fizik eğrisiyle çiziliyor
    const rod = this.getRodStats();
    const rodTip = this.getRodTipPosition();
    // Ambient rod tip titremi uygula
    const tipX = rodTip.x + rodTweak.dx;
    const tipY = rodTip.y + rodTweak.dy;

    const pivotX = CANVAS_WIDTH / 2;
    const pivotY = SEA_LEVEL_Y;

    if (this.state.hookBrokenMs > 0) {
      const progress = Math.min(1, Math.max(0, this.state.hookBrokenMs / this.hookBreakDuration));
      const midX = tipX + Math.cos(this.state.hook.angle) * 30;
      const midY = tipY + Math.sin(this.state.hook.angle) * 30;
      this.ctx.strokeStyle = '#D64545';
      this.ctx.lineWidth = rod.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(tipX, tipY);
      this.ctx.lineTo(midX, midY);
      this.ctx.stroke();
    } else {
      this.ctx.strokeStyle = '#D64545';
      this.ctx.lineWidth = rod.lineWidth;

      // 1. Kamış ucundan su yüzeyi pivotuna düz çizgi
      this.ctx.beginPath();
      this.ctx.moveTo(tipX, tipY);
      this.ctx.lineTo(pivotX, pivotY);
      this.ctx.stroke();

      // 2. Pivottan iğneye salınan misina (bezier fizik kaldırıldı, düz çizgi eklendi)
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

    // 8. Draw Swimming Entities (su blipleri altta)
    this.effects.drawUnder(this.ctx);
    for (const fish of this.state.fishes) {
      if (this.state.hook.caughtEntity && this.state.hook.caughtEntity.id === fish.id) continue;
      this.drawEntity(fish.x, fish.y, fish.radius, fish.color, fish.type, false, fish);
    }

    // 9. Efektler (partiküller, flash overlay — en üstte)
    this.effects.draw(this.ctx);

    // 10. Vignette (son 10 saniyede gerilim)
    if (this.state.timeRemaining <= 10) {
      const intensity = Math.max(0, 1 - this.state.timeRemaining / 10);
      this.effects.drawVignette(this.ctx, intensity);
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

  // ── Sprite koordinatları (download.jpg için analiz edildi) ──────────────
  // Sprite boyutu: 160x110px, pozisyon: merkezX-80, SEA_LEVEL_Y-80
  // Sprite içindeki olta ucu (rod tip): x=%19, y=%10
  // Sprite içindeki bağlantı noktası (holding hand): x=%58, y=%40
  // ─────────────────────────────────────────────────────────────────────────
  private readonly SPRITE_W = 180;
  private readonly SPRITE_H = 125;
  private readonly SPRITE_OFFSET_X = -90; // merkezden offset
  private readonly SPRITE_OFFSET_Y = -90; // sea level'den offset

  // Rod tip = görseldeki bambu olta ucunun tam pozisyonu
  // PNG transparan olduğu için daha geniş bir alan kullanıyoruz
  private getRodTipPosition(): { x: number; y: number } {
    const cx = CANVAS_WIDTH / 2 + this.SPRITE_OFFSET_X;
    const cy = SEA_LEVEL_Y + this.SPRITE_OFFSET_Y;
    return {
      x: cx + this.SPRITE_W * 0.18,
      y: cy + this.SPRITE_H * 0.12,
    };
  }

  private drawFisherman() {
    const sprite = this.spriteManager.getImage('fisherman_boat');
    if (!sprite || !sprite.complete || sprite.naturalWidth === 0) {
      this.drawFishermanFallback();
      return;
    }

    const drawX = CANVAS_WIDTH / 2 + this.SPRITE_OFFSET_X;
    const drawY = SEA_LEVEL_Y + this.SPRITE_OFFSET_Y;

    this.ctx.save();
    // PNG transparanlığını kullanmak için source-over (varsayılan) kullanılır.
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.drawImage(sprite, drawX, drawY, this.SPRITE_W, this.SPRITE_H);
    this.ctx.restore();
  }

  private drawFishermanFallback() {
    // Sprite yüklenemezse eski procedural çizim (yedek)
    const x = CANVAS_WIDTH / 2;
    const y = SEA_LEVEL_Y - 40;
    this.ctx.fillStyle = '#D4A373';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + 10, 30, 18, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#4A90D9';
    this.ctx.beginPath();
    this.ctx.roundRect(x - 14, y - 10, 28, 22, 6);
    this.ctx.fill();
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y - 25, 22, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawFishingRod() {
    // Sprite kullanıldığında ayrı olta çubuğu çizmiyoruz —
    // olta çubuğu zaten sprite içinde. Bu fonksiyon boş bırakıldı.
    // (Fallback modunda çizim aşağıda yapılır)
    const sprite = this.spriteManager.getImage('fisherman_boat');
    if (!sprite || !sprite.complete || sprite.naturalWidth === 0) {
      // Fallback: procedural rod
      const x = CANVAS_WIDTH / 2;
      const y = SEA_LEVEL_Y - 40;
      const rodLength = 40;
      const rod = this.getRodStats();
      // Launch animasyonu scale (mechanical.md 1.1)
      let launchScale = 1;
      if (this.hookLaunchMs > 0) {
        const t = 1 - (this.hookLaunchMs / 250);
        // 0 -> 1.4 -> 1.0 (overshoot)
        if (t < 0.6) launchScale = (t / 0.6) * 1.4;
        else launchScale = 1.4 - ((t - 0.6) / 0.4) * 0.4;
      }

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.scale(launchScale, launchScale);
      this.ctx.rotate(this.state.hook.angle - Math.PI / 2);
      this.ctx.strokeStyle = '#8B4513';
      this.ctx.lineWidth = rod.rodWidth;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, rodLength);
      this.ctx.stroke();
      this.ctx.restore();
    }
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

  private drawEntity(x: number, y: number, radius: number, color: string, type: FishClass, isCaught: boolean = false, fish?: Entity) {
    if (fish && (fish.type === 'zap' || fish.type === 'tide' || fish.type === 'king')) {
      this.effects.drawTrail(this.ctx, fish.id, radius);
    }
    if (type === 'galaxy' && !isCaught && fish && this.isGalaxyHidden(fish)) {
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
      let offsetX = -width / 2;
      let offsetY = -height / 2;

      // Custom dimensions for sprite drawing
      // Use natural aspect ratio to prevent flattening/distortion
      const ratio = sprite.naturalWidth / sprite.naturalHeight || 1;

      if (type === 'bubble') {
        // Target height: 72px (approx 2x original assumption)
        height = 72;
        width = height * ratio;

        offsetX = -width / 2;
        offsetY = -height / 2;
      } else if (type === 'sakura') {
        // Target height: 80px (approx 2x original assumption)
        height = 80;
        width = height * ratio;

        offsetX = -width / 2;
        offsetY = -height / 2;

        // Particle effect
        if (!isCaught && Math.random() < 0.05) {
          this.ctx.fillStyle = '#FFB7C5';
          this.ctx.beginPath();
          this.ctx.arc(-10 + Math.random() * 20, -10 + Math.random() * 20, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

      } else if (type === 'zap' || type === 'candy' || type === 'moon' || type === 'lava' || type === 'crystal' || type === 'leaf' || type === 'tide' || type === 'mushroom' || type === 'king' || type === 'galaxy') {
        height = 80;
        if (type === 'king') height = 100;
        if (type === 'galaxy') height = 90;
        width = height * ratio;

        offsetX = -width / 2;
        offsetY = -height / 2;
      } else if (type === 'coral') {
        height = 104;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height; // Draw upwards from pivot

        const scaleTime = performance.now() * 0.002;
        const scaleY = 1.0 + Math.sin(scaleTime) * 0.03;
        this.ctx.scale(1, scaleY);
      } else if (type === 'sea_kelp') {
        height = 100;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height;

        // Sway effect
        const sway = Math.sin(performance.now() * 0.002) * 0.05;
        this.ctx.rotate(sway);
      } else if (type === 'sea_rock') {
        height = 60;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height;
      } else if (type === 'treasure_chest') {
        height = 60;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height; // Pivot bottom
      } else if (type === 'whirlpool') {
        height = 110;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height / 2; // Center pivot
        const spin = performance.now() * 0.004;
        const scaleY = 0.55 + Math.sin(spin) * 0.35;
        this.ctx.rotate(spin);
        this.ctx.scale(1, scaleY);
      } else if (type === 'sunken_boat') {
        height = 120;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height + 20; // Buried in sand
      } else if (type === 'shark_skeleton') {
        height = 60;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height / 2;
      } else if (type === 'env_bubbles') {
        height = 30;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height / 2;
      } else if (type === 'anchor') {
        height = 60;
        width = height * ratio;
        offsetX = -width / 2;
        offsetY = -height; // Pivot bottom
      } else if (type === 'shell') {
        height = 20;
        width = height * ratio;
        offsetX = -width / 2;
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
