import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function mountScene(container) {
  const fallback = () => {
    container.querySelector('.scene-fallback').hidden = false;
    container.querySelector('canvas')?.setAttribute('hidden', '');
    document.querySelector('#motion-toggle').hidden = true;
  };
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'}); }
  catch { fallback(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1 : 1.5));
  renderer.setClearColor(0xffffff, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .85;
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene(); // No background or fog: preserve the canvas alpha channel.
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  camera.position.set(0, 0, 15.5);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, .04).texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x735354, .6));
  const key = new THREE.DirectionalLight(0xfff5ef, 2.7); key.position.set(-5, 5, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, .7); fill.position.set(4, -2, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd1c9, 2.2); rim.position.set(2, 3, -4); scene.add(rim);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.minPolarAngle = Math.PI * .35; controls.maxPolarAngle = Math.PI * .65;
  controls.rotateSpeed = .35;
  renderer.domElement.style.touchAction = 'pan-y';

  // Original illustrative molecular structure, with offset strands and paired bases.
  // This represents laboratory science, not an advertised genetic-testing service.
  // Coherent multi-scale grain avoids the smooth plastic appearance of a plain tube.
  const surface = document.createElement('canvas'); surface.width = surface.height = 256;
  const context = surface.getContext('2d'); const pixels = context.createImageData(256, 256);
  let seed = 17;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const grid = Array.from({length:33 * 33}, random);
  const noise = (x, y, frequency) => {
    const gx = x * frequency, gy = y * frequency;
    const ix = Math.floor(gx), iy = Math.floor(gy);
    const smooth = v => v * v * (3 - 2 * v);
    const fx = smooth(gx - ix), fy = smooth(gy - iy);
    const at = (a, b) => grid[(b % 33) * 33 + (a % 33)];
    return (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) + (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy;
  };
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const value = 45 + 170 * (noise(x / 256, y / 256, 8) * .5 + noise(x / 256, y / 256, 24) * .35 + random() * .15);
    const i = (y * 256 + x) * 4;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value; pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(surface);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 2);
  const red = new THREE.MeshPhysicalMaterial({color:0xac0718,roughness:.58,metalness:0,clearcoat:.1,clearcoatRoughness:.5,envMapIntensity:.3,bumpMap:texture,bumpScale:.07});
  const pale = new THREE.MeshPhysicalMaterial({color:0xc21924,roughness:.62,envMapIntensity:.25,bumpMap:texture,bumpScale:.04});
  const deep = new THREE.MeshPhysicalMaterial({color:0x710916,roughness:.6,envMapIntensity:.25,bumpMap:texture,bumpScale:.04});
  const dna = new THREE.Group(); scene.add(dna);
  const height = 8.1, turns = 2.7, radius = 1.2, offset = Math.PI + .32;
  const point = (t, phase = 0) => new THREE.Vector3(Math.cos(t * turns * Math.PI * 2 + phase) * radius, (t - .5) * height, Math.sin(t * turns * Math.PI * 2 + phase) * radius);
  for (const phase of [0, offset]) {
    const points = Array.from({length:241}, (_, i) => point(i / 240, phase));
    dna.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 240, .145, 18, false), red));
  }
  const atomGeometry = new THREE.SphereGeometry(1, 16, 12);
  const bondGeometry = new THREE.CylinderGeometry(1, 1, 1, 10);
  const atom = (position, scale, material) => {
    const mesh = new THREE.Mesh(atomGeometry, material); mesh.position.copy(position); mesh.scale.setScalar(scale); dna.add(mesh);
  };
  const bond = (start, end, thickness, material) => {
    const vector = end.clone().sub(start), mesh = new THREE.Mesh(bondGeometry, material);
    mesh.position.copy(start).add(end).multiplyScalar(.5);
    mesh.scale.set(thickness, vector.length(), thickness);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), vector.normalize()); dna.add(mesh);
  };
  for (let i = 0; i <= 27; i++) {
    const t = i / 27, left = point(t), right = point(t, offset);
    atom(left, .135, red); atom(right, .135, red);
    const middle = left.clone().lerp(right, .5);
    bond(left, middle, .06, i % 2 ? red : pale);
    bond(middle, right, .06, i % 2 ? pale : deep);
    for (let j = 1; j < 6; j++) {
      const p = left.clone().lerp(right, j / 6);
      p.y += Math.sin(j * Math.PI / 3) * .035;
      atom(p, j === 3 ? .065 : .074, (i + j) % 3 ? pale : red);
    }
    for (const phase of [0, offset]) {
      const p = point(Math.min(1, t + .014), phase);
      const side = new THREE.Vector3(p.x * 1.07, p.y + .035, p.z * 1.07);
      atom(side, .06, deep); bond(p, side, .035, red);
    }
  }
  // Instanced surface clusters add molecular relief with one additional draw call.
  const clusters = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), red, 810);
  const dummy = new THREE.Object3D(); let clusterIndex = 0;
  for (const phase of [0, offset]) for (let i = 0; i <= 80; i++) {
    const t = i / 80, centre = point(t, phase);
    const tangent = point(t + .001, phase).sub(centre).normalize();
    const normal = new THREE.Vector3(centre.x, 0, centre.z).normalize();
    normal.addScaledVector(tangent, -normal.dot(tangent)).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    for (let j = 0; j < 5; j++) {
      const angle = j * Math.PI * 2 / 5 + random() * .5;
      dummy.position.copy(centre).addScaledVector(normal, Math.cos(angle) * .14).addScaledVector(binormal, Math.sin(angle) * .14);
      dummy.scale.setScalar(.025 + random() * .018); dummy.updateMatrix();
      clusters.setMatrixAt(clusterIndex++, dummy.matrix);
    }
  }
  clusters.instanceMatrix.needsUpdate = true; dna.add(clusters);
  const initialYaw = -.65;
  dna.rotation.set(.15, initialYaw, -.42);
  dna.position.x = .35;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches, visible = true, elapsed = 0, last = performance.now(), lastRender = 0, dirty = true, frame;
  const button = document.querySelector('#motion-toggle');
  const sync = () => {
    button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    button.setAttribute('aria-pressed', String(paused));
    button.innerHTML = `<span aria-hidden="true">${paused ? '▷' : 'Ⅱ'}</span>`;
  };
  sync();
  button.addEventListener('click', () => { paused = !paused; dirty = true; sync(); });
  media.addEventListener('change', () => { paused = media.matches; dirty = true; sync(); });
  controls.addEventListener('change', () => { dirty = true; });
  const resize = () => {
    const {width, height} = container.getBoundingClientRect();
    if (!width || !height) return;
    dna.scale.setScalar(width < 450 ? 1.65 : 2.05);
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); dirty = true;
  };
  new ResizeObserver(resize).observe(container); resize();
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; dirty = true; }).observe(container);
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(frame); fallback(); });
  const animate = now => {
    frame = requestAnimationFrame(animate);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!visible || document.hidden) return;
    const moved = controls.update();
    if (!paused) elapsed += dt;
    if ((paused && !dirty && !moved) || now - lastRender < 1000 / 30) return;
    if (!paused) {
      dna.rotation.y = initialYaw + elapsed * .045;
      dna.position.y = Math.sin(elapsed * .2) * .09;
      // A slow studio-light drift reveals surface depth without flashing.
      key.position.x = -5 + Math.sin(elapsed * .12) * .8;
      rim.intensity = 2.2 + Math.sin(elapsed * .15) * .12;
    }
    lastRender = now; dirty = false; renderer.render(scene, camera);
    container.querySelector('.scene-fallback').hidden = true;
  };
  animate(performance.now());
}
