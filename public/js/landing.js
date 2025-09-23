// AI Diary Landing Page JavaScript - Complete Working Version
console.log('🚀 Loading AI Diary landing page...');

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing animations...');
    
    // Initialize all animations
    initParticleCanvas();
    initScrollAnimations();
    initCounterAnimations();
    initNavbarEffects();
    initTypingAnimation();
    initTestimonialCarousel();
    initFloatingIcons();
    initBasicEffects();
    
    console.log('🎉 All animations initialized successfully!');
});

// Particle Canvas Animation
function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        console.log('⚠️ Particles canvas not found');
        return;
    }
    
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
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.baseRadius = Math.random() * 2 + 1;
            this.radius = this.baseRadius;
            this.hue = 210 + Math.random() * 40;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed) * 0.5;
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
            if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 15000));
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
                
                if (distance < 120) {
                    const opacity = 0.1 * (1 - distance / 120);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        time += 0.01;
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
    console.log('✅ Particle canvas initialized');
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .stat-item, .hero-text, .hero-buttons').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
    console.log('✅ Scroll animations initialized');
}

// Counter Animations
function initCounterAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || 0;
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-counter').forEach(counter => {
        observer.observe(counter);
    });
    console.log('✅ Counter animations initialized');
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
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString();
}

// Navbar Effects
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
    console.log('✅ Navbar effects initialized');
}

// Typing Animation
function initTypingAnimation() {
    const typewriter = document.querySelector('.typewriter-text');
    if (!typewriter) return;

    const phrases = [
        'Your Personal AI Diary',
        'Capture Life\'s Moments',
        'AI-Powered Insights',
        'Secure & Private'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
    console.log('✅ Typing animation initialized');
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    if (testimonials.length === 0) return;

    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    showTestimonial(0);
    setInterval(nextTestimonial, 5000);
    console.log('✅ Testimonial carousel initialized');
}

// Floating Icons Animation
function initFloatingIcons() {
    const container = document.querySelector('.floating-icons');
    if (!container) return;

    const icons = ['💭', '✨', '📝', '🤖', '💡', '🔮'];
    
    function createFloatingIcon() {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.left = Math.random() * 100 + '%';
        icon.style.animationDuration = (Math.random() * 3 + 2) + 's';
        icon.style.opacity = Math.random() * 0.7 + 0.3;
        
        container.appendChild(icon);
        
        setTimeout(() => {
            icon.remove();
        }, 5000);
    }
    
    setInterval(createFloatingIcon, 2000);
    console.log('✅ Floating icons initialized');
}

// Basic Effects
function initBasicEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Button ripple effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
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

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Page load animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    console.log('✅ Basic effects initialized');
}

// Add necessary CSS for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .fade-in-up.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .floating-icon {
            position: absolute;
            font-size: 20px;
            animation: float linear infinite;
            pointer-events: none;
            z-index: 1;
        }
        
        .testimonial-item {
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.5s ease;
        }
        
        .testimonial-item.active {
            opacity: 1;
            transform: translateX(0);
        }
        
        .navbar {
            transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
addAnimationStyles();

console.log('🎉 AI Diary landing page JavaScript loaded successfully!');  