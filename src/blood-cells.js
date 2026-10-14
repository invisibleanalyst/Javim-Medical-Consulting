import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

// A biconcave surface of revolution with fine membrane relief, not a sphere.
function membraneGeometry(){
 const geometry=new THREE.SphereGeometry(1,128,96),position=geometry.attributes.position;
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),y=position.getY(i),z=position.getZ(i);
  const r2=x*x+y*y;
  const relief=Math.sin(x*137+y*89+z*53)*Math.sin(y*173-z*113)*.0004;
  position.setXYZ(i,x*(1+relief),y*(1+relief),z*(.18+.95*r2-.55*r2*r2)*.65+relief);
 }
 geometry.computeVertexNormals();return geometry;
}
function membraneTexture(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
 const context=canvas.getContext('2d'),pixels=context.createImageData(1024,1024);
 let seed=193;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 // Several grain scales prevent the membrane from looking like polished plastic.
 const coarse=Array.from({length:128*128},random);
 for(let y=0;y<1024;y++)for(let x=0;x<1024;x++){
  const value=90+random()*65+coarse[(y>>3)*128+(x>>3)]*75;
  const p=(y*1024+x)*4;pixels.data[p]=pixels.data[p+1]=pixels.data[p+2]=value;pixels.data[p+3]=255;
 }
 context.putImageData(pixels,0,0);const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;return texture;
}
// GPU sphere impostors add visible grains without tens of thousands of meshes.
function surfaceGrains(count, seed, pointScale){
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const height=r=>Math.sqrt(Math.max(0,1-r*r))*(.18+.95*r*r-.55*r*r*r*r)*.65;
 const positions=new Float32Array(count*3),normals=new Float32Array(count*3),sizes=new Float32Array(count),shades=new Float32Array(count);
 for(let i=0;i<count;i++){
  const r=Math.sqrt(random())*.998,a=random()*Math.PI*2,side=random()<.5?-1:1,x=r*Math.cos(a),y=r*Math.sin(a);
  const slope=(height(Math.min(.999,r+.001))-height(Math.max(0,r-.001)))/.002;
  const n=new THREE.Vector3(-slope*Math.cos(a),-slope*Math.sin(a),side).normalize();
  const relief=(random()-.2)*.009;
  positions.set([x+n.x*relief,y+n.y*relief,side*height(r)+n.z*relief],i*3);normals.set([n.x,n.y,n.z],i*3);
  sizes[i]=.014+Math.pow(random(),2)*.022;shades[i]=random();
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));geometry.setAttribute('grainSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('shade',new THREE.BufferAttribute(shades,1));
 const material=new THREE.ShaderMaterial({uniforms:{pointScale:{value:pointScale}},vertexShader:`
 attribute float grainSize;attribute float shade;uniform float pointScale;varying vec3 vNormal;varying float vShade;
 void main(){vec4 p=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vShade=shade;
 float scale=length(modelMatrix[0].xyz);gl_PointSize=clamp(grainSize*scale*pointScale/-p.z,1.,12.);gl_Position=projectionMatrix*p;}`,
 fragmentShader:`
 varying vec3 vNormal;varying float vShade;
 void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.||vNormal.z<-.05)discard;
 vec3 grain=vec3(p.x,-p.y,sqrt(max(0.,1.-r)));vec3 n=normalize(vNormal*.7+grain*.7);
 vec3 light=normalize(vec3(-.65,.85,1.));float diffuse=max(0.,dot(n,light));
 float spec=pow(max(0.,dot(n,normalize(light+vec3(0.,0.,1.)))),20.);
 vec3 red=mix(vec3(.23,.004,.012),vec3(.72,.016,.035),vShade*.6+.2);
 vec3 color=red*(.48+diffuse*.92)+vec3(1.,.72,.62)*spec*.36;
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 return new THREE.Points(geometry,material);
}
export function mountBloodCells(container){
 const toggle=document.querySelector('#blood-motion-toggle'),fallback=container.querySelector('.blood-fallback');
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{container.dataset.status='fallback';toggle.hidden=true;return;}
 const compact=matchMedia('(max-width:760px)').matches;
 renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.25:1.5));renderer.setClearColor(0xffffff,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
 renderer.domElement.setAttribute('aria-hidden','true');container.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,40);camera.position.z=12;
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.07);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xfff6ef,0x75121d,.7));
 for(const [color,intensity,x,y,z] of [[0xfff8f2,3,-4,5,6],[0xffffff,.8,5,0,3],[0xffb0a0,2.3,2,4,-4]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);scene.add(light);}
 const geometry=membraneGeometry(),texture=membraneTexture(),group=new THREE.Group();scene.add(group);
 const specifications=[[-.8,-.6,1.3,1.45,.42,.3],[1.4,1.5,-.1,.9,-.6,.8],[-1.8,1.9,-2,.72,.8,.5],[1.9,-1.7,-1,.8,.55,-.8],[-1.9,-2.1,-2.5,.58,-.7,.6],[.2,2.9,-3.5,.5,.9,.2],[2.6,.1,-3,.5,.3,.7],[-.1,-3,-4,.48,-.6,-.6]];
 let totalGrains=0;
 const cells=specifications.slice(0,compact?5:8).map(([x,y,z,scale,rx,ry],index)=>{
  const material=new THREE.MeshPhysicalMaterial({color:index%2?0xa90c20:0xb70d23,roughness:.85,metalness:0,bumpMap:texture,bumpScale:.04,roughnessMap:texture,clearcoat:0,clearcoatRoughness:.65,envMapIntensity:.2,transparent:true});
  const mesh=new THREE.Mesh(geometry,material);mesh.scale.setScalar(scale*(compact?1.1:1.25));mesh.rotation.set(rx,ry,index*.7);group.add(mesh);
  const grainCount=compact?(index===0?12000:3500):(index===0?28000:index===1?14000:4500);
  const grains=surfaceGrains(grainCount,193+index*719,1);mesh.add(grains);totalGrains+=grainCount;
  return {mesh,grains,x,y,z,rx,ry,index};
 });
 const media=matchMedia('(prefers-reduced-motion:reduce)');let paused=true,visible=true,elapsed=0,previous=0,frame=0,dirty=true;
 const pointer=new THREE.Vector2(),target=new THREE.Vector2();
 function updateButton(){toggle.setAttribute('aria-label',paused?'Play blood cell animation':'Pause blood cell animation');toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 7 5-7 5Z" fill="currentColor"/></svg><span>Play animation</span>':'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="2"/></svg><span>Pause animation</span>';container.dataset.paused=String(paused);}
 function resize(){const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);for(const c of cells)c.grains.material.uniforms.pointScale.value=height*renderer.getPixelRatio()/(2*Math.tan(THREE.MathUtils.degToRad(34/2)));camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;start();}
 function draw(now){
  frame=0;const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;
  if(!paused)elapsed+=dt;
  if(dirty||!paused){
   for(const c of cells){const t=elapsed*.16,i=c.index;c.mesh.position.set(c.x+Math.sin(t*.7+i)*.32,c.y+Math.sin(t*.5+i*1.8)*.6,c.z+Math.sin(t*.4+i)*.22);c.mesh.rotation.set(c.rx+Math.sin(t*.48+i)*.23,c.ry+t*(i%2?-.18:.14),i*.7+Math.sin(t*.36+i)*.18);}
   if(!paused){pointer.lerp(target,.035);group.rotation.set(pointer.y*.07,pointer.x*.09,0);}
   renderer.render(scene,camera);dirty=false;container.dataset.time=elapsed.toFixed(2);
  }
  if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(draw);
 }
 function start(){if(!frame&&visible&&!document.hidden){previous=0;frame=requestAnimationFrame(draw);}}
 toggle.addEventListener('click',()=>{paused=!paused;updateButton();dirty=true;start();});
 media.addEventListener('change',()=>{if(media.matches)paused=true;updateButton();dirty=true;start();});
 container.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused)return;const r=container.getBoundingClientRect();target.set((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);});container.addEventListener('pointerleave',()=>target.set(0,0));
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;previous=0;}},{threshold:0});observer.observe(container);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;visible=false;renderer.domElement.hidden=true;fallback.hidden=false;toggle.hidden=true;container.dataset.status='fallback';});
 updateButton();resize();renderer.render(scene,camera);fallback.hidden=true;container.dataset.status='ready';container.dataset.cellCount=String(cells.length);container.dataset.grainCount=String(totalGrains);start();
}
