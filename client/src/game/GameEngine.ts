import { type GameState, type Entity, type FishClass, OBJECT_MATRIX } from "./types";

export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;
export const SEA_LEVEL_Y = CANVAS_HEIGHT * 0.25;

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private lastFrameTime: number = 0;
  private onGameOver: (score: number, island: number) => void;
  private onScoreUpdate: (score: number) => void;
  private onIslandComplete: (island: number) => void;
  private arrivalProgress: number = 0;
  private isArriving: boolean = false;

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
    this.isArriving = false;
    this.arrivalProgress = 0;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  stop() {
    this.state.isPlaying = false;
  }

  handleInput() {
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
    if (this.isArriving) {
      this.arrivalProgress += deltaTime / 2000;
      if (this.arrivalProgress >= 1) {
        this.arrivalProgress = 1;
        this.state.isPlaying = false;
        this.onIslandComplete(this.state.island);
      }
      return;
    }

    if (this.state.timeRemaining > 0) {
      this.state.timeRemaining -= deltaTime / 1000;
    } else {
      this.isArriving = true;
      this.state.hook.state = 'idle';
    }

    this.updateHook(deltaTime);
    this.updateFishes(deltaTime);
    this.spawnFishes(deltaTime);
  }

  private updateHook(deltaTime: number) {
    const hook = this.state.hook;
    const baseSpeed = 0.5;

    if (hook.state === 'idle') {
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
          this.state.inventory.push({
            id: Math.random().toString(),
            type: hook.caughtEntity.type,
            name: hook.caughtEntity.name,
            value: hook.caughtEntity.value
          });
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
    // Boat upgrade bonus: can increase luck or reduce speed difficulty, but here we just flow
    const travelSpeed = 2 + levelSpeedBonus;

    for (let i = this.state.fishes.length - 1; i >= 0; i--) {
      const fish = this.state.fishes[i];
      // All entities flow left due to relative motion
      fish.x -= (fish.speed + travelSpeed) * (deltaTime / 16);

      if (fish.x < -100) {
        this.state.fishes.splice(i, 1);
      }
    }
  }

  private spawnFishes(deltaTime: number) {
    const spawnChance = 0.03 + (this.state.island * 0.005);
    
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
      const y = SEA_LEVEL_Y + 50 + Math.random() * (CANVAS_HEIGHT - SEA_LEVEL_Y - 150);
      
      this.state.fishes.push({
        id: Math.random(),
        type: fishClass,
        name,
        x: CANVAS_WIDTH + 100,
        y,
        speed,
        value: config.value,
        weight: config.weightMultiplier,
        color,
        radius: config.radius,
        direction: -1
      });
    }
  }

  private checkIslandProgress() {
    // Moved logic to update isArriving
  }

  private draw() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Sky Gradient
    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, SEA_LEVEL_Y);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#FFFFFF');
    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, SEA_LEVEL_Y);

    this.drawSun(CANVAS_WIDTH - 60, 50);
    this.drawCloud(60, 40, 40);
    this.drawCloud(150, 60, 30);
    this.drawCloud(300, 45, 35);

    // 2. Draw Sea Gradient with Wave
    const seaGradient = this.ctx.createLinearGradient(0, SEA_LEVEL_Y, 0, CANVAS_HEIGHT);
    seaGradient.addColorStop(0, '#40E0D0');
    seaGradient.addColorStop(1, '#1E90FF');
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
    
    // Bottom Sand
    this.ctx.fillStyle = '#FFE1A1';
    this.ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);

    // Draw Arrival Island
    if (this.isArriving) {
      const islandX = CANVAS_WIDTH - (this.arrivalProgress * 150);
      this.ctx.fillStyle = '#98FB98'; // Pastel Green
      this.ctx.beginPath();
      this.ctx.moveTo(islandX, SEA_LEVEL_Y);
      this.ctx.quadraticCurveTo(islandX + 100, SEA_LEVEL_Y - 20, islandX + 200, SEA_LEVEL_Y);
      this.ctx.lineTo(islandX + 200, CANVAS_HEIGHT);
      this.ctx.lineTo(islandX - 50, CANVAS_HEIGHT);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // 3. Draw Boat & Fisherman
    this.ctx.save();
    if (this.isArriving) {
      this.ctx.translate(this.arrivalProgress * 100, 0);
    }
    
    // Detailed Boat
    this.ctx.fillStyle = '#D4A373';
    this.ctx.strokeStyle = '#5c2d0c';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS_WIDTH / 2 - 60, SEA_LEVEL_Y);
    this.ctx.bezierCurveTo(CANVAS_WIDTH / 2 - 60, SEA_LEVEL_Y + 40, CANVAS_WIDTH / 2 + 60, SEA_LEVEL_Y + 40, CANVAS_WIDTH / 2 + 60, SEA_LEVEL_Y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    this.drawFisherman();
    this.drawFishingRod();

    // 5. Draw Hook Line
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS_WIDTH / 2, SEA_LEVEL_Y - 40);
    this.ctx.lineTo(this.state.hook.x, this.state.hook.y);
    this.ctx.stroke();

    this.drawHookHead(this.state.hook.x, this.state.hook.y);

    if (this.state.hook.caughtEntity) {
      const entity = this.state.hook.caughtEntity;
      entity.x = this.state.hook.x;
      entity.y = this.state.hook.y + 15;
      this.drawEntity(entity.x, entity.y, entity.radius, entity.color, entity.type, true);
    }
    
    this.ctx.restore();

    // 8. Draw Swimming Entities
    for (const fish of this.state.fishes) {
      this.drawEntity(fish.x, fish.y, fish.radius, fish.color, fish.type);
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
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.arc(x + r, y - r/2, r * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x - r, y - r/2, r * 0.8, 0, Math.PI * 2);
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
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(this.state.hook.angle - Math.PI / 2);
    
    // Premium Rod Gradient
    const rodGrad = this.ctx.createLinearGradient(0, 0, 0, rodLength);
    rodGrad.addColorStop(0, '#8B4513');
    rodGrad.addColorStop(1, '#A0522D');
    this.ctx.strokeStyle = rodGrad;
    
    this.ctx.lineWidth = 4;
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

  private drawHookHead(x: number, y: number) {
    this.ctx.strokeStyle = '#777';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y - 5, 8, 0, Math.PI * 0.8);
    this.ctx.stroke();
    
    // Bait detail
    this.ctx.fillStyle = '#FF6347';
    this.ctx.beginPath();
    this.ctx.arc(x + 5, y - 2, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawEntity(x: number, y: number, radius: number, color: string, type: FishClass, isCaught: boolean = false) {
    this.ctx.save();
    const time = performance.now() * 0.005;
    const wobble = isCaught ? 0 : Math.sin(time + x * 0.05) * 5;
    this.ctx.translate(x, y + wobble);
    if (isCaught) this.ctx.rotate(Math.PI / 2);

    // Dynamic Shadow based on depth
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = 'rgba(0,0,0,0.25)';

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2.5;

    if (type === 'trash') {
        // More detailed trash (Old Can)
        const canGrad = this.ctx.createLinearGradient(-radius, -radius, radius, radius);
        canGrad.addColorStop(0, '#A0A0A0');
        canGrad.addColorStop(1, '#707070');
        this.ctx.fillStyle = canGrad;
        this.ctx.beginPath();
        this.ctx.roundRect(-radius, -radius, radius * 1.5, radius * 2, 4);
        this.ctx.fill();
        this.ctx.stroke();
        // Dents
        this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
        this.ctx.beginPath();
        this.ctx.arc(-radius/2, -radius/2, radius/3, 0, Math.PI * 2);
        this.ctx.fill();
    } else if (type === 'legendary') {
       // High-Premium Treasure Chest
       const gradient = this.ctx.createLinearGradient(-radius, -radius, radius, radius);
       gradient.addColorStop(0, '#FFD700');
       gradient.addColorStop(0.5, '#F1C40F');
       gradient.addColorStop(1, '#B8860B');
       this.ctx.fillStyle = gradient;
       
       this.ctx.beginPath();
       this.ctx.roundRect(-radius, -radius/1.5, radius*2, radius*1.5, 8);
       this.ctx.fill();
       this.ctx.stroke();
       
       // Decorative iron bands
       this.ctx.fillStyle = '#4A3728';
       this.ctx.fillRect(-radius + 8, -radius/1.5, 12, radius*1.5);
       this.ctx.fillRect(radius - 20, -radius/1.5, 12, radius*1.5);
       
       // Keyhole plate
       this.ctx.fillStyle = '#DAA520';
       this.ctx.beginPath();
       this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
       this.ctx.fill();
       this.ctx.stroke();
       this.ctx.fillStyle = '#000';
       this.ctx.fillRect(-1.5, 0, 3, 5);

       // Sparkle effects
       if (Math.sin(time * 4) > 0.6) {
         this.drawStar(radius * 0.6, -radius * 0.9, 4, 10, 3);
         this.drawStar(-radius * 0.7, -radius * 0.4, 4, 6, 2);
       }
    } else {
        // High-Premium Fish with iridescent shading
        const fishGrad = this.ctx.createRadialGradient(-radius * 0.6, -radius * 0.6, 0, 0, 0, radius * 2);
        fishGrad.addColorStop(0, 'rgba(255,255,255,0.5)');
        fishGrad.addColorStop(0.3, color);
        fishGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
        this.ctx.fillStyle = fishGrad;

        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 1.5, radius, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Flowing Fins
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -radius);
        this.ctx.bezierCurveTo(radius * 0.5, -radius * 1.8, radius * 1.2, -radius * 1.5, radius, -radius * 0.5);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Fancy Tail
        this.ctx.beginPath();
        this.ctx.moveTo(radius * 1.2, 0);
        this.ctx.bezierCurveTo(radius * 2.2, -radius * 1.2, radius * 2.2, radius * 1.2, radius * 1.2, 0);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Multi-layered Kawaii Eye
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(-radius * 0.75, -radius * 0.2, 7.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(-radius * 0.75, -radius * 0.2, 4.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Three-point eye shine
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(-radius * 0.85, -radius * 0.35, 2.5, 0, Math.PI * 2);
        this.ctx.arc(-radius * 0.65, -radius * 0.1, 1.2, 0, Math.PI * 2);
        this.ctx.arc(-radius * 0.75, 0, 0.8, 0, Math.PI * 2);
        this.ctx.fill();

        // Rosy blush with soft edges
        const blushGrad = this.ctx.createRadialGradient(-radius * 0.4, 0, 0, -radius * 0.4, 0, 6);
        blushGrad.addColorStop(0, 'rgba(255, 100, 150, 0.5)');
        blushGrad.addColorStop(1, 'rgba(255, 100, 150, 0)');
        this.ctx.fillStyle = blushGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(-radius * 0.4, 0, 6, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    this.ctx.restore();
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
