import { useState, useEffect } from 'react';
import { Menu, X, Home, User, Images, Video, MessageCircle, Settings, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'home', label: '首页', icon: Home, path: '/' },
  { id: 'about', label: '关于', icon: User, path: '/about' },
  { id: 'gallery', label: '相册', icon: Images, path: '/gallery' },
  { id: 'videos', label: '视频', icon: Video, path: '/videos' },
  { id: 'dynamic', label: '动态', icon: MessageCircle, path: '/dynamic' },
  { id: 'upload', label: '上传', icon: Upload, path: '/upload' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-serif font-bold text-lg">苏</span>
            </div>
            <span className={`font-serif font-bold text-xl transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
              乌苏苏
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : isScrolled
                      ? 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ml-2 ${
                isScrolled
                  ? 'border border-primary-500 text-primary-600 hover:bg-primary-50'
                  : 'border border-white/50 text-white hover:bg-white/10'
              }`}
            >
              <Settings size={18} />
              <span className="font-medium">管理</span>
            </Link>
          </nav>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary-500 text-primary-600 hover:bg-primary-50 transition-all"
          >
            <Settings size={20} />
            <span className="font-medium">管理后台</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
