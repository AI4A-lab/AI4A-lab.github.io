document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeIcon.classList.toggle('fa-sun');
        themeIcon.classList.toggle('fa-moon');
    });

    const projectsContainer = document.getElementById('projectsContainer');
    fetch('https://raw.githubusercontent.com/AI4A-lab/.github/refs/heads/main/website/json_data/projects.json')
    .then(response => response.json())
    .then(data => {
      data.projects.forEach((project, index) => {
        projectsContainer.appendChild(createProjectCard(project, index));
      });
    })
    .catch(error => console.error('Error loading projects:', error));

  function createProjectCard(project, index) {
    const col = document.createElement('div');
    col.className = 'col-md-6 project-card-container';

    const card = document.createElement('div');
    card.className = 'project-card h-100';

    const img = document.createElement('img');
    img.src = project.coverImage;
    img.className = 'card-img-top';
    img.alt = project.name;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = project.name;

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = project.shortDescription;

    const techContainer = document.createElement('div');
    techContainer.className = 'project-technologies mb-3';
    project.technologies.forEach(tech => {
      const techBadge = document.createElement('span');
      techBadge.className = 'project-technology-badge';
      techBadge.textContent = tech;
      techContainer.appendChild(techBadge);
    });

    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'btn btn-primary mt-auto';
    readMoreBtn.textContent = 'Read More';
    readMoreBtn.setAttribute('data-bs-toggle', 'collapse');
    readMoreBtn.setAttribute('data-bs-target', `#projectDetails${index}`);
    readMoreBtn.setAttribute('aria-expanded', 'false');

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'project-details collapse';
    detailsContainer.id = `projectDetails${index}`;

    detailsContainer.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <div class="project-images">
            ${project.additionalImages.map(img => `
              <img src="${img}" alt="${project.name} Image" class="img-fluid">
            `).join('')}
          </div>
          <h4>Researchers</h4>
          <ul class="list-group">
            ${project.researchers.map(researcher => `
              <li class="list-group-item">${researcher}</li>
            `).join('')}
          </ul>
        </div>
        <div class="col-md-6">
          <h4>Full Description</h4>
          <p>${project.fullDescription.replace(/\n/g, '<br>')}</p>
          <h4 class="mt-3">External Links</h4>
          <div class="project-external-links">
            ${project.externalLinks.map(link => `
              <a href="${link.url}" target="_blank">
                <i class="fas fa-link"></i>${link.name}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(techContainer);
    cardBody.appendChild(readMoreBtn);

    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(detailsContainer);
    col.appendChild(card);

    return col;
  }
});