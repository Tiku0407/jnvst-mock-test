/* JNVST मॉक टेस्ट · आकृति सहायक (सभी सेट इन्हीं से चित्र बनाते हैं) */
const svg=(w,h,inner,lab)=>`<svg viewBox="0 0 ${w} ${h}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${lab||'आकृति'}">${inner}</svg>`;
const fr=()=>`<rect x="3" y="3" width="94" height="94" stroke-width="1.4" opacity=".5"/>`;
const T=(x,y,t,s=17)=>`<text x="${x}" y="${y}" fill="currentColor" stroke="none" font-size="${s}" font-family="Mukta,sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="central">${t}</text>`;
const arr=(cx,cy,a,l=36)=>`<g transform="rotate(${a} ${cx} ${cy})"><line x1="${cx}" y1="${cy+l/2}" x2="${cx}" y2="${cy-l/2}"/><polyline points="${cx-7},${cy-l/2+9} ${cx},${cy-l/2} ${cx+7},${cy-l/2+9}"/></g>`;
const one=inner=>svg(100,100,fr()+inner);
const seq=list=>svg(list.length*100,100,list.map((x,i)=>`<g transform="translate(${i*100} 0)">${fr()}${x}</g>`).join(''));
const DP=[[50,50],[25,25],[75,75],[75,25],[25,75],[25,50],[75,50],[50,25],[50,75]];
const dots=n=>DP.slice(0,n).map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="6.5" fill="currentColor" stroke="none"/>`).join('');
const poly=(n,r=36)=>{let p=[];for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;p.push((50+r*Math.cos(a)).toFixed(1)+','+(50+r*Math.sin(a)).toFixed(1))}return `<polygon points="${p.join(' ')}"/>`};
const CORNER={tl:[20,20],tr:[80,20],br:[80,80],bl:[20,80]};
const q7=(c,k)=>{const p=CORNER[c];let s=`<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="currentColor" stroke="none"/>`;for(let i=0;i<k;i++){const y=50+(i-(k-1)/2)*9;s+=`<line x1="38" y1="${y}" x2="62" y2="${y}"/>`}return s};
const solid=pts=>`<polygon points="${pts}" fill="currentColor" fill-opacity=".14"/>`;
const piece=d=>`<path d="${d}" fill="currentColor" fill-opacity=".14"/>`;
const rect=(w,h)=>solid(`${50-w/2},${50-h/2} ${50+w/2},${50-h/2} ${50+w/2},${50+h/2} ${50-w/2},${50+h/2}`);
const SQ=`<rect x="10" y="10" width="80" height="80"/>`;
const tri3=(x,a,b,c,m)=>`<polygon points="${x+55},6 ${x+5},104 ${x+105},104"/>${T(x+55,34,a,16)}${T(x+24,91,b,16)}${T(x+86,91,c,16)}<circle cx="${x+55}" cy="70" r="13" stroke-width="1.5"/>${T(x+55,70,m,16)}`;
const clock=()=>{let s=`<circle cx="50" cy="50" r="44"/>`;for(let i=0;i<12;i++){s+=`<line x1="50" y1="9" x2="50" y2="${i%3?13:16}" stroke-width="2" transform="rotate(${i*30} 50 50)"/>`}
  s+=T(50,24,'12',11)+T(77,50,'3',11)+T(50,77,'6',11)+T(23,50,'9',11);
  s+=`<line x1="50" y1="50" x2="50" y2="28" stroke-width="4" transform="rotate(97.5 50 50)"/><line x1="50" y1="50" x2="50" y2="16" stroke-width="2.6" transform="rotate(90 50 50)"/><circle cx="50" cy="50" r="3" fill="currentColor"/>`;return svg(100,100,s,'घड़ी 3:15')};
const W=(t,c='')=>`<span class="word ${c}">${t}</span>`;
const MV=t=>`<div class="mirror">${W(t)}<span class="mline v" aria-label="दर्पण XY"><b>X</b><i></i><b>Y</b></span></div>`;
const MH=t=>`<div class="mirror col">${W(t)}<span class="mline h" aria-label="जल-सतह XY"><b>X</b><i></i><b>Y</b></span></div>`;
const F=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;

