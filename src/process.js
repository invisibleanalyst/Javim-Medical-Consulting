import {whatsapp} from './data.js';

const steps = [
  {id:'enquire',label:'Enquire',title:'A conversation first.',copy:'Tell us the test you need, or share your clinician’s request. Our team confirms availability, preparation, pricing and expected timing.',note:'If an external laboratory is needed, ask our team to explain the arrangements before you proceed.',cta:'Enquire on WhatsApp',message:'Hello Javim Medical, I would like to enquire about a test. Please confirm availability, preparation, pricing, expected timing and whether an external laboratory is needed.'},
  {id:'sample',label:'Arrange your sample',title:'Your sample. Your next step.',copy:'Arrange a lab visit, a prepared specimen drop-off, or sample collection in Nairobi and surrounding areas. Our team confirms what is suitable for your test.',note:'Check preparation and collection instructions before taking or bringing a sample.',cta:'Arrange an appointment',booking:true},
  {id:'results',label:'Testing & results',title:'Know what comes next.',copy:'Your sample follows the testing arrangements confirmed with our team. Ask when to expect your results and how they will be shared.',note:'Timing depends on the test and whether an external laboratory is involved. Discuss the results with your clinician.',cta:'Ask about results on WhatsApp',message:'Hello Javim Medical, I would like guidance on expected results timing and how results are shared. Please let me know the appropriate way to follow up.'},
];
const arrow='<span aria-hidden="true">↗</span>';
export function renderProcess(){
return `<section class="process-section" aria-labelledby="process-heading"><div class="process-image-stack">${steps.map((s,i)=>`<img src="/assets/process/${s.id}.webp" srcset="/assets/process/${s.id}-small.webp 480w, /assets/process/${s.id}.webp 960w" sizes="(max-width:760px) 90vw, 42vw" width="960" height="960" alt="" loading="lazy" decoding="async" data-process-image="${s.id}" ${i?'hidden':''}>`).join('')}</div><div class="process-copy"><span class="eyebrow">HOW IT WORKS</span><h2 id="process-heading">A clear path.<br>From enquiry to results.</h2><div class="process-tabs" role="tablist" aria-label="Your testing journey">${steps.map((s,i)=>`<button type="button" id="process-tab-${s.id}" role="tab" aria-selected="${i===0}" aria-controls="process-panel-${s.id}" tabindex="${i===0?0:-1}" data-process-step="${s.id}"><span class="index">0${i+1}</span><span>${s.label}</span></button>`).join('')}</div><div class="process-panels">${steps.map((s,i)=>`<div id="process-panel-${s.id}" role="tabpanel" aria-labelledby="process-tab-${s.id}" tabindex="0" ${i?'hidden':''}><h3>${s.title}</h3><p>${s.copy}</p><p class="process-note">${s.note}</p>${s.booking?`<button class="button process-cta" data-book>${s.cta} ${arrow}</button>`:`<a class="text-link whatsapp-link process-cta" href="${whatsapp(s.message)}" target="_blank" rel="noopener noreferrer">${s.cta} ${arrow}</a>`}</div>`).join('')}</div></div></section>`;
}
export function initProcess(){
 const tabs=[...document.querySelectorAll('[data-process-step]')];
 function select(tab){
  for(const t of tabs){const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;document.querySelector(`[data-process-image="${t.dataset.processStep}"]`).hidden=!active;}
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>select(tab));
  tab.addEventListener('keydown',event=>{
   const move={ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1};
   if(!(event.key in move))return;
   event.preventDefault();const next=tabs[move[event.key]];select(next);next.focus();
  });
 });
}
