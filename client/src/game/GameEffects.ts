/**
 * GameEffects.ts — Tüm animasyon ve feedback sistemleri
 * mechanical.md talimatlarına göre yazıldı.
 *
 * Kullanım:
 *   const effects = new GameEffects();
 *   // Her frame:
 *   effects.update(deltaTime, timestamp);
 *   effects.draw(ctx);          // flash overlay + ring efektleri (en üstte)
 *   effects.drawUnder(ctx);     // su trail'leri (balıkların altında)
 */

// ─── Easing fonksiyonları ────────────────────────────────────────────────────
export const Easing = {
    /** Yay/overshoot hissi */
    easeOutBack: (t: number): number => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    /** Hızlı sönümleme */
    easeOutExpo: (t: number): number =>
        t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    /** Elastik titreme */
    easeOutElastic: (t: number): number => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1
            : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    /** Düz */
    linear: (t: number): number => t,
};

// ─── Tür tanımlamaları ───────────────────────────────────────────────────────
export type ParticleType = 'circle' | 'star' | 'ring' | 'trail' | 'drop' | 'line';

export interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    life: number;     // 0→1 (1=tam, 0=ölü)
    duration: number; // ms
    elapsed: number;  // ms
    size: number;
    color: string;
    type: ParticleType;
    ringRadius?: number;     // 'ring' tipi için
    ringMaxRadius?: number;
    opacity?: number;
    rotation?: number;
    rotationSpeed?: number;
}

export interface Tween {
    from: number;
    to: number;
    elapsed: number;
    duration: number;
    easing: (t: number) => number;
    onUpdate: (value: number) => void;
    onComplete?: () => void;
    done: boolean;
}

// ─── Ana sınıf ───────────────────────────────────────────────────────────────
export class GameEffects {
    /** Lava çarpması */
    spawnLavaHit(x: number, y: number): void {
        this.shakeScreen(6, 4);
        this.flashOverlay('#FF4500', 0.35, 200);
        this.spawnCircles(x, y, 6, '#FF4500', 7, 3, 450);
    }

    // Screen shake
    private shakeX = 0;
    private shakeY = 0;
    private shakeMag = 0;
    private shakeDecay = 0.85;
    private shakeFrames = 0;

    // Hit-stop
    private hitStopMs = 0;
    /** Dışarıdan okunur: mantık güncellenmeli mi? */
    public isHitStopped = false;

    // Flash overlay
    private flashColor = 'rgba(255,255,255,0)';
    private flashOpacity = 0;
    private flashDecayRate = 0.12; // frame başına düşüş

    // Zoom pulse
    private zoomScale = 1;
    private zoomTween: Tween | null = null;

    // Tekne bob
    private boatBobOffset = 0;
    private boatBobTween: Tween | null = null;

    // Olta ucu mikro titreme (ambient)
    private readonly rodTipMicroX = 0;
    private readonly rodTipMicroY = 0;
    public rodTipTweakX = 0;
    public rodTipTweakY = 0;

    // Misina kontrol noktaları (4 nokta, tip→hook arası)
    // Her biri {x, y} — tip noktasından başlar, hook'a kadar lerp edilir
    private lineCtrl: Array<{ x: number; y: number }> = [
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ];
    private lineCtrlTarget: Array<{ x: number; y: number }> = [
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ];

    // Partiküller (maks 15 aktif)
    private particles: Particle[] = [];
    private readonly MAX_PARTICLES = 15;

    // "LEGENDARY!" text
    private legendaryOpacity = 0;
    private legendaryScale = 0;
    private legendaryMs = 0;
    private canvasW = 450;
    private canvasH = 800;

    // Aktif tween'ler
    private tweens: Tween[] = [];

    // Su yüzeyi blip
    private waterBlips: Array<{ x: number; y: number; r: number; life: number; elapsed: number; duration: number }> = [];
    private nextBlipMs = 3000 + Math.random() * 1000;
    private blipTimer = 0;

    // Motion trail (Zap, Tide, King gibi hızlı balıklar için)
    public trailHistory: Array<Array<{ x: number; y: number; color: string }>> = [];

    constructor(canvasW = 450, canvasH = 800) {
        this.canvasW = canvasW;
        this.canvasH = canvasH;
    }

    // ─── Tween yönetimi ───────────────────────────────────────────────────────
    addTween(t: Omit<Tween, 'elapsed' | 'done'>): void {
        this.tweens.push({ ...t, elapsed: 0, done: false });
    }

    private updateTweens(delta: number): void {
        for (const tw of this.tweens) {
            if (tw.done) continue;
            tw.elapsed = Math.min(tw.elapsed + delta, tw.duration);
            const t = Easing.easeOutExpo(tw.elapsed / tw.duration);
            tw.onUpdate(tw.from + (tw.to - tw.from) * tw.easing(tw.elapsed / tw.duration));
            if (tw.elapsed >= tw.duration) {
                tw.done = true;
                tw.onComplete?.();
            }
        }
        this.tweens = this.tweens.filter(tw => !tw.done || false);
    }

    // ─── Partikül ekleme ─────────────────────────────────────────────────────
    private addParticle(p: Omit<Particle, 'elapsed' | 'life'>): void {
        // Toplam limiti aşma
        if (this.particles.length >= this.MAX_PARTICLES) {
            this.particles.splice(0, 1); // en eskiyi sil
        }
        this.particles.push({ ...p, elapsed: 0, life: 1 });
    }

    /** 4-noktalı yıldız */
    private spawnStars(x: number, y: number, count: number, color: string, size = 6, speed = 3.5, duration = 400): void {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const s = 0.7 + Math.random() * 0.6;
            this.addParticle({
                x, y, vx: Math.cos(angle) * speed * s, vy: Math.sin(angle) * speed * s - 1,
                size, color, type: 'star', duration, rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
            });
        }
    }

    /** Daire partikülleri */
    private spawnCircles(x: number, y: number, count: number, color: string, size = 8, speed = 2.5, duration = 500): void {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const s = 0.5 + Math.random() * 1;
            this.addParticle({
                x, y, vx: Math.cos(angle) * speed * s, vy: Math.sin(angle) * speed * s - 1.5,
                size, color, type: 'circle', duration,
            });
        }
    }

    /** Su halkası */
    private spawnRing(x: number, y: number, maxRadius = 30, duration = 400, color = 'rgba(120,200,255,0.8)'): void {
        this.addParticle({
            x, y, vx: 0, vy: 0,
            size: 1, color, type: 'ring', duration,
            ringRadius: 5, ringMaxRadius: maxRadius,
        });
    }

    /** Splash (su girişi) */
    spawnSplash(x: number, y: number): void {
        // 6-8 beyaz damlacık dışa doğru
        const count = 6 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
            const s = 2 + Math.random() * 3;
            this.addParticle({
                x, y, vx: Math.cos(angle) * s, vy: Math.sin(angle) * s - 3,
                size: 3 + Math.random() * 3, color: '#A0D8EF', type: 'drop', duration: 350,
            });
        }
        // İki konsantrik halka
        this.spawnRing(x, y, 22, 380);
        this.spawnRing(x, y, 38, 450, 'rgba(120,200,255,0.5)');
    }

    /** Su çıkışı halka efekti */
    spawnExitSplash(x: number, y: number): void {
        this.spawnRing(x, y, 18, 300);
        for (let i = 0; i < 4; i++) {
            const angle = -Math.PI * 0.6 + (i / 3) * Math.PI * 0.8;
            this.addParticle({
                x, y, vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 2 - 3,
                size: 4, color: '#A0D8EF', type: 'drop', duration: 300,
            });
        }
    }

    /** Küçük balık yakalandı efekti */
    spawnSmallCatch(x: number, y: number, color: string): void {
        this.spawnStars(x, y, 4, color, 6, 3, 400);
    }

    /** Orta balık yakalandı efekti */
    spawnMediumCatch(x: number, y: number, color: string): void {
        this.shakeScreen(4, 5);
        this.flashOverlay(color, 0.30, 150);
        this.spawnStars(x, y, 8, color, 7, 4, 500);
        this.spawnCircles(x, y, 3, color, 12, 3, 500);
    }

    /** Büyük/nadir balık yakalandı efekti */
    spawnRareCatch(x: number, y: number, color: string, isKing = false): void {
        this.hitStop(isKing ? 120 : 80);
        this.shakeScreen(isKing ? 9 : 7, isKing ? 6 : 5);
        this.flashOverlay(color, 0.40, 200);
        this.zoomPulse();
        this.spawnStars(x, y, 12, color, 9, 5, 600);
        this.spawnCircles(x, y, 6, color, 14, 4, 600);
        // Büyük beyaz parlama
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i) / 4;
            this.addParticle({
                x, y, vx: Math.cos(angle) * 1.5, vy: Math.sin(angle) * 1.5,
                size: 20, color: '#FFFFFF', type: 'circle', duration: 250,
            });
        }
        if (isKing) {
            this.flashOverlay('#FFD700', 1.0, 80);
            this.legendaryMs = 600;
            this.legendaryOpacity = 1;
            this.legendaryScale = 0;
        }
    }

    /** TNT Patlaması */
    spawnExplosion(tx: number, ty: number): void {
        this.shakeScreen(15, 12);
        this.flashOverlay('#FFD700', 0.6, 250);
        this.spawnCircles(tx, ty, 12, '#FF4500', 15, 6, 800);
        this.spawnCircles(tx, ty, 8, '#FFA500', 10, 4, 600);
        this.spawnRing(tx, ty, 120, 500, 'rgba(255,165,0,0.4)');
    }

    /** Kelp çarpması */
    spawnKelpHit(x: number, y: number): void {
        this.spawnCircles(x, y, 3, '#7ED957', 5, 2, 350);
    }

    /** Kaya çarpması */
    spawnRockHit(x: number, y: number): void {
        this.shakeScreen(2, 2);
        this.spawnStars(x, y, 4, '#FFD700', 5, 4, 250);
    }

    /** Coral çarpması */
    spawnCoralHit(x: number, y: number): void {
        this.shakeScreen(5, 3);
        this.flashOverlay('#FF4444', 0.25, 180);
        this.spawnCircles(x, y, 5, '#FF7043', 6, 3, 400);
    }

    // ─── Screen shake ─────────────────────────────────────────────────────────
    shakeScreen(magnitude: number, frames = 4): void {
        this.shakeMag = magnitude;
        this.shakeFrames = frames;
    }

    /** ctx.translate çağrısını yapar, her frame %85 decay */
    applyShake(ctx: CanvasRenderingContext2D): void {
        if (this.shakeFrames > 0) {
            this.shakeX = (Math.random() * 2 - 1) * this.shakeMag;
            this.shakeY = (Math.random() * 2 - 1) * this.shakeMag;
            this.shakeFrames--;
            if (this.shakeFrames === 0) { this.shakeMag = 0; }
        } else {
            this.shakeX *= this.shakeDecay;
            this.shakeY *= this.shakeDecay;
        }
        ctx.translate(this.shakeX, this.shakeY);
    }

    // ─── Hit-stop ─────────────────────────────────────────────────────────────
    hitStop(ms: number): void {
        this.hitStopMs = ms;
        this.isHitStopped = true;
    }

    // ─── Flash overlay ────────────────────────────────────────────────────────
    flashOverlay(color: string, opacity: number, durationMs: number): void {
        this.flashColor = color;
        this.flashOpacity = opacity;
        this.flashDecayRate = opacity / (durationMs / 16.66);
    }

    // ─── Zoom pulse ───────────────────────────────────────────────────────────
    private zoomPulse(): void {
        this.zoomScale = 1;
        this.addTween({
            from: 1, to: 1.04, duration: 120, easing: Easing.easeOutExpo,
            onUpdate: v => { this.zoomScale = v; },
            onComplete: () => {
                this.addTween({
                    from: 1.04, to: 1, duration: 150, easing: Easing.easeOutExpo,
                    onUpdate: v => { this.zoomScale = v; },
                });
            },
        });
    }

    // ─── Tekne bob ────────────────────────────────────────────────────────────
    triggerBoatBob(): void {
        this.boatBobOffset = 0;
        this.addTween({
            from: 0, to: 5, duration: 120, easing: Easing.easeOutBack,
            onUpdate: v => { this.boatBobOffset = v; },
            onComplete: () => {
                this.addTween({
                    from: 5, to: 0, duration: 300, easing: Easing.easeOutElastic,
                    onUpdate: v => { this.boatBobOffset = v; },
                });
            },
        });
    }

    /** Mevcut tekne bob değeri (Y'ye eklenecek) */
    get boatBobY(): number { return this.boatBobOffset; }

    // ─── Su yüzeyi blip ───────────────────────────────────────────────────────
    private spawnWaterBlip(): void {
        const x = 30 + Math.random() * (this.canvasW - 60);
        const y = /* SEA_LEVEL_Y */ this.canvasH * 0.25;
        this.waterBlips.push({ x, y, r: 8, life: 1, elapsed: 0, duration: 600 });
    }

    // ─── Misina kontrol noktaları güncelleme ─────────────────────────────────
    updateLinePhysics(tipX: number, tipY: number, hookX: number, hookY: number): void {
        // Kontrol noktaları tip ve hook arasında eşit dağıtılmış olacak
        for (let i = 0; i < 4; i++) {
            const t = (i + 1) / 5;
            this.lineCtrlTarget[i].x = tipX + (hookX - tipX) * t;
            this.lineCtrlTarget[i].y = tipY + (hookY - tipY) * t;
        }
        // %45 lerp
        for (let i = 0; i < 4; i++) {
            this.lineCtrl[i].x += (this.lineCtrlTarget[i].x - this.lineCtrl[i].x) * 0.45;
            this.lineCtrl[i].y += (this.lineCtrlTarget[i].y - this.lineCtrl[i].y) * 0.45 + Math.sin(Date.now() * 0.004 + i) * 1.5;
        }
    }

    /** Fiziksel misina çizer (GameEngine'deki lineTo yerine bunu kullan) */
    drawPhysicsLine(ctx: CanvasRenderingContext2D, tipX: number, tipY: number, hookX: number, hookY: number, lineWidth: number, color = '#555555'): void {
        this.updateLinePhysics(tipX, tipY, hookX, hookY);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        const pts = this.lineCtrl;
        // Catmull-Rom benzeri yaklaşım: quadraticCurveTo ile çiz
        ctx.quadraticCurveTo(pts[0].x, pts[0].y, pts[1].x, pts[1].y);
        ctx.quadraticCurveTo(pts[2].x, pts[2].y, pts[3].x, pts[3].y);
        ctx.lineTo(hookX, hookY);
        ctx.stroke();
        ctx.restore();
    }

    // ─── Motion trail (hızlı balıklar) ───────────────────────────────────────
    /** Her frame çağrılır, hızlı balıklar (Zap, Tide, King) için trail bırakır */
    updateTrail(entityId: number, x: number, y: number, color: string): void {
        if (!this.trailHistory[entityId]) this.trailHistory[entityId] = [];
        const trail = this.trailHistory[entityId];
        trail.push({ x, y, color });
        if (trail.length > 3) trail.splice(0, 1);
    }

    drawTrail(ctx: CanvasRenderingContext2D, entityId: number, radius: number): void {
        const trail = this.trailHistory[entityId];
        if (!trail) return;
        const alphas = [0.05, 0.14, 0.28];
        for (let i = 0; i < trail.length; i++) {
            const item = trail[i];
            ctx.save();
            ctx.globalAlpha = alphas[i] ?? 0.05;
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ─── Ambient olta ucu titremi ─────────────────────────────────────────────
    applyRodTipAmbientation(timestamp: number): { dx: number; dy: number } {
        const t = timestamp * 0.001;
        return {
            dx: Math.sin(t * 3.0) * 1.5,
            dy: Math.cos(t * 2.3) * 1.0,
        };
    }

    // ─── Ana güncelleme ───────────────────────────────────────────────────────
    update(deltaTime: number, timestamp: number): void {
        // Hit-stop
        if (this.hitStopMs > 0) {
            this.hitStopMs -= deltaTime;
            if (this.hitStopMs <= 0) {
                this.hitStopMs = 0;
                this.isHitStopped = false;
            }
        }

        // Tween'ler
        this.updateTweens(deltaTime);

        // Flash opacity azalt
        if (this.flashOpacity > 0) {
            this.flashOpacity = Math.max(0, this.flashOpacity - this.flashDecayRate);
        }

        // Legendary text
        if (this.legendaryMs > 0) {
            this.legendaryMs -= deltaTime;
            const t = Math.min(1, (600 - Math.max(0, this.legendaryMs)) / 200);
            this.legendaryScale = Easing.easeOutBack(t) * 1.2;
            this.legendaryOpacity = Math.min(1, this.legendaryMs / 200);
        }

        // Partiküller
        const dt = deltaTime;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.elapsed += dt;
            p.life = Math.max(0, 1 - p.elapsed / p.duration);
            if (p.type !== 'ring') {
                // Yerçekimi ve hava direnci
                p.vy += 0.15;
                p.vx *= 0.95;
                p.x += p.vx;
                p.y += p.vy;
                if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
                    p.rotation += p.rotationSpeed;
                }
            } else {
                // Halka genişliyor
                const prog = p.elapsed / p.duration;
                p.ringRadius = 5 + (p.ringMaxRadius! - 5) * prog;
            }
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Su yüzeyi blip timer
        this.blipTimer += dt;
        if (this.blipTimer >= this.nextBlipMs) {
            this.blipTimer = 0;
            this.nextBlipMs = 3000 + Math.random() * 1000;
            this.spawnWaterBlip();
        }
        for (let i = this.waterBlips.length - 1; i >= 0; i--) {
            const b = this.waterBlips[i];
            b.elapsed += dt;
            b.life = Math.max(0, 1 - b.elapsed / b.duration);
            b.r = 8 + (20 - 8) * (b.elapsed / b.duration);
            if (b.life <= 0) this.waterBlips.splice(i, 1);
        }
    }

    // ─── Çizim — balıkların ALTINDA çizilecek ────────────────────────────────
    drawUnder(ctx: CanvasRenderingContext2D): void {
        // Water blips
        for (const b of this.waterBlips) {
            ctx.save();
            ctx.globalAlpha = b.life * 0.6;
            ctx.strokeStyle = 'rgba(160,216,239,0.8)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    // ─── Çizim — üstte (flash overlay ve partiküller) ───────────────────────
    draw(ctx: CanvasRenderingContext2D): void {
        const W = this.canvasW;
        const H = this.canvasH;

        // Partiküller (transform sonrasında, flash öncesinde)
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.life;
            if (p.type === 'ring') {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.ringRadius ?? 5, 0, Math.PI * 2);
                ctx.stroke();
            } else if (p.type === 'star') {
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation ?? 0);
                this.drawStar4(ctx, p.size);
            } else if (p.type === 'drop') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life * 0.7 + p.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // LEGENDARY! text
        if (this.legendaryMs > 0 && this.legendaryOpacity > 0) {
            ctx.save();
            ctx.globalAlpha = this.legendaryOpacity;
            ctx.translate(W / 2, H * 0.35);
            ctx.scale(this.legendaryScale, this.legendaryScale);
            ctx.textAlign = 'center';
            ctx.font = 'bold 52px Fredoka';
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FF8C00';
            ctx.shadowBlur = 20;
            ctx.fillText('LEGENDARY!', 0, 0);
            ctx.restore();
        }

        // Flash overlay — EN ÜSTTE, shake transform dışında
        if (this.flashOpacity > 0.01) {
            ctx.save();
            ctx.globalAlpha = this.flashOpacity;
            ctx.fillStyle = this.flashColor;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
        }
    }

    // ─── Zoom ölçeği ─────────────────────────────────────────────────────────
    /** ctx.scale() için kullanılacak değer */
    get currentZoom(): number { return this.zoomScale; }

    // ─── Yardımcı: 4 köşeli yıldız ───────────────────────────────────────────
    private drawStar4(ctx: CanvasRenderingContext2D, size: number): void {
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 2) * i;
            const outer = size;
            const inner = size * 0.4;
            ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
            const mid = angle + Math.PI / 4;
            ctx.lineTo(Math.cos(mid) * inner, Math.sin(mid) * inner);
        }
        ctx.closePath();
        ctx.fill();
    }

    // ─── Vignette (son 10 saniye gerilimi) ───────────────────────────────────
    drawVignette(ctx: CanvasRenderingContext2D, intensity: number): void {
        if (intensity <= 0) return;
        const W = this.canvasW;
        const H = this.canvasH;
        const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(0,0,0,${0.18 * intensity})`);
        ctx.save();
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
    }

    // ─── Public reset ─────────────────────────────────────────────────────────
    reset(): void {
        this.particles = [];
        this.tweens = [];
        this.shakeX = 0; this.shakeY = 0; this.shakeMag = 0; this.shakeFrames = 0;
        this.hitStopMs = 0; this.isHitStopped = false;
        this.flashOpacity = 0;
        this.zoomScale = 1;
        this.boatBobOffset = 0;
        this.legendaryMs = 0;
        this.waterBlips = [];
        this.trailHistory = [];
    }
}
