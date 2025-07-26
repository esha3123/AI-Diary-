// Enhanced AI Diary Public Feed JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLikeButtons();
    initializeCommentInputs();
    initializeFilters();
    initializeFAB();
    initializeLoadMore();
    addScrollAnimations();
});

// Enhanced Like functionality
function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
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
    let currentCount = parseInt(countSpan.textContent);
    
    if (button.classList.contains('liked')) {
        // Unlike
        button.classList.remove('liked');
        icon.className = 'far fa-heart';
        countSpan.textContent = Math.max(0, currentCount - 1);
        animateButton(button, 'unlike');
    } else {
        // Like
        button.classList.add('liked');
        icon.className = 'fas fa-heart';
        countSpan.textContent = currentCount + 1;
        animateButton(button, 'like');
        createHeartAnimation(button);
        showToast('❤️ Liked!', 'success');
    }
}

function animateButton(button, type) {
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

function createHeartAnimation(button) {
    const hearts = ['❤️', '💕', '💖', '💝'];
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = randomHeart;
            heart.style.cssText = `
                position: fixed;
                font-size: 20px;
                pointer-events: none;
                z-index: 9999;
                animation: heartFloat 2s ease-out forwards;
                user-select: none;
            `;
            
            const rect = button.getBoundingClientRect();
            heart.style.left = (rect.left + Math.random() * 40 - 20) + 'px';
            heart.style.top = (rect.top + Math.random() * 20 - 10) + 'px';
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// Enhanced Comments functionality
function toggleComments(entryId) {
    const commentsSection = document.getElementById(`comments-${entryId}`);
    const commentBtn = document.querySelector(`[onclick="toggleComments('${entryId}')"]`);
    const icon = commentBtn.querySelector('i');
    
    if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
        commentsSection.style.display = 'block';
        icon.className = 'fas fa-comment';
        loadComments(entryId);
        setTimeout(() => {
            const input = document.getElementById(`comment-input-${entryId}`);
            input.focus();
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        commentsSection.style.display = 'none';
        icon.className = 'far fa-comment';
    }
}

function loadComments(entryId) {
    const commentsList = document.querySelector(`#comments-${entryId} .comments-list`);
    
    // Enhanced mock comments
    const mockComments = [
        {
            author: "Sarah M.",
            text: "This is so relatable! Thanks for sharing ✨ Your words really touched my heart.",
            time: "2 hours ago"
        },
        {
            author: "Alex K.",
            text: "Beautiful writing, really moved me 💙 Keep sharing these amazing thoughts!",
            time: "5 hours ago"
        },
        {
            author: "Jamie R.",
            text: "I needed to read this today. Thank you for being so authentic 🌟",
            time: "1 day ago"
        }
    ];
    
    commentsList.innerHTML = '';
    mockComments.forEach((comment, index) => {
        const commentDiv = createCommentElement(comment);
        commentDiv.style.animationDelay = `${index * 0.1}s`;
        commentsList.appendChild(commentDiv);
    });
    
    updateCommentCount(entryId, mockComments.length);
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.innerHTML = `
        <div class="comment-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="comment-content">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-time">
                <i class="far fa-clock"></i> ${comment.time}
                <button class="comment-like-btn" onclick="likeComment(this)">
                    <i class="far fa-heart"></i> <span>0</span>
                </button>
                <button class="comment-reply-btn" onclick="replyToComment(this)">
                    <i class="fas fa-reply"></i> Reply
                </button>
            </div>
        </div>
    `;
    return commentDiv;
}

function postComment(entryId) {
    const input = document.getElementById(`comment-input-${entryId}`);
    const commentText = input.value.trim();
    
    if (commentText === '') {
        showToast('Please write a comment first!', 'warning');
        return;
    }
    
    const commentsList = document.querySelector(`#comments-${entryId} .comments-list`);
    const newComment = {
        author: "You",
        text: commentText,
        time: "Just now"
    };
    
    const commentElement = createCommentElement(newComment);
    commentElement.style.opacity = '0';
    commentElement.style.transform = 'translateY(20px)';
    commentsList.insertBefore(commentElement, commentsList.firstChild);
    
    // Animate the new comment
    setTimeout(() => {
        commentElement.style.transition = 'all 0.4s ease';
        commentElement.style.opacity = '1';
        commentElement.style.transform = 'translateY(0)';
    }, 50);
    
    // Update comment count
    const currentCount = commentsList.children.length;
    updateCommentCount(entryId, currentCount);
    
    // Clear input and show success
    input.value = '';
    showCommentSuccess(input);
    showToast('💬 Comment posted!', 'success');
    
    // Add confetti effect
    createConfetti(input);
}

function updateCommentCount(entryId, count) {
    const commentBtn = document.querySelector(`[onclick="toggleComments('${entryId}')"]`);
    const countSpan = commentBtn.querySelector('.comment-count');
    countSpan.textContent = count;
}

function showCommentSuccess(input) {
    const originalPlaceholder = input.placeholder;
    const originalBorderColor = input.style.borderColor;
    
    input.placeholder = "Comment posted! ✨";
    input.style.borderColor = '#10b981';
    
    setTimeout(() => {
        input.placeholder = originalPlaceholder;
        input.style.borderColor = originalBorderColor;
    }, 3000);
}

// Filter functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const moodFilters = document.querySelectorAll('.mood-filter');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterPosts(filter);
        });
    });
    
    moodFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            moodFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const mood = this.dataset.mood;
            filterByMood(mood);
        });
    });
}

function filterPosts(filter) {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
        post.style.display = 'block';
        post.style.animation = 'slideInUp 0.6s ease-out';
    });
    
    showToast(`Showing ${filter} posts`, 'info');
}

function filterByMood(mood) {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
        const postMood = post.dataset.mood;
        if (postMood === mood) {
            post.style.display = 'block';
            post.style.animation = 'slideInUp 0.6s ease-out';
        } else {
            post.style.display = 'none';
        }
    });
    
    showToast(`Showing posts with ${mood} mood`, 'info');
}

// Enhanced comment inputs
function initializeCommentInputs() {
    const commentInputs = document.querySelectorAll('.comment-input');
    
    commentInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const entryId = this.id.replace('comment-input-', '');
                postComment(entryId);
            }
        });
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Auto-resize functionality
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    });
}

// Share functionality with enhanced options
document.addEventListener('click', function(e) {
    if (e.target.closest('.share-btn')) {
        const postCard = e.target.closest('.post-card');
        const title = postCard.querySelector('.post-title').textContent;
        const text = postCard.querySelector('.post-text').textContent.substring(0, 100) + '...';
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `"${text}" - Check out this inspiring diary entry!`,
                url: window.location.href
            }).then(() => {
                showToast('📤 Shared successfully!', 'success');
            }).catch(() => {
                fallbackShare(title, text);
            });
        } else {
            fallbackShare(title, text);
        }
    }
});

function fallbackShare(title, text) {
    const shareData = `"${title}"\n\n${text}\n\n${window.location.href}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareData).then(() => {
            showToast('📋 Copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareData;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('📋 Copied to clipboard!', 'success');
    }
}

// Enhanced save/bookmark functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.save-btn')) {
        const button = e.target.closest('.save-btn');
        const icon = button.querySelector('i');
        
        if (button.classList.contains('saved')) {
            button.classList.remove('saved');
            icon.className = 'far fa-bookmark';
            showToast('📑 Removed from saved', 'info');
        } else {
            button.classList.add('saved');
            icon.className = 'fas fa-bookmark';
            animateButton(button, 'save');
            showToast('🔖 Saved to bookmarks!', 'success');
            createSparkles(button);
        }
    }
});

// Floating Action Button functionality
function initializeFAB() {
    const fabMain = document.querySelector('.fab-main');
    const fabContainer = document.querySelector('.fab-container');
    
    if (fabMain) {
        fabMain.addEventListener('click', function() {
            fabContainer.classList.toggle('expanded');
        });
        
        // Close FAB when clicking outside
        document.addEventListener('click', function(e) {
            if (!fabContainer.contains(e.target)) {
                fabContainer.classList.remove('expanded');
            }
        });
    }
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Load More Stories';
                showToast('📚 More stories loaded!', 'success');
            }, 1500);
        });
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// Add scroll animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.post-card').forEach(card => {
        observer.observe(card);
    });
}

// Helper functions
function createSparkles(element) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                font-size: 16px;
                pointer-events: none;
                z-index: 9999;
                animation: sparkleFloat 2s ease-out forwards;
                user-select: none;
            `;
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * 60 - 30) + 'px';
            sparkle.style.top = (rect.top + Math.random() * 40 - 20) + 'px';
            
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 2000);
        }, i * 100);
    }
}

function createConfetti(element) {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall 3s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            confetti.style.left = (rect.left + Math.random() * 200 - 100) + 'px';
            confetti.style.top = (rect.top - 20) + 'px';
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// Placeholder functions for FAB options
function uploadPhoto() {
    showToast('📸 Photo upload coming soon!', 'info');
}

function recordVoice() {
    showToast('🎤 Voice notes coming soon!', 'info');
}

function likeComment(button) {
    const icon = button.querySelector('i');
    const count = button.querySelector('span');
    
    if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        icon.className = 'far fa-heart';
        count.textContent = Math.max(0, parseInt(count.textContent) - 1);
    } else {
        button.classList.add('liked');
        icon.className = 'fas fa-heart';
        count.textContent = parseInt(count.textContent) + 1;
        animateButton(button, 'like');
    }
}

function replyToComment(button) {
    showToast('💬 Reply feature coming soon!', 'info');
}

// Add enhanced CSS animations
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-80px) scale(1.5) rotate(20deg);
            opacity: 0;
        }
    }
    
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-60px) scale(0.5) rotate(180deg);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(200px) rotate(720deg);
            opacity: 0;
        }
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: toastSlideIn 0.3s ease-out;
        min-width: 250px;
    }
    
    .toast-success { border-left: 4px solid var(--accent-green); }
    .toast-warning { border-left: 4px solid var(--accent-orange); }
    .toast-info { border-left: 4px solid var(--accent-blue); }
    .toast-error { border-left: 4px solid var(--accent-red); }
    
    .toast-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    
    .toast-message {
        color: var(--text-primary);
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0;
        margin-left: 1rem;
    }
    
    @keyframes toastSlideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .comment-like-btn, .comment-reply-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.75rem;
        margin-left: 1rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: var(--transition);
    }
    
    .comment-like-btn:hover, .comment-reply-btn:hover {
        color: var(--accent-blue);
        background: rgba(59, 130, 246, 0.1);
    }
    
    .comment-like-btn.liked {
        color: var(--accent-red);
    }
    
    .fab-expanded .fab-options {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(-10px) !important;
    }
    
    .comment-input-container.focused {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        border-radius: 20px;
    }
`;
document.head.appendChild(enhancedStyle);