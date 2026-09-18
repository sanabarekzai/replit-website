// Client-side JavaScript for the website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully.');
    
    // Add any client-side functionality here
    // For example, you can add event listeners, animations, or dynamic content loading
    
    // Example: Highlight the current page in the navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.backgroundColor = '#777';
        }
    });
});
