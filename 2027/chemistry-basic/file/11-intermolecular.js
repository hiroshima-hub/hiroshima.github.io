'use strict';
(() => {
  const M=BondModel,buttons=[...document.querySelectorAll('[data-value]')];
  let state='dispersion',phase=0;
  const explanations={
    dispersion:'電子の分布が一瞬偏り、隣にも偏りを誘起する。似た無極性分子では、一般に分子が大きいほど分散力が強くなる。',
    dipole:'極性分子ではδ⁺側とδ⁻側の間に引力がはたらく。沸点は極性だけでなく、大きさ・形などにも左右される。',
    hydrogen:'F・O・Nに結合したHが、別の分子などのF・O・Nの非共有電子対と引き合う。HF・H₂O・NH₃の沸点が同族の水素化合物からの予想より高い理由になる。'
  };
  function draw(){
    let body='';
    if(state==='dispersion'){
      for(const x of [280,720]){
        body+=`<ellipse cx="${x}" cy="140" rx="125" ry="75" fill="#edf4fa" stroke="#93ada5" stroke-width="2"/>`;
        const direction=phase%2===0?1:-1;
        for(let i=0;i<8;i++){const a=i*Math.PI/4;body+=M.circle(x+Math.cos(a)*65+direction*24,140+Math.sin(a)*42,5,M.blue);}
        body+=M.text(x-75,147,direction>0?'δ⁺':'δ⁻',26,M.red)+M.text(x+75,147,direction>0?'δ⁻':'δ⁺',26,M.red);
      }
      body+=M.line(412,140,588,140,M.red,3,true)+M.text(500,266,'瞬間的な偏り → 隣に偏りを誘起 → 引力',28);
    }else if(state==='dipole'){
      for(const x of [280,720]){
        body+=M.line(x-60,140,x+60,140)+M.atom(x-60,140,'H',30)+M.atom(x+60,140,'Cl',40)+M.text(x-60,89,'δ⁺',27,M.red)+M.text(x+60,82,'δ⁻',27,M.blue);
      }
      body+=M.line(387,140,619,140,M.red,3,true)+M.text(500,262,'分子の向きによって、はたらく力は変わる',28);
    }else{
      body+=M.line(250,140,350,140)+M.line(250,140,213,207)+M.atom(250,140,'O',32)+M.atom(350,140,'H',23)+M.atom(213,207,'H',23);
      body+=M.line(630,140,700,90)+M.line(630,140,700,190)+M.atom(630,140,'O',32)+M.atom(700,90,'H',23)+M.atom(700,190,'H',23)+M.pair(582,140,true);
      body+=M.line(382,140,566,140,M.red,4,true)+M.text(475,112,'水素結合',26,M.red)+M.text(350,99,'δ⁺',25,M.red)+M.text(630,93,'δ⁻',25,M.blue)+M.text(500,269,'分子内のO–Hは実線、分子間の引力は点線',28);
    }
    M.render(body,explanations[state]);
    document.querySelector('#result').textContent=explanations[state];
    document.querySelector('#change').disabled=state!=='dispersion';
    M.select(buttons,state);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{state=b.dataset.value;draw();}));
  document.querySelector('#change').addEventListener('click',()=>{phase++;draw();});
  draw();
})();
