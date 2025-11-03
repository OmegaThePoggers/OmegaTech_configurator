<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PC Configurator - OmegaTech</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono&family=Open+Sans&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="placeholder.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">OmegaTech</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="configurator.php">Configurator</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container mt-5">
        <h1 class="text-center mb-4">Build Your PC</h1>
        <div class="theme-toggle position-fixed top-0 end-0 mt-4 me-4">
            <button class="btn btn-outline-light" id="theme-toggle">
                <i class="bi bi-moon-fill"></i>
            </button>
        </div>
        <div class="build-progress mb-4">
            <div class="progress" style="height: 25px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%">0%</div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-lg-8">
                <div class="compatibility-score mb-4">
                    <div class="card border-primary">
                        <div class="card-body">
                            <h5 class="card-title text-primary">Build Status</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="compatibility-indicator">
                                    <i class="bi bi-check-circle-fill text-success"></i>
                                    <span class="text-light">Compatibility Score: </span>
                                    <span id="compatibility-score" class="text-light">100%</span>
                                </div>
                                <div class="performance-score">
                                    <i class="bi bi-speedometer2 text-primary"></i>
                                    <span class="text-light">Performance Score: </span>
                                    <span id="performance-score" class="text-light">0</span>
                                </div>
                            </div>
                            <div id="compatibility-warnings" class="mt-2 text-warning"></div>
                        </div>
                    </div>
                </div>
                <div id="component-options" class="component-grid">
                    <!-- Component cards will be dynamically inserted here -->
                    <div class="component-loading">
                        <div class="placeholder-wrapper placeholder-loading">
                            <i class="bi bi-cpu placeholder-icon"></i>
                            <div class="placeholder-label">Loading Components...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="summary-card card bg-dark text-white">
                    <div class="card-body">
                        <h5 class="card-title">Configuration Summary</h5>
                        <div id="summary-list"></div>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <h5>Total Cost:</h5>
                            <h5 id="total-cost">$0</h5>
                        </div>
                        <div class="performance-metrics mb-3">
                            <h6 class="text-primary mb-3">Performance Analysis</h6>
                            <div class="performance-chart mb-4" style="height: 200px; position: relative; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 10px;">
                                <canvas id="performanceChart"></canvas>
                            </div>
                            <div class="fps-estimates">
                                <h6 class="text-primary mb-2">Gaming Performance</h6>
                                <div id="fps-list" class="mt-2">
                                    <div class="placeholder-wrapper">
                                        <i class="bi bi-gpu-card placeholder-icon"></i>
                                        <div class="placeholder-label">Select CPU and GPU to see estimates</div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end mt-3">
                                <small class="text-muted opacity-75">* Estimates based on component specifications</small>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button id="save-config" class="btn btn-primary w-100 mb-2 disabled" disabled>Save Configuration</button>
                            <button id="compare-builds" class="btn btn-outline-primary w-100 mb-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Compare saved builds">Compare Builds</button>
                            <div class="share-buttons d-flex justify-content-between mb-2">
                                <button id="share-link" class="btn btn-outline-info flex-grow-1 me-2">
                                    <i class="bi bi-link-45deg"></i> Share
                                </button>
                                <button id="export-pdf" class="btn btn-outline-info flex-grow-1 disabled" disabled>
                                    <i class="bi bi-file-pdf"></i> Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>



    <!-- Build Comparison Modal -->
    <div class="modal fade" id="compareModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content bg-dark">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-light">Compare Builds</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6" id="build1">
                            <h6 class="mb-3 text-primary">Build 1</h6>
                            <div class="build-content text-light"></div>
                        </div>
                        <div class="col-md-6" id="build2">
                            <h6 class="mb-3 text-primary">Build 2</h6>
                            <div class="build-content text-light"></div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <div class="comparison-chart">
                                <canvas id="comparisonChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="export-comparison">Export Comparison</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 3D Preview Modal -->
    <div class="modal fade" id="preview3dModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header">
                    <h5 class="modal-title">3D Component Preview</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="preview3d-container" style="height: 400px;"></div>
                </div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            // Initialize theme
            if (localStorage.getItem('theme') === 'light') {
                document.body.classList.add('light-theme');
                document.querySelector('#theme-toggle i').classList.replace('bi-moon-fill', 'bi-sun-fill');
            }
        });
    </script>

    <script src="script.js"></script>
</body>
</html>
