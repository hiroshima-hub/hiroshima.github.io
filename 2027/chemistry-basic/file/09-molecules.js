'use strict';
(() => {
  const M=BondModel;
  const polarView=new URLSearchParams(location.search).get('view')==='polarity';
  const select=document.querySelector('#molecule'), rotation=document.querySelector('#rotation');
  const bondCheck=document.querySelector('#bond-polarity'), netCheck=document.querySelector('#net-polarity');
  const molecules={
    water:{formula:'H₂O',shape:'折れ線形',center:'O',outer:'H',points:[[-.79,-.61,0],[.79,-.61,0]],polar:true,net:[0,1,0],towardCenter:true,reason:'O–Hの偏りが打ち消し合わず、O側に偏る。'},
    co2:{formula:'CO₂',shape:'直線形',center:'C',outer:'O',points:[[-1.2,0,0],[1.2,0,0]],polar:false,double:true,reason:'C=Oの偏りは、反対向きで打ち消し合う。'},
    ammonia:{formula:'NH₃',shape:'三角錐形',center:'N',outer:'H',points:[[0,-.35,.94],[-.81,-.35,-.47],[.81,-.35,-.47]],polar:true,net:[0,1,0],towardCenter:true,reason:'3本のN–Hの偏りは打ち消し合わず、N側に偏る。'},
    methane:{formula:'CH₄',shape:'正四面体形',center:'C',outer:'H',points:[[0,1,0],[0,-1/3,.943],[-.816,-1/3,-.471],[.816,-1/3,-.471]],polar:false,towardCenter:true,reason:'C–Hの小さな偏りも、対称な形によって全体では打ち消し合う。'},
    hydrogen:{formula:'H₂',shape:'直線形',center:'H',outer:'H',points:[[1.2,0,0]],polar:false,noBondPolarity:true,reason:'同じ原子どうしなので、結合に偏りがない。'},
    hcl:{formula:'HCl',shape:'直線形',center:'H',outer:'Cl',points:[[1.2,0,0]],polar:true,net:[1,0,0],reason:'共有電子対はCl側に偏る。'}
  };
  document.querySelector('#polarity-controls').hidden=!polarView;
  // hiddenのUA規則をflexが上書きしないよう、表示は明示する。
  if(!polarView)document.querySelector('#polarity-controls').style.display='none';
  if(polarView){document.querySelector('h1').textContent='結合の偏りと、分子全体の偏り';document.body.classList.add('model-polarity');}
  function draw() {
    const d=molecules[select.value], angle=Number(rotation.value)*Math.PI/180;
    const project=p=>{
      const x=p[0]*Math.cos(angle)+p[2]*Math.sin(angle),z=-p[0]*Math.sin(angle)+p[2]*Math.cos(angle);
      return [330+125*x,155-110*(p[1]*.88-z*.35),z];
    };
    const center=project([0,0,0]);
    const ps=d.points.map(project);
    let body='';
    ps.forEach(p=>{
      body+=M.line(center[0],center[1],p[0],p[1],M.gray,d.double?9:6);
      if(d.double)body+=M.line(center[0],center[1],p[0],p[1],'white',3);
      if(polarView&&bondCheck.checked&&!d.noBondPolarity){
        const dx=p[0]-center[0],dy=p[1]-center[1],len=Math.hypot(dx,dy)||1;
        const a=[center[0]+dx*.3-dy/len*22,center[1]+dy*.3+dx/len*22],b=[center[0]+dx*.75-dy/len*22,center[1]+dy*.75+dx/len*22];
        body+=d.towardCenter?M.arrow(...b,...a):M.arrow(...a,...b);
      }
    });
    [...ps.map((p,i)=>({p,label:d.outer})),{p:center,label:d.center}].sort((a,b)=>a.p[2]-b.p[2]).forEach(({p,label})=>{body+=M.atom(p[0],p[1],label,label==='H'?22:29);});
    body+=M.text(760,53,d.formula+'　'+d.shape,32,M.green);
    if(polarView&&netCheck.checked){
      body+=M.text(760,111,d.polar?'極性分子':'無極性分子',37,M.red);
      if(d.polar){
        const net=project(d.net),dx=net[0]-330,dy=net[1]-155;
        body+=M.arrow(760-dx*.35,205-dy*.35,760+dx*.35,205+dy*.35,M.blue)+M.text(760,279,'分子全体の偏り',25,M.blue);
      }else body+=M.text(760,204,'全体の偏り：0',30,M.blue);
    }else body+=M.text(760,145,polarView?'偏りは打ち消し合う？':'向きを変えて比べよう',28);
    M.render(body,d.formula+'は'+d.shape+(polarView&&netCheck.checked?'。'+d.reason:''));
    document.querySelector('#result').textContent=polarView?(netCheck.checked?d.reason:'赤い矢印は電子が偏る向き。結合の偏りを確かめ、全体で打ち消すか考えよう。'):'H₂O：折れ線形／CO₂：直線形／NH₃：三角錐形／CH₄：正四面体形。';
  }
  select.addEventListener('change',()=>{rotation.value=0;draw();});
  [rotation,bondCheck,netCheck].forEach(el=>el.addEventListener('input',draw));
  document.querySelector('#reset').addEventListener('click',()=>{rotation.value=0;draw();});
  draw();
})();
