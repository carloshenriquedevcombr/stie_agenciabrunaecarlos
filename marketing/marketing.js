document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const uploadText = document.getElementById("upload-text");
  const galleryGrid = document.getElementById("gallery-grid");
  const imageModal = document.getElementById("image-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalImg = document.getElementById("modal-img");
  const modalUrlInput = document.getElementById("modal-url");
  const btnCopyModal = document.getElementById("btn-copy-modal");

  function getBaseUrl() {
    let path = window.location.origin + window.location.pathname;
    if (path.endsWith(".html"))
      path = path.substring(0, path.lastIndexOf("/") + 1);
    if (!path.endsWith("/")) path += "/";
    return path;
  }

  function loadGallery() {
    fetch("upload.php?action=list")
      .then((res) => res.text()) // Lemos como texto puro primeiro para caçar erros
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.success) {
            galleryGrid.innerHTML = "";
            data.files.forEach((file) => {
              const fullUrl = getBaseUrl() + file.path;
              const card = document.createElement("div");
              card.className = "gallery-card";
              card.innerHTML = `
                                <img src="${fullUrl}" alt="${file.name}" onclick="abrirModal('${fullUrl}')" title="Clique para ampliar">
                                <div class="url-box">
                                    <input type="text" class="url-input" value="${fullUrl}" readonly>
                                    <button class="btn btn-copy-gallery" onclick="copyToClipboard(this)">Copiar</button>
                                </div>
                            `;
              galleryGrid.appendChild(card);
            });
          }
        } catch (e) {
          console.error(
            "Erro ao carregar galeria. Resposta do servidor:",
            text,
          );
        }
      });
  }

  loadGallery();

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
      .then((response) => response.text()) // Pega o texto cru da HostGator
      .then((text) => {
        try {
          // Tenta transformar em JSON
          const data = JSON.parse(text);

          if (data.success) {
            uploadText.innerText = "Sucesso! Arraste outra se precisar.";
            const finalUrl = getBaseUrl() + data.path;
            abrirModal(finalUrl);
            loadGallery();
          } else {
            alert("Aviso: " + data.message);
            uploadText.innerText = "Clique ou Arraste uma imagem aqui";
          }
        } catch (e) {
          // SE CAIR AQUI, A HOSTGATOR DEU ERRO! Vamos exibir na tela.
          alert(
            "ERRO DA HOSPEDAGEM: A HostGator devolveu este erro: \n\n" + text,
          );
          uploadText.innerText = "Falha. Tente novamente.";
          console.error("Texto cru devolvido pelo PHP:", text);
        }
      })
      .catch((err) => {
        alert("Falha de conexão com a internet ou servidor.");
        uploadText.innerText = "Clique ou Arraste uma imagem aqui";
      });

    fileInput.value = "";
  }

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", () =>
    dropZone.classList.remove("dragover"),
  );
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) handleUpload(e.target.files[0]);
  });

  window.abrirModal = function (url) {
    modalImg.src = url;
    modalUrlInput.value = url;
    imageModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function fecharModal() {
    imageModal.classList.remove("active");
    document.body.style.overflow = "auto";
    setTimeout(() => {
      modalImg.src = "";
    }, 300);
  }

  closeModalBtn.addEventListener("click", fecharModal);
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) fecharModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageModal.classList.contains("active"))
      fecharModal();
  });

  btnCopyModal.addEventListener("click", function () {
    copyToClipboard(this, modalUrlInput);
  });

  window.copyToClipboard = function (buttonElement, inputElement = null) {
    const input = inputElement || buttonElement.previousElementSibling;
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");

    const textoOriginal = buttonElement.innerText;
    buttonElement.innerText = "Copiado!";
    buttonElement.style.background = "#4a90e2";
    buttonElement.style.color = "#fff";

    setTimeout(() => {
      buttonElement.innerText = textoOriginal;
      buttonElement.style.background = "";
      buttonElement.style.color = "";
    }, 2000);
  };
});
