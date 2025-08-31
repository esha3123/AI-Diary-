// Login Page - Optimized (Keep particles animation)
document.addEventListener('DOMContentLoaded', function() {
    initParticleBackground();
    initPasswordToggle();
    initFormValidation();
});

// Keep particle background animation intact
function initParticleBackground() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
            this.color = `rgba(31, 111, 235, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const particleCount = Math.min(100, (canvas.width * canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(31, 111, 235, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

// Simple password toggle
function initPasswordToggle() {
    const toggle = document.querySelector('.password-toggle');
    const input = document.querySelector('input[type="password"]');

    toggle?.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

// Basic form validation
function initFormValidation() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        const username = form.querySelector('input[name="username"]').value;
        const password = form.querySelector('input[name="password"]').value;
        
        if (!username || !password) {
            e.preventDefault();
            alert('Please fill in all fields');
            return;
        }
        
        const loginBtn = form.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing In...';
        }
    });
}
