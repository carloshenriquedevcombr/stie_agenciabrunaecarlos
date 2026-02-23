document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 1. MENU MOBILE & EFEITO SCROLL (HEADER)
    // ======================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const header = document.querySelector('.site-header');

    // Toggle Menu (Sanduíche)
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.classList.contains('open');
            toggleMenu(!isOpen);
        });
    }

    // Fechar ao clicar nos links
    mobileLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.1}s`;
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Função centralizada para abrir/fechar menu
    function toggleMenu(open) {
        if (open) {
            mobileToggle.classList.add('open');
            mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
        } else {
            mobileToggle.classList.remove('open');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    // Efeito de Scroll no Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ======================================================
    // 2. HERO SLIDER AVANÇADO
    // ======================================================
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    let slideInterval;
    const timePerSlide = 6000; 

    if (slides.length > 0) {
        // Inicializa bolinhas
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetTimer();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if(dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, timePerSlide);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        startTimer();
    }

    // ======================================================
    // 3. EFEITO TILT 3D (Desktop)
    // ======================================================
    const glassElements = document.querySelectorAll('.liquid-glass');

    if (window.matchMedia("(min-width: 1024px)").matches) {
        glassElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPct = x / rect.width;
                const yPct = y / rect.height;
                
                const xRot = (0.5 - yPct) * 5;
                const yRot = (xPct - 0.5) * 5;

                el.style.transform = `perspective(500px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateY(-2px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'none';
            });
        });
    }

    // ======================================================
    // 4. PORTFOLIO MODAL & LIGHTBOX (ZOOM)
    // ======================================================
    const portfolioModal = document.getElementById('portfolio-modal');
    const openPortfolioBtn = document.getElementById('open-portfolio-btn');
    const closePortfolioBtn = document.getElementById('close-portfolio-btn');
    const galleryItems = document.querySelectorAll('.modal-gallery .gallery-item');

    if (portfolioModal && openPortfolioBtn) {
        
        // --- Lógica de Abertura do Modal ---
        openPortfolioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            portfolioModal.classList.add('active');
            document.body.classList.add('modal-open'); // Trava scroll via CSS
        });

        // --- Lógica de Fechamento do Modal ---
        function closePortfolio() {
            portfolioModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }

        if (closePortfolioBtn) closePortfolioBtn.addEventListener('click', closePortfolio);

        // Fecha clicando fora
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) closePortfolio();
        });

        // Fecha com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.querySelector('.lightbox-overlay')) {
                    // Se o lightbox de zoom estiver aberto, fecha ele primeiro
                    closeLightbox();
                } else if (portfolioModal.classList.contains('active')) {
                    // Senão fecha o modal
                    closePortfolio();
                }
            }
        });

        // --- Lógica de Zoom (Lightbox) ---
        // Cria um visualizador rápido sem precisar de HTML extra
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Pega a imagem de fundo ou img tag
                let bgImage = item.style.backgroundImage;
                
                // Se for placeholder sem imagem, usa uma cor ou placeholder visual
                if (!bgImage || bgImage === 'none') {
                    // Apenas para teste, se não tiver imagem real
                    // Em produção, isso pegará a imagem real definida no CSS ou HTML
                    createLightbox(null, item.classList); 
                } else {
                    createLightbox(bgImage);
                }
            });
        });
    }

    // Função Auxiliar: Cria o Lightbox dinamicamente
    function createLightbox(imageSource, classes) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        
        // Estilos Inline para garantir funcionamento sem mexer no CSS agora
        Object.assign(lightbox.style, {
            position: 'fixed',
            top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: '3000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        // Cria o container da imagem
        const imgContainer = document.createElement('div');
        Object.assign(imgContainer.style, {
            width: '80%',
            height: '80%',
            borderRadius: '12px',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: imageSource || 'none',
            backgroundColor: imageSource ? 'transparent' : '#222', // Fallback se for placeholder
            transform: 'scale(0.9)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        });

        lightbox.appendChild(imgContainer);
        document.body.appendChild(lightbox);

        // Animação de Entrada
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            imgContainer.style.transform = 'scale(1)';
        });

        // Fechar ao clicar
        lightbox.addEventListener('click', closeLightbox);
    }

    // Função Auxiliar: Fecha Lightbox
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            lightbox.style.opacity = '0';
            if(lightbox.firstChild) lightbox.firstChild.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        }
    }
});