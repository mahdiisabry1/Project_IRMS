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
    editButton.addEventListener('click', (event) => {
        const internId = event.target.getAttribute('data-id'); // Get the ID attached to the button
        if (internId) {
            // Redirect to CreateRequest form with the ID in the query parameter
            window.location.href = `/CreateRequest/Index?id=${internId}`;
        }
    });
});

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
