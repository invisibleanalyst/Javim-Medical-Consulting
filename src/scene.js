import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { fluidAmount, motionPhase } from './dna-motion.js';

export function mountScene(container) {
  const button = document.querySelector('#motion-toggle');
  const fallback = () => {
    container.querySelector('.scene-fallback').hidden = false;
    container.querySelector('canvas')?.setAttribute('hidden', '');
    button.hidden = true;
    container.dataset.phase = 'fallback';
    container.setAttribute('aria-busy','false');
  };
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'}); }
  catch { fallback(); return; }
  const compact = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1 : 1.5));
  renderer.setClearColor(0xffffff, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  camera.position.set(0, 0, 15.5);
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, .04).texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x735354, .6));
  const key = new THREE.DirectionalLight(0xfff5ef, 2.7); key.position.set(-5, 5, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, .7); fill.position.set(4, -2, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd1c9, 2.2); rim.position.set(2, 3, -4); scene.add(rim);
  const dna = new THREE.Group(); scene.add(dna);
  dna.rotation.set(.1, -.45, -.32); // Top leans right, bottom leans left.
  dna.position.x = .2;
  const height = 8.1, turns = 2.7, radius = 1.12, offset = Math.PI + .32;
  const point = (t, phase = 0) => new THREE.Vector3(Math.cos(t * turns * Math.PI * 2 + phase) * radius, (t - .5) * height, Math.sin(t * turns * Math.PI * 2 + phase) * radius);
  const solid = new THREE.Group(); dna.add(solid);
  const materials = [0x9d081b, 0xc31525].map(color => new THREE.MeshPhysicalMaterial({color,roughness:.62,clearcoat:.08,envMapIntensity:.3,transparent:true}));
  for (const phase of [0, offset]) {
    const path = new THREE.CatmullRomCurve3(Array.from({length:241}, (_,i) => point(i / 240, phase)));
    solid.add(new THREE.Mesh(new THREE.TubeGeometry(path, 240, .057, 12, false), materials[0]));
  }
  const bondGeometry = new THREE.CylinderGeometry(.025, .025, 1, 8);
  for (let i = 0; i <= 27; i++) {
    const left = point(i / 27), right = point(i / 27, offset), direction = right.clone().sub(left);
    const mesh = new THREE.Mesh(bondGeometry, materials[i % 2]);
    mesh.position.copy(left).add(right).multiplyScalar(.5); mesh.scale.y = direction.length();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), direction.normalize()); solid.add(mesh);
  }

  let seed = 37;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const count = compact ? 14000 : 32000;
  const positions = new Float32Array(count * 3), seeds = new Float32Array(count * 4);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let p;
    if (i % 5) {
      const t = random(), phase = random() < .5 ? 0 : offset;
      p = point(t, phase);
      const tangent = point(t + .001, phase).sub(p).normalize();
      const normal = new THREE.Vector3(p.x, 0, p.z).normalize();
      normal.addScaledVector(tangent, -normal.dot(tangent)).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
      const angle = random() * Math.PI * 2, r = .05 + random() * .028;
      p.addScaledVector(normal, Math.cos(angle) * r).addScaledVector(binormal, Math.sin(angle) * r);
    } else {
      const t = Math.floor(random() * 28) / 27;
      p = point(t).lerp(point(t, offset), random());
      p.y += (random() - .5) * .05; p.z += (random() - .5) * .04;
    }
    p.toArray(positions, i * 3);
    seeds.set([random(), random(), random(), random()], i * 4);
    sizes[i] = .018 + Math.pow(random(), 5) * .072;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  const uniforms = {
    uTime:{value:0}, uFluid:{value:0}, uPixelRatio:{value:renderer.getPixelRatio()},
    uHeight:{value:1}, uPointer:{value:new THREE.Vector3()}, uInfluence:{value:0},
  };
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms, transparent:true, depthWrite:false,
    vertexShader: `
      attribute vec4 aSeed;
      attribute float aSize;
      uniform float uTime, uFluid, uHeight, uPixelRatio, uInfluence;
      uniform vec3 uPointer;
      varying float vShade, vFluid, vSize;
      void main() {
        vec3 p = position;
        float t = uTime * .32;
        // Coherent curling streams: neighbouring grains travel together like liquid.
        vec3 flow = vec3(
          sin(position.y * 1.45 + t + aSeed.y * .65) * 1.15,
          sin(position.y * .8 - t * .65 + aSeed.y) * .55,
          cos(position.y * 1.45 + t + aSeed.y * .65) * 1.05
        );
        float angle = t * .7 + position.y * .75;
        vec3 drift = vec3(cos(angle + aSeed.z * 6.283), sin(t * .6 + aSeed.w * 6.283) * .8, sin(angle + aSeed.z * 6.283));
        float loose = pow(aSeed.x, 2.8);
        p += uFluid * (flow + drift * (.18 + loose * 1.25));
        p += uFluid * vec3(sin(t * 2. + position.y * 4.), cos(t + position.x * 3.), sin(t + position.y * 3.)) * .07;
        vec3 delta = p - uPointer;
        float distanceToPointer = length(delta);
        float reach = exp(-distanceToPointer * distanceToPointer / 1.3);
        vec3 repulsion = normalize(delta + vec3(.01)) * .9 + vec3(-delta.y, delta.x, 0.) * .55;
        p += repulsion * reach * uInfluence * uFluid;
        vec4 view = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * view;
        gl_PointSize = clamp(aSize * uHeight * uPixelRatio / max(1., -view.z) * (1. + uFluid * .5), 1.15 * uPixelRatio, 13. * uPixelRatio);
        vShade = .55 + aSeed.w * .45;
        vFluid = uFluid;
        vSize = aSize;
      }
    `,
    fragmentShader: `
      varying float vShade, vFluid, vSize;
      void main() {
        vec2 uv = gl_PointCoord * 2. - 1.;
        float r2 = dot(uv, uv);
        if (r2 > 1.) discard;
        float z = sqrt(max(0., 1. - r2));
        vec3 normal = vec3(uv.x, -uv.y, z);
        float diffuse = .4 + .6 * max(0., dot(normal, normalize(vec3(-.5, .7, 1.))));
        float shine = pow(max(0., dot(normal, normalize(vec3(-.35, .5, 1.)))), 18.);
        vec3 red = vec3(.77, .026, .071) * vShade * diffuse;
        red += vec3(.35, .13, .14) * shine * (.15 + vFluid * .45);
        float alpha = (1. - smoothstep(.65, 1., r2)) * mix(.88, .7, vFluid);
        gl_FragColor = vec4(red, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const particles = new THREE.Points(geometry, particleMaterial);
  particles.frustumCulled = false; dna.add(particles);
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches, visible = true, elapsed = 0, last = performance.now(), lastRender = 0, dirty = true, frame;
  const desiredPointer = new THREE.Vector3(), ndc = new THREE.Vector2(), raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0), intersection = new THREE.Vector3();
  let desiredInfluence = 0, pressed = false;
  const pointer = event => {
    if (event.pointerType === 'touch' && !pressed) return;
    const bounds = renderer.domElement.getBoundingClientRect();
    ndc.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      dna.updateMatrixWorld(); desiredPointer.copy(dna.worldToLocal(intersection.clone()));
      desiredInfluence = paused ? 0 : 1;
    }
  };
  renderer.domElement.style.touchAction = 'pan-y';
  renderer.domElement.addEventListener('pointermove', pointer);
  renderer.domElement.addEventListener('pointerdown', event => { pressed = true; pointer(event); });
  for (const name of ['pointerup','pointercancel','pointerleave']) renderer.domElement.addEventListener(name, () => { pressed = false; desiredInfluence = 0; });
  const sync = () => {
    button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    button.setAttribute('aria-pressed', String(paused));
    button.innerHTML = paused
      ? '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5Z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
      : '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="1.8"/></svg>';
  };
  sync();
  button.addEventListener('click', () => { paused = !paused; dirty = true; desiredInfluence = 0; sync(); });
  media.addEventListener('change', () => { paused = media.matches; elapsed = 0; desiredInfluence = 0; dirty = true; sync(); });
  const resize = () => {
    const {width, height} = container.getBoundingClientRect(); if (!width || !height) return;
    dna.scale.setScalar(width < 450 ? 1.55 : 1.85);
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
    uniforms.uHeight.value = height; dirty = true;
  };
  new ResizeObserver(resize).observe(container); resize();
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; dirty = true; }).observe(container);
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); cancelAnimationFrame(frame); fallback(); });
  const render = dt => {
    const amount = fluidAmount(elapsed);
    uniforms.uTime.value = elapsed; uniforms.uFluid.value = amount;
    uniforms.uPointer.value.lerp(desiredPointer, 1 - Math.exp(-dt * 8));
    uniforms.uInfluence.value += (desiredInfluence - uniforms.uInfluence.value) * (1 - Math.exp(-dt * 5));
    materials.forEach(material => { material.opacity = 1 - THREE.MathUtils.smoothstep(amount, 0, .35); });
    solid.visible = amount < .35;
    dna.rotation.y = -.45 + Math.sin(elapsed * .09) * .12;
    key.position.x = -5 + Math.sin(elapsed * .12) * .8;
    rim.intensity = 2.2 + Math.sin(elapsed * .15) * .12;
    container.dataset.phase = motionPhase(elapsed);
    container.dataset.fluid = amount.toFixed(3);
    container.dataset.particleCount = String(count);
    container.dataset.interaction = uniforms.uInfluence.value > .1 && amount > .1 ? 'active' : 'idle';
    renderer.render(scene, camera); container.querySelector('.scene-fallback').hidden = true;
    container.dataset.rendered='true';container.setAttribute('aria-busy','false');
  };
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  const animate = now => {
    frame = requestAnimationFrame(animate);
    const dt = Math.max(0, (now - last) / 1000); last = now;
    if (!visible || document.hidden) return;
    if (!paused) elapsed += dt;
    if ((paused && !dirty) || now - lastRender < 1000 / 30) return;
    const renderDt = Math.min((now - lastRender) / 1000, .1);
    lastRender = now; dirty = false; render(renderDt);
  };
  animate(performance.now());
}
