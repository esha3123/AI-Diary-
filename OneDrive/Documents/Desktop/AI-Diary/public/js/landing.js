// GitHub-inspired Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initParticleCanvas();
    initScrollAnimations();
    initNavbarEffects();
    initCounterAnimations();
    initParallaxEffects();
    initMouseFollowEffects();
});

// Particle Canvas Animation
function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let time = 0;
    
    // Set canvas size with device pixel ratio for better resolution
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        
        // Regenerate particles after resize
        createParticles();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width / window.devicePixelRatio;
            this.y = Math.random() * canvas.height / window.devicePixelRatio;
            
            // Small, varied velocities for subtle movement
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            
            // Vary particle sizes for more natural look
            this.baseRadius = Math.random() * 1.5 + 0.5;
            this.radius = this.baseRadius;
            
            // Vary particle colors slightly
            this.hue = 210 + Math.random() * 20; // Blue range
            this.saturation = 70 + Math.random() * 30; // %
            this.lightness = 50 + Math.random() * 20; // %
            
            this.opacity = Math.random() * 0.4 + 0.2;
            this.pulseSpeed = Math.random() * 0.01 + 0.005;
        }

        update(time) {
            // Add slight pulse effect
            this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed) * 0.3;
            
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges with dampening
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
            
            // Use HSL for better color control
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
            ctx.fill();
            
            // Add subtle glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.2})`;
            ctx.fill();
        }
    }

    // Create particles
    function createParticles() {
        // Scale particle count based on screen size, but keep it subtle
        const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / (window.devicePixelRatio * window.devicePixelRatio * 20000)));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Shorter connection distance for cleaner look
                const maxDistance = 100;

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // Gradient connections
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

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        
        time += 0.01;
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update(time);
            particle.draw();
        });

        // Draw connections
        drawConnections();

        animationId = requestAnimationFrame(animate);
    }

        // Draw connections
        drawConnections();

        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Mouse interaction
    let mouse = { x: 0, y: 0 };
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Add attraction effect to nearby particles
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

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add fade-in-up class to elements
    const animateElements = document.querySelectorAll('.feature-card, .stat-item, .hero-text');
    animateElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Navbar Effects
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class when scrolling down
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-counter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
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
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    } else {
        return num.toString();
    }
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });

    // Parallax for floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatingCards.forEach((card, index) => {
            const rate = (scrolled * (0.1 + index * 0.05));
            card.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Mouse Follow Effects
function initMouseFollowEffects() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(31, 111, 235, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .feature-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(31, 111, 235, 0.8)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(31, 111, 235, 0.5)';
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loading');
});

// Typing animation for hero text
function initTypingAnimation() {
    const textElement = document.querySelector('.hero-text h1');
    if (!textElement) return;

    const text = textElement.innerHTML;
    textElement.innerHTML = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
}

// Button click effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Performance optimization
let ticking = false;

function updateAnimations() {
    // Update all scroll-based animations here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
});

// Preload images
function preloadImages() {
    const images = ['/imge/logo.png'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

console.log('🚀 AI Diary landing page loaded successfully!');
