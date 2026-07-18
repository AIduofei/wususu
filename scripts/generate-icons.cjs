const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = [192, 512];
const outputDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function drawCatIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = size / 512;
  
  ctx.save();
  ctx.scale(scale, scale);
  
  // 背景渐变
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
  bgGrad.addColorStop(0, '#22c55e');
  bgGrad.addColorStop(1, '#16a34a');
  ctx.fillStyle = bgGrad;
  
  // 圆角矩形背景
  const radius = 112;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(512 - radius, 0);
  ctx.quadraticCurveTo(512, 0, 512, radius);
  ctx.lineTo(512, 512 - radius);
  ctx.quadraticCurveTo(512, 512, 512 - radius, 512);
  ctx.lineTo(radius, 512);
  ctx.quadraticCurveTo(0, 512, 0, 512 - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  
  // 阴影效果
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;
  
  // 小猫头部
  const headGrad = ctx.createLinearGradient(0, 150, 0, 390);
  headGrad.addColorStop(0, '#fef3c7');
  headGrad.addColorStop(1, '#fde68a');
  ctx.fillStyle = headGrad;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.ellipse(256, 270, 130, 120, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // 左耳
  ctx.beginPath();
  ctx.moveTo(160, 190);
  ctx.lineTo(130, 120);
  ctx.lineTo(210, 170);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 右耳
  ctx.beginPath();
  ctx.moveTo(352, 190);
  ctx.lineTo(382, 120);
  ctx.lineTo(302, 170);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  
  // 左耳内部
  ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.beginPath();
  ctx.moveTo(165, 180);
  ctx.lineTo(150, 140);
  ctx.lineTo(195, 165);
  ctx.closePath();
  ctx.fill();
  
  // 右耳内部
  ctx.beginPath();
  ctx.moveTo(347, 180);
  ctx.lineTo(362, 140);
  ctx.lineTo(317, 165);
  ctx.closePath();
  ctx.fill();
  
  // 眼睛
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.ellipse(210, 260, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(302, 260, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛高光
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(216, 254, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(308, 254, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(206, 266, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(298, 266, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 鼻子
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.moveTo(248, 295);
  ctx.quadraticCurveTo(256, 305, 264, 295);
  ctx.quadraticCurveTo(256, 310, 248, 295);
  ctx.fill();
  
  // 嘴巴
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(256, 305);
  ctx.quadraticCurveTo(256, 320, 240, 320);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(256, 305);
  ctx.quadraticCurveTo(256, 320, 272, 320);
  ctx.stroke();
  
  // 胡须
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, 290); ctx.lineTo(130, 285);
  ctx.moveTo(180, 300); ctx.lineTo(125, 305);
  ctx.moveTo(332, 290); ctx.lineTo(382, 285);
  ctx.moveTo(332, 300); ctx.lineTo(387, 305);
  ctx.stroke();
  
  // 腮红
  ctx.fillStyle = 'rgba(251, 113, 133, 0.4)';
  ctx.beginPath();
  ctx.ellipse(180, 300, 20, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(332, 300, 20, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 小爪子
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = headGrad;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.ellipse(220, 420, 35, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(292, 420, 35, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  return canvas;
}

// 检查canvas是否可用
try {
  require('canvas');
} catch (e) {
  console.log('canvas模块未安装，使用SVG方式生成');
  console.log('请手动运行: npm install canvas');
  process.exit(0);
}

sizes.forEach(size => {
  const canvas = drawCatIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(outputDir, `icon-${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ 生成 ${size}x${size} 图标: ${outputPath}`);
});

// 生成favicon
const favCanvas = drawCatIcon(64);
const favBuffer = favCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(outputDir, '..', 'favicon.png'), favBuffer);
console.log('✅ 生成 favicon.png');
