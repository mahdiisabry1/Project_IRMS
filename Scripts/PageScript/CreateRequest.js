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

document.getElementById('myForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission (page refresh)

    // Validate form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const contactNo = document.getElementById('contactNo').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const university = document.getElementById('university').value.trim();
    const cvFile = document.getElementById('cvUpload').files[0];

    let isValid = true;
    let errorMessage = '';

    // Check if all required fields are filled
    if (!firstName || !lastName || !email || !contactNo || !degree || !university || !gender) {
        isValid = false;
        errorMessage = 'Please fill in all required fields.';
    } else if (!validateEmail(email)) {
        isValid = false;
        errorMessage = 'Invalid email address.';
    } else if (!cvFile) {
        isValid = false;
        errorMessage = 'Please upload a CV.';
    } else if (!validateCV(cvFile)) {
        isValid = false;
        errorMessage = 'Invalid CV file type. Only .pdf, .docx, .doc, and .txt are allowed.';
    }

    if (isValid) {
        document.getElementById('formMessage').innerHTML = ''; // Clear any previous error message
        submitForm(); // Call the function to submit the form
    } else {
        document.getElementById('formMessage').innerHTML = `<p class="text-danger">${errorMessage}</p>`;
    }
});

// Validate Email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate CV File
function validateCV(file) {
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
}

document.getElementById('successDiv').style.display = 'none';

function submitForm() {
    const formData = new FormData(document.getElementById('myForm'));

    // Store the CV and image values
    const cvFile = document.getElementById('cvUpload').files[0];
    const profileImage = document.getElementById('imageUpload').files[0];

    // AJAX submission
    $.ajax({
        url: '/CreateRequest/SubmitRequest',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            document.getElementById('errorDiv').style.display = 'none';
            document.getElementById('successDiv').style.display = 'block';

            // Clear the form including for CV and image
            document.getElementById('myForm').reset();

            // Manually clear file inputs
            document.getElementById('cvUpload').value = '';
            document.getElementById('imageUpload').value = '';

            // Reset profile image preview
            const profilePreview = document.getElementById('profileImage');
            profilePreview.src = "~/Images/Group 1000002769.png"; // Reset to default image

            // Clear CV file preview
            const filePreviewContainer = document.getElementById('filePreviewContainer');
            filePreviewContainer.innerHTML = ''; // Clear any preview content

            // Clear validation states
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            document.getElementById('formMessage').innerHTML = '';

            // Start the countdown timer
            let countdown = 5;
            const countdownElement = document.createElement('p');
            countdownElement.id = 'countdown';
            countdownElement.innerHTML = `Closing in ${countdown} seconds...`;
            successDiv.appendChild(countdownElement);

            const timer = setInterval(() => {
                countdown--;
                countdownElement.innerHTML = `Closing in ${countdown} seconds...`;

                if (countdown <= 0) {
                    clearInterval(timer);
                    successDiv.style.display = 'none';
                    successDiv.removeChild(countdownElement); // Remove the countdown element
                }
            }, 1000); // Update every second
        },
        error: function (xhr, status, error) {
            document.getElementById('successDiv').style.display = 'none';
            document.getElementById('errorDiv').innerHTML = '<p>Error: ' + error + '</p>';
            document.getElementById('errorDiv').style.display = 'block';
        }
    });
}

// Select the "Later" button
const laterButton = document.getElementById("laterButton");
// Select the successDiv
const successDiv = document.getElementById("successDiv");

// Add an event listener to hide the successDiv on button click
laterButton.addEventListener("click", () => {
    successDiv.style.display = "none";
});

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


// Function to update degreeName input and degree input
function updateDegreeName() {
    var degreeType = document.getElementById('degreeType').value;
    var degreeName = document.getElementById('degreeName').value;

    // Combine degreeType and degreeName
    if (degreeType && degreeName) {
        var concatenatedDegree = degreeType + '. ' + degreeName;


        // Update degree input
        document.getElementById('degree').value = concatenatedDegree;
    }
}
// Event listeners for changes
document.getElementById('degreeType').addEventListener('change', updateDegreeName);
document.getElementById('degreeName').addEventListener('input', updateDegreeName);

