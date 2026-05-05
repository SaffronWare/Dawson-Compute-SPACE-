import * as THREE from "three"


const scene = new THREE.Scene();

let target_z= 45;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const canvas = document.querySelector("#bg");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //alpha: true,


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

  curr_radius = Math.floor(Math.random() * radius_initial);
  curr_theta_angle = Math.random() * 2 * Math.PI;
  curr_phi_angle = Math.random() * Math.PI;

  positions[index + 0] = curr_radius * Math.sin(curr_phi_angle) * Math.cos(curr_theta_angle); // x
  positions[index + 1] = curr_radius * Math.sin(curr_phi_angle) * Math.sin(curr_theta_angle);   // y
  positions[index + 2] = curr_radius * Math.cos(curr_phi_angle); // z
  
  //positions[index + 0] = (Math.random() - 0.5) * radius_initial; // x
  //positions[index + 1] = (Math.random() - 0.5) * radius_initial; // y
  //    positions[index + 2] = (Math.random() - 0.5) * radius_initial; // z
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

  mouseAttractor.x = mouseX * 80;
  mouseAttractor.y = mouseY * 80;
  mouseAttractor.z = 0;
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const drifts = new Float32Array(particleCount * 3);
let drift_strength = 0.5;

for (let i = 0; i < particleCount; i++) {
  const index = i * 3;

  drifts[index + 0] = (Math.random() - 0.5) * drift_strength;
  drifts[index + 1] = (Math.random() - 0.5) * drift_strength;
  drifts[index + 2] = (Math.random() - 0.5) * drift_strength;
}

const at = 10;
const bt = 28;
const ct = 8/3;
let time = 0;
const clock = new THREE.Clock();
let drift_angle = THREE.MathUtils.degToRad(0)

function updateParticles(dt) {
  let a = at ;
  let b = bt;
  let c = ct;
  const strength = 0.1 * Math.min((time-1)**5 / 5, 1); // Gradually increase strength over time

  //drift_angle += 0.1 * dt; // Slowly rotate the drift direction

  

  for (let i = 0; i < particleCount; i++) {
    
    const index = i * 3;

    

    let x = positions[index + 0]+ 10;
    let y = positions[index + 1];
    let z = positions[index + 2];
    let xt = x * Math.cos(drift_angle) - z * Math.sin(drift_angle);
    let zt = x * Math.sin(drift_angle) + z * Math.cos(drift_angle);

    let brightness = Math.min(1,(0.005* ((x-10)*(x-10)/15+y*y))**2);

    colors[index + 0] = brightness; // r
    colors[index + 1] = brightness; // g
    colors[index + 2] = brightness; // b

    

    let dx = 0;
    let dy = 0;
    let dz = 0;

    if (time > 1.5) {
        const angle = drift_angle;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const xt = x * cosA - z * sinA;
        const yt = y;
        const zt = x * sinA + z * cosA;

        const dxt = a * (yt - xt);
        const dyt = xt * (b - zt) - yt;
        const dzt = xt * yt - c * zt;

        dx = dxt * cosA + dzt * sinA;
        dy = dyt;
        dz = -dxt * sinA + dzt * cosA;

        dx += (mouseAttractor.x - x) * 1.5;
        dy += (mouseAttractor.y - y) * 1.5;
        dz += (mouseAttractor.z - z) * 1.5;
    }




    positions[index + 0] += dx * strength * dt + drifts[index + 0] * dt;
    positions[index + 1] += dy * strength * dt + drifts[index + 1] * dt;
    positions[index + 2] += dz * strength * dt + drifts[index + 2] * dt;
  }
  geometry.attributes.color.needsUpdate = true;
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