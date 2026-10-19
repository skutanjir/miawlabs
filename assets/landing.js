import routerIcon from './miawrouter-mascot-router.png';
import codeIcon from './miawcode-icon.svg';
import ideIcon from './miawcode-ide-icon.svg';
// Core controls stay usable even if a visual dependency fails to load.
let animate = null;

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const switches = [...document.querySelectorAll('[data-product]')];
const details = [...document.querySelectorAll('[data-detail]')];
const sceneHost = document.querySelector('#scene');
let selectModule = () => {};
let product = 'router';

function reveal(target, distance = 18) {
  if (animate && !reduced.matches) animate(target, { opacity: [0, 1], translateY: [distance, 0], duration: 600, ease: 'out(3)' });
}

function selectProduct(next) {
  if (!details.some(detail => detail.dataset.detail === next)) return;
  product = next;
  switches.forEach(button => {
    const active = button.dataset.product === next;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-active', active);
  });
  details.forEach(detail => detail.classList.toggle('is-active', detail.dataset.detail === next));
  const active = details.find(detail => detail.dataset.detail === next);
  // The section's accessible name follows the visible product heading.
  details.forEach(detail => detail.querySelector('h2').removeAttribute('id'));
  active.querySelector('h2').id = 'product-title';
  reveal(active);
  selectModule(next);
}

switches.forEach(button => button.addEventListener('click', () => selectProduct(button.dataset.product)));
document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-mode-panel]').forEach(panel => {
      const active = panel.dataset.modePanel === button.dataset.mode;
      panel.classList.toggle('is-active', active);
      if (active) reveal(panel, 10);
    });
  });
});

// Section motion stays native CSS; visibility and one shared pause switch govern it.
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
}, { threshold: 0.12 });
document.querySelectorAll('.products, .modes, .connection, .install').forEach(section => sectionObserver.observe(section));
document.querySelectorAll('.mode-panel pre code').forEach(code => {
  const lines = code.textContent.split('\n');
  code.replaceChildren(...lines.map((text, index) => {
    const line = document.createElement('span');
    line.className = 'demo-line';
    line.style.setProperty('--line', index);
    line.textContent = text || ' ';
    if (/PASS|done|FIX|^#/.test(text)) line.classList.add('terminal-green');
    if (/HIGH/.test(text)) line.classList.add('terminal-orange');
    return line;
  }));
});
document.querySelectorAll('.spec-sheet, .editor, .install-grid > article').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - 0.5) * -6}deg`);
    card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 8}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
});

const copyStatus = document.querySelector('#copy-status');
if (navigator.clipboard && window.isSecureContext) {
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        copyStatus.textContent = 'Commands copied. Review before running in your terminal.';
      } catch {
        copyStatus.textContent = 'Clipboard unavailable. Select and copy the command text instead.';
      }
    });
  });
}

import('./vendor/anime.esm.min.js').then(({ animate: run, stagger }) => {
  animate = run;
  if (reduced.matches) return;
  animate('.hero-copy > *', { opacity: [0, 1], translateY: [25, 0], delay: stagger(85), duration: 900, ease: 'out(3)' });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target, 28);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-top, .install-heading, .install-grid, .route').forEach(node => observer.observe(node));
}).catch(() => { /* Static content and native controls need no animation library. */ });

function setupScene(THREE) {
  const canvas = document.querySelector('#webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  camera.position.set(5.8, 5.2, 8.7);
  camera.lookAt(0, 0.6, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7d886c, 3));
  const key = new THREE.DirectionalLight(0xffffff, 5);
  key.position.set(3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -5;
  key.shadow.normalBias = 0.035;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd5f45a, 2.5);
  rim.position.set(-4, 2, -4);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.ShadowMaterial({ opacity: 0.16 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.4;
  floor.receiveShadow = true;
  scene.add(floor);

  const assembly = new THREE.Group();
  assembly.rotation.y = -0.2;
  scene.add(assembly);
  const modules = [];
  const clickable = [];
  const beacons = [];
  const loader = new THREE.TextureLoader();
  const config = [
    { id: 'router', color: 0xc7ddad, icon: routerIcon, y: -0.55, title: 'MIAWROUTER', sub: 'LOCAL GATEWAY  /  :21128', angle: -0.15 },
    { id: 'code', color: 0x273629, icon: codeIcon, y: 0.65, title: 'MIAWCODE', sub: 'TERMINAL ENGINE  /  0.1.3', angle: 0.12 },
    { id: 'ide', color: 0xe7e9dc, icon: ideIcon, y: 1.85, title: 'MIAWCODE IDE', sub: 'WORKSPACE  /  IN DEVELOPMENT', angle: -0.08 },
  ];

  function roundedBox(width, height, depth, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2, y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: depth - 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04, curveSegments: 8 });
    geometry.translate(0, 0, -depth / 2 + 0.04);
    return geometry;
  }

  function labelTexture(title, subtitle, dark) {
    const label = document.createElement('canvas');
    label.width = 1024;
    label.height = 256;
    const context = label.getContext('2d');
    context.fillStyle = dark ? '#e7efd9' : '#233020';
    context.font = 'bold 62px monospace';
    context.fillText(title, 18, 95);
    context.globalAlpha = 0.65;
    context.font = '26px monospace';
    context.fillText(subtitle, 18, 157);
    const texture = new THREE.CanvasTexture(label);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const metal = new THREE.MeshStandardMaterial({ color: 0x7b876d, roughness: 0.36, metalness: 0.7 });
  const portMaterial = new THREE.MeshStandardMaterial({ color: 0x172117, roughness: 0.7 });
  config.forEach((item, index) => {
    const module = new THREE.Group();
    module.position.y = item.y;
    module.rotation.y = item.angle;
    module.userData = { id: item.id, baseY: item.y, baseAngle: item.angle };
    assembly.add(module);
    modules.push(module);
    const idle = new THREE.Group();
    module.add(idle);
    const body = new THREE.Mesh(roundedBox(3.4, 0.74, 2.15, 0.17), new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.42, metalness: 0.18 }));
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.product = item.id;
    idle.add(body);
    clickable.push(body);
    module.userData.idle = idle;
    const strip = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.035, 0.02), new THREE.MeshStandardMaterial({ color: 0xd5f45a, emissive: 0x7d9d29, emissiveIntensity: 0.6 }));
    strip.position.set(0, -0.29, 1.1);
    idle.add(strip);
    beacons.push(strip);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.575), new THREE.MeshBasicMaterial({ map: labelTexture(item.title, item.sub, index === 1), transparent: true, depthWrite: false }));
    label.position.set(-0.22, 0.01, 1.117);
    idle.add(label);
    for (let i = 0; i < 5; i++) {
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.13, 0.025), portMaterial);
      port.position.set(1.712, -0.12, -0.65 + i * 0.3);
      port.rotation.y = Math.PI / 2;
      idle.add(port);
    }
    [-1.48, 1.48].forEach(x => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.018, 10), metal);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(x, 0.23, 1.106);
      idle.add(screw);
    });
    loader.load(item.icon, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.86), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
      badge.rotation.x = -Math.PI / 2;
      badge.position.set(0, 0.426, 0);
      idle.add(badge);
    }, undefined, () => { /* Labels remain visible if an icon cannot load. */ });
  });

  // Open support posts keep the exploded assembly legible from every angle.
  [-1.2, 1.2].forEach(x => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.6, 12), metal);
    post.position.set(x, 0.5, -0.7);
    assembly.add(post);
  });
  const base = new THREE.Mesh(roundedBox(3.8, 0.15, 2.5, 0.25), new THREE.MeshStandardMaterial({ color: 0xb6bea6, metalness: 0.35, roughness: 0.5 }));
  base.position.y = -1.25;
  base.castShadow = true;
  base.receiveShadow = true;
  assembly.add(base);

  let paused = reduced.matches;
  let visible = true;
  let lost = false;
  let dragging = false;
  let moved = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;
  let targetY = assembly.rotation.y, targetX = 0;
  let elapsed = 0;
  let previous = 0;
  let intro = reduced.matches ? 1 : 0;
  let frame = 0;
  const motion = document.querySelector('#motion-toggle');
  const reset = document.querySelector('#reset-scene');
  motion.hidden = false;
  reset.hidden = false;
  function updateMotionButton() {
    document.body.classList.toggle('motion-paused', paused);
    motion.textContent = paused ? 'Resume motion' : 'Pause motion';
    motion.setAttribute('aria-pressed', String(paused));
  }
  updateMotionButton();
  motion.addEventListener('click', () => { paused = !paused; updateMotionButton(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; updateMotionButton(); });
  reset.addEventListener('click', () => { targetY = -0.2; targetX = 0; selectProduct('router'); });
  selectModule = next => {
    modules.forEach(module => {
      const active = module.userData.id === next;
      const target = module.userData.baseY + (active ? 0.2 : 0);
      if (!animate) { module.position.y = target; module.rotation.y = module.userData.baseAngle + (active ? -0.13 : 0); return; }
      animate(module.position, { y: target, duration: reduced.matches ? 0 : 750, ease: 'out(3)' });
      animate(module.rotation, { y: module.userData.baseAngle + (active ? -0.13 : 0), duration: reduced.matches ? 0 : 750, ease: 'out(3)' });
    });
  };
  selectModule(product);

  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragging = true;
    moved = false;
    startX = lastX = event.clientX;
    startY = lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > 6) moved = true;
    targetY += dx * 0.008;
    targetX = THREE.MathUtils.clamp(targetX + dy * 0.003, -0.28, 0.3);
    lastX = event.clientX;
    lastY = event.clientY;
  });
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  canvas.addEventListener('pointerup', event => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (!moved) {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(clickable)[0];
      if (hit) selectProduct(hit.object.userData.product);
    }
  });
  canvas.addEventListener('pointercancel', () => { dragging = false; });

  function resize() {
    const { width, height } = sceneHost.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(5.8, 5.2, 8.7);
    if (camera.aspect < 0.85) camera.position.multiplyScalar(1.12);
    camera.lookAt(0, 0.6, 0);
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(sceneHost);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start();
  });
  visibilityObserver.observe(sceneHost);
  function render(time) {
    frame = 0;
    if (document.hidden || !visible || lost) { previous = 0; return; }
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    if (!paused && !dragging) elapsed += delta;
    canvas.dataset.motionTime = elapsed.toFixed(4);
    if (!paused) intro = Math.min(1, intro + delta / 1.8);
    else intro = 1;
    const enter = 1 - Math.pow(1 - intro, 3);
    assembly.scale.setScalar(0.72 + enter * 0.28);
    assembly.position.y = -1.4 * (1 - enter) + Math.sin(elapsed * 0.9) * 0.12;
    modules.forEach((module, index) => {
      const phase = elapsed * 1.15 + index * 1.8;
      const idle = module.userData.idle;
      idle.position.y = Math.sin(phase) * 0.14;
      idle.position.x = Math.sin(phase * 0.65) * 0.1;
      idle.rotation.y = Math.sin(phase * 0.6) * 0.09;
      idle.rotation.z = Math.sin(phase * 0.8) * 0.035;
      beacons[index].material.emissiveIntensity = 0.5 + (Math.sin(phase * 2.4) + 1) * 0.65;
    });
    const sway = Math.sin(elapsed * 0.42) * 0.4;
    if (paused) {
      assembly.rotation.y = targetY + sway;
      assembly.rotation.x = targetX;
    } else {
      assembly.rotation.y += (targetY + sway - assembly.rotation.y) * 0.08;
      assembly.rotation.x += (targetX - assembly.rotation.x) * 0.08;
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  function start() { if (!frame && visible && !document.hidden && !lost) frame = requestAnimationFrame(render); }
  document.addEventListener('visibilitychange', start);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    sceneHost.classList.remove('is-ready');
    document.querySelector('#scene-hint').textContent = '3D paused. Product details remain available below.';
  });
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false;
    sceneHost.classList.add('is-ready');
    document.querySelector('#scene-hint').textContent = 'Drag to rotate · choose a module';
    start();
  });
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    frame = 0;
  });
  window.addEventListener('pageshow', start);
  resize();
  renderer.render(scene, camera);
  sceneHost.classList.add('is-ready');
  document.querySelector('#scene-hint').textContent = 'Drag to rotate / select a module';
  start();
}

import('./vendor/three.module.js').then(setupScene).catch(error => {
  document.querySelector('#scene-hint').textContent = 'Preview mode / explore the products below';
  console.warn('MiawLabs: 3D scene unavailable.', error);
});
