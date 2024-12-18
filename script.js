document.addEventListener("DOMContentLoaded", () => {
    const classSelector = document.getElementById("classSelector");
    const clubNameInput = document.getElementById("clubName");
    const namesList = document.getElementById("namesList");
    const fontSelector = document.getElementById("fontSelector");
    const fontSizeSelector = document.getElementById("fontSizeSelector");
    const fontPreviewText = document.getElementById("fontPreviewText");
    const imagePreviewCanvas = document.getElementById("imagePreviewCanvas");
    const certificatesContainer = document.getElementById("certificatesContainer");
    const downloadZipButton = document.getElementById("downloadZip");

    const baseURL = "certificates/";
    let selectedClassImage = "";
    let selectedFont = fontSelector.value;
    let selectedFontSize = parseInt(fontSizeSelector.value, 10);

    // Atualizar prévia da fonte no canvas
    function updateFontPreviewOnCanvas() {
        const ctx = imagePreviewCanvas.getContext("2d");
        if (!ctx) {
            console.error("Contexto do canvas não encontrado!");
            return;
        }

        // Limpar o canvas antes de redesenhar
        ctx.clearRect(0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height);

        // Redesenhar a imagem do certificado na prévia
        if (selectedClassImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height);

                // Adicionar o exemplo do nome na prévia
                ctx.font = `${selectedFontSize}px ${selectedFont}`;
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText("Exemplo do Nome", imagePreviewCanvas.width / 2, imagePreviewCanvas.height / 2);
            };
            img.src = selectedClassImage;
        } else {
            console.warn("Nenhuma imagem de classe selecionada.");
        }
    }

    // Atualizar a prévia da imagem
    function updatePreviewImage(className) {
        const fileName = className.toLowerCase().replace(/ /g, "_");
        const imageURL = `${baseURL}${fileName}`;
        const img = new Image();
        img.onload = () => {
            imagePreviewCanvas.width = img.width;
            imagePreviewCanvas.height = img.height;
            selectedClassImage = imageURL;
            updateFontPreviewOnCanvas(); // Atualizar prévia da fonte no canvas
            console.log("Imagem carregada:", imageURL);
        };
        img.onerror = () => console.error("Erro ao carregar a imagem:", imageURL);
        img.src = imageURL;
    }

    // Atualizar prévia ao mudar a fonte
    function updateFontPreview() {
        selectedFont = fontSelector.value;
        selectedFontSize = parseInt(fontSizeSelector.value, 10);
        updateFontPreviewOnCanvas(); // Redesenhar a prévia no canvas
    }

    // Listeners para alterações na fonte ou na classe
    fontSelector.addEventListener("change", updateFontPreview);
    fontSizeSelector.addEventListener("input", updateFontPreview);
    classSelector.addEventListener("change", () => {
        const selectedClass = classSelector.value;
        if (selectedClass) {
            updatePreviewImage(selectedClass);
        }
    });

    // Gerar certificados
    document.getElementById("certificateForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const clubName = clubNameInput.value.trim();
        const names = namesList.value.trim().split("\n").filter((name) => name);

        if (!selectedClassImage) {
            alert("Por favor, selecione uma classe.");
            return;
        }

        if (!clubName) {
            alert("Por favor, insira o nome do clube.");
            return;
        }

        if (names.length === 0) {
            alert("Por favor, insira pelo menos um nome.");
            return;
        }

        certificatesContainer.innerHTML = ""; // Limpar certificados anteriores

        names.forEach((name) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                canvas.width = 800;
                canvas.height = 600;

                // Desenhar o modelo do certificado
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Nome do clube
                ctx.font = "24px Times New Roman";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText(clubName, canvas.width / 2, (3 / 4) * canvas.height);

                // Adicionar o nome
                ctx.font = `${selectedFontSize}px ${selectedFont}`;
                ctx.fillStyle = "black";
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);

                // Adicionar ao contêiner
                const certificateImg = document.createElement("img");
                certificateImg.src = canvas.toDataURL("image/png");
                certificateImg.alt = `Certificado - ${name}`;
                certificateImg.style.width = "100%";
                certificateImg.style.maxWidth = "800px";
                certificateImg.style.margin = "10px 0";

                certificatesContainer.appendChild(certificateImg);
            };

            img.src = selectedClassImage;
        });
    });

    // Inicializar prévia
    updateFontPreviewOnCanvas();
});
