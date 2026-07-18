import { useState, useEffect } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{
          backgroundImage: `url('/images/Camera_1040g0k031riivdjei6005p9u30h38t17ojhqo20.jpg')`,
          transform: `scale(1.1) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            国风领域创作者
          </div>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          乌苏苏
        </h1>

        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          平安健康，开心快乐，永远钟爱中式古典美学
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/gallery" className="btn-primary flex items-center gap-2">
            <Play size={20} />
            欣赏作品
          </Link>
          <Link to="/about" className="btn-secondary">
            了解更多
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </section>
  );
}
