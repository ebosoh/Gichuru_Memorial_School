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

    // Process logo backgrounds to remove white
    processLogoBackgrounds();

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

/**
 * Dynamically removes white background from logo images
 * using HTML5 Canvas pixel manipulation.
 */
function processLogoBackgrounds() {
    const logos = document.querySelectorAll('.nav-logo, .footer-logo');

    logos.forEach(logoImg => {
        if (logoImg.complete) {
            handleLogoProcessing(logoImg);
        } else {
            logoImg.addEventListener('load', () => handleLogoProcessing(logoImg));
        }
    });
}

function handleLogoProcessing(imgElement) {
    if (imgElement.dataset.processed) return;

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = imgElement.naturalWidth;
        const height = imgElement.naturalHeight;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(imgElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        imgElement.src = canvas.toDataURL('image/png');
        imgElement.dataset.processed = 'true';
        imgElement.classList.add('logo-processed');
    } catch (e) {
        console.warn('Logo processing failed (likely CORS or file protocol):', e);
        imgElement.classList.add('logo-processed');
    }
}
