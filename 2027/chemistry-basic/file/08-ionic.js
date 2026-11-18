'use strict';
(() => {
  const M=BondModel, buttons=[...document.querySelectorAll('[data-value]')];
  let state='solid', step=0;
  const descriptions={
    solid:'結晶の中にもNa⁺とCl⁻がある。定位置の周りで振動しているが、結晶中を自由に移動できない。',
    water:'水に溶けると、もともとあったイオンが分かれて動けるようになる。水溶液は電気を通す。',
    melt:'融かしてもイオンは残る。水がなくてもイオンが移動できるため、融解液は電気を通す。',
    slip:'層がずれると、同じ符号のイオンが向かい合って反発する。これが割れやすさにつながる。'
  };
  function draw() {
    let body='';
    const fluid=state==='water'||state==='melt';
    if(state==='water')body+='<rect x="25" y="25" width="470" height="260" rx="12" fill="#eaf5ff"/>';
    for(let r=0;r<4;r++)for(let c=0;c<4;c++){
      const positive=(r+c)%2===0;
      let x=90+c*90, y=50+r*66;
      if(fluid){x=70+c*105+Math.sin(r*2+c+step)*18;y=50+r*66+Math.cos(c*2+r+step)*13;}
      if(state==='slip'&&r<2)x+=90;
      body+=M.ion(x,y,positive,25);
    }
    if(state==='slip'){
      body+=M.arrow(90,18,180,18);
      for(let c=1;c<4;c++)body+=M.arrow(90+c*90,148,90+c*90,124)+M.arrow(90+c*90,156,90+c*90,180);
    }
    body+=M.text(735,66,'Na⁺：Cl⁻ ＝ 1：1',31)+M.ion(615,119,true)+M.text(735,128,'Na⁺ 8個',28)+M.ion(615,180,false)+M.text(735,189,'Cl⁻ 8個',28);
    body+=M.text(735,257,fluid?'イオンが移動できる':'イオンは定位置にある',28,M.green);
    if(state==='slip')body=body.replace('イオンは定位置にある','同符号どうしが反発');
    M.render(body,descriptions[state]);
    document.querySelector('#result').textContent=descriptions[state];
    document.querySelector('#move').disabled=!fluid;
    M.select(buttons,state);
  }
  buttons.forEach(button=>button.addEventListener('click',()=>{state=button.dataset.value;step=0;draw();}));
  document.querySelector('#move').addEventListener('click',()=>{step++;draw();});
  draw();
})();
