import { initParticles } from './firework_particles.js';


export function play_Audio(src, playbackRate=1) {
  const audio = new Audio(src);
  audio.playbackRate = playbackRate;
  audio.play();
}

//thanks chatgpt for rewriting my choice it broke
export function choice(arr, arr_weight = null) {
  if (arr_weight == null) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const total = arr_weight.reduce((a, b) => a + b, 0);
  let pick = Math.random() * total;

  for (let i = 0; i < arr.length; i++) {
    if (pick < arr_weight[i]) {
      return arr[i];
    }
    pick -= arr_weight[i];
  }

  return arr[arr.length - 1];
}


export default class Firework {
  constructor({
    x, y, dx = 0, dy = -500, r = 10, color = '#fff',
    gravity = 400, ax = 0, ay = 0, explodePoint = 0, Firework_Particle_Color=null
  } = {}) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.color = color;
    this.gravity = gravity;
    this.alive = true;
    this.exploded = false; // prevent double explosion
    this.explodePoint = explodePoint;
    this.time = 0;
    this.fpc = Firework_Particle_Color;
    this.playedSounds = [false,false]

    this.axFunc = typeof ax === 'function' ? ax : () => ax;
    this.ayFunc = typeof ay === 'function' ? ay : () => ay;
  }

  update(dt) {
    if (!this.alive) return;
    this.time += dt;
    
    if (!this.playedSounds[0]) {
      play_Audio('whistle.mp3', 1 + (((this.dx**2 + this.dy**2)**0.5)/500) )
      this.playedSounds[0] = true
    }

    this.dx += this.axFunc(this.time) * dt;
    this.dy += (this.ayFunc(this.time) + this.gravity) * dt;

    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (!this.exploded && this.dy >= this.explodePoint) {
      this.explode();
      this.exploded = true;
    }
  }

  draw(ctx) {
    if (!this.alive) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  explode() {
    initParticles(this.x, this.y, 100, this.fpc, choice(["circle", "spiral", "star", "fountain",'double', 'spinF','mega'],[11,6,4,3,4,1,0.4]));
    if (!this.playedSounds[1]) {
      play_Audio('fireworkblast-106275.mp3');
      this.playedSounds[1] = true;
    } 
    this.kill();
  }

  kill() { this.alive = false; }
  isOffscreen(height) { return this.y > height; }
}

