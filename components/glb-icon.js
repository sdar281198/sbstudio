// public/components/glb-icon.js
import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

class GlbIcon extends HTMLElement {
  connectedCallback() {
    const canvas = document.createElement("canvas");
    canvas.className = "w-full h-full";
    this.append(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 4;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2,2,3);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(this.getAttribute("src"), (gltf) => {
      const model = gltf.scene;
      model.scale.set(1,1,1);
      scene.add(model);

      function anim() {
        model.rotation.y += 0.10;
        renderer.render(scene, camera);
        requestAnimationFrame(anim);
      }
      anim();
    });
  }
}

customElements.define("glb-icon", GlbIcon);
