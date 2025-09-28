let scene, camera, renderer, loader, currentModel, faceTexture;

// إعداد المشهد
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// إضاءة
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Loader
loader = new THREE.GLTFLoader();

// تحميل موديل
function loadModel(path) {
  if (currentModel) {
    scene.remove(currentModel);
  }
  loader.load(`assets/models/${path}`, (gltf) => {
    currentModel = gltf.scene;
    currentModel.scale.set(1,1,1);
    scene.add(currentModel);

    if (faceTexture) applyFaceTexture(faceTexture);
  });
}

// تطبيق صورة الوجه
function applyFaceTexture(texture) {
  if (!currentModel) return;
  currentModel.traverse((child) => {
    if (child.isMesh) {
      child.material.map = texture;
      child.material.needsUpdate = true;
    }
  });
}

// أزرار
document.getElementById("generateBtn").addEventListener("click", () => {
  const select = document.getElementById("characterSelect");
  loadModel(select.value);
});

document.getElementById("storyBtn").addEventListener("click", () => {
  document.getElementById("storyBox").style.display = "block";
  document.getElementById("storyBox").innerText = "📖 قصة الشخصية: بطل شجاع يبحث عن الحقيقة في عالم غامض.";
});

document.getElementById("statsBtn").addEventListener("click", () => {
  document.getElementById("statsBox").style.display = "block";
  document.getElementById("statsBox").innerText = "⚔️ القوة: 80\n🛡️ الدفاع: 70\n⚡ السرعة: 65";
});

document.getElementById("rarityBtn").addEventListener("click", () => {
  document.getElementById("rarityBox").style.display = "block";
  document.getElementById("rarityBox").innerText = "⭐ الندرة: نادرة";
});

// رفع صورة الوجه
document.getElementById("uploadFace").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const textureLoader = new THREE.TextureLoader();
      faceTexture = textureLoader.load(ev.target.result, () => {
        applyFaceTexture(faceTexture);
      });
    };
    reader.readAsDataURL(file);
  }
});

// أنيميشن
function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
