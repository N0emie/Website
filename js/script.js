// Simple and Reliable Loading Screen
console.log('🔧 Script.js loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting loading screen...');
    
    // Get loading screen elements
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress-fill');
    const progressText = document.querySelector('.loading-percentage');
    const loadingVideo = document.querySelector('.loading-logo video');
    const body = document.body;
    const html = document.documentElement;
    
    // Force video to play
    if (loadingVideo) {
        console.log('🎬 Attempting to play loading video...');
        loadingVideo.play().then(() => {
            console.log('✅ Loading video started successfully!');
        }).catch(error => {
            console.warn('⚠️ Video autoplay failed:', error);
            // Try to play on user interaction
            document.addEventListener('click', () => {
                loadingVideo.play().catch(e => console.warn('Video play failed:', e));
            }, { once: true });
        });
    }
    
    if (!loadingScreen || !progressBar || !progressText) {
        console.error('❌ Loading screen elements not found!');
        body.classList.remove('loading');
        html.classList.remove('loading');
        return;
    }
    
    // Simple progress animation - guaranteed to reach 100%
    function startProgressAnimation() {
        const totalDuration = 4000; // 4 seconds total
        const startTime = Date.now();
        let animationId;
        
        function updateProgress() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / totalDuration) * 100, 100);
            
            // Update UI
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
            
            console.log(`📊 Loading progress: ${Math.floor(progress)}%`);
            
            // Continue animation until 100%
            if (progress < 100) {
                animationId = requestAnimationFrame(updateProgress);
            } else {
                // Reached 100% - wait a moment then hide loading screen
                console.log('🎉 Loading complete at 100%!');
                setTimeout(hideLoadingScreen, 300);
            }
        }
        
        // Start the animation
        animationId = requestAnimationFrame(updateProgress);
        
        // Safety fallback - force completion after 5 seconds
        setTimeout(() => {
            if (body.classList.contains('loading')) {
                console.log('🚨 Safety fallback - forcing completion');
                cancelAnimationFrame(animationId);
                progressBar.style.width = '100%';
                progressText.textContent = '100%';
                setTimeout(hideLoadingScreen, 300);
            }
        }, 5000);
    }
    
    // Hide loading screen and show content
    function hideLoadingScreen() {
        console.log('✨ Hiding loading screen and showing content...');
        
        // Remove loading class from html and body
        body.classList.remove('loading');
        html.classList.remove('loading');
        
        // Add fade out animation to loading screen
        loadingScreen.classList.add('fade-out');
        
        // Force show all content immediately
        const contentElements = document.querySelectorAll('.social-icons-corner, .hero-logo-corner, .hero-lisa, .main-content, .examp-background, .examp-fog-left, .examp-fog-right, .examp-crystal, .examp-dota-logo, .examp-gif');
        contentElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.pointerEvents = 'auto';
        });
        
        // Remove loading screen from DOM after fade animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('🎯 Loading screen completely removed - site ready!');
            
            // Initialize lazy loading for videos
            setupLazyVideoLoading();
        }, 500);
    }
    
    // Setup lazy loading for videos
    function setupLazyVideoLoading() {
        const lazyVideos = document.querySelectorAll('video[preload="none"]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        video.preload = 'metadata';
                        video.load();
                        videoObserver.unobserve(video);
                        console.log('🎬 Lazy loading video:', video.querySelector('source')?.src || video.src);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            lazyVideos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    }
    
    // Start the loading animation
    startProgressAnimation();
});

// Tournament Carousel Drag-and-Drop Navigation
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('tournaments-carousel');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    window.dragDistance = 0;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        window.dragDistance = 0;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
        // Reset drag distance after a short delay
        setTimeout(() => {
            window.dragDistance = 0;
        }, 100);
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
        // Reset drag distance after a short delay
        setTimeout(() => {
            window.dragDistance = 0;
        }, 100);
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
        
        // Track drag distance
        window.dragDistance = Math.abs(x - startX);
    });

    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        window.dragDistance = 0;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
        
        // Track drag distance for touch
        window.dragDistance = Math.abs(x - startX);
    });

    carousel.addEventListener('touchend', () => {
        // Reset drag distance after a short delay
        setTimeout(() => {
            window.dragDistance = 0;
        }, 100);
    });
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        // Here you would typically send the data to your server
        // For now, we'll just show a success message
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        contactForm.reset();
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
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

// Tournament card click functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Setting up tournament card click handlers...');
    const tournamentCards = document.querySelectorAll('.tournament-card');
    console.log('🎯 Found tournament cards:', tournamentCards.length);

    tournamentCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            console.log('🎯 Tournament card clicked:', index);
            // If a drag has occurred (dragDistance > threshold), do not open the modal.
            // This prevents accidental modal openings when the user is scrolling through the carousel.
            const threshold = 10;
            if (window.dragDistance && window.dragDistance > threshold) {
                console.log('🎯 Drag detected, not opening modal. Distance:', window.dragDistance);
                return;
            }

            const tournamentTitle = card.querySelector('.tournament-title').textContent;
            const tournamentDescription = card.querySelector('.tournament-description').textContent;
            console.log('🎯 Opening modal for:', tournamentTitle);
            // Show modal for tournament details
            showTournamentModal(tournamentTitle, tournamentDescription, index);
        });
    });
});

// Tournament Modal Functions
function showTournamentModal(title, description, index) {
    console.log('🎯 showTournamentModal called with:', title, description, index);
    // Use existing modal from HTML
    const modal = document.getElementById('tournament-modal');
    if (!modal) {
        console.error('❌ Tournament modal not found in HTML');
        return;
    }
    console.log('✅ Modal found:', modal);

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

    // Tournament data based on index
    const tournamentData = [
        {
            prizePool: '5,000,000₽',
            format: 'Online',
            date: 'Декабрь 2025',
            teams: '16 команд'
        },
        {
            prizePool: '1,200,000₽',
            format: 'Offline',
            date: 'Январь 2026',
            teams: '8 команд'
        },
        {
            prizePool: '800,000₽',
            format: 'Offline',
            date: 'Февраль 2026',
            teams: '12 команд'
        },
        {
            prizePool: '300,000₽',
            format: 'Online',
            date: 'Март 2026',
            teams: '32 команды'
        }
    ];

    const data = tournamentData[index] || tournamentData[0];

    // Update modal content using existing HTML structure
    const modalTitle = document.getElementById('modal-tournament-title');
    const modalDescription = document.getElementById('modal-tournament-description');
    const modalImage = document.getElementById('modal-tournament-image');
    const modalTags = document.getElementById('modal-tournament-tags');
    const modalPrizePool = document.getElementById('modal-prize-pool');
    const modalFormat = document.getElementById('modal-format');
    const modalDate = document.getElementById('modal-date');
    const modalTeams = document.getElementById('modal-teams');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;
    
    if (modalImage && imgSrc) {
        modalImage.src = imgSrc;
        modalImage.alt = imgAlt || title;
    }
    
    if (modalTags) {
        modalTags.innerHTML = tagsHTML || '';
    }

    // Update tournament details
    if (modalPrizePool) modalPrizePool.textContent = data.prizePool;
    if (modalFormat) modalFormat.textContent = data.format;
    if (modalDate) modalDate.textContent = data.date;
    if (modalTeams) modalTeams.textContent = data.teams;

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeTournamentModal() {
    const modal = document.getElementById('tournament-modal');
    if (modal) {
        // Remove active class and hide
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Compact Menu Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('🎯 Compact menu navigation initialized');
    
    // Add smooth scrolling to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // If target doesn't exist, scroll to top for #home
                    if (targetId === 'home') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    console.log('✅ Navigation links configured');
    console.log('🎉 Compact menu functionality fully loaded!');
});