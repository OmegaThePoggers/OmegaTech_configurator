document.addEventListener("DOMContentLoaded", function () {
  const randomBuildsContainer = document.getElementById("random-builds-container");

  // Load components data
  fetch("components.json")
    .then((response) => response.json())
    .then((data) => {
      generateRandomBuilds(data);
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  // Generate and display random builds
  function generateRandomBuilds(components) {
    for (let i = 0; i < 3; i++) {
      const build = generateRandomBuild(components);
      const buildCard = createBuildCard(build, i + 1);
      randomBuildsContainer.appendChild(buildCard);
    }
  }

  // Generate a single random build
  function generateRandomBuild(components) {
    const build = {};
    let totalCost = 0;

    Object.entries(components.categories).forEach(([category, items]) => {
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomItem = items[randomIndex];
      build[category] = randomItem;
      totalCost += randomItem.price;
    });

    build.totalCost = totalCost;
    return build;
  }

  // Create a card element for a build
  function createBuildCard(build, buildNumber) {
    const card = document.createElement("div");
    card.className = "random-build-card";

    let componentsHtml = "";
    for (const [category, item] of Object.entries(build)) {
      if (category !== "totalCost") {
        componentsHtml += `
          <div class="random-build-spec">
            <span>${category}:</span>
            <span>${item.name}</span>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <h3 class="random-build-title">Random Build ${buildNumber}</h3>
      ${componentsHtml}
      <div class="random-build-price">Total: $${build.totalCost.toLocaleString()}</div>
    `;

    return card;
  }
});
