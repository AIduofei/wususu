import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

type MulterFile = Express.Multer.File;

// AI配置
const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
const DOUBAO_API_URL = 'https://chat-api.bytedance.net/api/chat';

// 人设数据文件
const PERSONA_FILE = path.join(rootDir, 'data', 'persona.json');
const CHAT_LOG_FILE = path.join(rootDir, 'data', 'chat_logs.json');

// 确保数据目录存在
const DATA_DIR = path.join(rootDir, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 默认人设
const DEFAULT_PERSONA = {
  name: '乌苏苏',
  age: 22,
  gender: '女',
  personality: '温柔可爱、活泼开朗、有点呆萌',
  background: '国风cosplayer，喜欢汉服和古风文化',
  tone: '亲切自然，像好朋友一样聊天',
  interests: ['汉服', 'cosplay', '国风文化', '摄影', '美食'],
  greeting: '你好呀～我是乌苏苏，很高兴认识你！',
  avatar: '/images/Camera_1040g0k031riivdjei6005p9u30h38t17ojhqo20.jpg',
};

// 确保人设文件存在
if (!fs.existsSync(PERSONA_FILE)) {
  fs.writeFileSync(PERSONA_FILE, JSON.stringify(DEFAULT_PERSONA, null, 2));
}

// 确保聊天记录文件存在
if (!fs.existsSync(CHAT_LOG_FILE)) {
  fs.writeFileSync(CHAT_LOG_FILE, JSON.stringify([]));
}

// 存储目录
const UPLOAD_DIR = path.join(rootDir, 'public', 'uploads');
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
const VIDEOS_DIR = path.join(UPLOAD_DIR, 'videos');
const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');

[UPLOAD_DIR, IMAGES_DIR, VIDEOS_DIR, THUMBNAILS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/images', express.static(path.join(rootDir, 'public', 'images')));
app.use('/icons', express.static(path.join(rootDir, 'public', 'icons')));
app.use('/', express.static(path.join(rootDir, 'dist')));

// multer配置 - 图片上传
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// multer配置 - 视频上传
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEOS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`);
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传视频文件'));
    }
  }
});

// ============ API路由 ============

// 图片上传
app.post('/api/upload/images', imageUpload.array('files', 20), (req, res) => {
  try {
    const files = req.files as MulterFile[];
    const items = files.map(file => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      url: `/uploads/images/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      type: 'image'
    }));
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 视频上传
app.post('/api/upload/videos', videoUpload.array('files', 5), (req, res) => {
  try {
    const files = req.files as MulterFile[];
    const items = files.map(file => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      url: `/uploads/videos/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      type: 'video'
    }));
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 视频分片上传 - 初始化
app.post('/api/upload/chunk/init', (req, res) => {
  try {
    const { filename, totalChunks, fileSize } = req.body;
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const tempDir = path.join(VIDEOS_DIR, 'temp', uploadId);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    res.json({
      success: true,
      uploadId,
      tempDir
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 视频分片上传 - 上传分片
app.post('/api/upload/chunk/:uploadId/:chunkIndex', (req, res) => {
  try {
    const { uploadId, chunkIndex } = req.params;
    const tempDir = path.join(VIDEOS_DIR, 'temp', uploadId);
    
    if (!fs.existsSync(tempDir)) {
      return res.status(404).json({ success: false, error: '上传会话不存在' });
    }
    
    const chunkStorage = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, tempDir),
        filename: (req, file, cb) => cb(null, `chunk-${chunkIndex}`)
      })
    }).single('chunk');
    
    chunkStorage(req, res, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, chunkIndex: parseInt(chunkIndex) });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 视频分片上传 - 合并
app.post('/api/upload/chunk/merge', async (req, res) => {
  try {
    const { uploadId, filename, totalChunks } = req.body;
    const tempDir = path.join(VIDEOS_DIR, 'temp', uploadId);
    
    if (!fs.existsSync(tempDir)) {
      return res.status(404).json({ success: false, error: '上传会话不存在' });
    }
    
    const ext = path.extname(filename) || '.mp4';
    const finalName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const finalPath = path.join(VIDEOS_DIR, finalName);
    
    const writeStream = fs.createWriteStream(finalPath);
    
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(tempDir, `chunk-${i}`);
      if (fs.existsSync(chunkPath)) {
        const chunkBuffer = fs.readFileSync(chunkPath);
        writeStream.write(chunkBuffer);
        fs.unlinkSync(chunkPath);
      }
    }
    
    writeStream.end();
    writeStream.on('finish', () => {
      fs.rmSync(tempDir, { recursive: true, force: true });
      res.json({
        success: true,
        item: {
          id: path.basename(finalName, ext),
          url: `/uploads/videos/${finalName}`,
          originalName: filename,
          type: 'video'
        }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 获取已上传的文件列表
app.get('/api/media', (req, res) => {
  try {
    const { type } = req.query;
    const dir = type === 'video' ? VIDEOS_DIR : IMAGES_DIR;
    
    if (!fs.existsSync(dir)) {
      return res.json({ success: true, items: [] });
    }
    
    const items = fs.readdirSync(dir).map(filename => {
      const filePath = path.join(dir, filename);
      const stat = fs.statSync(filePath);
      const subdir = type === 'video' ? 'videos' : 'images';
      return {
        id: path.basename(filename, path.extname(filename)),
        url: `/uploads/${subdir}/${filename}`,
        name: filename,
        size: stat.size,
        type: type === 'video' ? 'video' : 'image',
        createdAt: stat.mtime.toISOString()
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 删除文件
app.delete('/api/media/:type/:id', (req, res) => {
  try {
    const { type, id } = req.params;
    const dir = type === 'video' ? VIDEOS_DIR : IMAGES_DIR;
    
    const files = fs.readdirSync(dir);
    const targetFile = files.find(f => f.startsWith(id));
    
    if (targetFile) {
      fs.unlinkSync(path.join(dir, targetFile));
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: '文件不存在' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 视频流媒体 - 支持Range请求
app.get('/api/stream/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const videoPath = path.join(VIDEOS_DIR, filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: '视频不存在' });
    }
    
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const stream = fs.createReadStream(videoPath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============ AI智能体API ============

// 获取人设
app.get('/api/persona', (req, res) => {
  try {
    const persona = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
    res.json({ success: true, persona });
  } catch (error) {
    res.json({ success: true, persona: DEFAULT_PERSONA });
  }
});

// 保存人设
app.post('/api/persona', (req, res) => {
  try {
    const persona = req.body;
    fs.writeFileSync(PERSONA_FILE, JSON.stringify(persona, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// AI对话
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    const persona = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
    
    // 构建系统提示词
    const systemPrompt = `你现在扮演${persona.name}。
    基本信息：
    - 姓名：${persona.name}
    - 年龄：${persona.age}
    - 性别：${persona.gender}
    
    性格特点：${persona.personality}
    
    背景故事：${persona.background}
    
    兴趣爱好：${persona.interests.join('、')}
    
    说话风格：${persona.tone}
    
    要求：
    1. 严格按照人设回复，不要跳出角色
    2. 回复要自然、亲切，像真人聊天一样
    3. 可以适当使用表情符号增加亲切感
    4. 不要使用markdown格式
    5. 如果用户询问图片或视频相关内容，可以告诉用户你有很多作品可以查看
    `;
    
    // 构建消息列表
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content,
      })),
      { role: 'user', content: message },
    ];
    
    // 调用豆包API
    if (!DOUBAO_API_KEY) {
      // 模拟回复（没有API key时）
      const replies = [
        `${persona.greeting}你说的我很感兴趣呢～`,
        '嗯嗯，我明白你的意思了！',
        '这个话题好有趣呀，我们可以多聊聊～',
        '哈哈，你真的很会说话呢！',
        '好的呀～我也很喜欢这个！',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      res.json({ success: true, reply: randomReply });
      return;
    }
    
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'doubao-pro',
        messages,
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      res.json({ success: true, reply });
    } else {
      res.json({ success: true, reply: `${persona.greeting}抱歉，我现在有点累了，稍后再聊吧～` });
    }
  } catch (error) {
    console.error('AI对话错误:', error);
    const persona = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
    res.json({ success: true, reply: `${persona.greeting}网络有点不稳定，我们下次再聊～` });
  }
});

// 获取聊天记录
app.get('/api/chat/logs', (req, res) => {
  try {
    const logs = JSON.parse(fs.readFileSync(CHAT_LOG_FILE, 'utf-8'));
    res.json({ success: true, logs });
  } catch (error) {
    res.json({ success: true, logs: [] });
  }
});

// 保存聊天记录
app.post('/api/chat/logs', (req, res) => {
  try {
    const logs = req.body;
    fs.writeFileSync(CHAT_LOG_FILE, JSON.stringify(logs, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 清除聊天记录
app.delete('/api/chat/logs', (req, res) => {
  try {
    fs.writeFileSync(CHAT_LOG_FILE, JSON.stringify([]));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// ============ 微信消息接口 ============

// 微信消息验证（GET）
app.get('/api/wechat', (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;
  console.log('微信验证:', { signature, timestamp, nonce, echostr });
  res.send(echostr);
});

// 微信消息接收（POST）
app.post('/api/wechat', express.text({ type: 'application/xml' }), async (req, res) => {
  try {
    const xml = req.body;
    console.log('收到微信消息:', xml);
    
    const fromMatch = xml.match(/<FromUserName><!\[CDATA\[(.*?)\]\]><\/FromUserName>/);
    const contentMatch = xml.match(/<Content><!\[CDATA\[(.*?)\]\]><\/Content>/);
    const msgTypeMatch = xml.match(/<MsgType><!\[CDATA\[(.*?)\]\]><\/MsgType>/);
    
    const fromUser = fromMatch ? fromMatch[1] : '';
    const content = contentMatch ? contentMatch[1] : '';
    const msgType = msgTypeMatch ? msgTypeMatch[1] : '';
    
    if (msgType === 'text' && content) {
      const persona = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
      
      const systemPrompt = `你现在扮演${persona.name}。
      基本信息：
      - 姓名：${persona.name}
      - 年龄：${persona.age}
      - 性别：${persona.gender}
      
      性格特点：${persona.personality}
      
      背景故事：${persona.background}
      
      兴趣爱好：${persona.interests.join('、')}
      
      说话风格：${persona.tone}
      
      要求：
      1. 严格按照人设回复，不要跳出角色
      2. 回复要自然、亲切，像真人聊天一样
      3. 可以适当使用表情符号增加亲切感
      4. 不要使用markdown格式
      5. 回复要简短，适合微信聊天场景
      `;
      
      let reply = persona.greeting;
      
      if (DOUBAO_API_KEY) {
        const response = await fetch(DOUBAO_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DOUBAO_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'doubao-pro',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content },
            ],
            max_tokens: 500,
            temperature: 0.8,
          }),
        });
        
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          reply = data.choices[0].message.content;
        }
      } else {
        const replies = [
          `${persona.greeting}你说的我很感兴趣呢～`,
          '嗯嗯，我明白你的意思了！',
          '这个话题好有趣呀，我们可以多聊聊～',
          '哈哈，你真的很会说话呢！',
          '好的呀～我也很喜欢这个！',
        ];
        reply = replies[Math.floor(Math.random() * replies.length)];
      }
      
      const responseXml = `
        <xml>
          <ToUserName><![CDATA[${fromUser}]]></ToUserName>
          <FromUserName><![CDATA[wususu]]></FromUserName>
          <CreateTime>${Date.now()}</CreateTime>
          <MsgType><![CDATA[text]]></MsgType>
          <Content><![CDATA[${reply}]]></Content>
        </xml>
      `.trim();
      
      res.set('Content-Type', 'application/xml');
      res.send(responseXml);
      return;
    }
    
    res.send('success');
  } catch (error) {
    console.error('微信消息处理错误:', error);
    res.send('success');
  }
});

// 微信小程序登录
app.post('/api/wechat/login', async (req, res) => {
  try {
    const { code } = req.body;
    console.log('微信小程序登录:', code);
    
    res.json({
      success: true,
      user: {
        id: 'wx_' + Date.now(),
        nickname: '乌苏苏的朋友',
        avatar: '/icons/icon-192.png',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 微信小程序消息发送
app.post('/api/wechat/msg', async (req, res) => {
  try {
    const { message } = req.body;
    
    const persona = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
    
    const systemPrompt = `你现在扮演${persona.name}。
    基本信息：
    - 姓名：${persona.name}
    - 年龄：${persona.age}
    - 性别：${persona.gender}
    
    性格特点：${persona.personality}
    
    背景故事：${persona.background}
    
    兴趣爱好：${persona.interests.join('、')}
    
    说话风格：${persona.tone}
    
    要求：
    1. 严格按照人设回复，不要跳出角色
    2. 回复要自然、亲切，像真人聊天一样
    3. 可以适当使用表情符号增加亲切感
    4. 不要使用markdown格式
    5. 回复要简短，适合微信聊天场景
    `;
    
    let reply = persona.greeting;
    
    if (DOUBAO_API_KEY) {
      const response = await fetch(DOUBAO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOUBAO_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'doubao-pro',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        reply = data.choices[0].message.content;
      }
    } else {
      const replies = [
        `${persona.greeting}你说的我很感兴趣呢～`,
        '嗯嗯，我明白你的意思了！',
        '这个话题好有趣呀，我们可以多聊聊～',
        '哈哈，你真的很会说话呢！',
        '好的呀～我也很喜欢这个！',
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    }
    
    res.json({ success: true, reply });
  } catch (error) {
    console.error('微信消息发送错误:', error);
    const persona = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
    res.json({ success: true, reply: `${persona.greeting}网络有点不稳定，我们下次再聊～` });
  }
});

// SPA路由 - 所有其他路由返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📁 图片上传目录: ${IMAGES_DIR}`);
  console.log(`🎬 视频上传目录: ${VIDEOS_DIR}`);
  console.log(`🤖 AI智能体已启用 (豆包API: ${DOUBAO_API_KEY ? '已配置' : '未配置'})`);
});
