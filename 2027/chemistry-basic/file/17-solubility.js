'use strict';
(() => {
  const Q=QuantityModel,cooling=new URLSearchParams(location.search).get('mode')==='cooling';
  const water=document.querySelector('#water'),added=document.querySelector('#added'),temperature=document.querySelector('#temperature');
  document.querySelector('#dissolving-controls').hidden=cooling;
  document.querySelector('#cooling-controls').hidden=!cooling;
  if(cooling){
    document.querySelector('h1').textContent='再結晶：冷やすと、溶けていられる量が減る';
    document.querySelector('.model-note').textContent='架空の溶解度を直線で結んだ計算例。水100gに60℃で溶質80gを溶かして冷却。蒸発・水和物の生成はなく、各温度で十分に時間を置いて平衡に達したものとする。';
  }
  function draw(){
    let s='',dissolved,solid,msg;
    if(cooling){
      const t=Number(temperature.value);dissolved=20+(t-20)*1.5;solid=80-dissolved;
      document.querySelector('#temperature-value').value=`${t} ℃`;
      // 架空の曲線。実在物質の測定値と誤認されないよう図中でも明示。
      const px=90+(t-20)*8,py=245-dissolved*2;
      s+=Q.text(240,31,'溶解度［g / 水100g］',26)+Q.line(90,245,430,245)+Q.line(90,245,90,60);
      s+=Q.line(90,205,410,85,Q.blue,5)+Q.line(px,py,px,245,Q.gray,2,true)+Q.circle(px,py,9,Q.red);
      s+=Q.text(90,275,'20℃',24)+Q.text(410,275,'60℃',24)+Q.text(68,213,'20',22,Q.ink,'end')+Q.text(68,93,'80',22,Q.ink,'end');
      s+=Q.text(270,300,'架空の物質・直線で補間',19,Q.gray);
      s+=Q.text(735,45,`水100g ／ 温度 ${t}℃`,28);
      s+=Q.rect(520,66,430,65,'#eef5fb')+Q.text(735,109,`溶けている溶質：${Q.fmt(dissolved)} g`,31,Q.blue);
      s+=Q.rect(520,150,430,65,'#fff0e5')+Q.text(735,193,`出てきた結晶：${Q.fmt(solid)} g`,31,Q.red);
      s+=Q.text(735,267,`${Q.fmt(dissolved)} g ＋ ${Q.fmt(solid)} g ＝ 80 g`,28);
      msg=`${t}℃：溶けている溶質 ${Q.fmt(dissolved)}g、結晶 ${Q.fmt(solid)}g。水の質量は100gのまま。`;
    }else{
      const w=Number(water.value),a=Number(added.value),capacity=w*.4;
      dissolved=Math.min(a,capacity);solid=Math.max(0,a-capacity);
      const solution=w+dissolved,percent=dissolved/solution*100;
      document.querySelector('#added-value').value=`${a} g`;
      s+=Q.text(245,34,`水 ${w} g ＋ 溶質 ${a} g`,30);
      s+=Q.rect(105,64,280,214,'#fff');
      s+=`<rect x="110" y="109" width="270" height="145" fill="#deedf8"/>`;
      // 丸は溶質の存在を示す模式記号。実際の分子数や大きさではない。
      for(let i=0;i<Math.round(dissolved/2);i++)s+=Q.circle(130+(i%5)*56,129+Math.floor(i/5)*29,7,Q.blue);
      if(solid>0) s+=`<path d="M118 266 l18 -20 15 20 25 -17 17 17 24 -23 20 23 27 -18 17 18 23 -22 25 22 26 -17 20 17Z" fill="${Q.red}"/>`;
      s+=Q.text(245,299,'青：溶けた溶質　赤：溶け残り',22);
      s+=Q.text(735,44,`溶解度 40 g / 水100g`,30,Q.green);
      s+=Q.text(735,100,`溶けた溶質 ${Q.fmt(dissolved)} g`,34,Q.blue)+Q.text(735,150,`溶け残った固体 ${Q.fmt(solid)} g`,30,Q.red);
      s+=Q.text(735,210,`溶液の質量 ${w} ＋ ${Q.fmt(dissolved)} ＝ ${Q.fmt(solution)} g`,26);
      s+=Q.text(735,268,`質量パーセント濃度 ${Q.fmt(percent)} ％`,30,Q.green);
      msg=`${a<capacity?'まだ溶ける。':'飽和している。'}溶ける上限は${Q.fmt(capacity)}g。濃度は${Q.fmt(dissolved)}÷${Q.fmt(solution)}×100＝${Q.fmt(percent)}％。溶け残りは溶液に含めない。`;
    }
    Q.render(s,msg);Q.result(msg);
  }
  water.addEventListener('change',draw);added.addEventListener('input',draw);temperature.addEventListener('input',draw);
  document.querySelector('#saturate').addEventListener('click',()=>{added.value=Number(water.value)*.4;draw();});
  document.querySelector('#excess').addEventListener('click',()=>{added.value=Math.min(80,Number(added.value)+10);draw();});
  document.querySelector('#cold').addEventListener('click',()=>{temperature.value=20;draw();});
  document.querySelector('#hot').addEventListener('click',()=>{temperature.value=60;draw();});draw();
})();
