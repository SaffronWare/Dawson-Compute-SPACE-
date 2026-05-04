import * as THREE from "three"


const scene = new THREE.Scene();

let target_z= 45;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const canvas = document.querySelector("#bg");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const particleCount = 400000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);


let radius_initial = 300;
let curr_radius = 0;
let curr_theta_angle = 0;
let curr_phi_angle = 0;

for (let i = 0; i < particleCount; i++) {
  const index = i * 3;

  curr_radius = Math.random() * radius_initial;
  curr_theta_angle = Math.random() * 2 * Math.PI;
  curr_phi_angle = Math.random() * Math.PI;

  positions[index + 0] = curr_radius * Math.sin(curr_phi_angle) * Math.cos(curr_theta_angle); // x
  positions[index + 1] = curr_radius * Math.sin(curr_phi_angle) * Math.sin(curr_theta_angle);   // y
  positions[index + 2] = curr_radius * Math.cos(curr_phi_angle); // z
  
  //positions[index + 0] = (Math.random() - 0.5) * 50; // x
  //positions[index + 1] = (Math.random() - 0.5) * 50; // y
  //positions[index + 2] = (Math.random() - 0.5) * 50; // z
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
  vertexColors: true,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const mouseAttractor = {
  x: 0,
  y: 0,
  z: 0
};

window.addEventListener("mousemove", (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  mouseAttractor.x = mouseX * 10;
  mouseAttractor.y = mouseY * 10;
  mouseAttractor.z = 0;
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const drifts = new Float32Array(particleCount * 3);
let drift_strength = 2;

for (let i = 0; i < particleCount; i++) {
  const index = i * 3;

  drifts[index + 0] = (Math.random() - 0.5) * drift_strength;
  drifts[index + 1] = (Math.random() - 0.5) * drift_strength;
  drifts[index + 2] = (Math.random() - 0.5) * drift_strength;
}

const a = 10;
const b = 28;
const c = 8/3;
let time = 0;
const clock = new THREE.Clock();
function updateParticles(dt) {
  const strength = 0.1 * Math.min((time-1)**5 / 5, 1); // Gradually increase strength over time

  

  for (let i = 0; i < particleCount; i++) {
    
    const index = i * 3;

    

    let x = positions[index + 0];
    let y = positions[index + 1];
    let z = positions[index + 2];

    let brightness = Math.min(1,(0.005* (x*x/15+y*y))**2);

    colors[index + 0] = brightness; // r
    colors[index + 1] = brightness; // g
    colors[index + 2] = brightness; // b

    

    let dx = 0;
    let dy = 0;
    let dz = 0;

    if (time > 1.5)
    {
        dx = a * (y - x + mouseAttractor.x);
        dy = x * (b - z + mouseAttractor.y) - y;
        dz = x * y - c * z;
    }




    positions[index + 0] += dx * strength * dt + drifts[index + 0] * dt;
    positions[index + 1] += dy * strength * dt + drifts[index + 1] * dt;
    positions[index + 2] += dz * strength * dt + drifts[index + 2] * dt;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
}


function animate() {
  
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  time += dt;

  camera.position.z += (target_z - camera.position.z) * dt;

  updateParticles(dt);

  renderer.render(scene, camera);
}

animate();