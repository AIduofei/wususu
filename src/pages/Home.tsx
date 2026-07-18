import { useState, useEffect, useRef } from 'react';
import { Heart, Users, ThumbsUp, ArrowRight, Star, Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import { profileData } from '@/data/profile';
import { imageData } from '@/data/images';
import { videoData } from '@/data/videos';
import { Link } from 'react-router-dom';

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-gray-800">
      {formatNumber(count)}{suffix}
    </div>
  );
}

function FeaturedCard({ item, type }: { item: any; type: 'image' | 'video' }) {
  return (
    <div className="flex-shrink-0 w-64 md:w-80 card group">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={type === 'image' ? item.url : item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
          <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <section className="py-20 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4">
          <div className="section-title">关于乌苏苏</div>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            {profileData.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <AnimatedCounter end={profileData.stats.fans} />
              <p className="text-gray-500 mt-2">粉丝数</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <AnimatedCounter end={profileData.stats.works} />
              <p className="text-gray-500 mt-2">作品数</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <AnimatedCounter end={profileData.stats.likes} />
              <p className="text-gray-500 mt-2">获赞数</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/about" className="btn-primary inline-flex items-center gap-2">
              了解更多 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary-500" />
                <span className="text-primary-600 font-medium">精选作品</span>
              </div>
              <h2 className="section-title mb-0">最新照片</h2>
            </div>
            <Link to="/gallery" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {imageData.slice(0, 6).map((image) => (
              <FeaturedCard key={image.id} item={image} type="image" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-6 h-6 text-primary-500" />
                <span className="text-primary-600 font-medium">热门视频</span>
              </div>
              <h2 className="section-title mb-0">精彩视频</h2>
            </div>
            <Link to="/videos" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoData.slice(0, 3).map((video) => (
              <div key={video.id} className="card group cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>{video.viewCount.toLocaleString()} 播放</span>
                    <span>{video.platform === 'douyin' ? '抖音' : 'B站'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">个性标签</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {profileData.tags.map((tag) => (
              <span
                key={tag}
                className="px-6 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
