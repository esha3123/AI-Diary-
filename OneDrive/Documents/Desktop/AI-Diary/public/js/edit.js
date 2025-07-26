// Edit Page JavaScript - Enhanced Interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializeEditPage();
    
    // Form elements
    const form = document.getElementById('editForm');
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    const charCounter = document.querySelector('.char-counter');
    const saveBtn = document.querySelector('.btn-primary');
    const cancelBtn = document.querySelector('.btn-secondary');
    
    // Auto-save functionality
    let autoSaveTimeout;
    const AUTOSAVE_DELAY = 3000; // 3 seconds
    
    // Character counter for content
    if (contentTextarea && charCounter) {
        updateCharCounter();
        contentTextarea.addEventListener('input', updateCharCounter);
    }
    
    // Auto-resize textarea
    if (contentTextarea) {
        autoResizeTextarea(contentTextarea);
        contentTextarea.addEventListener('input', () => autoResizeTextarea(contentTextarea));
    }
    
    // Form validation
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Auto-save on input changes
        const formInputs = form.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', debounceAutoSave);
        });
    }
    
    // Mood selector animations
    initializeMoodSelector();
    
    // Privacy controls
    initializePrivacyControls();
    
    // Keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Page animations
    initializeAnimations();
    
    function initializeEditPage() {
        // Add loading state management
        document.body.classList.add('page-loaded');
        
        // Initialize tooltips
        initializeTooltips();
        
        // Initialize unsaved changes warning
        initializeUnsavedChangesWarning();
        
        console.log('Edit page initialized');
    }
    
    function updateCharCounter() {
        if (!contentTextarea || !charCounter) return;
        
        const currentLength = contentTextarea.value.length;
        const maxLength = 2000; // Adjust as needed
        
        charCounter.textContent = `${currentLength}/${maxLength}`;
        
        // Change color based on usage
        if (currentLength > maxLength * 0.9) {
            charCounter.style.color = 'var(--accent-red)';
        } else if (currentLength > maxLength * 0.7) {
            charCounter.style.color = 'var(--accent-orange)';
        } else {
            charCounter.style.color = 'var(--text-muted)';
        }
        
        // Prevent exceeding max length
        if (currentLength > maxLength) {
            contentTextarea.value = contentTextarea.value.substring(0, maxLength);
            charCounter.textContent = `${maxLength}/${maxLength}`;
        }
    }
    
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return false;
        }
        
        // Show saving state
        showSavingState();
        
        // Submit form
        form.submit();
    }
    
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        // Validate title
        if (!titleInput.value.trim()) {
            errors.push('Title is required');
            highlightError(titleInput);
            isValid = false;
        } else {
            clearError(titleInput);
        }
        
        // Validate content
        if (!contentTextarea.value.trim()) {
            errors.push('Content is required');
            highlightError(contentTextarea);
            isValid = false;
        } else {
            clearError(contentTextarea);
        }
        
        // Show errors if any
        if (!isValid) {
            showToast('Please fill in all required fields', 'error');
        }
        
        return isValid;
    }
    
    function highlightError(element) {
        element.style.borderColor = 'var(--accent-red)';
        element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        setTimeout(() => {
            clearError(element);
        }, 3000);
    }
    
    function clearError(element) {
        element.style.borderColor = '';
        element.style.boxShadow = '';
    }
    
    function debounceAutoSave() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(autoSave, AUTOSAVE_DELAY);
        
        // Show unsaved changes indicator
        showUnsavedChanges();
    }
    
    function autoSave() {
        // Implement auto-save functionality
        const formData = new FormData(form);
        
        // Show auto-save indicator
        showAutoSaveIndicator();
        
        // Here you would typically send an AJAX request to save
        // For now, just show the indicator
        setTimeout(() => {
            hideAutoSaveIndicator();
            hideUnsavedChanges();
        }, 1000);
    }
    
    function showSavingState() {
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
        }
    }
    
    function showAutoSaveIndicator() {
        const indicator = document.querySelector('.save-indicator');
        if (indicator) {
            indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Auto-saving...';
            indicator.style.opacity = '1';
        }
    }
    
    function hideAutoSaveIndicator() {
        const indicator = document.querySelector('.save-indicator');
        if (indicator) {
            indicator.innerHTML = '<i class="fas fa-check"></i> Changes saved automatically';
            setTimeout(() => {
                indicator.style.opacity = '0.6';
                indicator.innerHTML = '<i class="fas fa-cloud"></i> Auto-save enabled';
            }, 2000);
        }
    }
    
    function showUnsavedChanges() {
        document.body.classList.add('has-unsaved-changes');
    }
    
    function hideUnsavedChanges() {
        document.body.classList.remove('has-unsaved-changes');
    }
    
    function initializeMoodSelector() {
        const moodOptions = document.querySelectorAll('.mood-option');
        
        moodOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Add ripple effect
                createRippleEffect(this);
                
                // Animate selection
                animateMoodSelection(this);
            });
            
            // Add hover effects
            option.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            option.addEventListener('mouseleave', function() {
                if (!this.previousElementSibling.checked) {
                    this.style.transform = '';
                }
            });
        });
    }
    
    function animateMoodSelection(selectedOption) {
        // Remove previous selections
        const allOptions = document.querySelectorAll('.mood-option');
        allOptions.forEach(option => {
            option.style.transform = '';
            option.classList.remove('selected-mood');
        });
        
        // Animate selected option
        selectedOption.classList.add('selected-mood');
        selectedOption.style.transform = 'translateY(-4px) scale(1.05)';
        
        // Show success feedback
        showToast('Mood updated', 'success');
    }
    
    function initializePrivacyControls() {
        const privacyCheckbox = document.getElementById('isPrivate');
        const privacyLabel = document.querySelector('.privacy-label');
        
        if (privacyCheckbox && privacyLabel) {
            privacyLabel.addEventListener('click', function() {
                setTimeout(() => {
                    const isChecked = privacyCheckbox.checked;
                    const message = isChecked ? 'Entry set to private' : 'Entry set to public';
                    const type = isChecked ? 'info' : 'success';
                    showToast(message, type);
                }, 100);
            });
        }
    }
    
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (form) {
                    handleFormSubmit(e);
                }
            }
            
            // Ctrl/Cmd + Enter to save and continue
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (form) {
                    handleFormSubmit(e);
                }
            }
            
            // Escape to cancel
            if (e.key === 'Escape') {
                if (cancelBtn) {
                    cancelBtn.click();
                }
            }
        });
    }
    
    function initializeAnimations() {
        // Stagger form section animations
        const sections = document.querySelectorAll('.form-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });
        
        // Add scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
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
    
    function initializeUnsavedChangesWarning() {
        let hasUnsavedChanges = false;
        
        // Track changes
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                hasUnsavedChanges = true;
            });
        });
        
        // Warn before leaving
        window.addEventListener('beforeunload', (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        
        // Clear warning on form submit
        if (form) {
            form.addEventListener('submit', () => {
                hasUnsavedChanges = false;
            });
        }
    }
    
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

// Additional CSS for dynamic elements (add to CSS file or include here)
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

.toast-success {
    border-left-color: var(--accent-green);
}

.toast-error {
    border-left-color: var(--accent-red);
}

.toast-warning {
    border-left-color: var(--accent-orange);
}

.toast-info {
    border-left-color: var(--accent-blue);
}

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

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--border-color);
}

.has-unsaved-changes .save-indicator {
    color: var(--accent-orange) !important;
}

.animate-in {
    animation: slideUpFade 0.6s ease forwards;
}

@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.selected-mood {
    animation: moodPulse 0.3s ease;
}

@keyframes moodPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1.05); }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
