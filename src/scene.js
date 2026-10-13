import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function mountScene(container) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'}); }
  catch { document.querySelector('.scene-live').textContent='ILLUSTRATION';document.querySelector('.scene-hint').textContent='BLOOD CELL STUDY';document.querySelector('.scene-tabs').hidden=true;document.querySelector('#motion-toggle').hidden=true;return; }
  container.querySelector('.scene-fallback').hidden=true;
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1:1.35));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.95;
  renderer.setClearColor(0x000000,0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');
  const scene = new THREE.Scene();
  scene.background=new THREE.Color(0x222725);
  scene.fog=new THREE.FogExp2(0x222725,.025);
  const camera = new THREE.PerspectiveCamera(34,1,.1,60);
  camera.position.set(0,.5,14);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0x564343,.7));
  const key=new THREE.DirectionalLight(0xfff9ed,3);key.position.set(-4,6,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff3535,3.5);rim.position.set(4,2,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xffffff,.8);fill.position.set(2,-3,4);scene.add(fill);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;
  controls.minPolarAngle=Math.PI*.3;controls.maxPolarAngle=Math.PI*.7;
  controls.rotateSpeed=.4;controls.target.set(0,0,0);
  renderer.domElement.style.touchAction='pan-y';
  // A closed, biconcave surface of revolution, rather than a torus.
  const points=[];
  const radius=1.12;
  for(let i=0;i<=50;i++){
    const r=radius*i/50;const t=r/radius;
    const h=.48*Math.sqrt(Math.max(0,1-t*t))*(.24+1.8*t*t-.7*t*t*t*t);
    points.push(new THREE.Vector2(r,h));
  }
  for(let i=49;i>=0;i--){const r=radius*i/50;const t=r/radius;const h=.48*Math.sqrt(Math.max(0,1-t*t))*(.24+1.8*t*t-.7*t*t*t*t);points.push(new THREE.Vector2(r,-h));}
  const cellGeometry=new THREE.LatheGeometry(points.reverse(),96);
  cellGeometry.computeVertexNormals();
  const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=256;
  const ctx=textureCanvas.getContext('2d');const img=ctx.createImageData(256,256);
  // Fine deterministic surface grain for membrane detail.
  let seed=77;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<img.data.length;i+=4){const n=100+random()*90;img.data[i]=img.data[i+1]=img.data[i+2]=n;img.data[i+3]=255;}ctx.putImageData(img,0,0);
  const bump=new THREE.CanvasTexture(textureCanvas);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(3,2);
  const material=new THREE.MeshPhysicalMaterial({color:0xa3091b,metalness:0,roughness:.46,clearcoat:.18,clearcoatRoughness:.4,bumpMap:bump,bumpScale:.06,envMapIntensity:.45});
  const blood = new THREE.Group();scene.add(blood);
  const positions=[[-.4,.25,1.5,1.45],[2,2.8,-1,.95],[-2.9,2.4,-2,.87],[2.65,-1.75,-.2,1.02],[-2.5,-2.35,-.8,.85],[.35,-3.75,-3,.75],[.1,4.15,-3,.73],[-3.9,-.1,-3,.68],[3.9,.7,-4,.6]];
  const cells=positions.map(([x,y,z,size],i)=>{
    const cell=new THREE.Mesh(cellGeometry,material);cell.position.set(x,y,z);cell.scale.setScalar(size);cell.rotation.set(1.2+i*.37,.2+i*.7,.3+i*.43);blood.add(cell);
    return {mesh:cell,origin:cell.position.clone(),phase:i*1.9,rotation:cell.rotation.clone()};
  });
  const dna=new THREE.Group();dna.visible=false;scene.add(dna);
  const backbone=new THREE.MeshPhysicalMaterial({color:0xb81724,roughness:.43,metalness:0,clearcoat:.2,envMapIntensity:.55});
  const pale=new THREE.MeshStandardMaterial({color:0xe9bbb5,roughness:.4});
  const atomGeometry=new THREE.SphereGeometry(.17,16,12);
  const turns=2.3,height=8.4;
  const strands=[[],[]];
  for(let i=0;i<=150;i++){const y=(i/150-.5)*height;const a=i/150*Math.PI*2*turns;strands[0].push(new THREE.Vector3(Math.cos(a)*1.5,y,Math.sin(a)*1.5));strands[1].push(new THREE.Vector3(-Math.cos(a)*1.5,y,-Math.sin(a)*1.5));}
  strands.forEach(p=>dna.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p),180,.14,12,false),backbone)));
  const bondGeometry=new THREE.CylinderGeometry(.065,.065,1,10);
  for(let i=0;i<=32;i++){
    const y=(i/32-.5)*height,a=i/32*Math.PI*2*turns;
    const start=new THREE.Vector3(Math.cos(a)*1.5,y,Math.sin(a)*1.5),end=new THREE.Vector3(-Math.cos(a)*1.5,y,-Math.sin(a)*1.5);
    const direction=end.clone().sub(start);
    const bond=new THREE.Mesh(bondGeometry,i%2?backbone:pale);bond.position.copy(start).add(end).multiplyScalar(.5);bond.scale.y=direction.length();bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());dna.add(bond);
    [start,end].forEach(p=>{const atom=new THREE.Mesh(atomGeometry,backbone);atom.position.copy(p);dna.add(atom);});
  }
  dna.rotation.z=-.22;
  dna.scale.setScalar(.84);
  const composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  const depth=new BokehPass(scene,camera,{focus:12.3,aperture:.00012,maxblur:.009});
  composer.addPass(depth);composer.addPass(new OutputPass());
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=media.matches,visible=true,elapsed=0,last=performance.now(),frame,dirty=true,lastRender=0;
  controls.addEventListener('change',()=>{dirty=true;});
  const motionButton=document.querySelector('#motion-toggle');
  const syncPause=()=>{motionButton.setAttribute('aria-label',paused?'Play animation':'Pause animation');motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=`<span aria-hidden="true">${paused?'▷':'Ⅱ'}</span>`;};syncPause();
  motionButton.addEventListener('click',()=>{paused=!paused;dirty=true;syncPause();});
  media.addEventListener('change',()=>{paused=media.matches;syncPause();});
  document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{
    const isBlood=b.dataset.scene==='blood';blood.visible=isBlood;dna.visible=!isBlood;depth.uniforms.focus.value=isBlood?12.3:14;
    document.querySelectorAll('[data-scene]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});
    controls.reset();dirty=true;
  }));
  const resize=()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;};
  new ResizeObserver(resize).observe(container);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(container);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);container.querySelector('.scene-fallback').hidden=false;renderer.domElement.hidden=true;document.querySelector('.scene-live').textContent='ILLUSTRATION';});
  const animate=now=>{
    frame=requestAnimationFrame(animate);
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(!visible||document.hidden)return;
    const moved=controls.update();
    if(paused&&!dirty&&!moved)return;
    if(!paused)elapsed+=dt;
    if(now-lastRender<1000/30)return;
    lastRender=now;dirty=false;
    if(!paused){cells.forEach(c=>{c.mesh.position.y=c.origin.y+Math.sin(elapsed*.27+c.phase)*.32;c.mesh.position.x=c.origin.x+Math.sin(elapsed*.15+c.phase)*.15;c.mesh.rotation.x=c.rotation.x+elapsed*.09;c.mesh.rotation.z=c.rotation.z+Math.sin(elapsed*.21+c.phase)*.2;});dna.rotation.y=elapsed*.16;}
    composer.render();
  };animate(performance.now());
}
