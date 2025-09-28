import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/loaders/GLTFLoader.js";

// عناصر HTML
const characterSelect = document.getElementById("characterSelect");
const generateBtn = document.getElementById("generateBtn");
const storyBox = document.getElementById("storyBox");

// إعداد المشهد
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById("viewer").appendChild(renderer.domElement);

// إضاءة
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// أدوات تحكم
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.5, 3);
controls.update();

// لودر
const loader = new GLTFLoader();
let currentModel = null;

// تحميل الموديل
function loadModel(modelName) {
  const modelPath = `assets/models/${modelName}`;
  loader.load(
    modelPath,
    (gltf) => {
      if (currentModel) {
        scene.remove(currentModel);
      }
      currentModel = gltf.scene;
      currentModel.position.set(0, -1, 0);
      scene.add(currentModel);
    },
    undefined,
    (error) => console.error("حدث خطأ أثناء تحميل الموديل:", error)
  );
}

// القصة العشوائية
const stories = [
  "في عالم بعيد، الشخصية انطلقت في مغامرة ملحمية.",
  "بين الجبال والوديان، الشخصية اكتشفت سرًا قديمًا.",
  "في مدينة مظلمة، الشخصية قررت أن تكون بطلة القصة.",
  "على شاطئ البحر، الشخصية بدأت رحلة جديدة مليئة بالأسرار."
];

// زر التوليد
generateBtn.addEventListener("click", () => {
  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  storyBox.innerText = randomStory;

  const selectedModel = characterSelect.value;
  loadModel(selectedModel);
});

// تشغيل العرض
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
