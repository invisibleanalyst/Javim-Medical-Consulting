// Progressive enhancement: content stays visible if observers or animation fail.
export function initPageMotion(){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(reduced.matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const active=new Set();
 function reveal(element,delay=0){
  if(reduced.matches)return;
  const animation=element.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
  active.add(animation);animation.finished.then(()=>active.delete(animation)).catch(()=>active.delete(animation));
 }
 if(!location.hash&&scrollY<100){document.querySelectorAll('.hero-copy,.hero-visual,.catalogue-intro,.blood-visual,.privacy-page').forEach((el,i)=>reveal(el,i*85));}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);entry.target.dataset.revealed='true';reveal(entry.target);}}, {threshold:.08,rootMargin:'0px 0px -24px 0px'});
 document.querySelectorAll('.quick-start-card,.about-grid,.process-section,.section-heading,.service-card,.explorer-disclosure,.corporate-grid,.contact-grid,.footer-top').forEach(el=>observer.observe(el));
 reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();active.forEach(animation=>animation.cancel());active.clear();}});
}
