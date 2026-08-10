/* ===================================
   Soft Dhaaga — Interactive 3D Canvas Rakhi (Three.js)
   Real code-based 3D rendered animated Rakhi
   with Photo Frame in Center
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Rakhi3D = (function () {
  let container = null;
  let scene, camera, renderer;
  let rakhiGroup, centerMedallion;
  let beads = [];
  let animFrameId = null;

  let isDragging = false;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let currentRotationX = 0, currentRotationY = 0;
  let tiltX = 0, tiltY = 0;

  function init() {
    container = document.getElementById('rakhi-3d-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded yet');
      return;
    }

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene setup
    scene = new THREE.Scene();

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffe6a3, 1.6);
    mainLight.position.set(5, 8, 8);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0xd98e8e, 1.5, 20);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    const goldGlowLight = new THREE.PointLight(0xcba35c, 2.2, 15);
    goldGlowLight.position.set(0, 0, 3);
    scene.add(goldGlowLight);

    // 5. Create 3D Rakhi Group
    buildRakhi3D();

    // 6. Interaction listeners
    bindEvents();

    // 7. Render loop
    animate(0);
  }

  function buildRakhi3D() {
    rakhiGroup = new THREE.Group();
    scene.add(rakhiGroup);

    // Gold material
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xcba35c,
      metalness: 0.85,
      roughness: 0.22,
      emissive: 0x3d2c10,
    });

    // Crimson silk material
    const silkMaterial = new THREE.MeshStandardMaterial({
      color: 0xc93b4a,
      metalness: 0.1,
      roughness: 0.4,
    });

    // --- Central Medallion ---
    centerMedallion = new THREE.Group();
    rakhiGroup.add(centerMedallion);

    // Outer Ring (Torus)
    const outerRingGeo = new THREE.TorusGeometry(1.9, 0.15, 16, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, goldMaterial);
    centerMedallion.add(outerRing);

    // Inner Beaded Ring
    const beadCount = 16;
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const beadGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const bead = new THREE.Mesh(beadGeo, goldMaterial);
      bead.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0.05);
      centerMedallion.add(bead);
    }

    // Floral Petals (Octagram Star Base)
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.4, 0.9, 4);
      const petal = new THREE.Mesh(petalGeo, goldMaterial);
      petal.rotation.z = angle - Math.PI / 2;
      petal.rotation.x = Math.PI / 2;
      petal.position.set(Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 0);
      centerMedallion.add(petal);
    }

    // Inner Base Plate (Backing Plate)
    const basePlateGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.1, 32);
    const basePlate = new THREE.Mesh(basePlateGeo, silkMaterial);
    basePlate.rotation.x = Math.PI / 2;
    centerMedallion.add(basePlate);

    // --- BROTHER & SISTER PHOTO DISC ---
    const photoGeo = new THREE.CircleGeometry(1.18, 64);

    // Load photo texture with fallbacks
    const textureLoader = new THREE.TextureLoader();

    function applyTexture(texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      const photoMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const photoMesh = new THREE.Mesh(photoGeo, photoMaterial);
      photoMesh.position.z = 0.16; // Position clearly above base plate
      centerMedallion.add(photoMesh);

      // Inner Gold Bezel Ring framing the photo cleanly
      const innerBezelGeo = new THREE.TorusGeometry(1.18, 0.06, 16, 64);
      const innerBezel = new THREE.Mesh(innerBezelGeo, goldMaterial);
      innerBezel.position.z = 0.18;
      centerMedallion.add(innerBezel);
    }

    textureLoader.load(
      'images/bro.jpeg',
      function (texture) {
        applyTexture(texture);
      },
      undefined,
      function () {
        // Fallback 1
        textureLoader.load(
          'images/bro.jpg',
          function (tex) { applyTexture(tex); },
          undefined,
          function () {
            // Fallback 2
            textureLoader.load('images/brother-sister.jpg', function (tex2) {
              applyTexture(tex2);
            });
          }
        );
      }
    );

    // --- Side Silk Threads & Decorative Beads ---
    createThreadAndBeads(-1, goldMaterial, silkMaterial);
    createThreadAndBeads(1, goldMaterial, silkMaterial);
  }

  function createThreadAndBeads(direction, goldMat, silkMat) {
    const points = [];
    const segs = 15;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const x = direction * (1.9 + t * 4.5);
      const y = Math.sin(t * Math.PI * 2) * 0.25 * direction;
      const z = Math.cos(t * Math.PI) * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
    const threadMesh = new THREE.Mesh(tubeGeo, silkMat);
    rakhiGroup.add(threadMesh);

    const beadPositions = [0.2, 0.45, 0.7, 0.9];
    beadPositions.forEach(function (pos, index) {
      const point = curve.getPoint(pos);
      const isGold = index % 2 === 0;
      const beadGeo = isGold
        ? new THREE.SphereGeometry(0.2, 12, 12)
        : new THREE.CylinderGeometry(0.15, 0.15, 0.3, 12);

      const beadMesh = new THREE.Mesh(beadGeo, isGold ? goldMat : silkMat);
      beadMesh.position.copy(point);
      beadMesh.rotation.z = Math.PI / 2;
      rakhiGroup.add(beadMesh);
      beads.push(beadMesh);
    });
  }

  function bindEvents() {
    window.addEventListener('resize', onWindowResize);

    const landingSec = document.getElementById('landing');
    if (!landingSec) return;

    landingSec.addEventListener('pointerdown', onPointerDown);
    landingSec.addEventListener('pointermove', onPointerMove);
    landingSec.addEventListener('pointerup', onPointerUp);

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma !== null && e.beta !== null) {
          tiltX = Math.max(-20, Math.min(20, e.gamma)) * 0.02;
          tiltY = Math.max(-20, Math.min(20, e.beta - 45)) * 0.02;
        }
      }, { passive: true });
    }
  }

  function onPointerDown(e) {
    isDragging = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - mouseX;
    const deltaY = e.clientY - mouseY;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.008;

    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate(time) {
    animFrameId = requestAnimationFrame(animate);

    const t = time * 0.001;

    if (rakhiGroup) {
      const floatY = Math.sin(t * 1.5) * 0.25;
      const idleRotZ = Math.sin(t * 0.8) * 0.08;

      rakhiGroup.position.y = floatY;

      currentRotationX += (targetRotationX + tiltY - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY + tiltX - currentRotationY) * 0.08;

      rakhiGroup.rotation.x = currentRotationX + Math.sin(t * 0.5) * 0.1;
      rakhiGroup.rotation.y = currentRotationY + t * 0.2; // smooth spin
      rakhiGroup.rotation.z = idleRotZ;

      if (centerMedallion) {
        centerMedallion.rotation.z = Math.sin(t * 2) * 0.05;
      }
    }

    renderer.render(scene, camera);
  }

  function destroy() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener('resize', onWindowResize);
  }

  return {
    init: init,
    destroy: destroy,
  };
})();
