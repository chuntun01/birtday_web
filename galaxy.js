import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// 1. KHỞI TẠO CÁC THÀNH PHẦN CƠ BẢN
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById("container");

if (!container) {
  console.error(
    "Container element with id 'container' not found! Please add <div id='container'></div> to your HTML."
  );
} else {
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 50;

// Tự động xoay ngang trên thiết bị di động
function lockLandscape() {
  if (
    window.screen &&
    window.screen.orientation &&
    window.screen.orientation.lock
  ) {
    window.screen.orientation
      .lock("landscape")
      .then(() => console.log("Screen locked to landscape"))
      .catch((err) => {
        console.warn("Could not lock orientation:", err);
        // Fallback: Hiển thị thông báo cho người dùng nếu không khóa được
        alert(
          "Please rotate your device to landscape mode for the best experience."
        );
      });
  } else {
    console.warn(
      "Screen Orientation API not supported. Please rotate manually."
    );
    alert(
      "Please rotate your device to landscape mode for the best experience."
    );
  }
}

// Phát hiện thiết bị di động và yêu cầu xoay ngang
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  lockLandscape();
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Kiểm tra lại và yêu cầu xoay nếu không phải landscape
      if (window.orientation !== 90 && window.orientation !== -90) {
        lockLandscape();
      }
    }, 100);
  });
}

// 2. THÊM CÁC ĐỐI TƯỢNG VÀO SCENE
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(
  "./assets/background.jpg",
  undefined,
  (error) => {
    console.error("Failed to load background texture:", error);
  }
);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

const planetTexture = textureLoader.load(
  "./assets/OIP.webp",
  undefined,
  (error) => {
    console.error("Failed to load planet texture:", error);
  }
);
const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  const z = (Math.random() - 0.5) * 200;
  starVertices.push(x, y, z);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const ringTexts = window.dataLove.ringTexts || ["I Love You"];
const fontLoader = new FontLoader();
const textGroup = new THREE.Group();
const additionalTextGroup = new THREE.Group();

// Hàm tạo màu ngẫu nhiên
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return parseInt(color.replace("#", "0x"), 16);
}

fontLoader.load(
  "./assets/font.json",
  (font) => {
    ringTexts.forEach((text, index) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0.1,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshStandardMaterial({
        color: getRandomColor(),
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      const angle = (index / ringTexts.length) * Math.PI * 2;
      const radius = 4;
      textMesh.position.x = Math.cos(angle) * radius;
      textMesh.position.z = Math.sin(angle) * radius;
      textMesh.lookAt(0, 0, 0);
      textGroup.add(textMesh);
    });
    scene.add(textGroup);

    const newTexts = ["Forever Yours", "Eternal Love"];
    newTexts.forEach((text, index) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0.1,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshStandardMaterial({
        color: getRandomColor(),
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      const angle = (index / newTexts.length) * Math.PI * 2 + Math.PI / 2;
      const radius = 5;
      textMesh.position.x = Math.cos(angle) * radius;
      textMesh.position.z = Math.sin(angle) * radius;
      textMesh.lookAt(0, 0, 0);
      additionalTextGroup.add(textMesh);
    });
    planet.add(additionalTextGroup);
  },
  undefined,
  (error) => {
    console.error("Failed to load font:", error);
    const defaultTextMaterial = new THREE.MeshBasicMaterial({
      color: getRandomColor(),
    });
    ringTexts.forEach((text, index) => {
      const textGeometry = new TextGeometry(text, {
        size: 0.5,
        height: 0.1,
      });
      textGeometry.center();
      const textMesh = new THREE.Mesh(textGeometry, defaultTextMaterial);
      const angle = (index / ringTexts.length) * Math.PI * 2;
      const radius = 4;
      textMesh.position.x = Math.cos(angle) * radius;
      textMesh.position.z = Math.sin(angle) * radius;
      textMesh.lookAt(0, 0, 0);
      textGroup.add(textMesh);
    });
    scene.add(textGroup);

    const newTexts = ["Forever Yours", "Eternal Love"];
    newTexts.forEach((text, index) => {
      const textGeometry = new TextGeometry(text, {
        size: 0.5,
        height: 0.1,
      });
      textGeometry.center();
      const textMesh = new THREE.Mesh(textGeometry, defaultTextMaterial);
      const angle = (index / newTexts.length) * Math.PI * 2 + Math.PI / 2;
      const radius = 5;
      textMesh.position.x = Math.cos(angle) * radius;
      textMesh.position.z = Math.sin(angle) * radius;
      textMesh.lookAt(0, 0, 0);
      additionalTextGroup.add(textMesh);
    });
    planet.add(additionalTextGroup);
  }
);

// ======================================================
// CẬP NHẬT: CODE CHO CÁC ẢNH TRÔI NỔI VỚI KHUNG VÀ VIỀN
// ======================================================

const floatingImageFrames = [];
const floatingImages = window.dataLove.floatingImages || [];
const DUPLICATES_PER_IMAGE = 30;
const IMAGE_SIZE = 1.5;
const BORDER_THICKNESS = 0.05;
const RADIUS_RANGE = 12;

// Hàm tạo texture bo tròn góc từ một ảnh gốc
function createRoundedTexture(originalTexture, radius = 0.2) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const image = originalTexture.image;
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const cornerRadius = radius * Math.min(canvas.width, canvas.height);
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.moveTo(cornerRadius, 0);
  ctx.lineTo(canvas.width - cornerRadius, 0);
  ctx.arc(
    canvas.width - cornerRadius,
    cornerRadius,
    cornerRadius,
    -Math.PI / 2,
    0,
    false
  );
  ctx.lineTo(canvas.width, canvas.height - cornerRadius);
  ctx.arc(
    canvas.width - cornerRadius,
    canvas.height - cornerRadius,
    cornerRadius,
    0,
    Math.PI / 2,
    false
  );
  ctx.lineTo(cornerRadius, canvas.height);
  ctx.arc(
    cornerRadius,
    canvas.height - cornerRadius,
    cornerRadius,
    Math.PI / 2,
    Math.PI,
    false
  );
  ctx.lineTo(0, cornerRadius);
  ctx.arc(
    cornerRadius,
    cornerRadius,
    cornerRadius,
    Math.PI,
    (3 * Math.PI) / 2,
    false
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const roundedTexture = new THREE.CanvasTexture(canvas);
  roundedTexture.minFilter = THREE.LinearFilter;
  roundedTexture.magFilter = THREE.LinearFilter;
  return roundedTexture;
}

// Tạo texture bo tròn cho khung viền trắng
function createRoundedFrameTexture(
  width,
  height,
  cornerRadius,
  borderThickness
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const frameCornerRadius = cornerRadius;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.moveTo(frameCornerRadius, 0);
  ctx.lineTo(canvas.width - frameCornerRadius, 0);
  ctx.arc(
    canvas.width - frameCornerRadius,
    frameCornerRadius,
    frameCornerRadius,
    -Math.PI / 2,
    0,
    false
  );
  ctx.lineTo(canvas.width, canvas.height - frameCornerRadius);
  ctx.arc(
    canvas.width - frameCornerRadius,
    canvas.height - frameCornerRadius,
    frameCornerRadius,
    0,
    Math.PI / 2,
    false
  );
  ctx.lineTo(frameCornerRadius, canvas.height);
  ctx.arc(
    frameCornerRadius,
    canvas.height - frameCornerRadius,
    frameCornerRadius,
    Math.PI / 2,
    Math.PI,
    false
  );
  ctx.lineTo(0, frameCornerRadius);
  ctx.arc(
    frameCornerRadius,
    frameCornerRadius,
    frameCornerRadius,
    Math.PI,
    (3 * Math.PI) / 2,
    false
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const frameTexture = new THREE.CanvasTexture(canvas);
  frameTexture.minFilter = THREE.LinearFilter;
  frameTexture.magFilter = THREE.LinearFilter;
  return frameTexture;
}

// Tạo nhiều bản sao ngẫu nhiên cho mỗi ảnh
floatingImages.forEach((imagePath) => {
  textureLoader.load(
    imagePath,
    (loadedTexture) => {
      const roundedTexture = createRoundedTexture(loadedTexture);

      for (let duplicate = 0; duplicate < DUPLICATES_PER_IMAGE; duplicate++) {
        const aspectRatio =
          loadedTexture.image.width / loadedTexture.image.height;
        const width = IMAGE_SIZE * aspectRatio;
        const height = IMAGE_SIZE;
        const cornerRadius = 0.2 * Math.min(width, height);

        const imageGeometry = new THREE.PlaneGeometry(width, height);
        const imageMaterial = new THREE.MeshBasicMaterial({
          map: roundedTexture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);

        const frameWidth = width + BORDER_THICKNESS * 2;
        const frameHeight = height + BORDER_THICKNESS * 2;
        const frameCornerRadius = cornerRadius + BORDER_THICKNESS;
        const frameTexture = createRoundedFrameTexture(
          frameWidth,
          frameHeight,
          frameCornerRadius,
          BORDER_THICKNESS
        );
        const frameGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
        const frameMaterial = new THREE.MeshBasicMaterial({
          map: frameTexture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);

        const frameGroup = new THREE.Group();
        frameGroup.add(frameMesh);
        frameGroup.add(imageMesh);
        imageMesh.position.x = 0;
        imageMesh.position.y = 0;
        imageMesh.position.z = 0.001;

        const angle = Math.random() * Math.PI * 2;
        const currentRadius = 5 + Math.random() * RADIUS_RANGE * 1.5;
        frameGroup.position.x = Math.cos(angle) * currentRadius;
        frameGroup.position.z = Math.sin(angle) * currentRadius;
        frameGroup.position.y = (Math.random() - 0.5) * RADIUS_RANGE * 1.2;

        floatingImageFrames.push(frameGroup);
        planet.add(frameGroup);
      }
    },
    undefined,
    (err) => console.error(`Failed to load floating image: ${imagePath}`, err)
  );
});

// ======================================================
// KẾT THÚC: CODE CHO CÁC ẢNH TRÔI NỔI
// ======================================================

// 3. VỊ TRÍ CAMERA
camera.position.z = 30;

// 4. VÒNG LẶP ANIMATION
function animate() {
  requestAnimationFrame(animate);

  planet.rotation.y += 0.005;
  stars.rotation.y += 0.001;
  textGroup.rotation.y += 0.02;

  textGroup.children.forEach((textMesh) => {
    textMesh.lookAt(camera.position);
  });

  floatingImageFrames.forEach((frameGroup) => {
    frameGroup.lookAt(camera.position);
    frameGroup.rotation.y +=
      0.002 * Math.sin(Date.now() * 0.001 + frameGroup.position.x);
    frameGroup.rotation.x +=
      0.001 * Math.cos(Date.now() * 0.0008 + frameGroup.position.y);
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// 5. XỬ LÝ KHI THAY ĐỔI KÍCH THƯỚC CỬA SỔ
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
