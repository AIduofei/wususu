import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Trash2, Settings, RefreshCw } from 'lucide-react';
import { getPersona, chatWithAI, saveChatLogs, getChatLogs, clearChatLogs } from '@/services/api';
import PersonaEditor from '@/pages/PersonaEditor';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPersonaEditor, setShowPersonaEditor] = useState(false);
  const [persona, setPersona] = useState({
    name: '乌苏苏',
    greeting: '你好呀～我是乌苏苏，很高兴认识你！',
    avatar: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    loadPersona();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const res = await getChatLogs();
    if (res.success && res.logs) {
      setMessages(res.logs);
    }
  };

  const loadPersona = async () => {
    const personaRes = await getPersona();
    if (personaRes.success && personaRes.persona) {
      setPersona(personaRes.persona);
      const logsRes = await getChatLogs();
      if (!logsRes.logs || logsRes.logs.length === 0) {
        addWelcomeMessage(personaRes.persona.greeting);
      }
    }
  };

  const addWelcomeMessage = (greeting: string) => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
    saveChatLogs([welcomeMsg]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const res = await chatWithAI(inputValue.trim(), history);
      
      if (res.success && res.reply) {
        const aiMsg: ChatMessage = {
          id: `${Date.now()}-ai`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => {
          const newMessages = [...prev, aiMsg];
          saveChatLogs(newMessages);
          return newMessages;
        });
      }
    } catch (error) {
      console.error('发送失败:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (confirm('确定要清除所有聊天记录吗？')) {
      clearChatLogs();
      setMessages([]);
      setTimeout(() => addWelcomeMessage(persona.greeting), 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="h-full flex flex-col max-w-2xl mx-auto">
        {/* 顶部栏 */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden">
              <img
                src={persona.avatar || '/icons/icon-192.png'}
                alt={persona.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">{persona.name}</h1>
              <p className="text-xs text-green-500">在线</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPersonaEditor(true)}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 聊天内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              } flex gap-2`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 overflow-hidden">
                    <img
                      src={persona.avatar || '/icons/icon-192.png'}
                      alt={persona.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-green-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 opacity-60 ${
                    message.role === 'user' ? 'text-white' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={persona.avatar || '/icons/icon-192.png'}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-end gap-2">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                className="w-full bg-gray-100 rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2.5 rounded-full transition-all ${
                inputValue.trim() && !isTyping
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {isTyping ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 人设编辑器弹窗 */}
      {showPersonaEditor && (
        <PersonaEditor
          onClose={() => setShowPersonaEditor(false)}
          onSave={() => {
            setShowPersonaEditor(false);
            loadPersona();
          }}
        />
      )}
    </div>
  );
}
