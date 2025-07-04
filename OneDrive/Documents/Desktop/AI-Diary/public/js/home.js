// AI Diary Home Page JavaScript - Design Only
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initBasicInteractions();
    initAnimations();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Switch to light mode
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark mode
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
        
        // Animate theme change
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

// Basic UI interactions
function initBasicInteractions() {
    // Summary section buttons
    const summaryBtns = document.querySelectorAll('.summary-btn');
    summaryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            summaryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Action buttons (placeholder for future database integration)
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('view-btn') ? 'view' :
                          this.classList.contains('edit-btn') ? 'edit' :
                          this.classList.contains('delete-btn') ? 'delete' :
                          this.classList.contains('listen-btn') ? 'listen' : 'unknown';
            
            // Placeholder - you'll replace this with actual functionality
            console.log(`${action} action clicked - ready for database integration`);
        });
    });
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all section cards
    document.querySelectorAll('.section-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N for new entry
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/AI-diary/new';
    }
    
    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});

// Navigation handling
document.addEventListener('click', function(e) {
    if (e.target.closest('.logout-link')) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            // Add your logout logic here
            window.location.href = '/logout';
        }
    }
});

console.log('AI Diary Dashboard loaded - Ready for database integration!');
