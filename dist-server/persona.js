import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const PERSONA_FILE = path.join(rootDir, 'data', 'persona.json');
const CHAT_LOG_FILE = path.join(rootDir, 'data', 'chat_logs.json');
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (method === 'GET') {
        const persona = getPersona();
        return res.json({ success: true, persona });
    }
    if (method === 'POST') {
        try {
            const persona = req.body;
            const dataDir = path.dirname(PERSONA_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(PERSONA_FILE, JSON.stringify(persona, null, 2));
            return res.json({ success: true });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    res.status(405).json({ error: 'Method Not Allowed' });
}
