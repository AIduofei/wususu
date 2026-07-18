import { Home, MessageCircle, Images, Video, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'home', label: '首页', icon: Home, path: '/' },
  { id: 'gallery', label: '相册', icon: Images, path: '/gallery' },
  { id: 'upload', label: '上传', icon: Upload, path: '/upload' },
  { id: 'videos', label: '视频', icon: Video, path: '/videos' },
  { id: 'chat', label: '聊天', icon: MessageCircle, path: '/chat' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isUpload = item.id === 'upload';
          
          if (isUpload) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex flex-col items-center justify-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center -mt-6 shadow-lg transition-all ${
                  isActive ? 'bg-green-600 scale-110' : 'bg-green-500'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs mt-0.5 ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
