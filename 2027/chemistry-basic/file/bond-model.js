/* 外部依存のないSVG部品。教材ごとの状態・説明は各JSに置く。 */
'use strict';
window.BondModel = (() => {
  const colors = { ink: '#173e37', green: '#167967', blue: '#376eae', red: '#b64d35', gray: '#58716b' };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const text = (x,y,label,size=28,color=colors.ink,anchor='middle') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escape(label)}</text>`;
  const line = (x1,y1,x2,y2,color=colors.gray,width=4,dash=false) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?' stroke-dasharray="7 7"':''}/>`;
  const circle = (x,y,r,fill,stroke='none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  function arrow(x1,y1,x2,y2,color=colors.red) {
    const a=Math.atan2(y2-y1,x2-x1), points=[[x2,y2],[x2-14*Math.cos(a-.45),y2-14*Math.sin(a-.45)],[x2-14*Math.cos(a+.45),y2-14*Math.sin(a+.45)]];
    return line(x1,y1,x2,y2,color,3)+`<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="${color}"/>`;
  }
  const pair = (x,y,vertical=false,color=colors.green) => circle(x-(vertical?0:7),y-(vertical?7:0),4.5,color)+circle(x+(vertical?0:7),y+(vertical?7:0),4.5,color);
  const atom = (x,y,label,r=25) => circle(x,y,r,({H:'#eaf1f3',O:'#f6d4cb',C:'#d5e2de',N:'#d4e4f6',Cl:'#d5edce',Si:'#e9dfbf'})[label]||'#e3eee7',colors.gray)+text(x,y+8,label,24);
  const ion = (x,y,positive=true,r=24) => circle(x,y,r,positive?'#d5e7ff':'#def0d8',positive?colors.blue:colors.green)+text(x,y+9,positive?'+':'−',28,positive?colors.blue:colors.green);
  function render(body,description) {
    const stage=document.querySelector('#diagram');
    stage.innerHTML=`<title>${escape(description)}</title><g font-family="Yu Gothic,Meiryo,sans-serif">${body}</g>`;
    stage.setAttribute('aria-label',description);
  }
  function select(buttons,active) { buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===String(active)))); }
  // Revealが非表示のiframeへ送る停止通知にも対応。操作で開始した再生だけを止める。
  function onStop(callback) {
    document.addEventListener('visibilitychange',()=>{if(document.hidden)callback();});
    window.addEventListener('pagehide',callback);
    window.addEventListener('message',event=>{
      if(event.source!==window.parent || event.origin!==window.location.origin) return;
      if(event.data==='slide:stop')callback();
    });
  }
  return { ...colors, text, line, circle, arrow, pair, atom, ion, render, select, onStop };
})();
