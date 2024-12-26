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
        const profileName = card.querySelector('.button.view').getAttribute('data-firstname') + ' ' + card.querySelector('.button.view').getAttribute('data-lastname');
        const degreeInfo = card.querySelector('.button.view').getAttribute('data-degree');
        const divisionInfo = card.querySelector('.button.view').getAttribute('data-division');
        const universityInfo = card.querySelector('.button.view').getAttribute('data-university');
        const emailInfo = card.querySelector('.button.view').getAttribute('data-email');
        const contactInfo = card.querySelector('.button.view').getAttribute('data-contact');
        const internProfileImage = 'data:image/png;base64,' + card.querySelector('.button.view').getAttribute('data-profileimage');
        const base64CV = card.querySelector('.button.view').getAttribute('data-cv');

        // Update the popup details dynamically
        document.getElementById('popupName').textContent = profileName;
        document.getElementById('popupDivision').textContent = divisionInfo;
        document.getElementById('popupContactNo').textContent = contactInfo;
        document.getElementById('popupDegree').textContent = degreeInfo;
        document.getElementById('popupUniversity').textContent = universityInfo;
        document.getElementById('popupEmail').textContent = emailInfo;
        document.getElementById('popupRefNo').textContent = `Ref No - ${card.querySelector('.button.view').getAttribute('data-id')}`; // Use the intern ID for Ref No
        document.getElementById('popupProfileImage').src = internProfileImage;

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
