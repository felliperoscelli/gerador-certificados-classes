document.addEventListener("DOMContentLoaded", () => {
    const classSelector = document.getElementById("classSelector");
    const clubNameInput = document.getElementById("clubName");
    const certificateDateInput = document.getElementById("certificateDate");
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

    // Atualizar prévia da fonte
    function updateFontPreview() {
        fontPreviewText.style.fontFamily = selectedFont;
        fontPreviewText.style.fontSize = `${selectedFontSize}px`;
        fontPreviewText.innerText = "Exemplo do Nome";
    }

    // Atualizar prévia da imagem do certificado
    function updatePreviewImage(className) {
        const ctx = imagePreviewCanvas.getContext("2d");

        if (!imagePreviewCanvas || !ctx) {
            console.error("Canvas ou contexto de desenho não encontrado!");
            return;
        }

        const fileName = className.toLowerCase().replace(/ /g, "_");
        const imageURL = `${baseURL}${fileName}.png`;

        const img = new Image();
        img.onload = () => {
            imagePreviewCanvas.width = img.width;
            imagePreviewCanvas.height = img.height;
            ctx.clearRect(0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height);
            ctx.drawImage(img, 0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height);

            // Exemplo do nome na prévia
            ctx.font = `${selectedFontSize}px ${selectedFont}`;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Exemplo do Nome", imagePreviewCanvas.width / 2, imagePreviewCanvas.height / 2);

            console.log("Imagem carregada no canvas:", imageURL);
        };

        img.onerror = () => {
            console.error("Erro ao carregar a imagem:", imageURL);
        };

        img.src = imageURL;
        selectedClassImage = imageURL;
    }

    // Listener para mudança de classe
    classSelector.addEventListener("change", () => {
        const selectedClass = classSelector.value;
        if (selectedClass) {
            updatePreviewImage(selectedClass);
        }
    });

    // Listener para mudança de fonte
    fontSelector.addEventListener("change", () => {
        selectedFont = fontSelector.value;
        updateFontPreview();
    });

    // Listener para mudança de tamanho da fonte
    fontSizeSelector.addEventListener("input", () => {
        selectedFontSize = parseInt(fontSizeSelector.value, 10);
        updateFontPreview();
    });

    // Gerar certificados
    document.getElementById("certificateForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const clubName = clubNameInput.value.trim();
        const certificateDate = certificateDateInput.value.trim();
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

                // Data do certificado
                ctx.font = "20px Times New Roman";
                ctx.fillStyle = "black";
                ctx.fillText(certificateDate, canvas.width / 2, (3 / 4) * canvas.height + 30);

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

    // Inicializar prévia da fonte
    updateFontPreview();
});
