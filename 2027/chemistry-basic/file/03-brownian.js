"use strict";
const scene = document.querySelector("#scene");
const ctx = scene.getContext("2d");
const molecules = document.querySelector("#molecules");
const pause = document.querySelector("#pause");
const tracer = { x: 420, y: 120, vx: 0, vy: 0, radius: 15, mass: 12 };
const particles = [];
const path = [];
let frame = 0;
let lastTime = 0;
let running = !matchMedia("(prefers-reduced-motion: reduce)").matches;
let sampleTime = 0;

function reset() {
  Object.assign(tracer, { x: 420, y: 120, vx: 0, vy: 0 });
  path.length = 0;
  particles.length = 0;
  sampleTime = 0;
  while (particles.length < 110) {
    const x = 3 + Math.random() * (scene.width - 6);
    const y = 3 + Math.random() * (scene.height - 6);
    if (Math.hypot(x - tracer.x, y - tracer.y) < tracer.radius + 4) continue;
    const angle = Math.random() * 2 * Math.PI;
    const speed = 100 + Math.random() * 130;
    particles.push({ x, y, vx: speed * Math.cos(angle), vy: speed * Math.sin(angle), radius: 3 });
  }
  draw();
}

function move(p, dt) {
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  if (p.x < p.radius || p.x > scene.width - p.radius) p.vx *= -1;
  if (p.y < p.radius || p.y > scene.height - p.radius) p.vy *= -1;
  p.x = Math.max(p.radius, Math.min(scene.width - p.radius, p.x));
  p.y = Math.max(p.radius, Math.min(scene.height - p.radius, p.y));
}

// 分子は互いに独立に運動し、微粒子との衝突で運動量を交換する。
function step(dt) {
  move(tracer, dt);
  for (const p of particles) {
    move(p, dt);
    const dx = p.x - tracer.x;
    const dy = p.y - tracer.y;
    const distance = Math.hypot(dx, dy);
    const contact = p.radius + tracer.radius;
    if (distance >= contact || distance === 0) continue;
    const nx = dx / distance;
    const ny = dy / distance;
    p.x = tracer.x + contact * nx;
    p.y = tracer.y + contact * ny;
    const closing = (p.vx - tracer.vx) * nx + (p.vy - tracer.vy) * ny;
    if (closing >= 0) continue;
    const impulse = -2 * closing / (1 + 1 / tracer.mass);
    p.vx += impulse * nx;
    p.vy += impulse * ny;
    tracer.vx -= impulse * nx / tracer.mass;
    tracer.vy -= impulse * ny / tracer.mass;
  }
  sampleTime += dt;
  if (sampleTime >= 0.05) {
    path.push([tracer.x, tracer.y]);
    if (path.length > 250) path.shift();
    sampleTime = 0;
  }
}

function circle(p, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, scene.width, scene.height);
  if (molecules.checked) for (const p of particles) circle(p, "#387f99");
  ctx.strokeStyle = "#ad6541";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.lineTo(tracer.x, tracer.y);
  ctx.stroke();
  circle(tracer, "#aa5032");
}

function animate(time) {
  const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.04) : 0;
  lastTime = time;
  step(dt / 2);
  step(dt / 2);
  draw();
  frame = requestAnimationFrame(animate);
}
function refresh() {
  cancelAnimationFrame(frame);
  lastTime = 0;
  pause.textContent = running ? "一時停止" : "再生";
  if (running && !document.hidden) frame = requestAnimationFrame(animate);
}
pause.onclick = () => { running = !running; refresh(); };
document.querySelector("#reset").onclick = reset;
molecules.onchange = () => {
  document.querySelector("#explanation").textContent = molecules.checked
    ? "ブラウン運動：水分子の衝突が一時的に偏り、目に見える微粒子の進む向きが変わる。"
    : "観察：微粒子が不規則に動き、その通り道が線で残る。";
  draw();
};
document.addEventListener("visibilitychange", refresh);
reset();
refresh();
