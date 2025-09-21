import Firework from './projectile.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function fitCanvas() {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    resize();
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

const fireworks = [];
let last = performance.now();

function spawnAt(x, y) {
    const dx = (Math.random() - 0.5) * 80;      // random horizontal velocity
    const dy = -350 + Math.random() * -80;      // upward velocity
    const color = `hsl(${Math.floor(Math.random() * 360)} 90% 60%)`;

    // optional acceleration: small horizontal spread
    const ax = (Math.random() - 0.5) * 20;      
    const ay = 0;

    const p = new Firework({ x, y, dx, dy, r: 3 + Math.random() * 2, color, ax, ay });
    fireworks.push(p);
}

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    spawnAt(e.clientX - rect.left, e.clientY - rect.top);
});

window.addEventListener('keydown', e => {
    const rect = canvas.getBoundingClientRect();
    if (e.code === 'Space') {
        spawnAt(rect.width / 2, rect.height - 20);
        e.preventDefault();
    } else if (e.code === 'Escape') {
        fireworks.length = 0;
    }
});

function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.update(dt);
        if (p.isOffscreen(canvas.height) || !p.alive) fireworks.splice(i, 1);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of fireworks) p.draw(ctx);

    ctx.save();
    ctx.font = '12px system-ui,Segoe UI,Roboto,Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`fireworks: ${fireworks.length}`, 12, 18);
    ctx.restore();

    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// spawn demo firework
const rect = canvas.getBoundingClientRect();
spawnAt(rect.width / 2, rect.height - 20);
