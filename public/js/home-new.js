// Home Page - Optimized (Keep all animations)
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeBasicInteractions();
    initializeNavigationTabs();
    initializeFilterControls();
    initializeViewToggle();
    initializeSettingsButton();
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

// Navigation Tabs Functionality
function initializeNavigationTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            showToast(`Switched to ${targetTab} view`, 'info');
        });
    });
}

// Filter Controls Functionality
function initializeFilterControls() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const entryCards = document.querySelectorAll('.entry-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter entries based on selection
            entryCards.forEach(card => {
                let shouldShow = false;
                
                switch(filter) {
                    case 'all':
                        shouldShow = true;
                        break;
                    case 'recent':
                        // Show entries from last 7 days (you can adjust this logic)
                        const entryDate = card.querySelector('.entry-date');
                        if (entryDate) {
                            const date = new Date(entryDate.textContent);
                            const daysDiff = (new Date() - date) / (1000 * 60 * 60 * 24);
                            shouldShow = daysDiff <= 7;
                        } else {
                            shouldShow = true; // Show if no date found
                        }
                        break;
                    case 'favorites':
                        // Show only favorited entries
                        const favoriteBtn = card.querySelector('.favorite-btn');
                        shouldShow = favoriteBtn && favoriteBtn.classList.contains('active');
                        break;
                }
                
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update visible count
            const visibleCount = Array.from(entryCards).filter(card => 
                card.style.display !== 'none').length;
            
            showToast(`Showing ${visibleCount} entries (${filter})`, 'info');
        });
    });
}

// View Toggle Functionality  
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const entriesGrid = document.querySelector('.entries-grid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Remove active class from all view buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply view style to entries grid
            if (entriesGrid) {
                entriesGrid.classList.remove('grid-view', 'list-view');
                entriesGrid.classList.add(`${view}-view`);
                
                // Add corresponding data attribute for CSS targeting
                entriesGrid.setAttribute('data-view', view);
            }
            
            showToast(`Switched to ${view} view`, 'info');
        });
    });
}

// Settings Button Functionality
function initializeSettingsButton() {
    const settingsButton = document.querySelector('.settings-btn');
    
    if (settingsButton) {
        settingsButton.addEventListener('click', function() {
            // Create and show settings modal/dropdown
            showSettingsMenu();
        });
    }
}

// Settings Menu
function showSettingsMenu() {
    // Remove existing settings menu if any
    const existingMenu = document.querySelector('.settings-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Create settings menu
    const settingsMenu = document.createElement('div');
    settingsMenu.className = 'settings-menu';
    settingsMenu.innerHTML = `
        <div class="settings-header">
            <h3>Settings</h3>
            <button class="close-settings">×</button>
        </div>
        <div class="settings-options">
            <div class="setting-item">
                <label for="themeToggle">Dark Mode</label>
                <input type="checkbox" id="themeToggle" ${document.body.classList.contains('dark-mode') ? 'checked' : ''}>
            </div>
            <div class="setting-item">
                <label for="autoSave">Auto Save</label>
                <input type="checkbox" id="autoSave" checked>
            </div>
            <div class="setting-item">
                <label for="notifications">Notifications</label>
                <input type="checkbox" id="notifications" checked>
            </div>
            <div class="setting-item">
                <button class="export-btn">Export Data</button>
            </div>
        </div>
    `;
    
    // Style the settings menu
    Object.assign(settingsMenu.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'var(--bg-card, #ffffff)',
        color: 'var(--text-primary, #333333)',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        zIndex: '1000',
        minWidth: '300px',
        maxWidth: '400px'
    });
    
    document.body.appendChild(settingsMenu);
    
    // Add event listeners for settings
    const closeBtn = settingsMenu.querySelector('.close-settings');
    const themeToggle = settingsMenu.querySelector('#themeToggle');
    const exportBtn = settingsMenu.querySelector('.export-btn');
    
    closeBtn.addEventListener('click', () => settingsMenu.remove());
    
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        document.body.classList.toggle('light-mode', !this.checked);
        localStorage.setItem('diary-theme', this.checked ? 'dark' : 'light');
        showToast(`Switched to ${this.checked ? 'dark' : 'light'} theme`, 'info');
    });
    
    exportBtn.addEventListener('click', function() {
        // Simple export functionality
        const data = {
            exported: new Date().toISOString(),
            entries: Array.from(document.querySelectorAll('.entry-card')).length,
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diary-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Data exported successfully', 'success');
        settingsMenu.remove();
    });
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeSettingsOutside(e) {
            if (!settingsMenu.contains(e.target) && !e.target.classList.contains('settings-btn')) {
                settingsMenu.remove();
                document.removeEventListener('click', closeSettingsOutside);
            }
        });
    }, 100);
}
