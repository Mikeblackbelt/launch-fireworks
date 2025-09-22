const canvas = document.getElementById('canvas-particles');
const ctx = canvas.getContext('2d');

let particles = [];

let animating = false;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

export class Particle {
  constructor(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
    this.alpha = 1;
    this.rotation = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.dx;
    this.dx *= 0.98; 
    this.y += this.dy;
    this.dy *= 0.99;
    this.size *= 0.99;
    this.alpha -= 0.01;
    this.rotation += 0.03;
    this.draw();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    ctx.restore();
  }
}


export function initParticles(x, y, count) {
  let considerMulti = false;  
  if (Math.random() < 0.5) {considerMulti = true}
  for (let i=0;i<count;i++){
    const size = Math.random()*8+4;
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*5+2;
    const dx = Math.cos(angle)*speed;
    const dy = Math.sin(angle)*speed;
    const color = `hsl(${Math.random()*360},100%,50%)`;
    if (Math.random() < 0.05 & considerMulti) {
        initParticles(x + 5*dx, y + 5*dy, Math.floor(count/2));
    }

    particles.push(new Particle(x, y, dx, dy, size, color));
   
  }
  if (!animating) {
    animate();
    animating = true;
}
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let i = particles.length-1; i>=0; i--){
    const p = particles[i];
    p.update();
    if (p.alpha<=0 || p.size<1) particles.splice(i,1);
  }
  
  requestAnimationFrame(animate);
}
