import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
const container = document.getElementById("3d-container");

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000,
);
camera.position.z = 4; // Moved camera a bit closer

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// PC Case (Transparent with cyan lines)
const caseGeometry = new THREE.BoxGeometry(2.5, 4, 2); // Made case a bit deeper
const caseEdges = new THREE.EdgesGeometry(caseGeometry);
const caseLines = new THREE.LineSegments(
  caseEdges,
  new THREE.LineBasicMaterial({ color: 0x00ffff }),
);
const caseMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.1,
});
const pccase = new THREE.Mesh(caseGeometry, caseMaterial);
scene.add(pccase);
pccase.add(caseLines);

// Motherboard
const moboGeometry = new THREE.BoxGeometry(1.8, 3.5, 0.1);
const moboMaterial = new THREE.MeshBasicMaterial({
  color: 0x222222,
  transparent: true,
  opacity: 0.8,
});
const motherboard = new THREE.Mesh(moboGeometry, moboMaterial);
motherboard.position.x = -0.2;
scene.add(motherboard);

// CPU
const cpuGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.2);
const cpuMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaaa });
const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
cpu.position.set(-0.2, 1, 0.1); // On motherboard
scene.add(cpu);

// RAM
const ramGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.05); // Long and thin
const ramMaterial = new THREE.MeshBasicMaterial({ color: 0x00cccc });
const ram1 = new THREE.Mesh(ramGeometry, ramMaterial);
ram1.position.set(0.4, 1, 0.1); // To the right of CPU
scene.add(ram1);
const ram2 = new THREE.Mesh(ramGeometry, ramMaterial);
ram2.position.set(0.6, 1, 0.1); // To the right of CPU
scene.add(ram2);

// GPU
const gpuGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.6); // Long, short, and deep
const gpuMaterial = new THREE.MeshBasicMaterial({ color: 0x008888 });
const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
gpu.position.set(0.1, 0, 0.3); // Below CPU, sticking out
scene.add(gpu);

// PSU
const psuGeometry = new THREE.BoxGeometry(1.2, 0.8, 1);
const psuMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const psu = new THREE.Mesh(psuGeometry, psuMaterial);
psu.position.set(0, -1.3, 0); // At the bottom
scene.add(psu);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased intensity a bit
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1); // Increased intensity a bit
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(0, 0, 0); // Center the controls on the origin
controls.update();

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Dummy functions to avoid breaking script.js
window.updateComponentColor = function () {};
window.updateComponentVisibility = function () {};
