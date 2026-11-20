'use strict';
(() => {
  const Q=QuantityModel,buttons=[...document.querySelectorAll('[data-value]')];
  function draw(mode){
    const molar=mode==='molar';Q.select(buttons,mode);
    const samples=[{name:'A：ブドウ糖水溶液',percent:20,density:1.08,M:180,color:Q.blue},{name:'B：尿素水溶液',percent:10,density:1.03,M:60,color:Q.red}];
    let s='';
    samples.forEach((d,i)=>{
      const x=30+i*500,c=d.percent/100*d.density*1000/d.M;
      const value=molar?c:d.percent,maximum=molar?2:25;
      s+=Q.rect(x,16,440,278)+Q.text(x+220,56,d.name,30,d.color);
      s+=Q.text(x+220,99,molar?'溶液1Lに含まれる溶質':'溶液100gに含まれる溶質',25);
      s+=Q.rect(x+35,119,370,43,'#e0e9e5');
      s+=`<rect x="${x+35}" y="119" width="${370*value/maximum}" height="43" rx="6" fill="${d.color}"/>`;
      s+=Q.text(x+220,205,molar?`${c.toFixed(2)} mol/L`:`${d.percent.toFixed(1)} ％`,38,d.color);
      s+=Q.text(x+220,250,molar?`${Q.fmt(d.percent/100*d.density*1000)} g ÷ ${d.M} g/mol`:`溶質 ${d.percent} g ／ 溶液 100 g`,25);
    });
    const msg=molar?'同じ体積なら、溶質の分子数が多いのはB。1Lあたりの溶質の物質量で比べる。':'同じ質量なら、溶質の質量が多いのはA。分子数の比較にはモル質量と密度も必要。';
    Q.render(s,molar?'モル濃度はAが1.20mol/L、Bが1.72mol/L。Bの方が大きい。':'質量パーセント濃度はAが20.0％、Bが10.0％。Aの方が大きい。');Q.result(msg);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>draw(b.dataset.value)));draw('mass');
})();
