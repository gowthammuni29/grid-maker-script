const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size;

  // Background
  const grad = ctx.createLinearGradient(0, 0, s, s);
  grad.addColorStop(0, '#0f1420');
  grad.addColorStop(1, '#080b12');
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, s, s, s * 0.18);
  ctx.fill();

  // Gold border
  ctx.strokeStyle = 'rgba(201,168,76,0.5)';
  ctx.lineWidth = s * 0.025;
  roundRect(ctx, s*0.04, s*0.04, s*0.92, s*0.92, s * 0.15);
  ctx.stroke();

  // Grid lines
  const pad = s * 0.15;
  const gw = s - pad * 2;
  const gh = s - pad * 2;
  const cols = 4, rows = 4;
  ctx.strokeStyle = 'rgba(201,168,76,0.7)';
  ctx.lineWidth = s * 0.025;

  for (let c = 0; c <= cols; c++) {
    const x = pad + (gw / cols) * c;
    ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + gh); ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    const y = pad + (gh / rows) * r;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + gw, y); ctx.stroke();
  }

  // Center glow
  const radGrad = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s*0.35);
  radGrad.addColorStop(0, 'rgba(201,168,76,0.15)');
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.fillRect(pad, pad, gw, gh);

  return canvas.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), drawIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), drawIcon(512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), drawIcon(180));
console.log('Icons generated!');
