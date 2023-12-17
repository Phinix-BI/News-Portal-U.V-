function setupImageUpload(uploadButton, container, error, imageDisplay) {
    const fileHandler = (file, name, type, display) => {
        if (type.split("/")[0] !== "image") {
            error.innerText = "Please upload an image file";
            return false;
        }
        error.innerText = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let imageContainer = document.createElement("figure");
            let img = document.createElement("img");
            img.src = reader.result;
            imageContainer.appendChild(img);
            imageContainer.innerHTML += `<figcaption>${name}<div class="close-icon" onclick="removeImage(this)"><i class="fa-solid fa-xmark"></i></div></figcaption>`;
            display.appendChild(imageContainer);
        };
    };

    uploadButton.addEventListener("change", () => {
        imageDisplay.innerHTML = "";
        Array.from(uploadButton.files).forEach((file) => {
            fileHandler(file, file.name, file.type, imageDisplay);
        });
    });

    container.addEventListener(
        "dragenter",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add("active");
        },
        false
    );

    container.addEventListener(
        "dragleave",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove("active");
        },
        false
    );

    container.addEventListener(
        "dragover",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add("active");
        },
        false
    );

    container.addEventListener(
        "drop",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove("active");
            let draggedData = e.dataTransfer;
            let files = draggedData.files;
            imageDisplay.innerHTML = "";
            Array.from(files).forEach((file) => {
                fileHandler(file, file.name, file.type, imageDisplay);
            });
        },
        false
    );

    window.onload = () => {
        error.innerText = "";
    };
}

function removeImage(closeIcon) {
    let figure = closeIcon.parentNode.parentNode;
    figure.parentNode.removeChild(figure);
}

// Call the function for the first image upload box
setupImageUpload(
    document.getElementById("upload-button"),
    document.querySelector(".container"),
    document.getElementById("error"),
    document.getElementById("image-display")
);

// Call the function for the second image upload box
setupImageUpload(
    document.getElementById("upload-button-other"),
    document.querySelector(".container-other"),
    document.getElementById("error-other"),
    document.getElementById("image-display-other")
);

