document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.main-header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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

    // Live Weather Widget Implementation
    const initWeatherWidgets = () => {
        const widgets = document.querySelectorAll('.weather-widget');

        widgets.forEach(async (widget) => {
            const lat = widget.getAttribute('data-lat');
            const lon = widget.getAttribute('data-lon');

            if (!lat || !lon) return;

            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await response.json();

                if (data.current_weather) {
                    const temp = Math.round(data.current_weather.temperature);
                    const windspeed = data.current_weather.windspeed;

                    widget.innerHTML = `
                        <div class="weather-info">
                            <span class="weather-temp">${temp}°C</span>
                            <span class="weather-live-indicator"><span class="live-dot"></span>Live</span>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error fetching weather:', error);
                widget.innerHTML = `<span class="weather-error">Weather unavailable</span>`;
            }
        });
    };

    if (document.querySelector('.weather-widget')) {
        initWeatherWidgets();
    }

    // Currency Conversion Logic
    const initCurrencyManager = () => {
        const currencySelect = document.getElementById('currency-select');
        if (!currencySelect) return;

        const exchangeRates = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79
        };

        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£'
        };

        const updatePrices = (currency) => {
            const rate = exchangeRates[currency];
            const symbol = symbols[currency];
            const priceElements = document.querySelectorAll('[data-usd]');

            priceElements.forEach(el => {
                const usdValue = parseFloat(el.getAttribute('data-usd'));
                const convertedValue = (usdValue * rate).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });

                // If the element has specific children to update, do that, otherwise update text
                const valueSpan = el.querySelector('.price-value');
                if (valueSpan) {
                    valueSpan.textContent = convertedValue;
                    el.querySelector('.price-symbol').textContent = symbol;
                } else {
                    el.textContent = `${symbol}${convertedValue}`;
                }
            });
        };

        currencySelect.addEventListener('change', (e) => {
            const selectedCurrency = e.target.value;
            localStorage.setItem('preferredCurrency', selectedCurrency);
            updatePrices(selectedCurrency);
        });

        // Load saved currency
        const savedCurrency = localStorage.getItem('preferredCurrency') || 'USD';
        currencySelect.value = savedCurrency;
        updatePrices(savedCurrency);
    };

    initCurrencyManager();

    // Testimonial Slider Logic
    const initTestimonialSlider = () => {
        const containers = document.querySelectorAll('.testimonial-slider-container');

        containers.forEach(container => {
            const slider = container.querySelector('.testimonial-slider');
            const cards = container.querySelectorAll('.testimonial-card');
            const prevBtn = container.querySelector('.prev');
            const nextBtn = container.querySelector('.next');
            const dotsContainer = container.querySelector('.slider-dots');

            let currentIndex = 0;
            const cardCount = cards.length;

            // Create dots
            cards.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.dot');

            const updateSlider = () => {
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const goToSlide = (index) => {
                currentIndex = index;
                updateSlider();
            };

            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % cardCount;
                updateSlider();
            };

            const prevSlide = () => {
                currentIndex = (currentIndex - 1 + cardCount) % cardCount;
                updateSlider();
            };

            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);

            // Auto-play
            let interval = setInterval(nextSlide, 5000);

            container.addEventListener('mouseenter', () => clearInterval(interval));
            container.addEventListener('mouseleave', () => {
                interval = setInterval(nextSlide, 5000);
            });
        });
    };

    initTestimonialSlider();

    // Virtual Safari Map Logic
    const initSafariMap = () => {
        const regions = document.querySelectorAll('.map-region');

        regions.forEach(region => {
            region.addEventListener('click', () => {
                const targetId = region.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Optional: highlight the card
                    targetElement.classList.add('highlight-card');
                    setTimeout(() => targetElement.classList.remove('highlight-card'), 2000);
                }
            });
        });
    };

    initSafariMap();

    // Lightbox Gallery Logic
    const initLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        const galleryBtns = document.querySelectorAll('.view-gallery-btn');

        let currentGallery = [];
        let currentIndex = 0;

        const openLightbox = (images, index) => {
            currentGallery = images;
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const updateLightbox = () => {
            const data = currentGallery[currentIndex];
            lightboxImg.src = data.src;
            lightboxCaption.textContent = data.caption || 'Blue Eagle Safaris Experience';
        };

        galleryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const imagesStr = btn.getAttribute('data-images');
                const images = JSON.parse(imagesStr);
                openLightbox(images, 0);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightbox();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
        });
    };

    initLightbox();
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
