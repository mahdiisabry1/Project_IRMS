document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.pathname; // Get the current page URL path
    const navLinks = document.querySelectorAll(".nav-link"); // Select all navigation links

    // Loop through each link to set the active state on page load
    navLinks.forEach(link => {
        // Check if the link's href matches the current URL
        if (link.getAttribute("href") && currentUrl.includes(link.getAttribute("href"))) {
            link.classList.add("active"); // Add the active class to the matched link
        }

        // Add click event listener to each link
        link.addEventListener('click', function () {
            // Remove the 'clicked' class from all links
            navLinks.forEach(item => item.classList.remove('clicked'));

            // Add the 'clicked' class to the clicked link
            link.classList.add('clicked');

            // Ensure the active state is also set
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    // Find the Requests dropdown
    const requestsDropdown = document.querySelector('#Request > .nav-link');
    const requestsParent = document.querySelector('#Request');
    const requestsSubmenu = document.querySelector('#Request .nav-treeview');

    // Function to handle navigation
    function handleNavigation(e) {
        e.preventDefault(); // Prevent default link behavior

        // Get the target URL
        const targetUrl = this.getAttribute('href');

        // Use AJAX to load content
        fetch(targetUrl)
            .then(response => response.text())
            .then(html => {
                // Update the content wrapper with the fetched HTML
                const contentWrapper = document.querySelector('.content-wrapper');
                if (contentWrapper) {
                    contentWrapper.innerHTML = html;
                }

                // Update browser URL without reloading
                history.pushState(null, '', targetUrl);

                // Update active states
                navLinks.forEach(link => {
                    link.classList.remove('active', 'clicked');
                });
                this.classList.add('active', 'clicked');
            })
            .catch(error => {
                console.error('Navigation error:', error);
                // Fallback to normal navigation if AJAX fails
                window.location.href = targetUrl;
            });
    }

    // Function to toggle dropdown
    function toggleDropdown(e) {
        e.stopPropagation();

        if (requestsParent) {
            requestsParent.classList.toggle('menu-open');

            // Toggle submenu visibility
            if (requestsSubmenu) {
                requestsSubmenu.style.display = requestsParent.classList.contains('menu-open') ? 'block' : 'none';
            }

            // Toggle arrow icon
            const angleIcon = requestsDropdown.querySelector('.right');
            if (angleIcon) {
                angleIcon.classList.toggle('fa-angle-left');
                angleIcon.classList.toggle('fa-angle-down');
            }
        }
    }

    // Add navigation event listeners to appropriate links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Only add handler to links with valid URLs (excluding dropdown and external links)
        if (href && href !== '#' && !href.startsWith('http')) {
            link.addEventListener('click', handleNavigation);
        }
    });

    // Dropdown toggle event
    if (requestsDropdown) {
        requestsDropdown.addEventListener('click', toggleDropdown);
    }

    // Prevent dropdown from closing when clicking submenu items
    function preventDropdownClose(e) {
        e.stopPropagation();

        if (requestsParent) {
            requestsParent.classList.add('menu-open');

            // Ensure submenu is visible
            if (requestsSubmenu) {
                requestsSubmenu.style.display = 'block';
            }

            // Ensure arrow is pointing down
            const angleIcon = requestsDropdown.querySelector('.right');
            if (angleIcon) {
                angleIcon.classList.remove('fa-angle-left');
                angleIcon.classList.add('fa-angle-down');
            }
        }
    }

    // Find the submenu items
    const createReqItem = document.querySelector('#Request li:nth-child(1)');
    const viewReqItem = document.querySelector('#Request li:nth-child(2)');

    // Add event listeners to submenu items
    if (createReqItem) {
        createReqItem.addEventListener('click', function (e) {
            preventDropdownClose(e);

            // Get the target URL
            const targetUrl = this.getAttribute('data-href') || this.querySelector('a').getAttribute('href');

            // Use AJAX to load content
            fetch(targetUrl)
                .then(response => response.text())
                .then(html => {
                    // Update the content wrapper with the fetched HTML
                    const contentWrapper = document.querySelector('.content-wrapper');
                    if (contentWrapper) {
                        contentWrapper.innerHTML = html;
                    }

                    // Update browser URL without reloading
                    history.pushState(null, '', targetUrl);
                })
                .catch(error => {
                    console.error('Navigation error:', error);
                    // Fallback to normal navigation if AJAX fails
                    window.location.href = targetUrl;
                });
        });
    }

    if (viewReqItem) {
        viewReqItem.addEventListener('click', function (e) {
            preventDropdownClose(e);

            // Get the target URL
            const targetUrl = this.getAttribute('data-href') || this.querySelector('a').getAttribute('href');

            // Use AJAX to load content
            fetch(targetUrl)
                .then(response => response.text())
                .then(html => {
                    // Update the content wrapper with the fetched HTML
                    const contentWrapper = document.querySelector('.content-wrapper');
                    if (contentWrapper) {
                        contentWrapper.innerHTML = html;
                    }

                    // Update browser URL without reloading
                    history.pushState(null, '', targetUrl);
                })
                .catch(error => {
                    console.error('Navigation error:', error);
                    // Fallback to normal navigation if AJAX fails
                    window.location.href = targetUrl;
                });
        });
    }

    // Automatically open Requests dropdown if on Create or View Requests page
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('/createrequest') || currentPath.includes('/viewrequest')) {
        if (requestsParent) {
            requestsParent.classList.add('menu-open');

            // Ensure submenu is visible
            if (requestsSubmenu) {
                requestsSubmenu.style.display = 'block';
            }

            // Ensure arrow is pointing down
            const angleIcon = requestsDropdown.querySelector('.right');
            if (angleIcon) {
                angleIcon.classList.remove('fa-angle-left');
                angleIcon.classList.add('fa-angle-down');
            }
        }
    }
});