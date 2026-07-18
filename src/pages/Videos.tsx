import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, Video as VideoIcon, Calendar, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { videoData } from '@/data/videos';
import { useMediaStore } from '@/stores/media';

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videos: uploadedVideos, fetchMedia } = useMediaStore();

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
    return (bytes / 1024).toFixed(0) + 'KB';
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // 合并静态视频和上传的视频
  const allVideos = [
    ...uploadedVideos.map(v => ({
      id: v.id,
      title: v.name || '上传视频',
      description: `大小: ${formatSize(v.size)}`,
      url: v.url,
      thumbnail: '',
      category: 'upload',
      tags: ['上传'],
      createdAt: v.createdAt,
      duration: '--:--',
      viewCount: 0,
      platform: 'upload' as const,
      isUploaded: true,
    })),
    ...videoData.map(v => ({ ...v, isUploaded: false })),
  ];

  // 选中视频时播放
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [selectedVideo]);

  const currentVideo = allVideos.find(v => v.id === selectedVideo);

  if (selectedVideo && currentVideo) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <span className="text-sm text-white/70">视频播放</span>
          <div className="w-20"></div>
        </div>

        {/* 视频播放器 */}
        <div className="flex-1 flex items-center justify-center">
          <video
            ref={videoRef}
            className="max-w-full max-h-full"
            controls
            autoPlay
            muted={isMuted}
            onClick={handlePlayPause}
          >
            <source src={currentVideo.url} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>

        {/* 视频信息 */}
        <div className="p-4 text-white max-w-3xl mx-auto w-full">
          <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
          <p className="text-white/70 text-sm mb-3">{currentVideo.description}</p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {currentVideo.createdAt}
            </span>
            {!currentVideo.isUploaded && (
              <>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {currentVideo.viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {Math.floor(currentVideo.viewCount / 10)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* 顶部Banner */}
      <section className="relative py-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">视频作品</h1>
          <p className="text-white/90 mt-2 text-sm md:text-base">共 {allVideos.length} 个视频作品</p>
        </div>
      </section>

      {/* 视频网格 */}
      <section className="py-6">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedVideo(video.id)}
              >
                {/* 视频缩略图 */}
                <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoIcon className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  
                  {/* 播放按钮 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* 时长标签 */}
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                  
                  {/* 上传标签 */}
                  {video.isUploaded && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      新上传
                    </span>
                  )}
                </div>
                
                {/* 视频信息 */}
                <div className="p-2.5">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{video.title}</p>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-gray-400">
                    <span>{video.createdAt.slice(5)}</span>
                    {!video.isUploaded && (
                      <span>{video.platform === 'douyin' ? '抖音' : 'B站'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {allVideos.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <VideoIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无视频</h3>
              <p className="text-gray-500 mb-4">还没有上传视频内容</p>
              <Link to="/upload" className="btn-primary inline-block">
                去上传视频
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
