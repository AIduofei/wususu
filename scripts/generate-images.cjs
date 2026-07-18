const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'images.ts');

// 获取所有图片文件
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg'));

// 分类规则 - 基于文件名前缀
function categorizeFile(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('xhs') || lower.includes('camera_xhs')) {
    // 小红书图片，根据文件名hash分配
    const hash = filename.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const categories = ['cosplay', 'daily', 'event'];
    return categories[hash % 3];
  }
  if (lower.includes('screenshot')) return 'daily';
  // img- 开头的图片
  if (lower.startsWith('img-')) {
    const hash = filename.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const categories = ['cosplay', 'daily', 'event'];
    return categories[hash % 3];
  }
  return 'daily';
}

// 生成标题
function generateTitle(filename, index) {
  const titles = [
    '国风写真', '古风造型', '汉服日常', 'cosplay作品', '漫展现场',
    '生活随拍', '活动现场', '精美写真', '古风美人', '日常分享',
    '活动合照', 'cosplay造型', '汉服展示', '国风美学', '古风摄影'
  ];
  return titles[index % titles.length];
}

// 生成描述
function generateDescription(filename, index) {
  const descriptions = [
    '精美的国风造型，展现东方美学',
    '温婉端庄的古典美人形象',
    '日常汉服穿搭，优雅自然',
    '精致的cosplay作品，还原度极高',
    '漫展现场与粉丝互动',
    '生活中的小确幸，温柔可爱',
    '活动现场精彩瞬间',
    '唯美写真，展现独特气质',
    '古风造型，仙气飘飘',
    '日常分享，呆萌可爱',
    '与粉丝的温馨合照',
    '精心打造的cosplay造型',
    '汉服展示，传承中华文化',
    '国风美学，古典韵味',
    '专业摄影，完美呈现'
  ];
  return descriptions[index % descriptions.length];
}

// 生成标签
function generateTags(category, index) {
  const tagMap = {
    cosplay: [['cosplay', '古风', '写真'], ['王者荣耀', 'cos', '二次元'], ['国风', 'cosplay', '美人']],
    daily: [['日常', '可爱', '自拍'], ['生活', '汉服', '日常'], ['随拍', '温柔', '可爱']],
    event: [['活动', '漫展', '合照'], ['现场', 'cosplay', '活动'], ['漫展', '互动', '粉丝']]
  };
  const tags = tagMap[category];
  return tags[index % tags.length];
}

// 生成日期
function generateDate(index) {
  const startDate = new Date('2025-01-01');
  startDate.setDate(startDate.getDate() + index * 3);
  return startDate.toISOString().split('T')[0];
}

// 生成数据
const imageData = files.map((file, index) => {
  const category = categorizeFile(file);
  return {
    id: String(index + 1),
    title: generateTitle(file, index),
    description: generateDescription(file, index),
    url: `/images/${file}`,
    category,
    tags: generateTags(category, index),
    createdAt: generateDate(index)
  };
});

// 生成TypeScript代码
const tsCode = `export interface ImageItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export const categories = [
  { id: 'all', name: '全部', icon: 'Grid3X3' },
  { id: 'cosplay', name: 'Cosplay', icon: 'Sparkles' },
  { id: 'daily', name: '日常', icon: 'Camera' },
  { id: 'event', name: '活动', icon: 'Calendar' },
];

export const imageData: ImageItem[] = ${JSON.stringify(imageData, null, 2)};
`;

fs.writeFileSync(outputPath, tsCode, 'utf-8');
console.log(`✅ 成功生成 images.ts，共 ${imageData.length} 张图片`);
console.log(`   - Cosplay: ${imageData.filter(i => i.category === 'cosplay').length} 张`);
console.log(`   - 日常: ${imageData.filter(i => i.category === 'daily').length} 张`);
console.log(`   - 活动: ${imageData.filter(i => i.category === 'event').length} 张`);
