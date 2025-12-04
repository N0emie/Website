// Simple and Reliable Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting loading screen...');
    
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

// Tournament Carousel Drag-and-Drop Navigation
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('tournaments-carousel');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
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