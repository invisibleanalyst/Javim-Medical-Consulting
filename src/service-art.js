// Original abstract vector studies; decorative, not diagnostic imagery.
export function serviceArt(index) {
  const id = `service-art-${index}`;
  const orb = (x,y,r,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})" ${extra}/>`;
  const motifs = [
    [orb(95,100,44),orb(210,65,30),orb(245,155,49),orb(160,187,24)].join('') + '<g fill="none" stroke="#9f1028" stroke-width="9" opacity=".45"><ellipse cx="95" cy="100" rx="22" ry="14"/><ellipse cx="245" cy="155" rx="25" ry="16"/></g>',
    '<g stroke="#d64a55" stroke-width="3"><path d="m80 160 67-93 90 35 20 90-110 18Z M147 67v143m-67-50 157-58m-90 108 90-108"/></g>'+[[80,160,24],[147,67,31],[237,102,25],[257,192,18],[147,210,22]].map(p=>orb(...p)).join(''),
    Array.from({length:9},(_,i)=>{const y=30+i*24,x=160+Math.sin(i*.65)*55;return `<path d="M${x} ${y}H${320-x}" stroke="#dc7e83" stroke-width="3"/>${orb(x,y,10)}${orb(320-x,y,10)}`;}).join(''),
    '<g fill="none" stroke="url(#'+id+')" stroke-width="18" stroke-linecap="round"><path d="m100 65 48 53 47-53m-47 53v86M210 120l28 32 31-32m-31 32v51"/></g>'+orb(100,65,9)+orb(195,65,9),
    Array.from({length:14},(_,i)=>{const x=57+(i*59)%230,y=45+(i*37)%165;return `<g transform="rotate(${i*31} ${x} ${y})"><rect x="${x-9}" y="${y-21}" width="18" height="42" rx="9" fill="url(#${id})"/></g>`;}).join(''),
    '<g fill="none" stroke="url(#'+id+')" stroke-width="18" stroke-linecap="round"><path d="M65 177c-40-86 84-131 94-56s-65 103-33 42S254 60 267 135s-60 92-58 51"/></g>'+[orb(90,68,13),orb(252,62,9),orb(180,213,12)].join(''),
    Array.from({length:16},(_,i)=>{const x=55+(i%4)*69+(Math.floor(i/4)%2)*10,y=35+Math.floor(i/4)*61;return orb(x,y,25)+`<circle cx="${x+3}" cy="${y-2}" r="8" fill="#98182a" opacity=".65"/>`;}).join(''),
  ];
  return `<svg class="service-art" viewBox="0 0 340 260" fill="none" aria-hidden="true"><defs><radialGradient id="${id}" cx=".3" cy=".25" r=".8"><stop stop-color="#ff9a91"/><stop offset=".45" stop-color="#e52837"/><stop offset="1" stop-color="#a40f27"/></radialGradient></defs>${motifs[index]}</svg>`;
}
