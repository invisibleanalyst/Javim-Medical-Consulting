import {departments} from './data.js';
export function renderServiceAtlas(){
 const d=departments[0];
 return `<section id="services" class="service-atlas section wrap" aria-labelledby="atlas-heading"><div class="atlas-intro"><div><span class="eyebrow">01 / THE SERVICE INDEX</span><h2 id="atlas-heading">Precision,<br>with purpose.</h2></div><p class="muted">From a routine check to a closer investigation.<br>Choose an area to explore its tests.</p><a class="text-link" href="/services">Search all tests <span aria-hidden="true">→</span></a></div><div class="atlas-layout"><div class="atlas-menu" role="group" aria-label="Choose a service category">${departments.map((d,i)=>`<button data-atlas="${d.id}" aria-pressed="${i===0}" aria-controls="atlas-preview"><span class="index">0${i+1}</span><span>${d.name}</span><span class="atlas-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><div id="atlas-preview" class="atlas-preview"><div class="atlas-image"><img id="atlas-image" src="/assets/services/${d.id}.webp" width="840" height="560" alt="" loading="lazy"></div><div class="atlas-caption"><span class="eyebrow" id="atlas-count">${d.tests.length} TESTS</span><div aria-live="polite"><h3 id="atlas-title">${d.name}</h3><p id="atlas-description">${d.summary}</p></div><button class="button" id="atlas-details" data-service="${d.id}" aria-haspopup="dialog" aria-controls="service-drawer" aria-expanded="false">View tests <span aria-hidden="true">→</span></button></div></div></div></section>`;
}
export function initServiceAtlas(){
 const root=document.querySelector('.service-atlas');if(!root)return;
 root.querySelectorAll('[data-atlas]').forEach(button=>button.addEventListener('click',event=>{
  const d=departments.find(d=>d.id===button.dataset.atlas);
  root.querySelectorAll('[data-atlas]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  root.querySelector('#atlas-image').src=`/assets/services/${d.id}.webp`;
  root.querySelector('#atlas-title').textContent=d.name;root.querySelector('#atlas-description').textContent=d.summary;root.querySelector('#atlas-count').textContent=`${d.tests.length} TESTS`;
  root.querySelector('#atlas-details').dataset.service=d.id;
  if(matchMedia('(max-width:600px)').matches&&event.detail>0)root.querySelector('#atlas-preview').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }));
}
