import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const canvas = document.getElementById('webgl');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// マウス座標（NDC）
window.addEventListener('mousemove', (e) => {
  mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;
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

const raycaster = new THREE.Raycaster();
const mouseNdc = new THREE.Vector2();

const state = {
  hovered: null,
};

const museum = new THREE.Group();
scene.add(museum);

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

const spacing = 3;
const count = geometries.length;
const startX = -((count - 1) * spacing) / 2;

geometries.forEach((geometry, i) => {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ wireframe: true })
  );
  mesh.position.x = startX + i * spacing;
  museum.add(mesh);
});

const updateHovered = () => {
  raycaster.setFromCamera(mouseNdc, camera);
  const hits = raycaster.intersectObjects(museum.children, false);
  const hit = hits[0]?.object ?? null;

  if (state.hovered !== hit) {
    // 前を戻す
    state.hovered?.material.color.set(0xffffff);

    // 更新
    state.hovered = hit;

    // 新しいhover
    state.hovered?.material.color.set(0xffcc00);
  }
};

const tick = () => {
  updateHovered();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
