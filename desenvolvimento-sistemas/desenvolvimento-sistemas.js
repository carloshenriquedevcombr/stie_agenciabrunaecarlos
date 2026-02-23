/**
 * PÁGINA: DESENVOLVIMENTO DE SISTEMAS
 * Funcionalidade: Lógica do Baralho (Deck), Modais e Formulário de Orçamento.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. CONFIGURAÇÃO DOS DADOS (Sistemas)
    // ======================================================
    const systemsData = [
        {
            id: 'site',
            title: 'Site Institucional',
            shortDesc: 'Sua vitrine digital 24h.',
            longDesc: 'É a sua vitrine digital na internet, onde as pessoas encontram informações sobre quem você é ou o que você faz. Desenvolvemos sites rápidos, otimizados para o Google (SEO) e com design que converte visitantes em clientes.',
            theme: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)', // Gradiente Laranja/Rosa
            typeValue: 'Site'
        },
        {
            id: 'crm',
            title: 'CRM Personalizado',
            shortDesc: 'Organize suas vendas e clientes.',
            longDesc: 'Uma ferramenta para organizar o contato com seus clientes, registrando conversas e histórico de vendas. Nunca mais perca um lead por falta de acompanhamento. Dashboards visuais e funis de vendas sob medida para seu processo comercial.',
            theme: 'linear-gradient(135deg, #1FA2FF 0%, #12D8FA 50%, #A6FFCB 100%)', // Gradiente Azul/Verde
            typeValue: 'CRM'
        },
        {
            id: 'saas',
            title: 'Plataforma SaaS',
            shortDesc: 'Seu software como serviço.',
            longDesc: 'Software usado pela internet por assinatura, sem instalação local. Transforme sua ideia em um produto recorrente. Criamos a arquitetura multi-tenant, gestão de assinaturas (Stripe/Asaas) e painéis administrativos completos.',
            theme: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', // Gradiente Roxo
            typeValue: 'SaaS'
        },
        {
            id: 'erp',
            title: 'ERP Integrado',
            shortDesc: 'O coração da sua operação.',
            longDesc: 'Sistema central que integra financeiro, vendas e operações. Tenha visão total do seu negócio em tempo real. Controle de fluxo de caixa, emissão de notas fiscais e relatórios gerenciais automatizados.',
            theme: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Gradiente Verde
            typeValue: 'ERP'
        },
        {
            id: 'wms',
            title: 'WMS Logístico',
            shortDesc: 'Gestão de estoque inteligente.',
            longDesc: 'Sistema de gestão de estoque e logística de armazém. Rastreabilidade total de produtos, controle de validade, endereçamento de estoque e otimização de rotas de separação (picking).',
            theme: 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)', // Gradiente Amarelo/Laranja
            typeValue: 'WMS'
        },
        {
            id: 'automacoes',
            title: 'Automações & API',
            shortDesc: 'Deixe o robô trabalhar.',
            longDesc: 'Tecnologia que executa tarefas repetitivas automaticamente. Conectamos seus sistemas atuais (integração via API), criamos bots de atendimento e automatizamos processos manuais para reduzir custos operacionais.',
            theme: 'linear-gradient(135deg, #CB356B 0%, #BD3F32 100%)', // Gradiente Vermelho
            typeValue: 'Automacoes'
        }
    ];

    // ======================================================
    // 2. LÓGICA DO BARALHO (DECK)
    // ======================================================
    const deckContainer = document.getElementById('systems-deck');
    const prevBtn = document.querySelector('.prev-card');
    const nextBtn = document.querySelector('.next-card');
    
    // Estado atual do deck (índices)
    let activeIndex = 0;

    // Função para Renderizar o Baralho
    function renderDeck() {
        deckContainer.innerHTML = ''; // Limpa atual

        systemsData.forEach((system, index) => {
            // Cria o elemento do card
            const card = document.createElement('div');
            card.classList.add('system-card');
            
            // Define a posição baseada na distância do activeIndex
            // Lógica circular para criar loop infinito visual
            let position = (index - activeIndex + systemsData.length) % systemsData.length;

            if (position === 0) {
                card.classList.add('card-front');
                // Adiciona evento de clique apenas no card da frente
                card.onclick = () => openSystemDetails(system);
            } else if (position === 1) {
                card.classList.add('card-middle');
                card.onclick = nextCard; // Clicar no fundo avança
            } else if (position === 2) {
                card.classList.add('card-back');
                card.onclick = nextCard;
            } else {
                card.classList.add('card-hidden');
            }

            // HTML Interno do Card
            card.innerHTML = `
                <div class="card-visual">
                    <div class="system-preview-placeholder" style="background: ${system.theme};"></div>
                </div>
                <div class="card-content">
                    <span class="card-label">Sistema</span>
                    <h3 class="card-title">${system.title}</h3>
                    <p style="color:#ccc; font-size:0.9rem; margin-top:5px;">${system.shortDesc}</p>
                    <div class="card-action">Clique para ver mais &rarr;</div>
                </div>
            `;

            deckContainer.appendChild(card);
        });
    }

    // Funções de Navegação
    function nextCard() {
        activeIndex = (activeIndex + 1) % systemsData.length;
        renderDeck();
    }

    function prevCard() {
        activeIndex = (activeIndex - 1 + systemsData.length) % systemsData.length;
        renderDeck();
    }

    // Event Listeners dos Botões
    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);

    // Inicializa o Deck
    renderDeck();

    // ======================================================
    // 3. MODAL DE DETALHES (EXPANDIR CARD)
    // ======================================================
    const systemModal = document.getElementById('system-detail-modal');
    const closeSystemModalBtn = document.getElementById('close-system-modal');
    
    // Elementos internos do modal para preencher
    const modalImgBox = document.getElementById('modal-system-image');
    const modalTitle = document.getElementById('modal-system-title');
    const modalDesc = document.getElementById('modal-system-desc');
    const modalCtaBtn = document.querySelector('.open-budget-trigger');

    function openSystemDetails(system) {
        // Preenche dados
        modalImgBox.style.background = system.theme; // Usa o gradiente como "imagem"
        modalTitle.textContent = system.title;
        modalDesc.textContent = system.longDesc;
        
        // Configura o botão do modal para abrir o orçamento já selecionado
        modalCtaBtn.onclick = () => {
            closeModal(systemModal);
            openBudgetModal(system.typeValue);
        };

        openModal(systemModal);
    }

    if (closeSystemModalBtn) {
        closeSystemModalBtn.addEventListener('click', () => closeModal(systemModal));
    }

    // ======================================================
    // 4. MODAL DE ORÇAMENTO (FORMULÁRIO)
    // ======================================================
    const budgetModal = document.getElementById('budget-modal');
    const openBudgetBtn = document.getElementById('open-budget-btn'); // Botão principal da página
    const closeBudgetBtn = document.getElementById('close-budget-modal');
    const budgetForm = document.getElementById('budget-form');
    const typeSelect = document.getElementById('budget-type');

    // Abre modal de orçamento (pode receber um tipo pré-selecionado)
    function openBudgetModal(preSelectedType = '') {
        if (preSelectedType) {
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
    // 5. LÓGICA DE ENVIO DO FORMULÁRIO (MAILTO)
    // ======================================================
    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('budget-name').value;
            const email = document.getElementById('budget-email').value;
            const phone = document.getElementById('budget-phone').value;
            const type = document.getElementById('budget-type').value;
            const message = document.getElementById('budget-message').value;

            // Assunto Automático
            const subject = `Orçamento - ${type} - Desenvolvimento de Sistemas`;
            
            // Corpo do E-mail
            const body = `Olá, gostaria de um orçamento para desenvolvimento.\n\n` +
                         `*Tipo de Sistema:* ${type}\n` +
                         `*Nome:* ${name}\n` +
                         `*WhatsApp:* ${phone}\n` +
                         `*E-mail:* ${email}\n\n` +
                         `*Mensagem:* \n${message}`;

            // Cria o link mailto
            const mailtoLink = `mailto:contato@agenciabrunaecarlos.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Abre o cliente de e-mail
            window.location.href = mailtoLink;

            // Opcional: Fechar modal após enviar
            setTimeout(() => closeModal(budgetModal), 1000);
        });
    }

    // ======================================================
    // 6. UTILITÁRIOS GERAIS (Modais)
    // ======================================================
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava scroll
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Destrava scroll
    }

    // Fechar ao clicar fora (Overlay)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
        }
    });

});