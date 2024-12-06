

/*down here dropzonejs*/

Dropzone.options.uploadBox = {
    url: "#", // No server, so use a dummy URL
    autoProcessQueue: false, // Do not send files to a server
    addRemoveLinks: false, // Disable default remove link
    init: function () {
        const previewContainer = document.getElementById("filePreviewContainer");

        // On file added to Dropzone
        this.on("addedfile", function (file) {
            // Create a custom preview element
            const filePreview = document.createElement("div");
            filePreview.className = "uploaded-file";

            filePreview.innerHTML = `
                        <div class="file-info">
                            <span>File:</span> ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                        </div>
                        <i class="fas fa-times-circle remove-icon" title="Remove File"></i>
                    `;

            // Add the preview element to the container
            previewContainer.appendChild(filePreview);

            // Handle remove action
            filePreview.querySelector(".remove-icon").addEventListener("click", () => {
                this.removeFile(file); // Remove file from Dropzone
                filePreview.remove(); // Remove preview element
            });
        });

        // On file removed from Dropzone
        this.on("removedfile", function (file) {
            console.log(`File removed: ${file.name}`);
        });
    },
};

/*end*/
