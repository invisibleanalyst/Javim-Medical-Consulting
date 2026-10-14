export function initReadability(){
 const button=document.querySelector('#text-size-toggle');
 if(!button)return;
 let large=false;
 try{large=localStorage.getItem('javim-large-text')==='true';}catch{}
 function apply(){document.documentElement.classList.toggle('large-text',large);button.setAttribute('aria-pressed',String(large));button.textContent=large?'Standard text':'Larger text';}
 apply();button.addEventListener('click',()=>{large=!large;apply();try{localStorage.setItem('javim-large-text',String(large));}catch{}});
}
export const readabilityBar=`<div class="readability-bar"><div class="wrap"><span class="readability-location">South C, Nairobi</span><a href="tel:+254114793610">Call 0114 793 610</a><button id="text-size-toggle" type="button" aria-pressed="false">Larger text</button></div></div>`;
