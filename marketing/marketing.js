document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------
  // MAPEAMENTO DOS ELEMENTOS DA TELA
  // ---------------------------------------------------------
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const uploadText = document.getElementById("upload-text");
  const galleryGrid = document.getElementById("gallery-grid");

  // Elementos do Popup (Modal)
  const imageModal = document.getElementById("image-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalImg = document.getElementById("modal-img");
  const modalUrlInput = document.getElementById("modal-url");
  const btnCopyModal = document.getElementById("btn-copy-modal");

  // ---------------------------------------------------------
  // 1. FUNÇÃO PARA PEGAR A URL RAIZ DA HOSTGATOR
  // ---------------------------------------------------------
  function getBaseUrl() {
    let path = window.location.origin + window.location.pathname;
    if (path.endsWith(".html")) {
      path = path.substring(0, path.lastIndexOf("/") + 1);
    }
    if (!path.endsWith("/")) {
      path += "/";
    }
    return path;
  }

  // ---------------------------------------------------------
  // 2. CARREGAR A GALERIA DE IMAGENS
  // ---------------------------------------------------------
  window.loadGallery = function () {
    fetch("upload.php?action=list")
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.success) {
            galleryGrid.innerHTML = "";

            data.files.forEach((file) => {
              const fullUrl = getBaseUrl() + file.path;
              const card = document.createElement("div");
              card.className = "gallery-card";

              // Monta o card dinamicamente
              card.innerHTML = `
                                <img src="${fullUrl}" alt="${file.name}" onclick="abrirModal('${fullUrl}')" title="Clique para ampliar">
                                <div class="url-box">
                                    <input type="text" class="url-input" value="${fullUrl}" readonly>
                                    <button class="btn btn-copy-gallery" onclick="copyToClipboard(this)">Copiar</button>
                                </div>
                                <button class="btn-delete" onclick="deleteImage('${file.name}')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    Excluir Imagem
                                </button>
                            `;
              galleryGrid.appendChild(card);
            });
          }
        } catch (e) {
          console.error("Erro ao carregar galeria:", text);
        }
      });
  };

  loadGallery(); // Carrega assim que a página abre

  // ---------------------------------------------------------
  // 3. FUNÇÃO DE EXCLUIR IMAGEM (DELETA DO SERVIDOR)
  // ---------------------------------------------------------
  window.deleteImage = function (filename) {
    // Alerta de segurança
    if (
      !confirm(
        "🚨 Tem certeza? Se apagar, os e-mails e campanhas que usam esse link vão quebrar a imagem.",
      )
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("token", "bc_agencia_2026_seguro"); // Token de segurança
    formData.append("action", "delete");
    formData.append("filename", filename);

    fetch("upload.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          loadGallery(); // Recarrega a galeria se apagou com sucesso
        } else {
          alert("Erro ao excluir: " + data.message);
        }
      })
      .catch((err) => alert("Falha na conexão ao tentar excluir."));
  };

  // ---------------------------------------------------------
  // 4. UPLOAD DE IMAGEM
  // ---------------------------------------------------------
  function handleUpload(file) {
    uploadText.innerText = "Processando no servidor...";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("token", "bc_agencia_2026_seguro");
    formData.append("action", "upload");

    fetch("upload.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.success) {
            uploadText.innerText = "Sucesso! Arraste outra se precisar.";

            // Monta a URL e abre o Popup
            const finalUrl = getBaseUrl() + data.path;
            abrirModal(finalUrl);

            loadGallery(); // Atualiza a galeria com a foto nova
          } else {
            alert("Aviso: " + data.message);
            uploadText.innerText = "Clique ou Arraste uma imagem aqui";
          }
        } catch (e) {
          alert("ERRO DA HOSPEDAGEM:\n" + text);
          uploadText.innerText = "Falha. Tente novamente.";
        }
      })
      .catch((err) => {
        alert("Falha de conexão com a internet ou servidor.");
        uploadText.innerText = "Clique ou Arraste uma imagem aqui";
      });

    fileInput.value = ""; // Reseta o input de arquivo
  }

  // ---------------------------------------------------------
  // CONTROLES DE ARRASTAR E SOLTAR (DRAG & DROP)
  // ---------------------------------------------------------
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      handleUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleUpload(e.target.files[0]);
    }
  });

  // ---------------------------------------------------------
  // 5. CONTROLES DO POPUP (MODAL)
  // ---------------------------------------------------------
  window.abrirModal = function (url) {
    modalImg.src = url;
    modalUrlInput.value = url;
    imageModal.classList.add("active"); // Mostra o popup
    document.body.style.overflow = "hidden"; // Trava a rolagem da página
  };

  function fecharModal() {
    imageModal.classList.remove("active"); // Esconde o popup
    document.body.style.overflow = "auto"; // Destrava a rolagem
    setTimeout(() => {
      modalImg.src = "";
    }, 300); // Limpa a imagem após a animação
  }

  // Fecha clicando no X
  closeModalBtn.addEventListener("click", fecharModal);

  // Fecha clicando fora da caixa do popup
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) fecharModal();
  });

  // Fecha apertando a tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageModal.classList.contains("active"))
      fecharModal();
  });

  // ---------------------------------------------------------
  // 6. FUNÇÃO UNIVERSAL PARA COPIAR A URL
  // ---------------------------------------------------------
  btnCopyModal.addEventListener("click", function () {
    copyToClipboard(this, modalUrlInput);
  });

  window.copyToClipboard = function (buttonElement, inputElement = null) {
    const input = inputElement || buttonElement.previousElementSibling;

    // Seleciona e copia o texto do input
    input.select();
    input.setSelectionRange(0, 99999); // Suporte para Mobile
    document.execCommand("copy");

    // Feedback visual (fica azul e diz "Copiado!")
    const textoOriginal = buttonElement.innerText;
    buttonElement.innerText = "Copiado!";
    buttonElement.style.background = "#4a90e2";
    buttonElement.style.color = "#fff";
    buttonElement.style.border = "none";

    // Volta ao normal depois de 2 segundos
    setTimeout(() => {
      buttonElement.innerText = textoOriginal;
      buttonElement.style.background = "";
      buttonElement.style.color = "";
      buttonElement.style.border = "";
    }, 2000);
  };
});
