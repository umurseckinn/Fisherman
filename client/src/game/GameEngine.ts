import { type GameState, EntityType, FishType } from "./types";

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
    // 1. Update Timer
    if (this.state.timeRemaining > 0) {
      this.state.timeRemaining -= deltaTime / 1000;
    } else {
      this.checkIslandProgress();
    }

    // 2. Update Hook
    this.updateHook(deltaTime);

    // 3. Update Fishes
    this.updateFishes(deltaTime);

    // 4. Spawner
    this.spawnFishes(deltaTime);
  }

  private updateHook(deltaTime: number) {
    const hook = this.state.hook;
    const speed = 0.5 * deltaTime; // base speed

    if (hook.state === 'idle') {
      // Oscillate between 10 and 170 degrees (converted to radians)
      const minAngle = Math.PI * 0.1;
      const maxAngle = Math.PI * 0.9;
      
      if (hook.direction === 1) {
        hook.angle += 0.002 * deltaTime;
        if (hook.angle >= maxAngle) hook.direction = -1;
      } else {
        hook.angle -= 0.002 * deltaTime;
        if (hook.angle <= minAngle) hook.direction = 1;
      }
      
      // Reset position to boat
      hook.x = CANVAS_WIDTH / 2;
      hook.y = SEA_LEVEL_Y;
      hook.length = 0;
    } 
    else if (hook.state === 'shooting') {
      hook.length += speed * 1.5;
      hook.x = CANVAS_WIDTH / 2 + Math.cos(hook.angle) * hook.length;
      hook.y = SEA_LEVEL_Y + Math.sin(hook.angle) * hook.length;

      // Check collision with walls or sea floor
      if (hook.x < 0 || hook.x > CANVAS_WIDTH || hook.y > CANVAS_HEIGHT) {
        hook.state = 'retracting';
      }

      // Check collision with fishes
      for (let i = 0; i < this.state.fishes.length; i++) {
        const fish = this.state.fishes[i];
        const dist = Math.hypot(hook.x - fish.x, hook.y - fish.y);
        
        // Simple circle collision
        if (dist < 30) { 
          hook.state = 'retracting';
          hook.caughtEntity = fish;
          this.state.fishes.splice(i, 1);
          break; // Catch one at a time
        }
      }
    } 
    else if (hook.state === 'retracting') {
      let retractSpeed = speed * 1.5;
      
      // Heavy items slow down retraction
      if (hook.caughtEntity) {
        if (hook.caughtEntity.weight === 'heavy') retractSpeed *= 0.3;
        if (hook.caughtEntity.weight === 'medium') retractSpeed *= 0.7;
      }

      hook.length -= retractSpeed;

      if (hook.length <= 0) {
        hook.length = 0;
        hook.state = 'idle';
        
        // Process catch
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
    // Difficulty multiplier based on island
    const speedMult = 1 + (this.state.island - 1) * 0.2;

    for (let i = this.state.fishes.length - 1; i >= 0; i--) {
      const fish = this.state.fishes[i];
      fish.x -= fish.speed * speedMult * (deltaTime / 16); // Move left

      // Remove if off screen
      if (fish.x < -50) {
        this.state.fishes.splice(i, 1);
      }
    }
  }

  private spawnFishes(deltaTime: number) {
    // Spawn rate increases with island level
    const spawnChance = 0.02 + (this.state.island * 0.005);
    
    if (Math.random() < spawnChance) {
      const rand = Math.random();
      let type: FishType;
      let y = SEA_LEVEL_Y + 50 + Math.random() * (CANVAS_HEIGHT - SEA_LEVEL_Y - 100);
      let speed = 1;
      let value = 10;
      let weight: 'light' | 'medium' | 'heavy' = 'medium';
      let color = '#FF6B6B'; // Red (Normal)
      let radius = 20;

      if (rand > 0.95) {
        type = 'treasure';
        value = 100;
        speed = 2.5;
        weight = 'light';
        color = '#FFD93D'; // Gold
        radius = 15;
      } else if (rand > 0.8) {
        type = 'gold';
        value = 50;
        speed = 2;
        weight = 'light';
        color = '#FFD93D'; // Gold
        radius = 15;
      } else if (rand > 0.6) {
        type = 'trash';
        value = 0;
        speed = 0.5;
        weight = 'heavy';
        color = '#868e96'; // Grey
        radius = 25;
      } else {
        type = 'normal';
        value = 10;
        speed = 1 + Math.random();
        weight = 'medium';
        color = '#FF6B6B';
        radius = 20;
      }

      this.state.fishes.push({
        id: Math.random(),
        type,
        x: CANVAS_WIDTH + 50,
        y,
        speed,
        value,
        weight,
        color,
        radius
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
    // Clear
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Sky
    const gradient = this.ctx.createLinearGradient(0, 0, 0, SEA_LEVEL_Y);
    gradient.addColorStop(0, '#bae6fd'); // Sky start
    gradient.addColorStop(1, '#f0f9ff'); // Sky end
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, SEA_LEVEL_Y);

    // 2. Draw Sea
    this.ctx.fillStyle = '#006994';
    this.ctx.fillRect(0, SEA_LEVEL_Y, CANVAS_WIDTH, CANVAS_HEIGHT - SEA_LEVEL_Y);
    
    // Add some water shine lines
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
    // Mast
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 10);
    this.ctx.lineTo(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 60);
    this.ctx.strokeStyle = '#5c2d0c';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    // 4. Draw Fisherman
    this.ctx.fillStyle = '#fca5a5';
    this.ctx.beginPath();
    this.ctx.arc(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 30, 10, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Draw Hook Line
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 30); // Start at fisherman
    this.ctx.lineTo(this.state.hook.x, this.state.hook.y);
    this.ctx.stroke();

    // 6. Draw Hook Head
    this.ctx.fillStyle = '#aaa';
    this.ctx.beginPath();
    this.ctx.arc(this.state.hook.x, this.state.hook.y, 6, 0, Math.PI * 2);
    this.ctx.fill();

    // 7. Draw Caught Entity (if any)
    if (this.state.hook.caughtEntity) {
      const entity = this.state.hook.caughtEntity;
      this.drawFish(entity.x, entity.y, entity.radius, entity.color, entity.type, true);
      // Keep entity attached to hook visually
      entity.x = this.state.hook.x;
      entity.y = this.state.hook.y + 10;
    }

    // 8. Draw Swimming Fishes
    for (const fish of this.state.fishes) {
      this.drawFish(fish.x, fish.y, fish.radius, fish.color, fish.type);
    }
  }

  private drawFish(x: number, y: number, radius: number, color: string, type: FishType, isCaught: boolean = false) {
    this.ctx.fillStyle = color;
    this.ctx.save();
    this.ctx.translate(x, y);
    if (!isCaught) {
       // Face left
       this.ctx.scale(1, 1); 
    } else {
       // Rotate 90deg if caught
       this.ctx.rotate(Math.PI / 2);
    }

    if (type === 'trash') {
        // Draw Rock
        this.ctx.beginPath();
        this.ctx.moveTo(-radius, 0);
        this.ctx.lineTo(-radius/2, -radius);
        this.ctx.lineTo(radius/2, -radius*0.8);
        this.ctx.lineTo(radius, 0);
        this.ctx.lineTo(radius/2, radius*0.8);
        this.ctx.lineTo(-radius/2, radius);
        this.ctx.closePath();
        this.ctx.fill();
        // Cracks
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-5, -5);
        this.ctx.lineTo(5, 5);
        this.ctx.stroke();
    } else if (type === 'treasure') {
       // Chest
       this.ctx.fillRect(-radius, -radius/1.5, radius*2, radius*1.5);
       this.ctx.strokeStyle = '#e9ecef';
       this.ctx.lineWidth = 2;
       this.ctx.strokeRect(-radius, -radius/1.5, radius*2, radius*1.5);
       this.ctx.fillStyle = '#e9ecef';
       this.ctx.beginPath();
       this.ctx.arc(0, -5, 3, 0, Math.PI*2);
       this.ctx.fill();
    } else {
        // Draw Fish Body
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 1.5, radius, 0, 0, Math.PI * 2);
        this.ctx.fill();
        // Tail
        this.ctx.beginPath();
        this.ctx.moveTo(radius, 0);
        this.ctx.lineTo(radius + 10, -10);
        this.ctx.lineTo(radius + 10, 10);
        this.ctx.fill();
        // Eye
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(-radius/2, -radius/4, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(-radius/2, -radius/4, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    this.ctx.restore();
  }
}
