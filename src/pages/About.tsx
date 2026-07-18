import { useState, useEffect, useRef } from 'react';
import { Users, Star, Heart, Calendar, Award, Sparkles, ArrowRight } from 'lucide-react';
import { profileData } from '@/data/profile';

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
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
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-gray-800">
      {formatNumber(count)}
    </div>
  );
}

export default function About() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-primary-500" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">{profileData.name}</h1>
                <p className="text-white/80 mb-4">原名：{profileData.realName}</p>
                <p className="text-white/90 text-lg mb-6">{profileData.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {profileData.nicknames.map((nickname) => (
                    <span
                      key={nickname}
                      className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {nickname}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">个人简介</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {profileData.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-primary-600" />
                </div>
                <AnimatedCounter end={profileData.stats.fans} />
                <p className="text-gray-500 mt-2">粉丝数</p>
              </div>

              <div className="bg-primary-50 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-primary-600" />
                </div>
                <AnimatedCounter end={profileData.stats.works} />
                <p className="text-gray-500 mt-2">作品数</p>
              </div>

              <div className="bg-primary-50 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary-600" />
                </div>
                <AnimatedCounter end={profileData.stats.likes} />
                <p className="text-gray-500 mt-2">获赞数</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">性格特点</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.personality.map((trait, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{trait}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">成长历程</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 -translate-x-1/2" />

              {profileData.timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  onMouseEnter={() => setActiveTimelineIndex(index)}
                >
                  <div
                    className={`flex-1 text-center md:text-left ${
                      index % 2 === 1 ? 'md:text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block p-6 rounded-2xl transition-all duration-300 ${
                        activeTimelineIndex === index
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-primary-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Calendar className={`w-5 h-5 ${activeTimelineIndex === index ? 'text-white/80' : 'text-primary-500'}`} />
                        <span className={`font-medium ${activeTimelineIndex === index ? 'text-white/80' : 'text-primary-600'}`}>
                          {item.year}
                        </span>
                      </div>
                      <h3 className={`font-bold text-xl mb-2 ${activeTimelineIndex === index ? 'text-white' : 'text-gray-800'}`}>
                        {item.event}
                      </h3>
                      <p className={`text-sm leading-relaxed ${activeTimelineIndex === index ? 'text-white/90' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full bg-white border-4 border-primary-400 flex items-center justify-center -translate-x-1/2 z-10">
                    <Award className="w-5 h-5 text-primary-500" />
                  </div>

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">社交平台</h2>
          <div className="flex justify-center gap-6">
            {profileData.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-medium text-gray-700">{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
