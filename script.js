let scene, camera, renderer, loader, currentModel;
const modelContainer = document.getElementById("model-viewer");

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
  modelContainer.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  loader = new THREE.GLTFLoader();
  camera.position.z = 3;
  animate();
}

function loadModel(path) {
  if (currentModel) {
    scene.remove(currentModel);
  }
  loader.load(path, (gltf) => {
    currentModel = gltf.scene;
    currentModel.scale.set(1.5, 1.5, 1.5);
    scene.add(currentModel);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (currentModel) {
    currentModel.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

// ---- شخصية عشوائية ----
const stories = [
  "ولد في قرية نائية وقرر خوض مغامرة ضد قوى الظلام.",
  "جندي قديم يبحث عن المجد والانتقام.",
  "محارب سري يختبئ بين الناس حتى تحين لحظة انطلاقه.",
  "ساحر غامض يحمل أسرار العالم القديم."
];

const rarities = [
  { name: "عادي", chance: 0.6 },
  { name: "نادر", chance: 0.25 },
  { name: "ملحمي", chance: 0.1 },
  { name: "أسطوري", chance: 0.05 }
];

function generateCharacter() {
  const story = stories[Math.floor(Math.random() * stories.length)];
  document.getElementById("story").innerText = story;

  let statsHtml = "";
  const stats = ["قوة", "سرعة", "ذكاء", "تحمل", "شجاعة", "سحر", "حظ", "دقة"];
  stats.forEach(stat => {
    statsHtml += `<li>${stat}: ${Math.floor(Math.random() * 100)}</li>`;
  });
  document.getElementById("stats").innerHTML = statsHtml;

  let rarityRoll = Math.random();
  let chosenRarity = "عادي";
  let cumulative = 0;
  for (let r of rarities) {
    cumulative += r.chance;
    if (rarityRoll <= cumulative) {
      chosenRarity = r.name;
      break;
    }
  }
  document.getElementById("rarity").innerText = chosenRarity;
}

// ---- تحميل صورة وجه ----
document.getElementById("upload-face").addEventListener("click", () => {
  document.getElementById("face-input").click();
});

document.getElementById("face-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && currentModel) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const texture = new THREE.TextureLoader().load(event.target.result);
      currentModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
    };
    reader.readAsDataURL(file);
  }
});

// ---- أحداث الأزرار ----
document.getElementById("model-select").addEventListener("change", (e) => {
  loadModel(e.target.value);
});

document.getElementById("generate").addEventListener("click", generateCharacter);

init();
loadModel("assets/models/body.glb");
