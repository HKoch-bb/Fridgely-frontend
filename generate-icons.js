/**
 * Run this once to generate all PWA icon sizes:
 *   node generate-icons.js
 * Requires: npm install canvas
 */
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, "public", "icons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function drawFridgelyIcon(canvas) {
  const ctx = canvas.getContext("2d");
  const s = canvas.width;
  const r = s * 0.22; // corner radius

  /* Background gradient */
  const grad = ctx.createLinearGradient(0, 0, s, s);
  grad.addColorStop(0, "#4a7a3a");
  grad.addColorStop(0.5, "#5a7c4a");
  grad.addColorStop(1, "#3d6b2a");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(s - r, 0);
  ctx.quadraticCurveTo(s, 0, s, r);
  ctx.lineTo(s, s - r);
  ctx.quadraticCurveTo(s, s, s - r, s);
  ctx.lineTo(r, s);
  ctx.quadraticCurveTo(0, s, 0, s - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  /* Fridge body */
  const fx = s * 0.22, fy = s * 0.1, fw = s * 0.56, fh = s * 0.8;
  const fr = s * 0.08;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = s * 0.035;
  ctx.beginPath();
  ctx.moveTo(fx + fr, fy);
  ctx.lineTo(fx + fw - fr, fy);
  ctx.quadraticCurveTo(fx + fw, fy, fx + fw, fy + fr);
  ctx.lineTo(fx + fw, fy + fh - fr);
  ctx.quadraticCurveTo(fx + fw, fy + fh, fx + fw - fr, fy + fh);
  ctx.lineTo(fx + fr, fy + fh);
  ctx.quadraticCurveTo(fx, fy + fh, fx, fy + fh - fr);
  ctx.lineTo(fx, fy + fr);
  ctx.quadraticCurveTo(fx, fy, fx + fr, fy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /* Freezer divider line */
  const divY = fy + fh * 0.38;
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = s * 0.03;
  ctx.beginPath();
  ctx.moveTo(fx, divY);
  ctx.lineTo(fx + fw, divY);
  ctx.stroke();

  /* Freezer handle */
  const hx1 = fx + fw * 0.14, hx2 = fx + fw * 0.64;
  const hy1 = fy + fh * 0.16;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = s * 0.05;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(hx1, hy1);
  ctx.lineTo(hx2, hy1);
  ctx.stroke();

  /* Fridge handle */
  const hy2 = fy + fh * 0.56;
  ctx.beginPath();
  ctx.moveTo(hx1, hy2);
  ctx.lineTo(hx2, hy2);
  ctx.stroke();

  /* Green freshness dot */
  const dotX = fx + fw * 0.82, dotY = fy + fh * 0.75, dotR = s * 0.055;
  ctx.fillStyle = "#86efac";
  ctx.shadowColor = "#22c55e";
  ctx.shadowBlur = s * 0.06;
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

sizes.forEach((size) => {
  const canvas = createCanvas(size, size);
  drawFridgelyIcon(canvas);
  const buf = canvas.toBuffer("image/png");
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, buf);
  console.log(`✅ Created ${file}`);
});

console.log("\n🎉 All icons generated in public/icons/");
