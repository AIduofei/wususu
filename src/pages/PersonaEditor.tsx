import { useState, useEffect } from 'react';
import { X, Save, Sparkles, Heart, Briefcase, MessageCircle, Image } from 'lucide-react';
import { getPersona, savePersona } from '@/services/api';

interface Persona {
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

export default function PersonaEditor({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [persona, setPersona] = useState<Persona>({
    name: '乌苏苏',
    age: 22,
    gender: '女',
    personality: '温柔可爱、活泼开朗、有点呆萌',
    background: '国风cosplayer，喜欢汉服和古风文化',
    tone: '亲切自然，像好朋友一样聊天',
    interests: ['汉服', 'cosplay', '国风文化', '摄影', '美食'],
    greeting: '你好呀～我是乌苏苏，很高兴认识你！',
    avatar: '',
  });
  const [newInterest, setNewInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPersona();
  }, []);

  const loadPersona = async () => {
    const res = await getPersona();
    if (res.success && res.persona) {
      setPersona(res.persona);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePersona(persona);
      onSave();
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !persona.interests.includes(newInterest.trim())) {
      setPersona(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setPersona(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-semibold text-lg">编辑人设</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 头像 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4" />
              头像
            </label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-100 overflow-hidden border-2 border-green-500">
                <img
                  src={persona.avatar || '/icons/icon-192.png'}
                  alt={persona.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                value={persona.avatar}
                onChange={(e) => setPersona(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="头像URL"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* 基本信息 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4" />
              基本信息
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={persona.name}
                onChange={(e) => setPersona(prev => ({ ...prev, name: e.target.value }))}
                placeholder="姓名"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                value={persona.age}
                onChange={(e) => setPersona(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="年龄"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={persona.gender}
                onChange={(e) => setPersona(prev => ({ ...prev, gender: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="女">女</option>
                <option value="男">男</option>
              </select>
            </div>
          </div>

          {/* 性格特点 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4" />
              性格特点
            </label>
            <textarea
              value={persona.personality}
              onChange={(e) => setPersona(prev => ({ ...prev, personality: e.target.value }))}
              placeholder="例如：温柔可爱、活泼开朗"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={2}
            />
          </div>

          {/* 背景故事 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4" />
              背景故事
            </label>
            <textarea
              value={persona.background}
              onChange={(e) => setPersona(prev => ({ ...prev, background: e.target.value }))}
              placeholder="介绍一下她的背景"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
            />
          </div>

          {/* 说话风格 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4" />
              说话风格
            </label>
            <textarea
              value={persona.tone}
              onChange={(e) => setPersona(prev => ({ ...prev, tone: e.target.value }))}
              placeholder="例如：亲切自然，像好朋友一样聊天"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={2}
            />
          </div>

          {/* 兴趣爱好 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4" />
              兴趣爱好
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                placeholder="输入兴趣，按回车添加"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addInterest}
                className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {persona.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 欢迎语 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Sparkles className="w-4 h-4" />
              欢迎语
            </label>
            <textarea
              value={persona.greeting}
              onChange={(e) => setPersona(prev => ({ ...prev, greeting: e.target.value }))}
              placeholder="初次见面时说的话"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={2}
            />
          </div>

          {/* 预览 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">预览效果</h3>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 overflow-hidden">
                <img
                  src={persona.avatar || '/icons/icon-192.png'}
                  alt={persona.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-xl px-4 py-2 rounded-bl-md shadow-sm">
                <p className="text-sm text-gray-800">{persona.greeting}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
