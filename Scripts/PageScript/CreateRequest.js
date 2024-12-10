// Initialize Dropzone for file upload
Dropzone.options.uploadBox = {
    url: "/CreateRequest/UploadCv",  // Endpoint to send the file
    autoProcessQueue: true,  // Automatically process the file once added
    maxFiles: 1,  // Limit the number of files to 1
    acceptedFiles: ".pdf,.doc,.docx",  // Accept PDF and Word files
    addRemoveLinks: false,  // Disable remove link by default
    init: function () {
        const previewContainer = document.getElementById("filePreviewContainer");

        // Event listener for when a file is added to the Dropzone
        this.on("addedfile", function (file) {
            // Create a custom file preview element
            const filePreview = document.createElement("div");
            filePreview.className = "uploaded-file";

            filePreview.innerHTML = `
                <div class="file-info">
                    <span>File:</span> ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                </div>
                <i class="fas fa-times-circle remove-icon" title="Remove File"></i>
            `;

            // Append the preview element to the preview container
            previewContainer.appendChild(filePreview);

            // Handle file removal
            filePreview.querySelector(".remove-icon").addEventListener("click", (e) => {
                e.preventDefault();
                this.removeFile(file);  // Remove file from Dropzone
                filePreview.remove();  // Remove the preview element
            });
        });

        // Event listener for when a file is removed from Dropzone
        this.on("removedfile", function (file) {
            console.log(`File removed: ${file.name}`);
        });

        // Event listener for when the file is uploaded successfully
        this.on("success", function (file, response) {
            console.log(response);  // Log the response for debugging purposes

            if (response.success) {
                // Auto-fill form fields based on extracted data from the file
                document.getElementById("firstName").value = response.data.firstName || "";
                document.getElementById("lastName").value = response.data.lastName || "";
                document.getElementById("email").value = response.data.email || "";
                document.getElementById("contactNo").value = response.data.contactNo || "";
            } else {
                // Show alert if there is an error in processing the file
                alert(response.message || "Failed to process the file.");
            }
        });

        // Event listener for file upload errors
        this.on("error", function (file, errorMessage) {
            console.log("File upload error:", errorMessage);  // Log error message
            alert("File upload failed: " + errorMessage);  // Show error alert
        });
    }
};

//image upload when click
function previewImage(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        console.log('File selected:', input.files[0]); // Debug log
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log('File loaded:', e.target.result); // Debug log
            const profileImage = document.getElementById('profileImage');
            profileImage.src = e.target.result; // Update the image preview
        };

        reader.readAsDataURL(input.files[0]); // Read the uploaded file
    } else {
        console.log('No file selected'); // Debug log
    }
}

//end

//image changes when change radiobutton
function updateProfileImage() {
    const maleRadio = document.getElementById('male');
    const profileImage = document.getElementById('profileImage');

    // Check which radio button is selected and update the image
    if (maleRadio.checked) {
        profileImage.src = "/Images/Group 1000002769.png?" + new Date().getTime(); // Male image
    } else {
        profileImage.src = "/Images/femaleimg.png?" + new Date().getTime(); // Female image
    }
}


//end