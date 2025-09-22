import { initParticles } from './firework_particles.js';

export default class Firework {
  constructor({
    x, y, dx=0, dy=-500, r=10, color='#fff', gravity=400,
    ax=0, ay=0, explodePoint=0
  } = {}) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.color = color;
    this.gravity = gravity;
    this.alive = true;
    this.explodePoint = explodePoint;
    this.time = 0;

    // accept either number or function for acceleration
    this.axFunc = typeof ax === 'function' ? ax : ()=>ax;
    this.ayFunc = typeof ay === 'function' ? ay : ()=>ay + this.gravity;
  }

  update(dt) {
    if (!this.alive) return;
    this.time += dt;

    this.dx += this.axFunc(this.time) * dt;
    this.dy += this.ayFunc(this.time) * dt;

    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (this.dy >= this.explodePoint) this.explode();
  }

  draw(ctx) {
    if (!this.alive) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  explode() {
    initParticles(this.x, this.y, 100);
    this.kill();
  }

  kill() { this.alive = false; }
  isOffscreen(height) { return this.y > height; }
}
