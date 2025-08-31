// Entry Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth animations for mood bars
    const emotionBars = document.querySelectorAll('.bar-fill');
    
    // Animate bars on page load
    setTimeout(() => {
        emotionBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);

    // Action button handlers
    const editBtn = document.querySelector('.edit-btn');
    const shareBtn = document.querySelector('.share-btn');
    const deleteBtn = document.querySelector('.delete-btn');

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Navigate to edit page
            console.log('Edit entry clicked');
            // window.location.href = '/AI-diary/edit/' + entryId;
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Share functionality
            console.log('Share entry clicked');
            // Implement share logic here
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this entry?')) {
                console.log('Delete entry clicked');
                // Implement delete logic here
                // window.location.href = '/AI-diary/delete/' + entryId;
            }
        });
    }

    // Related entries navigation
    const relatedEntries = document.querySelectorAll('.related-entry');
    relatedEntries.forEach(entry => {
        entry.addEventListener('click', function() {
            console.log('Related entry clicked');
            // Navigate to related entry
            // window.location.href = '/AI-diary/entry/' + relatedEntryId;
        });
    });

    // Copy to clipboard functionality for sharing
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show success message
            showNotification('Entry link copied to clipboard!');
        });
    }

    // Show notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-green);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC to go back
        if (e.key === 'Escape') {
            window.history.back();
        }
        
        // E to edit (Ctrl/Cmd + E)
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            editBtn?.click();
        }
        
        // S to share (Ctrl/Cmd + S)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            shareBtn?.click();
        }
    });
});
