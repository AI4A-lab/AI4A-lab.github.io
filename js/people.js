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

class TeamMembersManager {
    constructor() {
        this.template = document.getElementById('member-card-template');
        this.sections = {
            professors: document.getElementById('professors-grid'),
            teamLead: document.getElementById('team-lead-grid'),
            seniorLead: document.getElementById('senior-lead-grid'),
            juniorLead: document.getElementById('junior-lead-grid'),
            pastmembers: document.getElementById('past-member-grid')
        };
        // Hide past members section initially
        const pastMemberSection = this.sections.pastmembers?.closest('.past-member-section');
        if (pastMemberSection) {
            pastMemberSection.style.display = 'none';
        }
    }

    async loadTeamMembers() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/AI4A-lab/.github/refs/heads/main/website/json_data/people.json');
            const data = await response.json();
            this.renderAllSections(data);
        } catch (error) {
            console.error('Error loading team members:', error);
            this.handleError();
        }
    }

    renderAllSections(data) {
        // Check for past members first
        const hasPastMembers = data.pastmembers && data.pastmembers.length > 0;
        const pastMemberSection = this.sections.pastmembers?.closest('.past-member-section');
        
        if (hasPastMembers && pastMemberSection) {
            pastMemberSection.style.display = 'block';
        }

        Object.entries(data).forEach(([section, members]) => {
            if (this.sections[section] && (section !== 'pastmembers' || hasPastMembers)) {
                this.renderSection(this.sections[section], members);
            }
        });
    }

    renderSection(container, members) {
        container.innerHTML = '';
        members.forEach(member => {
            const card = this.createMemberCard(member);
            container.appendChild(card);
        });
    }

    createMemberCard(member) {
        const card = this.template.content.cloneNode(true);
        
        const img = card.querySelector('.member-image img');
        img.src = member.image;
        img.alt = member.name;

        card.querySelector('.member-name').textContent = member.name;
        card.querySelector('.member-role').textContent = member.role;
        card.querySelector('.member-email').innerHTML = `<strong>Email:</strong> ${member.email}`;
        card.querySelector('.member-interests').innerHTML = `<strong>Interests:</strong> ${member.interests}`;

        const linksContainer = card.querySelector('.member-links');
        this.createSocialLinks(linksContainer, member.links);

        return card.firstElementChild;
    }

    createSocialLinks(container, links) {
        const linkIcons = {
            scholar: 'fas fa-graduation-cap',
            linkedin: 'fab fa-linkedin',
            github: 'fab fa-github',
            muj: 'fas fa-university',
            website: 'fas fa-globe'
        };
        
        Object.entries(links).forEach(([platform, url]) => {
            if (platform !== 'email') {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.innerHTML = `<i class="${linkIcons[platform]}"></i>`;
                container.appendChild(link);
            }
        });
    }

    handleError() {
        Object.values(this.sections).forEach(section => {
            if (section) {
                section.innerHTML = `
                    <div class="error-message">
                        <p>Unable to load team members. Please try again later.</p>
                    </div>
                `;
            }
        });
    }

    addLoadingAnimation() {
        Object.entries(this.sections).forEach(([sectionKey, section]) => {
            if (section && sectionKey !== 'pastmembers') {
                section.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading team members...</p>
                    </div>
                `;
            }
        });
    }

    initializeObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.team-member').forEach(member => {
            observer.observe(member);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const teamManager = new TeamMembersManager();
    teamManager.addLoadingAnimation();
    teamManager.loadTeamMembers().then(() => {
        teamManager.initializeObservers();
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.querySelectorAll('.team-section').forEach(section => {
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        section.style.setProperty('--mouse-x', `${x}px`);
        section.style.setProperty('--mouse-y', `${y}px`);
    });
});