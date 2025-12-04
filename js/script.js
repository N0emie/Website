// Loading Screen Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Loading screen script started');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;
    const loadingVideo = document.querySelector('.loading-logo');
    let progress = 0;
    
    console.log('Loading screen elements:', {
        loadingScreen: !!loadingScreen,
        progressBar: !!progressBar,
        progressText: !!progressText,
        mainContent: !!mainContent
    });
    
    // Add loading class to body
    body.classList.add('loading');
    console.log('Added loading class to body');
    
    // Minimum loading time to ensure user sees the loading screen
    const minLoadingTime = 2000; // Minimum 2 seconds
    const startTime = Date.now();
    
    // Initialize loading video
    const loadingVideoElement = document.getElementById('loading-video');
    const loadingFallback = document.getElementById('loading-fallback');
    
    if (loadingVideoElement) {
        // Handle video loading events
        loadingVideoElement.addEventListener('loadeddata', function() {
            console.log('Loading video loaded successfully');
        });
        
        loadingVideoElement.addEventListener('error', function(e) {
            console.log('Loading video error:', e);
            // Show fallback image if video fails
            loadingVideoElement.style.display = 'none';
            if (loadingFallback) {
                loadingFallback.style.display = 'block';
            }
        });
    }
    
    // Initialize animated background immediately
    initAnimatedBackground();
    
    // Real resource loading tracking
    let resourcesLoaded = 0;
    let totalResources = 0;
    let progress = 0;
    
    // Define all resources that need to be loaded
    const allResources = [
        // WebP images
        'assets/webp/telegram.webp',
        'assets/webp/youtube.webp', 
        'assets/webp/twitch.webp',
        'assets/webp/1012-1.webp',
        'assets/webp/1012-2.webp',
        'assets/webp/1012-3.webp',
        'assets/webp/1012.webp',
        'assets/webp/69.webp',
        'assets/webp/okno.webp',
        'assets/webp/fooon.webp',
        'assets/webp/stolb.webp',
        'assets/webp/octopus.webp',
        'assets/webp/CS2.webp',
        'assets/webp/pers.webp',
        'assets/webp/niz.webp',
        'assets/webp/verh.webp',
        // Tournament images
        'assets/images/tournaments/csgo-tournament.jpg',
        'assets/images/tournaments/dota2-championship.jpg',
        'assets/images/tournaments/valorant-cup.jpg',
        'assets/images/tournaments/lol-tournament.jpg',
        'assets/images/tournament-cards/mobile-fest.jpg',
        'assets/images/tournament-cards/volt-energy-cup.jpg',
        'assets/images/tournament-cards/winline-cs2.jpg',
        'assets/images/tournament-cards/dota2-champions.jpg',
        // Videos
        'assets/video/new_loading_logo.mp4',
        'assets/video/video1.mp4',
        'assets/video/video2.mp4',
        'assets/video/video3.mp4',
        'assets/video/video4.mp4',
        'assets/video/video5.mp4',
        'assets/video/video6.mp4',
        'assets/services/technical.mp4',
        'assets/services/stream.mp4',
        'assets/services/prize.mp4'
    ];
    
    totalResources = allResources.length;
    console.log(`Total resources to load: ${totalResources}`);
    
    // Load each resource
    allResources.forEach((resourcePath, index) => {
        const isVideo = resourcePath.endsWith('.mp4');
        
        if (isVideo) {
            // Load video
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.addEventListener('loadeddata', () => {
                resourcesLoaded++;
                console.log(`Video ${index + 1} loaded (${resourcePath}): ${resourcesLoaded}/${totalResources}`);
                updateProgress();
            });
            
            video.addEventListener('error', () => {
                resourcesLoaded++;
                console.log(`Video ${index + 1} failed (${resourcePath}): ${resourcesLoaded}/${totalResources}`);
                updateProgress();
            });
            
            video.src = resourcePath;
            video.load();
        } else {
            // Load image
            const img = new Image();
            
            img.addEventListener('load', () => {
                resourcesLoaded++;
                console.log(`Image ${index + 1} loaded (${resourcePath}): ${resourcesLoaded}/${totalResources}`);
                updateProgress();
            });
            
            img.addEventListener('error', () => {
                resourcesLoaded++;
                console.log(`Image ${index + 1} failed (${resourcePath}): ${resourcesLoaded}/${totalResources}`);
                updateProgress();
            });
            
            img.src = resourcePath;
        }
    });
    
    // Update progress based on actual resource loading
    function updateProgress() {
        if (totalResources > 0) {
            progress = (resourcesLoaded / totalResources) * 100;
        } else {
            progress = 100;
        }
        
        const roundedProgress = Math.floor(progress);
        if (progressText) {
            progressText.textContent = `${roundedProgress}%`;
        }
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        console.log(`Loading progress: ${roundedProgress}% (${resourcesLoaded}/${totalResources})`);
        
        // Hide loading screen when all resources are loaded
        if (resourcesLoaded >= totalResources) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
            
            console.log(`All resources loaded! Elapsed: ${elapsedTime}ms, Remaining: ${remainingTime}ms`);
            
            setTimeout(() => {
                console.log('Hiding loading screen...');
                loadingScreen.classList.add('fade-out');
                body.classList.remove('loading');
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    console.log('Loading screen removed from DOM');
                }, 500);
            }, remainingTime);
        }
    }
    
    // Initial progress update
    updateProgress();
    
    // Emergency fallback - force completion after 15 seconds
    setTimeout(() => {
        if (!loadingScreen.classList.contains('fade-out')) {
            console.log('Emergency fallback triggered - forcing loading completion');
            resourcesLoaded = totalResources;
            updateProgress();
        }
    }, 15000);
});

// Tournament Carousel Drag-and-Drop Navigation
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('tournaments-carousel');
    
    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let animationId;
        
        // Mouse events
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.scrollBehavior = 'auto';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            window.dragDistance = 0;
            
            // Cancel any ongoing momentum animation
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        carousel.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                applyMomentum();
                
                // Remove dragging class after a short delay
                setTimeout(() => {
                    carousel.classList.remove('dragging');
                    window.dragDistance = 0;
                }, 100);
            }
        });
        
        carousel.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                applyMomentum();
                
                // Remove dragging class after a short delay
                setTimeout(() => {
                    carousel.classList.remove('dragging');
                    window.dragDistance = 0;
                }, 100);
            }
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const currentTime = Date.now();
            const currentX = e.pageX;
            
            // Calculate velocity for momentum
            if (currentTime - lastTime > 0) {
                velocity = (currentX - lastX) / (currentTime - lastTime);
            }
            
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Multiply for faster scroll
            carousel.scrollLeft = scrollLeft - walk;
            
            // Track drag distance
            window.dragDistance = Math.abs(walk);
            
            // Add dragging class to prevent clicks
            if (window.dragDistance > 3) {
                carousel.classList.add('dragging');
            }
            
            lastX = currentX;
            lastTime = currentTime;
        });
        
        // Touch events for mobile
        carousel.addEventListener('touchstart', (e) => {
            isDown = true;
            carousel.style.scrollBehavior = 'auto';
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            lastX = e.touches[0].pageX;
            lastTime = Date.now();
            velocity = 0;
            
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            
            const currentTime = Date.now();
            const currentX = e.touches[0].pageX;
            
            if (currentTime - lastTime > 0) {
                velocity = (currentX - lastX) / (currentTime - lastTime);
            }
            
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
            
            lastX = currentX;
            lastTime = currentTime;
        });
        
        carousel.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                applyMomentum();
            }
        });
        
        // Apply momentum scrolling
        function applyMomentum() {
            if (Math.abs(velocity) < 0.1) {
                carousel.style.scrollBehavior = 'smooth';
                return;
            }
            
            const friction = 0.95;
            const minVelocity = 0.1;
            
            function animate() {
                velocity *= friction;
                carousel.scrollLeft -= velocity * 16; // 16ms frame time
                
                if (Math.abs(velocity) > minVelocity) {
                    animationId = requestAnimationFrame(animate);
                } else {
                    carousel.style.scrollBehavior = 'smooth';
                }
            }
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Prevent text selection while dragging
        carousel.addEventListener('selectstart', (e) => {
            if (isDown) e.preventDefault();
        });
    }
});

// Logo click to scroll to top
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('main-logo');
    
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navContacts = document.querySelector('.nav-contacts');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navContacts.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Header background and hide on scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        
        // Show/hide scroll to top button
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn) {
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .tournament-card, .achievement-stat, .highlight');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for statistics
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(element) {
        const target = element.textContent;
        const isNumber = /^\d+/.test(target);
        
        if (isNumber) {
            const number = parseInt(target.replace(/\D/g, ''));
            const suffix = target.replace(/[\d,]/g, '');
            const duration = 2000;
            const step = number / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }, 16);
        }
    }

    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message (in real implementation, you would send data to server)
            showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : '#ff0088'};
            color: #000;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });

    // (3D slider functionality removed — tournaments now use a horizontal drag carousel)

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });

    // Typing effect for hero title - DISABLED FOR NEW OCTOPUS LAYOUT
    /*
    const heroTitleLines = document.querySelectorAll('.hero-title-line');
    
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect after page load
    setTimeout(() => {
        heroTitleLines.forEach((line, index) => {
            const originalText = line.textContent;
            setTimeout(() => {
                typeWriter(line, originalText, 50);
            }, index * 500);
        });
    }, 1000);

    // Add glitch effect to brand name
    const brandElement = document.querySelector('.hero-title-brand');
    if (brandElement) {
        setInterval(() => {
            brandElement.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #ff00ff,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00ffff
            `;
            
            setTimeout(() => {
                brandElement.style.textShadow = 'none';
            }, 100);
        }, 3000);
    }
    */

    // Add particle effect to hero section
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ffff;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.7;
            animation: float 6s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        hero.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }

    // Create particles periodically - DISABLED
    // setInterval(createParticle, 500);

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            90% {
                opacity: 0.7;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .notification {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .header.scrolled {
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
        }
        
        .nav-menu.active,
        .nav-contacts.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            flex-direction: column;
            padding: 20px;
            border-top: 1px solid rgba(0, 255, 255, 0.1);
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .animate-in {
            animation: slideInUp 0.8s ease forwards;
        }
        
        @media (max-width: 768px) {
            .nav-menu,
            .nav-contacts {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);
});

// Tournament card click functionality
document.addEventListener('DOMContentLoaded', function() {
    const tournamentCards = document.querySelectorAll('.tournament-card');
    
    tournamentCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // If a drag has occurred (dragDistance > threshold), do not open the modal.
            // This prevents accidental modal openings when the user is scrolling through the carousel.
            const threshold = 10;
            if (window.dragDistance && window.dragDistance > threshold) {
                return;
            }

            const tournamentTitle = card.querySelector('h3').textContent;
            const tournamentDescription = card.querySelector('p').textContent;
            // Show modal for tournament details
            showTournamentModal(tournamentTitle, tournamentDescription, index);
        });
    });
    
    
    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Custom cursor for tournaments section
document.addEventListener('DOMContentLoaded', function() {
    const tournamentsSection = document.querySelector('#tournaments');
    if (!tournamentsSection) return;

    // Create the custom cursor element
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);

    // Show the custom cursor when entering the tournaments section
    tournamentsSection.addEventListener('mouseenter', () => {
        customCursor.style.display = 'block';
    });

    // Hide the custom cursor when leaving the tournaments section
    tournamentsSection.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
        customCursor.classList.remove('grabbing');
    });

    // Move the custom cursor to follow the mouse
    tournamentsSection.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });

    // Change cursor appearance when dragging
    tournamentsSection.addEventListener('mousedown', () => {
        customCursor.classList.add('grabbing');
    });
    tournamentsSection.addEventListener('mouseup', () => {
        customCursor.classList.remove('grabbing');
    });
});

// Tournament Modal Function
// Legacy function retained for backward compatibility but not used.
function legacyShowTournamentModal(title, description, index) {
    // Create modal structure if it doesn't exist
    let modal = document.getElementById('tournament-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'tournament-modal';
        modal.className = 'tournament-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeTournamentModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeTournamentModal()">&times;</button>
                <div class="modal-header">
                    <div class="modal-image"><img src="" alt="Tournament image"></div>
                    <div class="modal-info">
                        <h2 class="modal-title"></h2>
                        <div class="modal-tags"></div>
                        <p class="modal-subtitle"></p>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="modal-description">
                        <h3>Описание</h3>
                        <p class="modal-description-text"></p>
                    </div>
                    <div class="modal-details" style="display:none;"></div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary">Зарегистрироваться</button>
                    <button class="modal-btn secondary" onclick="closeTournamentModal()">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Fetch the corresponding tournament card to extract extra data (image and tags)
    const cards = document.querySelectorAll('.tournament-card');
    const card = cards[index];
    let imgSrc = '';
    let imgAlt = '';
    let tagsHTML = '';
    if (card) {
        const imgEl = card.querySelector('.tournament-image img');
        const tagsEl = card.querySelector('.tournament-tags');
        if (imgEl) {
            imgSrc = imgEl.getAttribute('src');
            imgAlt = imgEl.getAttribute('alt');
        }
        if (tagsEl) {
            tagsHTML = tagsEl.innerHTML;
        }
    }

    // Update modal content
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-description-text').textContent = description;
    if (imgSrc) {
        const imgTag = modal.querySelector('.modal-image img');
        imgTag.src = imgSrc;
        imgTag.alt = imgAlt || title;
    }
    if (tagsHTML) {
        modal.querySelector('.modal-tags').innerHTML = tagsHTML;
    } else {
        modal.querySelector('.modal-tags').innerHTML = '';
    }
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Add animation class
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function legacyCloseTournamentModal() {
    const modal = document.getElementById('tournament-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Animated Background Functions
// Energy Waves Effect
function createEnergyWaves() {
    const wavesContainer = document.getElementById('energy-waves');
    if (!wavesContainer) return;

    // Create multiple wave sources
    const wavePoints = [
        { x: '20%', y: '30%' },
        { x: '80%', y: '70%' },
        { x: '50%', y: '20%' },
        { x: '30%', y: '80%' },
        { x: '70%', y: '40%' }
    ];

    wavePoints.forEach((point, index) => {
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'energy-wave';
            wave.style.left = point.x;
            wave.style.top = point.y;
            wave.style.animationDelay = (index * 0.8 + i * 1.3) + 's';
            
            wavesContainer.appendChild(wave);
        }
    });
}

// Pulsing Orbs Effect
function createPulsingOrbs() {
    const orbsContainer = document.getElementById('pulsing-orbs');
    if (!orbsContainer) return;

    const orbCount = 12;
    
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'pulsing-orb';
        
        // Random size
        const size = Math.random() * 100 + 50;
        orb.style.width = size + 'px';
        orb.style.height = size + 'px';
        
        // Random position
        orb.style.left = Math.random() * 90 + '%';
        orb.style.top = Math.random() * 90 + '%';
        
        // Random animation delay
        orb.style.animationDelay = Math.random() * 4 + 's';
        orb.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        orbsContainer.appendChild(orb);
    }
}

// Floating Particles Effect
function createFloatingParticles() {
    const particlesContainer = document.getElementById('floating-particles');
    if (!particlesContainer) return;

    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 8) + 's';
        
        // Random size variation
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize new animated background
function initAnimatedBackground() {
    createEnergyWaves();
    createPulsingOrbs();
    // createFloatingParticles(); // DISABLED - removed firefly effect
    
    // Periodically add new energy waves
    setInterval(() => {
        const wavesContainer = document.getElementById('energy-waves');
        if (wavesContainer && Math.random() < 0.3) {
            const wave = document.createElement('div');
            wave.className = 'energy-wave';
            wave.style.left = Math.random() * 100 + '%';
            wave.style.top = Math.random() * 100 + '%';
            wave.style.animationDelay = '0s';
            
            wavesContainer.appendChild(wave);
            
            // Remove wave after animation
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 4000);
        }
    }, 2000);
    
    // Periodically refresh particles - DISABLED
    /*
    setInterval(() => {
        const particlesContainer = document.getElementById('floating-particles');
        if (particlesContainer) {
            const particles = particlesContainer.querySelectorAll('.floating-particle');
            if (particles.length < 30 && Math.random() < 0.5) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '100%';
                particle.style.animationDelay = '0s';
                particle.style.animationDuration = (Math.random() * 4 + 8) + 's';
                
                const size = Math.random() * 3 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                particlesContainer.appendChild(particle);
            }
        }
    }, 3000);
    */
}

// Background initialization moved to main DOMContentLoaded handler

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.setAttribute('src', src);
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical images
    const criticalImages = [
        'assets/webp/69.webp', // Logo
        'assets/webp/telegram.webp',
        'assets/webp/youtube.webp', 
        'assets/webp/twitch.webp'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Optimize animations for better performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }

    // Initialize video windows
    initVideoWindows();
});

// Video Windows Management
function initVideoWindows() {
    const videos = document.querySelectorAll('.window-content');
    
    videos.forEach((video, index) => {
        if (video.tagName === 'VIDEO') {
            // Set up video properties
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.playsInline = true;
            
            // Try to play video
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log(`Video ${index + 1} started playing successfully`);
                }).catch(error => {
                    console.log(`Video ${index + 1} autoplay failed:`, error);
                    // If autoplay fails, try to play on user interaction
                    document.addEventListener('click', () => {
                        video.play().catch(e => console.log('Manual play failed:', e));
                    }, { once: true });
                });
            }
            
            // Handle video load errors
            video.addEventListener('error', (e) => {
                console.log(`Video ${index + 1} failed to load:`, e);
                // Show black background as fallback
                video.style.background = '#000';
            });
            
            // Handle successful load
            video.addEventListener('loadeddata', () => {
                console.log(`Video ${index + 1} loaded successfully`);
            });
        }
    });
}

// Scroll to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
});