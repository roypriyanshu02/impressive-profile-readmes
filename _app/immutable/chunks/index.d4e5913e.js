import"./index.8b245e94.js";function y(o){const t=o-1;return t*t*t+1}function $(o,{delay:t=0,duration:c=400,easing:a=y,x:e=0,y:f=0,opacity:p=0}={}){const n=getComputedStyle(o),r=+n.opacity,i=n.transform==="none"?"":n.transform,u=r*(1-p);return{delay:t,duration:c,easing:a,css:(s,m)=>`
			transform: ${i} translate(${(1-s)*e}px, ${(1-s)*f}px);
			opacity: ${r-u*m}`}}export{$ as f};
