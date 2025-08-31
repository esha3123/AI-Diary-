// Landing Page - Optimized (Keep all animations)
document.addEventListener('DOMContentLoaded', function() {
    initParticleCanvas();
    initScrollAnimations();
    initCounterAnimations();
    initBasicEffects();
});

// Keep particle canvas animation intact
function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let time = 0;
    
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        createParticles();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width / window.devicePixelRatio;
            this.y = Math.random() * canvas.height / window.devicePixelRatio;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.baseRadius = Math.random() * 1.5 + 0.5;
            this.radius = this.baseRadius;
            this.hue = 210 + Math.random() * 20;
            this.saturation = 70 + Math.random() * 30;
            this.lightness = 50 + Math.random() * 20;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.pulseSpeed = Math.random() * 0.01 + 0.005;
        }

        update(time) {
            this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed) * 0.3;
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width / window.devicePixelRatio) {
                this.vx *= -0.8;
                this.x = Math.max(0, Math.min(canvas.width / window.devicePixelRatio, this.x));
            }
            
            if (this.y < 0 || this.y > canvas.height / window.devicePixelRatio) {
                this.vy *= -0.8;
                this.y = Math.max(0, Math.min(canvas.height / window.devicePixelRatio, this.y));
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.2})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / (window.devicePixelRatio * window.devicePixelRatio * 20000)));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    
                    gradient.addColorStop(0, `hsla(${particles[i].hue}, ${particles[i].saturation}%, ${particles[i].lightness}%, ${0.1 * (1 - distance / maxDistance)})`);
                    gradient.addColorStop(1, `hsla(${particles[j].hue}, ${particles[j].saturation}%, ${particles[j].lightness}%, ${0.1 * (1 - distance / maxDistance)})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5 * (1 - distance / maxDistance);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        
        time += 0.01;
        
        particles.forEach(particle => {
            particle.update(time);
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Mouse interaction
    let mouse = { x: 0, y: 0 };
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        particles.forEach(particle => {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
            }
        });
    });
}

// Keep scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card, .stat-item, .hero-text').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Keep counter animations
function initCounterAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-counter').forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 20);
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    else if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    else return num.toString();
}

// Basic effects
function initBasicEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Simple navbar effects
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            if (navbar) navbar.style.transform = 'translateY(-100%)';
        } else {
            if (navbar) navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });

    // Button ripple effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            Object.assign(ripple.style, {
                position: 'absolute', width: size + 'px', height: size + 'px',
                left: x + 'px', top: y + 'px', background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%', transform: 'scale(0)', animation: 'ripple 0.6s linear',
                pointerEvents: 'none'
            });

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Loading animation
window.addEventListener('load', () => document.body.classList.add('loading'));

console.log('🚀 AI Diary landing page loaded successfully!');

// Add ripple animation CSS
const rippleCSS = `@keyframes ripple { to { transform: scale(4); opacity: 0; } }`;
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initScrollAnimations();
    initNavbarEffects();
    initCounterAnimations();
    initParallaxEffects();
    initMouseFollowEffects();
    initTypingAnimation();
});
