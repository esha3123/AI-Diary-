// Instagram-Style Home Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page components
    initializeHomePage();
    initializeTabNavigation();
    initializeFilters();
    initializeEntryCards();
    initializeFAB();
    initializeAnimations();
    initializeInteractions();
    
    function initializeHomePage() {
        console.log('Instagram-style home page initialized');
        
        // Add page loaded class for animations
        document.body.classList.add('page-loaded');
        
        // Initialize theme
        initializeTheme();
        
        // Initialize tooltips
        initializeTooltips();
        
        // Initialize auto-refresh
        initializeAutoRefresh();
    }
    
    function initializeTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab + '-tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Add ripple effect
                createRippleEffect(this);
                
                // Show toast notification
                showToast(`Switched to ${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)} view`, 'info');
            });
        });
    }
    
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const viewButtons = document.querySelectorAll('.view-btn');
        const entriesGrid = document.querySelector('.entries-grid');
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply filter
                applyFilter(filter);
                
                // Show feedback
                showToast(`Showing ${filter} entries`, 'success');
            });
        });
        
        // View toggle functionality
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Update active view
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply view
                applyView(view, entriesGrid);
            });
        });
    }
    
    function applyFilter(filter) {
        const entryCards = document.querySelectorAll('.entry-card');
        
        entryCards.forEach((card, index) => {
            // Add stagger animation
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Apply filter logic
            switch(filter) {
                case 'recent':
                    // Show only recent entries (first 3)
                    card.style.display = index < 3 ? 'block' : 'none';
                    break;
                case 'favorites':
                    // Show only favorited entries
                    const isFavorite = card.querySelector('.favorite-btn').classList.contains('active');
                    card.style.display = isFavorite ? 'block' : 'none';
                    break;
                default:
                    card.style.display = 'block';
            }
            
            // Re-trigger animation
            if (card.style.display !== 'none') {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                }, 10);
            }
        });
    }
    
    function applyView(view, grid) {
        if (view === 'list') {
            grid.style.gridTemplateColumns = '1fr';
            grid.classList.add('list-view');
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            grid.classList.remove('list-view');
        }
        
        showToast(`Switched to ${view} view`, 'info');
    }
    
    function initializeEntryCards() {
        const entryCards = document.querySelectorAll('.entry-card');
        
        entryCards.forEach(card => {
            // Favorite functionality
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    this.classList.toggle('active');
                    const icon = this.querySelector('i');
                    
                    if (this.classList.contains('active')) {
                        icon.className = 'fas fa-heart';
                        showToast('Added to favorites', 'success');
                        createHeartAnimation(this);
                    } else {
                        icon.className = 'far fa-heart';
                        showToast('Removed from favorites', 'info');
                    }
                });
            }
            
            // Listen functionality
            const listenBtns = card.querySelectorAll('.listen-btn');
            listenBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const text = this.getAttribute('data-text') || 
                                card.querySelector('.entry-preview-text').textContent;
                    
                    readText(text);
                    showToast('Reading entry aloud', 'info');
                });
            });
            
            // Dropdown functionality
            const dropdownBtn = card.querySelector('.dropdown-btn');
            const dropdownMenu = card.querySelector('.dropdown-menu');
            
            if (dropdownBtn && dropdownMenu) {
                dropdownBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        if (menu !== dropdownMenu) {
                            menu.style.opacity = '0';
                            menu.style.visibility = 'hidden';
                        }
                    });
                    
                    // Toggle current dropdown
                    const isVisible = dropdownMenu.style.opacity === '1';
                    dropdownMenu.style.opacity = isVisible ? '0' : '1';
                    dropdownMenu.style.visibility = isVisible ? 'hidden' : 'visible';
                });
            }
            
            // Card hover effects
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-4px)';
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
        });
    }
    
    function initializeFAB() {
        const fab = document.getElementById('mainFab');
        const fabMenu = document.querySelector('.fab-menu');
        const fabOptions = document.querySelectorAll('.fab-option');
        
        if (fab) {
            fab.addEventListener('click', function() {
                this.style.transform = 'translateY(-3px) scale(1.1) rotate(45deg)';
                
                setTimeout(() => {
                    this.style.transform = 'translateY(-3px) scale(1.05)';
                }, 200);
            });
        }
        
        // Voice entry functionality
        const voiceEntryBtn = document.getElementById('voiceEntry');
        if (voiceEntryBtn) {
            voiceEntryBtn.addEventListener('click', function() {
                startVoiceRecording();
            });
        }
        
        // Quick note functionality
        const quickNoteBtn = document.getElementById('quickNote');
        if (quickNoteBtn) {
            quickNoteBtn.addEventListener('click', function() {
                showQuickNoteModal();
            });
        }
    }
    
    function initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add stagger effect for entry cards
                    if (entry.target.classList.contains('entry-card')) {
                        const cards = document.querySelectorAll('.entry-card');
                        const index = Array.from(cards).indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe all animatable elements
        document.querySelectorAll('.entry-card, .analytics-card, .insight-card').forEach(el => {
            observer.observe(el);
        });
        
        // Profile metrics counter animation
        animateCounters();
    }
    
    function animateCounters() {
        const counters = document.querySelectorAll('.metric-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    function initializeInteractions() {
        // Analytics interactions
        const moodBars = document.querySelectorAll('.mood-fill');
        moodBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
        
        // Insight refresh functionality
        const refreshBtns = document.querySelectorAll('.insight-action');
        refreshBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                refreshInsight(this);
            });
        });
        
        // Quick actions
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', function(e) {
                if (this.id === 'exportBtn') {
                    e.preventDefault();
                    exportEntries();
                } else if (this.id === 'themeBtn') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        });
    }
    
    function initializeTheme() {
        const savedTheme = localStorage.getItem('diary-theme') || 'dark';
        document.body.className = savedTheme === 'light' ? 'light-mode' : '';
    }
    
    function toggleTheme() {
        const isLight = document.body.classList.contains('light-mode');
        
        if (isLight) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('diary-theme', 'dark');
            showToast('Switched to dark theme', 'info');
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('diary-theme', 'light');
            showToast('Switched to light theme', 'info');
        }
    }
    
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }
    
    function initializeAutoRefresh() {
        // Auto-refresh insights every 5 minutes
        setInterval(() => {
            refreshAllInsights();
        }, 300000);
    }
    
    // Utility Functions
    function createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function createHeartAnimation(element) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart floating-heart';
        heart.style.position = 'absolute';
        heart.style.color = 'var(--accent-red)';
        heart.style.fontSize = '1.5rem';
        heart.style.animation = 'floatUp 1s ease-out forwards';
        heart.style.pointerEvents = 'none';
        
        const rect = element.getBoundingClientRect();
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + 'px';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
    
    function readText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        } else {
            showToast('Text-to-speech not supported', 'error');
        }
    }
    
    function startVoiceRecording() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.start();
            showToast('Listening... Speak now!', 'info');
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                showQuickNoteModal(transcript);
            };
            
            recognition.onerror = function() {
                showToast('Voice recognition failed', 'error');
            };
        } else {
            showToast('Voice recognition not supported', 'error');
        }
    }
    
    function showQuickNoteModal(content = '') {
        const modal = document.createElement('div');
        modal.className = 'quick-note-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Quick Note</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <textarea placeholder="Write your quick note..." rows="4">${content}</textarea>
                    <div class="modal-actions">
                        <button class="btn btn-primary save-note">Save Note</button>
                        <button class="btn btn-secondary cancel-note">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal functionality
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-note');
        const saveBtn = modal.querySelector('.save-note');
        const textarea = modal.querySelector('textarea');
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        
        saveBtn.addEventListener('click', () => {
            const note = textarea.value.trim();
            if (note) {
                // Here you would typically save to backend
                showToast('Quick note saved!', 'success');
                modal.remove();
            }
        });
        
        // Focus textarea
        setTimeout(() => textarea.focus(), 100);
    }
    
    function refreshInsight(button) {
        const card = button.closest('.insight-card');
        const content = card.querySelector('.insight-content p');
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            const insights = [
                "Your writing style has become more expressive this month. Keep exploring different emotions!",
                "You've been consistent with your entries. This habit will serve you well in the long run.",
                "Your mood patterns show resilience. You bounce back quickly from challenging days.",
                "Consider writing about your goals more often. It helps with motivation and clarity.",
                "Your entries show growth in emotional intelligence. Keep reflecting on your experiences."
            ];
            
            const randomInsight = insights[Math.floor(Math.random() * insights.length)];
            content.textContent = randomInsight;
            
            button.innerHTML = '<i class="fas fa-refresh"></i> Get New Insight';
            button.disabled = false;
            
            showToast('New insight generated!', 'success');
        }, 2000);
    }
    
    function refreshAllInsights() {
        const refreshBtns = document.querySelectorAll('.insight-action');
        refreshBtns.forEach((btn, index) => {
            setTimeout(() => {
                if (Math.random() > 0.7) { // 30% chance to refresh each insight
                    refreshInsight(btn);
                }
            }, index * 1000);
        });
    }
    
    function exportEntries() {
        showToast('Preparing export...', 'info');
        
        // Simulate export process
        setTimeout(() => {
            const data = {
                user: 'Nitin/Esha',
                exportDate: new Date().toISOString(),
                totalEntries: document.querySelectorAll('.entry-card').length,
                entries: 'Entry data would be here...'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diary-entries.json';
            a.click();
            
            URL.revokeObjectURL(url);
            showToast('Entries exported successfully!', 'success');
        }, 2000);
    }
    
    function showTooltip(e) {
        const text = e.target.getAttribute('data-tooltip');
        if (!text) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
    }
    
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = getToastIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    function getToastIcon(type) {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'info': return 'fas fa-info-circle';
            default: return 'fas fa-info-circle';
        }
    }
});

// Additional CSS for dynamic elements
const additionalStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: rippleEffect 0.6s linear;
    pointer-events: none;
}

@keyframes rippleEffect {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes floatUp {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-50px) scale(1.5);
    }
}

.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    border-left: 4px solid var(--accent-blue);
}

.toast.show {
    transform: translateX(0);
}

.toast-success { border-left-color: var(--accent-green); }
.toast-error { border-left-color: var(--accent-red); }
.toast-warning { border-left-color: var(--accent-orange); }
.toast-info { border-left-color: var(--accent-blue); }

.tooltip {
    position: absolute;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    z-index: 1000;
    opacity: 0;
    transform: translateY(4px);
    transition: all 0.2s ease;
    pointer-events: none;
}

.tooltip.show {
    opacity: 1;
    transform: translateY(0);
}

.quick-note-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    width: 90%;
    max-width: 500px;
    border: 1px solid var(--border-color);
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    margin: 0;
    color: var(--text-primary);
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
}

.close-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.modal-body {
    padding: 1.5rem;
}

.modal-body textarea {
    width: 100%;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    padding: 1rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 1rem;
}

.modal-body textarea:focus {
    outline: none;
    border-color: var(--accent-blue);
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius-sm);
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: var(--transition);
}

.btn-primary {
    background: var(--gradient-primary);
    color: white;
}

.btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
}

.btn:hover {
    transform: translateY(-1px);
}

.list-view .entry-card {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.list-view .entry-image {
    width: 150px;
    height: 100px;
    flex-shrink: 0;
}

.list-view .entry-info {
    flex: 1;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
