// Edit Page - Optimized
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editForm');
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    const charCounter = document.querySelector('.char-counter');
    
    // Auto-resize textarea
    if (contentTextarea) {
        const autoResize = () => {
            contentTextarea.style.height = 'auto';
            contentTextarea.style.height = Math.max(200, contentTextarea.scrollHeight) + 'px';
        };
        autoResize();
        contentTextarea.addEventListener('input', autoResize);
    }
    
    // Character counter
    if (contentTextarea && charCounter) {
        const updateCounter = () => {
            const currentLength = contentTextarea.value.length;
            const maxLength = 2000;
            charCounter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) charCounter.style.color = 'var(--accent-red)';
            else if (currentLength > maxLength * 0.7) charCounter.style.color = 'var(--accent-orange)';
            else charCounter.style.color = 'var(--text-muted)';
            
            if (currentLength > maxLength) {
                contentTextarea.value = contentTextarea.value.substring(0, maxLength);
            }
        };
        updateCounter();
        contentTextarea.addEventListener('input', updateCounter);
    }
    
    // Form validation
    if (form) {
        form.addEventListener('submit', (e) => {
            if (!titleInput?.value.trim() || !contentTextarea?.value.trim()) {
                e.preventDefault();
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            const saveBtn = form.querySelector('.btn-primary');
            if (saveBtn) {
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                saveBtn.disabled = true;
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            form?.submit();
        }
        if (e.key === 'Escape') {
            document.querySelector('.btn-secondary')?.click();
        }
    });
    
    // Keep animations
    document.querySelectorAll('.form-section').forEach((section, index) => {
        section.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    });
});

function showToast(message, type = 'info') {
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
