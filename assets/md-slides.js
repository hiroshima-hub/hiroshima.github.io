'use strict';
// Supported subset only. Raw HTML is always treated as text.
function safeURL(value,image=false){
 if(/[\u0000-\u0020\\]/.test(value)||value.startsWith('//'))return null;
 if(/^[a-z][a-z0-9+.-]*:/i.test(value))return !image&&/^https:\/\//i.test(value)?value:null;
 if(value.startsWith('/')||value.startsWith('#'))return image?null:value;
 return value;
}
function inline(parent,text){
 const re=/(!?\[([^\]]*)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;let last=0,m;
 while((m=re.exec(text))){parent.append(document.createTextNode(text.slice(last,m.index)));let e;
  if(m[4]){e=document.createElement('strong');e.textContent=m[4];}
  else if(m[5]){e=document.createElement('code');e.textContent=m[5];}
  else{const img=m[1].startsWith('!'),url=safeURL(m[3],img);if(!url){parent.append(document.createTextNode(m[0]));last=re.lastIndex;continue;}
   e=document.createElement(img?'img':'a');if(img){e.alt=m[2];e.src=url;}else{e.textContent=m[2];e.href=url;if(/^https:/.test(url)){e.target='_blank';e.rel='noopener noreferrer';e.append(' ↗');}}}
  parent.append(e);last=re.lastIndex;
 }parent.append(document.createTextNode(text.slice(last)));
}
function renderMarkdown(source){
 const main=document.getElementById('slides');main.replaceChildren();let section,ul=null,pre=null,number=0;
 function start(){section=document.createElement('section');section.className='slide';const tag=document.createElement('small');tag.textContent=`SLIDE ${++number}`;section.append(tag);main.append(section);ul=null;}start();
 let text=source.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
 // Accept Marp front matter, but this viewer does not implement its settings.
 text=text.replace(/^---\n[\s\S]*?\n---\n/,'');
 for(const line of text.split('\n')){
  if(line.startsWith('```')){if(pre){pre=null;}else{pre=document.createElement('pre');section.append(pre);}ul=null;continue;}
  if(pre){pre.append(document.createTextNode(line+'\n'));continue;}
  if(/^\s*---\s*$/.test(line)){start();continue;}
  if(!line.trim()){ul=null;continue;}
  const heading=/^(#{1,3})\s+(.+)$/.exec(line),li=/^[-*]\s+(.+)$/.exec(line);
  let e;if(li){if(!ul){ul=document.createElement('ul');section.append(ul);}e=document.createElement('li');ul.append(e);inline(e,li[1]);}
  else{ul=null;e=document.createElement(heading?'h'+heading[1].length:'p');inline(e,heading?heading[2]:line);section.append(e);}
 }
 window.deck=Array.from(main.children);window.current=0;updateDeck();
}
function updateDeck(){const deck=window.deck||[];deck.forEach((s,i)=>s.hidden=!document.body.classList.contains('list')&&i!==window.current);document.getElementById('counter').textContent=deck.length?`${window.current+1} / ${deck.length}`:'';document.getElementById('prev').disabled=!deck.length||window.current===0;document.getElementById('next').disabled=!deck.length||window.current===deck.length-1;}
function setupNavigation(){window.deck=Array.from(document.querySelectorAll('.slide'));window.current=0;
 document.getElementById('prev').onclick=()=>{window.current=Math.max(0,window.current-1);document.body.classList.remove('list');updateDeck();};
 document.getElementById('next').onclick=()=>{window.current=Math.min(window.deck.length-1,window.current+1);document.body.classList.remove('list');updateDeck();};
 document.getElementById('list').onclick=()=>{document.body.classList.toggle('list');updateDeck();};
 document.getElementById('print').onclick=()=>window.print();
 document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();document.getElementById('next').click();}if(e.key==='ArrowLeft'){e.preventDefault();document.getElementById('prev').click();}if(e.key==='Escape'){document.body.classList.add('list');updateDeck();}});
 if(window.matchMedia('(max-width:600px)').matches)document.body.classList.add('list');updateDeck();}
async function loadSlides(){setupNavigation();const status=document.getElementById('status');
 document.getElementById('file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{renderMarkdown(await f.text());status.textContent='読込済み：'+f.name+'。保存後は同じファイルをもう一度選んでください。';}catch(err){status.textContent='読み込めませんでした。UTF-8のファイルを選んでください。';}e.target.value='';};
 document.getElementById('export').onclick=()=>{
  if(!window.deck.length){status.textContent='先にMarkdownを読み込んでください。';return;}
  const clone=document.documentElement.cloneNode(true);clone.querySelector('#local').remove();clone.querySelectorAll('script').forEach(e=>e.remove());clone.querySelector('#status').textContent='保存済みHTML：原稿の変更は再読み込み・再出力が必要です。';
  const s=document.createElement('script');s.textContent=updateDeck.toString()+'\n'+setupNavigation.toString()+'\nsetupNavigation();';clone.querySelector('body').append(s);
  const blob=new Blob(['<!doctype html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='slides-snapshot.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
 };
 if(location.protocol==='file:'){status.textContent='手元のプレビュー：下のボタンでslides.mdを選択してください。';return;}
 document.getElementById('local').hidden=true;
 try{const r=await fetch('./slides.md',{cache:'no-store'});if(!r.ok)throw Error(r.status);renderMarkdown(await r.text());status.textContent='原稿：slides.md';}catch(e){status.textContent='slides.mdを読み込めません。配置と公開反映を確認してください。';}
}
loadSlides();
