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