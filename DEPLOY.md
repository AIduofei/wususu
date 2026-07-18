# 乌苏苏个人网站 - 部署指南

## 一、项目结构说明

```
wususu/
├── api/                 # 后端API服务器
│   └── server.ts        # Express服务器(文件上传/视频流/AI对话/微信接口)
├── public/
│   ├── images/          # 乌苏苏照片(719张)
│   ├── icons/           # PWA应用图标
│   └── uploads/         # 用户上传的文件
│       ├── images/
│       └── videos/
├── src/
│   ├── pages/
│   │   ├── Home.tsx         # 首页
│   │   ├── Gallery.tsx      # 图片画廊(小红书风瀑布流)
│   │   ├── Videos.tsx       # 视频播放页
│   │   ├── UploadPage.tsx   # 独立上传页(手机友好)
│   │   ├── Admin.tsx        # 管理后台
│   │   ├── About.tsx        # 关于页
│   │   ├── Dynamic.tsx      # 动态页
│   │   ├── Chat.tsx         # AI聊天页面
│   │   └── PersonaEditor.tsx # 人设编辑器
│   ├── components/
│   │   ├── Header.tsx       # 顶部导航
│   │   ├── BottomNav.tsx    # 底部导航(移动端)
│   │   └── ...
│   ├── services/api.ts      # API客户端(包含AI聊天接口)
│   └── stores/media.ts      # 状态管理
├── data/
│   ├── persona.json     # AI人设数据
│   └── chat_logs.json   # 聊天记录
└── vite.config.ts           # Vite + PWA配置
```

## 二、本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器(前端+后端)
```bash
# 方式1: 同时启动前端和后端
npm run dev:all

# 方式2: 分别启动
npm run dev          # 前端 (http://localhost:5174)
npm run dev:server   # 后端 (http://localhost:3001)
```

### 3. 构建生产版本
```bash
npm run build
```

## 三、云服务器部署方案

### 方案A: 使用Render(免费)

#### 步骤1: 创建Render账户
1. 访问 https://render.com/
2. 注册账户并登录

#### 步骤2: 创建Web服务
1. 新建 Web Service
2. 连接 GitHub 仓库
3. 配置:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Environment Variables:
     - `DOUBAO_API_KEY`: 豆包API密钥(可选)

#### 步骤3: 配置域名
- Render会自动分配域名如 `https://wususu.onrender.com`
- 也可绑定自定义域名

#### 步骤4: 部署完成
- 访问分配的域名即可
- 手机浏览器打开后添加到主屏幕

### 方案B: 使用阿里云/腾讯云(付费)

#### 步骤1: 创建云服务器
- 选择 Ubuntu 系统
- 配置至少 2核4G，50GB存储

#### 步骤2: 登录服务器
```bash
ssh root@你的服务器IP
```

#### 步骤3: 安装依赖
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 git
sudo apt-get install -y git

# 安装 pm2 (进程管理)
npm install -g pm2
```

#### 步骤4: 部署项目
```bash
# 克隆项目
git clone https://github.com/你的账户/wususu.git
cd wususu

# 安装依赖
npm install

# 构建
npm run build

# 设置环境变量(可选)
export DOUBAO_API_KEY=你的豆包API密钥

# 启动服务
pm2 start npm --name wususu -- run start

# 设置开机自启
pm2 startup
pm2 save
```

#### 步骤5: 配置安全组
- 放行端口 3001
- 放行端口 80/443(如需域名)

### 方案C: 使用Vercel(免费，仅前端)

#### 步骤1: 创建Vercel账户
1. 访问 https://vercel.com/
2. 注册账户并登录

#### 步骤2: 部署前端
1. 导入项目
2. 配置构建命令: `npm run build`
3. 部署完成

#### 步骤3: 后端部署
- 使用 Render 或其他平台部署后端 API
- 在 Vercel 环境变量中设置 `VITE_API_BASE` 指向后端地址

## 四、AI智能体配置

### 配置豆包API

#### 1. 获取豆包API密钥
1. 访问 https://www.doubao.com/
2. 注册并登录
3. 进入控制台，创建API密钥
4. 复制 API Key

#### 2. 设置环境变量

**开发环境:**
创建 `.env` 文件:
```env
DOUBAO_API_KEY=你的豆包API密钥
```

**生产环境(Render/云服务器):**
在环境变量中设置:
```
DOUBAO_API_KEY=你的豆包API密钥
```

#### 3. 不配置API的情况
- 智能体会使用预设的随机回复
- 可正常聊天，但没有AI智能回复能力

### 人设编辑

#### 方式1: 可视化编辑器
1. 访问 `/chat` 页面
2. 点击右上角设置图标
3. 编辑人设信息:
   - 姓名、年龄、性别
   - 性格特点、背景故事
   - 说话风格、兴趣爱好
   - 欢迎语、头像
4. 点击保存

#### 方式2: 直接编辑文件
编辑 `data/persona.json`:
```json
{
  "name": "乌苏苏",
  "age": 22,
  "gender": "女",
  "personality": "温柔可爱、活泼开朗",
  "background": "国风cosplayer",
  "tone": "亲切自然",
  "interests": ["汉服", "cosplay"],
  "greeting": "你好呀～",
  "avatar": "/images/xxx.jpg"
}
```

## 五、微信集成

### 方案A: 微信公众号

#### 1. 注册微信公众号
1. 访问 https://mp.weixin.qq.com/
2. 注册个人订阅号

#### 2. 配置服务器地址
1. 进入公众号后台 → 开发 → 基本配置
2. 设置服务器配置:
   - URL: `https://你的域名/api/wechat`
   - Token: 自定义字符串(如 wususu123)
3. 点击验证

#### 3. 配置后端
在服务器代码 `api/server.ts` 中添加 Token 验证逻辑。

#### 4. 测试
- 在微信中关注公众号
- 发送消息，公众号会自动回复

### 方案B: 微信小程序

#### 1. 注册微信小程序
1. 访问 https://mp.weixin.qq.com/
2. 注册小程序账号

#### 2. 创建小程序代码
使用微信开发者工具创建小程序:

```javascript
// app.js
App({
  async onLaunch() {
    const res = await wx.request({
      url: 'https://你的域名/api/wechat/login',
      method: 'POST',
      data: { code: '' }
    });
    console.log(res.data);
  }
});

// pages/chat/chat.js
Page({
  data: { messages: [] },
  
  async sendMessage(e) {
    const content = e.detail.value;
    const res = await wx.request({
      url: 'https://你的域名/api/wechat/msg',
      method: 'POST',
      data: { message: content }
    });
    
    this.setData({
      messages: [...this.data.messages, {
        role: 'user',
        content
      }, {
        role: 'assistant',
        content: res.data.reply
      }]
    });
  }
});
```

#### 3. 配置域名白名单
在小程序后台 → 开发 → 服务器域名中添加:
- request合法域名: `https://你的域名`

### 方案C: 微信机器人(企业微信/第三方工具)

#### 使用wxbot框架
```bash
npm install wechaty
```

创建机器人脚本 `api/wechat-bot.ts`:
```typescript
import { WechatyBuilder } from 'wechaty';
import { chatWithAI } from './services/ai';

const bot = WechatyBuilder.build({ puppet: 'wechaty-puppet-wechat4u' });

bot.on('message', async (msg) => {
  if (msg.type() === bot.Message.Type.Text) {
    const reply = await chatWithAI(msg.text());
    await msg.say(reply);
  }
});

bot.start();
```

## 六、PWA安装(添加到手机主屏幕)

### iPhone (iOS Safari)
1. 用Safari打开网站
2. 点击底部"分享"按钮(方框向上箭头)
3. 选择"添加到主屏幕"
4. 点击"添加"
5. 主屏幕会出现乌苏苏小猫图标

### Android (Chrome/Edge)
1. 用Chrome打开网站
2. 点击右上角"三个点"菜单
3. 选择"添加到主屏幕"或"安装应用"
4. 确认安装
5. 主屏幕会出现乌苏苏小猫图标

### 安装后效果
- 全屏运行，无浏览器地址栏
- 独立窗口，像原生App
- 启动画面显示小猫图标
- 支持离线访问(已缓存的图片)

## 七、功能使用

### AI聊天
1. 访问 `/chat` 页面或点击底部导航"聊天"
2. 输入消息发送
3. 乌苏苏会根据人设自动回复
4. 支持聊天记录保存和清除

### 图片上传
1. 访问 `/upload` 页面或底部导航"上传"
2. 选择"图片"标签
3. 点击大按钮，从手机相册选择图片
4. 支持批量选择多张图片
5. 查看上传进度，完成后自动显示在画廊

### 视频上传(支持大文件)
1. 选择"视频"标签
2. 点击大按钮，从相册选择视频
3. 大于100MB的视频自动分片上传
4. 上传过程中可查看进度
5. 上传完成后在视频页面播放

### 管理后台
- 访问 `/admin` 查看管理界面
- 可查看已上传文件列表
- 可删除不需要的文件
- 支持拖拽上传

## 八、视频存储说明

- 视频文件存储在 `public/uploads/videos/` 目录
- 支持流媒体播放(Range请求)，可拖动进度条
- 大文件分片上传(5MB/片)，支持断点续传
- 单个视频最大支持5GB

## 九、多设备访问

### 云部署后
- 服务器24小时运行
- 任何设备(手机、平板、电脑)通过浏览器访问同一地址
- 数据自动同步
- 电脑关闭后仍可访问

## 十、常见问题

### Q: AI聊天没有智能回复？
- 检查是否配置了 `DOUBAO_API_KEY`
- 检查网络连接
- 豆包API有免费额度限制

### Q: 微信公众号无法接收消息？
- 检查服务器地址是否正确
- 检查Token是否匹配
- 确保服务器能正常响应

### Q: 视频上传失败？
- 检查视频大小是否超过5GB限制
- 网络不稳定时可能需要重试
- 大视频建议在WiFi环境下上传

### Q: PWA安装后打不开？
- 确保服务器正在运行
- PWA缓存可能导致，清除网站数据后重试

### Q: 图片无法显示？
- 检查图片路径是否正确
- 检查服务器是否正常运行
- 检查图片文件是否存在

## 十一、环境变量列表

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务器端口 | 3001 |
| `DOUBAO_API_KEY` | 豆包API密钥 | 空 |
| `VITE_API_BASE` | 前端API基础地址 | /api |