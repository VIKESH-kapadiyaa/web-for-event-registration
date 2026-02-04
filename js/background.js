/* ============================================
   Background Animations (Gradient + Particles)
   Shared between index.html and thankyou.html
   ============================================ */

// --- ANIMATED GRADIENT BACKGROUND ---
class GradientAnimation {
    constructor() {
        this.cnv = document.querySelector('#gradient-canvas');
        this.ctx = this.cnv.getContext('2d');
        this.circles = [];
        this.setCanvasSize();
        this.init();
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    init() {
        const computedStyle = getComputedStyle(this.cnv);
        const colors = [
            computedStyle.getPropertyValue('--gradient-color-1').trim(),
            computedStyle.getPropertyValue('--gradient-color-2').trim(),
            computedStyle.getPropertyValue('--gradient-color-3').trim(),
            computedStyle.getPropertyValue('--gradient-color-4').trim()
        ];

        for (let i = 0; i < 4; i++) {
            this.circles.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                r: Math.random() * Math.min(this.w, this.h) * 0.5 + Math.min(this.w, this.h) * 0.2,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                color: colors[i]
            });
        }
        this.animate();
    }

    setCanvasSize() {
        this.w = this.cnv.width = window.innerWidth;
        this.h = this.cnv.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.circles.forEach(circle => this.update(circle));
        requestAnimationFrame(() => this.animate());
    }

    update(circle) {
        if (circle.x < 0 || circle.x > this.w) circle.vx *= -1;
        if (circle.y < 0 || circle.y > this.h) circle.vy *= -1;
        circle.x += circle.vx;
        circle.y += circle.vy;
        this.draw(circle);
    }

    draw(circle) {
        let grd = this.ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.r);
        grd.addColorStop(0, circle.color);
        grd.addColorStop(1, `${circle.color}00`);
        this.ctx.fillStyle = grd;
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// --- PARTICLE CLASS ---
class Particle {
    constructor(x, y, directionX, directionY, size, ctx) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = 'rgba(100,100,100,0.5)';
        this.ctx.fill();
    }

    update(mouse = null) {
        if (this.x > this.ctx.canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > this.ctx.canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse interaction (only if mouse object is provided)
        if (mouse && mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < this.ctx.canvas.width - this.size * 10) {
                    this.x += 2;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 2;
                }
                if (mouse.y < this.y && this.y < this.ctx.canvas.height - this.size * 10) {
                    this.y += 2;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 2;
                }
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// --- PARTICLE SYSTEM ---
class ParticleSystem {
    constructor(enableMouseInteraction = false) {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particlesArray = [];
        this.enableMouseInteraction = enableMouseInteraction;

        if (enableMouseInteraction) {
            this.mouse = { x: null, y: null, radius: 100 };
            window.addEventListener('mousemove', (event) => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            });
            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        } else {
            this.mouse = null;
        }

        this.init();
        window.addEventListener('resize', () => this.init());
        this.animate();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particlesArray = [];

        let numberOfParticles = (this.canvas.height * this.canvas.width) / 9000;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.2) - 0.1;
            let directionY = (Math.random() * 0.2) - 0.1;
            this.particlesArray.push(new Particle(x, y, directionX, directionY, size, this.ctx));
        }
    }

    connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < this.particlesArray.length; a++) {
            for (let b = a; b < this.particlesArray.length; b++) {
                let distance = (
                    (this.particlesArray[a].x - this.particlesArray[b].x) *
                    (this.particlesArray[a].x - this.particlesArray[b].x)
                ) + (
                    (this.particlesArray[a].y - this.particlesArray[b].y) *
                    (this.particlesArray[a].y - this.particlesArray[b].y)
                );

                if (distance < (this.canvas.width / 7) * (this.canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    this.ctx.strokeStyle = 'rgba(140,140,140,' + opacityValue + ')';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particlesArray[a].x, this.particlesArray[a].y);
                    this.ctx.lineTo(this.particlesArray[b].x, this.particlesArray[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < this.particlesArray.length; i++) {
            this.particlesArray[i].update(this.mouse);
        }
        this.connectParticles();
    }
}

// --- INITIALIZE BACKGROUNDS ---
function initBackgrounds(enableMouseInteraction = false) {
    new GradientAnimation();
    new ParticleSystem(enableMouseInteraction);
}
