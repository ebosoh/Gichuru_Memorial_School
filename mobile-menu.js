/* ============================================
   MOBILE NAVIGATION MENU
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Animate hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        if (menuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');

            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');

            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        if (dropdownLink && window.innerWidth <= 768) {
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navMenu.querySelectorAll('.nav-link, .dropdown-menu a').forEach(link => {
        const href = link.getAttribute('href');
        // Handle anchor links by stripping hash
        const cleanHref = href ? href.split('#')[0] : '';

        // precise match or handling index.html
        if (cleanHref === currentPage || (currentPage === '' && cleanHref === 'index.html')) {
            link.classList.add('active');

            // If this link is inside a dropdown, also highlight the parent dropdown toggle
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('.nav-link');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
});
