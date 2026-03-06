// Simple and Reliable Loading Screen
console.log('🔧 Script.js loaded successfully!');
console.log('🎨 3D Tilt Effect script loaded!');

// Test alert to confirm script loading
setTimeout(() => {
    console.log('🚀 Testing 3D Tilt Effect initialization...');
}, 1000);

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

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.querySelector('.form-success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                website: formData.get('website'),
                message: formData.get('message')
            };
            
            console.log('📧 Form submitted:', data);
            
            // Show success message
            if (successMessage) {
                successMessage.classList.add('show');
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }
            
            // Reset form
            contactForm.reset();
            
            // Here you would typically send the data to your server
            // For now, we'll just log it
            console.log('✅ Contact form processed successfully');
        });
    }
});

// ===== 3D SERVICES CARDS FUNCTIONALITY =====

// Scroll Reveal Animation
function initScrollReveal() {
    const cards = document.querySelectorAll('.service-3d-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on card index for staggered animation
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index * 150);
                
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// 3D Tilt Effect
function init3DTilt() {
    const cards = document.querySelectorAll('.service-3d-card[data-tilt]');
    
    cards.forEach(card => {
        const cardContent = card.querySelector('.card-content');
        
        let isHovering = false;
        let mouseX = 0;
        let mouseY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        
        // Mouse enter
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            cardContent.style.transition = 'transform 0.1s ease-out';
        });
        
        // Mouse leave
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            cardContent.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            cardContent.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
        
        // Mouse move
        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate mouse position relative to card center
            mouseX = e.clientX - centerX;
            mouseY = e.clientY - centerY;
            
            // Calculate rotation angles (max 15 degrees)
            const maxRotation = 15;
            const rotateY = (mouseX / (rect.width / 2)) * maxRotation;
            const rotateX = -(mouseY / (rect.height / 2)) * maxRotation;
            
            // Smooth interpolation for smoother movement
            currentRotateX += (rotateX - currentRotateX) * 0.1;
            currentRotateY += (rotateY - currentRotateY) * 0.1;
            
            // Apply 3D transform
            cardContent.style.transform = `
                rotateX(${currentRotateX}deg) 
                rotateY(${currentRotateY}deg) 
                translateZ(20px)
            `;
        });
        
        // Smooth animation loop for better performance
        function animateCard() {
            if (isHovering) {
                cardContent.style.transform = `
                    rotateX(${currentRotateX}deg) 
                    rotateY(${currentRotateY}deg) 
                    translateZ(20px)
                `;
            }
            requestAnimationFrame(animateCard);
        }
        
        animateCard();
    });
}

// Enhanced Glare Effect - DISABLED
function initGlareEffect() {
    // Glare effects disabled
    console.log('🚫 Glare effects disabled');
}

// Performance optimization: Use RAF for smooth animations
function optimizeAnimations() {
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable complex animations for accessibility
        const style = document.createElement('style');
        style.textContent = `
            .service-3d-card {
                transition: opacity 0.3s ease !important;
            }
            .service-3d-card .card-content {
                transition: transform 0.3s ease !important;
            }
            .card-glare {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all 3D effects
function init3DServices() {
    console.log('🎮 Initializing 3D Services...');
    
    // Check if services section exists
    const servicesSection = document.querySelector('.services-3d');
    if (!servicesSection) {
        console.log('⚠️ 3D Services section not found');
        return;
    }
    
    try {
        initScrollReveal();
        init3DTilt();
        initGlareEffect();
        optimizeAnimations();
        
        console.log('✅ 3D Services initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing 3D Services:', error);
    }
}

// Initialize 3D services when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DServices);
} else {
    init3DServices();
}

// ===== SERVICE MODAL FUNCTIONALITY =====

// Service data for modal content
const serviceData = {
    planning: {
        title: 'ПЛАНИРОВАНИЕ И КОНЦЕПЦИЯ',
        description: 'Полный цикл разработки концепции турнира от идеи до детального плана реализации. Мы создаем уникальные форматы соревнований, которые запоминаются участникам и зрителям.',
        features: [
            'Разработка уникальной концепции турнира',
            'Создание детального регламента соревнований',
            'Планирование формата и структуры турнира',
            'Определение призового фонда и наград',
            'Составление календаря мероприятий',
            'Анализ целевой аудитории и конкурентов'
        ],
        process: [
            {
                title: 'Анализ требований',
                description: 'Изучаем ваши цели, бюджет и ожидания от турнира'
            },
            {
                title: 'Разработка концепции',
                description: 'Создаем уникальную идею и формат соревнований'
            },
            {
                title: 'Детальное планирование',
                description: 'Прорабатываем все аспекты проведения турнира'
            },
            {
                title: 'Согласование',
                description: 'Представляем финальный план и вносим корректировки'
            }
        ]
    },
    technical: {
        title: 'ТЕХНИЧЕСКОЕ ОБЕСПЕЧЕНИЕ',
        description: 'Профессиональная настройка всей технической инфраструктуры для проведения киберспортивных турниров. Гарантируем стабильную работу серверов и защиту от читеров.',
        features: [
            'Настройка и администрирование игровых серверов',
            'Установка и настройка античит систем',
            'Техническая поддержка участников 24/7',
            'Мониторинг производительности серверов',
            'Резервное копирование и восстановление данных',
            'Настройка сетевой инфраструктуры'
        ],
        process: [
            {
                title: 'Анализ требований',
                description: 'Определяем технические требования для вашего турнира'
            },
            {
                title: 'Подготовка серверов',
                description: 'Настраиваем и тестируем игровые серверы'
            },
            {
                title: 'Установка защиты',
                description: 'Внедряем античит системы и настраиваем безопасность'
            },
            {
                title: 'Поддержка',
                description: 'Обеспечиваем техническую поддержку во время турнира'
            }
        ]
    },
    streaming: {
        title: 'ТРАНСЛЯЦИЯ И СТРИМ',
        description: 'Профессиональная трансляция турниров с качественным видео, экспертными комментариями и красивым графическим оформлением для максимального вовлечения зрителей.',
        features: [
            'Многокамерная трансляция в высоком качестве',
            'Профессиональные комментаторы и аналитики',
            'Уникальное графическое оформление',
            'Интерактивные элементы для зрителей',
            'Трансляция на множество платформ',
            'Запись и монтаж highlights'
        ],
        process: [
            {
                title: 'Планирование трансляции',
                description: 'Разрабатываем концепцию и сценарий трансляции'
            },
            {
                title: 'Подготовка оборудования',
                description: 'Настраиваем камеры, микрофоны и стриминговое ПО'
            },
            {
                title: 'Создание графики',
                description: 'Разрабатываем уникальные графические элементы'
            },
            {
                title: 'Проведение трансляции',
                description: 'Обеспечиваем качественную трансляцию турнира'
            }
        ]
    },
    prize: {
        title: 'ПРИЗОВОЙ ФОНД',
        description: 'Организация призового фонда турнира, поиск спонсоров и партнеров, справедливое распределение наград между победителями и участниками соревнований.',
        features: [
            'Формирование призового фонда турнира',
            'Поиск и привлечение спонсоров',
            'Организация партнерских программ',
            'Справедливое распределение призов',
            'Оформление наградной атрибутики',
            'Церемония награждения победителей'
        ],
        process: [
            {
                title: 'Планирование бюджета',
                description: 'Определяем размер призового фонда и источники финансирования'
            },
            {
                title: 'Поиск спонсоров',
                description: 'Привлекаем партнеров и спонсоров для увеличения фонда'
            },
            {
                title: 'Подготовка призов',
                description: 'Организуем призы, кубки и наградную атрибутику'
            },
            {
                title: 'Награждение',
                description: 'Проводим торжественную церемонию награждения'
            }
        ]
    },
    marketing: {
        title: 'МАРКЕТИНГ И ПРОДВИЖЕНИЕ',
        description: 'Комплексное продвижение турнира в социальных сетях, работа с медиа и блогерами, привлечение максимального количества участников и зрителей.',
        features: [
            'Стратегия продвижения в социальных сетях',
            'Работа с игровыми медиа и блогерами',
            'Создание рекламных материалов',
            'PR-кампании и пресс-релизы',
            'Привлечение участников и зрителей',
            'Аналитика и отчетность по результатам'
        ],
        process: [
            {
                title: 'Разработка стратегии',
                description: 'Создаем план продвижения и определяем каналы'
            },
            {
                title: 'Создание контента',
                description: 'Разрабатываем рекламные материалы и контент'
            },
            {
                title: 'Запуск кампании',
                description: 'Запускаем рекламные кампании в различных каналах'
            },
            {
                title: 'Анализ результатов',
                description: 'Отслеживаем эффективность и корректируем стратегию'
            }
        ]
    },
    judging: {
        title: 'СУДЕЙСТВО',
        description: 'Профессиональные судьи с опытом проведения киберспортивных турниров, контроль честности игры и оперативное разрешение любых спорных ситуаций.',
        features: [
            'Команда опытных киберспортивных судей',
            'Контроль честности и правил игры',
            'Разрешение спорных ситуаций',
            'Мониторинг соблюдения регламента',
            'Взаимодействие с участниками',
            'Документирование нарушений'
        ],
        process: [
            {
                title: 'Подбор судей',
                description: 'Формируем команду квалифицированных судей'
            },
            {
                title: 'Изучение регламента',
                description: 'Судьи изучают правила и особенности турнира'
            },
            {
                title: 'Контроль игры',
                description: 'Наблюдаем за ходом матчей и соблюдением правил'
            },
            {
                title: 'Разрешение споров',
                description: 'Оперативно решаем любые спорные ситуации'
            }
        ]
    }
};

// Modal functionality
let currentModal = null;
let originalCardRect = null;

function openServiceModal(serviceType, cardElement) {
    console.log('🎮 Opening service modal:', serviceType);
    
    const modal = document.getElementById('service-modal');
    const modalContainer = modal.querySelector('.modal-container');
    const modalIcon = modal.querySelector('.modal-icon');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalFeaturesList = modal.querySelector('.modal-features-list');
    const modalProcessSteps = modal.querySelector('.modal-process-steps');
    
    if (!modal || !serviceData[serviceType]) {
        console.error('❌ Modal or service data not found');
        return;
    }
    
    const service = serviceData[serviceType];
    currentModal = modal;
    
    // Get card position for morphing animation
    originalCardRect = cardElement.getBoundingClientRect();
    
    // Set initial modal position to match card
    modalContainer.style.width = originalCardRect.width + 'px';
    modalContainer.style.height = originalCardRect.height + 'px';
    modalContainer.style.top = originalCardRect.top + 'px';
    modalContainer.style.left = originalCardRect.left + 'px';
    modalContainer.style.transform = 'none';
    
    // Copy card icon to modal
    const cardIcon = cardElement.querySelector('.card-icon');
    if (cardIcon) {
        modalIcon.innerHTML = cardIcon.innerHTML;
    }
    
    // Fill modal content
    modalTitle.textContent = service.title;
    modalDescription.textContent = service.description;
    
    // Fill features list
    modalFeaturesList.innerHTML = '';
    service.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalFeaturesList.appendChild(li);
    });
    
    // Fill process steps
    modalProcessSteps.innerHTML = '';
    service.process.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'process-step';
        stepDiv.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            </div>
        `;
        modalProcessSteps.appendChild(stepDiv);
    });
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Trigger morphing animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
        
        // Reset modal container to use CSS transitions
        modalContainer.style.width = '';
        modalContainer.style.height = '';
        modalContainer.style.top = '';
        modalContainer.style.left = '';
        modalContainer.style.transform = '';
    });
}

function closeServiceModal() {
    if (!currentModal) return;
    
    console.log('🎮 Closing service modal');
    
    const modalContainer = currentModal.querySelector('.modal-container');
    
    // Reverse morphing animation
    if (originalCardRect) {
        modalContainer.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        modalContainer.style.width = originalCardRect.width + 'px';
        modalContainer.style.height = originalCardRect.height + 'px';
        modalContainer.style.top = originalCardRect.top + 'px';
        modalContainer.style.left = originalCardRect.left + 'px';
        modalContainer.style.transform = 'scale(0.8)';
    }
    
    // Remove active class
    currentModal.classList.remove('active');
    
    // Hide modal after animation
    setTimeout(() => {
        if (currentModal) {
            currentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset styles
            modalContainer.style.width = '';
            modalContainer.style.height = '';
            modalContainer.style.top = '';
            modalContainer.style.left = '';
            modalContainer.style.transform = '';
            modalContainer.style.transition = '';
        }
        currentModal = null;
        originalCardRect = null;
    }, 600);
}

// Initialize service modal functionality
function initServiceModals() {
    console.log('🎮 Initializing service modals...');
    
    // Add click listeners to service cards
    const serviceCards = document.querySelectorAll('.service-3d-card[data-service]');
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceType = card.getAttribute('data-service');
            openServiceModal(serviceType, card);
        });
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
    
    // Add close button listener
    const closeButton = document.querySelector('#service-modal .modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeServiceModal);
    }
    
    // Add backdrop click listener
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                closeServiceModal();
            }
        });
    }
    
    // Add escape key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentModal) {
            closeServiceModal();
        }
    });
    
    // Add CTA button listener
    const ctaButton = document.querySelector('#service-modal .modal-cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to contact form
            closeServiceModal();
            setTimeout(() => {
                const contactForm = document.querySelector('footer');
                if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                }
            }, 700);
        });
    }
    
    console.log('✅ Service modals initialized successfully!');
}

// Initialize service modals when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceModals);
} else {
    initServiceModals();
}

// 3D Tilt Effect for About Images
function initTiltEffect() {
    console.log('🎨 Initializing 3D Tilt Effect...');
    
    const elements = document.querySelectorAll('[data-tilt]');
    console.log('Found', elements.length, 'elements with data-tilt attribute');
    
    if (elements.length === 0) {
        console.warn('No elements with data-tilt found!');
        return;
    }
    
    elements.forEach((element, index) => {
        console.log(`Setting up tilt for element ${index + 1}:`, element);
        
        const inner = element.querySelector('.about-image-inner');
        if (!inner) {
            console.warn(`No .about-image-inner found in element ${index + 1}`);
            return;
        }
        
        console.log(`Found inner element for ${index + 1}:`, inner);
        
        // Mouse enter
        element.addEventListener('mouseenter', function(e) {
            console.log('Mouse entered element', index + 1);
            // Оставляем плавный переход для красивой анимации
        });
        
        // Mouse move
        element.addEventListener('mousemove', function(e) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const maxTilt = 4;
            const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
            const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
            
            // Apply 3D transform
            const transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(0.95, 0.95, 0.95)`;
            inner.style.transform = transform;
            
            // Update glare effect
            const glareX = 50 + (mouseX / rect.width) * 50;
            const glareY = 50 + (mouseY / rect.height) * 50;
            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
            const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
            const intensity = Math.max(0, 1 - (distance / maxDistance)) * 0.15;
            
            inner.style.setProperty('--glare-x', `${glareX}%`);
            inner.style.setProperty('--glare-y', `${glareY}%`);
            inner.style.setProperty('--glare-opacity', intensity);
        });
        
        // Mouse leave
        element.addEventListener('mouseleave', function(e) {
            console.log('Mouse left element', index + 1);
            inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            inner.style.setProperty('--glare-opacity', '0');
        });
    });
    
    console.log('✅ 3D Tilt Effect initialized successfully!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - initializing tilt effect');
    initTiltEffect();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('📄 Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('📄 Document already loaded, initializing tilt effect immediately');
    initTiltEffect();
}

// ===== 3D TILT EFFECT FOR SERVICE CARDS =====
function initServiceCardsTilt() {
    console.log('🎨 Initializing 3D Tilt Effect for Service Cards...');

    const serviceCards = document.querySelectorAll('.service-organic-card[data-tilt]');
    console.log('Found', serviceCards.length, 'service cards with data-tilt attribute');

    if (serviceCards.length === 0) {
        console.warn('No service cards with data-tilt found!');
        return;
    }

    serviceCards.forEach((card, index) => {
        console.log(`Setting up tilt for service card ${index + 1}:`, card);

        // Caption under the card (title + short subtitle)
        const title = card.dataset.title || '';
        const subtitle = card.dataset.subtitle || '';
        const subtitleShort = subtitle.split(' ').slice(0, 4).join(' ');
        card.dataset.caption = subtitleShort ? `${title}\n${subtitleShort}` : title;

        let isHovering = false;
        let mouseX = 0;
        let mouseY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;

        // Mouse enter
        card.addEventListener('mouseenter', () => {
            console.log('Mouse entered service card', index + 1);
            isHovering = true;
            card.style.transition = 'transform 0.1s ease-out';
        });

        // Mouse move
        card.addEventListener('mousemove', function(e) {
            if (!isHovering) return;

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            mouseX = e.clientX - centerX;
            mouseY = e.clientY - centerY;

            const maxTilt = 8; // Более выраженный эффект для карточек услуг
            const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
            const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

            // Smooth interpolation for smoother movement
            currentRotateX += (rotateX - currentRotateX) * 0.1;
            currentRotateY += (rotateY - currentRotateY) * 0.1;

            // Apply 3D transform to the entire card
            const transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(10px)`;
            card.style.transform = transform;
        });

        // Mouse leave
        card.addEventListener('mouseleave', function(e) {
            console.log('Mouse left service card', index + 1);
            isHovering = false;
            card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });

        // Smooth animation loop for better performance
        function animateServiceCard() {
            if (isHovering) {
                const transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(10px)`;
                card.style.transform = transform;
            }
            requestAnimationFrame(animateServiceCard);
        }

        animateServiceCard();
    });

    console.log('✅ 3D Tilt Effect for Service Cards initialized successfully!');
}

// Initialize service cards tilt effect when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - initializing service cards tilt effect');
    initServiceCardsTilt();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('📄 Document still loading, waiting for DOMContentLoaded for service cards');
} else {
    console.log('📄 Document already loaded, initializing service cards tilt effect immediately');
    initServiceCardsTilt();
}
