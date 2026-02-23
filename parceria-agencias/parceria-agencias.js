/**
 * PÁGINA: PARCERIA COM AGÊNCIAS (WHITE LABEL)
 * Funcionalidade: Lógica do Baralho (Deck), Modais e Formulário de Parceria.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. CONFIGURAÇÃO DOS DADOS (Serviços White Label)
    // ======================================================
    const agenciasData = [
        {
            id: 'web-lp',
            title: 'Desenvolvimento Web e LP',
            shortDesc: 'Landing Pages de alta conversão entregues no prazo.',
            longDesc: 'Sabemos que campanhas de Inbound e Lançamentos têm prazos apertados. Desenvolvemos Landing Pages, Hotsites e E-commerces otimizados para performance (velocidade) e conversão. Entregamos o código limpo, integrado ao RD Station, ActiveCampaign ou qualquer CRM que sua agência utilize.',
            theme: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)', // Gradiente Vermelho/Laranja (Foco em conversão)
            typeValue: 'Landing Pages e Sites'
        },
        {
            id: 'artes-escala',
            title: 'Artes em Escalas',
            shortDesc: 'Desdobramento de campanhas para Ads e Social.',
            longDesc: 'Seu Diretor de Arte deve focar na ideia genial (Key Visual), não em redimensionar 50 formatos de banners para Google Ads e Meta Ads. Assumimos a produção braçal: você aprova a linha mestra e nós desdobramos para todos os formatos, stories, carrosséis e mídias de performance com precisão milimétrica.',
            theme: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', // Gradiente Roxo (Criatividade)
            typeValue: 'UI UX Design'
        },
        {
            id: 'tratamento',
            title: 'Tratamento de Imagens',
            shortDesc: 'Pós-produção avançada e fusões perfeitas.',
            longDesc: 'Eleve o nível das campanhas dos seus clientes. Realizamos recortes complexos, limpeza de pele, color grading (correção de cor), fusão de imagens e manipulação avançada. Entregamos o arquivo em alta resolução pronto para ir para a gráfica ou para a mídia digital.',
            theme: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Gradiente Verde
            typeValue: 'UI UX Design'
        },
        {
            id: 'diagramacao',
            title: 'Edição e Diagramação',
            shortDesc: 'Materiais ricos, e-books e relatórios.',
            longDesc: 'Agências de Inbound Marketing produzem muito conteúdo. Nós cuidamos do design editorial: diagramação de e-books, whitepapers, catálogos de produtos, relatórios de resultados e apresentações comerciais de alto impacto.',
            theme: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', // Gradiente Azul Escuro/Metálico
            typeValue: 'UI UX Design'
        },
        {
            id: 'tech-automacao',
            title: 'Automações & Tech',
            shortDesc: 'Integrações complexas para agências.',
            longDesc: 'Sua agência vendeu um projeto complexo e não tem equipe técnica para executar? Assumimos o desenvolvimento de APIs, automação via Make/n8n/Zapier, webhooks personalizados e dashboards de BI para seus clientes.',
            theme: 'linear-gradient(135deg, #1FA2FF 0%, #12D8FA 50%, #A6FFCB 100%)', // Gradiente Azul Claro/Tech
            typeValue: 'Automacao e Inbound'
        }
    ];

    // ======================================================
    // 2. LÓGICA DO BARALHO (DECK)
    // ======================================================
    const deckContainer = document.getElementById('agencias-deck');
    const prevBtn = document.querySelector('.prev-card');
    const nextBtn = document.querySelector('.next-card');
    
    let activeIndex = 0;

    function renderDeck() {
        if (!deckContainer) return;
        deckContainer.innerHTML = ''; 

        agenciasData.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('agencia-card');
            
            let position = (index - activeIndex + agenciasData.length) % agenciasData.length;

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
                    <span class="card-label">White Label</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p style="color:#ccc; font-size:0.9rem; margin-top:5px;">${item.shortDesc}</p>
                    <div class="card-action">Ver como funciona &rarr;</div>
                </div>
            `;

            deckContainer.appendChild(card);
        });
    }

    function nextCard() {
        activeIndex = (activeIndex + 1) % agenciasData.length;
        renderDeck();
    }

    function prevCard() {
        activeIndex = (activeIndex - 1 + agenciasData.length) % agenciasData.length;
        renderDeck();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);

    // Inicializa o baralho
    renderDeck();

    // ======================================================
    // 3. MODAL DE DETALHES (EXPANDIR CARD)
    // ======================================================
    const detailModal = document.getElementById('agencias-detail-modal');
    const closeDetailModalBtn = document.getElementById('close-agencias-modal');
    
    const modalImgBox = document.getElementById('modal-agencias-image');
    const modalTitle = document.getElementById('modal-agencias-title');
    const modalDesc = document.getElementById('modal-agencias-desc');
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
    // 4. MODAL DE PARCERIA (FORMULÁRIO WHITE LABEL)
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

            // Assunto altamente profissional voltado B2B
            const subject = `Parceria White Label - ${type}`;
            
            const body = `Olá Carlos e Bruna, gostaria de conversar sobre terceirização de demandas da nossa agência.\n\n` +
                         `*Agência/Responsável:* ${name}\n` +
                         `*Necessidade Principal:* ${type}\n` +
                         `*WhatsApp:* ${phone}\n` +
                         `*E-mail:* ${email}\n\n` +
                         `*Cenário Atual da Agência:* \n${message}`;

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