document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-item');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Scripts functionality
    const scriptsContainer = document.getElementById('scripts');
    let filteredScripts = [...scripts];
    let currentFilter = 'all';

    // Initialize the page
    initializeScripts();
    setupEventListeners();

    function initializeScripts() {
        renderScripts(scripts);
        updateTagFilters();
    }

    function setupEventListeners() {
        // Sort functionality
        document.getElementById('sort-scripts').addEventListener('change', (e) => {
            sortScripts(e.target.value);
        });

        // Filter tag clicks
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.tag;
                filterAndRenderScripts();
            });
        });
    }

    function filterAndRenderScripts() {
        filteredScripts = scripts.filter(script => {
            const matchesTag = currentFilter === 'all' || script.tags.includes(currentFilter);
            return matchesTag;
        });

        renderScripts(filteredScripts);
    }

    function sortScripts(sortBy) {
        switch(sortBy) {
            case 'newest':
                filteredScripts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                filteredScripts.sort((a, b) => b.downloads - a.downloads);
                break;
            case 'name':
                filteredScripts.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        renderScripts(filteredScripts);
    }

    function renderScripts(scriptsToRender) {
        scriptsContainer.innerHTML = '';
        scriptsToRender.forEach((script, index) => {
            const card = createScriptCard(script);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            scriptsContainer.appendChild(card);
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function createScriptCard(script) {
        const card = document.createElement('div');
        card.className = 'script-card bg-gray-900 rounded-lg p-6 border border-red-900 hover:border-red-600';
        
        card.innerHTML = `
            <div class="relative">
                <h3 class="text-xl font-bold mb-2 text-red-500 font-orbitron flex items-center gap-2">
                    <i class="fas fa-code-branch"></i>
                    ${script.title}
                </h3>
            </div>
            <p class="text-gray-400 mb-4 leading-relaxed">${script.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${script.tags.map(tag => `
                    <span class="px-3 py-1 bg-red-900/50 rounded-full text-sm font-semibold tracking-wide flex items-center gap-1">
                        <i class="fas fa-tag text-xs"></i>${tag}
                    </span>
                `).join('')}
            </div>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500 font-semibold flex items-center gap-2">
                        <i class="far fa-calendar-alt"></i>${script.date}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <a href="scripts/${script.downloadUrl}" data-script-title="${script.title}"
                       class="px-4 py-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 rounded-lg transition-all font-orbitron tracking-wide flex items-center gap-2 group cursor-pointer">
                       <i class="fas fa-download group-hover:animate-bounce"></i>
                       Download
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    // Download script function
    window.downloadScript = async function(url, title) {
        try {
            // Show loading indicator
            const downloadBtn = document.querySelector(`[data-script-title="${title}"]`);
            if (downloadBtn) {
                downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            }

            // Fetch the script content
            const response = await fetch(url);
            const text = await response.text();
            const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.txt';

            // Create blob and download
            const blob = new Blob([text], { type: 'text/plain' });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            // Show success message
            if (downloadBtn) {
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
                setTimeout(() => {
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
                }, 2000);
            }
        } catch (error) {
            console.error('Download failed:', error);
            // Show error message
            const downloadBtn = document.querySelector(`[data-script-title="${title}"]`);
            if (downloadBtn) {
                downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
                setTimeout(() => {
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Retry';
                }, 2000);
            }
        }
    }
});

// Smooth scrolling with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
