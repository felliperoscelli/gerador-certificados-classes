document.addEventListener("DOMContentLoaded", () => {
    const certificatesContainer = document.getElementById("certificatesContainer");
    const classSelector = document.getElementById("classSelector");
    const clubNameInput = document.getElementById("clubName");
    const downloadZipButton = document.getElementById("downloadZip");
    const fontSelector = document.getElementById("fontSelector");
    const fontSizeSelector = document.getElementById("fontSizeSelector");
    const fontPreviewText = document.getElementById("fontPreviewText");
    const namesList = document.getElementById("namesList");
    const imagePreviewCanvas = document.getElementById("imagePreviewCanvas");
    let certificadosSVG = [];
    let selectedFont = fontSelector.value;
    let selectedFontSize = parseInt(fontSizeSelector.value, 10);

    // Atualizar prévia da fonte
    function updateFontPreview() {
        fontPreviewText.style.fontFamily = selectedFont;
        fontPreviewText.style.fontSize = `${selectedFontSize}px`;
    }

    // Listener para mudança de fonte
    fontSelector.addEventListener("change", () => {
        selectedFont = fontSelector.value;
        updateFontPreview();
    });

    // Listener para mudança de tamanho
    fontSizeSelector.addEventListener("input", () => {
        selectedFontSize = parseInt(fontSizeSelector.value, 10);
        updateFontPreview();
    });

    // Atualizar prévia da imagem
    classSelector.addEventListener("change", () => {
        const canvas = imagePreviewCanvas;
        const ctx = canvas.getContext("2d");
        const selectedClassImage = classSelector.value;

        const img = new Image();
        img.onload = () => {
            canvas.width = 400;
            canvas.height = (img.height / img.width) * 400;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(clubNameInput.value || "Clube de Exemplo", canvas.width / 2, canvas.height - 20);
        };
        img.src = `./certificates/${selectedClassImage}`;
    });

    // Gerar certificados
    document.getElementById("certificateForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const names = namesList.value.trim().split("\n").filter((name) => name);
        if (!classSelector.value) {
            alert("Por favor, selecione uma classe.");
            return;
        }

        if (names.length === 0) {
            alert("Por favor, insira pelo menos um nome.");
            return;
        }

        certificatesContainer.innerHTML = ""; // Limpar certificados anteriores
        certificadosSVG = []; // Limpar lista de certificados

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
                ctx.font = "20px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText(clubNameInput.value, canvas.width / 2, canvas.height - 50);

                // Nome do participante
                ctx.font = `${selectedFontSize}px ${selectedFont}`;
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);

                // Adicionar ao contêiner
                const certificateImg = document.createElement("img");
                certificateImg.src = canvas.toDataURL("image/png");
                certificateImg.alt = `Certificado - ${name}`;
                certificatesContainer.appendChild(certificateImg);

                // Adicionar ao ZIP
                certificadosSVG.push({
                    name: name,
                    data: canvas.toDataURL("image/png"),
                });
            };

            img.src = `certificates/${classSelector.value}`;
        });
    });

    // Baixar ZIP
    downloadZipButton.addEventListener("click", () => {
        if (certificadosSVG.length === 0) {
            alert("Nenhum certificado para baixar.");
            return;
        }

        const zip = new JSZip();
        certificadosSVG.forEach((certificado, index) => {
            const data = certificado.data.split(",")[1];
            zip.file(`certificado_${index + 1}.png`, data, { base64: true });
       ... (adicionando continuidade).

```javascript
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "certificados.zip");
        });
    });

    // Atualizar prévia inicial
    updateFontPreview();
});
