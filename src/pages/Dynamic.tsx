import { useState } from 'react';
import { Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import { dynamicData } from '@/data/dynamics';

function DynamicCard({ post, index }: { post: typeof dynamicData[0]; index: number }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const formatLikes = (count: number) => {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-serif font-bold">苏</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">乌苏苏</h4>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <Clock size={12} />
                {post.createdAt}
              </div>
            </div>
          </div>

          <p className="text-gray-600 mt-3 leading-relaxed">{post.content}</p>

          {post.imageUrl && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={post.imageUrl}
                alt="动态图片"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all duration-300 ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm">{formatLikes(likes)}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm">评论</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors">
              <Share2 size={20} />
              <span className="text-sm">分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dynamic() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-center">最新动态</h1>
          <p className="text-center text-white/80 mt-2">关注乌苏苏的日常分享</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {dynamicData.map((post, index) => (
              <DynamicCard key={post.id} post={post} index={index} />
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="btn-secondary">
              加载更多
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
