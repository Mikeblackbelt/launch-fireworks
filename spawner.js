import Firework from './projectile.js';

const canvas = document.getElementById('canvas-main');
const ctx = canvas.getContext('2d');

var accelerationX = 0;
var accelerationY = 0;

var velocityX = 0;
var velocityY = 0;

const sliderAX = document.getElementById('sliderax');
const sliderAY = document.getElementById('slideray');

const labelAX = document.getElementById('lax');
const labelAY = document.getElementById('lay');

const sliderDX = document.getElementById('sliderdx');
const sliderDY = document.getElementById('sliderdy');

const labelDX = document.getElementById('ldx');
const labelDY = document.getElementById('ldy');

sliderAX.oninput = function() {
    labelAX.textContent = "Acceleration X: " + (this.value).toString(); 
    accelerationX = 70*parseInt(this.value);
}

sliderAY.oninput = function() {
    labelAY.textContent = "Acceleration Y: " + (this.value).toString(); 
    accelerationY = 70*parseInt(this.value);
}


sliderDX.oninput = function() {
    labelDX.textContent = "Velocity X: " + (this.value).toString(); 
    velocityX = parseInt(this.value);
}

sliderDY.oninput = function() {
    labelDY.textContent = "Velocity Y: " + (this.value).toString(); 
    velocityY = parseInt(this.value);
}


function resize(){
  const dpr = window.devicePixelRatio||1;
  canvas.width = window.innerWidth*dpr;
  canvas.height = window.innerHeight*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);
resize();

const fireworks = [];
let last = performance.now();

function spawnAt(x, y){
  const dx = 100*velocityX;
  const dy = -130*velocityY;
  
  console.log(`Attempt to spawn firework at (${x},${y}) with velocities (${dx},${dy})`);

  const color = `rgba(73, 73, 73, 1)`;
  let fpc = null;
  
  if (Math.random() < 0.5) {fpc = `hsl(${Math.random()*360},100%,50%)`; }
 
  const f = new Firework({
    x, y, dx, dy, color,
    ax: t => accelerationX + 50*Math.sin(2*t),
    ay: t => accelerationY + 400 + 50*Math.cos(2*t),
    explodePoint: velocityY + 3,
    Firework_Particle_Color: fpc 
  });

  fireworks.push(f);
}

canvas.addEventListener('click', e=>{
  spawnAt(e.clientX, e.clientY);
});

window.addEventListener('keydown', e=>{
  console.log(e.code)
  if (e.code==='Space'){
    spawnAt(window.innerWidth/2, window.innerHeight-20);
    e.preventDefault();
  } else if(e.code==='Escape'){
    let fireworkLen = fireworks.length;
    for (let i = 0; i < fireworkLen - 1; i++) {
      const f = fireworks[i];
      fireworks.splice(i,1);
    }
  } else if (e.code==='KeyK') {

    velocityX = 10*(Math.random()-0.5);
    labelDX.textContent = "Velocity X: " + (velocityX).toString(); 

    velocityY = 7*(Math.random()) + 2;
    labelDY.textContent = "Velocity Y: " + (velocityY).toString(); 


    accelerationX = 10*(Math.random()-0.5)
    labelAX.textContent = "Acceleration X: " + (accelerationX).toString(); 

    accelerationY = 10*(Math.random()-0.5)
    labelAY.textContent = "Acceleration Y: " + (accelerationY).toString(); 

 
    spawnAt(window.innerWidth/2, window.innerHeight-20)
  }
});

function frame(now){
  const dt = Math.min((now-last)/1000,0.05);
  last=now;

  for(let i=fireworks.length-1;i>=0;i--){
    const f = fireworks[i];
    f.update(dt);
    if (f.isOffscreen(canvas.height)||!f.alive) fireworks.splice(i,1);
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const f of fireworks) f.draw(ctx);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

//spawnAt(window.innerWidth/2, window.innerHeight-20);
