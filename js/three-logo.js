console.log('✅ three-logo.js NUEVO cargado', import.meta.url);

import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.161.0/examples/jsm/loaders/DRACOLoader.js';
import { FontLoader } from 'https://unpkg.com/three@0.161.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.161.0/examples/jsm/geometries/TextGeometry.js';

let __started = false;

export function initThreeLogo(canvas) {
  if (!canvas) {
    console.warn('initThreeLogo: canvas null');
    return;
  }
  if (__started) return; // evita doble init si Lit re-renderiza
  __started = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: false,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const lightKey = new THREE.DirectionalLight(0xffffff, 1.3);
  lightKey.position.set(2, 2, 4);
  scene.add(lightKey);

  const lightFill = new THREE.PointLight(0x7c3aed, 0.9);
  lightFill.position.set(-3, -2, 2);
  scene.add(lightFill);

  const rim = new THREE.DirectionalLight(0x60a5fa, 0.7);
  rim.position.set(-2, 3, -2);
  scene.add(rim);

  const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
  frontLight.position.set(0, 0, 4);
  scene.add(frontLight);

  const metal = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.2,
  });

  const logo = new THREE.Group();
  scene.add(logo);

  // GLTF + DRACO
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    './assets/logo/bs-studio.glb',
    (gltf) => {
      const root = gltf.scene;
      root.traverse((o) => {
        if (o.isMesh) {
          o.material = metal;
          o.frustumCulled = false;
        }
      });

      root.scale.setScalar(1.6);
      root.position.set(0, 0.2, 0);

      logo.add(root);
      addStudioText();

      dracoLoader.dispose();
    },
    undefined,
    (error) => {
      console.warn('Error al cargar GLB:', error);
      buildTextFallback();
    }
  );

  function buildTextFallback() {
    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://sdardev.com/sbstudio/assets/fonts/helvetiker_regular.typeface.json',
      (font) => {
        const common = { font, size: 1.4, height: 0.28, bevelEnabled: true };

        const geoB = new TextGeometry('B', common);
        const meshB = new THREE.Mesh(geoB, metal);
        meshB.position.set(-1, 0.25, 0);

        const geoS = new TextGeometry('S', common);
        const meshS = new THREE.Mesh(geoS, metal);
        meshS.position.set(0, -0.15, 0.02);

        meshB.rotation.z = THREE.MathUtils.degToRad(-2);
        meshS.rotation.z = THREE.MathUtils.degToRad(8);

        logo.add(meshB, meshS);
        addStudioText(font);
      },
      undefined,
      (e) => console.warn('No se pudo cargar font fallback:', e)
    );
  }

  function addStudioText(fontOpt) {
    const add = (font) => {
      const geo = new TextGeometry('STUDIO', { font, size: 0.38, height: 0.08 });
      geo.computeBoundingBox();

      const mesh = new THREE.Mesh(geo, metal.clone());
      const w = geo.boundingBox.max.x - geo.boundingBox.min.x;
      mesh.position.set(-w / 2, -1.7, 0);
      logo.add(mesh);
    };

    if (fontOpt) return add(fontOpt);

    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://unpkg.com/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json',
      (font) => add(font),
      undefined,
      (e) => console.warn('No se pudo cargar font remote:', e)
    );
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (h <= 1) return;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);

  // iOS: varios reintentos iniciales
  resize();
  requestAnimationFrame(resize);
  setTimeout(resize, 100);
  setTimeout(resize, 300);
  setTimeout(resize, 600);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
  }

  let t = 0;
  function animate() {
    t += 0.01;
    logo.rotation.y += 0.008;
    logo.rotation.x = Math.sin(t * 0.5) * 0.08;
    lightFill.intensity = 0.7 + Math.sin(t) * 0.2;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
