'use strict';
(() => {
  const Q=QuantityModel,gas=document.querySelector('#gas'),volume=document.querySelector('#volume'),oxygen=document.querySelector('#oxygen');
  const gases={hydrogen:{name:'H₂',mass:2},methane:{name:'CH₄',mass:16},nitrogen:{name:'N₂',mass:28}};
  function draw(){
    const mix=gas.value==='mixture',p=Number(oxygen.value)/100,V=Number(volume.value),n=V/22.4;
    const d=mix?{name:'N₂＋O₂',mass:28*(1-p)+32*p}:gases[gas.value];
    const mass=n*d.mass,density=d.mass/22.4,count=Math.round(n*20),oxygenCount=mix?Math.round(count*p):0;
    oxygen.disabled=!mix;document.querySelector('#oxygen-value').value=mix?`${Math.round(p*100)}％`:'—';
    let s=Q.text(260,38,`${d.name}：${Q.fmt(V)} L`,32,Q.green);
    const w=210*n,x=260-w/2;
    s+=Q.rect(x,65,w,175,'#f3f8fb');
    // 同温同圧では、容器の体積と代表粒子の個数を同じ比率で変える。
    const cols=Math.max(2,Math.round(n*5));
    for(let i=0;i<count;i++){
      const xx=x+(i%cols+.5)*w/cols,yy=85+Math.floor(i/cols)*40;
      s+=Q.circle(xx,yy,10,mix&&i<oxygenCount?Q.red:Q.blue);
    }
    if(mix)s+=Q.text(260,282,`青：N₂ ${Math.round((1-p)*100)}％　赤：O₂ ${Math.round(p*100)}％`,24);
    else s+=Q.text(260,282,'同温・同圧では V と n は比例する',24);
    s+=Q.text(750,62,`物質量 n ＝ ${Q.fmt(n)} mol`,32)+Q.text(750,116,`総粒子数 N ＝ ${Q.sci(n*6.02e23)} 個`,28,Q.blue);
    s+=Q.text(750,181,`質量 ＝ ${Q.fmt(mass)} g`,36,Q.red)+Q.text(750,237,`密度 ＝ ${Q.fmt(density)} g/L`,28);
    const msg=mix?'温度・圧力・体積をそろえれば、混合割合を変えても総粒子数は同じ。質量と密度は変わる。':'気体の種類を変えても、同温・同圧・同体積なら物質量と総粒子数は同じ。';
    Q.render(s,`${d.name}、${V}L、${Q.fmt(n)}mol、${Q.sci(n*6.02e23)}個、${Q.fmt(mass)}g。`);Q.result(msg);
  }
  [gas,volume].forEach(el=>el.addEventListener('change',draw));oxygen.addEventListener('input',draw);draw();
})();
