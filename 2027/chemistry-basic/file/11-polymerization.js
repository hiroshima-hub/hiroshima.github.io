'use strict';
(() => {
  const M=BondModel,condensation=new URLSearchParams(location.search).get('mode')==='condensation';
  const previous=document.querySelector('#previous'),next=document.querySelector('#next'),play=document.querySelector('#play');
  let step=0,timer=null;
  const last=3;
  const explanations=condensation?[
    '両端にOHをもつエチレングリコールと、両端にCOOHをもつテレフタル酸を使う。',
    'COOHのOHと、アルコールのOHのHが水として抜け、エステル結合ができる（反応全体の模式図）。',
    '両端に反応できる部分が残るため、同じ結合が繰り返しできて鎖が伸びる。エステル結合1か所につき水1分子ができる。',
    'PETの繰り返し単位を角括弧で囲み、右下にnを書く。両端のHやOHなどは、この繰り返し単位の式では省略している。'
  ]:[
    'エチレン（エテン）CH₂=CH₂を原料にする。C=Cの二重結合に注目しよう。',
    '二重結合の一部が開き、隣の単量体と新しいC–C結合をつくる。',
    '次々につながって長い鎖になる。この付加重合では、水などの小さな分子は抜けない。',
    '繰り返し単位–CH₂–CH₂–を角括弧で囲み、右下にnを書く。nはつながった繰り返し単位の数を表す。'
  ];
  const hex=(cx,cy)=>{
    const pts=Array.from({length:6},(_,i)=>[cx+33*Math.cos(i*Math.PI/3),cy+33*Math.sin(i*Math.PI/3)]);
    return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${M.green}" stroke-width="3"/>`+M.circle(cx,cy,18,'none',M.green);
  };
  function draw(){
    let body='';
    if(!condensation){
      if(step===0){for(const x of [180,500,820])body+=M.text(x,135,'CH₂=CH₂',42)+M.text(x,205,'エチレン',27,M.green);}
      else if(step===1){body+=M.text(500,75,'C=C の1本分が、隣との結合へ',30,M.green)+M.text(240,170,'–CH₂–CH₂',40)+M.line(350,155,485,155,M.red,6)+M.text(620,170,'CH₂–CH₂–',40)+M.text(422,228,'新しい結合',26,M.red);}
      else if(step===2){body+=M.text(500,100,'–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–',39)+M.text(500,193,'… 同じつながりが、さらに続く …',30,M.green);}
      else{body+=M.text(230,155,'n CH₂=CH₂',43)+M.arrow(435,140,545,140)+M.text(755,155,'[–CH₂–CH₂–]ₙ',46,M.green)+M.text(755,230,'ポリエチレン',31);}
    }else{
      if(step===0){
        body+=M.text(250,100,'HO–CH₂–CH₂–OH',37)+M.text(250,174,'エチレングリコール',27,M.green);
        body+=M.text(608,100,'HOOC–',34)+hex(750,88)+M.text(890,100,'–COOH',34)+M.text(750,174,'テレフタル酸',27,M.green)+M.text(750,232,'六角形：ベンゼン環',23,M.gray);
      }else if(step===1){
        body+=M.text(225,100,'R–C(=O)–OH',37)+M.text(465,100,'＋',30)+M.text(690,100,'H–O–R′',37);
        body+=M.line(305,115,361,115,M.red,5)+M.line(617,115,645,115,M.red,5)+M.arrow(500,133,500,177);
        body+=M.text(390,236,'R–C(=O)–O–R′',41,M.green)+M.text(775,236,'＋ H₂O',36,M.blue)+M.text(500,291,'赤い下線のOHとHが、水になる',24,M.red);
      }else if(step===2){
        body+=M.text(500,94,'…–O–CH₂–CH₂–O–CO–C₆H₄–CO–…',38,M.green)+M.text(500,169,'EG由来の部分と酸由来の部分が交互につながる',28)+M.text(500,241,'結合1か所 → H₂O 1分子',32,M.blue);
      }else{
        body+=M.text(500,113,'[–O–CH₂–CH₂–O–CO–C₆H₄–CO–]ₙ',40,M.green)+M.text(500,182,'PET：ポリエチレンテレフタラート',32)+M.text(500,248,'CO は C(=O)、C₆H₄ は両端でつながるベンゼン環',25,M.gray);
      }
    }
    M.render(body,explanations[step]);
    document.querySelector('#result').textContent=explanations[step];
    document.querySelector('#step-label').textContent=`${step+1} / ${last+1}`;
    previous.disabled=step===0;next.disabled=step===last;
    play.textContent=timer?'停止':'順に再生';
    document.querySelector('h1').textContent=condensation?'縮合重合：PETができるまで':'付加重合：ポリエチレンができるまで';
  }
  function stop(){if(timer!==null)clearTimeout(timer);timer=null;play.textContent='順に再生';}
  function tick(){if(step<last){step++;if(step<last)timer=setTimeout(tick,1800);else stop();draw();}else stop();}
  previous.addEventListener('click',()=>{stop();step=Math.max(0,step-1);draw();});
  next.addEventListener('click',()=>{stop();step=Math.min(last,step+1);draw();});
  play.addEventListener('click',()=>{if(timer){stop();return;}if(step===last)step=0;timer=setTimeout(tick,1800);draw();});
  document.querySelector('#reset').addEventListener('click',()=>{stop();step=0;draw();});
  M.onStop(stop);
  draw();
})();
