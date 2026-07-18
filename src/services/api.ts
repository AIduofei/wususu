const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: number;
  type: 'image' | 'video';
  createdAt: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface UploadResult {
  success: boolean;
  items?: MediaItem[];
  error?: string;
}

// 上传图片
export async function uploadImages(files: File[]): Promise<UploadResult> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const res = await fetch(`${API_BASE}/upload/images`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// 上传视频
export async function uploadVideos(files: File[]): Promise<UploadResult> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const res = await fetch(`${API_BASE}/upload/videos`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// 分片上传大文件
export async function uploadLargeFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const filename = file.name;
  
  // 初始化
  const initRes = await fetch(`${API_BASE}/upload/chunk/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, totalChunks, fileSize: file.size }),
  });
  const { uploadId } = await initRes.json();
  
  // 上传分片
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    
    const formData = new FormData();
    formData.append('chunk', chunk);
    
    await fetch(`${API_BASE}/upload/chunk/${uploadId}/${i}`, {
      method: 'POST',
      body: formData,
    });
    
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100));
    }
  }
  
  // 合并
  const mergeRes = await fetch(`${API_BASE}/upload/chunk/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId, filename, totalChunks }),
  });
  return mergeRes.json();
}

// 获取媒体列表
export async function getMedia(type?: 'image' | 'video'): Promise<{ success: boolean; items: MediaItem[] }> {
  const url = type ? `${API_BASE}/media?type=${type}` : `${API_BASE}/media`;
  const res = await fetch(url);
  return res.json();
}

// 删除媒体
export async function deleteMedia(type: string, id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/media/${type}/${id}`, { method: 'DELETE' });
  return res.json();
}

// 获取视频流URL
export function getStreamUrl(filename: string): string {
  return `${API_BASE}/stream/${filename}`;
}

// ============ AI智能体API ============

export interface Persona {
  name: string;
  age: number;
  gender: string;
  personality: string;
  background: string;
  tone: string;
  interests: string[];
  greeting: string;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// 获取人设
export async function getPersona(): Promise<{ success: boolean; persona: Persona }> {
  const res = await fetch(`${API_BASE}/persona`);
  return res.json();
}

// 保存人设
export async function savePersona(persona: Persona): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/persona`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(persona),
  });
  return res.json();
}

// AI对话
export async function chatWithAI(
  message: string,
  history: ChatMessage[] = []
): Promise<{ success: boolean; reply: string }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  return res.json();
}

// 获取聊天记录
export async function getChatLogs(): Promise<{ success: boolean; logs: any[] }> {
  const res = await fetch(`${API_BASE}/chat/logs`);
  return res.json();
}

// 保存聊天记录
export async function saveChatLogs(logs: any[]): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/chat/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logs),
  });
  return res.json();
}

// 清除聊天记录
export async function clearChatLogs(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/chat/logs`, { method: 'DELETE' });
  return res.json();
}
