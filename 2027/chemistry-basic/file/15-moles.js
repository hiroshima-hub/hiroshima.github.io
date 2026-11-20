'use strict';
(() => {
  const Q=QuantityModel,substance=document.querySelector('#substance'),amount=document.querySelector('#amount');
  const data={water:{name:'H₂O',mass:18.0,entity:'H₂O分子'},carbon:{name:'C',mass:12.0,entity:'C原子'},co2:{name:'CO₂',mass:44.0,entity:'CO₂分子'},salt:{name:'NaCl',mass:58.5,entity:'NaClの組成単位'}};
  function draw(){
    const d=data[substance.value],n=Number(amount.value),N=n*6.02e23,m=n*d.mass;
    document.querySelector('#amount-value').value=n.toFixed(2)+' mol';
    let s=Q.text(500,41,`${d.name} のモル質量 M ＝ ${Q.fmt(d.mass)} g/mol`,34,Q.green);
    s+=Q.rect(90,72,820,35,'#fff')+`<rect x="90" y="72" width="${820*n/2}" height="35" fill="#c4e0d6"/>`;
    s+=Q.text(90,139,'0',24)+Q.text(500,139,'1 mol',24)+Q.text(910,139,'2 mol',24);
    s+=Q.text(265,187,'粒子数 N ＝ nNₐ',29)+Q.text(750,187,'質量 m ＝ nM',29);
    s+=Q.text(265,240,`${Q.sci(N)} 個`,39,Q.blue)+Q.text(750,240,`${Q.fmt(m)} g`,43,Q.red);
    s+=Q.text(265,288,d.entity+'を数える',26)+Q.text(750,288,`${Q.fmt(n)} mol × ${Q.fmt(d.mass)} g/mol`,26);
    const msg=d.entity==='NaClの組成単位'?`${Q.fmt(n)}molのNaClは${Q.fmt(m)}g。数えているのはNa⁺とCl⁻が1：1の組成単位で、独立したNaCl分子ではない。`:`${Q.fmt(n)}molの${d.name}は${Q.fmt(m)}g。同じmolのまま物質を変えると、粒子数は同じで質量が変わる。`;
    Q.render(s,`${d.entity} ${Q.sci(N)}個、物質量${Q.fmt(n)}mol、質量${Q.fmt(m)}g。`);Q.result(msg);
  }
  substance.addEventListener('change',draw);amount.addEventListener('input',draw);
  document.querySelector('#reset').addEventListener('click',()=>{amount.value='1';draw();});
  draw();
})();
