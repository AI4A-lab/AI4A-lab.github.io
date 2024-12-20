document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const contactSection = document.querySelector('.contact-section');

    // Function to set theme and background
    function setTheme(isDarkMode) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        updateThemeIcon(isDarkMode);
        
        // Update background image immediately
        if (contactSection) {
            contactSection.style.backgroundImage = isDarkMode 
                ? 'url("/images/contact/ai4adome_nightnight.jpg")' 
                : 'url("/images/contact/ai4adome.jpg")';
        }
        
        // Save theme preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDarkMode = savedTheme === 'dark';

    // Apply theme immediately on load
    setTheme(isDarkMode);

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const newIsDarkMode = !document.body.classList.contains('dark-mode');
        setTheme(newIsDarkMode);
    });

    function updateThemeIcon(isDarkMode) {
        themeIcon.classList.remove(isDarkMode ? 'fa-sun' : 'fa-moon');
        themeIcon.classList.add(isDarkMode ? 'fa-moon' : 'fa-sun');
    }
});

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

// Fade in map on load
window.addEventListener('load', () => {
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe) {
        mapIframe.style.opacity = '1';
    }
});