/**
 * PÁGINA: SOLUÇÕES PARA GRÁFICAS
 * Funcionalidade: Lógica do Baralho (Deck), Modais e Formulário de Orçamento focado no nicho gráfico.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. CONFIGURAÇÃO DOS DADOS (Nichos Gráficos)
    // ======================================================
    const graficasData = [
        {
            id: 'offset',
            title: 'Offset Comercial',
            shortDesc: 'Impressão em massa sem erros de chapa.',
            longDesc: 'Focado em gráficas tradicionais e promocionais. Fazemos o fechamento de arquivos complexos para revistas, catálogos e embalagens. Realizamos checagem de overprint, retículas, trapping, sangrias e conversão de perfis de cor (CMYK/Pantone) para garantir que sua impressora não pare por erro de pré-impressão.',
            theme: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', // Gradiente Azul/Roxo Escuro
            typeValue: 'Offset Comercial'
        },
        {
            id: 'flexo',
            title: 'Flexografia & Rótulos',
            shortDesc: 'Facas, calço de branco e acabamentos.',
            longDesc: 'Para indústrias de rótulos e etiquetas flexográficas. Preparamos arquivos minuciosos com separação para calço de branco, verniz localizado, cold/hot stamping e relevos. Além disso, criamos e conferimos facas técnicas perfeitas para corte e vinco, respeitando as margens de segurança do seu cilindro.',
            theme: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Gradiente Verde
            typeValue: 'Flexografia'
        },
        {
            id: 'w2p',
            title: 'Web-to-Print / Revenda',
            shortDesc: 'Volume, automação e padronização.',
            longDesc: 'Para gráficas rápidas e revendas que recebem milhares de arquivos de clientes finais diariamente. Ajudamos a estruturar fluxos automatizados de verificação (preflight), padronização de PDFs e integração de sistemas para que os arquivos cheguem à produção com o mínimo de intervenção humana.',
            theme: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)', // Gradiente Laranja
            typeValue: 'Web to Print'
        },
        {
            id: 'com-visual',
            title: 'Comunicação Visual',
            shortDesc: 'Grandes formatos e linhas de corte.',
            longDesc: 'Tratamento de arquivos pesados (gigabytes) para lonas, fachadas e envelopamentos sem perda de resolução. Criação de linhas de corte exatas e otimizadas para plotters e routers CNC, além de paginação (tiling) e ripagem inteligente para economia de mídia.',
            theme: 'linear-gradient(135deg, #ED213A 0%, #93291E 100%)', // Gradiente Vermelho
            typeValue: 'Comunicacao Visual'
        }
    ];

    // ======================================================
    // 2. LÓGICA DO BARALHO (DECK)
    // ======================================================
    const deckContainer = document.getElementById('graficas-deck');
    const prevBtn = document.querySelector('.prev-card');
    const nextBtn = document.querySelector('.next-card');
    
    let activeIndex = 0;

    function renderDeck() {
        if (!deckContainer) return;
        deckContainer.innerHTML = ''; 

        graficasData.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('grafica-card');
            
            let position = (index - activeIndex + graficasData.length) % graficasData.length;

            if (position === 0) {
                card.classList.add('card-front');
                card.onclick = () => openDetailModal(item);
            } else if (position === 1) {
                card.classList.add('card-middle');
                card.onclick = nextCard; 
            } else if (position === 2) {
                card.classList.add('card-back');
                card.onclick = nextCard;
            } else {
                card.classList.add('card-hidden');
            }

            card.innerHTML = `
                <div class="card-visual">
                    <div class="system-preview-placeholder" style="background: ${item.theme};"></div>
                </div>
                <div class="card-content">
                    <span class="card-label">Setor</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p style="color:#ccc; font-size:0.9rem; margin-top:5px;">${item.shortDesc}</p>
                    <div class="card-action">Ver soluções &rarr;</div>
                </div>
            `;

            deckContainer.appendChild(card);
        });
    }

    function nextCard() {
        activeIndex = (activeIndex + 1) % graficasData.length;
        renderDeck();
    }

    function prevCard() {
        activeIndex = (activeIndex - 1 + graficasData.length) % graficasData.length;
        renderDeck();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);

    // Inicializa
    renderDeck();

    // ======================================================
    // 3. MODAL DE DETALHES (EXPANDIR CARD)
    // ======================================================
    const detailModal = document.getElementById('graficas-detail-modal');
    const closeDetailModalBtn = document.getElementById('close-graficas-modal');
    
    const modalImgBox = document.getElementById('modal-graficas-image');
    const modalTitle = document.getElementById('modal-graficas-title');
    const modalDesc = document.getElementById('modal-graficas-desc');
    const modalCtaBtn = document.querySelector('.open-budget-trigger');

    function openDetailModal(item) {
        modalImgBox.style.background = item.theme; 
        modalTitle.textContent = item.title;
        modalDesc.textContent = item.longDesc;
        
        modalCtaBtn.onclick = () => {
            closeModal(detailModal);
            openBudgetModal(item.typeValue);
        };

        openModal(detailModal);
    }

    if (closeDetailModalBtn) {
        closeDetailModalBtn.addEventListener('click', () => closeModal(detailModal));
    }

    // ======================================================
    // 4. MODAL DE ORÇAMENTO (FORMULÁRIO)
    // ======================================================
    const budgetModal = document.getElementById('budget-modal');
    const openBudgetBtn = document.getElementById('open-budget-btn');
    const closeBudgetBtn = document.getElementById('close-budget-modal');
    const budgetForm = document.getElementById('budget-form');
    const typeSelect = document.getElementById('budget-type');

    function openBudgetModal(preSelectedType = '') {
        if (preSelectedType && typeSelect) {
            typeSelect.value = preSelectedType;
        }
        openModal(budgetModal);
    }

    if (openBudgetBtn) {
        openBudgetBtn.addEventListener('click', () => openBudgetModal());
    }

    if (closeBudgetBtn) {
        closeBudgetBtn.addEventListener('click', () => closeModal(budgetModal));
    }

    // ======================================================
    // 5. ENVIO DO FORMULÁRIO (MAILTO)
    // ======================================================
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('budget-name').value;
            const email = document.getElementById('budget-email').value;
            const phone = document.getElementById('budget-phone').value;
            const type = document.getElementById('budget-type').value;
            const message = document.getElementById('budget-message').value;

            const subject = `Terceirização de Pré-Impressão - ${type}`;
            
            const body = `Olá, gostaria de conversar sobre terceirização de arquivos para minha gráfica.\n\n` +
                         `*Perfil:* ${type}\n` +
                         `*Gráfica/Responsável:* ${name}\n` +
                         `*WhatsApp:* ${phone}\n` +
                         `*E-mail:* ${email}\n\n` +
                         `*Maiores gargalos hoje:* \n${message}`;

            const mailtoLink = `mailto:contato@agenciabrunaecarlos.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;

            setTimeout(() => closeModal(budgetModal), 1000);
        });
    }

    // ======================================================
    // 6. UTILITÁRIOS GERAIS (Modais)
    // ======================================================
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
        }
    });
});