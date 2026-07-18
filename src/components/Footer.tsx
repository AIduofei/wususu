import { Heart, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-serif font-bold text-lg">苏</span>
              </div>
              <span className="font-serif font-bold text-xl">乌苏苏</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              平安健康，开心快乐，永远钟爱中式古典美学。感谢每一位支持我的小伙伴！
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-primary-200 hover:text-white transition-colors">首页</a>
              </li>
              <li>
                <a href="/about" className="text-primary-200 hover:text-white transition-colors">关于</a>
              </li>
              <li>
                <a href="/gallery" className="text-primary-200 hover:text-white transition-colors">相册</a>
              </li>
              <li>
                <a href="/videos" className="text-primary-200 hover:text-white transition-colors">视频</a>
              </li>
              <li>
                <a href="/dynamic" className="text-primary-200 hover:text-white transition-colors">动态</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">联系我</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-700 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-700 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-700 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Youtube size={20} />
              </a>
            </div>
            <p className="text-primary-200 text-sm">商务合作：wmxing01s</p>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center">
          <p className="text-primary-300 text-sm flex items-center justify-center gap-2">
            <Heart size={16} className="text-red-400" />
            Made with love for 乌苏苏
            <Heart size={16} className="text-red-400" />
          </p>
          <p className="text-primary-400 text-xs mt-2">
            © 2025 乌苏苏个人网站. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
