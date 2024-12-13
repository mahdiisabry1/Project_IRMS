
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
    const cards = document.querySelectorAll('.card'); // All cards
    const popupOverlay = document.getElementById('popupOverlay'); // Popup overlay
    const closePopup = popupOverlay.querySelector('.close'); // Close button inside popup
    const mainContent = document.querySelector('.Box'); // Main content container

    // Function to show popup
    function showPopup(card) {
        const profileName = card.querySelector('h2').textContent;
        const degreeInfo = card.querySelector('p').textContent;

        // Update the popup details dynamically
        popupOverlay.querySelector('.profile-info h3').textContent = profileName;
        popupOverlay.querySelector('.profile-info p').textContent = degreeInfo;

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

// Add click event to "Edit" button
editButton.addEventListener('click', () => {
    const internId = editButton.getAttribute('data-id'); // Get the ID attached to the button
    if (internId) {
        // Redirect to CreateRequest form with the ID in the query parameter
        window.location.href = `/CreateRequest/Index?id=${internId}`;
    }
});
