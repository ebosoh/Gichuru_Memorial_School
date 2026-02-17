/* ============================================
   HERO CAROUSEL WITH LAZY LOADING
   ============================================ */

class HeroCarousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.autoPlayInterval = options.autoPlayInterval || 5000;
        this.isPlaying = false;
        this.timer = null;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Show first slide
        this.slides[0].classList.add('active');

        // Lazy load first image
        this.lazyLoadSlide(0);

        // Preload next image
        if (this.slides.length > 1) {
            this.lazyLoadSlide(1);
        }

        // Setup controls
        this.setupControls();

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // Touch support for mobile
        this.setupTouchSupport();
    }

    setupControls() {
        const prevBtn = this.container.querySelector('.carousel-prev');
        const nextBtn = this.container.querySelector('.carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
    }

    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    lazyLoadSlide(index) {
        const slide = this.slides[index];
        if (!slide) return;

        const img = slide.querySelector('img[data-src]');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }

    goToSlide(index) {
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');

        // Lazy load current slide
        this.lazyLoadSlide(this.currentSlide);

        // Preload next slide
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.lazyLoadSlide(nextIndex);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.timer = setInterval(() => this.nextSlide(), this.autoPlayInterval);
        }
    }

    pauseAutoPlay() {
        if (this.isPlaying) {
            this.isPlaying = false;
            clearInterval(this.timer);
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel('hero-carousel', {
        autoPlayInterval: 5000
    });
});
