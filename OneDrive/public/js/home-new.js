// Home Page - Optimized (Keep all animations)
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeBasicInteractions();
    initializeCounters();
});

// Keep all animations intact
function initializeAnimations() {
    // Intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('entry-card')) {
                    const cards = document.querySelectorAll('.entry-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    // Observe all animatable elements
    document.querySelectorAll('.entry-card, .analytics-card, .insight-card').forEach(el => {
        observer.observe(el);
    });
    
    // Animate mood bars
    setTimeout(() => {
        document.querySelectorAll('.mood-fill').forEach((bar) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = width, 500);
        });
    }, 500);
}
// Essential interactions only
function initializeBasicInteractions() {
    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            
            if (btn.classList.contains('active')) {
                icon.className = 'fas fa-heart';
                showToast('Added to favorites', 'success');
            } else {
                icon.className = 'far fa-heart';
                showToast('Removed from favorites', 'info');
            }
        });
    });
    
    // Listen buttons (TTS)
    document.querySelectorAll('.listen-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const text = btn.getAttribute('data-text') || 
                        btn.closest('.entry-card')?.querySelector('.entry-preview-text')?.textContent || 
                        'No text available';
            
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
                showToast('Reading entry aloud', 'info');
            } else {
                showToast('Text-to-speech not supported', 'error');
            }
        });
    });
    
    // Theme toggle
    document.getElementById('themeBtn')?.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        document.body.classList.toggle('light-mode');
        localStorage.setItem('diary-theme', isLight ? 'dark' : 'light');
        showToast(`Switched to ${isLight ? 'dark' : 'light'} theme`, 'info');
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        });
    });
}

// Counter animations for numbers
function initializeCounters() {
    document.querySelectorAll('.metric-number').forEach(counter => {
        const target = parseInt(counter.textContent);
        if (!isNaN(target)) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 30);
        }
    });
}

// Simple toast notifications
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    existingToast?.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    
    Object.assign(toast.style, {
        position: 'fixed', top: '20px', right: '20px', background: 'var(--bg-card)',
        color: 'var(--text-primary)', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-sm)',
        boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem',
        transform: 'translateX(100%)', transition: 'transform 0.3s ease', zIndex: '1000'
    });
    
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = 'translateX(0)', 10);
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
