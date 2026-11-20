/* 表示用の数値と基本図形。換算は各教材の式を読み取れる形で記述する。 */
'use strict';
window.QuantityModel = (() => {
  const B=window.BondModel;
  const fmt=(value,digits=3)=>Number(value.toPrecision(digits)).toString();
  function sci(value) {
    if(value===0)return '0';
    let exponent=Math.floor(Math.log10(Math.abs(value)));
    let coefficient=Number((value/10**exponent).toPrecision(3));
    if(coefficient===10){coefficient=1;exponent++;}
    const sup={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    return `${coefficient}×10${String(exponent).split('').map(c=>sup[c]).join('')}`;
  }
  const rect=(x,y,w,h,fill='#edf5f1')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="#b6cdc3"/>`;
  const result=message=>{document.querySelector('#result').textContent=message;};
  return {...B,fmt,sci,rect,result};
})();
