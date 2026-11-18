'use strict';
(() => {
  const M=BondModel,buttons=[...document.querySelectorAll('[data-value]')];
  let state='rest',step=0;
  const descriptions={
    rest:'自由電子は金属全体に広がる。電気や熱をよく伝え、金属光沢のもとにもなる。',
    voltage:'電圧をかけると自由電子が全体として＋側へ移動する。電流の向きは、電子の移動と逆。',
    slip:'層がずれても自由電子との結びつきを保ちやすい。薄く広がる性質が展性、細く伸びる性質が延性。'
  };
  function draw(){
    let body='<rect x="30" y="30" width="650" height="235" rx="12" fill="#eaf4f9"/>';
    for(let r=0;r<3;r++)for(let c=0;c<6;c++)body+=M.ion(90+c*100+(state==='slip'&&r===0?45:0),70+r*78,true,25);
    for(let i=0;i<22;i++){
      const drift=state==='voltage'?step*24:Math.sin(step+i)*16;
      const x=50+((i*97+drift+10000)%605),y=45+(i*47)%195+Math.cos(step+i)*7;
      body+=M.circle(x,y,6,M.red);
    }
    if(state==='voltage')body+=M.text(725,75,'＋側',29,M.blue)+M.arrow(730,120,945,120,M.red)+M.text(835,104,'電子の移動',24,M.red)+M.arrow(945,200,730,200,M.blue)+M.text(835,246,'電流',27,M.blue);
    else if(state==='slip')body+=M.arrow(725,80,945,80)+M.text(835,150,'ずれても',29)+M.text(835,192,'結びつく',29);
    else body+=M.text(835,100,'金属全体を',28)+M.text(835,146,'動ける電子',28)+M.text(835,226,'＝ 自由電子',29,M.red);
    M.render(body,descriptions[state]);
    document.querySelector('#result').textContent=descriptions[state];
    M.select(buttons,state);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{state=b.dataset.value;step=0;draw();}));
  document.querySelector('#move').addEventListener('click',()=>{step++;draw();});
  draw();
})();
