document.addEventListener('DOMContentLoaded', function() {
    const buildsContainer = document.getElementById('builds-container');
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');

    if (savedBuilds.length === 0) {
        buildsContainer.innerHTML = '<p class="text-center text-light">No saved builds found.</p>';
        return;
    }

    savedBuilds.forEach(build => {
        const buildCard = document.createElement('div');
        buildCard.className = 'col-md-6 col-lg-4';

        const componentsHtml = Object.entries(build.components).map(([category, item]) => `
            <li>
                <span>${category}</span>
                <span>${item.name}</span>
            </li>
        `).join('');

        buildCard.innerHTML = `
            <div class="build-card">
                <h5>${build.name}</h5>
                <p>
                    <span class="badge bg-primary">Cost: ₹${build.totalCost.toLocaleString('en-IN')}</span>
                    <span class="badge bg-secondary">Perf. Score: ${build.performanceScore}</span>
                </p>
                <p class="text-muted">Saved on: ${new Date(build.date).toLocaleDateString()}</p>
                <h6>Components:</h6>
                <ul class="component-list">
                    ${componentsHtml}
                </ul>
            </div>
        `;
        buildsContainer.appendChild(buildCard);
    });
});
