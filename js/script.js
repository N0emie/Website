// Simple and Reliable Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    
    // Get loading screen elements
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress-fill');
    const progressText = document.querySelector('.loading-percentage');
    const body = document.body;
    
    if (!loadingScreen || !progressBar || !progressText) {
        console.error('❌ Loading screen elements not found!');
        body.classList.remove('loading');
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
        
        // Remove loading class from body
        body.classList.remove('loading');
        
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

// Tournament Carousel Drag-and-Drop Navigation with Momentum
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

            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;

            // Calculate velocity for momentum
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            const deltaX = e.pageX - lastX;

            if (deltaTime > 0) {
                velocity = deltaX / deltaTime;
            }

            lastX = e.pageX;
            lastTime = currentTime;

            // Track drag distance to prevent accidental clicks
            window.dragDistance = Math.abs(walk);

            // Add dragging class for visual feedback
            carousel.classList.add('dragging');
        });

        // Apply momentum scrolling
        function applyMomentum() {
            if (Math.abs(velocity) < 0.1) return;

            function animate() {
                carousel.scrollLeft -= velocity * 10;
                velocity *= 0.95; // Friction

                if (Math.abs(velocity) > 0.1) {
                    animationId = requestAnimationFrame(animate);
                } else {
                    carousel.style.scrollBehavior = 'smooth';
                }
            }

            animate();
        }

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
            window.dragDistance = Math.abs(walk);
        });

        carousel.addEventListener('touchend', () => {
            setTimeout(() => {
                window.dragDistance = 0;
            }, 100);
        });
    }
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

// Tournament card click functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Tournament click handler loading...');
    const tournamentCards = document.querySelectorAll('.tournament-card');
    console.log('🎯 Found tournament cards:', tournamentCards.length);

    tournamentCards.forEach((card, index) => {
        console.log('🎯 Adding click listener to card', index);
        card.addEventListener('click', function(e) {
            console.log('🎯 Card clicked!', index);
            
            // If a drag has occurred (dragDistance > threshold), do not open the modal.
            // This prevents accidental modal openings when the user is scrolling through the carousel.
            const threshold = 10;
            if (window.dragDistance && window.dragDistance > threshold) {
                console.log('🎯 Click ignored due to drag distance:', window.dragDistance);
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

// Tournament Modal Functions
function showTournamentModal(title, description, index) {
    console.log('🎯 showTournamentModal called with:', title, description, index);
    
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

function closeTournamentModal() {
    const modal = document.getElementById('tournament-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}