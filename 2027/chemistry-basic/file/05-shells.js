"use strict";
const symbols = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca".split(" ");
const names = "水素 ヘリウム リチウム ベリリウム ホウ素 炭素 窒素 酸素 フッ素 ネオン ナトリウム マグネシウム アルミニウム ケイ素 リン 硫黄 塩素 アルゴン カリウム カルシウム".split(" ");
const number = document.querySelector("#number");
const angle = document.querySelector("#angle");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const drawing = document.querySelector("#drawing");
function sphere(x, y, r, fill, stroke, opacity = 1) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  for (const [key, value] of Object.entries({ cx:x, cy:y, r, fill, stroke, opacity })) circle.setAttribute(key, value);
  drawing.append(circle);
}

function render() {
  const z = Number(number.value);
  const rotation = Number(angle.value) * Math.PI / 180;
  // H〜Ca の基底状態。M殻の最大収容数を8とする規則ではない。
  let remaining = z;
  const counts = [];
  for (const occupied of [2, 8, 8, 2]) {
    const count = Math.min(remaining, occupied);
    counts.push(count);
    remaining -= count;
    if (!remaining) break;
  }
  drawing.replaceChildren();
  const points = [];
  counts.forEach((n, layer) => {
    const r = 40 + 30 * layer;
    sphere(150, 150, r, "url(#shell)", "#83aba3");
    for (let i = 0; i < n; i++) {
      const height = (i + 0.5) * 2 / n - 1;
      const latitude = Math.sqrt(1 - height * height);
      const theta = 2.4 * i + 0.65 * layer + rotation;
      const x = Math.cos(theta) * latitude;
      const depth = Math.sin(theta) * latitude;
      const y = height * 0.93 - depth * 0.37;
      points.push({ x:150 + r*x, y:150 + r*y, depth:r*(height*0.37 + depth*0.93), outer:layer === counts.length-1 });
    }
  });
  points.push({ x:150, y:150, depth:0, nucleus:true });
  points.sort((a,b) => a.depth - b.depth);
  for (const p of points) {
    const color = p.nucleus ? "#ac5335" : p.outer ? "#086b5e" : "#325e85";
    sphere(p.x,p.y,p.nucleus ? 9 : 5.5 + p.depth/120,color,"#fff",p.depth < 0 ? 0.72 : 1);
  }
  document.querySelector("#element").textContent = z + "　" + symbols[z-1] + "　" + names[z-1];
  document.querySelector("#configuration").textContent = counts.map((n,i) => "KLMN"[i] + "殻 " + n).join(" ／ ");
  document.querySelector("#outer").textContent = "電子は計 " + z + " 個。うち最外殻は " + counts.at(-1) + " 個。";
  prev.disabled = z === 1;
  next.disabled = z === 20;
}
prev.onclick = () => { number.stepDown(); render(); };
next.onclick = () => { number.stepUp(); render(); };
number.oninput = render;
angle.oninput = render;
render();
