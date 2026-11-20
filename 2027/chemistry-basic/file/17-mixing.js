'use strict';
(() => {
  const Q=QuantityModel,ca=document.querySelector('#ca'),cb=document.querySelector('#cb'),va=document.querySelector('#va'),vb=document.querySelector('#vb');
  function draw(){
    const a=Number(ca.value),b=Number(cb.value),A=Number(va.value)/1000,B=Number(vb.value)/1000;
    const nA=a*A,nB=b*B,n=nA+nB,V=A+B,c=n/V;
    document.querySelector('#ca-value').value=`${a.toFixed(1)} mol/L`;
    document.querySelector('#cb-value').value=`${b.toFixed(1)} mol/L`;
    let s='';
    [{x:10,title:'A',c:a,V:A,n:nA,color:Q.blue},{x:335,title:b===0?'B（水）':'B',c:b,V:B,n:nB,color:Q.red},{x:660,title:'混合後',c,V,n,color:Q.green}].forEach(d=>{
      s+=Q.rect(d.x,12,310,280)+Q.text(d.x+155,48,d.title,30,d.color);
      s+=Q.text(d.x+155,100,`${Q.fmt(d.c)} mol/L`,35,d.color)+Q.text(d.x+155,147,`${Q.fmt(d.V*1000)} mL`,29);
      s+=Q.line(d.x+25,170,d.x+285,170,'#b6cdc3',2);
      s+=Q.text(d.x+155,208,'溶質の物質量',23)+Q.text(d.x+155,257,`${Q.fmt(d.n)} mol`,36,d.color);
    });
    const msg=`溶質：${Q.fmt(nA)}＋${Q.fmt(nB)}＝${Q.fmt(n)}mol。混合後：${Q.fmt(n)}÷${Q.fmt(V)}＝${Q.fmt(c)}mol/L。`;
    Q.render(s,msg);Q.result(msg);
  }
  [ca,cb].forEach(el=>el.addEventListener('input',draw));[va,vb].forEach(el=>el.addEventListener('change',draw));
  document.querySelector('#dilute').addEventListener('click',()=>{cb.value=0;draw();});
  document.querySelector('#reset').addEventListener('click',()=>{ca.value=.2;cb.value=.5;va.value=100;vb.value=200;draw();});draw();
})();
