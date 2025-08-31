document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });

    // Stats Counter Animation
    const counterAnimation = () => {
        document.querySelectorAll('.stat-counter').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            
            const updateCounter = () => {
                const current = parseInt(counter.innerText);
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCounter, 10);
                }
            };
            updateCounter();
        });
    };

    // Initialize counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            counterAnimation();
        }
    });
    
    statsObserver.observe(document.querySelector('.stats-section'));
});