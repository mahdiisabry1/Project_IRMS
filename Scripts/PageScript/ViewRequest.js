// Function to toggle the dropdown VR
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownVR');
    dropdown.classList.toggle('show-dropdown-VR');
}

// Close the dropdown if the user clicks anywhere outside of it
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('dropdownVR');
    const filterButton = document.querySelector('.fas.fa-filter');
    // If the click is outside the dropdown and the filter icon, hide the dropdown
    if (!dropdown.contains(event.target) && event.target !== filterButton) {
        dropdown.classList.remove('show-dropdown-VR');
    }
});

//----------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    // Get all cards and popup elements
    const cards = document.querySelectorAll('.card-details'); // All cards
    const popupOverlay = document.getElementById('popupOverlay'); // Popup overlay
    const closePopup = popupOverlay.querySelector('.close'); // Close button inside popup
    const mainContent = document.querySelector('.content'); // Main content container

    // Function to show popup
    function showPopup(card) {
        // Get data attributes from the clicked card
        const profileID = card.querySelector('.button.view').getAttribute('data-id');
        const profileFirstName = card.querySelector('.button.view').getAttribute('data-firstname');
        const profileLastName = card.querySelector('.button.view').getAttribute('data-lastname');
        const degreeInfo = card.querySelector('.button.view').getAttribute('data-degree');
        const divisionInfo = card.querySelector('.button.view').getAttribute('data-division');
        const universityInfo = card.querySelector('.button.view').getAttribute('data-university');
        const genderInfo = card.querySelector('.button.view').getAttribute('data-gender');
        const emailInfo = card.querySelector('.button.view').getAttribute('data-email');
        const contactInfo = card.querySelector('.button.view').getAttribute('data-contact');
        const internProfileImage = 'data:image/png;base64,' + card.querySelector('.button.view').getAttribute('data-profileimage');
        const base64CV = card.querySelector('.button.view').getAttribute('data-cv');

        // Update the popup details dynamically
        document.getElementById('popupFirstName').textContent = profileFirstName;
        document.getElementById('popupLastName').textContent = profileLastName;
        document.getElementById('popupDivision').textContent = divisionInfo;
        document.getElementById('popupContactNo').textContent = contactInfo;
        document.getElementById('popupDegree').textContent = degreeInfo;
        document.getElementById('popupUniversity').textContent = universityInfo;
        document.getElementById('popupGender').textContent = genderInfo;
        document.getElementById('popupEmail').textContent = emailInfo;
        document.getElementById('popupRefNo').textContent = profileID // Use the intern ID for Ref No
        document.getElementById('popupProfileImage').src = internProfileImage;

        //
        document.getElementById("requestForm").addEventListener("submit", function (event) {
            // Copy values to hidden inputs
            document.getElementById("hiddenID").value = document.getElementById("popupRefNo").innerText.trim();
            document.getElementById("hiddenFirstName").value = document.getElementById("popupFirstName").innerText.trim();
            document.getElementById("hiddenLastName").value = document.getElementById("popupLastName").innerText.trim();
            document.getElementById("hiddenUniversity").value = document.getElementById("popupUniversity").innerText.trim();
            document.getElementById("hiddenGender").value = document.getElementById("popupGender").innerText.trim();
            document.getElementById("hiddenContactNo").value = document.getElementById("popupContactNo").innerText.trim();
            document.getElementById("hiddenEmail").value = document.getElementById("popupEmail").innerText.trim();
            document.getElementById("hiddenDegree").value = document.getElementById("popupDegree").innerText.trim();
            document.getElementById("hiddenProfileImage").value = document.getElementById("popupProfileImage").src;

            document.getElementById("hiddenDivision").value = document.getElementById("popupDivision").innerText.trim();
        });
        document.getElementById('requestForm').addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default form submission

            const viewCVLink = document.getElementById('viewCVLink').getAttribute('href');
            const hiddenCVInput = document.getElementById('hiddenCV');

            try {
                // Fetch the Blob from the Blob URL
                const response = await fetch(viewCVLink);
                const blob = await response.blob();

                // Convert Blob to Base64
                const base64CV = await convertBlobToBase64(blob);
                hiddenCVInput.value = base64CV; // Set Base64 string in hidden input

                // Submit the form after setting the CV data
                e.target.submit();
            } catch (error) {
                console.error('Error converting CV to Base64:', error);
                alert('Failed to process the CV. Please try again.');
            }
        });

        // Helper function: Convert Blob to Base64
        function convertBlobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]); // Extract Base64
                reader.onerror = () => reject("Failed to convert Blob to Base64.");
                reader.readAsDataURL(blob);
            });
        }

        //
        // Convert Base64 to Blob and handle errors
        try {
            const byteCharacters = atob(base64CV); // Decode Base64
            const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobURL = URL.createObjectURL(blob);

            // Set the Blob URL as the href and open in a new tab
            const viewCVLink = document.getElementById('viewCVLink');
            viewCVLink.setAttribute('href', blobURL); // Use Blob URL
            viewCVLink.setAttribute('target', '_blank'); // Open in a new tab
        } catch (error) {
            console.error("Failed to process the Base64 CV data:", error);
            alert("Invalid CV data. Please try again.");
        }


        popupOverlay.style.display = 'flex'; // Show popup
        mainContent.classList.add('blurred'); // Add blur to main content
    }

    // Function to hide popup
    function hidePopup() {
        popupOverlay.style.display = 'none'; // Hide popup
        mainContent.classList.remove('blurred'); // Remove blur
    }

    // Add click event to each "View" button inside each card
    cards.forEach(card => {
        const viewButton = card.querySelector('.button.view');
        viewButton.addEventListener('click', () => {
            showPopup(card); // Show popup for the current card
        });
    });

    // Add click event to close popup
    closePopup.addEventListener('click', hidePopup);

    // Close popup when clicking outside the card
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });
});


// Add click event to "Edit" button (You may need to update this with actual functionality)
document.querySelectorAll('.button.edit').forEach(editButton => {
    editButton.addEventListener('click', function () {
        //const internID = this.getAttribute('data-id');
        const firstName = this.getAttribute('data-firstname');
        const lastName = this.getAttribute('data-lastname');
        const degree = this.getAttribute('data-degree');
        const university = this.getAttribute('data-university');
        const gender = this.getAttribute('data-gender');
        const division = this.getAttribute('data-division');
        const email = this.getAttribute('data-email');
        const contact = this.getAttribute('data-contact');
        const profileImage = this.getAttribute('data-profileimage');

        // Update modal content
        document.getElementById('popupProfileImage').src = profileImage ? `data:image/png;base64,${profileImage}` : 'https://placehold.co/115x117';
        document.getElementById('firstName').value = firstName || '';
        document.getElementById('lastName').value = lastName || '';
        document.getElementById('degree').value = degree || '';
        document.getElementById('university').value = university || '';
        document.getElementById('division').value = division || '';
        document.getElementById('email').value = email || '';
        document.getElementById('contactNo').value = contact || '';
        if (gender === 'Male') {
            document.getElementById('male').checked = true;
        } else if (gender === 'Female') {
            document.getElementById('female').checked = true;
        }

        // Show the modal
        document.getElementById('popupOverlayUpdate').style.display = 'block';
    });
});

// Close the popup
function closePopup() {
    const popupOverlay = document.getElementById('popupOverlayUpdate');
    if (popupOverlay) {
        popupOverlay.style.display = 'none'; // Hide the popup
    }
}

//for cv view 
// Function to dynamically set CV URL and ensure it opens in a new tab
//document.getElementById('viewCVLink').addEventListener('click', function (event) {
//    event.preventDefault(); // Prevent the default behavior

//    const internCV = this.getAttribute('viewCVLink'); // Fetch the href (CV URL) dynamically
//    if (internCV) {
//        const link = document.createElement('a'); // Create a new anchor element
//        link.href = internCV; // Set the href to the CV URL
//        link.target = '_blank'; // Open the link in a new tab
//        link.rel = 'noopener noreferrer'; // Enhance security by preventing tab hijacking
//        link.click(); // Programmatically click the link
//    } else {
//        alert("No CV available to view.");
//    }
//});

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