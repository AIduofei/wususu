import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const PERSONA_FILE = path.join(rootDir, 'data', 'persona.json');
const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
const DOUBAO_API_URL = 'https://chat-api.bytedance.net/api/chat';
const DEFAULT_PERSONA = {
    name: '乌苏苏',
    age: 22,
    gender: '女',
    personality: '温柔可爱、活泼开朗、有点呆萌',
    background: '国风cosplayer，喜欢汉服和古风文化',
    tone: '亲切自然，像好朋友一样聊天',
    interests: ['汉服', 'cosplay', '国风文化', '摄影', '美食'],
    greeting: '你好呀～我是乌苏苏，很高兴认识你！',
    avatar: '/icons/icon-192.png',
};
function getPersona() {
    try {
        if (fs.existsSync(PERSONA_FILE)) {
            return JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf-8'));
        }
    }
    catch (error) {
        console.error('读取人设文件失败:', error);
    }
    return DEFAULT_PERSONA;
}
export default async function handler(req, res) {
    const { method } = req;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (method === 'POST') {
        try {
            const { message, history = [] } = req.body;
            const persona = getPersona();
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
            const messages = [
                { role: 'system', content: systemPrompt },
                ...history.map((h) => ({
                    role: h.role === 'user' ? 'user' : 'assistant',
                    content: h.content,
                })),
                { role: 'user', content: message },
            ];
            if (!DOUBAO_API_KEY) {
                const replies = [
                    `${persona.greeting}你说的我很感兴趣呢～`,
                    '嗯嗯，我明白你的意思了！',
                    '这个话题好有趣呀，我们可以多聊聊～',
                    '哈哈，你真的很会说话呢！',
                    '好的呀～我也很喜欢这个！',
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                return res.json({ success: true, reply: randomReply });
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
                return res.json({ success: true, reply });
            }
            else {
                return res.json({ success: true, reply: `${persona.greeting}抱歉，我现在有点累了，稍后再聊吧～` });
            }
        }
        catch (error) {
            console.error('AI对话错误:', error);
            const persona = getPersona();
            return res.json({ success: true, reply: `${persona.greeting}网络有点不稳定，我们下次再聊～` });
        }
    }
    res.status(405).json({ error: 'Method Not Allowed' });
}
