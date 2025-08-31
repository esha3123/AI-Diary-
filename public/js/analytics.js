// Analytics Page JavaScript - Optimized
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeAnimations();
    initializeInteractions();
    initializeCounters();
});

// Keep all animations intact
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Animate cards on scroll
    document.querySelectorAll('.stat-card, .chart-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate mood bars
    setTimeout(() => {
        document.querySelectorAll('.mood-fill').forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.style.width || '0%';
            }, index * 200);
        });
    }, 500);
    
    // Animate time activities
    document.querySelectorAll('.time-activity').forEach((activity, index) => {
        setTimeout(() => {
            activity.style.transform = 'scaleY(1)';
            activity.style.transformOrigin = 'bottom';
        }, index * 100);
    });
}

// Essential interactions only
function initializeInteractions() {
    // Simplified hover effects using CSS classes
    document.querySelectorAll('.mood-item').forEach(item => {
        item.addEventListener('click', () => {
            const mood = item.dataset.mood;
            const name = item.querySelector('.mood-name')?.textContent;
            showNotification(`${mood} ${name} Mood Analysis`, 'This mood represents your emotional state during writing.');
        });
    });
    
    // Time slot interactions
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const hour = slot.dataset.hour;
            const timeStr = hour.toString().padStart(2, '0') + ':00';
            showNotification(`${timeStr} Writing Pattern`, 'Your writing activity for this time period.');
        });
    });
}

// Counter animations for numbers
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number, .metric-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        if (!isNaN(target)) animateCounter(counter, target);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = target > 999 ? current.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : current.toFixed(0);
    }, 30);
}

// Simple notification system
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'analytics-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px', background: 'var(--bg-card)',
        border: '1px solid var(--border-light)', borderRadius: 'var(--border-radius)',
        padding: '1.5rem', maxWidth: '400px', boxShadow: 'var(--shadow-xl)',
        zIndex: '1000', transform: 'translateX(100%)', transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    notification.querySelector('.notification-close').onclick = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    };
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }
    }, 5000);
}

// Generate AI Insights - simplified
async function generateAIInsights() {
    const btn = document.querySelector('.insights-btn');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const insights = [
            "Your writing shows increased emotional intelligence over time.",
            "Your consistency has improved significantly.",
            "Your vocabulary and expression have evolved.",
            "Your mood patterns suggest healthy emotional processing."
        ];
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        showNotification('New AI Insight Generated!', randomInsight);
    } catch (error) {
        showNotification('Error', 'Failed to generate insights. Please try again later.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

window.generateAIInsights = generateAIInsights;