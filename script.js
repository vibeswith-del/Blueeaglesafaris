document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.main-header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.style.backgroundColor = '#ffffff'; // White background when scrolled
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.classList.remove('scrolled');
            // Only transparent if desktop, mobile has solid color via CSS
            if (window.innerWidth > 768) {
                header.style.backgroundColor = 'transparent';
                header.style.boxShadow = 'none';
            } else {
                header.style.backgroundColor = '#ffffff'; // White background on mobile
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check in case of refresh at specific scroll position
    handleScroll();

    // Resize listener to handle mobile/desktop background header logic
    window.addEventListener('resize', handleScroll);

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Handle form select labels
    const selects = document.querySelectorAll('.inquiry-form select');
    selects.forEach(select => {
        // Check initial state
        if (select.value && select.value !== '') {
            const label = select.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.top = '-20px';
                label.style.fontSize = '0.8rem';
                label.style.color = 'var(--color-accent)';
            }
        }

        select.addEventListener('change', function () {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (this.value && this.value !== '') {
                    label.style.top = '-20px';
                    label.style.fontSize = '0.8rem';
                    label.style.color = 'var(--color-accent)';
                } else {
                    label.style.top = '10px';
                    label.style.fontSize = '1rem';
                    label.style.color = 'rgba(255, 255, 255, 0.6)';
                }
            }
        });
    });

    // Handle date inputs
    const dateInputs = document.querySelectorAll('.inquiry-form input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function () {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL' && this.value) {
                label.style.top = '-20px';
                label.style.fontSize = '0.8rem';
                label.style.color = 'var(--color-accent)';
            }
        });
    });

    console.log("Blueeaglesafaris initialized.");
});

// Global function for toggle functionality
function toggleItinerary(id) {
    const details = document.getElementById(id);
    const btn = window.event ? window.event.target : null;

    if (!details) return;

    details.classList.toggle('active');

    if (btn) {
        if (details.classList.contains('active')) {
            btn.textContent = "Hide Details";
        } else {
            btn.textContent = "View Detailed Itinerary";
        }
    }
}
