export default class Firework {
    constructor({ x, y, dx = 0, dy = 0, r = 3, color = '#fff', gravity = 300, ax = 0, ay = 0 } = {}) {
        this.x = x;
        this.y = y;
        this.dx = dx; // velocity x
        this.dy = dy; // velocity y
        this.r = r;
        this.color = color;

        this.gravity = gravity; // constant downward acceleration
        this.ax = ax;           // extra acceleration x
        this.ay = ay;           // extra acceleration y

        this.alive = true;
    }

    update(dt) {
        if (!this.alive) return;

        // update velocity
        this.dy += (this.gravity + this.ay) * dt;
        this.dx += this.ax * dt;

        // update position
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    kill() { this.alive = false; }

    isOffscreen(canvasHeight) {
        return this.y - this.r > canvasHeight;
    }
}
