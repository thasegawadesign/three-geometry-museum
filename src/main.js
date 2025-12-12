import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

console.log(THREE);

const canvas = document.getElementById('webgl');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;
controls.enablePan = false;

const geometries = [
  new THREE.BoxGeometry(),
  new THREE.SphereGeometry(),
  new THREE.ConeGeometry(),
  new THREE.CylinderGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusKnotGeometry(),
  new THREE.DodecahedronGeometry(),
  new THREE.OctahedronGeometry(),
  new THREE.TetrahedronGeometry(),
  new THREE.IcosahedronGeometry(),
];
geometries.forEach((geometry, i) => {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ wireframe: true })
  );
  mesh.position.x = (i - 1) * 2.5;
  scene.add(mesh);
});

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
