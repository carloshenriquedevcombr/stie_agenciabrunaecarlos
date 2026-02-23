/**
 * PÁGINA: BRANDING & VAREJO
 * Funcionalidade: Lógica do Baralho (Deck), Modais e Formulário Estratégico.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. CONFIGURAÇÃO DOS DADOS (Ecossistema da Marca)
    // ======================================================
    const brandingData = [
        {
            id: 'nascimento',
            title: 'Branding & Identidade',
            shortDesc: 'O nascimento ou renascimento da sua marca.',
            longDesc: 'Não criamos apenas um "logotipo bonito". Desenvolvemos a alma do seu negócio. Entregamos a Identidade Visual completa, Manual da Marca, paleta de cores estratégica, tipografia e o tom de voz para que sua empresa nasça (ou se reposicione) cobrando mais caro e atraindo o cliente certo.',
            theme: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Gradiente Verde (Nascimento/Crescimento)
            typeValue: 'Nova Empresa'
        },
        {
            id: 'embalagens',
            title: 'Embalagem & PDV',
            shortDesc: 'Sua marca como o melhor vendedor na prateleira.',
            longDesc: 'No varejo físico, a embalagem é o primeiro contato do cliente com o seu produto. Criamos rótulos, facas técnicas, sacolas, papelaria corporativa e materiais de Ponto de Venda (PDV) que destacam o seu produto da concorrência e justificam um ticket médio maior.',
            theme: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)', // Gradiente Laranja/Ouro (Varejo/Produto)
            typeValue: 'Embalagens e Produto'
        },
        {
            id: 'rebranding',
            title: 'Rebranding Estratégico',
            shortDesc: 'Atualize sua marca sem perder sua essência.',
            longDesc: 'Sua empresa cresceu, mas sua marca parou no tempo? O mercado mudou e você precisa se modernizar para não perder espaço. Fazemos a transição segura da sua identidade visual antiga para uma nova, forte e alinhada com os padrões atuais, sem assustar sua base de clientes fiéis.',
            theme: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', // Gradiente Roxo (Transformação/Luxo)
            typeValue: 'Rebranding'
        },
        {
            id: 'digital',
            title: 'Presença Digital',
            shortDesc: 'Sua vitrine 24 horas por dia.',
            longDesc: 'De nada adianta uma marca linda se ninguém a encontra online. Desdobramos sua identidade visual para o mundo digital: criação de templates para Social Media (Instagram/LinkedIn), Banners para anúncios (Ads) e o design de Sites e Landing Pages focados em alta conversão.',
            theme: 'linear-gradient(135deg, #1FA2FF 0%, #12D8FA 50%, #A6FFCB 100%)', // Gradiente Azul (Digital/Web)
            typeValue: 'Digital e Automacao'
        },
        {
            id: 'automacao',
            title: 'Automação & Sistemas',
            shortDesc: 'O motor por trás das vendas.',
            longDesc: 'O design atrai, mas a tecnologia converte e retém. Finalizamos o seu ecossistema integrando o seu site com CRMs, automatizando o envio de e-mails, estruturando funis de vendas e desenvolvendo sistemas sob medida (SaaS/ERP) para gerenciar o crescimento da sua empresa.',
            theme: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', // Gradiente Escuro Tech (Estrutura)
            typeValue: 'Assessoria Completa'
        }
    ];

    // ======================================================
    // 2. LÓGICA DO BARALHO (DECK)
    // ======================================================
    const deckContainer = document.getElementById('branding-deck');
    const prevBtn = document.querySelector('.prev-card');
    const nextBtn = document.querySelector('.next-card');
    
    let activeIndex = 0;

    function renderDeck() {
        if (!deckContainer) return;
        deckContainer.innerHTML = ''; 

        brandingData.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('branding-card');
            
            let position = (index - activeIndex + brandingData.length) % brandingData.length;

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
                    <span class="card-label">Etapa</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p style="color:#ccc; font-size:0.9rem; margin-top:5px;">${item.shortDesc}</p>
                    <div class="card-action">Entender Estratégia &rarr;</div>
                </div>
            `;

            deckContainer.appendChild(card);
        });
    }

    function nextCard() {
        activeIndex = (activeIndex + 1) % brandingData.length;
        renderDeck();
    }

    function prevCard() {
        activeIndex = (activeIndex - 1 + brandingData.length) % brandingData.length;
        renderDeck();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);

    // Inicializa o baralho
    renderDeck();

    // ======================================================
    // 3. MODAL DE DETALHES (EXPANDIR CARD)
    // ======================================================
    const detailModal = document.getElementById('branding-detail-modal');
    const closeDetailModalBtn = document.getElementById('close-branding-modal');
    
    const modalImgBox = document.getElementById('modal-branding-image');
    const modalTitle = document.getElementById('modal-branding-title');
    const modalDesc = document.getElementById('modal-branding-desc');
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
    // 4. MODAL DE ORÇAMENTO (FORMULÁRIO ESTRATÉGICO)
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
    // 5. ENVIO DO FORMULÁRIO (MAILTO B2B)
    // ======================================================
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('budget-name').value;
            const email = document.getElementById('budget-email').value;
            const phone = document.getElementById('budget-phone').value;
            const type = document.getElementById('budget-type').value;
            const message = document.getElementById('budget-message').value;

            // Assunto focado em fechamento de negócios
            const subject = `Projeto Estratégico - ${type}`;
            
            const body = `Olá Bruna e Carlos, gostaria de estruturar um projeto para minha empresa.\n\n` +
                         `*Nome / Empresa:* ${name}\n` +
                         `*Momento da Empresa:* ${type}\n` +
                         `*WhatsApp:* ${phone}\n` +
                         `*E-mail:* ${email}\n\n` +
                         `*Sobre o Projeto:* \n${message}`;

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