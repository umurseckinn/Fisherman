import { type GameState, type Entity, type FishClass, OBJECT_MATRIX } from "./types";

export const CANVAS_WIDTH = 450; // virtual width
export const CANVAS_HEIGHT = 800; // virtual height
export const SEA_LEVEL_Y = CANVAS_HEIGHT * 0.25;

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private lastFrameTime: number = 0;
  private onGameOver: (score: number, island: number) => void;
  private onScoreUpdate: (score: number) => void;
  private onIslandComplete: (island: number) => void;

  constructor(
    ctx: CanvasRenderingContext2D, 
    initialState: GameState,
    callbacks: {
      onGameOver: (score: number, island: number) => void;
      onScoreUpdate: (score: number) => void;
      onIslandComplete: (island: number) => void;
    }
  ) {
    this.ctx = ctx;
    this.state = initialState;
    this.onGameOver = callbacks.onGameOver;
    this.onScoreUpdate = callbacks.onScoreUpdate;
    this.onIslandComplete = callbacks.onIslandComplete;
  }

  start() {
    this.state.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  stop() {
    this.state.isPlaying = false;
  }

  handleInput() {
    if (this.state.hook.state === 'idle') {
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
    if (this.state.timeRemaining > 0) {
      this.state.timeRemaining -= deltaTime / 1000;
    } else {
      this.checkIslandProgress();
    }

    this.updateHook(deltaTime);
    this.updateFishes(deltaTime);
    this.spawnFishes(deltaTime);
  }

  private updateHook(deltaTime: number) {
    const hook = this.state.hook;
    const baseSpeed = 0.5;

    if (hook.state === 'idle') {
      // Pendulum: -90 to +90 deg relative to vertical down.
      // Vertical down is Math.PI / 2.
      // Range: 0 (right) to Math.PI (left)
      const minAngle = 0; 
      const maxAngle = Math.PI;
      
      const oscillationSpeed = 0.0015;
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

      if (hook.x < 0 || hook.x > CANVAS_WIDTH || hook.y > CANVAS_HEIGHT) {
        hook.state = 'retracting';
      }

      for (let i = 0; i < this.state.fishes.length; i++) {
        const fish = this.state.fishes[i];
        const dist = Math.hypot(hook.x - fish.x, hook.y - fish.y);
        
        if (dist < fish.radius) { 
          hook.state = 'retracting';
          hook.caughtEntity = fish;
          this.state.fishes.splice(i, 1);
          break;
        }
      }
    } 
    else if (hook.state === 'retracting') {
      let vBase = baseSpeed * 1.5;
      let weight = hook.caughtEntity ? hook.caughtEntity.weight : 1.0;
      let retractSpeed = (vBase / weight) * deltaTime;

      hook.length -= retractSpeed;

      if (hook.length <= 0) {
        hook.length = 0;
        hook.state = 'idle';
        
        if (hook.caughtEntity) {
          this.state.score += hook.caughtEntity.value;
          this.onScoreUpdate(this.state.score);
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

    for (let i = this.state.fishes.length - 1; i >= 0; i--) {
      const fish = this.state.fishes[i];
      // fish.direction: 1 moves right, -1 moves left
      fish.x += (fish.speed + levelSpeedBonus) * fish.direction * (deltaTime / 16);

      if (fish.direction === 1 && fish.x > CANVAS_WIDTH + 50) {
        this.state.fishes.splice(i, 1);
      } else if (fish.direction === -1 && fish.x < -50) {
        this.state.fishes.splice(i, 1);
      }
    }
  }

  private spawnFishes(deltaTime: number) {
    const spawnChance = 0.02 + (this.state.island * 0.005);
    
    if (Math.random() < spawnChance) {
      const rand = Math.random();
      let fishClass: FishClass;

      if (rand > 0.98) fishClass = 'legendary';
      else if (rand > 0.90) fishClass = 'epic';
      else if (rand > 0.75) fishClass = 'rare';
      else if (rand > 0.50) fishClass = 'common';
      else fishClass = 'trash';

      const config = OBJECT_MATRIX[fishClass];
      const name = config.names[Math.floor(Math.random() * config.names.length)];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      const speed = 1.0 * config.speedMultiplier;
      const y = SEA_LEVEL_Y + 50 + Math.random() * (CANVAS_HEIGHT - SEA_LEVEL_Y - 100);
      
      // Spawn from left or right
      const direction = Math.random() > 0.5 ? 1 : -1;
      const x = direction === 1 ? -50 : CANVAS_WIDTH + 50;

      this.state.fishes.push({
        id: Math.random(),
        type: fishClass,
        name,
        x,
        y,
        speed,
        value: config.value,
        weight: config.weightMultiplier,
        color,
        radius: config.radius,
        direction
      });
    }
  }

  private checkIslandProgress() {
    if (this.state.score >= this.state.fuelCost) {
      this.state.isPlaying = false;
      this.onIslandComplete(this.state.island);
    } else {
      this.state.isPlaying = false;
      this.onGameOver(this.state.score, this.state.island);
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Sky (25%)
    const gradient = this.ctx.createLinearGradient(0, 0, 0, SEA_LEVEL_Y);
    gradient.addColorStop(0, '#bae6fd');
    gradient.addColorStop(1, '#f0f9ff');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, SEA_LEVEL_Y);

    // 2. Draw Sea (75%)
    this.ctx.fillStyle = '#006994';
    this.ctx.fillRect(0, SEA_LEVEL_Y, CANVAS_WIDTH, CANVAS_HEIGHT - SEA_LEVEL_Y);
    
    // Water shine
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 2;
    for(let i=0; i<10; i++) {
        const y = SEA_LEVEL_Y + 20 + i * 50;
        const offset = (Date.now() / 50 + i * 30) % CANVAS_WIDTH;
        this.ctx.beginPath();
        this.ctx.moveTo(offset, y);
        this.ctx.lineTo(offset + 50, y);
        this.ctx.stroke();
    }

    // 3. Draw Boat
    this.ctx.fillStyle = '#8B4513';
    this.ctx.beginPath();
    this.ctx.arc(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 10, 40, 0, Math.PI, false);
    this.ctx.fill();
    
    // 4. Draw Fisherman
    this.ctx.fillStyle = '#fca5a5';
    this.ctx.beginPath();
    this.ctx.arc(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 30, 10, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Draw Hook Line
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 30);
    this.ctx.lineTo(this.state.hook.x, this.state.hook.y);
    this.ctx.stroke();

    // 6. Draw Hook Head
    this.ctx.fillStyle = '#aaa';
    this.ctx.beginPath();
    this.ctx.arc(this.state.hook.x, this.state.hook.y, 6, 0, Math.PI * 2);
    this.ctx.fill();

    // 7. Draw Caught Entity
    if (this.state.hook.caughtEntity) {
      const entity = this.state.hook.caughtEntity;
      entity.x = this.state.hook.x;
      entity.y = this.state.hook.y + 10;
      this.drawEntity(entity.x, entity.y, entity.radius, entity.color, entity.type, true);
    }

    // 8. Draw Swimming Entities
    for (const fish of this.state.fishes) {
      this.drawEntity(fish.x, fish.y, fish.radius, fish.color, fish.type);
    }
  }

  private drawEntity(x: number, y: number, radius: number, color: string, type: FishClass, isCaught: boolean = false) {
    this.ctx.fillStyle = color;
    this.ctx.save();
    this.ctx.translate(x, y);
    if (isCaught) {
       this.ctx.rotate(Math.PI / 2);
    }

    if (type === 'trash') {
        this.ctx.beginPath();
        this.ctx.moveTo(-radius, 0);
        this.ctx.lineTo(-radius/2, -radius);
        this.ctx.lineTo(radius/2, -radius*0.8);
        this.ctx.lineTo(radius, 0);
        this.ctx.lineTo(radius/2, radius*0.8);
        this.ctx.lineTo(-radius/2, radius);
        this.ctx.closePath();
        this.ctx.fill();
    } else if (type === 'legendary') {
       this.ctx.fillRect(-radius, -radius/1.5, radius*2, radius*1.5);
       this.ctx.strokeStyle = '#e9ecef';
       this.ctx.lineWidth = 2;
       this.ctx.strokeRect(-radius, -radius/1.5, radius*2, radius*1.5);
    } else {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 1.5, radius, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(radius, 0);
        this.ctx.lineTo(radius + 10, -10);
        this.ctx.lineTo(radius + 10, 10);
        this.ctx.fill();
    }

    this.ctx.restore();
  }
}
