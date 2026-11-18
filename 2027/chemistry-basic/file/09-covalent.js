'use strict';
(() => {
  const M=BondModel, buttons=[...document.querySelectorAll('[data-value]')];
  const descriptions=[
    'Cl原子の最外殻電子は7個ずつ。不対電子を1個ずつもつ。安定な8個にするには？',
    '電子を1個ずつ出し、1組の電子対を共有する。どちらの原子から数えても、最外殻は8個になる。',
    '原子間の1組が共有電子対。各Cl原子には、結合に使わない非共有電子対が3組ずつある。',
    '共有電子対1組を線1本に置き換える。Cl–Clは単結合。非共有電子対は構造式では省略する。'
  ];
  function draw(step) {
    let body='';
    const centers=step===0?[280,720]:[395,605];
    if(step<2)centers.forEach(x=>{body+=M.circle(x,150,128,'none','#94b5a9');});
    if(step===3){
      body+=M.text(390,170,'Cl',62)+M.text(610,170,'Cl',62)+M.line(445,150,555,150,M.green,7);
    }else{
      centers.forEach((x,index)=>{
        const color=index===0?M.blue:M.red;
        body+=M.text(x,166,'Cl',53);
        if(step<2){
          body+=M.pair(x,35,false,color)+M.pair(x,265,false,color)+M.pair(x+(index===0?-115:115),150,true,color);
        }else{
          body+=M.pair(x,95,false,color)+M.pair(x,210,false,color)+M.pair(x+(index===0?-60:60),150,true,color);
        }
        if(step===0)body+=M.circle(x+(index===0?115:-115),150,6,color);
      });
      if(step>0)body+=M.circle(500,140,6,M.blue)+M.circle(500,160,6,M.red);
      if(step===2)body+='<rect x="480" y="120" width="40" height="60" rx="15" fill="none" stroke="#b64d35" stroke-width="2"/>'+M.text(500,270,'共有電子対 1組',30,M.red);
    }
    M.render(body,descriptions[step]);
    document.querySelector('#result').textContent=descriptions[step];
    M.select(buttons,step);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>draw(Number(b.dataset.value))));
  draw(0);
})();
