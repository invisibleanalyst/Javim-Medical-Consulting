import {departments} from './data.js';
import {serviceArt} from './service-art.js';

export function renderServiceCards(){
 return departments.map((d,i)=>`<article class="service-card"><button class="service-card-trigger" data-service="${d.id}" aria-haspopup="dialog" aria-controls="service-drawer" aria-expanded="false"><span class="service-card-visual">${serviceArt(i)}</span><span class="service-card-heading"><span class="service-card-title">${d.name}</span><span class="service-card-toggle" aria-hidden="true">↗</span></span><span class="service-card-summary">${d.summary}</span></button></article>`).join('');
}
export function renderServiceDrawer(){
 return `<dialog id="service-drawer" class="service-drawer" aria-labelledby="service-drawer-title"><div class="service-drawer-top"><span class="eyebrow">OUR SERVICES</span><button class="service-drawer-close" aria-label="Close service details" autofocus>×</button></div><div class="service-category-picker"><label for="service-category">Choose a category</label><select id="service-category">${departments.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></div><div id="service-drawer-body"></div></dialog>`;
}
export function initServiceDrawer(){
 const drawer=document.querySelector('#service-drawer');if(!drawer)return;
 const picker=drawer.querySelector('select');let opener;let closing=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function select(id){
  const index=departments.findIndex(d=>d.id===id);if(index<0)return;
  const d=departments[index];picker.value=id;
  document.querySelectorAll('[data-service]').forEach(button=>{const active=button.dataset.service===id;button.setAttribute('aria-expanded',String(active));button.closest('.service-card').classList.toggle('selected',active);});
  drawer.querySelector('#service-drawer-body').innerHTML=`<div class="service-drawer-image">${serviceArt(index)}</div><h2 id="service-drawer-title">${d.name}</h2><p class="service-drawer-description">${d.summary}</p><div class="service-card-content"><span class="eyebrow">${d.tests.length>3?'A FEW OF OUR TESTS':'AVAILABLE TESTS'}</span><ul>${d.tests.slice(0,3).map(t=>`<li><h3>${t.name}</h3><p>${t.description}</p></li>`).join('')}</ul><a class="text-link" href="/services?category=${d.id}">${d.tests.length>3?`View all ${d.tests.length} tests`:'Explore this category'} <span aria-hidden="true">→</span></a></div>`;
 }
 function close(){
  if(closing||!drawer.open)return;
  if(reduced()){drawer.close();return;}
  closing=true;drawer.classList.add('is-closing');setTimeout(()=>drawer.close(),200);
 }
 document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{opener=button;select(button.dataset.service);drawer.showModal();document.body.classList.add('service-drawer-open');drawer.scrollTop=0;}));
 picker.addEventListener('change',()=>select(picker.value));
 drawer.querySelector('.service-drawer-close').addEventListener('click',close);
 drawer.addEventListener('cancel',event=>{event.preventDefault();close();});
 let outside=false;
 const isOutside=event=>{const r=drawer.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
 drawer.addEventListener('pointerdown',event=>outside=isOutside(event));
 drawer.addEventListener('click',event=>{if(outside&&isOutside(event))close();outside=false;});
 drawer.addEventListener('close',()=>{closing=false;drawer.classList.remove('is-closing');document.body.classList.remove('service-drawer-open');document.querySelectorAll('[data-service]').forEach(b=>{b.setAttribute('aria-expanded','false');b.closest('.service-card').classList.remove('selected');});opener?.focus({preventScroll:true});});
}
