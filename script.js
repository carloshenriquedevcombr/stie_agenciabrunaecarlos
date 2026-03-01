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
    const galleryImages = document.querySelectorAll('.modal-gallery .gallery-item img');

    let currentLightboxIndex = 0; 

    if (portfolioModal && openPortfolioBtn) {
        
        openPortfolioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            portfolioModal.classList.add('active');
            document.body.classList.add('modal-open');
        });

        function closePortfolio() {
            portfolioModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }

        if (closePortfolioBtn) closePortfolioBtn.addEventListener('click', closePortfolio);

        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) closePortfolio();
        });

        document.addEventListener('keydown', (e) => {
            const lightbox = document.querySelector('.lightbox-overlay');
            
            if (e.key === 'Escape') {
                if (lightbox) {
                    closeLightbox();
                } else if (portfolioModal.classList.contains('active')) {
                    closePortfolio();
                }
            }

            if (lightbox) {
                if (e.key === 'ArrowRight') navigateLightbox(1);
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
            }
        });

        galleryImages.forEach((imgElement, index) => {
            imgElement.parentElement.addEventListener('click', () => {
                currentLightboxIndex = index; 
                openLightbox(); 
            });
        });
    }

    function openLightbox() {
        let lightbox = document.querySelector('.lightbox-overlay');

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

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.className = 'lightbox-close-zoom';
            closeBtn.addEventListener('click', closeLightbox);

            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&#10094;';
            prevBtn.className = 'lightbox-btn lightbox-prev';
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                navigateLightbox(-1);
            });

            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '&#10095;';
            nextBtn.className = 'lightbox-btn lightbox-next';
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                navigateLightbox(1);
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            lightbox.appendChild(imgElement);
            lightbox.appendChild(closeBtn);
            lightbox.appendChild(prevBtn);
            lightbox.appendChild(nextBtn);
            document.body.appendChild(lightbox);

            requestAnimationFrame(() => {
                lightbox.style.opacity = '1';
                imgElement.style.transform = 'scale(1)';
            });
        }

        updateLightboxImage();
    }

    function updateLightboxImage() {
        const imgElement = document.querySelector('.lightbox-image');
        if (imgElement && galleryImages[currentLightboxIndex]) {
            imgElement.style.opacity = '0.5';
            setTimeout(() => {
                imgElement.src = galleryImages[currentLightboxIndex].src;
                imgElement.style.opacity = '1';
            }, 100);
        }
    }

    function navigateLightbox(direction) {
        currentLightboxIndex += direction;

        if (currentLightboxIndex >= galleryImages.length) {
            currentLightboxIndex = 0;
        } else if (currentLightboxIndex < 0) {
            currentLightboxIndex = galleryImages.length - 1;
        }

        updateLightboxImage();
    }

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

    // ======================================================
    // 5. AUTOMAÇÃO AVANÇADA: MAUTIC & n8n
    // ======================================================
    
    // URL do Webhook do n8n
    const webhookN8N = 'https://n8n.carloshenriquedev.com/webhook/formulario-site';

    // Função para notificar o n8n sobre ações
    function enviarAlertaParaN8N(tipoAcao, dadosExtras = {}) {
        const payload = { 
            acao: tipoAcao, 
            origem: window.location.href,
            data: new Date().toLocaleString('pt-BR'),
            ...dadosExtras
        };

        fetch(webhookN8N, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.log('Automação: Aviso não enviado.', err));
    }

    // 5.1 Rastrear cliques no WhatsApp
    const btnWpp = document.getElementById('btn-track-wpp');
    if (btnWpp) {
        btnWpp.addEventListener('click', () => {
            if (typeof mt === 'function') mt('send', 'pageview', {tags: 'clicou_whatsapp'});
            enviarAlertaParaN8N('clique_whatsapp');
        });
    }

    // 5.2 Rastrear cliques no E-mail
    const btnEmail = document.getElementById('btn-track-email');
    if (btnEmail) {
        btnEmail.addEventListener('click', () => {
            if (typeof mt === 'function') mt('send', 'pageview', {tags: 'clicou_email'});
            enviarAlertaParaN8N('clique_email');
        });
    }

    // 5.3 Capturar Formulário (Funciona na Home e nas Subpáginas)
    const formOrcamento = document.querySelector('#form-orcamento, #budget-form');
    
    if (formOrcamento) {
        // --- NOVIDADE: Rastreio de Intenção (Abandono) ---
        let intencaoRegistrada = false;
        const inputsDoFormulario = formOrcamento.querySelectorAll('input, textarea, select');
        
        inputsDoFormulario.forEach(input => {
            // Quando a pessoa digita e sai do campo (blur)
            input.addEventListener('blur', () => {
                // Se a pessoa digitou algo e a intenção ainda não foi registrada
                if (!intencaoRegistrada && input.value.trim() !== '') {
                    intencaoRegistrada = true; // Garante que só avisa uma vez
                    
                    if (typeof mt === 'function') mt('send', 'pageview', {tags: 'iniciou_preenchimento'});
                    enviarAlertaParaN8N('abandono_formulario', { campo_preenchido: input.name || input.id });
                }
            });
        });

        // --- Envio de Fato do Formulário ---
        formOrcamento.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            // Pega todos os dados preenchidos usando os names ou IDs dos campos
            const nome = formOrcamento.querySelector('[name="nome"], #budget-name')?.value || '';
            const email = formOrcamento.querySelector('[name="email"], #budget-email')?.value || '';
            const telefone = formOrcamento.querySelector('[name="telefone"], #budget-phone')?.value || '';
            const assunto = formOrcamento.querySelector('[name="assunto"], #budget-type')?.value || '';
            const mensagem = formOrcamento.querySelector('[name="mensagem"], #budget-message')?.value || '';

            const dadosDoCliente = {
                acao: 'envio_formulario',
                nome: nome,
                email: email,
                telefone: telefone,
                assunto: assunto,
                mensagem: mensagem
            };

            // Registra no Mautic que ele virou um Lead
            if (typeof mt === 'function') {
                mt('send', 'pageview', {
                    email: dadosDoCliente.email,
                    firstname: dadosDoCliente.nome,
                    phone: dadosDoCliente.telefone,
                    tags: 'solicitou_orcamento'
                });
            }

            const btnSubmit = formOrcamento.querySelector('.btn-submit');
            const textoOriginal = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Enviando...';
            btnSubmit.disabled = true;

            // Envia para o n8n
            fetch(webhookN8N, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosDoCliente)
            })
            .then(response => {
                alert("Projeto recebido! Você e a Bruna serão notificados no WhatsApp e enviaremos um e-mail em instantes.");
                formOrcamento.reset(); 
                intencaoRegistrada = false; // Reseta a intenção
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Houve um pequeno atraso, mas não se preocupe! Por favor, chame-nos no WhatsApp abaixo para um atendimento imediato.");
            })
            .finally(() => {
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;
            });
        });
    }

});