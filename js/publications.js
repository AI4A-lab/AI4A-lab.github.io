document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Set up theme from local storage
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    // Toggle theme event listener
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeIcon.classList.toggle('fa-sun');
        themeIcon.classList.toggle('fa-moon');
    });

    const publicationsSection = document.getElementById('publications-section');
    const searchInput = document.getElementById('publicationSearch');
    const yearFilter = document.getElementById('yearFilter');

    // Fetch JSON data
    fetch('https://raw.githubusercontent.com/AI4A-lab/.github/refs/heads/main/website/json_data/publications.json')
        .then(response => response.json())
        .then(data => {
            // Populate the year filter dropdown
            const allYears = [...new Set(data.map(publication => publication.year))];
            populateYearFilter(yearFilter, allYears);

            // Display all publications initially
            displayPublications(data, publicationsSection);

            // Search input event
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                const selectedYear = yearFilter.value;
                filterPublications(data, query, selectedYear, publicationsSection);
            });

            // Year filter change event
            yearFilter.addEventListener('change', () => {
                const query = searchInput.value.toLowerCase();
                const selectedYear = yearFilter.value;
                filterPublications(data, query, selectedYear, publicationsSection);
            });
        })
        .catch(error => {
            console.error('Error fetching the publications:', error);
        });
});

function populateYearFilter(yearFilter, years) {
    years.sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearFilter.add(option);
    });
}

function displayPublications(publications, container) {
    container.innerHTML = '';

    publications.forEach(publication => {
        const publicationElement = createPublicationElement(publication);
        container.appendChild(publicationElement);
    });
}

function createPublicationElement(publication) {
    const publicationDiv = document.createElement('div');
    publicationDiv.classList.add('publication-item', 'row', 'mb-4');


    publicationDiv.innerHTML = `
        <div class="col-md-6 left-section">
            <h5 class="publication-title"><strong></strong> ${publication.title}</h5>
            <p class="publication-authors"><strong>Author(s):</strong><a style="color:#ccc;"> ${publication.authors.join(', ')}</a></p>
        </div>
        <div class="col-md-6 right-section">
            <p><strong>Article:</strong> <a href="${publication.link}" class="publication-link" target="_blank">${publication.link}</a></p>
            <p class="publication-details">
                <strong>${publication.journal ? "Journal:" : "Conference:"}</strong> <a style="color:#ccc;">
                ${publication.journal || publication.conference}</a>
                ${publication.jc_link ? `<a href="${publication.jc_link}" target="_blank" class="ms-2">
                    <i class="bi bi-box-arrow-up-right"></i>
                </a>` : ''}
            </p>
            <p class="publication-details"><strong>Publication Year:</strong> <a style="color:#ccc;">${publication.year}</a></p>
        </div>
        <div class="col-12 publication-tags">
            ${publication.tags ? publication.tags.map(tag => `<span class="badge ">${tag}</span>`).join('') : ''}
        </div>
    `;
    return publicationDiv;
}

function filterPublications(publications, query, selectedYear, container) {
    // Filter publications based on search query and year
    const filteredPublications = publications.filter(publication => {
        const matchesQuery =
            publication.title.toLowerCase().includes(query) ||
            publication.authors.some(author => author.toLowerCase().includes(query));
        const matchesYear = selectedYear === '' || publication.year === selectedYear;
        return matchesQuery && matchesYear;
    });

    // Update displayed publications
    displayPublications(filteredPublications, container);
}
