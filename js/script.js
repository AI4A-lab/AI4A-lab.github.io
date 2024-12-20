const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Always start in dark mode
body.classList.add('dark-mode');
themeIcon.classList.replace('fa-sun', 'fa-moon');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');
});

// Check localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Search functionality (commented out)
// const searchInput = document.getElementById('projectSearch');
// const projectCarousel = document.querySelector('.project-carousel');

// searchInput.addEventListener('input', function () {
//     const query = this.value.toLowerCase();
//     const projectCards = projectCarousel.querySelectorAll('.card');

//     projectCards.forEach(card => {
//         const title = card.querySelector('.card-title').textContent.toLowerCase();
//         const description = card.querySelector('.card-text').textContent.toLowerCase();
//         if (title.includes(query) || description.includes(query)) {
//             card.style.display = 'block';
//         } else {
//             card.style.display = 'none'; 
//         }
//     });
// });

fetch('data/interest.json')
    .then(response => response.json())
    .then(data => {
        const carousel = document.querySelector('.project-carousel');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        const prevButton = document.querySelector(".carousel-button.prev");
        const nextButton = document.querySelector(".carousel-button.next");

        let autoScrollInterval;
        let currentIndex = 0;
        let cardWidth;
        let totalCards = data.length;
        let cardsPerPage;

        function updateIndicators() {
            const indicators = document.querySelectorAll(".carousel-indicator");
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle("active", index === currentIndex);
            });
        }

        function scrollToCard(index) {
            currentIndex = index;
            carousel.scrollTo({
                left: index * cardsPerPage * cardWidth,
                behavior: 'smooth'
            });
            updateIndicators();
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % Math.ceil(totalCards / cardsPerPage);
                scrollToCard(currentIndex);
            }, 1500);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
        }

        // Create cards
        data.forEach(project => {
            const card = document.createElement('div');
            card.classList.add('card', 'me-3');
            card.style.minWidth = '18rem';
            card.innerHTML = `
                <img src="${project.image}" class="card-img-top" alt="${project.title}">
                <div class="card-body">
                    <h5 class="card-title">${project.title}</h5>
                    <p class="card-text">${project.description}</p>
                </div>
            `;
            carousel.appendChild(card);
        });

        // Initialize carousel properties
        cardWidth = carousel.querySelector('.card').offsetWidth + 16; // Including margin
        const carouselWidth = carousel.offsetWidth;
        cardsPerPage = Math.floor(carouselWidth / cardWidth);

        // Create indicators
        const totalPages = Math.ceil(totalCards / cardsPerPage);
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            indicator.addEventListener('click', () => scrollToCard(i));
            indicatorsContainer.appendChild(indicator);
        }

        // Initialize first indicator
        updateIndicators();

        // Start auto-scroll
        startAutoScroll();

        // Navigation button handlers
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalPages) % totalPages;
            scrollToCard(currentIndex);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalPages;
            scrollToCard(currentIndex);
        });

        // Dragging functionality
        let isDragging = false;
        let startX;
        let startScrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX;
            startScrollLeft = carousel.scrollLeft;
            stopAutoScroll();
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;
            carousel.scrollLeft = startScrollLeft - walk;
        });

        function endDragging() {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.cursor = 'grab';

            // Snap to nearest group of cards
            const scrollPosition = carousel.scrollLeft;
            currentIndex = Math.round(scrollPosition / (cardsPerPage * cardWidth));
            scrollToCard(currentIndex);
            startAutoScroll();
        }

        carousel.addEventListener('mouseup', endDragging);
        carousel.addEventListener('mouseleave', endDragging);

        // Touch events for mobile
        carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            startScrollLeft = carousel.scrollLeft;
            stopAutoScroll();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const walk = x - startX;
            carousel.scrollLeft = startScrollLeft - walk;
        });

        carousel.addEventListener('touchend', endDragging);

        // Pause auto-scroll on hover
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
    })
    .catch(error => {
        console.error('Error fetching the projects:', error);
    });



window.addEventListener("scroll", function () {
    const banner = document.getElementById("banner");

    if (banner) {
        window.requestAnimationFrame(() => {
            banner.style.backgroundPositionY = -(window.scrollY * 0.5) + "px";
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});