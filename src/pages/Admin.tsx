import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Video, X, CheckCircle, AlertCircle, Trash2, Loader2, CloudUpload } from 'lucide-react';
import { uploadImages, uploadVideos, uploadLargeFile, getMedia, deleteMedia } from '@/services/api';
import { useMediaStore } from '@/stores/media';
import type { MediaItem } from '@/services/api';

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

type TabType = 'images' | 'videos';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('images');
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImages, addVideos, fetchMedia } = useMediaStore();

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = activeTab === 'images' 
      ? fileArray.filter(f => f.type.startsWith('image/'))
      : fileArray.filter(f => f.type.startsWith('video/'));
    
    if (validFiles.length === 0) return;

    const tasks: UploadTask[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      file,
      progress: 0,
      status: 'pending',
    }));
    
    setUploadTasks(prev => [...prev, ...tasks]);
    
    // 开始上传
    for (const task of tasks) {
      setUploadTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'uploading' } : t));
      
      try {
        let result;
        const isLargeFile = task.file.size > 100 * 1024 * 1024; // 大于100MB用分片上传
        
        if (isLargeFile && activeTab === 'videos') {
          result = await uploadLargeFile(task.file, (percent) => {
            setUploadTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress: percent } : t));
          });
        } else {
          // 普通上传
          const simulateProgress = setInterval(() => {
            setUploadTasks(prev => prev.map(t => 
              t.id === task.id && t.progress < 90 
                ? { ...t, progress: t.progress + 10 } 
                : t
            ));
          }, 200);
          
          if (activeTab === 'images') {
            result = await uploadImages([task.file]);
          } else {
            result = await uploadVideos([task.file]);
          }
          
          clearInterval(simulateProgress);
        }
        
        if (result.success && result.items) {
          setUploadTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, status: 'success', progress: 100 } : t
          ));
          
          if (activeTab === 'images') {
            addImages(result.items);
          } else {
            addVideos(result.items);
          }
        } else {
          throw new Error(result.error || '上传失败');
        }
      } catch (error) {
        setUploadTasks(prev => prev.map(t => 
          t.id === task.id ? { ...t, status: 'error', error: (error as Error).message } : t
        ));
      }
    }
    
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [activeTab, addImages, addVideos]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const loadMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await getMedia(activeTab === 'images' ? 'image' : 'video');
      if (res.success) {
        setMediaList(res.items);
      }
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('确定要删除这个文件吗？')) return;
    const type = activeTab === 'images' ? 'image' : 'video';
    const res = await deleteMedia(type, item.id);
    if (res.success) {
      setMediaList(prev => prev.filter(i => i.id !== item.id));
      fetchMedia();
    }
  };

  const clearCompletedTasks = () => {
    setUploadTasks(prev => prev.filter(t => t.status === 'uploading' || t.status === 'pending'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CloudUpload className="w-7 h-7" />
              内容管理
            </h1>
            <p className="text-white/80 mt-1 text-sm">上传和管理图片、视频内容</p>
          </div>

          {/* Tab切换 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('images')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
                activeTab === 'images' 
                  ? 'text-green-600 border-b-2 border-green-500 bg-green-50/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              图片上传
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
                activeTab === 'videos' 
                  ? 'text-green-600 border-b-2 border-green-500 bg-green-50/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Video className="w-5 h-5" />
              视频上传
            </button>
          </div>

          <div className="p-6">
            {/* 上传区域 */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-green-500 bg-green-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={activeTab === 'images' ? 'image/*' : 'video/*'}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-700 font-medium">
                点击或拖拽{activeTab === 'images' ? '图片' : '视频'}到这里上传
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'images' 
                  ? '支持 JPG、PNG、WebP 格式，单张最大 50MB' 
                  : '支持 MP4、MOV、WebM 格式，大文件自动分片上传'
                }
              </p>
              {activeTab === 'videos' && (
                <p className="text-green-600 text-xs mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                  支持大视频文件（1GB-5GB），自动分片上传
                </p>
              )}
            </div>

            {/* 上传任务列表 */}
            {uploadTasks.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700">上传进度</h3>
                  <button
                    onClick={clearCompletedTasks}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    清除已完成
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {uploadTasks.map(task => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {task.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : task.status === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {task.file.name}
                          </p>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatFileSize(task.file.size)}
                          </span>
                        </div>
                        {task.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        )}
                        {task.status === 'error' && (
                          <p className="text-xs text-red-500">{task.error}</p>
                        )}
                        {task.status === 'success' && (
                          <p className="text-xs text-green-600">上传成功</p>
                        )}
                      </div>
                      <button
                        onClick={() => setUploadTasks(prev => prev.filter(t => t.id !== task.id))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 已上传文件列表 */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">
                  已上传{activeTab === 'images' ? '图片' : '视频'}
                </h3>
                <button
                  onClick={loadMediaList}
                  disabled={loadingMedia}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  {loadingMedia ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  刷新列表
                </button>
              </div>
              
              {mediaList.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mediaList.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden group relative">
                      <div className="aspect-square bg-gray-200">
                        {activeTab === 'images' ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Video className="w-8 h-8 text-white/60" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">
                  点击"刷新列表"查看已上传文件
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
