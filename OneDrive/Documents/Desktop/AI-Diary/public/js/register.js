// Register Page Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    initParticleBackground();
    initPasswordToggle();
    initFormValidation();
    initPasswordStrengthMeter();
    initSocialButtons();
});

// Particle Background Animation (same as login)
function initParticleBackground() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
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

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(31, 111, 235, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Password toggle functionality
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField.call(input)) {
                isValid = false;
            }
        });
        
        if (isValid && validatePasswordMatch()) {
            // Form is valid, you can submit it
            console.log('Form is valid - ready to submit');
            // Add your actual form submission logic here
            showSuccessMessage();
        }
    });
}

function validateField() {
    const value = this.value.trim();
    const type = this.type;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error message
    const existingError = this.parentElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Basic required validation
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Specific validations
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'password':
                if (this.placeholder === 'Password') {
                    if (value.length < 8) {
                        isValid = false;
                        errorMessage = 'Password must be at least 8 characters long';
                    }
                }
                break;
                
            case 'text':
                if (this.placeholder === 'Full Name') {
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long';
                    }
                }
                break;
        }
    }
    
    // Apply validation styles
    if (isValid) {
        this.classList.remove('invalid');
        this.classList.add('valid');
    } else {
        this.classList.remove('valid');
        this.classList.add('invalid');
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = errorMessage;
        this.parentElement.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}

function clearValidation() {
    this.classList.remove('valid', 'invalid');
    const errorMessage = this.parentElement.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validatePasswordMatch() {
    const password = document.querySelector('input[placeholder="Password"]');
    const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]');
    
    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('invalid');
        
        const existingError = confirmPassword.parentElement.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = 'Passwords do not match';
        confirmPassword.parentElement.parentElement.appendChild(errorDiv);
        
        return false;
    }
    
    return true;
}

// Password strength meter
function initPasswordStrengthMeter() {
    const passwordInput = document.querySelector('input[placeholder="Password"]');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthBar || !strengthText) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Remove all strength classes
        strengthBar.className = 'strength-bar';
        
        if (password.length === 0) {
            strengthText.textContent = 'Password strength';
            return;
        }
        
        switch (strength.level) {
            case 1:
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak password';
                break;
            case 2:
                strengthBar.classList.add('fair');
                strengthText.textContent = 'Fair password';
                break;
            case 3:
                strengthBar.classList.add('good');
                strengthText.textContent = 'Good password';
                break;
            case 4:
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong password';
                break;
            default:
                strengthText.textContent = 'Very weak password';
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate score
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    // Bonus for length
    if (password.length >= 12) score++;
    
    return {
        score: score,
        level: Math.min(Math.floor(score / 1.5), 4),
        checks: checks
    };
}

// Social buttons
function initSocialButtons() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 
                           this.classList.contains('github') ? 'GitHub' : 'Twitter';
            
            console.log(`Register with ${provider} clicked`);
            // Add your social authentication logic here
        });
    });
}

// Success message
function showSuccessMessage() {
    const button = document.querySelector('.register-btn');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i> Account Created!';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        // Redirect to login or dashboard
        // window.location.href = '/AI-Diary/login';
    }, 2000);
}

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const card = document.querySelector('.register-card');
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
});