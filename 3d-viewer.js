// Initialize Three.js variables
let scene, camera, renderer, controls;
let pcCase, motherboard, cpu, gpu, ram, psu, fans = [];
let hoverObject = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let componentLabels = {};
let glowEffect;
let isExploded = false;

// Setup the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        document.getElementById('pc-3d-viewer').offsetWidth / 400,
        0.1,
        1000
    );
    camera.position.set(5, 2, 5);

    // Create renderer
    const canvas = document.getElementById('3d-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(document.getElementById('pc-3d-viewer').offsetWidth, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add lights
    addLights();

    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;

    // Create PC Components
    createPCCase();
    createMotherboard();
    createCPU();
    createGPU();
    createRAM();
    createPSU();
    createFans();

    // Add post-processing effects
    addPostProcessing();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('click', onMouseClick, false);

    // Start animation loop
    animate();
}

// Add lighting to the scene
function addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
    scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // RGB accent lights
    const colors = [0x00ff00, 0x0000ff, 0xff0000];
    colors.forEach((color, index) => {
        const light = new THREE.PointLight(color, 0.5, 10);
        light.position.set(
            Math.cos(index * Math.PI * 2 / 3) * 3,
            0,
            Math.sin(index * Math.PI * 2 / 3) * 3
        );
        scene.add(light);
    });
}

// Create PC Case
function createPCCase() {
    const geometry = new THREE.BoxGeometry(4, 8, 3);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x202020,
        metalness: 0.7,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    pcCase = new THREE.Mesh(geometry, material);
    pcCase.castShadow = true;
    pcCase.receiveShadow = true;
    scene.add(pcCase);

    // Add glass panel
    const glassGeometry = new THREE.PlaneGeometry(4, 8);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    const glassPanel = new THREE.Mesh(glassGeometry, glassMaterial);
    glassPanel.position.set(2.01, 0, 0);
    glassPanel.rotation.y = Math.PI / 2;
    pcCase.add(glassPanel);
}

// Create Motherboard
function createMotherboard() {
    const geometry = new THREE.BoxGeometry(0.2, 7, 2.5);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.5,
        roughness: 0.8
    });
    motherboard = new THREE.Mesh(geometry, material);
    motherboard.position.set(-1.8, 0, 0);
    pcCase.add(motherboard);

    // Add motherboard details
    addCircuitPatterns(motherboard);
}

// Create CPU
function createCPU() {
    const geometry = new THREE.BoxGeometry(0.3, 0.8, 0.8);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    cpu = new THREE.Mesh(geometry, material);
    cpu.position.set(-1.6, 2, 0);
    pcCase.add(cpu);

    // Add CPU cooler
    createCPUCooler();
}

// Create GPU
function createGPU() {
    const geometry = new THREE.BoxGeometry(1.5, 0.2, 2);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.7,
        roughness: 0.3
    });
    gpu = new THREE.Mesh(geometry, material);
    gpu.position.set(-1, 0, 0);
    pcCase.add(gpu);

    // Add GPU fans
    addGPUFans();
}

// Create RAM sticks
function createRAM() {
    for (let i = 0; i < 4; i++) {
        const geometry = new THREE.BoxGeometry(0.2, 0.8, 0.1);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.4
        });
        const ramStick = new THREE.Mesh(geometry, material);
        ramStick.position.set(-1.6, 1, -0.6 + i * 0.3);
        pcCase.add(ramStick);

        // Add RGB lighting to RAM
        addRGBEffect(ramStick);
    }
}

// Create PSU
function createPSU() {
    const geometry = new THREE.BoxGeometry(2, 2, 2.5);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.5,
        roughness: 0.7
    });
    psu = new THREE.Mesh(geometry, material);
    psu.position.set(-1, -3, 0);
    pcCase.add(psu);
}

// Create case fans
function createFans() {
    const fanPositions = [
        { x: -1.8, y: 2, z: 1 },    // Front top
        { x: -1.8, y: 0, z: 1 },    // Front middle
        { x: -1.8, y: -2, z: 1 },   // Front bottom
        { x: -1.8, y: 2, z: -1 }    // Rear
    ];

    fanPositions.forEach(pos => {
        const fan = createFan();
        fan.position.set(pos.x, pos.y, pos.z);
        pcCase.add(fan);
        fans.push(fan);
    });
}

// Create individual fan
function createFan() {
    const group = new THREE.Group();

    // Fan frame
    const frameGeometry = new THREE.RingGeometry(0.3, 0.4, 32);
    const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x202020,
        metalness: 0.8,
        roughness: 0.2
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    group.add(frame);

    // Fan blades
    const bladeGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.05);
    const bladeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x303030,
        metalness: 0.6,
        roughness: 0.4
    });

    for (let i = 0; i < 9; i++) {
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.rotation.z = (i * Math.PI * 2) / 9;
        group.add(blade);
    }

    return group;
}

// Add circuit patterns to motherboard
function addCircuitPatterns(board) {
    const lines = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x404040 });

    for (let i = 0; i < 20; i++) {
        const points = [];
        points.push(new THREE.Vector3(0, Math.random() * 7 - 3.5, Math.random() * 2.5 - 1.25));
        points.push(new THREE.Vector3(0, Math.random() * 7 - 3.5, Math.random() * 2.5 - 1.25));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        lines.add(line);
    }

    board.add(lines);
}

// Add RGB lighting effect
function addRGBEffect(object) {
    const light = new THREE.PointLight(0xff0000, 0.5, 1);
    object.add(light);

    // Animate RGB color
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
        light.color = color;
    }, 50);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = document.getElementById('pc-3d-viewer').offsetWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(document.getElementById('pc-3d-viewer').offsetWidth, 400);
}

// Handle mouse move for hover effects
function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (hoverObject !== object) {
            if (hoverObject) {
                hoverObject.material.emissive.setHex(0x000000);
            }
            hoverObject = object;
            hoverObject.material.emissive.setHex(0x222222);
        }
    } else if (hoverObject) {
        hoverObject.material.emissive.setHex(0x000000);
        hoverObject = null;
    }
}

// Handle mouse click for component selection
function onMouseClick(event) {
    if (hoverObject) {
        // Toggle exploded view for clicked component
        const component = hoverObject.parent;
        if (component && component !== scene) {
            toggleExplodedView(component);
        }
    }
}

// Toggle exploded view
function toggleExplodedView(component) {
    isExploded = !isExploded;
    const offset = isExploded ? 2 : 0;

    new TWEEN.Tween(component.position)
        .to({ x: component.position.x + offset }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate fans
    fans.forEach(fan => {
        fan.rotation.z += 0.01;
    });

    // Update controls
    controls.update();

    // Update tweens
    TWEEN.update();

    // Render scene
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();

    // Add button controls
    document.getElementById('rotate-left').addEventListener('click', () => {
        new TWEEN.Tween(pcCase.rotation)
            .to({ y: pcCase.rotation.y - Math.PI / 2 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    });

    document.getElementById('rotate-right').addEventListener('click', () => {
        new TWEEN.Tween(pcCase.rotation)
            .to({ y: pcCase.rotation.y + Math.PI / 2 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    });

    document.getElementById('reset-view').addEventListener('click', () => {
        new TWEEN.Tween(pcCase.rotation)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        new TWEEN.Tween(camera.position)
            .to({ x: 5, y: 2, z: 5 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        controls.reset();
    });
});

// Update component models based on selection
function updateComponent(category, componentName) {
    switch(category) {
        case 'CPU':
            updateCPUModel(componentName);
            break;
        case 'GPU':
            updateGPUModel(componentName);
            break;
        case 'RAM':
            updateRAMModel(componentName);
            break;
        case 'PSU':
            updatePSUModel(componentName);
            break;
        case 'Case':
            updateCaseModel(componentName);
            break;
    }
}

// Listen for component selection changes
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('component-select')) {
        const category = e.target.getAttribute('data-category');
        const value = e.target.value;
        if (value) {
            updateComponent(category, value);
        }
    }
});
