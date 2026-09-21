// Client-side JavaScript for Sana Barekzai's website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sana Barekzai website loaded successfully.');
    
    // Highlight the current page in the navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Contact form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Client-side validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Submit to server
            fetch('/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('There was an error submitting your message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormMessage('There was an error submitting your message. Please try again.', 'error');
            });
        });
    }
    
    // Show form message
    function showFormMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = type;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.className = '';
                messageDiv.textContent = '';
            }, 5000);
        }
    }
    
    // Load images from assets/images directory
    const imagesGallery = document.getElementById('imagesGallery');
    if (imagesGallery) {
        // This would be replaced with actual image loading in a production environment
        // For now, we'll use the placeholder images already in the HTML
        console.log('Images gallery loaded.');
    }
    
    // Load videos from assets/videos directory
    const videosGallery = document.getElementById('videosGallery');
    if (videosGallery) {
        // This would be replaced with actual video loading in a production environment
        // For now, we'll use the placeholder videos already in the HTML
        console.log('Videos gallery loaded.');
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation to sections when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Mobile menu toggle (if needed in the future)
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Console welcome message
    console.log('%c🌟 Sana Barekzai - Personal Website 🌟', 'font-size: 24px; color: #E8D8B3; font-weight: bold;');
    console.log('%cWelcome to my first website project!', 'font-size: 16px; color: #FCA590;');
});
