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
  constructor(x, y, dx, dy, size, color, doUpdate=true) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
    this.alpha = 1;
    this.doUpdate = doUpdate;
    this.rotation = Math.random() * Math.PI * 2;
  }

  update() {
    if (this.doUpdate) {
      this.x += this.dx;
      this.dx *= 0.98; 
      this.y += this.dy;
      this.dy *= 0.99;
      this.size *= 0.99;
      this.alpha -= 0.01;
      this.rotation += 0.03;
    }
    this.draw();
  }

  draw() {
    ctx.save();
    if (this.doUpdate) {
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    }

    
    ctx.restore();
  }
}

export function initParticles(x, y, count, color = null, effect = "circle") {
  let newParticles = [];
  var doPush = true;


  const getColor = () =>
    color ?? `hsl(${Math.random() * 360}, 100%, 50%)`;

  switch (effect) {
    case "circle": {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const dx = Math.cos(angle) * speed; 
        const dy = Math.sin(angle) * speed;
        newParticles.push(
          new Particle(x, y, dx* (0.8 + 0.2*Math.random()), dy* (0.8 + 0.2*Math.random()), Math.random() * 8 + 4, getColor())
        );
      }
      break;
    }

    case "spiral": {
      for (let i = 0; i < count*3; i++) {
        const angle = i * 0.3; // spacing
        const speed = 3 + i * 0.02;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        newParticles.push(
          new Particle(x, y, dx, dy, Math.random() * 6 + 3, getColor())
        );
      }
      break;
    }

    case "star": {
      const points = 5;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        for (let j = 0; j < count / points; j++) {
          const speed = 2 + Math.random() * 5;
          const dx = Math.cos(angle) * speed;
          const dy = Math.sin(angle) * speed;
          if (Math.random() < 0.1) {
            initParticles(x,y, count/10, null, effect='fountain');
          }
          newParticles.push(
            new Particle(x, y, dx, dy, Math.random() * 6 + 2, getColor())
          );
        }
      }
      break;
    }

    case "fountain": {
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() - 0.5) * (Math.PI / 2); 
        const speed = Math.random() * 6 + 3;
        const dx = Math.cos(angle) * speed * 0.5;
        const dy = -Math.abs(Math.sin(angle) * speed); 
        newParticles.push(
          new Particle(x, y, dx, dy, Math.random() * 5 + 2, getColor())
        );
      }
      break;
    }

    case 'double': {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const dx = Math.cos(angle) * speed; 
        const dy = Math.sin(angle) * speed;
        if (Math.random() < 0.05) {
            initParticles(x + (4+4*Math.random())*dx,y + 5*dy, count/2, null, effect='double');
        }
        newParticles.push(
          new Particle(x, y, dx, dy, Math.random() * 5 + 2, getColor())
        );
      }
      break;
    }

    case "spinF": {
      for (let i = 0; i < count/4; i++) {
        const angle = i * 0.3; // spacing
        const speed = 3 + i * 0.02;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        if (Math.random() < 0.2) {
          initParticles(x, y, count/10, null, effect='fountain')
        }
      }
    }

    case 'mega': {
      for (let i = 0; i < 2*count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const dx = Math.cos(angle) * speed; 
        const dy = Math.sin(angle) * speed;
        if (Math.random() < 0.1) {
            initParticles(x + (4+4*Math.random())*dx,y + 5*dy, count/2, null, effect='double');
        }
        newParticles.push(
          new Particle(x, y, dx, dy, Math.random() * 5 + 2, getColor())
        );
      }
    }

    case 'point': {
      console.log('poimt');
        newParticles.push(
          new Particle(x, y, 0, 0, 2, 'rgb(255,255,255)',   false)
        );
        for (let i = newParticles.length - 1; i>=0; i--) {
          const p = newParticles[i];
          p.update();
        }
        let doPush = false;
        console.log(doPush)
    }


    default: {
      return initParticles(x, y, count, color, "circle");
    }
  }
  console.log(doPush);
  if (doPush) {
    particles.push(...newParticles);
    console.log('not poimt');
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


for (let i = 0; i < 100; i++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  initParticles(x,y,1,'rgb(255,255,255)', 'point');
}