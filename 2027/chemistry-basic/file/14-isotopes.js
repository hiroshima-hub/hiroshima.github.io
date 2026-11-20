'use strict';
(() => {
  const Q=QuantityModel,input=document.querySelector('#abundance');
  function draw(){
    const p=Number(input.value),other=100-p,average=12*other/100+13.003*p/100;
    document.querySelector('#abundance-value').value=p.toFixed(2)+'％';
    let s=Q.text(500,38,'原子量 ＝ 同位体の相対質量を、存在比で加重平均した値',29,Q.green);
    s+=Q.rect(80,65,840,50,'#fff');
    s+=`<rect x="80" y="65" width="${840*other/100}" height="50" fill="${Q.blue}"/><rect x="${80+840*other/100}" y="65" width="${840*p/100}" height="50" fill="${Q.red}"/>`;
    s+=Q.text(290,151,`¹²C：${other.toFixed(2)}％`,28,Q.blue)+Q.text(710,151,`¹³C：${p.toFixed(2)}％`,28,Q.red);
    s+=Q.text(500,199,`12×${other.toFixed(2)}/100 ＋ 13.003×${p.toFixed(2)}/100 ＝ ${average.toFixed(4)}`,30);
    s+=Q.line(100,261,900,261,Q.gray,4)+Q.line(100,250,100,272)+Q.line(900,250,900,272);
    s+=Q.text(100,299,'12',25,Q.blue)+Q.text(900,299,'13.003',25,Q.red);
    const x=100+(average-12)/1.003*800;
    s+=Q.arrow(x,224,x,255,Q.green);
    const message=`原子量は${average.toFixed(4)}（単位なし）。${p===1.07?'この例では約12.01。¹²Cの相対質量12と区別しよう。':'多く含まれる同位体の値に近くなる。単純に2種類を足して2で割るのではない。'}`;
    Q.render(s,message);Q.result(message);
  }
  input.addEventListener('input',draw);
  document.querySelector('#sample').addEventListener('click',()=>{input.value='1.07';draw();});
  document.querySelector('#half').addEventListener('click',()=>{input.value='50';draw();});
  draw();
})();
