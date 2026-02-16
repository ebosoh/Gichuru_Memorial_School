/* ============================================
   SCROLL-TRIGGERED ANIMATIONS
   Intersection Observer for Card Animations
   ============================================ */

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Optional: unobserve after animation
            // animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Observe all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        animateOnScroll.observe(card);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add animation class to new elements dynamically
window.observeNewCards = function () {
    const cards = document.querySelectorAll('.card:not(.observed)');
    cards.forEach(card => {
        card.classList.add('observed');
        animateOnScroll.observe(card);
    });
};
