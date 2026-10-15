import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export async function mountAnatomy(container, onSelect) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
  catch {container.dataset.status='fallback';container.setAttribute('aria-busy','false');return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1:1.5));
  renderer.setClearColor(0xffffff,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
  renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.01,100);
  const pmrem=new THREE.PMREMGenerator(renderer), room=new RoomEnvironment();
  scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0x776767,.8));
  const key=new THREE.DirectionalLight(0xfff6ec,2.5);key.position.set(-4,5,7);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffffff,2.5);rim.position.set(4,2,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xffc9c7,.8);fill.position.set(3,-2,5);scene.add(fill);
  let model;
  try {model=(await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('/assets/anatomy/torso.glb')).scene;}
  catch {renderer.dispose();container.dataset.status='fallback';container.setAttribute('aria-busy','false');return null;}
  const bounds=new THREE.Box3().setFromObject(model), centre=bounds.getCenter(new THREE.Vector3()), size=bounds.getSize(new THREE.Vector3());
  model.position.sub(centre);const scale=5.8/size.y;model.scale.setScalar(scale);model.position.multiplyScalar(scale);scene.add(model);
  const tissueCanvas=document.createElement('canvas');tissueCanvas.width=tissueCanvas.height=128;
  const context=tissueCanvas.getContext('2d'),pixels=context.createImageData(128,128);
  for(let i=0;i<pixels.data.length;i+=4){const n=110+Math.sin(i*.73)*35+Math.sin(i*.017)*28;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=255;}
  context.putImageData(pixels,0,0);const grain=new THREE.CanvasTexture(tissueCanvas);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;
  const meshes=[],groups=new Map(), organBounds=new Map(), sharedMaterials=new Map();
  model.traverse(node=>{
    if(!node.isMesh)return;
    let ancestor=node;
    while(ancestor&&!ancestor.userData.system)ancestor=ancestor.parent;
    const system=ancestor?.userData.system||'bones';
    const bone=system==='bones', vessel=system==='vessels';
    if(!sharedMaterials.has(system))sharedMaterials.set(system,new THREE.MeshStandardMaterial({color:bone?0xbfc9c7:vessel?0x980c20:system==='liver'?0x992c31:0x990f23,roughness:bone?.7:.52,transparent:true,opacity:bone?.26:vessel?.75:.32,depthWrite:false,bumpMap:bone?null:grain,bumpScale:bone?0:.013,side:THREE.DoubleSide,envMapIntensity:.3}));
    node.material=sharedMaterials.get(system);
    node.userData.system=system;meshes.push(node);
    if(!groups.has(system))groups.set(system,[]);groups.get(system).push(node);
  });
  model.updateMatrixWorld(true);
  for(const [id,nodes] of groups){const b=new THREE.Box3();nodes.forEach(n=>b.union(new THREE.Box3().setFromObject(n)));organBounds.set(id,b);}
  camera.position.set(1.1,.3,11.5);camera.lookAt(0,0,0);
  container.appendChild(renderer.domElement);
  container.dataset.status='loading';container.dataset.meshCount=String(meshes.length);container.dataset.systems=[...groups.keys()].join(',');
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.enablePan=false;controls.enableZoom=false;
  controls.minAzimuthAngle=-.8;controls.maxAzimuthAngle=.8;
  controls.minPolarAngle=Math.PI*.37;controls.maxPolarAngle=Math.PI*.65;
  controls.rotateSpeed=.4;renderer.domElement.style.touchAction='pan-y';
  let dirty=true,visible=true,focus=null,selected='blood',frame,last=performance.now();
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change',()=>{controls.enableDamping=!media.matches;dirty=true;});
  const select=id=>{
    selected=id;container.dataset.selected=id;
    for(const node of meshes){const s=node.userData.system,active=s===id||id==='blood'&&s==='vessels';node.material.opacity=s==='bones'?.26:s==='vessels'?(id==='blood'?.78:.35):active?1:.16;node.material.depthWrite=active&&s!=='bones'&&s!=='vessels';node.material.emissive.set(active&&s!=='bones'?0x250407:0x000000);}
    const b=organBounds.get(id);
    if(b){const target=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());
      const distance=id==='blood'?8.7:Math.max(4.5,s.y*2.8,s.x*2.5);
      const position=target.clone().add(new THREE.Vector3(.75,.15,distance));
      focus={target,position};
      if(media.matches){camera.position.copy(position);controls.target.copy(target);focus=null;}
    }
    dirty=true;
  };
  const reset=()=>{focus={target:new THREE.Vector3(),position:new THREE.Vector3(1.1,.3,11.5)};if(media.matches){camera.position.copy(focus.position);controls.target.copy(focus.target);focus=null;}dirty=true;};
  const controlsChange=()=>{dirty=true;};controls.addEventListener('change',controlsChange);
  controls.addEventListener('start',()=>{focus=null;});
  const raycaster=new THREE.Raycaster(),ndc=new THREE.Vector2();let down=null;
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8){down=null;return;}down=null;
    const r=renderer.domElement.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    raycaster.setFromCamera(ndc,camera);const hit=raycaster.intersectObjects(meshes,false).find(h=>!['bones','vessels'].includes(h.object.userData.system));
    if(hit)onSelect(hit.object.userData.system);
  });
  renderer.domElement.addEventListener('pointercancel',()=>{down=null;});
  const resize=()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;};
  new ResizeObserver(resize).observe(container);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true;}).observe(container);
  const hotspots=container.parentElement.querySelectorAll('[data-organ]');
  const project=()=>{
    for(const button of hotspots){const b=organBounds.get(button.dataset.organ);if(!b)continue;
      const markerBounds=button.dataset.organ==='kidneys'?new THREE.Box3().setFromObject(groups.get('kidneys')[0]):b;
      const p=markerBounds.getCenter(new THREE.Vector3()).project(camera);
      button.style.left=`${THREE.MathUtils.clamp((p.x+1)*50,9,91)}%`;button.style.top=`${THREE.MathUtils.clamp((1-p.y)*50,7,87)}%`;
      button.setAttribute('aria-pressed',String(button.dataset.organ===selected));
    }
  };
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);renderer.domElement.hidden=true;container.querySelector('.anatomy-fallback').hidden=false;container.dataset.status='fallback';container.setAttribute('aria-busy','false');});
  const animate=now=>{frame=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;
    if(focus){const a=1-Math.exp(-dt*5);camera.position.lerp(focus.position,a);controls.target.lerp(focus.target,a);dirty=true;if(camera.position.distanceTo(focus.position)<.008)focus=null;}
    const moved=controls.update();if(!dirty&&!moved)return;dirty=false;project();renderer.render(scene,camera);container.querySelector('.anatomy-fallback').hidden=true;container.dataset.status='ready';container.setAttribute('aria-busy','false');container.dataset.renderedCamera=camera.position.toArray().map(v=>v.toFixed(3)).join(',');
  };
  select('blood');animate(performance.now());
  return {select,reset};
}
