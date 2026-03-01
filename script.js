document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 1. MENU MOBILE & EFEITO SCROLL (HEADER)
    // ======================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const header = document.querySelector('.site-header');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.classList.contains('open');
            toggleMenu(!isOpen);
        });
    }

    mobileLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.1}s`;
        link.addEventListener('click', () => toggleMenu(false));
    });

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

        function startTimer() { slideInterval = setInterval(nextSlide, timePerSlide); }
        function resetTimer() { clearInterval(slideInterval); startTimer(); }

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
    // 4. PORTFOLIO MODAL & LIGHTBOX (ZOOM + CARROSSEL)
    // ======================================================
    const portfolioModal = document.getElementById('portfolio-modal');
    const openPortfolioBtn = document.getElementById('open-portfolio-btn');
    const closePortfolioBtn = document.getElementById('close-portfolio-btn');
    // Pegamos todas as imagens da galeria para poder navegar entre elas
    const galleryImages = document.querySelectorAll('.modal-gallery .gallery-item img');

    let currentLightboxIndex = 0; // Guarda qual imagem está aberta no momento

    if (portfolioModal && openPortfolioBtn) {
        
        // --- Abre o modal principal do Portfólio ---
        openPortfolioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            portfolioModal.classList.add('active');
            document.body.classList.add('modal-open');
        });

        // --- Fecha o modal principal do Portfólio ---
        function closePortfolio() {
            portfolioModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }

        if (closePortfolioBtn) closePortfolioBtn.addEventListener('click', closePortfolio);

        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) closePortfolio();
        });

        // --- Teclas de atalho ---
        document.addEventListener('keydown', (e) => {
            const lightbox = document.querySelector('.lightbox-overlay');
            
            // ESC para fechar
            if (e.key === 'Escape') {
                if (lightbox) {
                    closeLightbox();
                } else if (portfolioModal.classList.contains('active')) {
                    closePortfolio();
                }
            }

            // Setas do teclado para navegar no carrossel
            if (lightbox) {
                if (e.key === 'ArrowRight') navigateLightbox(1);
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
            }
        });

        // --- Atribui o clique de zoom para cada item da galeria ---
        galleryImages.forEach((imgElement, index) => {
            imgElement.parentElement.addEventListener('click', () => {
                currentLightboxIndex = index; // Salva o índice da imagem clicada
                openLightbox(); 
            });
        });
    }

    // --- LÓGICA DO CARROSSEL (LIGHTBOX) ---
    function openLightbox() {
        let lightbox = document.querySelector('.lightbox-overlay');

        // Cria a tela preta com os controles se ela ainda não existir
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            
            Object.assign(lightbox.style, {
                position: 'fixed',
                top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.95)',
                zIndex: '3000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });

            // Elemento da imagem
            const imgElement = document.createElement('img');
            imgElement.className = 'lightbox-image';
            Object.assign(imgElement.style, {
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '8px',
                objectFit: 'contain',
                transform: 'scale(0.9)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s',
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            });

            // Botão Fechar (X)
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.className = 'lightbox-close-zoom';
            closeBtn.addEventListener('click', closeLightbox);

            // Botão Anterior (<)
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&#10094;';
            prevBtn.className = 'lightbox-btn lightbox-prev';
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que o clique feche o lightbox
                navigateLightbox(-1);
            });

            // Botão Próximo (>)
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '&#10095;';
            nextBtn.className = 'lightbox-btn lightbox-next';
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que o clique feche o lightbox
                navigateLightbox(1);
            });

            // Fecha ao clicar fora da imagem
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            // Junta tudo na tela
            lightbox.appendChild(imgElement);
            lightbox.appendChild(closeBtn);
            lightbox.appendChild(prevBtn);
            lightbox.appendChild(nextBtn);
            document.body.appendChild(lightbox);

            // Animação suave de entrada
            requestAnimationFrame(() => {
                lightbox.style.opacity = '1';
                imgElement.style.transform = 'scale(1)';
            });
        }

        // Carrega a imagem atual no elemento
        updateLightboxImage();
    }

    // Função que troca a URL da imagem de acordo com o índice
    function updateLightboxImage() {
        const imgElement = document.querySelector('.lightbox-image');
        if (imgElement && galleryImages[currentLightboxIndex]) {
            // Pequeno piscar (fade) para deixar a troca fluida
            imgElement.style.opacity = '0.5';
            setTimeout(() => {
                imgElement.src = galleryImages[currentLightboxIndex].src;
                imgElement.style.opacity = '1';
            }, 100);
        }
    }

    // Navega para a próxima ou anterior
    function navigateLightbox(direction) {
        currentLightboxIndex += direction;

        // Efeito de loop (vai da última para a primeira e vice-versa)
        if (currentLightboxIndex >= galleryImages.length) {
            currentLightboxIndex = 0;
        } else if (currentLightboxIndex < 0) {
            currentLightboxIndex = galleryImages.length - 1;
        }

        updateLightboxImage();
    }

    // Destrói o Lightbox ao fechar
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            lightbox.style.opacity = '0';
            const img = lightbox.querySelector('.lightbox-image');
            if (img) img.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        }
    }
});