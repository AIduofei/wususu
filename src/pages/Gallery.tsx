import { useState, useEffect } from 'react';
import { Heart, Eye, Calendar, ImageOff, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { imageData, categories, ImageItem } from '@/data/images';
import { useMediaStore } from '@/stores/media';

// 随机高度模拟瀑布流
const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-88'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { images: uploadedImages, fetchMedia } = useMediaStore();

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // 合并静态图片和已上传图片
  const allImages: (ImageItem & { uploaded?: boolean })[] = [
    ...uploadedImages.map(img => ({
      id: img.id,
      title: img.name || '上传图片',
      description: '用户上传',
      url: img.url,
      category: 'daily',
      tags: ['上传'],
      createdAt: img.createdAt,
      uploaded: true,
    })),
    ...imageData,
  ];

  const filteredImages = activeCategory === 'all'
    ? allImages
    : allImages.filter((img) => img.category === activeCategory);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* 顶部Banner */}
      <section className="relative py-12 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">图片画廊</h1>
              <p className="text-white/90 mt-2 text-sm md:text-base">共 {filteredImages.length} 张精美照片</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">乌苏苏的作品集</span>
            </div>
          </div>
        </div>
      </section>

      {/* 分类标签 */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 瀑布流布局 - 小红书风格 */}
      <section className="py-6">
        <div className="container mx-auto px-3">
          {filteredImages.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
              {filteredImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="break-inside-avoid mb-3 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ aspectRatio: '3/4' }}
                      loading="lazy"
                    />
                    {/* 悬浮遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* 顶部标签 */}
                    {image.uploaded && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full opacity-90">
                        新上传
                      </div>
                    )}
                    
                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-medium text-sm line-clamp-2">{image.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-white/80 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {Math.floor(Math.random() * 9999)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {Math.floor(Math.random() * 9999)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 卡片底部内容 */}
                  <div className="p-2.5">
                    <p className="text-gray-800 text-sm font-medium line-clamp-1">{image.title}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex gap-1">
                        {image.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{image.createdAt.slice(5)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <ImageOff className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无图片</h3>
              <p className="text-gray-500">该分类下还没有图片内容</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredImages[currentImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="max-w-5xl max-h-[90vh] w-full px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredImages[currentImageIndex].url}
              alt={filteredImages[currentImageIndex].title}
              className="w-full h-full object-contain max-h-[80vh]"
            />
            <div className="text-center mt-4 text-white">
              <h3 className="font-medium text-lg">{filteredImages[currentImageIndex].title}</h3>
              <p className="text-white/70 text-sm mt-1">{filteredImages[currentImageIndex].description}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {filteredImages[currentImageIndex].createdAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
