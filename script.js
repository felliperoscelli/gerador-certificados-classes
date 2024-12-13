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

    // Atualizar prévia da fonte
    function updateFontPreview() {
        fontPreviewText.style.fontFamily = selectedFont;
        fontPreviewText.style.fontSize = `${selectedFontSize}px`;
        fontPreviewText.innerText = "Exemplo do Nome";
    }

    // Atualizar prévia da imagem do certificado
    function updatePreviewImage(className) {
        const imageURL = `${baseURL}${className.toLowerCase().replace(/ /g, "_")}`;
        selectedClassImage = imageURL;
        imagePreviewCanvas.src = imageURL;
        imagePreviewCanvas.alt = `Certificado - ${className}`;
        console.log("URL da imagem carregada:", imageURL);
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

                // Adicionar o nome do clube
                ctx.font = "30px Arial";
                ctx.fillStyle = "blue";
                ctx.textAlign = "center";
                ctx.fillText(clubName, canvas.width / 2, canvas.height / 1.1);

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

    // Baixar todos os certificados em ZIP
    downloadZipButton.addEventListener("click", () => {
        const zip = new JSZip();

        const images = certificatesContainer.querySelectorAll("img");
        if (images.length === 0) {
            alert("Nenhum certificado para baixar. Por favor, gere os certificados primeiro.");
            return;
        }

        images.forEach((img, index) => {
            const data = img.src.split(",")[1]; // Apenas a parte base64
            zip.file(`certificado_${index + 1}.png`, data, { base64: true });
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "certificados.zip");
        });
    });

    // Inicializar prévia da fonte
    updateFontPreview();
});
