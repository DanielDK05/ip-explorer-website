import{S as De,i as Te,s as He,k as v,a as A,J as $e,l as k,h,c as N,m as M,n as u,p as Ae,G as s,b as oe,H as Ne,o as ze,K as Le,y as Oe,q as I,z as qe,r as w,A as Fe,L as Z,M as Pe,N as Ce,u as G,g as je,d as Ke,B as We,O as Ge,P as Je}from"../chunks/index.858e9eb7.js";import{b as Qe}from"../chunks/paths.b9b28075.js";function ie(t){const e=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;if(!t.match(e))return;const n=t.split(".").map(r=>parseInt(r).toString(2).padStart(8,"0")).join("");return parseInt(n,2)}function Xe(t){const e=ie(t);if(!e)return!1;const n=(e>>>0).toString(2);return/^(1+)(0+)$/.test(n)}function Ye(t){return/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(t)}function Ze(t){return/^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))$/.test(t)}function xe(t){const e=/^((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?:\/([0-9]|[1-2][0-9]|3[0-2]))$/,n=t.match(e);if(!n)return;const r=ie(n[1]),a=et(parseInt(n[2]));if(!(!r||!a))return{ip:r,mask:a}}function et(t){t=Math.max(0,Math.min(32,t));const e="1".repeat(t)+"0".repeat(32-t);return parseInt(e,2)}function se(t,e){return(t&e)>>>0}function Se(t,e){const n=~e>>>0;return(t|n)>>>0}function tt(t,e){return{start:se(t,e)+1,end:Se(t,e)-1}}function z(t){const e=[];for(let n=24;n>=0;n-=8){const r=t>>>n&255;e.push(r)}return e.join(".")}function nt(t,e,n){e=se(e,n);const r=st(t),a=rt(n,r),l=n^a;let c=[];for(let i=0;i<Math.pow(2,r);i++){const d=l&i<<32-Ve(a),E=(e|d)>>>0;c.push({ip:se(E,a),mask:a})}return c}function st(t){return Math.ceil(Math.log2(t))}function rt(t,e){const n=Ve(t),a=(1<<e)-1<<32-n-e;return(t|a)>>>0}function Ve(t){let e=0;for(;t;)e+=t&1,t=t>>>1;return e}function at(t,e,n,r,a){const l=Array(a).fill(0);function c(i,d,E){if(i!==0){for(let p=0;p<a;p++){const B=Math.random()*2-1;l[p]+=B*E,l[p]=Math.max(-t,Math.min(l[p],t))}c(i-1,d*r,E*n)}}return c(e,1,t),l}const{document:Ue}=Le;function lt(t){let e,n,r;return{c(){e=v("link"),n=A(),r=v("div"),this.h()},l(a){const l=$e("svelte-10ezk4d",Ue.head);e=k(l,"LINK",{rel:!0,href:!0}),l.forEach(h),n=N(a),r=k(a,"DIV",{id:!0,style:!0,class:!0}),M(r).forEach(h),this.h()},h(){u(e,"rel","stylesheet"),u(e,"href",Qe+"/fonts.css"),u(r,"id","background"),Ae(r,"background-image",t[0]),u(r,"class","svelte-8mv3ql")},m(a,l){s(Ue.head,e),oe(a,n,l),oe(a,r,l)},p(a,[l]){l&1&&Ae(r,"background-image",a[0])},i:Ne,o:Ne,d(a){h(e),a&&h(n),a&&h(r)}}}function ot(){return new Promise((t,e)=>{const n=new FontFace("randygg","url(/fonts/randygg.otf)");n.load().then(()=>{document.fonts.add(n),t()}).catch(r=>{e(r)})})}function it(t,e){let n=null;return function(...r){clearTimeout(n),n=setTimeout(()=>{t.apply(null,r)},e)}}function ut(t,e,n){let r;function a(){const l=document.createElement("canvas"),c=l.getContext("2d"),i=20,d=Math.ceil(window.innerWidth/i),E=Math.ceil(window.innerHeight/i);if(!c)return;l.width=window.innerWidth,l.height=window.innerHeight;const p=at(E*i*.65,8,.5,0,d);c.font=`${i}px randygg`,c.textAlign="center",c.textBaseline="middle";for(let m=0;m<d;m++)for(let P=0;P<E;P++){c.fillStyle=p[m]>i*P?"#5e6ebf":"#293469";const g=Math.random()>.5?0:1;c.fillText(g.toString(),(m+.5)*i,(P+.5)*i)}return`url(${l.toDataURL()})`}return ze(async()=>{try{await ot(),n(0,r=a()),window.addEventListener("resize",it(()=>{n(0,r=a())},300))}catch(l){console.error("Error loading canvas: ",l)}}),[r]}class ct extends De{constructor(e){super(),Te(this,e,ut,lt,He,{})}}function Be(t,e,n){const r=t.slice();return r[16]=e[n],r[18]=n,r}function Re(t){let e,n,r,a=t[18]+1+"",l,c,i,d,E,p=t[16].networkAddress+"",B,m,P,g,U=t[16].broadcastAddress+"",V,C,D,T,_=t[16].mask+"",j,L;return{c(){e=v("div"),n=v("h2"),r=I("Subnet "),l=I(a),c=I(":"),i=A(),d=v("p"),E=I("Network address: "),B=I(p),m=A(),P=v("p"),g=I("Broadcast address: "),V=I(U),C=A(),D=v("p"),T=I("Mask: "),j=I(_),L=A(),this.h()},l(R){e=k(R,"DIV",{class:!0});var S=M(e);n=k(S,"H2",{});var H=M(n);r=w(H,"Subnet "),l=w(H,a),c=w(H,":"),H.forEach(h),i=N(S),d=k(S,"P",{});var J=M(d);E=w(J,"Network address: "),B=w(J,p),J.forEach(h),m=N(S),P=k(S,"P",{});var O=M(P);g=w(O,"Broadcast address: "),V=w(O,U),O.forEach(h),C=N(S),D=k(S,"P",{});var K=M(D);T=w(K,"Mask: "),j=w(K,_),K.forEach(h),L=N(S),S.forEach(h),this.h()},h(){u(e,"class","subnet svelte-19gphks")},m(R,S){oe(R,e,S),s(e,n),s(n,r),s(n,l),s(n,c),s(e,i),s(e,d),s(d,E),s(d,B),s(e,m),s(e,P),s(P,g),s(P,V),s(e,C),s(e,D),s(D,T),s(D,j),s(e,L)},p(R,S){S&256&&p!==(p=R[16].networkAddress+"")&&G(B,p),S&256&&U!==(U=R[16].broadcastAddress+"")&&G(V,U),S&256&&_!==(_=R[16].mask+"")&&G(j,_)},d(R){R&&h(e)}}}function dt(t){let e,n,r,a,l,c,i,d,E,p,B,m,P,g,U,V,C=(t[3]?t[3]:"Unable to calculate")+"",D,T,_,j,L=(t[4]?t[4]:"Unable to calculate")+"",R,S,H,J,O=(t[5]?t[5]:"Unable to calculate")+"",K,ue,Q,ce,x=(t[6]?t[6]:"Unable to calculate")+"",re,de,X,pe,ee=t[7]?`${t[7].start}-${t[7].end}`:"Unable to calculate",ae,fe,q,te,he,ge,W,F,_e,Ee;n=new ct({});let Y=t[8],y=[];for(let o=0;o<Y.length;o+=1)y[o]=Re(Be(t,Y,o));return{c(){e=v("div"),Oe(n.$$.fragment),r=A(),a=v("div"),l=v("h1"),c=I("IP Explorer"),i=A(),d=v("input"),E=A(),p=v("input"),B=A(),m=v("input"),P=A(),g=v("div"),U=v("p"),V=I("IP address: "),D=I(C),T=A(),_=v("p"),j=I("Network Mask: "),R=I(L),S=A(),H=v("p"),J=I("Network address: "),K=I(O),ue=A(),Q=v("p"),ce=I("Broadcast address: "),re=I(x),de=A(),X=v("p"),pe=I("IP range: "),ae=I(ee),fe=A(),q=v("div"),te=v("h1"),he=I("Subnets:"),ge=A(),W=v("div");for(let o=0;o<y.length;o+=1)y[o].c();this.h()},l(o){e=k(o,"DIV",{id:!0,class:!0});var b=M(e);qe(n.$$.fragment,b),r=N(b),a=k(b,"DIV",{id:!0,class:!0});var f=M(a);l=k(f,"H1",{id:!0,class:!0});var ne=M(l);c=w(ne,"IP Explorer"),ne.forEach(h),i=N(f),d=k(f,"INPUT",{type:!0,placeholder:!0,class:!0}),E=N(f),p=k(f,"INPUT",{type:!0,placeholder:!0,class:!0}),B=N(f),m=k(f,"INPUT",{type:!0,placeholder:!0,class:!0}),f.forEach(h),P=N(b),g=k(b,"DIV",{id:!0,class:!0});var $=M(g);U=k($,"P",{id:!0});var me=M(U);V=w(me,"IP address: "),D=w(me,C),me.forEach(h),T=N($),_=k($,"P",{id:!0});var ve=M(_);j=w(ve,"Network Mask: "),R=w(ve,L),ve.forEach(h),S=N($),H=k($,"P",{id:!0});var ke=M(H);J=w(ke,"Network address: "),K=w(ke,O),ke.forEach(h),ue=N($),Q=k($,"P",{id:!0});var be=M(Q);ce=w(be,"Broadcast address: "),re=w(be,x),be.forEach(h),de=N($),X=k($,"P",{id:!0});var Ie=M(X);pe=w(Ie,"IP range: "),ae=w(Ie,ee),Ie.forEach(h),$.forEach(h),fe=N(b),q=k(b,"DIV",{id:!0,class:!0});var le=M(q);te=k(le,"H1",{});var Me=M(te);he=w(Me,"Subnets:"),Me.forEach(h),ge=N(le),W=k(le,"DIV",{id:!0,class:!0});var ye=M(W);for(let we=0;we<y.length;we+=1)y[we].l(ye);ye.forEach(h),le.forEach(h),b.forEach(h),this.h()},h(){u(l,"id","headline"),u(l,"class","svelte-19gphks"),u(d,"type","text"),u(d,"placeholder","type IP here:"),u(d,"class","svelte-19gphks"),u(p,"type","text"),u(p,"placeholder","type mask here:"),u(p,"class","svelte-19gphks"),u(m,"type","number"),u(m,"placeholder","subnet amount:"),u(m,"class","svelte-19gphks"),u(a,"id","inputs"),u(a,"class","svelte-19gphks"),u(U,"id","ip"),u(_,"id","networkMask"),u(H,"id","networkAddress"),u(Q,"id","broadcastAddress"),u(X,"id","ipRange"),u(g,"id","info"),u(g,"class","svelte-19gphks"),u(W,"id","subnets"),u(W,"class","svelte-19gphks"),u(q,"id","subnetInfo"),u(q,"class","svelte-19gphks"),u(e,"id","mainContainer"),u(e,"class","svelte-19gphks")},m(o,b){oe(o,e,b),Fe(n,e,null),s(e,r),s(e,a),s(a,l),s(l,c),s(a,i),s(a,d),Z(d,t[0]),s(a,E),s(a,p),Z(p,t[1]),s(a,B),s(a,m),Z(m,t[2]),s(e,P),s(e,g),s(g,U),s(U,V),s(U,D),s(g,T),s(g,_),s(_,j),s(_,R),s(g,S),s(g,H),s(H,J),s(H,K),s(g,ue),s(g,Q),s(Q,ce),s(Q,re),s(g,de),s(g,X),s(X,pe),s(X,ae),s(e,fe),s(e,q),s(q,te),s(te,he),s(q,ge),s(q,W);for(let f=0;f<y.length;f+=1)y[f]&&y[f].m(W,null);F=!0,_e||(Ee=[Pe(d,"input",t[9]),Pe(p,"input",t[10]),Pe(m,"input",t[11])],_e=!0)},p(o,[b]){if(b&1&&d.value!==o[0]&&Z(d,o[0]),b&2&&p.value!==o[1]&&Z(p,o[1]),b&4&&Ce(m.value)!==o[2]&&Z(m,o[2]),(!F||b&8)&&C!==(C=(o[3]?o[3]:"Unable to calculate")+"")&&G(D,C),(!F||b&16)&&L!==(L=(o[4]?o[4]:"Unable to calculate")+"")&&G(R,L),(!F||b&32)&&O!==(O=(o[5]?o[5]:"Unable to calculate")+"")&&G(K,O),(!F||b&64)&&x!==(x=(o[6]?o[6]:"Unable to calculate")+"")&&G(re,x),(!F||b&128)&&ee!==(ee=o[7]?`${o[7].start}-${o[7].end}`:"Unable to calculate")&&G(ae,ee),b&256){Y=o[8];let f;for(f=0;f<Y.length;f+=1){const ne=Be(o,Y,f);y[f]?y[f].p(ne,b):(y[f]=Re(ne),y[f].c(),y[f].m(W,null))}for(;f<y.length;f+=1)y[f].d(1);y.length=Y.length}},i(o){F||(je(n.$$.fragment,o),F=!0)},o(o){Ke(n.$$.fragment,o),F=!1},d(o){o&&h(e),We(n),Ge(y,o),_e=!1,Je(Ee)}}}function pt(t,e,n){let r="10.169.131.69",a="255.255.255.0",l=0,c,i,d,E,p,B,m,P=[];function g(){if(!Ye(r)||!Xe(a))return;if(Ze(r)){const _=xe(r);_&&(c=_.ip,i=_.mask,n(1,a=z(i)))}else c=ie(r),i=ie(a);if(!c||!i)return;n(3,d=z(c)),n(4,E=z(i)),n(5,p=z(se(c,i))),n(6,B=z(Se(c,i)));const T=tt(c,i);n(7,m={start:z(T.start),end:z(T.end)})}function U(){if(!c||!i){n(8,P=[]);return}const T=nt(l,c,i);if(!T){n(8,P=[]);return}n(8,P=T.map(_=>({networkAddress:z(se(_.ip,_.mask)),broadcastAddress:z(Se(_.ip,_.mask)),mask:z(_.mask)})))}function V(){r=this.value,n(0,r)}function C(){a=this.value,n(1,a)}function D(){l=Ce(this.value),n(2,l)}return t.$$.update=()=>{t.$$.dirty&3&&r&&a&&g(),t.$$.dirty&7&&r&&a&&l&&U()},[r,a,l,d,E,p,B,m,P,V,C,D]}class gt extends De{constructor(e){super(),Te(this,e,pt,dt,He,{})}}export{gt as component};