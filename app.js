// =======================
// Smooth slideshow (hero)
// =======================
class SmoothSlideshow {
    constructor(selector, options = {}) {
        this.slides = document.querySelectorAll(selector);
        if (this.slides.length === 0) return;

        this.options = {
            interval: 5000,
            fadeDuration: 1500,
            ...options
        };
        this.currentIndex = 0;
        this.lastTimestamp = 0;
        this.rafId = null;
        this.isRunning = false;
    }

    init() {
        this.slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.opacity = index === 0 ? '1' : '0';
            slide.style.zIndex = index === 0 ? '1' : '0';
            slide.style.transition = `opacity ${this.options.fadeDuration}ms ease-in-out`;
        });
        this.start();
        this.bindEvents();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        cancelAnimationFrame(this.rafId);
    }

    animate(now) {
        if (!this.lastTimestamp) {
            this.lastTimestamp = now;
        }
        const elapsed = now - this.lastTimestamp;
        if (elapsed > this.options.interval) {
            this.lastTimestamp = now;
            this.next();
        }
        this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    showSlide(index) {
        if (index === this.currentIndex) return;

        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];

        // fade current out
        currentSlide.style.opacity = '0';
        currentSlide.style.zIndex = '0';

        // fade next in
        nextSlide.style.zIndex = '1';
        nextSlide.style.opacity = '1';

        this.currentIndex = index;
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    bindEvents() {
        const prevButton = document.querySelector('.slideshow-arrow.prev');
        const nextButton = document.querySelector('.slideshow-arrow.next');

        // simple debounce so spamming arrows doesn’t kill the fade
        let isLocked = false;
        const lockDelay = this.options.fadeDuration || 1500;

        const handleClick = (direction) => {
            if (isLocked) return;
            isLocked = true;

            if (direction === 'prev') this.prev();
            else this.next();

            setTimeout(() => {
                isLocked = false;
            }, lockDelay);
        };

        if (prevButton) {
            prevButton.addEventListener('click', () => handleClick('prev'));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => handleClick('next'));
        }
    }
}

// ===============================================================
// === FINAL CAROUSEL CLASS - WITH LOOPING & ALL FIXES         ===
// (unchanged from your version)
// ===============================================================
class FlippingCoverFlow {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.carousel = this.container.querySelector('.logo-carousel');
        this.prevButton = this.container.querySelector('.carousel-arrow.prev');
        this.nextButton = this.container.querySelector('.carousel-arrow.next');
        this.flipContainer = document.querySelector('.project-flip-container');
        this.flipContent = this.flipContainer.querySelector('.flip-back');

        this.projects = [
            { title: 'VANTARA NIWAS - MACHAAN Launch', type: '', description: "Launched the MACHAAN restaurant inside Vantara Niwas, a seven-star hotel owned by Anant Ambani, hosting an exclusive dinner for Mr. Ambani and other special guests.", logo: 'images/project-images/vantaralogo.jpg' },
            { title: 'Little Food Co.', type: 'Culinary Consultancy', description: "Enhanced catering and delivery for this premier Mumbai brand, servicing clients like Spotify and Nykaa by elevating dishes, optimizing workflows, and implementing data tracking.", logo: 'images/project-images/littlefoodlogo.PNG' },
            { title: 'META - WhatsApp Privacy Ad Film', type: '', description: 'Provided comprehensive food styling and kitchen design consultation for the ad film, ensuring authentic culinary scene portrayal.', logo: 'images/project-images/whatsapplogo.png' },
            { title: 'Moonshine', type: 'Brand Positioning & Strategy', description: "Developed the brand identity and 'Be Better' tagline, creating a social media strategy focused on sustainability for this unique mead brand.", logo: 'images/project-images/moonshine.png' },
            { title: 'VIRAASAT - Aaverina Hospitality', type: 'Contemporary Indian Restaurant', description: 'Collaborated on a 300-seat restaurant in Mysore focusing on Northern Frontier Cuisine, blending traditional flavors with modern techniques.', logo: 'images/project-images/virasatlogo.png' },
            { title: 'Basque by Breve', type: 'Concept Development', description: 'Developed a concept café in Bandra inspired by St. Sebastian cheesecake, featuring unique varieties and a gourmet sandwich shop.', logo: 'images/project-images/basque.png' },
            { title: 'Phat Fillings', type: 'Premium Pie Delivery', description: 'Led the creation of a premium delivery brand for pies with Indian and Australian flavors, featured in Vogue and Upper Crust.', logo: 'images/project-images/phat logo.png' },
            { title: 'ZEKI', type: 'Upscale Casual Bistro', description: 'Developed an upscale bistro in Andheri West focused on global cuisine, designing the kitchen, curating crockery, and crafting an international menu.', logo: 'images/project-images/zekilogo.PNG' },
            { title: 'Doppler', type: '', description: "Conceptualized a café for Boomerang Hospitality in a historic Jaipur haveli, redefining the experience as the city's premier slow bar destination.", logo: 'images/project-images/doppler.png' },
            { title: 'Sarabi', type: 'Modern Indian Restaurant', description: "An upscale 12,000 sqft space offering contemporary progressive Indian food, designed for a discerning clientele.", logo: 'images/project-images/saarbai.png' },
            { title: 'Sunny Da Dhaba', type: '', description: 'Evolved a 30+ year legacy brand into a dual-floor destination with a Mediterranean café and a modern-Indian restaurant with playful tapas.', logo: 'images/project-images/sunnyy.png' }
        ];

        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.populateCarousel();
        this.cards = this.carousel.querySelectorAll('.logo-card');
        this.updateCarouselPositions(true);
        this.bindEvents();
    }

    populateCarousel() {
        this.carousel.innerHTML = this.projects.map((project, index) => `
            <div class="logo-card" data-index="${index}">
                <img src="${project.logo}" alt="${project.title}">
            </div>
        `).join('');
    }

    updateCarouselPositions(isInitial = false) {
        const total = this.projects.length;

        for (let i = 0; i < total; i++) {
            const card = this.cards[i];
            const offset = i - this.currentIndex;

            let transform, zIndex, filter, opacity;

            const circularOffset = (offset + total) % total;
            const rightOffset = (this.currentIndex - i + total) % total;
            const distance = Math.min(circularOffset, rightOffset);

            if (isInitial) card.style.transition = 'none';
            else card.style.transition = 'transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease';

            if (distance === 0) {
                transform = 'translateX(0) scale(1)';
                zIndex = 10;
                filter = 'none';
                opacity = 1;
            } else if (distance === 1) {
                if (circularOffset === 1 || (circularOffset < total / 2 && circularOffset !== 0)) {
                    transform = 'translateX(150px) scale(0.7)';
                } else {
                    transform = 'translateX(-150px) scale(0.7)';
                }
                zIndex = 5;
                filter = 'blur(2px)';
                opacity = 0.5;
            } else {
                transform = `translateX(${offset * 75}px) scale(0.5)`;
                opacity = 0;
                zIndex = 1;
            }

            card.style.transform = transform;
            card.style.zIndex = zIndex;
            card.style.filter = filter;
            card.style.opacity = opacity;
        }
    }

    showFlipModal(index) {
        const project = this.projects[index];

        this.flipContent.innerHTML = `
            <button class="modal-close-btn">&times;</button>
            <h3 style="color: #FFFFFF !important; margin-bottom: 15px;">${project.title}</h3>
            ${project.type ? `<p class="project-type" style="color: #CCCCCC !important; font-style: italic; margin-bottom: 15px;">${project.type}</p>` : ''}
            <p style="color: #FFFFFF !important; line-height: 1.6;">${project.description}</p>
            <a href="contact.html" class="enquire-btn" style="margin-top:24px;display:inline-block;">Start your own project</a>
        `;

        this.flipContent.style.backgroundColor = '#1f2121';
        this.flipContent.style.color = '#FFFFFF';

        this.flipContainer.classList.add('active');

        const closeBtn = this.flipContainer.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideFlipModal(), { once: true });
        }
    }

    hideFlipModal() {
        this.flipContainer.classList.remove('active');
    }

    bindEvents() {
        this.nextButton.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex + 1) % this.projects.length;
            this.updateCarouselPositions();
        });

        this.prevButton.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
            this.updateCarouselPositions();
        });

        let touchStartTime = 0;
        let touchEndTime = 0;

        this.carousel.addEventListener('touchstart', () => {
            touchStartTime = Date.now();
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            if (touchDuration < 200) {
                const card = e.target.closest('.logo-card');
                if (card && parseInt(card.dataset.index) === this.currentIndex) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showFlipModal(this.currentIndex);
                }
            }
        });

        this.carousel.addEventListener('click', (e) => {
            if ('ontouchstart' in window) return;

            const card = e.target.closest('.logo-card');
            if (card && parseInt(card.dataset.index) === this.currentIndex) {
                this.showFlipModal(this.currentIndex);
            }
        });

        this.flipContainer.addEventListener('click', (e) => {
            if (e.target === this.flipContainer) {
                this.hideFlipModal();
            }
        });
    }
}

// =========================
// Smooth scrolling engine
// =========================
class SmoothScroll {
    constructor() {
        this.current = 0;
        this.target = 0;
        this.ease = 0.1;
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.setBodyHeight();
        this.bindEvents();
        this.render();
    }

    setBodyHeight() {
        document.body.style.height = `${document.documentElement.scrollHeight}px`;
    }

    bindEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleScroll() {
        this.target = window.scrollY;
        this.isScrolling = true;
    }

    handleResize() {
        this.setBodyHeight();
    }

    render() {
        if (this.isScrolling) {
            this.current += (this.target - this.current) * this.ease;

            if (Math.abs(this.target - this.current) < 0.1) {
                this.current = this.target;
                this.isScrolling = false;
            }

            const elements = document.querySelectorAll('.smooth-scroll-element');
            elements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(this.current * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        requestAnimationFrame(this.render.bind(this));
    }
}

// =========================
// Navigation (header + dropdowns)
// =========================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // mobile burger
        this.mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // dropdowns: add arrow + behaviour
        this.dropdowns.forEach(dropdown => {
            const toggleLink = dropdown.querySelector('.dropdown-toggle');

            const arrow = document.createElement('span');
            arrow.className = 'dropdown-arrow';
            arrow.innerHTML = '▾';
            toggleLink.appendChild(arrow);

            // mobile: tap arrow to open
            arrow.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });

            // desktop: click link to open dropdown instead of navigating
            toggleLink.addEventListener('click', (e) => {
                if (window.innerWidth > 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // scroll header style + section highlighting
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // close mobile menu on resize up
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMobileMenu();
            }
        });

        // smooth scroll for same-page anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleAnchorClick.bind(this));
        });
    }

    toggleMobileMenu() {
        this.isOpen = !this.isOpen;
        this.mobileToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isOpen = false;
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);

        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// =========================
// Intersection Observer
// =========================
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.glass-card, .service-card, .project-card, .hero-content');
        elements.forEach(el => {
            el.classList.add('loading');
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                entry.target.classList.remove('loading');
            }
        });
    }
}

// =========================
// Form handling (unchanged)
// =========================
class FormHandler {
    constructor() {
        this.form = document.querySelector('form[action*="formspree"]');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showSuccess();
                this.form.reset();
            } else {
                this.showError();
            }
        } catch (error) {
            this.showError();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    showSuccess() {
        this.showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
    }

    showError() {
        this.showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    }

    showMessage(text, type) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `form-message form-message--${type}`;
        message.textContent = text;

        this.form.parentNode.insertBefore(message, this.form.nextSibling);

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// =========================
// Parallax effects
// =========================
class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length > 0) {
            this.bindEvents();
        }
    }

    bindEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const scrolled = window.pageYOffset;

        this.elements.forEach(element => {
            const rate = scrolled * (element.dataset.parallax || 0.5);
            element.style.transform = `translateY(${rate}px)`;
        });
    }
}

// =========================
// Card hover effects
// =========================
class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.glass-card, .service-card, .project-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
