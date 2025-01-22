// Store the uploaded CV bytes globally for later use in form submission
let cvBytes = null;

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

        // Event listener for when a file is uploaded successfully
        this.on("success", function (file, response) {
            console.log(response);  // Log the response for debugging purposes

            if (response.success) {
                // Store cvBytes globally (as Base64)
                cvBytes = response.cvBytes;  // Assuming response.cvBytes is already Base64 encoded.

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

// Image upload preview
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

// Change profile image based on radio button selection
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


// Submit the form with CV bytes
function submitForm() {

    const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        university: document.getElementById("university").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        email: document.getElementById("email").value,
        contactNo: document.getElementById("contactNo").value,
        degree: document.getElementById("degree").value,
        division: document.getElementById("division").value,
        cvBytes: cvBytes // Include the cvBytes
    };

    

    // Send form data via AJAX
    $.ajax({
        url: "/CreateRequest/SubmitRequest",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
   

            if (response.success) {
                alert("Request submitted successfully!");
            } else {
                alert(response.message || "Failed to submit the request.");
            }
        },
        error: function (xhr, status, error) {
            alert("Error submitting the form: " + error);
        }
    });

}

function validateForm() {
    const cvUpload = document.getElementById('cvUpload');
    const formMessage = document.getElementById('formMessage');

    // chack if the cv is uploaded
    if (!cvUpload.files.length) {
        formMessage.textContent = 'Please upload your CV before submitting'
        return false;
    }

    // clear the message if validation passes
    formMessage.textContent = '';
    return true;
}

const universities = [
    "University of Colombo",
    "University of Peradeniya",
    "University of Kelaniya",
    "University of Sri Jayewardenepura",
    "University of Moratuwa",
    "University of Jaffna",
    "University of Ruhuna",
    "Eastern University, Sri Lanka",
    "South Eastern University of Sri Lanka",
    "Rajarata University of Sri Lanka",
    "Sabaragamuwa University of Sri Lanka",
    "Wayamba University of Sri Lanka",
    "Uva Wellassa University",
    "University of the Visual and Performing Arts",
    "Open University of Sri Lanka (OUSL)",
    "Gampaha Wickramarachchi University of Indigenous Medicine",
    "Vavuniya University",
    "Sri Lanka Institute of Information Technology (SLIIT)",
    "National School of Business Management (NSBM) Green University",
    "Horizon Campus",
    "South Asian Institute of Technology and Medicine (SAITM)",
    "Colombo International Nautical and Engineering College (CINEC)",
    "Aquinas College of Higher Studies",
    "Institute of Technological Studies",
    "KAATSU International University",
    "National Institute of Business Management (NIBM)",
    "National Institute of Social Development",
    "SANASA Campus",
    "Sri Lanka Institute of Development Administration (SLIDA)",
    "Sri Lanka Institute of Nanotechnology (SLINTEC)",
    "Sri Lanka International Buddhist Academy (SIBA)",
    "Esoft Metro Campus",
    "International College of Business and Technology (ICBT)",
    "SLTC Research University",
    "Business Management School (BMS)",
    "Royal Institute Colombo",
    "International Institute of Health Science (IIHS)",
    "Benedict XVI Catholic Institute of Higher Education",
    "Institute of Chemistry Ceylon",
    "Informatics Institute of Technology (IIT)",
    "NSBM Green University",
    "Asia Pacific Institute of Information Technology (APIIT)"
];

const searchInput = document.querySelector(".searchInput");
const dropdownList = document.getElementById("dropdownList");

console.log(searchInput)

// Function to match from the start of each word
function matchesQuery(word, query) {
    const regex = new RegExp(`\\b${query}`, "i"); // Match query at word boundaries (case-insensitive)
    return regex.test(word);
}

// Show filtered suggestions
searchInput.addEventListener("input", function () {
    const query = this.value.trim(); // Trim spaces
    dropdownList.innerHTML = ""; // Clear previous suggestions

    if (query) {
        const filteredUniversities = universities.filter(uni => matchesQuery(uni, query));

        filteredUniversities.forEach(uni => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = uni;

            listItem.addEventListener("click", () => {
                searchInput.value = uni; // Set selected value
                dropdownList.style.display = "none"; // Hide dropdown
            });

            dropdownList.appendChild(listItem);
        });

        dropdownList.style.display = filteredUniversities.length > 0 ? "block" : "none";
    } else {
        dropdownList.style.display = "none";
    }
});

// Hide dropdown when clicking outside
document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !dropdownList.contains(e.target)) {
        dropdownList.style.display = "none";
    }
});


