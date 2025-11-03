document.addEventListener("DOMContentLoaded", function () {
  // Initialize state
  let selectedComponents = {};
  let totalCost = 0;
  let components = {};
  let savedBuilds = JSON.parse(localStorage.getItem("savedBuilds") || "[]");

  // Initialize button states after variables are declared
  updateButtonStates();

  // Initialize performance chart
  let performanceChart = null;

  // Load components data
  fetch("components.json")
    .then((response) => response.json())
    .then((data) => {
      components = data;
      createComponentSelectors();
      updateBuildProgress();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  // Create component selection interface
  function createComponentSelectors() {
    const container = document.getElementById("component-options");
    Object.entries(components.categories).forEach(([category, items]) => {
      const card = document.createElement("div");
      card.className = "card bg-dark mb-3";

      const cardContent = `
                <div class="card-body">
                    <h5 class="card-title text-light">${category}</h5>
                    <select class="form-select component-select bg-dark text-light" data-category="${category}">
                        <option value="" class="bg-dark text-light">Select ${category}</option>
                        ${items
                          .map(
                            (item) => `
                            <option value="${item.name}" data-price="${item.price}" class="bg-dark text-light">
                                ${item.name} - ₹${item.price.toLocaleString("en-IN")}
                            </option>
                        `,
                          )
                          .join("")}
                    </select>
                </div>
            `;

      card.innerHTML = cardContent;
      container.appendChild(card);
    });
  }

  // Update build progress
  function updateBuildProgress() {
    const totalCategories = Object.keys(components.categories || {}).length;
    const selectedCount = Object.keys(selectedComponents).length;
    const progressPercentage = totalCategories
      ? (selectedCount / totalCategories) * 100
      : 0;

    const progressBar = document.querySelector(".progress-bar");
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
  }

  // Check compatibility between components
  function checkCompatibility() {
    const warnings = [];

    // CPU and RAM compatibility check
    if (selectedComponents.CPU && selectedComponents.RAM) {
      const cpu = selectedComponents.CPU.name;
      const ram = selectedComponents.RAM.name;

      const needsDDR5 =
        cpu.includes("13") || cpu.includes("7600X") || cpu.includes("7800X");
      const isDDR4 = ram.toLowerCase().includes("ddr4");

      if (needsDDR5 && isDDR4) {
        warnings.push(
          "Selected RAM is not compatible with this CPU (DDR5 required)",
        );
      }
    }

    // PSU wattage check for high-end GPUs
    if (selectedComponents.GPU && selectedComponents.PSU) {
      const gpu = selectedComponents.GPU.name;
      const psu = selectedComponents.PSU.name;

      const highEndGPUs = ["RTX 4080", "RX 7900 XT"];
      const psuWattage = parseInt(psu.match(/\d+/)[0]);

      if (
        highEndGPUs.some((model) => gpu.includes(model)) &&
        psuWattage < 750
      ) {
        warnings.push("Selected PSU wattage may be insufficient for this GPU");
      }
    }

    return warnings;
  }

  // Update performance score
  function updatePerformanceScore() {
    if (!selectedComponents.CPU || !selectedComponents.GPU) return 0;

    let score = 0;
    const cpuScores = {
      i9: 100,
      i7: 85,
      i5: 70,
      "7800X": 90,
      "7600X": 75,
    };

    const gpuScores = {
      4080: 100,
      "7900 XT": 95,
      4070: 80,
      "7700 XT": 75,
      4060: 65,
    };

    // Calculate CPU score
    for (const [key, value] of Object.entries(cpuScores)) {
      if (selectedComponents.CPU.name.includes(key)) {
        score += value;
        break;
      }
    }

    // Calculate GPU score
    for (const [key, value] of Object.entries(gpuScores)) {
      if (selectedComponents.GPU.name.includes(key)) {
        score += value;
        break;
      }
    }

    return Math.round(score / 2);
  }

  // Update estimated FPS
  function updateFpsEstimates() {
    if (!selectedComponents.CPU || !selectedComponents.GPU) return;

    const performanceScore = updatePerformanceScore();
    const fpsList = document.getElementById("fps-list");

    const games = {
      "Cyberpunk 2077": performanceScore * 0.8,
      Fortnite: performanceScore * 1.5,
      "CS:GO": performanceScore * 2.5,
    };

    fpsList.innerHTML = Object.entries(games)
      .map(
        ([game, fps]) => `
                <div class="d-flex justify-content-between">
                    <small>${game}:</small>
                    <small>${Math.round(fps)} FPS</small>
                </div>
            `,
      )
      .join("");
  }

  // Update button states based on component selection
  function updateButtonStates() {
    const requiredComponents = ["CPU", "GPU", "RAM", "Storage", "PSU", "Case"];
    const allComponentsSelected = requiredComponents.every(
      (comp) => selectedComponents[comp],
    );

    const saveButton = document.getElementById("save-config");
    const exportButton = document.getElementById("export-pdf");

    if (allComponentsSelected) {
      saveButton.classList.remove("disabled");
      exportButton.classList.remove("disabled");
      saveButton.removeAttribute("disabled");
      exportButton.removeAttribute("disabled");
    } else {
      saveButton.classList.add("disabled");
      exportButton.classList.add("disabled");
      saveButton.setAttribute("disabled", "");
      exportButton.setAttribute("disabled", "");
    }
  }

  // Update summary display
  function updateSummary() {
    const summaryList = document.getElementById("summary-list");
    const totalCostElement = document.getElementById("total-cost");
    const warningsDiv = document.getElementById("compatibility-warnings");
    const performanceScore = document.getElementById("performance-score");

    let html = "";
    totalCost = 0;

    // Update component list and total cost
    for (const [category, item] of Object.entries(selectedComponents)) {
      html += `
                <div class="d-flex justify-content-between mb-2">
                    <span>${category}:</span>
                    <span>${item.name}</span>
                </div>
            `;
      totalCost += item.price;
    }

    summaryList.innerHTML = html;
    totalCostElement.textContent = `₹${totalCost.toLocaleString("en-IN")}`;

    // Update compatibility warnings
    const warnings = checkCompatibility();
    if (warnings.length > 0) {
      warningsDiv.innerHTML = warnings
        .map(
          (warning) => `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    ${warning}
                </div>
            `,
        )
        .join("");
    } else {
      warningsDiv.innerHTML = "";
    }

    // Update performance score and FPS estimates
    const score = updatePerformanceScore();
    performanceScore.textContent = score;
    updateFpsEstimates();
    updatePerformanceChart(score);
  }

  // Save current build
  function saveCurrentBuild() {
    const requiredComponents = ["CPU", "GPU", "RAM", "Storage", "PSU", "Case"];
    const missingComponents = requiredComponents.filter(
      (comp) => !selectedComponents[comp],
    );

    if (missingComponents.length > 0) {
      alert(
        `Please select all required components before saving.\nMissing: ${missingComponents.join(", ")}`,
      );
      return;
    }

    const buildName = prompt("Enter a name for this build:");
    if (!buildName) return;

    const build = {
      name: buildName,
      components: { ...selectedComponents },
      totalCost,
      performanceScore: updatePerformanceScore(),
      date: new Date().toISOString(),
    };

    savedBuilds.push(build);
    localStorage.setItem("savedBuilds", JSON.stringify(savedBuilds));
    alert("Build saved successfully!");
    updateCompareModal();
  }

  // Update compare modal with saved builds
  function updateCompareModal() {
    const build1 = document.getElementById("build1");
    const build2 = document.getElementById("build2");

    const createBuildSelector = (containerId) => {
      const container = document.getElementById(containerId);
      container.innerHTML = `
        <select class="form-select mb-3 build-selector bg-dark text-light">
          <option value="" class="bg-dark text-light">Select a build to compare</option>
          ${savedBuilds
            .map(
              (build, index) => `
            <option value="${index}" class="bg-dark text-light">${build.name} ($${build.totalCost.toFixed(2)})</option>
          `,
            )
            .join("")}
        </select>
        <div class="build-details"></div>
      `;

      const selector = container.querySelector(".build-selector");
      selector.addEventListener("change", (e) => {
        const buildIndex = e.target.value;
        if (buildIndex === "") {
          container.querySelector(".build-details").innerHTML = "";
          return;
        }

        const build = savedBuilds[buildIndex];
        const details = container.querySelector(".build-details");
        details.innerHTML = `
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h5 class="card-title text-primary">${build.name}</h5>
              <p class="text-light opacity-75">Built on: ${new Date(build.date).toLocaleDateString()}</p>
              <div class="mb-3 text-light">
                <strong class="text-primary">Performance Score:</strong> ${build.performanceScore}
              </div>
              <div class="mb-3 text-light">
                <strong class="text-primary">Total Cost:</strong> ₹${build.totalCost.toLocaleString("en-IN")}
              </div>
              <h6 class="text-primary">Components:</h6>
              ${Object.entries(build.components)
                .map(
                  ([category, item]) => `
                <div class="d-flex justify-content-between mb-2 text-light">
                  <span>${category}:</span>
                  <span>${item.name}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `;
      });
    };

    createBuildSelector("build1");
    createBuildSelector("build2");
  }

  // Update performance chart
  function updatePerformanceChart(score) {
    const ctx = document.getElementById("performanceChart");

    if (performanceChart) {
      performanceChart.destroy();
    }

    const gaming = score * 0.8;
    const workstation = score * 0.9;
    const multimedia = score * 0.85;
    const productivity = score * 0.95;

    performanceChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Gaming", "Workstation", "Multimedia", "Productivity"],
        datasets: [
          {
            label: "Performance",
            data: [gaming, workstation, multimedia, productivity],
            fill: true,
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            borderColor: "rgba(0, 255, 255, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(255, 0, 255, 0.8)",
            pointBorderColor: "rgba(255, 255, 255, 0.8)",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#ff00ff",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            angleLines: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
              circular: true,
            },
            pointLabels: {
              color: "rgba(255, 255, 255, 0.9)",
              font: {
                family: "'Orbitron', sans-serif",
                size: 12,
              },
              padding: 20,
            },
            ticks: {
              display: false,
              backdropColor: "transparent",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Handle component selection
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("component-select")) {
      const category = e.target.getAttribute("data-category");
      const value = e.target.value;
      const price = parseFloat(
        e.target.options[e.target.selectedIndex].getAttribute("data-price") ||
          0,
      );

      if (value) {
        selectedComponents[category] = { name: value, price: price };
      } else {
        delete selectedComponents[category];
      }

      updateSummary();
      updateBuildProgress();
      updateButtonStates();
    }
  });

  // Handle theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-sun-fill");
    icon.classList.toggle("bi-moon-fill");
  });

  // Handle export to PDF
  document.getElementById("export-pdf").addEventListener("click", function () {
    const requiredComponents = ["CPU", "GPU", "RAM", "Storage", "PSU", "Case"];
    const missingComponents = requiredComponents.filter(
      (comp) => !selectedComponents[comp],
    );

    if (missingComponents.length > 0) {
      alert(
        `Please select all required components before exporting.\nMissing: ${missingComponents.join(", ")}`,
      );
      return;
    }

    const summaryCard = document.querySelector(".summary-card").cloneNode(true);
    summaryCard.style.padding = "20px";

    const opt = {
      margin: 1,
      filename: "pc-configuration.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(summaryCard).save();
  });

  // Handle save configuration
  document.getElementById("save-config").addEventListener("click", function () {
    saveCurrentBuild();
  });

  // Handle compare builds
  document
    .getElementById("compare-builds")
    .addEventListener("click", function () {
      updateCompareModal();
      new bootstrap.Modal(document.getElementById("compareModal")).show();
    });

  // Handle share link
  document.getElementById("share-link").addEventListener("click", function () {
    const configData = encodeURIComponent(JSON.stringify(selectedComponents));
    const url = `${window.location.origin}${window.location.pathname}?config=${configData}`;

    navigator.clipboard.writeText(url).then(() => {
      alert("Configuration link copied to clipboard!");
    });
  });

  // Load configuration from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const configParam = urlParams.get("config");
  if (configParam) {
    try {
      const loadedConfig = JSON.parse(decodeURIComponent(configParam));
      selectedComponents = loadedConfig;
      // Wait for components to load before updating selectors
      const checkInterval = setInterval(() => {
        if (Object.keys(components).length > 0) {
          Object.entries(loadedConfig).forEach(([category, item]) => {
            const select = document.querySelector(
              `select[data-category="${category}"]`,
            );
            if (select) {
              select.value = item.name;
            }
          });
          updateSummary();
          updateBuildProgress();
          clearInterval(checkInterval);
        }
      }, 100);
    } catch (e) {
      console.error("Error loading configuration from URL:", e);
    }
  }
});
