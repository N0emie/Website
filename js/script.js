// Premium preloader lifecycle
(function () {
    const MIN_VISIBLE_MS = 3500;
    const FADE_DURATION_MS = 320;
    const CMS_WAIT_MAX_MS = 1400;

    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    const html = document.documentElement;
    let minTimeElapsed = false;
    let pageLoaded = document.readyState === 'complete';
    let cmsReady = !window.__cmsContentReadyPromise;
    let hidden = false;

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

    function hideLoader() {
        if (hidden) return;
        hidden = true;

        body.classList.remove('loading');
        html.classList.remove('loading');

        if (!loadingScreen) {
            setupLazyVideoLoading();
            return;
        }

        loadingScreen.classList.add('is-hidden');
        loadingScreen.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            setupLazyVideoLoading();
        }, FADE_DURATION_MS);
    }

    function scheduleHide() {
        if (!minTimeElapsed || !pageLoaded || !cmsReady) return;
        hideLoader();
    }

    window.setTimeout(() => {
        minTimeElapsed = true;
        scheduleHide();
    }, MIN_VISIBLE_MS);

    if (!pageLoaded) {
        window.addEventListener('load', () => {
            pageLoaded = true;
            scheduleHide();
        }, { once: true });
    }

    if (window.__cmsContentReadyPromise && typeof window.__cmsContentReadyPromise.then === 'function') {
        Promise.race([
            window.__cmsContentReadyPromise,
            new Promise((resolve) => setTimeout(resolve, CMS_WAIT_MAX_MS))
        ]).finally(() => {
            cmsReady = true;
            scheduleHide();
        });
    }
})();
// Tournament Carousel Drag-and-Drop Navigation
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('tournaments-carousel');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;
    window.dragDistance = 0;
    window.suppressTournamentClickUntil = 0;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        hasDragged = false;
        window.dragDistance = 0;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
        if (hasDragged || window.dragDistance > 8) {
            window.suppressTournamentClickUntil = Date.now() + 350;
        }
        // Reset drag distance after a short delay
        setTimeout(() => {
            window.dragDistance = 0;
            hasDragged = false;
        }, 100);
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
        if (hasDragged || window.dragDistance > 8) {
            window.suppressTournamentClickUntil = Date.now() + 350;
        }
        // Reset drag distance after a short delay
        setTimeout(() => {
            window.dragDistance = 0;
            hasDragged = false;
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
        if (window.dragDistance > 8) {
            hasDragged = true;
        }
    });

    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        hasDragged = false;
        window.dragDistance = 0;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
        
        // Track drag distance for touch
        window.dragDistance = Math.abs(x - startX);
        if (window.dragDistance > 8) {
            hasDragged = true;
        }
    });

    carousel.addEventListener('touchend', () => {
        if (hasDragged || window.dragDistance > 8) {
            window.suppressTournamentClickUntil = Date.now() + 400;
        }
        // Reset drag distance after a short delay
        setTimeout(() => {
            window.dragDistance = 0;
            hasDragged = false;
        }, 100);
    });

    carousel.addEventListener('click', (e) => {
        if (Date.now() < (window.suppressTournamentClickUntil || 0)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        
        // Here you would typically send the data to your server
        // For now, we'll just show a success message
        alert('РЎРїР°СЃРёР±Рѕ Р·Р° Р·Р°СЏРІРєСѓ! РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ Р±Р»РёР¶Р°Р№С€РµРµ РІСЂРµРјСЏ.');
        
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
    const tournamentCards = document.querySelectorAll('.tournament-card');

    tournamentCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // If a drag has occurred (dragDistance > threshold), do not open the modal.
            // This prevents accidental modal openings when the user is scrolling through the carousel.
            const threshold = 10;
            if (window.dragDistance && window.dragDistance > threshold) {
                return;
            }

            const tournamentTitle = card.querySelector('.tournament-title').textContent;
            const tournamentDescription = card.querySelector('.tournament-description').textContent;
            // Show modal for tournament details
            showTournamentModal(tournamentTitle, tournamentDescription, index);
        });
    });
});

// Tournament Modal Functions
function showTournamentModal(title, description, index) {
    // Use existing modal from HTML
    const modal = document.getElementById('tournament-modal');
    if (!modal) {
        console.error('вќЊ Tournament modal not found in HTML');
        return;
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

    // Tournament data based on index
    const tournamentData = [
        {
            prizePool: '5,000,000в‚Ѕ',
            format: 'Online',
            date: 'Р”РµРєР°Р±СЂСЊ 2025',
            teams: '16 РєРѕРјР°РЅРґ'
        },
        {
            prizePool: '1,200,000в‚Ѕ',
            format: 'Offline',
            date: 'РЇРЅРІР°СЂСЊ 2026',
            teams: '8 РєРѕРјР°РЅРґ'
        },
        {
            prizePool: '800,000в‚Ѕ',
            format: 'Offline',
            date: 'Р¤РµРІСЂР°Р»СЊ 2026',
            teams: '12 РєРѕРјР°РЅРґ'
        },
        {
            prizePool: '300,000в‚Ѕ',
            format: 'Online',
            date: 'РњР°СЂС‚ 2026',
            teams: '32 РєРѕРјР°РЅРґС‹'
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
    const menuCapsule = document.getElementById('menuCapsule');
    const menuToggle = document.getElementById('menuToggle');
    const edgeMenuTab = document.getElementById('edgeMenuTab');
    const capsuleLinksContainer = document.getElementById('menuNavPanel');
    const capsuleLinks = document.querySelectorAll('.capsule__links .nav-link');
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const bumpNav = document.getElementById('bumpNav');
    const bumpToggle = document.getElementById('bumpNavToggle');
    const bumpItems = bumpNav ? Array.from(bumpNav.querySelectorAll('.bump-nav__item')) : [];
    const heroOrderButton = document.querySelector('.hero-button[data-target]');

    function scrollToTarget(targetSelector) {
        if (!targetSelector || !targetSelector.startsWith('#')) return;
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function closeCapsuleMenu() {
        if (document.body.classList.contains('menu-fixed-open')) return;
        if (!menuCapsule) return;
        menuCapsule.classList.remove('is-open');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        if (edgeMenuTab) {
            edgeMenuTab.classList.remove('is-open');
            edgeMenuTab.setAttribute('aria-expanded', 'false');
        }
    }

    function setCapsuleMenuOpen(open) {
        if (!menuCapsule) return;
        if (document.body.classList.contains('menu-fixed-open')) {
            menuCapsule.classList.add('is-open');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
            return;
        }
        menuCapsule.classList.toggle('is-open', open);
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        if (edgeMenuTab) {
            edgeMenuTab.classList.toggle('is-open', open);
            edgeMenuTab.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function syncCollapsed() {
        if (!menuCapsule) return;
        const toggleWidth = menuToggle ? Math.ceil(menuToggle.getBoundingClientRect().width) : 120;
        const collapsed = clamp(toggleWidth + 14, 92, 220);
        menuCapsule.style.setProperty('--collapsed', `${collapsed}px`);
    }

    function syncExpanded() {
        if (!menuCapsule || !capsuleLinksContainer) return;

        const wasOpen = menuCapsule.classList.contains('is-open');
        menuCapsule.classList.add('is-open');

        const linksWidth = Math.ceil(capsuleLinksContainer.scrollWidth);
        const edgeWidth = edgeMenuTab ? Math.ceil(edgeMenuTab.getBoundingClientRect().width) : 70;
        const horizontalPads = 48;
        const rawExpanded = linksWidth + edgeWidth + horizontalPads;
        const maxExpanded = Math.max(260, window.innerWidth - 40);
        const expanded = clamp(rawExpanded, 220, maxExpanded);
        menuCapsule.style.setProperty('--expanded', `${expanded}px`);

        if (!wasOpen) {
            menuCapsule.classList.remove('is-open');
        }
    }

    function syncCapsuleMeasurements() {
        syncCollapsed();
        syncExpanded();
    }

    if (menuCapsule) {
        if (window.innerWidth >= 1100) {
            document.body.classList.add('menu-fixed-open');
            menuCapsule.classList.add('is-open');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
        }
        syncCapsuleMeasurements();

        window.addEventListener('resize', function() {
            syncCapsuleMeasurements();
        });

        if (document.fonts && typeof document.fonts.ready?.then === 'function') {
            document.fonts.ready.then(() => {
                syncCapsuleMeasurements();
            }).catch(() => {});
        }

        if (supportsHover && edgeMenuTab) {
            edgeMenuTab.addEventListener('mouseenter', function() {
                setCapsuleMenuOpen(true);
            });

            edgeMenuTab.addEventListener('mouseleave', function() {
                requestAnimationFrame(() => {
                    const overTab = edgeMenuTab.matches(':hover');
                    const overCapsule = menuCapsule.matches(':hover');
                    if (!overTab && !overCapsule) {
                        closeCapsuleMenu();
                    }
                });
            });

            menuCapsule.addEventListener('mouseleave', function() {
                requestAnimationFrame(() => {
                    const overTab = edgeMenuTab.matches(':hover');
                    const overCapsule = menuCapsule.matches(':hover');
                    if (!overTab && !overCapsule) {
                        closeCapsuleMenu();
                    }
                });
            });
        } else if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const willOpen = !menuCapsule.classList.contains('is-open');
                setCapsuleMenuOpen(willOpen);
            });
        }

        if (edgeMenuTab) {
            edgeMenuTab.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const willOpen = !menuCapsule.classList.contains('is-open');
                setCapsuleMenuOpen(willOpen);
            });
        }

        document.addEventListener('click', function(e) {
            const clickInsideCapsule = menuCapsule.contains(e.target);
            const clickInsideEdge = edgeMenuTab ? edgeMenuTab.contains(e.target) : false;
            if (!clickInsideCapsule && !clickInsideEdge) {
                closeCapsuleMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCapsuleMenu();
            }
        });
    } else if (menuToggle && capsuleLinksContainer) {
        // Legacy menu markup fallback: button in top-right + dropdown panel.
        const legacyContainer = menuToggle.closest('.menu-toggle-container');
        if (legacyContainer) {
            legacyContainer.classList.add('legacy-menu-mode');
        }

        const openLegacyMenu = () => {
            menuToggle.classList.add('is-open');
            capsuleLinksContainer.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
        };

        const closeLegacyMenu = () => {
            menuToggle.classList.remove('is-open');
            capsuleLinksContainer.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !capsuleLinksContainer.classList.contains('is-open');
            if (willOpen) openLegacyMenu();
            else closeLegacyMenu();
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !capsuleLinksContainer.contains(e.target)) {
                closeLegacyMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLegacyMenu();
            }
        });
    }

    function parseColor(color) {
        if (!color || color === 'transparent') return null;
        const rgba = color.match(/rgba?\(([^)]+)\)/i);
        if (!rgba) return null;
        const values = rgba[1].split(',').map((v) => Number.parseFloat(v.trim()));
        if (values.length < 3) return null;
        const alpha = values.length === 4 ? values[3] : 1;
        if (alpha <= 0) return null;
        return { r: values[0], g: values[1], b: values[2], a: alpha };
    }

    function getBackgroundUnderNav() {
        if (!bumpNav) return { r: 9, g: 13, b: 27 };
        const rect = bumpNav.getBoundingClientRect();
        const sampleX = Math.max(1, Math.round(rect.left + rect.width / 2));
        const sampleY = Math.max(1, Math.round(rect.top + rect.height / 2));
        const stack = document.elementsFromPoint(sampleX, sampleY);
        for (const el of stack) {
            if (!el || el === bumpNav || el.closest('#bumpNav')) continue;
            const parsed = parseColor(getComputedStyle(el).backgroundColor);
            if (parsed) {
                return parsed;
            }
        }
        return { r: 9, g: 13, b: 27 };
    }

    function syncBumpTheme() {
        if (!bumpNav) return;
        const bg = getBackgroundUnderNav();
        const luminance = (0.2126 * bg.r + 0.7152 * bg.g + 0.0722 * bg.b) / 255;
        const darkBg = luminance < 0.5;
        if (darkBg) {
            bumpNav.style.setProperty('--bump-bg', 'rgba(205, 221, 255, 0.16)');
            bumpNav.style.setProperty('--bump-border', 'rgba(196, 216, 255, 0.5)');
            bumpNav.style.setProperty('--bump-icon', '#f2f7ff');
            bumpNav.style.setProperty('--bump-active', '#ffffff');
        } else {
            bumpNav.style.setProperty('--bump-bg', 'rgba(8, 12, 22, 0.86)');
            bumpNav.style.setProperty('--bump-border', 'rgba(108, 142, 232, 0.52)');
            bumpNav.style.setProperty('--bump-icon', '#dbe7ff');
            bumpNav.style.setProperty('--bump-active', '#ffffff');
        }
    }

    function setBumpOpen(open) {
        if (!bumpNav) return;
        bumpNav.classList.toggle('is-open', open);
        bumpNav.classList.toggle('is-collapsed', !open);
        if (bumpToggle) {
            bumpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
    }

    if (bumpNav && bumpItems.length > 0) {
        if (bumpToggle) {
            bumpToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setBumpOpen(!bumpNav.classList.contains('is-open'));
            });
        }

        bumpItems.forEach((item) => {
            item.addEventListener('click', () => {
                bumpItems.forEach((btn) => btn.classList.remove('is-active'));
                item.classList.add('is-active');
                setBumpOpen(false);

                const href = item.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                    return;
                }

                const target = item.getAttribute('data-target');
                if (target && target.startsWith('#')) {
                    scrollToTarget(target);
                }
            });
        });

        setBumpOpen(false);
        syncBumpTheme();
        window.addEventListener('resize', syncBumpTheme);
        window.addEventListener('scroll', syncBumpTheme, { passive: true });

        if (document.fonts && typeof document.fonts.ready?.then === 'function') {
            document.fonts.ready.then(() => syncBumpTheme()).catch(() => {});
        }

        document.addEventListener('click', (e) => {
            if (!bumpNav.contains(e.target)) {
                setBumpOpen(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setBumpOpen(false);
            }
        });
    }

    if (heroOrderButton) {
        heroOrderButton.addEventListener('click', () => {
            scrollToTarget(heroOrderButton.getAttribute('data-target'));
        });
    }
    
    
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

                if (this.closest('.capsule__links')) {
                    closeCapsuleMenu();
                }
            }
        });
    });
    

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
    
    // Check if services section exists
    const servicesSection = document.querySelector('.services-3d');
    if (!servicesSection) {
        return;
    }
    
    try {
        initScrollReveal();
        init3DTilt();
        initGlareEffect();
        optimizeAnimations();
        
    } catch (error) {
        console.error('вќЊ Error initializing 3D Services:', error);
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
        title: 'РџР›РђРќРР РћР’РђРќРР• Р РљРћРќР¦Р•РџР¦РРЇ',
        description: 'РџРѕР»РЅС‹Р№ С†РёРєР» СЂР°Р·СЂР°Р±РѕС‚РєРё РєРѕРЅС†РµРїС†РёРё С‚СѓСЂРЅРёСЂР° РѕС‚ РёРґРµРё РґРѕ РґРµС‚Р°Р»СЊРЅРѕРіРѕ РїР»Р°РЅР° СЂРµР°Р»РёР·Р°С†РёРё. РњС‹ СЃРѕР·РґР°РµРј СѓРЅРёРєР°Р»СЊРЅС‹Рµ С„РѕСЂРјР°С‚С‹ СЃРѕСЂРµРІРЅРѕРІР°РЅРёР№, РєРѕС‚РѕСЂС‹Рµ Р·Р°РїРѕРјРёРЅР°СЋС‚СЃСЏ СѓС‡Р°СЃС‚РЅРёРєР°Рј Рё Р·СЂРёС‚РµР»СЏРј.',
        features: [
            'Р Р°Р·СЂР°Р±РѕС‚РєР° СѓРЅРёРєР°Р»СЊРЅРѕР№ РєРѕРЅС†РµРїС†РёРё С‚СѓСЂРЅРёСЂР°',
            'РЎРѕР·РґР°РЅРёРµ РґРµС‚Р°Р»СЊРЅРѕРіРѕ СЂРµРіР»Р°РјРµРЅС‚Р° СЃРѕСЂРµРІРЅРѕРІР°РЅРёР№',
            'РџР»Р°РЅРёСЂРѕРІР°РЅРёРµ С„РѕСЂРјР°С‚Р° Рё СЃС‚СЂСѓРєС‚СѓСЂС‹ С‚СѓСЂРЅРёСЂР°',
            'РћРїСЂРµРґРµР»РµРЅРёРµ РїСЂРёР·РѕРІРѕРіРѕ С„РѕРЅРґР° Рё РЅР°РіСЂР°Рґ',
            'РЎРѕСЃС‚Р°РІР»РµРЅРёРµ РєР°Р»РµРЅРґР°СЂСЏ РјРµСЂРѕРїСЂРёСЏС‚РёР№',
            'РђРЅР°Р»РёР· С†РµР»РµРІРѕР№ Р°СѓРґРёС‚РѕСЂРёРё Рё РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ'
        ],
        process: [
            {
                title: 'РђРЅР°Р»РёР· С‚СЂРµР±РѕРІР°РЅРёР№',
                description: 'РР·СѓС‡Р°РµРј РІР°С€Рё С†РµР»Рё, Р±СЋРґР¶РµС‚ Рё РѕР¶РёРґР°РЅРёСЏ РѕС‚ С‚СѓСЂРЅРёСЂР°'
            },
            {
                title: 'Р Р°Р·СЂР°Р±РѕС‚РєР° РєРѕРЅС†РµРїС†РёРё',
                description: 'РЎРѕР·РґР°РµРј СѓРЅРёРєР°Р»СЊРЅСѓСЋ РёРґРµСЋ Рё С„РѕСЂРјР°С‚ СЃРѕСЂРµРІРЅРѕРІР°РЅРёР№'
            },
            {
                title: 'Р”РµС‚Р°Р»СЊРЅРѕРµ РїР»Р°РЅРёСЂРѕРІР°РЅРёРµ',
                description: 'РџСЂРѕСЂР°Р±Р°С‚С‹РІР°РµРј РІСЃРµ Р°СЃРїРµРєС‚С‹ РїСЂРѕРІРµРґРµРЅРёСЏ С‚СѓСЂРЅРёСЂР°'
            },
            {
                title: 'РЎРѕРіР»Р°СЃРѕРІР°РЅРёРµ',
                description: 'РџСЂРµРґСЃС‚Р°РІР»СЏРµРј С„РёРЅР°Р»СЊРЅС‹Р№ РїР»Р°РЅ Рё РІРЅРѕСЃРёРј РєРѕСЂСЂРµРєС‚РёСЂРѕРІРєРё'
            }
        ]
    },
    technical: {
        title: 'РўР•РҐРќРР§Р•РЎРљРћР• РћР‘Р•РЎРџР•Р§Р•РќРР•',
        description: 'РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅР°СЏ РЅР°СЃС‚СЂРѕР№РєР° РІСЃРµР№ С‚РµС…РЅРёС‡РµСЃРєРѕР№ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂС‹ РґР»СЏ РїСЂРѕРІРµРґРµРЅРёСЏ РєРёР±РµСЂСЃРїРѕСЂС‚РёРІРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ. Р“Р°СЂР°РЅС‚РёСЂСѓРµРј СЃС‚Р°Р±РёР»СЊРЅСѓСЋ СЂР°Р±РѕС‚Сѓ СЃРµСЂРІРµСЂРѕРІ Рё Р·Р°С‰РёС‚Сѓ РѕС‚ С‡РёС‚РµСЂРѕРІ.',
        features: [
            'РќР°СЃС‚СЂРѕР№РєР° Рё Р°РґРјРёРЅРёСЃС‚СЂРёСЂРѕРІР°РЅРёРµ РёРіСЂРѕРІС‹С… СЃРµСЂРІРµСЂРѕРІ',
            'РЈСЃС‚Р°РЅРѕРІРєР° Рё РЅР°СЃС‚СЂРѕР№РєР° Р°РЅС‚РёС‡РёС‚ СЃРёСЃС‚РµРј',
            'РўРµС…РЅРёС‡РµСЃРєР°СЏ РїРѕРґРґРµСЂР¶РєР° СѓС‡Р°СЃС‚РЅРёРєРѕРІ 24/7',
            'РњРѕРЅРёС‚РѕСЂРёРЅРі РїСЂРѕРёР·РІРѕРґРёС‚РµР»СЊРЅРѕСЃС‚Рё СЃРµСЂРІРµСЂРѕРІ',
            'Р РµР·РµСЂРІРЅРѕРµ РєРѕРїРёСЂРѕРІР°РЅРёРµ Рё РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ РґР°РЅРЅС‹С…',
            'РќР°СЃС‚СЂРѕР№РєР° СЃРµС‚РµРІРѕР№ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂС‹'
        ],
        process: [
            {
                title: 'РђРЅР°Р»РёР· С‚СЂРµР±РѕРІР°РЅРёР№',
                description: 'РћРїСЂРµРґРµР»СЏРµРј С‚РµС…РЅРёС‡РµСЃРєРёРµ С‚СЂРµР±РѕРІР°РЅРёСЏ РґР»СЏ РІР°С€РµРіРѕ С‚СѓСЂРЅРёСЂР°'
            },
            {
                title: 'РџРѕРґРіРѕС‚РѕРІРєР° СЃРµСЂРІРµСЂРѕРІ',
                description: 'РќР°СЃС‚СЂР°РёРІР°РµРј Рё С‚РµСЃС‚РёСЂСѓРµРј РёРіСЂРѕРІС‹Рµ СЃРµСЂРІРµСЂС‹'
            },
            {
                title: 'РЈСЃС‚Р°РЅРѕРІРєР° Р·Р°С‰РёС‚С‹',
                description: 'Р’РЅРµРґСЂСЏРµРј Р°РЅС‚РёС‡РёС‚ СЃРёСЃС‚РµРјС‹ Рё РЅР°СЃС‚СЂР°РёРІР°РµРј Р±РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ'
            },
            {
                title: 'РџРѕРґРґРµСЂР¶РєР°',
                description: 'РћР±РµСЃРїРµС‡РёРІР°РµРј С‚РµС…РЅРёС‡РµСЃРєСѓСЋ РїРѕРґРґРµСЂР¶РєСѓ РІРѕ РІСЂРµРјСЏ С‚СѓСЂРЅРёСЂР°'
            }
        ]
    },
    streaming: {
        title: 'РўР РђРќРЎР›РЇР¦РРЇ Р РЎРўР РРњ',
        description: 'РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅР°СЏ С‚СЂР°РЅСЃР»СЏС†РёСЏ С‚СѓСЂРЅРёСЂРѕРІ СЃ РєР°С‡РµСЃС‚РІРµРЅРЅС‹Рј РІРёРґРµРѕ, СЌРєСЃРїРµСЂС‚РЅС‹РјРё РєРѕРјРјРµРЅС‚Р°СЂРёСЏРјРё Рё РєСЂР°СЃРёРІС‹Рј РіСЂР°С„РёС‡РµСЃРєРёРј РѕС„РѕСЂРјР»РµРЅРёРµРј РґР»СЏ РјР°РєСЃРёРјР°Р»СЊРЅРѕРіРѕ РІРѕРІР»РµС‡РµРЅРёСЏ Р·СЂРёС‚РµР»РµР№.',
        features: [
            'РњРЅРѕРіРѕРєР°РјРµСЂРЅР°СЏ С‚СЂР°РЅСЃР»СЏС†РёСЏ РІ РІС‹СЃРѕРєРѕРј РєР°С‡РµСЃС‚РІРµ',
            'РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹Рµ РєРѕРјРјРµРЅС‚Р°С‚РѕСЂС‹ Рё Р°РЅР°Р»РёС‚РёРєРё',
            'РЈРЅРёРєР°Р»СЊРЅРѕРµ РіСЂР°С„РёС‡РµСЃРєРѕРµ РѕС„РѕСЂРјР»РµРЅРёРµ',
            'РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Рµ СЌР»РµРјРµРЅС‚С‹ РґР»СЏ Р·СЂРёС‚РµР»РµР№',
            'РўСЂР°РЅСЃР»СЏС†РёСЏ РЅР° РјРЅРѕР¶РµСЃС‚РІРѕ РїР»Р°С‚С„РѕСЂРј',
            'Р—Р°РїРёСЃСЊ Рё РјРѕРЅС‚Р°Р¶ highlights'
        ],
        process: [
            {
                title: 'РџР»Р°РЅРёСЂРѕРІР°РЅРёРµ С‚СЂР°РЅСЃР»СЏС†РёРё',
                description: 'Р Р°Р·СЂР°Р±Р°С‚С‹РІР°РµРј РєРѕРЅС†РµРїС†РёСЋ Рё СЃС†РµРЅР°СЂРёР№ С‚СЂР°РЅСЃР»СЏС†РёРё'
            },
            {
                title: 'РџРѕРґРіРѕС‚РѕРІРєР° РѕР±РѕСЂСѓРґРѕРІР°РЅРёСЏ',
                description: 'РќР°СЃС‚СЂР°РёРІР°РµРј РєР°РјРµСЂС‹, РјРёРєСЂРѕС„РѕРЅС‹ Рё СЃС‚СЂРёРјРёРЅРіРѕРІРѕРµ РџРћ'
            },
            {
                title: 'РЎРѕР·РґР°РЅРёРµ РіСЂР°С„РёРєРё',
                description: 'Р Р°Р·СЂР°Р±Р°С‚С‹РІР°РµРј СѓРЅРёРєР°Р»СЊРЅС‹Рµ РіСЂР°С„РёС‡РµСЃРєРёРµ СЌР»РµРјРµРЅС‚С‹'
            },
            {
                title: 'РџСЂРѕРІРµРґРµРЅРёРµ С‚СЂР°РЅСЃР»СЏС†РёРё',
                description: 'РћР±РµСЃРїРµС‡РёРІР°РµРј РєР°С‡РµСЃС‚РІРµРЅРЅСѓСЋ С‚СЂР°РЅСЃР»СЏС†РёСЋ С‚СѓСЂРЅРёСЂР°'
            }
        ]
    },
    prize: {
        title: 'РџР РР—РћР’РћР™ Р¤РћРќР”',
        description: 'РћСЂРіР°РЅРёР·Р°С†РёСЏ РїСЂРёР·РѕРІРѕРіРѕ С„РѕРЅРґР° С‚СѓСЂРЅРёСЂР°, РїРѕРёСЃРє СЃРїРѕРЅСЃРѕСЂРѕРІ Рё РїР°СЂС‚РЅРµСЂРѕРІ, СЃРїСЂР°РІРµРґР»РёРІРѕРµ СЂР°СЃРїСЂРµРґРµР»РµРЅРёРµ РЅР°РіСЂР°Рґ РјРµР¶РґСѓ РїРѕР±РµРґРёС‚РµР»СЏРјРё Рё СѓС‡Р°СЃС‚РЅРёРєР°РјРё СЃРѕСЂРµРІРЅРѕРІР°РЅРёР№.',
        features: [
            'Р¤РѕСЂРјРёСЂРѕРІР°РЅРёРµ РїСЂРёР·РѕРІРѕРіРѕ С„РѕРЅРґР° С‚СѓСЂРЅРёСЂР°',
            'РџРѕРёСЃРє Рё РїСЂРёРІР»РµС‡РµРЅРёРµ СЃРїРѕРЅСЃРѕСЂРѕРІ',
            'РћСЂРіР°РЅРёР·Р°С†РёСЏ РїР°СЂС‚РЅРµСЂСЃРєРёС… РїСЂРѕРіСЂР°РјРј',
            'РЎРїСЂР°РІРµРґР»РёРІРѕРµ СЂР°СЃРїСЂРµРґРµР»РµРЅРёРµ РїСЂРёР·РѕРІ',
            'РћС„РѕСЂРјР»РµРЅРёРµ РЅР°РіСЂР°РґРЅРѕР№ Р°С‚СЂРёР±СѓС‚РёРєРё',
            'Р¦РµСЂРµРјРѕРЅРёСЏ РЅР°РіСЂР°Р¶РґРµРЅРёСЏ РїРѕР±РµРґРёС‚РµР»РµР№'
        ],
        process: [
            {
                title: 'РџР»Р°РЅРёСЂРѕРІР°РЅРёРµ Р±СЋРґР¶РµС‚Р°',
                description: 'РћРїСЂРµРґРµР»СЏРµРј СЂР°Р·РјРµСЂ РїСЂРёР·РѕРІРѕРіРѕ С„РѕРЅРґР° Рё РёСЃС‚РѕС‡РЅРёРєРё С„РёРЅР°РЅСЃРёСЂРѕРІР°РЅРёСЏ'
            },
            {
                title: 'РџРѕРёСЃРє СЃРїРѕРЅСЃРѕСЂРѕРІ',
                description: 'РџСЂРёРІР»РµРєР°РµРј РїР°СЂС‚РЅРµСЂРѕРІ Рё СЃРїРѕРЅСЃРѕСЂРѕРІ РґР»СЏ СѓРІРµР»РёС‡РµРЅРёСЏ С„РѕРЅРґР°'
            },
            {
                title: 'РџРѕРґРіРѕС‚РѕРІРєР° РїСЂРёР·РѕРІ',
                description: 'РћСЂРіР°РЅРёР·СѓРµРј РїСЂРёР·С‹, РєСѓР±РєРё Рё РЅР°РіСЂР°РґРЅСѓСЋ Р°С‚СЂРёР±СѓС‚РёРєСѓ'
            },
            {
                title: 'РќР°РіСЂР°Р¶РґРµРЅРёРµ',
                description: 'РџСЂРѕРІРѕРґРёРј С‚РѕСЂР¶РµСЃС‚РІРµРЅРЅСѓСЋ С†РµСЂРµРјРѕРЅРёСЋ РЅР°РіСЂР°Р¶РґРµРЅРёСЏ'
            }
        ]
    },
    marketing: {
        title: 'РњРђР РљР•РўРРќР“ Р РџР РћР”Р’РР–Р•РќРР•',
        description: 'РљРѕРјРїР»РµРєСЃРЅРѕРµ РїСЂРѕРґРІРёР¶РµРЅРёРµ С‚СѓСЂРЅРёСЂР° РІ СЃРѕС†РёР°Р»СЊРЅС‹С… СЃРµС‚СЏС…, СЂР°Р±РѕС‚Р° СЃ РјРµРґРёР° Рё Р±Р»РѕРіРµСЂР°РјРё, РїСЂРёРІР»РµС‡РµРЅРёРµ РјР°РєСЃРёРјР°Р»СЊРЅРѕРіРѕ РєРѕР»РёС‡РµСЃС‚РІР° СѓС‡Р°СЃС‚РЅРёРєРѕРІ Рё Р·СЂРёС‚РµР»РµР№.',
        features: [
            'РЎС‚СЂР°С‚РµРіРёСЏ РїСЂРѕРґРІРёР¶РµРЅРёСЏ РІ СЃРѕС†РёР°Р»СЊРЅС‹С… СЃРµС‚СЏС…',
            'Р Р°Р±РѕС‚Р° СЃ РёРіСЂРѕРІС‹РјРё РјРµРґРёР° Рё Р±Р»РѕРіРµСЂР°РјРё',
            'РЎРѕР·РґР°РЅРёРµ СЂРµРєР»Р°РјРЅС‹С… РјР°С‚РµСЂРёР°Р»РѕРІ',
            'PR-РєР°РјРїР°РЅРёРё Рё РїСЂРµСЃСЃ-СЂРµР»РёР·С‹',
            'РџСЂРёРІР»РµС‡РµРЅРёРµ СѓС‡Р°СЃС‚РЅРёРєРѕРІ Рё Р·СЂРёС‚РµР»РµР№',
            'РђРЅР°Р»РёС‚РёРєР° Рё РѕС‚С‡РµС‚РЅРѕСЃС‚СЊ РїРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°Рј'
        ],
        process: [
            {
                title: 'Р Р°Р·СЂР°Р±РѕС‚РєР° СЃС‚СЂР°С‚РµРіРёРё',
                description: 'РЎРѕР·РґР°РµРј РїР»Р°РЅ РїСЂРѕРґРІРёР¶РµРЅРёСЏ Рё РѕРїСЂРµРґРµР»СЏРµРј РєР°РЅР°Р»С‹'
            },
            {
                title: 'РЎРѕР·РґР°РЅРёРµ РєРѕРЅС‚РµРЅС‚Р°',
                description: 'Р Р°Р·СЂР°Р±Р°С‚С‹РІР°РµРј СЂРµРєР»Р°РјРЅС‹Рµ РјР°С‚РµСЂРёР°Р»С‹ Рё РєРѕРЅС‚РµРЅС‚'
            },
            {
                title: 'Р—Р°РїСѓСЃРє РєР°РјРїР°РЅРёРё',
                description: 'Р—Р°РїСѓСЃРєР°РµРј СЂРµРєР»Р°РјРЅС‹Рµ РєР°РјРїР°РЅРёРё РІ СЂР°Р·Р»РёС‡РЅС‹С… РєР°РЅР°Р»Р°С…'
            },
            {
                title: 'РђРЅР°Р»РёР· СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ',
                description: 'РћС‚СЃР»РµР¶РёРІР°РµРј СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚СЊ Рё РєРѕСЂСЂРµРєС‚РёСЂСѓРµРј СЃС‚СЂР°С‚РµРіРёСЋ'
            }
        ]
    },
    judging: {
        title: 'РЎРЈР”Р•Р™РЎРўР’Рћ',
        description: 'РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹Рµ СЃСѓРґСЊРё СЃ РѕРїС‹С‚РѕРј РїСЂРѕРІРµРґРµРЅРёСЏ РєРёР±РµСЂСЃРїРѕСЂС‚РёРІРЅС‹С… С‚СѓСЂРЅРёСЂРѕРІ, РєРѕРЅС‚СЂРѕР»СЊ С‡РµСЃС‚РЅРѕСЃС‚Рё РёРіСЂС‹ Рё РѕРїРµСЂР°С‚РёРІРЅРѕРµ СЂР°Р·СЂРµС€РµРЅРёРµ Р»СЋР±С‹С… СЃРїРѕСЂРЅС‹С… СЃРёС‚СѓР°С†РёР№.',
        features: [
            'РљРѕРјР°РЅРґР° РѕРїС‹С‚РЅС‹С… РєРёР±РµСЂСЃРїРѕСЂС‚РёРІРЅС‹С… СЃСѓРґРµР№',
            'РљРѕРЅС‚СЂРѕР»СЊ С‡РµСЃС‚РЅРѕСЃС‚Рё Рё РїСЂР°РІРёР» РёРіСЂС‹',
            'Р Р°Р·СЂРµС€РµРЅРёРµ СЃРїРѕСЂРЅС‹С… СЃРёС‚СѓР°С†РёР№',
            'РњРѕРЅРёС‚РѕСЂРёРЅРі СЃРѕР±Р»СЋРґРµРЅРёСЏ СЂРµРіР»Р°РјРµРЅС‚Р°',
            'Р’Р·Р°РёРјРѕРґРµР№СЃС‚РІРёРµ СЃ СѓС‡Р°СЃС‚РЅРёРєР°РјРё',
            'Р”РѕРєСѓРјРµРЅС‚РёСЂРѕРІР°РЅРёРµ РЅР°СЂСѓС€РµРЅРёР№'
        ],
        process: [
            {
                title: 'РџРѕРґР±РѕСЂ СЃСѓРґРµР№',
                description: 'Р¤РѕСЂРјРёСЂСѓРµРј РєРѕРјР°РЅРґСѓ РєРІР°Р»РёС„РёС†РёСЂРѕРІР°РЅРЅС‹С… СЃСѓРґРµР№'
            },
            {
                title: 'РР·СѓС‡РµРЅРёРµ СЂРµРіР»Р°РјРµРЅС‚Р°',
                description: 'РЎСѓРґСЊРё РёР·СѓС‡Р°СЋС‚ РїСЂР°РІРёР»Р° Рё РѕСЃРѕР±РµРЅРЅРѕСЃС‚Рё С‚СѓСЂРЅРёСЂР°'
            },
            {
                title: 'РљРѕРЅС‚СЂРѕР»СЊ РёРіСЂС‹',
                description: 'РќР°Р±Р»СЋРґР°РµРј Р·Р° С…РѕРґРѕРј РјР°С‚С‡РµР№ Рё СЃРѕР±Р»СЋРґРµРЅРёРµРј РїСЂР°РІРёР»'
            },
            {
                title: 'Р Р°Р·СЂРµС€РµРЅРёРµ СЃРїРѕСЂРѕРІ',
                description: 'РћРїРµСЂР°С‚РёРІРЅРѕ СЂРµС€Р°РµРј Р»СЋР±С‹Рµ СЃРїРѕСЂРЅС‹Рµ СЃРёС‚СѓР°С†РёРё'
            }
        ]
    }
};

// Modal functionality
let currentModal = null;
let originalCardRect = null;

function openServiceModal(serviceType, cardElement) {
    
    const modal = document.getElementById('service-modal');
    const modalContainer = modal.querySelector('.modal-container');
    const modalIcon = modal.querySelector('.modal-icon');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalFeaturesList = modal.querySelector('.modal-features-list');
    const modalProcessSteps = modal.querySelector('.modal-process-steps');
    
    if (!modal || !serviceData[serviceType]) {
        console.error('вќЊ Modal or service data not found');
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
    
}

// Initialize service modals when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceModals);
} else {
    initServiceModals();
}

// 3D Tilt Effect for About Images
function initTiltEffect() {
    
    const elements = document.querySelectorAll('[data-tilt]');
    
    if (elements.length === 0) {
        console.warn('No elements with data-tilt found!');
        return;
    }
    
    elements.forEach((element, index) => {
        
        const inner = element.querySelector('.about-image-inner');
        if (!inner) {
            console.warn(`No .about-image-inner found in element ${index + 1}`);
            return;
        }
        
        
        // Mouse enter
        element.addEventListener('mouseenter', function(e) {
            // РћСЃС‚Р°РІР»СЏРµРј РїР»Р°РІРЅС‹Р№ РїРµСЂРµС…РѕРґ РґР»СЏ РєСЂР°СЃРёРІРѕР№ Р°РЅРёРјР°С†РёРё
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
            inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            inner.style.setProperty('--glare-opacity', '0');
        });
    });
    
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initTiltEffect();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
} else {
    initTiltEffect();
}

// ===== 3D TILT EFFECT FOR SERVICE CARDS =====
function initServiceCardsTilt() {

    const serviceCards = document.querySelectorAll('.service-organic-card[data-tilt]');

    if (serviceCards.length === 0) {
        console.warn('No service cards with data-tilt found!');
        return;
    }

    serviceCards.forEach((card, index) => {

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

            const maxTilt = 8; // Р‘РѕР»РµРµ РІС‹СЂР°Р¶РµРЅРЅС‹Р№ СЌС„С„РµРєС‚ РґР»СЏ РєР°СЂС‚РѕС‡РµРє СѓСЃР»СѓРі
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

}

// Initialize service cards tilt effect when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initServiceCardsTilt();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
} else {
    initServiceCardsTilt();
}
