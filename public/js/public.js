// Public Feed - Optimized
document.addEventListener('DOMContentLoaded', function() {
    initializeLikeButtons();
    initializeComments();
    initializeScrollAnimations();
});

// Keep like functionality
function initializeLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        const isLiked = button.dataset.liked === 'true';
        if (isLiked) button.classList.add('liked');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const entryId = this.dataset.entryId;
            toggleLike(this, entryId);
        });
    });
}

function toggleLike(button, entryId) {
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('.like-count');
    const isLiked = button.dataset.liked === 'true';
    const action = isLiked ? 'unlike' : 'like';
    
    button.disabled = true;
    
    fetch(`/AI-diary/${entryId}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (action === 'like') {
                button.classList.add('liked');
                button.dataset.liked = 'true';
                icon.className = 'fas fa-heart';
                countSpan.textContent = data.likes;
                showToast('❤️ Liked!', 'success');
            } else {
                button.classList.remove('liked');
                button.dataset.liked = 'false';
                icon.className = 'far fa-heart';
                countSpan.textContent = data.likes;
                showToast('💔 Unliked', 'info');
            }
            // Simple animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => button.style.transform = '', 200);
        } else {
            showToast(data.message || 'Action not allowed', 'warning');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Failed to update like', 'error');
    })
    .finally(() => {
        button.disabled = false;
    });
}

// Simple comment functionality
function initializeComments() {
    // Comment toggle
    document.querySelectorAll('[onclick*="toggleComments"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const entryId = this.onclick.toString().match(/toggleComments\('([^']+)'\)/)[1];
            toggleComments(entryId);
        });
    });
    
    // Auto-resize comment inputs
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        
        // Enter to submit
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.closest('form').submit();
            }
        });
    });
}

function toggleComments(entryId) {
    const commentsSection = document.getElementById(`comments-${entryId}`);
    const commentBtn = document.querySelector(`[onclick="toggleComments('${entryId}')"]`);
    const icon = commentBtn.querySelector('i');
    
    if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
        commentsSection.style.display = 'block';
        icon.className = 'fas fa-comment';
        setTimeout(() => {
            const input = document.getElementById(`comment-input-${entryId}`);
            input?.focus();
        }, 100);
    } else {
        commentsSection.style.display = 'none';
        icon.className = 'far fa-comment';
    }
}

// Keep scroll animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.post-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Simple toast notifications
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    existingToast?.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
    
    Object.assign(toast.style, {
        position: 'fixed', top: '20px', right: '20px', background: 'var(--bg-card)',
        border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)',
        boxShadow: 'var(--shadow-lg)', zIndex: '10000', padding: '1rem',
        animation: 'slideIn 0.3s ease-out', minWidth: '250px',
        color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center'
    });
    
    const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.style.borderLeftWidth = '4px';
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Comment interaction functions
function likeComment(entryId, commentId, button) {
    fetch(`/AI-diary/${entryId}/comment/${commentId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            const icon = button.querySelector('i');
            const countSpan = button.querySelector('span');
            let currentCount = parseInt(countSpan.textContent);
            
            icon.className = 'fas fa-heart';
            countSpan.textContent = currentCount + 1;
            button.style.transform = 'scale(1.2)';
            setTimeout(() => button.style.transform = '', 200);
            showToast('❤️ Comment liked!', 'success');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Failed to like comment', 'error');
    });
}

function deleteComment(entryId, commentId) {
    if (confirm('Delete this comment?')) {
        fetch(`/AI-diary/${entryId}/comment/${commentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
                if (commentElement) {
                    commentElement.style.transition = 'all 0.3s ease';
                    commentElement.style.opacity = '0';
                    setTimeout(() => commentElement.remove(), 300);
                    showToast('🗑️ Comment deleted', 'success');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to delete comment', 'error');
        });
    }
}

// Global functions for backward compatibility
window.toggleComments = toggleComments;
window.likeComment = likeComment;
window.deleteComment = deleteComment;